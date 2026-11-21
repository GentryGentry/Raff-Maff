import { describe, expect, it } from "vitest";
import { ALL_LESSONS } from "@/lib/content";
import { makeRng } from "@/lib/engine/rng";
import type { ConcreteExercise, Template, Visual } from "@/lib/engine/types";

/** Independent checks for World 11: answers are recomputed from the prompt text with a separate unit table. */
const SEEDS = 120;
const W11 = ALL_LESSONS.filter((l) => l.worldId === "w11");
// base-unit factors (m, kg, l, m²) – deliberately NOT the generators' exponent table
const F: Record<string, number> = { mm: 0.001, cm: 0.01, dm: 0.1, m: 1, km: 1000, g: 0.001, kg: 1, ton: 1000, ml: 0.001, cl: 0.01, dl: 0.1, l: 1, "cm²": 1e-4, "dm²": 1e-2, "m²": 1 };
const num = (s: string) => parseFloat(s.replace(/[\s ]/g, "").replace(",", "."));
const near = (a: number, b: number, w: string) => expect(Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b)), `${w}: got ${a}, expected ${b}`).toBe(true);
const prompt = (ex: ConcreteExercise) => (ex.spec as { prompt: string }).prompt;
const acc0 = (ex: ConcreteExercise) => (ex.solution.kind === "numeric" ? num(ex.solution.accept[0]) : NaN);
const fields = (ex: ConcreteExercise) => (ex.solution.kind === "multifield" ? ex.solution.values.map((v) => num(v[0])) : []);
const vis = (ex: ConcreteExercise): Visual | undefined => (ex.spec.kind === "mc" || ex.spec.kind === "numeric" || ex.spec.kind === "multifield" ? ex.spec.visual : undefined);
function each(filter: (l: string, t: string) => boolean, fn: (ex: ConcreteExercise, w: string) => void) {
  let matched = 0;
  for (const l of W11) for (const g of [l.knowledge, l.method, l.representation] as Template[][]) for (const t of g) {
    if (!filter(l.id, t.id)) continue;
    matched++;
    for (let s = 0; s < SEEDS; s++) fn(t.gen(makeRng(`u${s}`), { level: 1 }), `${l.id}/${t.id}/seed${s}`);
  }
  expect(matched, "filter matched no template").toBeGreaterThan(0);
}
const mcText = (ex: ConcreteExercise) => (ex.spec.kind === "mc" && ex.solution.kind === "mc" ? ex.spec.options[ex.solution.value] : "");

describe("unit conversions agree with an independent unit table", () => {
  it("'Skriv om X a i b.' (numeric)", () => {
    let n = 0;
    each((l, t) => /^(convDown|convUp|twoStep)$/.test(t), (ex, w) => {
      const m = /^Skriv om (\S+) (\S+) i (\S+)\.$/.exec(prompt(ex))!;
      expect(m, w).toBeTruthy();
      near((num(m[1]) * F[m[2]]) / F[m[3]], acc0(ex), w); n++;
    });
    expect(n).toBeGreaterThan(500);
  });
  it("conversion steps: factor and result", () => {
    each((l, t) => t === "convSteps", (ex, w) => {
      const m = /^Skriv om (\S+) (\S+) i (\S+) i steg\.$/.exec(prompt(ex))!; const f = fields(ex);
      near(Math.max(F[m[2]], F[m[3]]) / Math.min(F[m[2]], F[m[3]]), f[0], w);
      near((num(m[1]) * F[m[2]]) / F[m[3]], f[1], w);
    });
  });
  it("mixed units ('3 m 45 cm i cm') and add/subtract", () => {
    each((l, t) => /^(mixed|sum|diff)$/.test(t) && l !== "w11-l4" && l !== "w11-l2", (ex, w) => {
      const p = prompt(ex);
      let m: RegExpExecArray | null;
      if ((m = /^Skriv om (\d+) (\S+) (\d+) (\S+) i (\S+)\.$/.exec(p))) near((Number(m[1]) * F[m[2]] + Number(m[3]) * F[m[4]]) / F[m[5]], acc0(ex), w);
      else if ((m = /^Lägg ihop (\S+) (\S+) och (\d+) (\S+)\. Svara i (\S+)\.$/.exec(p))) near((num(m[1]) * F[m[2]] + Number(m[3]) * F[m[4]]) / F[m[5]], acc0(ex), w);
      else if ((m = /^Från (\S+) (\S+) tar du bort (\d+) (\S+)\. Hur många (\S+) är kvar\?$/.exec(p))) near((num(m[1]) * F[m[2]] - Number(m[3]) * F[m[4]]) / F[m[5]], acc0(ex), w);
      else throw new Error(`${w}: unrecognised prompt ${p}`);
    });
    each((l, t) => l === "w11-l2" && t === "mixed", (ex, w) => { const m = /^Skriv om (\d+) kg (\d+) g i g\.$/.exec(prompt(ex))!; near(Number(m[1]) * 1000 + Number(m[2]), acc0(ex), w); });
  });
  it("comparison picks the largest quantity", () => {
    each((l, t) => /^(compare|heaviest)$/.test(t) && l !== "w11-l1" || (l === "w11-l1" && t === "compare"), (ex, w) => {
      if (ex.spec.kind !== "mc") return;
      const vals = ex.spec.options.map((o) => { const [v, u] = o.split(/\s(?=\S+$)/); return num(v) * F[u]; });
      const best = Math.max(...vals);
      near(vals[(ex.solution as { value: number }).value], best, w);
      expect(vals.filter((x) => Math.abs(x - best) < 1e-12).length, `${w} tie`).toBe(1);
    });
  });
  it("balance pictures: equal quantities / correct sign", () => {
    each((l, t) => t === "balanceFind", (ex, w) => { const v = vis(ex) as Extract<Visual, { type: "balance" }>; const [x, a] = v.left.split(" "); const b = v.right.split(" ")[1]; near((num(x) * F[a]) / F[b], acc0(ex), w); });
    each((l, t) => t === "balanceSign", (ex, w) => {
      const v = vis(ex) as Extract<Visual, { type: "balance" }>; const [x, a] = v.left.split(" "), [y, b] = v.right.split(" ");
      const L = num(x) * F[a], R = num(y) * F[b];
      const sign = Math.abs(L - R) < 1e-12 ? "=" : L < R ? "<" : ">";
      expect(mcText(ex), w).toBe(sign);
      expect(v.tilt, w).toBe(sign === "=" ? "level" : sign === ">" ? "left" : "right");
    });
  });
  it("facts: exactly one true statement among the options", () => {
    each((l, t) => t === "trueStatement", (ex, w) => {
      if (ex.spec.kind !== "mc") throw new Error();
      const truth = ex.spec.options.map((o) => { const m = /^1 (\S+) = (\S+(?: \d{3})*) (\S+)$/.exec(o)!; return Math.abs(F[m[1]] - num(m[2]) * F[m[3]]) < 1e-12; });
      expect(truth.filter(Boolean).length, w).toBe(1);
      expect(truth[(ex.solution as { value: number }).value], w).toBe(true);
    });
  });
});

describe("rulers and clocks", () => {
  it("ruler readings = end minus start", () => {
    each((l, t) => /^(rulerRead|rulerCm)$/.test(t), (ex, w) => {
      const v = vis(ex) as Extract<Visual, { type: "ruler" }>; const len = v.to - v.from;
      expect(v.to, w).toBeLessThanOrEqual(v.cm * 10);
      near(/millimeter/.test(prompt(ex)) ? len : len / 10, acc0(ex), w);
    });
    each((l, t) => t === "rulerScale", (ex, w) => { const v = vis(ex) as Extract<Visual, { type: "ruler" }>; const S = Number(/skala 1:(\d+)/.exec(prompt(ex))![1]); near(((v.to - v.from) / 10) * S / 100, acc0(ex), w); });
  });
  it("clock readings and minutes to the hour", () => {
    each((l, t) => t === "clockRead", (ex, w) => { const v = vis(ex) as Extract<Visual, { type: "clock" }>; expect(fields(ex), w).toEqual([v.h, v.m]); expect(v.m % 5, w).toBe(0); });
    each((l, t) => t === "clockToHour", (ex, w) => { const v = vis(ex) as Extract<Visual, { type: "clock" }>; near(60 - v.m, acc0(ex), w); });
  });
});

describe("time", () => {
  const mins = (s: string) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3, 5));
  it("elapsed time (also across midnight) and steps", () => {
    each((l, t) => t === "elapsed" || t === "elapsedSteps", (ex, w) => {
      const m = /börjar (\d\d\.\d\d) och slutar (\d\d\.\d\d)( nästa dag)?\./.exec(prompt(ex))!;
      const dur = mins(m[2]) - mins(m[1]) + (m[3] ? 1440 : 0);
      expect(dur, w).toBeGreaterThan(0);
      if (ex.solution.kind === "numeric") near(dur, acc0(ex), w); else near(dur, fields(ex)[2], w);
    });
  });
  it("conversions with 60 and 24", () => {
    each((l, t) => t === "hms", (ex, w) => { const m = /^Skriv om (\d+) (min|tim) (\d+) (s|min) i/.exec(prompt(ex))!; near(Number(m[1]) * 60 + Number(m[3]), acc0(ex), w); });
    each((l, t) => t === "decHours", (ex, w) => { const m = /^Skriv om (\d+,\d+) tim i minuter\./.exec(prompt(ex))!; near(num(m[1]) * 60, acc0(ex), w); });
    each((l, t) => t === "days", (ex, w) => { const m = /(\d+) dygn (\d+) timmar/.exec(prompt(ex))!; near(Number(m[1]) * 24 + Number(m[2]), acc0(ex), w); });
    each((l, t) => t === "hmsSteps", (ex, w) => { const m = /Skriv om (\d+) tim (\d+) min/.exec(prompt(ex))!; near(Number(m[1]) * 60 + Number(m[2]), fields(ex)[1], w); });
    each((l, t) => t === "addTime", (ex, w) => { const m = /Klockan är (\d\d\.\d\d)\. Vad är klockan (\d+) minuter senare/.exec(prompt(ex))!; const r = mins(m[1]) + Number(m[2]); expect(ex.solution.kind === "numeric" && ex.solution.accept[0], w).toBe(`${String(Math.floor(r / 60)).padStart(2, "0")}.${String(r % 60).padStart(2, "0")}`); expect(r, w).toBeLessThan(1440); expect(prompt(ex), "answer leaked in prompt").not.toMatch(new RegExp(`${String(Math.floor(r / 60)).padStart(2, "0")}\\.${String(r % 60).padStart(2, "0")}`)); });
    each((l, t) => t === "episodes", (ex, w) => { const m = /är (\d+) minuter långt\. Hur många timmar tar (\d+) avsnitt/.exec(prompt(ex))!; near((Number(m[1]) * Number(m[2])) / 60, acc0(ex), w); expect(Number.isInteger(acc0(ex)), w).toBe(true); });
  });
});

describe("area units and scale", () => {
  it("floors, tiles and mixed sides", () => {
    each((l, t) => t === "tiles", (ex, w) => { const m = /Ett golv är (\d+) m × (\d+) m/.exec(prompt(ex))!; near((Number(m[1]) / 0.5) * (Number(m[2]) / 0.5), acc0(ex), w); });
    each((l, t) => t === "room", (ex, w) => { const m = /långt och (\d+) m brett/.exec(prompt(ex))!, a = /Ett rum är (\S+) m/.exec(prompt(ex))!; near(num(a[1]) * Number(m[1]), acc0(ex), w); });
    each((l, t) => t === "mixedSides" || t === "sameUnit", (ex, w) => { const m = /(\d+) cm lång och (\d+) m bred/.exec(prompt(ex))!; const area = (Number(m[1]) / 100) * Number(m[2]); near(area, ex.solution.kind === "numeric" ? acc0(ex) : fields(ex)[1], w); });
    each((l, t) => t === "polyRoom", (ex, w) => { const v = vis(ex) as Extract<Visual, { type: "polygon" }>; const s = v.sides!; near(num(s[0]) * (num(s[1]) / 10), acc0(ex), w); });
  });
  it("scale: ritning ↔ verklighet", () => {
    each((l, t) => t === "drawToReal" || t === "mapToReal", (ex, w) => {
      const m = /skala 1:([\d  ]+?)\. En sträcka är (\d+) cm på/.exec(prompt(ex))!; const S = num(m[1]), D = Number(m[2]);
      const toKm = /km\.$/.test(prompt(ex)); near((D * S) / (toKm ? 100000 : 100), acc0(ex), w);
    });
    each((l, t) => t === "realToDraw", (ex, w) => { const m = /sträcka ([\d,]+) m\. Hur lång blir den på en ritning i skala 1:(\d+)/.exec(prompt(ex))!; near((num(m[1]) * 100) / Number(m[2]), acc0(ex), w); });
    each((l, t) => t === "findScale" && true, (ex, w) => { if (ex.spec.kind !== "mc") return; const m = /är (\d+) cm på en ritning och (\d+(?:,\d+)?) m/.exec(prompt(ex))!; near((num(m[2]) * 100) / Number(m[1]), num(mcText(ex).split(":")[1]), w); });
    each((l, t) => t === "scaleSteps", (ex, w) => { const m = /Skala 1:(\d+)\. Ritningen är (\d+) cm/.exec(prompt(ex))!; near(Number(m[1]) * Number(m[2]), fields(ex)[0], w); near((Number(m[1]) * Number(m[2])) / 100, fields(ex)[1], w); });
    each((l, t) => t === "enlarge", (ex, w) => { const m = /är (\d+) mm lång\. Du ritar den i skala (\d+):1/.exec(prompt(ex))!; near(Number(m[1]) * Number(m[2]), acc0(ex), w); });
    each((l, t) => t === "drawingRoom", (ex, w) => { const S = Number(/skala 1:(\d+)/.exec(prompt(ex))![1]); const v = vis(ex) as Extract<Visual, { type: "polygon" }>; const l = num(v.sides![0]), b = num(v.sides![1]); expect(fields(ex), w).toEqual([(l * S) / 100, (b * S) / 100, (l * S * b * S) / 10000]); });
  });
});

describe("estimation and speed", () => {
  it("speed, broken tape, rounding, stacks", () => {
    each((l, t) => t === "speed", (ex, w) => { const m = /cyklar (\d+) km\/h i (\d+) minuter/.exec(prompt(ex))!; near((Number(m[1]) * Number(m[2])) / 60, acc0(ex), w); });
    each((l, t) => t === "speedSteps", (ex, w) => { const m = /cyklar (\d+) km\/h i (\d+) minuter/.exec(prompt(ex))!; near(Number(m[2]) / 60, fields(ex)[0], w); near((Number(m[1]) * Number(m[2])) / 60, fields(ex)[1], w); });
    each((l, t) => t === "brokenTape", (ex, w) => { const m = /första (\d+) cm är avbrutna.*läser (\d+) cm/.exec(prompt(ex))!; near(Number(m[2]) - Number(m[1]), acc0(ex), w); });
    each((l, t) => t === "roundMin", (ex, w) => { const v = Number(/får (\d+) cm/.exec(prompt(ex))![1]); near(v - 0.5, acc0(ex), w); });
    each((l, t) => t === "stack", (ex, w) => { const m = /är (\d+) cm tjock\. Hur hög blir en hög med (\d+) böcker/.exec(prompt(ex))!; near((Number(m[1]) * Number(m[2])) / 100, acc0(ex), w); });
    each((l, t) => t === "roundSteps", (ex, w) => { const m = /är (\S+) m\./.exec(prompt(ex))!; const dm = num(m[1]) * 10; near(dm, fields(ex)[0], w); near(Math.round(dm), fields(ex)[1], w); });
  });
});
