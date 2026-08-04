import { CheckoutClient } from "./checkout-client";
import { createClient } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";
export default async function CheckoutPage() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("delivery_slot_rules").select("id, starts_at, ends_at, zone_id, delivery_zones(name, estimated_minutes)").eq("is_active", true);
    if (error) console.error("Unable to load checkout delivery slots", error);
    return <CheckoutClient slots={(data ?? []) as never[]} configurationReady={!error} />;
  } catch (error) {
    console.error("Checkout configuration is unavailable", error);
    return <CheckoutClient slots={[]} configurationReady={false} />;
  }
}
