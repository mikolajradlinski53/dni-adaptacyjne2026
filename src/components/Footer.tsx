import { getTranslations } from "next-intl/server";
import { CalendarDots, MapPin, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { CONTACT_EMAIL } from "@/lib/content";
import AnimatedLogo from "./AnimatedLogo";

export default async function Footer() {
  const t = await getTranslations();

  const nav = [
    { href: "/o-wydarzeniu", label: t("nav.about") },
    { href: "/harmonogram", label: t("nav.schedule") },
    { href: "/partnerzy", label: t("nav.partners") },
    { href: "/linki", label: t("nav.links") },
    { href: "/faq", label: t("nav.faq") },
    { href: "/kontakt", label: t("nav.contact") },
    { href: "/mapa-kampusu", label: t("nav.map") },
    { href: "/regulamin", label: t("nav.rules") },
  ];

  return (
    <footer className="relative mt-24 border-t border-line bg-surface">
      <div className="grad-line h-1 w-full" />
      {/* Easter egg: czapka studencka spaceruje po górnej krawędzi stopki.
          Pasek przycina tylko w poziomie, więc czapka jest w pełni widoczna. */}
      <div className="pointer-events-none absolute inset-x-0 -top-7 h-10 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/DA_LOGO_tylko_czapka1.svg"
          alt=""
          aria-hidden
          className="footer-cap"
        />
      </div>
      {/* Subtelna dekoracja motywu (nie wychodzi poza stopkę) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <span className="absolute -right-16 top-4 size-64 rounded-full bg-magenta-soft/50 blur-3xl" />
        <span className="absolute -bottom-16 left-1/3 size-56 rounded-full bg-gold-soft/50 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.7fr_1.1fr_1.1fr]">
        <div>
          <AnimatedLogo className="h-20 sm:h-24" />
          <p className="mt-5 max-w-sm text-sm text-ink-soft">
            {t("footer.organizer")}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold">
              <CalendarDots size={15} weight="duotone" className="text-violet" />
              {t("home.factWhenValue")}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold">
              <MapPin size={15} weight="duotone" className="text-violet" />
              {t("home.factWhereValue")}
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold">{t("footer.navTitle")}</h2>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-ink-soft transition-colors hover:text-violet"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold">{t("footer.contact")}</h2>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-3 inline-flex items-start gap-2 break-all text-sm text-violet underline-offset-4 hover:underline"
          >
            <EnvelopeSimple size={16} weight="duotone" className="mt-0.5 shrink-0" />
            {CONTACT_EMAIL}
          </a>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Kampus UEW
            <br />
            ul. Komandorska 118/120
            <br />
            53-345 Wrocław
          </p>
        </div>
      </div>
      <div className="relative border-t border-line py-5 text-center text-xs text-ink-soft">
        {t("footer.legal")}
      </div>
    </footer>
  );
}
