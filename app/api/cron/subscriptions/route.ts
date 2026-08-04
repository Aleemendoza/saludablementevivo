import { timingSafeEqual } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { getServerEnv } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const maxDuration = 30;

function isAuthorized(request: NextRequest) {
  const { CRON_SECRET } = getServerEnv();
  const token = request.headers.get("authorization")?.replace("Bearer ", "") ?? "";
  return token.length === CRON_SECRET.length && timingSafeEqual(Buffer.from(token), Buffer.from(CRON_SECRET));
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabaseAdmin = createAdminClient();
  const now = new Date().toISOString();
  const { data: dueSubscriptions, error } = await supabaseAdmin
    .from("subscriptions")
    .select("id, user_id, next_charge_at, provider_preapproval_id")
    .eq("status", "active")
    .lte("next_charge_at", now)
    .limit(100);
  if (error) return NextResponse.json({ error: "Subscription query failed" }, { status: 500 });

  await supabaseAdmin.from("audit_logs").insert({ action: "subscriptions.reconciliation", entity_type: "subscription_cron", metadata: { dueCount: dueSubscriptions.length } });
  // Mercado Pago Preapproval reconciliation is intentionally processed by an idempotent worker in batches.
  // This endpoint discovers due subscriptions and provides the protected scheduled entry point.
  return NextResponse.json({ processed: dueSubscriptions.length });
}
