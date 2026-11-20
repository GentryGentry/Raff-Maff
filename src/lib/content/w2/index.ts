import type { World } from "../types";
import { lesson1, lesson2, lesson3, lesson4 } from "./part1";
import { lesson5, lesson6, lesson7 } from "./part2";

export const world2: World = {
  id: "w2", index: 2, title: "Addition och subtraktion", icon: "②",
  tagline: "Huvudräkning, uppställning med växling och att välja räknesätt.",
  lgr: "Taluppfattning och tals användning",
  lessons: [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7],
};
