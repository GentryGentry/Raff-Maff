import type { World } from "../types";
import { lesson1, lesson2, lesson3, lesson4 } from "./part1";
import { lesson5, lesson6, lesson7 } from "./part2";

export const world5: World = {
  id: "w5", index: 5, title: "Bråk", icon: "⑤",
  tagline: "Del av helhet, tallinje, likvärdiga bråk, jämförelse, räkning och bråk av ett antal.",
  lgr: "Taluppfattning och tals användning",
  lessons: [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7],
};
