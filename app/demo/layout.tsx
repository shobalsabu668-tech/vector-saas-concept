import type { Metadata } from "next";
import { DemoShell } from "@/components/demo/demo-shell";

export const metadata: Metadata = {
  title: { default: "Live demo", template: "%s · Live demo — VECTOR" },
  description: "A working slice of VECTOR in your browser: dashboard, workflow builder, run log and settings. Concept data.",
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <DemoShell>{children}</DemoShell>;
}
