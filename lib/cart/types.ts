export type CartLine = { kind: "product" | "combo"; id: string; name: string; quantity: number; estimatedUnitPrice?: number };
export type CartState = { items: CartLine[]; couponCode?: string };
