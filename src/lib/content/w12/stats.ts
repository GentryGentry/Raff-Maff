import type { Rng } from "@/lib/engine/rng";
import type { Visual } from "@/lib/engine/types";

export const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);
export const meanOf = (a: number[]) => sum(a) / a.length;
export function medianOf(a: number[]) { const s = [...a].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; }
/** The single most frequent value, or null if there is a tie. */
export function modeOf(a: number[]): number | null {
  const c = new Map<number, number>(); for (const x of a) c.set(x, (c.get(x) ?? 0) + 1);
  const m = Math.max(...c.values()); const tops = [...c].filter(([, k]) => k === m);
  return tops.length === 1 ? tops[0][0] : null;
}
export const rangeOf = (a: number[]) => Math.max(...a) - Math.min(...a);
export const fmt = (n: number) => String(n).replace(".", ",");
export const accNum = (n: number) => [String(n)];

/** n values in [lo,hi] whose mean is an integer (or x.5 when half is set and n is even). */
export function meanData(rng: Rng, n: number, lo: number, hi: number, half = false): number[] {
  for (;;) {
    const a = Array.from({ length: n }, () => rng.int(lo, hi)), s = sum(a);
    if (half ? n % 2 === 0 && s % n === n / 2 : s % n === 0) return a;
  }
}
export const PLUR: Record<string, string> = { röd: "röda", blå: "blå", grön: "gröna", gul: "gula", lila: "lila" };
export const COLOR_NAMES = ["röd", "blå", "grön", "gul"];

const CAT_SETS: { topic: string; cats: string[] }[] = [
  { topic: "favoritfrukt", cats: ["Äpple", "Banan", "Päron", "Apelsin", "Druva"] },
  { topic: "favoritsport", cats: ["Fotboll", "Bandy", "Dans", "Schack", "Simning"] },
  { topic: "husdjur", cats: ["Katt", "Hund", "Fisk", "Fågel", "Kanin"] },
];
/** A bar chart whose values can be read exactly off the axis. */
export function barData(rng: Rng, nCats = rng.int(4, 5), vmax?: number) {
  const set = rng.pick(CAT_SETS), cats = set.cats.slice(0, nCats);
  const step = rng.pick([1, 2, 5, 10]), unit = step % 2 === 0 ? step / 2 : step;
  const K = Math.max(2, Math.floor((vmax ?? 5 * step) / unit));
  let vals: number[];
  do vals = cats.map(() => unit * rng.int(1, K)); while (new Set(vals).size < 3);
  const mx = Math.max(...vals), max = step * Math.ceil(mx / step);
  return { topic: set.topic, cats, vals, step, max, visual: { type: "barchart", cats, vals, max, step } as Visual };
}
