"use client";

import { useState } from "react";

export function CodeBlock({ code }: { code: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState("idle"), 1600);
  }

  return (
    <div className="code-card">
      <div className="code-toolbar">
        <span className="window-dots" aria-hidden="true"><i /><i /><i /></span>
        <span>template.py</span>
        <button className="copy-button" onClick={copy} type="button">
          {state === "copied" ? "Скопировано" : state === "failed" ? "Не удалось" : "Копировать"}
        </button>
      </div>
      <pre tabIndex={0}><code>{code}</code></pre>
    </div>
  );
}
