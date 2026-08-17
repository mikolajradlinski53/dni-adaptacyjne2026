import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Info } from "@phosphor-icons/react/dist/ssr";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

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

// Treść merytoryczna (wersja polska - wiążąca). Do zatwierdzenia przez IOD.
const SEKCJE: { h: string; p: string[] }[] = [
  {
    h: "1. Administrator danych",
    p: [
      "Administratorem Twoich danych osobowych jest Uniwersytet Ekonomiczny we Wrocławiu, ul. Komandorska 118/120, 53-345 Wrocław (dalej: „Administrator” lub „Uczelnia”).",
      "Serwis „Dni Adaptacyjne” (dni.adaptacyjne.uew.pl) jest prowadzony przez Samorząd Studentów Uniwersytetu Ekonomicznego we Wrocławiu w imieniu i na rzecz Uczelni. Administratorem danych pozostaje Uczelnia.",
    ],
  },
  {
    h: "2. Inspektor Ochrony Danych",
    p: [
      "We wszystkich sprawach dotyczących przetwarzania danych osobowych możesz skontaktować się z Inspektorem Ochrony Danych Uczelni: iod@ue.wroc.pl, adres korespondencyjny jak wyżej z dopiskiem „IOD”.",
    ],
  },
  {
    h: "3. Jakie dane przetwarzamy, w jakim celu i na jakiej podstawie",
    p: [
      "Formularze kontaktowe (formularz ogólny oraz formularz kontaktu ws. współpracy): przetwarzamy imię (opcjonalnie), adres e-mail i treść wiadomości. Cel: obsługa i udzielenie odpowiedzi na przesłane zapytanie oraz prowadzenie rejestru korespondencji. Podstawa prawna: art. 6 ust. 1 lit. f RODO - prawnie uzasadniony interes Administratora polegający na obsłudze korespondencji. Podanie danych jest dobrowolne, ale niezbędne do udzielenia odpowiedzi.",
      "Dane techniczne / logi serwera: infrastruktura hostingowa automatycznie gromadzi dane techniczne (m.in. adres IP, data i godzina zapytania, typ przeglądarki) w zakresie niezbędnym do świadczenia i zabezpieczenia usługi. Podstawa prawna: art. 6 ust. 1 lit. f RODO - prawnie uzasadniony interes (bezpieczeństwo i stabilność serwisu).",
      "Serwis nie prowadzi profilowania, nie podejmuje decyzji w sposób w pełni zautomatyzowany wywołujący skutki prawne i nie wykorzystuje danych do celów marketingowych.",
    ],
  },
  {
    h: "4. Odbiorcy danych i podmioty przetwarzające",
    p: [
      "Dane mogą być powierzane zaufanym dostawcom działającym na zlecenie Administratora, na podstawie umów powierzenia: Google Ireland Ltd. / Google LLC (usługi Google Workspace - obsługa i archiwum formularzy) oraz Vercel Inc. (hosting serwisu).",
      "Dane mogą być udostępniane organom uprawnionym na podstawie przepisów prawa.",
    ],
  },
  {
    h: "5. Przekazywanie danych poza EOG",
    p: [
      "Korzystanie z ww. dostawców może wiązać się z przekazywaniem danych do państw trzecich (m.in. USA). Odbywa się to na podstawie mechanizmów zgodnych z RODO - standardowych klauzul umownych i/lub ram Data Privacy Framework (EU-US).",
    ],
  },
  {
    h: "6. Okres przechowywania",
    p: [
      "Dane z formularzy przechowujemy przez czas niezbędny do obsługi sprawy, a następnie w celach archiwalnych i rozliczalności przez okres nie dłuższy niż 12 miesięcy, po czym są usuwane.",
      "Logi serwera przechowywane są przez okres wynikający z ustawień dostawcy hostingu.",
    ],
  },
  {
    h: "7. Twoje prawa",
    p: [
      "Przysługuje Ci prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia danych oraz wniesienia sprzeciwu wobec przetwarzania (gdy podstawą jest prawnie uzasadniony interes). Jeżeli przetwarzanie odbywa się na podstawie zgody - masz prawo wycofać ją w dowolnym momencie, bez wpływu na zgodność z prawem przetwarzania sprzed wycofania.",
      "Masz również prawo wniesienia skargi do organu nadzorczego - Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa).",
    ],
  },
  {
    h: "8. Pliki cookies, pamięć lokalna i wyszukiwarki",
    p: [
      "Serwis nie stosuje ciasteczek marketingowych ani analitycznych i nie śledzi użytkowników.",
      "Serwis korzysta z pamięci lokalnej przeglądarki (localStorage) wyłącznie w celach funkcjonalnych - zapamiętania wybranego języka i trybu studiów. Nie są to dane osobowe i nie są przekazywane Administratorowi.",
      "Serwis może być indeksowany przez wyszukiwarki internetowe (m.in. Google) - jest to standardowy mechanizm udostępniania stron publicznych i nie wiąże się z przekazywaniem przez Administratora Twoich danych z formularzy do wyszukiwarek.",
    ],
  },
  {
    h: "9. Linki zewnętrzne",
    p: [
      "Serwis zawiera odnośniki do stron zewnętrznych (m.in. Facebook, USOS, strona Uczelni, strona Samorządu, Microsoft Teams). Administrator nie odpowiada za polityki prywatności tych witryn - zapoznaj się z nimi odrębnie.",
    ],
  },
  {
    h: "10. Zmiany polityki",
    p: [
      "Polityka może być aktualizowana. Aktualna wersja jest zawsze dostępna w serwisie, wraz z datą ostatniej aktualizacji.",
    ],
  },
];

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
        {t("privacy.updated")}: 2026
      </p>

      <div className="mt-6 flex items-start gap-3 rounded-tile bg-gold-soft p-4 sm:p-5">
        <Info size={22} weight="duotone" className="mt-0.5 shrink-0 text-amber" />
        <p className="text-sm font-medium text-ink">{t("privacy.note")}</p>
      </div>

      <div className="mt-10 space-y-8">
        {SEKCJE.map((s) => (
          <section key={s.h}>
            <h2 className="text-lg font-bold sm:text-xl">{s.h}</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-soft sm:text-base">
              {s.p.map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}