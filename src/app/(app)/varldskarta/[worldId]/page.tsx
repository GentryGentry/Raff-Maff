"use client";
import Link from "next/link";
import { use, useState } from "react";
import { AssessmentRunner } from "@/components/runners";
import { Bar, PageHeader, Pill, Spinner } from "@/components/ui";
import { useAppState } from "@/lib/client/state";
import { getWorld, bossId } from "@/lib/content";
import { MASTERY_LABEL } from "@/lib/client/labels";

export default function WorldPage({ params }: { params: Promise<{ worldId: string }> }) {
  const { worldId } = use(params);
  const { state, loading } = useAppState();
  const [boss, setBoss] = useState(false);
  const world = getWorld(worldId);
  if (!world) return <div className="p-6">Okänd värld.</div>;
  if (loading || !state) return <Spinner />;

  if (world.lessons.length === 0) {
    return (
      <div className="pb-6"><PageHeader title={`${world.index}. ${world.title}`} subtitle={world.tagline} back={{ href: "/varldskarta", label: "Världskarta" }} />
        <div className="space-y-3 px-5"><div className="card p-5"><Pill tone="gold">Under uppbyggnad</Pill><p className="mt-3 text-[#c3cce0]">Den här världen är inte byggd än. Lektionerna nedan är planerade, men innehåller ännu inget – de går inte att öppna, och de ger varken XP eller framsteg.</p></div>
          <div className="card p-5"><div className="mb-2 text-sm text-[#8d99b3]">Planerade lektioner</div><ul className="space-y-2">{world.planned?.map((p) => <li key={p} className="rounded-lg bg-[#070d1c] px-3 py-2.5 text-[#8d99b3]">🚧 {p}</li>)}</ul></div></div></div>
    );
  }
  const ws = state.worlds[worldId];
  const bid = bossId(worldId);
  return (
    <div className="pb-6">
      <PageHeader title={`${world.index}. ${world.title}`} subtitle={world.tagline} back={{ href: "/varldskarta", label: "Världskarta" }} />
      <div className="space-y-3 px-5">
        <div className="card p-4"><div className="mb-2 flex justify-between text-sm"><span>{ws.completedLessons}/{ws.total} lektioner avklarade</span><span className="text-[#8d99b3]">{ws.masteredLessons} behärskade</span></div><Bar value={ws.completedLessons / ws.total} tone="green" /></div>
        {world.lessons.map((l, i) => {
          const m = state.mastery[l.id];
          const locked = m.level === "locked";
          const row = (
            <div className={`card flex items-center gap-3 p-4 ${m.level === "open" || m.level === "learning" ? "border-[#e8b64a]/40" : ""} ${locked ? "opacity-50" : ""}`}>
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${m.level === "completed" || m.level === "mastered" ? "border-[#3ecf8e] text-[#3ecf8e]" : locked ? "border-[#223660] text-[#8d99b3]" : "border-[#e8b64a] text-[#e8b64a]"}`}>{locked ? "🔒" : m.level === "mastered" ? "★" : m.level === "completed" ? "✓" : i + 1}</div>
              <div className="min-w-0 flex-1"><div className="font-semibold">{l.title}</div><div className="truncate text-xs text-[#8d99b3]">{l.summary}</div></div>
              <Pill tone={m.level === "mastered" || m.level === "completed" ? "green" : m.level === "learning" || m.level === "open" ? "gold" : "muted"}>{MASTERY_LABEL[m.level]}</Pill>
            </div>
          );
          return locked ? <div key={l.id}>{row}</div> : <Link key={l.id} href={`/lektion/${l.id}`}>{row}</Link>;
        })}
        <div className={`card space-y-3 p-5 ${ws.bossUnlocked ? "border-[#e8b64a]/60" : "opacity-60"}`}>
          <div className="flex items-center gap-3"><span className="text-3xl">{ws.bossPassed ? "🏆" : ws.bossUnlocked ? "⚔️" : "🔒"}</span><div><div className="font-semibold">Bossutmaning</div><div className="text-sm text-[#8d99b3]">15 blandade frågor från hela världen. Krav: minst 80 %. Låser upp nästa värld.</div></div></div>
          {ws.bossPassed && <Pill tone="green">✓ Besegrad{state.progress[bid]?.best_knowledge ? ` · bäst ${Math.round(state.progress[bid]!.best_knowledge * 100)} %` : ""}</Pill>}
          {!ws.bossUnlocked && <p className="text-sm text-[#8d99b3]">Klara alla {ws.total} lektioner först.</p>}
          {ws.bossUnlocked && (boss ? <AssessmentRunner lessonId={bid} kind="boss" title="Bossutmaningen" onClose={() => setBoss(false)} /> : <button className="btn btn-gold w-full" onClick={() => setBoss(true)}>{ws.bossPassed ? "Utmana igen" : "Ta dig an bossen"}</button>)}
        </div>
      </div>
    </div>
  );
}
