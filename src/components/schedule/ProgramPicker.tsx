"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { MagnifyingGlass, ArrowCounterClockwise } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import type { StudyMode } from "@/lib/content";
import {
  levelOf,
  programsFor,
  type Lang,
  type Level,
  type Picks,
  type ScheduleData,
  type ScheduleLabels,
} from "@/lib/schedule";

// Wyszukiwanie bez polskich znaków: "spoleczna" znajdzie "społeczna".
function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/ł/g, "l");
}

const chip = (active: boolean) =>
  `rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
    active
      ? "grad-brand border-transparent text-white shadow-sm"
      : "border-line bg-surface text-ink-soft hover:border-violet hover:text-ink"
  }`;

export default function ProgramPicker({
  data,
  labels,
  mode,
  picks,
  setPicks,
}: {
  data: ScheduleData;
  labels: ScheduleLabels;
  mode: StudyMode;
  picks: Picks;
  setPicks: (p: Picks) => void;
}) {
  const t = useTranslations("schedule.picker");
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const level = levelOf(mode);

  const programs = useMemo(
    () =>
      level
        ? [...programsFor(data, level)].sort((a, b) =>
            labels.programs[a.code].localeCompare(labels.programs[b.code], locale)
          )
        : [],
    [data, labels, level, locale]
  );

  if (!level) {
    const online = picks.online;
    const pick = (next: Partial<{ level: Level; lang: Lang }>) =>
      setPicks({
        online: {
          level: next.level ?? online?.level ?? 1,
          lang: next.lang ?? online?.lang ?? "pl",
        },
      });
    return (
      <div className="rounded-tile border border-line bg-surface p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <fieldset>
            <legend className="text-sm font-bold">{t("level")}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {([1, 2] as Level[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={online?.level === l}
                  onClick={() => pick({ level: l })}
                  className={chip(online?.level === l)}
                >
                  {t(l === 1 ? "level1" : "level2")}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-sm font-bold">{t("lang")}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["pl", "en"] as Lang[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={online?.lang === l}
                  onClick={() => pick({ lang: l })}
                  className={chip(online?.lang === l)}
                >
                  {t(l === "pl" ? "langPl" : "langEn")}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      </div>
    );
  }

  const selected = programs.find((p) => p.code === picks.program);

  if (selected) {
    const groups = level === 1 ? selected.groups ?? 1 : 1;
    return (
      <div className="rounded-tile border border-line bg-surface p-5 sm:p-6">
        <p className="text-sm font-bold">{t("program")}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="grad-brand rounded-lg px-2.5 py-1 font-display text-sm font-bold text-white">
            {selected.code}
          </span>
          <span className="font-semibold">{labels.programs[selected.code]}</span>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setPicks({});
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm font-semibold text-ink-soft transition-colors hover:border-violet hover:text-ink"
          >
            <ArrowCounterClockwise size={15} weight="bold" />
            {t("change")}
          </button>
        </div>

        {groups > 1 ? (
          <fieldset className="mt-5">
            <legend className="text-sm font-bold">{t("group")}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {Array.from({ length: groups }, (_, i) => i + 1).map((g) => (
                <button
                  key={g}
                  type="button"
                  aria-pressed={picks.group === g}
                  onClick={() => setPicks({ program: selected.code, group: g })}
                  className={`min-w-11 ${chip(picks.group === g)}`}
                >
                  {g}
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-ink-soft">{t("groupHint")}</p>
          </fieldset>
        ) : null}
      </div>
    );
  }

  const q = norm(query.trim());
  const visible = q
    ? programs.filter(
        (p) => norm(p.code).startsWith(q) || norm(labels.programs[p.code]).includes(q)
      )
    : programs;

  return (
    <div className="rounded-tile border border-line bg-surface p-5 sm:p-6">
      <label htmlFor="program-search" className="text-sm font-bold">
        {t("program")}
      </label>
      <div className="mt-2 flex items-center gap-2.5 rounded-xl border border-line px-3.5 focus-within:border-violet">
        <MagnifyingGlass size={18} weight="bold" className="shrink-0 text-violet" />
        <input
          id="program-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search")}
          autoComplete="off"
          className="w-full bg-transparent py-3 text-base outline-none placeholder:text-ink-soft/60"
        />
      </div>

      {visible.length === 0 ? (
        <p className="mt-4 text-sm text-ink-soft">{t("noResults")}</p>
      ) : (
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <li key={p.code}>
              <button
                type="button"
                onClick={() => setPicks({ program: p.code })}
                className="flex w-full items-center gap-3 rounded-xl border border-line p-3 text-left transition-all hover:-translate-y-0.5 hover:border-violet hover:shadow-sm"
              >
                <span className="inline-flex min-w-12 shrink-0 justify-center rounded-lg bg-violet-soft px-2 py-1 font-display text-xs font-bold text-violet">
                  {p.code}
                </span>
                <span className="text-sm font-medium">{labels.programs[p.code]}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 text-sm text-ink-soft">
        {t("missing")}{" "}
        <Link href="/kontakt" className="font-semibold text-violet underline-offset-2 hover:underline">
          {t("missingLink")}
        </Link>
      </p>
    </div>
  );
}
