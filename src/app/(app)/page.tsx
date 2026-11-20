"use client";
import Link from "next/link";
import { Bar, Pill, Ring, Spinner } from "@/components/ui";
import { useAppState } from "@/lib/client/state";
import { WORLDS } from "@/lib/content";
import { hrefOf, titleOf } from "@/lib/client/labels";

export default function Home() {
  const { state, loading, error } = useAppState();
  if (loading) return <Spinner />;
  if (!state) return <div className="p-6 text-[#ef6a6a]">{error ?? "Kunde inte ladda."}</div>;
  const { profile, level } = state;
  const lastDone = state.recent[0];
  const rec = state.recommendations[0];
  const earned = state.achievements.filter((a) => a.unlockedAt);
  const stats = [
    { k: "Nivå", v: level.level }, { k: "XP", v: profile.xp }, { k: "Streak", v: `${profile.streak} 🔥` }, { k: "Klart", v: `${Math.round(state.completion * 100)}%` },
  ];
  return (
    <div className="space-y-5 px-5 pb-6">
      <header className="safe-top flex items-center justify-between pt-5">
        <div><p className="text-sm text-[#8d99b3]">Hej, {profile.display_name}</p><h1 className="text-[28px] font-bold tracking-tight">Raff <span className="text-[#e8b64a]">Maff</span></h1></div>
        <Pill tone="gold">{level.rank}</Pill>
      </header>

      <section className="card p-5">
        <div className="flex items-center gap-4">
          <Ring value={level.xpInLevel / level.xpToNext} size={72}>{level.level}</Ring>
          <div className="flex-1"><div className="flex justify-between text-sm"><span className="font-semibold">Nivå {level.level} · {level.rank}</span><span className="text-[#8d99b3]">{level.xpInLevel}/{level.xpToNext} XP</span></div><div className="mt-2"><Bar value={level.xpInLevel / level.xpToNext} /></div></div>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2 text-center">{stats.map((s) => <div key={s.k} className="rounded-xl bg-[#070d1c] py-2.5"><div className="text-lg font-bold text-[#f3d58a]">{s.v}</div><div className="text-[11px] text-[#8d99b3]">{s.k}</div></div>)}</div>
      </section>

      {state.next ? (
        <section className="card border-[#e8b64a]/30 p-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-[#e8b64a]">Ditt uppdrag just nu</div>
          <h2 className="mt-1 text-xl font-semibold">{titleOf(state.next.lessonId)}</h2>
          <p className="mt-1 text-sm text-[#8d99b3]">{profile.current_lesson_id && profile.current_lesson_id !== state.next.lessonId ? `Du var senast i: ${titleOf(profile.current_lesson_id)}.` : "Nästa steg i din lärarresa."}</p>
          <Link href={hrefOf(state.next.lessonId)} className="btn btn-gold mt-4 w-full">{state.progress[state.next.lessonId] ? "Fortsätt" : "Starta"} →</Link>
        </section>
      ) : <section className="card p-5 text-center"><div className="text-3xl">🏁</div><p className="mt-2">Du har klarat allt innehåll som finns hittills. Fler världar byggs ut.</p></section>}

      {rec && (
        <section className="card p-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-[#60a5fa]">Rekommenderad repetition</div>
          <h2 className="mt-1 font-semibold">{titleOf(rec.lessonId)}</h2><p className="text-sm text-[#8d99b3]">{rec.reason}</p>
          <Link href="/repetition" className="btn btn-ghost mt-3 w-full">Öppna repetition</Link>
        </section>
      )}

      {lastDone && <section className="card p-5"><div className="mb-3 font-semibold">Nyligen avklarat</div>
        <ul className="space-y-2">{state.recent.map((r) => <li key={r.lessonId}><Link href={hrefOf(r.lessonId)} className="flex items-center justify-between rounded-lg bg-[#070d1c] px-3 py-3"><span>✓ {titleOf(r.lessonId)}</span><span className="text-xs text-[#8d99b3]">{new Date(r.at).toLocaleDateString("sv-SE")}</span></Link></li>)}</ul></section>}

      <section className="card p-5">
        <div className="mb-3 flex items-center justify-between"><span className="font-semibold">Märken</span><span className="text-sm text-[#8d99b3]">{earned.length}/{state.achievements.length}</span></div>
        <div className="flex flex-wrap gap-2">{state.achievements.map((a) => <div key={a.id} title={`${a.title}: ${a.description}`} className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${a.unlockedAt ? "bg-[#e8b64a]/15" : "bg-[#070d1c] opacity-30 grayscale"}`} aria-label={`${a.title}${a.unlockedAt ? "" : " (låst)"}`}>{a.icon}</div>)}</div>
        {earned.length === 0 && <p className="mt-2 text-sm text-[#8d99b3]">Klara din första lektion för att få ditt första märke.</p>}
      </section>

      <section className="card p-5">
        <div className="mb-3 font-semibold">Kunskapsöversikt</div>
        <div className="space-y-3">
          {WORLDS.map((w) => {
            const ws = state.worlds[w.id];
            return (
              <div key={w.id}>
                <div className="mb-1 flex justify-between text-sm"><span className={ws ? "" : "text-[#8d99b3]"}>{w.index}. {w.title}</span><span className="text-[#8d99b3]">{ws ? `${Math.round(ws.score * 100)} % bevisad` : "Kommer"}</span></div>
                <Bar value={ws?.score ?? 0} tone={ws && ws.bossPassed ? "green" : "gold"} height={6} />
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-[#8d99b3]">Procenten bygger på dina senaste kunskapsprov – inte på XP.</p>
      </section>
    </div>
  );
}
