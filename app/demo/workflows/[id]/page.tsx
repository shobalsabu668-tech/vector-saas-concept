import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWorkflow, workflows } from "@/lib/data";
import { WorkflowBuilder } from "@/components/demo/workflow-builder";

export const dynamicParams = false;

export function generateStaticParams() {
  return workflows.map((w) => ({ id: w.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const w = getWorkflow((await params).id);
  return { title: w ? w.name : "Workflow" };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getWorkflow(id)) notFound();
  return <WorkflowBuilder id={id} />;
}
