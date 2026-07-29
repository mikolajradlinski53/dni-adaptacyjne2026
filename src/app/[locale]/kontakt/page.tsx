import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  EnvelopeSimple,
  IdentificationBadge,
  TShirt,
  User,
} from "@phosphor-icons/react/dist/ssr";
import type { Locale } from "@/i18n/routing";
import { CONTACT_EMAIL, FORMSPREE_ID, getTeam } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import FormspreeForm from "@/components/FormspreeForm";

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
          className="mt-3 flex items-center gap-2.5 font-display text-sm font-bold underline-offset-4 hover:underline sm:text-lg md:text-2xl"
        >
          <EnvelopeSimple
            size={26}
            weight="duotone"
            className="shrink-0 text-violet"
          />
          <span className="truncate">{CONTACT_EMAIL}</span>
        </a>
        <p className="mt-3 text-sm text-ink-soft">{t("contact.emailNote")}</p>
      </div>

      {/* Formularz — napisz do nas */}
      <section className="mt-8 max-w-2xl rounded-tile border border-line bg-surface p-6 sm:p-8">
        <h2 className="text-xl font-bold sm:text-2xl">
          {t("contact.formTitle")}
        </h2>
        <p className="mt-1.5 text-ink-soft">{t("contact.formLead")}</p>
        <div className="mt-5">
          <FormspreeForm
            endpoint={`https://formspree.io/f/${FORMSPREE_ID}`}
            labels={{
              email: t("form.email"),
              message: t("form.message"),
              send: t("form.send"),
              sending: t("form.sending"),
              success: t("form.success"),
              error: t("form.error"),
            }}
          />
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold sm:text-3xl">
          {t("contact.teamTitle")}
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member, i) => (
            <li
              key={`${member.name}-${i}`}
              className="flex items-center gap-4 rounded-tile border border-line bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-violet hover:shadow-md"
            >
              <div className="relative shrink-0">
                <div className="grad-brand flex size-20 items-center justify-center overflow-hidden rounded-2xl text-white sm:size-24">
                  {member.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="size-full object-cover object-top"
                    />
                  ) : (
                    <User size={38} weight="duotone" />
                  )}
                </div>
                {/* Emotka czapki studenckiej w rogu zdjęcia */}
                <span
                  aria-hidden
                  className="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full border border-line bg-surface text-sm shadow-sm"
                >
                  🎓
                </span>
              </div>
              <div className="min-w-0">
                <h3 className="font-bold leading-tight">{member.name}</h3>
                <p className="mt-1 text-sm text-ink-soft">{member.role}</p>
              </div>
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
