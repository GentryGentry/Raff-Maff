import { NextResponse } from "next/server";
import { aiConfigured, devMode, supabaseConfigured } from "@/lib/server/config";
export const dynamic = "force-dynamic";
export function GET() {
  return NextResponse.json({ auth: supabaseConfigured(), dev: devMode(), ai: aiConfigured() });
}
