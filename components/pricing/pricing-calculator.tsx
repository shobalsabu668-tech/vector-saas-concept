"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { money, plans, quote, recommend, runsFromSlider, sliderFromRuns, type Billing, type Currency } from "@/lib/pricing";
import { cn } from "@/lib/site";

const nf = new Intl.NumberFormat("en-IN");

function Segmented<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  const id = useId();
  return (
    <fieldset>
      <legend className="sr-only">{label}</legend>
      <div className="flex rounded-lg border border-grid bg-deep p-1">
        {options.map((o) => (
          <label
            key={o.value}
            className={cn(
              "cursor-pointer rounded-md px-3 py-1.5 text-[0.85rem] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-mint",
              value === o.value ? "bg-raised text-frost" : "text-muted hover:text-frost",
            )}
          >
            <input type="radio" name={id} className="sr-only" checked={value === o.value} onChange={() => onChange(o.value)} />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/**
 * PRICING — move the sliders and every plan re-prices itself, with the
 * overage maths shown, and the cheapest plan that fits is marked.
 */
export function PricingCalculator() {
  const id = useId();
  const [seats, setSeats] = useState(12);
  const [runs, setRuns] = useState(80_000);
  const [billing, setBilling] = useState<Billing>("annual");
  const [currency, setCurrency] = useState<Currency>("INR");
  const best = recommend(seats, runs, currency, billing);

  return (
    <div>
      <div className="panel grid gap-8 p-6 md:grid-cols-2 md:p-8">
        <div>
          <label htmlFor={`${id}-seats`} className="flex items-baseline justify-between">
            <span className="font-[560]">Seats</span>
            <span className="num text-[1.6rem] text-frost">{seats}</span>
          </label>
          <input id={`${id}-seats`} type="range" min={1} max={200} value={seats} onChange={(e) => setSeats(Number(e.target.value))} className="mt-3 w-full accent-[var(--c-mint)]" aria-valuetext={`${seats} seats`} />
          <p className="mt-1 text-[0.85rem] text-muted">People who build or edit workflows. Viewers are free.</p>
        </div>
        <div>
          <label htmlFor={`${id}-runs`} className="flex items-baseline justify-between">
            <span className="font-[560]">Runs a month</span>
            <span className="num text-[1.6rem] text-frost">{nf.format(runs)}</span>
          </label>
          <input
            id={`${id}-runs`}
            type="range"
            min={0}
            max={100}
            step={0.5}
            value={sliderFromRuns(runs)}
            onChange={(e) => setRuns(runsFromSlider(Number(e.target.value)))}
            className="mt-3 w-full accent-[var(--c-mint)]"
            aria-valuetext={`${nf.format(runs)} runs a month`}
          />
          <p className="mt-1 text-[0.85rem] text-muted">One run = one trigger, however many steps it takes.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 md:col-span-2">
          <Segmented label="Billing period" value={billing} onChange={setBilling} options={[{ value: "annual", label: "Annual · save ~19%" }, { value: "monthly", label: "Monthly" }]} />
          <Segmented label="Currency" value={currency} onChange={setCurrency} options={[{ value: "INR", label: "₹ INR" }, { value: "USD", label: "$ USD" }]} />
        </div>
      </div>

      <ul className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-live="polite">
        {plans.map((p) => {
          const q = quote(p, seats, runs, currency, billing);
          const rec = p.id === best;
          return (
            <li key={p.id} className={cn("panel relative flex flex-col p-6", rec && "border-mint shadow-[0_0_0_1px_var(--c-mint)]")}>
              {rec ? <span className="t-mono absolute right-5 top-5 rounded-full bg-mint px-2.5 py-1 text-mint-ink">Best fit</span> : null}
              <h3 className="t-h3">{p.name}</h3>
              <p className="mt-1 min-h-12 text-[0.9rem] text-muted">{p.blurb}</p>

              <div className="mt-6 min-h-24">
                {p.id === "starter" ? (
                  <>
                    <p className="num text-[2rem] text-frost">{money(0, currency)}</p>
                    <p className={cn("text-[0.85rem]", q.fits ? "text-muted" : "text-amber")}>{q.fits ? "Free forever" : `Doesn't fit: ${q.reason}`}</p>
                  </>
                ) : p.id === "enterprise" ? (
                  <>
                    <p className="text-[2rem] font-[600] tracking-[-0.03em] text-frost">Custom</p>
                    <p className="text-[0.85rem] text-muted">Volume pricing and a contract</p>
                  </>
                ) : (
                  <>
                    <p>
                      <span className="num text-[2rem] text-frost">{money(q.monthly, currency)}</span>
                      <span className="text-[0.85rem] text-muted"> / month</span>
                    </p>
                    <p className="num text-[0.78rem] text-muted">
                      {seats} × {money(p.seat![currency][billing], currency)}
                      {q.overageCost ? ` + ${money(q.overageCost, currency)} overage` : ""}
                    </p>
                    {billing === "annual" ? <p className="num text-[0.78rem] text-muted">{money(q.monthly * 12, currency)} billed yearly</p> : null}
                  </>
                )}
              </div>

              {p.seat ? (
                <p className="mt-2 rounded-md bg-deep px-3 py-2 text-[0.8rem] text-muted">
                  Includes <span className="num text-frost">{nf.format(q.included)}</span> runs
                  {q.overRuns ? (
                    <>
                      ; <span className="num text-amber">{nf.format(q.overRuns)}</span> over at {money(p.overage![currency], currency)}/1k
                    </>
                  ) : null}
                </p>
              ) : null}

              <ul className="mb-6 mt-5 space-y-2 text-[0.88rem]">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <span aria-hidden="true" className="text-mint">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link href={p.id === "enterprise" ? "/pricing#contact" : "/demo"} className={cn("btn mt-auto w-full", rec ? "btn-mint" : "btn-line")}>
                {p.id === "enterprise" ? "Talk to us" : p.id === "starter" ? "Start free" : `Try ${p.name}`}
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-[0.82rem] text-muted">
        Prices exclude GST. VECTOR is a concept: these plans are fictional and nothing can be purchased.
      </p>
    </div>
  );
}
