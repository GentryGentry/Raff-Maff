import type { AttemptRow, ProgressRow, RevisionItem, SkillStat } from "@/lib/server/types";
import { weakSkills } from "./mastery";

export interface Recommendation {
  lessonId: string;
  skill?: string;
  reason: string;
  priority: number; // higher = sooner
}

export const INTERVALS = [1, 3, 7, 14, 30];
const DAY = 86400_000;
export const lessonOfSkill = (skill: string) => skill.split(".")[0];

/** Förklaringsuppgifter (lärarutmaning och elevfall) har ingen repetition: de ger inga övningsuppgifter att repetera. */
export const isRepeatable = (skill: string | undefined | null) => !skill || !/\.(pedagogy|pupil)$/.test(skill);

export function recommend(args: {
  progress: ProgressRow[]; attempts: AttemptRow[]; revision: RevisionItem[]; stats: SkillStat[]; now?: number;
}): Recommendation[] {
  const now = args.now ?? Date.now();
  const out = new Map<string, Recommendation>();
  const add = (r: Recommendation) => {
    const k = r.lessonId;
    const cur = out.get(k);
    if (!cur || r.priority > cur.priority) out.set(k, r);
  };
  for (const r of args.revision) {
    if (r.resolved || Date.parse(r.due_at) > now || !isRepeatable(r.skill)) continue;
    const overdue = (now - Date.parse(r.due_at)) / DAY;
    add({ lessonId: r.lesson_id, skill: r.skill, reason: `Du har gjort fel här tidigare (${r.times_wrong} gång${r.times_wrong === 1 ? "" : "er"}).`, priority: 50 + r.times_wrong * 5 + Math.min(overdue, 10) });
  }
  const lastByLesson = new Map<string, AttemptRow>();
  for (const a of args.attempts) if (a.section === "knowledge") lastByLesson.set(a.lesson_id, a);
  for (const [lessonId, a] of lastByLesson) {
    if (!a.passed) add({ lessonId, reason: `Senaste kunskapsprovet blev ${Math.round((a.score / a.max_score) * 100)} % – målet är 80 %.`, priority: 70 });
  }
  for (const s of weakSkills(args.stats).filter((x) => isRepeatable(x.skill))) {
    add({ lessonId: s.lesson_id, skill: s.skill, reason: `Svagt område: ${Math.round((s.wrong / (s.correct + s.wrong)) * 100)} % fel i ${s.correct + s.wrong} försök.`, priority: 60 });
  }
  for (const p of args.progress) {
    if (p.status !== "completed" || !p.last_practiced_at) continue;
    const days = (now - Date.parse(p.last_practiced_at)) / DAY;
    if (days >= 7) add({ lessonId: p.lesson_id, reason: `Det var ${Math.floor(days)} dagar sedan du övade på detta.`, priority: 20 + Math.min(days, 30) });
  }
  return [...out.values()].sort((a, b) => b.priority - a.priority);
}

/** Spaced-repetition update for one practised skill. */
export function updateRevision(prev: RevisionItem | undefined, userId: string, skill: string, correct: boolean, now = Date.now()): RevisionItem | undefined {
  const lessonId = lessonOfSkill(skill);
  if (!prev) {
    if (correct) return undefined;
    return { user_id: userId, lesson_id: lessonId, skill, reason: "fel svar", priority: 1, due_at: new Date(now + DAY).toISOString(), interval_days: 1, times_wrong: 1, times_right: 0, resolved: false, updated_at: new Date(now).toISOString() };
  }
  if (correct) {
    const idx = Math.min(INTERVALS.indexOf(prev.interval_days) + 1, INTERVALS.length - 1);
    const interval = INTERVALS[Math.max(idx, 0)];
    return { ...prev, times_right: prev.times_right + 1, interval_days: interval, due_at: new Date(now + interval * DAY).toISOString(), resolved: interval >= 30 && prev.times_right + 1 >= 3, updated_at: new Date(now).toISOString() };
  }
  return { ...prev, times_wrong: prev.times_wrong + 1, interval_days: 1, due_at: new Date(now + DAY).toISOString(), resolved: false, updated_at: new Date(now).toISOString() };
}
