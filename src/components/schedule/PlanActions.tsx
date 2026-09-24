"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { CalendarPlus, LinkSimple, Check, ShareNetwork } from "@phosphor-icons/react";
import type { StudyMode } from "@/lib/content";
import { buildingOf, type Picks, type PlanDay, type ScheduleLabels } from "@/lib/schedule";
import { planToEvents, toIcs } from "@/lib/ics";

const btn =
  "inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-bold transition-colors hover:border-violet hover:text-violet";

/** „Dodaj do kalendarza” (.ics z osobistym planem) i link do planu. */
export default function PlanActions({
  plan,
  labels,
  mode,
  picks,
}: {
  plan: PlanDay[];
  labels: ScheduleLabels;
  mode: StudyMode;
  picks: Picks;
}) {
  const t = useTranslations("schedule.actions");
  const tp = useTranslations("schedule.picker");
  const [copied, setCopied] = useState(false);
  // udostępnianie systemowe tylko na telefonach (na komputerze kopiujemy link);
  // znane dopiero w przeglądarce
  const [canShare, setCanShare] = useState(false);
  useEffect(
    () =>
      setCanShare(
        typeof navigator.share === "function" && window.matchMedia("(pointer: coarse)").matches
      ),
    []
  );

  if (!picks.program && !picks.online) return null;
  const complete = plan.every((d) => d.items.every((i) => !i.needs));

  function downloadIcs() {
    const events = planToEvents(plan, labels, mode, {
      room: (room) => t("calRoom", { room, building: buildingOf(room) }),
      campus: t("calCampus"),
      online: (level, lang) =>
        `${tp(level === 1 ? "level1" : "level2")} · ${tp(lang === "pl" ? "langPl" : "langEn")}`,
    });
    const blob = new Blob([toIcs(events, { name: t("calName") })], {
      type: "text/calendar;charset=utf-8",
    });
    const slug = picks.online
      ? `ns-${picks.online.level}-${picks.online.lang}`
      : [picks.program, picks.group].filter(Boolean).join("-");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `dni-adaptacyjne-${slug.toLowerCase()}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  async function shareLink() {
    const url = window.location.href;
    if (canShare) {
      try {
        await navigator.share({ title: t("calName"), url });
        return;
      } catch {
        /* anulowane albo niedostępne - kopiujemy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt(t("copy"), url);
    }
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {complete ? (
        <button type="button" onClick={downloadIcs} className={btn}>
          <CalendarPlus size={18} weight="bold" className="text-violet" />
          {t("calendar")}
        </button>
      ) : null}
      <button type="button" onClick={shareLink} className={btn} aria-live="polite">
        {copied ? (
          <Check size={18} weight="bold" className="text-green" />
        ) : canShare ? (
          <ShareNetwork size={18} weight="bold" className="text-violet" />
        ) : (
          <LinkSimple size={18} weight="bold" className="text-violet" />
        )}
        {copied ? t("copied") : canShare ? t("share") : t("copy")}
      </button>
    </div>
  );
}
