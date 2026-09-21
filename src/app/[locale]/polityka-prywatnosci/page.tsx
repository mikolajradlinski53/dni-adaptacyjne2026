import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Info } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

const UPDATED = "21.09.2026";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return pageMetadata(
    locale,
    "/polityka-prywatnosci",
    t("privacy.title"),
    t("meta.description"),
    t("meta.siteName")
  );
}

// Renderuje **pogrubienia** oraz zamienia adresy e-mail na klikalne linki.
function fmt(text: string): ReactNode {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part.split(/([^\s@]+@[^\s@]+\.[^\s@,.;]+)/g).map((seg, j) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(seg) ? (
        <a
          key={`${i}-${j}`}
          href={`mailto:${seg}`}
          className="font-medium text-violet underline-offset-2 hover:underline"
        >
          {seg}
        </a>
      ) : (
        <span key={`${i}-${j}`}>{seg}</span>
      )
    );
  });
}

type Blok = { p: string } | { ul: string[] } | { h3: string };
type Sekcja = { h: string; bloki: Blok[] };

// Treść merytoryczna (wersja polska - wiążąca).
const SEKCJE: Sekcja[] = [
  {
    h: "1. Administrator danych",
    bloki: [
      { p: "Administratorem Twoich danych osobowych jest Uniwersytet Ekonomiczny we Wrocławiu, ul. Komandorska 118/120, 53-345 Wrocław (dalej: „Administrator” lub „Uczelnia”)." },
      { p: "Serwis „Dni Adaptacyjne” (dostępny pod adresem dni-adaptacyjne.uew.pl) jest prowadzony przez Samorząd Studentów Uniwersytetu Ekonomicznego we Wrocławiu w imieniu i na rzecz Uczelni. Administratorem danych pozostaje Uczelnia." },
    ],
  },
  {
    h: "2. Inspektor Ochrony Danych (IOD)",
    bloki: [
      { p: "We wszystkich sprawach dotyczących przetwarzania danych osobowych możesz skontaktować się z Inspektorem Ochrony Danych: iod@ue.wroc.pl." },
    ],
  },
  {
    h: "3. Jakie dane przetwarzamy, w jakim celu i na jakiej podstawie",
    bloki: [
      { h3: "a) Formularze kontaktowe (formularz ogólny oraz formularz kontaktu ws. współpracy/partnerstwa)" },
      {
        ul: [
          "**Zakres danych:** imię (opcjonalnie), adres e-mail, treść wiadomości.",
          "**Cel:** obsługa i udzielenie odpowiedzi na przesłane zapytanie; prowadzenie rejestru korespondencji.",
          "**Podstawa prawna:** art. 6 ust. 1 lit. f RODO - prawnie uzasadniony interes Administratora polegający na zapewnieniu komunikacji z osobami kontaktującymi się z Uczelnią, udzieleniu odpowiedzi na kierowane pytania i obsłudze korespondencji.",
        ],
      },
      { h3: "b) Dane techniczne / logi serwera" },
      {
        ul: [
          "**Zakres:** dane gromadzone automatycznie przez infrastrukturę hostingową (m.in. adres IP, data i godzina zapytania, typ przeglądarki), w zakresie niezbędnym do świadczenia i zabezpieczenia usługi.",
          "**Cel:** zapewnienie bezpieczeństwa i prawidłowego działania serwisu, diagnostyka.",
          "**Podstawa prawna:** art. 6 ust. 1 lit. f RODO - prawnie uzasadniony interes Administratora (bezpieczeństwo i stabilność serwisu).",
        ],
      },
      { h3: "Informacja o profilowaniu" },
      { p: "Twoje dane nie będą przetwarzane w sposób zautomatyzowany i nie będą poddane profilowaniu. Administrator nie wykorzystuje danych do celów marketingowych/reklamowych." },
      { h3: "Dobrowolność / obowiązek podania danych" },
      { p: "Podanie danych osobowych jest dobrowolne, jednak niezbędne do przesłania zapytania za pośrednictwem formularza kontaktowego i udzielenia odpowiedzi na zapytanie. Brak podania danych oznaczonych jako wymagane uniemożliwi przesłanie zapytania i udzielenie odpowiedzi." },
    ],
  },
  {
    h: "4. Odbiorcy danych i podmioty przetwarzające",
    bloki: [
      { p: "Twoje dane osobowe mogą być udostępniane podmiotom uprawnionym do ich otrzymania na podstawie przepisów prawa oraz podmiotom działającym na zlecenie Administratora, na podstawie zawartych z nim umów powierzenia przetwarzania danych (w tym dostawcom usług hostingowych, informatycznych i związanych z obsługą formularza)." },
    ],
  },
  {
    h: "5. Przekazywanie danych poza EOG",
    bloki: [
      { p: "Korzystanie z ww. dostawców (Google, Vercel) może wiązać się z przekazywaniem danych do państw trzecich (m.in. USA). Odbywa się to na podstawie mechanizmów zgodnych z RODO - standardowych klauzul umownych i/lub ram Data Privacy Framework (EU-US)." },
    ],
  },
  {
    h: "6. Okres przechowywania",
    bloki: [
      {
        ul: [
          "**Dane z formularzy:** przez czas niezbędny do obsługi zapytania, a następnie przez okres archiwizacji wynoszący 12 miesięcy, po czym są usuwane.",
          "**Logi serwera:** przez okres 6 miesięcy wynikający z ustawień dostawcy hostingu.",
        ],
      },
    ],
  },
  {
    h: "7. Twoje prawa",
    bloki: [
      { p: "Na zasadach określonych w RODO przysługuje Ci prawo do: dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania oraz wniesienia sprzeciwu wobec przetwarzania." },
      { p: "Masz również prawo wniesienia skargi do organu nadzorczego - Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa)." },
    ],
  },
  {
    h: "8. Pliki cookies, pamięć lokalna i wyszukiwarki",
    bloki: [
      {
        ul: [
          "Serwis nie stosuje ciasteczek marketingowych ani analitycznych i nie śledzi użytkowników.",
          "Serwis korzysta z pamięci lokalnej przeglądarki (localStorage) wyłącznie w celach funkcjonalnych (zapamiętanie wybranego języka i trybu studiów). Nie są to dane osobowe i nie są przekazywane Administratorowi.",
          "Serwis może być indeksowany przez wyszukiwarki internetowe (m.in. Google); jest to standardowy mechanizm udostępniania stron publicznych i nie wiąże się z przekazywaniem przez Administratora Twoich danych z formularzy do wyszukiwarek.",
        ],
      },
    ],
  },
  {
    h: "9. Linki zewnętrzne",
    bloki: [
      { p: "Serwis zawiera odnośniki do stron zewnętrznych (m.in. Facebook, USOS, strona Uczelni, strona Samorządu, Microsoft Teams). Administrator nie odpowiada za polityki prywatności tych witryn - zapoznaj się z nimi odrębnie." },
    ],
  },
  {
    h: "10. Zmiany polityki",
    bloki: [
      { p: "Polityka może być aktualizowana. Aktualna wersja jest zawsze dostępna w serwisie, z datą ostatniej aktualizacji." },
    ],
  },
];

const SKROT =
  "Administratorem danych podanych w formularzu jest Uniwersytet Ekonomiczny we Wrocławiu (ul. Komandorska 118/120, 53-345 Wrocław). Dane (imię, e-mail, treść zapytania) przetwarzamy w celu obsługi Twojego zgłoszenia. Podanie danych jest dobrowolne, ale niezbędne do przesłania zapytania za pośrednictwem formularza kontaktowego i udzielenia na nie odpowiedzi. Masz prawo do żądania dostępu do swoich danych osobowych, ich sprostowania, usunięcia lub ograniczenia przetwarzania, a także prawo wniesienia sprzeciwu wobec przetwarzania oraz wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych. Kontakt do IOD: iod@ue.wroc.pl.";

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="mx-auto max-w-3xl px-4 pt-14 sm:px-6 sm:pt-20">
      <h1 className="text-3xl font-extrabold sm:text-5xl">
        {t("privacy.title")}
      </h1>
      <p className="mt-4 text-sm text-ink-soft">
        {t("privacy.updated")}: {UPDATED}
      </p>

      <div className="mt-6 flex items-start gap-3 rounded-tile bg-gold-soft p-4 sm:p-5">
        <Info size={22} weight="duotone" className="mt-0.5 shrink-0 text-amber" />
        <p className="text-sm font-medium text-ink">{t("privacy.note")}</p>
      </div>

      {/* Wersja skrócona - TL;DR */}
      <section className="mt-8 rounded-tile bg-blue-soft p-6 sm:p-7">
        <h2 className="text-lg font-bold sm:text-xl">Wersja skrócona</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink sm:text-base">
          {fmt(SKROT)}
        </p>
      </section>

      <div className="mt-10 space-y-8">
        {SEKCJE.map((s) => (
          <section key={s.h}>
            <h2 className="text-lg font-bold sm:text-xl">{s.h}</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-soft sm:text-base">
              {s.bloki.map((b, i) => {
                if ("h3" in b) {
                  return (
                    <h3 key={i} className="pt-1 font-semibold text-ink">
                      {b.h3}
                    </h3>
                  );
                }
                if ("ul" in b) {
                  return (
                    <ul key={i} className="space-y-2 pl-1">
                      {b.ul.map((li, j) => (
                        <li key={j} className="flex gap-2.5">
                          <span
                            aria-hidden
                            className="mt-2 size-1.5 shrink-0 rounded-full bg-violet/60"
                          />
                          <span>{fmt(li)}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                return <p key={i}>{fmt(b.p)}</p>;
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
