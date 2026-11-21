import type { Rng } from "./rng";
import type { ConcreteExercise, P2, PlaneSpec, Rubric } from "./types";

export const sv = (n: number | string): string => {
  // Swedish grouping with non-breaking space for integers, decimal comma
  const s = String(n);
  const neg = s.startsWith("-");
  const [int, dec] = s.replace("-", "").split(".");
  const g = int.length > 4 ? int.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : int;
  return (neg ? "−" : "") + g + (dec ? "," + dec : "");
};

/** Math version for KaTeX (thin spaces between digit groups, decimal comma in braces). */
export const tex = (n: number | string): string => {
  const s = String(n);
  const neg = s.startsWith("-");
  const [int, dec] = s.replace("-", "").split(".");
  const g = int.length > 4 ? int.replace(/\B(?=(\d{3})+(?!\d))/g, "\\,") : int;
  return (neg ? "-" : "") + g + (dec ? "{,}" + dec : "");
};

export function mc(
  id: string,
  skill: string,
  prompt: string,
  correct: string,
  wrong: { text: string; note?: string }[],
  explanation: string,
  hints: string[],
  rng: Rng,
): ConcreteExercise {
  const uniqWrong: { text: string; note?: string }[] = [];
  for (const w of wrong) if (w.text !== correct && !uniqWrong.some((u) => u.text === w.text)) uniqWrong.push(w);
  const options = rng.shuffle([{ text: correct, correct: true, note: undefined as string | undefined }, ...uniqWrong.slice(0, 3).map((w) => ({ ...w, correct: false }))]);
  const idx = options.findIndex((o) => o.correct);
  const distractorNotes: Record<number, string> = {};
  options.forEach((o, i) => { if (o.note) distractorNotes[i] = o.note; });
  return {
    spec: { kind: "mc", id, skill, prompt, options: options.map((o) => o.text) },
    solution: { kind: "mc", value: idx },
    explanation,
    hints,
    distractorNotes,
  };
}

export function numeric(
  id: string, skill: string, prompt: string, answer: string | number | (string | number)[],
  explanation: string, hints: string[], unit?: string,
): ConcreteExercise {
  const accept = (Array.isArray(answer) ? answer : [answer]).map(String);
  return { spec: { kind: "numeric", id, skill, prompt, unit }, solution: { kind: "numeric", accept }, explanation, hints };
}

export function multifield(
  id: string, skill: string, prompt: string,
  fields: { label: string; suffix?: string; accept: (string | number)[] }[],
  explanation: string, hints: string[],
): ConcreteExercise {
  return {
    spec: { kind: "multifield", id, skill, prompt, fields: fields.map((f) => ({ label: f.label, suffix: f.suffix })) },
    solution: { kind: "multifield", values: fields.map((f) => f.accept.map(String)) },
    explanation, hints,
  };
}

export function textTask(
  id: string, skill: string, prompt: string, scenario: string, minChars: number,
  rubric: Rubric, modelAnswer: string,
): ConcreteExercise {
  return {
    spec: { kind: "text", id, skill, prompt, scenario, minChars },
    solution: { kind: "text", rubric, modelAnswer },
    explanation: modelAnswer,
    hints: [],
  };
}

/** Decompose n into place-value parts, largest first, skipping zeros. e.g. 4305 -> [4000,300,5] */
export function placeParts(n: number): number[] {
  const s = String(n);
  const out: number[] = [];
  for (let i = 0; i < s.length; i++) {
    const d = Number(s[i]);
    if (d) out.push(d * 10 ** (s.length - 1 - i));
  }
  return out;
}

export function digitsNoZero(rng: Rng, len: number, allowZero = true): number {
  let s = String(rng.int(1, 9));
  for (let i = 1; i < len; i++) s += String(allowZero ? rng.int(0, 9) : rng.int(1, 9));
  return Number(s);
}

// ---------- written-method exercises ----------

export function columnSolution(op: "add" | "sub" | "mul", a: number, b: number) {
  const width = Math.max(String(a).length, String(b).length);
  const da = String(a).padStart(width, "0").split("").reverse().map(Number);
  const db = String(b).padStart(width, "0").split("").reverse().map(Number);
  if (op === "add") {
    const carries: string[] = [];
    let c = 0;
    for (let i = 0; i < width - 1; i++) {
      const s = da[i] + db[i] + c;
      c = s >= 10 ? 1 : 0;
      carries.push(c ? "1" : "");
    }
    return { result: String(a + b), carries, partials: [] as string[] };
  }
  if (op === "sub") {
    if (a < b) throw new Error("column sub requires a >= b");
    const carries: string[] = [];
    let borrow = 0;
    for (let i = 0; i < width - 1; i++) {
      const need = da[i] < db[i] + borrow;
      carries.push(need ? "1" : "");
      borrow = need ? 1 : 0;
    }
    return { result: String(a - b), carries, partials: [] as string[] };
  }
  const bd = String(b).split("").reverse().map(Number);
  const partials = bd.map((d, i) => String(a * d * 10 ** i));
  return { result: String(a * b), carries: [] as string[], partials: bd.length > 1 ? partials : [] };
}

export function columnEx(
  id: string, skill: string, op: "add" | "sub" | "mul", a: number, b: number,
  explanation: string, hints: string[], prompt?: string, dp?: number,
): ConcreteExercise {
  const sol = columnSolution(op, a, b);
  return {
    spec: { kind: "column", id, skill, op, a, b, ...(dp ? { dp } : {}), prompt: prompt ?? "Räkna med uppställning och skriv dina mellansteg." },
    solution: { kind: "column", ...sol },
    explanation, hints,
  };
}

export function areaEx(
  id: string, skill: string, a: number, b: number, explanation: string, hints: string[], prompt?: string,
): ConcreteExercise {
  const aParts = placeParts(a);
  const bParts = placeParts(b);
  const cells: string[] = [];
  for (const bp of bParts) for (const ap of aParts) cells.push(String(ap * bp));
  return {
    spec: { kind: "areamodel", id, skill, a, b, aParts, bParts, prompt: prompt ?? `Rita upp en areamodell för ${a} · ${b}. Fyll i varje delprodukt och sedan summan.` },
    solution: { kind: "areamodel", cells, total: String(a * b) },
    explanation, hints,
  };
}

export function numberlineEx(
  id: string, skill: string, prompt: string, value: number,
  line: { min: number; max: number; step: number; labelEvery: number; format?: "int" | "dec1"; den?: number; dp?: number; unit?: string },
  explanation: string, hints: string[],
): ConcreteExercise {
  return {
    spec: { kind: "numberline", id, skill, prompt, ...line },
    solution: { kind: "numberline", value },
    explanation, hints,
  };
}

export function fractionbarEx(
  id: string, skill: string, prompt: string, parts: number, shaded: number, explanation: string, hints: string[],
): ConcreteExercise {
  return {
    spec: { kind: "fractionbar", id, skill, prompt, parts },
    solution: { kind: "fractionbar", value: shaded },
    explanation, hints,
  };
}

export function withVisual(ex: ConcreteExercise, visual: import("./types").Visual): ConcreteExercise {
  if (ex.spec.kind === "mc" || ex.spec.kind === "numeric" || ex.spec.kind === "multifield" || ex.spec.kind === "expr") {
    return { ...ex, spec: { ...ex.spec, visual } };
  }
  return ex;
}

// ---------- long division (liggande stolen) ----------

/** Digit-by-digit bus-stop division. Starts at the first prefix of `a` that is >= b. */
export function longdivSolution(a: number, b: number) {
  const ds = String(a).split("").map(Number);
  let p0 = 0;
  let cur = ds[0];
  while (cur < b && p0 < ds.length - 1) { p0++; cur = cur * 10 + ds[p0]; }
  const q: string[] = [], prod: string[] = [], rem: string[] = [];
  let r = 0;
  for (let i = p0; i < ds.length; i++) {
    if (i > p0) cur = r * 10 + ds[i];
    const qd = Math.floor(cur / b);
    q.push(String(qd)); prod.push(String(qd * b));
    r = cur - qd * b; rem.push(String(r));
  }
  return { q, prod, rem, p0, quotient: Math.floor(a / b), remainder: a % b };
}

export function longdivEx(
  id: string, skill: string, a: number, b: number, explanation: string, hints: string[], prompt?: string,
): ConcreteExercise {
  const s = longdivSolution(a, b);
  return {
    spec: { kind: "longdiv", id, skill, a, b, p0: s.p0, prompt: prompt ?? `Räkna ${a} ÷ ${b} med liggande stolen. Skriv kvotsiffra, produkt och rest i varje steg.` },
    solution: { kind: "longdiv", q: s.q, prod: s.prod, rem: s.rem, quotient: s.quotient, remainder: s.remainder },
    explanation, hints,
  };
}

// ---------- fractions ----------
export const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
export const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;
/** KaTeX for a fraction. */
export const tf = (n: number, d: number) => `\\frac{${n}}{${d}}`;
/** Accepted typed forms of n/d: reduced, as written, and a whole number if it is one. */
export function fracAcc(n: number, d: number): string[] {
  const g = gcd(n, d), rn = n / g, rd = d / g;
  const out = [rd === 1 ? String(rn) : `${rn}/${rd}`];
  if (!out.includes(`${n}/${d}`)) out.push(`${n}/${d}`);
  return out;
}
/** Label for tick value v on a fraction line whose unit interval has `den` parts. */
export const fracLabel = (v: number, den: number) => (v % den === 0 ? String(v / den) : `${v}/${den}`);

// ---------- decimals ----------
/** Format n (an integer count of 10^-dp) with a Swedish decimal comma and exactly dp decimals: dc(435,2) -> "4,35". */
export function dc(n: number, dp: number): string {
  const neg = n < 0;
  const s = String(Math.abs(n)).padStart(dp + 1, "0");
  const i = s.slice(0, s.length - dp), f = s.slice(s.length - dp);
  return (neg ? "\u2212" : "") + (dp ? `${i},${f}` : i);
}
/** Same, with trailing decimal zeros removed: dcTrim(480,2) -> "4,8", dcTrim(500,2) -> "5". */
export function dcTrim(n: number, dp: number): string {
  const t = dc(n, dp);
  return t.includes(",") ? t.replace(/0+$/, "").replace(/,$/, "") : t;
}
/** Accepted typed answers (canonical number compare ignores comma/dot and trailing zeros). */
export const dcAcc = (n: number, dp: number): string[] => [dcTrim(n, dp).replace(",", ".")];
/** Tick label on a number line whose ticks are integers: fractions (den), decimals (dp) or plain. */
export function tickLabel(v: number, den?: number, dp?: number, unit?: string): string {
  const base = den ? fracLabel(v, den) : dp ? dcTrim(v, dp) : sv(v);
  return unit ? `${base}\u00a0${unit}` : base;
}

// ---------- percent ----------
/** p % of N, asserting the result is a whole number (generators must choose N so it is). */
export function pctOf(p: number, N: number): number {
  if ((p * N) % 100 !== 0) throw new Error(`${p}% of ${N} is not whole`);
  return (p * N) / 100;
}
/** A base N for which p % of N is a whole number, scaled by `mult` (step = 100/gcd(p,100)). */
export function baseFor(p: number, mult: number): number {
  return (100 / gcd(p, 100)) * mult;
}
/** Percent text with Swedish spacing: "35 %". */
export const pc = (p: number | string) => `${p}\u00a0%`;

export function gridshadeEx(id: string, skill: string, prompt: string, value: number, explanation: string, hints: string[]): ConcreteExercise {
  return { spec: { kind: "gridshade", id, skill, prompt }, solution: { kind: "gridshade", value }, explanation, hints };
}

// ---------- algebra ----------
export function exprEx(
  id: string, skill: string, prompt: string, accept: string, explanation: string, hints: string[],
  opts: { variable?: string; simplified?: boolean; visual?: import("./types").Visual } = {},
): ConcreteExercise {
  return {
    spec: { kind: "expr", id, skill, prompt, variable: opts.variable ?? "n", ...(opts.visual ? { visual: opts.visual } : {}) },
    solution: { kind: "expr", accept, simplified: opts.simplified },
    explanation, hints,
  };
}

/** Square patterns: figure n is a list of column heights. total(n) = a·n + b. */
export const SQUARE_PATTERNS: Record<string, { a: number; b: number; heights: (n: number) => number[] }> = {
  double: { a: 2, b: 0, heights: (n) => Array(n).fill(2) },
  hook: { a: 2, b: 1, heights: (n) => [n + 1, ...Array(n).fill(1)] },
  ell: { a: 2, b: -1, heights: (n) => [n, ...Array(Math.max(0, n - 1)).fill(1)] },
  towers: { a: 3, b: 1, heights: (n) => [...Array(n).fill(3), 1] },
};

// ---------- geometry ----------

export function pointEx(id: string, skill: string, prompt: string, plane: PlaneSpec, x: number, y: number, explanation: string, hints: string[]): ConcreteExercise {
  return { spec: { kind: "point", id, skill, prompt, plane }, solution: { kind: "point", x, y }, explanation, hints };
}
export const rectPts = (w: number, h: number): P2[] => [[0, 0], [w, 0], [w, h], [0, h]];
/** Regular n-gon with a horizontal bottom side, circumradius r. */
export function regularPts(n: number, r = 1): P2[] {
  const out: P2[] = [];
  const start = -Math.PI / 2 - Math.PI / n; // first vertex bottom-left of bottom side
  for (let i = 0; i < n; i++) out.push([r * Math.cos(start + (2 * Math.PI * i) / n), r * Math.sin(start + (2 * Math.PI * i) / n)]);
  return out;
}
/** Polygon area by the shoelace formula (independent of the generators' own formulas). */
export function shoelace(pts: P2[]): number {
  let s = 0;
  for (let i = 0; i < pts.length; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length]; s += x1 * y2 - x2 * y1; }
  return Math.abs(s) / 2;
}
export function perimeterPts(pts: P2[]): number {
  let s = 0;
  for (let i = 0; i < pts.length; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length]; s += Math.hypot(x2 - x1, y2 - y1); }
  return s;
}
/** Rectilinear L-shape: outer w×h with a notch of nw×nh removed from the top-right corner. Counter-clockwise from the origin. */
export function lShape(w: number, h: number, nw: number, nh: number): P2[] {
  return [[0, 0], [w, 0], [w, h - nh], [w - nw, h - nh], [w - nw, h], [0, h]];
}
