import { describe, expect, it } from "vitest";
import { ALL_LESSONS } from "@/lib/content";
import { makeRng } from "@/lib/engine/rng";
import { perimeterPts, shoelace } from "@/lib/engine/gen-helpers";
import type { ConcreteExercise, P2, Template, Visual } from "@/lib/engine/types";
import { QUADS } from "@/lib/content/w10/geo";

/**
 * Independent geometry checks. The generators build pictures from coordinates and answers from formulas;
 * here every answer is recomputed from the *picture data itself* (coordinates, tick marks, angle labels,
 * mirror lines) with separate code (shoelace area, distances, dot products, brute-force symmetry).
 */
const SEEDS = 120;
const W10 = ALL_LESSONS.filter((l) => l.worldId === "w10");
type Poly = Extract<Visual, { type: "polygon" }>;

const len = (a: P2, b: P2) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const sideLens = (pts: P2[]) => pts.map((p, i) => len(p, pts[(i + 1) % pts.length]));
function angleDeg(pts: P2[], i: number) {
  const n = pts.length, v = pts[i], p = pts[(i + n - 1) % n], q = pts[(i + 1) % n];
  const ux = p[0] - v[0], uy = p[1] - v[1], wx = q[0] - v[0], wy = q[1] - v[1];
  return (Math.acos((ux * wx + uy * wy) / (Math.hypot(ux, uy) * Math.hypot(wx, wy))) * 180) / Math.PI;
}
const num = (s: string) => parseFloat(s.replace(",", "."));

/** Validates everything a polygon picture claims. Returns the picture's scale (labelled length / drawn length), if any. */
function checkPolygon(v: Poly, where: string): number | undefined {
  const L = sideLens(v.pts);
  // equal-side ticks: same ticks <=> same length
  const t = v.ticks ?? [];
  for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++) {
    if (t[i] > 0 && t[j] > 0) {
      const same = Math.abs(L[i] - L[j]) < 1e-6;
      expect(same, `${where}: ticks ${t[i]}/${t[j]} on sides ${i}/${j} (lengths ${L[i].toFixed(3)}, ${L[j].toFixed(3)})`).toBe(t[i] === t[j]);
    }
  }
  // labelled lengths must be proportional to drawn lengths (one common scale)
  let scale: number | undefined;
  (v.sides ?? []).forEach((txt, i) => {
    const m = /^([\d.,]+) cm$/.exec(txt);
    if (!m) return;
    const s = num(m[1]) / L[i];
    if (scale === undefined) scale = s;
    expect(Math.abs(s - scale) / scale, `${where}: side ${i} labelled ${txt} but drawn ${L[i].toFixed(3)} (scale ${s} vs ${scale})`).toBeLessThan(1e-6);
  });
  for (const d of v.dash ?? []) {
    const m = d.label ? /^([\d.,]+) cm$/.exec(d.label) : null;
    if (m && scale !== undefined) expect(Math.abs(len(d.a, d.b) * scale - num(m[1])), `${where}: dashed height label`).toBeLessThan(1e-6);
  }
  for (const r of v.right ?? []) expect(Math.abs(angleDeg(v.pts, r) - 90), `${where}: right-angle mark at vertex ${r}`).toBeLessThan(1e-6);
  for (const a of v.angles ?? []) {
    const m = /^(\d+)°$/.exec(a.text);
    if (m) expect(Math.abs(angleDeg(v.pts, a.at) - Number(m[1])), `${where}: angle label ${a.text} at vertex ${a.at} (drawn ${angleDeg(v.pts, a.at).toFixed(2)}°)`).toBeLessThan(0.05);
  }
  return scale;
}

function each(filter: (lessonId: string, tplId: string) => boolean, fn: (ex: ConcreteExercise, where: string) => void) {
  let matched = 0;
  for (const l of W10) for (const group of [l.knowledge, l.method, l.representation] as Template[][]) for (const t of group) {
    if (!filter(l.id, t.id)) continue;
    matched++;
    for (let s = 0; s < SEEDS; s++) fn(t.gen(makeRng(`geo${s}`), { level: 1 }), `${l.id}/${t.id}/seed${s}`);
  }
  expect(matched, "filter matched no template (misnamed id would make a test vacuous)").toBeGreaterThan(0);
}
const accept0 = (ex: ConcreteExercise) => (ex.solution.kind === "numeric" ? num(ex.solution.accept[0]) : NaN);
const fields = (ex: ConcreteExercise) => (ex.solution.kind === "multifield" ? ex.solution.values.map((v) => num(v[0])) : []);
const visual = (ex: ConcreteExercise) => (ex.spec.kind === "mc" || ex.spec.kind === "numeric" || ex.spec.kind === "multifield" ? ex.spec.visual : undefined);
const near = (a: number, b: number, where: string) => expect(Math.abs(a - b), `${where}: expected ${b}, got ${a}`).toBeLessThan(1e-6);

describe("geometry: every polygon picture is internally consistent", () => {
  it("lesson theory pictures (ticks, labels, right angles, angle labels)", () => {
    for (const l of W10) for (const th of l.theory) if (th.visual?.type === "polygon") checkPolygon(th.visual, `${l.id} theory "${th.heading}"`);
  });
  it("generated pictures in all templates", () => {
    each(() => true, (ex, where) => { const v = visual(ex); if (v?.type === "polygon") checkPolygon(v, where); });
  });
  it("the quadrilateral table matches real geometry (right angles, parallel sides, equal sides)", () => {
    for (const [name, q] of Object.entries(QUADS)) {
      const rights = q.pts.filter((_, i) => Math.abs(angleDeg(q.pts, i) - 90) < 1e-6).length;
      expect(rights, `${name} right angles`).toBe(q.rightAngles);
      const cross = (i: number, j: number) => { const a = q.pts, n = 4; const d1: P2 = [a[(i + 1) % n][0] - a[i][0], a[(i + 1) % n][1] - a[i][1]], d2: P2 = [a[(j + 1) % n][0] - a[j][0], a[(j + 1) % n][1] - a[j][1]]; return Math.abs(d1[0] * d2[1] - d1[1] * d2[0]) < 1e-9; };
      const parallel = (cross(0, 2) ? 1 : 0) + (cross(1, 3) ? 1 : 0);
      expect(parallel, `${name} parallel pairs`).toBe(q.parallel);
    }
  });
});

describe("geometry: perimeter and area answers agree with the pictures", () => {
  it("lesson 2 – perimeter", () => {
    each((l, t) => l === "w10-l2" && ["rectPerim", "triPerim", "lPerim", "gridPerim"].includes(t), (ex, where) => {
      const v = visual(ex) as Poly; const sc = checkPolygon(v, where) ?? 1;
      near(perimeterPts(v.pts) * sc, accept0(ex), where);
    });
    each((l, t) => l === "w10-l2" && t === "rectSteps", (ex, where) => { const v = visual(ex) as Poly; const f = fields(ex); near(perimeterPts(v.pts), f[1], where); near(perimeterPts(v.pts) / 2, f[0], where); });
    each((l, t) => l === "w10-l2" && t === "lSides", (ex, where) => {
      const v = visual(ex) as Poly; const L = sideLens(v.pts); const f = fields(ex);
      near(L[1], f[0], where); near(L[4], f[1], where); near(perimeterPts(v.pts), f[2], where);
    });
    each((l, t) => l === "w10-l2" && t === "gridSame", (ex, where) => { const v = visual(ex) as Poly; const L = sideLens(v.pts); const f = fields(ex); near(L[0], f[0], where); near(L[1], f[1], where); near(perimeterPts(v.pts), f[2], where); });
  });
  it("lesson 3 – area", () => {
    each((l, t) => l === "w10-l3" && ["rectArea", "lArea", "gridCount"].includes(t), (ex, where) => {
      const v = visual(ex) as Poly; const sc = checkPolygon(v, where) ?? 1;
      near(shoelace(v.pts) * sc * sc, accept0(ex), where);
    });
    each((l, t) => l === "w10-l3" && ["areaPerim", "gridBoth"].includes(t), (ex, where) => { const v = visual(ex) as Poly; const sc = checkPolygon(v, where) ?? 1; const f = fields(ex); near(shoelace(v.pts) * sc * sc, f[0], where); near(perimeterPts(v.pts) * sc, f[1], where); });
    each((l, t) => l === "w10-l3" && t === "lSplit", (ex, where) => { const v = visual(ex) as Poly; const sc = checkPolygon(v, where) ?? 1; const f = fields(ex); near(shoelace(v.pts) * sc * sc, f[2], where); near(f[0] - f[1], f[2], where); });
  });
  it("lesson 4 – parallelograms and triangles (area = shoelace, height is perpendicular)", () => {
    each((l, t) => l === "w10-l4" && ["paraArea", "triArea", "rightTri", "obtuseTri"].includes(t), (ex, where) => {
      const v = visual(ex) as Poly; const sc = checkPolygon(v, where) ?? 1;
      near(shoelace(v.pts) * sc * sc, accept0(ex), where);
      // a dashed height must be perpendicular to the base (a horizontal line here) and end on the base's line
      for (const d of v.dash ?? []) if (d.label) { expect(d.a[0], where).toBe(d.b[0]); expect(d.b[1], where).toBe(0); }
    });
    each((l, t) => l === "w10-l4" && ["paraSteps", "triSteps"].includes(t), (ex, where) => { const v = visual(ex) as Poly; const sc = checkPolygon(v, where) ?? 1; const f = fields(ex); near(shoelace(v.pts) * sc * sc, f[1], where); });
  });
  it("lesson 4 – the labelled height really is the perpendicular height, not the slanted side", () => {
    each((l, t) => l === "w10-l4" && t === "whichHeight", (ex, where) => {
      const v = visual(ex) as Poly; const d = v.dash![0];
      const h = len(d.a, d.b);
      if (ex.spec.kind !== "mc" || ex.solution.kind !== "mc") throw new Error("mc expected");
      near(num(ex.spec.options[ex.solution.value]), h, where);
    });
  });
});

describe("geometry: volume pictures", () => {
  it("cuboid labels, layer counts and volumes", () => {
    each((l, t) => l === "w10-l5" && t === "cuboidVol", (ex, where) => { const v = visual(ex) as Extract<Visual, { type: "cuboid" }>; near(v.l * v.b * v.h, accept0(ex), where); expect(v.labels!.map(num)).toEqual([v.l, v.b, v.h]); });
    each((l, t) => l === "w10-l5" && t === "cuboidCount", (ex, where) => { const v = visual(ex) as Extract<Visual, { type: "cuboid" }>; near(v.l * v.b * v.h, accept0(ex), where); });
    each((l, t) => l === "w10-l5" && t === "volSteps", (ex, where) => { const v = visual(ex) as Extract<Visual, { type: "cuboid" }>; const f = fields(ex); near(v.l * v.b, f[0], where); near(v.h, f[1], where); near(v.l * v.b * v.h, f[2], where); });
    each((l, t) => l === "w10-l5" && t === "exprMc", (ex, where) => {
      const v = visual(ex) as Extract<Visual, { type: "cuboid" }>;
      if (ex.spec.kind !== "mc" || ex.solution.kind !== "mc") throw new Error();
      const evalExpr = (s: string) => Function(`"use strict"; return (${s.replace(/·/g, "*")});`)() as number;
      const vals = ex.spec.options.map(evalExpr);
      const right = ex.solution.value;
      expect(vals[right], where).toBe(v.l * v.b * v.h);
      vals.forEach((x, i) => { if (i !== right) expect(x, `${where}: wrong option equals the volume`).not.toBe(v.l * v.b * v.h); });
    });
  });
});

describe("geometry: angles", () => {
  it("triangle with two known angles: the missing angle is 180 - sum and matches the drawing", () => {
    each((l, t) => l === "w10-l6" && t === "triMissing", (ex, where) => {
      const v = visual(ex) as Poly; checkPolygon(v, where);
      near(angleDeg(v.pts, 2), accept0(ex), where);
      near(angleDeg(v.pts, 0) + angleDeg(v.pts, 1) + angleDeg(v.pts, 2), 180, where);
    });
  });
  it("isosceles base angle matches the drawing", () => {
    each((l, t) => l === "w10-l6" && t === "isoBase", (ex, where) => {
      const v = visual(ex) as Poly; checkPolygon(v, where);
      near(angleDeg(v.pts, 0), accept0(ex), where); near(angleDeg(v.pts, 1), accept0(ex), where);
    });
  });
  it("protractor reading equals the drawn angle; estimates pick the nearest option", () => {
    each((l, t) => l === "w10-l6" && t === "readProtractor", (ex, where) => { const v = visual(ex) as Extract<Visual, { type: "angle" }>; expect(v.protractor).toBe(true); near(v.deg, accept0(ex), where); expect(v.deg % 10, where).toBe(0); });
    each((l, t) => l === "w10-l6" && t === "estimate", (ex, where) => {
      const v = visual(ex) as Extract<Visual, { type: "angle" }>;
      if (ex.spec.kind !== "mc" || ex.solution.kind !== "mc") throw new Error();
      const opts = ex.spec.options.map((o) => num(o));
      const nearest = opts.reduce((b, o) => (Math.abs(o - v.deg) < Math.abs(b - v.deg) ? o : b), opts[0]);
      near(nearest, num(ex.spec.options[ex.solution.value]), where);
      const sorted = [...opts].sort((a, b) => Math.abs(a - v.deg) - Math.abs(b - v.deg));
      expect(Math.abs(sorted[1] - v.deg) - Math.abs(sorted[0] - v.deg), `${where}: estimate is ambiguous`).toBeGreaterThan(10);
    });
  });
  it("clock angle (independent hour-hand formula) and turns", () => {
    each((l, t) => l === "w10-l6" && t === "clock", (ex, where) => {
      const h = Number(/Klockan är (\d+)\.00/.exec((ex.spec as { prompt: string }).prompt)![1]);
      const hour = (h % 12) * 30, a = Math.abs(hour - 0); near(Math.min(a, 360 - a), accept0(ex), where);
    });
    each((l, t) => l === "w10-l1" && t === "triByAngles", (ex, where) => {
      const m = /vinklarna (\d+)°, (\d+)° och (\d+)°/.exec((ex.spec as { prompt: string }).prompt)!; const a = [1, 2, 3].map((i) => Number(m[i]));
      expect(a[0] + a[1] + a[2], where).toBe(180);
      const kind = a.some((x) => x === 90) ? "rätvinklig" : a.some((x) => x > 90) ? "trubbvinklig" : "spetsvinklig";
      if (ex.spec.kind !== "mc" || ex.solution.kind !== "mc") throw new Error();
      expect(ex.spec.options[ex.solution.value], where).toContain(kind);
    });
  });
});

describe("geometry: lesson 1 triangle names", () => {
  it("triangle sides decide the name (checked from the drawn side lengths)", () => {
    each((l, t) => l === "w10-l1" && t === "triBySides", (ex, where) => {
      const v = visual(ex) as Poly; const L = sideLens(v.pts).map((x) => Math.round(x * 1e6) / 1e6);
      const eq = (a: number, b: number) => Math.abs(a - b) < 1e-6;
      const kind = eq(L[0], L[1]) && eq(L[1], L[2]) ? "liksidig" : eq(L[0], L[1]) || eq(L[1], L[2]) || eq(L[0], L[2]) ? "likbent" : "oliksidig";
      if (ex.spec.kind !== "mc" || ex.solution.kind !== "mc") throw new Error();
      expect(ex.spec.options[ex.solution.value], where).toBe(`${kind} triangel`);
    });
  });
});

/** ------ symmetry: brute force reflections ------ */
function reflect(p: P2, a: P2, b: P2): P2 {
  const dx = b[0] - a[0], dy = b[1] - a[1], t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy);
  const fx = a[0] + t * dx, fy = a[1] + t * dy;
  return [2 * fx - p[0], 2 * fy - p[1]];
}
const sameSet = (A: P2[], B: P2[]) => A.every((p) => B.some((q) => Math.hypot(p[0] - q[0], p[1] - q[1]) < 1e-6));
function countSymmetryLines(pts: P2[]): number {
  const axes: [P2, P2][] = [];
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
    const m: P2 = [(pts[i][0] + pts[j][0]) / 2, (pts[i][1] + pts[j][1]) / 2], d: P2 = [pts[j][0] - pts[i][0], pts[j][1] - pts[i][1]];
    const a = m, b: P2 = [m[0] - d[1], m[1] + d[0]]; // perpendicular bisector
    if (sameSet(pts.map((p) => reflect(p, a, b)), pts)) {
      const ang = ((Math.atan2(b[1] - a[1], b[0] - a[0]) % Math.PI) + Math.PI) % Math.PI;
      const dist = Math.abs(((b[1] - a[1]) * (0 - a[0]) - (b[0] - a[0]) * (0 - a[1])) / Math.hypot(b[0] - a[0], b[1] - a[1]));
      if (!axes.some(([x]) => Math.abs(x[0] - ang) < 1e-6 && Math.abs(x[1] - dist) < 1e-6)) axes.push([[ang, dist] as unknown as P2, a]);
    }
  }
  return axes.length;
}

describe("geometry: symmetry (brute-force reflection)", () => {
  it("number of symmetry lines of regular polygons and named figures", () => {
    each((l, t) => l === "w10-l7" && ["linesRegular", "linesNamed"].includes(t), (ex, where) => { const v = visual(ex) as Poly; near(countSymmetryLines(v.pts), accept0(ex), where); });
    each((l, t) => l === "w10-l7" && t === "symTable", (ex) => expect(fields(ex).every((x) => x >= 0 && x <= 4)).toBe(true));
  });
  it("dashed line is a symmetry line exactly when reflecting the figure gives the same figure", () => {
    each((l, t) => l === "w10-l7" && t === "isLine", (ex, where) => {
      const v = visual(ex) as Poly; const d = v.dash![0];
      const yes = sameSet(v.pts.map((p) => reflect(p, d.a, d.b)), v.pts);
      if (ex.spec.kind !== "mc" || ex.solution.kind !== "mc") throw new Error();
      expect(ex.spec.options[ex.solution.value].startsWith("Ja"), where).toBe(yes);
    });
  });
});

/** ------ coordinates: tapped points ------ */
describe("geometry: coordinate-plane answers agree with the pictures", () => {
  it("mirror images are exact reflections in the shown mirror line", () => {
    each((l, t) => l === "w10-l7" && ["pointMirrorV", "pointMirrorH", "polyMirror"].includes(t), (ex, where) => {
      if (ex.spec.kind !== "point" || ex.solution.kind !== "point") throw new Error();
      const pl = ex.spec.plane;
      const lbl = /hörnet ([ABC])/.exec(ex.spec.prompt)?.[1] ?? "P";
      const src = pl.points!.find((p) => p.label === lbl)!;
      const a: P2 = pl.mirrorX != null ? [pl.mirrorX, 0] : [0, pl.mirrorY!], b: P2 = pl.mirrorX != null ? [pl.mirrorX, 1] : [1, pl.mirrorY!];
      const img = reflect([src.x, src.y], a, b);
      near(img[0], ex.solution.x, where); near(img[1], ex.solution.y, where);
      expect(ex.solution.x, `${where}: image inside the plane`).toBeLessThanOrEqual(pl.xmax);
      expect(ex.solution.y, where).toBeLessThanOrEqual(pl.ymax);
      expect(Math.abs(src.x - (pl.mirrorX ?? -999)) + Math.abs(src.y - (pl.mirrorY ?? -999)) > 0, `${where}: point lies on the mirror line`).toBe(true);
    });
  });
  it("every tapped answer lies inside its plane", () => {
    each(() => true, (ex, where) => { if (ex.spec.kind === "point" && ex.solution.kind === "point") { expect(ex.solution.x, where).toBeGreaterThanOrEqual(0); expect(ex.solution.x, where).toBeLessThanOrEqual(ex.spec.plane.xmax); expect(ex.solution.y, where).toBeGreaterThanOrEqual(0); expect(ex.solution.y, where).toBeLessThanOrEqual(ex.spec.plane.ymax); } });
  });
  it("plot-the-point and rule-on-a-line answers follow the prompt", () => {
    each((l, t) => l === "w10-l8" && t === "plotPoint", (ex, where) => {
      const m = /\((\d+), (\d+)\)/.exec((ex.spec as { prompt: string }).prompt)!;
      if (ex.solution.kind !== "point") throw new Error(); expect([ex.solution.x, ex.solution.y], where).toEqual([Number(m[1]), Number(m[2])]);
    });
    each((l, t) => l === "w10-l8" && t === "ruleTap", (ex, where) => {
      const p = (ex.spec as { prompt: string }).prompt; const m = /y = (\d*)x(?: \+ (\d+))?/.exec(p)!; const a = m[1] === "" ? 1 : Number(m[1]), b = Number(m[2] ?? 0), x = Number(/x = (\d+)/.exec(p)![1]);
      if (ex.solution.kind !== "point") throw new Error(); expect([ex.solution.x, ex.solution.y], where).toEqual([x, a * x + b]);
    });
    each((l, t) => l === "w10-l8" && t === "fourthCorner", (ex, where) => {
      if (ex.spec.kind !== "point" || ex.solution.kind !== "point") throw new Error();
      const [A, B, C] = ex.spec.plane.points!; // D = A + C - B for a parallelogram, and axis-parallel sides => a rectangle
      expect([ex.solution.x, ex.solution.y], where).toEqual([A.x + C.x - B.x, A.y + C.y - B.y]);
      expect(A.y, where).toBe(B.y); expect(B.x, where).toBe(C.x);
    });
  });
  it("rectangle from coordinates: perimeter, area and distance", () => {
    each((l, t) => l === "w10-l8" && ["coordPerim", "coordArea", "rectCoordSteps"].includes(t), (ex, where) => {
      const v = visual(ex) as Extract<Visual, { type: "coordplane" }>; const poly = v.poly!;
      if (ex.solution.kind === "numeric") near(/omkrets/.test((ex.spec as { prompt: string }).prompt) ? perimeterPts(poly) : shoelace(poly), accept0(ex), where);
      else { const f = fields(ex); near(len(poly[0], poly[1]), f[0], where); near(len(poly[1], poly[2]), f[1], where); near(shoelace(poly), f[2], where); }
      // the corners listed in the prompt equal the drawn corners
      const given = [...(ex.spec as { prompt: string }).prompt.matchAll(/([ABCD])\((\d+), (\d+)\)/g)].map((m) => [Number(m[2]), Number(m[3])]);
      expect(given, where).toEqual(poly);
    });
    each((l, t) => l === "w10-l8" && t === "dist", (ex, where) => {
      const v = visual(ex) as Extract<Visual, { type: "coordplane" }>; const [A, B] = v.points!;
      expect(A.x === B.x || A.y === B.y, where).toBe(true);
      near(Math.abs(A.x - B.x) + Math.abs(A.y - B.y), accept0(ex), where);
    });
    each((l, t) => l === "w10-l8" && t === "readCoord", (ex, where) => {
      const v = visual(ex) as Extract<Visual, { type: "coordplane" }>; const p = v.points![0];
      near(/x-värdet/.test((ex.spec as { prompt: string }).prompt) ? p.x : p.y, accept0(ex), where);
    });
  });
  it("the table rule is the only option that fits all three rows", () => {
    each((l, t) => l === "w10-l8" && t === "tableRule", (ex, where) => {
      if (ex.spec.kind !== "mc" || ex.solution.kind !== "mc") throw new Error();
      const ys = /y = ([\d, ]+)\./.exec(ex.spec.prompt)![1].split(",").map(Number);
      const fits = ex.spec.options.map((o) => { const m = /y = (\d*)x(?: ([+−]) (\d+))?/.exec(o)!; const a = m[1] === "" ? 1 : Number(m[1]), b = m[3] ? (m[2] === "+" ? 1 : -1) * Number(m[3]) : 0; return [1, 2, 3].every((x, i) => a * x + b === ys[i]); });
      expect(fits.filter(Boolean).length, where).toBe(1);
      expect(fits[ex.solution.value], where).toBe(true);
    });
  });
});

describe("geometry: solids, circles and facts", () => {
  const TABLE: Record<string, { faces: number; edges: number; verts: number }> = { kub: { faces: 6, edges: 12, verts: 8 }, rätblock: { faces: 6, edges: 12, verts: 8 }, triangelprisma: { faces: 5, edges: 9, verts: 6 }, "kvadratisk pyramid": { faces: 5, edges: 8, verts: 5 } };
  it("Euler's formula holds for the table, and counting answers use it", () => {
    for (const [n, s] of Object.entries(TABLE)) expect(s.verts - s.edges + s.faces, n).toBe(2);
    each((l, t) => l === "w10-l9" && t === "partsText", (ex, where) => {
      const p = (ex.spec as { prompt: string }).prompt; const m = /Hur många (sidoytor|kanter|hörn) har en (.+)\?/.exec(p)!;
      const key = { sidoytor: "faces", kanter: "edges", hörn: "verts" }[m[1] as "sidoytor"] as "faces";
      near(TABLE[m[2]][key], accept0(ex), where);
    });
    each((l, t) => l === "w10-l9" && t === "solidTable", (ex, where) => { const n = /för en (.+)\./.exec((ex.spec as { prompt: string }).prompt)![1]; const f = fields(ex); expect(f, where).toEqual([TABLE[n].faces, TABLE[n].edges, TABLE[n].verts]); });
    each((l, t) => l === "w10-l9" && t === "solidCount", (ex, where) => {
      const shape = (visual(ex) as Extract<Visual, { type: "solid" }>).shape; const n = { cube: "kub", cuboid: "rätblock", prism: "triangelprisma", pyramid: "kvadratisk pyramid" }[shape as "cube"];
      const m = /Hur många (sidoytor|kanter|hörn)/.exec((ex.spec as { prompt: string }).prompt)!; near(TABLE[n][{ sidoytor: "faces", kanter: "edges", hörn: "verts" }[m[1] as "sidoytor"] as "faces"], accept0(ex), where);
    });
  });
  it("cube wire and diameter", () => {
    each((l, t) => l === "w10-l9" && t === "cubeWire", (ex, where) => { const s = Number(/kant är (\d+) cm/.exec((ex.spec as { prompt: string }).prompt)![1]); near(12 * s, accept0(ex), where); });
    each((l, t) => l === "w10-l9" && t === "radDiam", (ex, where) => {
      const p = (ex.spec as { prompt: string }).prompt; const v = Number(/(\d+) cm/.exec(p)![1]);
      near(/radien/.test(p.split("Hur")[0]) ? 2 * v : v / 2, accept0(ex), where);
    });
  });
});
