import Link from "next/link";
import { plans, money } from "@/lib/pricing";
import { faqs } from "@/lib/faq";
import { Faq } from "@/components/faq";

const trust = [
  { title: "Data stays in India", body: "Workspaces can be pinned to our Mumbai region. Nothing leaves it." },
  { title: "SSO and SCIM", body: "Sign in with your identity provider; people are added and removed automatically." },
  { title: "Audit log", body: "Every edit, run and permission change, kept for a year and exportable." },
  { title: "Encrypted everywhere", body: "TLS in transit, AES-256 at rest, and secrets stored in a separate vault." },
];

/** SECURITY, PRICING TEASER, FAQ, CTA — the closing arguments. */
export function Closing() {
  const team = plans.find((p) => p.id === "team")!;
  const scale = plans.find((p) => p.id === "scale")!;
  return (
    <>
      <section aria-labelledby="trust-title" className="section border-t border-grid">
        <div className="shell">
          <p className="t-eyebrow" data-reveal>
            Security
          </p>
          <h2 id="trust-title" className="t-h2 mt-4 max-w-[18ch]" data-reveal style={{ "--d": 1 } as React.CSSProperties}>
            Built for teams that get audited.
          </h2>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trust.map((t, i) => (
              <li key={t.title} className="panel p-6" data-reveal style={{ "--d": i } as React.CSSProperties}>
                <span aria-hidden="true" className="grid size-9 place-items-center rounded-lg bg-deep text-mint">
                  ◆
                </span>
                <h3 className="mt-5 font-[600]">{t.title}</h3>
                <p className="mt-2 text-[0.92rem] text-muted">{t.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="price-title" className="section border-t border-grid">
        <div className="shell grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="t-eyebrow">Pricing</p>
            <h2 id="price-title" className="t-h2 mt-4">
              Free to start. Priced per seat, not per surprise.
            </h2>
            <p className="t-lead mt-6">
              Team from <span className="num text-frost">{money(team.seat!.INR.annual, "INR")}</span> and Scale from{" "}
              <span className="num text-frost">{money(scale.seat!.INR.annual, "INR")}</span> per seat a month, with runs included and a
              published overage rate.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-5 lg:col-start-8 lg:justify-end">
            <Link href="/pricing" className="btn btn-mint min-h-12 px-6">
              Calculate your price
            </Link>
            <Link href="/demo" className="btn btn-line min-h-12 px-6">
              Open the live demo
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="section border-t border-grid">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <h2 id="faq-title" className="t-h2 lg:col-span-4">
            Questions
          </h2>
          <div className="lg:col-span-7 lg:col-start-6">
            <Faq items={faqs} />
          </div>
        </div>
      </section>

      <section aria-labelledby="cta-title" className="bg-grid border-t border-grid">
        <div className="shell py-24 text-center md:py-32">
          <h2 id="cta-title" className="t-display mx-auto max-w-[14ch]">
            The best way to understand it is to use it.
          </h2>
          <Link href="/demo" className="btn btn-mint mt-10 min-h-12 px-7">
            Open the live demo
          </Link>
          <p className="t-mono mt-4 text-muted">No sign-up · runs in your browser · press ⌘K inside</p>
        </div>
      </section>
    </>
  );
}
