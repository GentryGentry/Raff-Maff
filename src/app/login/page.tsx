"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Cfg = { passcode: boolean; db: boolean; dev: boolean };

export default function Login() {
  const router = useRouter();
  const [cfg, setCfg] = useState<Cfg | null>(null);
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { void fetch("/api/config").then((r) => r.json()).then(setCfg).catch(() => {}); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg(null);
    try {
      const r = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ passcode: code }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error ?? "Något gick fel.");
      router.replace("/"); router.refresh();
    } catch (err) { setMsg(err instanceof Error ? err.message : "Något gick fel."); }
    finally { setBusy(false); }
  };

  return (
    <main className="safe-top mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-6 px-6">
      <div className="text-center"><div className="text-5xl">🧮</div><h1 className="mt-2 text-4xl font-bold tracking-tight">Raff <span className="text-[#e8b64a]">Maff</span></h1><p className="mt-2 text-[#8d99b3]">Matematik för åk 4–6 – och konsten att lära ut den.</p></div>
      {cfg && !cfg.passcode ? (
        <div className="card space-y-3 p-5 text-center">
          <p>{cfg.dev ? "Lokalt utvecklingsläge: ingen åtkomstkod är satt, så du kommer in direkt. Framsteg sparas i .data/dev-store.json." : "Servern saknar APP_PASSCODE. Sätt den som miljövariabel (se README) och starta om."}</p>
          {cfg.dev && <Link className="btn btn-gold" href="/">Fortsätt</Link>}
        </div>
      ) : (
        <form onSubmit={submit} className="card space-y-3 p-5">
          <label className="block text-sm text-[#8d99b3]">Åtkomstkod
            <input className="field mt-1" type="password" required autoFocus autoComplete="current-password" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Din åtkomstkod" />
          </label>
          {msg && <p className="text-sm text-[#f3d58a]" role="alert">{msg}</p>}
          <button className="btn btn-gold w-full" disabled={busy}>{busy ? "Kontrollerar …" : "Öppna"}</button>
          <p className="text-center text-xs text-[#8d99b3]">Du behöver bara skriva den en gång – telefonen kommer ihåg dig.</p>
        </form>
      )}
    </main>
  );
}
