"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { PaperPlaneTilt, CheckCircle, Warning } from "@phosphor-icons/react";
import { wyslijZgloszenie, type StanFormularza } from "@/app/actions/kontakt";

const STAN_POCZATKOWY: StanFormularza = { status: "idle" };

const inputCls =
  "w-full rounded-xl border-2 border-line bg-line/25 px-4 py-3 text-sm outline-none transition-colors focus:border-violet focus:bg-surface";

/**
 * Jeden formularz, dwa warianty (prop `formularz`): "wspolpraca" i "ogolny".
 * POST idzie przez server action do Apps Script.
 */
export default function FormularzKontaktowy({
  formularz,
}: {
  formularz: "wspolpraca" | "ogolny";
}) {
  const t = useTranslations("form");
  const akcja = wyslijZgloszenie.bind(null, formularz);
  const [stan, formAction, oczekuje] = useActionState(akcja, STAN_POCZATKOWY);

  if (stan.status === "ok") {
    return (
      <div className="flex items-center gap-3 rounded-tile border border-line bg-mint-soft p-6">
        <CheckCircle size={28} weight="fill" className="shrink-0 text-green" />
        <p className="font-medium text-ink">{t("success")}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-3">
      {/* honeypot - poza ekranem, niewidoczny dla ludzi */}
      <input
        name="firma"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0"
      />

      <input name="imie" placeholder={t("name")} className={inputCls} />
      <input
        name="email"
        type="email"
        required
        placeholder={t("email")}
        className={inputCls}
      />
      <textarea
        name="tresc"
        required
        rows={4}
        placeholder={t("message")}
        className={`${inputCls} resize-y`}
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={oczekuje}
          className="grad-brand inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.02] active:scale-[0.99] disabled:opacity-60"
        >
          <PaperPlaneTilt size={17} weight="bold" />
          {oczekuje ? t("sending") : t("send")}
        </button>

        {stan.status === "blad_walidacji" ? (
          <span className="inline-flex items-center gap-1.5 text-sm text-magenta">
            <Warning size={16} weight="fill" />
            {t("errorValidation")}
          </span>
        ) : null}
        {stan.status === "blad_serwera" ? (
          <span className="inline-flex items-center gap-1.5 text-sm text-magenta">
            <Warning size={16} weight="fill" />
            {t("errorServer")}
          </span>
        ) : null}
      </div>
    </form>
  );
}
