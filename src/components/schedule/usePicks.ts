"use client";

import { useCallback, useEffect, useState } from "react";
import type { StudyMode } from "@/lib/content";
import {
  picksToQuery,
  queryToPicks,
  sanitizePicks,
  type Picks,
  type ScheduleData,
} from "@/lib/schedule";
import { useStudyMode } from "../StudyModeContext";

const STORAGE_KEY = "da2026-schedule-picks";
const MODES: StudyMode[] = ["full1", "full2", "part"];

type AllPicks = Partial<Record<StudyMode, Picks>>;

function persist(all: AllPicks) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    /* tryb prywatny: wybór działa w ramach sesji */
  }
}

/**
 * Wybór kierunku/grupy (albo slotu online) osobno dla każdego trybu.
 * Źródła: link (?tryb=s1&kierunek=FIR&grupa=5) > localStorage.
 * Adres strony na bieżąco odzwierciedla wybór - gotowy do skopiowania.
 */
export function usePicks(data: ScheduleData) {
  const { mode, setMode } = useStudyMode();
  const [all, setAll] = useState<AllPicks>({});
  const [ready, setReady] = useState(false);

  const setPicksFor = useCallback(
    (m: StudyMode, p: Picks) => {
      setAll((prev) => {
        const next = { ...prev, [m]: sanitizePicks(data, m, p) };
        persist(next);
        return next;
      });
    },
    [data]
  );

  /** Zastosuj wybór z query stringa (link / wynik wyszukiwarki). */
  const applyQuery = useCallback(
    (params: URLSearchParams) => {
      const fromUrl = queryToPicks(data, params);
      if (!fromUrl) return;
      setMode(fromUrl.mode);
      setPicksFor(fromUrl.mode, fromUrl.picks);
    },
    [data, setMode, setPicksFor]
  );

  useEffect(() => {
    const stored: AllPicks = {};
    try {
      const raw = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
      if (raw && typeof raw === "object") {
        for (const m of MODES) stored[m] = sanitizePicks(data, m, raw[m]);
      }
    } catch {
      /* brak dostępu / uszkodzony zapis: startujemy od zera */
    }
    // to, co już ustawiono (np. z linku), wygrywa z zapisem w przeglądarce
    setAll((prev) => {
      const next = { ...stored, ...prev };
      persist(next);
      return next;
    });
    applyQuery(new URLSearchParams(window.location.search));
    setReady(true);
  }, [data, applyQuery]);

  const picks = all[mode] ?? {};

  useEffect(() => {
    if (!ready) return;
    const q = picksToQuery(mode, picks);
    const url = q ? `${window.location.pathname}?${q}` : window.location.pathname;
    if (url !== window.location.pathname + window.location.search) {
      window.history.replaceState(window.history.state, "", url);
    }
  }, [ready, mode, picks]);

  const setPicks = useCallback((p: Picks) => setPicksFor(mode, p), [mode, setPicksFor]);

  return { mode, picks, setPicks, applyQuery };
}
