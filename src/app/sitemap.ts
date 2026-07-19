import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getNews } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";

const STATIC_PATHS = [
  "",
  "/o-wydarzeniu",
  "/harmonogram",
  "/newsy",
  "/linki",
  "/faq",
  "/kontakt",
  "/partnerzy",
  "/mapa-kampusu",
  "/regulamin",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of STATIC_PATHS) {
    const languages = Object.fromEntries(
      routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`])
    );
    for (const locale of routing.locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "/newsy" ? "daily" : "weekly",
        priority: path === "" ? 1 : 0.7,
        alternates: { languages },
      });
    }
  }

  for (const locale of routing.locales) {
    const posts = await getNews(locale);
    for (const post of posts) {
      entries.push({
        url: `${SITE_URL}/${locale}/newsy/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  }

  return entries;
}
