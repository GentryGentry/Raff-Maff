import type { Rng } from "./rng";

export type Section = "knowledge" | "method" | "representation" | "pedagogy";
export const SECTIONS: Section[] = ["knowledge", "method", "representation", "pedagogy"];
export const SECTION_LABEL: Record<Section, string> = {
  knowledge: "Kunskapsprov",
  method: "Skriftlig metod",
  representation: "Representation",
  pedagogy: "Pedagogik",
};

export type P2 = [number, number];
/** A first-quadrant coordinate plane with optional shown points, polygon and mirror line. */
export interface PlaneSpec {
  xmax: number;
  ymax: number;
  points?: { x: number; y: number; label?: string }[];
  poly?: P2[];
  mirrorX?: number; // vertical mirror line x = m
  mirrorY?: number; // horizontal mirror line y = m
}

export type Visual =
  | { type: "placevalue"; value: number }
  | { type: "baseten"; value: number }
  | { type: "numberline"; min: number; max: number; step: number; marks?: number[]; labelEvery?: number; den?: number; dp?: number; unit?: string }
  | { type: "fractionbar"; parts: number; shaded: number }
  | { type: "fractionbars"; bars: { parts: number; shaded: number; label?: string }[] }
  | { type: "fractioncircle"; parts: number; shaded: number }
  | { type: "fractionset"; total: number; groups: number; shadedGroups: number }
  | { type: "decimalplace"; value: string }
  | { type: "decimalgrid"; hundredths: number }
  | { type: "thermometer"; value: number; min?: number; max?: number }
  | { type: "balance"; left: string; right: string; tilt?: "left" | "right" | "level" }
  | { type: "dotpattern"; figures: number[][] }
  | { type: "percentbar"; pct: number; label?: string }
  | { type: "doublenumberline"; total: number; unit?: string; hideTotal?: boolean; marks: { pct: number; showAmount?: boolean }[] }
  | { type: "area"; a: number; b: number }
  | { type: "grouping"; value: number }
  | { type: "compare"; a: number; b: number }
  | {
      type: "polygon";
      pts: P2[]; // math coordinates (y up); may be fractional for regular polygons
      grid?: boolean; // draw unit grid over the figure's bounding box
      sides?: string[]; // label per side i (pts[i] -> pts[i+1]); "" = none
      right?: number[]; // vertex indices that get a right-angle mark
      ticks?: number[]; // equal-side tick marks per side i (0..3)
      vlabels?: string[]; // vertex letters
      angles?: { at: number; text: string }[]; // angle labels inside vertex
      dash?: { a: P2; b: P2; label?: string }[]; // dashed helper lines (height, axis, diagonal)
    }
  | { type: "angle"; deg: number; protractor?: boolean; base?: "left" | "right"; label?: string }
  | ({ type: "coordplane" } & PlaneSpec)
  | { type: "cuboid"; l: number; b: number; h: number; labels?: [string, string, string] }
  | { type: "barchart"; cats: string[]; vals: number[]; max: number; step: number; min?: number; unit?: string }
  | { type: "linechart"; xs: string[]; ys: number[]; max: number; step: number; min?: number; unit?: string }
  | { type: "pictogram"; rows: { label: string; count: number }[]; per: number }
  | { type: "marbles"; counts: { color: string; n: number }[] } // color: röd | blå | grön | gul | lila
  | { type: "spinner"; sectors: string[] } // equal sectors, colour names
  | { type: "combotable"; rows: string[]; cols: string[] }
  | { type: "ruler"; cm: number; from: number; to: number } // from/to in mm
  | { type: "clock"; h: number; m: number }
  | { type: "circle"; line: "radius" | "diameter" | "both"; rLabel?: string; dLabel?: string }
  | { type: "solid"; shape: "cylinder" | "cone" | "pyramid" | "sphere" | "prism" | "cube" | "cuboid" };

export type ColumnOp = "add" | "sub" | "mul";

/** What the learner sees. Never contains the solution. */
export type ExerciseSpec =
  | { kind: "mc"; id: string; skill: string; prompt: string; options: string[]; visual?: Visual }
  | { kind: "numeric"; id: string; skill: string; prompt: string; unit?: string; visual?: Visual }
  | { kind: "column"; id: string; skill: string; prompt: string; op: ColumnOp; a: number; b: number; dp?: number }
  | { kind: "numberline"; id: string; skill: string; prompt: string; min: number; max: number; step: number; labelEvery: number; format?: "int" | "dec1" | "frac"; den?: number; dp?: number; unit?: string }
  | { kind: "fractionbar"; id: string; skill: string; prompt: string; parts: number }
  | { kind: "areamodel"; id: string; skill: string; prompt: string; a: number; b: number; aParts: number[]; bParts: number[] }
  | { kind: "longdiv"; id: string; skill: string; prompt: string; a: number; b: number; p0: number }
  | { kind: "gridshade"; id: string; skill: string; prompt: string }
  | { kind: "point"; id: string; skill: string; prompt: string; plane: PlaneSpec }
  | { kind: "bars"; id: string; skill: string; prompt: string; cats: string[]; max: number }
  | { kind: "expr"; id: string; skill: string; prompt: string; variable: string; visual?: Visual }
  | { kind: "multifield"; id: string; skill: string; prompt: string; fields: { label: string; suffix?: string }[]; visual?: Visual }
  | { kind: "text"; id: string; skill: string; prompt: string; scenario?: string; minChars: number };

export type Answer =
  | { kind: "mc"; value: number | null }
  | { kind: "numeric"; value: string }
  | { kind: "column"; result: string; carries: string[]; partials: string[] }
  | { kind: "numberline"; value: number | null }
  | { kind: "fractionbar"; value: number }
  | { kind: "areamodel"; cells: string[]; total: string }
  | { kind: "longdiv"; q: string[]; prod: string[]; rem: string[] }
  | { kind: "gridshade"; value: number }
  | { kind: "point"; x: number | null; y: number | null }
  | { kind: "bars"; values: number[] }
  | { kind: "expr"; value: string }
  | { kind: "multifield"; values: string[] }
  | { kind: "text"; value: string };

/** Server-side truth. */
export type Solution =
  | { kind: "mc"; value: number }
  | { kind: "numeric"; accept: string[] } // normalised accepted forms
  | { kind: "column"; result: string; carries: string[]; partials: string[] }
  | { kind: "numberline"; value: number }
  | { kind: "fractionbar"; value: number }
  | { kind: "areamodel"; cells: string[]; total: string }
  | { kind: "longdiv"; q: string[]; prod: string[]; rem: string[]; quotient: number; remainder: number }
  | { kind: "gridshade"; value: number }
  | { kind: "point"; x: number; y: number }
  | { kind: "bars"; values: number[] }
  | { kind: "expr"; accept: string; simplified?: boolean }
  | { kind: "multifield"; values: string[][] } // each field: list of accepted values
  | { kind: "text"; rubric: Rubric; modelAnswer: string };

export interface Rubric {
  concepts: { id: string; label: string; any: string[] }[]; // any keyword (lowercase substring) counts
  minConcepts: number;
  /** Phrases that signal a known misconception; each one fails the answer. */
  misconceptions?: { pattern: string; message: string }[];
}

export interface ConcreteExercise {
  spec: ExerciseSpec;
  solution: Solution;
  explanation: string; // why the answer is right (Swedish, may contain $math$)
  hints: string[];
  /** misconception tag shown when a wrong answer matches a typical error */
  distractorNotes?: Record<number, string>;
}

export interface Template {
  id: string;
  skill: string;
  gen: (rng: Rng, ctx: { level: number }) => ConcreteExercise;
}

export interface ItemResult {
  id: string;
  skill: string;
  kind: ExerciseSpec["kind"];
  points: number;
  max: number;
  correct: boolean; // full result correct
  methodOk?: boolean;
  feedback: string;
  correctAnswerText?: string;
}
