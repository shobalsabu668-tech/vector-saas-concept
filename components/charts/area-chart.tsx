"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { smoothArea, smoothLine, toPoints, type Point } from "@/lib/chart";
import { cn } from "@/lib/site";

const W = 1000;
const H = 300;

/** Tween between point sets so a range change re-plots rather than jumps. */
function useTweened(target: Point[], still: boolean): Point[] {
  const [points, setPoints] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    if (still) {
      setPoints(target);
      from.current = target;
      return;
    }
    const origin = from.current;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 650);
      const e = 1 - Math.pow(1 - t, 3);
      setPoints(
        target.map(([x, y], i) => {
          const o = origin[Math.round((i / Math.max(1, target.length - 1)) * (origin.length - 1))] ?? [x, y];
          return [x, o[1] + (y - o[1]) * e];
        }),
      );
      if (t < 1) raf = requestAnimationFrame(tick);
      else from.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, still]);
  return points;
}

type Props = {
  data: number[];
  labels: string[];
  format: (v: number) => string;
  /** Accessible summary of what the chart shows. */
  summary: string;
  className?: string;
  height?: string;
};

/**
 * AREA CHART — hand-built SVG. Hover or focus it and use the arrow keys to
 * read any point; the value is announced. No charting library.
 */
export function AreaChart({ data, labels, format, summary, className, height = "h-64 md:h-72" }: Props) {
  const id = useId();
  const [still, setStill] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);

  const target = useMemo(() => toPoints(data, W, H, 0.1), [data]);
  const points = useTweened(target, still);
  const max = Math.max(...data);
  const min = Math.min(...data);

  const pick = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    const i = Math.round(((clientX - r.left) / r.width) * (data.length - 1));
    setHover(Math.max(0, Math.min(data.length - 1, i)));
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    setHover((h) => {
      const cur = h ?? data.length - 1;
      if (e.key === "Home") return 0;
      if (e.key === "End") return data.length - 1;
      return Math.max(0, Math.min(data.length - 1, cur + (e.key === "ArrowRight" ? 1 : -1)));
    });
  };

  const hp = hover !== null ? points[hover] : null;

  return (
    <figure className={cn("relative", className)}>
      <div
        ref={box}
        tabIndex={0}
        role="img"
        aria-label={summary}
        aria-describedby={`${id}-hint`}
        onKeyDown={onKey}
        onPointerMove={(e) => pick(e.clientX)}
        onPointerLeave={() => setHover(null)}
        onBlur={() => setHover(null)}
        className={cn("relative w-full touch-pan-y rounded-lg outline-offset-4", height)}
      >
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
          <defs>
            <linearGradient id={`${id}-fill`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="var(--c-mint)" stopOpacity="0.25" />
              <stop offset="1" stopColor="var(--c-mint)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((f) => (
            <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="var(--c-grid)" vectorEffect="non-scaling-stroke" />
          ))}
          <path d={smoothArea(points, H)} fill={`url(#${id}-fill)`} />
          <path d={smoothLine(points)} fill="none" stroke="var(--c-mint)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          {hp ? <line x1={hp[0]} x2={hp[0]} y1="0" y2={H} stroke="var(--c-muted)" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" /> : null}
        </svg>
        {hp && hover !== null ? (
          <>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-mint bg-deep"
              style={{ left: `${(hp[0] / W) * 100}%`, top: `${(hp[1] / H) * 100}%` }}
            />
            <span
              className="panel pointer-events-none absolute z-10 -translate-x-1/2 whitespace-nowrap px-3 py-2 shadow-xl"
              style={{ left: `clamp(4rem, ${(hp[0] / W) * 100}%, calc(100% - 4rem))`, top: 0 }}
            >
              <span className="num block text-[0.95rem] text-frost">{format(data[hover])}</span>
              <span className="t-mono block text-muted">{labels[hover]}</span>
            </span>
          </>
        ) : null}
      </div>
      <p id={`${id}-hint`} className="sr-only">
        Use the left and right arrow keys to read individual values.
      </p>
      <p className="sr-only" aria-live="polite">
        {hover !== null ? `${labels[hover]}: ${format(data[hover])}` : ""}
      </p>
      <figcaption className="t-mono mt-3 flex justify-between text-muted">
        <span>{labels[0]}</span>
        <span>
          peak {format(max)} · low {format(min)}
        </span>
        <span>{labels[labels.length - 1]}</span>
      </figcaption>
    </figure>
  );
}
