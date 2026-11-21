import type { World } from "../types";
import { lesson1, lesson2, lesson3 } from "./part1";
import { lesson4, lesson5, lesson6 } from "./part2";

export const world8: World = {
  id: "w8", index: 8, title: "Negativa tal", icon: "⑧",
  tagline: "Tallinjen åt vänster, motsatta tal, jämförelse, addition och subtraktion, och vardagens negativa tal.",
  lgr: "Taluppfattning och tals användning",
  lessons: [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6],
};
