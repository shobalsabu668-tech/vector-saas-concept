import { WorkflowRunner } from "@/components/workflow/workflow-runner";

const steps = [
  { n: "01", title: "Trigger", body: "Anything that happens in a tool you use: an order, a form, a ticket, a schedule." },
  { n: "02", title: "Steps", body: "Look things up, transform them, branch on a condition, wait for approval." },
  { n: "03", title: "Signal", body: "Every run is traced, timed and replayable. When something fails, you know where and why." },
];

export function HowItWorks() {
  return (
    <section id="workflow" aria-labelledby="how-title" className="section scroll-mt-16">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="t-eyebrow" data-reveal>
              How it works
            </p>
            <h2 id="how-title" className="t-h2 mt-4" data-reveal style={{ "--d": 1 } as React.CSSProperties}>
              Don&rsquo;t take our word for it. Run one.
            </h2>
          </div>
          <ol className="grid gap-6 sm:grid-cols-3 lg:col-span-7">
            {steps.map((s, i) => (
              <li key={s.n} className="border-t border-grid pt-4" data-reveal style={{ "--d": i + 1 } as React.CSSProperties}>
                <p className="num text-mint">{s.n}</p>
                <h3 className="mt-2 font-[600]">{s.title}</h3>
                <p className="mt-1 text-[0.92rem] text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-12" data-reveal>
          <WorkflowRunner />
        </div>
      </div>
    </section>
  );
}
