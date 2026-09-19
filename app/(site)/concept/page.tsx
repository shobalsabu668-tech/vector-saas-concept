import type { Metadata } from "next";
import Link from "next/link";
import { author, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About this concept",
  description: `VECTOR is a self-initiated concept by ${author.name}: what was built, how, and what is simulated.`,
  alternates: { canonical: "/concept" },
};

const built = [
  ["The product as the pitch", "The homepage leads with the real dashboard component: range tabs re-plot the chart, the chart can be read point by point with the keyboard, and runs stream in live."],
  ["A workflow you can run", "Branching logic executes step by step on a canvas, lighting each node and edge, with a timed run log. Choose the input and watch it take a different path."],
  ["A full app demo", "Overview, workflows (with on/off switches), a builder with draggable nodes and an inspector, a filterable and searchable run log with traces, settings, a ⌘K command palette, and a light/dark theme."],
  ["Charts without a library", "Hand-built SVG: Catmull-Rom curves, tweened re-plots, tooltips, and accessible summaries."],
  ["Honest pricing maths", "Seat and volume sliders re-price every plan with its working shown, in rupees or dollars, and mark the cheapest plan that fits."],
  ["Deterministic data", "Every run, metric and chart is generated from a seed, so it's identical for every visitor and between server and browser, with no hydration mismatches."],
];

const simulated = [
  "VECTOR, its customers, prices and every number shown are fictional.",
  "Runs are generated from a seed; the live stream is the same generator moving forward in time.",
  "Nothing in the demo is saved or sent. Changes live in memory until you leave.",
  "The docs describe a CLI and SDK that don't exist, written the way real ones would be.",
];

export default function ConceptPage() {
  return (
    <main id="main" className="flex-1">
      <section className="bg-grid border-b border-grid">
        <div className="shell py-16 md:py-24">
          <p className="t-eyebrow">About this concept</p>
          <h1 className="t-display mt-5 max-w-[15ch]">Show the product. Don&rsquo;t describe it.</h1>
          <p className="t-lead mt-8 max-w-2xl">
            {site.name} is a self-initiated concept by {author.name}, a creative web developer in Bengaluru. It explores a SaaS
            website where the marketing site is the product demo. It is not a real product and not client work.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={author.caseStudy} className="btn btn-mint">
              Read the case study
            </a>
            <a href={author.repo} className="btn btn-line">
              View the source code
            </a>
            <a href={author.portfolio} className="btn btn-line">
              Work with {author.name.split(" ")[0]}
            </a>
            <Link href="/demo" className="btn btn-line">
              Open the live demo
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="built" className="section">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="built" className="t-h2">
              What was built
            </h2>
            <p className="mt-5 text-muted">Next.js 15, React 19, TypeScript and Tailwind CSS 4. No component kit, no charting library, no animation library.</p>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {built.map(([k, v]) => (
              <div key={k} className="panel p-6">
                <dt className="font-[600]">{k}</dt>
                <dd className="mt-2 text-[0.92rem] text-muted">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="sim" className="section border-t border-grid">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <h2 id="sim" className="t-h2 lg:col-span-4">
            What is simulated
          </h2>
          <ul className="space-y-3 lg:col-span-7 lg:col-start-6">
            {simulated.map((s) => (
              <li key={s} className="flex gap-4 border-b border-grid pb-4">
                <span aria-hidden="true" className="text-mint">
                  ◆
                </span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
