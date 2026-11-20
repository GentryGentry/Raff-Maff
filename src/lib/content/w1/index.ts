import type { World } from "../types";
import { lesson1, lesson2, lesson3, lesson4 } from "./part1";
import { lesson9 } from "./part3";
import { lesson5, lesson6, lesson7, lesson8 } from "./part2";

export const world1: World = {
  id: "w1", index: 1, title: "Taluppfattning och positionssystem", icon: "①",
  tagline: "Siffrornas plats, stora tal, avrundning och tals egenskaper.",
  lgr: "Taluppfattning och tals användning",
  lessons: [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7, lesson8, lesson9],
};
