import type { World } from "../types";
import { lesson1, lesson2, lesson3 } from "./part1";
import { lesson4, lesson5 } from "./part2";
import { lesson6, lesson7 } from "./part3";

export const world13: World = {
  id: "w13", index: 13, title: "Problemlösning och matematiska resonemang", icon: "⑬",
  tagline: "Förstå, modellera, pröva, arbeta baklänges, resonera, kontrollera och välja strategi.",
  lgr: "Problemlösning",
  lessons: [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7],
};
