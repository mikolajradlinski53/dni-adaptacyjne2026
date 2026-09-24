"use client";

import { useTranslations } from "next-intl";
import { CaretDown } from "@phosphor-icons/react";
import type { Level, Picks, ScheduleData, ScheduleLabels } from "@/lib/schedule";
import RoomButton from "./RoomButton";

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

// [5, 6, 7] -> "5-7"; nieciągłe -> "1, 3".
function groupList(groups: number[]) {
  const sorted = [...groups].sort((a, b) => a - b);
  const contiguous = sorted.every((g, i) => i === 0 || g === sorted[i - 1] + 1);
  return contiguous && sorted.length > 1
    ? `${sorted[0]}-${sorted[sorted.length - 1]}`
    : sorted.join(", ");
}

/** Zwinięty pełny rozkład: wszystkie tury i sale prelekcji danego stopnia. */
export default function FullSchedule({
  data,
  labels,
  level,
  picks,
}: {
  data: ScheduleData;
  labels: ScheduleLabels;
  level: Level;
  picks: Picks;
}) {
  const t = useTranslations("schedule");
  const lecture = data.lectures.find((l) => l.level === level);

  return (
    <details className="group mt-14 rounded-tile border border-line bg-surface">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6 [&::-webkit-details-marker]:hidden">
        <span>
          <span className="block font-display text-lg font-bold sm:text-xl">
            {t("full.title")}
          </span>
          <span className="mt-0.5 block text-sm text-ink-soft">{t("full.hint")}</span>
        </span>
        <CaretDown
          size={22}
          weight="bold"
          className="shrink-0 text-violet transition-transform group-open:rotate-180"
        />
      </summary>

      <div className="space-y-10 border-t border-line p-5 sm:p-6">
        {level === 1 ? (
          <section>
            <h3 className="font-display text-base font-bold sm:text-lg">
              {t("full.tours")}
            </h3>
            <div className="mt-4 space-y-6">
              {data.tours.rounds.map((r) => (
                <div key={r.tour}>
                  <p className="text-sm font-bold">
                    {t("plan.tour", { n: ROMAN[r.tour - 1] })} · {r.time}
                  </p>
                  <ul className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
                    {r.slots.map((s) => {
                      const mine = s.program === picks.program;
                      const exact = mine && s.group === picks.group;
                      return (
                        <li
                          key={`${s.program}-${s.group}`}
                          className={`flex flex-col items-start gap-1.5 rounded-xl border p-2.5 ${
                            exact
                              ? "grad-brand border-transparent text-white shadow-md"
                              : mine
                                ? "border-violet bg-violet-soft"
                                : "border-line"
                          }`}
                        >
                          <span className="font-display text-sm font-bold">
                            {s.program} {s.group}
                          </span>
                          <RoomButton room={s.room} size="sm" />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {lecture ? (
          <section>
            <h3 className="font-display text-base font-bold sm:text-lg">
              {t("full.lectures")} · {labels.days[lecture.date]}, {t("plan.from")}{" "}
              {lecture.time}
            </h3>
            <table className="mt-4 w-full text-left text-sm">
              <thead className="sr-only">
                <tr>
                  <th>{t("full.room")}</th>
                  <th>{t("full.programs")}</th>
                </tr>
              </thead>
              <tbody>
                {lecture.rooms.map((r) => {
                  const mine = r.programs.some(
                    (p) =>
                      p.code === picks.program &&
                      (!p.groups || picks.group === undefined || p.groups.includes(picks.group))
                  );
                  return (
                    <tr
                      key={r.room}
                      className={`border-t border-line first:border-t-0 ${mine ? "bg-violet-soft" : ""}`}
                    >
                      <td className="w-28 py-3 pr-3 align-top sm:w-36">
                        <RoomButton room={r.room} size="sm" />
                      </td>
                      <td className="py-3 pr-2">
                        {r.programs.map((p, i) => (
                          <span key={`${p.code}-${i}`}>
                            {i > 0 ? ", " : ""}
                            <span className={p.code === picks.program ? "font-bold" : ""}>
                              {labels.programs[p.code]}
                            </span>
                            {p.groups ? (
                              <span className="text-ink-soft">
                                {" "}
                                ({t("full.groups", { list: groupList(p.groups) })})
                              </span>
                            ) : null}
                          </span>
                        ))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        ) : null}
      </div>
    </details>
  );
}
