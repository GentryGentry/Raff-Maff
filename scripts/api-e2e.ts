/* Runs against a live dev server (npm run dev). Verifies server-authoritative progression. */
import { generateAssessment } from "../src/lib/engine/assessment";
import { perfectAnswer } from "../src/lib/engine/grading";
import { BUILT_WORLDS } from "../src/lib/content";
import type { Answer } from "../src/lib/engine/types";

const BASE = process.env.BASE ?? "http://localhost:3000";
let fails = 0;
const ok = (c: boolean, m: string) => { console.log(`${c ? "PASS" : "FAIL"}  ${m}`); if (!c) fails++; };
async function post(path: string, body: unknown) {
  const r = await fetch(BASE + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return { status: r.status, json: await r.json() };
}
const state = async () => (await fetch(BASE + "/api/state")).json();
const seedOf = (token: string) => JSON.parse(Buffer.from(token.split(".")[0], "base64url").toString());

async function take(lessonId: string, kind: string, mode: "perfect" | "wrong") {
  const s = await post("/api/assessment/start", { lessonId, kind });
  if (s.status !== 200) return { start: s, sub: null };
  const p = seedOf(s.json.token);
  const ex = generateAssessment(p.l, p.k, p.s, { skills: p.sk });
  const answers: Answer[] = ex.map((e) => mode === "perfect" ? perfectAnswer(e) : (e.spec.kind === "mc" ? { kind: "mc", value: -1 } : e.spec.kind === "text" ? { kind: "text", value: "nej" } : e.spec.kind === "multifield" ? { kind: "multifield", values: e.spec.fields.map(() => "999999") } : e.spec.kind === "numberline" ? { kind: "numberline", value: -12345 } : { kind: "numeric", value: "-424242" }));
  const sub = await post("/api/assessment/submit", { token: s.json.token, answers });
  return { start: s, sub, token: s.json.token, answers };
}

(async () => {
  // locked content
  ok((await post("/api/assessment/start", { lessonId: "w1-l2", kind: "knowledge" })).status === 403, "locked lesson cannot start an assessment");
  ok((await post("/api/assessment/start", { lessonId: "w1-l1", kind: "knowledge" })).status === 403, "assessment requires theory first");
  ok((await post("/api/assessment/start", { lessonId: "w1-boss", kind: "boss" })).status === 403, "boss locked until all lessons done");
  const s0 = await state(); ok(s0.profile.xp === 0, "starts at 0 XP");

  // theory
  const t = await post("/api/theory", { lessonId: "w1-l1" });
  ok(t.json.xp === 20, "theory awards 20 XP once");
  ok((await post("/api/theory", { lessonId: "w1-l1" })).json.xp === 0, "theory XP not repeatable");

  // failing doesn't progress
  const bad = await take("w1-l1", "knowledge", "wrong");
  ok(bad.sub?.json.passed === false, "all-wrong knowledge test fails");
  ok((await state()).progress["w1-l1"].sections.knowledge === false, "failed test does not set section");
  ok((await state()).recommendations.length > 0, "failure feeds revision recommendations");
  // replay + forgery
  const replay = await post("/api/assessment/submit", { token: bad.token, answers: bad.answers });
  ok(replay.status === 409, "replaying a submitted token is rejected");
  ok((await post("/api/assessment/submit", { token: bad.token!.slice(0, -3) + "AAA", answers: [] })).status === 400, "forged token rejected");

  // pass all four sections
  for (const k of ["knowledge", "method", "representation"]) {
    const r = await take("w1-l1", k, "perfect");
    ok(r.sub?.json.passed === true, `${k} passes with correct answers (+${r.sub?.json.xp} XP)`);
  }
  let st = await state();
  ok(st.progress["w1-l1"].status !== "completed", "lesson NOT complete without pedagogy section");
  ok(st.unlocked["w1-l2"] === false, "next lesson stays locked");
  const ped = await take("w1-l1", "pedagogy", "perfect");
  ok(ped.sub?.json.passed === true && ped.sub.json.lessonCompleted === true, "pedagogy pass completes lesson");
  st = await state();
  ok(st.unlocked["w1-l2"] === true, "next lesson unlocked by validated rules");
  ok(st.mastery["w1-l1"].level === "completed", "one passed attempt = completed, not mastered");
  const again = await take("w1-l1", "knowledge", "perfect");
  ok(again.sub?.json.xp === 0, "repeating a passed section gives no XP");
  st = await state();
  ok(st.mastery["w1-l1"].level === "completed", "2 passes but recent average still < 80% (earlier fail counts) => not yet mastered");
  await take("w1-l1", "knowledge", "perfect");
  st = await state();
  ok(st.mastery["w1-l1"].level === "mastered", "3 recent passing attempts => mastered");
  ok(st.profile.xp === 20 + 40 + 30 + 30 + 40 + 50 + (st.achievements.filter((a: any) => a.unlockedAt).reduce((s: number, a: any) => s + a.xp, 0)), `XP ledger consistent (${st.profile.xp})`);
  ok(st.profile.streak === 1, "streak started");

  // practice cannot unlock anything and XP is capped
  const pr = await post("/api/practice", { lessonId: "w1-l2", results: Array.from({ length: 30 }, () => ({ skill: "w1-l2.read-write", correct: true })) });
  ok(pr.status === 200 && pr.json.xp <= 20, "practice XP capped per lesson");
  ok((await post("/api/practice", { lessonId: "w1-l5", results: [] })).status === 403, "practice on locked lesson refused");
  ok((await state()).unlocked["w1-l3"] === false, "practice cannot unlock lessons");

  // revision
  const rev = await post("/api/assessment/start", { lessonId: "", kind: "revision" });
  ok(rev.status === 200 || rev.status === 409, `revision start responds (${rev.status})`);

  // tutor unavailable without key
  ok((await post("/api/tutor", { messages: [{ role: "user", content: "hej" }] })).status === 503, "tutor reports unconfigured AI gracefully");

  // full playthrough of every built world
  for (const w of BUILT_WORLDS) {
    ok((await state()).worlds[w.id].unlocked, `${w.id} is unlocked when reached`);
    for (const l of w.lessons) {
      await post("/api/theory", { lessonId: l.id });
      for (const k of ["knowledge", "method", "representation", "pedagogy"]) {
        const r = await take(l.id, k, "perfect");
        if (!r.sub?.json.passed) ok(false, `${l.id} ${k} should pass: ${JSON.stringify(r.start.json.error ?? r.sub?.json).slice(0, 150)}`);
      }
    }
    const st2 = await state();
    ok(w.lessons.every((l) => st2.progress[l.id]?.status === "completed"), `${w.id}: all ${w.lessons.length} lessons completed via validated assessments`);
    ok(st2.worlds[w.id].bossUnlocked, `${w.id}: boss unlocked after all lessons`);
    const bossBad = await take(`${w.id}-boss`, "boss", "wrong");
    ok(bossBad.sub?.json.passed === false, `${w.id}: boss fails with wrong answers`);
    const boss = await take(`${w.id}-boss`, "boss", "perfect");
    ok(boss.sub?.json.passed === true && boss.sub.json.bossPassed, `${w.id}: boss passed (+${boss.sub?.json.xp} XP)`);
  }
  const fin = await state();
  console.log("Final XP", fin.profile.xp, "level", fin.level.level, fin.level.rank, "completion", Math.round(fin.completion * 100) + "%");
  console.log(fails ? `\n${fails} FAILED` : "\nAll API checks passed");
  process.exit(fails ? 1 : 0);
})();
