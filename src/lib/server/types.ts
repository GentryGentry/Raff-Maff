import type { Section } from "@/lib/engine/types";

export interface Profile {
  id: string;
  display_name: string;
  xp: number;
  streak: number;
  longest_streak: number;
  last_active_date: string | null;
  current_lesson_id: string | null;
  created_at: string;
}

export interface ProgressRow {
  user_id: string;
  lesson_id: string;
  status: "in_progress" | "completed";
  theory_done: boolean;
  sections: Record<Section, boolean>;
  best_knowledge: number; // 0..1
  practice_xp: number;
  xp_awarded: number;
  completed_at: string | null;
  last_practiced_at: string | null;
  updated_at: string;
}

export interface AttemptRow {
  id: string;
  user_id: string;
  lesson_id: string;
  section: string; // Section | boss | revision | academy
  nonce: string;
  seed: string;
  score: number;
  max_score: number;
  passed: boolean;
  xp: number;
  mistakes: { skill: string; kind: string; prompt: string }[];
  created_at: string;
}

export interface SkillStat {
  user_id: string;
  skill: string;
  lesson_id: string;
  correct: number;
  wrong: number;
  last_practiced: string;
}

export interface RevisionItem {
  user_id: string;
  lesson_id: string;
  skill: string;
  reason: string;
  priority: number;
  due_at: string;
  interval_days: number;
  times_wrong: number;
  times_right: number;
  resolved: boolean;
  updated_at: string;
}

export interface Store {
  ensureProfile(userId: string, displayName?: string): Promise<Profile>;
  saveProfile(p: Profile): Promise<void>;
  listProgress(userId: string): Promise<ProgressRow[]>;
  saveProgress(row: ProgressRow): Promise<void>;
  /** Returns false when the nonce was already used (replay). */
  insertAttempt(row: AttemptRow): Promise<boolean>;
  listAttempts(userId: string, limit?: number): Promise<AttemptRow[]>;
  listSkillStats(userId: string): Promise<SkillStat[]>;
  saveSkillStats(rows: SkillStat[]): Promise<void>;
  listRevision(userId: string): Promise<RevisionItem[]>;
  saveRevision(rows: RevisionItem[]): Promise<void>;
  listAchievements(userId: string): Promise<{ achievement_id: string; unlocked_at: string }[]>;
  addAchievements(userId: string, ids: string[]): Promise<void>;
}
