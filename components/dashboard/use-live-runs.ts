"use client";

import { useEffect, useState } from "react";

/** Run number the concept's run log starts from on every page load. */
export const BASE_RUN = 120_000;

/**
 * The run counter, ticking forward while the page is visible — new runs
 * "arrive" every few seconds. Static under reduced motion. The server and
 * the first client render agree (BASE_RUN), so there's no hydration mismatch.
 */
export function useLiveRuns(everyMs = 2600, enabled = true): number {
  const [n, setN] = useState(BASE_RUN);
  useEffect(() => {
    if (!enabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    const tick = () => {
      if (document.visibilityState === "visible") setN((x) => x + 1);
      timer = window.setTimeout(tick, everyMs * (0.6 + Math.random() * 0.8));
    };
    timer = window.setTimeout(tick, everyMs);
    return () => clearTimeout(timer);
  }, [everyMs, enabled]);
  return n;
}
