import type { World } from "../types";
import { lesson1, lesson2, lesson3, lesson4 } from "./part1";
import { lesson5, lesson6, lesson7, lesson8, lesson9 } from "./part2";

export const world9: World = {
  id: "w9", index: 9, title: "Algebra och mönster", icon: "⑨",
  tagline: "Likhetstecknet, talmönster, figurmönster, variabler, ekvationer, algoritmer och att förenkla uttryck.",
  lgr: "Algebra",
  lessons: [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7, lesson8, lesson9],
};
