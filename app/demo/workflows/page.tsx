import type { Metadata } from "next";
import { WorkflowList } from "@/components/demo/workflow-list";

export const metadata: Metadata = { title: "Workflows" };

export default function Page() {
  return <WorkflowList />;
}
