"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { StepKind, Workflow, WorkflowStep } from "@/lib/data";
import { cn } from "@/lib/site";

export const NODE_W = 196;
export const NODE_H = 76;

const kindStyle: Record<StepKind, { label: string; dot: string }> = {
  trigger: { label: "Trigger", dot: "bg-sky" },
  action: { label: "Action", dot: "bg-mint" },
  branch: { label: "Branch", dot: "bg-amber" },
  notify: { label: "Notify", dot: "bg-rose" },
  delay: { label: "Delay", dot: "bg-muted" },
};

export type NodeState = "idle" | "active" | "done" | "skipped" | "failed";

type Props = {
  workflow: Workflow;
  /** Per-node run state for the simulation. */
  states?: Record<string, NodeState>;
  /** Edges (from→to) that carried the current run. */
  hot?: Set<string>;
  /** Allow dragging nodes (mouse, touch, or arrow keys when focused). */
  editable?: boolean;
  onMove?: (id: string, x: number, y: number) => void;
  selected?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
};

/** A cubic Bézier from the right edge of one node to the left edge of another. */
function edgePath(a: WorkflowStep, b: WorkflowStep): string {
  const x1 = a.x + NODE_W;
  const y1 = a.y + NODE_H / 2;
  const x2 = b.x;
  const y2 = b.y + NODE_H / 2;
  const dx = Math.max(40, (x2 - x1) * 0.5);
  return `M${x1} ${y1} C${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`;
}

/**
 * WORKFLOW CANVAS — nodes as real elements, edges as SVG curves that follow
 * them. In the demo, nodes can be dragged (or nudged with the arrow keys),
 * and a run lights each step and edge in sequence.
 */
export function WorkflowCanvas({ workflow, states = {}, hot = new Set(), editable = false, onMove, selected, onSelect, className }: Props) {
  const drag = useRef<{ id: string; dx: number; dy: number; scale: number } | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const width = Math.max(...workflow.steps.map((s) => s.x)) + NODE_W + 40;
  const height = Math.max(...workflow.steps.map((s) => s.y)) + NODE_H + 40;

  // Scale the whole canvas down to fit its container (never up), but not so
  // far that labels become unreadable; below that, it scrolls sideways.
  const [fit, setFit] = useState(1);
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setFit(Math.max(0.62, Math.min(1, e.contentRect.width / width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);
  const byId = Object.fromEntries(workflow.steps.map((s) => [s.id, s]));

  const onDown = (e: PointerEvent<HTMLDivElement>, s: WorkflowStep) => {
    onSelect?.(s.id);
    if (!editable) return;
    const box = stage.current!.getBoundingClientRect();
    const scale = box.width / width || 1;
    drag.current = { id: s.id, dx: (e.clientX - box.left) / scale - s.x, dy: (e.clientY - box.top) / scale - s.y, scale };
    setDragging(s.id);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onMoveEv = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const box = stage.current!.getBoundingClientRect();
    const x = Math.round(((e.clientX - box.left) / d.scale - d.dx) / 10) * 10;
    const y = Math.round(((e.clientY - box.top) / d.scale - d.dy) / 10) * 10;
    onMove?.(d.id, Math.max(0, Math.min(width - NODE_W, x)), Math.max(0, Math.min(height - NODE_H, y)));
  };

  const onUp = () => {
    drag.current = null;
    setDragging(null);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>, s: WorkflowStep) => {
    if (!editable) return;
    const step = e.shiftKey ? 50 : 10;
    const map: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    const m = map[e.key];
    if (!m) return;
    e.preventDefault();
    onMove?.(s.id, Math.max(0, s.x + m[0]), Math.max(0, s.y + m[1]));
  };

  return (
    <div ref={frame} role="region" aria-label={`${workflow.name} canvas`} tabIndex={0} className={cn("relative w-full overflow-x-auto", className)} style={{ height: height * fit }}>
      <div ref={stage} className="relative origin-top-left" style={{ width, height, minWidth: width, transform: fit < 1 ? `scale(${fit})` : undefined }}>
        <svg width={width} height={height} className="absolute inset-0" aria-hidden="true">
          {workflow.edges.map(([from, to, label]) => {
            const a = byId[from];
            const b = byId[to];
            if (!a || !b) return null;
            const isHot = hot.has(`${from}>${to}`);
            const d = edgePath(a, b);
            return (
              <g key={`${from}>${to}`}>
                <path d={d} fill="none" stroke="var(--c-grid)" strokeWidth="2" />
                {isHot ? <path d={d} fill="none" stroke="var(--c-mint)" strokeWidth="2" className="edge-flow" /> : null}
                {label ? (
                  <text x={(a.x + NODE_W + b.x) / 2} y={(a.y + b.y) / 2 + NODE_H / 2 - 8} textAnchor="middle" className="fill-muted font-mono text-[11px]">
                    {label}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>

        <ol aria-label={`${workflow.name} steps`}>
          {workflow.steps.map((s, i) => {
            const st = states[s.id] ?? "idle";
            const k = kindStyle[s.kind];
            return (
              <li key={s.id} className="contents">
                <div
                  role={editable ? "button" : undefined}
                  tabIndex={editable || onSelect ? 0 : undefined}
                  aria-label={`Step ${i + 1}: ${k.label}, ${s.title}. ${s.detail}.${st !== "idle" ? ` ${st}.` : ""}${editable ? " Arrow keys move this step." : ""}`}
                  aria-pressed={onSelect ? selected === s.id : undefined}
                  onPointerDown={(e) => onDown(e, s)}
                  onPointerMove={onMoveEv}
                  onPointerUp={onUp}
                  onPointerCancel={onUp}
                  onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === " ") && onSelect) {
                      e.preventDefault();
                      onSelect(s.id);
                    }
                    onKey(e, s);
                  }}
                  className={cn(
                    "absolute select-none rounded-xl border bg-panel p-3 shadow-[0_8px_24px_rgb(0_0_0/0.25)] transition-[border-color,box-shadow,opacity] duration-300",
                    editable && "cursor-grab touch-none active:cursor-grabbing",
                    dragging === s.id && "z-10 shadow-[0_16px_40px_rgb(0_0_0/0.4)]",
                    selected === s.id ? "border-mint" : "border-grid",
                    st === "active" && "border-mint shadow-[0_0_0_4px_rgb(92_242_176/0.18)]",
                    st === "done" && "border-mint/60",
                    st === "failed" && "border-rose",
                    st === "skipped" && "opacity-40",
                  )}
                  style={{ left: s.x, top: s.y, width: NODE_W, height: NODE_H }}
                >
                  <span className="t-mono flex items-center gap-2 text-muted">
                    <span className={cn("size-1.5 rounded-full", k.dot)} aria-hidden="true" />
                    {k.label}
                    {st === "active" ? <span className="ml-auto text-mint">running</span> : st === "done" ? <span className="ml-auto text-mint">✓</span> : null}
                  </span>
                  <span className="mt-1 block truncate text-[0.92rem] font-[560] text-frost">{s.title}</span>
                  <span className="block truncate text-[0.78rem] text-muted">{s.detail}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
