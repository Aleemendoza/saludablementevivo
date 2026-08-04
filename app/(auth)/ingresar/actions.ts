"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { emailSchema, otpSchema } from "@/lib/validation/auth";

const MAX_ATTEMPTS = 5;

export async function requestOtp(rawEmail: string) {
  const supabaseAdmin = createAdminClient();
  const email = emailSchema.parse(rawEmail);
  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { count, error: rateError } = await supabaseAdmin.from("otp_requests").select("id", { count: "exact", head: true }).eq("email", email).eq("ip_address", ip).gte("created_at", new Date(Date.now() - 15 * 60_000).toISOString());
  if (rateError) throw new Error("No fue posible validar la solicitud.");
  if ((count ?? 0) >= MAX_ATTEMPTS) throw new Error("Demasiados intentos. Esperá 15 minutos para volver a solicitar un código.");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
  if (error) throw new Error("No pudimos enviar el código. Intentá nuevamente en unos minutos.");
  await supabaseAdmin.from("otp_requests").insert({ email, ip_address: ip, expires_at: new Date(Date.now() + 10 * 60_000).toISOString() });
  return { ok: true };
}

export async function verifyOtp(rawEmail: string, rawToken: string) {
  const supabaseAdmin = createAdminClient();
  const email = emailSchema.parse(rawEmail);
  const token = otpSchema.parse(rawToken);
  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
  if (error || !data.user) throw new Error("El código no es válido o venció. Solicitá uno nuevo.");
  await supabaseAdmin.from("profiles").upsert({ id: data.user.id, email }, { onConflict: "id", ignoreDuplicates: true });
  return { ok: true };
}
