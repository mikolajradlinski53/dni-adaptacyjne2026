import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo";

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

  for (const path of STATIC_PATHS) {
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
