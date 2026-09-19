"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/site";
import { useDemo } from "./demo-store";

type Command = { id: string; label: string; group: string; hint?: string; run: () => void };

/**
 * COMMAND PALETTE — ⌘K / Ctrl K anywhere in the demo. Everything the sidebar
 * can do, plus opening any workflow and switching the theme, from the keyboard.
 */
export function CommandPalette() {
  const router = useRouter();
  const id = useId();
  const { palette, setPalette, workflows, theme, setTheme, notify } = useDemo();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  const commands = useMemo<Command[]>(
    () => [
      { id: "overview", group: "Go to", label: "Overview", run: () => router.push("/demo") },
      { id: "workflows", group: "Go to", label: "Workflows", run: () => router.push("/demo/workflows") },
      { id: "runs", group: "Go to", label: "Runs", run: () => router.push("/demo/runs") },
      { id: "settings", group: "Go to", label: "Settings", run: () => router.push("/demo/settings") },
      ...workflows.map((w) => ({ id: `wf-${w.id}`, group: "Workflows", label: `Open “${w.name}”`, hint: `v${w.version}`, run: () => router.push(`/demo/workflows/${w.id}`) })),
      { id: "theme", group: "Preferences", label: `Switch to ${theme === "dark" ? "light" : "dark"} theme`, run: () => setTheme(theme === "dark" ? "light" : "dark") },
      { id: "copy", group: "Preferences", label: "Copy link to this page", run: () => navigator.clipboard?.writeText(window.location.href).then(() => notify("Link copied")) },
      { id: "site", group: "Leave", label: "Back to the VECTOR website", run: () => router.push("/") },
    ],
    [router, workflows, theme, setTheme, notify],
  );

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return commands;
    return commands.filter((c) => `${c.group} ${c.label}`.toLowerCase().includes(t));
  }, [q, commands]);

  useEffect(() => setActive(0), [q]);

  useEffect(() => {
    if (!palette) return;
    const previous = document.activeElement as HTMLElement | null;
    requestAnimationFrame(() => input.current?.focus());
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPalette(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus();
      setQ("");
    };
  }, [palette, setPalette]);

  if (!palette) return null;

  const exec = (c: Command) => {
    setPalette(false);
    c.run();
  };

  let lastGroup = "";

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/50 p-3 pt-[12vh] backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && setPalette(false)}>
      <div role="dialog" aria-modal="true" aria-labelledby={`${id}-label`} className="panel fade-in w-full max-w-lg overflow-hidden shadow-2xl">
        <label id={`${id}-label`} htmlFor={`${id}-q`} className="sr-only">
          Type a command
        </label>
        <input
          ref={input}
          id={`${id}-q`}
          role="combobox"
          aria-expanded="true"
          aria-controls={`${id}-list`}
          aria-activedescendant={results[active] ? `${id}-${results[active].id}` : undefined}
          autoComplete="off"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(results.length - 1, a + 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(0, a - 1));
            } else if (e.key === "Enter" && results[active]) {
              e.preventDefault();
              exec(results[active]);
            }
          }}
          placeholder="Type a command or search…"
          className="h-14 w-full border-b border-grid bg-transparent px-5 text-[1rem] outline-none placeholder:text-muted"
        />
        <ul id={`${id}-list`} role="listbox" aria-label="Commands" className="max-h-[50vh] overflow-y-auto p-2">
          {results.map((c, i) => {
            const header = c.group !== lastGroup ? c.group : null;
            lastGroup = c.group;
            return (
              <li key={c.id} role="presentation">
                {header ? <p className="t-mono px-3 pb-1 pt-3 text-muted">{header}</p> : null}
                <div
                  id={`${id}-${c.id}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => exec(c)}
                  className={cn("flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-[0.92rem]", i === active && "bg-raised")}
                >
                  {c.label}
                  {c.hint ? <span className="kbd">{c.hint}</span> : null}
                </div>
              </li>
            );
          })}
          {!results.length ? <li className="px-3 py-6 text-center text-muted">No commands match “{q}”.</li> : null}
        </ul>
        <p className="t-mono flex gap-4 border-t border-grid px-5 py-2.5 text-muted">
          <span>
            <span className="kbd">↑</span> <span className="kbd">↓</span> move
          </span>
          <span>
            <span className="kbd">↵</span> run
          </span>
          <span>
            <span className="kbd">esc</span> close
          </span>
        </p>
      </div>
    </div>
  );
}
