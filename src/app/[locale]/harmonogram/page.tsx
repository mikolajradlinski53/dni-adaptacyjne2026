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

  const web = (n: string) => `/images/web/${n}.webp`;
  const photos: Record<string, string[]> = {
    full1: [
      "harmo_full1_bfk",
      "harmo_full1_1",
      "harmo_full1_2",
      "harmo_full1_3",
    ].map(web),
    full2: ["harmo_full2_new", "harmo_full2_2"].map(web),
    part: ["harmo_part_2", "harmo_part_3"].map(web),
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
