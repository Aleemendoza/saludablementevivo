"use client";
import { useTransition } from "react";
import { retryPayment } from "@/app/checkout/actions";
export function RetryButton({ orderId }: { orderId: string }) { const [pending, start] = useTransition(); return <button className="button primary" disabled={pending} onClick={() => start(async () => { const result = await retryPayment(orderId); window.location.assign(result.initPoint); })}>{pending ? "Iniciando…" : "Reintentar pago"}</button>; }
