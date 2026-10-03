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
