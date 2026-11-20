import type { World } from "../types";
import { lesson1, lesson2, lesson3 } from "./part1";
import { lesson4, lesson5, lesson6 } from "./part2";

export const world3: World = {
  id: "w3", index: 3, title: "Multiplikation", icon: "③",
  tagline: "Grupper, tabellstrategier, areamodell, uppställning och räknelagar.",
  lgr: "Taluppfattning och tals användning",
  lessons: [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6],
};
