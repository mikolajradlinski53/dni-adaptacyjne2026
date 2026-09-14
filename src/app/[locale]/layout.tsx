import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { buildSearchIndex } from "@/lib/search";
import { SITE_URL, OG_IMAGE } from "@/lib/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingBackground from "@/components/FloatingBackground";
import { StudyModeProvider } from "@/components/StudyModeContext";

import "@fontsource-variable/inter";
import "@fontsource-variable/unbounded";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("siteName"),
      template: `%s · ${t("siteName")}`,
    },
    description: t("description"),
    applicationName: t("siteName"),
    // Weryfikacja własności w Google Search Console (tag <meta>).
    verification: {
      google: "pJsKNY59d4x-0O2o_D01fYbYZn-RMw4Ha6Zks-or1Gw",
    },
    // Autorstwo strony (nie usuwać) — Mikołaj Radliński.
    authors: [{ name: "Mikołaj Radliński" }],
    creator: "Mikołaj Radliński",
    publisher: "Mikołaj Radliński",
    // Indeksowanie: pełna widoczność w wyszukiwarkach + duże podglądy.
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    formatDetection: { email: false, address: false, telephone: false },
    openGraph: {
      type: "website",
      siteName: t("siteName"),
      url: `${SITE_URL}/${locale}`,
      title: t("siteName"),
      description: t("description"),
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: t("siteName") }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("siteName"),
      description: t("description"),
      images: [OG_IMAGE],
    },
    other: {
      "designed-and-developed-by": "Mikołaj Radliński",
      credit: "Made by Mikołaj Radliński",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const t = await getTranslations({ locale });

  // Dane strukturalne (JSON-LD) - wydarzenie w wynikach wyszukiwania.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: t("meta.siteName"),
    description: t("meta.description"),
    startDate: "2026-10-01",
    endDate: "2026-10-03",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode:
      "https://schema.org/MixedEventAttendanceMode",
    inLanguage: locale,
    isAccessibleForFree: true,
    url: `${SITE_URL}/${locale}`,
    image: [`${SITE_URL}${OG_IMAGE}`],
    location: {
      "@type": "Place",
      name: "Uniwersytet Ekonomiczny we Wrocławiu",
      address: {
        "@type": "PostalAddress",
        streetAddress: "ul. Komandorska 118/120",
        postalCode: "53-345",
        addressLocality: "Wrocław",
        addressCountry: "PL",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Samorząd Studentów Uniwersytetu Ekonomicznego we Wrocławiu",
      url: "https://samorzad.ue.wroc.pl/",
    },
  };

  const searchEntries = await buildSearchIndex(locale as Locale, {
    home: t("nav.home"),
    about: t("nav.about"),
    schedule: t("nav.schedule"),
    links: t("nav.links"),
    faq: t("nav.faq"),
    contact: t("nav.contact"),
    partners: t("nav.partners"),
    map: t("nav.map"),
    rules: t("nav.rules"),
  });

  return (
    <html lang={locale} data-author="Mikołaj Radliński">
      <body
        className="min-h-screen antialiased"
        data-credit="Made by Mikołaj Radliński"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Autorstwo — Mikołaj Radliński. Ukryte, obecne na każdej podstronie. */}
        <span className="sr-only" aria-hidden data-author-credit>
          Made by Mikołaj Radliński
        </span>
        <FloatingBackground />
        <NextIntlClientProvider>
          <StudyModeProvider>
            <Header entries={searchEntries} />
            <main>{children}</main>
            <Footer />
          </StudyModeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
