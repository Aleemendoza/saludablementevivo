import { describe, expect, it } from "vitest";
import { calculateOffer } from "@/lib/catalog/offer";

const products = [{ id: "a", name: "A", unit: "u", price: 1000, stock: 8 }, { id: "b", name: "B", unit: "u", price: 2000, stock: 3 }];
describe("calculateOffer", () => {
  it("derives stock from the limiting component and discounts server price", () => expect(calculateOffer(products, [{ productId: "a", quantity: 2 }, { productId: "b", quantity: 1 }], 10)).toMatchObject({ stock: 3, individualPrice: 4000, price: 3600, savings: 400 }));
  it("does not invent a price when a component has no price", () => expect(calculateOffer([{ ...products[0], price: null }], [{ productId: "a", quantity: 1 }]).price).toBeNull());
});
