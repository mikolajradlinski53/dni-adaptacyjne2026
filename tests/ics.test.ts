import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildPlan, buildingOf, type ScheduleData, type ScheduleLabels } from "../src/lib/schedule.ts";
import { icsDate, planToEvents, toIcs, type CalText } from "../src/lib/ics.ts";

const json = (p: string) =>
  JSON.parse(readFileSync(new URL(`../${p}`, import.meta.url), "utf8"));
const data: ScheduleData = json("content/schedule-data.json");
const labels: ScheduleLabels = json("content/pl/schedule-labels.json");

const text: CalText = {
  room: (room) => `Sala ${room} (budynek ${buildingOf(room)})`,
  campus: "UEW, ul. Komandorska 118/120, Wrocław",
  online: (level, lang) => `${level} st. ${lang}`,
};

test("icsDate: czas polski (CEST) -> UTC", () => {
  assert.equal(icsDate(new Date("2026-10-01T09:00:00+02:00")), "20261001T070000Z");
});

test("planToEvents FIR 5: 6 wydarzeń, sala zbiórki w lokalizacji", () => {
  const ev = planToEvents(buildPlan(data, "full1", { program: "FIR", group: 5 }), labels, "full1", text);
  assert.equal(ev.length, 6);
  const tour = ev.find((e) => e.uid.includes("tour"))!;
  assert.match(tour.title, /Droga przez kampus/);
  assert.match(tour.location!, /Sala 106 A \(budynek A\)/);
  assert.equal(tour.start.toISOString(), "2026-10-01T07:00:00.000Z");
  assert.equal(tour.end.toISOString(), "2026-10-01T08:00:00.000Z");
  const party = ev.find((e) => e.uid.includes("party"))!;
  assert.equal(party.end.toISOString(), "2026-10-03T00:00:00.000Z");
  assert.match(party.location!, /Ruska 51B/);
  const stands = ev.find((e) => e.uid.includes("stands"))!;
  assert.equal(stands.end.toISOString(), "2026-10-01T16:00:00.000Z");
});

test("planToEvents pomija punkty bez wybranej sali", () => {
  const ev = planToEvents(buildPlan(data, "full1", {}), labels, "full1", text);
  assert.deepEqual(ev.map((e) => e.uid.split("-")[3]), ["stands", "attractions", "after", "party"]);
});

test("planToEvents niestacjonarne: tylko własny slot + impreza", () => {
  const ev = planToEvents(
    buildPlan(data, "part", { online: { level: 2, lang: "en" } }),
    labels,
    "part",
    text
  );
  assert.equal(ev.length, 2);
  assert.match(ev[0].title, /2 st\. en/);
  assert.equal(ev[0].start.toISOString(), "2026-10-03T13:50:00.000Z");
});

test("toIcs: poprawny format RFC 5545", () => {
  const ev = planToEvents(buildPlan(data, "full1", { program: "FIR", group: 5 }), labels, "full1", text);
  const ics = toIcs(ev, { name: "Dni Adaptacyjne 2026", now: new Date("2026-09-24T12:00:00Z") });
  assert.ok(ics.startsWith("BEGIN:VCALENDAR\r\n"));
  assert.ok(ics.endsWith("END:VCALENDAR\r\n"));
  assert.equal(ics.split("BEGIN:VEVENT").length - 1, 6);
  assert.match(ics, /DTSTART:20261001T070000Z/);
  assert.match(ics, /DTSTAMP:20260924T120000Z/);
  assert.match(ics, /BEGIN:VALARM/);
  // przecinki i średniki escapowane
  assert.match(ics, /Komandorska 118\/120\\, Wrocław/);
  // żadna linia nie przekracza 75 bajtów
  for (const line of ics.split("\r\n")) {
    assert.ok(Buffer.byteLength(line, "utf8") <= 75, line);
  }
});

test("toIcs: zawijanie nie rozcina polskich znaków", () => {
  const long = "Zażółć gęślą jaźń ".repeat(10);
  const ics = toIcs(
    [{ uid: "x", start: new Date(0), end: new Date(3600e3), title: long }],
    { name: "t", now: new Date(0) }
  );
  const unfolded = ics.replace(/\r\n /g, "");
  assert.ok(unfolded.includes(`SUMMARY:${long.trim()}`) || unfolded.includes(`SUMMARY:${long}`));
});
