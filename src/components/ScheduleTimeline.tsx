"use client";

import { MapPin, Confetti } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
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
  const reduce = useReducedMotion();
  const filtered = entries.filter((e) => e.mode === mode);

  const days = new Map<string, ScheduleEntry[]>();
  for (const entry of filtered) {
    const list = days.get(entry.dayLabel) ?? [];
    list.push(entry);
    days.set(entry.dayLabel, list);
  }

  return (
    <div>
      <ModeSwitcher options={modes.map((m) => ({ id: m.id, label: m.label }))} />

      {filtered.length === 0 ? (
        <p className="mt-8 text-ink-soft">{emptyLabel}</p>
      ) : (
        <div className="mt-10 space-y-12">
          {[...days.entries()].map(([dayLabel, items]) => (
            <section key={dayLabel}>
              <h2 className="font-display text-xl font-bold sm:text-2xl">
                {dayLabel}
              </h2>

              <ol className="mt-6 space-y-3">
                {items.map((item, i) => (
                  <motion.li
                    key={`${dayLabel}-${item.title}`}
                    initial={reduce ? false : { opacity: 0, x: -14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 0.45,
                      delay: reduce ? 0 : i * 0.07,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`group flex items-start gap-4 rounded-tile border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${
                      item.highlight
                        ? "grad-brand border-transparent text-white shadow-lg shadow-magenta/20"
                        : "border-line bg-surface hover:border-violet"
                    }`}
                  >
                    <span
                      className={`mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        item.highlight
                          ? "bg-white/20 text-white"
                          : "grad-brand text-white"
                      }`}
                    >
                      {item.highlight ? (
                        <Confetti size={17} weight="fill" />
                      ) : (
                        i + 1
                      )}
                    </span>

                    <div className="min-w-0">
                      <h3
                        className={`text-base font-semibold sm:text-lg ${
                          item.highlight ? "text-white" : ""
                        }`}
                      >
                        {item.title}
                      </h3>
                      {item.place ? (
                        <p
                          className={`mt-1 flex items-center gap-1.5 text-sm ${
                            item.highlight ? "text-white/90" : "text-ink-soft"
                          }`}
                        >
                          <MapPin size={15} weight="bold" />
                          {item.place}
                        </p>
                      ) : null}
                      {item.desc ? (
                        <p
                          className={`mt-1.5 max-w-prose text-sm ${
                            item.highlight ? "text-white/90" : "text-ink-soft"
                          }`}
                        >
                          {item.desc}
                        </p>
                      ) : null}
                    </div>
                  </motion.li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}