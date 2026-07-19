"use client";

import { MapPin } from "@phosphor-icons/react";
import type { ModeInfo, ScheduleEntry } from "@/lib/content";
import ModeSwitcher from "./ModeSwitcher";
import { useStudyMode } from "./StudyModeContext";

export default function ScheduleTimeline({
  entries,
  modes,
  emptyLabel,
}: {
  entries: ScheduleEntry[];
  modes: ModeInfo[];
  emptyLabel: string;
}) {
  const { mode } = useStudyMode();
  const filtered = entries.filter((e) => e.mode === mode);

  const days = new Map<string, ScheduleEntry[]>();
  for (const entry of filtered) {
    const list = days.get(entry.dayLabel) ?? [];
    list.push(entry);
    days.set(entry.dayLabel, list);
  }

  return (
    <div>
      <ModeSwitcher
        options={modes.map((m) => ({ id: m.id, label: m.label }))}
      />

      {filtered.length === 0 ? (
        <p className="mt-8 text-ink-soft">{emptyLabel}</p>
      ) : (
        <div className="mt-10 space-y-12">
          {[...days.entries()].map(([dayLabel, items]) => (
            <section key={dayLabel}>
              <h2 className="font-display text-xl font-bold sm:text-2xl">
                {dayLabel}
              </h2>
              <ol className="mt-6 space-y-0">
                {items.map((item, i) => (
                  <li
                    key={`${item.time}-${item.title}`}
                    className="relative grid grid-cols-[4.5rem_1fr] gap-4 sm:grid-cols-[6rem_1fr] sm:gap-6"
                  >
                    {/* Pionowa linia osi czasu */}
                    <span
                      aria-hidden
                      className={`absolute left-[4.5rem] top-2 ml-[-5px] h-full w-px bg-line sm:left-[6rem] ${
                        i === items.length - 1 ? "hidden" : ""
                      }`}
                    />
                    <time className="pt-0.5 text-right font-display text-sm font-bold tabular-nums text-violet sm:text-base">
                      {item.time}
                    </time>
                    <div className="relative pb-8">
                      <span
                        aria-hidden
                        className="grad-brand absolute -left-[9px] top-[7px] size-2.5 rounded-full ring-4 ring-bg sm:-left-[10px]"
                      />
                      <div className="pl-4 sm:pl-5">
                        <h3 className="text-base font-semibold sm:text-lg">
                          {item.title}
                        </h3>
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-soft">
                          <MapPin size={15} weight="bold" />
                          {item.place}
                        </p>
                        {item.desc ? (
                          <p className="mt-1.5 max-w-prose text-sm text-ink-soft">
                            {item.desc}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
