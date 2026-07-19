"use client";

import type { StudyMode } from "@/lib/content";
import { useStudyMode } from "./StudyModeContext";

type Props = {
  options: { id: StudyMode; label: string }[];
  hint?: string;
};

export default function ModeSwitcher({ options, hint }: Props) {
  const { mode, setMode } = useStudyMode();

  return (
    <div>
      <div
        role="tablist"
        aria-label={hint}
        className="inline-flex w-full flex-col gap-1 rounded-2xl border border-line bg-surface p-1.5 sm:w-auto sm:flex-row"
      >
        {options.map((opt) => {
          const active = mode === opt.id;
          return (
            <button
              key={opt.id}
              role="tab"
              aria-selected={active}
              onClick={() => setMode(opt.id)}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors sm:px-5 ${
                active
                  ? "grad-brand text-white shadow-sm"
                  : "text-ink-soft hover:bg-violet-soft hover:text-ink"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {hint ? <p className="mt-2 text-sm text-ink-soft">{hint}</p> : null}
    </div>
  );
}
