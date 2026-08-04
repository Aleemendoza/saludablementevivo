import { describe, expect, it } from "vitest";
import { emailSchema, otpSchema } from "@/lib/validation/auth";

describe("authentication validation", () => {
  it("normalizes valid emails", () => expect(emailSchema.parse("  HOLA@EXAMPLE.COM ")).toBe("hola@example.com"));
  it("rejects invalid OTP values", () => expect(() => otpSchema.parse("12345a")).toThrow());
});
