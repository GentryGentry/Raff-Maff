import { ALL_LESSONS, BUILT_WORLDS, WORLDS } from "@/lib/content";
import type { AttemptRow, ProgressRow, SkillStat } from "@/lib/server/types";
import { lessonUnlocked, type ProgressMap } from "./unlock";

export type MasteryLevel = "locked" | "open" | "learning" | "completed" | "mastered";
export interface LessonMastery {
  level: MasteryLevel;
  score: number; // 0..1, evidence-based
  passingKnowledgeAttempts: number;
  knowledgeAttempts: number;
  needsRevision: boolean;
}

const DAY = 86400_000;

/**
 * Mastery is evidence-based, never XP-based:
 *  - "completed": all four sections passed at least once.
 *  - "mastered": completed AND >= 2 separate knowledge attempts passed (>=80%), recent average >= 80%,
 *    and practised within the last 30 days.
 * score = average of the last three knowledge attempts, capped at 0.6 until all four sections are passed.
 */
export function lessonMastery(lessonId: string, p: ProgressMap, attempts: AttemptRow[], now = Date.now()): LessonMastery {
  const prog: ProgressRow | undefined = p[lessonId];
  const ka = attempts.filter((a) => a.lesson_id === lessonId && a.section === "knowledge");
  const pass = ka.filter((a) => a.max_score > 0 && a.score / a.max_score >= 0.8).length;
  const last3 = ka.slice(-3);
  const avg = last3.length ? last3.reduce((s, a) => s + a.score / a.max_score, 0) / last3.length : 0;
  const completed = prog?.status === "completed";
  const lastAt = prog?.last_practiced_at ? Date.parse(prog.last_practiced_at) : 0;
  const stale = completed && now - lastAt > 30 * DAY;
  let level: MasteryLevel;
  if (!lessonUnlocked(lessonId, p)) level = "locked";
  else if (!prog) level = "open";
  else if (!completed) level = "learning";
  else if (pass >= 2 && avg >= 0.8 && !stale) level = "mastered";
  else level = "completed";
  const score = completed ? avg : Math.min(avg, 0.6);
  return { level, score, passingKnowledgeAttempts: pass, knowledgeAttempts: ka.length, needsRevision: stale || (completed && avg < 0.7) };
}

export function worldMastery(worldId: string, p: ProgressMap, attempts: AttemptRow[]): { completedLessons: number; total: number; score: number; masteredLessons: number } {
  const w = WORLDS.find((x) => x.id === worldId)!;
  const ms = w.lessons.map((l) => lessonMastery(l.id, p, attempts));
  const total = w.lessons.length;
  return {
    completedLessons: w.lessons.filter((l) => p[l.id]?.status === "completed").length,
    total,
    masteredLessons: ms.filter((m) => m.level === "mastered").length,
    score: total ? ms.reduce((s, m) => s + m.score, 0) / total : 0,
  };
}

export function overallCompletion(p: ProgressMap): number {
  const total = ALL_LESSONS.length + BUILT_WORLDS.length; // + bosses
  if (!total) return 0;
  let done = ALL_LESSONS.filter((l) => p[l.id]?.status === "completed").length;
  done += BUILT_WORLDS.filter((w) => p[`${w.id}-boss`]?.status === "completed").length;
  return done / total;
}

export function pedagogySummary(attempts: AttemptRow[]) {
  const ped = attempts.filter((a) => a.section === "pedagogy" || a.section === "academy");
  const passed = ped.filter((a) => a.passed).length;
  return { attempts: ped.length, passed, ratio: ped.length ? passed / ped.length : 0 };
}

export function weakSkills(stats: SkillStat[], min = 4, threshold = 0.35) {
  return stats
    .filter((s) => s.correct + s.wrong >= min && s.wrong / (s.correct + s.wrong) > threshold)
    .sort((a, b) => b.wrong / (b.correct + b.wrong) - a.wrong / (a.correct + a.wrong));
}
