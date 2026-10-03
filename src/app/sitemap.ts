import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo";
import { WYDARZENIE_ZAKONCZONE } from "@/lib/zakonczenie";

const STATIC_PATHS = [
  "",
  "/o-wydarzeniu",
  "/harmonogram",
  "/partnerzy",
  "/linki",
  "/faq",
  "/kontakt",
  "/mapa-kampusu",
  "/regulamin",
  "/polityka-prywatnosci",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Po wydarzeniu zostaje tylko podsumowanie i polityka prywatności.
  const paths = WYDARZENIE_ZAKONCZONE ? ["", "/polityka-prywatnosci"] : STATIC_PATHS;

  for (const path of paths) {
    const languages = Object.fromEntries(
      routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`])
    );
    for (const locale of routing.locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: path === "" ? 1 : 0.7,
        alternates: { languages },
      });
    }
  }

  return entries;
}
