import { z } from "zod";
import { startAssessment } from "@/lib/server/actions";
import { route } from "@/lib/server/route";
export const POST = route(
  z.object({ lessonId: z.string().max(40).default(""), kind: z.enum(["knowledge", "method", "representation", "pedagogy", "boss", "revision", "academy"]) }),
  async ({ store, userId }, b) => startAssessment(store, userId, b.lessonId, b.kind),
);
