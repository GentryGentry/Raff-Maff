import type { World } from "../types";
import { lesson1, lesson2, lesson3 } from "./part1";
import { lesson4, lesson5, lesson6 } from "./part2";
import { lesson7, lesson8 } from "./part3";

export const world11: World = {
  id: "w11", index: 11, title: "Enheter och mätning", icon: "⑪",
  tagline: "Längd, massa, volym, tid, area, skala och att välja och byta enheter.",
  lgr: "Geometri: mätning och enheter",
  lessons: [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7, lesson8],
};
