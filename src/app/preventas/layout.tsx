import type { Metadata } from "next";
import type { ReactNode } from "react";
import { siteOrigin } from "@/lib/site";

export const metadata: Metadata = {
  title: "Preventas de cine físico | CineMerch",
  description: "Consulta próximas ediciones de colección, fechas estimadas de estreno y disponibilidad en la demo de CineMerch.",
  alternates: siteOrigin() ? { canonical: "/preventas" } : undefined,
};

export default function PreorderLayout({ children }: { children: ReactNode }) {
  return children;
}
