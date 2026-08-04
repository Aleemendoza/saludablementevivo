-- Development-only catalog seed. Never use real customer data in this file.
insert into public.categories(name,slug,description,sort_order) values
  ('Frutos secos','frutos-secos','Selección de frutos secos.',1),
  ('Semillas','semillas','Semillas para todos los días.',2)
on conflict(slug) do nothing;

insert into public.brands(name,slug) values ('Saludablemente Vivo','saludablemente-vivo') on conflict(slug) do nothing;

insert into public.products(brand_id,category_id,name,slug,sku,short_description,weight_grams,price,stock,status)
select b.id,c.id,'Almendras naturales','almendras-naturales-250g','SV-ALM-250','Almendras seleccionadas y envasadas al vacío.',250,6490,100,'active'
from public.brands b join public.categories c on c.slug='frutos-secos' where b.slug='saludablemente-vivo'
on conflict(slug) do nothing;
