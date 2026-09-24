/** Wymiary /images/web/mapa.webp - układ współrzędnych prostokątów poniżej. */
export const CAMPUS_MAP = { src: "/images/web/mapa.webp", w: 2200, h: 1345 };

/** [x1, y1, x2, y2] w pikselach mapy. */
export type Rect = [number, number, number, number];

/**
 * Budynki, w których są sale z harmonogramu. Klucz = ostatni człon nazwy
 * sali ("113 Z" -> "Z"). Budynek P obejmuje na mapie P, P1, P2 i P3.
 */
export const CAMPUS_BUILDINGS: Record<string, Rect[]> = {
  Z: [
    [475, 170, 552, 357],
    [555, 203, 728, 264],
  ],
  A: [
    [693, 460, 838, 539],
    [654, 539, 825, 770],
  ],
  W: [[335, 563, 412, 676]],
  P: [
    [244, 418, 374, 506],
    [262, 506, 341, 550],
    [236, 561, 280, 665],
  ],
  E: [
    [209, 1028, 280, 1113],
    [280, 1012, 380, 1133],
  ],
  CKU: [[1094, 495, 1370, 715]],
};
