"use client";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartLine, CartState } from "@/lib/cart/types";
const KEY = "sv.cart.v1";
type CartContextValue = CartState & { hydrated: boolean; add(line: Omit<CartLine, "quantity">): void; setQuantity(kind: CartLine["kind"], id: string, quantity: number): void; remove(kind: CartLine["kind"], id: string): void; setCoupon(code?: string): void; clear(): void };
const CartContext = createContext<CartContextValue | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>({ items: [] }); const [hydrated, setHydrated] = useState(false);
  useEffect(() => { try { const saved = localStorage.getItem(KEY); if (saved) setState(JSON.parse(saved) as CartState); } catch { localStorage.removeItem(KEY); } finally { setHydrated(true); } }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(KEY, JSON.stringify(state)); }, [state, hydrated]);
  const value = useMemo<CartContextValue>(() => ({ ...state, hydrated,
    add: (line) => setState((current) => ({ ...current, items: current.items.some((x) => x.kind === line.kind && x.id === line.id) ? current.items.map((x) => x.kind === line.kind && x.id === line.id ? { ...x, quantity: x.quantity + 1 } : x) : [...current.items, { ...line, quantity: 1 }] })),
    setQuantity: (kind, id, quantity) => setState((current) => ({ ...current, items: quantity < 1 ? current.items.filter((x) => x.kind !== kind || x.id !== id) : current.items.map((x) => x.kind === kind && x.id === id ? { ...x, quantity } : x) })),
    remove: (kind, id) => setState((current) => ({ ...current, items: current.items.filter((x) => x.kind !== kind || x.id !== id) })), setCoupon: (couponCode) => setState((current) => ({ ...current, couponCode: couponCode?.trim().toUpperCase() || undefined })), clear: () => setState({ items: [] }),
  }), [state, hydrated]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() { const context = useContext(CartContext); if (!context) throw new Error("useCart debe utilizarse dentro de CartProvider"); return context; }
