import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog",
  description: "What's new in VECTOR (concept).",
  alternates: { canonical: "/changelog" },
};

const entries = [
  { version: "2.8", date: "2026-09-12", title: "Replay from any step", items: ["Failed runs can be replayed from the step that failed, with the original input.", "Replays are marked in the run log and linked to the original run."], tag: "New" },
  { version: "2.7", date: "2026-08-28", title: "Data residency in India", items: ["Scale and Enterprise workspaces can be pinned to the Mumbai region.", "Region is shown on every run and in the audit log."], tag: "New" },
  { version: "2.6", date: "2026-08-07", title: "Version diff", items: ["Compare any two versions of a workflow side by side.", "Roll back to a previous version in one click."], tag: "Improved" },
  { version: "2.5", date: "2026-07-18", title: "Faster cold starts", items: ["p95 step latency down from 212 ms to 184 ms.", "Webhook triggers now acknowledge in under 50 ms."], tag: "Performance" },
  { version: "2.4", date: "2026-06-30", title: "Command palette", items: ["Press ⌘K (Ctrl K) anywhere to jump to a workflow, a run or a setting.", "Every action in the sidebar is available from the keyboard."], tag: "New" },
];

const fmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default function ChangelogPage() {
  return (
    <main id="main" className="flex-1">
      <div className="shell grid gap-12 py-16 md:py-24 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="t-eyebrow">Changelog</p>
          <h1 className="t-h2 mt-4">What&rsquo;s new</h1>
          <p className="t-lead mt-4">A fictional release history, written the way a real one would be.</p>
        </div>
        <ol className="relative border-l border-grid lg:col-span-7 lg:col-start-6">
          {entries.map((e) => (
            <li key={e.version} className="relative pb-14 pl-8 last:pb-0">
              <span aria-hidden="true" className="absolute -left-[5px] top-2 size-2.5 rounded-full bg-mint" />
              <p className="num flex flex-wrap items-center gap-3 text-[0.8rem] text-muted">
                <time dateTime={e.date}>{fmt.format(new Date(e.date))}</time>
                <span>v{e.version}</span>
                <span className="rounded-full border border-grid px-2 py-0.5 text-mint">{e.tag}</span>
              </p>
              <h2 className="t-h3 mt-3">{e.title}</h2>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted marker:text-grid">
                {e.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
