# Sistema de imágenes IA

## Assets maestros producidos

| Asset | Ruta | Uso |
|---|---|---|
| Hero principal | `public/images/hero-premium-food.png` | Inicio, banners de campaña |
| Almendras frontal | `public/images/almonds-front.png` | Catálogo y ficha de producto |

Ambos se generaron en modo integrado con el estilo: fotografía gastronómica editorial, lujo cálido, materiales naturales, luz de ventana, cero texto/marcas/logos y alta fidelidad fotográfica.

## Prompt base de producto

Usar este formato y cambiar sólo `[PRODUCTO]` y `[VISTA]`:

```text
Use case: product-mockup
Asset type: premium healthy food ecommerce product image
Primary request: transparent vacuum-sealed unbranded pouch filled with premium [PRODUCTO], [VISTA].
Scene/backdrop: seamless warm-white background; no props except when the requested view is lifestyle.
Style/medium: ultra-photorealistic luxury food ecommerce photography, editorial commercial quality, Sony A7R V 85mm appearance.
Composition/framing: square composition, generous clean margins, soft natural shadow, sharp product focus.
Lighting/mood: soft window light, natural colors, calm premium Scandinavian feeling.
Constraints: no logo, no text, no labels, no watermark, no brand marks.
```

Vistas requeridas para cada SKU: `front-facing upright`, `45-degree angle`, `top view`, `lifestyle serving`, `extreme macro of ingredient texture`.

## Familias de campañas

- Categorías: fondo de mármol o roble claro y composición con espacio negativo; frutos secos, semillas, harinas, especias, té y snacks.
- Combos: caja kraft abierta, productos ordenados y luz de ventana; Fitness, Desayuno y Keto.
- Suscripciones: caja mensual abierta como experiencia de unboxing.
- Operación: preparación, sellado y etiquetado con personas sin mirar a cámara.
- Estacionales: preservar luz, paleta, empaque sin marca y composición editorial; cambiar solamente los ingredientes y señales de temporada.

## Reglas no negociables

- No usar texto generado dentro de imágenes; las etiquetas se renderizan en la interfaz.
- No incluir marcas, logos, watermarks, tipografía ni fondos saturados.
- Todo asset se aprueba con fondo limpio, iluminación natural y accesibilidad visual antes de enviarse a `public/images/`.
- Para producción, convertir a AVIF/WebP y servir con `next/image` o Supabase Storage/Cloudflare Images.
