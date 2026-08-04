import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Saludablemente Vivo | Elegí comer mejor",
  description: "Alimentos naturales cuidadosamente seleccionados y envasados al vacío.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: { type: "website", locale: "es_AR", siteName: "Saludablemente Vivo", title: "Saludablemente Vivo | Elegí comer mejor", description: "Alimentos naturales cuidadosamente seleccionados y envasados al vacío." },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
