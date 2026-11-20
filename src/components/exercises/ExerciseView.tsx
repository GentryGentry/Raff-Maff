"use client";
import { useEffect, useRef, useState } from "react";
import { Rich } from "@/components/Rich";
import { FractionBarV, VisualView } from "@/components/visuals";
import { sv } from "@/lib/engine/gen-helpers";
import type { Answer, ExerciseSpec } from "@/lib/engine/types";

export interface ExProps { spec: ExerciseSpec; value: Answer | undefined; onChange: (a: Answer) => void; disabled?: boolean }

const TEXT_SKILLS = /^(w1-l9|w5|w8)\./; // roman numerals, fractions ("3/4") and negative numbers need a full keyboard

export function emptyAnswer(spec: ExerciseSpec): Answer {
  switch (spec.kind) {
    case "mc": return { kind: "mc", value: null };
    case "numeric": return { kind: "numeric", value: "" };
    case "column": return { kind: "column", result: "", carries: [], partials: [] };
    case "numberline": return { kind: "numberline", value: null };
    case "fractionbar": return { kind: "fractionbar", value: 0 };
    case "areamodel": return { kind: "areamodel", cells: [], total: "" };
    case "longdiv": return { kind: "longdiv", q: [], prod: [], rem: [] };
    case "multifield": return { kind: "multifield", values: spec.fields.map(() => "") };
    case "text": return { kind: "text", value: "" };
  }
}

export function isAnswered(spec: ExerciseSpec, a: Answer | undefined): boolean {
  if (!a) return false;
  switch (a.kind) {
    case "mc": case "numberline": return a.value !== null;
    case "numeric": return a.value.trim() !== "";
    case "column": return a.result.trim() !== "";
    case "fractionbar": return a.value > 0;
    case "areamodel": return a.total.trim() !== "";
    case "longdiv": return a.q.some((x) => (x ?? "").trim() !== "");
    case "multifield": return a.values.some((v) => v.trim() !== "");
    case "text": return spec.kind === "text" ? a.value.trim().length > 0 : false;
  }
}

/* ───────── digit cells ───────── */
function DigitRow({ n, value, onChange, disabled, label, tone }: { n: number; value: string; onChange: (v: string) => void; disabled?: boolean; label?: string; tone?: "gold" }) {
  const [cells, setCells] = useState<string[]>(() => { const a = Array(n).fill(""); const v = value.replace(/\s/g, ""); for (let i = 0; i < v.length && i < n; i++) a[n - v.length + i] = v[i]; return a; });
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const set = (i: number, ch: string) => {
    const next = [...cells]; next[i] = ch; setCells(next); onChange(next.join(""));
    if (ch && i > 0) refs.current[i - 1]?.focus();
  };
  return (
    <div className="flex items-center justify-end gap-1" aria-label={label}>
      {cells.map((c, i) => (
        <input key={i} ref={(el) => { refs.current[i] = el; }} value={c} disabled={disabled} inputMode="numeric" maxLength={1} aria-label={`${label ?? "siffra"} ${n - i}`}
          onFocus={(e) => e.target.select()}
          onKeyDown={(e) => { if (e.key === "Backspace" && !cells[i] && i < n - 1) refs.current[i + 1]?.focus(); }}
          onChange={(e) => set(i, e.target.value.replace(/\D/g, "").slice(-1))}
          className={`h-11 w-9 rounded-lg border bg-[#070d1c] text-center text-xl font-semibold text-white ${tone === "gold" ? "border-[#e8b64a]/50" : "border-[#223660]"} focus:border-[#e8b64a] focus:outline-none`} />
      ))}
    </div>
  );
}

function StaticDigits({ s, n, sign }: { s: string; n: number; sign?: string }) {
  const padded = s.padStart(n, " ").split("");
  return (
    <div className="flex items-center justify-end gap-1">
      {sign && <span className="mr-1 w-5 text-xl text-[#e8b64a]">{sign}</span>}
      {padded.map((c, i) => <div key={i} className="flex h-11 w-9 items-center justify-center text-2xl font-semibold">{c.trim()}</div>)}
    </div>
  );
}

function ColumnInput({ spec, value, onChange, disabled }: ExProps & { spec: Extract<ExerciseSpec, { kind: "column" }> }) {
  const a = (value?.kind === "column" ? value : { kind: "column" as const, result: "", carries: [], partials: [] });
  const sa = String(spec.a), sb = String(spec.b);
  const width = Math.max(sa.length, sb.length);
  const resultLen = String(spec.op === "add" ? spec.a + spec.b : spec.op === "sub" ? spec.a - spec.b : spec.a * spec.b).length;
  const cols = Math.max(width + (spec.op === "add" ? 1 : 0), resultLen, spec.op === "mul" ? resultLen : 0);
  const sign = spec.op === "add" ? "+" : spec.op === "sub" ? "−" : "·";
  const upd = (patch: Partial<typeof a>) => onChange({ ...a, ...patch });
  const setIdx = (arr: string[], i: number, v: string) => { const n = [...arr]; while (n.length <= i) n.push(""); n[i] = v; return n; };
  const markers = spec.op !== "mul";
  // marker above column index c (from right): add -> carry from c-1 sits above c; sub -> växling marker above column c itself
  return (
    <div className="mx-auto w-fit space-y-1 rounded-2xl border border-[#223660] bg-[#0b1428] p-3">
      {markers && (
        <div>
          <div className="mb-1 text-right text-[11px] text-[#8d99b3]">{spec.op === "add" ? "Minnessiffror (skriv 1 ovanför nästa kolumn)" : "Växling (skriv 1 i kolumnen som växlas)"}</div>
          <div className="flex justify-end gap-1">
            {Array.from({ length: cols }, (_, k) => {
              const c = cols - 1 - k; // column index from right
              const idx = spec.op === "add" ? c - 1 : c;
              const valid = idx >= 0 && idx <= width - 2;
              return valid ? (
                <input key={k} value={a.carries[idx] ?? ""} disabled={disabled} inputMode="numeric" maxLength={1} aria-label={`${spec.op === "add" ? "minnessiffra" : "växling"} kolumn ${idx + 1}`}
                  onChange={(e) => upd({ carries: setIdx(a.carries, idx, e.target.value.replace(/\D/g, "").slice(-1)) })}
                  className="h-8 w-9 rounded-md border border-dashed border-[#e8b64a]/50 bg-transparent text-center text-sm text-[#e8b64a] focus:outline-none focus:ring-1 focus:ring-[#e8b64a]" />
              ) : <div key={k} className="h-8 w-9" />;
            })}
          </div>
        </div>
      )}
      <StaticDigits s={sa} n={cols} />
      <StaticDigits s={sb} n={cols} sign={sign} />
      <div className="my-1 h-0.5 rounded bg-white/70" />
      {spec.op === "mul" && sb.length > 1 && (
        <div className="space-y-1">
          {sb.split("").reverse().map((d, i) => (
            <div key={i}>
              <div className="text-right text-[11px] text-[#8d99b3]">Delprodukt: {spec.a} · {d}{i ? " · " + 10 ** i : ""}</div>
              <DigitRow n={cols} value={a.partials[i] ?? ""} disabled={disabled} label={`delprodukt ${i + 1}`} tone="gold" onChange={(v) => upd({ partials: setIdx(a.partials, i, v) })} />
            </div>
          ))}
          <div className="my-1 h-0.5 rounded bg-white/70" />
        </div>
      )}
      <div className="text-right text-[11px] text-[#8d99b3]">Svar</div>
      <DigitRow n={cols} value={a.result} disabled={disabled} label="svar" onChange={(v) => upd({ result: v })} />
    </div>
  );
}

/* ───────── number line ───────── */
function NumberLineInput({ spec, value, onChange, disabled }: ExProps & { spec: Extract<ExerciseSpec, { kind: "numberline" }> }) {
  const sel = value?.kind === "numberline" ? value.value : null;
  const n = Math.round((spec.max - spec.min) / spec.step);
  const fmt = (v: number) => (spec.den ? (v % spec.den === 0 ? String(v / spec.den) : `${v}/${spec.den}`) : sv(v));
  const x = (v: number) => 16 + ((v - spec.min) / (spec.max - spec.min)) * 288;
  const pick = (clientX: number, el: SVGSVGElement) => {
    if (disabled) return;
    const r = el.getBoundingClientRect();
    const vx = ((clientX - r.left) / r.width) * 320;
    const t = Math.min(n, Math.max(0, Math.round(((vx - 16) / 288) * n)));
    onChange({ kind: "numberline", value: Math.round((spec.min + t * spec.step) * 1e6) / 1e6 });
  };
  const nudge = (d: number) => { const cur = sel ?? spec.min; onChange({ kind: "numberline", value: Math.min(spec.max, Math.max(spec.min, Math.round((cur + d * spec.step) * 1e6) / 1e6)) }); };
  return (
    <div className="space-y-2">
      <svg viewBox="0 0 320 84" className="w-full touch-manipulation select-none" onPointerDown={(e) => pick(e.clientX, e.currentTarget)} role="img" aria-label="Tallinje – tryck för att placera">
        <line x1={12} x2={308} y1={40} y2={40} stroke="#fff" strokeWidth={2} />
        {Array.from({ length: n + 1 }, (_, i) => {
          const v = spec.min + i * spec.step;
          const major = Math.abs((v - spec.min) / spec.labelEvery - Math.round((v - spec.min) / spec.labelEvery)) < 1e-9;
          return <g key={i}><line x1={x(v)} x2={x(v)} y1={major ? 28 : 33} y2={major ? 52 : 47} stroke="#fff" strokeOpacity={major ? 1 : 0.6} />{major && <text x={x(v)} y={68} textAnchor="middle" fill="#8d99b3" fontSize={10}>{fmt(v)}</text>}</g>;
        })}
        {sel !== null && <g><circle cx={x(sel)} cy={40} r={8} fill="#e8b64a" /><text x={x(sel)} y={20} textAnchor="middle" fill="#e8b64a" fontSize={12} fontWeight={700}>{fmt(sel)}</text></g>}
      </svg>
      <div className="flex items-center justify-center gap-3">
        <button type="button" className="btn btn-ghost" disabled={disabled} onClick={() => nudge(-1)} aria-label="Flytta ett steg åt vänster">◀</button>
        <span className="min-w-24 text-center text-sm text-[#8d99b3]">{sel === null ? "Tryck på linjen" : `Valt: ${fmt(sel)}`}</span>
        <button type="button" className="btn btn-ghost" disabled={disabled} onClick={() => nudge(1)} aria-label="Flytta ett steg åt höger">▶</button>
      </div>
    </div>
  );
}

/* ───────── long division ───────── */
function LongDivInput({ spec, value, onChange, disabled }: ExProps & { spec: Extract<ExerciseSpec, { kind: "longdiv" }> }) {
  const a = value?.kind === "longdiv" ? value : { kind: "longdiv" as const, q: [], prod: [], rem: [] };
  const ds = String(spec.a).split("");
  const steps = ds.length - spec.p0;
  const set = (key: "q" | "prod" | "rem", i: number, v: string, max: number) => {
    const arr = [...a[key]]; while (arr.length <= i) arr.push("");
    arr[i] = v.replace(/\D/g, "").slice(0, max);
    onChange({ ...a, [key]: arr });
  };
  const cell = "h-11 w-full rounded-lg border border-[#223660] bg-[#070d1c] text-center text-lg font-semibold text-white focus:border-[#e8b64a] focus:outline-none";
  return (
    <div className="space-y-3 rounded-2xl border border-[#223660] bg-[#0b1428] p-3">
      <div className="flex items-center justify-center gap-3 text-3xl font-semibold" aria-label={`${spec.a} delat med ${spec.b}`}>
        <span>{spec.b}</span><span className="text-[#e8b64a]">)</span>
        <span className="tracking-widest">{ds.map((d, i) => <span key={i} className={i <= spec.p0 ? "text-white" : "text-[#8d99b3]"}>{d}</span>)}</span>
      </div>
      <p className="text-center text-xs text-[#8d99b3]">Skriv i varje steg: kvotsiffra, produkt (kvotsiffra · {spec.b}) och rest.</p>
      {Array.from({ length: steps }, (_, i) => (
        <div key={i} className="rounded-xl bg-[#111d38] p-3">
          <div className="mb-2 text-sm text-[#c3cce0]">Steg {i + 1}: {i === 0 ? <>Börja med talet <strong>{String(spec.a).slice(0, spec.p0 + 1)}</strong></> : <>Ta ner siffran <strong>{ds[spec.p0 + i]}</strong></>}</div>
          <div className="grid grid-cols-3 gap-2 text-[11px] text-[#8d99b3]">
            <label>Kvotsiffra<input className={cell} inputMode="numeric" disabled={disabled} aria-label={`kvotsiffra ${i + 1}`} value={a.q[i] ?? ""} onChange={(e) => set("q", i, e.target.value, 1)} /></label>
            <label>Produkt<input className={cell} inputMode="numeric" disabled={disabled} aria-label={`produkt ${i + 1}`} value={a.prod[i] ?? ""} onChange={(e) => set("prod", i, e.target.value, 4)} /></label>
            <label>Rest<input className={cell} inputMode="numeric" disabled={disabled} aria-label={`rest ${i + 1}`} value={a.rem[i] ?? ""} onChange={(e) => set("rem", i, e.target.value, 4)} /></label>
          </div>
        </div>
      ))}
      <div className="text-center text-sm text-[#c3cce0]">Kvot: <strong className="text-lg text-[#f3d58a]">{a.q.slice(0, steps).map((x) => x || "_").join("")}</strong>{(a.rem[steps - 1] ?? "") !== "" && a.rem[steps - 1] !== "0" ? <> rest <strong>{a.rem[steps - 1]}</strong></> : null}</div>
    </div>
  );
}

/* ───────── area model ───────── */
function AreaInput({ spec, value, onChange, disabled }: ExProps & { spec: Extract<ExerciseSpec, { kind: "areamodel" }> }) {
  const a = value?.kind === "areamodel" ? value : { kind: "areamodel" as const, cells: [], total: "" };
  const setCell = (i: number, v: string) => { const c = [...a.cells]; while (c.length <= i) c.push(""); c[i] = v.replace(/[^\d]/g, ""); onChange({ ...a, cells: c }); };
  const cols = spec.aParts.length;
  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <div className="inline-grid gap-1" style={{ gridTemplateColumns: `auto repeat(${cols}, minmax(4.5rem, 1fr))` }}>
          <div />
          {spec.aParts.map((p) => <div key={p} className="text-center text-sm font-semibold text-[#e8b64a]">{sv(p)}</div>)}
          {spec.bParts.map((bp, r) => (
            <div key={bp} className="contents">
              <div className="flex items-center pr-2 text-sm font-semibold text-[#e8b64a]">{sv(bp)}</div>
              {spec.aParts.map((ap, c) => (
                <input key={ap} inputMode="numeric" disabled={disabled} value={a.cells[r * cols + c] ?? ""} onChange={(e) => setCell(r * cols + c, e.target.value)} aria-label={`${ap} gånger ${bp}`} placeholder={`${ap}·${bp}`}
                  className="h-14 rounded-lg border border-[#3b82f6]/60 bg-[#3b82f6]/10 text-center text-lg font-semibold text-white placeholder:text-[11px] placeholder:text-[#8d99b3] focus:border-[#e8b64a] focus:outline-none" />
              ))}
            </div>
          ))}
        </div>
      </div>
      <label className="flex items-center gap-3 text-sm text-[#8d99b3]">Summa (hela produkten)
        <input className="field max-w-[10rem]" inputMode="numeric" disabled={disabled} value={a.total} onChange={(e) => onChange({ ...a, total: e.target.value.replace(/[^\d]/g, "") })} />
      </label>
    </div>
  );
}

export function ExerciseView({ spec, value, onChange, disabled }: ExProps) {
  const props = { spec, value, onChange, disabled } as ExProps;
  return (
    <div className="space-y-4">
      <Rich text={spec.prompt} className="text-[17px]" />
      {"visual" in spec && spec.visual && <div className="flex justify-center overflow-x-auto rounded-xl bg-[#070d1c] p-3"><VisualView v={spec.visual} /></div>}
      {spec.kind === "mc" && (
        <div className="grid gap-2" role="radiogroup">
          {spec.options.map((o, i) => {
            const on = value?.kind === "mc" && value.value === i;
            return (
              <button key={i} type="button" role="radio" aria-checked={on} disabled={disabled} onClick={() => onChange({ kind: "mc", value: i })}
                className={`min-h-[52px] rounded-xl border px-4 py-3 text-left text-[16px] transition ${on ? "border-[#e8b64a] bg-[#e8b64a]/15" : "border-[#223660] bg-[#0b1428] active:bg-[#182848]"}`}>
                <Rich text={o} />
              </button>
            );
          })}
        </div>
      )}
      {spec.kind === "numeric" && (
        <div className="flex items-center gap-2">
          <input className="field max-w-[14rem]" disabled={disabled} inputMode={TEXT_SKILLS.test(spec.skill) ? "text" : "decimal"} autoCapitalize="characters" autoComplete="off" enterKeyHint="done" aria-label="Ditt svar" placeholder="Ditt svar"
            value={value?.kind === "numeric" ? value.value : ""} onChange={(e) => onChange({ kind: "numeric", value: e.target.value })} />
          {spec.unit && <span className="text-[#8d99b3]">{spec.unit}</span>}
        </div>
      )}
      {spec.kind === "multifield" && (
        <div className="grid gap-2 sm:grid-cols-2">
          {spec.fields.map((f, i) => (
            <label key={i} className="block text-sm text-[#8d99b3]">{f.label}
              <input className="field mt-1" disabled={disabled} inputMode="text" autoCapitalize="characters" autoComplete="off" value={value?.kind === "multifield" ? value.values[i] ?? "" : ""}
                onChange={(e) => { const v = value?.kind === "multifield" ? [...value.values] : spec.fields.map(() => ""); v[i] = e.target.value; onChange({ kind: "multifield", values: v }); }} />
              {f.suffix && <span className="ml-1">{f.suffix}</span>}
            </label>
          ))}
        </div>
      )}
      {spec.kind === "column" && <ColumnInput {...props} spec={spec} />}
      {spec.kind === "numberline" && <NumberLineInput {...props} spec={spec} />}
      {spec.kind === "areamodel" && <AreaInput {...props} spec={spec} />}
      {spec.kind === "longdiv" && <LongDivInput {...props} spec={spec} />}
      {spec.kind === "fractionbar" && (
        <div className="space-y-2">
          <FractionBarV parts={spec.parts} shaded={value?.kind === "fractionbar" ? value.value : 0} onToggle={disabled ? undefined : (i) => onChange({ kind: "fractionbar", value: value?.kind === "fractionbar" && value.value === i + 1 ? i : i + 1 })} />
          <div className="text-center text-sm text-[#8d99b3]">{value?.kind === "fractionbar" ? value.value : 0} av {spec.parts} delar färgade</div>
        </div>
      )}
      {spec.kind === "text" && <TextInput spec={spec} value={value} onChange={onChange} disabled={disabled} />}
    </div>
  );
}

function TextInput({ spec, value, onChange, disabled }: ExProps & { spec: Extract<ExerciseSpec, { kind: "text" }> }) {
  const v = value?.kind === "text" ? value.value : "";
  useEffect(() => { /* keep controlled */ }, []);
  return (
    <div className="space-y-2">
      {spec.scenario && (
        <div className="rounded-xl border border-[#e8b64a]/30 bg-[#e8b64a]/5 p-4">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#e8b64a]">Elevsituation</div>
          <Rich text={spec.scenario} />
        </div>
      )}
      <textarea className="field" disabled={disabled} placeholder="Skriv din förklaring till eleven …" value={v} onChange={(e) => onChange({ kind: "text", value: e.target.value })} aria-label="Din förklaring" />
      <div className={`text-right text-xs ${v.trim().length >= spec.minChars ? "text-[#3ecf8e]" : "text-[#8d99b3]"}`}>{v.trim().length} / minst {spec.minChars} tecken</div>
    </div>
  );
}
