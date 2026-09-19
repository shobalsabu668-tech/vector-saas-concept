import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

/** Crawlable, but every page carries `noindex` (see app/layout.tsx). */
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/" }], sitemap: `${getSiteUrl()}/sitemap.xml` };
}
