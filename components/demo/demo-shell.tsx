"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/site";
import { Logo } from "@/components/layout/logo";
import { DemoProvider, useDemo } from "./demo-store";
import { CommandPalette } from "./command-palette";

const links = [
  { href: "/demo", label: "Overview", icon: "M4 13h6V4H4zm10 7h6v-9h-6zM4 20h6v-4H4zm10-9h6V4h-6z" },
  { href: "/demo/workflows", label: "Workflows", icon: "M6 6h4v4H6zM14 14h4v4h-4zM10 8h2a2 2 0 0 1 2 2v4" },
  { href: "/demo/runs", label: "Runs", icon: "M4 6h16M4 12h16M4 18h10" },
  { href: "/demo/settings", label: "Settings", icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7-3 2-1-2-4-2 .5-1.5-1L15 4h-4l-.5 2.5-1.5 1L7 7 5 11l2 1v1l-2 1 2 4 2-.5 1.5 1L11 20h4l.5-2.5 1.5-1 2 .5 2-4-2-1z" },
];

function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme, setPalette, toast } = useDemo();
  const [nav, setNav] = useState(false);
  const drawer = useRef<HTMLDivElement>(null);
  useEffect(() => setNav(false), [pathname]);

  // Mobile navigation drawer: focus moves in, Escape closes, focus returns.
  useEffect(() => {
    if (!nav) return;
    const previous = document.activeElement as HTMLElement | null;
    drawer.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setNav(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [nav]);

  const current = links.slice().reverse().find((l) => pathname === l.href || pathname.startsWith(`${l.href}/`));

  const sidebar = (where: "rail" | "drawer") => (
    <>
      <div className="flex h-14 items-center px-5">
        <Link href="/" aria-label="VECTOR website">
          <Logo />
        </Link>
      </div>
      <div className="mx-3 mb-3 rounded-lg border border-grid bg-deep px-3 py-2.5">
        <p className="text-[0.85rem] font-[560]">Acme Retail</p>
        <p className="t-mono text-muted">Workspace · concept data</p>
      </div>
      <nav aria-label="Demo" className="px-3">
        <ul className="space-y-0.5">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={current?.href === l.href ? "page" : undefined}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-[0.9rem] text-muted transition-colors hover:bg-raised hover:text-frost aria-[current=page]:bg-raised aria-[current=page]:text-frost"
              >
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                  <path d={l.icon} />
                </svg>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto space-y-3 p-3">
        <fieldset className="rounded-lg border border-grid p-1">
          <legend className="sr-only">Theme</legend>
          <div className="grid grid-cols-2">
            {(["dark", "light"] as const).map((t) => (
              <label key={t} className={cn("cursor-pointer rounded-md py-1.5 text-center text-[0.8rem] capitalize has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-mint", theme === t ? "bg-raised text-frost" : "text-muted")}>
                <input type="radio" name={`demo-theme-${where}`} className="sr-only" checked={theme === t} onChange={() => setTheme(t)} />
                {t}
              </label>
            ))}
          </div>
        </fieldset>
        <Link href="/" className="block rounded-md px-3 py-2 text-[0.85rem] text-muted hover:bg-raised hover:text-frost">
          ← Back to the website
        </Link>
      </div>
    </>
  );

  return (
    <div data-theme={theme} className="flex min-h-[calc(100svh-var(--bar-h))] flex-1 bg-deep text-frost">
      <aside className="sticky top-0 hidden h-[calc(100svh-var(--bar-h))] w-60 shrink-0 flex-col border-r border-grid bg-panel lg:flex">{sidebar("rail")}</aside>

      {nav ? (
        <div ref={drawer} className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Demo navigation">
          <div className="absolute inset-0 bg-black/50" onClick={() => setNav(false)} aria-hidden="true" />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-grid bg-panel shadow-2xl">{sidebar("drawer")}</aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-grid bg-deep/90 px-4 backdrop-blur md:px-6">
          <button type="button" onClick={() => setNav(true)} className="btn btn-line min-h-9 px-3 lg:hidden" aria-label="Open navigation">
            ☰
          </button>
          <p className="font-[600]">{current?.label ?? "Demo"}</p>
          <span className="t-mono hidden rounded-full border border-grid px-2 py-0.5 text-muted sm:inline">concept</span>
          <button type="button" onClick={() => setPalette(true)} className="ml-auto flex h-9 items-center gap-3 rounded-lg border border-grid bg-panel px-3 text-[0.85rem] text-muted hover:text-frost" aria-keyshortcuts="Control+K Meta+K">
            <span className="hidden sm:inline">Search or jump to…</span>
            <span className="sm:hidden">Search</span>
            <span className="kbd">⌘K</span>
          </button>
        </header>
        <main id="main" className="min-w-0 flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>

      <CommandPalette />
      {toast ? (
        <p key={toast.id} role="status" className="panel fade-in fixed bottom-5 right-5 z-[90] px-4 py-3 text-[0.9rem] shadow-xl">
          {toast.text}
        </p>
      ) : null}
    </div>
  );
}

export function DemoShell({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider>
      <Shell>{children}</Shell>
    </DemoProvider>
  );
}
