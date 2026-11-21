import type { Lesson } from "../types";
import { mc, numeric, multifield, withVisual, regularPts, rectPts, lShape, shoelace, perimeterPts } from "@/lib/engine/gen-helpers";
import type { Rng } from "@/lib/engine/rng";
import { QUADS, TRI_NAMES, cmL, polyV, triPts } from "./geo";

const POLY: [number, string][] = [[3, "triangel"], [4, "fyrhörning"], [5, "femhörning"], [6, "sexhörning"], [7, "sjuhörning"], [8, "åttahörning"], [9, "niohörning"], [10, "tiohörning"]];

function triSet(rng: Rng, kind: keyof typeof TRI_NAMES): [number, number, number] {
  if (kind === "equi") { const a = rng.int(3, 9); return [a, a, a]; }
  if (kind === "iso") {
    const a = rng.int(3, 9);
    const b = rng.pick(Array.from({ length: 2 * a - 2 }, (_, i) => i + 2).filter((x) => x !== a));
    return [b, a, a];
  }
  for (;;) { const a = rng.int(3, 8), b = rng.int(a + 1, 10), c = rng.int(b + 1, 12); if (c < a + b) return [a, b, c]; }
}
const triVisual = (s: [number, number, number]) => polyV(triPts(...s), { sides: s.map(cmL) });

/** Rectilinear L-shape labels, used by lessons 2 and 3. */
export const lLabels = (w: number, h: number, nw: number, nh: number, hide: number[] = []) =>
  [w, h - nh, nw, nh, w - nw, h].map((v, i) => (hide.includes(i) ? "?" : cmL(v)));

// ───────── Lektion 1: Månghörningar och egenskaper ─────────
export const lesson1: Lesson = {
  id: "w10-l1", worldId: "w10", title: "Månghörningar och deras egenskaper", grades: "åk 4–6",
  summary: "Namn, sidor, vinklar och hur kvadrat, rektangel, romb och parallellogram hänger ihop.",
  lgr: "Geometriska objekt och deras egenskaper: månghörningar",
  objectives: ["Namnge månghörningar efter antal sidor.", "Beskriva trianglar efter sidor och vinklar.", "Skilja mellan kvadrat, rektangel, parallellogram, romb, drake och parallelltrapets – och förstå hur de hänger ihop."],
  intro: "En **månghörning** är en figur som är helt omsluten av raka sidor. Alla figurer i den här världen bygger på dem. Det svåra är inte namnen utan **egenskaperna**: vad måste vara sant för att en figur ska få ett visst namn? Och en överraskning: en kvadrat *är* en rektangel.",
  theory: [
    { heading: "Antal sidor ger namnet", body: "Antalet sidor är lika med antalet hörn. **Triangel** 3, **fyrhörning** 4, **femhörning** 5, **sexhörning** 6, **sjuhörning** 7, **åttahörning** 8. En **regelbunden** månghörning har alla sidor lika långa *och* alla vinklar lika stora.", visual: { type: "polygon", pts: regularPts(6, 1), ticks: [1, 1, 1, 1, 1, 1] } },
    { heading: "Trianglar efter sidor", body: "**Liksidig**: alla tre sidor lika långa. **Likbent**: minst två sidor lika långa. **Oliksidig**: alla sidor olika långa. Strecken på sidorna i en bild betyder ”lika långa”.", visual: { type: "polygon", pts: triPts(4, 5, 5), ticks: [0, 1, 1] } },
    { heading: "Trianglar efter vinklar", body: "**Rätvinklig**: en rät vinkel (90°). **Spetsvinklig**: alla vinklar mindre än 90°. **Trubbvinklig**: en vinkel större än 90°. En triangel kan aldrig ha mer än en rät eller trubbig vinkel – varför? (Vi återkommer till det i lektionen om vinklar.)", visual: { type: "polygon", pts: [[0, 0], [4, 0], [0, 3]], right: [0], sides: ["4 cm", "5 cm", "3 cm"] } },
    { heading: "Fyrhörningarna", body: "**Kvadrat**: fyra lika långa sidor och fyra räta vinklar. **Rektangel**: fyra räta vinklar, motstående sidor lika långa. **Parallellogram**: två par parallella sidor. **Romb**: fyra lika långa sidor. **Parallelltrapets**: minst ett par parallella sidor. **Drake**: två par lika långa sidor bredvid varandra.", visual: { type: "polygon", pts: QUADS.parallellogram.pts, ticks: QUADS.parallellogram.ticks } },
    { heading: "Familjen: en kvadrat är en rektangel", body: "Definitionerna avgör, inte hur figuren ”ser ut”. En kvadrat har fyra räta vinklar och motstående sidor lika långa – alltså uppfyller den *rektangelns* krav. Den har också fyra lika långa sidor – alltså är den också en *romb*. Och eftersom båda par av motstående sidor är parallella är den ett *parallellogram*. Omvänt gäller inte: en rektangel behöver inte ha fyra lika sidor." },
  ],
  worked: [
    { title: "Vilken figur är det?", problem: "En fyrhörning har fyra lika långa sidor men inga räta vinklar. Vad är det?", steps: [{ text: "Fyra lika långa sidor: kvadrat eller romb." }, { text: "Inga räta vinklar: då kan det inte vara en kvadrat." }, { text: "Svar: **romb**." }], why: "Vi utesluter figurer vars krav inte uppfylls. En kvadrat kräver räta vinklar.", alternative: "Rita figuren på ett rutnät och mät vinklarna." },
    { title: "Sant eller falskt?", problem: "”Alla kvadrater är rektanglar.” Stämmer det?", steps: [{ text: "Rektangel = fyra räta vinklar och motstående sidor lika långa." }, { text: "Kvadraten har fyra räta vinklar och alla sidor lika långa, så motstående sidor är lika långa." }, { text: "Påståendet är **sant**." }], why: "Kvadraten uppfyller alla krav i rektangelns definition – den är ett specialfall.", alternative: "Alla hundar är djur, men alla djur är inte hundar – samma sorts relation." },
  ],
  drawing: { task: "Rita en kvadrat, en rektangel som inte är en kvadrat och en romb som inte är en kvadrat på rutnätet. Markera räta vinklar och lika långa sidor.", tool: "grid" },
  pupils: [{ pupil: "Noor", said: "En kvadrat är inte en rektangel. En rektangel är lång och smal.", misconception: "Blandar ihop figurens utseende med definitionen. Tror att kategorier utesluter varandra.", response: "Fråga: ”Vilka krav måste en rektangel uppfylla?” Låt Noor kontrollera kvadraten mot kraven (fyra räta vinklar, motstående sidor lika långa) och komma fram till att den klarar dem alla." }],
  knowledge: [
    { id: "countSides", skill: "w10-l1.names", gen: (rng) => { const [n, name] = rng.pick(POLY); const what = rng.pick(["sidor", "hörn"]); return numeric(`cs-${n}-${what}`, "w10-l1.names", `Hur många ${what} har en ${name}?`, n, `En ${name} har ${n} sidor och lika många hörn.`, ["Namnet visar antalet: tri = 3, fyr = 4, fem = 5 …"]); } },
    { id: "nameFromCount", skill: "w10-l1.names", gen: (rng) => { const [n, name] = rng.pick(POLY); const wrong = POLY.filter(([m]) => m !== n).map(([, t]) => ({ text: t })); return mc(`nf-${n}`, "w10-l1.names", `Vad kallas en månghörning med ${n} sidor?`, name, rng.shuffle(wrong).slice(0, 3), `${n} sidor ger en ${name}.`, ["Antalet sidor är lika med antalet hörn."], rng); } },
    { id: "triBySides", skill: "w10-l1.triangle-sides", gen: (rng) => { const kind = rng.pick(["equi", "iso", "scal"] as const); const s = triSet(rng, kind); const names = Object.values(TRI_NAMES); const correct = TRI_NAMES[kind];
      return withVisual(mc(`ts-${s.join("-")}`, "w10-l1.triangle-sides", "Vilken sorts triangel är det, efter sidorna?", correct, names.filter((x) => x !== correct).map((text) => ({ text })), `Sidorna är ${s.join(", ")} cm: ${kind === "equi" ? "alla tre lika långa" : kind === "iso" ? "två lika långa" : "alla olika"}. Det är en ${correct}.`, ["Jämför de tre sidlängderna."], rng), triVisual(s)); } },
    { id: "triByAngles", skill: "w10-l1.triangle-angles", gen: (rng) => { const kind = rng.pick(["acute", "right", "obtuse"] as const); let a: number, b: number, c: number;
      if (kind === "right") { a = 90; b = rng.int(20, 70); c = 90 - b; } else if (kind === "obtuse") { a = rng.int(100, 140); b = rng.int(10, 180 - a - 10); c = 180 - a - b; } else { do { a = rng.int(45, 80); b = rng.int(45, 80); c = 180 - a - b; } while (c >= 90 || c < 30 || (a === 60 && b === 60)); }
      const name = { acute: "spetsvinklig triangel", right: "rätvinklig triangel", obtuse: "trubbvinklig triangel" }[kind];
      return mc(`ta-${a}-${b}-${c}`, "w10-l1.triangle-angles", `En triangel har vinklarna ${a}°, ${b}° och ${c}°. Vilken sorts triangel är det, efter vinklarna?`, name, ["spetsvinklig triangel", "rätvinklig triangel", "trubbvinklig triangel"].filter((x) => x !== name).map((text) => ({ text })), `Största vinkeln är ${Math.max(a, b, c)}°: ${kind === "right" ? "exakt 90°" : kind === "obtuse" ? "större än 90°" : "mindre än 90° – och alla de andra också"}.`, ["Titta på den största vinkeln: är den under, lika med eller över 90°?"], rng); } },
    { id: "quadProps", skill: "w10-l1.quad-props", gen: (rng) => {
      const T: [string, string][] = [
        ["kvadrat", "fyra lika långa sidor och fyra räta vinklar"],
        ["rektangel", "fyra räta vinklar, men sidorna är inte alla lika långa"],
        ["parallellogram", "två par parallella sidor, motstående sidor lika långa, ingen rät vinkel och sidorna är inte alla lika långa"],
        ["romb", "fyra lika långa sidor men inga räta vinklar"],
        ["parallelltrapets", "enbart ett par parallella sidor"],
        ["drake", "två par lika långa sidor som sitter bredvid varandra, och inga parallella sidor"],
      ];
      const [name, desc] = rng.pick(T);
      return mc(`qp-${name}`, "w10-l1.quad-props", `Vilken fyrhörning har ${desc}?`, name, T.filter(([n]) => n !== name).map(([n]) => ({ text: n })), `Beskrivningen stämmer på en ${name}.`, ["Pröva varje figurs krav mot beskrivningen."], rng); } },
    { id: "hierarchy", skill: "w10-l1.hierarchy", gen: (rng) => {
      const S: [string, boolean, string][] = [
        ["Alla kvadrater är rektanglar", true, "Kvadraten har fyra räta vinklar och motstående sidor lika långa – den uppfyller rektangelns krav."],
        ["Alla rektanglar är kvadrater", false, "En rektangel behöver inte ha fyra lika långa sidor, t.ex. 5 cm × 3 cm."],
        ["Alla kvadrater är romber", true, "Kvadraten har fyra lika långa sidor – det är rombens krav."],
        ["Alla romber är kvadrater", false, "En romb kan ha sneda vinklar, och då är den ingen kvadrat."],
        ["Alla rektanglar är parallellogram", true, "Rektangelns motstående sidor är parallella och lika långa."],
        ["Alla parallellogram är rektanglar", false, "Ett parallellogram kan vara snedställt utan räta vinklar."],
      ];
      const [txt, ok, why] = rng.pick(S);
      return mc(`hi-${txt}`, "w10-l1.hierarchy", `Sant eller falskt? ”${txt}.”`, ok ? "Sant" : "Falskt", [{ text: ok ? "Falskt" : "Sant" }], why, ["Pröva figurens krav mot definitionen."], rng); } },
    { id: "regularMc", skill: "w10-l1.regular", gen: (rng) => mc("rg", "w10-l1.regular", "Vilken av figurerna är en regelbunden månghörning?", "En liksidig triangel", [{ text: "En rektangel som inte är en kvadrat", note: "Alla sidor är inte lika långa." }, { text: "En romb som inte är en kvadrat", note: "Alla sidor är lika långa, men vinklarna är inte lika stora." }, { text: "En likbent triangel som inte är liksidig" }], "Regelbunden betyder att alla sidor *och* alla vinklar är lika. Det gäller för den liksidiga triangeln (60° i alla vinklar).", ["Kräv både lika sidor och lika vinklar."], rng) },
  ],
  method: [
    { id: "propTable", skill: "w10-l1.quad-props", gen: (rng) => { const name = rng.pick(Object.keys(QUADS)); const q = QUADS[name];
      return multifield(`pt-${name}`, "w10-l1.quad-props", `Fyll i egenskaperna för en vanlig ${name} (inget specialfall).`, [{ label: "Antal räta vinklar", accept: [q.rightAngles] }, { label: "Antal par av parallella sidor", accept: [q.parallel] }, { label: "Antal sidor", accept: [4] }], `Kvadrat/rektangel: 4 räta vinklar och 2 par parallella sidor. Parallellogram och romb: 0 och 2. Parallelltrapets: 0 och 1. Drake: 0 och 0.`, ["Rita figuren och kontrollera sida för sida."]); } },
    { id: "triFields", skill: "w10-l1.triangle-sides", gen: (rng) => { const kind = rng.pick(["equi", "iso", "scal"] as const); const s = triSet(rng, kind); const equal = kind === "equi" ? 3 : kind === "iso" ? 2 : 0;
      return withVisual(multifield(`tf-${s.join("-")}`, "w10-l1.triangle-sides", "Undersök triangeln.", [{ label: "Antal lika långa sidor (3, 2 eller 0)", accept: [equal] }, { label: "Omkrets", suffix: "cm", accept: [s[0] + s[1] + s[2]] }], `Sidorna är ${s.join(", ")} cm. Omkretsen är summan: ${s[0] + s[1] + s[2]} cm.`, ["Jämför sidorna, addera sedan alla tre."]), triVisual(s)); } },
  ],
  representation: [
    { id: "quadVisual", skill: "w10-l1.quad-visual", gen: (rng) => { const name = rng.pick(Object.keys(QUADS)); const q = QUADS[name];
      return withVisual(mc(`qv-${name}`, "w10-l1.quad-visual", "Vilken figur visas? Streck på sidorna betyder lika långa, och fyrkanten i hörnet betyder rät vinkel.", name, Object.keys(QUADS).filter((n) => n !== name).map((n) => ({ text: n })), `Bilden visar en ${name}.`, ["Titta efter räta vinklar och lika långa sidor."], rng), polyV(q.pts, { ticks: q.ticks, right: q.right })); } },
    { id: "triVisual", skill: "w10-l1.triangle-visual", gen: (rng) => { const kind = rng.pick(["equi", "iso", "scal"] as const); const correct = TRI_NAMES[kind];
      const pts = kind === "equi" ? triPts(4, 4, 4) : kind === "iso" ? triPts(4, 3.6, 3.6) : triPts(4, 5, 6);
      const vis = polyV(pts, kind === "equi" ? { ticks: [1, 1, 1] } : kind === "iso" ? { ticks: [0, 1, 1] } : { sides: ["4 cm", "5 cm", "6 cm"] });
      return withVisual(mc(`tv-${kind}`, "w10-l1.triangle-visual", "Vilken sorts triangel visas, efter sidorna?", correct, [...Object.values(TRI_NAMES).filter((x) => x !== correct), "rätvinklig triangel"].map((text) => ({ text })), `${kind === "equi" ? "Alla tre sidor har samma streck." : kind === "iso" ? "Två sidor har samma streck." : "Alla sidor har olika längd."} Det är en ${correct}.`, ["Strecken visar vilka sidor som är lika långa."], rng), vis); } },
  ],
  teacher: {
    title: "”En kvadrat är ingen rektangel”",
    scenarios: ["Noor (åk 5) säger bestämt: ”En kvadrat är inte en rektangel. En rektangel är lång och smal, och en kvadrat är fyrkantig.”"],
    prompt: "Förklara för Noor vad som avgör om en figur är en rektangel, och visa om en kvadrat är det eller inte. Förklara också vilken typ av fel Noors tänkande innehåller.",
    minChars: 170,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "def", label: "att en rektangel definieras av vissa krav/egenskaper", any: ["definition", "krav", "egenskap", "måste ha", "uppfyller"] },
        { id: "rat", label: "fyra räta vinklar", any: ["fyra räta", "4 räta", "räta vinklar", "rät vinkel"] },
        { id: "mot", label: "motstående sidor lika långa/parallella", any: ["motstående", "två och två", "parallella"] },
        { id: "kvad", label: "att kvadraten uppfyller kraven / är ett specialfall", any: ["specialfall", "är en rektangel", "uppfyller alla", "klarar", "både"] },
        { id: "utsee", label: "att utseendet (lång och smal) inte är avgörande", any: ["utseende", "ser ut", "lång och smal", "inte avgör", "inte beror på"] },
      ],
    },
    modelAnswer: "Noor, det som avgör om en figur är en rektangel är dess egenskaper, inte hur den ser ut. En rektangel är en fyrhörning med fyra räta vinklar och motstående sidor som är lika långa och parallella. Kontrollera kvadraten: den har fyra räta vinklar och motstående sidor lika långa, så den uppfyller alla krav. Därför är en kvadrat en rektangel – ett specialfall där alla sidor råkar vara lika långa. ”Lång och smal” är hur många rektanglar ser ut, men det är inget krav.",
  },
};

// ───────── Lektion 2: Omkrets ─────────
const lShapeVisual = (w: number, h: number, nw: number, nh: number, hide: number[] = []) => polyV(lShape(w, h, nw, nh), { sides: lLabels(w, h, nw, nh, hide), right: [0, 1, 2, 3, 4, 5] });
const lDims = (rng: Rng) => { const w = rng.int(6, 10), h = rng.int(5, 9); return { w, h, nw: rng.int(2, w - 3), nh: rng.int(2, h - 3) }; };

export const lesson2: Lesson = {
  id: "w10-l2", worldId: "w10", title: "Omkrets – sträckan runt en figur", grades: "åk 4–6",
  summary: "Omkretsen är summan av alla sidor. Den mäts i längdenheter.",
  lgr: "Metoder för att bestämma omkrets hos månghörningar",
  objectives: ["Räkna omkretsen av rektanglar, kvadrater, trianglar och regelbundna månghörningar.", "Hitta saknade sidor, även i L-formade figurer.", "Räkna baklänges: hitta en sida när omkretsen är given."],
  intro: "**Omkretsen** är hela sträckan runt en figur – hur långt du går om du följer kanten ett varv. Det är en *längd*, så den mäts i cm, m eller km. Fel som ofta dyker upp: man räknar bara två sidor av en rektangel, eller blandar ihop omkrets med area.",
  theory: [
    { heading: "Lägg ihop alla sidor", body: "Omkrets = summan av alla sidor. För en rektangel 6 cm × 4 cm: $6 + 4 + 6 + 4 = 20$ cm. Genväg: de två sidorna ”längd + bredd” förekommer två gånger, så $2 \\cdot (6 + 4) = 20$.", visual: { type: "polygon", pts: rectPts(6, 4), sides: ["6 cm", "4 cm", "6 cm", "4 cm"] } },
    { heading: "Kvadrat och regelbundna figurer", body: "Alla sidor lika långa, så antalet sidor gånger sidan. Kvadrat med sidan 5 cm: $4 \\cdot 5 = 20$ cm. Regelbunden sexhörning med sidan 7 cm: $6 \\cdot 7 = 42$ cm.", visual: { type: "polygon", pts: regularPts(6, 1), sides: ["7 cm", "", "", "", "", ""], ticks: [1, 1, 1, 1, 1, 1] } },
    { heading: "Saknade sidor i en L-figur", body: "I en figur med bara räta vinklar kan du räkna ut sidor som saknas: de lodräta bitarna på ena sidan summerar till samma som den hela höjden, och de vågräta likaså. Därför blir omkretsen av en L-figur **lika med omkretsen av den omslutande rektangeln**.", visual: { type: "polygon", pts: lShape(8, 6, 3, 2), sides: ["8 cm", "?", "3 cm", "2 cm", "?", "6 cm"], right: [0, 1, 2, 3, 4, 5] } },
    { heading: "Baklänges", body: "Omkretsen av en rektangel är 22 cm och ena sidan är 7 cm. Längd + bredd är hälften av omkretsen: $22 \\div 2 = 11$. Den andra sidan är $11 - 7 = 4$ cm." },
  ],
  worked: [
    { title: "L-figur", problem: "Figuren har sidorna 8, 6, 3 och 2 cm (se bilden i teorin). Vad är omkretsen?", steps: [{ text: "Saknade vågräta sida: 8 − 3 = 5 cm" }, { text: "Saknade lodräta sida: 6 − 2 = 4 cm" }, { text: "Addera alla sex sidor.", math: "8 + 4 + 3 + 2 + 5 + 6 = 28" }, { text: "Kontroll: omslutande rektangel", math: "2 \\cdot (8 + 6) = 28" }], why: "Vi går runt hela figuren och lägger ihop varje sida en gång.", alternative: "Förskjut de inre sidorna ut till kanten: figuren får samma omkrets som en rektangel 8 × 6." },
    { title: "Saknad sida", problem: "En kvadrat har omkretsen 36 cm. Hur lång är sidan?", steps: [{ text: "En kvadrat har 4 lika långa sidor.", math: "4 \\cdot s = 36" }, { text: "Dela med 4.", math: "s = 9" }], why: "Division är inversen till multiplikation.", alternative: "Prova: 9 + 9 + 9 + 9 = 36." },
  ],
  drawing: { task: "Rita en rektangel som är 7 rutor lång och 3 rutor bred. Gå runt kanten och räkna rutsidorna: vad är omkretsen? Rita sedan en annan rektangel med samma omkrets.", tool: "grid" },
  pupils: [{ pupil: "Elias", said: "Rektangeln är 6 cm lång och 4 cm bred, så omkretsen är 6 + 4 = 10 cm.", misconception: "Lägger bara ihop två sidor – glömmer att figuren har fyra.", response: "Låt Elias gå runt rektangeln med fingret och markera varje sida. Fråga hur många sidor han passerat. Visa 6 + 4 + 6 + 4 = 20." }],
  knowledge: [
    { id: "rectPerim", skill: "w10-l2.rect", gen: (rng) => { const l = rng.int(5, 15), b = rng.int(2, l - 1); return withVisual(numeric(`rp-${l}-${b}`, "w10-l2.rect", "Vad är rektangelns omkrets?", 2 * (l + b), `${l} + ${b} + ${l} + ${b} = ${2 * (l + b)} cm.`, ["Alla fyra sidor ska med."], "cm"), polyV(rectPts(l, b), { sides: [cmL(l), cmL(b), cmL(l), cmL(b)] })); } },
    { id: "squarePerim", skill: "w10-l2.square", gen: (rng) => { const s = rng.int(3, 20); return withVisual(numeric(`sp-${s}`, "w10-l2.square", "Kvadraten har sidan nedan. Vad är omkretsen?", 4 * s, `4 · ${s} = ${4 * s} cm.`, ["Fyra lika långa sidor."], "cm"), polyV(rectPts(1, 1), { sides: [cmL(s), "", "", ""], ticks: [1, 1, 1, 1], right: [0, 1, 2, 3] })); } },
    { id: "triPerim", skill: "w10-l2.triangle", gen: (rng) => { const s = triSet(rng, rng.pick(["equi", "iso", "scal"] as const)); const P = s[0] + s[1] + s[2];
      return withVisual(numeric(`tp-${s.join("-")}`, "w10-l2.triangle", "Vad är triangelns omkrets?", P, `${s.join(" + ")} = ${P} cm.`, ["Addera alla tre sidor."], "cm"), polyV(triPts(...s), { sides: s.map(cmL) })); } },
    { id: "regularPerim", skill: "w10-l2.regular", gen: (rng) => { const n = rng.pick([5, 6, 8]), s = rng.int(3, 12); const names: Record<number, string> = { 5: "femhörning", 6: "sexhörning", 8: "åttahörning" };
      return withVisual(numeric(`rg-${n}-${s}`, "w10-l2.regular", `En regelbunden ${names[n]} har sidan ${s} cm. Vad är omkretsen?`, n * s, `${n} sidor · ${s} cm = ${n * s} cm.`, ["Alla sidor är lika långa."], "cm"), polyV(regularPts(n, 1), { ticks: Array(n).fill(1) })); } },
    { id: "missingSide", skill: "w10-l2.missing", gen: (rng) => { const l = rng.int(5, 15), b = rng.int(2, l - 1); return numeric(`ms-${l}-${b}`, "w10-l2.missing", `Omkretsen av en rektangel är ${2 * (l + b)} cm. Den ena sidan är ${l} cm. Hur lång är den andra sidan?`, b, `${2 * (l + b)} ÷ 2 = ${l + b} är längd + bredd. ${l + b} − ${l} = ${b} cm.`, ["Hälften av omkretsen är längd + bredd."], "cm"); } },
    { id: "squareFromPerim", skill: "w10-l2.missing", gen: (rng) => { const s = rng.int(3, 25); return numeric(`sf-${s}`, "w10-l2.missing", `En kvadrat har omkretsen ${4 * s} cm. Hur lång är en sida?`, s, `${4 * s} ÷ 4 = ${s} cm.`, ["Dela omkretsen med antalet sidor."], "cm"); } },
    { id: "lPerim", skill: "w10-l2.composite", gen: (rng) => { const { w, h, nw, nh } = lDims(rng); return withVisual(numeric(`lp-${w}-${h}-${nw}-${nh}`, "w10-l2.composite", "Vad är figurens omkrets? Alla vinklar är räta.", 2 * (w + h), `Sidorna: ${w}, ${h - nh}, ${nw}, ${nh}, ${w - nw}, ${h}. Summan är ${2 * (w + h)} cm – lika med omkretsen av den omslutande rektangeln ${w} × ${h}.`, ["Räkna ut de saknade sidorna först, eller använd den omslutande rektangeln."], "cm"), lShapeVisual(w, h, nw, nh)); } },
    { id: "doorList", skill: "w10-l2.context", gen: (rng) => { const l = rng.int(3, 8), b = rng.int(2, l - 1), d = rng.int(1, 2); return numeric(`dl-${l}-${b}-${d}`, "w10-l2.context", `Ett rum är ${l} m långt och ${b} m brett. Golvlist ska sitta runt hela rummet utom i dörröppningen, som är ${d} m. Hur många meter list behövs?`, 2 * (l + b) - d, `Omkrets 2 · (${l} + ${b}) = ${2 * (l + b)} m. Minus dörröppningen ${d} m: ${2 * (l + b) - d} m.`, ["Räkna först hela omkretsen."], "m"); } },
    { id: "samePerim", skill: "w10-l2.compare", gen: (rng) => { const half = rng.int(8, 14), l = rng.int(Math.ceil(half / 2) + 1, half - 2), b = half - l; const wrong = [[l + 1, b + 1], [l + 2, b], [l, b + 2]].map(([x, y]) => ({ text: `${x} cm × ${y} cm` }));
      return mc(`sm-${l}-${b}`, "w10-l2.compare", `Vilken rektangel har omkretsen ${2 * half} cm?`, `${l} cm × ${b} cm`, wrong, `Längd + bredd ska vara ${half}: ${l} + ${b} = ${half}.`, ["Hälften av omkretsen är längd + bredd."], rng); } },
    { id: "minPerim", skill: "w10-l2.compare", gen: (rng) => { const A = rng.pick([12, 16, 18, 20, 24, 30, 36]); let best = Infinity, bl = 0; for (let l = 1; l <= A; l++) if (A % l === 0) { const p = 2 * (l + A / l); if (p < best) { best = p; bl = l; } }
      return numeric(`mp-${A}`, "w10-l2.compare", `Du lägger ${A} kvadrater, 1 cm × 1 cm, så att de bildar en rektangel. Vilken är den minsta omkrets du kan få?`, best, `Prova alla rektanglar med arean ${A}. Minst omkrets får du när figuren är så nära en kvadrat som möjligt: ${bl} × ${A / bl} ger 2 · (${bl} + ${A / bl}) = ${best} cm.`, ["Skriv upp alla par av tal som ger produkten " + A + "."], "cm"); } },
  ],
  method: [
    { id: "rectSteps", skill: "w10-l2.rect", gen: (rng) => { const l = rng.int(6, 18), b = rng.int(3, l - 1); return withVisual(multifield(`rs-${l}-${b}`, "w10-l2.rect", "Räkna omkretsen i steg.", [{ label: "Längd + bredd", suffix: "cm", accept: [l + b] }, { label: "Omkrets (dubbla summan)", suffix: "cm", accept: [2 * (l + b)] }], `${l} + ${b} = ${l + b}, och ${l + b} · 2 = ${2 * (l + b)} cm.`, ["Hälften av omkretsen är längd + bredd."]), polyV(rectPts(l, b), { sides: [cmL(l), cmL(b), cmL(l), cmL(b)] })); } },
    { id: "lSides", skill: "w10-l2.composite", gen: (rng) => { const { w, h, nw, nh } = lDims(rng); return withVisual(multifield(`ls-${w}-${h}-${nw}-${nh}`, "w10-l2.composite", "Alla vinklar är räta. Räkna ut de två sidor som är markerade med ? och sedan omkretsen.", [{ label: "Nedre högra sidan (?)", suffix: "cm", accept: [h - nh] }, { label: "Övre sidan (?)", suffix: "cm", accept: [w - nw] }, { label: "Omkrets", suffix: "cm", accept: [2 * (w + h)] }], `Högra sidan: ${h} − ${nh} = ${h - nh}. Övre sidan: ${w} − ${nw} = ${w - nw}. Omkretsen: ${w} + ${h - nh} + ${nw} + ${nh} + ${w - nw} + ${h} = ${2 * (w + h)} cm.`, ["De lodräta bitarna ska tillsammans bli lika långa som den vänstra sidan."]), lShapeVisual(w, h, nw, nh, [1, 4])); } },
  ],
  representation: [
    { id: "gridPerim", skill: "w10-l2.grid", gen: (rng) => { const useL = rng.chance(0.5); const pts = useL ? lShape(rng.int(5, 7), rng.int(4, 6), 2, 2) : rectPts(rng.int(3, 8), rng.int(2, 6)); const p = perimeterPts(pts);
      return withVisual(numeric(`gp-${pts.flat().join("-")}`, "w10-l2.grid", "Varje ruta är 1 cm × 1 cm. Vad är figurens omkrets? Räkna rutsidorna längs kanten.", p, `Gå runt kanten och räkna rutsidorna: ${p} cm.`, ["Räkna kantens rutsidor, inte rutorna inuti."], "cm"), polyV(pts, { grid: true })); } },
    { id: "gridSame", skill: "w10-l2.grid", gen: (rng) => { const l = rng.int(4, 8), b = rng.int(2, 3); return withVisual(multifield(`gs-${l}-${b}`, "w10-l2.grid", "Varje ruta är 1 cm × 1 cm. Fyll i.", [{ label: "Längd", suffix: "cm", accept: [l] }, { label: "Bredd", suffix: "cm", accept: [b] }, { label: "Omkrets", suffix: "cm", accept: [2 * (l + b)] }], `Längd ${l}, bredd ${b}: omkrets ${2 * (l + b)} cm.`, ["Räkna rutorna längs en lång och en kort sida."]), polyV(rectPts(l, b), { grid: true })); } },
  ],
  teacher: {
    title: "Omkrets: bara två sidor",
    scenarios: ["Elias (åk 4) ska räkna omkretsen av en rektangel som är 6 cm lång och 4 cm bred. Han skriver 6 + 4 = 10 cm och är nöjd."],
    prompt: "Förklara för Elias vad omkrets betyder, vad han har missat och hur han räknar rätt. Hur kan han kontrollera sitt svar, och vilken enhet ska svaret ha?",
    minChars: 160,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "runt", label: "att omkretsen är hela sträckan runt figuren / alla sidor", any: ["runt", "alla sidor", "hela kanten", "ett varv", "alla fyra"] },
        { id: "fyra", label: "att rektangeln har fyra sidor och Elias bara räknade två", any: ["fyra sidor", "4 sidor", "bara två", "två sidor", "glömt"] },
        { id: "svar", label: "rätt omkrets 20", any: ["20"] },
        { id: "kontroll", label: "ett sätt att kontrollera (gå runt med fingret, rita)", any: ["finger", "gå runt", "rita", "markera", "kontroll", "2 ·", "2·", "dubbla"] },
        { id: "enhet", label: "enheten cm (en längd), inte cm²", any: ["cm", "längdenhet", "centimeter"] },
      ],
    },
    modelAnswer: "Elias, omkretsen är hela sträckan runt figuren, alltså alla sidor. En rektangel har fyra sidor, och du har bara lagt ihop två av dem: 6 + 4. Räkna alla fyra: 6 + 4 + 6 + 4 = 20 cm, eller dubbla längd plus bredd: 2 · (6 + 4) = 20. Du kan kontrollera genom att rita rektangeln och gå runt kanten med fingret så att du får med alla sidor. Omkretsen är en längd, så svaret är 20 cm (inte cm²).",
  },
};

// ───────── Lektion 3: Area ─────────
export const lesson3: Lesson = {
  id: "w10-l3", worldId: "w10", title: "Area – rutor, rektanglar och sammansatta figurer", grades: "åk 4–6",
  summary: "Area är hur många enhetsrutor som täcker ytan. Rektangel: längd · bredd.",
  lgr: "Metoder för att bestämma area hos månghörningar",
  objectives: ["Förklara area som antal täckande enhetsrutor.", "Räkna area av rektanglar, kvadrater och sammansatta figurer.", "Skilja tydligt mellan area och omkrets."],
  intro: "**Area** är hur stor yta en figur täcker. Vi mäter den genom att räkna hur många **enhetsrutor** (t.ex. 1 cm × 1 cm) som får plats. Omkrets är en längd; area är en yta – de svarar på helt olika frågor, och det är den vanligaste förväxlingen i hela geometrin.",
  theory: [
    { heading: "Räkna rutor", body: "Rektangeln täcks av 4 rader med 6 rutor: $4 \\cdot 6 = 24$ rutor. Arean är 24 **cm²** (kvadratcentimeter) om varje ruta är 1 cm × 1 cm.", visual: { type: "polygon", pts: rectPts(6, 4), grid: true } },
    { heading: "Längd · bredd", body: "Area för en rektangel är $\\text{längd} \\cdot \\text{bredd}$. En kvadrat med sidan $s$ har arean $s \\cdot s$ (därför säger man ”$s$ i kvadrat”). Enheten är längdenheten i kvadrat: cm², m², km²." },
    { heading: "Area ≠ omkrets", body: "Rektangeln 6 × 4: omkrets 20 cm (längd, runt kanten), area 24 cm² (yta, inuti). Två rektanglar kan ha samma omkrets men olika area: 10 × 2 och 6 × 6 har båda omkretsen 24 cm, men areorna är 20 cm² och 36 cm²." },
    { heading: "Sammansatta figurer", body: "Dela upp figuren i rektanglar och addera, **eller** tänk dig en stor rektangel och dra ifrån det som saknas. L-figuren nedan: $8 \\cdot 6 - 3 \\cdot 2 = 48 - 6 = 42$.", visual: { type: "polygon", pts: lShape(8, 6, 3, 2), sides: ["8 cm", "", "3 cm", "2 cm", "", "6 cm"], right: [0, 1, 2, 3, 4, 5] } },
  ],
  worked: [
    { title: "L-figur på två sätt", problem: "Beräkna arean av L-figuren (8 × 6 med ett hörn 3 × 2 borttaget).", steps: [{ text: "Sätt A: stor rektangel minus bortagen del.", math: "8 \\cdot 6 - 3 \\cdot 2 = 48 - 6 = 42" }, { text: "Sätt B: dela i två rektanglar: en 5 × 6 (till vänster) och en 3 × 4 (till höger).", math: "5 \\cdot 6 + 3 \\cdot 4 = 30 + 12 = 42" }, { text: "Båda ger 42 cm²." }], why: "Arean är additiv: delar man upp en figur blir summan av delarnas areor lika med hela arean.", alternative: "Räkna rutor på rutnät." },
    { title: "Area eller omkrets?", problem: "Rektangel 5 cm × 3 cm: area och omkrets.", steps: [{ text: "Area: $5 \\cdot 3 = 15$ cm²" }, { text: "Omkrets: $5 + 3 + 5 + 3 = 16$ cm" }], why: "Area är ytan inuti (cm²), omkrets är sträckan runt (cm).", alternative: "Rita på rutnät: rutorna inuti = area, rutsidorna på kanten = omkrets." },
  ],
  drawing: { task: "Rita en rektangel 5 rutor lång och 3 rutor bred. Räkna rutorna (area) och rutsidorna runt kanten (omkrets). Rita sedan en annan figur med samma area men annan omkrets.", tool: "grid" },
  pupils: [{ pupil: "Maja", said: "Rektangeln är 5 cm × 3 cm, så arean är 16 cm².", misconception: "Räknar omkrets (5+3+5+3 = 16) men kallar det area, och använder enheten cm².", response: "Låt Maja rita rektangeln på rutpapper och räkna rutorna inuti: 15. Fråga vad 16 egentligen mätte (sträckan runt)." }],
  knowledge: [
    { id: "rectArea", skill: "w10-l3.rect", gen: (rng) => { const l = rng.int(3, 14), b = rng.int(2, l); return withVisual(numeric(`ra-${l}-${b}`, "w10-l3.rect", "Vad är rektangelns area?", l * b, `${l} · ${b} = ${l * b} cm².`, ["Längd gånger bredd."], "cm²"), polyV(rectPts(l, b), { sides: [cmL(l), cmL(b), cmL(l), cmL(b)] })); } },
    { id: "squareArea", skill: "w10-l3.square", gen: (rng) => { const s = rng.int(3, 15); return numeric(`sa-${s}`, "w10-l3.square", `En kvadrat har sidan ${s} cm. Vad är arean?`, s * s, `${s} · ${s} = ${s * s} cm².`, ["Sidan gånger sidan."], "cm²"); } },
    { id: "missingSideA", skill: "w10-l3.missing", gen: (rng) => { const l = rng.int(4, 15), b = rng.int(2, 12); return numeric(`ma-${l}-${b}`, "w10-l3.missing", `En rektangel har arean ${l * b} cm² och ena sidan ${l} cm. Hur lång är den andra sidan?`, b, `${l * b} ÷ ${l} = ${b} cm.`, ["Area = längd · bredd, så bredd = area ÷ längd."], "cm"); } },
    { id: "lArea", skill: "w10-l3.composite", gen: (rng) => { const { w, h, nw, nh } = lDims(rng); return withVisual(numeric(`la-${w}-${h}-${nw}-${nh}`, "w10-l3.composite", "Vad är figurens area? Alla vinklar är räta.", w * h - nw * nh, `Stor rektangel ${w} · ${h} = ${w * h}. Bortagen del ${nw} · ${nh} = ${nw * nh}. Skillnad: ${w * h - nw * nh} cm².`, ["Tänk dig hela rektangeln och dra ifrån det som saknas."], "cm²"), polyV(lShape(w, h, nw, nh), { sides: [cmL(w), "", cmL(nw), cmL(nh), "", cmL(h)], right: [0, 1, 2, 3, 4, 5] })); } },
    { id: "samePerimDiff", skill: "w10-l3.compare", gen: (rng) => { const s = rng.pick([8, 10, 12, 14]), a = rng.int(1, 3); return numeric(`sd-${s}-${a}`, "w10-l3.compare", `Rektangel A är ${a} cm × ${s - a} cm. Kvadrat B har samma omkrets som A. Hur många cm² större är kvadratens area?`, (s / 2) * (s / 2) - a * (s - a), `Omkretsen är ${2 * s} cm, så kvadratens sida är ${s / 2} cm och arean ${(s / 2) ** 2} cm². Rektangelns area är ${a * (s - a)} cm². Skillnad: ${(s / 2) ** 2 - a * (s - a)} cm².`, ["Räkna omkretsen av A, ta fram kvadratens sida."], "cm²"); } },
    { id: "unitMc", skill: "w10-l3.units", gen: (rng) => { const C: { c: string; ok: string; w: string[] }[] = [
      { c: "arean av ett frimärke", ok: "cm²", w: ["cm", "cm³", "m²"] }, { c: "arean av ett golv i ett klassrum", ok: "m²", w: ["m", "m³", "cm"] },
      { c: "omkretsen av ett frimärke", ok: "cm", w: ["cm²", "cm³", "m²"] }, { c: "arean av en fotbollsplan", ok: "m²", w: ["m", "m³", "mm²"] },
      { c: "arean av Sverige", ok: "km²", w: ["km", "km³", "cm²"] }];
      const k = rng.pick(C); return mc(`un-${k.c}`, "w10-l3.units", `Vilken enhet passar för ${k.c}?`, k.ok, k.w.map((text) => ({ text })), `${k.ok.includes("²") ? "Area mäts i kvadratenheter." : "Omkrets är en längd och mäts i längdenheter."}`, ["Är det en längd, en yta eller en volym?"], rng); } },
    { id: "scaleSides", skill: "w10-l3.scaling", gen: (rng) => { const f = rng.pick([2, 3]), both = rng.chance(0.6); return numeric(`sc-${f}-${both}`, "w10-l3.scaling", both ? `Du ${f === 2 ? "dubblar" : "tredubblar"} både längden och bredden på en rektangel. Hur många gånger större blir arean?` : `Du ${f === 2 ? "dubblar" : "tredubblar"} bara längden på en rektangel och behåller bredden. Hur många gånger större blir arean?`, both ? f * f : f, both ? `Arean blir ${f} · ${f} = ${f * f} gånger så stor. Rita en 1 × 1-ruta och förstora den: ${f * f} rutor.` : `Bara ena sidan blir ${f} gånger så lång, alltså blir arean ${f} gånger så stor.`, ["Prova med en liten rektangel, t.ex. 2 × 3."]); } },
    { id: "biggest", skill: "w10-l3.compare", gen: (rng) => { for (;;) { const rs = [rng.int(2, 6), rng.int(2, 6), rng.int(2, 6), rng.int(2, 6)].map((a) => [a, rng.int(3, 11)] as [number, number]); const areas = rs.map(([a, b]) => a * b); const m = Math.max(...areas); if (areas.filter((x) => x === m).length === 1) { const i = areas.indexOf(m); return mc(`bg-${rs.map((r) => r.join("x")).join("-")}`, "w10-l3.compare", "Vilken rektangel har störst area?", `${rs[i][0]} cm × ${rs[i][1]} cm`, rs.filter((_, j) => j !== i).map(([a, b]) => ({ text: `${a} cm × ${b} cm` })), `Areorna är ${rs.map(([a, b]) => a * b).join(", ")} cm². Störst är ${m} cm².`, ["Räkna arean av var och en."], rng); } } } },
  ],
  method: [
    { id: "areaPerim", skill: "w10-l3.rect", gen: (rng) => { const l = rng.int(4, 14), b = rng.int(2, l - 1); return withVisual(multifield(`ap-${l}-${b}`, "w10-l3.rect", "Räkna både area och omkrets – de är olika saker.", [{ label: "Area (längd · bredd)", suffix: "cm²", accept: [l * b] }, { label: "Omkrets (sträckan runt)", suffix: "cm", accept: [2 * (l + b)] }], `Area ${l} · ${b} = ${l * b} cm². Omkrets 2 · (${l} + ${b}) = ${2 * (l + b)} cm.`, ["Area: rutorna inuti. Omkrets: sträckan runt."]), polyV(rectPts(l, b), { sides: [cmL(l), cmL(b), cmL(l), cmL(b)] })); } },
    { id: "lSplit", skill: "w10-l3.composite", gen: (rng) => { const { w, h, nw, nh } = lDims(rng); return withVisual(multifield(`lt-${w}-${h}-${nw}-${nh}`, "w10-l3.composite", "Räkna L-figurens area som stor rektangel minus det som saknas.", [{ label: "Hela rektangeln", suffix: "cm²", accept: [w * h] }, { label: "Bortagna delen", suffix: "cm²", accept: [nw * nh] }, { label: "Figurens area", suffix: "cm²", accept: [w * h - nw * nh] }], `${w} · ${h} = ${w * h}; ${nw} · ${nh} = ${nw * nh}; ${w * h} − ${nw * nh} = ${w * h - nw * nh} cm².`, ["Den stora rektangeln har sidorna w och h."]), polyV(lShape(w, h, nw, nh), { sides: [cmL(w), "", cmL(nw), cmL(nh), "", cmL(h)], right: [0, 1, 2, 3, 4, 5] })); } },
  ],
  representation: [
    { id: "gridCount", skill: "w10-l3.grid", gen: (rng) => { const useL = rng.chance(0.5); const pts = useL ? lShape(rng.int(5, 7), rng.int(4, 6), rng.int(2, 3), rng.int(1, 2)) : rectPts(rng.int(3, 8), rng.int(2, 6)); const A = shoelace(pts);
      return withVisual(numeric(`gc-${pts.flat().join("-")}`, "w10-l3.grid", "Varje ruta är 1 cm². Hur många rutor täcker figuren, alltså vad är arean?", A, `Räkna rutorna rad för rad (eller dela upp i rektanglar): ${A} cm².`, ["Räkna rutorna inuti figuren."], "cm²"), polyV(pts, { grid: true })); } },
    { id: "gridBoth", skill: "w10-l3.grid", gen: (rng) => { const l = rng.int(4, 8), b = rng.int(2, 4); return withVisual(multifield(`gb-${l}-${b}`, "w10-l3.grid", "Varje ruta är 1 cm². Fyll i både area och omkrets.", [{ label: "Area (rutor)", suffix: "cm²", accept: [l * b] }, { label: "Omkrets (rutsidor runt kanten)", suffix: "cm", accept: [2 * (l + b)] }], `Area ${l} · ${b} = ${l * b}; omkrets ${2 * (l + b)}.`, ["Rutor inuti eller sidor på kanten?"]), polyV(rectPts(l, b), { grid: true })); } },
  ],
  teacher: {
    title: "Area eller omkrets?",
    scenarios: ["Maja (åk 4) ska räkna arean av en rektangel som är 5 cm lång och 3 cm bred. Hon svarar ”16 cm²”."],
    prompt: "Vad har Maja räknat ut egentligen? Förklara för henne vad area är, hur hon räknar rätt och vad som skiljer area från omkrets. Hur kan hon se skillnaden i en bild?",
    minChars: 170,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "omkrets", label: "att 16 är omkretsen (5+3+5+3)", any: ["omkrets", "5 + 3 + 5 + 3", "runt", "kanten"] },
        { id: "area", label: "att area är rutorna/ytan inuti", any: ["rutor", "ytan", "täcker", "inuti", "yta"] },
        { id: "svar", label: "rätt area 15", any: ["15"] },
        { id: "mult", label: "att man multiplicerar längd och bredd", any: ["gånger", "multiplicera", "5 · 3", "5·3", "5 x 3", "5 × 3"] },
        { id: "enhet", label: "enheterna cm (längd) och cm² (yta)", any: ["cm²", "kvadratcentimeter", "längdenhet", "kvadratenhet"] },
      ],
    },
    modelAnswer: "Maja, 16 är faktiskt omkretsen: 5 + 3 + 5 + 3 är sträckan runt rektangeln. Area är något annat: hur många rutor som täcker ytan inuti. Rita rektangeln på rutpapper – den har 3 rader med 5 rutor, alltså 5 · 3 = 15 rutor. Arean är 15 cm². Omkretsen mäts i cm (en längd), arean i cm² (rutor). Räkna kanten för omkretsen och rutorna inuti för arean.",
  },
};
