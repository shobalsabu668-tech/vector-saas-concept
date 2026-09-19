/**
 * SITE — the fictional product, and the real person who built it.
 * VECTOR does not exist; contact details use the reserved `.example` domain.
 */

export const site = {
  name: "VECTOR",
  tagline: "Every workflow, one signal.",
  description:
    "VECTOR is a concept site for a fictional workflow-automation platform, where the marketing site is the product demo: a live dashboard, a workflow you can run, and pricing that does the maths for you.",
  email: "hello@vector.example",
  city: "Bengaluru",
};

export const nav = [
  { href: "/#product", label: "Product" },
  { href: "/#workflow", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
  { href: "/changelog", label: "Changelog" },
];

export const author = {
  name: "Shobal Sabu",
  role: "Creative web developer",
  portfolio: process.env.NEXT_PUBLIC_PORTFOLIO_URL || "https://github.com/shobalsabu668-tech",
  caseStudy: process.env.NEXT_PUBLIC_PORTFOLIO_URL
    ? `${process.env.NEXT_PUBLIC_PORTFOLIO_URL.replace(/\/$/, "")}/work/vector`
    : "https://github.com/shobalsabu668-tech",
  repo: "https://github.com/shobalsabu668-tech/vector-saas-concept",
};

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
