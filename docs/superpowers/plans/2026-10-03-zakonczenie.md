# Zakończenie strony po wydarzeniu - plan implementacji

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Po Dniach Adaptacyjnych 2026 strona pokazuje tylko podsumowanie (podziękowania, BNY, Team, galeria wkrótce, kontakt), a podstrony przekierowują na stronę główną.

**Architecture:** Jeden przełącznik `WYDARZENIE_ZAKONCZONE` w `src/lib/zakonczenie.ts` steruje stroną główną, Headerem, Footerem, sitemapą i przekierowaniami w `next.config.ts`. Stary kod zostaje w repo i działa po ustawieniu `false`.

**Tech Stack:** Next.js 15 (App Router), next-intl 4, Tailwind 4, @phosphor-icons/react.

Spec: `docs/superpowers/specs/2026-10-03-zakonczenie-design.md`

To głównie zmiany UI/konfiguracji - weryfikacja przez `npm run build` i `next start` + `curl`, nie testy jednostkowe.

---

### Task 1: Przełącznik + e-mail

**Files:**
- Create: `src/lib/zakonczenie.ts`
- Modify: `src/lib/content.ts:74`

- [ ] **Step 1: Utwórz `src/lib/zakonczenie.ts`**

```ts
/**
 * Strona po wydarzeniu. true = zostaje tylko podsumowanie (podziękowania, partner,
 * Team, galeria wkrótce, kontakt), a podstrony przekierowują na stronę główną.
 * false = strona jak w trakcie Dni Adaptacyjnych.
 * Bez zależności - importuje go też next.config.ts.
 */
export const WYDARZENIE_ZAKONCZONE = true;

/** Podstrony wyłączone po wydarzeniu (przekierowanie 307 na /{locale}). */
export const PODSTRONY_WYDARZENIA = [
  "o-wydarzeniu",
  "harmonogram",
  "partnerzy",
  "linki",
  "faq",
  "kontakt",
  "mapa-kampusu",
  "regulamin",
];
```

- [ ] **Step 2: Zmień `CONTACT_EMAIL` w `src/lib/content.ts`**

```ts
export const CONTACT_EMAIL = "kontakt@samorzad.ue.wroc.pl";
```

### Task 2: Przekierowania i sitemapa

**Files:**
- Modify: `next.config.ts`
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: `next.config.ts`**

```ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { PODSTRONY_WYDARZENIA, WYDARZENIE_ZAKONCZONE } from "./src/lib/zakonczenie";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Po wydarzeniu podstrony prowadzą na podsumowanie (307 - da się wycofać).
  // Języki jak w src/i18n/routing.ts.
  async redirects() {
    if (!WYDARZENIE_ZAKONCZONE) return [];
    return [
      {
        source: `/:locale(pl|en|uk)/:path(${PODSTRONY_WYDARZENIA.join("|")})`,
        destination: "/:locale",
        permanent: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
```

- [ ] **Step 2: `src/app/sitemap.ts`** - import przełącznika i w pętli `for (const path of WYDARZENIE_ZAKONCZONE ? ["", "/polityka-prywatnosci"] : STATIC_PATHS)`.

### Task 3: TeamGrid

**Files:**
- Create: `src/components/TeamGrid.tsx`
- Modify: `src/app/[locale]/kontakt/page.tsx:69-117`

- [ ] **Step 1:** Przenieś `<ul>…</ul>` z sekcji Organizatorzy do `TeamGrid({ team }: { team: TeamMember[] })` (bez zmian w markupie, import `User` z `@phosphor-icons/react/dist/ssr`).
- [ ] **Step 2:** W `kontakt/page.tsx` zastąp listę `<TeamGrid team={team} />`, usuń nieużywany import `User`.

### Task 4: Teksty `closing`

**Files:** `messages/pl.json`, `messages/en.json`, `messages/uk.json` - nowa sekcja po `privacy`.

PL:
```json
"closing": {
  "badge": "Dni Adaptacyjne 2026 · 1-3 października",
  "title": "Dziękujemy!",
  "lead": "Dni Adaptacyjne 2026 za nami. Dziękujemy studentkom i studentom pierwszego roku, wolontariuszom, prowadzącym i partnerom - to dzięki Wam te trzy dni były wyjątkowe. Powodzenia na studiach!",
  "partnerTitle": "Partner wydarzenia",
  "partnerLead": "Dziękujemy BNY za wsparcie tegorocznej edycji Dni Adaptacyjnych.",
  "teamTitle": "Poznajcie nasz Team",
  "teamLead": "To my przygotowaliśmy tegoroczne Dni Adaptacyjne.",
  "galleryTitle": "Galeria",
  "galleryBody": "Zdjęcia z wydarzenia pojawią się wkrótce.",
  "contactTitle": "Masz pytania?",
  "contactLead": "Napisz do nas - odpowiemy najszybciej, jak się da."
}
```

EN:
```json
"closing": {
  "badge": "Orientation Days 2026 · 1-3 October",
  "title": "Thank you!",
  "lead": "Orientation Days 2026 are over. Thank you to all first-year students, volunteers, speakers and partners - you made these three days special. Good luck with your studies!",
  "partnerTitle": "Event partner",
  "partnerLead": "Thank you to BNY for supporting this year's Orientation Days.",
  "teamTitle": "Meet our Team",
  "teamLead": "We are the people behind this year's Orientation Days.",
  "galleryTitle": "Gallery",
  "galleryBody": "Photos from the event are coming soon.",
  "contactTitle": "Any questions?",
  "contactLead": "Write to us - we will get back to you as soon as we can."
}
```

UK:
```json
"closing": {
  "badge": "Адаптаційні дні 2026 · 1-3 жовтня",
  "title": "Дякуємо!",
  "lead": "Адаптаційні дні 2026 позаду. Дякуємо студенткам і студентам першого курсу, волонтерам, лекторам і партнерам - саме завдяки вам ці три дні були особливими. Успіхів у навчанні!",
  "partnerTitle": "Партнер заходу",
  "partnerLead": "Дякуємо BNY за підтримку цьогорічних Адаптаційних днів.",
  "teamTitle": "Познайомтеся з нашою командою",
  "teamLead": "Це ми підготували цьогорічні Адаптаційні дні.",
  "galleryTitle": "Галерея",
  "galleryBody": "Фото з заходу з'являться незабаром.",
  "contactTitle": "Маєте запитання?",
  "contactLead": "Напишіть нам - відповімо якнайшвидше."
}
```

### Task 5: Podsumowanie + strona główna

**Files:**
- Create: `src/components/Podsumowanie.tsx`
- Modify: `src/app/[locale]/page.tsx` (początek `HomePage`)

- [ ] **Step 1:** `Podsumowanie({ locale })` - async server component: hero (`aurora` + `HeroDoodles`, plakietka, h1, lead), sekcje Partner (`PartnersShowcase`), Team (`TeamGrid`), Galeria (kafelek z `Camera`), Kontakt (`grad-brand`, `mailto:CONTACT_EMAIL`). Nagłówki sekcji jak na stronie partnerów (h2 + `grad-line`), każda w `Reveal`.
- [ ] **Step 2:** W `HomePage` po `setRequestLocale(locale)`: `if (WYDARZENIE_ZAKONCZONE) return <Podsumowanie locale={locale} />;`

### Task 6: Header i Footer

**Files:** `src/components/Header.tsx`, `src/components/Footer.tsx`

- [ ] **Step 1 (Header):** przy włączonym przełączniku nie renderuj: menu desktop, `SearchOverlay`, przycisku menu, menu mobilnego. Przełącznik języka: `flex` zamiast `hidden sm:flex`.
- [ ] **Step 2 (Footer):** przy włączonym przełączniku nie renderuj kolumny „Na skróty”; siatka `md:grid-cols-[1.7fr_1.1fr]`.

### Task 7: Weryfikacja i commit

- [ ] `npm test` - PASS
- [ ] `npm run build` - bez błędów
- [ ] `npx next start -p 3100`, potem:
  - `curl -sI localhost:3100/pl/harmonogram` → `307`, `location: /pl`
  - `curl -sI localhost:3100/en/faq` → `307`, `location: /en`
  - `curl -s -o /dev/null -w "%{http_code}" localhost:3100/pl/polityka-prywatnosci` → `200`
  - `curl -s localhost:3100/pl` zawiera „Dziękujemy!”, „BNY”, „kontakt@samorzad.ue.wroc.pl”; `/en` „Thank you!”; `/uk` „Дякуємо!”
- [ ] Commit
