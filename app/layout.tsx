import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Saludablemente Vivo | Elegí comer mejor",
  description: "Alimentos naturales cuidadosamente seleccionados y envasados al vacío.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
