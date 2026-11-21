import type { Lesson, World } from "./types";
import { world1 } from "./w1";
import { world2 } from "./w2";
import { world3 } from "./w3";
import { world4 } from "./w4";
import { world5 } from "./w5";
import { world6 } from "./w6";
import { world7 } from "./w7";
import { world8 } from "./w8";
import { world9 } from "./w9";
import { world10 } from "./w10";
import { world11 } from "./w11";
import { world12 } from "./w12";
import { world13 } from "./w13";

const PLANNED: Omit<World, "lessons">[] = [
];

const PLANNED_LESSONS: Record<string, string[]> = {
  w2: ["Huvudräkning med addition", "Huvudräkning med subtraktion", "Uppställning: addition", "Uppställning: subtraktion med växling", "Subtraktion som skillnad", "Överslagsräkning", "Textuppgifter"],
  w3: ["Multiplikation som upprepad addition", "Multiplikationstabellerna", "Areamodellen", "Multiplikation med tiotal", "Uppställning: flersiffrigt", "Egenskaper (kommutativitet, distribution)"],
  w4: ["Delning och innehåll", "Division och multiplikation", "Rest", "Division med tiotal", "Liggande stolen", "Trappan/Uppställning", "Rimlighetsbedömning"],
  w5: ["Vad är ett bråk?", "Bråk på tallinjen", "Likvärdiga bråk", "Jämföra bråk", "Addera och subtrahera bråk", "Blandad form", "Bråk av ett antal"],
  w6: ["Tiondelar och hundradelar", "Decimaltal på tallinjen", "Jämföra decimaltal", "Addition och subtraktion", "Multiplikation med 10, 100", "Avrunda decimaltal"],
  w7: ["Vad är procent?", "Procent, bråk och decimaltal", "Vanliga procent (10, 25, 50 %)", "Procent av ett tal", "Förändring i procent"],
  w8: ["Negativa tal på tallinjen", "Jämföra negativa tal", "Addition och subtraktion med negativa tal", "Temperatur och skulder"],
  w9: ["Talmönster", "Uttryck och variabler", "Likhetstecknet", "Enkla ekvationer", "Formler"],
};

export const WORLDS: World[] = [
  world1,
  world2,
  world3,
  world4,
  world5,
  world6,
  world7,
  world8,
  world9,
  world10,
  world11,
  world12,
  world13,
  ...PLANNED.map((w) => ({ ...w, lessons: [] as Lesson[], planned: PLANNED_LESSONS[w.id] })),
];

export const ALL_LESSONS: Lesson[] = WORLDS.flatMap((w) => w.lessons);
const lessonMap = new Map(ALL_LESSONS.map((l) => [l.id, l]));
export const getLesson = (id: string) => lessonMap.get(id);
export const getWorld = (id: string) => WORLDS.find((w) => w.id === id);
export const isBossId = (id: string) => /^w\d+-boss$/.test(id);
export const bossWorldId = (id: string) => id.replace("-boss", "");
export const bossId = (worldId: string) => `${worldId}-boss`;

/** Worlds with content, in order. A world unlocks when the previous *built* world's boss is passed. */
export const BUILT_WORLDS = WORLDS.filter((w) => w.lessons.length > 0);
