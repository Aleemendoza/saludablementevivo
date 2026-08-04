import { z } from "zod";

const appEnvSchema = z.object({ NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000") });
const supabasePublicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});
const supabaseAdminEnvSchema = supabasePublicEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});
const mercadoPagoEnvSchema = z.object({
  MERCADOPAGO_ACCESS_TOKEN: z.string().min(1),
  MERCADOPAGO_WEBHOOK_SECRET: z.string().min(1),
});
const emailEnvSchema = z.object({
  RESEND_API_KEY: z.string().min(1),
  EMAIL_FROM: z.string().min(1),
});
const cronEnvSchema = z.object({
  CRON_SECRET: z.string().min(16),
});

export function getAppEnv() { return appEnvSchema.parse({ NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL }); }
export function getSupabasePublicEnv() { return supabasePublicEnvSchema.parse({ NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY }); }
export function getSupabaseAdminEnv() { return supabaseAdminEnvSchema.parse({ NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY }); }
export function getMercadoPagoEnv() { return mercadoPagoEnvSchema.parse({ MERCADOPAGO_ACCESS_TOKEN: process.env.MERCADOPAGO_ACCESS_TOKEN, MERCADOPAGO_WEBHOOK_SECRET: process.env.MERCADOPAGO_WEBHOOK_SECRET }); }
export function getEmailEnv() { return emailEnvSchema.parse({ RESEND_API_KEY: process.env.RESEND_API_KEY, EMAIL_FROM: process.env.EMAIL_FROM }); }
export function getCronEnv() { return cronEnvSchema.parse({ CRON_SECRET: process.env.CRON_SECRET }); }

/**
 * Validates server secrets only when an integration is actually invoked.
 * This lets Vercel compile static routes without leaking or requiring runtime
 * credentials during the build step.
 */
