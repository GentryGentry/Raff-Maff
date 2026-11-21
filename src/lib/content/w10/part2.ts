import type { Lesson } from "../types";
import { mc, numeric, multifield, withVisual } from "@/lib/engine/gen-helpers";
import type { Rng } from "@/lib/engine/rng";
import type { P2, Visual } from "@/lib/engine/types";
import { cmL, polyV, triFromAngles } from "./geo";

// ───────── helper figures for lesson 4 ─────────
const TRIPLES: [number, number, number][] = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10]]; // (d, h, s): d² + h² = s²

/** Parallelogram with base b, horizontal offset d, height h and slanted side s (integers). */
function paraSet(rng: Rng) {
  for (;;) {
    const [d, h, s] = rng.pick(TRIPLES), b = rng.int(Math.max(d + 1, 6), 12);
    if (b !== h && b !== s) return { b, d, h, s };
  }
}
const paraVisual = (b: number, d: number, h: number, s: number): Visual =>
  polyV([[0, 0], [b, 0], [b + d, h], [d, h]], { sides: [cmL(b), cmL(s), "", ""], dash: [{ a: [d, h], b: [d, 0], label: cmL(h) }] });

function triSet4(rng: Rng) {
  for (;;) {
    const [d, h, s] = rng.pick(TRIPLES), b = rng.int(Math.max(d + 1, 4), 12);
    if ((b * h) % 2 === 0) return { b, d, h, s };
  }
}
const triHeightVisual = (b: number, d: number, h: number, s: number): Visual =>
  polyV([[0, 0], [b, 0], [d, h]], { sides: [cmL(b), "", cmL(s)], dash: [{ a: [d, h], b: [d, 0], label: cmL(h) }] });

// ───────── Lektion 4: Area av trianglar och parallellogram ─────────
export const lesson4: Lesson = {
  id: "w10-l4", worldId: "w10", title: "Area av parallellogram och trianglar", grades: "åk 5–6",
  summary: "Parallellogram: bas · höjd. Triangel: bas · höjd ÷ 2. Höjden är vinkelrät mot basen.",
  lgr: "Metoder för att bestämma area hos månghörningar, till exempel trianglar",
  objectives: ["Förklara varför ett parallellogram har arean bas · höjd.", "Förklara varför en triangel är hälften av ett parallellogram.", "Välja rätt längd som höjd – inte den sneda sidan."],
  intro: "Rektangelns area är lätt. Men vad gör vi med en snedställd figur? Idén är densamma som alltid i geometri: **gör om figuren till något du redan kan**. Klipp bort en triangel från ena sidan av ett parallellogram och flytta den till andra sidan – du får en rektangel med samma area.",
  theory: [
    { heading: "Parallellogrammet blir en rektangel", body: "Klipp längs den streckade **höjden** och flytta den lilla triangeln till andra sidan. Figuren blir en rektangel med samma bas och samma höjd. Alltså: $\\text{area} = \\text{bas} \\cdot \\text{höjd}$.", visual: { type: "polygon", pts: [[0, 0], [8, 0], [11, 4], [3, 4]], sides: ["8 cm", "5 cm", "", ""], dash: [{ a: [3, 4], b: [3, 0], label: "4 cm" }] } },
    { heading: "Höjden är vinkelrät", body: "**Höjden** är det vinkelräta avståndet från basen upp till motstående sida. Den är *inte* den sneda sidan! Här är basen 8 cm, den sneda sidan 5 cm och höjden 4 cm. Arean är $8 \\cdot 4 = 32$ cm², inte $8 \\cdot 5$." },
    { heading: "Triangeln är hälften", body: "Två lika stora trianglar passar ihop till ett parallellogram. Därför är en triangels area **hälften** av bas · höjd: $\\dfrac{b \\cdot h}{2}$. Basen kan vara vilken sida som helst, bara höjden mäts vinkelrätt mot just den basen.", visual: { type: "polygon", pts: [[0, 0], [6, 0], [2, 4]], sides: ["6 cm", "", ""], dash: [{ a: [2, 4], b: [2, 0], label: "4 cm" }] } },
    { heading: "Rätvinklig triangel", body: "I en rätvinklig triangel är de två sidorna runt den räta vinkeln både bas och höjd. Kateterna 6 cm och 8 cm ger arean $\\dfrac{6 \\cdot 8}{2} = 24$ cm². Den längsta sidan (hypotenusan, 10 cm) används inte.", visual: { type: "polygon", pts: [[0, 0], [6, 0], [0, 8]], right: [0], sides: ["6 cm", "10 cm", "8 cm"] } },
  ],
  worked: [
    { title: "Parallellogram", problem: "Bas 9 cm, sned sida 5 cm, höjd 4 cm. Area?", steps: [{ text: "Höjden är vinkelrät mot basen: 4 cm. Sidan 5 cm är sned och används inte." }, { text: "Area = bas · höjd.", math: "9 \\cdot 4 = 36" }], why: "Flyttar vi en triangel blir figuren en rektangel 9 × 4.", alternative: "Rutnät: räkna hela rutor och sätt ihop de halva." },
    { title: "Triangel", problem: "Bas 7 cm, höjd 6 cm. Area?", steps: [{ text: "Bas gånger höjd.", math: "7 \\cdot 6 = 42" }, { text: "Hälften.", math: "42 \\div 2 = 21" }], why: "Två likadana trianglar bildar ett parallellogram med arean 42.", alternative: "Dela först: hälften av 6 är 3, och 7 · 3 = 21." },
  ],
  drawing: { task: "Rita ett parallellogram med basen 6 rutor och höjden 4 rutor. Klipp (rita) bort triangeln och flytta den så att figuren blir en rektangel. Vad är arean? Rita sedan en triangel med samma bas och höjd – hur stor är dess area?", tool: "grid" },
  pupils: [{ pupil: "Mia", said: "Basen är 8, sidan är 5 och höjden är 4, så arean är 8 · 5 = 40.", misconception: "Använder den sneda sidan som höjd.", response: "Låt Mia klippa av triangeln och flytta den: rektangeln har höjden 4, inte 5. Fråga: ”Vilken längd står rakt upp från basen?”" }],
  knowledge: [
    { id: "paraArea", skill: "w10-l4.parallelogram", gen: (rng) => { const { b, d, h, s } = paraSet(rng); return withVisual(numeric(`pa-${b}-${d}-${h}`, "w10-l4.parallelogram", "Vad är parallellogrammets area? Det streckade strecket är höjden.", b * h, `Area = bas · höjd = ${b} · ${h} = ${b * h} cm². Den sneda sidan (${s} cm) används inte.`, ["Använd höjden, inte den sneda sidan."], "cm²"), paraVisual(b, d, h, s)); } },
    { id: "triArea", skill: "w10-l4.triangle", gen: (rng) => { const { b, d, h, s } = triSet4(rng); return withVisual(numeric(`ta-${b}-${d}-${h}`, "w10-l4.triangle", "Vad är triangelns area? Det streckade strecket är höjden.", (b * h) / 2, `Bas · höjd ÷ 2 = ${b} · ${h} ÷ 2 = ${(b * h) / 2} cm².`, ["Glöm inte att dela med 2."], "cm²"), triHeightVisual(b, d, h, s)); } },
    { id: "rightTri", skill: "w10-l4.triangle", gen: (rng) => { const k = rng.int(1, 3), [x, y] = rng.chance(0.5) ? [3 * k, 4 * k] : [4 * k, 3 * k]; const hyp = 5 * k;
      return withVisual(numeric(`rt-${x}-${y}`, "w10-l4.triangle", "Vad är den rätvinkliga triangelns area?", (x * y) / 2, `Kateterna ${x} och ${y} är bas och höjd: ${x} · ${y} ÷ 2 = ${(x * y) / 2} cm². Hypotenusan ${hyp} cm används inte.`, ["Använd de två sidor som bildar den räta vinkeln."], "cm²"), polyV([[0, 0], [x, 0], [0, y]], { right: [0], sides: [cmL(x), cmL(hyp), cmL(y)] })); } },
    { id: "missingHeight", skill: "w10-l4.parallelogram", gen: (rng) => { const b = rng.int(4, 12), h = rng.int(3, 9); return numeric(`mh-${b}-${h}`, "w10-l4.parallelogram", `Ett parallellogram har arean ${b * h} cm² och basen ${b} cm. Hur hög är det?`, h, `${b * h} ÷ ${b} = ${h} cm.`, ["Area = bas · höjd, så höjd = area ÷ bas."], "cm"); } },
    { id: "halfRect", skill: "w10-l4.triangle", gen: (rng) => { const a = rng.int(4, 12), b = rng.int(3, 10); return numeric(`hr-${a}-${b}`, "w10-l4.triangle", `En rektangel ${a} cm × ${b} cm delas av en diagonal i två lika stora trianglar. Vad är arean av en av trianglarna?`, (a * b) / 2, `Rektangelns area är ${a * b} cm². Hälften: ${(a * b) / 2} cm².`, ["Diagonalen delar rektangeln i två lika delar."], "cm²"); } },
    { id: "triFromPara", skill: "w10-l4.triangle", gen: (rng) => { const b = rng.int(4, 12) * 2, h = rng.int(3, 9); return numeric(`tfp-${b}-${h}`, "w10-l4.triangle", `Ett parallellogram har arean ${b * h} cm². En triangel har samma bas och samma höjd. Vad är triangelns area?`, (b * h) / 2, `Triangeln är hälften av parallellogrammet: ${b * h} ÷ 2 = ${(b * h) / 2} cm².`, ["Två trianglar bildar ett parallellogram."], "cm²"); } },
    { id: "sameBaseHeight", skill: "w10-l4.concept", gen: (rng) => { const b = rng.int(3, 10) * 2, h = rng.int(3, 9);
      return mc(`sb-${b}-${h}`, "w10-l4.concept", `Två trianglar har båda basen ${b} cm och höjden ${h} cm, men olika form (den ena är spetsigare). Vad stämmer?`, `De har lika stor area, ${(b * h) / 2} cm²`, [{ text: "Den spetsigare har störst area", note: "Arean beror bara på bas och höjd, inte på hur sneda sidorna är." }, { text: "Den med längst sida har störst area" }, { text: "Det går inte att avgöra" }], `Arean är ${b} · ${h} ÷ 2 = ${(b * h) / 2} cm² för båda: den beror bara på bas och höjd.`, ["Vad ingår i formeln för triangelns area?"], rng); } },
  ],
  method: [
    { id: "paraSteps", skill: "w10-l4.parallelogram", gen: (rng) => { const { b, d, h, s } = paraSet(rng); return withVisual(multifield(`ps-${b}-${d}-${h}`, "w10-l4.parallelogram", "Räkna parallellogrammets area i steg. Basen är den nedre sidan.", [{ label: "Höjd (vinkelrät mot basen)", suffix: "cm", accept: [h] }, { label: "Area (bas · höjd)", suffix: "cm²", accept: [b * h] }], `Höjden är ${h} cm (inte den sneda sidan ${s}). Area ${b} · ${h} = ${b * h} cm².`, ["Vilken längd står rakt upp från basen?"]), paraVisual(b, d, h, s)); } },
    { id: "triSteps", skill: "w10-l4.triangle", gen: (rng) => { const { b, d, h, s } = triSet4(rng); return withVisual(multifield(`ts-${b}-${d}-${h}`, "w10-l4.triangle", "Räkna triangelns area i steg.", [{ label: "Bas · höjd", suffix: "cm²", accept: [b * h] }, { label: "Triangelns area (hälften)", suffix: "cm²", accept: [(b * h) / 2] }], `${b} · ${h} = ${b * h}, hälften är ${(b * h) / 2} cm².`, ["Bas · höjd ger ett parallellogram. Triangeln är hälften."]), triHeightVisual(b, d, h, s)); } },
  ],
  representation: [
    { id: "whichHeight", skill: "w10-l4.height", gen: (rng) => { const { b, d, h, s } = paraSet(rng);
      return withVisual(mc(`wh-${b}-${d}-${h}`, "w10-l4.height", "Vilken längd ska du multiplicera med basen för att få arean?", cmL(h), [{ text: cmL(s), note: "Det är den sneda sidan – den är inte vinkelrät mot basen." }, { text: cmL(b) }, { text: cmL(b + s) }], `Höjden är det vinkelräta avståndet: ${h} cm.`, ["Höjden står rakt upp från basen (rät vinkel)."], rng), paraVisual(b, d, h, s)); } },
    { id: "obtuseTri", skill: "w10-l4.height", gen: (rng) => { let b: number, h: number; do { b = rng.int(3, 8); h = rng.int(2, 6); } while ((b * h) % 2);
      const e = rng.int(1, 3);
      return withVisual(numeric(`ot-${b}-${h}-${e}`, "w10-l4.height", "Triangelns topp ligger utanför basen. Höjden är ändå det vinkelräta avståndet (streckat). Vad är arean?", (b * h) / 2, `Area = bas · höjd ÷ 2 = ${b} · ${h} ÷ 2 = ${(b * h) / 2} cm². Höjden kan ligga utanför triangeln – den mäts alltid vinkelrätt mot basens (förlängda) linje.`, ["Basen är sidan märkt med längd. Höjden är den streckade."], "cm²"),
        polyV([[0, 0], [b, 0], [b + e, h]] as P2[], { sides: [cmL(b), "", ""], dash: [{ a: [b + e, h], b: [b + e, 0], label: cmL(h) }, { a: [b, 0], b: [b + e, 0] }] })); } },
  ],
  teacher: {
    title: "Höjd eller sned sida?",
    scenarios: ["Mia (åk 5) ska räkna arean av ett parallellogram med basen 8 cm, den sneda sidan 5 cm och höjden 4 cm (streckad). Hon svarar 8 · 5 = 40 cm²."],
    prompt: "Förklara för Mia varför 5 cm inte kan användas som höjd, vad rätt area är och hur man kan se varför area = bas · höjd. Hur skulle arean av en triangel med samma bas och höjd bli?",
    minChars: 180,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "vinkelrat", label: "att höjden är vinkelrät mot basen och 5 cm är en sned sida", any: ["vinkelrät", "rät vinkel", "rakt upp", "sned sida", "sneda sidan"] },
        { id: "svar", label: "rätt area 32", any: ["32"] },
        { id: "klipp", label: "att man kan klippa av och flytta en triangel så att det blir en rektangel", any: ["klippa", "flytta", "rektangel", "klipp"] },
        { id: "bashojd", label: "area = bas · höjd (8 · 4)", any: ["8 · 4", "8·4", "8 x 4", "8 × 4", "bas gånger höjd", "bas · höjd", "bas × höjd"] },
        { id: "triangel", label: "triangeln får hälften (16)", any: ["16", "hälften"] },
      ],
    },
    modelAnswer: "Mia, höjden är det vinkelräta avståndet från basen upp till motstående sida – den som står rakt upp, 4 cm. Sidan på 5 cm är sned och är längre än höjden, så den ger för stor area. Tänk dig att du klipper av triangeln i ena änden och flyttar den till andra sidan: då blir figuren en rektangel med basen 8 och höjden 4. Arean är bas gånger höjd, 8 · 4 = 32 cm². En triangel med samma bas och höjd är hälften av parallellogrammet, alltså 16 cm².",
  },
};

// ───────── Lektion 5: Volym ─────────
export const lesson5: Lesson = {
  id: "w10-l5", worldId: "w10", title: "Volym – hur många kuber ryms?", grades: "åk 4–6",
  summary: "Volym är antalet enhetskuber. Rätblock: längd · bredd · höjd, mäts i kubikenheter.",
  lgr: "Metoder för att bestämma volym hos rätblock; volymenheter",
  objectives: ["Förklara volym som antal täckande enhetskuber, skikt för skikt.", "Räkna volym av rätblock och kuber.", "Skilja volym (cm³) från area (cm²) och längd (cm)."],
  intro: "**Volym** är hur mycket rymd en kropp tar upp. Vi mäter den genom att fylla den med **enhetskuber** (1 cm × 1 cm × 1 cm). Tänk skikt för skikt: först ett lager rutor på botten – sedan staplar du lager på lager. Volymen mäts i **kubikenheter**: cm³, dm³, m³.",
  theory: [
    { heading: "Ett skikt i taget", body: "Rätblocket nedan är 4 kuber långt och 3 kuber brett. Det nedersta skiktet har $4 \\cdot 3 = 12$ kuber. Blocket är 2 skikt högt: $12 \\cdot 2 = 24$ kuber. Volymen är 24 cm³.", visual: { type: "cuboid", l: 4, b: 3, h: 2 } },
    { heading: "Längd · bredd · höjd", body: "Volym = $l \\cdot b \\cdot h$ = bottenarean · höjden. Bottenarean $l \\cdot b$ säger hur många kuber det är i ett skikt, och höjden hur många skikt. En kub med sidan $s$ har volymen $s \\cdot s \\cdot s = s^3$ (”s i kubik”).", visual: { type: "cuboid", l: 5, b: 3, h: 4, labels: ["5 cm", "3 cm", "4 cm"] } },
    { heading: "Tre olika mått", body: "**Längd** (cm): sträckan, en dimension. **Area** (cm²): ytan, två dimensioner (längd · bredd). **Volym** (cm³): rymden, tre dimensioner (längd · bredd · höjd). Därför behövs tre tal för volym." },
    { heading: "Sammansatta kroppar och skalning", body: "Delar du en kropp i rätblock kan du addera volymerna. Dubblar du *alla tre* kanter blir volymen $2 \\cdot 2 \\cdot 2 = 8$ gånger så stor (inte 2 eller 4)." },
  ],
  worked: [
    { title: "Rätblock", problem: "Rätblock 5 cm × 3 cm × 4 cm. Volym?", steps: [{ text: "Kuber i bottenskiktet.", math: "5 \\cdot 3 = 15" }, { text: "Antal skikt: 4 (höjden).", math: "15 \\cdot 4 = 60" }, { text: "Volymen är 60 cm³." }], why: "Varje skikt har lika många kuber, så vi multiplicerar.", alternative: "Räkna alla kuber en och en – långsamt men visar varför formeln fungerar." },
    { title: "Saknad kant", problem: "Ett rätblock har volymen 72 cm³, längden 6 cm och bredden 4 cm. Hur högt är det?", steps: [{ text: "Bottenskiktet: $6 \\cdot 4 = 24$ kuber." }, { text: "Antal skikt:", math: "72 \\div 24 = 3" }], why: "Volym = bottenarea · höjd, så höjd = volym ÷ bottenarea.", alternative: "Prova höjder: 1 skikt = 24, 2 = 48, 3 = 72." },
  ],
  drawing: { task: "Rita (isometriskt eller som tre vyer) ett rätblock som är 3 kuber långt, 2 kuber brett och 2 kuber högt. Rita det nedersta skiktet för sig. Hur många kuber är det totalt?", tool: "grid" },
  pupils: [{ pupil: "Oskar", said: "Blocket är 4 cm × 3 cm × 2 cm, så volymen är 4 + 3 + 2 = 9 cm³.", misconception: "Adderar måtten i stället för att multiplicera – tänker inte i skikt.", response: "Låt Oskar bygga blocket med klossar: hur många klossar ligger på botten (12)? Hur många skikt? Då blir det 12 + 12 = 24." }],
  knowledge: [
    { id: "cuboidVol", skill: "w10-l5.cuboid", gen: (rng) => { const l = rng.int(3, 6), b = rng.int(2, 4), h = rng.int(2, 4); return withVisual(numeric(`cv-${l}-${b}-${h}`, "w10-l5.cuboid", "Vad är rätblockets volym?", l * b * h, `${l} · ${b} · ${h} = ${l * b * h} cm³.`, ["Längd gånger bredd gånger höjd."], "cm³"), { type: "cuboid", l, b, h, labels: [cmL(l), cmL(b), cmL(h)] }); } },
    { id: "cubeVol", skill: "w10-l5.cube", gen: (rng) => { const s = rng.int(2, 8); return withVisual(numeric(`cb-${s}`, "w10-l5.cube", `En kub har kanten ${s} cm. Vad är volymen?`, s ** 3, `${s} · ${s} · ${s} = ${s ** 3} cm³.`, ["Alla tre kanter är lika långa."], "cm³"), { type: "solid", shape: "cube" }); } },
    { id: "layerCount", skill: "w10-l5.layers", gen: (rng) => { const l = rng.int(2, 6), b = rng.int(2, 5), h = rng.int(2, 4); return numeric(`lc-${l}-${b}-${h}`, "w10-l5.layers", `Ett rätblock är ${l} kuber långt, ${b} kuber brett och ${h} kuber högt. Hur många kuber ligger i det nedersta skiktet?`, l * b, `Skiktet är ${l} gånger ${b}: ${l * b} kuber.`, ["Ett skikt är en rektangel av kuber."]); } },
    { id: "layersVol", skill: "w10-l5.layers", gen: (rng) => { const n = rng.int(6, 20), h = rng.int(2, 7); return numeric(`lv-${n}-${h}`, "w10-l5.layers", `Ett rätblock har ${n} kuber i varje skikt och är ${h} skikt högt. Hur många kuber ryms i hela blocket?`, n * h, `${n} · ${h} = ${n * h} kuber.`, ["Antal per skikt gånger antal skikt."]); } },
    { id: "missingEdge", skill: "w10-l5.missing", gen: (rng) => { const l = rng.int(3, 9), b = rng.int(2, 7), h = rng.int(2, 8); return numeric(`me-${l}-${b}-${h}`, "w10-l5.missing", `Ett rätblock har volymen ${l * b * h} cm³, längden ${l} cm och bredden ${b} cm. Hur högt är det?`, h, `Bottenskiktet är ${l} · ${b} = ${l * b} kuber. ${l * b * h} ÷ ${l * b} = ${h} skikt, alltså ${h} cm.`, ["Dela volymen med bottenarean."], "cm"); } },
    { id: "unitMc", skill: "w10-l5.units", gen: (rng) => { const u = rng.pick(["cm", "dm", "m", "mm"]); return mc(`vu-${u}`, "w10-l5.units", `Ett rätblock mäts i ${u}. I vilken enhet ska volymen anges?`, `${u}³`, [{ text: u, note: "Det är en längdenhet." }, { text: `${u}²`, note: "Det är en areaenhet (yta)." }, { text: `${u} · 3` }], `Volym är tre dimensioner: längd · bredd · höjd, alltså ${u}³ (kubik${u}).`, ["Hur många dimensioner har rymd?"], rng); } },
    { id: "scaleEdges", skill: "w10-l5.scaling", gen: (rng) => { const f = rng.pick([2, 3]), all = rng.chance(0.6); return numeric(`se-${f}-${all}`, "w10-l5.scaling", all ? `Du ${f === 2 ? "dubblar" : "tredubblar"} alla tre kanterna på ett rätblock. Hur många gånger större blir volymen?` : `Du ${f === 2 ? "dubblar" : "tredubblar"} bara höjden på ett rätblock. Hur många gånger större blir volymen?`, all ? f ** 3 : f, all ? `Längden, bredden och höjden blir ${f} gånger så stora: ${f} · ${f} · ${f} = ${f ** 3}.` : `Det blir ${f} gånger så många skikt: ${f} gånger så stor volym.`, ["Prova med en liten kub, t.ex. 1 × 1 × 1."]); } },
    { id: "composite", skill: "w10-l5.composite", gen: (rng) => { const b = rng.int(2, 5), h = rng.int(2, 5), l1 = rng.int(3, 7), l2 = rng.int(2, 5); return numeric(`co-${b}-${h}-${l1}-${l2}`, "w10-l5.composite", `En kropp består av två rätblock som sitter ihop. Det ena är ${l1} cm × ${b} cm × ${h} cm och det andra ${l2} cm × ${b} cm × ${h} cm. Vad är kroppens volym?`, (l1 + l2) * b * h, `${l1} · ${b} · ${h} = ${l1 * b * h} och ${l2} · ${b} · ${h} = ${l2 * b * h}. Summa: ${(l1 + l2) * b * h} cm³.`, ["Räkna volymen av varje del och addera."], "cm³"); } },
    { id: "compareVol", skill: "w10-l5.compare", gen: (rng) => { for (;;) { const bs = Array.from({ length: 4 }, () => [rng.int(2, 7), rng.int(2, 6), rng.int(2, 6)] as [number, number, number]); const vs = bs.map(([a, b, c]) => a * b * c); const m = Math.max(...vs); if (vs.filter((v) => v === m).length === 1) { const i = vs.indexOf(m); const t = (x: [number, number, number]) => `${x[0]} · ${x[1]} · ${x[2]} cm`; return mc(`cp-${bs.flat().join("-")}`, "w10-l5.compare", "Vilket rätblock har störst volym?", t(bs[i]), bs.filter((_, j) => j !== i).map((x) => ({ text: t(x) })), `Volymerna är ${vs.join(", ")} cm³.`, ["Räkna ut volymen av varje."], rng); } } } },
  ],
  method: [
    { id: "volSteps", skill: "w10-l5.cuboid", gen: (rng) => { const l = rng.int(3, 6), b = rng.int(2, 4), h = rng.int(2, 4); return withVisual(multifield(`vs-${l}-${b}-${h}`, "w10-l5.cuboid", "Räkna volymen skikt för skikt.", [{ label: "Kuber i ett skikt (längd · bredd)", accept: [l * b] }, { label: "Antal skikt (höjden)", accept: [h] }, { label: "Volym", suffix: "cm³", accept: [l * b * h] }], `${l} · ${b} = ${l * b} per skikt, ${h} skikt: ${l * b * h} cm³.`, ["Ett skikt först."]), { type: "cuboid", l, b, h, labels: [cmL(l), cmL(b), cmL(h)] }); } },
    { id: "volAreaLen", skill: "w10-l5.units", gen: (rng) => { const l = rng.int(3, 8), b = rng.int(2, 6), h = rng.int(2, 6); return multifield(`va-${l}-${b}-${h}`, "w10-l5.units", `Ett rätblock är ${l} cm × ${b} cm × ${h} cm. Räkna bottenytans area och volymen – de är olika sorters mått.`, [{ label: "Bottenytans area", suffix: "cm²", accept: [l * b] }, { label: "Volym", suffix: "cm³", accept: [l * b * h] }], `Bottenytan är ${l} · ${b} = ${l * b} cm². Volymen är ${l * b} · ${h} = ${l * b * h} cm³.`, ["Botten är en yta (två mått), hela blocket är rymd (tre mått)."]); } },
  ],
  representation: [
    { id: "cuboidCount", skill: "w10-l5.count", gen: (rng) => { const l = rng.int(2, 5), b = rng.int(2, 3), h = rng.int(2, 4); return withVisual(numeric(`cc-${l}-${b}-${h}`, "w10-l5.count", "Varje liten kub är 1 cm³. Hur många kuber ryms i rätblocket? Räkna skikt för skikt.", l * b * h, `Skiktet är ${l} · ${b} = ${l * b} kuber, och det finns ${h} skikt: ${l * b * h} cm³.`, ["Hur många kuber syns på toppen? Hur många skikt?"], "cm³"), { type: "cuboid", l, b, h }); } },
    { id: "exprMc", skill: "w10-l5.count", gen: (rng) => { const l = rng.int(3, 6), b = rng.int(2, 4), h = rng.int(2, 4); const V = l * b * h;
      const opts = [{ text: `${l} · ${b} · ${h}`, v: V }, { text: `${l} + ${b} + ${h}`, v: l + b + h }, { text: `${l} · ${b} + ${h}`, v: l * b + h }, { text: `(${l} + ${b}) · ${h}`, v: (l + b) * h }].filter((o, i) => i === 0 || o.v !== V);
      return withVisual(mc(`em-${l}-${b}-${h}`, "w10-l5.count", "Vilken uträkning ger rätblockets volym (i kuber)?", opts[0].text, opts.slice(1).map((o) => ({ text: o.text })), `Ett skikt har ${l} · ${b} kuber och det är ${h} skikt: ${l} · ${b} · ${h}.`, ["Skikt gånger antal skikt."], rng), { type: "cuboid", l, b, h, labels: [cmL(l), cmL(b), cmL(h)] }); } },
  ],
  teacher: {
    title: "Volym är inte en summa",
    scenarios: ["Oskar (åk 5) ska räkna volymen av ett rätblock som är 4 cm långt, 3 cm brett och 2 cm högt. Han skriver 4 + 3 + 2 = 9 cm³."],
    prompt: "Förklara för Oskar vad volym är, varför man multiplicerar i stället för att addera, och hur han kan tänka med skikt. Vilken enhet ska svaret ha och varför?",
    minChars: 180,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "kuber", label: "att volym är hur många enhetskuber som ryms", any: ["kuber", "kub", "klossar", "ryms", "rymd"] },
        { id: "skikt", label: "skikt/lager", any: ["skikt", "lager", "våning"] },
        { id: "tolv", label: "12 kuber i botten", any: ["12"] },
        { id: "svar", label: "rätt volym 24", any: ["24"] },
        { id: "enhet", label: "enheten cm³ (tre dimensioner)", any: ["cm³", "kubikcentimeter", "tre dimensioner", "kubik"] },
      ],
    },
    modelAnswer: "Oskar, volym är hur många enhetskuber, till exempel klossar på 1 cm, som ryms i blocket. Tänk skikt för skikt: på botten ligger 4 · 3 = 12 kuber, och blocket är 2 skikt högt. Då är det 12 + 12 = 24 kuber, alltså 4 · 3 · 2 = 24. Att lägga ihop 4 + 3 + 2 räknar bara längderna på kanterna och säger inget om hur många kuber det är. Svaret är 24 cm³, kubikcentimeter, eftersom volym har tre dimensioner.",
  },
};

// ───────── Lektion 6: Vinklar ─────────
const ANG_NAME = (d: number) => (d < 90 ? "spetsig" : d === 90 ? "rät" : d < 180 ? "trubbig" : "rak");

export const lesson6: Lesson = {
  id: "w10-l6", worldId: "w10", title: "Vinklar – mäta, uppskatta och räkna", grades: "åk 4–6",
  summary: "Vinklar mäts i grader. Rät = 90°, rak = 180°. Vinkelsumman i en triangel är 180°.",
  lgr: "Vinklar och hur de mäts, uppskattas och beräknas",
  objectives: ["Namnge och uppskatta vinklar.", "Mäta en vinkel med gradskiva och välja rätt skala.", "Räkna ut saknade vinklar i trianglar och längs en rät linje."],
  intro: "En **vinkel** visar hur mycket en sträcka har vridits kring en punkt. Vi mäter vridningen i **grader** (°). Ett helt varv är 360°. Det klurigaste är gradskivan, som har *två* skalor – och att välja fel skala är ett av de vanligaste mätfelen.",
  theory: [
    { heading: "Namn på vinklar", body: "**Spetsig** vinkel: mindre än 90°. **Rät** vinkel: exakt 90° (som i ett hörn på ett papper). **Trubbig** vinkel: mellan 90° och 180°. **Rak** vinkel: 180° (en rät linje). Ett helt varv: 360°.", visual: { type: "angle", deg: 60, label: "60°" } },
    { heading: "Använd gradskivan rätt", body: "1. Lägg gradskivans mittpunkt på vinkelns spets.\n\n2. Lägg 0-linjen längs den ena vinkelbenet (**basbenet**).\n\n3. Läs av den skala som **börjar på 0 vid basbenet**. Är basbenet till höger använder du den yttre (vita) skalan, är det till vänster den inre (gula).\n\n4. Kontrollera med en uppskattning: är vinkeln spetsig ska svaret vara under 90°.", visual: { type: "angle", deg: 70, protractor: true, base: "left" } },
    { heading: "Vinkelsummor", body: "I varje **triangel** är vinklarna tillsammans 180°. I varje **fyrhörning** är de 360°. Vinklar som tillsammans bildar en **rät linje** är 180°. Vinklar som tillsammans bildar en rät vinkel är 90°." },
    { heading: "Likbent och liksidig", body: "I en likbent triangel är de två vinklarna vid basen lika stora. I en liksidig triangel är alla vinklar lika: $180° \\div 3 = 60°$.", visual: { type: "polygon", pts: [[-Math.tan(Math.PI / 6), 0], [Math.tan(Math.PI / 6), 0], [0, 1]], ticks: [1, 1, 1], angles: [{ at: 2, text: "60°" }, { at: 0, text: "60°" }, { at: 1, text: "60°" }] } },
  ],
  worked: [
    { title: "Tredje vinkeln", problem: "En triangel har vinklarna 50° och 65°. Hur stor är den tredje?", steps: [{ text: "Lägg ihop de givna.", math: "50 + 65 = 115" }, { text: "Resten av 180°.", math: "180 - 115 = 65" }], why: "Vinkelsumman i en triangel är alltid 180°.", alternative: "Rita en triangel och rita av vinklarna med gradskiva – det blir ungefär 65°." },
    { title: "Likbent triangel", problem: "Toppvinkeln i en likbent triangel är 40°. Hur stora är basvinklarna?", steps: [{ text: "De två basvinklarna delar resten.", math: "180 - 40 = 140" }, { text: "Lika stora:", math: "140 \\div 2 = 70" }], why: "Basvinklarna är lika stora i en likbent triangel.", alternative: "Kontroll: 40 + 70 + 70 = 180." },
  ],
  drawing: { task: "Rita en vinkel på 40° och en på 130° med gradskiva. Skriv vilken sort de är (spetsig, rät, trubbig). Mät sedan de tre vinklarna i en triangel du ritat: blir summan nära 180°?", tool: "grid" },
  pupils: [{ pupil: "Linn", said: "Vinkeln är mindre än en rät vinkel, men gradskivan visar 110°, så den är 110°.", misconception: "Läser av fel skala (börjar på fel nolla) och kontrollerar inte med en uppskattning.", response: "Fråga först: ”Är vinkeln mindre eller större än ett pappershörn?” Då är svaret under 90°. Låt Linn hitta skalan som börjar på 0 vid basbenet: 70°." }],
  knowledge: [
    { id: "classify", skill: "w10-l6.names", gen: (rng) => { const d = rng.pick([20, 35, 50, 65, 80, 90, 100, 115, 130, 145, 160, 175, 180]); const name = ANG_NAME(d);
      return mc(`cl-${d}`, "w10-l6.names", `En vinkel är ${d}°. Vilken sort är den?`, name, ["spetsig", "rät", "trubbig", "rak"].filter((x) => x !== name).map((text) => ({ text })), `${d}° är ${d < 90 ? "mindre än 90°" : d === 90 ? "exakt 90°" : d < 180 ? "mellan 90° och 180°" : "180°, en rät linje"}, alltså ${name}.`, ["Jämför med 90° och 180°."], rng); } },
    { id: "complement", skill: "w10-l6.sums", gen: (rng) => { const a = rng.int(10, 80); return numeric(`cp-${a}`, "w10-l6.sums", `Två vinklar tillsammans bildar en rät vinkel. Den ena är ${a}°. Hur stor är den andra?`, 90 - a, `90 − ${a} = ${90 - a}°.`, ["En rät vinkel är 90°."], "°"); } },
    { id: "straight", skill: "w10-l6.sums", gen: (rng) => { const a = rng.int(20, 160); return numeric(`sl-${a}`, "w10-l6.sums", `Två vinklar ligger bredvid varandra längs en rät linje. Den ena är ${a}°. Hur stor är den andra?`, 180 - a, `Längs en rät linje är vinklarna tillsammans 180°: 180 − ${a} = ${180 - a}°.`, ["En rak vinkel är 180°."], "°"); } },
    { id: "triMissing", skill: "w10-l6.triangle", gen: (rng) => { const A = rng.int(30, 80), B = rng.int(30, 80); const C = 180 - A - B;
      return withVisual(numeric(`tm-${A}-${B}`, "w10-l6.triangle", "Hur stor är den tredje vinkeln (?) i triangeln?", C, `Summan är 180°: 180 − ${A} − ${B} = ${C}°.`, ["Vinklarna i en triangel är tillsammans 180°."], "°"), polyV(triFromAngles(A, B), { angles: [{ at: 0, text: `${A}°` }, { at: 1, text: `${B}°` }, { at: 2, text: "?" }] })); } },
    { id: "quadMissing", skill: "w10-l6.triangle", gen: (rng) => { const a = rng.int(60, 110), b = rng.int(60, 110), c = rng.int(60, 110); return numeric(`qm-${a}-${b}-${c}`, "w10-l6.triangle", `En fyrhörning har tre vinklar: ${a}°, ${b}° och ${c}°. Hur stor är den fjärde?`, 360 - a - b - c, `Vinkelsumman i en fyrhörning är 360°: 360 − ${a} − ${b} − ${c} = ${360 - a - b - c}°.`, ["Fyrhörningens vinklar är tillsammans 360°."], "°"); } },
    { id: "isoBase", skill: "w10-l6.isosceles", gen: (rng) => { const t = rng.int(10, 60) * 2; return withVisual(numeric(`ib-${t}`, "w10-l6.isosceles", "Triangeln är likbent. Hur stor är varje basvinkel (?)?", (180 - t) / 2, `Resten efter toppvinkeln: 180 − ${t} = ${180 - t}°. Delat på två: ${(180 - t) / 2}°.`, ["De två basvinklarna är lika stora."], "°"), polyV([[-Math.tan((t / 2) * Math.PI / 180), 0], [Math.tan((t / 2) * Math.PI / 180), 0], [0, 1]], { ticks: [0, 1, 1], angles: [{ at: 2, text: `${t}°` }, { at: 0, text: "?" }] })); } },
    { id: "clock", skill: "w10-l6.context", gen: (rng) => { const h = rng.int(1, 6); return numeric(`ck-${h}`, "w10-l6.context", `Klockan är ${h}.00. Hur stor är den mindre vinkeln mellan timvisaren och minutvisaren?`, h * 30, `Ett helt varv på 360° delas i 12 timmar: 30° per timme. ${h} · 30 = ${h * 30}°.`, ["Hur många grader är det mellan två timmar på urtavlan?"], "°"); } },
    { id: "turns", skill: "w10-l6.context", gen: (rng) => { const [t, d] = rng.pick([["ett kvarts varv", 90], ["ett halvt varv", 180], ["tre kvarts varv", 270], ["ett åttondels varv", 45], ["ett tredjedels varv", 120], ["ett helt varv", 360]] as [string, number][]); return numeric(`tu-${d}`, "w10-l6.context", `Du vrider dig ${t}. Hur många grader har du vridit dig?`, d, `Ett helt varv är 360°, så ${t} är ${d}°.`, ["Ett helt varv är 360°."], "°"); } },
  ],
  method: [
    { id: "triSteps", skill: "w10-l6.triangle", gen: (rng) => { const A = rng.int(25, 85), B = rng.int(25, 85); return multifield(`ts-${A}-${B}`, "w10-l6.triangle", `En triangel har två vinklar, ${A}° och ${B}°. Räkna ut den tredje i steg.`, [{ label: "De två givna vinklarna tillsammans", suffix: "°", accept: [A + B] }, { label: "Tredje vinkeln", suffix: "°", accept: [180 - A - B] }], `${A} + ${B} = ${A + B}, och 180 − ${A + B} = ${180 - A - B}°.`, ["Addera först de två givna."]); } },
    { id: "lineSteps", skill: "w10-l6.sums", gen: (rng) => { const a = rng.int(25, 70), b = rng.int(25, 70); return multifield(`ln-${a}-${b}`, "w10-l6.sums", `Tre vinklar ligger bredvid varandra längs en rät linje. De två första är ${a}° och ${b}°. Hur stor är den tredje (x)?`, [{ label: "De två givna tillsammans", suffix: "°", accept: [a + b] }, { label: "x", suffix: "°", accept: [180 - a - b] }], `Längs en rät linje är summan 180°: 180 − ${a + b} = ${180 - a - b}°.`, ["Hela den räta linjen är 180°."]); } },
  ],
  representation: [
    { id: "readProtractor", skill: "w10-l6.protractor", gen: (rng) => { const deg = rng.int(1, 17) * 10, base = rng.pick(["left", "right"] as const); const sc = base === "right" ? "yttre skalan (vita siffror, 0 till höger)" : "inre skalan (gula siffror, 0 till vänster)";
      return withVisual(numeric(`rp-${deg}-${base}`, "w10-l6.protractor", `Hur stor är vinkeln? Basbenet (vitt) ligger åt ${base === "right" ? "höger" : "vänster"}, och det gula benet visar vinkeln. Läs av skalan som börjar på 0 vid basbenet.`, deg, `Basbenet ligger åt ${base === "right" ? "höger" : "vänster"}, så du läser ${sc}: ${deg}°.`, ["Börja räkna från 0 vid det vita benet.", "Uppskatta först: är vinkeln spetsig eller trubbig?"], "°"), { type: "angle", deg, protractor: true, base }); } },
    { id: "estimate", skill: "w10-l6.estimate", gen: (rng) => { const true_ = rng.pick([30, 60, 90, 120, 150]); const j = rng.pick([-7, -4, 4, 7]); const deg = true_ + j; const opts = [30, 60, 90, 120, 150];
      return withVisual(mc(`es-${true_}-${j}`, "w10-l6.estimate", "Ungefär hur stor är vinkeln? Uppskatta – du får ingen gradskiva.", `${true_}°`, opts.filter((o) => o !== true_).slice(0, 3).map((o) => ({ text: `${o}°` })), `Vinkeln är ungefär ${true_}° (jämför med ett pappershörn på 90° och en rät linje på 180°).`, ["Jämför med en rät vinkel (90°) och en halv rät vinkel (45°)."], rng), { type: "angle", deg, base: "right" }); } },
  ],
  teacher: {
    title: "Fel skala på gradskivan",
    scenarios: ["Linn (åk 5) mäter en vinkel som är tydligt mindre än ett pappershörn, med basbenet åt vänster. Hon läser av 110° på gradskivan. Rätt svar är 70°."],
    prompt: "Förklara för Linn vad som troligen gick fel, hur hon väljer rätt skala på gradskivan och hur hon kan kontrollera att svaret är rimligt innan hon skriver det.",
    minChars: 170,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "skala", label: "att gradskivan har två skalor / hon läste fel skala", any: ["två skalor", "fel skala", "andra skalan", "rätt skala", "skala"] },
        { id: "noll", label: "att skalan ska börja på 0 vid basbenet", any: ["börjar på 0", "noll", "0 vid", "0-linjen", "nollan"] },
        { id: "svar", label: "rätt svar 70", any: ["70"] },
        { id: "uppskatt", label: "att uppskatta/jämföra med rät vinkel först", any: ["uppskatta", "rät vinkel", "pappershörn", "mindre än 90", "spetsig", "under 90"] },
        { id: "summa", label: "att 110 och 70 tillsammans blir 180", any: ["180", "tillsammans"] },
      ],
    },
    modelAnswer: "Linn, gradskivan har två skalor, och du har läst av den som börjar på fel ände. Basbenet pekar åt vänster, så du ska läsa den skala som börjar på 0 vid just det benet, och då får du 70°. Det är mycket lättare att inte hamna fel om du uppskattar först: vinkeln är mindre än en rät vinkel, ett pappershörn, så den är spetsig och måste vara under 90°. 110° är trubbig, så det kan inte stämma. De två avläsningarna 70° och 110° blir tillsammans 180°, vilket visar att du läste på den andra skalan.",
  },
};
