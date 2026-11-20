"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function Login() {
  const router = useRouter();
  const [cfg, setCfg] = useState<{ auth: boolean; dev: boolean } | null>(null);
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [name, setName] = useState("");
  const [msg, setMsg] = useState<string | null>(null); const [busy, setBusy] = useState(false);
  useEffect(() => { void fetch("/api/config").then((r) => r.json()).then(setCfg); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg(null);
    const sb = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    try {
      if (mode === "up") {
        const { data, error } = await sb.auth.signUp({ email, password, options: { data: { display_name: name || email.split("@")[0] } } });
        if (error) throw error;
        if (!data.session) { setMsg("Konto skapat. Bekräfta din e-post (se inkorgen) och logga sedan in."); setMode("in"); return; }
      } else {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      router.replace("/"); router.refresh();
    } catch (err) { setMsg(err instanceof Error ? (err.message.includes("Invalid login") ? "Fel e-post eller lösenord." : err.message) : "Något gick fel."); }
    finally { setBusy(false); }
  };

  return (
    <main className="safe-top mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-6 px-6">
      <div className="text-center"><div className="text-5xl">🧮</div><h1 className="mt-2 text-4xl font-bold tracking-tight">Raff <span className="text-[#e8b64a]">Maff</span></h1><p className="mt-2 text-[#8d99b3]">Matematik för åk 4–6 – och konsten att lära ut den.</p></div>
      {cfg && !cfg.auth ? (
        <div className="card space-y-3 p-5 text-center"><p>{cfg.dev ? "Lokalt utvecklingsläge: Supabase är inte konfigurerat, så ingen inloggning behövs. Framsteg sparas i .data/dev-store.json." : "Servern saknar Supabase-konfiguration."}</p>{cfg.dev && <Link className="btn btn-gold" href="/">Fortsätt</Link>}</div>
      ) : (
        <form onSubmit={submit} className="card space-y-3 p-5">
          <div className="grid grid-cols-2 gap-2">{(["in", "up"] as const).map((m) => <button type="button" key={m} onClick={() => setMode(m)} className={`btn ${mode === m ? "btn-gold" : "btn-ghost"}`}>{m === "in" ? "Logga in" : "Skapa konto"}</button>)}</div>
          {mode === "up" && <input className="field" placeholder="Ditt namn" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />}
          <input className="field" type="email" required placeholder="E-post" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          <input className="field" type="password" required minLength={8} placeholder="Lösenord (minst 8 tecken)" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "in" ? "current-password" : "new-password"} />
          {msg && <p className="text-sm text-[#f3d58a]" role="alert">{msg}</p>}
          <button className="btn btn-gold w-full" disabled={busy}>{busy ? "Vänta …" : mode === "in" ? "Logga in" : "Skapa konto"}</button>
        </form>
      )}
    </main>
  );
}
