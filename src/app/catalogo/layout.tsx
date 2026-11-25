import type { Metadata } from "next";
import type { ReactNode } from "react";
import { siteOrigin } from "@/lib/site";

export const metadata: Metadata = {
  title: "Catálogo 4K UHD y Steelbooks | CineMerch",
  description: "Explora ediciones físicas de cine por director, formato y género. Encuentra Steelbooks, Blu-ray, 4K UHD y accesorios.",
  alternates: siteOrigin() ? { canonical: "/catalogo" } : undefined,
};

export default function CatalogLayout({ children }: { children: ReactNode }) {
  return children;
}
