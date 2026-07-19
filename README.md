# Dni Adaptacyjne 2026 — dni.adaptacyjne.uew.pl

Strona obowiązkowych Dni Adaptacyjnych UEW (1–3.10.2026). Next.js 15 (App Router) + TypeScript + Tailwind v4 + next-intl (PL / EN / UK).

## Start

```bash
npm install
npm run dev      # http://localhost:3000 → przekierowanie na /pl
npm run build    # weryfikacja produkcyjna
```

## Gdzie co edytować

| Co | Gdzie |
|---|---|
| Teksty interfejsu (nagłówki, przyciski) | `messages/{pl,en,uk}.json` |
| Harmonogram, linki, FAQ, team, newsy, partnerzy | `content/{pl,en,uk}/*.json` |
| Kolory / gradient (po dostarczeniu logo) | `src/app/globals.css` → blok `@theme` |
| Data startu licznika, e-mail kontaktowy | `src/lib/content.ts` |
| Domena produkcyjna (SEO) | `src/lib/seo.ts` |

Newsy: dodaj obiekt do `content/*/news.json` (we wszystkich 3 językach, ten sam `slug`). Strona wpisu generuje się automatycznie.

Regulamin PDF: wrzuć plik do `public/docs/` i podmień placeholder w `src/app/[locale]/regulamin/page.tsx` (komentarz w kodzie pokazuje jak).

## Deploy (Vercel)

1. Repo → Vercel → import (zero konfiguracji, framework wykryje się sam).
2. W panelu domen dodaj `dni.adaptacyjne.uew.pl`, a u Działu IT UEW zamów rekord CNAME wskazujący na `cname.vercel-dns.com`.
3. Sitemap: `https://dni.adaptacyjne.uew.pl/sitemap.xml` → zgłoś w Google Search Console.

## Do uzupełnienia przed startem (checklist z dokumentacji)

- [ ] Linki do wydarzeń FB (DA + UE Party) → `messages` sekcja `home` / `content/*/links.json`
- [ ] PDF regulaminu → `public/docs/`
- [ ] Logo DA → header/footer + finalna paleta w `globals.css`
- [ ] Dane organizatorów (imiona, telefony, zdjęcia) → `content/*/team.json`
- [ ] Logotypy partnerów → `content/*/partners.json` + pliki w `public/images/`
- [ ] Weryfikacja adresów: USOSweb, Eportal, ankiety, plan zajęć
- [ ] Mapa kampusu (grafika/interaktywna) → `mapa-kampusu/page.tsx`
- [ ] Godziny i sale w `content/*/schedule.json` (obecnie robocze)
