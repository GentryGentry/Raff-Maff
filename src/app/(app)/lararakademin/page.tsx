"use client";
import Link from "next/link";
import { useState } from "react";
import { AssessmentRunner } from "@/components/runners";
import { Bar, PageHeader, Pill, Spinner } from "@/components/ui";
import { useAppState } from "@/lib/client/state";
import { ALL_LESSONS } from "@/lib/content";

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
          <div className="mb-3 grid grid-cols-3 text-center"><div><div className="text-2xl font-bold text-[#f3d58a]">{ped.attempts}</div><div className="text-xs text-[#8d99b3]">Försök</div></div><div><div className="text-2xl font-bold text-[#3ecf8e]">{ped.passed}</div><div className="text-xs text-[#8d99b3]">Godkända</div></div><div><div className="text-2xl font-bold">{Math.round(ped.ratio * 100)}%</div><div className="text-xs text-[#8d99b3]">Träffsäkerhet</div></div></div>
          <Bar value={ped.ratio} tone="green" />
        </div>
        <div className="card p-4 text-sm text-[#c3cce0]">Här övar du lärarutmaningar från lektionerna du har läst: elevfall, missuppfattningar och förklaringar. Varje övning ger ett nytt elevfall när det finns fler. Förklaringen granskas mot kriterier (och, om AI är aktiverat, av AI-handledaren som kan underkänna – men aldrig godkänna – på egen hand).</div>
        {available.length === 0 && <div className="card p-6 text-center"><div className="text-3xl">📚</div><p className="mt-2 text-[#c3cce0]">Läs teorin i en lektion för att låsa upp dess lärarutmaning här.</p><Link href="/varldskarta" className="btn btn-gold mt-4">Till världskartan</Link></div>}
        {available.map((l) => (
          <div key={l.id} className="card space-y-3 p-5">
            <div className="flex items-start justify-between gap-2"><div><div className="text-xs text-[#8d99b3]">Lektion</div><h2 className="font-semibold">{l.teacher.title}</h2><div className="text-sm text-[#8d99b3]">{l.title}</div></div>{state.progress[l.id]?.sections.pedagogy ? <Pill tone="green">✓ Godkänd</Pill> : <Pill>Ej klar</Pill>}</div>
            <details className="rounded-lg bg-[#070d1c] p-3 text-sm">
              <summary className="cursor-pointer font-medium">Vanliga missuppfattningar ({l.pupils.length})</summary>
              <div className="mt-2 space-y-3">{l.pupils.map((p) => <div key={p.said}><div className="italic">{p.pupil}: &ldquo;{p.said}&rdquo;</div><div className="mt-1 text-[#8d99b3]"><strong>Problem:</strong> {p.misconception}</div><div className="text-[#8d99b3]"><strong>Respons:</strong> {p.response}</div></div>)}</div>
            </details>
            {open === l.id ? <AssessmentRunner autoStart lessonId={l.id} kind="academy" title="Lärarutmaning" onClose={() => setOpen(null)} />
              : <button className="btn btn-gold w-full" onClick={() => setOpen(l.id)}>Öva förklaring</button>}
          </div>
        ))}
      </div>
    </div>
  );
}
