import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { workflows } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = getSiteUrl();
  const now = new Date();
  const paths = ["", "/pricing", "/docs", "/changelog", "/concept", "/demo", "/demo/workflows", "/demo/runs", "/demo/settings", ...workflows.map((w) => `/demo/workflows/${w.id}`)];
  return paths.map((p, i) => ({ url: `${url}${p}`, lastModified: now, priority: i === 0 ? 1 : 0.6 }));
}
