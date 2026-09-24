import type { StudyMode } from "./content";
import type { Lang, Level, PlanDay, ScheduleLabels } from "./schedule";

/*
  Eksport osobistego planu do kalendarza (.ics, RFC 5545) - bez bibliotek.
  Wydarzenie trwa 1-3.10.2026, czyli w czasie letnim: godziny z harmonogramu
  to czas polski UTC+2 (zmiana czasu dopiero 25.10).
*/
const TZ_OFFSET = "+02:00";

/** Czas trwania punktów bez godziny końca (min) - wpis w kalendarzu to głównie przypomnienie. */
const DEFAULT_MINUTES: Partial<Record<string, number>> = { party: 240 };

export type CalText = {
  /** np. "Sala 106 A (budynek A)" */
  room: (room: string) => string;
  campus: string;
  online: (level: Level, lang: Lang) => string;
};

export type IcsEvent = {
  uid: string;
  start: Date;
  end: Date;
  title: string;
  location?: string;
  description?: string;
  url?: string;
};

function at(date: string, time: string) {
  const [h, m] = time.split(":");
  return new Date(`${date}T${h.padStart(2, "0")}:${m}:00${TZ_OFFSET}`);
}

/** Punkty planu z godziną i salą -> wydarzenia kalendarza. */
export function planToEvents(
  plan: PlanDay[],
  labels: ScheduleLabels,
  mode: StudyMode,
  text: CalText
): IcsEvent[] {
  const events: IcsEvent[] = [];
  for (const day of plan) {
    for (const item of day.items) {
      if (!item.from || item.needs) continue;
      if (item.online && !item.online.active) continue;

      const label = labels.items[item.id];
      const start = at(day.date, item.from);
      const end = item.to
        ? at(day.date, item.to)
        : new Date(start.getTime() + (DEFAULT_MINUTES[item.id] ?? 60) * 60_000);

      let title = label.title;
      if (item.room) title += ` · ${item.room}`;
      if (item.online) title += ` · ${text.online(item.online.level, item.online.lang)}`;

      const location = item.room
        ? `${text.room(item.room)}, ${text.campus}`
        : item.place ?? (item.online ? "YouTube" : text.campus);

      events.push({
        uid: `${day.date}-${item.id}-${item.from}@dni-adaptacyjne-2026`,
        start,
        end,
        title,
        location,
        description: (item.id === "party" && mode === "part" ? label.descPart : label.desc) ?? undefined,
        url: item.online?.href ?? item.href,
      });
    }
  }
  return events;
}

/** Date -> 20261001T070000Z */
export function icsDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escape(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

/** Zawija linie do 75 bajtów (RFC 5545), nie rozcinając znaków UTF-8. */
function fold(line: string): string {
  const enc = new TextEncoder();
  const out: string[] = [];
  let cur = "";
  let bytes = 0;
  for (const ch of line) {
    const n = enc.encode(ch).length;
    // pierwsza linia: 75 bajtów; kolejne zaczynają się spacją, więc 74
    const limit = out.length === 0 ? 75 : 74;
    if (bytes + n > limit) {
      out.push(cur);
      cur = "";
      bytes = 0;
    }
    cur += ch;
    bytes += n;
  }
  out.push(cur);
  return out.join("\r\n ");
}

export function toIcs(events: IcsEvent[], opts: { name: string; now?: Date }): string {
  const stamp = icsDate(opts.now ?? new Date());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Samorzad Studentow UEW//Dni Adaptacyjne 2026//PL",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escape(opts.name)}`,
  ];
  for (const e of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.uid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${icsDate(e.start)}`,
      `DTEND:${icsDate(e.end)}`,
      `SUMMARY:${escape(e.title)}`
    );
    if (e.location) lines.push(`LOCATION:${escape(e.location)}`);
    if (e.description) lines.push(`DESCRIPTION:${escape(e.description)}`);
    if (e.url) lines.push(`URL:${e.url}`);
    lines.push(
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      "TRIGGER:-PT30M",
      `DESCRIPTION:${escape(e.title)}`,
      "END:VALARM",
      "END:VEVENT"
    );
  }
  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}
