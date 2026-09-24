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

/**
 * Kadr mapy (viewBox) wyśrodkowany na budynku, w proporcji 4:3,
 * przycięty do granic obrazu - żeby na telefonie budynek był czytelny.
 */
export function buildingView(building: string): [number, number, number, number] {
  const rects = CAMPUS_BUILDINGS[building];
  if (!rects) return [0, 0, CAMPUS_MAP.w, CAMPUS_MAP.h];
  const x1 = Math.min(...rects.map((r) => r[0]));
  const y1 = Math.min(...rects.map((r) => r[1]));
  const x2 = Math.max(...rects.map((r) => r[2]));
  const y2 = Math.max(...rects.map((r) => r[3]));
  const w = Math.min(CAMPUS_MAP.w, Math.max(1000, (x2 - x1) * 2.2, (y2 - y1) * 2.2 * (4 / 3)));
  const h = Math.min(CAMPUS_MAP.h, w * 0.75);
  const clamp = (v: number, max: number) => Math.max(0, Math.min(v, max));
  const x = clamp((x1 + x2) / 2 - w / 2, CAMPUS_MAP.w - w);
  const y = clamp((y1 + y2) / 2 - h / 2, CAMPUS_MAP.h - h);
  return [Math.round(x), Math.round(y), Math.round(w), Math.round(h)];
}
