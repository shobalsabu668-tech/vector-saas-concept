import type { QA } from "@/lib/faq";

/** Accordion on native <details>. */
export function Faq({ items }: { items: QA[] }) {
  return (
    <div className="divide-y divide-grid border-y border-grid">
      {items.map((f) => (
        <details key={f.q} name="faq" className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-[560] [&::-webkit-details-marker]:hidden">
            {f.q}
            <span aria-hidden="true" className="num text-muted transition-transform duration-300 group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="-mt-1 max-w-2xl pb-6 text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
