import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  EnvelopeSimple,
  IdentificationBadge,
  TShirt,
  User,
} from "@phosphor-icons/react/dist/ssr";
import type { Locale } from "@/i18n/routing";
import { CONTACT_EMAIL, getTeam } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return pageMetadata(
    locale,
    "/kontakt",
    t("contact.title"),
    t("contact.emailNote"),
    t("meta.siteName")
  );
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const team = await getTeam(locale);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 sm:pt-20">
      <h1 className="text-3xl font-extrabold sm:text-5xl">
        {t("contact.title")}
      </h1>

      <div className="mt-8 max-w-2xl rounded-tile border border-line bg-surface p-6 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-wide text-violet">
          {t("contact.emailLabel")}
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-3 inline-flex items-center gap-2.5 break-all font-display text-lg font-bold underline-offset-4 hover:underline sm:text-2xl"
        >
          <EnvelopeSimple size={26} weight="duotone" className="shrink-0 text-violet" />
          {CONTACT_EMAIL}
        </a>
        <p className="mt-3 text-sm text-ink-soft">{t("contact.emailNote")}</p>
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold sm:text-3xl">
          {t("contact.teamTitle")}
        </h2>
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member, i) => (
            <li
              key={`${member.role}-${i}`}
              className="rounded-tile border border-line bg-surface p-6"
            >
              <div className="grad-brand flex aspect-square w-20 items-center justify-center rounded-2xl text-white">
                <User size={34} weight="duotone" />
              </div>
              <h3 className="mt-4 font-bold">{member.name}</h3>
              <p className="mt-1 text-sm text-ink-soft">{member.role}</p>
              <p className="mt-2 text-sm font-medium text-violet">
                {member.phone}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold sm:text-3xl">
          {t("contact.recognizeTitle")}
        </h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-tile bg-violet-soft p-6 sm:p-7">
            <IdentificationBadge size={30} weight="duotone" className="text-violet" />
            <h3 className="mt-3 text-lg font-bold">
              {t("contact.teamRoleTitle")}
            </h3>
            <p className="mt-1.5 text-sm text-ink-soft sm:text-base">
              {t("contact.teamRoleBody")}
            </p>
          </div>
          <div className="rounded-tile bg-blue-soft p-6 sm:p-7">
            <TShirt size={30} weight="duotone" className="text-blue" />
            <h3 className="mt-3 text-lg font-bold">
              {t("contact.volunteersTitle")}
            </h3>
            <p className="mt-1.5 text-sm text-ink-soft sm:text-base">
              {t("contact.volunteersBody")}
            </p>
          </div>
        </div>
        <p className="mt-5 text-sm text-ink-soft">{t("contact.outfitNote")}</p>
      </section>
    </div>
  );
}
