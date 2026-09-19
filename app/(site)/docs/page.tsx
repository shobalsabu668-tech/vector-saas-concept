import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";

export const metadata: Metadata = {
  title: "Quickstart",
  description: "Create your first VECTOR workflow from the CLI (concept documentation).",
  alternates: { canonical: "/docs" },
};

const toc = [
  { id: "install", label: "Install the CLI" },
  { id: "define", label: "Define a workflow" },
  { id: "deploy", label: "Deploy it" },
  { id: "trigger", label: "Trigger a run" },
  { id: "watch", label: "Watch it run" },
];

export default function DocsPage() {
  return (
    <main id="main" className="flex-1">
      <div className="shell grid gap-12 py-12 md:py-16 lg:grid-cols-[14rem_1fr]">
        <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start">
          <p className="t-mono text-muted">Quickstart</p>
          <ol className="mt-3 space-y-1.5 text-[0.9rem]">
            {toc.map((t, i) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className="text-muted hover:text-mint">
                  <span className="num mr-2">{i + 1}.</span>
                  {t.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="min-w-0 max-w-3xl">
          <p className="t-eyebrow">Docs</p>
          <h1 className="t-h2 mt-4">Your first workflow in five minutes</h1>
          <p className="t-lead mt-5">
            This guide builds the <em>Order to invoice</em> workflow from the homepage from the command line. (It&rsquo;s concept
            documentation: the CLI doesn&rsquo;t exist, but the page shows how real docs for it would read.)
          </p>

          <section id="install" className="mt-12 scroll-mt-24">
            <h2 className="t-h3">1. Install the CLI</h2>
            <p className="mt-3 text-muted">The CLI needs Node.js 20 or later.</p>
            <CodeBlock lang="bash" code={`npm install -g @vector-concept/cli\nvector login`} />
          </section>

          <section id="define" className="mt-12 scroll-mt-24">
            <h2 className="t-h3">2. Define a workflow</h2>
            <p className="mt-3 text-muted">Workflows are TypeScript. Steps are plain async functions; VECTOR handles retries, tracing and versioning.</p>
            <CodeBlock
              lang="ts"
              file="workflows/order-to-invoice.ts"
              code={`import { workflow, step } from "@vector-concept/sdk";

export default workflow("order-to-invoice", {
  trigger: { webhook: "storefront.order.created" },
  retries: { attempts: 3, backoff: "2s" },
}, async (order) => {
  const customer = await step("Enrich customer", () => crm.find(order.email));

  if (order.amount > 50_000) {
    await step("Ask for approval", () => chat.approve("#finance", order));
  }

  const invoice = await step("Create invoice", () => accounting.invoice(order, customer));
  await step("Email the customer", () => email.send(customer, invoice.pdf));
});`}
            />
          </section>

          <section id="deploy" className="mt-12 scroll-mt-24">
            <h2 className="t-h3">3. Deploy it</h2>
            <p className="mt-3 text-muted">Every deploy creates a new version you can diff and roll back.</p>
            <CodeBlock lang="bash" code={`vector deploy workflows/order-to-invoice.ts\n# ✓ order-to-invoice v1 deployed · region ap-south-1`} />
          </section>

          <section id="trigger" className="mt-12 scroll-mt-24">
            <h2 className="t-h3">4. Trigger a run</h2>
            <CodeBlock lang="bash" code={`vector run order-to-invoice --input '{"email":"asha@example.com","amount":86000}'`} />
          </section>

          <section id="watch" className="mt-12 scroll-mt-24">
            <h2 className="t-h3">5. Watch it run</h2>
            <p className="mt-3 text-muted">
              Stream the trace to your terminal, or open the run in the dashboard. You can try the dashboard now in the{" "}
              <Link href="/demo/runs" className="text-mint underline underline-offset-4">
                live demo
              </Link>
              .
            </p>
            <CodeBlock lang="bash" code={`vector runs tail order-to-invoice\n  4 ms   ✓ New order\n118 ms   ✓ Enrich customer\n  2 ms   ✓ Order over ₹50,000? → yes\n...`} />
          </section>
        </article>
      </div>
    </main>
  );
}
