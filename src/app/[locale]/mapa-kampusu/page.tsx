import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MapTrifold, MapPin } from "@phosphor-icons/react/dist/ssr";
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

      {/* Placeholder: tu wejdzie grafika/interaktywna mapa kampusu */}
      <div className="mt-10 flex aspect-[16/9] max-w-4xl flex-col items-center justify-center gap-3 rounded-tile border border-dashed border-line bg-surface p-8 text-center">
        <MapTrifold size={40} weight="duotone" className="text-violet" />
        <p className="max-w-md text-ink-soft">{t("map.placeholder")}</p>
      </div>
    </div>
  );
}
