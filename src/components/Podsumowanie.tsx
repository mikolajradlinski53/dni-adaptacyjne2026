import { getTranslations } from "next-intl/server";
import { Camera, EnvelopeSimple, Heart } from "@phosphor-icons/react/dist/ssr";
import type { Locale } from "@/i18n/routing";
import { CONTACT_EMAIL, getPartners, getTeam } from "@/lib/content";
import HeroDoodles from "./HeroDoodles";
import PartnersShowcase from "./PartnersShowcase";
import Reveal from "./Reveal";
import TeamGrid from "./TeamGrid";

/** Nagłówek sekcji z gradientową linią (jak na stronie partnerów). */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="text-2xl font-bold sm:text-3xl">{children}</h2>
      <span className="grad-line h-px flex-1 rounded-full opacity-60" />
    </div>
  );
}

/** Strona główna po wydarzeniu (patrz src/lib/zakonczenie.ts). */
export default async function Podsumowanie({ locale }: { locale: Locale }) {
  const t = await getTranslations();
  const [partners, team] = await Promise.all([
    getPartners(locale),
    getTeam(locale),
  ]);

  return (
    <>
      {/* PODZIĘKOWANIA */}
      <section className="aurora relative overflow-hidden border-b border-line">
        <HeroDoodles />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20">
          <p className="rise rise-1 inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-4 py-1.5 text-sm font-semibold backdrop-blur">
            <Heart size={17} weight="duotone" className="text-violet" />
            {t("closing.badge")}
          </p>
          <h1 className="rise rise-2 mt-6 text-5xl font-extrabold leading-[1.05] sm:text-7xl">
            {t("closing.title")}
          </h1>
          <p className="rise rise-3 mt-5 max-w-2xl text-base text-ink-soft sm:text-lg">
            {t("closing.lead")}
          </p>
        </div>
      </section>

      {/* PARTNER */}
      <Reveal>
        <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-20">
          <SectionTitle>{t("closing.partnerTitle")}</SectionTitle>
          <p className="mt-2 max-w-xl text-ink-soft">{t("closing.partnerLead")}</p>
          <div className="mt-8">
            <PartnersShowcase
              partners={partners.filter((p) => !p.hidden)}
              visitSite={t("partners.visitSite")}
            />
          </div>
        </section>
      </Reveal>

      {/* TEAM */}
      <Reveal>
        <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-20">
          <SectionTitle>{t("closing.teamTitle")}</SectionTitle>
          <p className="mt-2 max-w-xl text-ink-soft">{t("closing.teamLead")}</p>
          <TeamGrid team={team} />
        </section>
      </Reveal>

      {/* GALERIA (zdjęcia z tegorocznej edycji wkrótce) */}
      <Reveal>
        <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-20">
          <SectionTitle>{t("closing.galleryTitle")}</SectionTitle>
          <div className="mt-6 flex flex-col items-center gap-4 rounded-tile border-2 border-dashed border-line bg-surface px-6 py-12 text-center">
            <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-sky-soft text-sky">
              <Camera size={30} weight="duotone" />
            </span>
            <p className="text-lg font-bold">{t("closing.galleryBody")}</p>
          </div>
        </section>
      </Reveal>

      {/* KONTAKT */}
      <Reveal>
        <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-20">
          <div className="grad-brand relative overflow-hidden rounded-tile p-8 text-white sm:p-12">
            <h2 className="text-2xl font-extrabold sm:text-3xl">
              {t("closing.contactTitle")}
            </h2>
            <p className="mt-2 max-w-xl text-white/90">
              {t("closing.contactLead")}
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-6 flex flex-wrap items-center gap-2.5 font-display text-lg font-bold underline-offset-4 hover:underline sm:text-2xl md:text-3xl"
            >
              <EnvelopeSimple size={28} weight="duotone" className="shrink-0" />
              <span className="break-all">{CONTACT_EMAIL}</span>
            </a>
            <span
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-white/10 blur-2xl"
            />
          </div>
        </section>
      </Reveal>
    </>
  );
}
