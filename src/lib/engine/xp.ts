export const XP = {
  theory: 20,
  practiceCorrect: 1,
  practiceCapPerLesson: 20,
  section: { knowledge: 40, method: 30, representation: 30, pedagogy: 40 } as Record<string, number>,
  lessonComplete: 50,
  boss: 200,
  revisionCorrect: 2,
  revisionDailyCap: 30,
  academy: 15,
  academyDailyCap: 30,
};

export const levelFromXp = (xp: number) => Math.floor(Math.sqrt(Math.max(0, xp) / 60)) + 1;
export const xpForLevel = (level: number) => 60 * (level - 1) ** 2;

const RANKS: [number, string][] = [
  [1, "Nybörjare"], [3, "Lärling"], [5, "Räknemästare"], [8, "Matteadept"], [12, "Didaktiker"], [16, "Mattemagiker"], [20, "Professor"],
];
export const rankFromLevel = (level: number) => [...RANKS].reverse().find(([l]) => level >= l)![1];

export function levelInfo(xp: number) {
  const level = levelFromXp(xp);
  const base = xpForLevel(level), next = xpForLevel(level + 1);
  return { level, rank: rankFromLevel(level), xpInLevel: xp - base, xpToNext: next - base };
}

export const stockholmDate = (d = new Date()) => d.toLocaleDateString("sv-SE", { timeZone: "Europe/Stockholm" });

export function nextStreak(last: string | null, streak: number, today = stockholmDate()) {
  if (last === today) return streak || 1;
  const y = new Date(today + "T12:00:00Z");
  y.setUTCDate(y.getUTCDate() - 1);
  return last === y.toISOString().slice(0, 10) ? streak + 1 : 1;
}
