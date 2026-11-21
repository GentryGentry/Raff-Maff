"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Rich, Math as M } from "@/components/Rich";
import { AssessmentRunner, PracticeRunner } from "@/components/runners";
import { Bar, PageHeader, Pill, Spinner, pushToast } from "@/components/ui";
import { LiveVisual } from "@/components/visuals";
import { Workspace } from "@/components/Workspace";
import { api, useAppState } from "@/lib/client/state";
import { getWorld } from "@/lib/content";
import type { Lesson } from "@/lib/content/types";
import { SECTIONS, SECTION_LABEL, type Section } from "@/lib/engine/types";

const STEPS = [
  "Introduktion", "Teori", "Visuell förklaring", "Genomgångna exempel", "Steg för steg", "Guidad träning",
  "Självständig träning", "Rita och räkna", "Lärarutmaning", "Slutprov", "Återkoppling",
];
const PRESET: Record<Lesson["drawing"]["tool"], "grid" | "numberline" | "fraction" | "fractioncircle" | "hundredgrid" | "area" | "coordinate" | "column"> = { grid: "grid", numberline: "numberline", fraction: "fraction", fractioncircle: "fractioncircle", hundredgrid: "hundredgrid", area: "area", coordinate: "coordinate", column: "column" };

export function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const { state, refresh, loading } = useAppState();
  const [step, setStep] = useState(0);
  const world = getWorld(lesson.worldId)!;

  useEffect(() => {
    const s = Number(new URLSearchParams(window.location.search).get("steg"));
    if (s >= 1 && s <= STEPS.length) setStep(s - 1);
  }, []);

  if (loading || !state) return <Spinner />;
  const prog = state.progress[lesson.id];
  const unlocked = state.unlocked[lesson.id];
  if (!unlocked) {
    return (
      <div className="px-5 pt-8"><PageHeader title={lesson.title} back={{ href: `/varldskarta/${world.id}`, label: world.title }} />
        <div className="card p-6 text-center"><div className="text-4xl">🔒</div><p className="mt-3 text-[#c3cce0]">Den här lektionen är låst. Klara föregående lektion först.</p>
          <Link className="btn btn-gold mt-4" href={`/varldskarta/${world.id}`}>Till världen</Link></div></div>
    );
  }

  const go = async (n: number) => {
    if (n >= 5 && !prog?.theory_done) {
      try {
        const r = await api<{ xp: number; newAchievements: { icon: string; title: string }[] }>("/api/theory", { lessonId: lesson.id });
        if (r.xp) pushToast({ icon: "📖", title: `+${r.xp} XP`, text: "Teorin avklarad" });
        r.newAchievements.forEach((a) => pushToast({ icon: a.icon, title: `Märke: ${a.title}` }));
        void refresh();
      } catch { /* offline: theory credit is granted on next online visit */ }
    }
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sections = prog?.sections ?? { knowledge: false, method: false, representation: false, pedagogy: false };
  const nav = (
    <div className="mt-5 flex gap-2">
      <button className="btn btn-ghost" disabled={step === 0} onClick={() => go(step - 1)}>‹ Tillbaka</button>
      {step < STEPS.length - 1 && <button className="btn btn-gold flex-1" onClick={() => go(step + 1)}>{step === 4 ? "Klar med teorin →" : "Nästa →"}</button>}
    </div>
  );

  return (
    <div className="pb-8">
      <PageHeader title={lesson.title} subtitle={lesson.summary} back={{ href: `/varldskarta/${world.id}`, label: world.title }} />
      <div className="px-5">
        <div className="mb-1 flex items-center justify-between text-xs text-[#8d99b3]"><span>Steg {step + 1} av {STEPS.length}</span><span>{STEPS[step]}</span></div>
        <Bar value={(step + 1) / STEPS.length} />
        <div className="mt-2 flex gap-1 overflow-x-auto pb-1" role="tablist" aria-label="Lektionens steg">
          {STEPS.map((s, i) => <button key={s} role="tab" aria-selected={i === step} onClick={() => go(i)} className={`h-2.5 w-2.5 shrink-0 rounded-full ${i === step ? "bg-[#e8b64a]" : i < step ? "bg-[#3ecf8e]" : "bg-[#223660]"}`} aria-label={`Steg ${i + 1}: ${s}`} />)}
        </div>

        <div className="fade-in mt-5 space-y-4" key={step}>
          {step === 0 && (
            <>
              <div className="card p-5"><Rich text={lesson.intro} className="text-[17px]" /></div>
              <div className="card p-5"><div className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#e8b64a]">Lärandemål</div>
                <ul className="space-y-2">{lesson.objectives.map((o) => <li key={o} className="flex gap-2"><span className="text-[#3ecf8e]">✓</span><span>{o}</span></li>)}</ul></div>
              <div className="card p-4 text-sm text-[#8d99b3]">Kursplan: {lesson.lgr} · {lesson.grades}</div>
              <div className="card p-4"><div className="mb-2 font-semibold">För att klara lektionen krävs:</div>
                <ul className="space-y-1 text-sm text-[#c3cce0]"><li>• Kunskapsprov ≥ 80 %</li><li>• Godkänd skriftlig metod</li><li>• Godkänd representation (bild/modell)</li><li>• Godkänd lärarutmaning</li></ul></div>
            </>
          )}
          {step === 1 && lesson.theory.map((t) => (
            <div key={t.heading} className="card p-5"><h2 className="mb-1 text-lg font-semibold text-[#f3d58a]">{t.heading}</h2><Rich text={t.body} /></div>
          ))}
          {step === 2 && (
            <>
              {lesson.theory.filter((t) => t.visual).map((t) => <div key={t.heading} className="card p-5"><h2 className="mb-3 font-semibold text-[#f3d58a]">{t.heading}</h2><LiveVisual v={t.visual!} /></div>)}
              {lesson.theory.every((t) => !t.visual) && <div className="card p-5 text-[#8d99b3]">Den här lektionen illustreras i exemplen och i ritövningen.</div>}
            </>
          )}
          {step === 3 && lesson.worked.map((w, i) => (
            <div key={w.title} className="card space-y-3 p-5">
              <Pill tone="gold">Exempel {i + 1}</Pill><h2 className="text-lg font-semibold">{w.title}</h2><Rich text={w.problem} className="text-[17px]" />
              <ol className="space-y-2">{w.steps.map((s, k) => <li key={k} className="rounded-lg bg-[#070d1c] p-3"><span className="mr-2 text-[#e8b64a]">{k + 1}.</span>{s.text}{s.math && <div className="mt-1 overflow-x-auto text-center"><M tex={s.math} block /></div>}</li>)}</ol>
              <div className="rounded-lg border border-[#3ecf8e]/30 bg-[#3ecf8e]/5 p-3 text-sm"><strong>Varför fungerar det?</strong> <Rich text={w.why} className="inline" /></div>
              {w.alternative && <div className="rounded-lg border border-[#60a5fa]/30 bg-[#60a5fa]/5 p-3 text-sm"><strong>Ett annat sätt:</strong> <Rich text={w.alternative} className="inline" /></div>}
            </div>
          ))}
          {step === 4 && <Stepper lesson={lesson} />}
          {step === 5 && <><div className="card p-4 text-sm text-[#c3cce0]">Guidad träning: du får ledtrådar och förklaringar. Siffrorna är nya varje gång.</div><PracticeRunner lesson={lesson} mode="guided" count={4} onFinished={() => go(6)} /></>}
          {step === 6 && <><div className="card p-4 text-sm text-[#c3cce0]">Självständig träning utan ledtrådar. Här övar du både svar och skriftlig metod.</div><PracticeRunner lesson={lesson} mode="independent" count={6} onFinished={() => go(7)} /></>}
          {step === 7 && (
            <>
              <div className="card p-5"><Pill tone="gold">Rita och räkna</Pill><Rich text={lesson.drawing.task} className="mt-2 text-[17px]" /></div>
              <Workspace preset={PRESET[lesson.drawing.tool]} storageKey={lesson.id} />
              <div className="card p-4 text-sm text-[#c3cce0]">Rita fritt med fingret. Din representation bedöms i slutprovet genom strukturerade modelluppgifter (tallinje, basblock, areamodell …). Öva här först:</div>
              <PracticeRunner lesson={lesson} mode="representation" count={2} />
            </>
          )}
          {step === 8 && (
            <>
              <div className="card p-5"><Pill tone="gold">Lärarutmaning</Pill><h2 className="mt-2 text-lg font-semibold">{lesson.teacher.title}</h2>
                <p className="mt-1 text-sm text-[#8d99b3]">Du ska förklara för en elev. Bedömning: matematisk korrekthet, tydlighet och användning av modell.</p></div>
              {lesson.pupils.map((p) => <PupilCard key={p.pupil + p.said} p={p} />)}
              {sections.pedagogy ? <div className="card p-4 text-center text-[#3ecf8e]">✓ Lärarutmaningen är godkänd. Du kan öva fler fall i Lärarakademin.</div> : <AssessmentRunner lessonId={lesson.id} kind="pedagogy" title="Lärarutmaningen" onClose={() => go(9)} />}
              {sections.pedagogy && <Link href="/lararakademin" className="btn btn-ghost w-full">Till Lärarakademin</Link>}
            </>
          )}
          {step === 9 && <FinalAssessment lesson={lesson} sections={sections} />}
          {step === 10 && <Wrap lesson={lesson} />}
        </div>
        {nav}
      </div>
    </div>
  );
}

function PupilCard({ p }: { p: Lesson["pupils"][number] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card space-y-2 p-5">
      <div className="text-xs font-semibold uppercase tracking-wide text-[#e8b64a]">Elevfall: {p.pupil}</div>
      <p className="italic text-[#dfe5f3]">&ldquo;{p.said}&rdquo;</p>
      <p className="text-sm text-[#8d99b3]">Fundera först: vad har eleven missförstått?</p>
      {open ? <div className="fade-in space-y-2 rounded-lg bg-[#070d1c] p-3 text-sm"><div><strong>Missuppfattning:</strong> {p.misconception}</div><div><strong>Så kan du svara:</strong> {p.response}</div></div>
        : <button className="btn btn-ghost min-h-[40px] text-sm" onClick={() => setOpen(true)}>Visa analys</button>}
    </div>
  );
}

function Stepper({ lesson }: { lesson: Lesson }) {
  const [ex, setEx] = useState(0);
  const [n, setN] = useState(1);
  const w = lesson.worked[ex];
  return (
    <div className="card space-y-3 p-5">
      <div className="flex gap-2">{lesson.worked.map((x, i) => <button key={x.title} onClick={() => { setEx(i); setN(1); }} className={`rounded-full px-3 py-1.5 text-sm ${i === ex ? "bg-[#e8b64a] text-black" : "bg-[#182848]"}`}>Exempel {i + 1}</button>)}</div>
      <Rich text={w.problem} className="text-[17px]" />
      {w.steps.slice(0, n).map((s, k) => <div key={k} className="fade-in rounded-lg bg-[#070d1c] p-3"><span className="mr-2 text-[#e8b64a]">Steg {k + 1}</span>{s.text}{s.math && <div className="mt-1 overflow-x-auto text-center"><M tex={s.math} block /></div>}</div>)}
      {n < w.steps.length ? <button className="btn btn-gold w-full" onClick={() => setN(n + 1)}>Visa nästa steg ({n}/{w.steps.length})</button>
        : <div className="fade-in rounded-lg border border-[#3ecf8e]/30 bg-[#3ecf8e]/5 p-3 text-sm"><strong>Varför?</strong> <Rich text={w.why} className="inline" /></div>}
      <p className="text-xs text-[#8d99b3]">Tips: försök förutsäga nästa steg innan du trycker.</p>
    </div>
  );
}

function FinalAssessment({ lesson, sections }: { lesson: Lesson; sections: Record<Section, boolean> }) {
  const { state } = useAppState();
  const [open, setOpen] = useState<Section | null>(null);
  const theory = state?.progress[lesson.id]?.theory_done;
  const info: Record<Exclude<Section, "pedagogy">, string> = { knowledge: "10 frågor. Krav: minst 80 % rätt.", method: "2 uppgifter där dina mellansteg bedöms. Krav: minst 75 %.", representation: "2 uppgifter med bild eller modell. Krav: minst 75 %." };
  return (
    <div className="space-y-3">
      <div className="card p-4 text-sm text-[#c3cce0]">Slutprovet har fyra delar. Alla fyra måste vara godkända – du kan klara dem vid olika tillfällen. Du får nya tal vid varje försök.</div>
      {!theory && <div className="rounded-xl border border-[#e8b64a]/40 bg-[#e8b64a]/10 p-3 text-sm">Gå igenom teorin (steg 1–5) först. Då låses proven upp.</div>}
      {(["knowledge", "method", "representation"] as const).map((s) => (
        <div key={s} className="card space-y-3 p-5">
          <div className="flex items-center justify-between"><div className="font-semibold">{SECTION_LABEL[s]}</div>{sections[s] ? <Pill tone="green">✓ Godkänd</Pill> : <Pill>Ej godkänd</Pill>}</div>
          <p className="text-sm text-[#8d99b3]">{info[s]}</p>
          {open === s ? <AssessmentRunner autoStart lessonId={lesson.id} kind={s} title={SECTION_LABEL[s]} onClose={() => setOpen(null)} />
            : <button className="btn btn-gold w-full" disabled={!theory} onClick={() => setOpen(s)}>{sections[s] ? "Gör om (öva upp mästerskap)" : "Starta"}</button>}
        </div>
      ))}
      <div className="card flex items-center justify-between p-5"><div><div className="font-semibold">{SECTION_LABEL.pedagogy}</div><p className="text-sm text-[#8d99b3]">Görs i steg 9 – Lärarutmaningen.</p></div>{sections.pedagogy ? <Pill tone="green">✓ Godkänd</Pill> : <Pill>Ej godkänd</Pill>}</div>
    </div>
  );
}

function Wrap({ lesson }: { lesson: Lesson }) {
  const { state } = useAppState();
  if (!state) return null;
  const prog = state.progress[lesson.id];
  const m = state.mastery[lesson.id];
  const world = getWorld(lesson.worldId)!;
  const idx = world.lessons.findIndex((l) => l.id === lesson.id);
  const nextL = world.lessons[idx + 1];
  const done = prog?.status === "completed";
  const mine = state.attempts.filter((a) => a.lessonId === lesson.id);
  const missing = SECTIONS.filter((s) => !prog?.sections[s]);
  const label = { locked: "Låst", open: "Ny", learning: "Under inlärning", completed: "Avklarad", mastered: "Behärskad" }[m.level];
  return (
    <div className="space-y-3">
      <div className={`card p-5 text-center ${done ? "border-[#3ecf8e]/50" : ""}`}>
        <div className="text-4xl">{done ? "🎓" : "🧭"}</div>
        <div className="mt-1 text-xl font-bold">{done ? "Lektionen är avklarad" : "Du är inte klar än"}</div>
        <div className="mt-2 flex justify-center gap-2"><Pill tone={m.level === "mastered" ? "green" : "gold"}>{label}</Pill><Pill>{Math.round(m.score * 100)} % bevisad kunskap</Pill></div>
        <p className="mt-3 text-sm text-[#8d99b3]">&ldquo;Behärskad&rdquo; kräver minst två godkända kunskapsprov med olika tal och ett aktuellt snitt på 80 %. Du har {m.passingKnowledgeAttempts} godkänt{m.passingKnowledgeAttempts === 1 ? "" : "a"} kunskapsprov.</p>
      </div>
      <div className="card space-y-2 p-5">{SECTIONS.map((s) => <div key={s} className="flex items-center justify-between"><span>{SECTION_LABEL[s]}</span>{prog?.sections[s] ? <Pill tone="green">✓</Pill> : <Pill tone="red">Saknas</Pill>}</div>)}</div>
      {!done && missing.length > 0 && <div className="card p-4 text-sm text-[#c3cce0]">Kvar: {missing.map((s) => SECTION_LABEL[s]).join(", ")}. {missing.includes("pedagogy") ? "Lärarutmaningen finns i steg 9. " : ""}Tryck på stegprickarna för att hoppa mellan stegen.</div>}
      {mine.length > 0 && <div className="card p-5"><div className="mb-2 font-semibold">Dina senaste försök</div>{mine.slice(0, 6).map((a) => <div key={a.id} className="flex justify-between border-b border-white/5 py-1.5 text-sm last:border-0"><span>{a.section === "pedagogy" ? "Pedagogik" : SECTION_LABEL[a.section as Section] ?? a.section}</span><span className={a.passed ? "text-[#3ecf8e]" : "text-[#ef6a6a]"}>{a.passed ? "Godkänd" : "Ej godkänd"} · {a.max ? Math.round((a.score / a.max) * 100) : 0} %</span></div>)}</div>}
      {done && (nextL ? <Link href={`/lektion/${nextL.id}`} className="btn btn-gold w-full">Nästa lektion: {nextL.title} →</Link> : <Link href={`/varldskarta/${world.id}`} className="btn btn-gold w-full">Till bossutmaningen 🏆</Link>)}
      <Link href={`/handledare?lesson=${lesson.id}`} className="btn btn-ghost w-full">Fråga AI-handledaren om lektionen</Link>
    </div>
  );
}
