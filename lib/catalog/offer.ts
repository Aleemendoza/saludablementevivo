export type CatalogProduct = { id: string; name: string; unit: string; price: number | null; stock: number };
export type OfferItem = { productId: string; quantity: number };

export function calculateOffer(products: CatalogProduct[], items: OfferItem[], discountPercent = 0) {
  const byId = new Map(products.map((product) => [product.id, product]));
  const components = items.map((item) => ({ ...item, product: byId.get(item.productId) })).filter((item): item is OfferItem & { product: CatalogProduct } => Boolean(item.product));
  if (components.length !== items.length) throw new Error("La oferta contiene productos inexistentes.");
  const stock = Math.min(...components.map(({ product, quantity }) => Math.floor(product.stock / quantity)));
  const hasPrice = components.every(({ product }) => product.price !== null);
  const individualPrice = hasPrice ? components.reduce((total, { product, quantity }) => total + (product.price ?? 0) * quantity, 0) : null;
  const price = individualPrice === null ? null : Math.round(individualPrice * (1 - discountPercent / 100));
  return { stock: Number.isFinite(stock) ? Math.max(stock, 0) : 0, individualPrice, price, savings: individualPrice !== null && price !== null ? individualPrice - price : null };
}
