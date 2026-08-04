"use client";

import { useEffect, useRef, useState } from "react";
import { baseProducts, combos, seasonalPacks, subscriptionPlans } from "@/lib/catalog/data";
import { comboImages, productImages } from "@/lib/catalog/images";
import { useCart } from "@/app/cart-provider";

const featured = combos.filter((combo) => combo.featured);

export default function Home() {
  const { items: cartItems, add, setQuantity, remove } = useCart();
  const [isAdding, setIsAdding] = useState<string | null>(null);
  const [toastProduct, setToastProduct] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartSummaryRef = useRef<HTMLElement>(null);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  useEffect(() => {
    if (!toastProduct) return;
    const timeoutId = window.setTimeout(() => setToastProduct(null), 5000);

    return () => window.clearTimeout(timeoutId);
  }, [toastProduct]);

  useEffect(() => {
    if (!isCartOpen) return;
    cartSummaryRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsCartOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isCartOpen]);

  function addToCart(itemName: string) {
    if (isAdding) return;

    setIsAdding(itemName);
    window.setTimeout(() => {
      const product = baseProducts.find(([, name]) => name === itemName);
      add(product ? { kind: "product", id: product[0], name: itemName } : { kind: "combo", id: itemName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""), name: itemName });
      setToastProduct(itemName);
      setIsAdding(null);
    }, 450);
  }

  function openCart() {
    setIsCartOpen(true);
    setToastProduct(null);
  }

  return (
    <main>
      <a className="skip" href="#contenido">Saltar al contenido</a>
      <div className="topbar">Seleccionado y preparado en Los Perales, San Salvador de Jujuy <span>•</span> Retiro disponible y entregas locales</div>
      <header className="header">
        <a className="brand" href="#inicio"><span>SV</span> saludablemente<br />vivo</a>
        <nav aria-label="Navegación principal"><a href="#tienda">Tienda</a><a href="#combos">Combos</a><a href="#suscripciones">Suscripciones</a><a href="#beneficios">Beneficios</a></nav>
        <button className="cart" id="cart-trigger" type="button" aria-controls="cart-summary" aria-expanded={isCartOpen} aria-label={`Abrir carrito con ${cartCount} productos`} onClick={() => setIsCartOpen((open) => !open)}>Bolsa <b>{cartCount}</b></button>
      </header>

      {isCartOpen && (
        <aside className="cart-popover" id="cart-summary" ref={cartSummaryRef} tabIndex={-1} role="dialog" aria-label="Resumen de la bolsa">
          <div className="cart-popover-header"><div><p className="eyebrow">TU BOLSA</p><h2>{cartCount === 0 ? "Todavía está vacía." : `${cartCount} ${cartCount === 1 ? "producto" : "productos"} agregado${cartCount === 1 ? "" : "s"}.`}</h2></div><button className="cart-close" type="button" onClick={() => setIsCartOpen(false)} aria-label="Cerrar resumen de la bolsa">×</button></div>
          {cartCount > 0 && <ul className="cart-items">{cartItems.map((item) => <li key={`${item.kind}-${item.id}`}><span>{item.name}</span><div><button type="button" onClick={() => setQuantity(item.kind, item.id, item.quantity - 1)} aria-label={`Quitar una unidad de ${item.name}`}>−</button><b>{item.quantity}</b><button type="button" onClick={() => setQuantity(item.kind, item.id, item.quantity + 1)} aria-label={`Agregar una unidad de ${item.name}`}>+</button><button type="button" onClick={() => remove(item.kind, item.id)} aria-label={`Eliminar ${item.name}`}>×</button></div></li>)}</ul>}
          <a className="button primary" href="/checkout" onClick={() => setIsCartOpen(false)}>{cartCount ? "Finalizar compra" : "Seguir comprando"} <span>→</span></a>
        </aside>
      )}

      <section className="hero" id="inicio"><div className="hero-copy"><p className="eyebrow">ALIMENTOS REALES, ELEGIDOS CON CUIDADO</p><h1>Comé mejor.<br /><em>Nosotros hacemos<br />el resto.</em></h1><p className="lead">Tu despensa saludable, seleccionada, envasada al vacío y preparada desde Los Perales.</p><div className="hero-actions"><a className="button primary" href="#combos">Elegí un combo <span>→</span></a><a className="button secondary" href="#tienda">Comprar productos</a></div></div><div className="hero-image" role="img" aria-label="Selección de alimentos saludables envasados al vacío"><div className="hero-photo" /></div></section>
      <section className="assurances" aria-label="Beneficios"><div className="assurance"><i>⌂</i><div><strong>Retiro en Los Perales</strong><span>Cuando te quede cómodo</span></div></div><div className="assurance"><i>↗</i><div><strong>Entrega local</strong><span>San Salvador de Jujuy</span></div></div><div className="assurance"><i>✦</i><div><strong>Sellado al vacío</strong><span>Frescura que se nota</span></div></div><div className="assurance"><i>✓</i><div><strong>15 productos, muchas opciones</strong><span>Menos stock, mejor selección</span></div></div></section>
      <section className="section decision-paths" id="contenido"><p className="eyebrow">ELEGÍ COMO TE RESULTE MÁS FÁCIL</p><h2>No necesitás saber<br /><em>exactamente qué comprar.</em></h2><div className="path-grid"><a href="#tienda"><b>01</b><h3>Comprar productos</h3><p>Para quien ya sabe qué está buscando.</p><span>Ver los 15 productos →</span></a><a href="#combos"><b>02</b><h3>Elegí un combo</h3><p>Una selección lista para tu objetivo.</p><span>Encontrar el mío →</span></a><a href="#suscripciones"><b>03</b><h3>Recibí todos los meses</h3><p>Tu despensa se repone sola cada 30 días.</p><span>Ver planes →</span></a><a href="#beneficios"><b>04</b><h3>Sumá beneficios</h3><p>Puntos, referidos y packs de temporada.</p><span>Conocer beneficios →</span></a></div></section>
      <section className="section products" id="tienda"><div className="section-heading"><div><p className="eyebrow">LOS 15 ESENCIALES</p><h2>Todo lo bueno,<br />sin complicarlo.</h2></div><p className="section-text">El catálogo inicial crece desde una selección clara, fresca y versátil.</p></div><div className="base-product-grid">{baseProducts.map(([slug, name, weight]) => { const loading = isAdding === name; return <article className="base-product" key={slug}><img src={productImages[name]} alt={name} /><div><p>{weight}</p><h3>{name}</h3><span>Desde</span><button type="button" disabled={Boolean(isAdding)} aria-busy={loading} aria-label={loading ? `Agregando ${name} a la bolsa` : `Agregar ${name} a la bolsa`} onClick={() => addToCart(name)}>{loading ? <><span className="button-spinner" aria-hidden="true" />Agregando...</> : <>Agregar <b aria-hidden="true">+</b></>}</button></div></article>; })}</div></section>
      <section className="section featured-combos" id="combos"><div className="section-heading"><div><p className="eyebrow">COMBOS DESTACADOS</p><h2>Elegidos para tu<br /><em>momento del día.</em></h2></div><a className="text-link" href="/combos">Ver los 22 combos <span>→</span></a></div><div className="offer-grid">{featured.map((combo) => { const loading = isAdding === combo.name; return <article className="offer-card" key={combo.name}><img src={comboImages[combo.name]} alt={`Productos incluidos en ${combo.name}`} /><div className="offer-content"><p className="eyebrow">{combo.group.toUpperCase()}</p><h3>{combo.name}</h3><p>{combo.purpose}</p><ul>{combo.items.map((item) => <li key={item}>{item}</li>)}</ul><div className="offer-footer"><span>Ahorrás {combo.discount}%</span><button type="button" disabled={Boolean(isAdding)} aria-busy={loading} aria-label={loading ? `Agregando ${combo.name} a la bolsa` : `Elegir ${combo.name}`} onClick={() => addToCart(combo.name)}>{loading ? <><span className="button-spinner" aria-hidden="true" />Agregando...</> : <>Elegir combo <span aria-hidden="true">→</span></>}</button></div></div></article>; })}</div></section>
      <section className="profiles"><div><p className="eyebrow">ELEGÍ SEGÚN VOS</p><h2>Una buena elección<br />empieza por entender<br /><em>tu rutina.</em></h2></div><div className="profile-links">{[["Para desayunos", "Avena, granola, miel y semillas."], ["Para entrenar", "Energía real antes y después."], ["Para estudiar", "Snacks para acompañar el foco."], ["Para la familia", "Más cantidad, más tranquilidad."], ["Para regalar", "Cajas con buena intención."]].map(([title, detail]) => <a href="#combos" key={title}><h3>{title}</h3><p>{detail}</p><span>Explorar →</span></a>)}</div></section>
      <section className="subscription" id="suscripciones"><div><p className="eyebrow">CADA 30 DÍAS</p><h2>Tu despensa,<br /><em>siempre completa.</em></h2><p>Elegí un plan, recibí tus favoritos todos los meses y pausá o cancelá cuando quieras.</p><a className="button light" href="/suscripciones">Ver todos los planes <span>→</span></a></div><div className="plan-stack">{subscriptionPlans.slice(0, 3).map(([name, purpose, items, benefit]) => <article key={name}><span>{name === "Esencial" ? "MÁS ELEGIDO" : "MENSUAL"}</span><h3>Plan {name}</h3><p>{purpose}</p><small>{items.join(" · ")}</small><strong>{benefit}</strong></article>)}</div></section>
      <section className="section benefits" id="beneficios"><div className="section-heading"><div><p className="eyebrow">BENEFICIOS QUE VUELVEN</p><h2>Comer mejor también<br />puede darte más.</h2></div></div><div className="benefit-grid"><article><b>01</b><h3>Sumá puntos</h3><p>1 punto por cada $1.000 de compra aprobada.</p><span>50 puntos = 5% OFF</span></article><article><b>02</b><h3>Canjeá cuando quieras</h3><p>100 puntos = envío gratis. 200 puntos = Mix Premium de regalo.</p><span>Sujeto a stock</span></article><article><b>03</b><h3>Invitá a alguien</h3><p>Tu amigo recibe bienvenida; vos sumás puntos cuando hace su primera compra.</p><span>Beneficio para ambos</span></article></div></section>
      <section className="seasonal"><p className="eyebrow">PACKS QUE CAMBIAN CON LA TEMPORADA</p><h2>Siempre hay una<br /><em>buena excusa para elegirte.</em></h2><div>{seasonalPacks.map((pack) => <span key={pack}>{pack}</span>)}</div><a className="button primary" href="/promos">Ver promociones <span>→</span></a></section>
      <footer><a className="brand" href="#inicio"><span>SV</span> saludablemente<br />vivo</a><p>Alimentos reales para una vida más liviana.</p><div className="footer-links"><a href="#tienda">Tienda</a><a href="#suscripciones">Suscripciones</a><a href="#beneficios">Beneficios</a></div><small>© 2026 Saludablemente Vivo · Hecho con cuidado en Los Perales, San Salvador de Jujuy</small></footer>

      {toastProduct && <div className="cart-toast" role="status" aria-live="polite"><span className="toast-icon" aria-hidden="true">✓</span><div><strong>{toastProduct} se agregó a tu bolsa.</strong><a href="#cart-summary" onClick={openCart}>Ver carrito →</a></div><button type="button" onClick={() => setToastProduct(null)} aria-label="Cerrar notificación">×</button></div>}
    </main>
  );
}
