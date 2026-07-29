import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MapPin, ArrowSquareOut, Star } from "@phosphor-icons/react/dist/ssr";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return pageMetadata(
    locale,
    "/mapa-kampusu",
    t("map.title"),
    t("map.lead"),
    t("meta.siteName")
  );
}

export default async function MapPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 sm:pt-20">
      <h1 className="text-3xl font-extrabold sm:text-5xl">{t("map.title")}</h1>
      <p className="mt-4 max-w-xl text-ink-soft sm:text-lg">{t("map.lead")}</p>

      <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold">
        <MapPin size={18} weight="duotone" className="text-violet" />
        Komandorska 118/120, 53-345 Wrocław
      </p>

      <p className="mt-6 max-w-2xl text-sm text-ink-soft">{t("map.placeholder")}</p>

      {/* Interaktywna mapa Google z lokalizacją kampusu */}
      <div className="mt-6 max-w-4xl overflow-hidden rounded-tile border border-line shadow-sm">
        <iframe
          title="Mapa kampusu UEW"
          src="https://www.google.com/maps?q=Uniwersytet+Ekonomiczny+we+Wroc%C5%82awiu,+Komandorska+118%2F120,+Wroc%C5%82aw&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-[320px] w-full sm:h-[440px]"
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href="https://www.google.com/maps/search/?api=1&query=Uniwersytet+Ekonomiczny+we+Wroc%C5%82awiu+Komandorska+118%2F120"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border-2 border-violet px-5 py-3 text-sm font-bold text-violet transition-colors hover:bg-violet hover:text-white"
        >
          <MapPin size={17} weight="bold" />
          {t("map.openInMaps")}
          <ArrowSquareOut size={15} weight="bold" />
        </a>
        <a
          href="https://samorzad.ue.wroc.pl"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-3 text-sm font-bold transition-colors hover:border-violet"
        >
          <Star size={17} weight="bold" className="text-violet" />
          {t("map.samorzad")}
          <ArrowSquareOut size={15} weight="bold" />
        </a>
      </div>
    </div>
  );
}
