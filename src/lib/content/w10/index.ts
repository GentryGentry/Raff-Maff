import type { World } from "../types";
import { lesson1, lesson2, lesson3 } from "./part1";
import { lesson4, lesson5, lesson6 } from "./part2";
import { lesson7, lesson8, lesson9 } from "./part3";

export const world10: World = {
  id: "w10", index: 10, title: "Geometri", icon: "⑩",
  tagline: "Månghörningar, omkrets, area, volym, vinklar, symmetri, koordinatsystem, cirklar och kroppar.",
  lgr: "Geometri",
  lessons: [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7, lesson8, lesson9],
};
