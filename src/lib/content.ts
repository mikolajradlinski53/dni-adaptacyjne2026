import type { Locale } from "@/i18n/routing";

export type StudyMode = "full1" | "full2" | "part";

export type ModeInfo = {
  id: StudyMode;
  label: string;
  short: string;
  days: { title: string; items: string[] }[];
};

export type ScheduleEntry = {
  mode: StudyMode;
  date: string;
  dayLabel: string;
  time: string;
  title: string;
  place: string;
  desc?: string;
};

export type LinkItem = {
  label: string;
  href: string | null;
  icon: string;
  note?: string;
  internal?: boolean;
};

export type LinkCategory = { category: string; items: LinkItem[] };
export type FaqItem = { q: string; a: string };
export type TeamMember = {
  name: string;
  role: string;
  phone: string;
  photo: string | null;
};
export type Partner = { name: string; logo: string | null; href: string | null };
export type NewsPost = {
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  body: string[];
};

export async function getModes(locale: Locale): Promise<ModeInfo[]> {
  return (await import(`../../content/${locale}/modes.json`)).default;
}

export async function getSchedule(locale: Locale): Promise<ScheduleEntry[]> {
  return (await import(`../../content/${locale}/schedule.json`)).default;
}

export async function getLinks(locale: Locale): Promise<LinkCategory[]> {
  return (await import(`../../content/${locale}/links.json`)).default;
}

export async function getFaq(locale: Locale): Promise<FaqItem[]> {
  return (await import(`../../content/${locale}/faq.json`)).default;
}

export async function getTeam(locale: Locale): Promise<TeamMember[]> {
  return (await import(`../../content/${locale}/team.json`)).default;
}

export async function getPartners(locale: Locale): Promise<Partner[]> {
  return (await import(`../../content/${locale}/partners.json`)).default;
}

export async function getNews(locale: Locale): Promise<NewsPost[]> {
  const posts: NewsPost[] = (await import(`../../content/${locale}/news.json`))
    .default;
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const EVENT_START = "2026-10-01T00:00:00+02:00";
export const CONTACT_EMAIL = "dni.adaptacyjne@samorzad.ue.wroc.pl";
