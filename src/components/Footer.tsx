import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CONTACT_EMAIL } from "@/lib/content";

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
    <footer className="relative mt-24 overflow-hidden border-t border-line bg-surface">
      <div className="grad-line h-1 w-full" />
      {/* Easter egg: czapka studencka spaceruje po krawędzi stopki */}
      <span className="footer-cap" aria-hidden>
        🎓
      </span>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/DA_LOGO.png"
            alt="Dni Adaptacyjne 2026"
            className="h-14 w-auto"
          />
          <p className="mt-4 max-w-sm text-sm text-ink-soft">
            {t("footer.organizer")}
          </p>
        </div>
        <div>
          <h2 className="text-sm font-bold">{t("footer.navTitle")}</h2>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-ink-soft hover:text-violet"
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
            className="mt-3 inline-block break-all text-sm text-violet underline-offset-4 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-ink-soft">
        {t("footer.legal")}
      </div>
    </footer>
  );
}
