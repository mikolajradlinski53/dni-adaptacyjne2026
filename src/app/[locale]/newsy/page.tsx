import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getNews } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return pageMetadata(
    locale,
    "/newsy",
    t("news.title"),
    t("news.lead"),
    t("meta.siteName")
  );
}

export default async function NewsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const posts = await getNews(locale);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 sm:pt-20">
      <h1 className="text-3xl font-extrabold sm:text-5xl">{t("news.title")}</h1>
      <p className="mt-4 max-w-xl text-ink-soft sm:text-lg">{t("news.lead")}</p>

      {posts.length === 0 ? (
        <p className="mt-10 text-ink-soft">{t("news.empty")}</p>
      ) : (
        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/newsy/${post.slug}`}
                className="flex h-full flex-col rounded-tile border border-line bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-violet hover:shadow-md"
              >
                <time
                  dateTime={post.date}
                  className="text-xs font-semibold text-violet"
                >
                  {new Intl.DateTimeFormat(locale, {
                    dateStyle: "long",
                  }).format(new Date(post.date))}
                </time>
                <h2 className="mt-2 text-lg font-bold">{post.title}</h2>
                <p className="mt-2 text-sm text-ink-soft">{post.excerpt}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-bold text-violet">
                  {t("news.readMore")}
                  <ArrowRight size={15} weight="bold" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
