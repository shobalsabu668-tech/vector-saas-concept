import Link from "next/link";
import { site } from "@/lib/site";
import { Dashboard } from "@/components/dashboard/dashboard";

/**
 * HERO — lead with the product. The dashboard under the headline is the real
 * component from the demo: the tabs work, the chart reads out values, runs
 * arrive while you watch.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="bg-grid relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[38%] h-[40rem] w-[70rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(92_242_176/0.12),transparent)]" />
      <div className="shell relative pb-16 pt-16 md:pt-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="t-eyebrow rise">Workflow automation · built in {site.city}</p>
          <h1 id="hero-title" className="t-display rise mt-5" style={{ "--d": 1 } as React.CSSProperties}>
            {site.tagline}
          </h1>
          <p className="t-lead rise mx-auto mt-6 max-w-2xl" style={{ "--d": 2 } as React.CSSProperties}>
            VECTOR runs the work between your tools, from orders to invoices, leads to reps and tickets to refunds, and shows
            you every run as it happens. This is the product, not a screenshot. Try it.
          </p>
          <div className="rise mt-9 flex flex-wrap justify-center gap-3" style={{ "--d": 3 } as React.CSSProperties}>
            <Link href="/demo" className="btn btn-mint min-h-12 px-6">
              Open the live demo
            </Link>
            <Link href="/pricing" className="btn btn-line min-h-12 px-6">
              See pricing
            </Link>
          </div>
        </div>

        <div className="rise mx-auto mt-14 max-w-6xl" style={{ "--d": 4 } as React.CSSProperties}>
          <div className="panel overflow-hidden shadow-[0_40px_120px_-20px_rgb(0_0_0/0.7)]">
            <div className="flex items-center gap-2 border-b border-grid px-4 py-3" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-grid" />
              <span className="size-2.5 rounded-full bg-grid" />
              <span className="size-2.5 rounded-full bg-grid" />
              <span className="t-mono ml-4 rounded-md bg-deep px-3 py-1 text-muted">app.vector.example / overview</span>
            </div>
            <div className="p-4 md:p-6">
              <Dashboard compact />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
