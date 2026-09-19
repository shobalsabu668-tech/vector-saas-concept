"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * One IntersectionObserver for every [data-reveal] element on the page.
 * Elements are observed directly; each reveals once.

 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in"));
      return;
    }
    const targets = new Map<Element, Element[]>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          targets.get(entry.target)?.forEach((el) => el.classList.add("is-in"));
          io.unobserve(entry.target);
          targets.delete(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );

    const scan = () => {
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)").forEach((el) => {
        const watch = el.dataset.reveal === "clip" ? (el.parentElement ?? el) : el;
        const list = targets.get(watch);
        if (list) {
          if (!list.includes(el)) list.push(el);
          return;
        }
        targets.set(watch, [el]);
        io.observe(watch);
      });
    };

    scan();
    let raf = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(scan);
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return null;
}
