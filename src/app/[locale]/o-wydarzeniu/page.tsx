import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Scales, SealCheck } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getModes } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import AboutModes from "@/components/AboutModes";
import CyclingImage from "@/components/CyclingImage";

const web = (n: string) => `/images/web/${n}.webp`;

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

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="space-y-4 text-base text-ink-soft sm:text-lg">
          <p>{t("about.intro1")}</p>
          <p>{t("about.intro2")}</p>
        </div>
        {/* Rotujące zdjęcia z Dni Adaptacyjnych */}
        <CyclingImage
          images={["about1", "about4", "about2", "about3", "about6", "about5"].map(
            web
          )}
          interval={4000}
          className="aspect-[4/3] rounded-2xl shadow-lg ring-1 ring-black/5"
        />
      </div>

      {/* Dla kogo obowiązkowe - pełny zakres */}
      <div className="mt-8 flex max-w-3xl items-start gap-4 rounded-tile bg-sky-soft p-6 sm:p-7">
        <SealCheck size={30} weight="duotone" className="mt-0.5 shrink-0 text-sky" />
        <p className="font-bold text-ink sm:text-lg">
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
        <div className="grid items-center gap-6 rounded-tile bg-gold-soft p-6 sm:p-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">{t("about.sideTitle")}</h2>
            <p className="mt-2 text-ink-soft">{t("about.sideBody")}</p>
            <p className="mt-3 text-ink-soft">{t("about.sideBody2")}</p>
            <Link
              href="/harmonogram"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-violet underline-offset-4 hover:underline"
            >
              {t("about.sideCta")}
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
          <CyclingImage
            images={["ueparty1", "ueparty2", "ueparty3"].map(web)}
            interval={3600}
            className="aspect-[4/3] rounded-2xl shadow-lg ring-1 ring-black/5"
          />
        </div>
      </section>
    </div>
  );
}
