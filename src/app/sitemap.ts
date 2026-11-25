import type { MetadataRoute } from "next";
import { publicPages, siteOrigin } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin();
  return origin ? publicPages.map((path) => ({ url: new URL(path, origin).href })) : [];
}
