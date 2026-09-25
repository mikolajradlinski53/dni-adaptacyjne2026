import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import type { ScheduleData, ScheduleLabels } from "../src/lib/schedule.ts";
import { buildLlms, buildLlmsFull, type LlmsContext } from "../src/lib/llms.ts";

const json = (p: string) =>
  JSON.parse(readFileSync(new URL(`../${p}`, import.meta.url), "utf8"));
const data: ScheduleData = json("content/schedule-data.json");

const ctx: LlmsContext = {
  siteUrl: "https://dni-adaptacyjne.uew.pl",
  fbEventUrl: "https://fb.me/e/8psHItxw2",
  email: "dni.adaptacyjne@samorzad.ue.wroc.pl",
  data,
  labels: json("content/pl/schedule-labels.json") as ScheduleLabels,
  faq: json("content/pl/faq.json"),
};

test("llms.txt: format i najważniejsze fakty", () => {
  const txt = buildLlms(ctx);
  assert.ok(txt.startsWith("# Dni Adaptacyjne 2026"));
  assert.match(txt, /\n> .+/); // podsumowanie w cytacie
  assert.match(txt, /1-3 października 2026/);
  assert.match(txt, /9:00, 11:00, 13:00, 15:00/);
  assert.match(txt, /Jamaica, ul\. Ruska 51B/);
  assert.match(txt, /\[Harmonogram\]\(https:\/\/dni-adaptacyjne\.uew\.pl\/pl\/harmonogram\)/);
  assert.match(txt, /\/llms-full\.txt/);
  assert.match(txt, /youtube\.com\/live\/nb3SFYyVgpY/);
});

test("llms-full.txt: każda grupa I stopnia z salą i godziną", () => {
  const txt = buildLlmsFull(ctx);
  for (const r of data.tours.rounds) {
    for (const s of r.slots) {
      assert.ok(txt.includes(`${s.program} ${s.group}: sala ${s.room}`), `${s.program} ${s.group}`);
    }
  }
  assert.match(txt, /Zarządzanie \(Z\) \(grupy 5-7\)/);
  assert.match(txt, /Controlling \(CTR\)/);
  assert.match(txt, /Czy udział w Dniach Adaptacyjnych jest obowiązkowy\?/);
});
