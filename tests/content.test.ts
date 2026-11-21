import { describe, expect, it } from "vitest";
import { ALL_LESSONS, WORLDS } from "@/lib/content";
import { generateAssessment, gradeSet } from "@/lib/engine/assessment";
import { gradeExercise, perfectAnswer } from "@/lib/engine/grading";
import { makeRng } from "@/lib/engine/rng";
import { columnSolution, longdivSolution, longdivEx } from "@/lib/engine/gen-helpers";
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

describe("long division (liggande stolen)", () => {
  it("solves digit by digit", () => {
    expect(longdivSolution(534, 3)).toMatchObject({ q: ["1", "7", "8"], prod: ["3", "21", "24"], rem: ["2", "2", "0"], quotient: 178, remainder: 0 });
    expect(longdivSolution(749, 4)).toMatchObject({ q: ["1", "8", "7"], prod: ["4", "32", "28"], rem: ["3", "2", "1"], quotient: 187, remainder: 1 });
    expect(longdivSolution(138, 6)).toMatchObject({ q: ["2", "3"], prod: ["12", "18"], rem: ["1", "0"], p0: 1 });
  });
  it("quotient digits always equal floor(a/b) and remainders are < b (exhaustive)", () => {
    for (let b = 2; b <= 9; b++) for (let a = b; a <= 9999; a += 7) {
      const s = longdivSolution(a, b);
      expect(Number(s.q.join(""))).toBe(Math.floor(a / b));
      expect(Number(s.rem[s.rem.length - 1])).toBe(a % b);
      s.rem.forEach((r) => expect(Number(r)).toBeLessThan(b));
    }
  });
  it("grades result and method separately", () => {
    const ex = longdivEx("t", "s", 749, 4, "", []);
    const full = gradeExercise(ex, perfectAnswer(ex));
    expect(full.points).toBe(2);
    const noSteps = gradeExercise(ex, { kind: "longdiv", q: ["1", "8", "7"], prod: ["", "", ""], rem: ["", "", "1"] });
    expect(noSteps.points).toBe(1); expect(noSteps.methodOk).toBe(false);
    const wrongQ = gradeExercise(ex, { kind: "longdiv", q: ["1", "8", "6"], prod: ["4", "32", "28"], rem: ["3", "2", "1"] });
    expect(wrongQ.points).toBe(1);
  });
});

// ── Independent check of percent exercises: re-derive each answer from the PROMPT TEXT with exact rational arithmetic ──
import { getLesson } from "@/lib/content";
describe("percent exercises agree with their own prompts (independent exact arithmetic)", () => {
  const num = (s: string) => Number(s.replace(/[\s ]/g, "").replace(",", "."));
  const gen = (lessonId: string, tplId: string, seed: number, level = 1) => {
    const lesson = getLesson(lessonId)!;
    const t = [...lesson.knowledge, ...lesson.method, ...lesson.representation].find((x) => x.id === tplId)!;
    return t.gen(makeRng(`ind${seed}`), { level });
  };
  const answerOf = (ex: ConcreteExercise) => (ex.solution.kind === "numeric" ? Number(ex.solution.accept[0].replace(",", ".")) : NaN);
  const cases: { lesson: string; tpl: string; re: RegExp; calc: (m: RegExpMatchArray) => number }[] = [
    { lesson: "w7-l4", tpl: "pctOfN", re: /^([\d,]+) % av ([\d\s ]+) = \?$/, calc: (m) => (num(m[1]) * num(m[2])) / 100 },
    { lesson: "w7-l4", tpl: "over100", re: /^([\d]+) % av ([\d]+) = \?$/, calc: (m) => (num(m[1]) * num(m[2])) / 100 },
    { lesson: "w7-l3", tpl: "tenPct", re: /^10 % av ([\d\s ]+) = \?$/, calc: (m) => num(m[1]) / 10 },
    { lesson: "w7-l3", tpl: "half", re: /^50 % av ([\d\s ]+) = \?$/, calc: (m) => num(m[1]) / 2 },
    { lesson: "w7-l3", tpl: "five", re: /^5 % av ([\d\s ]+) = \?$/, calc: (m) => (5 * num(m[1])) / 100 },
    { lesson: "w7-l3", tpl: "one", re: /^1 % av ([\d\s ]+) = \?$/, calc: (m) => num(m[1]) / 100 },
    { lesson: "w7-l6", tpl: "pctOfWhole", re: /^Hur många procent är ([\d\s ]+) av ([\d\s ]+)\?$/, calc: (m) => (num(m[1]) * 100) / num(m[2]) },
    { lesson: "w7-l7", tpl: "wholeHard", re: /^([\d]+) % av ett tal är ([\d\s ]+)\. Vilket är talet\?$/, calc: (m) => (num(m[2]) * 100) / num(m[1]) },
    { lesson: "w7-l7", tpl: "wholeSimple", re: /^([\d]+) % av ett tal är ([\d\s ]+)\. Vilket är talet\?$/, calc: (m) => (num(m[2]) * 100) / num(m[1]) },
    { lesson: "w7-l8", tpl: "newPrice", re: /^En vara kostar ([\d\s ]+) kr och sänks med ([\d]+) %\. Vad kostar den nu\?$/, calc: (m) => num(m[1]) - (num(m[2]) * num(m[1])) / 100 },
    { lesson: "w7-l8", tpl: "increase", re: /^Ett pris på ([\d\s ]+) kr höjs med ([\d]+) %\. Vad är det nya priset\?$/, calc: (m) => num(m[1]) + (num(m[2]) * num(m[1])) / 100 },
    { lesson: "w7-l10", tpl: "interest", re: /^Räntan är ([\d]+) % per år på ([\d\s ]+) kr\. Hur stor är räntan efter ett år\?$/, calc: (m) => (num(m[1]) * num(m[2])) / 100 },
    { lesson: "w7-l10", tpl: "vat", re: /^En vara kostar ([\d]+) kr utan moms\. Moms är 25 %\. Vad kostar den med moms\?$/, calc: (m) => num(m[1]) * 1.25 },
    { lesson: "w7-l5", tpl: "wholeFrom", re: /^([\d]+) % av ett tal är ([\d]+)\. Vilket är talet\?$/, calc: (m) => (num(m[2]) * 100) / num(m[1]) },
    { lesson: "w6-l8", tpl: "mulInt", re: /^([\d,]+) · ([\d]+) = \?$/, calc: (m) => Math.round(num(m[1]) * num(m[2]) * 1000) / 1000 },
    { lesson: "w6-l6", tpl: "roundTenth", re: /^Avrunda ([\d,]+) till närmaste tiondel\.$/, calc: (m) => Math.floor(num(m[1]) * 10 + 0.5 + 1e-9) / 10 },
  ];
  for (const c of cases) {
    it(`${c.lesson} ${c.tpl}: prompt → independent answer`, () => {
      let checked = 0;
      for (let seed = 0; seed < 250; seed++) for (const level of [1, 2]) {
        const ex = gen(c.lesson, c.tpl, seed, level);
        const m = ex.spec.prompt.match(c.re);
        if (!m) throw new Error(`prompt did not match expected format: "${ex.spec.prompt}"`);
        const want = c.calc(m);
        expect(Math.abs(answerOf(ex) - want), `"${ex.spec.prompt}" expected ${want} got ${answerOf(ex)}`).toBeLessThan(1e-6);
        checked++;
      }
      expect(checked).toBeGreaterThan(100);
    });
  }
});

// ── Independent check of negative-number exercises (signs are easy to get wrong) ──
describe("negative-number exercises agree with their own prompts (independent arithmetic)", () => {
  const N = (s: string) => Number(s.replace(/[\s ]/g, "").replace(/−/g, "-").replace(",", "."));
  const SIGNED = "(\\u2212?\\d+)";
  const gen = (lessonId: string, tplId: string, seed: number) => {
    const lesson = getLesson(lessonId)!;
    const t = [...lesson.knowledge, ...lesson.method, ...lesson.representation].find((x) => x.id === tplId)!;
    return t.gen(makeRng(`neg${seed}`), { level: 1 });
  };
  const ans = (ex: ConcreteExercise) => (ex.solution.kind === "numeric" ? N(ex.solution.accept[0]) : NaN);
  const cases: { l: string; t: string; re: RegExp; calc: (m: RegExpMatchArray) => number }[] = [
    { l: "w8-l4", t: "addPos", re: new RegExp(`^${SIGNED} \\+ (\\d+) = \\?$`), calc: (m) => N(m[1]) + N(m[2]) },
    { l: "w8-l4", t: "subPos", re: new RegExp(`^${SIGNED} \\u2212 (\\d+) = \\?$`), calc: (m) => N(m[1]) - N(m[2]) },
    { l: "w8-l4", t: "addNeg", re: new RegExp(`^${SIGNED} \\+ \\(${SIGNED}\\) = \\?$`), calc: (m) => N(m[1]) + N(m[2]) },
    { l: "w8-l4", t: "hop", re: new RegExp(`^Starta vid ${SIGNED} och hoppa (\\d+) steg åt (höger|vänster)\\. Var hamnar du\\?$`), calc: (m) => N(m[1]) + (m[3] === "höger" ? 1 : -1) * N(m[2]) },
    { l: "w8-l5", t: "diff", re: new RegExp(`^Vilken är skillnaden mellan ${SIGNED} och ${SIGNED}\\?$`), calc: (m) => Math.abs(N(m[1]) - N(m[2])) },
    { l: "w8-l5", t: "subNeg", re: new RegExp(`^\\(Fördjupning\\) ${SIGNED} \\u2212 \\(${SIGNED}\\) = \\?$`), calc: (m) => N(m[1]) - N(m[2]) },
    { l: "w8-l5", t: "distanceSteps", re: new RegExp(`^Hur många steg är det från ${SIGNED} till (\\d+) på tallinjen\\?$`), calc: (m) => N(m[2]) - N(m[1]) },
    { l: "w8-l3", t: "midpoint", re: new RegExp(`^Vilket tal ligger mitt emellan ${SIGNED} och ${SIGNED}\\?$`), calc: (m) => (N(m[1]) + N(m[2])) / 2 },
    { l: "w8-l3", t: "smallestGreater", re: new RegExp(`^Vilket är det minsta heltalet som är större än ${SIGNED}\\?$`), calc: (m) => N(m[1]) + 1 },
    { l: "w8-l1", t: "oneLess", re: new RegExp(`^Vilket tal är 1 (mindre|mer) än ${SIGNED}\\?$`), calc: (m) => N(m[2]) + (m[1] === "mindre" ? -1 : 1) },
    { l: "w8-l2", t: "opposite", re: new RegExp(`^Vilket är det motsatta talet till ${SIGNED}\\?$`), calc: (m) => -N(m[1]) },
    { l: "w8-l2", t: "distance", re: new RegExp(`^Hur många steg från noll ligger ${SIGNED}\\?$`), calc: (m) => Math.abs(N(m[1])) },
    { l: "w8-l6", t: "bank", re: new RegExp(`^Kontot visar ${SIGNED} kr\\. Du (sätter in|tar ut) (\\d+) kr\\. Vad visar kontot nu\\?$`), calc: (m) => N(m[1]) + (m[2] === "sätter in" ? 1 : -1) * N(m[3]) },
    { l: "w8-l6", t: "elevator", re: new RegExp(`^Hissen står på våning ${SIGNED} och åker (\\d+) våningar (upp|ner)\\. Vilken våning står den på nu\\?$`), calc: (m) => N(m[1]) + (m[3] === "upp" ? 1 : -1) * N(m[2]) },
    { l: "w8-l6", t: "submarine", re: new RegExp(`^En ubåt ligger på ${SIGNED} m och stiger (\\d+) m\\. Var ligger den nu \\(i meter\\)\\?$`), calc: (m) => N(m[1]) + N(m[2]) },
    { l: "w8-l6", t: "spread", re: /^Temperaturerna under fyra nätter var (.+) °C\. Vilken är skillnaden mellan högsta och lägsta\?$/, calc: (m) => { const v = m[1].split(",").map((x) => N(x)); return Math.max(...v) - Math.min(...v); } },
  ];
  for (const c of cases) {
    it(`${c.l} ${c.t}: prompt → independent answer`, () => {
      let checked = 0;
      for (let seed = 0; seed < 300; seed++) {
        const ex = gen(c.l, c.t, seed);
        const m = ex.spec.prompt.match(c.re);
        if (!m) throw new Error(`prompt did not match: "${ex.spec.prompt}"`);
        expect(ans(ex), `"${ex.spec.prompt}"`).toBeCloseTo(c.calc(m), 9);
        checked++;
      }
      expect(checked).toBe(300);
    });
  }
  it("the typed minus sign variants are all accepted", () => {
    const ex = gen("w8-l4", "addPos", 1);
    const right = ex.solution.kind === "numeric" ? ex.solution.accept[0] : "";
    for (const v of [right, right.replace("-", "−"), right.replace("-", "–")]) expect(gradeExercise(ex, { kind: "numeric", value: v }).correct, v).toBe(true);
  });
});

describe("answer normalisation accepts how people actually type", () => {
  const ex = (accept: string) => ({ spec: { kind: "numeric", id: "x", skill: "s", prompt: "" }, solution: { kind: "numeric", accept: [accept] }, explanation: "", hints: [] }) as ConcreteExercise;
  const ok = (e: ConcreteExercise, typed: string) => gradeExercise(e, { kind: "numeric", value: typed }).correct;
  it("percent signs, spaces and decimal comma/point", () => {
    for (const t of ["35", "35 %", "35%", " 35 % ", "35 %", "+35"]) expect(ok(ex("35"), t), t).toBe(true);
    for (const t of ["2,4", "2.4", "2,40", "2,4 %"]) expect(ok(ex("2.4"), t), t).toBe(true);
    for (const t of ["1 000", "1000", "1 000"]) expect(ok(ex("1000"), t), t).toBe(true);
  });
  it("minus sign, en dash, em dash and hyphen all mean negative", () => {
    for (const t of ["-3", "−3", "–3", "—3", "- 3", "− 3"]) expect(ok(ex("-3"), t), t).toBe(true);
  });
  it("still rejects wrong answers (sign and size)", () => {
    expect(ok(ex("-3"), "3")).toBe(false);
    expect(ok(ex("3"), "-3")).toBe(false);
    expect(ok(ex("35"), "36 %")).toBe(false);
    expect(ok(ex("0.35"), "35")).toBe(false);
    expect(ok(ex("35"), "0,35")).toBe(false);
  });
});
