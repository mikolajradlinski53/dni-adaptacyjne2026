import type { Locale } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { getFaq, getLinks, getScheduleData, getScheduleLabels } from "./content";
import { picksToQuery } from "./schedule";

export type SearchEntry = {
  title: string;
  description?: string;
  href: string;
  group: string;
};

type PageLabels = Record<string, string>;

/**
 * Buduje indeks wyszukiwarki po stronie serwera (w buildzie).
 * Lekki zamiennik zewnętrznego silnika: Fuse.js przeszukuje go w kliencie.
 */
export async function buildSearchIndex(
  locale: Locale,
  nav: PageLabels
): Promise<SearchEntry[]> {
  const pages: SearchEntry[] = [
    { title: nav.home, href: "/", group: nav.home },
    { title: nav.about, href: "/o-wydarzeniu", group: nav.home },
    { title: nav.schedule, href: "/harmonogram", group: nav.home },
    { title: nav.links, href: "/linki", group: nav.home },
    { title: nav.faq, href: "/faq", group: nav.home },
    { title: nav.contact, href: "/kontakt", group: nav.home },
    { title: nav.partners, href: "/partnerzy", group: nav.home },
    { title: nav.map, href: "/mapa-kampusu", group: nav.home },
    { title: nav.rules, href: "/regulamin", group: nav.home },
  ];

  const [links, faq, schedule, scheduleLabels, tp] = await Promise.all([
    getLinks(locale),
    getFaq(locale),
    getScheduleData(),
    getScheduleLabels(locale),
    getTranslations({ locale, namespace: "schedule.picker" }),
  ]);

  const linkEntries: SearchEntry[] = links.flatMap((cat) =>
    cat.items.map((item) => ({
      title: item.label,
      description: item.note,
      href: item.internal && item.href ? item.href : "/linki",
      group: cat.category,
    }))
  );

  const faqEntries: SearchEntry[] = faq.map((f) => ({
    title: f.q,
    description: f.a,
    href: "/faq",
    group: nav.faq,
  }));

  // Kierunki: wynik prowadzi do harmonogramu z już wybranym kierunkiem.
  const programEntries: SearchEntry[] = schedule.programs.map((p) => ({
    title: `${scheduleLabels.programs[p.code]} (${p.code})`,
    description: tp(p.level === 1 ? "level1" : "level2"),
    href: `/harmonogram?${picksToQuery(p.level === 1 ? "full1" : "full2", { program: p.code })}`,
    group: nav.schedule,
  }));

  return [...pages, ...programEntries, ...linkEntries, ...faqEntries];
}
