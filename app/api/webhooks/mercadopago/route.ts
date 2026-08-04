import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function isValidSignature(request: NextRequest, paymentId: string | undefined) {
  const signature = request.headers.get("x-signature");
  const requestId = request.headers.get("x-request-id");
  if (!signature || !requestId || !paymentId) return false;
  const parts = Object.fromEntries(signature.split(",").map((part) => part.trim().split("=", 2)));
  const manifest = `id:${paymentId};request-id:${requestId};ts:${parts.ts};`;
  const expected = createHmac("sha256", env.MERCADOPAGO_WEBHOOK_SECRET).update(manifest).digest("hex");
  const actual = parts.v1;
  return Boolean(actual && actual.length === expected.length && timingSafeEqual(Buffer.from(actual), Buffer.from(expected)));
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const event = JSON.parse(body) as { data?: { id?: string }; type?: string };
  if (!isValidSignature(request, event.data?.id)) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  await supabaseAdmin.from("audit_logs").insert({ action: "mercadopago.webhook", entity_type: event.type ?? "unknown", metadata: event });
  // Fetch the payment from Mercado Pago here, reconcile its authoritative status, then update payments/orders atomically via RPC.
  return NextResponse.json({ received: true });
}
