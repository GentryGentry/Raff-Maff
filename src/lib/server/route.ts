import { NextResponse } from "next/server";
import { z } from "zod";
import { HttpError, getStore, requireUser } from "./auth";
import type { Store } from "./types";

type Ctx = { userId: string; name?: string; store: Store };

export function route<S extends z.ZodTypeAny | undefined>(schema: S, fn: (ctx: Ctx, body: S extends z.ZodTypeAny ? z.infer<S> : undefined, req: Request) => Promise<unknown>) {
  return async (req: Request) => {
    try {
      const user = await requireUser();
      let body: unknown;
      if (schema) {
        const raw = await req.json().catch(() => null);
        const parsed = schema.safeParse(raw);
        if (!parsed.success) throw new HttpError(400, "Ogiltig förfrågan.");
        body = parsed.data;
      }
      const out = await fn({ userId: user.id, name: user.name, store: getStore() }, body as never, req);
      return NextResponse.json(out, { headers: { "Cache-Control": "no-store" } });
    } catch (e) {
      if (e instanceof HttpError) return NextResponse.json({ error: e.message }, { status: e.status });
      console.error("API error", e);
      return NextResponse.json({ error: "Något gick fel på servern." }, { status: 500 });
    }
  };
}
