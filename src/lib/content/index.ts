import type { Lesson, World } from "./types";
import { world1 } from "./w1";
import { world2 } from "./w2";
import { world3 } from "./w3";
import { world4 } from "./w4";

const PLANNED: Omit<World, "lessons">[] = [
  { id: "w5", index: 5, title: "Bråk", icon: "⑤", tagline: "Delar av helheter, jämförelse och likvärdiga bråk.", lgr: "Taluppfattning: tal i bråkform" },
  { id: "w6", index: 6, title: "Decimaltal", icon: "⑥", tagline: "Tiondelar, hundradelar och räkning med decimaltal.", lgr: "Taluppfattning: tal i decimalform" },
  { id: "w7", index: 7, title: "Procent", icon: "⑦", tagline: "Del av hundra, samband med bråk och decimaltal.", lgr: "Taluppfattning: procent" },
  { id: "w8", index: 8, title: "Negativa tal", icon: "⑧", tagline: "Tallinjen åt vänster om noll.", lgr: "Taluppfattning: negativa tal" },
  { id: "w9", index: 9, title: "Algebra och mönster", icon: "⑨", tagline: "Talföljder, uttryck, ekvationer och likhet.", lgr: "Algebra" },
  { id: "w10", index: 10, title: "Geometri", icon: "⑩", tagline: "Figurer, omkrets, area, volym och symmetri.", lgr: "Geometri" },
  { id: "w11", index: 11, title: "Enheter och mätning", icon: "⑪", tagline: "Längd, massa, volym, tid och skala.", lgr: "Geometri: mätning och enheter" },
  { id: "w12", index: 12, title: "Statistik och sannolikhet", icon: "⑫", tagline: "Diagram, medelvärde, median och chans.", lgr: "Sannolikhet och statistik" },
  { id: "w13", index: 13, title: "Problemlösning och matematiska resonemang", icon: "⑬", tagline: "Strategier, modeller och att resonera.", lgr: "Problemlösning" },
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
  w10: ["Månghörningar och egenskaper", "Omkrets", "Area", "Volym", "Vinklar", "Symmetri och spegling", "Koordinatsystem"],
  w11: ["Längd", "Massa", "Volym och rymd", "Tid", "Skala", "Omvandling mellan enheter"],
  w12: ["Tabeller och diagram", "Medelvärde", "Median och typvärde", "Chans och sannolikhet", "Kombinatorik"],
  w13: ["Problemlösningsstrategier", "Rita och modellera", "Prova och pröva", "Matematiska resonemang", "Rimlighet"],
};

export const WORLDS: World[] = [
  world1,
  world2,
  world3,
  world4,
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
