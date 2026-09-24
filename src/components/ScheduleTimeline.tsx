"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  MapPin,
  Confetti,
  Info,
  YoutubeLogo,
  ArrowSquareOut,
} from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import type { ModeInfo } from "@/lib/content";
import {
  buildPlan,
  levelOf,
  type PlanItem,
  type ScheduleData,
  type ScheduleLabels,
} from "@/lib/schedule";
import ModeSwitcher from "./ModeSwitcher";
import JustifiedGallery from "./JustifiedGallery";
import { useStudyMode } from "./StudyModeContext";
import ProgramPicker from "./schedule/ProgramPicker";
import RoomButton from "./schedule/RoomButton";
import FullSchedule from "./schedule/FullSchedule";
import { usePicks } from "./schedule/usePicks";

type Foto = { n: string; ar: number; full?: boolean };

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

export default function ScheduleTimeline({
  data,
  labels,
  modes,
  photos,
  galleryLabel,
}: {
  data: ScheduleData;
  labels: ScheduleLabels;
  modes: ModeInfo[];
  photos?: Partial<Record<string, Foto[]>>;
  galleryLabel: string;
}) {
  const t = useTranslations("schedule");
  const tp = useTranslations("schedule.picker");
  const { mode } = useStudyMode();
  const { picks, setPicks } = usePicks(data, mode);
  const reduce = useReducedMotion();
  const plan = useMemo(() => buildPlan(data, mode, picks), [data, mode, picks]);
  const level = levelOf(mode);
  const modePhotos = photos?.[mode] ?? [];
  const tourTimes = data.tours.rounds.map((r) => r.time).join(" · ");

  function time(item: PlanItem) {
    if (item.id === "tour" && item.needs) return tourTimes;
    if (!item.from) return null;
    if (item.to) return `${item.from}-${item.to}`;
    return item.id === "lecture" || item.id === "online" || item.id === "party"
      ? `${t("plan.from")} ${item.from}`
      : item.from;
  }

  function hint(item: PlanItem) {
    if (item.needs === "online") return t("plan.needsOnline");
    if (item.id === "tour" && item.needs) return t("plan.needsTour");
    if (item.needs === "group") return t("plan.needsGroup");
    if (item.needs === "program") return t("plan.needsProgram");
    return null;
  }

  return (
    <div>
      <ModeSwitcher options={modes.map((m) => ({ id: m.id, label: m.label }))} />

      <div className="mt-6">
        <ProgramPicker
          data={data}
          labels={labels}
          mode={mode}
          picks={picks}
          setPicks={setPicks}
        />
      </div>

      <div className="mt-10 space-y-12">
        {plan.map((day) => (
          <section key={day.date}>
            <h2 className="font-display text-xl font-bold sm:text-2xl">
              {labels.days[day.date]}
            </h2>

            <ol className="mt-6 space-y-3">
              {day.items.map((item, i) => {
                const label = labels.items[item.id];
                const hi = !!item.highlight;
                const soft = hi ? "text-white/90" : "text-ink-soft";
                // przy 4 slotach online opis i podpowiedź tylko raz
                const firstOnline = item.id !== "online" || i === 0;
                const desc =
                  item.id === "party" && mode === "part" ? label.descPart : label.desc;
                const note = firstOnline ? hint(item) : null;
                const when = time(item);

                return (
                  <motion.li
                    key={`${day.date}-${item.id}-${item.from ?? i}`}
                    // stan początkowy taki sam na serwerze i kliencie (bez błędu
                    // hydratacji); przy ograniczonym ruchu karta pojawia się od razu
                    initial={{ opacity: 0, x: -14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: reduce ? 0 : 0.45,
                      delay: reduce ? 0 : i * 0.07,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`flex flex-col gap-3 rounded-tile border p-4 transition-shadow hover:shadow-md sm:flex-row sm:gap-5 sm:p-5 ${
                      hi
                        ? "grad-brand border-transparent text-white shadow-lg shadow-magenta/20"
                        : "border-line bg-surface hover:border-violet"
                    }`}
                  >
                    <div className="flex shrink-0 items-center gap-2.5 whitespace-nowrap sm:w-36 sm:flex-col sm:items-start">
                      {item.id === "party" ? (
                        <span className="inline-flex size-8 items-center justify-center rounded-full bg-white/20">
                          <Confetti size={17} weight="fill" />
                        </span>
                      ) : null}
                      {when ? (
                        <span
                          className={`font-display text-base font-bold tabular-nums sm:text-lg ${
                            hi ? "text-white" : "text-violet"
                          } ${item.id === "tour" && item.needs ? "text-sm sm:text-sm" : ""}`}
                        >
                          {when}
                        </span>
                      ) : null}
                    </div>

                    <div className="min-w-0">
                      <h3 className={`text-base font-semibold sm:text-lg ${hi ? "text-white" : ""}`}>
                        {label.title}
                      </h3>

                      {item.online ? (
                        <p className={`mt-1 flex flex-wrap items-center gap-2 text-sm font-semibold ${soft}`}>
                          {tp(item.online.level === 1 ? "level1" : "level2")} ·{" "}
                          {tp(item.online.lang === "pl" ? "langPl" : "langEn")}
                          {item.online.active ? (
                            <span className="rounded-full bg-white/25 px-2.5 py-0.5 text-xs font-bold text-white">
                              {t("plan.yourSlot")}
                            </span>
                          ) : null}
                        </p>
                      ) : null}

                      {item.room ? (
                        <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-ink-soft">
                          {item.id === "tour" && item.tour ? (
                            <span className="font-semibold text-ink">
                              {t("plan.tour", { n: ROMAN[item.tour - 1] })} ·{" "}
                              {t("plan.meeting")}:
                            </span>
                          ) : null}
                          <RoomButton room={item.room} />
                        </p>
                      ) : null}

                      {item.place ? (
                        <p className={`mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm ${soft}`}>
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin size={15} weight="bold" />
                            {item.place}
                          </span>
                          {item.href ? (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-bold underline underline-offset-2"
                            >
                              {t("plan.directions")}
                              <ArrowSquareOut size={13} weight="bold" />
                            </a>
                          ) : null}
                        </p>
                      ) : null}

                      {desc && firstOnline ? (
                        <p className={`mt-1.5 max-w-prose text-sm ${soft}`}>{desc}</p>
                      ) : null}

                      {item.online && (item.online.active || (!picks.online && i === 0)) ? (
                        item.online.href ? (
                          <a
                            href={item.online.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`mt-2 inline-flex items-center gap-1.5 text-sm font-bold underline underline-offset-2 ${
                              hi ? "text-white" : "text-violet"
                            }`}
                          >
                            <YoutubeLogo size={17} weight="fill" />
                            {t("plan.watch")}
                          </a>
                        ) : (
                          <p className={`mt-2 inline-flex items-center gap-1.5 text-sm ${soft}`}>
                            <YoutubeLogo size={17} weight="fill" />
                            {t("plan.linkSoon")}
                          </p>
                        )
                      ) : null}

                      {note ? (
                        <p className="mt-2 inline-flex items-start gap-1.5 rounded-lg bg-gold-soft px-2.5 py-1.5 text-sm font-medium text-ink">
                          <Info size={16} weight="fill" className="mt-0.5 shrink-0 text-amber" />
                          {note}
                        </p>
                      ) : null}
                    </div>
                  </motion.li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>

      {level ? <FullSchedule data={data} labels={labels} level={level} picks={picks} /> : null}

      {modePhotos.length > 0 ? (
        <div className="mt-14">
          <div className="flex items-center gap-3">
            <h3 className="font-display text-lg font-bold sm:text-xl">{galleryLabel}</h3>
            <span className="grad-line h-px flex-1 rounded-full opacity-60" />
          </div>
          <JustifiedGallery items={modePhotos} />
        </div>
      ) : null}
    </div>
  );
}
