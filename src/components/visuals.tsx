"use client";
import { useState } from "react";
import type { Visual } from "@/lib/engine/types";
import { sv, tickLabel } from "@/lib/engine/gen-helpers";
import { BarModelV, BarChartV, ComboTableV, LineChartV, MarblesV, PictogramV, SpinnerV, AngleV, CircleV, ClockV, RulerV, CoordPlane, CuboidV, PolygonV, SolidV } from "@/components/geo-visuals";

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

function NumberLineV({ min, max, step, marks = [], labelEvery, den, dp, unit }: { min: number; max: number; step: number; marks?: number[]; labelEvery?: number; den?: number; dp?: number; unit?: string }) {
  const fmt = (v: number) => tickLabel(v, den, dp, unit);
  const n = Math.round((max - min) / step);
  const x = (v: number) => 16 + ((v - min) / (max - min)) * 288;
  const le = labelEvery ?? (max - min);
  return (
    <svg viewBox="0 0 320 70" className="w-full max-w-md" role="img" aria-label="Tallinje">
      <line x1={12} x2={308} y1={36} y2={36} stroke="#fff" strokeWidth={2} />
      {Array.from({ length: n + 1 }, (_, i) => {
        const v = min + i * step;
        const major = Math.abs(((v - min) / le) - Math.round((v - min) / le)) < 1e-9;
        return <g key={i}><line x1={x(v)} x2={x(v)} y1={major ? 26 : 30} y2={major ? 46 : 42} stroke="#fff" />{major && <text x={x(v)} y={62} textAnchor="middle" fill="#8d99b3" fontSize={10}>{fmt(v)}</text>}</g>;
      })}
      {marks.map((m) => <g key={m}><circle cx={x(m)} cy={36} r={6} fill={GOLD} /><text x={x(m)} y={18} textAnchor="middle" fill={GOLD} fontSize={11} fontWeight={700}>{fmt(m)}</text></g>)}
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

function FractionBarsV({ bars }: { bars: { parts: number; shaded: number; label?: string }[] }) {
  const h = 26, gap = 10;
  return (
    <svg viewBox={`0 0 340 ${bars.length * (h + gap)}`} className="w-full max-w-md" role="img" aria-label="Bråkstaplar i jämförelse">
      {bars.map((b, r) => {
        const w = 270 / b.parts, y = r * (h + gap);
        return (
          <g key={r}>
            <text x={0} y={y + h / 2 + 4} fontSize={12} fill="#c3cce0">{b.label ?? `${b.shaded}/${b.parts}`}</text>
            {Array.from({ length: b.parts }, (_, i) => <rect key={i} x={66 + i * w} y={y} width={w} height={h} fill={i < b.shaded ? GOLD : "#0b1428"} fillOpacity={i < b.shaded ? 0.9 : 1} stroke="#fff" strokeOpacity={0.6} />)}
          </g>
        );
      })}
    </svg>
  );
}

function FractionCircleV({ parts, shaded }: { parts: number; shaded: number }) {
  const r = 52, cx = 60, cy = 60;
  const pt = (i: number) => [cx + r * Math.sin((2 * Math.PI * i) / parts), cy - r * Math.cos((2 * Math.PI * i) / parts)];
  return (
    <svg viewBox="0 0 120 120" className="w-40" role="img" aria-label={`Bråkcirkel ${shaded} av ${parts}`}>
      {parts === 1 ? <circle cx={cx} cy={cy} r={r} fill={shaded ? GOLD : "#0b1428"} stroke="#fff" /> :
        Array.from({ length: parts }, (_, i) => { const [x1, y1] = pt(i), [x2, y2] = pt(i + 1); return <path key={i} d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${parts === 2 ? 1 : 0} 1 ${x2},${y2} Z`} fill={i < shaded ? GOLD : "#0b1428"} fillOpacity={i < shaded ? 0.9 : 1} stroke="#fff" strokeOpacity={0.7} />; })}
    </svg>
  );
}

function FractionSetV({ total, groups, shadedGroups }: { total: number; groups: number; shadedGroups: number }) {
  const per = total / groups;
  return (
    <div className="flex flex-wrap items-center justify-center gap-3" role="img" aria-label={`${total} föremål i ${groups} lika stora grupper`}>
      {Array.from({ length: groups }, (_, g) => (
        <div key={g} className={`flex max-w-[5.5rem] flex-wrap justify-center gap-1 rounded-lg border p-2 ${g < shadedGroups ? "border-[#e8b64a] bg-[#e8b64a]/15" : "border-[#223660]"}`}>
          {Array.from({ length: per }, (_, i) => <span key={i} className={`h-3 w-3 rounded-full ${g < shadedGroups ? "bg-[#e8b64a]" : "bg-[#60a5fa]"}`} />)}
        </div>
      ))}
    </div>
  );
}

function DecimalPlaceV({ value }: { value: string }) {
  const [ip, fp = ""] = value.split(",");
  const ints = ["Ental", "Tiotal", "Hundratal", "Tusental"], decs = ["Tiondel", "Hundradel", "Tusendel", "Tiotusendel"];
  const cols = [...ip.split("").map((d, i) => ({ d, n: ints[ip.length - 1 - i] })), ...fp.split("").map((d, i) => ({ d, n: decs[i] }))];
  const w = Math.min(58, 300 / (cols.length + 0.4));
  return (
    <svg viewBox={`0 0 ${cols.length * w + 18} 100`} className="w-full max-w-sm" role="img" aria-label={`Platsvärdestabell för ${value}`}>
      {cols.map((c, i) => {
        const isDec = i >= ip.length, x = 4 + i * w + (isDec ? 10 : 0);
        return (
          <g key={i} transform={`translate(${x},4)`}>
            <rect width={w - 4} height={36} rx={6} fill={isDec ? "#16294d" : "#182848"} stroke={LINE} />
            <text x={(w - 4) / 2} y={24} textAnchor="middle" fill="#8d99b3" fontSize={Math.min(9.5, w / 6)}>{c.n}</text>
            <rect y={42} width={w - 4} height={52} rx={6} fill="#0b1428" stroke={c.d === "0" ? LINE : GOLD} />
            <text x={(w - 4) / 2} y={78} textAnchor="middle" fill="#fff" fontSize={28} fontWeight={700}>{c.d}</text>
          </g>
        );
      })}
      {fp && <text x={4 + ip.length * w + 4} y={82} fontSize={30} fontWeight={800} fill={GOLD}>,</text>}
    </svg>
  );
}

function DecimalGridV({ hundredths }: { hundredths: number }) {
  const c = 20;
  return (
    <svg viewBox="0 0 208 208" className="w-52" role="img" aria-label={`Hundrarutnät med ${hundredths} av 100 rutor färgade`}>
      {Array.from({ length: 100 }, (_, i) => <rect key={i} x={4 + (i % 10) * c} y={4 + Math.floor(i / 10) * c} width={c - 1.5} height={c - 1.5} rx={2} fill={i < hundredths ? GOLD : "#0b1428"} fillOpacity={i < hundredths ? 0.9 : 1} stroke="#3a4c78" strokeWidth={0.6} />)}
    </svg>
  );
}

function PercentBarV({ pct, label }: { pct: number; label?: string }) {
  const W = 280, x0 = 30;
  return (
    <svg viewBox="0 0 340 78" className="w-full max-w-md" role="img" aria-label={`Procentstapel: ${pct} procent färgat`}>
      <rect x={x0} y={14} width={W} height={30} rx={4} fill="#0b1428" stroke="#fff" strokeOpacity={0.6} />
      <rect x={x0} y={14} width={(W * Math.min(100, pct)) / 100} height={30} rx={4} fill={GOLD} fillOpacity={0.9} />
      {Array.from({ length: 9 }, (_, i) => <line key={i} x1={x0 + ((i + 1) * W) / 10} x2={x0 + ((i + 1) * W) / 10} y1={14} y2={44} stroke="#fff" strokeOpacity={0.45} />)}
      {[0, 25, 50, 75, 100].map((t) => <text key={t} x={x0 + (W * t) / 100} y={62} textAnchor="middle" fill="#8d99b3" fontSize={10}>{t} %</text>)}
      {label && <text x={x0 + (W * Math.min(100, pct)) / 200} y={34} textAnchor="middle" fill="#1b1303" fontSize={12} fontWeight={700}>{label}</text>}
    </svg>
  );
}

function DoubleLineV({ total, unit = "", marks, hideTotal }: { total: number; unit?: string; hideTotal?: boolean; marks: { pct: number; showAmount?: boolean }[] }) {
  const x0 = 46, W = 268, X = (p: number) => x0 + (W * p) / 100;
  const amt = (p: number) => { const v = (total * p) / 100; return Number.isInteger(v) ? sv(v) : sv(Math.round(v * 100) / 100).replace(".", ","); };
  const u = unit ? `\u00a0${unit}` : "";
  return (
    <svg viewBox="0 0 340 130" className="w-full max-w-md" role="img" aria-label="Dubbel tallinje: procent och antal">
      <text x={0} y={34} fill="#8d99b3" fontSize={10}>Procent</text>
      <text x={0} y={104} fill="#8d99b3" fontSize={10}>Antal</text>
      <line x1={x0} x2={x0 + W} y1={30} y2={30} stroke="#fff" strokeWidth={2} />
      <line x1={x0} x2={x0 + W} y1={100} y2={100} stroke="#fff" strokeWidth={2} />
      {Array.from({ length: 11 }, (_, i) => <g key={i}><line x1={X(i * 10)} x2={X(i * 10)} y1={i % 5 === 0 ? 22 : 26} y2={i % 5 === 0 ? 38 : 34} stroke="#fff" strokeOpacity={i % 5 === 0 ? 1 : 0.6} /><line x1={X(i * 10)} x2={X(i * 10)} y1={i % 5 === 0 ? 92 : 96} y2={i % 5 === 0 ? 108 : 104} stroke="#fff" strokeOpacity={i % 5 === 0 ? 1 : 0.6} /></g>)}
      {[0, 50, 100].map((p) => <text key={p} x={X(p)} y={18} textAnchor="middle" fill="#8d99b3" fontSize={10}>{p} %</text>)}
      {[0, 100].map((p) => <text key={p} x={X(p)} y={124} textAnchor="middle" fill="#8d99b3" fontSize={10}>{p === 0 ? 0 : hideTotal ? "?" : sv(total)}{p === 0 || hideTotal ? "" : u}</text>)}
      {marks.map((m, i) => (
        <g key={i}>
          <line x1={X(m.pct)} x2={X(m.pct)} y1={30} y2={100} stroke={GOLD} strokeDasharray="3 3" />
          <circle cx={X(m.pct)} cy={30} r={5} fill={GOLD} /><circle cx={X(m.pct)} cy={100} r={5} fill={GOLD} />
          <text x={X(m.pct)} y={52} textAnchor="middle" fill={GOLD} fontSize={11} fontWeight={700}>{m.pct} %</text>
          <text x={X(m.pct)} y={84} textAnchor="middle" fill={GOLD} fontSize={11} fontWeight={700}>{m.showAmount === false ? "?" : amt(m.pct) + u}</text>
        </g>
      ))}
    </svg>
  );
}

function ThermometerV({ value, min = -20, max = 30 }: { value: number; min?: number; max?: number }) {
  const top = 14, H = 190, x = 58;
  const y = (v: number) => top + ((max - v) / (max - min)) * H;
  const bottom = y(min);
  const warm = value > 0, cold = value < 0;
  const col = warm ? "#ef6a6a" : cold ? "#60a5fa" : "#c3cce0";
  const ticks: number[] = [];
  for (let v = Math.ceil(min / 5) * 5; v <= max; v += 5) ticks.push(v);
  return (
    <svg viewBox="0 0 170 236" className="h-56" role="img" aria-label={`Termometer som visar ${value} grader`}>
      <rect x={x - 7} y={top - 6} width={14} height={bottom - top + 12} rx={7} fill="#0b1428" stroke="#fff" strokeOpacity={0.6} />
      <rect x={x - 3.5} y={y(Math.max(min, value))} width={7} height={bottom - y(Math.max(min, value)) + 4} fill={col} />
      <circle cx={x} cy={bottom + 8} r={11} fill={col} stroke="#fff" strokeOpacity={0.6} />
      {ticks.map((v) => (
        <g key={v}>
          <line x1={x + 9} x2={x + (v % 10 === 0 ? 20 : 15)} y1={y(v)} y2={y(v)} stroke={v === 0 ? GOLD : "#fff"} strokeWidth={v === 0 ? 2 : 1} />
          {v % 10 === 0 && <text x={x + 24} y={y(v) + 4} fill={v === 0 ? GOLD : "#8d99b3"} fontSize={11} fontWeight={v === 0 ? 700 : 400}>{sv(v)}°</text>}
        </g>
      ))}
      <line x1={x - 22} x2={x - 9} y1={y(value)} y2={y(value)} stroke={col} strokeWidth={3} />
    </svg>
  );
}

function BalanceV({ left, right, tilt = "level" }: { left: string; right: string; tilt?: "left" | "right" | "level" }) {
  const ang = tilt === "left" ? 7 : tilt === "right" ? -7 : 0; // positive = left side down
  const L = 120, cx = 170;
  const dy = Math.sin((ang * Math.PI) / 180) * L, dx = Math.cos((ang * Math.PI) / 180) * L;
  const lx = cx - dx, ly = 62 + dy, rx = cx + dx, ry = 62 - dy;
  const pan = (x: number, y: number, txt: string) => (
    <g>
      <line x1={x} y1={y} x2={x - 34} y2={y + 36} stroke="#fff" strokeOpacity={0.6} /><line x1={x} y1={y} x2={x + 34} y2={y + 36} stroke="#fff" strokeOpacity={0.6} />
      <rect x={x - 42} y={y + 36} width={84} height={34} rx={8} fill="#182848" stroke={GOLD} strokeOpacity={0.7} />
      <text x={x} y={y + 58} textAnchor="middle" fill="#fff" fontSize={txt.length > 9 ? 11 : 14} fontWeight={600}>{txt}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 340 170" className="w-full max-w-md" role="img" aria-label={`Balansvåg: ${left} mot ${right}`}>
      <polygon points={`${cx},62 ${cx - 16},150 ${cx + 16},150`} fill="#223660" />
      <line x1={lx} y1={ly} x2={rx} y2={ry} stroke={GOLD} strokeWidth={4} strokeLinecap="round" />
      <circle cx={cx} cy={62} r={6} fill={GOLD} />
      {pan(lx, ly, left)}{pan(rx, ry, right)}
      <rect x={cx - 50} y={150} width={100} height={8} rx={4} fill="#223660" />
    </svg>
  );
}

function DotPatternV({ figures }: { figures: number[][] }) {
  const s = 15, gap = 18, minSlot = 50; // each figure gets a slot wide enough for its "Figur n" label
  const maxH = Math.max(...figures.flat(), 1);
  const slots = figures.map((f) => Math.max(f.length * s, minSlot));
  const total = slots.reduce((a, b) => a + b, 0) + gap * (figures.length - 1);
  let x = 0;
  return (
    <svg viewBox={`0 0 ${total + 4} ${maxH * s + 26}`} className="w-full max-w-md" role="img" aria-label="Figurer av rutor">
      {figures.map((f, fi) => {
        const slotX = x; x += slots[fi] + gap;
        const x0 = slotX + (slots[fi] - f.length * s) / 2;
        return (
          <g key={fi}>
            {f.map((h, c) => Array.from({ length: h }, (_, r) => <rect key={`${c}-${r}`} x={x0 + c * s} y={maxH * s - (r + 1) * s} width={s - 1.5} height={s - 1.5} rx={2} fill="#3b82f6" fillOpacity={0.8} stroke="#fff" strokeOpacity={0.4} strokeWidth={0.6} />))}
            <text x={slotX + slots[fi] / 2} y={maxH * s + 16} textAnchor="middle" fill="#8d99b3" fontSize={11}>Figur {fi + 1}</text>
          </g>
        );
      })}
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
    case "fractionbars": return <FractionBarsV bars={v.bars} />;
    case "decimalplace": return <DecimalPlaceV value={v.value} />;
    case "decimalgrid": return <DecimalGridV hundredths={v.hundredths} />;
    case "thermometer": return <ThermometerV value={v.value} min={v.min} max={v.max} />;
    case "balance": return <BalanceV left={v.left} right={v.right} tilt={v.tilt} />;
    case "dotpattern": return <DotPatternV figures={v.figures} />;
    case "percentbar": return <PercentBarV pct={v.pct} label={v.label} />;
    case "doublenumberline": return <DoubleLineV total={v.total} unit={v.unit} hideTotal={v.hideTotal} marks={v.marks} />;
    case "fractioncircle": return <FractionCircleV parts={v.parts} shaded={v.shaded} />;
    case "fractionset": return <FractionSetV total={v.total} groups={v.groups} shadedGroups={v.shadedGroups} />;
    case "area": return <AreaV a={v.a} b={v.b} />;
    case "grouping": return <Grouping value={v.value} />;
    case "compare": return <Compare a={v.a} b={v.b} />;
    case "polygon": return <PolygonV {...v} />;
    case "angle": return <AngleV deg={v.deg} protractor={v.protractor} base={v.base} label={v.label} />;
    case "coordplane": return <CoordPlane {...v} />;
    case "cuboid": return <CuboidV l={v.l} b={v.b} h={v.h} labels={v.labels} />;
    case "solid": return <SolidV shape={v.shape} />;
    case "barchart": return <BarChartV {...v} />;
    case "linechart": return <LineChartV {...v} />;
    case "pictogram": return <PictogramV rows={v.rows} per={v.per} />;
    case "marbles": return <MarblesV counts={v.counts} />;
    case "spinner": return <SpinnerV sectors={v.sectors} />;
    case "combotable": return <ComboTableV rows={v.rows} cols={v.cols} />;
    case "barmodel": return <BarModelV rows={v.rows} total={v.total} boxLabel={v.boxLabel} />;
    case "ruler": return <RulerV cm={v.cm} from={v.from} to={v.to} />;
    case "clock": return <ClockV h={v.h} m={v.m} />;
    case "circle": return <CircleV line={v.line} rLabel={v.rLabel} dLabel={v.dLabel} />;
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
