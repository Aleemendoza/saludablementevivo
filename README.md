# Saludablemente Vivo

Plataforma de alimentos saludables construida con Next.js 15, TypeScript estricto, Supabase y Mercado Pago.

## Inicio

```powershell
npm install
npm run dev
npm run test
npm run typecheck
```

Abrí `http://localhost:3000`.

Para comprobar la compilación de producción:

```powershell
npm run build
```

Requiere Node.js 20.9 o superior (incluye npm). No usa pnpm.

## Arquitectura

La arquitectura de producción, modelo de seguridad, flujo OTP, pagos, operación y escalabilidad se documentan en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). La migración de Supabase está en `supabase/migrations/` y los secretos requeridos están enumerados en `.env.example`.
