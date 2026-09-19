import type { Metadata } from "next";
import { Settings } from "@/components/demo/settings";

export const metadata: Metadata = { title: "Settings" };

export default function Page() {
  return <Settings />;
}
