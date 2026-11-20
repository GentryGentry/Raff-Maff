import { getLesson, getWorld, isBossId, bossWorldId } from "@/lib/content";
export function titleOf(id: string): string {
  if (isBossId(id)) return `Bossutmaning: ${getWorld(bossWorldId(id))?.title ?? ""}`;
  return getLesson(id)?.title ?? id;
}
export const hrefOf = (id: string) => (isBossId(id) ? `/varldskarta/${bossWorldId(id)}` : `/lektion/${id}`);
export const MASTERY_LABEL = { locked: "Låst", open: "Ny", learning: "Pågår", completed: "Avklarad", mastered: "Behärskad" } as const;
export const SECTION_NAME: Record<string, string> = { knowledge: "Kunskapsprov", method: "Skriftlig metod", representation: "Representation", pedagogy: "Pedagogik", boss: "Bossutmaning", revision: "Repetition", academy: "Lärarakademin" };
