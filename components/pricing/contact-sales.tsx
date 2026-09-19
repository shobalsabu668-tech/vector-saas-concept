"use client";

import { useId, useState, type FormEvent } from "react";

type Errors = Partial<Record<"name" | "email" | "company", string>>;

/** Concept contact form: validates inline, confirms, and sends nothing. */
export function ContactSales() {
  const id = useId();
  const [f, setF] = useState({ name: "", email: "", company: "", size: "50–200", note: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (!f.name.trim()) next.name = "Please add your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) next.email = "Please add a work email.";
    if (!f.company.trim()) next.company = "Please add your company.";
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      document.getElementById(`${id}-${first}`)?.focus();
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div role="status" className="panel p-6">
        <p className="font-[600]">Thanks, {f.name.split(" ")[0]}.</p>
        <p className="mt-2 text-muted">In a real product, someone would reply within a working day. VECTOR is a concept, so nothing was sent.</p>
      </div>
    );
  }

  const field = (k: "name" | "email" | "company", label: string, type = "text", auto?: string) => (
    <div>
      <label htmlFor={`${id}-${k}`} className="mb-1.5 block text-[0.88rem]">
        {label}
      </label>
      <input
        id={`${id}-${k}`}
        type={type}
        autoComplete={auto}
        value={f[k]}
        onChange={(e) => setF({ ...f, [k]: e.target.value })}
        aria-invalid={errors[k] ? true : undefined}
        aria-describedby={errors[k] ? `${id}-${k}-err` : undefined}
        className="field-input"
      />
      {errors[k] ? (
        <p id={`${id}-${k}-err`} className="mt-1 text-[0.82rem] text-rose">
          {errors[k]}
        </p>
      ) : null}
    </div>
  );

  return (
    <form onSubmit={submit} noValidate className="panel grid gap-4 p-6 sm:grid-cols-2">
      {field("name", "Name", "text", "name")}
      {field("email", "Work email", "email", "email")}
      {field("company", "Company", "text", "organization")}
      <div>
        <label htmlFor={`${id}-size`} className="mb-1.5 block text-[0.88rem]">
          Team size
        </label>
        <select id={`${id}-size`} value={f.size} onChange={(e) => setF({ ...f, size: e.target.value })} className="field-input cursor-pointer">
          {["1–49", "50–200", "201–1,000", "1,000+"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`${id}-note`} className="mb-1.5 block text-[0.88rem]">
          What are you automating? <span className="text-muted">(optional)</span>
        </label>
        <textarea id={`${id}-note`} rows={3} value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} className="field-input resize-y" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
        <p className="text-[0.8rem] text-muted">A concept form: nothing is sent or stored.</p>
        <button type="submit" className="btn btn-mint">
          Send
        </button>
      </div>
    </form>
  );
}
