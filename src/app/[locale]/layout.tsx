import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { buildSearchIndex } from "@/lib/search";
import { SITE_URL } from "@/lib/seo";
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
    <html lang={locale}>
      <body className="min-h-screen antialiased">
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
