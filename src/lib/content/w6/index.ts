import type { World } from "../types";
import { lesson1, lesson2, lesson3, lesson4 } from "./part1";
import { lesson5, lesson6, lesson7, lesson8 } from "./part2";

export const world6: World = {
  id: "w6", index: 6, title: "Decimaltal", icon: "⑥",
  tagline: "Tiondelar och hundradelar, tallinje, jämförelse, räkning, avrundning och samband med bråk.",
  lgr: "Taluppfattning och tals användning",
  lessons: [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7, lesson8],
};
