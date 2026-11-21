import { dcAcc, dcTrim, mc, numeric, multifield, sv, withVisual } from "@/lib/engine/gen-helpers";
import type { Rng } from "@/lib/engine/rng";
import type { ConcreteExercise, Visual } from "@/lib/engine/types";

/** A unit; e = exponent of 10 of the finest unit in the set (mm, g, ml, cm²) it contains. */
export interface U { n: string; e: number }
export const LEN: U[] = [{ n: "mm", e: 0 }, { n: "cm", e: 1 }, { n: "dm", e: 2 }, { n: "m", e: 3 }, { n: "km", e: 6 }];
export const MASS: U[] = [{ n: "g", e: 0 }, { n: "kg", e: 3 }, { n: "ton", e: 6 }];
export const VOL: U[] = [{ n: "ml", e: 0 }, { n: "cl", e: 1 }, { n: "dl", e: 2 }, { n: "l", e: 3 }];
export const AREA: U[] = [{ n: "cm²", e: 0 }, { n: "dm²", e: 2 }, { n: "m²", e: 4 }];

interface Opts { maxGap?: number; maxDec?: number; dir?: "up" | "down" }
/** A random conversion a -> b. N = the quantity as an integer number of the finest unit; vA/vB the written values. */
export function pickConv(rng: Rng, set: U[], o: Opts = {}) {
  const { maxGap = 3, maxDec = 3, dir } = o;
  for (;;) {
    const a = rng.pick(set), b = rng.pick(set);
    if (a === b) continue;
    const gap = Math.abs(a.e - b.e);
    if (gap > maxGap) continue;
    if (dir === "down" && !(a.e > b.e)) continue;
    if (dir === "up" && !(a.e < b.e)) continue;
    const q = rng.int(0, Math.min(2, a.e)), m = rng.int(2, 999);
    const N = m * 10 ** (a.e - q);
    if (Math.max(0, b.e - a.e + q) > maxDec) continue;
    return { a, b, N, gap, vA: dcTrim(N, a.e), vB: dcTrim(N, b.e) };
  }
}
export const pow = (g: number) => sv(10 ** g);

export function convEx(rng: Rng, skill: string, set: U[], o: Opts = {}): ConcreteExercise {
  const c = pickConv(rng, set, o);
  const how = c.a.e > c.b.e ? `${c.a.n} är större än ${c.b.n}: 1 ${c.a.n} = ${pow(c.gap)} ${c.b.n}. Det går därför åt fler ${c.b.n}, så vi multiplicerar med ${pow(c.gap)}.` : `${c.a.n} är mindre än ${c.b.n}: ${pow(c.gap)} ${c.a.n} = 1 ${c.b.n}. Det går åt färre ${c.b.n}, så vi dividerar med ${pow(c.gap)}.`;
  return numeric(`cv-${c.vA}-${c.a.n}-${c.b.n}`, skill, `Skriv om ${c.vA} ${c.a.n} i ${c.b.n}.`, dcAcc(c.N, c.b.e), `${how} ${c.vA} ${c.a.n} = ${c.vB} ${c.b.n}.`, ["Vilken enhet är störst? Fler eller färre av den mindre enheten?"], c.b.n);
}
export function convSteps(rng: Rng, skill: string, set: U[], o: Opts = {}): ConcreteExercise {
  const c = pickConv(rng, set, o);
  const big = c.a.e > c.b.e ? c.a : c.b, small = c.a.e > c.b.e ? c.b : c.a;
  return multifield(`cs-${c.vA}-${c.a.n}-${c.b.n}`, skill, `Skriv om ${c.vA} ${c.a.n} i ${c.b.n} i steg.`, [
    { label: `Hur många ${small.n} går på 1 ${big.n}?`, accept: [10 ** c.gap] },
    { label: `Svar i ${c.b.n}`, suffix: c.b.n, accept: dcAcc(c.N, c.b.e) },
  ], `1 ${big.n} = ${pow(c.gap)} ${small.n}. ${c.vA} ${c.a.n} = ${c.vB} ${c.b.n}.`, ["Mellan två enheter är det alltid en tiopotens (10, 100, 1 000 …)."]);
}
/** "3 m 45 cm" -> cm */
export function mixedEx(rng: Rng, skill: string, set: U[]): ConcreteExercise {
  for (;;) {
    const a = rng.pick(set), b = rng.pick(set);
    const gap = a.e - b.e;
    if (gap < 1 || gap > 3) continue;
    const k = rng.int(1, 9), s = rng.int(1, 10 ** gap - 1);
    return numeric(`mx-${k}-${a.n}-${s}-${b.n}`, skill, `Skriv om ${k} ${a.n} ${s} ${b.n} i ${b.n}.`, k * 10 ** gap + s, `${k} ${a.n} = ${k * 10 ** gap} ${b.n}. Lägg till ${s}: ${k * 10 ** gap + s} ${b.n}.`, [`1 ${a.n} = ${pow(gap)} ${b.n}.`], b.n);
  }
}
/** Add (or subtract) two quantities in different units; answer in the smaller unit. */
export function sumEx(rng: Rng, skill: string, set: U[], minus = false): ConcreteExercise {
  for (;;) {
    const a = rng.pick(set), b = rng.pick(set);
    const gap = a.e - b.e;
    if (gap < 1 || gap > 3) continue;
    const q = rng.int(0, Math.min(1, gap)), m = rng.int(2, 99);
    const Na = m * 10 ** (a.e - q), s = rng.int(2, 9 * 10 ** Math.max(gap - 1, 0));
    const Ns = s * 10 ** b.e;
    if (minus && Na <= Ns) continue;
    const tot = minus ? Na - Ns : Na + Ns;
    const va = dcTrim(Na, a.e);
    return numeric(`${minus ? "df" : "sm"}-${va}-${a.n}-${s}-${b.n}`, skill,
      minus ? `Från ${va} ${a.n} tar du bort ${s} ${b.n}. Hur många ${b.n} är kvar?` : `Lägg ihop ${va} ${a.n} och ${s} ${b.n}. Svara i ${b.n}.`,
      (tot / 10 ** b.e).toString(), `Gör om ${va} ${a.n} till ${dcTrim(Na, b.e)} ${b.n}. ${minus ? "Subtrahera" : "Addera"} ${s}: ${dcTrim(tot, b.e)} ${b.n}.`, ["Räkna i samma enhet."], b.n);
  }
}
/** Which of four quantities (in mixed units) is the largest? */
export function cmpEx(rng: Rng, skill: string, set: U[], what: string): ConcreteExercise {
  for (;;) {
    const items = Array.from({ length: 4 }, () => { const u = rng.pick(set), q = rng.int(0, Math.min(2, u.e)), N = rng.int(2, 999) * 10 ** (u.e - q); return { u, N, t: `${dcTrim(N, u.e)} ${u.n}` }; });
    const Ns = items.map((i) => i.N), m = Math.max(...Ns);
    if (new Set(Ns).size < 4 || new Set(items.map((i) => i.t)).size < 4) continue;
    if (items.some((i) => i.N === m && Ns.filter((x) => x === m).length > 1)) continue;
    const best = items.find((i) => i.N === m)!;
    return mc(`cmp-${items.map((i) => i.t).join("|")}`, skill, `Vilken ${what} är störst?`, best.t, items.filter((i) => i !== best).map((i) => ({ text: i.t })), `Skriv alla i samma enhet (${set[0].n}): ${items.map((i) => `${i.t} = ${i.N} ${set[0].n}`).join("; ")}. Störst är ${best.t}.`, ["Gör om alla till samma enhet först."], rng);
  }
}
/** balance with a quantity in two units */
export function balanceConv(rng: Rng, skill: string, set: U[]): ConcreteExercise {
  const c = pickConv(rng, set);
  return withVisual(numeric(`bq-${c.vA}-${c.a.n}-${c.b.n}`, skill, "Vågen är i balans. Vad ska stå i rutan (□)?", dcAcc(c.N, c.b.e), `Båda sidor är lika mycket: ${c.vA} ${c.a.n} = ${c.vB} ${c.b.n}.`, ["Samma mängd, skriven i två enheter."], c.b.n), { type: "balance", left: `${c.vA} ${c.a.n}`, right: `□ ${c.b.n}`, tilt: "level" } as Visual);
}
export function signBalance(rng: Rng, skill: string, set: U[]): ConcreteExercise {
  for (;;) {
    const u1 = rng.pick(set), u2 = rng.pick(set);
    if (u1 === u2) continue;
    const q1 = rng.int(0, Math.min(2, u1.e)), N1 = rng.int(2, 99) * 10 ** (u1.e - q1);
    const eq = rng.chance(0.3);
    const f = Math.min(u2.e, 2); // keep the second value tidy
    let N2 = eq ? N1 : N1 + rng.pick([-1, 1]) * rng.int(1, 20) * 10 ** (u2.e - f);
    if (N2 <= 0 || (eq && N1 % 10 ** (u2.e - f) !== 0 && u2.e > u1.e + 2)) continue;
    if (!eq && N2 === N1) continue;
    const t1 = `${dcTrim(N1, u1.e)} ${u1.n}`, t2 = `${dcTrim(N2, u2.e)} ${u2.n}`;
    if (t1 === t2) continue;
    if (dcTrim(N2, u2.e).split(",")[1]?.length > 3) continue;
    const sign = N1 < N2 ? "<" : N1 > N2 ? ">" : "=";
    return withVisual(mc(`sg-${t1}-${t2}`, skill, "Vilket tecken ska stå mellan sidorna?", sign, ["<", ">", "="].filter((x) => x !== sign).map((text) => ({ text })), `Samma enhet: ${N1} och ${N2} (${set[0].n}). ${t1} ${sign} ${t2}.`, ["Gör om till samma enhet."], rng), { type: "balance", left: t1, right: t2, tilt: N1 > N2 ? "left" : N1 < N2 ? "right" : "level" } as Visual);
  }
}
