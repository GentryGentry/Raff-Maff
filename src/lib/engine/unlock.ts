import { BUILT_WORLDS, WORLDS, bossId } from "@/lib/content";
import type { ProgressRow } from "@/lib/server/types";

export type ProgressMap = Record<string, ProgressRow | undefined>;
const done = (p: ProgressMap, id: string) => p[id]?.status === "completed";

export function worldUnlocked(worldId: string, p: ProgressMap): boolean {
  const i = BUILT_WORLDS.findIndex((w) => w.id === worldId);
  if (i < 0) return false;
  if (i === 0) return true;
  return done(p, bossId(BUILT_WORLDS[i - 1].id));
}

export function lessonUnlocked(lessonId: string, p: ProgressMap): boolean {
  for (const w of BUILT_WORLDS) {
    const i = w.lessons.findIndex((l) => l.id === lessonId);
    if (i < 0) continue;
    if (!worldUnlocked(w.id, p)) return false;
    return i === 0 || done(p, w.lessons[i - 1].id);
  }
  return false;
}

export function bossUnlocked(worldId: string, p: ProgressMap): boolean {
  const w = WORLDS.find((x) => x.id === worldId);
  return !!w && w.lessons.length > 0 && worldUnlocked(worldId, p) && w.lessons.every((l) => done(p, l.id));
}

export function nextLesson(p: ProgressMap): { lessonId: string; boss?: boolean } | null {
  for (const w of BUILT_WORLDS) {
    if (!worldUnlocked(w.id, p)) break;
    for (const l of w.lessons) if (!done(p, l.id)) return { lessonId: l.id };
    if (!done(p, bossId(w.id))) return { lessonId: bossId(w.id), boss: true };
  }
  return null;
}
