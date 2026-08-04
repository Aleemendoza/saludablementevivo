import { baseProducts } from "@/lib/catalog/data";

export const metadata = { title: "Tienda | Saludablemente Vivo" };
export default function StorePage() { return <main><section className="section"><p className="eyebrow">LOS 15 ESENCIALES</p><h1>Productos que<br /><em>sí vas a usar.</em></h1><p className="lead">Una selección acotada para que comprar sea más simple y la frescura esté siempre primero.</p><div className="base-product-grid">{baseProducts.map(([slug, name, weight]) => <article className="base-product" key={slug}><img src="/images/hero-premium-food.png" alt={name} /><div><p>{weight}</p><h3>{name}</h3><span>Precio próximamente</span></div></article>)}</div></section></main>; }
