import type { Locale } from "@/i18n/routing";
import { getFaq, getLinks, getNews } from "./content";

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
    { title: nav.news, href: "/newsy", group: nav.home },
    { title: nav.links, href: "/linki", group: nav.home },
    { title: nav.faq, href: "/faq", group: nav.home },
    { title: nav.contact, href: "/kontakt", group: nav.home },
    { title: nav.partners, href: "/partnerzy", group: nav.home },
    { title: nav.map, href: "/mapa-kampusu", group: nav.home },
    { title: nav.rules, href: "/regulamin", group: nav.home },
  ];

  const [links, faq, news] = await Promise.all([
    getLinks(locale),
    getFaq(locale),
    getNews(locale),
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

  const newsEntries: SearchEntry[] = news.map((n) => ({
    title: n.title,
    description: n.excerpt,
    href: `/newsy/${n.slug}`,
    group: nav.news,
  }));

  return [...pages, ...linkEntries, ...faqEntries, ...newsEntries];
}
