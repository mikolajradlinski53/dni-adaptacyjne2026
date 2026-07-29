import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Handshake,
  Target,
  Storefront,
  HandHeart,
  EnvelopeSimple,
  ArrowRight,
  User,
} from "@phosphor-icons/react/dist/ssr";
import type { Locale } from "@/i18n/routing";
import { getPartners, PARTNERS_CONTACT } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import Reveal, { Stagger, RevealItem } from "@/components/Reveal";
import PartnersShowcase from "@/components/PartnersShowcase";
import HeroDoodles from "@/components/HeroDoodles";

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

  // Zdjęcia z wydarzenia pokazujące obecność partnerów.
  const gallery = [
    "partnerzy6",
    "partnerzy13",
    "partnerzy12",
    "partnerzy14",
    "partnerzy9",
    "partnerzy8",
    "partnerzy15",
    "partnerzy7",
    "partnerzy16",
    "partnerzy10",
    "partnerzy17",
    "partnerzy11",
    "partnerzy18",
  ];

  return (
    <>
      {/* HERO */}
      <section className="aurora relative overflow-hidden border-b border-line">
        <HeroDoodles />
        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-14 sm:px-6 sm:pb-20 sm:pt-20">
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

          <div className="mt-8">
            <PartnersShowcase
              partners={partners}
              comingSoon={t("partners.comingSoon")}
              visitSite={t("partners.visitSite")}
            />
          </div>
        </section>
      </Reveal>

      {/* GALERIA: partnerzy w akcji */}
      <Reveal>
        <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-20">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold sm:text-3xl">
              {t("partners.galleryTitle")}
            </h2>
            <span className="grad-line h-px flex-1 rounded-full opacity-60" />
          </div>
          {/* Masonry - pełne kadry bez przycinania */}
          <div className="mt-8 columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3">
            {gallery.map((name) => (
              <div
                key={name}
                className="group break-inside-avoid overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/images/web/${name}.webp`}
                  alt=""
                  className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* CTA */}
      <Reveal>
        <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-20">
          <div className="grad-brand relative overflow-hidden rounded-tile p-8 text-white sm:p-12">
            <div className="relative grid items-center gap-8 md:grid-cols-[1.5fr_1fr]">
              <div>
                <h2 className="text-2xl font-extrabold sm:text-3xl">
                  {t("partners.ctaTitle")}
                </h2>
                <p className="mt-3 max-w-xl text-white/90">
                  {t("partners.ctaBody")}
                </p>
                <a
                  href={`mailto:${PARTNERS_CONTACT.email}`}
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-violet shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.99]"
                >
                  <EnvelopeSimple size={18} weight="bold" />
                  {t("partners.ctaButton")}
                  <ArrowRight size={16} weight="bold" />
                </a>
              </div>

              {/* Kontakt dla partnerów: Ida Majewska */}
              <div className="rounded-tile border border-white/25 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-xs font-bold uppercase tracking-wide text-white/80">
                  {t("partners.contactLabel")}
                </p>
                <div className="relative mt-3 overflow-hidden rounded-2xl bg-white/20">
                  {PARTNERS_CONTACT.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={PARTNERS_CONTACT.photo}
                      alt={PARTNERS_CONTACT.name}
                      className="aspect-[4/3] w-full object-cover object-top"
                    />
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center">
                      <User size={44} weight="duotone" className="text-white" />
                    </div>
                  )}
                  <span
                    aria-hidden
                    className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-white text-base shadow"
                  >
                    🎓
                  </span>
                </div>
                <p className="mt-3 font-bold leading-tight">
                  {PARTNERS_CONTACT.name}
                </p>
                <p className="text-xs text-white/85">
                  {t("partners.contactRole")}
                </p>
                <a
                  href={`mailto:${PARTNERS_CONTACT.email}`}
                  className="mt-4 block break-all text-sm font-semibold text-white underline-offset-4 hover:underline"
                >
                  {PARTNERS_CONTACT.email}
                </a>
              </div>
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