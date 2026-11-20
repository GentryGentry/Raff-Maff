import { z } from "zod";
import { completeTheory } from "@/lib/server/actions";
import { route } from "@/lib/server/route";
export const POST = route(z.object({ lessonId: z.string().max(40) }), async ({ store, userId }, b) => completeTheory(store, userId, b.lessonId));
