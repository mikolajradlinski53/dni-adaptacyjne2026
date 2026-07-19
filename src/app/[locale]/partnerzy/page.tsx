import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Handshake } from "@phosphor-icons/react/dist/ssr";
import type { Locale } from "@/i18n/routing";
import { getPartners } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return pageMetadata(
    locale,
    "/partnerzy",
    t("partners.title"),
    t("partners.lead"),
    t("meta.siteName")
  );
}

export default async function PartnersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const partners = await getPartners(locale);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 sm:pt-20">
      <h1 className="text-3xl font-extrabold sm:text-5xl">
        {t("partners.title")}
      </h1>
      <p className="mt-4 max-w-xl text-ink-soft sm:text-lg">
        {t("partners.lead")}
      </p>

      {partners.length === 0 ? (
        <div className="mt-12 flex max-w-2xl flex-col items-start gap-3 rounded-tile border border-dashed border-line bg-surface p-8">
          <Handshake size={34} weight="duotone" className="text-violet" />
          <p className="text-ink-soft">{t("partners.placeholder")}</p>
        </div>
      ) : (
        <ul className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {partners.map((partner) => (
            <li
              key={partner.name}
              className="flex aspect-[3/2] items-center justify-center rounded-tile border border-line bg-surface p-6"
            >
              <span className="text-center font-semibold text-ink-soft">
                {partner.name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
