import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  buildPlan,
  buildingOf,
  findLectureRoom,
  findTour,
  picksToQuery,
  queryToPicks,
  sanitizePicks,
  validateScheduleData,
  validateLabels,
  type ScheduleData,
  type ScheduleLabels,
} from "../src/lib/schedule.ts";
import { CAMPUS_BUILDINGS, CAMPUS_MAP, buildingView } from "../src/lib/campusMap.ts";

const json = (p: string) =>
  JSON.parse(readFileSync(new URL(`../${p}`, import.meta.url), "utf8"));

const data: ScheduleData = json("content/schedule-data.json");

test("dane harmonogramu są spójne", () => {
  assert.deepEqual(
    validateScheduleData(data, Object.keys(CAMPUS_BUILDINGS)),
    []
  );
});

for (const locale of ["pl", "en", "uk"]) {
  test(`etykiety ${locale} są kompletne`, () => {
    const labels: ScheduleLabels = json(`content/${locale}/schedule-labels.json`);
    assert.deepEqual(validateLabels(data, labels), []);
  });
}

test("findTour: sala i godzina zbiórki", () => {
  assert.deepEqual(findTour(data, "FIR", 5), { tour: 1, time: "9:00", room: "106 A" });
  assert.deepEqual(findTour(data, "ZIIP", 10), { tour: 3, time: "13:00", room: "1 E" });
  assert.deepEqual(findTour(data, "MA", 1), { tour: 4, time: "15:00", room: "2 E" });
  assert.equal(findTour(data, "FIR", 9), null);
});

test("findLectureRoom: sala prelekcji", () => {
  assert.equal(findLectureRoom(data, 1, "Z", 6), "214 A");
  assert.equal(findLectureRoom(data, 1, "Z", 2), "1+2 P");
  assert.equal(findLectureRoom(data, 1, "Z"), null);
  assert.equal(findLectureRoom(data, 1, "BI"), "3 P");
  assert.equal(findLectureRoom(data, 2, "CTR"), "1 CKU");
  assert.equal(findLectureRoom(data, 2, "NGP"), "401 E");
});

test("buildingOf: budynek z nazwy sali", () => {
  assert.equal(buildingOf("1+2 P"), "P");
  assert.equal(buildingOf("111 CKU"), "CKU");
  assert.equal(buildingOf("113 Z"), "Z");
});

test("buildingView: kadr w granicach mapy i obejmuje cały budynek", () => {
  for (const [b, rects] of Object.entries(CAMPUS_BUILDINGS)) {
    const [x, y, w, h] = buildingView(b);
    assert.ok(x >= 0 && y >= 0 && x + w <= CAMPUS_MAP.w && y + h <= CAMPUS_MAP.h, b);
    for (const [x1, y1, x2, y2] of rects) {
      assert.ok(x1 >= x && y1 >= y && x2 <= x + w && y2 <= y + h, `${b} poza kadrem`);
    }
  }
});

test("sanitizePicks odrzuca nieznane wartości", () => {
  assert.deepEqual(sanitizePicks(data, "full1", { program: "XYZ", group: 2 }), {});
  assert.deepEqual(sanitizePicks(data, "full1", { program: "FIR", group: 99 }), { program: "FIR" });
  assert.deepEqual(sanitizePicks(data, "full1", { program: "EKOB" }), { program: "EKOB", group: 1 });
  assert.deepEqual(sanitizePicks(data, "full2", { program: "CTR", group: 3 }), { program: "CTR" });
  assert.deepEqual(sanitizePicks(data, "full2", { program: "ZIIP" }), {});
  assert.deepEqual(sanitizePicks(data, "part", { online: { level: 2, lang: "en" } }), {
    online: { level: 2, lang: "en" },
  });
  assert.deepEqual(sanitizePicks(data, "part", { online: { level: 3, lang: "en" } }), {});
  assert.deepEqual(sanitizePicks(data, "full1", null), {});
});

test("picksToQuery: adres z wyborem", () => {
  assert.equal(picksToQuery("full1", { program: "FIR", group: 5 }), "tryb=s1&kierunek=FIR&grupa=5");
  assert.equal(picksToQuery("full1", { program: "Z" }), "tryb=s1&kierunek=Z");
  assert.equal(picksToQuery("full2", { program: "CTR" }), "tryb=s2&kierunek=CTR");
  assert.equal(picksToQuery("part", { online: { level: 2, lang: "en" } }), "tryb=ns&stopien=2&jezyk=en");
  assert.equal(picksToQuery("full1", {}), "");
});

test("queryToPicks: wybór z adresu", () => {
  const q = (s: string) => queryToPicks(data, new URLSearchParams(s));
  assert.deepEqual(q("tryb=s1&kierunek=FIR&grupa=5"), { mode: "full1", picks: { program: "FIR", group: 5 } });
  assert.deepEqual(q("tryb=s1&kierunek=fir&grupa=5"), { mode: "full1", picks: { program: "FIR", group: 5 } });
  assert.deepEqual(q("tryb=s2&kierunek=CTR"), { mode: "full2", picks: { program: "CTR" } });
  assert.deepEqual(q("tryb=ns&stopien=1&jezyk=pl"), { mode: "part", picks: { online: { level: 1, lang: "pl" } } });
  assert.deepEqual(q("tryb=s1&kierunek=FIR&grupa=99"), { mode: "full1", picks: { program: "FIR" } });
  assert.deepEqual(q("tryb=s1"), { mode: "full1", picks: {} });
  assert.equal(q("kierunek=FIR"), null);
  assert.equal(q("tryb=xx&kierunek=FIR"), null);
  assert.equal(q(""), null);
  // tam i z powrotem
  for (const [mode, picks] of [
    ["full1", { program: "ZIIP", group: 10 }],
    ["full2", { program: "NGP" }],
    ["part", { online: { level: 2, lang: "pl" } }],
  ] as const) {
    assert.deepEqual(q(picksToQuery(mode, picks)), { mode, picks });
  }
});

const ids = (day: { items: { id: string }[] }) => day.items.map((i) => i.id);

test("buildPlan full1 bez wyboru: ogólny plan", () => {
  const plan = buildPlan(data, "full1", {});
  assert.deepEqual(plan.map((d) => d.date), ["2026-10-01", "2026-10-02"]);
  const tour = plan[0].items[0];
  assert.equal(tour.id, "tour");
  assert.equal(tour.room, undefined);
  assert.equal(tour.needs, "program");
});

test("buildPlan full1 FIR 5", () => {
  const plan = buildPlan(data, "full1", { program: "FIR", group: 5 });
  assert.deepEqual(ids(plan[0]), ["tour", "stands", "attractions", "after"]);
  assert.equal(plan[0].items[0].room, "106 A");
  assert.equal(plan[0].items[0].from, "9:00");
  assert.equal(plan[0].items[0].tour, 1);
  assert.deepEqual(ids(plan[1]), ["lecture", "party"]);
  assert.equal(plan[1].items[0].room, "1 CKU");
});

test("buildPlan full1 AG 2: tura o 15:00 ląduje po standach", () => {
  const plan = buildPlan(data, "full1", { program: "AG", group: 2 });
  assert.deepEqual(ids(plan[0]), ["stands", "attractions", "tour", "after"]);
});

test("buildPlan full1 Z bez grupy: potrzebna grupa", () => {
  const plan = buildPlan(data, "full1", { program: "Z" });
  assert.equal(plan[0].items[0].needs, "group");
  assert.equal(plan[1].items[0].needs, "group");
  const fir = buildPlan(data, "full1", { program: "FIR" });
  assert.equal(fir[1].items[0].room, "1 CKU");
  assert.equal(fir[1].items[0].needs, undefined);
});

test("buildPlan full2 CTR", () => {
  const plan = buildPlan(data, "full2", { program: "CTR" });
  assert.deepEqual(ids(plan[0]), ["lecture", "stands", "attractions", "after"]);
  assert.equal(plan[0].items[0].room, "1 CKU");
  assert.deepEqual(ids(plan[1]), ["classes", "party"]);
});

test("buildPlan part II st. ANG", () => {
  const plan = buildPlan(data, "part", { online: { level: 2, lang: "en" } });
  // sobotnia transmisja (główne wydarzenie) przed piątkową imprezą
  assert.deepEqual(plan.map((d) => d.date), ["2026-10-03", "2026-10-02"]);
  const slots = plan[0].items;
  assert.equal(slots.length, 4);
  assert.deepEqual(
    slots.filter((s) => s.online?.active).map((s) => s.from),
    ["15:50"]
  );
});
