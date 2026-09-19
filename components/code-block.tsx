"use client";

import { useState } from "react";

/** Code with a filename, a language tag and a copy button that confirms. */
export function CodeBlock({ code, lang, file }: { code: string; lang: string; file?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <div className="panel mt-4 overflow-hidden">
      <div className="flex items-center justify-between border-b border-grid px-4 py-2">
        <span className="t-mono text-muted">{file ?? lang}</span>
        <button type="button" onClick={copy} className="t-mono rounded px-2 py-1 text-muted hover:text-frost" aria-live="polite">
          {copied ? "Copied" : "Copy"}
          <span className="sr-only"> code</span>
        </button>
      </div>
      <pre className="relative overflow-x-auto p-4 text-[0.82rem] leading-6" tabIndex={0}>
        <code className="num">{code}</code>
      </pre>
    </div>
  );
}
