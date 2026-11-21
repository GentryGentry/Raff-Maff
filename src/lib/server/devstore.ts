import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import type { AttemptRow, Profile, ProgressRow, RevisionItem, SkillStat, Store } from "./types";

/** File-based store for local development ONLY (when Supabase is not configured). */
interface Db {
  profiles: Record<string, Profile>;
  progress: ProgressRow[];
  attempts: AttemptRow[];
  skills: SkillStat[];
  revision: RevisionItem[];
  achievements: { user_id: string; achievement_id: string; unlocked_at: string }[];
}
/** Kept OUTSIDE the project folder so the dev server's file watcher never sees it change (otherwise every write
 *  triggers a rebuild + page reload, which calls the API again, which writes again …). */
const FILE = process.env.DEV_STORE_PATH || path.join(os.homedir(), ".raff-maff-dev", "dev-store.json");
const empty = (): Db => ({ profiles: {}, progress: [], attempts: [], skills: [], revision: [], achievements: [] });

let queue: Promise<unknown> = Promise.resolve();
const serial = <T>(fn: () => Promise<T>): Promise<T> => {
  const p = queue.then(fn, fn);
  queue = p.catch(() => undefined);
  return p;
};

async function load(): Promise<Db> {
  try { return { ...empty(), ...JSON.parse(await fs.readFile(FILE, "utf8")) }; } catch { return empty(); }
}
async function save(db: Db) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(db, null, 1));
}
const mut = <T>(fn: (db: Db) => T): Promise<T> => serial(async () => { const db = await load(); const r = fn(db); await save(db); return r; });
const read = <T>(fn: (db: Db) => T): Promise<T> => serial(async () => fn(await load()));

export const devStore: Store = {
  // Read-only when the profile already exists (no file write on every page load).
  ensureProfile: async (id, name) => {
    const existing = await read((db) => db.profiles[id]);
    if (existing) return existing;
    return mut((db) => {
      db.profiles[id] ??= { id, display_name: name || "Läraren", xp: 0, streak: 0, longest_streak: 0, last_active_date: null, current_lesson_id: null, created_at: new Date().toISOString() };
      return db.profiles[id];
    });
  },
  saveProfile: (p) => mut((db) => { db.profiles[p.id] = p; }),
  listProgress: (u) => read((db) => db.progress.filter((r) => r.user_id === u)),
  saveProgress: (row) => mut((db) => { const i = db.progress.findIndex((r) => r.user_id === row.user_id && r.lesson_id === row.lesson_id); if (i >= 0) db.progress[i] = row; else db.progress.push(row); }),
  insertAttempt: (row) => mut((db) => { if (db.attempts.some((a) => a.user_id === row.user_id && a.nonce === row.nonce)) return false; db.attempts.push(row); return true; }),
  listAttempts: (u, limit = 300) => read((db) => db.attempts.filter((a) => a.user_id === u).slice(-limit)),
  listSkillStats: (u) => read((db) => db.skills.filter((s) => s.user_id === u)),
  saveSkillStats: (rows) => mut((db) => { for (const r of rows) { const i = db.skills.findIndex((s) => s.user_id === r.user_id && s.skill === r.skill); if (i >= 0) db.skills[i] = r; else db.skills.push(r); } }),
  listRevision: (u) => read((db) => db.revision.filter((r) => r.user_id === u)),
  saveRevision: (rows) => mut((db) => { for (const r of rows) { const i = db.revision.findIndex((x) => x.user_id === r.user_id && x.lesson_id === r.lesson_id && x.skill === r.skill); if (i >= 0) db.revision[i] = r; else db.revision.push(r); } }),
  listAchievements: (u) => read((db) => db.achievements.filter((a) => a.user_id === u)),
  addAchievements: (u, ids) => mut((db) => { for (const id of ids) if (!db.achievements.some((a) => a.user_id === u && a.achievement_id === id)) db.achievements.push({ user_id: u, achievement_id: id, unlocked_at: new Date().toISOString() }); }),
};
