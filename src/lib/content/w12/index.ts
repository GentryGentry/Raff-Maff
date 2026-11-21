import type { World } from "../types";
import { lesson1, lesson2 } from "./part1";
import { lesson3, lesson4, lesson5 } from "./part2";
import { lesson6, lesson7 } from "./part3";

export const world12: World = {
  id: "w12", index: 12, title: "Statistik och sannolikhet", icon: "⑫",
  tagline: "Tabeller och diagram, medelvärde, median, typvärde, chans, experiment och kombinatorik.",
  lgr: "Sannolikhet och statistik",
  lessons: [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7],
};
