import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getNews } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    const posts = await getNews(locale);
    for (const post of posts) {
      params.push({ locale, slug: post.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });
  const posts = await getNews(locale);
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return pageMetadata(
    locale,
    `/newsy/${post.slug}`,
    post.title,
    post.excerpt,
    t("meta.siteName")
  );
}

export default async function NewsPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const posts = await getNews(locale);
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 pt-14 sm:px-6 sm:pt-20">
      <Link
        href="/newsy"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-violet underline-offset-4 hover:underline"
      >
        <ArrowLeft size={15} weight="bold" />
        {t("news.back")}
      </Link>

      <time
        dateTime={post.date}
        className="mt-8 block text-sm font-semibold text-violet"
      >
        {new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
          new Date(post.date)
        )}
      </time>
      <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">{post.title}</h1>
      <div className="grad-line mt-6 h-1 w-24 rounded-full" />

      <div className="mt-8 space-y-5 text-base leading-relaxed text-ink-soft sm:text-lg">
        {post.body.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
