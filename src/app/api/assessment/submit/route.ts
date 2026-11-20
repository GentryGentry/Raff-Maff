import { z } from "zod";
import { submitAssessment } from "@/lib/server/actions";
import { route } from "@/lib/server/route";
import type { Answer } from "@/lib/engine/types";
export const POST = route(
  z.object({ token: z.string().max(2000), answers: z.array(z.any().nullable()).max(40) }),
  async ({ store, userId }, b) => submitAssessment(store, userId, b.token, b.answers as (Answer | undefined)[]),
);
