"use client";

import { useId, useMemo, useState, type KeyboardEvent } from "react";
import { RANGES, getWorkflow, recentRuns, series, formatDuration, formatTime, statusStyle, type RangeKey } from "@/lib/data";
import { cn } from "@/lib/site";
import { AreaChart } from "@/components/charts/area-chart";
import { useLiveRuns, BASE_RUN } from "./use-live-runs";

const nf = new Intl.NumberFormat("en-IN");

/**
 * DASHBOARD — the product itself, not a picture of it. Range tabs re-plot the
 * chart, KPIs follow, and new runs stream into the log while you watch.
 */
export function Dashboard({ compact = false, onOpenRun }: { compact?: boolean; onOpenRun?: (runNumber: number) => void }) {
  const id = useId();
  const [range, setRange] = useState<RangeKey>("7d");
  const n = useLiveRuns();
  const cfg = RANGES[range];
  const data = useMemo(() => series(cfg.points, cfg.seed, cfg.base, cfg.amp, cfg.trend), [cfg]);
  const labels = useMemo(
    () =>
      data.map((_, i) => {
        const back = cfg.points - 1 - i;
        if (range === "24h") return back === 0 ? "now" : `${back}h ago`;
        if (range === "7d") return back === 0 ? "now" : back * 6 < 48 ? `${back * 6}h ago` : `${Math.round((back * 6) / 24)}d ago`;
        return back === 0 ? "today" : `${back}d ago`;
      }),
    [data, cfg.points, range],
  );
  const extra = n - BASE_RUN;
  const runs = recentRuns(n, compact ? 5 : 8);
  const keys = Object.keys(RANGES) as RangeKey[];

  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = keys.indexOf(range);
    const next = e.key === "ArrowRight" ? keys[(i + 1) % keys.length] : e.key === "ArrowLeft" ? keys[(i - 1 + keys.length) % keys.length] : null;
    if (!next) return;
    e.preventDefault();
    setRange(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  };

  const kpis = [
    { label: "Runs", value: nf.format(cfg.kpi.runs + extra), delta: "+8.2%" },
    { label: "Success rate", value: `${cfg.kpi.success}%`, delta: "+0.3 pt" },
    { label: "p95 latency", value: `${cfg.kpi.p95} ms`, delta: "−12 ms" },
    { label: "Active workflows", value: String(cfg.kpi.active), delta: "" },
  ];

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="live-dot size-2 rounded-full bg-mint" aria-hidden="true" />
          <p className="text-[1.05rem] font-[600]">Throughput</p>
          <span className="t-mono text-muted">· {cfg.label}</span>
        </div>
        <div role="tablist" aria-label="Time range" onKeyDown={onTabKey} className="flex rounded-lg border border-grid bg-deep p-1">
          {keys.map((k) => (
            <button
              key={k}
              id={`${id}-tab-${k}`}
              role="tab"
              type="button"
              aria-selected={range === k}
              aria-controls={`${id}-panel`}
              tabIndex={range === k ? 0 : -1}
              onClick={() => setRange(k)}
              className={cn("num rounded-md px-3 py-1.5 text-[0.78rem] transition-colors", range === k ? "bg-raised text-frost" : "text-muted hover:text-frost")}
            >
              {k.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${range}`} className="grid gap-4">
        <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-lg border border-grid bg-deep p-4">
              <dt className="text-[0.8rem] text-muted">{k.label}</dt>
              <dd className="mt-1.5 flex items-baseline justify-between gap-2">
                <span key={range + k.label} className="num fade-in text-[1.35rem] text-frost">
                  {k.value}
                </span>
                {k.delta ? <span className="num text-[0.72rem] text-mint">{k.delta}</span> : null}
              </dd>
            </div>
          ))}
        </dl>

        <div className="rounded-lg border border-grid bg-deep p-4 pt-6">
          <AreaChart
            data={data}
            labels={labels}
            format={(v) => `${nf.format(Math.round(v))} runs`}
            summary={`Runs per ${cfg.unit}, ${cfg.label.toLowerCase()}. Peak ${nf.format(Math.round(Math.max(...data)))}, low ${nf.format(Math.round(Math.min(...data)))}. Concept data.`}
            height={compact ? "h-44 md:h-52" : "h-56 md:h-72"}
          />
        </div>
      </div>

      <div className="rounded-lg border border-grid bg-deep">
        <div className="flex items-center justify-between border-b border-grid px-4 py-3">
          <p className="text-[0.92rem] font-[600]">Recent runs</p>
          <span className="t-mono flex items-center gap-2 text-muted">
            <span className="live-dot size-1.5 rounded-full bg-mint" aria-hidden="true" /> live
          </span>
        </div>
        <table className="w-full text-left text-[0.85rem]">
          <caption className="sr-only">Most recent workflow runs (concept data)</caption>
          <thead className="sr-only">
            <tr>
              <th scope="col">Workflow</th>
              <th scope="col">Status</th>
              <th scope="col">Duration</th>
              <th scope="col">Started</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((r, i) => {
              const wf = getWorkflow(r.workflow)!;
              const st = statusStyle[r.status];
              const runNumber = n - i;
              return (
                <tr key={r.id} className={cn("border-b border-grid last:border-0", i === 0 && extra > 0 && "row-in")}>
                  <td className="px-4 py-2.5">
                    {onOpenRun ? (
                      <button type="button" onClick={() => onOpenRun(runNumber)} className="text-left hover:text-mint hover:underline">
                        {wf.name}
                      </button>
                    ) : (
                      wf.name
                    )}
                  </td>
                  <td className={cn("px-2 py-2.5", st.tone)}>
                    <span className="inline-flex items-center gap-1.5">
                      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
                      {st.label}
                    </span>
                  </td>
                  <td className="num hidden px-2 py-2.5 text-muted sm:table-cell">{formatDuration(r.durationMs)}</td>
                  <td className="num px-4 py-2.5 text-right text-muted">{formatTime(r.startedAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
