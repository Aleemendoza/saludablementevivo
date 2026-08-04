"use server";
import { headers } from "next/headers";
import { Preference } from "mercadopago";
import { checkoutSchema, type CheckoutInput } from "@/lib/validation/checkout";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPreferencesClient } from "@/lib/mercadopago";
import { getAppEnv } from "@/lib/env";

async function rateLimit(action: string, userId: string, maximum = 5) {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const admin = createAdminClient(); const since = new Date(Date.now() - 15 * 60_000).toISOString();
  const { count, error } = await admin.from("audit_logs").select("id", { count: "exact", head: true }).eq("action", action).eq("actor_id", userId).contains("metadata", { ip }).gte("created_at", since);
  if (error || (count ?? 0) >= maximum) throw new Error("Demasiados intentos. Esperá unos minutos.");
  await admin.from("audit_logs").insert({ actor_id: userId, action, entity_type: "rate_limit", metadata: { ip } });
}

export async function createCheckoutOrder(raw: CheckoutInput) {
  const input = checkoutSchema.parse(raw); const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser(); if (!user) throw new Error("Verificá tu email para continuar.");
  await rateLimit("checkout.create", user.id, 6);
  const { data, error } = await supabase.rpc("create_checkout_order", { payload: input });
  if (error || !data?.[0]) throw new Error(error?.message ?? "No se pudo crear el pedido.");
  return data[0] as { order_id: string; payment_id: string; payment_attempt_id: string; total: number; order_number: number };
}

export async function createPaymentPreference(orderId: string) {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) throw new Error("Tu sesión venció.");
  await rateLimit("checkout.preference", user.id, 8);
  const admin = createAdminClient();
  const { data: order, error } = await admin.from("orders").select("id, order_number, total, currency, status, payments(id, payment_attempts(id))").eq("id", orderId).eq("user_id", user.id).single();
  if (error || !order || !["pending_payment", "draft"].includes(order.status)) throw new Error("El pedido no está disponible para pagar.");
  const payment = Array.isArray(order.payments) ? order.payments[0] : order.payments;
  if (!payment) throw new Error("No encontramos el pago del pedido.");
  const attempt = Array.isArray(payment.payment_attempts) ? payment.payment_attempts.at(-1) : payment.payment_attempts;
  if (!attempt) throw new Error("No encontramos el intento de pago.");
  const env = getAppEnv(); const preference = createPreferencesClient();
  const response = await preference.create({ body: { items: [{ id: order.id, title: `Pedido #${order.order_number}`, quantity: 1, unit_price: Number(order.total), currency_id: order.currency }], external_reference: order.id, back_urls: { success: `${env.NEXT_PUBLIC_APP_URL}/checkout/confirmacion/${order.id}`, pending: `${env.NEXT_PUBLIC_APP_URL}/checkout/confirmacion/${order.id}`, failure: `${env.NEXT_PUBLIC_APP_URL}/checkout/confirmacion/${order.id}` }, auto_return: "approved", metadata: { order_id: order.id } } });
  await admin.from("payment_attempts").update({ preference_id: response.id, init_point: response.init_point, response_payload: response }).eq("id", attempt.id);
  return { initPoint: response.init_point as string };
}

export async function retryPayment(orderId: string) {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) throw new Error("Tu sesión venció.");
  const admin = createAdminClient(); const { data: payment } = await admin.from("payments").select("id, orders!inner(id,user_id,status)").eq("order_id", orderId).single();
  if (!payment || (payment.orders as unknown as { user_id: string; status: string }).user_id !== user.id) throw new Error("Pedido no encontrado.");
  const { data: attempt, error } = await admin.from("payment_attempts").insert({ payment_id: payment.id, idempotency_key: crypto.randomUUID(), status: "pending" }).select("id").single();
  if (error || !attempt) throw new Error("No fue posible iniciar el reintento.");
  return createPaymentPreference(orderId);
}
