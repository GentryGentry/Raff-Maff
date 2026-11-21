import { cookies } from "next/headers";
import { devMode, passcodeRequired, SINGLE_USER_ID, supabaseConfigured } from "./config";
import { devStore } from "./devstore";
import { COOKIE, verifySessionValue } from "./session";
import { supabaseStore } from "./supabase-store";
import type { Store } from "./types";

export const DEV_USER_ID = SINGLE_USER_ID;

export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export function getStore(): Store {
  if (supabaseConfigured()) return supabaseStore;
  if (devMode()) return devStore;
  throw new HttpError(500, "Servern saknar databaskonfiguration (NEXT_PUBLIC_SUPABASE_URL och SUPABASE_SERVICE_ROLE_KEY).");
}

/**
 * The app has exactly one user. Access is protected by a single access code (APP_PASSCODE) that is exchanged for a
 * signed cookie. In local development without a code the app is open; in production a missing code is an error,
 * never "open".
 */
export async function requireUser(): Promise<{ id: string; name?: string }> {
  if (passcodeRequired()) {
    const jar = await cookies();
    if (!(await verifySessionValue(jar.get(COOKIE)?.value))) throw new HttpError(401, "Skriv in åtkomstkoden.");
  } else if (process.env.NODE_ENV === "production") {
    throw new HttpError(500, "Servern saknar APP_PASSCODE.");
  }
  return { id: SINGLE_USER_ID, name: process.env.APP_USER_NAME || "Läraren" };
}
