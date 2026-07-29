import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Scales, SealCheck } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getModes } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import AboutModes from "@/components/AboutModes";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return pageMetadata(
    locale,
    "/o-wydarzeniu",
    t("about.title"),
    t("about.intro1"),
    t("meta.siteName")
  );
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const modes = await getModes(locale);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 sm:pt-20">
      <h1 className="text-3xl font-extrabold sm:text-5xl">{t("about.title")}</h1>

      <div className="mt-6 max-w-2xl space-y-4 text-base text-ink-soft sm:text-lg">
        <p>{t("about.intro1")}</p>
        <p>{t("about.intro2")}</p>
      </div>

      {/* Dla kogo obowiązkowe — pełny zakres */}
      <div className="mt-8 flex max-w-3xl items-start gap-4 rounded-tile bg-violet-soft p-6 sm:p-7">
        <SealCheck size={30} weight="duotone" className="mt-0.5 shrink-0 text-violet" />
        <p className="font-medium text-ink sm:text-lg">
          {t("common.mandatoryFull")}
        </p>
      </div>

      {/* Podstawa prawna obowiązku */}
      <div className="mt-10 flex max-w-3xl gap-4 rounded-tile border border-line bg-surface p-6 sm:p-7">
        <Scales size={28} weight="duotone" className="shrink-0 text-violet" />
        <div>
          <h2 className="text-lg font-bold">{t("about.legalTitle")}</h2>
          <p className="mt-1.5 text-sm text-ink-soft sm:text-base">
            {t("about.legalBody")}
          </p>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold sm:text-3xl">
          {t("about.modesTitle")}
        </h2>
        <div className="mt-6">
          <AboutModes modes={modes} hint={t("about.modesHint")} />
        </div>
      </section>

      <section className="mt-16">
        <div className="rounded-tile bg-magenta-soft p-6 sm:p-10">
          <h2 className="text-2xl font-bold">{t("about.sideTitle")}</h2>
          <p className="mt-2 max-w-2xl text-ink-soft">{t("about.sideBody")}</p>
          <Link
            href="/harmonogram"
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-violet underline-offset-4 hover:underline"
          >
            {t("about.sideCta")}
            <ArrowRight size={16} weight="bold" />
          </Link>
        </div>
      </section>
    </div>
  );
}
