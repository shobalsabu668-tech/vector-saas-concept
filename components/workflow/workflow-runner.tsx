"use client";

import { useEffect, useId, useRef, useState } from "react";
import { getWorkflow } from "@/lib/data";
import { cn } from "@/lib/site";
import { WorkflowCanvas } from "./workflow-canvas";
import { useRun } from "./use-run";

const amounts = [12_400, 38_900, 86_000];
const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

/**
 * RUN IT — the marketing site's claim, made checkable: pick an order value,
 * run the workflow, and watch the branch choose a path.
 */
export function WorkflowRunner() {
  const id = useId();
  const wf = getWorkflow("order-to-invoice")!;
  const [amount, setAmount] = useState(86_000);
  const { states, hot, log, running, run, reset } = useRun(wf);
  const logBox = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logBox.current?.scrollTo({ top: logBox.current.scrollHeight });
  }, [log]);

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-grid px-5 py-4">
        <div>
          <p className="font-[600]">{wf.name}</p>
          <p className="t-mono text-muted">
            v{wf.version} · {wf.team} · trigger: {wf.trigger}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <fieldset className="flex items-center gap-2">
            <legend className="sr-only">Order value for this run</legend>
            <span className="text-[0.85rem] text-muted" aria-hidden="true">
              Order value
            </span>
            <div className="flex rounded-lg border border-grid bg-deep p-1">
              {amounts.map((a) => (
                <label key={a} className={cn("num cursor-pointer rounded-md px-2.5 py-1.5 text-[0.78rem] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-mint", amount === a ? "bg-raised text-frost" : "text-muted hover:text-frost")}>
                  <input type="radio" name={`${id}-amount`} className="sr-only" checked={amount === a} onChange={() => (setAmount(a), reset())} />
                  {inr.format(a)}
                </label>
              ))}
            </div>
          </fieldset>
          <button type="button" className="btn btn-mint" onClick={() => run(amount > 50_000, `order ${inr.format(amount)}`)} disabled={running}>
            <span aria-hidden="true">▶</span> {running ? "Running…" : log.length ? "Run again" : "Run workflow"}
          </button>
        </div>
      </div>

      <div className="bg-grid relative px-4 py-8 md:px-8">
        <WorkflowCanvas workflow={wf} states={states} hot={hot} className="mx-auto max-w-full" />
      </div>

      <div className="border-t border-grid bg-deep">
        <div className="flex items-center justify-between px-5 py-2.5">
          <p className="t-mono text-muted">Run log</p>
          {log.length ? (
            <button type="button" onClick={reset} className="t-mono text-muted hover:text-frost" disabled={running}>
              Clear
            </button>
          ) : null}
        </div>
        <div ref={logBox} role="log" aria-live="polite" aria-label="Run log" tabIndex={0} className="num h-40 overflow-y-auto px-5 pb-4 text-[0.8rem] leading-7">
          <ol>
          {log.length === 0 ? <li className="text-muted">Choose an order value and press Run. Orders over ₹50,000 need approval.</li> : null}
          {log.map((l, i) => (
            <li key={i} className={cn("fade-in flex gap-4", l.tone === "ok" ? "text-frost" : l.tone === "warn" ? "text-amber" : "text-mint")}>
              <span className="w-16 shrink-0 text-right text-muted">{l.t} ms</span>
              <span>{l.text}</span>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
