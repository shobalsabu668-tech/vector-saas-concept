"use client";

import { useState } from "react";

const roles = ["Viewer", "Editor", "Admin"] as const;
const perms = ["View runs", "Run manually", "Edit workflows", "Publish", "Manage billing"] as const;

const defaults: Record<(typeof roles)[number], boolean[]> = {
  Viewer: [true, false, false, false, false],
  Editor: [true, true, true, false, false],
  Admin: [true, true, true, true, true],
};

/** An interactive permissions matrix: every cell is a real checkbox. */
export function RoleMatrix() {
  const [grid, setGrid] = useState(defaults);
  return (
    <div className="relative overflow-x-auto rounded-lg border border-grid bg-deep">
      <table className="w-full min-w-[22rem] text-[0.8rem]">
        <caption className="sr-only">Permissions by role. Toggle a checkbox to change a permission.</caption>
        <thead>
          <tr className="border-b border-grid text-muted">
            <th scope="col" className="px-4 py-2.5 text-left font-[500]">
              Permission
            </th>
            {roles.map((r) => (
              <th key={r} scope="col" className="px-3 py-2.5 font-[500]">
                {r}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {perms.map((p, i) => (
            <tr key={p} className="border-b border-grid last:border-0">
              <th scope="row" className="px-4 py-2 text-left font-[400]">
                {p}
              </th>
              {roles.map((r) => (
                <td key={r} className="px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={grid[r][i]}
                    onChange={(e) => setGrid((g) => ({ ...g, [r]: g[r].map((v, j) => (j === i ? e.target.checked : v)) }))}
                    aria-label={`${r}: ${p}`}
                    className="size-4 cursor-pointer accent-[var(--c-mint)]"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
