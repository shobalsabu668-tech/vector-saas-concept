import type { Metadata } from "next";
import { PricingCalculator } from "@/components/pricing/pricing-calculator";
import { ContactSales } from "@/components/pricing/contact-sales";
import { Faq } from "@/components/faq";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Per-seat pricing with runs included and a published overage rate. Calculate your price in rupees or dollars.",
  alternates: { canonical: "/pricing" },
};

const compare: [string, string, string, string, string][] = [
  ["Seats", "Up to 3", "Up to 100", "Up to 1,000", "Unlimited"],
  ["Runs included", "1,000 / month", "10,000 per seat", "25,000 per seat", "Custom"],
  ["Active workflows", "5", "Unlimited", "Unlimited", "Unlimited"],
  ["Branches, retries, schedules", "✓", "✓", "✓", "✓"],
  ["Run history", "7 days", "90 days", "1 year", "Custom"],
  ["Versioning and diff", "—", "✓", "✓", "✓"],
  ["SSO and SCIM", "—", "—", "✓", "✓"],
  ["Audit log", "—", "—", "✓", "✓"],
  ["Data residency in India", "—", "—", "✓", "✓"],
  ["Uptime SLA", "—", "—", "99.9%", "99.99%"],
  ["Support", "Community", "Email", "Priority", "Named engineer"],
];

const faqs = [
  { q: "What happens if we go over our runs?", a: "Nothing stops. Extra runs are billed per thousand at the overage rate shown for your plan, and you get an email at 80% and 100% of your included runs." },
  { q: "Who counts as a seat?", a: "Owners, Admins and Editors: anyone who can change a workflow. Viewers, who can see runs and dashboards, are free and unlimited." },
  { q: "Can we pay in rupees?", a: "Yes. Prices are set in INR and USD rather than converted, and Indian customers are invoiced with GST." },
  { q: "Is there a contract?", a: "Not on Team or Scale: pay monthly, or annually for the discount. Enterprise plans are annual contracts." },
];

export default function PricingPage() {
  return (
    <main id="main" className="flex-1">
      <section className="bg-grid border-b border-grid">
        <div className="shell pb-12 pt-16 text-center md:pt-20">
          <p className="t-eyebrow">Pricing</p>
          <h1 className="t-display mx-auto mt-4 max-w-[16ch]">Pricing that does the maths for you.</h1>
          <p className="t-lead mx-auto mt-6 max-w-2xl">Move the sliders. Every plan re-prices itself, shows its working, and the cheapest one that fits is marked.</p>
        </div>
      </section>

      <section aria-labelledby="calc-title" className="shell py-12">
        <h2 id="calc-title" className="sr-only">
          Calculate your price
        </h2>
        <PricingCalculator />
      </section>

      <section aria-labelledby="compare-title" className="section border-t border-grid">
        <div className="shell">
          <h2 id="compare-title" className="t-h2">
            Compare plans
          </h2>
          <div className="panel relative mt-10 overflow-x-auto" role="region" aria-labelledby="compare-title" tabIndex={0}>
            <table className="w-full min-w-[46rem] text-left text-[0.9rem]">
              <caption className="sr-only">Features by plan</caption>
              <thead>
                <tr className="border-b border-grid">
                  <th scope="col" className="px-5 py-4 font-[500] text-muted">
                    Feature
                  </th>
                  {["Starter", "Team", "Scale", "Enterprise"].map((p) => (
                    <th key={p} scope="col" className="px-4 py-4 font-[600]">
                      {p}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compare.map(([feature, ...cells]) => (
                  <tr key={feature} className="border-b border-grid last:border-0">
                    <th scope="row" className="px-5 py-3.5 font-[400]">
                      {feature}
                    </th>
                    {cells.map((c, i) => (
                      <td key={i} className={c === "—" ? "px-4 py-3.5 text-muted" : c === "✓" ? "px-4 py-3.5 text-mint" : "px-4 py-3.5"}>
                        {c === "✓" ? (
                          <>
                            <span aria-hidden="true">✓</span>
                            <span className="sr-only">Included</span>
                          </>
                        ) : c === "—" ? (
                          <>
                            <span aria-hidden="true">—</span>
                            <span className="sr-only">Not included</span>
                          </>
                        ) : (
                          c
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section aria-labelledby="pfaq" className="section border-t border-grid">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <h2 id="pfaq" className="t-h2 lg:col-span-4">
            Billing questions
          </h2>
          <div className="lg:col-span-7 lg:col-start-6">
            <Faq items={faqs} />
          </div>
        </div>
      </section>

      <section id="contact" aria-labelledby="contact-title" className="section scroll-mt-16 border-t border-grid">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="t-eyebrow">Enterprise</p>
            <h2 id="contact-title" className="t-h2 mt-4">
              Talk to us about volume.
            </h2>
            <p className="t-lead mt-6">Custom run volume, a dedicated environment and an SLA. Tell us what you&rsquo;re automating.</p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <ContactSales />
          </div>
        </div>
      </section>
    </main>
  );
}
