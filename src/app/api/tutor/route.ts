import { z } from "zod";
import { getLesson } from "@/lib/content";
import { aiConfigured } from "@/lib/server/config";
import { tutorReply } from "@/lib/server/ai";
import { buildState } from "@/lib/server/actions";
import { HttpError } from "@/lib/server/auth";
import { route } from "@/lib/server/route";

export const POST = route(
  z.object({ lessonId: z.string().max(40).optional(), messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) })).min(1).max(30) }),
  async ({ store, userId, name }, b) => {
    if (!aiConfigured()) throw new HttpError(503, "AI-handledaren är inte konfigurerad (OPENAI_API_KEY saknas på servern).");
    const st = await buildState(store, userId, name);
    const lesson = b.lessonId ? getLesson(b.lessonId) : undefined;
    const parts = [
      `Användarens nivå: ${st.level.level} (${st.level.rank}), ${st.profile.xp} XP.`,
      lesson ? `Aktuell lektion: ${lesson.title}. Mål: ${lesson.objectives.join(" ")} Teori: ${lesson.theory.map((t) => t.heading).join(", ")}.` : "Ingen specifik lektion vald.",
      st.weak.length ? `Svaga områden: ${st.weak.map((w) => `${w.skill} (${w.wrong}/${w.total} fel)`).join(", ")}.` : "Inga tydliga svaga områden än.",
      st.recommendations.length ? `Rekommenderad repetition: ${st.recommendations.slice(0, 3).map((r) => r.lessonId).join(", ")}.` : "",
    ];
    try {
      return { reply: await tutorReply(b.messages, parts.filter(Boolean).join("\n")) };
    } catch (e) {
      console.error("tutor", e);
      throw new HttpError(502, "AI-handledaren svarade inte just nu. Försök igen.");
    }
  },
);
