import { z } from "zod";

const lineSchema = z.object({ kind: z.enum(["product", "combo"]), id: z.string().min(1).max(120), quantity: z.number().int().min(1).max(99) });
export const checkoutSchema = z.object({
  items: z.array(lineSchema).min(1).max(50), couponCode: z.string().trim().max(50).optional(),
  fulfillment: z.enum(["delivery", "pickup"]), deliverySlotRuleId: z.string().uuid().optional(), scheduledFor: z.string().datetime().optional(),
  address: z.object({ label: z.string().trim().min(1).max(60), recipientName: z.string().trim().min(2).max(120), phone: z.string().trim().min(6).max(30), street: z.string().trim().min(2).max(120), number: z.string().trim().min(1).max(20), floor: z.string().trim().max(20).optional(), apartment: z.string().trim().max(20).optional(), city: z.string().trim().min(2).max(80), province: z.string().trim().min(2).max(80), postalCode: z.string().trim().min(3).max(12), latitude: z.number().finite().optional(), longitude: z.number().finite().optional(), saveAsDefault: z.boolean().default(false) }).optional(),
  idempotencyKey: z.string().uuid(),
}).superRefine((value, ctx) => {
  if (value.fulfillment === "delivery" && !value.address) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["address"], message: "La dirección es obligatoria para delivery." });
  if (value.fulfillment === "delivery" && (!value.deliverySlotRuleId || !value.scheduledFor)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["scheduledFor"], message: "Elegí una franja de entrega." });
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;
