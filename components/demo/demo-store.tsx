"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { workflows as seed, type Workflow } from "@/lib/data";

/**
 * DEMO STORE — the demo app's in-memory state: workflows (so moving a node
 * or toggling a workflow survives navigation within the demo), the theme,
 * the command palette and a toast. Nothing is sent anywhere.
 */

type Toast = { id: number; text: string } | null;

type DemoValue = {
  workflows: Workflow[];
  updateWorkflow: (id: string, fn: (w: Workflow) => Workflow) => void;
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
  palette: boolean;
  setPalette: (open: boolean) => void;
  toast: Toast;
  notify: (text: string) => void;
};

const DemoContext = createContext<DemoValue | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [workflows, setWorkflows] = useState<Workflow[]>(() => structuredClone(seed));
  const [theme, setThemeState] = useState<"dark" | "light">("dark");
  const [palette, setPalette] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  useEffect(() => {
    try {
      const t = localStorage.getItem("vector-demo-theme");
      if (t === "light" || t === "dark") setThemeState(t);
    } catch {
      /* ignore */
    }
  }, []);

  const setTheme = useCallback((t: "dark" | "light") => {
    setThemeState(t);
    try {
      localStorage.setItem("vector-demo-theme", t);
    } catch {
      /* ignore */
    }
  }, []);

  const updateWorkflow = useCallback((id: string, fn: (w: Workflow) => Workflow) => {
    setWorkflows((list) => list.map((w) => (w.id === id ? fn(w) : w)));
  }, []);

  const notify = useCallback((text: string) => setToast({ id: Date.now(), text }), []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPalette((p) => !p);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return <DemoContext.Provider value={{ workflows, updateWorkflow, theme, setTheme, palette, setPalette, toast, notify }}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoValue {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used inside <DemoProvider>");
  return ctx;
}
