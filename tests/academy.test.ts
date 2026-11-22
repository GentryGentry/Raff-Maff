import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { ALL_LESSONS, getLesson } from "@/lib/content";
import { academyVariants, generateAssessment, pupilExercise, variantOf } from "@/lib/engine/assessment";
import { gradeExercise, gradeRubric, perfectAnswer } from "@/lib/engine/grading";
import { isRepeatable, recommend } from "@/lib/engine/revision";
import { weakSkills } from "@/lib/engine/mastery";
import type { ConcreteExercise, ItemResult } from "@/lib/engine/types";

describe("Lärarakademin: varianter", () => {
  it("variant 0 is the lesson's teacher task, variant k is pupil case k, and out-of-range falls back", () => {
    for (const l of ALL_LESSONS) {
      const a = generateAssessment(l.id, "academy", "s~v0")[0];
      expect(a.spec.id, l.id).toBe(`teacher-${l.id}`);
      l.pupils.forEach((p, i) => {
        const b = generateAssessment(l.id, "academy", `s~v${i + 1}`)[0];
        expect(b.spec.id).toBe(`pupil-${l.id}-${i}`);
        expect(b.spec.kind === "text" && b.spec.scenario).toContain(p.said);
        expect(b.solution.kind === "text" && b.solution.rubric.aiOnly).toBe(true);
        expect(b.solution.kind === "text" && b.solution.modelAnswer).toBe(p.response);
      });
      expect(generateAssessment(l.id, "academy", "s~v9")[0].spec.id).toBe(`teacher-${l.id}`);
      expect(generateAssessment(l.id, "academy", "plain")[0].spec.id).toBe(`teacher-${l.id}`);
    }
    expect(variantOf("abc~v3")).toBe(3);
    expect(variantOf("abc")).toBe(0);
  });
  it("without AI only the teacher task is offered", () => {
    for (const l of ALL_LESSONS) { expect(academyVariants(l, false)).toBe(1); expect(academyVariants(l, true)).toBe(1 + l.pupils.length); }
  });
  it("the lesson's own pedagogy step is always the teacher task (never a pupil case)", () => {
    for (const l of ALL_LESSONS) expect(generateAssessment(l.id, "pedagogy", "x~v1")[0].spec.id).toBe(`teacher-${l.id}`);
  });
  it("pupil cases can never pass by keywords alone (AI only) and short answers fail the guards", () => {
    const l = getLesson("w5-l1")!;
    const ex = pupilExercise(l, 0, "x");
    expect(gradeExercise(ex, perfectAnswer(ex)).correct).toBe(false);
    if (ex.solution.kind !== "text") throw new Error();
    expect(gradeRubric("kort", ex.solution.rubric, 120).guardsOk).toBe(false);
    const decent = "Jag skulle rita en bråkcirkel och dela den i lika stora bitar tillsammans med eleven, så att eleven ser vad nämnaren betyder. Sedan låter jag eleven själv färglägga några delar.";
    expect(gradeRubric(decent, ex.solution.rubric, 120).guardsOk).toBe(true);
  });
});

describe("Facit för förklaringar läcker inte", () => {
  it("a failed explanation shows neither the model answer nor the explanation; a passed one shows the model answer", async () => {
    const { publicItem } = await import("@/lib/server/actions");
    for (const l of ALL_LESSONS) {
      const ex = generateAssessment(l.id, "pedagogy", "s")[0];
      if (ex.solution.kind !== "text") throw new Error();
      const base: ItemResult = { id: "x", skill: "s", kind: "text", points: 0, max: 1, correct: false, feedback: "nej", correctAnswerText: ex.solution.modelAnswer };
      const failed = publicItem(base, ex);
      expect(JSON.stringify(failed), l.id).not.toContain(ex.solution.modelAnswer.slice(0, 40));
      expect(failed.explanation).toBe("");
      const passed = publicItem({ ...base, correct: true, points: 1 }, ex);
      expect(passed.correctAnswerText).toBe(ex.solution.modelAnswer);
    }
    const mc = { spec: { kind: "mc", id: "1", skill: "s", prompt: "p", options: ["a", "b"] }, solution: { kind: "mc", value: 0 }, explanation: "varför", hints: [] } as ConcreteExercise;
    expect(publicItem({ id: "1", skill: "s", kind: "mc", points: 0, max: 1, correct: false, feedback: "", correctAnswerText: "a" }, mc)).toMatchObject({ explanation: "varför", correctAnswerText: "a" });
  });
});

describe("Förklaringsuppgifter hamnar inte i repetitionen", () => {
  it("pedagogy and pupil skills are not repeatable and never recommended", () => {
    expect(isRepeatable("w1-l1.pedagogy")).toBe(false);
    expect(isRepeatable("w1-l1.pupil")).toBe(false);
    expect(isRepeatable("w1-l1.place")).toBe(true);
    const past = new Date(Date.now() - 86400000).toISOString();
    const recs = recommend({ progress: [], attempts: [], stats: [], revision: [{ user_id: "u", lesson_id: "w1-l1", skill: "w1-l1.pedagogy", due_at: past, stage: 0, times_wrong: 3, resolved: false, last_wrong_at: past } as never] });
    expect(recs).toEqual([]);
    expect(weakSkills([{ user_id: "u", skill: "w1-l1.pedagogy", lesson_id: "w1-l1", correct: 0, wrong: 9, last_practiced: past }])).toEqual([]);
    expect(weakSkills([{ user_id: "u", skill: "w1-l1.place", lesson_id: "w1-l1", correct: 0, wrong: 9, last_practiced: past }])).toHaveLength(1);
  });
});

describe("Lärarakademin: varierar mellan försök (hela flödet mot dev-lagret)", () => {
  const dir = `/tmp/rm-academy-${process.pid}`;
  beforeAll(() => { process.env.DEV_STORE_PATH = `${dir}/store.json`; process.env.ASSESSMENT_SECRET = "academy-test"; process.env.OPENAI_API_KEY = "sk-test-not-real"; vi.resetModules(); });
  afterAll(() => { delete process.env.OPENAI_API_KEY; delete process.env.DEV_STORE_PATH; });
  it("rotates between the teacher task and the pupil cases, never the same twice in a row", async () => {
    const { devStore } = await import("@/lib/server/devstore");
    const A = await import("@/lib/server/actions");
    const u = "00000000-0000-4000-8000-000000000009";
    await A.completeTheory(devStore, u, "w1-l1");
    const seen: string[] = [];
    for (let i = 0; i < 10; i++) {
      const s = await A.startAssessment(devStore, u, "w1-l1", "academy");
      seen.push(s.exercises[0].id);
      await A.submitAssessment(devStore, u, s.token, [{ kind: "text", value: "x" }]); // för kort: AI anropas inte
    }
    expect(new Set(seen).size).toBe(academyVariants(getLesson("w1-l1")!, true));
    for (let i = 1; i < seen.length; i++) expect(seen[i], `try ${i}`).not.toBe(seen[i - 1]);
  });
  it("without AI the same lesson only ever gives the teacher task", async () => {
    delete process.env.OPENAI_API_KEY;
    const { devStore } = await import("@/lib/server/devstore");
    const A = await import("@/lib/server/actions");
    const u = "00000000-0000-4000-8000-000000000009";
    for (let i = 0; i < 4; i++) expect((await A.startAssessment(devStore, u, "w1-l1", "academy")).exercises[0].id).toBe("teacher-w1-l1");
  });
});
