"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { SITE_URL } from "@/lib/seo";

// Ścieżka -> klucz etykiety w namespace "nav".
const KEY: Record<string, string> = {
  "/o-wydarzeniu": "about",
  "/harmonogram": "schedule",
  "/linki": "links",
  "/faq": "faq",
  "/kontakt": "contact",
  "/partnerzy": "partners",
  "/mapa-kampusu": "map",
  "/regulamin": "rules",
  "/polityka-prywatnosci": "privacy",
};

// Dane strukturalne BreadcrumbList (Start > Podstrona) dla wyszukiwarek.
export default function BreadcrumbsJsonLd() {
  const pathname = usePathname();
  const locale = useLocale();
  const tNav = useTranslations("nav");
  const key = KEY[pathname];
  if (!key) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: tNav("home"),
        item: `${SITE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tNav(key),
        item: `${SITE_URL}/${locale}${pathname}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
