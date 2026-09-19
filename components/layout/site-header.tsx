"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/lib/site";
import { cn } from "@/lib/site";
import { Logo } from "./logo";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => setMenu(false), [pathname]);

  useEffect(() => {
    if (!menu) return;
    const trigger = btn.current;
    const items = () => Array.from(panel.current?.querySelectorAll<HTMLElement>("a, button") ?? []);
    items()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
      if (e.key !== "Tab") return;
      const l = items();
      if (e.shiftKey && document.activeElement === l[0]) {
        e.preventDefault();
        l[l.length - 1].focus();
      } else if (!e.shiftKey && document.activeElement === l[l.length - 1]) {
        e.preventDefault();
        l[0].focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [menu]);

  return (
    <header className={cn("sticky top-0 z-50 border-b transition-colors", scrolled || menu ? "border-grid bg-deep/85 backdrop-blur-lg" : "border-transparent bg-deep")}>
      <div className="shell flex h-[var(--header-h)] items-center gap-4 sm:gap-8">
        <Link href="/" aria-label="VECTOR, home">
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={pathname === n.href ? "page" : undefined}
                  className="rounded-md px-3 py-2 text-[0.9rem] text-muted transition-colors hover:text-frost aria-[current=page]:text-frost"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/demo" className="btn btn-mint min-h-10 px-3.5 sm:px-[1.15rem]">
            <span className="sm:hidden">Demo</span>
            <span className="hidden sm:inline">Open the live demo</span>
          </Link>
          <button
            ref={btn}
            type="button"
            onClick={() => setMenu((m) => !m)}
            aria-expanded={menu}
            aria-controls="site-menu"
            className="btn btn-line min-h-10 lg:hidden"
          >
            Menu
          </button>
        </div>
      </div>
      {menu ? (
        <div id="site-menu" ref={panel} className="fade-in border-t border-grid lg:hidden">
          <nav aria-label="Menu" className="shell py-4">
            <ul className="grid gap-1">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} onClick={() => setMenu(false)} className="block rounded-md px-3 py-3 text-[1.05rem] hover:bg-panel">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
