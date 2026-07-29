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

  // Realni partnerzy najpierw, resztę siatki wypełniamy slotami „wkrótce".
  const placeholderCount = Math.max(0, 8 - partners.length);

  // Zdjęcia z wydarzenia pokazujące obecność partnerów.
  const gallery = [
    "partnerzy6",
    "partnerzy9",
    "partnerzy8",
    "partnerzy10",
    "partnerzy7",
    "partnerzy11",
  ];

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
            {partners.map((p) => {
              const tile = (
                <div className="flex aspect-[3/2] items-center justify-center rounded-tile border border-line bg-surface p-6 transition-all hover:-translate-y-1 hover:border-violet hover:shadow-md">
                  {p.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.logo}
                      alt={p.name}
                      className="max-h-10 w-auto max-w-[80%] object-contain"
                    />
                  ) : (
                    <span className="text-center font-semibold text-ink">
                      {p.name}
                    </span>
                  )}
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
            })}

            {Array.from({ length: placeholderCount }).map((_, i) => (
              <RevealItem key={`ph-${i}`}>
                <div className="shimmer flex aspect-[3/2] flex-col items-center justify-center gap-2 rounded-tile border border-dashed border-line bg-surface">
                  <span className="grad-brand size-8 rounded-full opacity-25" />
                  <span className="text-xs font-medium text-ink-soft/70">
                    {t("partners.comingSoon")}
                  </span>
                </div>
              </RevealItem>
            ))}
          </Stagger>
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
          <Stagger className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {gallery.map((name) => (
              <RevealItem
                key={name}
                className="overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/images/web/${name}.webp`}
                  alt=""
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </RevealItem>
            ))}
          </Stagger>
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
                <div className="mt-3 flex items-center gap-3">
                  <div className="relative shrink-0">
                    <div className="flex size-14 items-center justify-center overflow-hidden rounded-2xl bg-white/20">
                      {PARTNERS_CONTACT.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={PARTNERS_CONTACT.photo}
                          alt={PARTNERS_CONTACT.name}
                          className="size-full object-cover"
                        />
                      ) : (
                        <User size={26} weight="duotone" className="text-white" />
                      )}
                    </div>
                    <span
                      aria-hidden
                      className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-white text-xs shadow"
                    >
                      🎓
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold leading-tight">
                      {PARTNERS_CONTACT.name}
                    </p>
                    <p className="text-xs text-white/85">
                      {t("partners.contactRole")}
                    </p>
                  </div>
                </div>
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