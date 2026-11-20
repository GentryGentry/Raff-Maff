import type { World } from "../types";
import { lesson1, lesson2, lesson3 } from "./part1";
import { lesson4, lesson5, lesson6, lesson7 } from "./part2";

export const world4: World = {
  id: "w4", index: 4, title: "Division", icon: "④",
  tagline: "Delning och innehåll, rest, liggande stolen och division i omgångar.",
  lgr: "Taluppfattning och tals användning",
  lessons: [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7],
};
