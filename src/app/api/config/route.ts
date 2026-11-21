import { NextResponse } from "next/server";
import { aiConfigured, devMode, passcodeRequired, supabaseConfigured } from "@/lib/server/config";
export const dynamic = "force-dynamic";
export function GET() {
  return NextResponse.json({ passcode: passcodeRequired(), db: supabaseConfigured(), dev: devMode(), ai: aiConfigured() });
}
