"use client";

import { useMemo, useState } from "react";

const categories = [
  ["Frutos secos", "Almendras, nueces y más", "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=900&q=85"],
  ["Semillas", "Pequeñas, potentes, esenciales", "https://images.unsplash.com/photo-1515543904379-3d757afe72e3?auto=format&fit=crop&w=900&q=85"],
  ["Harinas", "Para crear a tu manera", "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=900&q=85"],
  ["Snacks", "Pausa rica, energía real", "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=900&q=85"],
];

const products = [
  { name: "Almendras naturales", weight: "250 g", price: 6490, image: "https://images.unsplash.com/photo-1508061253366-41dbdb62519e?auto=format&fit=crop&w=900&q=85", tag: "Más elegido" },
  { name: "Mix energía", weight: "300 g", price: 7890, image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=900&q=85", tag: "Nuevo" },
  { name: "Chía orgánica", weight: "200 g", price: 4250, image: "https://images.unsplash.com/photo-1515543904379-3d757afe72e3?auto=format&fit=crop&w=900&q=85", tag: "Origen trazable" },
  { name: "Granola de la casa", weight: "350 g", price: 5980, image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=900&q=85", tag: "Sin azúcar refinada" },
];

const formatPrice = (price: number) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(price);

export default function Home() {
  const [cart, setCart] = useState<string[]>([]);
  const cartLabel = useMemo(() => cart.length ? `${cart.length} producto${cart.length > 1 ? "s" : ""}` : "Carrito", [cart]);
  const add = (name: string) => setCart((items) => [...items, name]);

  return <main>
    <a className="skip" href="#contenido">Saltar al contenido</a>
    <div className="topbar">Envío sin cargo en compras superiores a $45.000 <span>•</span> Retiro disponible en CABA</div>
    <header className="header">
      <a className="brand" href="#inicio" aria-label="Saludablemente Vivo, inicio"><span>SV</span> saludablemente<br />vivo</a>
      <nav aria-label="Navegación principal"><a href="#productos">Tienda</a><a href="#combos">Combos</a><a href="#suscripciones">Suscripciones</a><a href="#nosotros">Nosotros</a></nav>
      <div className="actions"><button className="icon-button" aria-label="Buscar">⌕</button><button className="cart" aria-label={`Abrir ${cartLabel}`}>Bolsa <b>{cart.length}</b></button></div>
    </header>

    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="hero-copy"><p className="eyebrow">NUTRICIÓN, SIN COMPLICACIONES</p><h1 id="hero-title">Comé mejor.<br /><em>Nosotros hacemos<br />el resto.</em></h1><p className="lead">Productos naturales seleccionados, envasados al vacío y entregados directamente en tu puerta.</p><div className="hero-actions"><a className="button primary" href="#productos">Comprar ahora <span>→</span></a><a className="button secondary" href="#combos">Ver combos</a></div></div>
      <div className="hero-image" role="img" aria-label="Selección de alimentos naturales en mesa de madera"><div className="hero-photo" /></div>
      <div className="hero-note"><span className="seal">✦</span><div><strong>Selección consciente</strong><br /><small>Cada producto, elegido por calidad.</small></div></div>
    </section>

    <section className="assurances" aria-label="Beneficios de comprar con nosotros">
      {[['↗','Entrega rápida','A todo CABA y GBA'],['✦','Sellado al vacío','Frescura que se nota'],['✓','Calidad garantizada','Seleccionamos lo mejor'],['⌂','Retiro disponible','Cuando te quede cómodo']].map(([icon,title,text]) => <div className="assurance" key={title}><i>{icon}</i><div><strong>{title}</strong><span>{text}</span></div></div>)}
    </section>

    <section className="section categories" id="contenido"><div className="section-heading"><div><p className="eyebrow">EXPLORÁ</p><h2>Lo bueno empieza<br />por elegir bien.</h2></div><a href="#productos" className="text-link">Ver todas las categorías <span>→</span></a></div><div className="category-grid">{categories.map(([name,desc,image]) => <a className="category" href="#productos" key={name}><img src={image} alt="" /><div><h3>{name}</h3><p>{desc}</p><span>Explorar <b>→</b></span></div></a>)}</div></section>

    <section className="section products" id="productos"><div className="section-heading"><div><p className="eyebrow">NUESTROS FAVORITOS</p><h2>Elegidos para vos.</h2></div><p className="section-text">Ingredientes simples. Calidad visible.<br />Sabor que acompaña todos los días.</p></div><div className="product-grid">{products.map((product) => <article className="product" key={product.name}><div className="product-image"><img src={product.image} alt={product.name} /><span>{product.tag}</span><button aria-label={`Agregar ${product.name} a favoritos`}>♡</button></div><div className="product-info"><div><h3>{product.name}</h3><p>{product.weight} · Envasado al vacío</p></div><strong>{formatPrice(product.price)}</strong></div><button className="add" onClick={() => add(product.name)}>Agregar <span>+</span></button></article>)}</div></section>

    <section className="combo-section" id="combos"><div className="combo-visual"><img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1300&q=85" alt="Productos saludables seleccionados" /><div className="combo-sticker">Hasta<br /><b>15%</b><br />menos</div></div><div className="combo-copy"><p className="eyebrow">CAJAS QUE RESUELVEN</p><h2>Todo lo que necesitás,<br /><em>en una sola caja.</em></h2><p>Combinamos nuestros productos favoritos para cada momento de tu rutina. Menos decisiones, más bienestar.</p><ul><li>Selección curada por nutricionistas</li><li>Mejor precio que por separado</li><li>Listo para regalar (o regalarte)</li></ul><a className="button primary" href="#productos">Conocé los combos <span>→</span></a></div></section>

    <section className="subscription" id="suscripciones"><div><p className="eyebrow">A TU RITMO</p><h2>Tu despensa,<br />siempre completa.</h2><p>Recibí tus favoritos de forma periódica. Elegís la frecuencia, cambiás cuando querés y ahorrás en cada envío.</p><a className="button light" href="#suscripciones">Ver suscripciones <span>→</span></a></div><div className="subscription-card"><span className="mini-label">PLAN FITNESS</span><h3>Movete con energía.</h3><p>Una selección mensual pensada para acompañar tus objetivos.</p><div className="subscription-items"><span>Almendras</span><span>Mix proteína</span><span>Semillas</span></div><strong>15% <small>de descuento</small></strong></div></section>

    <section className="journal" id="nosotros"><p className="eyebrow">NUESTRA FORMA DE HACER</p><h2>Comer bien debería ser<br />una elección fácil.</h2><p>Elegimos productos honestos, cuidamos cómo los envasamos y los llevamos a tu casa con la misma atención con la que los elegiríamos para la nuestra.</p><a href="#inicio" className="text-link">Conocé nuestra historia <span>→</span></a></section>

    <footer><a className="brand" href="#inicio"><span>SV</span> saludablemente<br />vivo</a><p>Alimentos reales para una vida más liviana.</p><div className="footer-links"><a href="#productos">Tienda</a><a href="#suscripciones">Suscripciones</a><a href="#nosotros">Contacto</a></div><small>© 2026 Saludablemente Vivo · Hecho con cuidado en Buenos Aires</small></footer>
  </main>;
}
