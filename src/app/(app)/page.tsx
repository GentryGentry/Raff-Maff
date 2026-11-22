"use client";
import Link from "next/link";
import { Bar, Pill, Ring, Spinner } from "@/components/ui";
import { useAppState } from "@/lib/client/state";
import { WORLDS } from "@/lib/content";
import { hrefOf, titleOf } from "@/lib/client/labels";

export default function Home() {
  const { state, loading, error } = useAppState();
  if (loading) return <Spinner />;
  if (!state) return <div className="p-6 text-bad">{error ?? "Kunde inte ladda."}</div>;
  const { profile, level } = state;
  const lastDone = state.recent[0];
  const rec = state.recommendations[0];
  const earned = state.achievements.filter((a) => a.unlockedAt);
  const stats = [
    { k: "Nivå", v: level.level }, { k: "XP", v: profile.xp }, { k: "Dagar i rad", v: profile.streak }, { k: "Klart", v: `${Math.round(state.completion * 100)}%` },
  ];
  return (
    <div className="space-y-5 px-5 pb-6">
      <header className="safe-top pt-5">
        <div className="uppercase flex items-center justify-between border-b-2 border-ink bg-paper pb-2 text-[10.5px] text-muted"><span>Raff Maff · {profile.display_name}</span><span>{level.rank}</span></div>
        {state.next && (() => { const wi = state.next.lessonId.match(/^w(\d+)/)?.[1]; return wi ? <div className="mt-4 text-[88px] font-extrabold leading-[0.88] tracking-[-0.06em]" aria-hidden>{wi.padStart(2, "0")}</div> : null; })()}
        <h1 className="text-[30px] font-extrabold leading-[1.05] tracking-tight"><span className="mark">Raff Maff</span></h1>
      </header>

      <section className="card p-5">
        <div className="flex items-center gap-4">
          <Ring value={level.xpInLevel / level.xpToNext} size={72}>{level.level}</Ring>
          <div className="flex-1"><div className="flex justify-between text-sm"><span className="font-semibold">Nivå {level.level} · {level.rank}</span><span className="text-muted">{level.xpInLevel}/{level.xpToNext} XP</span></div><div className="mt-2"><Bar value={level.xpInLevel / level.xpToNext} /></div></div>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2 text-center">{stats.map((s) => <div key={s.k} className="border border-rule bg-paper py-2.5"><div className="text-xl font-extrabold tracking-tight text-ink">{s.v}</div><div className="text-[11px] text-muted">{s.k}</div></div>)}</div>
      </section>

      {state.next ? (
        <section className="card p-5">
          <div className="uppercase text-[11px] text-muted">Ditt uppdrag just nu</div>
          <h2 className="mt-1 text-xl font-semibold">{titleOf(state.next.lessonId)}</h2>
          <p className="mt-1 text-sm text-muted">{profile.current_lesson_id && profile.current_lesson_id !== state.next.lessonId ? `Du var senast i: ${titleOf(profile.current_lesson_id)}.` : "Nästa steg i din lärarresa."}</p>
          <Link href={hrefOf(state.next.lessonId)} className="btn btn-gold mt-4 w-full">{state.progress[state.next.lessonId] ? "Fortsätt" : "Starta"} →</Link>
        </section>
      ) : <section className="card p-5 text-center"><p className="mt-2">Du har klarat allt innehåll som finns hittills. Fler världar byggs ut.</p></section>}

      {rec && (
        <section className="card p-5">
          <div className="uppercase text-[11px] text-muted">Rekommenderad repetition</div>
          <h2 className="mt-1 font-semibold">{titleOf(rec.lessonId)}</h2><p className="text-sm text-muted">{rec.reason}</p>
          <Link href="/repetition" className="btn btn-ghost mt-3 w-full">Öppna repetition</Link>
        </section>
      )}

      {lastDone && <section className="card p-5"><div className="mb-3 font-semibold">Nyligen avklarat</div>
        <ul className="space-y-2">{state.recent.map((r) => <li key={r.lessonId}><Link href={hrefOf(r.lessonId)} className="flex items-center justify-between rounded-lg bg-paper px-3 py-3"><span>✓ {titleOf(r.lessonId)}</span><span className="text-xs text-muted">{new Date(r.at).toLocaleDateString("sv-SE")}</span></Link></li>)}</ul></section>}

      <section className="card p-5">
        <div className="mb-3 flex items-center justify-between"><span className="font-semibold">Märken</span><span className="text-sm text-muted">{earned.length}/{state.achievements.length}</span></div>
        <div className="flex flex-wrap gap-2">{state.achievements.map((a) => <span key={a.id} title={a.description} className={`uppercase border px-2 py-1 text-[10.5px] ${a.unlockedAt ? "border-ink bg-hl text-onhl" : "border-rule text-muted opacity-60"}`} aria-label={`${a.title}${a.unlockedAt ? "" : " (låst)"}`}>{a.title}</span>)}</div>
        {earned.length === 0 && <p className="mt-2 text-sm text-muted">Klara din första lektion för att få ditt första märke.</p>}
      </section>

      <section className="card p-5">
        <div className="mb-3 font-semibold">Kunskapsöversikt</div>
        <div className="space-y-3">
          {WORLDS.map((w) => {
            const ws = state.worlds[w.id];
            return (
              <div key={w.id}>
                <div className="mb-1 flex justify-between text-sm"><span className={ws ? "" : "text-muted"}>{w.index}. {w.title}</span><span className="text-muted">{ws ? `${Math.round(ws.score * 100)} % bevisad` : "Kommer"}</span></div>
                <Bar value={ws?.score ?? 0} tone={ws && ws.bossPassed ? "green" : "gold"} height={6} />
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-muted">Procenten bygger på dina senaste kunskapsprov – inte på XP.</p>
      </section>
    </div>
  );
}
