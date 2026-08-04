import { seasonalPacks } from "@/lib/catalog/data";
import { seasonalPackImages } from "@/lib/catalog/images";

export const metadata = { title: "Packs de temporada | Saludablemente Vivo" };
export default function PromotionsPage() { return <main><section className="section"><p className="eyebrow">PROMOCIONES DE TEMPORADA</p><h1>Una razón nueva<br /><em>para elegirte.</em></h1><p className="lead">Packs de edición limitada construidos desde nuestra selección base. Sólo mostramos los vigentes.</p><div className="offer-grid">{seasonalPacks.map((pack) => <article className="offer-card" key={pack}><img src={seasonalPackImages[pack]} alt={`Pack ${pack} con productos saludables`} /><div className="offer-content"><p className="eyebrow">EDICIÓN LIMITADA</p><h3>Pack {pack}</h3><p>Selección curada para acompañar la temporada.</p><button className="button primary">Ver pack <span>→</span></button></div></article>)}</div></section></main>; }
