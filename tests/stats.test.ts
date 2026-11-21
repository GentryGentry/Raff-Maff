import { describe, expect, it } from "vitest";
import { ALL_LESSONS } from "@/lib/content";
import { makeRng } from "@/lib/engine/rng";
import type { ConcreteExercise, Template, Visual } from "@/lib/engine/types";

/** Independent checks for World 12: statistics and probability recomputed from prompts and pictures. */
const SEEDS = 120;
const W12 = ALL_LESSONS.filter((l) => l.worldId === "w12");
const num = (s: string) => parseFloat(s.replace(/[\s ]/g, "").replace(",", "."));
const near = (a: number, b: number, w: string) => expect(Math.abs(a - b) < 1e-9, `${w}: got ${a}, expected ${b}`).toBe(true);
const P = (ex: ConcreteExercise) => (ex.spec as { prompt: string }).prompt;
const acc = (ex: ConcreteExercise) => (ex.solution.kind === "numeric" ? ex.solution.accept : []);
const frac = (s: string) => { const [a, b] = s.split("/"); return b ? Number(a) / Number(b) : num(a); };
const fields = (ex: ConcreteExercise) => (ex.solution.kind === "multifield" ? ex.solution.values.map((v) => num(v[0])) : []);
const vis = (ex: ConcreteExercise): Visual | undefined => (ex.spec.kind === "mc" || ex.spec.kind === "numeric" || ex.spec.kind === "multifield" ? ex.spec.visual : undefined);
const mcText = (ex: ConcreteExercise) => (ex.spec.kind === "mc" && ex.solution.kind === "mc" ? ex.spec.options[ex.solution.value] : "");
const list = (s: string) => s.split(",").map((x) => Number(x.trim()));
function each(filter: (l: string, t: string) => boolean, fn: (ex: ConcreteExercise, w: string, t: string) => void) {
  let matched = 0;
  for (const l of W12) for (const g of [l.knowledge, l.method, l.representation] as Template[][]) for (const t of g) {
    if (!filter(l.id, t.id)) continue;
    matched++;
    for (let s = 0; s < SEEDS; s++) fn(t.gen(makeRng(`s${s}`), { level: 1 }), `${l.id}/${t.id}/seed${s}`, t.id);
  }
  expect(matched, "filter matched no template").toBeGreaterThan(0);
}
// independent statistics
const mean = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length;
const median = (a: number[]) => { const s = [...a].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[(n >> 1) - 1] + s[n >> 1]) / 2; };
const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);

describe("charts are readable", () => {
  it("every bar/line chart has values inside the axis and exactly readable", () => {
    for (const l of W12) for (const g of [l.knowledge, l.method, l.representation] as Template[][]) for (const t of g) for (let s = 0; s < 60; s++) {
      const v = vis(t.gen(makeRng(`c${s}`), { level: 1 }));
      if (v?.type === "barchart" || v?.type === "linechart") {
        const vals = v.type === "barchart" ? v.vals : v.ys, min = v.min ?? 0, unit = v.step % 2 === 0 ? v.step / 2 : v.step;
        for (const x of vals) { expect(x, `${l.id}/${t.id}`).toBeLessThanOrEqual(v.max); expect(x, `${l.id}/${t.id}`).toBeGreaterThanOrEqual(min); expect((x - min) % unit, `${l.id}/${t.id}: ${x} not on a gridline`).toBe(0); }
        expect((v.max - min) % v.step, `${l.id}/${t.id}`).toBe(0);
      }
    }
  });
  it("lesson theory charts too", () => { for (const l of W12) for (const th of l.theory) { const v = th.visual; if (v?.type === "barchart") v.vals.forEach((x) => { expect(x).toBeLessThanOrEqual(v.max); expect(x).toBeGreaterThanOrEqual(v.min ?? 0); }); } });
});

describe("lesson 1", () => {
  it("bar reading, difference and total", () => {
    each((l, t) => t === "readBar" || t === "tick", (ex, w, t) => { const v = vis(ex) as Extract<Visual, { type: "barchart" }>; const c = /(?:valde|för) (\S+?)[?.]/.exec(P(ex))![1]; near(ex.solution.kind === "mc" ? num(mcText(ex)) : num(acc(ex)[0]), v.vals[v.cats.indexOf(c)], w); });
    each((l, t) => t === "diffBar", (ex, w, t) => { const v = vis(ex) as Extract<Visual, { type: "barchart" }>; const m = /fler valde (\S+) än (\S+)\?/.exec(P(ex))!; near(num(acc(ex)[0]), v.vals[v.cats.indexOf(m[1])] - v.vals[v.cats.indexOf(m[2])], w); expect(num(acc(ex)[0]), w).toBeGreaterThan(0); });
    each((l, t) => t === "totalBar", (ex, w, t) => { const v = vis(ex) as Extract<Visual, { type: "barchart" }>; near(num(acc(ex)[0]), sum(v.vals), w); });
    each((l, t) => t === "tableSteps", (ex, w, t) => { const v = vis(ex) as Extract<Visual, { type: "barchart" }>; expect(fields(ex), w).toEqual([Math.max(...v.vals), Math.min(...v.vals), sum(v.vals)]); });
  });
  it("frequencies, pictograms, line charts", () => {
    each((l, t) => t === "frequency", (ex, w, t) => { const m = /kast: ([\d, ]+)\. Hur många gånger kom talet (\d)\?/.exec(P(ex))!; near(list(m[1]).filter((x) => x === Number(m[2])).length, num(acc(ex)[0]), w); });
    each((l, t) => t === "freqSteps", (ex, w, t) => { const m = /har: ([\d, ]+)\./.exec(P(ex))!, a = list(m[1]); expect(fields(ex), w).toEqual([1, 2, 3].map((k) => a.filter((x) => x === k).length)); });
    each((l, t) => t === "pictogram", (ex, w, t) => { const v = vis(ex) as Extract<Visual, { type: "pictogram" }>; const per = Number(/står för (\d+) böcker/.exec(P(ex))![1]); expect(per, w).toBe(v.per); const day = /lästes på (\S+)\?/.exec(P(ex))![1]; near(num(acc(ex)[0]), v.rows.find((r) => r.label.toLowerCase() === day)!.count * per, w); });
    each((l, t) => t === "lineRead", (ex, w, t) => { const v = vis(ex) as Extract<Visual, { type: "linechart" }>; const tm = /klockan (\d\d)\?/.exec(P(ex))![1]; near(num(acc(ex)[0]), v.ys[v.xs.indexOf(tm)], w); });
    each((l, t) => t === "readLine", (ex, w, t) => { const v = vis(ex) as Extract<Visual, { type: "linechart" }>; const m = /mellan klockan (\d\d) och (\d\d)\?/.exec(P(ex))!; near(num(acc(ex)[0]), Math.abs(v.ys[v.xs.indexOf(m[2])] - v.ys[v.xs.indexOf(m[1])]), w); });
    each((l, t) => t === "buildBars", (ex, w, t) => { const m = [...(P(ex).split("tabellen: ")[1] ?? "").matchAll(/(\S+) (\d+)/g)]; if (ex.solution.kind !== "bars" || ex.spec.kind !== "bars") throw new Error(); expect(ex.solution.values, w).toEqual(m.map((x) => Number(x[2]))); expect(ex.spec.cats, w).toEqual(m.map((x) => x[1].replace(/[,.]$/, ""))); });
  });
});

describe("mean, median, mode", () => {
  it("mean", () => {
    each((l, t) => t === "meanList" || t === "meanHalf" || t === "meanSteps", (ex, w, t) => { const a = list(/av ([\d, ]+?)(?: i steg)?\./.exec(P(ex))![1]); near(ex.solution.kind === "numeric" ? num(acc(ex)[0]) : fields(ex)[2], mean(a), w); if (t === "meanSteps") near(fields(ex)[0], sum(a), w); });
    each((l, t) => t === "missing" || t === "missingSteps", (ex, w, t) => { const m = /Medelvärdet av (\d+) tal är (\d+)\. \d+ av dem är ([\d, ]+)\./.exec(P(ex))!; const n = Number(m[1]), mm = Number(m[2]), g = list(m[3]); near(ex.solution.kind === "numeric" ? num(acc(ex)[0]) : fields(ex)[2], n * mm - sum(g), w); expect(n * mm - sum(g), w).toBeGreaterThan(0); });
    each((l, t) => t === "newMean", (ex, w, t) => { const m = /(\d+) elever har i medel (\d+) poäng\. En ny elev kommer med (\d+) poäng/.exec(P(ex))!; near((Number(m[1]) * Number(m[2]) + Number(m[3])) / (Number(m[1]) + 1), num(acc(ex)[0]), w); });
    each((l, t) => t === "meanBars" || t === "meanLine", (ex, w, t) => { const v = vis(ex)!; const vals = v.type === "barchart" ? v.vals : (v as Extract<Visual, { type: "linechart" }>).ys; near(mean(vals), num(acc(ex)[0]), w); });
  });
  it("median, mode, range", () => {
    each((l, t) => t === "medianOdd" || t === "medianEven", (ex, w, t) => near(median(list(/av ([\d, ]+)\?/.exec(P(ex))![1])), num(acc(ex)[0]), w));
    each((l, t) => t === "mode", (ex, w, t) => { const a = list(/av ([\d, ]+)\?/.exec(P(ex))![1]); const c = a.map((x) => a.filter((y) => y === x).length), mx = Math.max(...c); expect(c.filter((x) => x === mx).length, `${w}: mode not unique`).toBe(mx); near(a[c.indexOf(mx)], num(acc(ex)[0]), w); });
    each((l, t) => t === "range", (ex, w, t) => { const a = list(/för ([\d, ]+)\?/.exec(P(ex))![1]); near(Math.max(...a) - Math.min(...a), num(acc(ex)[0]), w); });
    each((l, t) => t === "freqMedian", (ex, w, t) => { const rows = [...P(ex).matchAll(/(\d+) syskon – (\d+) elev/g)]; const all = rows.flatMap((m) => Array(Number(m[2])).fill(Number(m[1]))); near(median(all), num(acc(ex)[0]), w); });
    each((l, t) => t === "medianSteps", (ex, w, t) => { const a = list(/av ([\d, ]+) i steg/.exec(P(ex))![1]); expect(fields(ex), w).toEqual([a.length, (a.length + 1) / 2, median(a)]); });
    each((l, t) => t === "rangeSteps", (ex, w, t) => { const a = list(/Räkna ut ([\d, ]+):/.exec(P(ex))![1]); expect(fields(ex), w).toEqual([Math.max(...a), Math.min(...a), Math.max(...a) - Math.min(...a)]); });
    each((l, t) => t === "meanMedian", (ex, w, t) => { const a = list(/Talen är ([\d, ]+)\./.exec(P(ex))![1]); near(Math.abs(mean(a) - median(a)), num(acc(ex)[0]), w); });
    each((l, t) => t === "outlier", (ex, w, t) => { const a = list(/Talen är ([\d, ]+)\./.exec(P(ex))![1]); const rest = a.slice(0, -1).length ? a.filter((_, i) => i !== a.indexOf(Math.max(...a))) : a; expect(Math.abs(mean(a) - mean(rest)), w).toBeGreaterThan(Math.abs(median(a) - median(rest))); expect(mcText(ex), w).toBe("medelvärdet"); });
    each((l, t) => t === "modeBar", (ex, w, t) => { const v = vis(ex) as Extract<Visual, { type: "barchart" }>; expect(mcText(ex), w).toBe(v.cats[v.vals.indexOf(Math.max(...v.vals))]); });
    each((l, t) => t === "medianBar", (ex, w, t) => { const v = vis(ex) as Extract<Visual, { type: "barchart" }>; near(median(v.vals.flatMap((c, i) => Array(c).fill(i))), num(acc(ex)[0]), w); });
  });
});

describe("probability", () => {
  const dice: Record<string, (x: number) => boolean> = { "ett jämnt tal": (x) => x % 2 === 0, "ett tal större än 4": (x) => x > 4, "en sexa": (x) => x === 6, "ett tal mindre än 3": (x) => x < 3, "ett primtal": (x) => [2, 3, 5].includes(x), "inte en sexa": (x) => x !== 6 };
  it("marbles, spinners and dice", () => {
    each((l, t) => t === "marbleProb" || t === "probSteps", (ex, w, t) => { const v = vis(ex) as Extract<Visual, { type: "marbles" }>; const c = /(?:att den är|för) (röd|blå|grön|gul)/.exec(P(ex))![1]; const tot = sum(v.counts.map((x) => x.n)), k = v.counts.find((x) => x.color === c)!.n; if (ex.solution.kind === "numeric") near(frac(acc(ex)[0]), k / tot, w); else { near(fields(ex)[0], k, w); near(fields(ex)[1], tot, w); } });
    each((l, t) => t === "percentProb", (ex, w, t) => { const v = vis(ex) as Extract<Visual, { type: "marbles" }>; const c = /att den är (\S+)\?/.exec(P(ex))![1]; near(num(acc(ex)[0]), (v.counts.find((x) => x.color === c)!.n * 100) / sum(v.counts.map((x) => x.n)), w); });
    each((l, t) => t === "diceProb" || t === "diceSteps", (ex, w, t) => { const ev = Object.keys(dice).find((k) => P(ex).includes("få " + k + (t === "diceProb" ? "?" : ".")) )!; expect(ev, w).toBeTruthy(); const k = [1, 2, 3, 4, 5, 6].filter(dice[ev]).length; if (ex.solution.kind === "numeric") near(frac(acc(ex)[0]), k / 6, w); else { near(fields(ex)[0], k, w); near(frac(ex.solution.kind === "multifield" ? ex.solution.values[2][0] : "0"), k / 6, w); } });
    each((l, t) => t === "spinnerProb", (ex, w, t) => { const v = vis(ex) as Extract<Visual, { type: "spinner" }>; const c = /stannar på (\S+)\?/.exec(P(ex))![1]; near(frac(acc(ex)[0]), v.sectors.filter((x) => x === c).length / v.sectors.length, w); expect(P(ex), w).toContain(`${v.sectors.length} lika stora`); });
    each((l, t) => t === "mostLikely", (ex, w, t) => { const v = vis(ex) as Extract<Visual, { type: "marbles" }>; const mx = Math.max(...v.counts.map((x) => x.n)); expect(v.counts.filter((x) => x.n === mx).length, w).toBe(1); expect(mcText(ex), w).toBe(v.counts.find((x) => x.n === mx)!.color); });
    each((l, t) => t === "extremes", (ex, w, t) => { const v = vis(ex) as Extract<Visual, { type: "marbles" }>; expect(acc(ex)[0], w).toBe(v.counts[0].color === "blå" ? "1" : "0"); });
    each((l, t) => t === "complement", (ex, w, t) => { const m = /är (\d+)\/(\d+)\./.exec(P(ex))!; near(frac(acc(ex)[0]), 1 - Number(m[1]) / Number(m[2]), w); });
    each((l, t) => t === "wordMc", (ex, w, t) => { const m = /är (\d+)\/(\d+)\./.exec(P(ex))!; const p = Number(m[1]) / Number(m[2]); const word = p === 0 ? "omöjlig" : p === 1 ? "säker" : p === 0.5 ? "lika sannolik som inte" : p < 0.5 ? "osannolik" : "sannolik"; expect(mcText(ex), w).toBe(word); });
    each((l, t) => t === "markProb", (ex, w, t) => { const m = /är (\d+)\/(\d+)\./.exec(P(ex))!; if (ex.solution.kind !== "numberline" || ex.spec.kind !== "numberline") throw new Error(); expect(ex.solution.value / ex.spec.max, w).toBeCloseTo(Number(m[1]) / Number(m[2]), 9); expect(ex.spec.den, w).toBe(Number(m[2])); });
  });
  it("experiments and expectation", () => {
    each((l, t) => t === "relFreq" || t === "relSteps", (ex, w, t) => { const m = /(\d+) gånger (?:och får rött|och blir klave) (\d+) gånger|kastas (\d+) gånger och blir klave (\d+) gånger/.exec(P(ex)) ?? /(\d+) gånger och får rött (\d+) gånger/.exec(P(ex))!; const n = Number(m[1] ?? m[3]), k = Number(m[2] ?? m[4]); near(ex.solution.kind === "numeric" ? num(acc(ex)[0]) : fields(ex)[2], (k * 100) / n, w); });
    each((l, t) => t === "expected" || t === "expSteps", (ex, w, t) => { const m = /vinna är (\d+)\/(\d+)\. Hur många vinster förväntar du dig på (\d+) spel|vinna är (\d+)\/(\d+)\. Hur många vinster förväntas på (\d+) spel/.exec(P(ex))!; const a = Number(m[1] ?? m[4]), b = Number(m[2] ?? m[5]), N = Number(m[3] ?? m[6]); near(ex.solution.kind === "numeric" ? num(acc(ex)[0]) : fields(ex)[1], (N * a) / b, w); });
    each((l, t) => t === "expectedPct", (ex, w, t) => { const m = /är (\d+) %\. Hur många trasiga lampor förväntar du dig i en låda med (\d+) lampor/.exec(P(ex))!; near((Number(m[1]) * Number(m[2])) / 100, num(acc(ex)[0]), w); });
    each((l, t) => t === "diceSum" || t === "diceSumProb", (ex, w, t) => { const s = Number(/summan (?:blir )?(\d+)/.exec(P(ex))![1]); let c = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b === s) c++; near(t === "diceSum" ? num(acc(ex)[0]) : frac(acc(ex)[0]), t === "diceSum" ? c : c / 36, w); });
    each((l, t) => t === "gambler", (ex, w, t) => expect(acc(ex)[0], w).toBe(/mynt/.test(P(ex)) ? "1/2" : "1/6"));
    each((l, t) => t === "barPct", (ex, w, t) => { const v = vis(ex) as Extract<Visual, { type: "barchart" }>; const T = Number(/visar (\d+) snurrningar/.exec(P(ex))![1]); near(sum(v.vals), T, w); const c = /för (\S+),/.exec(P(ex))![1]; near(num(acc(ex)[0]), (v.vals[v.cats.findIndex((x) => x.toLowerCase() === c)] * 100) / T, w); });
    each((l, t) => t === "buildResults", (ex, w, t) => { const m = /kastades (\d+) gånger och blev klave (\d+) gånger/.exec(P(ex))!; if (ex.solution.kind !== "bars") throw new Error(); expect(ex.solution.values, w).toEqual([Number(m[2]), Number(m[1]) - Number(m[2])]); });
  });
});

describe("combinatorics (brute-force enumeration)", () => {
  it("counts agree with explicit enumeration", () => {
    each((l, t) => t === "outfits" || t === "outfitSteps" || t === "tableCount", (ex, w, t) => { let a: number, b: number; if (t === "tableCount") { const v = vis(ex) as Extract<Visual, { type: "combotable" }>; a = v.rows.length; b = v.cols.length; } else { const m = /(\d+) tröjor och (\d+) byxor/.exec(P(ex))!; a = Number(m[1]); b = Number(m[2]); } let c = 0; for (let i = 0; i < a; i++) for (let j = 0; j < b; j++) c++; near(ex.solution.kind === "numeric" ? num(acc(ex)[0]) : fields(ex)[2], c, w); });
    each((l, t) => t === "menu", (ex, w, t) => { const m = /(\d+) förrätter, (\d+) varmrätter och (\d+) efterrätter/.exec(P(ex))!; let c = 0; for (let i = 0; i < +m[1]; i++) for (let j = 0; j < +m[2]; j++) for (let k = 0; k < +m[3]; k++) c++; near(c, num(acc(ex)[0]), w); });
    each((l, t) => t === "lineup", (ex, w, t) => { const n = Number(/kan (\d+) personer/.exec(P(ex))![1]); const perms = (a: number[]): number[][] => (a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map((p) => [x, ...p]))); near(perms(Array.from({ length: n }, (_, i) => i)).length, num(acc(ex)[0]), w); });
    each((l, t) => t === "codes", (ex, w, t) => { const m = /består av (\d+) siffror, valda ur siffrorna 1–(\d+)\. Siffrorna (får inte|får) upprepas/.exec(P(ex))!; const L = Number(m[1]), d = Number(m[2]), rep = m[3] === "får"; let c = 0; const rec = (pos: number, used: number[]) => { if (pos === L) { c++; return; } for (let x = 1; x <= d; x++) if (rep || !used.includes(x)) rec(pos + 1, [...used, x]); }; rec(0, []); near(c, num(acc(ex)[0]), w); });
    each((l, t) => t === "handshakes" || t === "pairsPick" || t === "handshakeSteps", (ex, w, t) => { const n = Number(/(\d+) personer|av (\d+)\./.exec(P(ex))!.slice(1).find(Boolean)!); let c = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) c++; near(c, ex.solution.kind === "numeric" ? num(acc(ex)[0]) : fields(ex)[2], w); });
    each((l, t) => t === "medals", (ex, w, t) => { const n = Number(/(\d+) lag/.exec(P(ex))![1]); let c = 0; for (let g = 0; g < n; g++) for (let s = 0; s < n; s++) if (g !== s) c++; near(c, num(acc(ex)[0]), w); });
    each((l, t) => t === "addVsMul", (ex, w, t) => { const m = /(\d+) sorters bröd och (\d+) sorters pålägg/.exec(P(ex))!; expect(mcText(ex), w).toBe(`${m[1]} · ${m[2]}`); });
  });
});

describe("lesson 7: comparing and critical reading", () => {
  it("groups, axes, lines, shares", () => {
    each((l, t) => t === "meanCompare", (ex, w, t) => { const m = /Grupp A: ([\d, ]+)\. Grupp B: ([\d, ]+)\./.exec(P(ex))!; expect(mcText(ex), w).toBe(mean(list(m[1])) > mean(list(m[2])) ? "Grupp A" : "Grupp B"); });
    each((l, t) => t === "medianDiff", (ex, w, t) => { const m = /Grupp A: ([\d, ]+)\. Grupp B: ([\d, ]+)\./.exec(P(ex))!; near(Math.abs(median(list(m[1])) - median(list(m[2]))), num(acc(ex)[0]), w); });
    each((l, t) => t === "compareSteps", (ex, w, t) => { const m = /Grupp A: ([\d, ]+)\. Grupp B: ([\d, ]+)\./.exec(P(ex))!; expect(fields(ex), w).toEqual([mean(list(m[1])), mean(list(m[2])), Math.abs(mean(list(m[1])) - mean(list(m[2])))]); });
    each((l, t) => t === "truncRead", (ex, w, t) => { const v = vis(ex) as Extract<Visual, { type: "barchart" }>; expect(v.min, w).toBeGreaterThan(0); near(v.vals[0] - v.vals[1], num(acc(ex)[0]), w); });
    each((l, t) => t === "truncMc", (ex, w, t) => { const v = vis(ex) as Extract<Visual, { type: "barchart" }>; expect(v.min, w).toBeGreaterThan(0); expect(v.vals[0] / v.vals[1], w).toBeLessThan(2); const m = /\((\d+)\).*\((\d+)\)/.exec(mcText(ex))!; expect([Number(m[1]), Number(m[2])], w).toEqual(v.vals); /* it looks double: heights above the cut-off */ near((v.vals[0] - (v.min ?? 0)) / (v.vals[1] - (v.min ?? 0)), 2, w); });
    each((l, t) => t === "axisRead", (ex, w, t) => { const v = vis(ex) as Extract<Visual, { type: "barchart" }>; near(v.vals[0], num(acc(ex)[0]), w); });
    each((l, t) => t === "lineRise", (ex, w, t) => { const v = vis(ex) as Extract<Visual, { type: "linechart" }>; const rises = [1, 2, 3, 4].map((i) => v.ys[i] - v.ys[i - 1]); const best = rises.indexOf(Math.max(...rises)); expect(mcText(ex), w).toBe(`${v.xs[best]}–${v.xs[best + 1]}`); });
    each((l, t) => t === "shareBar", (ex, w, t) => { const v = vis(ex) as Extract<Visual, { type: "barchart" }>; const T = Number(/från (\d+) personer/.exec(P(ex))![1]); near(sum(v.vals), T, w); const c = /valde (\S+)\?/.exec(P(ex))![1]; near(num(acc(ex)[0]), (v.vals[v.cats.findIndex((x) => x.toLowerCase() === c)] * 100) / T, w); });
  });
});
