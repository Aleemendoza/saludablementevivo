import { seasonalPacks } from "@/lib/catalog/data";

export const metadata = { title: "Packs de temporada | Saludablemente Vivo" };
export default function PromotionsPage() { return <main><section className="seasonal"><p className="eyebrow">PROMOCIONES DE TEMPORADA</p><h1>Una razón nueva<br /><em>para elegirte.</em></h1><p className="lead">Packs de edición limitada construidos desde nuestra selección base. Sólo mostramos los vigentes.</p><div>{seasonalPacks.map((pack) => <span key={pack}>Pack {pack}</span>)}</div><a className="button primary" href="/combos">Ver combos permanentes <span>→</span></a></section></main>; }
