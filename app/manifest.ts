import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "Saludablemente Vivo", short_name: "Saludablemente", description: "Alimentos naturales cuidadosamente seleccionados.", start_url: "/", display: "standalone", background_color: "#f8f7f2", theme_color: "#163d2e", icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }] };
}
