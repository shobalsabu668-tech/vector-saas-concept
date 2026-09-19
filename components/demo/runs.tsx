"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatDuration, formatTime, getWorkflow, runAt, statusStyle, type RunStatus } from "@/lib/data";
import { cn } from "@/lib/site";
import { useLiveRuns } from "@/components/dashboard/use-live-runs";
import { useDemo } from "./demo-store";

const PAGE = 15;
const statuses: ("all" | RunStatus)[] = ["all", "success", "retried", "failed"];

export function RunsFromUrl() {
  const open = useSearchParams().get("open");
  return <RunsView key={open ?? "none"} openParam={open} />;
}

/** RUNS — the run log: filter, search, page, and open any run to see its trace. */
export function RunsView({ openParam }: { openParam: string | null }) {
  const head = useLiveRuns(3000);
  const { notify } = useDemo();
  const [status, setStatus] = useState<(typeof statuses)[number]>("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState<number | null>(openParam ? Number(openParam) : null);

  // The log is generated on demand: scan back from the newest run.
  const rows = useMemo(() => {
    const out: { n: number; run: ReturnType<typeof runAt> }[] = [];
    const needle = q.trim().toLowerCase();
    for (let n = head; n > head - 3000 && out.length < (page + 1) * PAGE + 1; n--) {
      const run = runAt(n);
      if (status !== "all" && run.status !== status) continue;
      if (needle && !`${run.id} ${getWorkflow(run.workflow)?.name}`.toLowerCase().includes(needle)) continue;
      out.push({ n, run });
    }
    return out;
  }, [head, status, q, page]);

  const visible = rows.slice(page * PAGE, page * PAGE + PAGE);
  const hasNext = rows.length > (page + 1) * PAGE;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[1.6rem] font-[620] tracking-[-0.02em]">Runs</h1>
          <p className="flex items-center gap-2 text-muted">
            <span className="live-dot size-1.5 rounded-full bg-mint" aria-hidden="true" /> Streaming new runs
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div role="group" aria-label="Filter by status" className="flex rounded-lg border border-grid bg-panel p-1">
            {statuses.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={status === s}
                onClick={() => {
                  setStatus(s);
                  setPage(0);
                }}
                className={cn("rounded-md px-3 py-1.5 text-[0.85rem] capitalize", status === s ? "bg-raised text-frost" : "text-muted hover:text-frost")}
              >
                {s}
              </button>
            ))}
          </div>
          <label className="sr-only" htmlFor="run-search">
            Search runs
          </label>
          <input
            id="run-search"
            type="search"
            placeholder="Search run ID or workflow"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(0);
            }}
            className="field-input w-64"
          />
        </div>
      </div>

      <div className="panel relative mt-6 overflow-x-auto">
        <table className="w-full min-w-[40rem] text-left text-[0.88rem]">
          <caption className="sr-only">Workflow runs, newest first (concept data)</caption>
          <thead>
            <tr className="border-b border-grid text-[0.8rem] text-muted">
              <th scope="col" className="px-5 py-3 font-[500]">Run</th>
              <th scope="col" className="px-3 py-3 font-[500]">Workflow</th>
              <th scope="col" className="px-3 py-3 font-[500]">Status</th>
              <th scope="col" className="px-3 py-3 font-[500]">Duration</th>
              <th scope="col" className="px-5 py-3 text-right font-[500]">Started</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(({ n, run }) => {
              const st = statusStyle[run.status];
              return (
                <tr key={run.id} className="border-b border-grid last:border-0 hover:bg-raised/50">
                  <td className="px-5 py-3">
                    <button type="button" onClick={() => setOpen(n)} className="num text-left text-mint hover:underline">
                      {run.id}
                    </button>
                  </td>
                  <td className="px-3 py-3">{getWorkflow(run.workflow)?.name}</td>
                  <td className={cn("px-3 py-3", st.tone)}>
                    <span className="inline-flex items-center gap-1.5">
                      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" /> {st.label}
                    </span>
                  </td>
                  <td className="num px-3 py-3 text-muted">{formatDuration(run.durationMs)}</td>
                  <td className="num px-5 py-3 text-right text-muted">{formatTime(run.startedAt)}</td>
                </tr>
              );
            })}
            {!visible.length ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-muted">
                  No runs match.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <nav aria-label="Pagination" className="mt-4 flex items-center justify-between">
        <p className="num text-[0.8rem] text-muted">Page {page + 1}</p>
        <div className="flex gap-2">
          <button type="button" className="btn btn-line min-h-9" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            Newer
          </button>
          <button type="button" className="btn btn-line min-h-9" disabled={!hasNext} onClick={() => setPage((p) => p + 1)}>
            Older
          </button>
        </div>
      </nav>

      {open !== null ? <RunDrawer n={open} onClose={() => setOpen(null)} onReplay={() => notify("Replay queued (concept: nothing runs)")} /> : null}
    </div>
  );
}

function RunDrawer({ n, onClose, onReplay }: { n: number; onClose: () => void; onReplay: () => void }) {
  const run = runAt(n);
  const wf = getWorkflow(run.workflow)!;
  const panel = useRef<HTMLDivElement>(null);
  const st = statusStyle[run.status];
  // Spread the run's duration across its steps, deterministically.
  const weights = wf.steps.map((s, i) => (s.kind === "trigger" ? 0.02 : s.kind === "branch" ? 0.01 : 0.2 + ((n + i * 7) % 5) * 0.1));
  const sum = weights.reduce((a, b) => a + b, 0);
  const failedAt = run.status === "failed" ? wf.steps.length - 2 : -1;

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    panel.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panel.current) return;
      const f = Array.from(panel.current.querySelectorAll<HTMLElement>("button"));
      if (e.shiftKey && document.activeElement === f[0]) {
        e.preventDefault();
        f[f.length - 1].focus();
      } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
        e.preventDefault();
        f[0].focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [onClose]);

  let offset = 0;
  return (
    <div className="fixed inset-0 z-[70]">
      <div className="fade-in absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div ref={panel} role="dialog" aria-modal="true" aria-labelledby="run-title" className="absolute inset-y-0 right-0 flex w-full max-w-md animate-[slide-in-right_400ms_var(--ease-out)] flex-col border-l border-grid bg-panel">
        <div className="flex items-start justify-between gap-4 border-b border-grid p-5">
          <div>
            <p className="t-mono text-muted">{wf.name}</p>
            <h2 id="run-title" className="num mt-1 text-[1.2rem]">
              {run.id}
            </h2>
            <p className={cn("mt-1 text-[0.9rem]", st.tone)}>
              {st.label} · {formatDuration(run.durationMs)} · {formatTime(run.startedAt)}
            </p>
          </div>
          <button type="button" onClick={onClose} className="btn btn-line min-h-9 px-3" aria-label="Close run details">
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <p className="t-mono text-muted">Trace</p>
          <ol className="mt-3 space-y-3">
            {wf.steps.map((s, i) => {
              const ms = Math.max(1, Math.round((weights[i] / sum) * run.durationMs));
              const left = (offset / run.durationMs) * 100;
              offset += ms;
              const skipped = failedAt >= 0 && i > failedAt;
              const failed = i === failedAt;
              return (
                <li key={s.id} className={cn("text-[0.85rem]", skipped && "opacity-40")}>
                  <div className="flex justify-between gap-3">
                    <span>{s.title}</span>
                    <span className={cn("num", failed ? "text-rose" : "text-muted")}>{skipped ? "skipped" : failed ? "failed" : `${ms} ms`}</span>
                  </div>
                  <div className="relative mt-1.5 h-2 rounded bg-deep" aria-hidden="true">
                    {!skipped ? <span className={cn("absolute inset-y-0 rounded", failed ? "bg-rose" : "bg-mint")} style={{ left: `${left}%`, width: `max(3px, ${(ms / run.durationMs) * 100}%)` }} /> : null}
                  </div>
                </li>
              );
            })}
          </ol>
          {run.status === "retried" ? <p className="mt-5 rounded-lg border border-amber/40 bg-amber/10 p-3 text-[0.85rem]">One step timed out and succeeded on its second attempt, 1.4 s later.</p> : null}
          {run.status === "failed" ? <p className="mt-5 rounded-lg border border-rose/40 bg-rose/10 p-3 text-[0.85rem]">{wf.steps[failedAt]?.title} returned 503 after 3 attempts. The owner was notified.</p> : null}
        </div>
        <div className="flex gap-2 border-t border-grid p-5">
          <button type="button" onClick={onReplay} className="btn btn-mint flex-1">
            Replay run
          </button>
          <button type="button" onClick={onClose} className="btn btn-line">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
