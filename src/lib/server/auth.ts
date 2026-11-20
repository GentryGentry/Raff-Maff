import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { devMode, supabaseConfigured } from "./config";
import { devStore } from "./devstore";
import { supabaseStore } from "./supabase-store";
import type { Store } from "./types";

export const DEV_USER_ID = "00000000-0000-4000-8000-000000000001";

export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export function getStore(): Store {
  if (supabaseConfigured()) return supabaseStore;
  if (devMode()) return devStore;
  throw new HttpError(500, "Servern saknar Supabase-konfiguration.");
}

export async function serverSupabase() {
  const jar = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (list) => { try { list.forEach(({ name, value, options }) => jar.set(name, value, options)); } catch { /* called from a Server Component */ } },
    },
  });
}

/** Verified user for API routes. Never trusts client-supplied ids. */
export async function requireUser(): Promise<{ id: string; name?: string }> {
  if (supabaseConfigured()) {
    const sb = await serverSupabase();
    const { data, error } = await sb.auth.getUser();
    if (error || !data.user) throw new HttpError(401, "Du måste logga in.");
    return { id: data.user.id, name: (data.user.user_metadata?.display_name as string | undefined) ?? data.user.email?.split("@")[0] };
  }
  if (devMode()) return { id: DEV_USER_ID, name: "Dev-lärare" };
  throw new HttpError(500, "Servern saknar Supabase-konfiguration.");
}
