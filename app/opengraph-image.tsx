import { ImageResponse } from "next/og";
import { author, site } from "@/lib/site";
import { series } from "@/lib/data";
import { smoothArea, smoothLine, toPoints } from "@/lib/chart";

export const alt = `${site.name} — ${site.tagline} A concept by ${author.name}.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TITLE = site.tagline;
const SMALL = `VECTOR · WORKFLOW AUTOMATION · CONCEPT BY ${author.name.toUpperCase()}`;

async function loadFont(axes: string, text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(`https://fonts.googleapis.com/css2?family=Mona+Sans:wdth,wght@${axes}&text=${encodeURIComponent(text)}`, {
      headers: { "User-Agent": "Mozilla/4.0" },
      signal: AbortSignal.timeout(4000),
    }).then((r) => r.text());
    const url = /src: url\((.+?)\) format\('truetype'\)/.exec(css)?.[1];
    if (!url) return null;
    return await fetch(url, { signal: AbortSignal.timeout(4000) }).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

/** Social card: the headline over the product's own throughput chart. */
export default async function OpenGraphImage() {
  const [bold, label] = await Promise.all([loadFont("108,600", TITLE), loadFont("100,500", SMALL)]);
  const branded = Boolean(bold && label);
  const pts = toPoints(series(28, 1.3, 1520, 380, 12), 1200, 300, 0.12);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#0a0d12", color: "#dce3ea", position: "relative" }}>
        <svg width="1200" height="630" style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 25 }, (_, i) => (
            <line key={`v${i}`} x1={i * 50} x2={i * 50} y1="0" y2="630" stroke="rgba(220,227,234,0.05)" />
          ))}
          {Array.from({ length: 13 }, (_, i) => (
            <line key={`h${i}`} x1="0" x2="1200" y1={i * 50} y2={i * 50} stroke="rgba(220,227,234,0.05)" />
          ))}
          <g transform="translate(0 330)">
            <path d={smoothArea(pts, 300)} fill="rgba(92,242,176,0.14)" />
            <path d={smoothLine(pts)} fill="none" stroke="#5cf2b0" strokeWidth="3" />
          </g>
        </svg>
        <div style={{ display: "flex", flexDirection: "column", padding: 64, position: "relative" }}>
          <div style={{ fontSize: 17, letterSpacing: 3, color: "#5cf2b0", fontFamily: branded ? "Label" : "sans-serif" }}>{SMALL}</div>
          <div style={{ fontSize: 84, lineHeight: 1, marginTop: 28, letterSpacing: -3, maxWidth: 900, fontFamily: branded ? "Bold" : "sans-serif" }}>{TITLE}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: branded
        ? [
            { name: "Bold", data: bold!, weight: 600, style: "normal" },
            { name: "Label", data: label!, weight: 500, style: "normal" },
          ]
        : undefined,
    },
  );
}
