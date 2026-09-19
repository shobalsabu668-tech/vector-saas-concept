"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { workflows as seed } from "@/lib/data";
import { cn } from "@/lib/site";
import { WorkflowCanvas } from "@/components/workflow/workflow-canvas";
import { useRun } from "@/components/workflow/use-run";
import { useDemo } from "./demo-store";

/**
 * BUILDER — drag steps around (or select one and nudge it with the arrow
 * keys), edit a step in the inspector, run the workflow down either branch,
 * and save a new version. All in memory; nothing is sent anywhere.
 */
export function WorkflowBuilder({ id }: { id: string }) {
  const uid = useId();
  const { workflows, updateWorkflow, notify } = useDemo();
  const wf = workflows.find((w) => w.id === id)!;
  const [selected, setSelected] = useState<string | null>(null);
  const [branchYes, setBranchYes] = useState(true);
  const [dirty, setDirty] = useState(false);
  const { states, hot, log, running, run, reset } = useRun(wf);
  const logBox = useRef<HTMLDivElement>(null);
  const step = wf.steps.find((s) => s.id === selected);
  const hasBranch = wf.steps.some((s) => s.kind === "branch");
  const branch = wf.steps.find((s) => s.kind === "branch");

  useEffect(() => {
    logBox.current?.scrollTo({ top: logBox.current.scrollHeight });
  }, [log]);

  const move = (sid: string, x: number, y: number) => {
    updateWorkflow(id, (w) => ({ ...w, steps: w.steps.map((s) => (s.id === sid ? { ...s, x, y } : s)) }));
    setDirty(true);
  };

  const edit = (field: "title" | "detail", value: string) => {
    if (!selected) return;
    updateWorkflow(id, (w) => ({ ...w, steps: w.steps.map((s) => (s.id === selected ? { ...s, [field]: value } : s)) }));
    setDirty(true);
  };

  const save = () => {
    updateWorkflow(id, (w) => ({ ...w, version: w.version + 1 }));
    setDirty(false);
    notify(`Saved ${wf.name} as v${wf.version + 1}`);
  };

  const resetLayout = () => {
    const original = seed.find((w) => w.id === id)!;
    updateWorkflow(id, (w) => ({ ...w, steps: w.steps.map((s) => ({ ...s, x: original.steps.find((o) => o.id === s.id)!.x, y: original.steps.find((o) => o.id === s.id)!.y })) }));
  };

  return (
    <div className="mx-auto grid max-w-[1400px] gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="t-mono text-muted">
            <Link href="/demo/workflows" className="hover:text-frost hover:underline">
              Workflows
            </Link>{" "}
            / {wf.team}
          </p>
          <h1 className="text-[1.5rem] font-[620] tracking-[-0.02em]">
            {wf.name} <span className="num align-middle text-[0.8rem] text-muted">v{wf.version}</span>
            {dirty ? <span className="t-mono ml-2 align-middle text-amber">unsaved</span> : null}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={resetLayout} className="btn btn-line min-h-10">
            Reset layout
          </button>
          <button type="button" onClick={save} disabled={!dirty} className="btn btn-line min-h-10">
            Save version
          </button>
          <button type="button" onClick={() => run(branchYes, hasBranch ? `test input: ${branch?.title} ${branchYes ? "yes" : "no"}` : "test input")} disabled={running || !wf.enabled} className="btn btn-mint min-h-10">
            <span aria-hidden="true">▶</span> {running ? "Running…" : "Test run"}
          </button>
        </div>
      </div>

      {!wf.enabled ? (
        <p className="rounded-lg border border-amber/40 bg-amber/10 px-4 py-3 text-[0.9rem]">
          This workflow is paused. Enable it on the{" "}
          <Link href="/demo/workflows" className="underline underline-offset-4">
            workflows list
          </Link>{" "}
          to test it.
        </p>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1fr_20rem]">
        <section aria-label="Canvas" className="panel bg-grid relative overflow-hidden p-4">
          <p className="t-mono mb-3 text-muted">Drag steps to rearrange · select a step, then use the arrow keys to nudge it</p>
          <WorkflowCanvas workflow={wf} states={states} hot={hot} editable onMove={move} selected={selected} onSelect={setSelected} />
        </section>

        <aside aria-label="Inspector" className="panel flex flex-col gap-5 p-5">
          {hasBranch ? (
            <fieldset>
              <legend className="t-mono text-muted">Test input</legend>
              <p className="mt-2 text-[0.9rem]">{branch?.title}</p>
              <div className="mt-2 grid grid-cols-2 rounded-lg border border-grid bg-deep p-1">
                {[true, false].map((v) => (
                  <label key={String(v)} className={cn("cursor-pointer rounded-md py-1.5 text-center text-[0.85rem] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-mint", branchYes === v ? "bg-raised text-frost" : "text-muted")}>
                    <input type="radio" name={`${uid}-branch`} className="sr-only" checked={branchYes === v} onChange={() => (setBranchYes(v), reset())} />
                    {v ? "Yes" : "No"}
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}

          <div>
            <p className="t-mono text-muted">Step</p>
            {step ? (
              <div className="mt-3 grid gap-3">
                <label className="grid gap-1.5 text-[0.85rem]">
                  Name
                  <input className="field-input" value={step.title} onChange={(e) => edit("title", e.target.value)} />
                </label>
                <label className="grid gap-1.5 text-[0.85rem]">
                  Detail
                  <input className="field-input" value={step.detail} onChange={(e) => edit("detail", e.target.value)} />
                </label>
                <p className="num text-[0.75rem] text-muted">
                  {step.kind} · x {step.x}, y {step.y}
                </p>
              </div>
            ) : (
              <p className="mt-2 text-[0.9rem] text-muted">Select a step on the canvas to edit it.</p>
            )}
          </div>

          <div className="mt-auto">
            <p className="t-mono text-muted">Test run log</p>
            <div ref={logBox} role="log" aria-live="polite" aria-label="Test run log" tabIndex={0} className="num mt-2 h-48 overflow-y-auto rounded-lg border border-grid bg-deep p-3 text-[0.75rem] leading-6">
              <ol>
              {log.length === 0 ? <li className="text-muted">Press Test run to execute this workflow with the test input.</li> : null}
              {log.map((l, i) => (
                <li key={i} className={cn("fade-in", l.tone === "ok" ? "text-frost" : l.tone === "warn" ? "text-amber" : "text-mint")}>
                  <span className="text-muted">{String(l.t).padStart(4, " ")}ms</span> {l.text}
                </li>
              ))}
              </ol>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
