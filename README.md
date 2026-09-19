# VECTOR — workflow automation (concept website)

> **A self-initiated concept by [Shobal Sabu](https://shobal-sabu-portfolio.vercel.app).**
> VECTOR is a fictional SaaS product. It isn't a real company or client work, and every number on the site is generated.

**Live site:** https://vector-saas-concept.vercel.app · **Case study:** https://shobal-sabu-portfolio.vercel.app/work/vector

VECTOR explores a SaaS website where **the marketing site is the product demo**. Instead of describing features, it
lets visitors use a working slice of the product: a live dashboard, a workflow they can run, pricing that does the
maths, and a full app demo in the browser.

## What's in it

| Area | What was built |
| --- | --- |
| **Live dashboard hero** | The real dashboard component, not a screenshot. Range tabs re-plot the chart with a tween; KPIs follow; new runs stream into the log. The chart can be read point by point with the arrow keys. |
| **Runnable workflow** | A branching workflow executes step by step on a canvas: nodes light up, edges animate, and a timed run log is written. Change the order value and the branch takes the other path. |
| **App demo (`/demo`)** | **Overview:** health and needs-attention panels. **Workflows:** a list with on/off switches. **Builder:** drag nodes (or nudge them with the arrow keys), edit a step, test either branch, save versions. **Runs:** filter, search, pagination and a trace drawer. **Settings:** roles, API key, theme. |
| **Command palette** | ⌘K / Ctrl K anywhere in the demo: navigate, open any workflow, switch theme. |
| **Light & dark themes** | Token-based. Both themes pass contrast checks. |
| **Pricing calculator** | Seat and run-volume sliders re-price every plan, with the overage maths shown. It switches between ₹ and $ and between monthly and annual billing, and marks the cheapest plan that fits. |
| **Also** | Changelog, a docs quickstart with copyable code blocks, and an about-this-concept page. |
| **No libraries** | Charts, canvas, palette and drawers are hand-built: no charting, UI or animation library. |
| **Deterministic data** | Every run and metric comes from a seeded generator, so the numbers are identical for every visitor and between server and browser. |
| **Quality** | axe-core reports 0 violations on every page at 1440 px and 390 px, in both themes. Lighthouse (local, simulated mobile): performance 88–95, accessibility 100, best practices 100. |

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm run start
```

No environment variables are required. `.env.example` lists two optional ones.

## Structure

```text
app/
  (site)/            marketing: home, pricing, docs, changelog, concept
  demo/              the app demo: overview, workflows, workflows/[id], runs, settings
components/
  dashboard/         dashboard + live run counter
  charts/            SVG area chart with tweening and keyboard read-out
  workflow/          canvas, run simulation hook, runner
  demo/              app shell, store, command palette, pages
  pricing/           calculator, contact form
lib/
  data.ts            seeded workflows, runs and series
  pricing.ts         plans and quote maths
  chart.ts           curve helpers
```

## What is simulated

- VECTOR, its customers, prices and every number shown are fictional.
- Runs are generated from a seed; the live stream is the same generator moving forward in time.
- Nothing in the demo is saved or sent. Changes live in memory for the session.
- The docs describe a CLI and SDK that don't exist.

---

Designed and built by **Shobal Sabu**, a creative web developer in Bengaluru. Available for freelance projects:
[shobalsabu668@gmail.com](mailto:shobalsabu668@gmail.com)
