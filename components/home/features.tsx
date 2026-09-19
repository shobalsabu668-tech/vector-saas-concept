import { RoleMatrix } from "./role-matrix";

/** A run trace: each step as a bar on a shared timeline. */
function Trace() {
  const rows = [
    { name: "New order", start: 0, ms: 4 },
    { name: "Enrich customer", start: 4, ms: 118 },
    { name: "Order over ₹50,000?", start: 122, ms: 2 },
    { name: "Create invoice", start: 124, ms: 164 },
    { name: "Email the customer", start: 288, ms: 71 },
  ];
  const total = 359;
  return (
    <div className="rounded-lg border border-grid bg-deep p-4" role="img" aria-label="Trace of one run: five steps, 359 milliseconds in total; creating the invoice took longest at 164 milliseconds.">
      <div className="t-mono mb-3 flex justify-between text-muted">
        <span>run_4f2k9a1</span>
        <span className="text-mint">359 ms</span>
      </div>
      <ul className="space-y-2">
        {rows.map((r) => (
          <li key={r.name} className="grid grid-cols-[8.5rem_1fr] items-center gap-3 text-[0.78rem]">
            <span className="truncate text-muted">{r.name}</span>
            <span className="relative h-5 rounded bg-panel">
              <span className="absolute inset-y-0 rounded bg-mint/80" style={{ left: `${(r.start / total) * 100}%`, width: `max(3px, ${(r.ms / total) * 100}%)` }} />
              <span className="num absolute inset-y-0 flex items-center text-[0.68rem] text-frost" style={{ left: `calc(${((r.start + r.ms) / total) * 100}% + 6px)` }}>
                {r.ms} ms
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A version diff: what changed between v13 and v14. */
function Diff() {
  const lines = [
    { sign: "+", text: "branch  amount > 50000 → Ask for approval" },
    { sign: "~", text: "retry   Create invoice: 3 attempts, 2s backoff" },
    { sign: "−", text: "notify  #finance on every order" },
  ];
  return (
    <div className="rounded-lg border border-grid bg-deep p-4 font-mono text-[0.78rem]" role="img" aria-label="Version 14 compared with version 13: added an approval branch for large orders, changed invoice retries, removed a noisy notification.">
      <div className="t-mono mb-3 flex justify-between text-muted">
        <span>v13 → v14</span>
        <span>Priya N. · 2 hours ago</span>
      </div>
      <ul className="space-y-1.5">
        {lines.map((l) => (
          <li key={l.text} className={l.sign === "+" ? "text-mint" : l.sign === "−" ? "text-rose" : "text-amber"}>
            <span className="mr-3 inline-block w-3">{l.sign}</span>
            {l.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Retries with backoff, as a timeline. */
function Retries() {
  const attempts = [
    { n: 1, at: "0 s", result: "Timeout from accounting API", ok: false },
    { n: 2, at: "+2 s", result: "503 Service Unavailable", ok: false },
    { n: 3, at: "+6 s", result: "Invoice INV-20931 created", ok: true },
  ];
  return (
    <ol className="rounded-lg border border-grid bg-deep p-4 text-[0.82rem]" aria-label="Retry timeline">
      {attempts.map((a) => (
        <li key={a.n} className="relative flex gap-3 pb-4 pl-5 last:pb-0">
          <span aria-hidden="true" className={`absolute left-0 top-1.5 size-2.5 rounded-full ${a.ok ? "bg-mint" : "bg-amber"}`} />
          <span className="num w-10 shrink-0 text-muted">{a.at}</span>
          <span className={a.ok ? "text-frost" : "text-muted"}>
            Attempt {a.n}: {a.result}
          </span>
        </li>
      ))}
    </ol>
  );
}

const features = [
  { id: "observe", title: "See every run", body: "Each run is traced step by step, with timings, inputs and outputs. Find the slow step before a customer does.", visual: <Trace /> },
  { id: "version", title: "Change it safely", body: "Every edit is a version. Compare, roll back, or run the new version on a copy of real traffic first.", visual: <Diff /> },
  { id: "retry", title: "Retries that don't page you", body: "Flaky APIs are retried with backoff. You hear about it only if the last attempt fails.", visual: <Retries /> },
  { id: "access", title: "Access that matches your org chart", body: "Roles decide who can view, run, edit or publish, and who sees which workflows. Try it.", visual: <RoleMatrix /> },
];

/** FEATURES AS OUTCOMES — each claim sits beside the piece of UI that proves it. */
export function Features() {
  return (
    <section id="product" aria-labelledby="features-title" className="section scroll-mt-16 border-t border-grid">
      <div className="shell">
        <p className="t-eyebrow" data-reveal>
          Product
        </p>
        <h2 id="features-title" className="t-h2 mt-4 max-w-[20ch]" data-reveal style={{ "--d": 1 } as React.CSSProperties}>
          Features you can check, not just read about.
        </h2>
        <ul className="mt-14 grid gap-4 lg:grid-cols-2">
          {features.map((f, i) => (
            <li key={f.id} className="panel flex min-w-0 flex-col gap-6 p-6 md:p-8" data-reveal style={{ "--d": i % 2 } as React.CSSProperties}>
              <div>
                <h3 className="t-h3">{f.title}</h3>
                <p className="mt-2 max-w-md text-muted">{f.body}</p>
              </div>
              <div className="mt-auto">{f.visual}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
