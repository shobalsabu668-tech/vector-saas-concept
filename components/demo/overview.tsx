"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { runAt, series } from "@/lib/data";
import { smoothLine, toPoints } from "@/lib/chart";
import { cn } from "@/lib/site";
import { Dashboard } from "@/components/dashboard/dashboard";
import { useDemo } from "./demo-store";

function Spark({ seed }: { seed: number }) {
  const pts = toPoints(series(20, seed, 50, 18, 0.6), 120, 32, 0.1);
  return (
    <svg viewBox="0 0 120 32" className="h-8 w-28" aria-hidden="true">
      <path d={smoothLine(pts)} fill="none" stroke="var(--c-mint)" strokeWidth="1.5" />
    </svg>
  );
}

/** OVERVIEW — the dashboard, plus per-workflow health and what needs attention. */
export function Overview() {
  const router = useRouter();
  const { workflows } = useDemo();
  const failed = Array.from({ length: 400 }, (_, i) => ({ run: runAt(120_000 - i), n: 120_000 - i }))
    .filter((r) => r.run.status === "failed")
    .slice(0, 4);

  return (
    <div className="mx-auto grid max-w-7xl gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[1.6rem] font-[620] tracking-[-0.02em]">Good morning, Priya</h1>
          <p className="text-muted">Here&rsquo;s how your workflows are doing.</p>
        </div>
        <Link href="/demo/workflows/order-to-invoice" className="btn btn-mint">
          Open the builder
        </Link>
      </div>

      <section aria-label="Throughput" className="panel p-4 md:p-6">
        <Dashboard onOpenRun={(n) => router.push(`/demo/runs?open=${n}`)} />
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <section aria-labelledby="health" className="panel p-5 xl:col-span-2">
          <h2 id="health" className="font-[600]">
            Workflow health
          </h2>
          <ul className="mt-4 divide-y divide-grid">
            {workflows.map((w, i) => (
              <li key={w.id} className="flex flex-wrap items-center gap-4 py-3">
                <span className={cn("size-2 rounded-full", w.enabled ? "bg-mint" : "bg-muted")} aria-hidden="true" />
                <Link href={`/demo/workflows/${w.id}`} className="min-w-40 flex-1 font-[560] hover:text-mint hover:underline">
                  {w.name}
                </Link>
                <span className="t-mono text-muted">{w.team}</span>
                {w.enabled ? <Spark seed={i * 1.7 + 0.4} /> : <span className="t-mono w-28 text-muted">paused</span>}
                <span className="num w-16 text-right text-[0.9rem]">{w.enabled ? `${(99.8 - i * 0.4).toFixed(1)}%` : "—"}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="attention" className="panel p-5">
          <h2 id="attention" className="font-[600]">
            Needs attention
          </h2>
          <ul className="mt-4 space-y-3">
            {failed.map(({ run, n }) => (
              <li key={run.id}>
                <Link href={`/demo/runs?open=${n}`} className="block rounded-lg border border-grid bg-deep p-3 hover:border-rose">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-[0.9rem] font-[560]">{workflows.find((w) => w.id === run.workflow)?.name}</span>
                    <span className="t-mono text-rose">failed</span>
                  </span>
                  <span className="num block text-[0.75rem] text-muted">{run.id} · replayable</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
