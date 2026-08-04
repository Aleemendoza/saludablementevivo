import { describe, expect, it } from "vitest";
import { checkoutSchema } from "./checkout";

const base = { items: [{ kind: "product", id: "almendras", quantity: 1 }], fulfillment: "pickup", idempotencyKey: "3fa85f64-5717-4562-b3fc-2c963f66afa6" } as const;
describe("checkoutSchema", () => {
  it("allows a pickup without address", () => expect(checkoutSchema.parse(base).fulfillment).toBe("pickup"));
  it("requires address and slot for delivery", () => expect(() => checkoutSchema.parse({ ...base, fulfillment: "delivery" })).toThrow());
});
