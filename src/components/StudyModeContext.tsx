"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { StudyMode } from "@/lib/content";

const STORAGE_KEY = "da2026-study-mode";

type Ctx = {
  mode: StudyMode;
  setMode: (m: StudyMode) => void;
};

const StudyModeContext = createContext<Ctx>({
  mode: "full1",
  setMode: () => {},
});

export function StudyModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<StudyMode>("full1");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "full1" || saved === "full2" || saved === "part") {
      setModeState(saved);
    }
  }, []);

  const setMode = useCallback((m: StudyMode) => {
    setModeState(m);
    try {
      window.localStorage.setItem(STORAGE_KEY, m);
    } catch {
      /* tryb prywatny: wybór działa w ramach sesji */
    }
  }, []);

  return (
    <StudyModeContext.Provider value={{ mode, setMode }}>
      {children}
    </StudyModeContext.Provider>
  );
}

export function useStudyMode() {
  return useContext(StudyModeContext);
}
