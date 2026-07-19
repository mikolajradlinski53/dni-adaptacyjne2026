import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Handshake,
  Target,
  Storefront,
  HandHeart,
  EnvelopeSimple,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import type { Locale } from "@/i18n/routing";
import { getPartners, CONTACT_EMAIL } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import Reveal, { Stagger, RevealItem } from "@/components/Reveal";

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

  const benefits = [
    {
      icon: <Target size={26} weight="duotone" />,
      title: t("partners.benefit1Title"),
      body: t("partners.benefit1Body"),
    },
    {
      icon: <Storefront size={26} weight="duotone" />,
      title: t("partners.benefit2Title"),
      body: t("partners.benefit2Body"),
    },
    {
      icon: <HandHeart size={26} weight="duotone" />,
      title: t("partners.benefit3Title"),
      body: t("partners.benefit3Body"),
    },
  ];

  // Elegancki stan „wkrótce" — sloty pod logotypy, dopóki nie dostaniemy danych
  const slots = partners.length > 0 ? partners : Array.from({ length: 8 });

  return (
    <>
      {/* HERO */}
      <section className="aurora relative overflow-hidden border-b border-line">
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-14 sm:px-6 sm:pb-20 sm:pt-20">
          <p className="rise rise-1 inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-4 py-1.5 text-sm font-semibold backdrop-blur">
            <Handshake size={17} weight="duotone" className="text-violet" />
            {t("nav.partners")}
          </p>
          <h1 className="rise rise-2 mt-6 max-w-3xl text-4xl font-extrabold leading-[1.05] sm:text-6xl">
            {t("partners.title")}
          </h1>
          <p className="rise rise-3 mt-5 max-w-2xl text-base text-ink-soft sm:text-lg">
            {t("partners.lead")}
          </p>
          <p className="rise rise-4 mt-4 max-w-2xl text-ink-soft">
            {t("partners.intro")}
          </p>
        </div>
      </section>

      {/* KORZYŚCI */}
      <Reveal>
        <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-20">
          <h2 className="text-2xl font-bold sm:text-3xl">
            {t("partners.benefitsTitle")}
          </h2>
          <Stagger className="mt-8 grid gap-5 md:grid-cols-3">
            {benefits.map((b) => (
              <RevealItem
                key={b.title}
                className="group flex flex-col gap-3 rounded-tile border border-line bg-surface p-6 transition-all hover:-translate-y-1 hover:border-violet hover:shadow-lg hover:shadow-violet/10"
              >
                <span className="grad-brand inline-flex size-12 items-center justify-center rounded-2xl text-white transition-transform group-hover:scale-105">
                  {b.icon}
                </span>
                <h3 className="text-lg font-bold">{b.title}</h3>
                <p className="text-sm text-ink-soft">{b.body}</p>
              </RevealItem>
            ))}
          </Stagger>
        </section>
      </Reveal>

      {/* WITRYNA PARTNERÓW */}
      <Reveal>
        <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-20">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold sm:text-3xl">
              {t("partners.showcaseTitle")}
            </h2>
            <span className="grad-line h-px flex-1 rounded-full opacity-60" />
          </div>

          <Stagger className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {slots.map((partner, i) => {
              const p = partner as
                | { name: string; logo: string | null; href: string | null }
                | undefined;

              if (p?.name) {
                const tile = (
                  <div className="flex aspect-[3/2] items-center justify-center rounded-tile border border-line bg-surface p-6 transition-all hover:-translate-y-1 hover:border-violet hover:shadow-md">
                    <span className="text-center font-semibold text-ink">
                      {p.name}
                    </span>
                  </div>
                );
                return (
                  <RevealItem key={p.name}>
                    {p.href ? (
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={p.name}
                      >
                        {tile}
                      </a>
                    ) : (
                      tile
                    )}
                  </RevealItem>
                );
              }

              // Slot „wkrótce"
              return (
                <RevealItem key={i}>
                  <div className="shimmer flex aspect-[3/2] flex-col items-center justify-center gap-2 rounded-tile border border-dashed border-line bg-surface">
                    <span className="grad-brand size-8 rounded-full opacity-25" />
                    <span className="text-xs font-medium text-ink-soft/70">
                      {t("partners.comingSoon")}
                    </span>
                  </div>
                </RevealItem>
              );
            })}
          </Stagger>
        </section>
      </Reveal>

      {/* CTA */}
      <Reveal>
        <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-20">
          <div className="grad-brand relative overflow-hidden rounded-tile p-8 text-white sm:p-12">
            <div className="relative max-w-2xl">
              <h2 className="text-2xl font-extrabold sm:text-3xl">
                {t("partners.ctaTitle")}
              </h2>
              <p className="mt-3 text-white/90">{t("partners.ctaBody")}</p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-violet shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.99]"
              >
                <EnvelopeSimple size={18} weight="bold" />
                {t("partners.ctaButton")}
                <ArrowRight size={16} weight="bold" />
              </a>
            </div>
            {/* Dekoracyjne kręgi */}
            <span
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-white/10 blur-2xl"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-20 right-24 size-48 rounded-full bg-white/10 blur-2xl"
            />
          </div>
        </section>
      </Reveal>
    </>
  );
}