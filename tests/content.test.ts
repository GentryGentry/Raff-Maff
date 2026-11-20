import { describe, expect, it } from "vitest";
import { ALL_LESSONS, WORLDS } from "@/lib/content";
import { generateAssessment, gradeSet } from "@/lib/engine/assessment";
import { gradeExercise, perfectAnswer } from "@/lib/engine/grading";
import { makeRng } from "@/lib/engine/rng";
import { columnSolution } from "@/lib/engine/gen-helpers";
import type { ConcreteExercise, Template } from "@/lib/engine/types";

const SEEDS = 150;

function check(ex: ConcreteExercise, where: string) {
  const text = JSON.stringify(ex.spec);
  expect(text, where).not.toMatch(/NaN|undefined|Infinity/);
  expect(ex.explanation, where).not.toMatch(/NaN|undefined/);
  if (ex.spec.kind === "mc" && ex.solution.kind === "mc") {
    const opts = ex.spec.options;
    expect(new Set(opts).size, `${where} duplicate options`).toBe(opts.length);
    expect(opts.length, where).toBeGreaterThanOrEqual(2);
    expect(ex.solution.value, where).toBeGreaterThanOrEqual(0);
    expect(ex.solution.value, where).toBeLessThan(opts.length);
  }
  if (ex.solution.kind === "numeric") expect(ex.solution.accept.length, where).toBeGreaterThan(0);
  if (ex.solution.kind === "multifield" && ex.spec.kind === "multifield") expect(ex.solution.values.length).toBe(ex.spec.fields.length);
  if (ex.spec.kind === "numberline" && ex.solution.kind === "numberline") {
    const { min, max, step } = ex.spec;
    const v = ex.solution.value;
    expect(v, `${where} value outside line`).toBeGreaterThanOrEqual(min);
    expect(v, `${where} value outside line`).toBeLessThanOrEqual(max);
    expect(Math.abs((v - min) / step - Math.round((v - min) / step)), `${where} value not on a tick`).toBeLessThan(1e-9);
  }
  // perfect answer must score full, an empty one must not
  const full = gradeExercise(ex, perfectAnswer(ex));
  expect(full.points, `${where} perfect answer not full`).toBe(full.max);
  expect(gradeExercise(ex, undefined).points, where).toBe(0);
}

describe("curriculum structure", () => {
  it("has 13 worlds", () => expect(WORLDS).toHaveLength(13));
  it("every built world has 5–10 lessons", () => {
    for (const w of WORLDS.filter((w) => w.lessons.length)) {
      expect(w.lessons.length).toBeGreaterThanOrEqual(5);
      expect(w.lessons.length).toBeLessThanOrEqual(10);
    }
  });
  it("lesson ids are unique and complete", () => {
    expect(new Set(ALL_LESSONS.map((l) => l.id)).size).toBe(ALL_LESSONS.length);
    for (const l of ALL_LESSONS) {
      expect(l.theory.length, l.id).toBeGreaterThan(0);
      expect(l.worked.length, l.id).toBeGreaterThan(0);
      expect(l.knowledge.length, l.id).toBeGreaterThanOrEqual(3);
      expect(l.method.length, l.id).toBeGreaterThanOrEqual(1);
      expect(l.representation.length, l.id).toBeGreaterThanOrEqual(1);
      expect(l.teacher.scenarios.length, l.id).toBeGreaterThan(0);
      expect(l.pupils.length, l.id).toBeGreaterThan(0);
    }
  });
});

describe("generated exercises are valid", () => {
  for (const lesson of ALL_LESSONS) {
    const groups: [string, Template[]][] = [["knowledge", lesson.knowledge], ["method", lesson.method], ["representation", lesson.representation]];
    for (const [name, tpls] of groups) {
      for (const t of tpls) {
        it(`${lesson.id} ${name} ${t.id}`, () => {
          for (let s = 0; s < SEEDS; s++) for (const level of [1, 2, 3]) {
            const ex = t.gen(makeRng(`t${s}`), { level });
            check(ex, `${lesson.id}/${t.id}/seed${s}/lvl${level}`);
          }
        });
      }
    }
  }
});

describe("assessment pipeline", () => {
  it("is deterministic per seed and graded server-side", () => {
    for (const lesson of ALL_LESSONS) for (const kind of ["knowledge", "method", "representation", "pedagogy"] as const) {
      const a = generateAssessment(lesson.id, kind, "abc");
      const b = generateAssessment(lesson.id, kind, "abc");
      expect(JSON.stringify(a)).toBe(JSON.stringify(b));
      const perfect = gradeSet(kind, a, a.map(perfectAnswer));
      expect(perfect.passed, `${lesson.id} ${kind}`).toBe(true);
      const empty = gradeSet(kind, a, a.map(() => undefined));
      expect(empty.passed).toBe(false);
    }
  });
  it("boss test draws from the whole world", () => {
    const ex = generateAssessment("w1-boss", "boss", "seed1");
    expect(ex).toHaveLength(15);
    const set = gradeSet("boss", ex, ex.map(perfectAnswer));
    expect(set.passed).toBe(true);
  });
  it("80% threshold: 7 of 10 fails, 8 of 10 passes", () => {
    const ex = generateAssessment("w1-l1", "knowledge", "thr");
    const answers = ex.map(perfectAnswer);
    const break_ = (n: number) => answers.map((a, i) => (i < n ? { kind: "numeric" as const, value: "-999" } : a));
    // wrong answers for mc: pick an invalid option
    const wrongify = (n: number) => ex.map((e, i) => (i < n ? (e.spec.kind === "mc" ? { kind: "mc" as const, value: -1 } : e.spec.kind === "multifield" ? { kind: "multifield" as const, values: [] } : { kind: "numeric" as const, value: "-999" }) : perfectAnswer(e)));
    void break_;
    expect(gradeSet("knowledge", ex, wrongify(3)).passed).toBe(false);
    expect(gradeSet("knowledge", ex, wrongify(2)).passed).toBe(true);
  });
  it("text rubric rejects keyword stuffing and empty answers", () => {
    const [ex] = generateAssessment("w1-l1", "pedagogy", "x");
    const stuffed = "platshållare plats position tabell basblock exercise ".repeat(20);
    expect(gradeExercise(ex, { kind: "text", value: stuffed }).correct).toBe(false);
    expect(gradeExercise(ex, { kind: "text", value: "nej" }).correct).toBe(false);
  });
});

describe("column method grading", () => {
  it("computes carries and borrows", () => {
    expect(columnSolution("add", 478, 256)).toEqual({ result: "734", carries: ["1", "1"], partials: [] });
    expect(columnSolution("sub", 5003, 1234).carries).toEqual(["1", "1", "1"]);
    expect(columnSolution("sub", 5003, 1234).result).toBe("3769");
    expect(columnSolution("mul", 23, 14)).toEqual({ result: "322", carries: [], partials: ["92", "230"] });
  });
  it("rewards method separately from result", () => {
    const ex = { spec: { kind: "column", id: "c", skill: "s", prompt: "", op: "add", a: 478, b: 256 }, solution: { kind: "column", ...columnSolution("add", 478, 256) }, explanation: "", hints: [] } as ConcreteExercise;
    const rightResultNoSteps = gradeExercise(ex, { kind: "column", result: "734", carries: ["", ""], partials: [] });
    expect(rightResultNoSteps.points).toBe(1);
    expect(rightResultNoSteps.max).toBe(2);
    const full = gradeExercise(ex, { kind: "column", result: "734", carries: ["1", "1"], partials: [] });
    expect(full.points).toBe(2);
  });
});

import { fromRoman, toRoman } from "@/lib/content/w1/part3";
describe("roman numerals", () => {
  it("round-trips 1..3999 and matches known values", () => {
    for (let n = 1; n <= 3999; n++) expect(fromRoman(toRoman(n))).toBe(n);
    expect(toRoman(1994)).toBe("MCMXCIV");
    expect(toRoman(49)).toBe("XLIX");
    expect(toRoman(4)).toBe("IV");
  });
});
