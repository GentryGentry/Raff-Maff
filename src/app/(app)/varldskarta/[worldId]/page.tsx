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
        <div className="space-y-3 px-5"><div className="card p-5"><Pill tone="gold">Under uppbyggnad</Pill><p className="mt-3 text-ink2">Den här världen är inte byggd än. Lektionerna nedan är planerade, men innehåller ännu inget – de går inte att öppna, och de ger varken XP eller framsteg.</p></div>
          <div className="card p-5"><div className="mb-2 text-sm text-muted">Planerade lektioner</div><ul className="space-y-2">{world.planned?.map((p) => <li key={p} className="rounded-lg bg-paper px-3 py-2.5 text-muted">{p}</li>)}</ul></div></div></div>
    );
  }
  const ws = state.worlds[worldId];
  const bid = bossId(worldId);
  return (
    <div className="pb-6">
      <PageHeader title={`${world.index}. ${world.title}`} subtitle={world.tagline} back={{ href: "/varldskarta", label: "Världskarta" }} />
      <div className="space-y-3 px-5">
        <div className="card p-4"><div className="mb-2 flex justify-between text-sm"><span>{ws.completedLessons}/{ws.total} lektioner avklarade</span><span className="text-muted">{ws.masteredLessons} behärskade</span></div><Bar value={ws.completedLessons / ws.total} tone="green" /></div>
        <div className="border-[1.5px] border-b-0 border-ink bg-paper">
        {world.lessons.map((l, i) => {
          const m = state.mastery[l.id];
          const locked = m.level === "locked";
          const row = (
            <div className={`grid grid-cols-[34px_1fr_auto] items-baseline gap-2 border-b border-rule bg-paper px-3 py-3.5 ${locked ? "[&>*]:opacity-50" : ""}`}>
              <span className="uppercase text-[11px] text-muted">{String(i + 1).padStart(2, "0")}</span>
              <span className={m.level === "open" || m.level === "learning" ? "font-extrabold" : "font-semibold"}>{l.title}<span className="mt-0.5 block text-xs font-normal text-muted">{l.summary}</span></span>
              <span className={`uppercase text-[10.5px] ${m.level === "learning" || m.level === "open" ? "bg-hl px-1.5 py-0.5 text-onhl" : "text-muted"}`}>{MASTERY_LABEL[m.level]}</span>
            </div>
          );
          return locked ? <div key={l.id}>{row}</div> : <Link key={l.id} href={`/lektion/${l.id}`}>{row}</Link>;
        })}
        </div>
        <div className={`card space-y-3 p-5 ${ws.bossUnlocked ? "border-ink/60" : "opacity-60"}`}>
          <div className="flex items-center gap-3"><div><div className="font-semibold">Bossutmaning</div><div className="text-sm text-muted">15 blandade frågor från hela världen. Krav: minst 80 %. Låser upp nästa värld.</div></div></div>
          {ws.bossPassed && <Pill tone="green">Besegrad{state.progress[bid]?.best_knowledge ? ` · bäst ${Math.round(state.progress[bid]!.best_knowledge * 100)} %` : ""}</Pill>}
          {!ws.bossUnlocked && <p className="text-sm text-muted">Klara alla {ws.total} lektioner först.</p>}
          {ws.bossUnlocked && (boss ? <AssessmentRunner autoStart lessonId={bid} kind="boss" title="Bossutmaningen" onClose={() => setBoss(false)} /> : <button className="btn btn-gold w-full" onClick={() => setBoss(true)}>{ws.bossPassed ? "Utmana igen" : "Ta dig an bossen"}</button>)}
        </div>
      </div>
    </div>
  );
}
