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

## Despliegue en Vercel

1. Importá el repositorio de GitHub en Vercel; el proyecto detecta Next.js automáticamente.
2. En **Settings → Environment Variables**, cargá todas las claves de `.env.example` para Production, Preview y Development según corresponda. `NEXT_PUBLIC_APP_URL` debe ser la URL final `https://…vercel.app` o el dominio propio.
3. En Supabase, agregá la URL de Vercel a **Authentication → URL Configuration** y configurá la URL de retorno del OTP.
4. En Mercado Pago, configurá el webhook de producción en `https://TU-DOMINIO/api/webhooks/mercadopago` y registrá la misma URL en `NEXT_PUBLIC_APP_URL`.
5. Desplegá la rama `main`. `vercel.json` usa `npm ci`, ejecuta el build de Next y programa la conciliación diaria de suscripciones a las 12:00 UTC. Definí `CRON_SECRET` con un valor aleatorio de al menos 16 caracteres.
