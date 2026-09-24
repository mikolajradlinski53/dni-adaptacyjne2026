import type { StudyMode } from "./content";

/*
  Harmonogram DA26: dane z content/schedule-data.json (bez tekstów)
  + czyste funkcje budujące osobisty plan. Bez Reacta - testy: npm test.
*/

export type Level = 1 | 2;
export type Lang = "pl" | "en";

export type Program = { code: string; level: Level; groups?: number };
export type TourSlot = { room: string; program: string; group: number };
export type TourRound = { tour: number; time: string; slots: TourSlot[] };
export type LectureRoom = {
  room: string;
  programs: { code: string; groups?: number[] }[];
};
export type Lecture = {
  level: Level;
  date: string;
  time: string;
  rooms: LectureRoom[];
};
export type GeneralItem = {
  id: "stands" | "attractions" | "after" | "classes" | "party";
  date: string;
  from?: string;
  to?: string;
  modes: StudyMode[];
  highlight?: boolean;
  place?: string;
  href?: string;
};
export type OnlineSlot = { level: Level; lang: Lang; time: string; href?: string };

export type ScheduleData = {
  programs: Program[];
  tours: { date: string; rounds: TourRound[] };
  lectures: Lecture[];
  general: GeneralItem[];
  online: { date: string; slots: OnlineSlot[] };
};

export const ITEM_IDS = [
  "tour",
  "lecture",
  "stands",
  "attractions",
  "after",
  "classes",
  "party",
  "online",
] as const;
export type ItemId = (typeof ITEM_IDS)[number];

export type ItemLabel = { title: string; desc?: string; descPart?: string };
export type ScheduleLabels = {
  days: Record<string, string>;
  programs: Record<string, string>;
  items: Record<ItemId, ItemLabel>;
};

export type OnlinePick = { level: Level; lang: Lang };
export type Picks = { program?: string; group?: number; online?: OnlinePick };

export type PlanItem = {
  id: ItemId;
  from?: string;
  to?: string;
  room?: string;
  tour?: number;
  highlight?: boolean;
  place?: string;
  href?: string;
  /** Czego brakuje w wyborze, żeby pokazać salę/godzinę. */
  needs?: "program" | "group" | "online";
  online?: OnlinePick & { href?: string; active: boolean };
};
export type PlanDay = { date: string; items: PlanItem[] };

export function levelOf(mode: StudyMode): Level | null {
  return mode === "full1" ? 1 : mode === "full2" ? 2 : null;
}

export function programsFor(data: ScheduleData, level: Level): Program[] {
  return data.programs.filter((p) => p.level === level);
}

function findProgram(data: ScheduleData, level: Level, code: string) {
  return data.programs.find((p) => p.level === level && p.code === code);
}

/** "113 Z" -> "Z", "1+2 P" -> "P". */
export function buildingOf(room: string): string {
  const parts = room.trim().split(/\s+/);
  return parts[parts.length - 1];
}

export function findTour(data: ScheduleData, program: string, group: number) {
  for (const r of data.tours.rounds) {
    const slot = r.slots.find((s) => s.program === program && s.group === group);
    if (slot) return { tour: r.tour, time: r.time, room: slot.room };
  }
  return null;
}

/** Czy sala prelekcji zależy od grupy (np. zarządzanie w piątek). */
export function lectureNeedsGroup(data: ScheduleData, level: Level, program: string) {
  const lecture = data.lectures.find((l) => l.level === level);
  return !!lecture?.rooms.some((r) =>
    r.programs.some((p) => p.code === program && p.groups)
  );
}

/** Sala prelekcji; null, gdy kierunku brak albo sala zależy od nieznanej grupy. */
export function findLectureRoom(
  data: ScheduleData,
  level: Level,
  program: string,
  group?: number
): string | null {
  const lecture = data.lectures.find((l) => l.level === level);
  if (!lecture) return null;
  for (const r of lecture.rooms) {
    for (const p of r.programs) {
      if (p.code !== program) continue;
      if (!p.groups) return r.room;
      if (group !== undefined && p.groups.includes(group)) return r.room;
    }
  }
  return null;
}

/** Waliduje wybór odczytany np. z localStorage. */
export function sanitizePicks(
  data: ScheduleData,
  mode: StudyMode,
  raw: unknown
): Picks {
  if (!raw || typeof raw !== "object") return {};
  const r = raw as Record<string, unknown>;

  if (mode === "part") {
    const o = r.online as Record<string, unknown> | undefined;
    if (o && (o.level === 1 || o.level === 2) && (o.lang === "pl" || o.lang === "en")) {
      return { online: { level: o.level, lang: o.lang } };
    }
    return {};
  }

  const level = levelOf(mode)!;
  const program =
    typeof r.program === "string" ? findProgram(data, level, r.program) : undefined;
  if (!program) return {};
  if (!program.groups) return { program: program.code };
  if (program.groups === 1) return { program: program.code, group: 1 };
  const g = r.group;
  if (typeof g === "number" && Number.isInteger(g) && g >= 1 && g <= program.groups) {
    return { program: program.code, group: g };
  }
  return { program: program.code };
}

/* Linki z gotowym wyborem, np. /harmonogram?tryb=s1&kierunek=FIR&grupa=5 */
const MODE_PARAM: Record<StudyMode, string> = { full1: "s1", full2: "s2", part: "ns" };

/** Wybór -> query string (bez "?"); pusty, gdy nic nie wybrano. */
export function picksToQuery(mode: StudyMode, picks: Picks): string {
  const q = new URLSearchParams();
  if (mode === "part" && picks.online) {
    q.set("tryb", MODE_PARAM[mode]);
    q.set("stopien", String(picks.online.level));
    q.set("jezyk", picks.online.lang);
  } else if (mode !== "part" && picks.program) {
    q.set("tryb", MODE_PARAM[mode]);
    q.set("kierunek", picks.program);
    if (picks.group) q.set("grupa", String(picks.group));
  }
  return q.toString();
}

/** Query string -> tryb i (zwalidowany) wybór; null, gdy brak/nieznany tryb. */
export function queryToPicks(
  data: ScheduleData,
  params: URLSearchParams
): { mode: StudyMode; picks: Picks } | null {
  const tryb = params.get("tryb");
  const mode = (Object.keys(MODE_PARAM) as StudyMode[]).find((m) => MODE_PARAM[m] === tryb);
  if (!mode) return null;
  const raw = {
    program: params.get("kierunek")?.toUpperCase(),
    group: params.has("grupa") ? Number(params.get("grupa")) : undefined,
    online: { level: Number(params.get("stopien")), lang: params.get("jezyk") },
  };
  return { mode, picks: sanitizePicks(data, mode, raw) };
}

function minutes(t?: string): number {
  if (!t) return -1;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function buildPlan(
  data: ScheduleData,
  mode: StudyMode,
  picks: Picks
): PlanDay[] {
  const items = new Map<string, PlanItem[]>();
  const push = (date: string, item: PlanItem) => {
    items.set(date, [...(items.get(date) ?? []), item]);
  };

  const level = levelOf(mode);
  const program = level && picks.program ? findProgram(data, level, picks.program) : undefined;

  // Droga przez kampus (tylko I stopień)
  if (level === 1) {
    const found = program && picks.group ? findTour(data, program.code, picks.group) : null;
    push(
      data.tours.date,
      found
        ? { id: "tour", from: found.time, room: found.room, tour: found.tour }
        : {
            id: "tour",
            from: data.tours.rounds[0].time,
            needs: program ? "group" : "program",
          }
    );
  }

  // Prelekcje w salach
  if (level) {
    const lecture = data.lectures.find((l) => l.level === level);
    if (lecture) {
      const room = program ? findLectureRoom(data, level, program.code, picks.group) : null;
      push(lecture.date, {
        id: "lecture",
        from: lecture.time,
        ...(room ? { room } : { needs: program ? "group" : "program" }),
      });
    }
  }

  // Transmisje online (niestacjonarne)
  if (mode === "part") {
    for (const s of data.online.slots) {
      const active =
        picks.online?.level === s.level && picks.online?.lang === s.lang;
      push(data.online.date, {
        id: "online",
        from: s.time,
        highlight: active,
        needs: picks.online ? undefined : "online",
        online: { level: s.level, lang: s.lang, href: s.href, active },
      });
    }
  }

  for (const g of data.general) {
    if (!g.modes.includes(mode)) continue;
    push(g.date, {
      id: g.id,
      from: g.from,
      to: g.to,
      highlight: g.highlight,
      place: g.place,
      href: g.href,
    });
  }

  // chronologicznie; dla niestacjonarnych najpierw transmisja (główne wydarzenie),
  // a piątkowa impreza jako dodatek pod spodem
  const main = mode === "part" ? data.online.date : null;
  return [...items.entries()]
    .sort(([a], [b]) => (a === main ? -1 : b === main ? 1 : a.localeCompare(b)))
    .map(([date, list]) => ({
      date,
      // stabilne sortowanie: przy tej samej godzinie zostaje kolejność wstawiania
      items: [...list].sort((a, b) => minutes(a.from) - minutes(b.from)),
    }));
}

/** Kontrola spójności danych; zwraca listę błędów (pusta = OK). */
export function validateScheduleData(data: ScheduleData, buildings: string[]): string[] {
  const errors: string[] = [];
  const rooms = new Set<string>();

  for (const p of programsFor(data, 1)) {
    const groups = p.groups ?? 0;
    if (groups < 1) errors.push(`${p.code}: I stopień bez liczby grup`);
    for (let g = 1; g <= groups; g++) {
      const hits = data.tours.rounds.flatMap((r) =>
        r.slots.filter((s) => s.program === p.code && s.group === g)
      );
      if (hits.length !== 1) errors.push(`${p.code} ${g}: ${hits.length} tur (ma być 1)`);
      if (!findLectureRoom(data, 1, p.code, g)) errors.push(`${p.code} ${g}: brak sali prelekcji`);
    }
  }
  for (const r of data.tours.rounds) {
    for (const s of r.slots) {
      rooms.add(s.room);
      const p = findProgram(data, 1, s.program);
      if (!p) errors.push(`tura ${r.tour}: nieznany kierunek ${s.program}`);
      else if (s.group > (p.groups ?? 0)) errors.push(`tura ${r.tour}: ${s.program} ${s.group} poza zakresem grup`);
    }
  }
  for (const p of programsFor(data, 2)) {
    if (p.groups) errors.push(`${p.code}: II stopień nie ma grup`);
    if (!findLectureRoom(data, 2, p.code)) errors.push(`${p.code} (II st.): brak sali prelekcji`);
  }
  for (const l of data.lectures) {
    for (const r of l.rooms) {
      rooms.add(r.room);
      for (const p of r.programs) {
        if (!findProgram(data, l.level, p.code)) errors.push(`prelekcje ${l.level} st.: nieznany kierunek ${p.code}`);
      }
    }
  }
  for (const room of rooms) {
    if (!buildings.includes(buildingOf(room))) errors.push(`sala ${room}: brak budynku na mapie`);
  }
  return errors;
}

/** Kontrola kompletności etykiet jednego języka. */
export function validateLabels(data: ScheduleData, labels: ScheduleLabels): string[] {
  const errors: string[] = [];
  const dates = new Set([
    data.tours.date,
    data.online.date,
    ...data.lectures.map((l) => l.date),
    ...data.general.map((g) => g.date),
  ]);
  for (const d of dates) if (!labels.days?.[d]) errors.push(`dzień ${d}`);
  for (const p of data.programs) if (!labels.programs?.[p.code]) errors.push(`kierunek ${p.code}`);
  for (const id of ITEM_IDS) if (!labels.items?.[id]?.title) errors.push(`punkt ${id}`);
  return errors;
}
