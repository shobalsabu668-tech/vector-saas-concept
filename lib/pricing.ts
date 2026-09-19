/**
 * PRICING — fictional plans with honest maths: per-seat price, included
 * runs that scale with seats, and a published overage rate. No "contact us"
 * for the basics.
 */

export type Currency = "INR" | "USD";
export type Billing = "monthly" | "annual";

export type Plan = {
  id: "starter" | "team" | "scale" | "enterprise";
  name: string;
  blurb: string;
  /** Per seat per month, by billing period. null = free / custom. */
  seat: Record<Currency, Record<Billing, number>> | null;
  maxSeats: number;
  /** Included runs per seat per month (Starter: flat). */
  runsPerSeat: number;
  flatRuns?: number;
  /** Overage per 1,000 runs. */
  overage: Record<Currency, number> | null;
  features: string[];
};

export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    blurb: "For trying VECTOR on one real workflow.",
    seat: null,
    maxSeats: 3,
    runsPerSeat: 0,
    flatRuns: 1_000,
    overage: null,
    features: ["Up to 3 seats", "1,000 runs a month", "5 active workflows", "7-day run history"],
  },
  {
    id: "team",
    name: "Team",
    blurb: "For teams automating the work between tools.",
    seat: { INR: { monthly: 1_599, annual: 1_299 }, USD: { monthly: 20, annual: 16 } },
    maxSeats: 100,
    runsPerSeat: 10_000,
    overage: { INR: 40, USD: 0.5 },
    features: ["10,000 runs per seat", "Unlimited workflows", "Branches, retries, schedules", "90-day run history", "Email support"],
  },
  {
    id: "scale",
    name: "Scale",
    blurb: "For companies running operations on VECTOR.",
    seat: { INR: { monthly: 2_999, annual: 2_499 }, USD: { monthly: 36, annual: 30 } },
    maxSeats: 1_000,
    runsPerSeat: 25_000,
    overage: { INR: 30, USD: 0.36 },
    features: ["25,000 runs per seat", "SSO and SCIM", "Audit log and versioning", "Data residency in India", "1-year run history", "Priority support"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    blurb: "For custom volume, contracts and support.",
    seat: null,
    maxSeats: Infinity,
    runsPerSeat: 0,
    overage: null,
    features: ["Custom run volume", "Dedicated environment", "99.99% uptime SLA", "Named success engineer"],
  },
];

export type Quote = {
  plan: Plan;
  fits: boolean;
  reason?: string;
  seatCost: number;
  included: number;
  overRuns: number;
  overageCost: number;
  monthly: number;
};

export function quote(plan: Plan, seats: number, runs: number, currency: Currency, billing: Billing): Quote {
  if (plan.id === "starter") {
    const fits = seats <= plan.maxSeats && runs <= (plan.flatRuns ?? 0);
    return { plan, fits, reason: fits ? undefined : seats > plan.maxSeats ? "Up to 3 seats" : "Up to 1,000 runs", seatCost: 0, included: plan.flatRuns ?? 0, overRuns: 0, overageCost: 0, monthly: 0 };
  }
  if (!plan.seat || !plan.overage) return { plan, fits: true, seatCost: 0, included: 0, overRuns: 0, overageCost: 0, monthly: 0 };
  const seatCost = plan.seat[currency][billing] * seats;
  const included = plan.runsPerSeat * seats;
  const overRuns = Math.max(0, runs - included);
  const overageCost = Math.ceil(overRuns / 1000) * plan.overage[currency];
  return { plan, fits: seats <= plan.maxSeats, seatCost, included, overRuns, overageCost, monthly: seatCost + overageCost };
}

/** The cheapest self-serve plan that fits. */
export function recommend(seats: number, runs: number, currency: Currency, billing: Billing): Plan["id"] {
  const options = plans
    .filter((p) => p.id !== "enterprise")
    .map((p) => quote(p, seats, runs, currency, billing))
    .filter((q) => q.fits);
  if (!options.length) return "enterprise";
  return options.sort((a, b) => a.monthly - b.monthly)[0].plan.id;
}

export function money(value: number, currency: Currency): string {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "USD" && value < 100 && value % 1 ? 2 : 0,
  }).format(value);
}

/** Slider position (0–100) ↔ runs per month, on a log scale from 1k to 5M. */
export const runsFromSlider = (v: number) => Math.round(10 ** (3 + (v / 100) * Math.log10(5000)) / 1000) * 1000;
export const sliderFromRuns = (runs: number) => (Math.log10(runs / 1000) / Math.log10(5000)) * 100;
