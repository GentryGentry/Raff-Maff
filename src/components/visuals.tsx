"use client";
import { useState } from "react";
import type { Visual } from "@/lib/engine/types";
import { sv } from "@/lib/engine/gen-helpers";

const GOLD = "#e8b64a";
const LINE = "#3a4c78";

function PlaceValue({ value }: { value: number }) {
  const digits = String(value).split("");
  const names = ["Ental", "Tiotal", "Hundratal", "Tusental", "Tiotusental", "Hundratusental", "Miljontal"];
  const cols = digits.length;
  const w = Math.min(64, 300 / cols);
  return (
    <svg viewBox={`0 0 ${cols * w + 8} 100`} className="w-full max-w-sm" role="img" aria-label={`Platsvärdestabell för ${sv(value)}`}>
      {digits.map((d, i) => {
        const place = cols - 1 - i;
        return (
          <g key={i} transform={`translate(${4 + i * w},4)`}>
            <rect width={w - 4} height={36} rx={6} fill="#182848" stroke={LINE} />
            <text x={(w - 4) / 2} y={24} textAnchor="middle" fill="#8d99b3" fontSize={Math.min(10, w / 5.5)}>{names[place]?.slice(0, 9)}</text>
            <rect y={42} width={w - 4} height={52} rx={6} fill="#0b1428" stroke={d === "0" ? LINE : GOLD} />
            <text x={(w - 4) / 2} y={78} textAnchor="middle" fill="#fff" fontSize={30} fontWeight={700}>{d}</text>
          </g>
        );
      })}
    </svg>
  );
}

function BaseTen({ value }: { value: number }) {
  const th = Math.floor(value / 1000), h = Math.floor((value % 1000) / 100), t = Math.floor((value % 100) / 10), u = value % 10;
  const items: { x: number; y: number; w: number; h: number; c: string; label?: string }[] = [];
  let x = 4;
  for (let i = 0; i < th; i++) { items.push({ x, y: 10, w: 34, h: 34, c: "#7a5cff", label: "1000" }); x += 38; }
  if (th) x += 8;
  for (let i = 0; i < h; i++) { items.push({ x, y: 10, w: 28, h: 28, c: "#3b82f6", label: "100" }); x += 32; }
  if (h) x += 8;
  for (let i = 0; i < t; i++) { items.push({ x, y: 4, w: 8, h: 40, c: GOLD }); x += 12; }
  if (t) x += 8;
  for (let i = 0; i < u; i++) { items.push({ x, y: 34, w: 9, h: 9, c: "#3ecf8e" }); x += 13; }
  const width = Math.max(x + 4, 120);
  return (
    <svg viewBox={`0 0 ${width} 52`} className="w-full max-w-md" role="img" aria-label={`Basblock för ${sv(value)}`}>
      {items.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={2} fill={b.c} fillOpacity={0.85} stroke="#fff" strokeOpacity={0.4} strokeWidth={0.6} />
          {b.label && <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 3} textAnchor="middle" fontSize={8} fill="#fff">{b.label}</text>}
        </g>
      ))}
    </svg>
  );
}

function NumberLineV({ min, max, step, marks = [], labelEvery }: { min: number; max: number; step: number; marks?: number[]; labelEvery?: number }) {
  const n = Math.round((max - min) / step);
  const x = (v: number) => 16 + ((v - min) / (max - min)) * 288;
  const le = labelEvery ?? (max - min);
  return (
    <svg viewBox="0 0 320 70" className="w-full max-w-md" role="img" aria-label="Tallinje">
      <line x1={12} x2={308} y1={36} y2={36} stroke="#fff" strokeWidth={2} />
      {Array.from({ length: n + 1 }, (_, i) => {
        const v = min + i * step;
        const major = Math.abs(((v - min) / le) - Math.round((v - min) / le)) < 1e-9;
        return <g key={i}><line x1={x(v)} x2={x(v)} y1={major ? 26 : 30} y2={major ? 46 : 42} stroke="#fff" />{major && <text x={x(v)} y={62} textAnchor="middle" fill="#8d99b3" fontSize={10}>{sv(v)}</text>}</g>;
      })}
      {marks.map((m) => <g key={m}><circle cx={x(m)} cy={36} r={6} fill={GOLD} /><text x={x(m)} y={18} textAnchor="middle" fill={GOLD} fontSize={11} fontWeight={700}>{sv(m)}</text></g>)}
    </svg>
  );
}

export function FractionBarV({ parts, shaded, onToggle }: { parts: number; shaded: number; onToggle?: (i: number) => void }) {
  const w = 288 / parts;
  return (
    <svg viewBox="0 0 320 60" className="w-full max-w-md touch-manipulation" role="img" aria-label={`Bråkstapel ${shaded} av ${parts}`}>
      {Array.from({ length: parts }, (_, i) => (
        <rect key={i} x={16 + i * w} y={10} width={w} height={40} rx={3} fill={i < shaded ? GOLD : "#0b1428"} fillOpacity={i < shaded ? 0.9 : 1} stroke="#fff" strokeOpacity={0.6} onClick={() => onToggle?.(i)} style={{ cursor: onToggle ? "pointer" : undefined }} />
      ))}
    </svg>
  );
}

function AreaV({ a, b }: { a: number; b: number }) {
  const c = Math.min(26, 280 / Math.max(a, 1), 160 / Math.max(b, 1));
  return (
    <svg viewBox={`0 0 ${a * c + 8} ${b * c + 8}`} className="w-full max-w-xs" role="img" aria-label={`Rektangel ${a} gånger ${b}`}>
      {Array.from({ length: a * b }, (_, i) => <rect key={i} x={4 + (i % a) * c} y={4 + Math.floor(i / a) * c} width={c - 1} height={c - 1} rx={2} fill="#3b82f6" fillOpacity={0.7} />)}
    </svg>
  );
}

function Grouping({ value }: { value: number }) {
  const s = String(value);
  const groups: string[] = [];
  for (let i = s.length; i > 0; i -= 3) groups.unshift(s.slice(Math.max(0, i - 3), i));
  const names = ["ental", "tusental", "miljontal", "miljarder"];
  return (
    <div className="flex items-end justify-center gap-2" role="img" aria-label={`Talet ${sv(value)} indelat i grupper`}>
      {groups.map((g, i) => (
        <div key={i} className="text-center">
          <div className="rounded-lg border border-[#e8b64a]/60 bg-[#0b1428] px-3 py-2 font-mono text-2xl font-bold tracking-wider">{g}</div>
          <div className="mt-1 text-[11px] text-[#8d99b3]">{names[groups.length - 1 - i]}</div>
        </div>
      ))}
    </div>
  );
}

function Compare({ a, b }: { a: number; b: number }) {
  const row = (v: number, label: string) => (
    <div className="flex items-center gap-2">
      <div className="w-24 text-right text-sm text-[#8d99b3]">{label}</div>
      {String(v).split("").map((d, i) => <div key={i} className="h-10 w-9 rounded-md border border-[#3a4c78] bg-[#0b1428] text-center text-2xl font-bold leading-10">{d}</div>)}
      <div className="text-xs text-[#8d99b3]">{String(v).length} siffror</div>
    </div>
  );
  return <div className="space-y-2">{row(a, sv(a))}{row(b, sv(b))}</div>;
}

export function VisualView({ v }: { v: Visual }) {
  switch (v.type) {
    case "placevalue": return <PlaceValue value={v.value} />;
    case "baseten": return <BaseTen value={v.value} />;
    case "numberline": return <NumberLineV {...v} />;
    case "fractionbar": return <FractionBarV parts={v.parts} shaded={v.shaded} />;
    case "area": return <AreaV a={v.a} b={v.b} />;
    case "grouping": return <Grouping value={v.value} />;
    case "compare": return <Compare a={v.a} b={v.b} />;
  }
}

/** Interactive illustration: lets the learner change the number and watch the picture follow. */
export function LiveVisual({ v }: { v: Visual }) {
  const editable = v.type === "placevalue" || v.type === "baseten" || v.type === "grouping";
  const [val, setVal] = useState(editable ? v.value : 0);
  const vis: Visual = editable ? ({ ...v, value: val } as Visual) : v;
  return (
    <div className="space-y-3">
      <div className="flex justify-center overflow-x-auto py-1"><VisualView v={vis} /></div>
      {editable && (
        <label className="flex items-center gap-3 text-sm text-[#8d99b3]">
          Prova ett eget tal:
          <input className="field max-w-[9rem]" inputMode="numeric" value={val} onChange={(e) => { const n = Number(e.target.value.replace(/\D/g, "").slice(0, v.type === "baseten" ? 4 : v.type === "grouping" ? 10 : 7)); setVal(Number.isFinite(n) ? n : 0); }} />
        </label>
      )}
    </div>
  );
}
