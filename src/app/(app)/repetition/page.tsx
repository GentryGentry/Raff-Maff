"use client";
import Link from "next/link";
import { useState } from "react";
import { AssessmentRunner } from "@/components/runners";
import { PageHeader, Pill, Spinner } from "@/components/ui";
import { useAppState } from "@/lib/client/state";
import { ALL_LESSONS } from "@/lib/content";
import { MASTERY_LABEL, titleOf } from "@/lib/client/labels";

export default function Revision() {
  const { state, loading } = useAppState();
  const [run, setRun] = useState(false);
  if (loading || !state) return <Spinner />;
  const recs = state.recommendations;
  const done = ALL_LESSONS.filter((l) => state.progress[l.id]?.status === "completed");
  return (
    <div className="pb-6">
      <PageHeader title="Repetition" subtitle="Intelligent repetition baserad på dina fel, prov och tid sedan sist." />
      <div className="space-y-4 px-5">
        <div className="card space-y-3 p-5">
          {recs.length ? <>
            <div className="font-semibold">Dags att repetera ({recs.length})</div>
            <ul className="space-y-2">{recs.map((r) => <li key={r.lessonId + (r.skill ?? "")} className="rounded-lg bg-[#070d1c] p-3"><Link href={`/lektion/${r.lessonId}?steg=6`} className="font-medium">{titleOf(r.lessonId)}</Link><div className="text-sm text-[#8d99b3]">{r.reason}</div></li>)}</ul>
            {run ? <AssessmentRunner lessonId="" kind="revision" title="Repetitionspass" onClose={() => setRun(false)} /> : <button className="btn btn-gold w-full" onClick={() => setRun(true)}>Starta repetitionspass (6 uppgifter)</button>}
            <p className="text-xs text-[#8d99b3]">Rätt svar ger längre mellanrum (1, 3, 7, 14, 30 dagar). Fel svar flyttar tillbaka uppgiften till i morgon.</p>
          </> : <div className="text-center"><div className="text-3xl">✨</div><p className="mt-2 text-[#c3cce0]">Inget att repetera just nu. Misstag och prov du missar dyker upp här automatiskt.</p></div>}
        </div>
        {state.weak.length > 0 && <div className="card p-5"><div className="mb-2 font-semibold">Dina svaga områden</div>{state.weak.map((w) => <div key={w.skill} className="flex justify-between border-b border-white/5 py-2 text-sm last:border-0"><span>{titleOf(w.lessonId)} <span className="text-[#8d99b3]">· {w.skill.split(".")[1]}</span></span><Pill tone="red">{w.wrong}/{w.total} fel</Pill></div>)}</div>}
        <div className="card p-5"><div className="mb-3 font-semibold">Besök en avklarad lektion igen</div>
          {done.length === 0 ? <p className="text-sm text-[#8d99b3]">Inga avklarade lektioner än.</p> : <ul className="space-y-2">{done.map((l) => <li key={l.id}><Link href={`/lektion/${l.id}`} className="flex items-center justify-between rounded-lg bg-[#070d1c] px-3 py-3"><span>{l.title}</span><Pill tone={state.mastery[l.id].level === "mastered" ? "green" : "gold"}>{MASTERY_LABEL[state.mastery[l.id].level]}</Pill></Link></li>)}</ul>}</div>
      </div>
    </div>
  );
}
