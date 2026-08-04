-- Checkout is intentionally priced and reserved inside PostgreSQL; clients submit identifiers only.
create table public.delivery_slot_rules (
  id uuid primary key default gen_random_uuid(), zone_id uuid not null references public.delivery_zones(id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6), starts_at time not null, ends_at time not null,
  capacity integer not null check (capacity > 0), minimum_notice_minutes integer not null default 120 check (minimum_notice_minutes >= 0),
  is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), check (ends_at > starts_at)
);
alter table public.orders add column reservation_expires_at timestamptz, add column scheduled_until timestamptz, add column delivery_slot_rule_id uuid references public.delivery_slot_rules(id), add column checkout_idempotency_key uuid unique;
alter table public.payment_attempts add column preference_id text unique, add column init_point text;
create index delivery_slot_rules_active_idx on public.delivery_slot_rules(zone_id, weekday) where is_active;
create index orders_slot_capacity_idx on public.orders(delivery_slot_rule_id, scheduled_for) where status in ('pending_payment','paid','preparing','ready','shipped');
alter table public.delivery_slot_rules enable row level security;
create policy "slot_rules_public_read" on public.delivery_slot_rules for select using (is_active or public.is_staff());
create policy "slot_rules_staff_write" on public.delivery_slot_rules for all using (public.is_staff()) with check (public.is_staff());
create trigger set_delivery_slot_rules_updated_at before update on public.delivery_slot_rules for each row execute procedure public.set_updated_at();

create or replace function public.release_expired_checkout_reservations() returns integer language plpgsql security definer set search_path = public as $$
declare ord record; item record; released integer := 0;
begin
  for ord in select id from public.orders where status='pending_payment' and reservation_expires_at <= now() for update skip locked loop
    for item in select oi.product_id,oi.quantity,i.id inventory_id from public.order_items oi join public.inventory i on i.product_id=oi.product_id where oi.order_id=ord.id loop
      update public.inventory set reserved_quantity=greatest(0,reserved_quantity-item.quantity) where id=item.inventory_id;
      insert into public.inventory_movements(inventory_id,order_id,movement_type,quantity,reason) values(item.inventory_id,ord.id,'release',-item.quantity,'reservation expired');
    end loop;
    update public.orders set status='cancelled', reservation_expires_at=null where id=ord.id; released := released + 1;
  end loop; return released;
end $$;

create or replace function public.create_checkout_order(payload jsonb) returns table(order_id uuid, payment_id uuid, payment_attempt_id uuid, total numeric, order_number bigint)
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); item jsonb; product_row record; combo_row record; zone uuid; rule record; addr uuid; ord uuid; pay uuid; attempt uuid; ord_number bigint; coupon_id uuid; subtotal_value numeric := 0; discount_value numeric := 0; shipping_value numeric := 0; final_total numeric; expires_at timestamptz := now() + interval '30 minutes'; fulfillment_value public.fulfillment_type; scheduled_value timestamptz; coupon_value citext; required_stock jsonb := '{}'::jsonb;
begin
  if uid is null then raise exception 'AUTH_REQUIRED'; end if;
  perform public.release_expired_checkout_reservations();
  select o.id,p.id,pa.id,o.total,o.order_number into ord,pay,attempt,final_total,ord_number from public.orders o join public.payments p on p.order_id=o.id join public.payment_attempts pa on pa.payment_id=p.id where o.user_id=uid and o.checkout_idempotency_key=(payload->>'idempotencyKey')::uuid limit 1;
  if found then return query select ord,pay,attempt,final_total,ord_number; return; end if;
  if jsonb_array_length(coalesce(payload->'items','[]')) = 0 then raise exception 'EMPTY_CART'; end if;
  fulfillment_value := (payload->>'fulfillment')::public.fulfillment_type;
  if fulfillment_value = 'delivery' then
    if payload->'address' is null or payload->>'scheduledFor' is null or payload->>'deliverySlotRuleId' is null then raise exception 'DELIVERY_DATA_REQUIRED'; end if;
    scheduled_value := (payload->>'scheduledFor')::timestamptz;
    insert into public.addresses(user_id,label,recipient_name,phone,street,number,floor,apartment,city,province,postal_code,latitude,longitude,is_default)
    values(uid,payload->'address'->>'label',payload->'address'->>'recipientName',payload->'address'->>'phone',payload->'address'->>'street',payload->'address'->>'number',nullif(payload->'address'->>'floor',''),nullif(payload->'address'->>'apartment',''),payload->'address'->>'city',payload->'address'->>'province',payload->'address'->>'postalCode',nullif(payload->'address'->>'latitude','')::numeric,nullif(payload->'address'->>'longitude','')::numeric,coalesce((payload->'address'->>'saveAsDefault')::boolean,false)) returning id into addr;
    select r.*, z.id as selected_zone into rule from public.delivery_slot_rules r join public.delivery_zones z on z.id=r.zone_id and z.is_active where r.id=(payload->>'deliverySlotRuleId')::uuid and r.is_active for update;
    if not found then raise exception 'INVALID_SLOT'; end if; zone := rule.selected_zone;
    if scheduled_value <= now() + make_interval(mins => rule.minimum_notice_minutes) or extract(dow from scheduled_value at time zone 'America/Argentina/Jujuy')::int <> rule.weekday or (scheduled_value at time zone 'America/Argentina/Jujuy')::time <> rule.starts_at then raise exception 'INVALID_SLOT'; end if;
    if (select count(*) from public.orders where delivery_slot_rule_id=rule.id and scheduled_for=scheduled_value and status in ('pending_payment','paid','preparing','ready','shipped') and (reservation_expires_at is null or reservation_expires_at > now())) >= rule.capacity then raise exception 'SLOT_FULL'; end if;
    select fee into shipping_value from public.shipping_rules where zone_id=zone and fulfillment='delivery' and is_active order by minimum_order desc limit 1;
    shipping_value := coalesce(shipping_value,0);
  end if;
  for item in select * from jsonb_array_elements(payload->'items') loop
    if item->>'kind' = 'product' then
      select id,name,sku,coalesce(sale_price,price) as price into product_row from public.products where (id::text=item->>'id' or slug=item->>'id') and status='active' and deleted_at is null for update;
      if not found then raise exception 'INVALID_PRODUCT'; end if;
      required_stock := required_stock || jsonb_build_object(product_row.id::text, coalesce((required_stock->>product_row.id::text)::int,0) + (item->>'quantity')::int);
      subtotal_value := subtotal_value + product_row.price * (item->>'quantity')::int;
    elsif item->>'kind' = 'combo' then
      select id,discount_percent into combo_row from public.combos where (id::text=item->>'id' or slug=item->>'id') and is_active and deleted_at is null for update;
      if not found then raise exception 'INVALID_COMBO'; end if;
      for product_row in select p.id,p.name,p.sku,coalesce(p.sale_price,p.price) as price, ci.quantity from public.combo_items ci join public.products p on p.id=ci.product_id where ci.combo_id=combo_row.id and p.status='active' and p.deleted_at is null loop
        required_stock := required_stock || jsonb_build_object(product_row.id::text, coalesce((required_stock->>product_row.id::text)::int,0) + product_row.quantity * (item->>'quantity')::int);
        subtotal_value := subtotal_value + product_row.price * product_row.quantity * (item->>'quantity')::int;
        discount_value := discount_value + product_row.price * product_row.quantity * (item->>'quantity')::int * combo_row.discount_percent / 100;
      end loop;
    else raise exception 'INVALID_LINE'; end if;
  end loop;
  for product_row in select key::uuid as id, value::int as quantity from jsonb_each_text(required_stock) loop
    perform 1 from public.inventory where product_id=product_row.id and quantity-reserved_quantity >= product_row.quantity for update;
    if not found then raise exception 'INSUFFICIENT_STOCK'; end if;
  end loop;
  coupon_value := nullif(upper(payload->>'couponCode'),'');
  if coupon_value is not null then select id,discount_type,discount_value,minimum_order into product_row from public.coupons where code=coupon_value and is_active and deleted_at is null and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at > now()) and (max_redemptions is null or redemption_count < max_redemptions) for update; if not found or subtotal_value < product_row.minimum_order then raise exception 'INVALID_COUPON'; end if; coupon_id := product_row.id; discount_value := discount_value + case when product_row.discount_type='percent' then subtotal_value*product_row.discount_value/100 else product_row.discount_value end; end if;
  final_total := greatest(0, subtotal_value-discount_value+shipping_value);
  insert into public.orders(user_id,address_id,coupon_id,checkout_idempotency_key,status,fulfillment,delivery_zone_id,delivery_slot_rule_id,scheduled_for,scheduled_until,reservation_expires_at,subtotal,discount_total,shipping_total,total) values(uid,addr,coupon_id,(payload->>'idempotencyKey')::uuid,'pending_payment',fulfillment_value,zone,case when fulfillment_value='delivery' then rule.id end,scheduled_value,case when fulfillment_value='delivery' then scheduled_value + (rule.ends_at-rule.starts_at) end,expires_at,subtotal_value,discount_value,shipping_value,final_total) returning id, order_number into ord, ord_number;
  for product_row in select p.id,p.name,p.sku,coalesce(p.sale_price,p.price) as price, (required_stock->>p.id::text)::int as quantity from public.products p where required_stock ? p.id::text loop
    insert into public.order_items(order_id,product_id,name_snapshot,sku_snapshot,unit_price,quantity) values(ord,product_row.id,product_row.name,product_row.sku,product_row.price,product_row.quantity);
    update public.inventory set reserved_quantity=reserved_quantity+product_row.quantity where product_id=product_row.id;
    insert into public.inventory_movements(inventory_id,order_id,movement_type,quantity,reason,actor_id) select id,ord,'reserve',product_row.quantity,'checkout reservation',uid from public.inventory where product_id=product_row.id;
  end loop;
  insert into public.payments(order_id,amount,status) values(ord,final_total,'pending') returning id into pay;
  insert into public.payment_attempts(payment_id,idempotency_key,status,request_payload) values(pay,(payload->>'idempotencyKey')::uuid,'pending',payload) returning id into attempt;
  return query select ord,pay,attempt,final_total,ord_number;
end $$;

create or replace function public.reconcile_mercadopago_payment(p_provider_payment_id text, p_status public.payment_status, p_raw jsonb) returns uuid language plpgsql security definer set search_path = public as $$
declare pay public.payments%rowtype; item record; new_order_status public.order_status;
begin select p.* into pay from public.payments p where p.provider_payment_id=p_provider_payment_id for update; if not found then raise exception 'PAYMENT_NOT_FOUND'; end if;
  update public.payments set status=p_status, raw_response=p_raw, paid_at=case when p_status='approved' then coalesce(paid_at,now()) else paid_at end where id=pay.id;
  if p_status='approved' then new_order_status := 'paid'; else new_order_status := case when p_status='refunded' then 'refunded' when p_status='cancelled' then 'cancelled' else 'pending_payment' end; end if;
  update public.orders set status=new_order_status, reservation_expires_at=case when p_status='approved' then null else reservation_expires_at end where id=pay.order_id;
  if p_status in ('rejected','cancelled','refunded','failed') and pay.status not in ('rejected','cancelled','refunded','failed') then for item in select oi.product_id,oi.quantity,i.id inventory_id from public.order_items oi join public.inventory i on i.product_id=oi.product_id where oi.order_id=pay.order_id loop update public.inventory set reserved_quantity=greatest(0,reserved_quantity-item.quantity) where id=item.inventory_id; insert into public.inventory_movements(inventory_id,order_id,movement_type,quantity,reason) values(item.inventory_id,pay.order_id,'release',-item.quantity,'payment not approved'); end loop; end if;
  return pay.order_id;
end $$;
revoke all on function public.create_checkout_order(jsonb) from public; grant execute on function public.create_checkout_order(jsonb) to authenticated;
