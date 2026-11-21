"use client";
import type { P2, PlaneSpec, Visual } from "@/lib/engine/types";

const GOLD = "#e8b64a";
const BLUE = "#3b82f6";
const LINE = "#3a4c78";
const MUTED = "#8d99b3";

type PolyV = Extract<Visual, { type: "polygon" }>;

/** Polygon on an optional unit grid: side labels, equal-side ticks, right-angle marks, angle labels, dashed helper lines. */
export function PolygonV({ pts, grid, sides, right, ticks, vlabels, angles, dash }: PolyV) {
  const W = 300, H = 210, padX = 48, padY = 34;
  const all: P2[] = [...pts, ...(dash ?? []).flatMap((d) => [d.a, d.b])];
  const minX = Math.min(...all.map((p) => p[0])), maxX = Math.max(...all.map((p) => p[0]));
  const minY = Math.min(...all.map((p) => p[1])), maxY = Math.max(...all.map((p) => p[1]));
  const w = Math.max(maxX - minX, 1e-6), h = Math.max(maxY - minY, 1e-6);
  const s = Math.min((W - 2 * padX) / w, (H - 2 * padY) / h, 90);
  const ox = (W - w * s) / 2 - minX * s, oy = (H + h * s) / 2 + minY * s;
  const X = (x: number) => ox + x * s, Y = (y: number) => oy - y * s;
  const sp = pts.map((p): P2 => [X(p[0]), Y(p[1])]);
  const n = sp.length;
  // signed area in screen space decides which side is "outside"
  let sa = 0;
  for (let i = 0; i < n; i++) { const [x1, y1] = sp[i], [x2, y2] = sp[(i + 1) % n]; sa += x1 * y2 - x2 * y1; }
  const orient = sa > 0 ? 1 : -1;
  const unit = (dx: number, dy: number): P2 => { const l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
  // side labels: outside the figure, clear of the line, nudged along the side when two labels would collide
  const boxes: { x: number; y: number; w: number }[] = [];
  const labelPlacements: { i: number; x: number; y: number; txt: string }[] = [];
  (sides ?? []).forEach((txt, i) => {
    if (!txt) return;
    const a = sp[i], b = sp[(i + 1) % n], d = unit(b[0] - a[0], b[1] - a[1]);
    const nx = d[1] * orient, ny = -d[0] * orient;
    const lw = txt.length * 7.4 + 4;
    const off = 9 + Math.abs(nx) * (lw / 2) + Math.abs(ny) * 8;
    const bx = (a[0] + b[0]) / 2 + nx * off, by = (a[1] + b[1]) / 2 + ny * off;
    let best = { x: bx, y: by };
    for (const k of [0, 1, -1, 2, -2, 3, -3]) {
      const x = bx + d[0] * k * 16, y = by + d[1] * k * 16;
      if (!boxes.some((q) => Math.abs(q.x - x) < (q.w + lw) / 2 && Math.abs(q.y - y) < 15)) { best = { x, y }; break; }
    }
    boxes.push({ x: best.x, y: best.y, w: lw });
    labelPlacements.push({ i, x: best.x, y: best.y, txt });
  });
  const gx0 = Math.ceil(minX - 1e-9), gx1 = Math.floor(maxX + 1e-9), gy0 = Math.ceil(minY - 1e-9), gy1 = Math.floor(maxY + 1e-9);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-sm" role="img" aria-label="Geometrisk figur">
      <polygon points={sp.map((p) => p.join(",")).join(" ")} fill={BLUE} fillOpacity={0.28} stroke="none" />
      {grid && (
        <g stroke="#5f74a8" strokeWidth={1}>
          {Array.from({ length: gx1 - gx0 + 1 }, (_, i) => <line key={`v${i}`} x1={X(gx0 + i)} y1={Y(minY)} x2={X(gx0 + i)} y2={Y(maxY)} />)}
          {Array.from({ length: gy1 - gy0 + 1 }, (_, i) => <line key={`h${i}`} x1={X(minX)} y1={Y(gy0 + i)} x2={X(maxX)} y2={Y(gy0 + i)} />)}
        </g>
      )}
      <polygon points={sp.map((p) => p.join(",")).join(" ")} fill="none" stroke="#fff" strokeWidth={2} strokeLinejoin="round" />
      {(dash ?? []).map((d, i) => {
        const a: P2 = [X(d.a[0]), Y(d.a[1])], b: P2 = [X(d.b[0]), Y(d.b[1])];
        return (
          <g key={`d${i}`}>
            <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={GOLD} strokeWidth={2} strokeDasharray="6 4" />
            {d.label && (() => { const mx = (a[0] + b[0]) / 2, left = mx > W / 2; return <text x={mx + (left ? -7 : 7)} y={(a[1] + b[1]) / 2 + 4} textAnchor={left ? "end" : "start"} fill={GOLD} fontSize={13} fontWeight={700}>{d.label}</text>; })()}
          </g>
        );
      })}
      {(right ?? []).map((vi) => {
        const v = sp[vi], p = sp[(vi + n - 1) % n], q = sp[(vi + 1) % n];
        const u = unit(p[0] - v[0], p[1] - v[1]), t = unit(q[0] - v[0], q[1] - v[1]), m = 9;
        return <polyline key={`r${vi}`} points={`${v[0] + u[0] * m},${v[1] + u[1] * m} ${v[0] + (u[0] + t[0]) * m},${v[1] + (u[1] + t[1]) * m} ${v[0] + t[0] * m},${v[1] + t[1] * m}`} fill="none" stroke={GOLD} strokeWidth={1.6} />;
      })}
      {(ticks ?? []).map((k, i) => {
        if (!k) return null;
        const a = sp[i], b = sp[(i + 1) % n], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
        const d = unit(b[0] - a[0], b[1] - a[1]), nr: P2 = [-d[1], d[0]];
        return <g key={`t${i}`} stroke={GOLD} strokeWidth={2}>{Array.from({ length: k }, (_, j) => { const o = (j - (k - 1) / 2) * 5; return <line key={j} x1={mx + d[0] * o - nr[0] * 5} y1={my + d[1] * o - nr[1] * 5} x2={mx + d[0] * o + nr[0] * 5} y2={my + d[1] * o + nr[1] * 5} />; })}</g>;
      })}
      {labelPlacements.map((lb) => <text key={`s${lb.i}`} x={lb.x} y={lb.y + 4} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={600}>{lb.txt}</text>)}
      {(angles ?? []).map((an, i) => {
        const v = sp[an.at], p = sp[(an.at + n - 1) % n], q = sp[(an.at + 1) % n];
        const u = unit(p[0] - v[0], p[1] - v[1]), t = unit(q[0] - v[0], q[1] - v[1]);
        const bis = unit(u[0] + t[0], u[1] + t[1]);
        return <text key={`a${i}`} x={v[0] + bis[0] * 26} y={v[1] + bis[1] * 26 + 4} textAnchor="middle" fill={GOLD} fontSize={12} fontWeight={700}>{an.text}</text>;
      })}
      {(vlabels ?? []).map((t, i) => {
        const v = sp[i], p = sp[(i + n - 1) % n], q = sp[(i + 1) % n];
        const u = unit(p[0] - v[0], p[1] - v[1]), tt = unit(q[0] - v[0], q[1] - v[1]);
        const bis = unit(u[0] + tt[0], u[1] + tt[1]);
        return <text key={`l${i}`} x={v[0] - bis[0] * 13} y={v[1] - bis[1] * 13 + 4} textAnchor="middle" fill={MUTED} fontSize={13} fontWeight={700}>{t}</text>;
      })}
    </svg>
  );
}

/** An angle drawn with two rays, optionally on top of a protractor with both scales. */
export function AngleV({ deg, protractor, base = "right", label }: { deg: number; protractor?: boolean; base?: "left" | "right"; label?: string }) {
  // screen angle (counter-clockwise from +x) of the second ray
  const th = base === "right" ? deg : 180 - deg;
  const R = protractor ? 124 : 100;
  const rise = protractor ? 0 : Math.max(R * Math.sin((th * Math.PI) / 180), 56); // keep a bare angle close to the top of its box
  const W = 300, cx = 150, cy = protractor ? 150 : rise + 24;
  const H = protractor ? 170 : rise + 44;
  const pt = (a: number, r: number): P2 => [cx + r * Math.cos((a * Math.PI) / 180), cy - r * Math.sin((a * Math.PI) / 180)];
  const baseEnd = pt(base === "right" ? 0 : 180, R + (protractor ? 10 : 0));
  const rayEnd = pt(th, R + (protractor ? 10 : 0));
  const arcR = 36;
  const [ax, ay] = pt(base === "right" ? 0 : 180, arcR), [bx, by] = pt(th, arcR);
  const sweep = base === "right" ? 0 : 1;
  const mid = pt(base === "right" ? deg / 2 : 180 - deg / 2, arcR + 14);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-sm" role="img" aria-label={protractor ? "Gradskiva med en vinkel" : "En vinkel"}>
      {protractor && (
        <g>
          <path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy} Z`} fill="#182848" fillOpacity={0.85} stroke={LINE} />
          {Array.from({ length: 37 }, (_, i) => {
            const a = i * 5, big = a % 10 === 0;
            const [x1, y1] = pt(a, R), [x2, y2] = pt(a, R - (big ? 9 : 5));
            return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke={MUTED} strokeWidth={big ? 1 : 0.6} />;
          })}
          <circle cx={cx} cy={cy} r={2.5} fill="#fff" />
        </g>
      )}
      <line x1={cx - (protractor ? R + 10 : R)} y1={cy} x2={cx + (protractor ? R + 10 : R)} y2={cy} stroke={LINE} strokeWidth={1.5} />
      <line x1={cx} y1={cy} x2={baseEnd[0]} y2={baseEnd[1]} stroke="#fff" strokeWidth={3} strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={rayEnd[0]} y2={rayEnd[1]} stroke={GOLD} strokeWidth={3} strokeLinecap="round" />
      {protractor && (
        <g>
          {Array.from({ length: 19 }, (_, i) => {
            const a = i * 10;
            const [ox, oy] = pt(a, R - 19), [ix, iy] = pt(a, R - 33);
            return (
              <g key={a} fontSize={8.5} textAnchor="middle" stroke="#182848" strokeWidth={2.2} paintOrder="stroke">
                <text x={ox} y={oy + 3} fill="#fff">{a}</text>
                <text x={ix} y={iy + 3} fill={GOLD}>{180 - a}</text>
              </g>
            );
          })}
        </g>
      )}
      {!protractor && deg === 90 ? (
        (() => { const m = 14, bu = base === "right" ? 1 : -1; return <polyline points={`${cx + bu * m},${cy} ${cx + bu * m},${cy - m} ${cx},${cy - m}`} fill="none" stroke={GOLD} strokeWidth={1.6} />; })()
      ) : (
        <path d={`M ${ax} ${ay} A ${arcR} ${arcR} 0 0 ${sweep} ${bx} ${by}`} fill="none" stroke={GOLD} strokeWidth={1.8} />
      )}
      {label && !protractor && <text x={mid[0]} y={mid[1] + 4} textAnchor="middle" fill={GOLD} fontSize={14} fontWeight={700}>{label}</text>}
    </svg>
  );
}

/** First-quadrant coordinate plane. With onPick, every grid crossing is a tappable target. */
export function CoordPlane({ xmax, ymax, points, poly, mirrorX, mirrorY, picked, onPick, disabled }: PlaneSpec & { picked?: { x: number; y: number } | null; onPick?: (x: number, y: number) => void; disabled?: boolean }) {
  const c = Math.min(40, 290 / (xmax + 1), 230 / (ymax + 1)), m = 26;
  const W = m + xmax * c + 34, H = m + ymax * c + 22;
  const X = (x: number) => m + x * c;
  const Yc = (y: number) => H - 18 - y * c;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full max-w-sm touch-manipulation select-none" role="img" aria-label="Koordinatsystem">
      {Array.from({ length: xmax + 1 }, (_, i) => <line key={`gx${i}`} x1={X(i)} y1={Yc(0)} x2={X(i)} y2={Yc(ymax)} stroke={LINE} strokeWidth={i === 0 ? 2 : 0.8} />)}
      {Array.from({ length: ymax + 1 }, (_, i) => <line key={`gy${i}`} x1={X(0)} y1={Yc(i)} x2={X(xmax)} y2={Yc(i)} stroke={LINE} strokeWidth={i === 0 ? 2 : 0.8} />)}
      {Array.from({ length: xmax + 1 }, (_, i) => <text key={`lx${i}`} x={X(i)} y={Yc(0) + 14} textAnchor="middle" fill={MUTED} fontSize={11}>{i}</text>)}
      {Array.from({ length: ymax }, (_, i) => <text key={`ly${i + 1}`} x={X(0) - 8} y={Yc(i + 1) + 4} textAnchor="end" fill={MUTED} fontSize={11}>{i + 1}</text>)}
      <text x={X(xmax) + 6} y={Yc(0) + 4} fill={GOLD} fontSize={12} fontWeight={700}>x</text>
      <text x={X(0) - 4} y={Yc(ymax) - 8} textAnchor="middle" fill={GOLD} fontSize={12} fontWeight={700}>y</text>
      {mirrorX != null && <line x1={X(mirrorX)} y1={Yc(0)} x2={X(mirrorX)} y2={Yc(ymax)} stroke={GOLD} strokeWidth={2} strokeDasharray="6 4" />}
      {mirrorY != null && <line x1={X(0)} y1={Yc(mirrorY)} x2={X(xmax)} y2={Yc(mirrorY)} stroke={GOLD} strokeWidth={2} strokeDasharray="6 4" />}
      {poly && <polygon points={poly.map(([x, y]) => `${X(x)},${Yc(y)}`).join(" ")} fill={BLUE} fillOpacity={0.25} stroke="#fff" strokeWidth={2} strokeLinejoin="round" />}
      {(points ?? []).map((p, i) => (
        <g key={`p${i}`}>
          <circle cx={X(p.x)} cy={Yc(p.y)} r={5} fill={GOLD} stroke="#0b1428" strokeWidth={1.5} />
          {p.label && <text x={X(p.x) + 8} y={Yc(p.y) - 7} fill="#fff" fontSize={13} fontWeight={700}>{p.label}</text>}
        </g>
      ))}
      {picked && <circle cx={X(picked.x)} cy={Yc(picked.y)} r={7} fill="#ef4444" stroke="#fff" strokeWidth={2} />}
      {onPick && Array.from({ length: (xmax + 1) * (ymax + 1) }, (_, i) => {
        const x = i % (xmax + 1), y = Math.floor(i / (xmax + 1));
        return (
          <circle key={`t${i}`} cx={X(x)} cy={Yc(y)} r={Math.max(12, c / 2)} fill="transparent" style={{ cursor: disabled ? undefined : "pointer", pointerEvents: "all" }}
            role="button" aria-label={`Punkt (${x}, ${y})`} onClick={() => { if (!disabled) onPick(x, y); }} />
        );
      })}
    </svg>
  );
}

/** Cuboid drawn in oblique projection with unit-cube lines on all three visible faces. */
export function CuboidV({ l, b, h, labels }: { l: number; b: number; h: number; labels?: [string, string, string] }) {
  const k = 0.5; // depth foreshortening
  const u = Math.min(30, 210 / (l + k * b), 130 / (h + k * b));
  const dx = k * u, dy = k * u;
  const W = l * u + b * dx + 70, H = h * u + b * dy + 44;
  const x0 = 22, yb = H - 20; // front-bottom-left corner
  const F = (i: number, j: number): P2 => [x0 + i * u, yb - j * u]; // front face
  const D = (p: P2, d: number): P2 => [p[0] + d * dx, p[1] - d * dy];
  const line = (a: P2, c: P2, key: string, w = 0.8) => <line key={key} x1={a[0]} y1={a[1]} x2={c[0]} y2={c[1]} stroke="#fff" strokeOpacity={0.45} strokeWidth={w} />;
  const ls: React.ReactNode[] = [];
  for (let i = 0; i <= l; i++) ls.push(line(F(i, 0), F(i, h), `fv${i}`), line(F(i, h), D(F(i, h), b), `tv${i}`));
  for (let j = 0; j <= h; j++) ls.push(line(F(0, j), F(l, j), `fh${j}`), line(F(l, j), D(F(l, j), b), `sh${j}`));
  for (let d = 0; d <= b; d++) ls.push(line(D(F(0, h), d), D(F(l, h), d), `th${d}`), line(D(F(l, 0), d), D(F(l, h), d), `sv${d}`));
  const poly = (pts: P2[], fill: string) => <polygon points={pts.map((p) => p.join(",")).join(" ")} fill={fill} />;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-sm" role="img" aria-label={`Rätblock ${l} · ${b} · ${h}`}>
      {poly([F(0, 0), F(l, 0), F(l, h), F(0, h)], "#3b82f6")}
      {poly([F(0, h), F(l, h), D(F(l, h), b), D(F(0, h), b)], "#60a5fa")}
      {poly([F(l, 0), D(F(l, 0), b), D(F(l, h), b), F(l, h)], "#2563eb")}
      {ls}
      <polyline points={[F(0, 0), F(l, 0), F(l, h), F(0, h), F(0, 0)].map((p) => p.join(",")).join(" ")} fill="none" stroke="#fff" strokeWidth={1.6} />
      <polyline points={[F(0, h), D(F(0, h), b), D(F(l, h), b), F(l, h)].map((p) => p.join(",")).join(" ")} fill="none" stroke="#fff" strokeWidth={1.6} />
      <polyline points={[F(l, 0), D(F(l, 0), b), D(F(l, h), b)].map((p) => p.join(",")).join(" ")} fill="none" stroke="#fff" strokeWidth={1.6} />
      {labels && (
        <g fill={GOLD} fontSize={13} fontWeight={700}>
          <text x={x0 + (l * u) / 2} y={yb + 16} textAnchor="middle">{labels[0]}</text>
          <text x={x0 + l * u + b * dx + 6} y={yb - (h * u) / 2 - (b * dy) / 2 + 4}>{labels[2]}</text>
          <text x={x0 + l * u + (b * dx) / 2 + 9} y={yb - h * u - (b * dy) / 2 - 5}>{labels[1]}</text>
        </g>
      )}
    </svg>
  );
}

/** Simple line drawings of the common solids. */
export function SolidV({ shape }: { shape: "cylinder" | "cone" | "pyramid" | "sphere" | "prism" | "cube" | "cuboid" }) {
  const stroke = { stroke: "#fff", strokeWidth: 1.8, strokeLinejoin: "round" as const };
  const names = { cylinder: "Cylinder", cone: "Kon", pyramid: "Pyramid", sphere: "Klot", prism: "Triangelprisma", cube: "Kub", cuboid: "Rätblock" };
  let body: React.ReactNode;
  switch (shape) {
    case "cylinder": body = (<g><path d="M 60 40 L 60 120 A 50 14 0 0 0 160 120 L 160 40" fill={BLUE} fillOpacity={0.5} {...stroke} /><ellipse cx={110} cy={40} rx={50} ry={14} fill="#60a5fa" fillOpacity={0.6} {...stroke} /></g>); break;
    case "cone": body = (<g><path d="M 110 20 L 60 120 A 50 14 0 0 0 160 120 Z" fill={BLUE} fillOpacity={0.5} {...stroke} /></g>); break;
    case "pyramid": body = (<g><polygon points="110,18 50,112 120,132 170,104" fill={BLUE} fillOpacity={0.5} {...stroke} /><line x1={110} y1={18} x2={120} y2={132} {...stroke} /><polyline points="50,112 90,100 170,104" fill="none" stroke="#fff" strokeWidth={1.4} strokeDasharray="4 4" /><line x1={90} y1={100} x2={110} y2={18} stroke="#fff" strokeWidth={1.4} strokeDasharray="4 4" /></g>); break;
    case "sphere": body = (<g><circle cx={110} cy={78} r={56} fill={BLUE} fillOpacity={0.45} {...stroke} /><ellipse cx={110} cy={78} rx={56} ry={14} fill="none" stroke="#fff" strokeOpacity={0.5} strokeDasharray="4 4" /></g>); break;
    case "prism": body = (
      <g transform="translate(18 4)">
        <polygon points="40,125 75,70 145,42 110,97" fill="#60a5fa" fillOpacity={0.5} {...stroke} />
        <polygon points="110,125 180,97 145,42 75,70" fill="#2563eb" fillOpacity={0.7} {...stroke} />
        <polygon points="40,125 110,125 75,70" fill={BLUE} fillOpacity={0.85} {...stroke} />
        <polyline points="110,97 180,97" fill="none" stroke="#fff" strokeWidth={1.4} strokeDasharray="4 4" />
      </g>
    ); break;
    case "cube": body = <CuboidInline l={1} b={1} h={1} u={56} />; break;
    case "cuboid": body = <CuboidInline l={2} b={1} h={1} u={46} />; break;
  }
  return (
    <svg viewBox="0 0 220 150" className="w-full max-w-[16rem]" role="img" aria-label={names[shape]}>
      {body}
    </svg>
  );
}

function CuboidInline({ l, b, h, u }: { l: number; b: number; h: number; u: number }) {
  const dx = u / 2, dy = u / 2, w = l * u + b * dx, ht = h * u + b * dy;
  const x0 = (220 - w) / 2, yb = (150 + ht) / 2;
  const F = (i: number, j: number): P2 => [x0 + i * u, yb - j * u];
  const D = (p: P2): P2 => [p[0] + b * dx, p[1] - b * dy];
  const pl = (pts: P2[], fill: string) => <polygon points={pts.map((p) => p.join(",")).join(" ")} fill={fill} stroke="#fff" strokeWidth={1.8} strokeLinejoin="round" />;
  return (
    <g>
      {pl([F(0, 0), F(l, 0), F(l, h), F(0, h)], "#3b82f6")}
      {pl([F(0, h), F(l, h), D(F(l, h)), D(F(0, h))], "#60a5fa")}
      {pl([F(l, 0), D(F(l, 0)), D(F(l, h)), F(l, h)], "#2563eb")}
    </g>
  );
}

/** A circle with its centre and a highlighted radius and/or diameter. */
export function CircleV({ line, rLabel, dLabel }: { line: "radius" | "diameter" | "both"; rLabel?: string; dLabel?: string }) {
  const cx = 130, cy = 80, r = 62;
  const ang = (-30 * Math.PI) / 180;
  const rx = cx + r * Math.cos(ang), ry = cy + r * Math.sin(ang);
  return (
    <svg viewBox="0 0 260 160" className="w-full max-w-[16rem]" role="img" aria-label="Cirkel">
      <circle cx={cx} cy={cy} r={r} fill={BLUE} fillOpacity={0.25} stroke="#fff" strokeWidth={2} />
      {(line === "diameter" || line === "both") && (
        <g>
          <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke={line === "both" ? "#60a5fa" : GOLD} strokeWidth={3} strokeLinecap="round" />
          {dLabel && <text x={cx - 8} y={cy + 18} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={700}>{dLabel}</text>}
        </g>
      )}
      {(line === "radius" || line === "both") && (
        <g>
          <line x1={cx} y1={cy} x2={rx} y2={ry} stroke={GOLD} strokeWidth={3} strokeLinecap="round" />
          {rLabel && <text x={(cx + rx) / 2 + 6} y={(cy + ry) / 2 - 8} fill="#fff" fontSize={13} fontWeight={700}>{rLabel}</text>}
        </g>
      )}
      <circle cx={cx} cy={cy} r={4} fill="#fff" />
    </svg>
  );
}

/** Ruler with mm ticks; a gold bar shows an object from `from` to `to` (mm). */
export function RulerV({ cm, from, to }: { cm: number; from: number; to: number }) {
  const W = 320, x0 = 14, px = (W - 2 * x0) / (cm * 10), top = 52, X = (mm: number) => x0 + mm * px;
  return (
    <svg viewBox={`0 0 ${W} 100`} className="w-full max-w-sm" role="img" aria-label="Linjal med ett föremål">
      <rect x={X(from)} y={14} width={X(to) - X(from)} height={20} rx={4} fill={GOLD} fillOpacity={0.9} />
      <line x1={X(from)} y1={34} x2={X(from)} y2={top} stroke={GOLD} strokeDasharray="3 3" />
      <line x1={X(to)} y1={34} x2={X(to)} y2={top} stroke={GOLD} strokeDasharray="3 3" />
      <rect x={x0 - 6} y={top} width={cm * 10 * px + 12} height={42} rx={4} fill="#182848" stroke={LINE} />
      {Array.from({ length: cm * 10 + 1 }, (_, i) => {
        const big = i % 10 === 0, mid = i % 5 === 0;
        return <line key={i} x1={X(i)} y1={top} x2={X(i)} y2={top + (big ? 18 : mid ? 13 : 8)} stroke="#fff" strokeOpacity={big ? 0.95 : 0.6} strokeWidth={big ? 1.4 : 0.8} />;
      })}
      {Array.from({ length: cm + 1 }, (_, i) => <text key={i} x={X(i * 10)} y={top + 34} textAnchor="middle" fill="#fff" fontSize={11}>{i}</text>)}
    </svg>
  );
}

/** Analogue clock face. */
export function ClockV({ h, m }: { h: number; m: number }) {
  const cx = 90, cy = 90, r = 76;
  const pt = (deg: number, len: number): P2 => [cx + len * Math.sin((deg * Math.PI) / 180), cy - len * Math.cos((deg * Math.PI) / 180)];
  const hd = ((h % 12) * 30 + m * 0.5), md = m * 6;
  const hp = pt(hd, r * 0.36), mp = pt(md, r * 0.64);
  return (
    <svg viewBox="0 0 180 180" className="w-full max-w-[13rem]" role="img" aria-label="Analog klocka">
      <circle cx={cx} cy={cy} r={r} fill="#182848" stroke="#fff" strokeWidth={2.5} />
      {Array.from({ length: 60 }, (_, i) => { const a = pt(i * 6, r - 2), b = pt(i * 6, r - (i % 5 === 0 ? 9 : 5)); return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#fff" strokeOpacity={0.7} strokeWidth={i % 5 === 0 ? 1.6 : 0.7} />; })}
      {Array.from({ length: 12 }, (_, i) => { const p = pt((i + 1) * 30, r - 21); return <text key={i} x={p[0]} y={p[1] + 5} textAnchor="middle" fill="#fff" fontSize={14} fontWeight={600}>{i + 1}</text>; })}
      <line x1={cx} y1={cy} x2={hp[0]} y2={hp[1]} stroke="#fff" strokeWidth={5} strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={mp[0]} y2={mp[1]} stroke={GOLD} strokeWidth={3} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={4} fill={GOLD} />
    </svg>
  );
}
