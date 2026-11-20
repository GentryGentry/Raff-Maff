"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Rich } from "@/components/Rich";
import { ExerciseView, emptyAnswer, isAnswered } from "@/components/exercises/ExerciseView";
import { Bar, Pill, Spinner, pushToast } from "@/components/ui";
import { api, ApiError, sendPractice, useAppState } from "@/lib/client/state";
import { getLesson } from "@/lib/content";
import type { Lesson } from "@/lib/content/types";
import { gradeExercise } from "@/lib/engine/grading";
import { makeRng } from "@/lib/engine/rng";
import type { Answer, ConcreteExercise, ExerciseSpec, ItemResult, Template } from "@/lib/engine/types";

/* ───────── feedback ───────── */
export function Feedback({ result, explanation }: { result: ItemResult; explanation?: string }) {
  const ok = result.correct;
  const partial = !ok && result.points > 0;
  return (
    <div className={`fade-in rounded-xl border p-4 ${ok ? "border-[#3ecf8e]/50 bg-[#3ecf8e]/10" : partial ? "border-[#e8b64a]/50 bg-[#e8b64a]/10" : "border-[#ef6a6a]/50 bg-[#ef6a6a]/10"}`} role="status">
      <div className={`font-semibold ${ok ? "text-[#3ecf8e]" : partial ? "text-[#f3d58a]" : "text-[#ef6a6a]"}`}>{ok ? "✓ " : partial ? "◐ " : "✗ "}{result.feedback}</div>
      {!ok && result.correctAnswerText && result.kind !== "text" && <div className="mt-2 text-sm text-[#c3cce0]">Rätt svar: <strong>{result.correctAnswerText}</strong></div>}
      {!ok && result.kind === "text" && result.correctAnswerText && <div className="mt-3 text-sm"><div className="mb-1 font-semibold text-[#c3cce0]">Exempel på en bra förklaring:</div><Rich text={result.correctAnswerText} /></div>}
      {explanation && result.kind !== "text" && <div className="mt-2 border-t border-white/10 pt-2 text-sm"><div className="mb-1 font-semibold text-[#c3cce0]">Varför?</div><Rich text={explanation} /></div>}
    </div>
  );
}

/* ───────── client-side practice (not gating) ───────── */
export function PracticeRunner({ lesson, mode, count, onFinished }: { lesson: Lesson; mode: "guided" | "independent" | "representation"; count: number; onFinished?: () => void }) {
  const { refresh } = useAppState();
  const [round, setRound] = useState(0);
  const [exs, setExs] = useState<ConcreteExercise[] | null>(null);
  const [i, setI] = useState(0);
  const [answer, setAnswer] = useState<Answer | undefined>();
  const [result, setResult] = useState<ItemResult | null>(null);
  const [hints, setHints] = useState(0);
  const [log, setLog] = useState<{ skill: string; correct: boolean }[]>([]);
  const [done, setDone] = useState(false);
  const [gained, setGained] = useState<number | null>(null);

  useEffect(() => {
    const seed = `practice-${Date.now()}-${round}`;
    const pool: Template[] = mode === "guided" ? lesson.knowledge : mode === "representation" ? lesson.representation : [...lesson.knowledge, ...lesson.method];
    const order = makeRng(seed).shuffle(pool);
    const list: ConcreteExercise[] = [];
    for (let k = 0; k < count; k++) {
      const t = order[k % order.length];
      list.push(t.gen(makeRng(`${seed}:${t.id}:${k}`), { level: mode === "independent" && k >= 3 ? 2 : 1 }));
    }
    setExs(list); setI(0); setAnswer(undefined); setResult(null); setHints(0); setLog([]); setDone(false); setGained(null);
  }, [lesson, mode, count, round]);

  if (!exs) return <Spinner label="Skapar uppgifter …" />;

  if (done) {
    const right = log.filter((l) => l.correct).length;
    return (
      <div className="card fade-in space-y-3 p-5 text-center">
        <div className="text-4xl">{right === log.length ? "🌟" : "👍"}</div>
        <div className="text-lg font-semibold">{right} av {log.length} rätt</div>
        {gained !== null && gained > 0 && <Pill tone="gold">+{gained} XP</Pill>}
        <p className="text-sm text-[#8d99b3]">Nya siffror varje gång – öva så många omgångar du vill.</p>
        <div className="flex justify-center gap-2"><button className="btn btn-ghost" onClick={() => setRound((r) => r + 1)}>Ny omgång</button>{onFinished && <button className="btn btn-gold" onClick={onFinished}>Fortsätt</button>}</div>
      </div>
    );
  }

  const ex = exs[i];
  const check = () => {
    const r = gradeExercise(ex, answer);
    setResult(r);
    setLog((l) => [...l, { skill: ex.spec.skill, correct: r.correct }]);
  };
  const next = async () => {
    if (i + 1 < exs.length) { setI(i + 1); setAnswer(undefined); setResult(null); setHints(0); return; }
    const res = await sendPractice(lesson.id, log);
    setGained(res?.xp ?? 0);
    res?.newAchievements.forEach((a) => pushToast({ icon: a.icon, title: `Märke: ${a.title}` }));
    setDone(true);
    void refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3"><Bar value={(i + (result ? 1 : 0)) / exs.length} /><span className="whitespace-nowrap text-sm text-[#8d99b3]">{i + 1}/{exs.length}</span></div>
      <div className="card space-y-4 p-5">
        <ExerciseView key={`${round}-${i}`} spec={ex.spec} value={answer ?? emptyAnswer(ex.spec)} onChange={setAnswer} disabled={!!result} />
        {mode === "guided" && !result && ex.hints.length > 0 && (
          <div className="space-y-2">
            {ex.hints.slice(0, hints).map((h, k) => <div key={k} className="rounded-lg bg-[#182848] p-3 text-sm"><span className="mr-1">💡</span><Rich text={h} className="inline" /></div>)}
            {hints < ex.hints.length && <button className="btn btn-ghost min-h-[40px] text-sm" onClick={() => setHints(hints + 1)}>Ge mig en ledtråd ({hints}/{ex.hints.length})</button>}
          </div>
        )}
        {result ? (
          <>
            <Feedback result={result} explanation={ex.explanation} />
            <button className="btn btn-gold w-full" onClick={next}>{i + 1 < exs.length ? "Nästa uppgift" : "Slutför"}</button>
          </>
        ) : (
          <button className="btn btn-gold w-full" disabled={!isAnswered(ex.spec, answer)} onClick={check}>Kontrollera</button>
        )}
      </div>
    </div>
  );
}

/* ───────── server-graded assessments ───────── */
interface Started { token: string; kind: string; lessonId: string; threshold: number; exercises: ExerciseSpec[] }
interface Submitted {
  kind: string; lessonId: string; passed: boolean; points: number; max: number; ratio: number; threshold: number; xp: number; lessonCompleted: boolean; bossPassed: boolean; aiFeedback?: string;
  items: (ItemResult & { explanation: string })[]; newAchievements: { id: string; title: string; icon: string; description: string }[];
}

export function AssessmentRunner({ lessonId, kind, title, onClose, startLabel, autoStart }: { autoStart?: boolean; lessonId: string; kind: "knowledge" | "method" | "representation" | "pedagogy" | "boss" | "revision" | "academy"; title: string; onClose?: (r: Submitted | null) => void; startLabel?: string }) {
  const { refresh } = useAppState();
  const [phase, setPhase] = useState<"idle" | "loading" | "running" | "submitting" | "result">("idle");
  const [started, setStarted] = useState<Started | null>(null);
  const [answers, setAnswers] = useState<(Answer | undefined)[]>([]);
  const [i, setI] = useState(0);
  const [res, setRes] = useState<Submitted | null>(null);
  const [error, setError] = useState<string | null>(null);

  const start = async () => {
    setPhase("loading"); setError(null);
    try {
      const s = await api<Started>("/api/assessment/start", { lessonId, kind });
      setStarted(s); setAnswers(s.exercises.map((e) => emptyAnswer(e))); setI(0); setPhase("running");
    } catch (e) { setError(e instanceof ApiError ? e.message : "Kunde inte starta."); setPhase("idle"); }
  };
  const submit = async () => {
    if (!started) return;
    setPhase("submitting");
    try {
      const r = await api<Submitted>("/api/assessment/submit", { token: started.token, answers });
      setRes(r); setPhase("result");
      r.newAchievements.forEach((a) => pushToast({ icon: a.icon, title: `Märke: ${a.title}`, text: a.description }));
      if (r.lessonCompleted) pushToast({ icon: "🎓", title: "Lektionen är klar!", text: "Nästa lektion är upplåst." });
      if (r.bossPassed) pushToast({ icon: "🏆", title: "Bossutmaningen besegrad!", text: "Nästa värld är upplåst." });
      void refresh();
    } catch (e) { setError(e instanceof ApiError ? e.message : "Kunde inte lämna in."); setPhase("running"); }
  };

  // Guard: React StrictMode (dev) runs effects twice, which would start two assessments.
  const autoStarted = useRef(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (autoStart && !autoStarted.current) { autoStarted.current = true; void start(); } }, []);

  if (phase === "idle" || phase === "loading") {
    return (
      <div className="space-y-3">
        {error && <div className="rounded-xl border border-[#ef6a6a]/40 bg-[#ef6a6a]/10 p-3 text-sm text-[#ef6a6a]">{error}</div>}
        <button className="btn btn-gold w-full" disabled={phase === "loading"} onClick={start}>{phase === "loading" ? "Förbereder …" : startLabel ?? `Starta: ${title}`}</button>
      </div>
    );
  }
  if (phase === "submitting") return <Spinner label="Rättar …" />;

  if (phase === "result" && res) {
    const pct = Math.round(res.ratio * 100);
    const weak = [...new Set(res.items.filter((x) => !x.correct).map((x) => x.skill))];
    return (
      <div className="space-y-4">
        <div className={`card pop p-5 text-center ${res.passed ? "border-[#3ecf8e]/50" : "border-[#ef6a6a]/40"}`}>
          <div className="text-4xl">{res.passed ? "🎉" : "💪"}</div>
          <div className="mt-1 text-xl font-bold">{res.passed ? "Godkänt!" : "Inte godkänt än"}</div>
          <div className="text-[#8d99b3]">{res.kind === "pedagogy" || res.kind === "academy" ? "Din förklaring bedömdes mot kriterierna." : `${Math.round(res.points * 10) / 10} av ${res.max} poäng · ${pct} % (krav ${Math.round(res.threshold * 100)} %)`}</div>
          {res.xp > 0 && <div className="mt-2"><Pill tone="gold">+{res.xp} XP</Pill></div>}
          {!res.passed && <p className="mt-3 text-sm text-[#c3cce0]">Ingen fara – du får nya tal vid nästa försök. Gå igenom felen nedan och öva riktat innan du försöker igen.</p>}
          {res.aiFeedback && <p className="mt-3 text-left text-sm text-[#c3cce0]"><strong>AI-återkoppling:</strong> {res.aiFeedback}</p>}
        </div>
        <div className="space-y-3">
          {res.items.map((it, k) => (
            <div key={k} className="card space-y-2 p-4">
              <div className="text-xs text-[#8d99b3]">Uppgift {k + 1}</div>
              <Rich text={started!.exercises[k].prompt} />
              <Feedback result={it} explanation={it.explanation} />
            </div>
          ))}
        </div>
        {!res.passed && weak.length > 0 && (
          <div className="card p-4"><div className="mb-2 font-semibold">Öva riktat på:</div>
            <div className="flex flex-wrap gap-2">{weak.map((w) => <Pill key={w} tone="red">{w.split(".")[1] ?? w}</Pill>)}</div>
            {getLesson(lessonId) && <Link className="btn btn-ghost mt-3 w-full" href={`/lektion/${lessonId}?steg=6`}>Gå till guidad träning</Link>}
          </div>
        )}
        <div className="flex gap-2">
          {!res.passed && <button className="btn btn-gold flex-1" onClick={() => { setRes(null); setPhase("idle"); setTimeout(start, 0); }}>Försök igen (nya tal)</button>}
          <button className="btn btn-ghost flex-1" onClick={() => onClose?.(res)}>Klar</button>
        </div>
      </div>
    );
  }

  if (!started) return null;
  const spec = started.exercises[i];
  const last = i === started.exercises.length - 1;
  return (
    <div className="space-y-4">
      {error && <div className="rounded-xl border border-[#ef6a6a]/40 bg-[#ef6a6a]/10 p-3 text-sm text-[#ef6a6a]">{error}</div>}
      <div className="flex items-center gap-3"><Bar value={(i + 1) / started.exercises.length} /><span className="whitespace-nowrap text-sm text-[#8d99b3]">{i + 1}/{started.exercises.length}</span></div>
      <div className="card space-y-4 p-5">
        <ExerciseView key={spec.id} spec={spec} value={answers[i]} onChange={(a) => setAnswers((arr) => arr.map((x, k) => (k === i ? a : x)))} />
        <div className="flex gap-2">
          <button className="btn btn-ghost" disabled={i === 0} onClick={() => setI(i - 1)}>‹</button>
          {!last ? <button className="btn btn-gold flex-1" disabled={!isAnswered(spec, answers[i])} onClick={() => setI(i + 1)}>Nästa</button>
            : <button className="btn btn-gold flex-1" disabled={answers.some((a, k) => !isAnswered(started.exercises[k], a))} onClick={submit}>Lämna in</button>}
        </div>
      </div>
      <p className="text-center text-xs text-[#8d99b3]">Provet rättas på servern. Inga ledtrådar under provet.</p>
    </div>
  );
}
