# Harmonogram per kierunek i grupa: plan implementacji

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/harmonogram` pokazuje osobisty plan: tryb → kierunek → grupa → godziny i sale, z mapą budynku i zwiniętym pełnym rozkładem, w PL/EN/UK.

**Architecture:** Dane bez tekstów w `content/schedule-data.json` i etykiety per język w `content/{pl,en,uk}/schedule-labels.json`. Czyste funkcje w `src/lib/schedule.ts` (budowanie planu i walidacja) testowane `node --test` (Node 24 sam obsługuje TS). Komponenty klienckie: picker, oś dnia, dialog mapy, pełny rozkład.

**Tech Stack:** Next 15 (app router), next-intl, React 19, Tailwind 4, motion, @phosphor-icons/react, node:test.

Spec: `docs/superpowers/specs/2026-09-24-harmonogram-design.md`

---

## Struktura plików

| Plik | Odpowiedzialność |
|---|---|
| `content/schedule-data.json` (nowy) | kierunki, tury, sale prelekcji, punkty ogólne, sloty YT |
| `content/{pl,en,uk}/schedule-labels.json` (nowe) | nazwy dni, kierunków, tytuły/opisy punktów |
| `src/lib/schedule.ts` (nowy) | typy + `buildPlan`, `findTour`, `findLectureRoom`, `buildingOf`, `validateScheduleData` |
| `src/lib/campusMap.ts` (nowy) | prostokąty budynków w układzie `mapa.webp` (2200×1345) |
| `tests/schedule.test.ts` (nowy) | testy logiki + spójność danych i etykiet |
| `src/components/schedule/ProgramPicker.tsx` (nowy) | wyszukiwarka kierunków, grupy, wybór slotu online |
| `src/components/schedule/RoomButton.tsx` (nowy) | przycisk sali + dialog z mapą |
| `src/components/schedule/FullSchedule.tsx` (nowy) | zwinięty pełny rozkład |
| `src/components/schedule/usePicks.ts` (nowy) | wybór kierunku/grupy/slotu per tryb, localStorage |
| `src/components/ScheduleTimeline.tsx` (przebudowa) | składa całość, oś dnia |
| `src/lib/content.ts` | `getScheduleData`, `getScheduleLabels`; usunięcie `ScheduleEntry`/`getSchedule` |
| `src/app/[locale]/harmonogram/page.tsx` | nowe propsy |
| `messages/{pl,en,uk}.json` | nowe klucze `schedule.*` |
| `content/{pl,en,uk}/modes.json` | godziny w skrótach trybów |
| `content/{pl,en,uk}/schedule.json` | usunięte |
| `tsconfig.json`, `package.json` | wykluczenie `tests/`, skrypt `test` |

## Task 1: Dane + logika + testy (TDD)

- [ ] Dodaj `"test": "node --test tests/"` do `package.json` i `"tests"` do `exclude` w `tsconfig.json` (test importuje `.ts` z rozszerzeniem, czego tsc Nexta nie przepuszcza).
- [ ] Napisz `tests/schedule.test.ts`:
  - spójność: każda para kierunek+grupa I st. występuje w turach dokładnie raz; liczba grup w `programs` = liczba grup w turach; każdy kierunek I i II st. ma salę prelekcji (dla Z: każda grupa); każdy budynek sali ma prostokąty w `campusMap`; każdy kod kierunku i `id` punktu ma etykietę w pl/en/uk;
  - `findTour("FIR", 5)` → `{ tour: 1, time: "9:00", room: "106 A" }`; `findTour("ZIIP", 10)` → tura 3, `1 E`; `findTour("MA", 1)` → tura 4, `2 E`;
  - `findLectureRoom(1,"Z",6)` → `214 A`, `(1,"Z",2)` → `1+2 P`, `(1,"Z",undefined)` → `null`, `(1,"BI")` → `3 P`, `(2,"CTR")` → `1 CKU`, `(2,"NGP")` → `401 E`;
  - `buildingOf("1+2 P")` → `P`, `buildingOf("111 CKU")` → `CKU`;
  - `buildPlan` full1 bez wyboru: 2 dni, czwartek zaczyna się od `tour` bez sali; full1 FIR 5: czwartek `tour` 9:00 106 A, piątek `lecture` 1 CKU i `party`; full2 CTR: czwartek `lecture` 1 CKU + `stands/attractions/after`, piątek `classes` + `party`; part {2,"en"}: sobota z 4 slotami, aktywny tylko `15:50`.
- [ ] `npm test` → FAIL (brak modułu).
- [ ] Napisz `content/schedule-data.json` (transkrypcja ze specu), `src/lib/campusMap.ts`, `src/lib/schedule.ts`, etykiety w 3 językach.
- [ ] `npm test` → PASS. Commit.

Kluczowe typy (`src/lib/schedule.ts`):

```ts
export type Level = 1 | 2;
export type OnlinePick = { level: Level; lang: "pl" | "en" };
export type Picks = { program?: string; group?: number; online?: OnlinePick };
export type ItemId = "tour" | "lecture" | "stands" | "attractions" | "after" | "classes" | "party" | "online";
export type PlanItem = {
  id: ItemId; from?: string; to?: string; room?: string; tour?: number;
  highlight?: boolean; needs?: "program" | "group";
  online?: OnlinePick & { href?: string; active: boolean };
};
export type PlanDay = { date: string; items: PlanItem[] };
```

## Task 2: Stan wyboru + picker

- [ ] `usePicks(mode)`: `{ picks, setPicks }`, obiekt per tryb w localStorage `da2026-schedule-picks` (try/catch), odczyt w `useEffect`, walidacja przez `sanitizePicks` z `schedule.ts` (nieznany kierunek/grupa → odrzucone; kierunek z 1 grupą → grupa 1).
- [ ] `ProgramPicker`: input (filtr po akronimie i nazwie, bez polskich znaków), kafelki `role="radio"` w `role="radiogroup"`, po wyborze zwinięty wiersz „FIR · Finanse i rachunkowość · Zmień”, rząd grup 1…N. Dla `part`: dwa przełączniki (stopień, język). Link do `/kontakt`.

## Task 3: Sala z mapą

- [ ] `RoomButton` (przycisk z ikoną MapPin), dialog w portalu: `role="dialog"`, `aria-modal`, Escape i klik w tło zamykają, fokus na przycisk zamknięcia, po zamknięciu powrót fokusu, blokada scrolla body (jak `SearchOverlay`). Mapa `<img>` + `<svg viewBox="0 0 2200 1345">` z prostokątami budynku (wypełnienie `violet`, pulsujący obrys wyłączany przy `prefers-reduced-motion`). Link „Otwórz mapę kampusu” → `/mapa-kampusu`.

## Task 4: Oś dnia + pełny rozkład + strona

- [ ] `ScheduleTimeline`: ModeSwitcher → ProgramPicker → dni z `buildPlan`. Karta: godzina (od–do), tytuł, sala (`RoomButton`), opis; `needs` → wskazówka „wybierzcie kierunek/grupę”; `party` wyróżniona z adresem i linkiem do Google Maps; `online` z aktywnym slotem wyróżnionym.
- [ ] `FullSchedule` (`<details>`): full1 = 4 tury jako siatka kafelków „FIR 5 · 106 A” (wybrany kierunek podświetlony, wybrana grupa mocniej) + tabela sal prelekcji; full2 = tabela sal; part = brak.
- [ ] `page.tsx` + `content.ts`: nowe loadery, usunięcie starych; `messages/*` nowe klucze i nowa notka; `modes.json` z godzinami; usunięcie `schedule.json`.
- [ ] `npm test`, `npx tsc --noEmit`, `npm run build`. Commit.

## Task 5: Weryfikacja w przeglądarce

- [ ] `npm run dev`, sprawdzenie: FIR 5, Z 6, ZIIP 10, MA 1, II st. CTR, niestacjonarne II st. ANG; szerokość 375 px; dialog z klawiatury; przełączanie trybów zachowuje wybór per tryb; wersje /en i /uk.
