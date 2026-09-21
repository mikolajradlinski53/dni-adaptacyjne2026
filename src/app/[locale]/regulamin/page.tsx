import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DownloadSimple, Gavel, Info } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

const PDF_HREF = "/docs/regulamin-dni-adaptacyjnych-2026.pdf";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return pageMetadata(
    locale,
    "/regulamin",
    t("rules.title"),
    t("rules.lead"),
    t("meta.siteName")
  );
}

// Zamienia adresy e-mail i URL-e w tekście na klikalne odnośniki.
function linkify(text: string): ReactNode {
  const parts = text.split(/(https?:\/\/[^\s)]+|[^\s@]+@[^\s@]+\.[^\s@)]+)/g);
  return parts.map((part, i) => {
    const isUrl = /^https?:\/\//.test(part);
    const isEmail = !isUrl && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(part);
    if (!isUrl && !isEmail) return part;

    // Nie wciągaj końcowej interpunkcji zdania do linku.
    const trail = part.match(/[.,;:]+$/)?.[0] ?? "";
    const core = trail ? part.slice(0, -trail.length) : part;

    return (
      <span key={i}>
        <a
          href={isUrl ? core : `mailto:${core}`}
          target={isUrl ? "_blank" : undefined}
          rel={isUrl ? "noopener noreferrer" : undefined}
          className="break-words font-medium text-violet underline-offset-2 hover:underline"
        >
          {core}
        </a>
        {trail}
      </span>
    );
  });
}

type Blok = { t: string; sub?: string[] };
type Paragraf = { h: string; lead?: string[]; items: Blok[] };

// Treść regulaminu (wersja polska - wiążąca). Transkrypcja oficjalnego dokumentu.
const INTRO =
  "Dni Adaptacyjne to obowiązkowe wydarzenie organizacyjno-integracyjne dla studentów I roku Uniwersytetu Ekonomicznego we Wrocławiu. Wydarzenie realizuje ustawowy obowiązek szkolenia z praw i obowiązków studenta, wynikający z ustawy Prawo o szkolnictwie wyższym i nauce. Każda osoba przyjęta na I rok studiów ma obowiązek przejść to szkolenie, a Dni Adaptacyjne stanowią oficjalną formę jego realizacji na naszej Uczelni.";

const PARAGRAFY: Paragraf[] = [
  {
    h: "§ 1. Postanowienia ogólne",
    items: [
      {
        t: "Niniejszy regulamin (dalej: „Regulamin”) określa zasady uczestnictwa, organizację oraz prawa i obowiązki uczestników w wydarzeniu „Dni Adaptacyjne 2026” (dalej: „Wydarzenie”).",
      },
      {
        t: "Organizatorem Wydarzenia jest Uniwersytet Ekonomiczny we Wrocławiu z siedzibą we Wrocławiu przy ul. Komandorskiej 118/120, 53-345 Wrocław, w imieniu i na rzecz którego czynności operacyjne podejmuje Samorząd Studentów Uniwersytetu Ekonomicznego we Wrocławiu.",
      },
      {
        t: "Wydarzenie odbywa się w dniach 1-3 października 2026 r. na terenie kampusu Uczelni we Wrocławiu oraz w formie zdalnej.",
      },
      {
        t: "Celem Wydarzenia jest wdrożenie w prawa i obowiązki studenta przed oficjalnym rozpoczęciem semestru oraz zapoznanie nowo przyjętych studentów z organizacją studiów, topografią kampusu oraz działalnością studencką.",
      },
      {
        t: "Jedyny oficjalny kanał komunikacji z organizatorem stanowi mail Dni Adaptacyjnych: dni.adaptacyjne@samorzad.ue.wroc.pl. Organizator nie gwarantuje udzielenia odpowiedzi na wiadomości przekazane za pośrednictwem innych kanałów komunikacji, w szczególności za pośrednictwem prywatnych profili lub kont w mediach społecznościowych.",
      },
      {
        t: "Ilekroć w treści niniejszego Regulaminu używa się poniższych pojęć pisanych wielką literą, należy przez nie rozumieć:",
        sub: [
          "Regulamin - niniejszy dokument stanowiący wzorzec umowny w rozumieniu art. 384 Kodeksu cywilnego;",
          "Wydarzenie - Wydarzenie pod nazwą „Dni Adaptacyjne 2026”, realizowane w dniach 1-3.10.2026 r. na terenie Uniwersytetu Ekonomicznego we Wrocławiu;",
          "Organizator - Uniwersytet Ekonomiczny we Wrocławiu z siedzibą we Wrocławiu przy ul. Komandorskiej 118/120, 53-345 Wrocław, NIP: 896-000-69-97, REGON: 000001497, w imieniu i na rzecz którego czynności operacyjne podejmuje Samorząd Studentów UEW;",
          "Miejsce Wydarzenia - Uniwersytet Ekonomiczny we Wrocławiu z siedzibą we Wrocławiu przy ul. Komandorskiej 118/120;",
          "Grupa Projektowa - zespół organizacyjny Dni Adaptacyjnych 2026 działający z upoważnienia Organizatora i odpowiedzialny za bieżącą organizację oraz prawidłowy przebieg Wydarzenia;",
          "Uczestnik - osoba fizyczna, będąca studentem Uniwersytetu Ekonomicznego we Wrocławiu, przebywająca na terenie Wydarzenia, z wyłączeniem pracowników obiektu oraz członków Grupy Projektowej;",
          "Impreza - Wydarzenie towarzyszące pod nazwą „UE Party x Dni Adaptacyjne”, odbywające się poza terenem Uczelni w ramach Wydarzenia.",
        ],
      },
    ],
  },
  {
    h: "§ 2. Grupy docelowe i harmonogram",
    lead: [
      "Udział w Wydarzeniu i forma realizacji szkolenia zależą od trybu i stopnia podjętych studiów:",
    ],
    items: [
      {
        t: "Studia stacjonarne I stopnia (1-2 października)",
        sub: [
          "Dzień 1 (czwartek, 1 października): Dzień wprowadzający i integracyjny na kampusie. W programie m.in. „Droga przez kampus” (zapoznanie z najważniejszymi budynkami), zapoznanie ze stoiskami organizacji studenckich i kół naukowych oraz integracja na obszarze Zaprzegubia.",
          "Dzień 2 (piątek, 2 października): Dzień merytoryczny. Obejmuje obowiązkowe prelekcje dotyczące praw i obowiązków studenta oraz zasad studiowania na Uczelni.",
        ],
      },
      {
        t: "Studia stacjonarne II stopnia (1 października)",
        sub: [
          "Dzień 1 (czwartek, 1 października): Obowiązkowe prelekcje dedykowane dla II stopnia dotyczące organizacji studiów oraz praw i obowiązków studenta. Studenci II stopnia mają również możliwość dobrowolnego udziału w części ogólnej, w tym odwiedzenia stoisk organizacji oraz udziału w integracji.",
          "Z uwagi na zajęcia dydaktyczne, w dniu 2 października Wydarzenie dla tej grupy nie jest przewidziane.",
        ],
      },
      {
        t: "Studia niestacjonarne (3 października)",
        sub: [
          "Sobota, 3 października: Wydarzenie odbywa się w formie w pełni online. Program obejmuje audycję z najważniejszymi informacjami o organizacji studiów niestacjonarnych oraz prawach i obowiązkach studenta. Link do transmisji zostanie udostępniony na stronie internetowej https://dni-adaptacyjne.uew.pl/pl oraz na Facebooku. Obecność na kampusie w tym dniu nie jest wymagana.",
        ],
      },
    ],
  },
  {
    h: "§ 3. Zasady uczestnictwa i bezpieczeństwo",
    items: [
      {
        t: "Uczestnikiem Wydarzenia jest każda osoba przyjęta na I rok studiów, która bierze w nim udział zgodnie z harmonogramem dla swojego kierunku i trybu nauczania.",
      },
      {
        t: "Każdy Uczestnik przebywający na terenie kampusu ma obowiązek:",
        sub: [
          "przestrzegania postanowień niniejszego Regulaminu, regulaminów obiektów Uniwersytetu Ekonomicznego we Wrocławiu oraz powszechnie obowiązujących przepisów prawa,",
          "kulturalnego zachowania i poszanowania innych Uczestników, organizatorów i pracowników Uczelni,",
          "stosowania się do poleceń porządkowych wydawanych przez organizatorów oraz służby odpowiedzialne za bezpieczeństwo.",
        ],
      },
      {
        t: "Na terenie Uczelni obowiązuje bezwzględny zakaz posiadania i spożywania alkoholu, środków odurzających oraz innych substancji psychoaktywnych, a także zakaz przebywania pod ich wpływem. Naruszenie tego punktu może skutkować wyciągnięciem konsekwencji dyscyplinarnych przewidzianych w Regulaminie Studiów.",
      },
    ],
  },
  {
    h: "§ 4. Wydarzenie towarzyszące",
    items: [
      {
        t: "Dopełnieniem Dni Adaptacyjnych jest Impreza (określana jako UE Party x Dni Adaptacyjne), którą zaplanowano po zakończeniu oficjalnej części Wydarzenia w dniu 2 października. Szczegółowe zasady dotyczące Imprezy zostały określone w Załączniku nr 1 do Regulaminu, stanowiącym jego integralną część.",
      },
      {
        t: "Udział w wydarzeniu towarzyszącym ma charakter całkowicie dobrowolny i integracyjny, nie stanowi elementu obowiązkowego szkolenia z praw i obowiązków studenta.",
      },
      {
        t: "Zasady wstępu oraz regulamin uczestnictwa w wydarzeniu towarzyszącym określone są odrębnymi przepisami udostępnionymi uczestnikom przez organizatorów przed jego rozpoczęciem na wydarzeniu na platformie Facebook, organizowanym przez Samorząd Studentów Uniwersytetu Ekonomicznego we Wrocławiu.",
      },
      {
        t: "Miejsce Imprezy podane będzie uczestnikom za pomocą wydarzenia na platformie Facebook (https://fb.me/e/7yw2WuQDL) oraz na stronie internetowej Dni Adaptacyjnych (https://dni-adaptacyjne.uew.pl/pl).",
      },
    ],
  },
  {
    h: "§ 5. Prawa i odpowiedzialność Uczestnika",
    items: [
      {
        t: "Uczestnicy mają prawo do udziału w Wydarzeniu na zasadach określonych w niniejszym Regulaminie.",
      },
      {
        t: "Uczestnicy mają prawo do uzyskiwania informacji dotyczących przebiegu Wydarzenia od Organizatora lub osób działających w jego imieniu.",
      },
      {
        t: "Uczestnik zobowiązany jest do przestrzegania niniejszego Regulaminu, regulaminu Uczelni, ogólnie przyjętych norm zachowania oraz uzasadnionych poleceń Organizatora, Grupy Projektowej lub osób upoważnionych, związanych z bezpieczeństwem, porządkiem lub prawidłowym przebiegiem Wydarzenia.",
      },
      {
        t: "Każdy Uczestnik odpowiada za naprawienie szkód wyrządzonych przez niego w trakcie lub w związku z uczestnictwem w Wydarzeniu, na zasadach ogólnych wynikających z przepisów Kodeksu cywilnego.",
      },
    ],
  },
  {
    h: "§ 6. Prawa i odpowiedzialność Organizatora",
    items: [
      {
        t: "Organizator zobowiązuje się do informowania uczestników o zasadach uczestnictwa w Wydarzeniu oraz o ewentualnych zmianach dotyczących jego przebiegu.",
      },
      {
        t: "Organizator zobowiązuje się do podejmowania działań mających na celu zapewnienie sprawnego przebiegu Wydarzenia.",
      },
      {
        t: "Organizator nie ponosi odpowiedzialności za szkody na mieniu zgubionym, porzuconym lub pozostawionym przez Uczestników na terenie Wydarzenia poza miejscami przeznaczonymi do ich przechowania, chyba że szkoda na owym mieniu powstała z umyślnej winy Organizatora.",
      },
      {
        t: "Organizator ponosi odpowiedzialność na zasadach określonych w powszechnie obowiązujących przepisach prawa. Żadne postanowienie Regulaminu nie wyłącza ani nie ogranicza odpowiedzialności Organizatora w zakresie, w jakim wyłączenie lub ograniczenie byłoby niedopuszczalne na podstawie bezwzględnie obowiązujących przepisów prawa.",
      },
      {
        t: "Organizator może zwrócić się do właściwych służb lub obsługi obiektu o interwencję w przypadku zachowania agresywnego, niebezpiecznego, naruszającego dobra osobiste innych osób, niszczenia mienia, niestosowania się do zasad Uniwersytetu Ekonomicznego we Wrocławiu, zakłócania przebiegu Wydarzenia, znajdowania się pod widocznym wpływem alkoholu lub środków odurzających albo stwarzania zagrożenia dla innych Uczestników.",
      },
      {
        t: "Organizator zastrzega sobie prawo do odwołania Wydarzenia z powodu zaistnienia Siły Wyższej. Przez Siłę Wyższą rozumie się zdarzenie zewnętrzne, niemożliwe do przewidzenia i niezależne od Organizatora, któremu nie można było zapobiec przy zachowaniu należytej staranności, w szczególności ekstremalne warunki pogodowe, decyzje organów publicznych, awarie infrastruktury, zagrożenie bezpieczeństwa, stan epidemii, pożar, powódź lub inne zdarzenia uniemożliwiające bezpieczne przeprowadzenie Wydarzenia.",
      },
    ],
  },
  {
    h: "§ 7. Rejestracja audiowizualna i prawa do wizerunku",
    items: [
      {
        t: "Wydarzenie może być filmowane i fotografowane przez Organizatora lub podmioty działające na jego zlecenie, na potrzeby dokumentacyjne, informacyjne, promocyjne i sprawozdawcze.",
      },
      {
        t: "Uczestnik przyjmuje do wiadomości, że jego wizerunek może zostać utrwalony jako element większej całości, jaką stanowi publiczne wydarzenie, publiczność, zgromadzenie lub scena wydarzenia. W takim przypadku rozpowszechnianie wizerunku może nastąpić na podstawie art. 81 ust. 2 pkt 2 ustawy o prawie autorskim i prawach pokrewnych, bez konieczności uzyskiwania odrębnego zezwolenia, jeżeli Uczestnik stanowi jedynie szczegół całości.",
      },
      {
        t: "Jeżeli Uczestnik dobrowolnie udziela wywiadu, wypowiedzi przed kamerą, pozuje do zdjęcia albo w inny sposób świadomie uczestniczy w indywidualnym materiale fotograficznym lub audiowizualnym, może zostać poproszony o udzielenie odrębnego zezwolenia na rozpowszechnianie wizerunku, określającego zakres, cele i pola wykorzystania materiału.",
      },
      {
        t: "Zezwolenie, o którym mowa w ust. 3, może obejmować nieodpłatne wykorzystanie wizerunku przez Organizatora w materiałach informacyjnych, promocyjnych, reklamowych, sprawozdawczych, prasowych, na stronie internetowej oraz w mediach społecznościowych Organizatora, zgodnie z treścią odrębnego oświadczenia Uczestnika.",
      },
      {
        t: "Jeżeli podstawą przetwarzania danych osobowych w postaci wizerunku jest zgoda Uczestnika, Uczestnik ma prawo cofnąć zgodę w dowolnym momencie pisząc na adres dni.adaptacyjne@samorzad.ue.wroc.pl lub iod@ue.wroc.pl, przy czym cofnięcie zgody nie wpływa na zgodność z prawem przetwarzania dokonanego przed jej cofnięciem. W odniesieniu do materiałów już opublikowanych cofnięcie zgody może wymagać oceny technicznych, organizacyjnych i prawnych możliwości ich usunięcia lub ograniczenia dalszego rozpowszechniania.",
      },
      {
        t: "Podczas trwania prelekcji Dni Adaptacyjnych obowiązuje zakaz filmowania i fotografowania przez Uczestników, chyba że Organizator wyraźnie i publicznie zezwoli na taką aktywność. Naruszenie tego zakazu może skutkować zobowiązaniem Uczestnika do zaprzestania naruszeń, usunięcia nagrania lub zdjęcia, a w przypadku naruszeń rażących albo uporczywych - zobowiązaniem do opuszczenia Wydarzenia.",
      },
    ],
  },
  {
    h: "§ 8. Ochrona danych osobowych i wizerunku",
    items: [
      {
        t: "Administratorem danych osobowych Uczestników jest Uniwersytet Ekonomiczny we Wrocławiu z siedzibą we Wrocławiu przy ul. Komandorskiej 118/120, 53-345 Wrocław.",
      },
      {
        t: "Administrator wyznaczył Inspektora Ochrony Danych, z którym można kontaktować się pisemnie na adres siedziby Administratora lub pod adresem e-mail: iod@ue.wroc.pl.",
      },
      {
        t: "Czynności operacyjne związane z organizacją Wydarzenia, w tym obsługę formularzy obecności i bieżącą obsługę danych Uczestników, wykonują osoby działające z upoważnienia Administratora, w szczególności członkowie Grupy Projektowej Dni Adaptacyjne 2026 oraz osoby wspierające organizację Wydarzenia, wyłącznie w zakresie niezbędnym do realizacji powierzonych im zadań.",
      },
      {
        t: "W formularzu obecności Administrator może zbierać dane osobowe obejmujące w szczególności: imię, nazwisko, adres e-mail, numer indeksu.",
      },
      {
        t: "Dane osobowe Uczestników przetwarzane są w następujących celach i na następujących podstawach prawnych:",
        sub: [
          "zawarcie i wykonanie umowy o udział w Wydarzeniu - art. 6 ust. 1 lit. b RODO;",
          "realizacja obowiązków prawnych ciążących na Administratorze, w szczególności obowiązków rachunkowych, podatkowych, dokumentacyjnych lub archiwalnych - art. 6 ust. 1 lit. c RODO;",
          "realizacja prawnie uzasadnionych interesów Administratora, w tym zapewnienie bezpieczeństwa i porządku Wydarzenia, dochodzenie roszczeń lub obrona przed roszczeniami - art. 6 ust. 1 lit. f RODO;",
          "dokumentacja i promocja Organizatora, w zakresie indywidualnego wykorzystania wizerunku Uczestnika, jeżeli wymagana jest zgoda - art. 6 ust. 1 lit. a RODO.",
        ],
      },
      {
        t: "Dane osobowe Uczestników mogą być udostępniane:",
        sub: [
          "podmiotom przetwarzającym dane w imieniu Administratora, w szczególności dostawcom usług IT, operatorom formularzy, podmiotom obsługującym komunikację, ubezpieczycielom, podmiotom świadczącym usługi organizacyjne lub techniczne - wyłącznie w zakresie niezbędnym i na podstawie właściwych podstaw prawnych;",
          "organom publicznym - wyłącznie na podstawie bezwzględnie obowiązujących przepisów prawa;",
          "innym podmiotom zaangażowanym w organizację Wydarzenia - wyłącznie wtedy, gdy jest to niezbędne do realizacji Wydarzenia i istnieje właściwa podstawa prawna.",
        ],
      },
      {
        t: "Dane osobowe przechowywane są przez następujące okresy:",
        sub: [
          "dane związane z wykonaniem umowy - przez czas trwania umowy, a następnie przez okres przedawnienia ewentualnych roszczeń;",
          "dane do celów archiwalnych - zgodnie z obowiązującymi przepisami prawa i regulacjami wewnętrznymi Administratora;",
          "dane przetwarzane na podstawie zgody - do czasu cofnięcia zgody, chyba że istnieje inna podstawa dalszego przetwarzania.",
        ],
      },
      {
        t: "Uczestnikowi przysługują następujące prawa w zakresie ochrony danych osobowych: prawo dostępu do danych, prawo do sprostowania danych, prawo do usunięcia danych w zakresie dopuszczonym przepisami RODO, prawo do ograniczenia przetwarzania, prawo do przenoszenia danych, prawo do sprzeciwu, jeżeli przetwarzanie odbywa się na podstawie prawnie uzasadnionego interesu, oraz prawo do cofnięcia zgody w dowolnym momencie bez wpływu na zgodność z prawem przetwarzania dokonanego przed jej cofnięciem.",
      },
      {
        t: "W przypadku naruszenia przepisów o ochronie danych osobowych Uczestnik ma prawo wniesienia skargi do organu nadzorczego - Prezesa Urzędu Ochrony Danych Osobowych.",
      },
      {
        t: "Podanie danych osobowych jest dobrowolne, lecz niezbędne do uczestnictwa w Wydarzeniu oraz uzyskania obecności w zakresie danych koniecznych do organizacji Wydarzenia. Odmowa podania tych danych uniemożliwia uzyskanie obecności za dni Wydarzenia.",
      },
      {
        t: "Dane osobowe Uczestników nie będą przekazywane do państw trzecich ani organizacji międzynarodowych, chyba że Uczestnik zostanie o tym odrębnie poinformowany zgodnie z RODO.",
      },
      {
        t: "Dane osobowe Uczestników nie będą przetwarzane w sposób zautomatyzowany ani nie będą podlegały profilowaniu.",
      },
    ],
  },
  {
    h: "§ 9. Przepisy końcowe",
    items: [
      {
        t: "Oświadczenie o akceptacji niniejszego Regulaminu stanowi warunek konieczny uczestnictwa w Wydarzeniu.",
      },
      {
        t: "Organizator zastrzega sobie prawo do zmiany postanowień niniejszego Regulaminu w przypadku wystąpienia obiektywnych przesłanek natury prawnej, organizacyjnej, technicznej lub bezpieczeństwa. O każdej zmianie Organizator powiadomi Uczestników drogą elektroniczną z wyprzedzeniem co najmniej 3 dni, chyba że zmiana musi zostać wprowadzona niezwłocznie ze względu na przepisy prawa, bezpieczeństwo albo decyzję właściwych organów.",
      },
      {
        t: "Spory wynikające z niniejszego Regulaminu Strony będą starały się rozwiązać polubownie. W przypadku braku porozumienia spory podlegają rozstrzygnięciu przez sąd właściwy miejscowo i rzeczowo zgodnie z obowiązującymi przepisami prawa polskiego.",
      },
      {
        t: "W sprawach nieuregulowanych zastosowanie mają przepisy prawa polskiego, w szczególności: Kodeks cywilny, ustawa z dnia 30 maja 2014 r. o prawach konsumenta, Rozporządzenie RODO oraz ustawa z dnia 4 lutego 1994 r. o prawie autorskim i prawach pokrewnych.",
      },
      {
        t: "Niniejszy Regulamin wchodzi w życie z dniem jego opublikowania na stronie internetowej https://dni-adaptacyjne.uew.pl/pl.",
      },
    ],
  },
];

const ZALACZNIK = {
  h: "Załącznik nr 1 do Regulaminu Wydarzenia Dni Adaptacyjne 2026",
  p: [
    "Uczestników Imprezy obowiązuje Regulamin cyklicznej imprezy UE Party, dostępny pod adresem: https://drive.google.com/file/d/1cyO-cfO7wQ2_D1PsvPSfW9xEoQqFQhw4/view?usp=sharing",
    "Regulamin Imprezy stanowi integralną część Regulaminu Wydarzenia.",
  ],
};

// Krótka nota dla wersji innych niż polska - wiążąca jest wersja polska.
const LANG_NOTE: Partial<Record<Locale, string>> = {
  en: "Below is the official text of the rules in Polish. The Polish version is the binding one.",
  uk: "Нижче наведено офіційний текст регламенту польською мовою. Обов'язковою є польська версія.",
};

export default async function RulesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const langNote = LANG_NOTE[locale];

  return (
    <div className="mx-auto max-w-3xl px-4 pt-14 sm:px-6 sm:pt-20">
      <h1 className="text-3xl font-extrabold sm:text-5xl">{t("rules.title")}</h1>
      <p className="mt-4 text-ink-soft sm:text-lg">{t("rules.lead")}</p>

      {/* Pobieranie PDF */}
      <a
        href={PDF_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-3 rounded-tile border border-line bg-surface p-4 pr-6 transition-all hover:-translate-y-0.5 hover:border-violet hover:shadow-md sm:p-5 sm:pr-7"
      >
        <span className="grad-brand flex size-11 shrink-0 items-center justify-center rounded-2xl text-white">
          <DownloadSimple size={22} weight="bold" />
        </span>
        <span>
          <span className="block font-bold">{t("rules.docName")}</span>
          <span className="mt-0.5 block text-sm text-ink-soft">
            {t("rules.download")} · PDF
          </span>
        </span>
      </a>

      {langNote ? (
        <div className="mt-6 flex items-start gap-3 rounded-tile bg-gold-soft p-4 sm:p-5">
          <Info size={22} weight="duotone" className="mt-0.5 shrink-0 text-amber" />
          <p className="text-sm font-medium text-ink">{langNote}</p>
        </div>
      ) : null}

      {/* Nagłówek dokumentu */}
      <div className="mt-10 border-b border-line pb-6">
        <h2 className="font-display text-xl font-extrabold sm:text-2xl">
          Regulamin wydarzenia „Dni Adaptacyjne 2026”
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Uniwersytet Ekonomiczny we Wrocławiu · 1-3 października 2026 r.
        </p>
      </div>

      {/* Obowiązek ustawowy */}
      <div className="mt-8 flex items-start gap-4 rounded-tile bg-sky-soft p-6 sm:p-7">
        <Gavel size={28} weight="duotone" className="mt-0.5 shrink-0 text-sky" />
        <div>
          <h3 className="font-bold text-ink">Obowiązek ustawowy</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink sm:text-base">
            {INTRO}
          </p>
        </div>
      </div>

      {/* Paragrafy */}
      <div className="mt-12 space-y-10">
        {PARAGRAFY.map((par) => (
          <section key={par.h}>
            <h2 className="font-display text-lg font-bold sm:text-xl">{par.h}</h2>

            {par.lead?.map((l) => (
              <p
                key={l.slice(0, 24)}
                className="mt-3 text-sm leading-relaxed text-ink-soft sm:text-base"
              >
                {linkify(l)}
              </p>
            ))}

            <ol className="mt-3 space-y-3">
              {par.items.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 shrink-0 text-sm font-bold text-violet tabular-nums">
                    {i + 1}.
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-relaxed text-ink-soft sm:text-base">
                      {linkify(item.t)}
                    </p>
                    {item.sub && item.sub.length > 1 ? (
                      <ol className="mt-2 space-y-2 pl-1">
                        {item.sub.map((s, j) => (
                          <li key={j} className="flex gap-2.5">
                            <span className="mt-0.5 shrink-0 text-sm font-semibold text-ink-soft/70">
                              {String.fromCharCode(97 + j)})
                            </span>
                            <p className="text-sm leading-relaxed text-ink-soft sm:text-base">
                              {linkify(s)}
                            </p>
                          </li>
                        ))}
                      </ol>
                    ) : item.sub && item.sub.length === 1 ? (
                      <p className="mt-2 text-sm leading-relaxed text-ink-soft sm:text-base">
                        {linkify(item.sub[0])}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}

        {/* Załącznik nr 1 */}
        <section className="rounded-tile border border-line bg-surface p-6 sm:p-7">
          <h2 className="font-display text-lg font-bold sm:text-xl">
            {ZALACZNIK.h}
          </h2>
          <div className="mt-3 space-y-3">
            {ZALACZNIK.p.map((p) => (
              <p
                key={p.slice(0, 24)}
                className="text-sm leading-relaxed text-ink-soft sm:text-base"
              >
                {linkify(p)}
              </p>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
