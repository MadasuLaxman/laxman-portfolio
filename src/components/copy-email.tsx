"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { buttonStyles, cn } from "./ui";

type Status = "idle" | "copied" | "failed";

export function CopyEmailButton({ email }: { email: string }) {
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (status === "idle") return;
    const timer = window.setTimeout(() => setStatus("idle"), 2500);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <>
      <button type="button" onClick={copy} className={cn(buttonStyles.secondary, "min-w-36")}>
        {status === "copied" ? (
          <Check aria-hidden="true" className="size-4 text-success" />
        ) : (
          <Copy aria-hidden="true" className="size-4" />
        )}
        {status === "copied" ? "Copied" : "Copy address"}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {status === "copied" ? "Email address copied to clipboard" : status === "failed" ? "Copy failed. Select the address to copy it manually." : ""}
      </span>
      {status === "failed" ? (
        <span className="text-sm text-fg-muted" aria-hidden="true">
          Couldn&apos;t copy. Select the address above instead.
        </span>
      ) : null}
    </>
  );
}
