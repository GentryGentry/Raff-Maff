"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bar, PageHeader, Pill, Spinner } from "@/components/ui";
import { useAppState } from "@/lib/client/state";
import { WORLDS } from "@/lib/content";
import { MASTERY_LABEL, SECTION_NAME, titleOf } from "@/lib/client/labels";

export default function Profile() {
  const { state, loading, config, offline } = useAppState();
  const router = useRouter();
  if (loading || !state) return <Spinner />;
  const { profile, level } = state;
  const logout = async () => {
    await fetch("/api/logout", { method: "POST" }).catch(() => {});
    try { localStorage.clear(); } catch { /* ignore */ }
    router.replace("/login");
  };
  return (
    <div className="pb-6">
      <PageHeader title="Profil" />
      <div className="space-y-4 px-5">
        <div className="card flex items-center gap-4 p-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-hl to-hl text-2xl font-bold text-onhl">{profile.display_name.slice(0, 1).toUpperCase()}</div>
          <div className="flex-1"><div className="text-lg font-semibold">{profile.display_name}</div><div className="text-sm text-muted">Nivå {level.level} · {level.rank} · {profile.xp} XP</div><div className="mt-2"><Bar value={level.xpInLevel / level.xpToNext} /></div></div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">{[["Streak", `${profile.streak} `], ["Rekord", `${profile.longest_streak}`], ["Avklarat", `${Math.round(state.completion * 100)}%`]].map(([k, v]) => <div key={k} className="card py-3"><div className="text-lg font-bold text-ink">{v}</div><div className="text-xs text-muted">{k}</div></div>)}</div>

        <section className="card p-5"><div className="mb-3 font-semibold">Behärskning per område</div>
          {WORLDS.map((w) => {
            const ws = state.worlds[w.id];
            return (
              <details key={w.id} className="border-b border-rule py-2 last:border-0">
                <summary className="flex cursor-pointer items-center justify-between gap-2"><span className={ws ? "" : "text-muted"}>{w.index}. {w.title}</span><span className="text-sm text-muted">{ws ? `${Math.round(ws.score * 100)} %` : "–"}</span></summary>
                {ws ? <ul className="mt-2 space-y-1.5">{w.lessons.map((l) => <li key={l.id} className="flex items-center justify-between text-sm"><span>{l.title}</span><Pill tone={state.mastery[l.id].level === "mastered" ? "green" : state.mastery[l.id].level === "completed" ? "gold" : "muted"}>{MASTERY_LABEL[state.mastery[l.id].level]} · {Math.round(state.mastery[l.id].score * 100)}%</Pill></li>)}</ul> : <p className="mt-2 text-sm text-muted">Ej byggd än.</p>}
              </details>
            );
          })}
        </section>

        <section className="card p-5"><div className="mb-2 font-semibold">Pedagogik</div><p className="text-sm text-muted">{state.pedagogy.passed} av {state.pedagogy.attempts} lärarutmaningar godkända.</p><div className="mt-2"><Bar value={state.pedagogy.ratio} tone="green" /></div></section>

        <section className="card p-5"><div className="mb-2 font-semibold">Vanliga misstag</div>{state.weak.length ? state.weak.map((w) => <div key={w.skill} className="flex justify-between py-1 text-sm"><span>{titleOf(w.lessonId)} · {w.skill.split(".")[1]}</span><span className="text-bad">{w.wrong}/{w.total}</span></div>) : <p className="text-sm text-muted">Inga mönster ännu.</p>}</section>

        <section className="card p-5"><div className="mb-2 font-semibold">Senaste prov</div>{state.attempts.length ? state.attempts.slice(0, 8).map((a) => <div key={a.id} className="flex justify-between border-b border-rule py-1.5 text-sm last:border-0"><span>{SECTION_NAME[a.section] ?? a.section} · <span className="text-muted">{titleOf(a.lessonId)}</span></span><span className={a.passed ? "text-ok" : "text-bad"}>{a.max ? Math.round((a.score / a.max) * 100) : 0}%</span></div>) : <p className="text-sm text-muted">Inga prov än.</p>}</section>

        <section className="card space-y-2 p-5"><div className="font-semibold">Verktyg</div>
          <Link className="btn btn-ghost w-full" href="/arbetsyta">Räkneyta och ritverktyg</Link>
          <Link className="btn btn-ghost w-full" href="/handledare">AI-handledare{config && !config.ai ? " (ej aktiverad)" : ""}</Link></section>

        <section className="card space-y-2 p-5"><div className="font-semibold">Installera på iPhone</div>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-ink2"><li>Öppna appen i Safari.</li><li>Tryck på Dela-ikonen.</li><li>Välj &ldquo;Lägg till på hemskärmen&rdquo;.</li></ol>
          <p className="text-xs text-muted">{offline ? "Offline just nu." : "Besökta lektioner fungerar även offline."} Framsteg lagras på servern{config?.dev ? " (lokalt dev-läge, ingen åtkomstkod)" : ""}.</p></section>

        {config?.passcode && <button className="btn btn-ghost w-full" onClick={logout}>Lås appen (logga ut)</button>}
      </div>
    </div>
  );
}
