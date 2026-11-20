import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { AttemptRow, Profile, ProgressRow, RevisionItem, SkillStat, Store } from "./types";

let client: SupabaseClient | null = null;
export function adminClient(): SupabaseClient {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error("Supabase är inte konfigurerat (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");
    client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  }
  return client;
}

function must<T>(res: { data: T | null; error: { message: string } | null }, what: string): T {
  if (res.error) throw new Error(`${what}: ${res.error.message}`);
  return res.data as T;
}

/** Server-side store. Uses the service role; user identity is always verified by the caller (see auth.ts). */
export const supabaseStore: Store = {
  async ensureProfile(id, name) {
    const db = adminClient();
    const found = must(await db.from("profiles").select("*").eq("id", id).maybeSingle(), "profiles");
    if (found) return found as Profile;
    const row = { id, display_name: name || "Läraren" };
    must(await db.from("profiles").upsert(row, { onConflict: "id", ignoreDuplicates: true }), "profiles upsert");
    return must(await db.from("profiles").select("*").eq("id", id).single(), "profiles") as Profile;
  },
  async saveProfile(p) {
    const { id, created_at: _c, ...rest } = p;
    void _c;
    must(await adminClient().from("profiles").update(rest).eq("id", id), "profiles update");
  },
  async listProgress(u) { return (must(await adminClient().from("user_progress").select("*").eq("user_id", u), "user_progress") ?? []) as ProgressRow[]; },
  async saveProgress(row) { must(await adminClient().from("user_progress").upsert(row, { onConflict: "user_id,lesson_id" }), "user_progress upsert"); },
  async insertAttempt(row) {
    const { error } = await adminClient().from("assessment_attempts").insert(row);
    if (error) { if (error.code === "23505") return false; throw new Error(`attempts: ${error.message}`); }
    return true;
  },
  async listAttempts(u, limit = 300) {
    return (must(await adminClient().from("assessment_attempts").select("*").eq("user_id", u).order("created_at", { ascending: false }).limit(limit), "attempts") ?? []).reverse() as AttemptRow[];
  },
  async listSkillStats(u) { return (must(await adminClient().from("skill_stats").select("*").eq("user_id", u), "skill_stats") ?? []) as SkillStat[]; },
  async saveSkillStats(rows) { if (rows.length) must(await adminClient().from("skill_stats").upsert(rows, { onConflict: "user_id,skill" }), "skill_stats upsert"); },
  async listRevision(u) { return (must(await adminClient().from("revision_queue").select("*").eq("user_id", u), "revision_queue") ?? []) as RevisionItem[]; },
  async saveRevision(rows) { if (rows.length) must(await adminClient().from("revision_queue").upsert(rows, { onConflict: "user_id,lesson_id,skill" }), "revision_queue upsert"); },
  async listAchievements(u) { return (must(await adminClient().from("user_achievements").select("achievement_id, unlocked_at").eq("user_id", u), "user_achievements") ?? []) as { achievement_id: string; unlocked_at: string }[]; },
  async addAchievements(u, ids) {
    if (ids.length) must(await adminClient().from("user_achievements").upsert(ids.map((achievement_id) => ({ user_id: u, achievement_id })), { onConflict: "user_id,achievement_id", ignoreDuplicates: true }), "user_achievements upsert");
  },
};
