"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function ConfirmationRefresh() { const router = useRouter(); useEffect(() => { const timer = window.setInterval(() => router.refresh(), 5000); return () => window.clearInterval(timer); }, [router]); return <p role="status">Actualizaremos este estado automáticamente.</p>; }
