import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="mx-auto flex max-w-6xl flex-col items-start px-4 pt-20 sm:px-6 sm:pt-28">
      <p className="font-display text-7xl font-extrabold sm:text-8xl">404</p>
      <div className="grad-line mt-4 h-1 w-24 rounded-full" />
      <h1 className="mt-6 text-2xl font-bold sm:text-3xl">{t("title")}</h1>
      <p className="mt-2 text-ink-soft">{t("body")}</p>
      <Link
        href="/"
        className="grad-brand mt-8 inline-flex rounded-full px-6 py-3 text-sm font-bold text-white"
      >
        {t("cta")}
      </Link>
    </div>
  );
}
