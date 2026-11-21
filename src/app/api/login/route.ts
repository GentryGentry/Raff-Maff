import { NextResponse } from "next/server";
import { z } from "zod";
import { passcodeRequired } from "@/lib/server/config";
import { COOKIE, SESSION_MAX_AGE_S, makeSessionValue, passcodeMatches } from "@/lib/server/session";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!passcodeRequired()) return NextResponse.json({ error: "Ingen åtkomstkod är inställd (APP_PASSCODE)." }, { status: 400 });
  const body = z.object({ passcode: z.string().max(200) }).safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "Ogiltig förfrågan." }, { status: 400 });
  if (!(await passcodeMatches(body.data.passcode))) {
    await new Promise((r) => setTimeout(r, 1200)); // slows down guessing
    return NextResponse.json({ error: "Fel åtkomstkod." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, await makeSessionValue(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: SESSION_MAX_AGE_S });
  return res;
}
