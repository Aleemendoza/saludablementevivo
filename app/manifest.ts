import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "Saludablemente Vivo", short_name: "Saludablemente", description: "Alimentos naturales cuidadosamente seleccionados.", start_url: "/", display: "standalone", background_color: "#F4F1E8", theme_color: "#153D2D", icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }] };
}
