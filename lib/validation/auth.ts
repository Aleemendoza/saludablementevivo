import { z } from "zod";

export const emailSchema = z.string().trim().email().max(254).transform((value) => value.toLowerCase());
export const otpSchema = z.string().regex(/^\d{6}$/, "El código debe tener seis dígitos.");
