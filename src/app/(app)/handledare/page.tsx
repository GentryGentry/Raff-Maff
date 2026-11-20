"use client";
import { useEffect, useRef, useState } from "react";
import { ExerciseView, emptyAnswer, isAnswered } from "@/components/exercises/ExerciseView";
import { Feedback } from "@/components/runners";
import { Rich } from "@/components/Rich";
import { PageHeader, Spinner } from "@/components/ui";
import { api, ApiError, useAppState } from "@/lib/client/state";
import { getLesson } from "@/lib/content";
import { gradeExercise } from "@/lib/engine/grading";
import { makeRng } from "@/lib/engine/rng";
import type { Answer, ConcreteExercise, ItemResult } from "@/lib/engine/types";

type Msg = { role: "user" | "assistant"; content: string };

export default function Tutor() {
  const { state, loading, config } = useAppState();
  const [lessonId, setLessonId] = useState<string | undefined>();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ex, setEx] = useState<ConcreteExercise | null>(null);
  const [ans, setAns] = useState<Answer | undefined>();
  const [res, setRes] = useState<ItemResult | null>(null);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => { const l = new URLSearchParams(window.location.search).get("lesson"); if (l) setLessonId(l); }, []);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, ex]);

  if (loading || !state) return <Spinner />;
  const lesson = lessonId ? getLesson(lessonId) : undefined;
  const lessons = Object.keys(state.unlocked).filter((id) => state.unlocked[id]);

  const send = async (text: string) => {
    if (!text.trim() || busy) return;
    const next = [...msgs, { role: "user" as const, content: text }];
    setMsgs(next); setInput(""); setBusy(true); setErr(null);
    try { const r = await api<{ reply: string }>("/api/tutor", { lessonId, messages: next }); setMsgs([...next, { role: "assistant", content: r.reply }]); }
    catch (e) { setErr(e instanceof ApiError ? e.message : "Fel."); }
    finally { setBusy(false); }
  };

  /** Exercises come from the validated generators (never invented by the AI), at a difficulty that follows recent performance. */
  const newExercise = () => {
    const l = lesson ?? getLesson(lessons[0]);
    if (!l) return;
    const m = state.mastery[l.id];
    const level = m.score >= 0.85 ? 2 : 1;
    const t = makeRng(`tutor-${Date.now()}`).pick([...l.knowledge, ...l.method]);
    setEx(t.gen(makeRng(`tutor-${Date.now()}-x`), { level })); setAns(undefined); setRes(null);
  };

  const quick = ["Förklara på ett annat sätt", "Ge mig en ledtråd – utan att avslöja svaret", "Vilken missuppfattning är vanlig här?", "Hjälp mig förklara detta för en elev i åk 4", "Vad bör jag repetera?"];
  return (
    <div className="flex min-h-[calc(100dvh-7rem)] flex-col pb-4">
      <PageHeader title="AI-handledare" subtitle="Raff hjälper dig förstå – men kan inte låsa upp nivåer." back={{ href: "/profil", label: "Profil" }} />
      <div className="flex-1 space-y-3 px-5">
        {config && !config.ai && <div className="card border-[#e8b64a]/40 p-4 text-sm text-[#f3d58a]">AI-handledaren är inte aktiverad på servern (OPENAI_API_KEY saknas). Du kan fortfarande få nya övningar nedan.</div>}
        <label className="block text-sm text-[#8d99b3]">Lektion
          <select className="field mt-1" value={lessonId ?? ""} onChange={(e) => setLessonId(e.target.value || undefined)}><option value="">Ingen vald</option>{lessons.map((id) => <option key={id} value={id}>{getLesson(id)?.title}</option>)}</select></label>
        <div className="flex gap-2 overflow-x-auto pb-1">{quick.map((q) => <button key={q} className="shrink-0 rounded-full bg-[#182848] px-3.5 py-2 text-sm" onClick={() => send(q)}>{q}</button>)}<button className="shrink-0 rounded-full bg-[#e8b64a] px-3.5 py-2 text-sm font-semibold text-black" onClick={newExercise}>🎲 Ny övning</button></div>
        {msgs.map((m, i) => <div key={i} className={`max-w-[92%] rounded-2xl px-4 py-3 ${m.role === "user" ? "ml-auto bg-[#e8b64a]/20" : "card"}`}><Rich text={m.content} /></div>)}
        {ex && (
          <div className="card space-y-3 p-5"><div className="text-xs font-semibold uppercase text-[#e8b64a]">Ny övning</div>
            <ExerciseView key={ex.spec.id} spec={ex.spec} value={ans ?? emptyAnswer(ex.spec)} onChange={setAns} disabled={!!res} />
            {res ? <><Feedback result={res} explanation={ex.explanation} /><button className="btn btn-ghost w-full" onClick={newExercise}>Nästa övning</button><button className="btn btn-ghost w-full" onClick={() => send(`Jag svarade fel på: "${ex.spec.prompt}". Förklara min missuppfattning utan att bara ge svaret.`)}>Förklara mitt fel</button></>
              : <button className="btn btn-gold w-full" disabled={!isAnswered(ex.spec, ans)} onClick={() => setRes(gradeExercise(ex, ans))}>Kontrollera</button>}
          </div>
        )}
        {busy && <Spinner label="Raff tänker …" />}
        {err && <div className="rounded-xl border border-[#ef6a6a]/40 bg-[#ef6a6a]/10 p-3 text-sm text-[#ef6a6a]">{err}</div>}
        <div ref={end} />
      </div>
      <form className="safe-bottom sticky bottom-20 mx-5 mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); void send(input); }}>
        <input className="field" placeholder="Ställ en fråga …" value={input} onChange={(e) => setInput(e.target.value)} aria-label="Din fråga" />
        <button className="btn btn-gold" disabled={busy || !input.trim()}>Skicka</button>
      </form>
    </div>
  );
}
