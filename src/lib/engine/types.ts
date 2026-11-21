import type { Rng } from "./rng";

export type Section = "knowledge" | "method" | "representation" | "pedagogy";
export const SECTIONS: Section[] = ["knowledge", "method", "representation", "pedagogy"];
export const SECTION_LABEL: Record<Section, string> = {
  knowledge: "Kunskapsprov",
  method: "Skriftlig metod",
  representation: "Representation",
  pedagogy: "Pedagogik",
};

export type Visual =
  | { type: "placevalue"; value: number }
  | { type: "baseten"; value: number }
  | { type: "numberline"; min: number; max: number; step: number; marks?: number[]; labelEvery?: number; den?: number; dp?: number }
  | { type: "fractionbar"; parts: number; shaded: number }
  | { type: "fractionbars"; bars: { parts: number; shaded: number; label?: string }[] }
  | { type: "fractioncircle"; parts: number; shaded: number }
  | { type: "fractionset"; total: number; groups: number; shadedGroups: number }
  | { type: "decimalplace"; value: string }
  | { type: "decimalgrid"; hundredths: number }
  | { type: "area"; a: number; b: number }
  | { type: "grouping"; value: number }
  | { type: "compare"; a: number; b: number };

export type ColumnOp = "add" | "sub" | "mul";

/** What the learner sees. Never contains the solution. */
export type ExerciseSpec =
  | { kind: "mc"; id: string; skill: string; prompt: string; options: string[]; visual?: Visual }
  | { kind: "numeric"; id: string; skill: string; prompt: string; unit?: string; visual?: Visual }
  | { kind: "column"; id: string; skill: string; prompt: string; op: ColumnOp; a: number; b: number; dp?: number }
  | { kind: "numberline"; id: string; skill: string; prompt: string; min: number; max: number; step: number; labelEvery: number; format?: "int" | "dec1" | "frac"; den?: number; dp?: number }
  | { kind: "fractionbar"; id: string; skill: string; prompt: string; parts: number }
  | { kind: "areamodel"; id: string; skill: string; prompt: string; a: number; b: number; aParts: number[]; bParts: number[] }
  | { kind: "longdiv"; id: string; skill: string; prompt: string; a: number; b: number; p0: number }
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
