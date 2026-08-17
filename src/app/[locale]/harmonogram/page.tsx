import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getModes, getSchedule } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import ScheduleTimeline from "@/components/ScheduleTimeline";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return pageMetadata(
    locale,
    "/harmonogram",
    t("schedule.title"),
    t("schedule.lead"),
    t("meta.siteName")
  );
}

export default async function SchedulePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const [entries, modes] = await Promise.all([
    getSchedule(locale),
    getModes(locale),
  ]);

  // { n: nazwa pliku w /images/web, ar: proporcja szer/wys (do masonry) }
  const photos: Record<string, { n: string; ar: number }[]> = {
    full1: [
      { n: "harmo_full1_bfk", ar: 1.5 },
      { n: "harmo_full1_2", ar: 1.5 },
      { n: "harmo_full1_3", ar: 0.75 },
    ],
    full2: [
      { n: "harmo_full2_new", ar: 1.5 },
      { n: "harmo_stacjo_2", ar: 1.5 },
      { n: "harmo_full2_2", ar: 0.75 },
    ],
    part: [
      { n: "harmo_part_2", ar: 1.78 },
      { n: "harmo_part_3", ar: 1.78 },
      { n: "harmo_niestacjo", ar: 1.547 },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 sm:pt-20">
      <h1 className="text-3xl font-extrabold sm:text-5xl">
        {t("schedule.title")}
      </h1>
      <p className="mt-4 max-w-xl text-ink-soft sm:text-lg">
        {t("schedule.lead")}
      </p>

      <p className="mt-6 max-w-2xl rounded-tile border-l-4 border-green bg-[oklch(89%_0.13_150)] p-5 text-base font-bold text-ink sm:text-lg">
        {t("schedule.note")}
      </p>

      <div className="mt-10">
        <ScheduleTimeline
          entries={entries}
          modes={modes}
          emptyLabel={t("schedule.empty")}
          photos={photos}
          galleryLabel={t("schedule.gallery")}
        />
      </div>
    </div>
  );
}
