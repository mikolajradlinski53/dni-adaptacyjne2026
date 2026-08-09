import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import type { Locale } from "@/i18n/routing";
import { getFaq } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import FormularzKontaktowy from "@/components/FormularzKontaktowy";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return pageMetadata(
    locale,
    "/faq",
    t("faq.title"),
    t("faq.lead"),
    t("meta.siteName")
  );
}

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const faq = await getFaq(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 pt-14 sm:px-6 sm:pt-20">
      <h1 className="text-3xl font-extrabold sm:text-5xl">{t("faq.title")}</h1>
      <p className="mt-4 text-ink-soft sm:text-lg">{t("faq.lead")}</p>

      <div className="mt-10 space-y-3">
        {faq.map((item) => (
          <details
            key={item.q}
            className="group rounded-tile border border-line bg-surface open:border-violet"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold [&::-webkit-details-marker]:hidden">
              {item.q}
              <CaretDown
                size={18}
                weight="bold"
                className="shrink-0 text-violet transition-transform group-open:rotate-180"
              />
            </summary>
            <p className="px-5 pb-5 text-sm leading-relaxed text-ink-soft sm:text-base">
              {item.a}
            </p>
          </details>
        ))}
      </div>

      <section className="mt-14 rounded-tile border border-line bg-surface p-6 sm:p-8">
        <h2 className="text-xl font-bold sm:text-2xl">{t("faq.formTitle")}</h2>
        <p className="mt-1.5 text-ink-soft">{t("faq.formLead")}</p>
        <div className="mt-5">
          <FormularzKontaktowy formularz="ogolny" />
        </div>
      </section>
    </div>
  );
}
