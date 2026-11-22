import { ALL_LESSONS, bossWorldId, getLesson, getWorld, isBossId } from "@/lib/content";
import type { Lesson } from "@/lib/content/types";
import { gradeExercise } from "./grading";
import { makeRng } from "./rng";
import { textTask } from "./gen-helpers";
import type { Answer, ConcreteExercise, ItemResult, Section, Template } from "./types";

export type AssessmentKind = Section | "boss" | "revision" | "academy";

export const PASS_THRESHOLD: Record<string, number> = {
  knowledge: 0.8,
  method: 0.75,
  representation: 0.75,
  pedagogy: 1,
  boss: 0.8,
  revision: 0,
  academy: 1,
};

export const SECTION_SIZE: Record<string, number> = { knowledge: 10, method: 2, representation: 2, pedagogy: 1, boss: 15 };

function build(tpls: Template[], count: number, seed: string, level: number): ConcreteExercise[] {
  if (tpls.length === 0) return [];
  const order = makeRng(seed + ":order").shuffle(tpls);
  const out: ConcreteExercise[] = [];
  for (let i = 0; i < count; i++) {
    const t = order[i % order.length];
    const ex = t.gen(makeRng(`${seed}:${t.id}:${i}`), { level });
    out.push({ ...ex, spec: { ...ex.spec, id: `${i}:${ex.spec.id}` } as ConcreteExercise["spec"] });
  }
  return out;
}

export function teacherExercise(lesson: Lesson, seed: string): ConcreteExercise {
  const t = lesson.teacher;
  const rng = makeRng(seed + ":teacher");
  const scenario = rng.pick(t.scenarios);
  return textTask(`teacher-${lesson.id}`, `${lesson.id}.pedagogy`, t.prompt, scenario, t.minChars, t.rubric, t.modelAnswer);
}

/** Variant 0 är lärarutmaningen i lektionen. Variant k (k ≥ 1) är elevfall nummer k ur lektionen, bedömt av AI. */
export const academyVariants = (lesson: Lesson, withAi: boolean) => 1 + (withAi ? lesson.pupils.length : 0);
export const variantOf = (seed: string) => Number(/~v(\d+)$/.exec(seed)?.[1] ?? 0);

export function pupilExercise(lesson: Lesson, index: number, seed: string): ConcreteExercise {
  const p = lesson.pupils[index];
  return textTask(
    `pupil-${lesson.id}-${index}`, `${lesson.id}.pupil`,
    "Hur svarar du eleven? Förklara vad som inte stämmer och hjälp eleven vidare, gärna med ett konkret exempel eller en modell.",
    `${p.pupil} (åk 4–6) säger: ”${p.said}”`, 120,
    { aiOnly: true, minConcepts: 2, concepts: [{ id: "miss", label: `Visar vad eleven har missförstått (${p.misconception})`, any: [] }, { id: "help", label: "Ger en korrekt förklaring eller ett konkret sätt att hjälpa eleven vidare", any: [] }] },
    p.response,
  );
}

export function generateAssessment(
  lessonId: string,
  kind: AssessmentKind,
  seed: string,
  opts?: { skills?: string[]; count?: number },
): ConcreteExercise[] {
  if (kind === "boss") {
    const world = getWorld(bossWorldId(lessonId));
    if (!world) return [];
    const tpls = world.lessons.flatMap((l) => l.knowledge);
    return build(tpls, SECTION_SIZE.boss, seed, 2);
  }
  if (kind === "revision") {
    const wanted = new Set(opts?.skills ?? []);
    const tpls = ALL_LESSONS.flatMap((l) => [...l.knowledge, ...l.method, ...l.representation]).filter((t) => wanted.has(t.skill));
    return build(tpls, opts?.count ?? 6, seed, 1);
  }
  const lesson = getLesson(lessonId);
  if (!lesson) return [];
  switch (kind) {
    case "knowledge": return build(lesson.knowledge, SECTION_SIZE.knowledge, seed, 1);
    case "method": return build(lesson.method, SECTION_SIZE.method, seed, 1);
    case "representation": return build(lesson.representation, SECTION_SIZE.representation, seed, 1);
    case "pedagogy": return [teacherExercise(lesson, seed)];
    case "academy": {
      const v = variantOf(seed);
      return [v >= 1 && lesson.pupils[v - 1] ? pupilExercise(lesson, v - 1, seed) : teacherExercise(lesson, seed)];
    }
  }
}

export interface GradedSet {
  items: ItemResult[];
  points: number;
  max: number;
  ratio: number;
  passed: boolean;
}

export function gradeSet(kind: AssessmentKind, exercises: ConcreteExercise[], answers: (Answer | undefined)[]): GradedSet {
  const items = exercises.map((ex, i) => gradeExercise(ex, answers[i]));
  const points = items.reduce((a, b) => a + b.points, 0);
  const max = items.reduce((a, b) => a + b.max, 0);
  const ratio = max === 0 ? 0 : points / max;
  const threshold = PASS_THRESHOLD[kind] ?? 1;
  // text items must individually pass
  const textsOk = items.filter((i) => i.kind === "text").every((i) => i.correct);
  return { items, points, max, ratio, passed: ratio >= threshold - 1e-9 && textsOk };
}

export const knownLessonId = (id: string) => isBossId(id) ? !!getWorld(bossWorldId(id))?.lessons.length : !!getLesson(id);
