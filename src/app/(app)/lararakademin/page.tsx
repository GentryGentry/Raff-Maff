"use client";
import Link from "next/link";
import { useState } from "react";
import { AssessmentRunner } from "@/components/runners";
import { Bar, PageHeader, Pill, Spinner } from "@/components/ui";
import { useAppState } from "@/lib/client/state";
import { ALL_LESSONS, WORLDS } from "@/lib/content";

export default function Academy() {
  const { state, loading } = useAppState();
  const [open, setOpen] = useState<string | null>(null);
  if (loading || !state) return <Spinner />;
  const ped = state.pedagogy;
  const available = ALL_LESSONS.filter((l) => state.progress[l.id]?.theory_done);
  return (
    <div className="pb-6">
      <PageHeader title="Lärarakademin" subtitle="Att kunna matematik räcker inte – du ska kunna förklara den." />
      <div className="space-y-4 px-5">
        <div className="card p-5">
          <div className="mb-3 grid grid-cols-3 text-center"><div><div className="text-2xl font-bold text-ink">{ped.attempts}</div><div className="text-xs text-muted">Försök</div></div><div><div className="text-2xl font-bold text-ok">{ped.passed}</div><div className="text-xs text-muted">Godkända</div></div><div><div className="text-2xl font-bold">{Math.round(ped.ratio * 100)}%</div><div className="text-xs text-muted">Träffsäkerhet</div></div></div>
          <Bar value={ped.ratio} tone="green" />
        </div>
        <div className="card p-4 text-sm text-ink2">Här övar du lärarutmaningar från lektionerna du har läst: elevfall, missuppfattningar och förklaringar. Du får växelvis lärarutmaningen och olika elevfall ur lektionen (elevfallen kräver AI-handledaren). Skriv med egna ord. Förklaringen bedöms mot kriterier och, när AI är aktiverat, av AI-handledaren. Exempelsvaret visas först när du blivit godkänd.</div>
        {available.length === 0 && <div className="card p-6 text-center"><p className="mt-2 text-ink2">Läs teorin i en lektion för att låsa upp dess lärarutmaning här.</p><Link href="/varldskarta" className="btn btn-gold mt-4">Till världskartan</Link></div>}
        {WORLDS.map((w, wi) => {
          const ls = w.lessons.filter((l) => state.progress[l.id]?.theory_done);
          if (!ls.length) return null;
          const done = ls.filter((l) => state.progress[l.id]?.sections.pedagogy).length;
          return (
            <details key={w.id} className="card" open={wi === 0 || ls.some((l) => open === l.id)}>
              <summary className="flex cursor-pointer items-baseline justify-between gap-2 p-4"><span className="font-extrabold">{String(w.index).padStart(2, "0")} {w.title}</span><span className="uppercase text-[10.5px] text-muted">{done}/{ls.length} godkända</span></summary>
              <div className="space-y-3 p-4 pt-0">
                {ls.map((l) => (
                  <div key={l.id} className="space-y-3 border-t border-rule pt-4">
                    <div className="flex items-start justify-between gap-2"><div><div className="text-xs text-muted">{l.title}</div><h2 className="font-semibold">{l.teacher.title}</h2></div>{state.progress[l.id]?.sections.pedagogy ? <Pill tone="green">Godkänd</Pill> : <Pill>Ej klar</Pill>}</div>
                    <details className="bg-paper2 p-3 text-sm">
                      <summary className="cursor-pointer font-medium">Vanliga missuppfattningar ({l.pupils.length})</summary>
                      <div className="mt-2 space-y-3">{l.pupils.map((p) => <div key={p.said}><div className="italic">{p.pupil}: &ldquo;{p.said}&rdquo;</div><div className="mt-1 text-muted"><strong>Problem:</strong> {p.misconception}</div></div>)}</div>
                    </details>
                    {open === l.id ? <AssessmentRunner autoStart lessonId={l.id} kind="academy" title="Lärarutmaning" onClose={() => setOpen(null)} />
                      : <button className="btn btn-gold w-full" onClick={() => setOpen(l.id)}>Öva förklaring</button>}
                  </div>
                ))}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
