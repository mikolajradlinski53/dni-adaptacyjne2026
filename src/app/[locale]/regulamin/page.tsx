import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FilePdf } from "@phosphor-icons/react/dist/ssr";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return pageMetadata(
    locale,
    "/regulamin",
    t("rules.title"),
    t("rules.lead"),
    t("meta.siteName")
  );
}

export default async function RulesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 sm:pt-20">
      <h1 className="text-3xl font-extrabold sm:text-5xl">{t("rules.title")}</h1>
      <p className="mt-4 max-w-xl text-ink-soft sm:text-lg">{t("rules.lead")}</p>

      {/* Po dodaniu pliku: podmień div na <a href="/docs/regulamin-da-2026.pdf" download> */}
      <div className="mt-10 flex max-w-2xl items-center gap-4 rounded-tile border border-line bg-surface p-6 opacity-80 sm:p-7">
        <FilePdf size={36} weight="duotone" className="shrink-0 text-magenta" />
        <div>
          <p className="font-bold">{t("rules.docName")}</p>
          <p className="mt-0.5 text-sm text-ink-soft">{t("rules.docNote")}</p>
        </div>
      </div>
    </div>
  );
}
