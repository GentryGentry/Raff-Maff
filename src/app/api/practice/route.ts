import { z } from "zod";
import { submitPractice } from "@/lib/server/actions";
import { route } from "@/lib/server/route";
export const POST = route(
  z.object({ lessonId: z.string().max(40), results: z.array(z.object({ skill: z.string().max(80), correct: z.boolean() })).max(30) }),
  async ({ store, userId }, b) => submitPractice(store, userId, b.lessonId, b.results),
);
