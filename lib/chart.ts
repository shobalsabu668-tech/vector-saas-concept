/**
 * Tiny charting helpers — hand-built SVG, no charting library.
 */

export type Point = [number, number];

/** Maps a data series into a width × height box (y inverted, padded). */
export function toPoints(data: number[], width: number, height: number, pad = 0.12): Point[] {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  return data.map((v, i) => [
    (i / (data.length - 1)) * width,
    height - ((v - min) / span) * height * (1 - pad * 2) - height * pad,
  ]);
}

/** Catmull-Rom → cubic Bézier: a smooth line through every point. */
export function smoothLine(points: Point[], tension = 0.5): string {
  if (points.length < 2) return "";
  let d = `M${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1[0] + ((p2[0] - p0[0]) / 6) * tension * 2;
    const c1y = p1[1] + ((p2[1] - p0[1]) / 6) * tension * 2;
    const c2x = p2[0] - ((p3[0] - p1[0]) / 6) * tension * 2;
    const c2y = p2[1] - ((p3[1] - p1[1]) / 6) * tension * 2;
    d += `C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

/** The same line closed down to the baseline, for area fills. */
export function smoothArea(points: Point[], height: number): string {
  const line = smoothLine(points);
  const last = points[points.length - 1];
  return `${line}L${last[0].toFixed(1)} ${height}L${points[0][0].toFixed(1)} ${height}Z`;
}

/** Deterministic series generator for concept dashboards (not real data). */
export function series(length: number, seed: number, base = 50, amp = 20, trend = 0.4): number[] {
  const out: number[] = [];
  for (let i = 0; i < length; i++) {
    const n = Math.sin(i * 0.55 + seed) * 0.6 + Math.sin(i * 1.7 + seed * 2.3) * 0.3 + Math.sin(i * 0.19 + seed * 0.7) * 0.8;
    out.push(base + n * amp + i * trend);
  }
  return out;
}
