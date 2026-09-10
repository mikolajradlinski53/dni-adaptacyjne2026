import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";

// Projekt i wykonanie: Mikołaj Radliński (Made by Mikołaj Radliński).
export const SITE_AUTHOR = "Mikołaj Radliński";

export const SITE_URL = "https://dni-adaptacyjne.uew.pl";

// Obrazek Open Graph (udostępnienia w social media / podglądy w wyszukiwarce).
export const OG_IMAGE = "/og-image.png";

const OG_LOCALES: Record<Locale, string> = {
  pl: "pl_PL",
  en: "en_GB",
  uk: "uk_UA",
};

/** Metadane podstrony: canonical + hreflang dla wszystkich języków. */
export function pageMetadata(
  locale: Locale,
  path: string,
  title: string,
  description: string,
  siteName: string
): Metadata {
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`])
  );
  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}${path}`;

  return {
    title,
    description,
    authors: [{ name: SITE_AUTHOR }],
    creator: SITE_AUTHOR,
    other: { credit: `Made by ${SITE_AUTHOR}` },
    alternates: {
      canonical: `${SITE_URL}/${locale}${path}`,
      languages,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}${path}`,
      siteName,
      locale: OG_LOCALES[locale],
      type: "website",
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}
