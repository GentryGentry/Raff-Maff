"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { ClientState } from "@/lib/server/actions";

const CACHE_KEY = "raffmaff.state.v1";
const OUTBOX_KEY = "raffmaff.outbox.v1";

type Ctx = { state: ClientState | null; loading: boolean; offline: boolean; error: string | null; refresh: () => Promise<void>; config: { auth: boolean; dev: boolean; ai: boolean } | null };
const StateCtx = createContext<Ctx>({ state: null, loading: true, offline: false, error: null, refresh: async () => {}, config: null });
export const useAppState = () => useContext(StateCtx);

export class ApiError extends Error { constructor(public status: number, message: string) { super(message); } }

export async function api<T>(url: string, body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, body === undefined ? { cache: "no-store" } : { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  } catch {
    throw new ApiError(0, "Ingen anslutning. Det här kräver internet.");
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, json.error ?? "Något gick fel.");
  return json as T;
}

type Outbox = { lessonId: string; results: { skill: string; correct: boolean }[] }[];
const readOutbox = (): Outbox => { try { return JSON.parse(localStorage.getItem(OUTBOX_KEY) ?? "[]"); } catch { return []; } };

/** Practice results are never lost offline: queued locally and flushed when back online. */
export async function sendPractice(lessonId: string, results: { skill: string; correct: boolean }[]) {
  try {
    return await api<{ xp: number; newAchievements: { id: string; title: string; icon: string }[] }>("/api/practice", { lessonId, results });
  } catch (e) {
    if (e instanceof ApiError && e.status === 0) {
      try { localStorage.setItem(OUTBOX_KEY, JSON.stringify([...readOutbox(), { lessonId, results }])); } catch { /* ignore */ }
    }
    return null;
  }
}

export function StateProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<ClientState | null>(null);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<Ctx["config"]>(null);
  const flushing = useRef(false);

  const flush = useCallback(async () => {
    if (flushing.current) return;
    flushing.current = true;
    try {
      let box = readOutbox();
      while (box.length) {
        await api("/api/practice", box[0]);
        box = box.slice(1);
        localStorage.setItem(OUTBOX_KEY, JSON.stringify(box));
      }
    } catch { /* retry later */ } finally { flushing.current = false; }
  }, []);

  const refresh = useCallback(async () => {
    try {
      await flush();
      const s = await api<ClientState>("/api/state");
      setState(s); setOffline(false); setError(null);
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(s)); } catch { /* ignore */ }
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) { router.replace("/login"); return; }
      if (e instanceof ApiError && e.status === 0) {
        setOffline(true);
        try { const c = localStorage.getItem(CACHE_KEY); if (c) setState(JSON.parse(c)); } catch { /* ignore */ }
      } else setError(e instanceof Error ? e.message : "Fel");
    } finally { setLoading(false); }
  }, [router, flush]);

  useEffect(() => {
    void refresh();
    void api<Ctx["config"]>("/api/config").then(setConfig).catch(() => {});
    const on = () => void refresh();
    window.addEventListener("online", on);
    return () => window.removeEventListener("online", on);
  }, [refresh]);

  const value = useMemo(() => ({ state, loading, offline, error, refresh, config }), [state, loading, offline, error, refresh, config]);
  return <StateCtx.Provider value={value}>{children}</StateCtx.Provider>;
}
