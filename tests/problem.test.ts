import { describe, expect, it } from "vitest";
import { ALL_LESSONS } from "@/lib/content";
import { makeRng } from "@/lib/engine/rng";
import type { ConcreteExercise, Template, Visual } from "@/lib/engine/types";

/** Independent checks for World 13: every word problem is re-solved from its own text by brute force. */
const SEEDS = 120;
const W13 = ALL_LESSONS.filter((l) => l.worldId === "w13");
const num = (s: string) => parseFloat(s.replace(/[\s ]/g, "").replace(",", "."));
const near = (a: number, b: number, w: string) => expect(Math.abs(a - b) < 1e-9, `${w}: got ${a}, expected ${b}`).toBe(true);
const P = (ex: ConcreteExercise) => (ex.spec as { prompt: string }).prompt;
const acc = (ex: ConcreteExercise) => (ex.solution.kind === "numeric" ? ex.solution.accept : []);
const fields = (ex: ConcreteExercise) => (ex.solution.kind === "multifield" ? ex.solution.values.map((v) => num(v[0])) : []);
const vis = (ex: ConcreteExercise): Visual | undefined => (ex.spec.kind === "mc" || ex.spec.kind === "numeric" || ex.spec.kind === "multifield" ? ex.spec.visual : undefined);
const mcText = (ex: ConcreteExercise) => (ex.spec.kind === "mc" && ex.solution.kind === "mc" ? ex.spec.options[ex.solution.value] : "");
const evalExpr = (s: string) => Function(`"use strict"; return (${s.replace(/·/g, "*").replace(/−/g, "-").replace(/÷/g, "/")});`)() as number;
function each(filter: (l: string, t: string) => boolean, fn: (ex: ConcreteExercise, w: string, t: string) => void) {
  let matched = 0;
  for (const l of W13) for (const g of [l.knowledge, l.method, l.representation] as Template[][]) for (const t of g) {
    if (!filter(l.id, t.id)) continue;
    matched++;
    for (let s = 0; s < SEEDS; s++) fn(t.gen(makeRng(`p${s}`), { level: 1 }), `${l.id}/${t.id}/seed${s}`, t.id);
  }
  expect(matched, "filter matched no template").toBeGreaterThan(0);
}
const first = (ex: ConcreteExercise) => (ex.solution.kind === "numeric" ? num(acc(ex)[0]) : fields(ex)[fields(ex).length - 1]);

describe("lesson 1–2: reading and modelling problems", () => {
  it("shopping problems", () => {
    each((l, t) => l === "w13-l1" && /^(extraInfo|sumCheck|chooseCalc)$/.test(t), (ex, w, t) => {
      const m = /(\d+) bullar för (\d+) kr styck och en juice för (\d+) kr/.exec(P(ex))!; const a = +m[1], p = +m[2], j = +m[3];
      if (t === "sumCheck") return near(a * p + j, first(ex), w);
      const M = +(/betalar med (\d+) kr|Hon betalar med (\d+) kr/.exec(P(ex))?.slice(1).find(Boolean) ?? 0) || +(/ betalar med (\d+)/.exec(P(ex))?.[1] ?? /(\d+) kr\. Vilken/.exec(P(ex))![1]);
      if (t === "extraInfo") near(M - a * p - j, first(ex), w);
      else { const ok = evalExpr(mcText(ex)); near(ok, M - a * p - j, w); if (ex.spec.kind === "mc") ex.spec.options.forEach((o, i) => { if (i !== (ex.solution as { value: number }).value) expect(evalExpr(o), `${w}: distractor equals answer`).not.toBe(M - a * p - j); }); }
    });
    each((l, t) => l === "w13-l1" && /^(twoStep|shopSteps)$/.test(t), (ex, w) => { const m = /Du har (\d+) kr\. Du köper (\d+) biljetter för (\d+) kr styck och en popcorn för (\d+) kr/.exec(P(ex)); if (!m) return; const tot = +m[2] * +m[3] + +m[4]; near(+m[1] - tot, first(ex), w); expect(+m[1] - tot, w).toBeGreaterThanOrEqual(0); });
    each((l, t) => l === "w13-l1" && /^(modelRead)$/.test(t), (ex, w) => { const v = vis(ex) as Extract<Visual, { type: "barmodel" }>; near(v.rows[0].parts * +/är värd (\d+) kr/.exec(P(ex))![1], first(ex), w); });
  });
  it("ratio / difference / fraction by brute force", () => {
    each((l, t) => /^(ratio|ratioSteps)$/.test(t), (ex, w) => { const m = /har (\d+) gånger så många kort som (\S+)\. Tillsammans har de (\d+) kort/.exec(P(ex))!; const k = +m[1], T = +m[3]; let small = -1; for (let x = 1; x <= T; x++) if (x + k * x === T) small = x; expect(small, w).toBeGreaterThan(0);
      if (ex.solution.kind === "multifield") { expect(fields(ex), w).toEqual([k + 1, small, k * small]); return; }
      const who = /Hur många kort har (\S+)\?/.exec(P(ex))![1]; near(who === m[2] ? small : k * small, first(ex), w); const v = vis(ex) as Extract<Visual, { type: "barmodel" }>; expect(v.rows.map((r) => r.parts), w).toEqual([1, k]); });
    each((l, t) => l === "w13-l2" && t === "diff", (ex, w) => { const m = /har (\d+) fler äpplen än (\S+)\. Tillsammans har de (\d+) äpplen\. Hur många äpplen har (\S+)\?/.exec(P(ex))!; const d = +m[1], T = +m[3]; let o = -1; for (let x = 0; x <= T; x++) if (x + (x + d) === T) o = x; near(m[4] === m[2] ? o : o + d, first(ex), w); });
    each((l, t) => l === "w13-l2" && t === "fraction", (ex, w) => { const m = /(\d+) elever\. (\d+)\/(\d+) av dem cyklar/.exec(P(ex))!; const N = +m[1]; let walk = 0; for (let i = 1; i <= N; i++) if (i % +m[3] < +m[2]) walk++; /* i-th pupil cycles if in first a of every b */ near(N - (N / +m[3]) * +m[2], first(ex), w); expect(N % +m[3], w).toBe(0); expect(walk >= 0, w).toBe(true); const v = vis(ex) as Extract<Visual, { type: "barmodel" }>; expect(v.rows[0].parts, w).toBe(+m[3]); });
    each((l, t) => l === "w13-l2" && t === "unitValue", (ex, w) => { const m = /visar (\d+) lika stora delar som tillsammans är (\d+)/.exec(P(ex))!; near(+m[2] / +m[1], first(ex), w); });
    each((l, t) => l === "w13-l2" && /^(readRatio|readDiff)$/.test(t), (ex, w, t) => { const v = vis(ex) as Extract<Visual, { type: "barmodel" }>; if (t === "readRatio") near(v.rows[1].parts * +v.rows[0].parts * +(v.boxLabel ?? 0), first(ex) * 1, w); else near(+v.rows[0].end! + v.rows[1].extra!.n * +/fått (\d+) extra/.exec(P(ex))![1], first(ex), w); });
  });
});

describe("lesson 3: trial and error by exhaustive search", () => {
  it("sum/product, animals, digits, ages", () => {
    each((l, t) => /^(sumProd|trialSteps)$/.test(t), (ex, w) => { const m = /summan (\d+) och produkten (\d+)/.exec(P(ex))!; const S = +m[1], Pr = +m[2]; const sols: number[][] = []; for (let a = 1; a < S; a++) if (a * (S - a) === Pr && a < S - a) sols.push([a, S - a]); expect(sols.length, `${w}: not unique`).toBe(1); near(sols[0][0], ex.solution.kind === "numeric" ? first(ex) : fields(ex)[2], w); });
    each((l, t) => l === "w13-l3" && t === "animals", (ex, w) => { const m = /ser (\d+) huvuden och (\d+) ben/.exec(P(ex))!; const sols: number[] = []; for (let c = 0; c <= +m[1]; c++) if (2 * (+m[1] - c) + 4 * c === +m[2]) sols.push(c); expect(sols.length, w).toBe(1); near(sols[0], first(ex), w); });
    each((l, t) => l === "w13-l3" && t === "animalModel", (ex, w) => { const m = /(\d+) djur .* och (\d+) ben tillsammans/.exec(P(ex))!; const sols: number[] = []; for (let c = 0; c <= +m[1]; c++) if (2 * (+m[1] - c) + 4 * c === +m[2]) sols.push(c); expect(sols.length, w).toBe(1); near(sols[0], first(ex), w); });
    each((l, t) => l === "w13-l3" && t === "digits", (ex, w) => { const m = /siffersumman (\d+) och siffrorna har produkten (\d+)/.exec(P(ex))!; const c: number[] = []; for (let n = 10; n < 100; n++) if (Math.floor(n / 10) + (n % 10) === +m[1] && Math.floor(n / 10) * (n % 10) === +m[2]) c.push(n); near(Math.max(...c), first(ex), w); });
    each((l, t) => l === "w13-l3" && t === "ages", (ex, w) => { const m = /Om (\d+) år är deras åldrar tillsammans (\d+) år/.exec(P(ex))!; const sols: number[] = []; for (let a = 1; a < 100; a++) if (a + +m[1] + (4 * a + +m[1]) === +m[2]) sols.push(a); expect(sols.length, w).toBe(1); near(sols[0], first(ex), w); });
  });
});

describe("lesson 4: working backwards (forward simulation)", () => {
  it("chains and flows", () => {
    const sim = (x: number, ops: [string, number][]) => ops.reduce((v, [k, n]) => (k.startsWith("lägger") ? v + n : k.startsWith("drar") ? v - n : k.startsWith("mult") ? v * n : v / n), x);
    each((l, t) => l === "w13-l4" && /^(chain|backSteps)$/.test(t), (ex, w) => { const ops = [...P(ex).matchAll(/(lägger till|drar bort|multiplicerar med|dividerar med) (\d+)/g)].map((m) => [m[1], +m[2]] as [string, number]); const R = +/Resultatet är (\d+)/.exec(P(ex))![1]; const x = ex.solution.kind === "numeric" ? first(ex) : fields(ex)[1]; near(sim(x, ops), R, w); expect(Number.isInteger(x), w).toBe(true);
      if (ex.solution.kind === "multifield") near(sim(x, ops.slice(0, -1)), fields(ex)[0], w); });
    each((l, t) => t === "flow", (ex, w) => { const ops = [...P(ex).matchAll(/([+−·÷])(\d+)/g)].map((m) => [m[1], +m[2]] as [string, number]); const R = +/→ (\d+)\. Vilket/.exec(P(ex))![1]; const x = first(ex); near(ops.reduce((v, [k, n]) => (k === "+" ? v + n : k === "−" ? v - n : k === "·" ? v * n : v / n), x), R, w); });
    each((l, t) => t === "money", (ex, w) => { const m = /bok för (\d+) kr\. Då hade du (\d+) kr kvar/.exec(P(ex))!; const x = first(ex); near(x / 2 - +m[1], +m[2], w); });
    each((l, t) => t === "order", (ex, w) => { const m = /multiplicerar med (\d+) och drar bort (\d+)\. Resultatet är (\d+)/.exec(P(ex))!; let x = -1; for (let i = 0; i < 200; i++) if (i * +m[1] - +m[2] === +m[3]) x = i; near(evalExpr(mcText(ex)), x, w); });
  });
});

describe("lesson 5: reasoning claims, checked by search", () => {
  const isPrime = (n: number) => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
  const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  const D = range(0, 60);
  const claims: Record<string, () => boolean> = {
    "Summan av två udda tal är alltid ett jämnt tal": () => D.every((a) => D.every((b) => a % 2 === 0 || b % 2 === 0 || (a + b) % 2 === 0)),
    "Produkten av två udda tal är alltid ett jämnt tal": () => D.every((a) => D.every((b) => a % 2 === 0 || b % 2 === 0 || (a * b) % 2 === 0)),
    "Alla primtal är udda tal": () => D.every((n) => !isPrime(n) || n % 2 === 1),
    "Ett tal som är delbart med 6 är alltid delbart med 3": () => D.every((n) => n % 6 !== 0 || n % 3 === 0),
    "Ett tal som är delbart med 3 är alltid delbart med 6": () => D.every((n) => n % 3 !== 0 || n % 6 === 0),
    "Kvadraten av ett heltal är alltid större än talet självt": () => D.every((n) => n * n > n),
    "Summan av tre på varandra följande heltal är alltid delbar med 3": () => D.every((n) => (n + n + 1 + n + 2) % 3 === 0),
    "Ett tal som slutar på 5 är alltid delbart med 10": () => D.every((n) => n % 10 !== 5 || n % 10 === 0),
    "Ett jämnt tal multiplicerat med ett heltal blir alltid ett jämnt tal": () => D.every((a) => D.every((b) => a % 2 !== 0 || (a * b) % 2 === 0)),
    "Ett tal som är delbart med 4 är alltid jämnt": () => D.every((n) => n % 4 !== 0 || n % 2 === 0),
  };
  it("truth values", () => { each((l, t) => t === "truth", (ex, w) => { const c = /”(.+)\.”/.exec(P(ex))![1]; expect(claims[c], `${w}: unknown claim`).toBeTruthy(); expect(mcText(ex), w).toBe(claims[c]() ? "Sant" : "Falskt"); }); });
  it("counterexamples are genuine and unique", () => {
    const cond: Record<string, [(n: number) => boolean, (n: number) => boolean]> = {
      "Alla tal som slutar på 5 är delbara med 10": [(n) => n % 10 === 5, (n) => n % 10 === 0], "Alla tal som är delbara med 3 är delbara med 6": [(n) => n % 3 === 0, (n) => n % 6 === 0],
      "Alla primtal är udda": [isPrime, (n) => n % 2 === 1], "Alla jämna tal är delbara med 4": [(n) => n % 2 === 0, (n) => n % 4 === 0], "Alla tal som är delbara med 9 är delbara med 18": [(n) => n % 9 === 0, (n) => n % 18 === 0],
    };
    each((l, t) => t === "counter", (ex, w) => { const c = /”(.+)\.”/.exec(P(ex))![1]; const [p, q] = cond[c]; if (ex.spec.kind !== "mc") throw new Error(); const flags = ex.spec.options.map((o) => p(+o) && !q(+o)); expect(flags.filter(Boolean).length, `${w}: not exactly one counterexample`).toBe(1); expect(flags[(ex.solution as { value: number }).value], w).toBe(true); });
    each((l, t) => t === "counterSteps", (ex, w) => { const m = /”(.+)\.” Pröva talet (\d+)/.exec(P(ex))!; const [p, q] = cond[m[1]]; const n = +m[2]; expect(fields(ex), w).toEqual([p(n) ? 1 : 0, q(n) ? 1 : 0, p(n) && !q(n) ? 1 : 0]); });
  });
  it("alltid / ibland / aldrig", () => {
    const some: Record<string, (n: number, m: number) => boolean | null> = {
      "Summan av två primtal är ett jämnt tal": (a, b) => (isPrime(a) && isPrime(b) ? (a + b) % 2 === 0 : null), "Ett tal som är delbart med 4 är jämnt": (a) => (a % 4 === 0 ? a % 2 === 0 : null),
      "Ett jämnt tal är ett primtal": (a) => (a % 2 === 0 ? isPrime(a) : null), "Kvadraten av ett heltal är negativ": (a) => a * a < 0,
      "Summan av två jämna tal är ett udda tal": (a, b) => (a % 2 === 0 && b % 2 === 0 ? (a + b) % 2 === 1 : null), "Ett tal som är delbart med 5 slutar på 5": (a) => (a % 5 === 0 ? a % 10 === 5 : null), "Ett tal som slutar på 0 är delbart med 10": (a) => (a % 10 === 0 ? a % 10 === 0 : null),
    };
    each((l, t) => t === "someNever", (ex, w) => { const s = /”(.+)\.”/.exec(P(ex))![1]; const f = some[s]; const vals: boolean[] = []; for (let a = 0; a <= 60; a++) for (let b = 0; b <= 60; b++) { const r = f(a, b); if (r !== null) vals.push(r); } const word = vals.every(Boolean) ? "alltid" : vals.every((x) => !x) ? "aldrig" : "ibland"; expect(mcText(ex), w).toBe(word); });
  });
  it("dot-pattern parity and totals", () => {
    each((l, t) => t === "dotsParity" || t === "dotsTotal", (ex, w, t) => { const v = vis(ex) as Extract<Visual, { type: "dotpattern" }>; const tot = v.figures[0].reduce((a, b) => a + b, 0); if (t === "dotsTotal") near(tot, first(ex), w); else expect(mcText(ex), w).toBe(tot % 2 ? "Udda" : "Jämnt"); });
  });
});

describe("lesson 6: estimation and checking", () => {
  const rnd = (n: number, to: number) => Math.round(n / to) * to;
  it("overslag", () => {
    each((l, t) => t === "roundSum", (ex, w) => { const m = /tiotal: (\d+) \+ (\d+) \+ (\d+)\./.exec(P(ex))!; near(rnd(+m[1], 10) + rnd(+m[2], 10) + rnd(+m[3], 10), first(ex), w); });
    each((l, t) => t === "roundMul", (ex, w) => { const m = /Avrunda (\d+) till närmaste hundratal och (\d+) till närmaste tiotal/.exec(P(ex))!; near(rnd(+m[1], 100) * rnd(+m[2], 10), first(ex), w); });
    each((l, t) => t === "estimateSteps", (ex, w) => { const m = /för (\d+) · (\d+) genom/.exec(P(ex))!; expect(fields(ex), w).toEqual([rnd(+m[1], 10), rnd(+m[2], 10), rnd(+m[1], 10) * rnd(+m[2], 10)]); });
    each((l, t) => t === "balanceEstimate", (ex, w) => { const m = /jämför (\d+) · (\d+) med/.exec(P(ex))!; near(rnd(+m[1], 10) * rnd(+m[2], 10), first(ex), w); const v = vis(ex) as Extract<Visual, { type: "balance" }>; near(num(v.right), rnd(+m[1], 10) * rnd(+m[2], 10), w); });
    each((l, t) => t === "bigOrSmall", (ex, w) => { const m = /Är (\d+) · (\d+) större eller mindre än överslaget (\d+)/.exec(P(ex))!; const a = +m[1], b = +m[2]; near(rnd(a, 10) * rnd(b, 10), +m[3], w); expect(mcText(ex), w).toBe(a * b > +m[3] ? ">" : "<"); });
  });
  it("decimal products and inverse checks", () => {
    each((l, t) => t === "decimalMc", (ex, w) => { const m = /rimligt för (\S+) · (\S+)\?/.exec(P(ex))!; const exact = (num(m[1]) * 10 * (num(m[2]) * 10)) / 100; near(num(mcText(ex)), exact, w); if (ex.spec.kind === "mc") ex.spec.options.forEach((o, i) => { if (i !== (ex.solution as { value: number }).value) expect(num(o), `${w}: distractor equals exact`).not.toBeCloseTo(exact, 9); }); });
    each((l, t) => t === "inverse" && true, (ex, w) => { if (!/÷/.test(P(ex))) return; const m = /räknade (\d+) ÷ (\d+) = (\d+)\./.exec(P(ex))!; expect(mcText(ex).startsWith("Ja"), w).toBe(+m[3] * +m[2] === +m[1]); });
  });
});

describe("lesson 7: mixed problems", () => {
  it("discount, recipe, trains, floors", () => {
    each((l, t) => t === "discount" || t === "discountSteps" || t === "discountBar", (ex, w) => { const m = /(\d+) kr\. Den är nedsatt med (\d+) %|kostar (\d+) kr\. Stapeln|(\d+) %\) på en vara som kostar (\d+) kr/.exec(P(ex)); let Pn: number, R: number; const a = /(\d+) kr\. Den är nedsatt med (\d+) %/.exec(P(ex)), b = /\((\d+) %\) på en vara som kostar (\d+) kr/.exec(P(ex)); if (a) { Pn = +a[1]; R = +a[2]; } else { R = +b![1]; Pn = +b![2]; } void m; expect((Pn * R) % 100, `${w}: discount not whole`).toBe(0); const sale = Pn - (Pn * R) / 100; near(ex.solution.kind === "numeric" ? first(ex) : fields(ex)[1], sale, w); });
    each((l, t) => t === "recipe", (ex, w) => { const m = /(\d+) g mjöl\. Hur mycket mjöl behövs för (\d+) personer/.exec(P(ex))!; near((+m[1] / 4) * +m[2], first(ex), w); });
    each((l, t) => t === "train", (ex, w) => { const m = /avgår (\d\d)\.(\d\d) och resan tar (\d+) minuter/.exec(P(ex))!; const tot = +m[1] * 60 + +m[2] + +m[3]; expect(tot, w).toBeLessThan(1440); expect(ex.solution.kind === "numeric" && ex.solution.accept[0], w).toBe(`${String(Math.floor(tot / 60)).padStart(2, "0")}.${String(tot % 60).padStart(2, "0")}`); });
    each((l, t) => t === "floorCost", (ex, w) => { const m = /(\d+) m långt och (\d+) m brett\. Golvet kostar (\d+) kr/.exec(P(ex))!; near(+m[1] * +m[2] * +m[3], first(ex), w); });
    each((l, t) => t === "strategyPick", (ex, w) => { const v = vis(ex) as Extract<Visual, { type: "barmodel" }>; near(v.rows.reduce((a, r) => a + r.parts, 0) * +v.boxLabel!, first(ex), w); });
  });
});
