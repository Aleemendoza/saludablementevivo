import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { getEmailEnv, getMercadoPagoEnv } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPaymentsClient } from "@/lib/mercadopago";
import { Resend } from "resend";

export const runtime = "nodejs";

function isValidSignature(request: NextRequest, paymentId: string | undefined) {
  const { MERCADOPAGO_WEBHOOK_SECRET } = getMercadoPagoEnv();
  const signature = request.headers.get("x-signature");
  const requestId = request.headers.get("x-request-id");
  if (!signature || !requestId || !paymentId) return false;
  const parts = Object.fromEntries(signature.split(",").map((part) => part.trim().split("=", 2)));
  const manifest = `id:${paymentId};request-id:${requestId};ts:${parts.ts};`;
  const expected = createHmac("sha256", MERCADOPAGO_WEBHOOK_SECRET).update(manifest).digest("hex");
  const actual = parts.v1;
  return Boolean(actual && actual.length === expected.length && timingSafeEqual(Buffer.from(actual), Buffer.from(expected)));
}

export async function POST(request: NextRequest) {
  const body = await request.text(); let event: { data?: { id?: string }; type?: string };
  try { event = JSON.parse(body) as { data?: { id?: string }; type?: string }; } catch { return NextResponse.json({ error: "Invalid payload" }, { status: 400 }); }
  if (!isValidSignature(request, event.data?.id)) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  if (event.type !== "payment" || !event.data?.id) return NextResponse.json({ received: true });
  const providerPayment = await createPaymentsClient().get({ id: event.data.id });
  const statusMap: Record<string, "pending" | "approved" | "rejected" | "cancelled" | "refunded" | "failed"> = { approved: "approved", rejected: "rejected", cancelled: "cancelled", refunded: "refunded", charged_back: "refunded", in_process: "pending", pending: "pending" };
  const status = statusMap[providerPayment.status ?? ""] ?? "failed"; const admin = createAdminClient();
  const { data: payment } = await admin.from("payments").select("id, order_id, status").eq("order_id", providerPayment.external_reference ?? "").single();
  if (!payment) return NextResponse.json({ received: true });
  await admin.from("payments").update({ provider_payment_id: String(providerPayment.id) }).eq("id", payment.id);
  const { data: orderId, error } = await admin.rpc("reconcile_mercadopago_payment", { p_provider_payment_id: String(providerPayment.id), p_status: status, p_raw: providerPayment });
  if (error) return NextResponse.json({ error: "Reconciliation failed" }, { status: 500 });
  await admin.from("audit_logs").insert({ action: "mercadopago.webhook", entity_type: event.type, entity_id: orderId, metadata: { event, providerStatus: providerPayment.status } });
  if (status === "approved" && payment.status !== "approved") {
    const { data: order } = await admin.from("orders").select("order_number, profiles!orders_user_id_fkey(email)").eq("id", orderId).single();
    const email = (order?.profiles as unknown as { email?: string } | null)?.email;
    if (email && order) { const env = getEmailEnv(); const sent = await new Resend(env.RESEND_API_KEY).emails.send({ from: env.EMAIL_FROM, to: email, subject: `Confirmamos tu pedido #${order.order_number}`, html: `<p>Recibimos tu pago. Ya estamos preparando tu pedido <strong>#${order.order_number}</strong>.</p>` }); await admin.from("email_logs").insert({ recipient: email, template: "order_confirmed", provider_id: sent.data?.id, status: sent.error ? "failed" : "sent", metadata: { orderId } }); }
  }
  return NextResponse.json({ received: true });
}
