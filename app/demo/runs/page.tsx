import type { Metadata } from "next";
import { Suspense } from "react";
import { RunsFromUrl, RunsView } from "@/components/demo/runs";

export const metadata: Metadata = { title: "Runs" };

export default function Page() {
  return (
    <Suspense fallback={<RunsView openParam={null} />}>
      <RunsFromUrl />
    </Suspense>
  );
}
