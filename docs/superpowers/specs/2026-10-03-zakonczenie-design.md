# Zakończenie strony po wydarzeniu - projekt

Data: 2026-10-03

## Cel

Po Dniach Adaptacyjnych 2026 (1-3.10) strona zamienia się w jedną stronę podsumowania:
podziękowania, partner BNY, Team, zapowiedź galerii, kontakt mailowy. Kod z okresu
wydarzenia zostaje w repo i da się go przywrócić jedną zmianą.

## Przełącznik

`src/lib/zakonczenie.ts`:

```ts
export const WYDARZENIE_ZAKONCZONE = true;
```

Plik bez zależności (importuje go też `next.config.ts`). `false` = strona jak w trakcie wydarzenia.

## Strona główna

`src/app/[locale]/page.tsx`: na początku `HomePage`, gdy przełącznik włączony,
zwraca `<Podsumowanie locale={locale} />`. Stary kod strony głównej pozostaje bez zmian.

`src/components/Podsumowanie.tsx` (server component), sekcje:

1. Hero z podziękowaniami (`aurora` + `HeroDoodles`, jak na stronie głównej):
   plakietka z datą, nagłówek „Dziękujemy!”, akapit podziękowań.
2. Partner: `PartnersShowcase` z partnerami z `content/<locale>/partners.json`
   (BNY, tier strategic) + zdanie z podziękowaniem.
3. Team: `TeamGrid` z `content/<locale>/team.json`.
4. Galeria: kafelek z ikoną aparatu „Zdjęcia z wydarzenia pojawią się wkrótce.”
5. Kontakt: „Masz pytania? Napisz do nas” + link `mailto:` z `CONTACT_EMAIL`.

Teksty w `messages/{pl,en,uk}.json`, nowa sekcja `closing`.

## TeamGrid

`src/components/TeamGrid.tsx` - lista `<ul>` z kafelkami członków Teamu, wydzielona
1:1 z `src/app/[locale]/kontakt/page.tsx`. Strona kontaktu używa komponentu zamiast
własnego markupu (bez zmiany wyglądu).

## Header i Footer

- Header (przełącznik włączony): logo + przełącznik języka. Bez menu głównego,
  mapy, wyszukiwarki i przycisku menu mobilnego. Na telefonie przełącznik języka
  widoczny bezpośrednio w pasku.
- Footer (przełącznik włączony): bez kolumny nawigacji; zostają logo, organizator,
  data/miejsce, e-mail, link do polityki prywatności.

## Przekierowania

`next.config.ts`, `redirects()` gdy przełącznik włączony, `permanent: false` (307):

`/:locale(pl|en|uk)/:path(o-wydarzeniu|harmonogram|partnerzy|linki|faq|kontakt|mapa-kampusu|regulamin)` → `/:locale`

Polityka prywatności zostaje dostępna. Plik `public/docs/regulamin-...pdf` pozostaje.

## E-mail

`CONTACT_EMAIL` = `kontakt@samorzad.ue.wroc.pl`. Treści regulaminu i FAQ
(z adresem `dni.adaptacyjne@`) bez zmian - są niedostępne przez przekierowanie.

## Sitemapa

Przełącznik włączony: tylko `""` i `/polityka-prywatnosci`.

## Poza zakresem

`llms.txt`, `llms-full.txt`, formularz kontaktowy i server action.

## Weryfikacja

`npm test`, `npm run build`, `next start`: strona główna w PL/EN/UK, 307 z podstron,
polityka prywatności 200.
