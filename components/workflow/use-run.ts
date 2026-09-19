"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Workflow } from "@/lib/data";
import type { NodeState } from "./workflow-canvas";

export type LogLine = { t: number; text: string; tone: "info" | "ok" | "warn" | "muted" };

/** The path a run takes: branch nodes follow the "yes" or "no" edge. */
export function plan(workflow: Workflow, branchYes: boolean): { nodes: string[]; edges: string[] } {
  const nodes: string[] = [];
  const edges: string[] = [];
  let current = workflow.steps.find((s) => s.kind === "trigger")?.id;
  const seen = new Set<string>();
  while (current && !seen.has(current)) {
    seen.add(current);
    nodes.push(current);
    const out = workflow.edges.filter(([from]) => from === current);
    const step = workflow.steps.find((s) => s.id === current)!;
    const next = step.kind === "branch" ? out.find(([, , label]) => label === (branchYes ? "yes" : "no")) : out[0];
    if (!next) break;
    edges.push(`${next[0]}>${next[1]}`);
    current = next[1];
  }
  return { nodes, edges };
}

/**
 * Runs a workflow step by step: each node goes active → done with a
 * simulated duration, the edge it leaves by lights up, and a log line is
 * written. Under reduced motion the whole run completes almost instantly.
 */
export function useRun(workflow: Workflow) {
  const [states, setStates] = useState<Record<string, NodeState>>({});
  const [hot, setHot] = useState<Set<string>>(new Set());
  const [log, setLog] = useState<LogLine[]>([]);
  const [running, setRunning] = useState(false);
  const timers = useRef<number[]>([]);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clear, []);

  const reset = useCallback(() => {
    clear();
    setStates({});
    setHot(new Set());
    setLog([]);
    setRunning(false);
  }, []);

  const run = useCallback(
    (branchYes: boolean, context: string) => {
      clear();
      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const p = plan(workflow, branchYes);
      const skipped = workflow.steps.filter((s) => !p.nodes.includes(s.id)).map((s) => s.id);
      setStates(Object.fromEntries(skipped.map((id) => [id, "idle" as NodeState])));
      setHot(new Set());
      setRunning(true);
      setLog([{ t: 0, text: `▶ ${workflow.name} v${workflow.version} started · ${context}`, tone: "info" }]);

      let at = still ? 0 : 250;
      let elapsed = 0;
      p.nodes.forEach((id, i) => {
        const step = workflow.steps.find((s) => s.id === id)!;
        const ms = step.kind === "trigger" ? 4 : step.kind === "branch" ? 2 : 60 + ((id.charCodeAt(0) * 37 + i * 53) % 180);
        const wait = still ? 1 : 350 + ms * 2.2;
        timers.current.push(
          window.setTimeout(() => setStates((s) => ({ ...s, [id]: "active" })), at),
          window.setTimeout(() => {
            // Capture now: updaters run lazily, so reading `elapsed` inside one
            // would see later steps' time when timers fire close together.
            const t = (elapsed += ms);
            setStates((s) => ({ ...s, [id]: "done" }));
            const edge = p.edges[i];
            if (edge) setHot((h) => new Set(h).add(edge));
            const extra = step.kind === "branch" ? ` → ${branchYes ? "yes" : "no"}` : "";
            setLog((l) => [...l, { t, text: `✓ ${step.title}${extra}`, tone: step.kind === "branch" ? "warn" : "ok" }]);
          }, at + wait),
        );
        at += wait + (still ? 1 : 120);
      });
      timers.current.push(
        window.setTimeout(() => {
          setStates((s) => ({ ...s, ...Object.fromEntries(skipped.map((id) => [id, "skipped" as NodeState])) }));
          setLog((l) => [
            ...l,
            { t: elapsed, text: `■ Completed in ${elapsed} ms · ${p.nodes.length} steps · ${skipped.length} skipped`, tone: "info" },
          ]);
          setRunning(false);
        }, at),
      );
    },
    [workflow],
  );

  return { states, hot, log, running, run, reset };
}
