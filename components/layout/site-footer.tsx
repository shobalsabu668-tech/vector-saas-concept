import Link from "next/link";
import { author, site } from "@/lib/site";
import { Logo } from "./logo";

const cols = [
  { title: "Product", links: [["/#product", "Features"], ["/#workflow", "How it works"], ["/pricing", "Pricing"], ["/demo", "Live demo"]] },
  { title: "Developers", links: [["/docs", "Quickstart"], ["/changelog", "Changelog"]] },
  { title: "Concept", links: [["/concept", "About this concept"], [author.repo, "Source code"]] },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-grid bg-deep">
      <div className="shell grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-4 max-w-xs text-muted">{site.tagline} Built in {site.city}.</p>
        </div>
        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title} className="md:col-span-2">
            <p className="t-mono text-muted">{c.title}</p>
            <ul className="mt-4 space-y-2.5 text-[0.92rem]">
              {c.links.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-frost/85 hover:text-mint">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="shell flex flex-col gap-3 border-t border-grid py-6 text-[0.82rem] text-muted sm:flex-row sm:justify-between">
        <p>A self-initiated concept. VECTOR, its customers and every metric shown are fictional.</p>
        <p>
          Designed &amp; built by{" "}
          <a href={author.portfolio} className="text-frost underline underline-offset-4">
            {author.name}
          </a>
        </p>
      </div>
    </footer>
  );
}
