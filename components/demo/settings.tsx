"use client";

import { useState } from "react";
import { team } from "@/lib/data";
import { cn } from "@/lib/site";
import { useDemo } from "./demo-store";

const roles = ["Owner", "Admin", "Editor", "Viewer"];

/** SETTINGS — members and roles, an API key, appearance. All local to the demo. */
export function Settings() {
  const { theme, setTheme, notify } = useDemo();
  const [members, setMembers] = useState(team);
  const [revealed, setRevealed] = useState(false);
  const key = "vk_concept_7f3a9c2e41b8d0a6e5f9c1b2";

  return (
    <div className="mx-auto grid max-w-4xl gap-6">
      <h1 className="text-[1.6rem] font-[620] tracking-[-0.02em]">Settings</h1>

      <section aria-labelledby="members" className="panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-grid p-5">
          <div>
            <h2 id="members" className="font-[600]">
              Members
            </h2>
            <p className="text-[0.9rem] text-muted">Seats are counted for Owners, Admins and Editors. Viewers are free.</p>
          </div>
          <span className="num text-[0.85rem] text-muted">{members.filter((m) => m.role !== "Viewer").length} seats</span>
        </div>
        <ul className="divide-y divide-grid">
          {members.map((m, i) => (
            <li key={m.email} className="flex flex-wrap items-center gap-4 px-5 py-3.5">
              <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-raised text-[0.8rem] font-[600]">
                {m.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")}
              </span>
              <span className="min-w-40 flex-1">
                <span className="block font-[560]">{m.name}</span>
                <span className="block text-[0.82rem] text-muted">
                  {m.email} · {m.lastActive}
                </span>
              </span>
              <label className="sr-only" htmlFor={`role-${i}`}>
                Role for {m.name}
              </label>
              <select
                id={`role-${i}`}
                value={m.role}
                disabled={m.role === "Owner"}
                onChange={(e) => {
                  setMembers((list) => list.map((x, j) => (j === i ? { ...x, role: e.target.value } : x)));
                  notify(`${m.name} is now ${e.target.value === "Admin" ? "an" : "a"} ${e.target.value}`);
                }}
                className="field-input w-auto cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
              >
                {roles.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="api" className="panel p-5">
        <h2 id="api" className="font-[600]">
          API key
        </h2>
        <p className="text-[0.9rem] text-muted">A concept key: it doesn&rsquo;t unlock anything.</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <code className="num flex-1 rounded-lg border border-grid bg-deep px-3 py-2.5 text-[0.85rem]">{revealed ? key : `${key.slice(0, 11)}${"•".repeat(18)}`}</code>
          <button type="button" className="btn btn-line" onClick={() => setRevealed((r) => !r)}>
            {revealed ? "Hide" : "Reveal"}
          </button>
          <button type="button" className="btn btn-line" onClick={() => navigator.clipboard?.writeText(key).then(() => notify("Key copied"))}>
            Copy
          </button>
        </div>
      </section>

      <section aria-labelledby="appearance" className="panel p-5">
        <h2 id="appearance" className="font-[600]">
          Appearance
        </h2>
        <fieldset className="mt-4">
          <legend className="sr-only">Theme</legend>
          <div className="grid max-w-md grid-cols-2 gap-3">
            {(["dark", "light"] as const).map((t) => (
              <label key={t} className={cn("cursor-pointer rounded-xl border p-3 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-mint", theme === t ? "border-mint" : "border-grid")}>
                <input type="radio" name="settings-theme" className="sr-only" checked={theme === t} onChange={() => setTheme(t)} />
                <span aria-hidden="true" className={cn("block h-16 rounded-lg border", t === "dark" ? "border-[#1e2733] bg-[#0a0d12]" : "border-[#dde3ea] bg-[#f4f6f9]")}>
                  <span className={cn("m-2 block h-2 w-10 rounded", t === "dark" ? "bg-[#5cf2b0]" : "bg-[#0a7a4f]")} />
                </span>
                <span className="mt-2 block text-[0.9rem] capitalize">{t}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </section>
    </div>
  );
}
