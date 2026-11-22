import type { Lesson } from "../types";
import { mc, numeric, multifield, withVisual, pointEx, regularPts, rectPts, shoelace } from "@/lib/engine/gen-helpers";
import type { Rng } from "@/lib/engine/rng";
import type { P2, PlaneSpec, Visual } from "@/lib/engine/types";
import { QUADS, polyV, triPts } from "./geo";

// ───────── Lektion 7: Symmetri och spegling ─────────
const ISO = triPts(4, 3.6, 3.6);
const EQUI = triPts(4, 4, 4);
interface SymFig { name: string; pts: P2[]; ticks?: number[]; right?: number[]; lines: number }
const SYM: SymFig[] = [
  { name: "kvadrat", pts: QUADS.kvadrat.pts, ticks: QUADS.kvadrat.ticks, right: QUADS.kvadrat.right, lines: 4 },
  { name: "rektangel (som inte är en kvadrat)", pts: QUADS.rektangel.pts, ticks: QUADS.rektangel.ticks, right: QUADS.rektangel.right, lines: 2 },
  { name: "romb (som inte är en kvadrat)", pts: QUADS.romb.pts, ticks: QUADS.romb.ticks, lines: 2 },
  { name: "parallellogram (som inte är en rektangel eller romb)", pts: QUADS.parallellogram.pts, ticks: QUADS.parallellogram.ticks, lines: 0 },
  { name: "likbent triangel (som inte är liksidig)", pts: ISO, ticks: [0, 1, 1], lines: 1 },
  { name: "liksidig triangel", pts: EQUI, ticks: [1, 1, 1], lines: 3 },
  { name: "drake", pts: QUADS.drake.pts, ticks: QUADS.drake.ticks, lines: 1 },
];
const symVisual = (f: SymFig) => polyV(f.pts, { ticks: f.ticks, right: f.right });

interface LineCase { name: string; pts: P2[]; ticks?: number[]; right?: number[]; a: P2; b: P2; yes: boolean; why: string }
const LINE_CASES: LineCase[] = [
  { name: "rektangel", pts: rectPts(6, 4), right: [0, 1, 2, 3], a: [3, 0], b: [3, 4], yes: true, why: "Den lodräta mittlinjen delar rektangeln i två delar som är spegelbilder av varandra." },
  { name: "rektangel", pts: rectPts(6, 4), right: [0, 1, 2, 3], a: [0, 2], b: [6, 2], yes: true, why: "Den vågräta mittlinjen delar rektangeln i två speglade delar." },
  { name: "rektangel", pts: rectPts(6, 4), right: [0, 1, 2, 3], a: [0, 0], b: [6, 4], yes: false, why: "Viker du längs diagonalen hamnar hörnen inte på varandra, eftersom rektangeln inte är en kvadrat. Delarna är lika stora trianglar men inte spegelbilder över linjen." },
  { name: "kvadrat", pts: rectPts(4, 4), right: [0, 1, 2, 3], a: [0, 0], b: [4, 4], yes: true, why: "I en kvadrat är diagonalen en symmetrilinje: viker du längs den hamnar de motstående hörnen på varandra." },
  { name: "romb", pts: QUADS.romb.pts, a: [0, 0], b: [8, 4], yes: true, why: "Diagonalerna i en romb är symmetrilinjer." },
  { name: "romb", pts: QUADS.romb.pts, a: [4, 0], b: [4, 4], yes: false, why: "En lodrät linje genom mitten är ingen symmetrilinje i en snedställd romb." },
  { name: "parallellogram", pts: QUADS.parallellogram.pts, a: [2.5, 0], b: [2.5, 2], yes: false, why: "Ett parallellogram har ingen symmetrilinje alls (om det inte också är en rektangel eller romb)." },
  { name: "likbent triangel", pts: ISO, a: [ISO[2][0], 0], b: ISO[2], yes: true, why: "Linjen från toppen ner till mitten av basen är symmetrilinjen." },
  { name: "likbent triangel", pts: ISO, a: [0, 0], b: [3, ISO[2][1] / 2], yes: false, why: "Linjen från ett hörn till mitten av motstående sida är ingen symmetrilinje i en triangel som inte är liksidig." },
];

const plane = (xmax: number, ymax: number, extra: Partial<PlaneSpec> = {}): PlaneSpec => ({ xmax, ymax, ...extra });
const LBL = ["A", "B", "C"];

export const lesson7: Lesson = {
  id: "w10-l7", worldId: "w10", title: "Symmetri och spegling", grades: "åk 4–6",
  summary: "Symmetrilinje: vikning ger delar som täcker varandra. Spegelbilden ligger lika långt från spegellinjen.",
  lgr: "Symmetri och spegling i geometriska figurer; konstruktion av spegelbilder",
  objectives: ["Avgöra om en linje är en symmetrilinje.", "Ange antalet symmetrilinjer i vanliga figurer.", "Spegla en punkt i en lodrät eller vågrät linje."],
  intro: "En figur är **symmetrisk** om du kan dra en linje så att de två halvorna är spegelbilder av varandra. Gör testet i huvudet: *vik* figuren längs linjen – täcker de två delarna varandra exakt? Då är det en **symmetrilinje**. Frestelsen att tro att en diagonal alltid duger är en av de vanligaste feltankarna.",
  theory: [
    { heading: "Vikningstestet", body: "Vik figuren längs linjen. Om delarna täcker varandra exakt är linjen en **symmetrilinje**. I en rektangel är de två mittlinjerna symmetrilinjer.", visual: { type: "polygon", pts: rectPts(6, 4), right: [0, 1, 2, 3], dash: [{ a: [3, 0], b: [3, 4] }, { a: [0, 2], b: [6, 2] }] } },
    { heading: "Diagonalen är ofta en fälla", body: "I en rektangel (som inte är en kvadrat) är **diagonalen inte** en symmetrilinje: viker du längs den hamnar hörnen inte på varandra. I en *kvadrat* är däremot diagonalerna symmetrilinjer.", visual: { type: "polygon", pts: rectPts(6, 4), right: [0, 1, 2, 3], dash: [{ a: [0, 0], b: [6, 4] }] } },
    { heading: "Hur många symmetrilinjer?", body: "Kvadrat 4, rektangel 2, romb 2, likbent triangel 1, liksidig triangel 3, drake 1, parallellogram **0**. En regelbunden månghörning med $n$ sidor har $n$ symmetrilinjer.", visual: { type: "polygon", pts: regularPts(5, 1), ticks: [1, 1, 1, 1, 1] } },
    { heading: "Spegling i koordinatsystemet", body: "Spegelbilden av en punkt ligger på **andra sidan** spegellinjen, lika långt ifrån den, och rakt över. Speglar du i den lodräta linjen $x = 5$ så ändras $x$ men inte $y$: punkten $(3, 2)$ hamnar i $(7, 2)$, eftersom den ligger 2 steg till vänster och bilden 2 steg till höger.", visual: { type: "coordplane", xmax: 9, ymax: 5, mirrorX: 5, points: [{ x: 3, y: 2, label: "P" }, { x: 7, y: 2, label: "P′" }] } },
  ],
  worked: [
    { title: "Spegla en punkt", problem: "Punkten P(2, 3) speglas i linjen x = 5. Var hamnar bilden?", steps: [{ text: "Avstånd från P till linjen:", math: "5 - 2 = 3" }, { text: "Bilden ligger lika långt på andra sidan:", math: "5 + 3 = 8" }, { text: "y-värdet ändras inte vid spegling i en lodrät linje: bilden är (8, 3)." }], why: "Spegelbilden är lika långt från spegellinjen som originalet, på motsatt sida.", alternative: "Formel: bildens x = 2 · 5 − 2 = 8." },
    { title: "Symmetrilinje eller inte?", problem: "Är diagonalen en symmetrilinje i en rektangel som inte är kvadrat?", steps: [{ text: "Vik längs diagonalen." }, { text: "Hörnet B hamnar inte på hörnet D, eftersom sidorna är olika långa." }, { text: "Nej, det är ingen symmetrilinje." }], why: "Symmetrilinje kräver att delarna täcker varandra – lika stora delar räcker inte.", alternative: "Spegla hörnen i linjen och se om de hamnar på figurens hörn." },
  ],
  drawing: { task: "Rita en rektangel och dra alla symmetrilinjer. Rita sedan en kvadrat och dra alla symmetrilinjer. Hur många blev det i vardera?", tool: "grid" },
  pupils: [{ pupil: "Rasmus", said: "En rektangel har fyra symmetrilinjer – två diagonaler och två mittlinjer.", misconception: "Tror att alla linjer genom hörnen/mitten är symmetrilinjer.", response: "Låt Rasmus klippa ut en rektangel och vika längs diagonalen: hörnen hamnar inte på varandra. Visa att bara mittlinjerna fungerar – men i en kvadrat fungerar även diagonalerna." }],
  knowledge: [
    { id: "linesRegular", skill: "w10-l7.count", gen: (rng) => { const n = rng.int(3, 8); const names: Record<number, string> = { 3: "triangel", 4: "fyrhörning", 5: "femhörning", 6: "sexhörning", 7: "sjuhörning", 8: "åttahörning" };
      return withVisual(numeric(`lr-${n}`, "w10-l7.count", `Hur många symmetrilinjer har en regelbunden ${names[n]}?`, n, `En regelbunden månghörning har lika många symmetrilinjer som sidor: ${n}.`, ["Alla sidor och vinklar är lika."]), polyV(regularPts(n, 1), { ticks: Array(n).fill(1) })); } },
    { id: "linesNamed", skill: "w10-l7.count", gen: (rng) => { const f = rng.pick(SYM); return withVisual(numeric(`ln-${f.name}`, "w10-l7.count", `Hur många symmetrilinjer har en ${f.name}?`, f.lines, `En ${f.name} har ${f.lines} symmetrilinje${f.lines === 1 ? "" : "r"}.`, ["Vik figuren i tanken."]), symVisual(f)); } },
    { id: "isLine", skill: "w10-l7.test", gen: (rng) => { const c = rng.pick(LINE_CASES);
      return withVisual(mc(`il-${c.name}-${c.a.join("-")}-${c.b.join("-")}`, "w10-l7.test", `Är den streckade linjen en symmetrilinje i ${c.name === "romb" ? "romben" : c.name === "kvadrat" ? "kvadraten" : c.name === "rektangel" ? "rektangeln" : c.name === "parallellogram" ? "parallellogrammet" : "triangeln"}?`, c.yes ? "Ja – delarna är spegelbilder" : "Nej – delarna täcker inte varandra", [{ text: c.yes ? "Nej – delarna täcker inte varandra" : "Ja – delarna är spegelbilder", note: c.yes ? undefined : "Lika stora delar räcker inte – de måste vara spegelbilder." }], c.why, ["Vik figuren längs linjen i tanken."], rng),
        polyV(c.pts, { ticks: c.ticks, right: c.right, dash: [{ a: c.a, b: c.b }] })); } },
    { id: "mirrorDist", skill: "w10-l7.mirror", gen: (rng) => { const d = rng.int(2, 9); return numeric(`md-${d}`, "w10-l7.mirror", `En punkt ligger ${d} rutor från spegellinjen. Hur många rutor är det mellan punkten och dess spegelbild?`, 2 * d, `Bilden ligger lika långt på andra sidan: ${d} + ${d} = ${2 * d}.`, ["Rita en spegellinje och punkten, rita bilden."]); } },
    { id: "mirrorX", skill: "w10-l7.mirror", gen: (rng) => { const m = rng.int(3, 7), x = rng.int(1, m - 1), y = rng.int(1, 8); return numeric(`mx-${m}-${x}-${y}`, "w10-l7.mirror", `Punkten (${x}, ${y}) speglas i den lodräta linjen x = ${m}. Vilket är bildpunktens x-koordinat?`, 2 * m - x, `Avståndet till linjen är ${m} − ${x} = ${m - x}. Bilden ligger ${m - x} till höger om linjen: ${m} + ${m - x} = ${2 * m - x}.`, ["Hur långt från linjen ligger punkten?"]); } },
    { id: "mirrorY", skill: "w10-l7.mirror", gen: (rng) => { const m = rng.int(3, 7), y = rng.int(1, m - 1), x = rng.int(1, 8); return numeric(`my-${m}-${x}-${y}`, "w10-l7.mirror", `Punkten (${x}, ${y}) speglas i den vågräta linjen y = ${m}. Vilket är bildpunktens y-koordinat?`, 2 * m - y, `Avståndet till linjen är ${m} − ${y} = ${m - y}. Bilden ligger ${m - y} ovanför linjen: ${m} + ${m - y} = ${2 * m - y}. x-koordinaten ändras inte.`, ["Vid spegling i en vågrät linje ändras y, inte x."]); } },
    { id: "foldTest", skill: "w10-l7.test", gen: (rng) => mc("ft", "w10-l7.test", "Hur kontrollerar du säkrast om en linje är en symmetrilinje?", "Vik figuren längs linjen: delarna ska täcka varandra exakt", [{ text: "Se efter att linjen går genom två hörn" }, { text: "Se efter att de två delarna har lika stor area", note: "Lika stor area räcker inte – formen måste vara spegelvänd." }, { text: "Se efter att linjen är lodrät" }], "Symmetri betyder att delarna är spegelbilder, och det testar man genom att vika (eller spegla hörnen).", ["Tänk på ett pappersark som du viker."], rng) },
  ],
  method: [
    { id: "reflectSteps", skill: "w10-l7.mirror", gen: (rng) => { const m = rng.int(4, 6), x = rng.int(Math.max(1, 2 * m - 9), m - 1), y = rng.int(1, 6); return multifield(`rs-${m}-${x}-${y}`, "w10-l7.mirror", `Punkten P(${x}, ${y}) speglas i linjen x = ${m}. Räkna ut spegelbilden i steg.`, [{ label: "Avstånd från P till linjen", accept: [m - x] }, { label: "Bildens x-koordinat", accept: [2 * m - x] }, { label: "Bildens y-koordinat", accept: [y] }], `Avstånd ${m} − ${x} = ${m - x}. Bildens x: ${m} + ${m - x} = ${2 * m - x}. y är oförändrat: ${y}.`, ["Bilden ligger lika långt från linjen, på andra sidan."]); } },
    { id: "symTable", skill: "w10-l7.count", gen: (rng) => { const picks = rng.shuffle([...SYM]).slice(0, 3); return multifield(`st-${picks.map((p) => p.lines).join("")}-${picks.map((p) => p.name[0]).join("")}`, "w10-l7.count", "Fyll i antalet symmetrilinjer.", picks.map((p) => ({ label: p.name, accept: [p.lines] })), picks.map((p) => `${p.name}: ${p.lines}`).join(". ") + ".", ["Vik figuren i tanken."]); } },
  ],
  representation: [
    { id: "pointMirrorV", skill: "w10-l7.mirror-plane", gen: (rng) => { const m = rng.int(3, 5), x = rng.int(Math.max(1, 2 * m - 9), m - 1), y = rng.int(1, 5);
      return pointEx(`pv-${m}-${x}-${y}`, "w10-l7.mirror-plane", "Tryck på spegelbilden av punkten P i den streckade linjen.", plane(9, 6, { mirrorX: m, points: [{ x, y, label: "P" }] }), 2 * m - x, y, `P ligger ${m - x} rutor till vänster om linjen, så bilden ligger ${m - x} rutor till höger: (${2 * m - x}, ${y}).`, ["Räkna avståndet till linjen och gå lika långt på andra sidan."]); } },
    { id: "pointMirrorH", skill: "w10-l7.mirror-plane", gen: (rng) => { const m = rng.int(3, 4), y = rng.int(1, m - 1), x = rng.int(1, 7);
      return pointEx(`ph-${m}-${x}-${y}`, "w10-l7.mirror-plane", "Tryck på spegelbilden av punkten P i den streckade linjen.", plane(8, 7, { mirrorY: m, points: [{ x, y, label: "P" }] }), x, 2 * m - y, `P ligger ${m - y} rutor under linjen, så bilden ligger ${m - y} rutor ovanför: (${x}, ${2 * m - y}).`, ["Vid en vågrät spegellinje ändras bara höjden."]); } },
    { id: "polyMirror", skill: "w10-l7.mirror-plane", gen: (rng) => { const m = rng.int(4, 5); let pts: P2[];
      do { const xs = [rng.int(1, m - 1), rng.int(1, m - 1), rng.int(1, m - 1)], ys = [rng.int(1, 3), rng.int(3, 4), rng.int(4, 5)]; pts = xs.map((x, i) => [x, ys[i]] as P2); } while (shoelace(pts) < 1);
      const k = rng.int(0, 2);
      return pointEx(`pm-${m}-${pts.flat().join("")}-${k}`, "w10-l7.mirror-plane", `Triangeln ska speglas i den streckade linjen. Tryck på spegelbilden av hörnet ${LBL[k]}.`, plane(9, 6, { mirrorX: m, poly: pts, points: pts.map(([x, y], i) => ({ x, y, label: LBL[i] })) }), 2 * m - pts[k][0], pts[k][1], `${LBL[k]} ligger ${m - pts[k][0]} rutor från linjen, så bilden ligger ${m - pts[k][0]} rutor på andra sidan: (${2 * m - pts[k][0]}, ${pts[k][1]}).`, ["Spegla ett hörn i taget."]); } },
  ],
  teacher: {
    title: "Rektangelns diagonaler",
    scenarios: ["Rasmus (åk 5) säger: ”En rektangel har fyra symmetrilinjer: två diagonaler och två mittlinjer.”"],
    prompt: "Förklara för Rasmus hur man testar om en linje är en symmetrilinje, vilka linjer som verkligen är det i en rektangel och varför diagonalerna inte är det (men i en kvadrat är det). Hur många blir det?",
    minChars: 180,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "vik", label: "vikningstestet: delarna ska täcka varandra / spegelbilder", any: ["vik", "täcker", "spegelbild", "speglar", "spegla"] },
        { id: "mitt", label: "att mittlinjerna (lodrät och vågrät) är symmetrilinjer", any: ["mittlinje", "lodrät", "vågrät", "genom mitten"] },
        { id: "diag", label: "att diagonalerna inte är symmetrilinjer i en rektangel", any: ["diagonal"] },
        { id: "tva", label: "rätt antal: två", any: ["två symmetrilinjer", "2 symmetrilinjer", "bara två", "endast två", "två stycken", " 2 "] },
        { id: "kvad", label: "att diagonalerna fungerar i en kvadrat (4 linjer)", any: ["kvadrat", "fyra symmetrilinjer", "4 symmetrilinjer"] },
      ],
    },
    modelAnswer: "Rasmus, en linje är en symmetrilinje om du kan vika figuren längs den så att de två delarna täcker varandra exakt, de är spegelbilder. I en rektangel fungerar den lodräta och den vågräta mittlinjen. Diagonalerna fungerar inte: viker du längs en diagonal hamnar hörnen inte på varandra, eftersom rektangelns sidor är olika långa. Delarna är lika stora trianglar men inte spegelbilder. Rektangeln har alltså två symmetrilinjer. I en kvadrat är alla sidor lika långa, så där är även diagonalerna symmetrilinjer och kvadraten har fyra.",
  },
};

// ───────── Lektion 8: Koordinatsystem ─────────
const ruleText = (a: number, b: number) => `y = ${a === 1 ? "" : a}x${b > 0 ? ` + ${b}` : b < 0 ? ` − ${-b}` : ""}`;
const rectCorners = (x1: number, y1: number, x2: number, y2: number): P2[] => [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];
function rectSet(rng: Rng) { const x1 = rng.int(1, 4), y1 = rng.int(1, 3); return { x1, y1, x2: x1 + rng.int(2, 4), y2: y1 + rng.int(2, 4) }; }
const rectVis = (r: { x1: number; y1: number; x2: number; y2: number }): Visual => ({ type: "coordplane", xmax: 9, ymax: 8, poly: rectCorners(r.x1, r.y1, r.x2, r.y2), points: rectCorners(r.x1, r.y1, r.x2, r.y2).map(([x, y], i) => ({ x, y, label: ["A", "B", "C", "D"][i] })) });
const rectText = (r: { x1: number; y1: number; x2: number; y2: number }) => `A(${r.x1}, ${r.y1}), B(${r.x2}, ${r.y1}), C(${r.x2}, ${r.y2}) och D(${r.x1}, ${r.y2})`;

export const lesson8: Lesson = {
  id: "w10-l8", worldId: "w10", title: "Koordinatsystem", grades: "åk 4–6",
  summary: "Först åt sidan (x), sedan uppåt (y). Punkter, avstånd och regler i ett koordinatsystem.",
  lgr: "Koordinatsystem och hur de används för att beskriva positioner och samband",
  objectives: ["Avläsa och markera punkter med koordinater (x, y).", "Beräkna avstånd och mått i koordinatsystemet.", "Koppla ihop en regel, en tabell och punkter."],
  intro: "Ett **koordinatsystem** är ett rutnät där varje punkt har en exakt adress, ett talpar $(x, y)$. Ordningen är avgörande: $(5, 2)$ och $(2, 5)$ är olika punkter. Minnesregel: *först in i huset (åt sidan), sedan upp för trappan (uppåt)*.",
  theory: [
    { heading: "Axlarna och origo", body: "Den vågräta linjen är **x-axeln**, den lodräta är **y-axeln**. De möts i **origo**, punkten $(0, 0)$. Vi använder bara den första kvadranten: båda koordinaterna är 0 eller positiva.", visual: { type: "coordplane", xmax: 6, ymax: 5 } },
    { heading: "(x, y): först sidled, sedan höjd", body: "Punkten $A(4, 2)$: gå 4 steg åt höger från origo, sedan 2 steg upp. $x$ kommer alltid först.", visual: { type: "coordplane", xmax: 6, ymax: 5, points: [{ x: 4, y: 2, label: "A(4, 2)" }] } },
    { heading: "Avstånd och figurer", body: "Ligger punkterna på samma rad (samma $y$) är avståndet skillnaden i $x$. En rektangel med hörn i $(1, 1)$, $(5, 1)$, $(5, 3)$ och $(1, 3)$ har bredden $5 - 1 = 4$ och höjden $3 - 1 = 2$. Alltså area $4 \\cdot 2 = 8$ och omkrets $2 \\cdot (4 + 2) = 12$.", visual: { type: "coordplane", xmax: 6, ymax: 4, poly: rectCorners(1, 1, 5, 3) } },
    { heading: "Regler ger punkter", body: "Regeln $y = x + 2$ ger för $x = 1, 2, 3$ värdena $y = 3, 4, 5$. Punkterna $(1,3), (2,4), (3,5)$ ligger på en rät linje. Så fungerar samband: ändras $x$ följer $y$ efter en regel." },
  ],
  worked: [
    { title: "Fjärde hörnet", problem: "En rektangel har hörnen A(2, 1), B(6, 1) och C(6, 4) (sidorna är vågräta/lodräta). Var ligger D?", steps: [{ text: "D ska ligga rakt ovanför A och rakt till vänster om C." }, { text: "D har samma x som A (2) och samma y som C (4).", math: "D = (2, 4)" }], why: "Sidorna är vågräta och lodräta, så motstående hörn delar koordinater.", alternative: "Rita punkterna på rutpapper." },
    { title: "Omkrets från koordinater", problem: "Rektangel med A(1, 1), B(5, 1), C(5, 3), D(1, 3). Omkrets (1 ruta = 1 cm)?", steps: [{ text: "Bredd:", math: "5 - 1 = 4" }, { text: "Höjd:", math: "3 - 1 = 2" }, { text: "Omkrets:", math: "2 \\cdot (4 + 2) = 12" }], why: "Avstånd på samma rad eller kolumn är skillnaden i koordinat.", alternative: "Räkna rutsidor runt kanten på ritningen." },
  ],
  drawing: { task: "Rita ett koordinatsystem. Markera punkterna A(1, 2), B(4, 2) och C(4, 5). Var ska D ligga för att ABCD ska bli en kvadrat? Vad är dess area?", tool: "coordinate" },
  pupils: [{ pupil: "Kalle", said: "Jag ska markera (5, 2): jag går 2 åt höger och sedan 5 uppåt.", misconception: "Blandar ihop ordningen x och y.", response: "Använd minnesregeln ”först in i huset, sedan upp för trappan”. Låt Kalle markera både (5, 2) och (2, 5) och se att de är två olika punkter." }],
  knowledge: [
    { id: "readCoord", skill: "w10-l8.read", gen: (rng) => { let x = rng.int(1, 8), y = rng.int(1, 8); if (x === y) y = y === 8 ? 7 : y + 1; const askX = rng.chance(0.5);
      return withVisual(numeric(`rc-${x}-${y}-${askX}`, "w10-l8.read", `Vilket är ${askX ? "x" : "y"}-värdet (${askX ? "första" : "andra"} talet) för punkten A?`, askX ? x : y, `A ligger ${x} steg åt höger och ${y} steg upp: A(${x}, ${y}).`, ["Räkna steg åt höger för x, steg uppåt för y."]), { type: "coordplane", xmax: 8, ymax: 8, points: [{ x, y, label: "A" }] }); } },
    { id: "orderMc", skill: "w10-l8.order", gen: (rng) => { let x = rng.int(2, 8); let y = rng.int(1, 7); if (x === y) y = y === 1 ? 2 : y - 1;
      return mc(`or-${x}-${y}`, "w10-l8.order", `Vilken punkt ligger ${x} steg åt höger och ${y} steg upp från origo?`, `(${x}, ${y})`, [{ text: `(${y}, ${x})`, note: "x (åt sidan) kommer först." }, { text: `(${x}, 0)` }, { text: `(0, ${y})` }], `${x} åt höger ger x = ${x} och ${y} upp ger y = ${y}: (${x}, ${y}).`, ["Först sidled, sedan uppåt."], rng); } },
    { id: "axisMc", skill: "w10-l8.axes", gen: (rng) => { const k = rng.int(1, 8); const C: [string, string][] = [[`(${k}, 0)`, "x-axeln"], [`(0, ${k})`, "y-axeln"], ["(0, 0)", "origo"]]; const [p, ans] = rng.pick(C);
      return mc(`ax-${p}`, "w10-l8.axes", `Var ligger punkten ${p}?`, ans, ["x-axeln", "y-axeln", "origo", "ingen av axlarna"].filter((x) => x !== ans).map((text) => ({ text })), `${p === "(0, 0)" ? "Båda koordinaterna är 0: origo." : p.endsWith(", 0)") ? "y = 0 betyder att höjden är 0, alltså på x-axeln." : "x = 0 betyder att den ligger på y-axeln."}`, ["Vilken koordinat är 0?"], rng); } },
    { id: "dist", skill: "w10-l8.distance", gen: (rng) => { const horiz = rng.chance(0.5), a = rng.int(1, 4), d = rng.int(2, 5), c = rng.int(1, 5); const A: P2 = horiz ? [a, c] : [c, a], B: P2 = horiz ? [a + d, c] : [c, a + d];
      return withVisual(numeric(`ds-${A.join("")}-${B.join("")}`, "w10-l8.distance", `Hur långt är det mellan A(${A[0]}, ${A[1]}) och B(${B[0]}, ${B[1]}) (en ruta = 1 enhet)?`, d, `Punkterna har samma ${horiz ? "y" : "x"}, så avståndet är skillnaden i ${horiz ? "x" : "y"}: ${horiz ? B[0] : B[1]} − ${horiz ? A[0] : A[1]} = ${d}.`, ["Vilken koordinat är lika?"]), { type: "coordplane", xmax: 9, ymax: 9, points: [{ x: A[0], y: A[1], label: "A" }, { x: B[0], y: B[1], label: "B" }] }); } },
    { id: "coordPerim", skill: "w10-l8.shapes", gen: (rng) => { const r = rectSet(rng); return withVisual(numeric(`cp-${Object.values(r).join("")}`, "w10-l8.shapes", `Rektangeln har hörnen ${rectText(r)}. En ruta är 1 cm. Vad är omkretsen?`, 2 * ((r.x2 - r.x1) + (r.y2 - r.y1)), `Bredd ${r.x2 - r.x1}, höjd ${r.y2 - r.y1}: 2 · (${r.x2 - r.x1} + ${r.y2 - r.y1}) = ${2 * ((r.x2 - r.x1) + (r.y2 - r.y1))} cm.`, ["Bredden är skillnaden i x, höjden skillnaden i y."], "cm"), rectVis(r)); } },
    { id: "coordArea", skill: "w10-l8.shapes", gen: (rng) => { const r = rectSet(rng); return withVisual(numeric(`ca-${Object.values(r).join("")}`, "w10-l8.shapes", `Rektangeln har hörnen ${rectText(r)}. En ruta är 1 cm². Vad är arean?`, (r.x2 - r.x1) * (r.y2 - r.y1), `Bredd ${r.x2 - r.x1} · höjd ${r.y2 - r.y1} = ${(r.x2 - r.x1) * (r.y2 - r.y1)} cm².`, ["Bredd gånger höjd."], "cm²"), rectVis(r)); } },
    { id: "ruleY", skill: "w10-l8.rule", gen: (rng) => { const a = rng.int(1, 4), b = rng.int(0, 5), x = rng.int(1, 9); return numeric(`ry-${a}-${b}-${x}`, "w10-l8.rule", `Regeln är ${ruleText(a, b)}. Vilket y får du när x = ${x}?`, a * x + b, `y = ${a} · ${x}${b ? ` + ${b}` : ""} = ${a * x + b}.`, ["Sätt in x i regeln."]); } },
    { id: "tableRule", skill: "w10-l8.rule", gen: (rng) => { const a = rng.int(1, 3), b = rng.int(0, 3); const wrong: [number, number][] = [[a, b + 1], [a + 1, b], [a + 1, b - 1]];
      return mc(`tr-${a}-${b}`, "w10-l8.rule", `Tabellen visar x = 1, 2, 3 och y = ${[1, 2, 3].map((x) => a * x + b).join(", ")}. Vilken regel passar?`, ruleText(a, b), wrong.map(([p, q]) => ({ text: ruleText(p, q) })), `Prova regeln på alla värden: ${[1, 2, 3].map((x) => `x = ${x}: ${a * x + b}`).join(", ")}.`, ["Pröva regeln på alla tre rader i tabellen, inte bara en."], rng); } },
  ],
  method: [
    { id: "rectCoordSteps", skill: "w10-l8.shapes", gen: (rng) => { const r = rectSet(rng); return withVisual(multifield(`rcs-${Object.values(r).join("")}`, "w10-l8.shapes", `Rektangeln har hörnen ${rectText(r)}. En ruta är 1 cm. Räkna i steg.`, [{ label: "Bredd (x₂ − x₁)", suffix: "cm", accept: [r.x2 - r.x1] }, { label: "Höjd (y₂ − y₁)", suffix: "cm", accept: [r.y2 - r.y1] }, { label: "Area", suffix: "cm²", accept: [(r.x2 - r.x1) * (r.y2 - r.y1)] }], `Bredd ${r.x2 - r.x1}, höjd ${r.y2 - r.y1}, area ${(r.x2 - r.x1) * (r.y2 - r.y1)} cm².`, ["Skillnad i x ger bredden, skillnad i y höjden."]), rectVis(r)); } },
    { id: "walkSteps", skill: "w10-l8.distance", gen: (rng) => { const x1 = rng.int(1, 4), y1 = rng.int(1, 4), dx = rng.int(2, 5), dy = rng.int(2, 4); return multifield(`wk-${x1}-${y1}-${dx}-${dy}`, "w10-l8.distance", `Du går från A(${x1}, ${y1}) till B(${x1 + dx}, ${y1 + dy}) genom att först gå åt höger och sedan uppåt. Hur många steg?`, [{ label: "Steg åt höger", accept: [dx] }, { label: "Steg uppåt", accept: [dy] }, { label: "Totalt antal steg", accept: [dx + dy] }], `Åt höger: ${x1 + dx} − ${x1} = ${dx}. Uppåt: ${y1 + dy} − ${y1} = ${dy}. Totalt ${dx + dy}.`, ["x ändras åt sidan, y uppåt."]); } },
  ],
  representation: [
    { id: "plotPoint", skill: "w10-l8.plot", gen: (rng) => { let x = rng.int(1, 8), y = rng.int(1, 8); if (x === y) y = y === 8 ? 7 : y + 1; return pointEx(`pp-${x}-${y}`, "w10-l8.plot", `Tryck på punkten (${x}, ${y}).`, plane(8, 8), x, y, `${x} steg åt höger och ${y} steg uppåt: (${x}, ${y}).`, ["Först åt sidan (x), sedan uppåt (y)."]); } },
    { id: "fourthCorner", skill: "w10-l8.shapes", gen: (rng) => { const r = rectSet(rng); const C = rectCorners(r.x1, r.y1, r.x2, r.y2);
      return pointEx(`fc-${Object.values(r).join("")}`, "w10-l8.shapes", "Hörnen A, B och C hör till en rektangel med vågräta och lodräta sidor. Tryck där det fjärde hörnet D ska ligga.", plane(9, 8, { points: C.slice(0, 3).map(([x, y], i) => ({ x, y, label: ["A", "B", "C"][i] })) }), r.x1, r.y2, `D ligger rakt ovanför A och rakt till vänster om C: (${r.x1}, ${r.y2}).`, ["D delar x med A och y med C."]); } },
    { id: "ruleTap", skill: "w10-l8.rule-plot", gen: (rng) => { const a = rng.int(1, 2), b = rng.int(0, 3), x = rng.int(1, 3); const y = a * x + b;
      return pointEx(`rt-${a}-${b}-${x}`, "w10-l8.rule-plot", `Punkten ligger på linjen med regeln ${ruleText(a, b)} och har x = ${x}. Tryck på punkten.`, plane(8, 9), x, y, `y = ${a} · ${x}${b ? ` + ${b}` : ""} = ${y}: punkten är (${x}, ${y}).`, ["Räkna ut y med regeln."]); } },
  ],
  teacher: {
    title: "(5, 2) eller (2, 5)?",
    scenarios: ["Kalle (åk 4) ska markera punkten (5, 2). Han går 2 steg åt höger och sedan 5 steg uppåt och säger att det är rätt."],
    prompt: "Förklara för Kalle vad de två talen i en koordinat betyder och i vilken ordning man går. Är hans punkt rätt? Ge honom ett sätt att komma ihåg ordningen.",
    minChars: 160,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "xfirst", label: "att första talet (x) är åt sidan", any: ["första talet", "x först", "x kommer först", "x-värdet", "åt sidan", "sidled", "åt höger"] },
        { id: "ysecond", label: "att andra talet (y) är uppåt", any: ["andra talet", "y-värdet", "uppåt", "upp"] },
        { id: "samma", label: "att Kalles punkt är (2, 5), alltså fel punkt – (5, 2) och (2, 5) är olika", any: ["olika punkter", "olika ställen", "(2, 5)", "(2,5)", "två olika", "bytt plats", "blandat ihop", "fel punkt"] },
        { id: "minnes", label: "en minnesregel (in i huset sedan upp, trappan)", any: ["huset", "trappa", "in och upp", "minnesregel", "först in", "gå in"] },
        { id: "origo", label: "att man börjar i origo", any: ["origo", "(0, 0)", "(0,0)", "nollpunkten"] },
      ],
    },
    modelAnswer: "Kalle, i en koordinat (x, y) säger första talet hur många steg du går åt sidan, åt höger från origo, och andra talet hur många steg du går uppåt. Punkten (5, 2) är alltså 5 steg åt höger och sedan 2 steg upp. Du gick 2 åt höger och 5 uppåt, och det är punkten (2, 5), alltså fel punkt. Det är viktigt att komma ihåg ordningen eftersom (5, 2) och (2, 5) är två olika punkter. Minnesregel: först in i huset (åt sidan), sedan upp för trappan.",
  },
};

// ───────── Lektion 9: Cirkel och kroppar ─────────
interface Solid { name: string; shape: Extract<Visual, { type: "solid" }>["shape"]; faces: number; edges: number; verts: number }
const FLAT_SOLIDS: Solid[] = [
  { name: "kub", shape: "cube", faces: 6, edges: 12, verts: 8 },
  { name: "rätblock", shape: "cuboid", faces: 6, edges: 12, verts: 8 },
  { name: "triangelprisma", shape: "prism", faces: 5, edges: 9, verts: 6 },
  { name: "kvadratisk pyramid", shape: "pyramid", faces: 5, edges: 8, verts: 5 },
];
const CURVED: { name: string; shape: Extract<Visual, { type: "solid" }>["shape"]; flat: number }[] = [
  { name: "cylinder", shape: "cylinder", flat: 2 }, { name: "kon", shape: "cone", flat: 1 }, { name: "klot", shape: "sphere", flat: 0 },
];
const ALL_SOLID_NAMES = ["kub", "rätblock", "triangelprisma", "kvadratisk pyramid", "cylinder", "kon", "klot"];
const SOLID_BY_SHAPE: Record<string, string> = { cube: "kub", cuboid: "rätblock", prism: "triangelprisma", pyramid: "kvadratisk pyramid", cylinder: "cylinder", cone: "kon", sphere: "klot" };

export const lesson9: Lesson = {
  id: "w10-l9", worldId: "w10", title: "Cirkel och rymdgeometriska kroppar", grades: "åk 4–6",
  summary: "Radie och diameter. Kroppars sidoytor, kanter och hörn.",
  lgr: "Geometriska objekt: cirklar och rymdgeometriska kroppar (kub, rätblock, prisma, pyramid, cylinder, kon, klot)",
  objectives: ["Förklara radie och diameter och hur de hänger ihop.", "Namnge vanliga kroppar och beskriva dem.", "Räkna sidoytor, kanter och hörn på kroppar med plana ytor."],
  intro: "Hittills har vi arbetat med **plana figurer**. Men världen är tredimensionell: lådor, bollar, burkar och hattar är **kroppar**. Här lär du dig vad de heter, vilka delar de har och skillnaden mellan en kvadrat (plan figur) och en kub (kropp).",
  theory: [
    { heading: "Cirkelns delar", body: "Alla punkter på en cirkel ligger lika långt från **mittpunkten**. **Radien** är avståndet från mittpunkten till cirkeln. **Diametern** går genom mittpunkten med ändpunkter på cirkeln, och är *dubbelt så lång* som radien: $d = 2r$.", visual: { type: "circle", line: "both", rLabel: "r", dLabel: "d = 2r" } },
    { heading: "Sidoytor, kanter och hörn", body: "En kropp med platta ytor har **sidoytor** (de platta ytorna), **kanter** (där två sidoytor möts) och **hörn** (där kanter möts). En kub har 6 sidoytor, 12 kanter och 8 hörn. Ett rätblock har lika många, men sidoytorna är rektanglar.", visual: { type: "solid", shape: "cuboid" } },
    { heading: "Prisma och pyramid", body: "En **triangelprisma** har 2 triangelformade och 3 rektangelformade sidoytor: 5 sidoytor, 9 kanter, 6 hörn. En **kvadratisk pyramid** har en kvadrat som botten och 4 trianglar: 5 sidoytor, 8 kanter, 5 hörn.", visual: { type: "solid", shape: "pyramid" } },
    { heading: "Kroppar med krökt yta", body: "**Cylinder**: 2 plana cirkelytor och 1 krökt yta. **Kon**: 1 plan cirkelyta, 1 krökt yta och en spets. **Klot**: bara en krökt yta, inga plana. Kontroll för kroppar med plana ytor: hörn − kanter + sidoytor = 2 (t.ex. kuben: 8 − 12 + 6 = 2).", visual: { type: "solid", shape: "cylinder" } },
  ],
  worked: [
    { title: "Räkna delar", problem: "Hur många hörn, kanter och sidoytor har en triangelprisma?", steps: [{ text: "Sidoytor: 2 trianglar + 3 rektanglar = 5." }, { text: "Hörn: 3 i varje triangel = 3 + 3 = 6." }, { text: "Kanter: 3 + 3 runt trianglarna och 3 mellan dem = 9." }, { text: "Kontroll:", math: "6 - 9 + 5 = 2" }], why: "Vi räknar delarna systematiskt och kontrollerar med hörn − kanter + sidoytor = 2.", alternative: "Bygg prismat av tändstickor och modellera." },
    { title: "Radie och diameter", problem: "Ett runt bord har diametern 120 cm. Hur långt är det från mitten till kanten?", steps: [{ text: "Radien är hälften av diametern.", math: "120 \\div 2 = 60" }], why: "Diametern går genom mittpunkten och består av två radier.", alternative: "Rita bordet och dela diametern på mitten." },
  ],
  drawing: { task: "Rita en kub och en kvadratisk pyramid. Räkna deras sidoytor, kanter och hörn och kontrollera att hörn − kanter + sidoytor = 2.", tool: "grid" },
  pupils: [{ pupil: "Hedda", said: "En kub och en kvadrat är samma sak, för de är båda fyrkantiga.", misconception: "Blandar ihop en plan figur (2D) med en kropp (3D).", response: "Visa en tärning och en ruta på papper. Fråga: ”Kan du fylla den med vatten?” Kuben har sex kvadratiska sidoytor och volym, kvadraten har bara area." }],
  knowledge: [
    { id: "radDiam", skill: "w10-l9.circle", gen: (rng) => { const r = rng.int(2, 30), toD = rng.chance(0.5);
      return toD ? numeric(`rd-r${r}`, "w10-l9.circle", `En cirkel har radien ${r} cm. Hur lång är diametern?`, 2 * r, `Diametern är dubbelt så lång som radien: 2 · ${r} = ${2 * r} cm.`, ["Diametern består av två radier."], "cm") : numeric(`rd-d${2 * r}`, "w10-l9.circle", `En cirkel har diametern ${2 * r} cm. Hur lång är radien?`, r, `Radien är hälften av diametern: ${2 * r} ÷ 2 = ${r} cm.`, ["Diametern är dubbelt så lång som radien."], "cm"); } },
    { id: "circleMc", skill: "w10-l9.circle", gen: (rng) => { const D: [string, string][] = [["Vad kallas sträckan från cirkelns mittpunkt till cirkeln?", "radie"], ["Vad kallas en sträcka som går genom mittpunkten och har båda ändpunkterna på cirkeln?", "diameter"]]; const [q, a] = rng.pick(D);
      return mc(`cm-${a}`, "w10-l9.circle", q, a, ["radie", "diameter", "omkrets", "mittpunkt"].filter((x) => x !== a).map((text) => ({ text })), a === "radie" ? "Radien går från mitten till kanten." : "Diametern går genom mitten, från kant till kant – två radier.", ["Radie = halva vägen, diameter = hela vägen över."], rng); } },
    { id: "partsText", skill: "w10-l9.parts", gen: (rng) => { const s = rng.pick(FLAT_SOLIDS), p = rng.pick([["sidoytor", "faces"], ["kanter", "edges"], ["hörn", "verts"]] as const); return numeric(`pt-${s.name}-${p[1]}`, "w10-l9.parts", `Hur många ${p[0]} har en ${s.name}?`, s[p[1]], `En ${s.name} har ${s.faces} sidoytor, ${s.edges} kanter och ${s.verts} hörn. Kontroll: ${s.verts} − ${s.edges} + ${s.faces} = 2.`, ["Rita eller tänk dig kroppen och räkna systematiskt."]); } },
    { id: "whichSolid", skill: "w10-l9.name", gen: (rng) => { const D: [string, string][] = [
      ["två plana cirkelformade ytor och en krökt yta", "cylinder"], ["en plan cirkelformad yta, en krökt yta och en spets", "kon"], ["bara en krökt yta, alla punkter på ytan ligger lika långt från mitten", "klot"],
      ["fem sidoytor: två trianglar och tre rektanglar", "triangelprisma"], ["fem sidoytor: en kvadrat och fyra trianglar", "kvadratisk pyramid"], ["sex sidoytor som alla är kvadrater", "kub"], ["sex sidoytor som är rektanglar (inte alla kvadrater)", "rätblock"]];
      const [d, a] = rng.pick(D); return mc(`ws-${a}`, "w10-l9.name", `Vilken kropp har ${d}?`, a, ALL_SOLID_NAMES.filter((x) => x !== a).map((text) => ({ text })), `Beskrivningen stämmer på en ${a}.`, ["Pröva varje kropps egenskaper mot beskrivningen."], rng); } },
    { id: "curvedFlat", skill: "w10-l9.parts", gen: (rng) => { const c = rng.pick(CURVED); return numeric(`cf-${c.name}`, "w10-l9.parts", `Hur många plana ytor har en ${c.name}?`, c.flat, `En ${c.name} har ${c.flat} plana ytor${c.flat === 0 ? " – hela ytan är krökt" : c.name === "cylinder" ? " (botten och topp)" : " (botten)"}.`, ["Räkna de platta ytorna, inte de krökta."]); } },
    { id: "cubeWire", skill: "w10-l9.parts", gen: (rng) => { const s = rng.int(2, 12); return numeric(`cw-${s}`, "w10-l9.parts", `Du gör en kub av tråd där varje kant är ${s} cm. Hur lång tråd går åt?`, 12 * s, `En kub har 12 kanter: 12 · ${s} = ${12 * s} cm.`, ["Hur många kanter har en kub?"], "cm"); } },
  ],
  method: [
    { id: "solidTable", skill: "w10-l9.parts", gen: (rng) => { const s = rng.pick(FLAT_SOLIDS); return multifield(`sd-${s.name}`, "w10-l9.parts", `Fyll i delarna för en ${s.name}.`, [{ label: "Sidoytor", accept: [s.faces] }, { label: "Kanter", accept: [s.edges] }, { label: "Hörn", accept: [s.verts] }], `${s.name}: ${s.faces} sidoytor, ${s.edges} kanter, ${s.verts} hörn. Kontroll: ${s.verts} − ${s.edges} + ${s.faces} = 2.`, ["Räkna sidoytor först."]); } },
    { id: "radDiamSteps", skill: "w10-l9.circle", gen: (rng) => { const r = rng.int(3, 25); return multifield(`rs-${r}`, "w10-l9.circle", `Ett cirkelformat bord har radien ${r} cm.`, [{ label: "Diameter", suffix: "cm", accept: [2 * r] }, { label: "Tre gånger radien", suffix: "cm", accept: [3 * r] }], `Diametern är 2 · ${r} = ${2 * r} cm. Tre radier: 3 · ${r} = ${3 * r} cm.`, ["Diameter = 2 · radie."]); } },
  ],
  representation: [
    { id: "solidName", skill: "w10-l9.name-visual", gen: (rng) => { const shape = rng.pick(["cube", "cuboid", "prism", "pyramid", "cylinder", "cone", "sphere"] as const); const name = SOLID_BY_SHAPE[shape];
      return withVisual(mc(`sn-${shape}`, "w10-l9.name-visual", "Vilken kropp visas?", name, ALL_SOLID_NAMES.filter((x) => x !== name).map((text) => ({ text })), `Bilden visar en ${name}.`, ["Titta på ytorna: platta eller krökta? Hur många?"], rng), { type: "solid", shape }); } },
    { id: "solidCount", skill: "w10-l9.parts-visual", gen: (rng) => { const s = rng.pick(FLAT_SOLIDS), p = rng.pick([["sidoytor", "faces"], ["hörn", "verts"], ["kanter", "edges"]] as const);
      return withVisual(numeric(`sc-${s.name}-${p[1]}`, "w10-l9.parts-visual", `Hur många ${p[0]} har kroppen på bilden? (Streckade linjer är kanter som är dolda bakom.)`, s[p[1]], `Kroppen är en ${s.name}: ${s.faces} sidoytor, ${s.edges} kanter, ${s.verts} hörn.`, ["Tänk på de dolda ytorna och hörnen på baksidan."]), { type: "solid", shape: s.shape }); } },
    { id: "circleParts", skill: "w10-l9.circle-visual", gen: (rng) => { const line = rng.pick(["radius", "diameter"] as const); const a = line === "radius" ? "radie" : "diameter";
      return withVisual(mc(`cv-${line}`, "w10-l9.circle-visual", "Vad kallas den markerade linjen i cirkeln?", a, ["radie", "diameter", "omkrets", "mittpunkt"].filter((x) => x !== a).map((text) => ({ text })), a === "radie" ? "Den går från mittpunkten till cirkeln: radie." : "Den går genom mittpunkten från kant till kant: diameter.", ["Går linjen genom hela cirkeln eller bara till mitten?"], rng), { type: "circle", line }); } },
  ],
  teacher: {
    title: "Kub eller kvadrat?",
    scenarios: ["Hedda (åk 4) säger: ”En kub och en kvadrat är samma sak, för de är båda fyrkantiga.”"],
    prompt: "Förklara för Hedda skillnaden mellan en kvadrat och en kub. Vilka egenskaper har kuben, och vilket mått använder vi för vardera (area eller volym)?",
    minChars: 170,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "plan", label: "att kvadraten är plan/2D (en figur)", any: ["plan", "2d", "två dimensioner", "platt", "figur"] },
        { id: "kropp", label: "att kuben är en kropp/3D", any: ["kropp", "3d", "tre dimensioner", "rymd", "tärning"] },
        { id: "sex", label: "kuben har 6 sidoytor som är kvadrater", any: ["sex sidoytor", "6 sidoytor", "sex kvadrater", "6 kvadrater", "sex ytor"] },
        { id: "kh", label: "12 kanter och 8 hörn", any: ["12 kanter", "tolv kanter", "8 hörn", "åtta hörn"] },
        { id: "mått", label: "area för kvadraten och volym för kuben", any: ["volym", "area"] },
      ],
    },
    modelAnswer: "Hedda, en kvadrat är en plan figur – den ligger platt på papperet och har bara area. En kub är en kropp, ett tredimensionellt föremål som en tärning. Kuben har sex sidoytor och varje sidoyta är en kvadrat. Den har också 12 kanter och 8 hörn. Eftersom den tar plats i rymden mäter vi hur mycket den rymmer, volym, i kubikenheter, medan vi för kvadraten mäter arean i kvadratenheter.",
  },
};
