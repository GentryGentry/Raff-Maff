import type { AttemptRow, Profile, ProgressRow } from "@/lib/server/types";

export interface AchievementDef { id: string; title: string; description: string; icon: string; xp: number }
export interface AchCtx { profile: Profile; progress: ProgressRow[]; attempts: AttemptRow[]; bossesPassed: number }

type Rule = AchievementDef & { test: (c: AchCtx) => boolean };
const completed = (c: AchCtx) => c.progress.filter((p) => p.status === "completed" && !p.lesson_id.endsWith("-boss")).length;

export const ACHIEVEMENTS: Rule[] = [
  { id: "first-theory", title: "Första steget", description: "Läs din första lektion.", icon: "📖", xp: 10, test: (c) => c.progress.some((p) => p.theory_done) },
  { id: "first-lesson", title: "Första lektionen klar", description: "Klara alla fyra delar i en lektion.", icon: "🎓", xp: 25, test: (c) => completed(c) >= 1 },
  { id: "five-lessons", title: "På väg", description: "Klara 5 lektioner.", icon: "🧭", xp: 50, test: (c) => completed(c) >= 5 },
  { id: "ten-lessons", title: "Redo för skolan", description: "Klara 10 lektioner.", icon: "🏫", xp: 100, test: (c) => completed(c) >= 10 },
  { id: "first-boss", title: "Bosslåst", description: "Besegra din första bossutmaning.", icon: "🏆", xp: 100, test: (c) => c.bossesPassed >= 1 },
  { id: "perfect", title: "Prickfritt", description: "Få 100 % på ett kunskapsprov.", icon: "💯", xp: 30, test: (c) => c.attempts.some((a) => a.section === "knowledge" && a.max_score > 0 && a.score === a.max_score) },
  { id: "teacher-3", title: "Pedagogen", description: "Klara 3 lärarutmaningar.", icon: "🧑‍🏫", xp: 60, test: (c) => c.attempts.filter((a) => (a.section === "pedagogy" || a.section === "academy") && a.passed).length >= 3 },
  { id: "streak-3", title: "Tre dagar i rad", description: "Öva tre dagar i rad.", icon: "🔥", xp: 20, test: (c) => c.profile.longest_streak >= 3 },
  { id: "streak-7", title: "En hel vecka", description: "Öva sju dagar i rad.", icon: "🌟", xp: 70, test: (c) => c.profile.longest_streak >= 7 },
  { id: "xp-500", title: "500 XP", description: "Samla 500 XP.", icon: "✨", xp: 0, test: (c) => c.profile.xp >= 500 },
  { id: "xp-2000", title: "2 000 XP", description: "Samla 2 000 XP.", icon: "💎", xp: 0, test: (c) => c.profile.xp >= 2000 },
  { id: "revisor", title: "Repetitören", description: "Gör 5 repetitionspass.", icon: "🔁", xp: 40, test: (c) => c.attempts.filter((a) => a.section === "revision").length >= 5 },
  { id: "comeback", title: "Ger aldrig upp", description: "Klara ett prov efter att ha misslyckats med det.", icon: "💪", xp: 30, test: (c) => c.attempts.some((a, i) => a.passed && c.attempts.slice(0, i).some((b) => b.lesson_id === a.lesson_id && b.section === a.section && !b.passed)) },
];

export const publicAchievements: AchievementDef[] = ACHIEVEMENTS.map(({ test: _t, ...d }) => { void _t; return d; });
export const newlyEarned = (ctx: AchCtx, have: Set<string>) => ACHIEVEMENTS.filter((a) => !have.has(a.id) && a.test(ctx));
