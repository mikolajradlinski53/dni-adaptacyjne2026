import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  CalendarCheck,
  CalendarDots,
  Confetti,
  DownloadSimple,
  FacebookLogo,
  GlobeHemisphereEast,
  MapPin,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import Countdown from "@/components/Countdown";
import HeroPhotos from "@/components/HeroPhotos";
import HeroDoodles from "@/components/HeroDoodles";
import CyclingImage from "@/components/CyclingImage";
import Reveal, { Stagger, RevealItem } from "@/components/Reveal";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata(locale, "", t("siteName"), t("description"), t("siteName"));
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const socials = [
    {
      label: t("home.socialDa"),
      href: "https://fb.me/e/8psHItxw2",
      domain: "facebook.com",
      fb: true,
      icon: <CalendarCheck size={22} weight="duotone" />,
    },
    {
      label: t("home.socialParty"),
      href: "https://www.facebook.com/ueparty",
      domain: "facebook.com",
      fb: true,
      icon: <Confetti size={22} weight="duotone" />,
    },
    {
      label: t("home.socialSsuew"),
      href: "https://samorzad.ue.wroc.pl/",
      domain: "samorzad.ue.wroc.pl",
      fb: false,
      icon: <UsersThree size={22} weight="duotone" />,
    },
  ];

  return (
    <>
      {/* HERO: teza strony to odpowiedź na pytanie "kiedy i czy mnie to dotyczy" */}
      <section className="aurora relative overflow-hidden border-b border-line">
        <HeroDoodles />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            {/* Lewa kolumna: treść */}
            <div>
              <h1 className="rise rise-1 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
                {t("hero.title")}
              </h1>
              <p className="rise rise-3 mt-5 max-w-xl text-base text-ink-soft sm:text-lg">
                {t("hero.lead")}
              </p>

              <div className="rise rise-4 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/o-wydarzeniu"
                  className="grad-brand inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet/25 transition-transform hover:scale-[1.02] active:scale-[0.99]"
                >
                  {t("hero.ctaPrimary")}
                  <ArrowRight size={18} weight="bold" />
                </Link>
                <Link
                  href="/harmonogram"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-surface px-6 py-3.5 text-sm font-bold transition-colors hover:border-violet"
                >
                  {t("hero.ctaSecondary")}
                </Link>
              </div>
              <p className="mt-4 text-sm font-medium text-ink-soft">
                {t("common.mandatory")}
              </p>
            </div>

            {/* Prawa kolumna: kolaż zdjęć z wydarzenia */}
            <div className="rise rise-3">
              <HeroPhotos />
            </div>
          </div>

          {/* Odliczanie - pełna szerokość */}
          <div className="mt-14">
            <Countdown
              labels={{
                heading: t("countdown.heading"),
                days: t("countdown.days"),
                hours: t("countdown.hours"),
                minutes: t("countdown.minutes"),
                seconds: t("countdown.seconds"),
                after: t("countdown.after"),
              }}
            />
          </div>

          {/* Pasek szybkich faktów: kiedy / gdzie / dla kogo */}
          <div className="mt-12 grid gap-3 sm:grid-cols-3">
            {[
              {
                icon: <CalendarDots size={22} weight="duotone" />,
                label: t("home.factWhenLabel"),
                value: t("home.factWhenValue"),
              },
              {
                icon: <MapPin size={22} weight="duotone" />,
                label: t("home.factWhereLabel"),
                value: t("home.factWhereValue"),
              },
              {
                icon: <UsersThree size={22} weight="duotone" />,
                label: t("home.factWhoLabel"),
                value: t("home.factWhoValue"),
              },
            ].map((fact, i) => (
              <div
                key={fact.label}
                className={`rise rise-${i + 2} flex items-center gap-3 rounded-tile border border-line bg-surface/80 p-4 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-violet hover:shadow-md`}
              >
                <span
                  className={`inline-flex size-10 shrink-0 items-center justify-center rounded-xl ${
                    [
                      "bg-sky-soft text-sky",
                      "bg-mint-soft text-green",
                      "bg-gold-soft text-amber",
                    ][i]
                  }`}
                >
                  {fact.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                    {fact.label}
                  </p>
                  <p className="truncate font-bold">{fact.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bądźcie na bieżąco */}
      <Reveal>
        <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-20">
          <h2 className="text-2xl font-bold sm:text-3xl">
            {t("home.socialTitle")}
          </h2>
          <p className="mt-2 max-w-xl text-ink-soft">{t("home.socialLead")}</p>
          <Stagger className="mt-6 grid gap-4 sm:grid-cols-3">
            {socials.map((item, i) => {
              const inner = (
                <>
                  <span
                    className={`inline-flex size-11 items-center justify-center rounded-xl ${
                      [
                        "bg-sky-soft text-sky",
                        "bg-mint-soft text-green",
                        "bg-gold-soft text-amber",
                      ][i]
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="font-semibold">{item.label}</span>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-sm text-ink-soft">
                    {item.fb ? (
                      <FacebookLogo size={16} weight="bold" />
                    ) : (
                      <GlobeHemisphereEast size={16} weight="bold" />
                    )}
                    {item.href ? item.domain : t("common.linkSoon")}
                  </span>
                </>
              );
              const cls =
                "flex h-full min-h-32 flex-col gap-2 rounded-tile border border-line bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-violet hover:shadow-md";
              return (
                <RevealItem key={item.label}>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cls}
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className={cls} aria-disabled>
                      {inner}
                    </div>
                  )}
                </RevealItem>
              );
            })}
          </Stagger>
        </section>
      </Reveal>

      {/* Dokumenty */}
      <Reveal>
        <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-20">
          <div className="flex flex-col items-start justify-between gap-5 rounded-tile border border-line bg-surface p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <h2 className="text-2xl font-bold">{t("home.docsTitle")}</h2>
              <p className="mt-1.5 text-ink-soft">{t("home.docsLead")}</p>
            </div>
            <Link
              href="/regulamin"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border-2 border-violet px-5 py-3 text-sm font-bold text-violet transition-colors hover:bg-violet hover:text-white"
            >
              <DownloadSimple size={18} weight="bold" />
              {t("home.docsCta")}
            </Link>
          </div>
        </section>
      </Reveal>

      {/* Team */}
      <Reveal>
        <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-20">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">
                {t("home.teamTitle")}
              </h2>
              <p className="mt-2 max-w-md text-ink-soft">{t("home.teamLead")}</p>
              <Link
                href="/kontakt"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-violet underline-offset-4 hover:underline"
              >
                {t("home.teamCta")}
                <ArrowRight size={16} weight="bold" />
              </Link>
            </div>
            {/* Zdjęcie zespołu (docelowo rotacja 2 zdjęć „poznajcie nas") */}
            <CyclingImage
              images={["/images/web/poznajcie1.webp"]}
              interval={4500}
              className="aspect-[16/10] rounded-tile shadow-lg ring-1 ring-black/5"
            />
          </div>
        </section>
      </Reveal>

      {/* Czym są DA */}
      <Reveal>
        <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-20">
          <div className="rounded-tile bg-[oklch(88%_0.14_150)] p-6 sm:p-10">
            <h2 className="text-2xl font-bold sm:text-3xl">
              {t("home.aboutTitle")}
            </h2>
            <p className="mt-3 max-w-2xl text-ink-soft">
              {t("home.aboutTeaser")}
            </p>
            <Link
              href="/o-wydarzeniu"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
            >
              {t("common.learnMore")}
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
        </section>
      </Reveal>
    </>
  );
}
