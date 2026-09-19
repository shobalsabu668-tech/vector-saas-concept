/**
 * CONCEPT DATA
 * ────────────────────────────────────────────────────────────────────────────
 * VECTOR is fictional, and so is every number on the site. Everything here is
 * generated from a seed so it's identical for every visitor and between the
 * server and the browser (no hydration mismatches), and "live" updates are
 * produced by the same generator as time passes.
 */

/** Mulberry32 — small, fast, seedable PRNG. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type RunStatus = "success" | "failed" | "running" | "retried";

export type StepKind = "trigger" | "action" | "branch" | "notify" | "delay";

export type WorkflowStep = {
  id: string;
  kind: StepKind;
  title: string;
  detail: string;
  /** Position on the builder canvas. */
  x: number;
  y: number;
};

export type Workflow = {
  id: string;
  name: string;
  team: "Ops" | "Finance" | "Support" | "Growth";
  trigger: string;
  steps: WorkflowStep[];
  edges: [string, string, string?][];
  enabled: boolean;
  version: number;
  owner: string;
};

export const workflows: Workflow[] = [
  {
    id: "order-to-invoice",
    name: "Order to invoice",
    team: "Finance",
    trigger: "New order",
    enabled: true,
    version: 14,
    owner: "Priya N.",
    steps: [
      { id: "t", kind: "trigger", title: "New order", detail: "Storefront webhook", x: 40, y: 150 },
      { id: "e", kind: "action", title: "Enrich customer", detail: "Look up CRM record", x: 270, y: 150 },
      { id: "b", kind: "branch", title: "Order over ₹50,000?", detail: "amount > 50000", x: 500, y: 150 },
      { id: "a", kind: "notify", title: "Ask for approval", detail: "Post to #finance", x: 730, y: 50 },
      { id: "i", kind: "action", title: "Create invoice", detail: "Accounting system", x: 730, y: 250 },
      { id: "n", kind: "notify", title: "Email the customer", detail: "Invoice PDF attached", x: 960, y: 150 },
    ],
    edges: [
      ["t", "e"],
      ["e", "b"],
      ["b", "a", "yes"],
      ["b", "i", "no"],
      ["a", "i"],
      ["i", "n"],
    ],
  },
  {
    id: "lead-enrich",
    name: "Lead enrichment",
    team: "Growth",
    trigger: "Form submitted",
    enabled: true,
    version: 7,
    owner: "Arjun K.",
    steps: [
      { id: "t", kind: "trigger", title: "Form submitted", detail: "Website form", x: 40, y: 150 },
      { id: "e", kind: "action", title: "Find company", detail: "Domain lookup", x: 270, y: 150 },
      { id: "s", kind: "action", title: "Score lead", detail: "Fit + intent model", x: 500, y: 150 },
      { id: "r", kind: "notify", title: "Route to rep", detail: "Round robin", x: 730, y: 150 },
    ],
    edges: [
      ["t", "e"],
      ["e", "s"],
      ["s", "r"],
    ],
  },
  {
    id: "refund-triage",
    name: "Refund triage",
    team: "Support",
    trigger: "Ticket tagged “refund”",
    enabled: true,
    version: 22,
    owner: "Meera S.",
    steps: [
      { id: "t", kind: "trigger", title: "Ticket tagged", detail: "Helpdesk webhook", x: 40, y: 150 },
      { id: "o", kind: "action", title: "Fetch order", detail: "Order database", x: 270, y: 150 },
      { id: "b", kind: "branch", title: "Within 30 days?", detail: "ordered_at > now − 30d", x: 500, y: 150 },
      { id: "r", kind: "action", title: "Issue refund", detail: "Payments API", x: 730, y: 50 },
      { id: "h", kind: "notify", title: "Hand to a human", detail: "Assign to tier 2", x: 730, y: 250 },
    ],
    edges: [
      ["t", "o"],
      ["o", "b"],
      ["b", "r", "yes"],
      ["b", "h", "no"],
    ],
  },
  {
    id: "stock-alerts",
    name: "Low-stock alerts",
    team: "Ops",
    trigger: "Every hour",
    enabled: false,
    version: 3,
    owner: "Rahul D.",
    steps: [
      { id: "t", kind: "trigger", title: "Every hour", detail: "Schedule", x: 40, y: 150 },
      { id: "q", kind: "action", title: "Query stock", detail: "Warehouse DB", x: 270, y: 150 },
      { id: "n", kind: "notify", title: "Alert buyers", detail: "Email + chat", x: 500, y: 150 },
    ],
    edges: [
      ["t", "q"],
      ["q", "n"],
    ],
  },
];

export function getWorkflow(id: string) {
  return workflows.find((w) => w.id === id);
}

export type Run = {
  id: string;
  workflow: string;
  status: RunStatus;
  durationMs: number;
  startedAt: number;
  steps: number;
};

const EPOCH = Date.UTC(2026, 8, 19, 9, 0, 0);

/** The nth run in the global run log. Deterministic for any n. */
export function runAt(n: number): Run {
  const r = rng(n * 7919 + 13);
  const wf = workflows[Math.floor(r() * 3)]; // disabled workflow never runs
  const roll = r();
  const status: RunStatus = roll < 0.9 ? "success" : roll < 0.95 ? "retried" : "failed";
  return {
    id: `run_${(n * 2654435761 >>> 0).toString(36).slice(0, 7)}`,
    workflow: wf.id,
    status,
    durationMs: Math.round(80 + r() * 260 + (status === "retried" ? 1400 : 0)),
    startedAt: EPOCH + n * 37_000,
    steps: wf.steps.length,
  };
}

/** The most recent `count` runs up to run number `upTo`. */
export function recentRuns(upTo: number, count: number): Run[] {
  return Array.from({ length: count }, (_, i) => runAt(upTo - i));
}

/** Smooth, seeded series for charts. */
export function series(length: number, seed: number, base: number, amp: number, trend = 0): number[] {
  const out: number[] = [];
  for (let i = 0; i < length; i++) {
    const n = Math.sin(i * 0.55 + seed) * 0.6 + Math.sin(i * 1.7 + seed * 2.3) * 0.3 + Math.sin(i * 0.19 + seed * 0.7) * 0.8;
    out.push(Math.max(0, base + n * amp + i * trend));
  }
  return out;
}

export const RANGES = {
  "24h": { points: 24, label: "Last 24 hours", unit: "hour", seed: 2.1, base: 420, amp: 120, trend: 3, kpi: { runs: 10_412, success: 99.6, p95: 171, active: 3 } },
  "7d": { points: 28, label: "Last 7 days", unit: "6 hours", seed: 1.3, base: 1_520, amp: 380, trend: 12, kpi: { runs: 71_880, success: 99.2, p95: 184, active: 3 } },
  "30d": { points: 30, label: "Last 30 days", unit: "day", seed: 5.7, base: 9_400, amp: 1_900, trend: 40, kpi: { runs: 298_640, success: 98.9, p95: 196, active: 3 } },
} as const;

export type RangeKey = keyof typeof RANGES;

export const team = [
  { name: "Priya Nair", email: "priya@acme.example", role: "Owner", lastActive: "Now" },
  { name: "Arjun Kulkarni", email: "arjun@acme.example", role: "Admin", lastActive: "12 min ago" },
  { name: "Meera Shah", email: "meera@acme.example", role: "Editor", lastActive: "1 hour ago" },
  { name: "Rahul Dsouza", email: "rahul@acme.example", role: "Editor", lastActive: "Yesterday" },
  { name: "Sana Iqbal", email: "sana@acme.example", role: "Viewer", lastActive: "3 days ago" },
];

export function formatDuration(ms: number): string {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)} s` : `${ms} ms`;
}

const timeFmt = new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "Asia/Kolkata" });
export const formatTime = (t: number) => timeFmt.format(new Date(t));

export const statusStyle: Record<RunStatus, { label: string; tone: string }> = {
  success: { label: "Success", tone: "text-mint" },
  retried: { label: "Retried", tone: "text-amber" },
  failed: { label: "Failed", tone: "text-rose" },
  running: { label: "Running", tone: "text-sky" },
};
