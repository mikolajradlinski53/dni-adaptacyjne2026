"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { List, X, MapPinLine } from "@phosphor-icons/react";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import type { SearchEntry } from "@/lib/search";
import SearchOverlay from "./SearchOverlay";

const LOCALE_LABELS: Record<string, string> = {
  pl: "PL",
  en: "EN",
  uk: "UA",
};

export default function Header({ entries }: { entries: SearchEntry[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const primary = [
    { href: "/o-wydarzeniu", label: t("nav.about") },
    { href: "/harmonogram", label: t("nav.schedule") },
    { href: "/partnerzy", label: t("nav.partners") },
    { href: "/linki", label: t("nav.links") },
    { href: "/faq", label: t("nav.faq") },
    { href: "/kontakt", label: t("nav.contact") },
  ];

  const mapItem = { href: "/mapa-kampusu", label: t("nav.map") };
  const mapActive = pathname.startsWith(mapItem.href);

  const secondary = [{ href: "/regulamin", label: t("nav.rules") }];

  const searchLabels = {
    open: t("search.open"),
    placeholder: t("search.placeholder"),
    empty: t("search.empty"),
    hint: t("search.hint"),
    label: t("search.label"),
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center"
          aria-label="Dni Adaptacyjne 2026"
          onClick={() => setMenuOpen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/DA_LOGO.png"
            alt="Dni Adaptacyjne 2026"
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        <nav
          className="hidden items-center gap-0.5 lg:flex xl:gap-1"
          aria-label="main"
        >
          {primary.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-medium transition-colors xl:px-3.5 ${
                  active
                    ? "bg-violet-soft text-ink"
                    : "text-ink-soft hover:bg-violet-soft/60 hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Wyróżniona zakładka: Mapa kampusu */}
          <Link
            href={mapItem.href}
            aria-current={mapActive ? "page" : undefined}
            className={`group ml-1 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-2 text-sm font-bold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md xl:px-3.5 ${
              mapActive
                ? "grad-brand border-transparent text-white"
                : "border-violet/40 bg-gradient-to-r from-blue-soft via-violet-soft to-magenta-soft text-ink"
            }`}
          >
            <MapPinLine
              size={17}
              weight="bold"
              className={
                mapActive
                  ? "text-white"
                  : "text-violet transition-transform group-hover:scale-110"
              }
            />
            {mapItem.label}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <SearchOverlay entries={entries} labels={searchLabels} />

          <nav
            aria-label={t("langSwitcher.label")}
            className="hidden items-center rounded-full border border-line bg-surface p-1 sm:flex"
          >
            {routing.locales.map((loc) => (
              <Link
                key={loc}
                href={pathname}
                locale={loc}
                aria-current={loc === locale ? "true" : undefined}
                className={`rounded-full px-2.5 py-1 text-xs font-bold transition-colors ${
                  loc === locale
                    ? "grad-brand text-white"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {LOCALE_LABELS[loc]}
              </Link>
            ))}
          </nav>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            className="rounded-full border border-line bg-surface p-2 lg:hidden"
          >
            {menuOpen ? (
              <X size={20} weight="bold" />
            ) : (
              <List size={20} weight="bold" />
            )}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-line bg-bg lg:hidden">
          <nav className="mx-auto max-w-6xl px-4 py-4 sm:px-6" aria-label="mobile">
            <ul className="grid gap-1">
              {primary.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-3 py-2.5 text-base font-medium hover:bg-violet-soft"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={mapItem.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl border border-violet/40 bg-gradient-to-r from-blue-soft via-violet-soft to-magenta-soft px-3 py-2.5 text-base font-bold"
                >
                  <MapPinLine size={19} weight="bold" className="text-violet" />
                  {mapItem.label}
                </Link>
              </li>
              {secondary.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-3 py-2.5 text-base font-medium hover:bg-violet-soft"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex gap-2 border-t border-line pt-3 sm:hidden">
              {routing.locales.map((loc) => (
                <Link
                  key={loc}
                  href={pathname}
                  locale={loc}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-full px-3 py-1.5 text-sm font-bold ${
                    loc === locale
                      ? "grad-brand text-white"
                      : "border border-line text-ink-soft"
                  }`}
                >
                  {LOCALE_LABELS[loc]}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
