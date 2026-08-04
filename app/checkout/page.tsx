import { CheckoutClient } from "./checkout-client";
import { createClient } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";
export default async function CheckoutPage() { const supabase = await createClient(); const { data } = await supabase.from("delivery_slot_rules").select("id, starts_at, ends_at, zone_id, delivery_zones(name, estimated_minutes)").eq("is_active", true); return <CheckoutClient slots={(data ?? []) as never[]} />; }
