import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return ["", "/tienda", "/combos", "/suscripciones", "/para-vos", "/promos"].map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.8 }));
}
