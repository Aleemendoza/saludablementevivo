# Arquitectura de Saludablemente Vivo

## Principios

La aplicación usa Next.js 15 con App Router. Las páginas de catálogo se resuelven con React Server Components e ISR; las mutaciones pasan por Server Actions o rutas webhooks. El navegador no recibe credenciales privilegiadas ni precios confiables para el checkout.

```text
Browser / PWA
   │ HTTPS
Next.js (Vercel / Edge middleware)
   ├── RSC + ISR: catálogo, SEO, búsqueda
   ├── Server Actions: OTP, carrito, checkout, perfil
   ├── Node routes: Mercado Pago webhooks
   └── Supabase: Auth, PostgreSQL RLS, Storage
             ├── Resend: emails transaccionales
             └── Mercado Pago: Checkout Pro / Point futuro
```

## Capas

- `app/`: rutas y composición UI; Server Components por defecto.
- `lib/`: adaptadores de proveedores y validación de entorno. No contiene UI.
- `supabase/migrations/`: fuente de verdad de PostgreSQL, RLS y auditoría.
- `supabase/seed.sql`: datos no sensibles para desarrollo local.
- `middleware.ts`: cabeceras defensivas ejecutadas antes de las rutas.

## Identidad y permisos

No hay contraseñas. Supabase Auth emite y valida el OTP por email. `requestOtp` registra cada solicitud por email + IP, admite como máximo cinco solicitudes en 15 minutos y el proveedor expira el código a los 10 minutos. `verifyOtp` crea el perfil idempotentemente.

RLS es la capa de autorización de datos: una persona sólo lee y modifica sus direcciones, listas, favoritos, suscripciones y notificaciones. Los pedidos y pagos son de lectura para su dueño. La función `is_staff()` asigna los permisos de backoffice por rol (`admin`, `employee`, `preparer`, `driver`). Toda operación administrativa debe utilizar una Server Action autenticada y un registro en `audit_logs`.

## Checkout y pagos

El checkout debe recibir sólo IDs y cantidades. En el servidor se recalculan stock, precio, cupón, zona y total dentro de una transacción/RPC antes de crear la preferencia de Mercado Pago. La URL de retorno no confirma una compra: únicamente el webhook autenticado concilia `payments` y avanza el estado de `orders`. Cada llamada de pago conserva un `idempotency_key` en `payment_attempts`.

Mercado Pago Point queda aislado como proveedor futuro: debe crear un `payment_attempt` adicional, nunca cambiar los totales del pedido.

## Datos y operaciones

La migración entrega entidades de identidad, catálogo, inventario, fulfillment, precios, órdenes, pagos, suscripciones, CRM, marketing y auditoría. Usa UUID, claves foráneas, timestamps, soft delete donde corresponde e índices en consultas de catálogo, búsqueda, pedidos, stock, cobros y rate limiting.

Para múltiples depósitos se agrega una tabla `warehouses` y se reemplaza `inventory.warehouse_code` por `warehouse_id`; el contrato de `inventory_movements` ya soporta esa extensión. Monedas, listas de precio y transportistas se incorporan como tablas de referencia, sin alterar el historial de pedidos, que conserva moneda y snapshots.

## Seguridad

- Validación de entrada con Zod en cada Server Action y route handler.
- RLS para todas las tablas expuestas.
- CSP, anti-clickjacking, MIME sniffing y política de permisos en middleware.
- Claves de servicio, Resend y Mercado Pago sólo en variables de servidor.
- Webhook autenticado, registros de auditoría e idempotencia.
- Las acciones con side effects deben comprobar sesión/rol y aplicar protección CSRF de origen antes de mutar.

## Rendimiento y SEO

Productos, categorías, combos y kits usan metadata dinámica, JSON-LD, canonical e ISR. `sitemap.ts`, `robots.ts` y `manifest.ts` cubren los artefactos globales. Las imágenes finales deben almacenarse en Supabase Storage o Cloudflare Images y servirse con `next/image`; las URL externas del prototipo no deben llegar a producción.

## Comandos

```powershell
npm install
npm run dev
npm run typecheck
npm run build
```

Para base local: `supabase start`, `supabase db reset`, y `supabase db push` para entornos remotos. Copiá `.env.example` a `.env.local` y completá los valores antes de usar rutas autenticadas o de pago.
