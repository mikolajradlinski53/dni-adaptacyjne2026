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
  title: string;
  place?: string;
  desc?: string;
  /** Wyróżniony krok (np. UE Party) - mocniejsza wizualnie karta. */
  highlight?: boolean;
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
  phone?: string;
  photo: string | null;
  /** Kadrowanie zdjęcia w kafelku (CSS object-position, np. "center 62%"). */
  photoPos?: string;
};
export type Partner = {
  name: string;
  logo: string | null;
  href: string | null;
  desc?: string;
  /** "strategic" = wyróżniony partner (większa, animowana karta). */
  tier?: "strategic";
  /** true = ukryty na stronie (np. przed akceptacją). */
  hidden?: boolean;
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

export const EVENT_START = "2026-10-01T00:00:00+02:00";
export const CONTACT_EMAIL = "dni.adaptacyjne@samorzad.ue.wroc.pl";

/** Kontakt ds. partnerstw (Członek Zarządu ds. Kontaktów Zewnętrznych). */
export const PARTNERS_CONTACT = {
  name: "Ida Majewska",
  email: "ida.majewska@samorzad.ue.wroc.pl",
  photo: "/images/web/ida.webp" as string | null,
};
