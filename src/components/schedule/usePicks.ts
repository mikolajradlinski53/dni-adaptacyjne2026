"use client";

import { useCallback, useEffect, useState } from "react";
import type { StudyMode } from "@/lib/content";
import { sanitizePicks, type Picks, type ScheduleData } from "@/lib/schedule";

const STORAGE_KEY = "da2026-schedule-picks";
const MODES: StudyMode[] = ["full1", "full2", "part"];

type AllPicks = Partial<Record<StudyMode, Picks>>;

/** Wybór kierunku/grupy (albo slotu online) osobno dla każdego trybu. */
export function usePicks(data: ScheduleData, mode: StudyMode) {
  const [all, setAll] = useState<AllPicks>({});

  useEffect(() => {
    try {
      const raw = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
      if (!raw || typeof raw !== "object") return;
      const next: AllPicks = {};
      for (const m of MODES) next[m] = sanitizePicks(data, m, raw[m]);
      setAll(next);
    } catch {
      /* brak dostępu / uszkodzony zapis: startujemy od zera */
    }
  }, [data]);

  const setPicks = useCallback(
    (p: Picks) => {
      setAll((prev) => {
        const next = { ...prev, [mode]: sanitizePicks(data, mode, p) };
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* tryb prywatny: wybór działa w ramach sesji */
        }
        return next;
      });
    },
    [data, mode]
  );

  return { picks: all[mode] ?? {}, setPicks };
}
