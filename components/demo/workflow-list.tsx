"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/site";
import { useDemo } from "./demo-store";

const teams = ["All", "Finance", "Growth", "Support", "Ops"] as const;

/** WORKFLOWS — the list, filterable by team, with an on/off switch per workflow. */
export function WorkflowList() {
  const { workflows, updateWorkflow, notify } = useDemo();
  const [team, setTeam] = useState<(typeof teams)[number]>("All");
  const shown = workflows.filter((w) => team === "All" || w.team === team);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[1.6rem] font-[620] tracking-[-0.02em]">Workflows</h1>
          <p className="text-muted">
            {workflows.filter((w) => w.enabled).length} active of {workflows.length}
          </p>
        </div>
        <div role="group" aria-label="Filter by team" className="flex flex-wrap gap-1 rounded-lg border border-grid bg-panel p-1">
          {teams.map((t) => (
            <button key={t} type="button" aria-pressed={team === t} onClick={() => setTeam(t)} className={cn("rounded-md px-3 py-1.5 text-[0.85rem]", team === t ? "bg-raised text-frost" : "text-muted hover:text-frost")}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="panel relative mt-6 overflow-x-auto">
        <table className="w-full min-w-[44rem] text-left text-[0.9rem]">
          <caption className="sr-only">Workflows{team !== "All" ? ` for ${team}` : ""}</caption>
          <thead>
            <tr className="border-b border-grid text-[0.8rem] text-muted">
              <th scope="col" className="px-5 py-3 font-[500]">Name</th>
              <th scope="col" className="px-3 py-3 font-[500]">Trigger</th>
              <th scope="col" className="px-3 py-3 font-[500]">Team</th>
              <th scope="col" className="px-3 py-3 font-[500]">Version</th>
              <th scope="col" className="px-3 py-3 font-[500]">Owner</th>
              <th scope="col" className="px-5 py-3 text-right font-[500]">Enabled</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((w) => (
              <tr key={w.id} className="border-b border-grid last:border-0 hover:bg-raised/50">
                <th scope="row" className="px-5 py-3.5 font-[560]">
                  <Link href={`/demo/workflows/${w.id}`} className="hover:text-mint hover:underline">
                    {w.name}
                  </Link>
                  <span className="num block text-[0.72rem] font-[400] text-muted">{w.steps.length} steps</span>
                </th>
                <td className="px-3 py-3.5 text-muted">{w.trigger}</td>
                <td className="px-3 py-3.5">{w.team}</td>
                <td className="num px-3 py-3.5">v{w.version}</td>
                <td className="px-3 py-3.5 text-muted">{w.owner}</td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={w.enabled}
                    aria-label={`${w.name} enabled`}
                    onClick={() => {
                      updateWorkflow(w.id, (x) => ({ ...x, enabled: !x.enabled }));
                      notify(`${w.name} ${w.enabled ? "paused" : "enabled"}`);
                    }}
                    className={cn("relative inline-flex h-6 w-11 items-center rounded-full border transition-colors", w.enabled ? "border-mint bg-mint" : "border-grid bg-deep")}
                  >
                    <span className={cn("inline-block size-4 rounded-full transition-transform", w.enabled ? "translate-x-6 bg-mint-ink" : "translate-x-1 bg-muted")} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
