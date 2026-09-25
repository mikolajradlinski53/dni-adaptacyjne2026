import type { FaqItem } from "./content";
import type { ScheduleData, ScheduleLabels } from "./schedule";

/*
  /llms.txt i /llms-full.txt (https://llmstxt.org) - zwięzły opis wydarzenia
  dla modeli językowych i asystentów AI. Generowane z tych samych danych co
  strona, więc zmiana w content/schedule-data.json aktualizuje też te pliki.
*/

export type LlmsContext = {
  siteUrl: string;
  fbEventUrl: string;
  email: string;
  data: ScheduleData;
  labels: ScheduleLabels;
  faq: FaqItem[];
};

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

function range(groups: number[]) {
  const s = [...groups].sort((a, b) => a - b);
  return s.length > 1 ? `${s[0]}-${s[s.length - 1]}` : String(s[0]);
}

function general(ctx: LlmsContext, id: string) {
  const g = ctx.data.general.find((x) => x.id === id);
  return g ? { ...g, when: g.to ? `${g.from}-${g.to}` : `od ${g.from}` } : null;
}

const AUDIENCE: Record<string, string> = {
  full1: "stacjonarne I stopnia",
  full2: "stacjonarne II stopnia",
  part: "niestacjonarne",
};

function onlineLines(ctx: LlmsContext) {
  return ctx.data.online.slots.map((s) => {
    const who = `${s.level === 1 ? "I" : "II"} stopień, ${s.lang === "pl" ? "po polsku" : "po angielsku"}`;
    return `- ${who}: od ${s.time}${s.href ? ` - ${s.href}` : ""}`;
  });
}

export function buildLlms(ctx: LlmsContext): string {
  const u = (path: string, l = "pl") => `${ctx.siteUrl}/${l}${path}`;
  const tourTimes = ctx.data.tours.rounds.map((r) => r.time).join(", ");
  const stands = general(ctx, "stands");
  const attractions = general(ctx, "attractions");
  const after = general(ctx, "after");
  const party = general(ctx, "party");

  return [
    "# Dni Adaptacyjne 2026 - Uniwersytet Ekonomiczny we Wrocławiu",
    "",
    "> Obowiązkowe Dni Adaptacyjne dla studentów I roku Uniwersytetu Ekonomicznego we Wrocławiu (UEW), 1-3 października 2026, kampus UEW, ul. Komandorska 118/120, Wrocław. Organizuje Samorząd Studentów UEW. Strona zawiera osobisty harmonogram dla każdego kierunku i grupy (godziny i sale), mapę kampusu, FAQ i ważne linki na start studiów.",
    "",
    "Najważniejsze informacje:",
    "",
    "- Termin: 1-3 października 2026 (czwartek-sobota).",
    "- Dla kogo: wszyscy studenci I roku UEW - studia I i II stopnia, stacjonarne i niestacjonarne, także anglojęzyczne.",
    "- Obowiązkowe: Droga przez kampus i prelekcje o prawach i obowiązkach studenta (dla studiów niestacjonarnych: transmisja online). Część integracyjna jest dobrowolna.",
    `- Stacjonarne I stopnia: czwartek 1.10 - Droga przez kampus w 4 turach (${tourTimes}); godzina i sala zbiórki zależą od kierunku i numeru grupy. Piątek 2.10 - prelekcje od 9:00, sala zależy od kierunku.`,
    "- Stacjonarne II stopnia: czwartek 1.10 - prelekcje od 9:00 (sala zależy od kierunku); w piątek zwykłe zajęcia.",
    `- Niestacjonarne: sobota ${Number(ctx.data.online.date.slice(8, 10))}.10 - transmisje na YouTube, bez przyjazdu na kampus:`,
    ...onlineLines(ctx).map((l) => `  ${l}`),
    `- Część integracyjna (czwartek 1.10, Zaprzegubie na kampusie): stoiska Samorządu Studenckiego, organizacji studenckich i kół naukowych ${stands?.when}; atrakcje ${attractions?.when} (strefa chillu, duże gry, stoiska partnerów, DJ); after ${after?.when}.`,
    `- UE Party x DA: piątek 2.10, ${party?.when}, ${party?.place}.`,
    `- Zmiany w harmonogramie ogłaszane są w wydarzeniu na Facebooku: ${ctx.fbEventUrl}`,
    `- Kontakt: ${ctx.email}`,
    "",
    "## Strony",
    "",
    `- [Harmonogram](${u("/harmonogram")}): osobisty plan po wyborze trybu, kierunku i grupy - godziny, sale z mapą budynku, eksport do kalendarza. Link z gotowym wyborem ma postać ${u("/harmonogram")}?tryb=s1&kierunek=FIR&grupa=5 (tryb: s1 = stacjonarne I stopnia, s2 = stacjonarne II stopnia, ns = niestacjonarne; dla ns: stopien=1|2, jezyk=pl|en).`,
    `- [O wydarzeniu](${u("/o-wydarzeniu")}): czym są Dni Adaptacyjne i jak wyglądają poszczególne dni w każdym trybie.`,
    `- [FAQ](${u("/faq")}): obowiązkowość, nieobecność, strój, skąd brać informacje.`,
    `- [Mapa kampusu](${u("/mapa-kampusu")}): budynki kampusu UEW (sala "113 Z" = sala 113 w budynku Z).`,
    `- [Ważne linki](${u("/linki")}): plan zajęć, USOSweb, Intranet, Eportal, Microsoft 365 / Teams, prawa studenta, stypendia i wsparcie studenckie.`,
    `- [Kontakt](${u("/kontakt")}): formularz i kontakt do zespołu projektu.`,
    `- [Regulamin](${u("/regulamin")}): regulamin Dni Adaptacyjnych 2026.`,
    "",
    "## English",
    "",
    "Orientation Days 2026 are mandatory for all first-year students of the Wroclaw University of Economics and Business (UEW), 1-3 October 2026, on campus (ul. Komandorska 118/120, Wrocław); part-time students attend online via YouTube on Saturday. The site shows a personal schedule for every study programme and group.",
    "",
    `- [Schedule](${u("/harmonogram", "en")}): personal plan with times and rooms.`,
    `- [About](${u("/o-wydarzeniu", "en")})`,
    `- [FAQ](${u("/faq", "en")})`,
    "",
    "## Optional",
    "",
    `- [Pełny rozkład](${ctx.siteUrl}/llms-full.txt): wszystkie tury, grupy i sale, prelekcje, transmisje i FAQ w jednym pliku.`,
    `- [Partnerzy](${u("/partnerzy")})`,
    `- [Polityka prywatności](${u("/polityka-prywatnosci")})`,
    "",
  ].join("\n");
}

export function buildLlmsFull(ctx: LlmsContext): string {
  const { data, labels } = ctx;
  const name = (code: string) => `${labels.programs[code]} (${code})`;
  const out: string[] = [
    "# Dni Adaptacyjne 2026 - pełny rozkład",
    "",
    `> Szczegółowy harmonogram Dni Adaptacyjnych UEW, 1-3 października 2026. Sala zapisana jako "113 Z" to sala 113 w budynku Z, "1+2 P" to sale 1 i 2 w budynku P. Interaktywna wersja: ${ctx.siteUrl}/pl/harmonogram. Zmiany: ${ctx.fbEventUrl}`,
    "",
    "## Kierunki (akronimy)",
    "",
  ];
  for (const level of [1, 2] as const) {
    out.push(`${level === 1 ? "I" : "II"} stopień:`);
    for (const p of data.programs.filter((x) => x.level === level)) {
      out.push(`- ${name(p.code)}${p.groups ? `, grup: ${p.groups}` : ""}`);
    }
    out.push("");
  }

  out.push(
    `## Czwartek 1.10 - Droga przez kampus (stacjonarne I stopnia)`,
    "",
    "Godzina tury to godzina zbiórki w sali; stamtąd grupa rusza z wolontariuszem na spacer po kampusie.",
    ""
  );
  for (const r of data.tours.rounds) {
    out.push(`### ${ROMAN[r.tour - 1]} tura - ${r.time}`, "");
    for (const s of r.slots) out.push(`- ${s.program} ${s.group}: sala ${s.room} (${labels.programs[s.program]})`);
    out.push("");
  }

  for (const l of [...data.lectures].sort((a, b) => a.date.localeCompare(b.date))) {
    out.push(
      `## ${labels.days[l.date]} - prelekcje ${l.level === 1 ? "I" : "II"} stopnia, od ${l.time}`,
      "",
      "Prelekcje o prawach i obowiązkach studenta (obowiązkowe).",
      ""
    );
    for (const r of l.rooms) {
      const list = r.programs
        .map((p) => `${name(p.code)}${p.groups ? ` (grupy ${range(p.groups)})` : ""}`)
        .join(", ");
      out.push(`- Sala ${r.room}: ${list}`);
    }
    out.push("");
  }

  out.push("## Część wspólna i impreza", "");
  for (const g of data.general) {
    const when = g.from ? (g.to ? `${g.from}-${g.to}` : `od ${g.from}`) : "cały dzień";
    const label = labels.items[g.id];
    const who = g.modes.map((m) => AUDIENCE[m]).join(", ");
    out.push(
      `- ${labels.days[g.date]}, ${when}: ${label.title} (${who})${g.place ? ` - ${g.place}` : ""}. ${label.desc ?? ""}`.trim()
    );
  }
  out.push("");

  out.push(`## ${labels.days[data.online.date]} - transmisje dla studiów niestacjonarnych`, "", ...onlineLines(ctx), "");

  out.push("## FAQ", "");
  for (const f of ctx.faq) out.push(`### ${f.q}`, "", f.a, "");

  out.push("## Kontakt", "", `- E-mail: ${ctx.email}`, `- Wydarzenie na Facebooku: ${ctx.fbEventUrl}`, "");
  return out.join("\n");
}
