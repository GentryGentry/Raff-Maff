"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Circle, Layer, Line, Rect, Stage, Text } from "react-konva";
import type Konva from "konva";

export type Preset = "grid" | "numberline" | "fraction" | "fractioncircle" | "area" | "coordinate" | "column";
type Tool = "pen" | "eraser" | "line" | "rect" | "circle" | "text";
type Shape =
  | { t: "pen" | "eraser"; color: string; w: number; pts: number[] }
  | { t: "line"; color: string; w: number; pts: number[] }
  | { t: "rect" | "circle"; color: string; w: number; x: number; y: number; w2: number; h2: number }
  | { t: "text"; color: string; x: number; y: number; text: string };

const COLORS = ["#ffffff", "#e8b64a", "#3ecf8e", "#ef6a6a", "#60a5fa"];
const CELL = 24;

export default function WorkspaceInner({ preset = "grid", storageKey, height = 380 }: { preset?: Preset; storageKey?: string; height?: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<Konva.Stage>(null);
  const [w, setW] = useState(320);
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState(COLORS[0]);
  const [grid, setGrid] = useState(true);
  const [parts, setParts] = useState(4);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [redo, setRedo] = useState<Shape[]>([]);
  const [draft, setDraft] = useState<Shape | null>(null);
  const drawing = useRef(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(Math.max(260, Math.floor(el.clientWidth))));
    ro.observe(el); setW(Math.max(260, Math.floor(el.clientWidth)));
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!storageKey) return;
    try { const s = localStorage.getItem(`raffmaff.ws.${storageKey}`); if (s) setShapes(JSON.parse(s)); } catch { /* ignore */ }
  }, [storageKey]);
  useEffect(() => {
    if (!storageKey) return;
    try { localStorage.setItem(`raffmaff.ws.${storageKey}`, JSON.stringify(shapes.slice(-400))); } catch { /* ignore */ }
  }, [shapes, storageKey]);

  const pos = () => stage.current?.getPointerPosition() ?? { x: 0, y: 0 };

  const down = useCallback(() => {
    const { x, y } = pos();
    if (tool === "text") {
      const text = window.prompt("Skriv text eller tal:");
      if (text) { setShapes((s) => [...s, { t: "text", color, x, y, text }]); setRedo([]); }
      return;
    }
    drawing.current = true;
    if (tool === "pen" || tool === "eraser") setDraft({ t: tool, color, w: tool === "eraser" ? 22 : 3, pts: [x, y] });
    else if (tool === "line") setDraft({ t: "line", color, w: 3, pts: [x, y, x, y] });
    else setDraft({ t: tool, color, w: 3, x, y, w2: 0, h2: 0 });
  }, [tool, color]);

  const move = useCallback(() => {
    if (!drawing.current) return;
    const { x, y } = pos();
    setDraft((d) => {
      if (!d) return d;
      if (d.t === "pen" || d.t === "eraser") return { ...d, pts: [...d.pts, x, y] };
      if (d.t === "line") return { ...d, pts: [d.pts[0], d.pts[1], x, y] };
      if (d.t === "rect" || d.t === "circle") return { ...d, w2: x - d.x, h2: y - d.y };
      return d;
    });
  }, []);

  const up = useCallback(() => {
    if (!drawing.current) return;
    drawing.current = false;
    setDraft((d) => { if (d) { setShapes((s) => [...s, d]); setRedo([]); } return null; });
  }, []);

  const bg = useMemo(() => {
    const els: React.ReactNode[] = [];
    if (grid) {
      for (let x = 0; x <= w; x += CELL) els.push(<Line key={`v${x}`} points={[x, 0, x, height]} stroke="#2a3d6b" strokeWidth={0.6} listening={false} />);
      for (let y = 0; y <= height; y += CELL) els.push(<Line key={`h${y}`} points={[0, y, w, y]} stroke="#2a3d6b" strokeWidth={0.6} listening={false} />);
    }
    const mid = Math.round(height / 2 / CELL) * CELL;
    if (preset === "numberline") {
      const n = 10, x0 = 20, x1 = w - 20, step = (x1 - x0) / n;
      els.push(<Line key="nl" points={[x0 - 10, mid, x1 + 10, mid]} stroke="#fff" strokeWidth={2} listening={false} />);
      for (let i = 0; i <= n; i++) {
        els.push(<Line key={`t${i}`} points={[x0 + i * step, mid - 10, x0 + i * step, mid + 10]} stroke="#fff" listening={false} />);
        els.push(<Text key={`l${i}`} x={x0 + i * step - 8} y={mid + 14} width={16} align="center" text={String(i)} fill="#8d99b3" fontSize={11} listening={false} />);
      }
    }
    if (preset === "fraction") {
      const x0 = 16, bw = w - 32, pw = bw / parts, top = mid - 30;
      for (let i = 0; i < parts; i++) els.push(<Rect key={`f${i}`} x={x0 + i * pw} y={top} width={pw} height={60} stroke="#fff" strokeWidth={1.5} listening={false} />);
    }
    if (preset === "fractioncircle") {
      const r = Math.min(w, height) / 2 - 24, cx = w / 2, cy = height / 2;
      els.push(<Circle key="fc" x={cx} y={cy} radius={r} stroke="#fff" strokeWidth={2} listening={false} />);
      if (parts > 1) for (let i = 0; i < parts; i++) { const a = (2 * Math.PI * i) / parts; els.push(<Line key={`fl${i}`} points={[cx, cy, cx + r * Math.sin(a), cy - r * Math.cos(a)]} stroke="#fff" strokeWidth={1.5} listening={false} />); }
    }
    if (preset === "area") {
      const cols = Math.floor((w - 40) / CELL), rows = 8;
      els.push(<Rect key="ar" x={20} y={20} width={cols * CELL} height={rows * CELL} stroke="#60a5fa" strokeWidth={2} listening={false} />);
    }
    if (preset === "coordinate") {
      const cx = Math.round(w / 2 / CELL) * CELL, cy = mid;
      els.push(<Line key="xa" points={[0, cy, w, cy]} stroke="#fff" strokeWidth={2} listening={false} />);
      els.push(<Line key="ya" points={[cx, 0, cx, height]} stroke="#fff" strokeWidth={2} listening={false} />);
      for (let x = cx % CELL; x < w; x += CELL) if (Math.abs(x - cx) > 1) els.push(<Text key={`cx${x}`} x={x - 8} y={cy + 4} width={16} align="center" text={String(Math.round((x - cx) / CELL))} fill="#8d99b3" fontSize={9} listening={false} />);
      for (let y = cy % CELL; y < height; y += CELL) if (Math.abs(y - cy) > 1) els.push(<Text key={`cy${y}`} x={cx + 4} y={y - 5} text={String(Math.round((cy - y) / CELL))} fill="#8d99b3" fontSize={9} listening={false} />);
    }
    if (preset === "column") {
      for (let k = 1; k <= 6; k++) els.push(<Line key={`c${k}`} points={[w - k * 3 * CELL, 0, w - k * 3 * CELL, height]} stroke="#e8b64a" strokeOpacity={0.35} strokeWidth={1} dash={[4, 4]} listening={false} />);
    }
    return els;
  }, [grid, w, height, preset, parts]);

  const render = (s: Shape, k: string | number) => {
    switch (s.t) {
      case "pen": return <Line key={k} points={s.pts} stroke={s.color} strokeWidth={s.w} lineCap="round" lineJoin="round" tension={0.3} />;
      case "eraser": return <Line key={k} points={s.pts} stroke="#000" strokeWidth={s.w} lineCap="round" lineJoin="round" globalCompositeOperation="destination-out" />;
      case "line": return <Line key={k} points={s.pts} stroke={s.color} strokeWidth={s.w} lineCap="round" />;
      case "rect": return <Rect key={k} x={s.x} y={s.y} width={s.w2} height={s.h2} stroke={s.color} strokeWidth={s.w} />;
      case "circle": { const r = Math.hypot(s.w2, s.h2); return <Circle key={k} x={s.x} y={s.y} radius={r} stroke={s.color} strokeWidth={s.w} />; }
      case "text": return <Text key={k} x={s.x} y={s.y} text={s.text} fill={s.color} fontSize={22} />;
    }
  };

  const undo = () => setShapes((s) => { if (!s.length) return s; setRedo((r) => [...r, s[s.length - 1]]); return s.slice(0, -1); });
  const redoFn = () => setRedo((r) => { if (!r.length) return r; setShapes((s) => [...s, r[r.length - 1]]); return r.slice(0, -1); });
  const save = () => {
    const url = stage.current?.toDataURL({ pixelRatio: 2 });
    if (!url) return;
    const a = document.createElement("a"); a.href = url; a.download = "raff-maff-arbetsyta.png"; a.click();
  };

  const btn = (on: boolean) => `flex h-11 min-w-11 items-center justify-center rounded-xl border px-2 text-sm font-medium ${on ? "border-[#e8b64a] bg-[#e8b64a]/20 text-[#f3d58a]" : "border-[#223660] bg-[#0b1428] text-white"}`;
  const tools: [Tool, string, string][] = [["pen", "✏️", "Penna"], ["eraser", "🧽", "Sudd"], ["line", "╱", "Linje"], ["rect", "▭", "Rektangel"], ["circle", "◯", "Cirkel"], ["text", "T", "Text"]];

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5" role="toolbar" aria-label="Verktyg">
        {tools.map(([t, icon, label]) => <button key={t} className={btn(tool === t)} onClick={() => setTool(t)} aria-label={label} aria-pressed={tool === t}>{icon}</button>)}
        <span className="mx-1 w-px bg-[#223660]" />
        {COLORS.map((c) => <button key={c} onClick={() => { setColor(c); if (tool === "eraser") setTool("pen"); }} aria-label={`Färg ${c}`} className={`h-11 w-11 rounded-xl border-2 ${color === c && tool !== "eraser" ? "border-white" : "border-transparent"}`}><span className="mx-auto block h-6 w-6 rounded-full" style={{ background: c }} /></button>)}
      </div>
      <div ref={wrap} className="overflow-hidden rounded-2xl border border-[#223660] bg-[#070d1c]" style={{ touchAction: "none" }}>
        <Stage ref={stage} width={w} height={height} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up} style={{ touchAction: "none" }}>
          <Layer listening={false}>{bg}</Layer>
          <Layer>{shapes.map((s, i) => render(s, i))}{draft && render(draft, "draft")}</Layer>
        </Stage>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <button className={btn(false)} onClick={undo} disabled={!shapes.length} aria-label="Ångra">↶ Ångra</button>
        <button className={btn(false)} onClick={redoFn} disabled={!redo.length} aria-label="Gör om">↷</button>
        <button className={btn(grid)} onClick={() => setGrid(!grid)} aria-pressed={grid}>Rutnät</button>
        {(preset === "fraction" || preset === "fractioncircle") && <><button className={btn(false)} onClick={() => setParts(Math.max(2, parts - 1))} aria-label="Färre delar">−</button><span className="text-sm text-[#8d99b3]">{parts} delar</span><button className={btn(false)} onClick={() => setParts(Math.min(12, parts + 1))} aria-label="Fler delar">+</button></>}
        <button className={btn(false)} onClick={() => { if (shapes.length && window.confirm("Rensa hela ytan?")) { setShapes([]); setRedo([]); } }}>Rensa</button>
        <button className={btn(false)} onClick={save}>Spara bild</button>
      </div>
    </div>
  );
}
