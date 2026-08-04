"use client";

import { useState } from "react";
import { PaperPlaneTilt, CheckCircle, Warning } from "@phosphor-icons/react";

type Labels = {
  email: string;
  message: string;
  send: string;
  sending: string;
  success: string;
  error: string;
};

export default function FormspreeForm({
  endpoint,
  labels,
}: {
  endpoint: string;
  labels: Labels;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle"
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("ok");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="flex items-center gap-3 rounded-tile border border-line bg-violet-soft p-6">
        <CheckCircle size={28} weight="fill" className="shrink-0 text-violet" />
        <p className="font-medium text-ink">{labels.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <input
        type="email"
        name="email"
        required
        placeholder={labels.email}
        className="w-full rounded-xl border-2 border-line bg-line/25 px-4 py-3 text-sm outline-none transition-colors focus:border-violet focus:bg-surface"
      />
      <textarea
        name="message"
        required
        rows={4}
        placeholder={labels.message}
        className="w-full resize-y rounded-xl border-2 border-line bg-line/25 px-4 py-3 text-sm outline-none transition-colors focus:border-violet focus:bg-surface"
      />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "sending"}
          className="grad-brand inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.02] active:scale-[0.99] disabled:opacity-60"
        >
          <PaperPlaneTilt size={17} weight="bold" />
          {status === "sending" ? labels.sending : labels.send}
        </button>
        {status === "error" ? (
          <span className="inline-flex items-center gap-1.5 text-sm text-magenta">
            <Warning size={16} weight="fill" />
            {labels.error}
          </span>
        ) : null}
      </div>
    </form>
  );
}