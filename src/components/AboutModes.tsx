"use client";

import { CheckCircle } from "@phosphor-icons/react";
import type { ModeInfo } from "@/lib/content";
import ModeSwitcher from "./ModeSwitcher";
import { useStudyMode } from "./StudyModeContext";

export default function AboutModes({
  modes,
  hint,
}: {
  modes: ModeInfo[];
  hint: string;
}) {
  const { mode } = useStudyMode();
  const active = modes.find((m) => m.id === mode) ?? modes[0];

  return (
    <div>
      <ModeSwitcher
        options={modes.map((m) => ({ id: m.id, label: m.label }))}
        hint={hint}
      />

      <div className="mt-6 rounded-tile border border-line bg-surface p-6 sm:p-8">
        <p className="text-base font-medium">{active.short}</p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {active.days.map((day) => (
            <section key={day.title}>
              <h3 className="font-display text-base font-semibold">
                {day.title}
              </h3>
              <ul className="mt-3 space-y-2.5">
                {day.items.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-ink-soft">
                    <CheckCircle
                      size={18}
                      weight="fill"
                      className="mt-0.5 shrink-0 text-violet"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
