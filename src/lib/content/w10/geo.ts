import type { P2, Visual } from "@/lib/engine/types";

/** Triangle with side lengths s0 = |AB|, s1 = |BC|, s2 = |CA|, A at the origin and AB along the x-axis. */
export function triPts(s0: number, s1: number, s2: number): P2[] {
  const x = (s2 * s2 + s0 * s0 - s1 * s1) / (2 * s0);
  const y = Math.sqrt(Math.max(s2 * s2 - x * x, 0));
  return [[0, 0], [s0, 0], [x, y]];
}

/** Triangle with angles A and B (degrees) at the ends of a base of length L. */
export function triFromAngles(A: number, B: number, L = 6): P2[] {
  const rad = (d: number) => (d * Math.PI) / 180;
  const C = 180 - A - B;
  const ac = (L * Math.sin(rad(B))) / Math.sin(rad(C));
  return [[0, 0], [L, 0], [ac * Math.cos(rad(A)), ac * Math.sin(rad(A))]];
}

export const polyV = (pts: P2[], extra: Partial<Extract<Visual, { type: "polygon" }>> = {}): Visual => ({ type: "polygon", pts, ...extra });
export const cmL = (n: number) => `${n} cm`;

/** Quadrilaterals as drawn in lesson 1 (and reused by lesson 7). */
export const QUADS: Record<string, { pts: P2[]; ticks: number[]; right?: number[]; parallel: number; rightAngles: number }> = {
  kvadrat: { pts: [[0, 0], [3, 0], [3, 3], [0, 3]], ticks: [1, 1, 1, 1], right: [0, 1, 2, 3], parallel: 2, rightAngles: 4 },
  rektangel: { pts: [[0, 0], [5, 0], [5, 3], [0, 3]], ticks: [1, 2, 1, 2], right: [0, 1, 2, 3], parallel: 2, rightAngles: 4 },
  parallellogram: { pts: [[0, 0], [4, 0], [5, 2], [1, 2]], ticks: [1, 2, 1, 2], parallel: 2, rightAngles: 0 },
  romb: { pts: [[0, 0], [5, 0], [8, 4], [3, 4]], ticks: [1, 1, 1, 1], parallel: 2, rightAngles: 0 },
  drake: { pts: [[2, 0], [5, 2], [2, 8], [-1, 2]], ticks: [1, 2, 2, 1], parallel: 0, rightAngles: 0 },
  parallelltrapets: { pts: [[0, 0], [6, 0], [4, 3], [1, 3]], ticks: [0, 0, 0, 0], parallel: 1, rightAngles: 0 },
};

export const TRI_NAMES = { equi: "liksidig triangel", iso: "likbent triangel", scal: "oliksidig triangel" } as const;
