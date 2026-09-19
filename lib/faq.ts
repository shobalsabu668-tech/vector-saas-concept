export type QA = { q: string; a: string };

export const faqs: QA[] = [
  { q: "What counts as a run?", a: "One trigger firing one workflow, however many steps it takes. Retries of a failed step don't count again." },
  { q: "Do I need to write code?", a: "No. Workflows are built on a canvas. When you want code, every step can run a snippet, and there's an API and CLI." },
  { q: "Can we keep our data in India?", a: "Yes. On Scale and Enterprise, a workspace can be pinned to the Mumbai region, and run data never leaves it." },
  { q: "What happens when a step fails?", a: "It's retried with backoff. If the last attempt fails, the run stops, the owner is notified, and you can replay it from the failed step." },
  { q: "Is VECTOR a real product?", a: "No. It's a self-initiated concept by Shobal Sabu. The dashboard, workflows, runs and prices are all generated for the demonstration." },
];
