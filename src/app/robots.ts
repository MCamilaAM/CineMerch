import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const origin = siteOrigin();
  return origin
    ? { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }, sitemap: origin + "/sitemap.xml" }
    : { rules: { userAgent: "*", disallow: "/" } };
}
