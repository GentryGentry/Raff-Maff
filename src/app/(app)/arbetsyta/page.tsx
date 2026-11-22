"use client";
import { useState } from "react";
import { ExerciseView, emptyAnswer } from "@/components/exercises/ExerciseView";
import { Feedback } from "@/components/runners";
import { PageHeader } from "@/components/ui";
import { Workspace, type Preset } from "@/components/Workspace";
import { gradeExercise } from "@/lib/engine/grading";
import { columnEx } from "@/lib/engine/gen-helpers";
import type { Answer } from "@/lib/engine/types";

const PRESETS: [Preset, string][] = [["grid", "Rutat papper"], ["numberline", "Tallinje"], ["fraction", "Bråkstapel"], ["fractioncircle", "Bråkcirkel"], ["hundredgrid", "Hundrarutnät"], ["area", "Areamodell"], ["coordinate", "Koordinater"], ["column", "Kolumner"]];

export default function WorkspacePage() {
  const [mode, setMode] = useState<"free" | "column">("free");
  const [preset, setPreset] = useState<Preset>("grid");
  const [op, setOp] = useState<"add" | "sub" | "mul">("add");
  const [a, setA] = useState("478"); const [b, setB] = useState("256");
  const [ans, setAns] = useState<Answer | undefined>();
  const [res, setRes] = useState<ReturnType<typeof gradeExercise> | null>(null);
  const na = Math.max(0, Math.min(99999, Number(a) || 0)), nb = Math.max(0, Math.min(9999, Number(b) || 0));
  const valid = op !== "sub" || na >= nb;
  const ex = valid ? columnEx("free", "free.column", op, na, nb, "", []) : null;
  return (
    <div className="pb-6">
      <PageHeader title="Räkneyta" subtitle="Rita med fingret eller räkna i strukturerad uppställning." back={{ href: "/profil", label: "Profil" }} />
      <div className="space-y-4 px-5">
        <div className="grid grid-cols-2 gap-2">{([["free", "Frihand"], ["column", "Uppställning"]] as const).map(([m, l]) => <button key={m} className={`btn ${mode === m ? "btn-gold" : "btn-ghost"}`} onClick={() => setMode(m)}>{l}</button>)}</div>
        {mode === "free" ? (
          <>
            <div className="flex gap-1.5 overflow-x-auto pb-1">{PRESETS.map(([p, l]) => <button key={p} className={`shrink-0 rounded-full px-3.5 py-2 text-sm ${preset === p ? "bg-hl text-onhl" : "bg-paper2"}`} onClick={() => setPreset(p)}>{l}</button>)}</div>
            <Workspace key={preset} preset={preset} storageKey={`free-${preset}`} height={440} />
          </>
        ) : (
          <div className="card space-y-4 p-5">
            <div className="flex gap-2">{([["add", "+"], ["sub", "−"], ["mul", "·"]] as const).map(([o, l]) => <button key={o} className={`btn flex-1 ${op === o ? "btn-gold" : "btn-ghost"}`} onClick={() => { setOp(o); setAns(undefined); setRes(null); }}>{l}</button>)}</div>
            <div className="flex gap-2"><input className="field" inputMode="numeric" value={a} onChange={(e) => { setA(e.target.value.replace(/\D/g, "").slice(0, 5)); setAns(undefined); setRes(null); }} aria-label="Första talet" /><input className="field" inputMode="numeric" value={b} onChange={(e) => { setB(e.target.value.replace(/\D/g, "").slice(0, 4)); setAns(undefined); setRes(null); }} aria-label="Andra talet" /></div>
            {!valid && <p className="text-sm text-bad">Vid subtraktion måste första talet vara minst lika stort.</p>}
            {ex && <ExerciseView key={`${op}${na}${nb}`} spec={{ ...ex.spec, prompt: "Ställ upp och räkna. Skriv minnessiffror, växlingar och delprodukter." }} value={ans ?? emptyAnswer(ex.spec)} onChange={setAns} />}
            {ex && <button className="btn btn-gold w-full" onClick={() => setRes(gradeExercise(ex, ans))}>Kontrollera metod och svar</button>}
            {res && <Feedback result={res} />}
            <p className="text-xs text-muted">Här bedöms både ditt svar och dina mellansteg. Övningen ger ingen XP.</p>
          </div>
        )}
      </div>
    </div>
  );
}
