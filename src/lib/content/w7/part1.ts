import type { Lesson } from "../types";
import { mc, numeric, multifield, withVisual, numberlineEx, gridshadeEx, tf, gcd, dc, dcAcc, pctOf, baseFor, pc, sv } from "@/lib/engine/gen-helpers";
import type { Rng } from "@/lib/engine/rng";

const m = (n: number, d: number) => `$${tf(n, d)}$`;
const PCTS = [10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90];

/** A base N (a "round" number) for which p % of N is whole, plus the part. */
function pb(rng: Rng, p: number, lo = 2, hi = 12) {
  const N = baseFor(p, rng.int(lo, hi) * (100 / gcd(p, 100) < 10 ? 5 : 1));
  return { N, part: pctOf(p, N) };
}

// ───────── Lektion 1: Vad är procent? ─────────
export const lesson1: Lesson = {
  id: "w7-l1", worldId: "w7", title: "Vad är procent?", grades: "åk 4–6",
  summary: "Procent betyder ”av hundra” – en del av en helhet som delats i 100 lika delar.",
  lgr: "Tal i procentform och deras samband med tal i bråk- och decimalform",
  objectives: ["Förklara procent som hundradelar av en helhet.", "Läsa av och rita procent i hundrarutnät och procentstapel.", "Förstå att procent alltid handlar om procent *av* något."],
  intro: "Procent är ett av de områden där många vuxna känner sig osäkra – oftast för att de lärt sig **regler** utan att se vad procent *är*. Här börjar vi därför med bilden: **procent är hundradelar.** $1\\,\\%$ betyder ”en av hundra”. När den bilden sitter blir resten av procentlära ett resonemang i stället för ett minnesspel.",
  theory: [
    { heading: "Procent = per hundra", body: "Ordet *procent* kommer av ”per cent”, alltså ”per hundra”. $35\\,\\%$ betyder $35$ av $100$, eller $\\frac{35}{100}$. Helheten delas i 100 lika stora delar och vi tar 35 av dem.", visual: { type: "decimalgrid", hundredths: 35 } },
    { heading: "Hundrarutnätet", body: "Ett rutnät med 100 rutor är en hel, $100\\,\\%$. Varje ruta är $1\\,\\%$. En hel rad (10 rutor) är $10\\,\\%$. Det här är samma bild som hundradelar i decimaltal – nu med ett nytt namn." },
    { heading: "Procent av vad?", body: "Procent säger bara *hur stor andel*. Hur mycket det blir beror på **helheten**: $50\\,\\%$ av 20 kr är 10 kr, men $50\\,\\%$ av 2 000 kr är 1 000 kr. Därför måste man alltid veta ”av vad”.", visual: { type: "percentbar", pct: 50, label: "50 %" } },
    { heading: "Tre viktiga värden", body: "- $100\\,\\%$ är **hela** helheten.\n\n- $50\\,\\%$ är **hälften**.\n\n- $0\\,\\%$ är ingenting.\n\nProcent över 100 betyder *mer än* helheten – t.ex. $150\\,\\%$ är en och en halv helhet." },
  ],
  worked: [
    { title: "Läsa av rutnätet", problem: "I ett hundrarutnät är 37 rutor färgade. Hur många procent är färgade?", steps: [{ text: "Helheten har 100 rutor.", math: "100\\ \\text{rutor} = 100\\,\\%" }, { text: "37 av 100 rutor:", math: "\\frac{37}{100} = 37\\,\\%" }, { text: "Ofärgat:", math: "100 - 37 = 63 \\Rightarrow 63\\,\\%" }], why: "Varje ruta är en hundradel, alltså 1 %. Det färgade och det ofärgade fyller upp 100 %.", alternative: "Tre hela rader (30 rutor) och 7 rutor till: $30 + 7 = 37$." },
    { title: "Samma procent, olika helheter", problem: "Vad är 50 % av 20 kr och av 2 000 kr?", steps: [{ text: "50 % är hälften.", math: "50\\,\\% = \\frac{1}{2}" }, { text: "Hälften av 20 och av 2 000:", math: "10\\ \\text{kr och}\\ 1\\,000\\ \\text{kr}" }], why: "Procenten är samma andel, men helheten är olika stor.", alternative: "Rita två procentstaplar av olika längd – båda halvfyllda." },
  ],
  drawing: { task: "Rita ett hundrarutnät (10 × 10). Färga 35 % av det. Hur många hela rader och hur många enstaka rutor blir det? Färga sedan 10 % till i en annan färg – hur många procent är färgade nu?", tool: "hundredgrid" },
  pupils: [{ pupil: "Saga", said: "20 % är 20, oavsett vad. Procent är bara ett tal med ett tecken efter.", misconception: "Ser procenttalet som ett antal i stället för en andel av en helhet.", response: "Fråga: ”20 procent av vad?” Rita 20 % av 50 kr och 20 % av 200 kr och jämför: 10 kr och 40 kr." }],
  knowledge: [
    { id: "gridRead", skill: "w7-l1.grid", gen: (rng) => { const n = rng.int(11, 94); return withVisual(numeric(`gr-${n}`, "w7-l1.grid", "Rutnätet har 100 rutor. Hur många procent av rutorna är färgade?", n, `${n} av 100 rutor = ${n} %.`, ["Varje ruta är 1 %."]), { type: "decimalgrid", hundredths: n }); } },
    { id: "meaning", skill: "w7-l1.meaning", gen: (rng) => { const p = rng.pick([15, 30, 40, 65]); return mc(`mn-${p}`, "w7-l1.meaning", `Vad betyder ${pc(p)}?`, `${p} delar av 100 lika stora delar`, [{ text: `Alltid ${p} stycken`, note: "Procent är en andel – hur mycket det blir beror på helheten." }, { text: `${p} gånger helheten` }, { text: `En ${p}-del av helheten` }], `${pc(p)} = ${p}/100.`, ["Procent betyder per hundra."], rng); } },
    { id: "complement", skill: "w7-l1.complement", gen: (rng) => { const p = rng.int(11, 89); return numeric(`cp-${p}`, "w7-l1.complement", `${pc(p)} av rutorna är färgade. Hur många procent är inte färgade?`, 100 - p, `100 % − ${p} % = ${100 - p} %.`, ["Hela helheten är 100 %."]); } },
    { id: "ofHundred", skill: "w7-l1.of-hundred", gen: (rng) => { const k = rng.int(7, 96); return numeric(`oh-${k}`, "w7-l1.of-hundred", `På en skola med 100 elever cyklar ${k} till skolan. Hur många procent cyklar?`, k, `${k} av 100 = ${k} %.`, ["Av hundra."]); } },
    { id: "wholeAndNone", skill: "w7-l1.landmarks", gen: (rng) => { const kind = rng.pick(["whole", "half", "zero"] as const); const cfg = { whole: ["Hur många procent är hela helheten?", 100], half: ["Hur många procent är hälften?", 50], zero: ["Hur många procent är ingenting av helheten?", 0] } as const; const [q, a] = cfg[kind]; return numeric(`wn-${kind}`, "w7-l1.landmarks", q, a, kind === "whole" ? "Hela helheten är 100 %." : kind === "half" ? "Hälften är 50 av 100." : "Ingenting är 0 %.", []); } },
    { id: "ofWhat", skill: "w7-l1.of-what", gen: (rng) => { const p = rng.pick([10, 20, 25, 50]); const a = baseFor(p, rng.int(1, 3)), b = baseFor(p, rng.int(5, 12)); return mc(`ow-${p}-${a}-${b}`, "w7-l1.of-what", `Stämmer det att ${pc(p)} av ${a} kr är lika mycket som ${pc(p)} av ${b} kr?`, "Nej – helheterna är olika stora, så andelarna blir olika mycket", [{ text: "Ja – båda är samma procent" }, { text: `Ja – ${pc(p)} är alltid ${p} kr` }], `${pc(p)} av ${a} = ${pctOf(p, a)} och ${pc(p)} av ${b} = ${pctOf(p, b)}.`, ["Procent av vad?"], rng); } },
  ],
  method: [
    { id: "gridFields", skill: "w7-l1.grid", gen: (rng) => { const n = rng.int(11, 89); return withVisual(multifield(`gf-${n}`, "w7-l1.grid", "Rutnätet har 100 rutor. Fyll i.", [{ label: "Färgade rutor", accept: [n] }, { label: "Färgade i procent", accept: [n] }, { label: "Ofärgade i procent", accept: [100 - n] }], `${n} % färgat, ${100 - n} % ofärgat.`, []), { type: "decimalgrid", hundredths: n }); } },
    { id: "fracToPct", skill: "w7-l1.fraction", gen: (rng) => { const n = rng.int(3, 97); return multifield(`fp-${n}`, "w7-l1.fraction", `${n} av 100 skrivs som ett bråk och som procent.`, [{ label: "Bråk: täljare (nämnare är 100)", accept: [n] }, { label: "Procent", accept: [n] }], `${n}/100 = ${n} %.`, ["Procent = hundradelar."]); } },
  ],
  representation: [
    { id: "shadeGrid", skill: "w7-l1.shade", gen: (rng) => { const n = rng.int(8, 92); return gridshadeEx(`sg-${n}`, "w7-l1.shade", `Färglägg ${pc(n)} av rutnätet (100 rutor).`, n, `${n} % = ${n} rutor av 100.`, ["Varje ruta är 1 %."]); } },
    { id: "barRead", skill: "w7-l1.bar", gen: (rng) => { const p = rng.pick([10, 20, 30, 40, 60, 70, 80, 90]); return withVisual(numeric(`br-${p}`, "w7-l1.bar", "Stapeln står för hela helheten (100 %). Hur många procent är färgat?", p, `Färgat: ${p} %.`, ["Hela stapeln är 100 %."]), { type: "percentbar", pct: p }); } },
  ],
  teacher: {
    title: "20 procent av vad?",
    scenarios: ["Saga (åk 4) säger: \"20 procent är 20. Det är bara att ta bort procenttecknet.\" När du frågar om 20 % av 50 kr svarar hon 20 kr."],
    prompt: "Förklara för Saga vad procent betyder och varför 20 % inte alltid är 20. Visa med två olika helheter, till exempel 50 kr och 200 kr, och använd gärna hundrarutnätet.",
    minChars: 170,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "hundra", label: "att procent är hundradelar / 20 av 100", any: ["av hundra", "per hundra", "20 av 100", "hundradelar", "20/100", "av 100"] },
        { id: "helhet", label: "att man måste veta helheten (procent av vad)", any: ["helhet", "av vad", "hela", "beror på"] },
        { id: "ex1", label: "ett exempel: 20 % av 50 kr = 10 kr", any: ["10 kr", "10 kronor", "= 10", "är 10"] },
        { id: "ex2", label: "ett andra exempel: 20 % av 200 kr = 40 kr", any: ["40 kr", "40 kronor", "= 40", "är 40"] },
        { id: "modell", label: "en modell (rutnät, stapel)", any: ["rutnät", "rutor", "stapel", "rita", "bild"] },
      ],
    },
    modelAnswer: "Saga, procent betyder ”av hundra”: 20 % är 20 av 100 lika stora delar av en helhet. Hur mycket det blir beror på helheten, så man måste alltid fråga ”20 procent av vad?”. 20 % är en femtedel. En femtedel av 50 kr är 10 kr, och en femtedel av 200 kr är 40 kr. Rita ett hundrarutnät: 20 rutor är färgade, men hur mycket varje ruta är värd beror på helheten. Procent är en andel, inte ett antal.",
  },
};

// ───────── Lektion 2: Procent, bråk och decimaltal ─────────
const TRIPLES: [number, number, number][] = [[1, 2, 50], [1, 4, 25], [3, 4, 75], [1, 5, 20], [2, 5, 40], [3, 5, 60], [4, 5, 80], [1, 10, 10], [3, 10, 30], [7, 10, 70], [1, 20, 5], [3, 20, 15], [9, 20, 45], [1, 25, 4], [3, 25, 12], [7, 25, 28], [1, 100, 1]];

export const lesson2: Lesson = {
  id: "w7-l2", worldId: "w7", title: "Procent, bråk och decimaltal", grades: "åk 4–6",
  summary: "Tre namn för samma tal: 1/4 = 0,25 = 25 %.",
  lgr: "Tal i procentform och deras samband med tal i bråk- och decimalform",
  objectives: ["Växla mellan procent, bråk och decimaltal.", "Kunna de vanliga omvandlingarna utantill.", "Förklara sambandet med hundradelar."],
  intro: "Procent, bråk och decimaltal är **tre sätt att skriva samma tal**. $\\frac{1}{4}$, $0{,}25$ och $25\\,\\%$ är alla en fjärdedel. Den som behärskar de här omvandlingarna slipper tänka på procent som något separat – det blir bara ett tredje språk för hundradelar.",
  theory: [
    { heading: "Tre språk, samma tal", body: "$\\frac{1}{4} = \\frac{25}{100} = 0{,}25 = 25\\,\\%$. Nämnaren 100 är bryggan: procent är hundradelar.", visual: { type: "decimalgrid", hundredths: 25 } },
    { heading: "Procent → decimaltal", body: "Dela med 100 – siffrorna flyttar två platser åt höger: $35\\,\\% = 0{,}35$, $7\\,\\% = 0{,}07$, $150\\,\\% = 1{,}5$. Tillbaka: gånger 100." },
    { heading: "Bråk → procent", body: "Förläng till nämnare 100: $\\frac{3}{5} = \\frac{60}{100} = 60\\,\\%$. Går det inte att förlänga ($\\frac{1}{8}$) dividerar vi: $1 \\div 8 = 0{,}125 = 12{,}5\\,\\%$." },
    { heading: "Tabellen att kunna", body: "$\\frac{1}{2} = 50\\,\\%$, $\\frac{1}{4} = 25\\,\\%$, $\\frac{3}{4} = 75\\,\\%$, $\\frac{1}{5} = 20\\,\\%$, $\\frac{1}{10} = 10\\,\\%$, $\\frac{1}{20} = 5\\,\\%$, $\\frac{1}{100} = 1\\,\\%$, $1 = 100\\,\\%$.", visual: { type: "percentbar", pct: 75, label: "3/4 = 75 %" } },
  ],
  worked: [
    { title: "Bråk till procent", problem: "Skriv 3/5 som procent.", steps: [{ text: "Förläng till nämnare 100: 5 · 20 = 100.", math: "\\frac{3 \\cdot 20}{5 \\cdot 20} = \\frac{60}{100}" }, { text: "60 hundradelar är:", math: "60\\,\\%" }], why: "Procent är hundradelar, så vi vill ha nämnaren 100.", alternative: "$3 \\div 5 = 0{,}6 = 60\\,\\%$." },
    { title: "Procent till decimaltal och bråk", problem: "Skriv 35 % som decimaltal och som bråk i enklaste form.", steps: [{ text: "Decimaltal: dela med 100.", math: "35\\,\\% = 0{,}35" }, { text: "Bråk: 35 hundradelar, förkorta med 5.", math: "\\frac{35}{100} = \\frac{7}{20}" }], why: "35 av 100, och 35 och 100 har faktorn 5 gemensam.", alternative: "Pengar: 35 öre av 100 öre." },
  ],
  drawing: { task: "Rita ett hundrarutnät och färga 1/4 av det. Hur många rutor är det? Skriv det som bråk, decimaltal och procent.", tool: "hundredgrid" },
  pupils: [{ pupil: "Elias", said: "25 % är 1/25, för 25 står ju nedtill.", misconception: "Läser procenttalet som nämnare i stället för täljare över 100.", response: "Visa att 25 % = 25/100 och förkorta med 25: 1/4. Rita ett rutnät: 25 rutor av 100 = en fjärdedel." }],
  knowledge: [
    { id: "pctToDec", skill: "w7-l2.to-decimal", gen: (rng, { level }) => { const p = rng.pick(level > 1 ? [7, 35, 62, 150, 5, 120, 85] : [7, 35, 62, 5, 85, 12, 48]); return numeric(`pd-${p}`, "w7-l2.to-decimal", `${pc(p)} = ? (Skriv som decimaltal.)`, dcAcc(p, 2), `${p} % = ${p}/100 = ${dc(p, 2)}.`, ["Dela med 100."]); } },
    { id: "decToPct", skill: "w7-l2.from-decimal", gen: (rng) => { const p = rng.pick([6, 15, 40, 55, 70, 9, 83, 20, 35]); return numeric(`dp-${p}`, "w7-l2.from-decimal", `${dc(p, 2)} = ? %`, p, `${dc(p, 2)} = ${p}/100 = ${p} %.`, ["Gånger 100."]); } },
    { id: "fracToPct", skill: "w7-l2.fraction", gen: (rng) => { const [n, d, p] = rng.pick(TRIPLES.filter(([, dd]) => dd !== 100)); return numeric(`fp-${n}-${d}`, "w7-l2.fraction", `${n}/${d} = ? %`, p, `${n}/${d} = ${p}/100 = ${p} %.`, ["Förläng till nämnare 100."]); } },
    { id: "pctToFrac", skill: "w7-l2.to-fraction", gen: (rng) => { const [n, d, p] = rng.pick(TRIPLES.filter(([, dd]) => dd !== 100 && dd !== 1)); return mc(`pf-${p}`, "w7-l2.to-fraction", `Vilket bråk är lika med ${pc(p)}?`, m(n, d), [{ text: m(1, p), note: p === 25 ? "Det är en tjugofemtedel (4 %) – inte 25 %." : "Procenttalet är täljaren över 100, inte nämnaren." }, { text: m(p, 10) }, { text: m(100, p) }], `${p} % = ${p}/100 = ${n}/${d}.`, ["Skriv " + p + "/100 och förkorta."], rng); } },
    { id: "tripleMc", skill: "w7-l2.triple", gen: (rng) => { const [n, d, p] = rng.pick(TRIPLES.filter(([, dd]) => dd <= 25)); const right = `${dc(p, 2)} = ${pc(p)}`; const cands = [`${dc(n * 10, 2)} = ${pc(n * 10)}`, `${dc(Math.round(100 / d), 2)} = ${pc(Math.round(100 / d))}`, `${dc(d, 2)} = ${pc(d)}`, `${dc(p * 2, 2)} = ${pc(p * 2)}`].filter((t) => t !== right); return mc(`tr-${p}`, "w7-l2.triple", `Vilket av följande är lika med ${m(n, d)}?`, right, cands.map((text, i) => ({ text, note: i === 0 ? "Du har tagit täljaren som tiondelar." : undefined })), `${n}/${d} = ${dc(p, 2)} = ${p} %.`, ["Förläng till hundradelar."], rng); } },
    { id: "over100", skill: "w7-l2.over-100", gen: (rng) => { const p = rng.pick([120, 150, 200, 250, 175]); return numeric(`o1-${p}`, "w7-l2.over-100", `${pc(p)} = ? (Skriv som decimaltal.)`, dcAcc(p, 2), `${p} % = ${p}/100 = ${dc(p, 2)}. Mer än en hel.`, ["Dela med 100."]); } },
  ],
  method: [
    { id: "extend", skill: "w7-l2.fraction", gen: (rng) => { const [n, d, p] = rng.pick(TRIPLES.filter(([, dd]) => dd !== 100 && 100 % dd === 0)); return multifield(`ex-${n}-${d}`, "w7-l2.fraction", `Skriv ${n}/${d} som procent genom att förlänga.`, [{ label: `Förlängningstal (${d} · □ = 100)`, accept: [100 / d] }, { label: "Ny täljare", accept: [p] }, { label: "Procent", accept: [p] }], `${n}/${d} = ${p}/100 = ${p} %.`, ["Vilket tal gånger " + d + " är 100?"]); } },
    { id: "tripleFill", skill: "w7-l2.triple", gen: (rng) => { const p = rng.pick([30, 35, 45, 60, 65, 85, 12, 8]); const g = gcd(p, 100); return multifield(`tf-${p}`, "w7-l2.triple", `Skriv ${pc(p)} på tre sätt.`, [{ label: "Hundradelar (täljare)", accept: [p] }, { label: "Decimaltal", accept: dcAcc(p, 2) }, { label: "Enklaste bråk (t.ex. 7/20)", accept: [`${p / g}/${100 / g}`] }], `${p} % = ${p}/100 = ${dc(p, 2)} = ${p / g}/${100 / g}.`, []); } },
  ],
  representation: [
    { id: "markFraction", skill: "w7-l2.numberline", gen: (rng) => { const [n, d, p] = rng.pick(TRIPLES.filter(([, dd, pp]) => dd !== 100 && pp % 5 === 0)); return numberlineEx(`mf-${n}-${d}`, "w7-l2.numberline", `Markera ${m(n, d)} på tallinjen (procent).`, p, { min: 0, max: 100, step: 5, labelEvery: 25, unit: "%" }, `${n}/${d} = ${p} %.`, ["Hur många procent är det?"]); } },
    { id: "barToFrac", skill: "w7-l2.bar", gen: (rng) => { const p = rng.pick([20, 25, 40, 50, 60, 75, 80]); const g = gcd(p, 100); return withVisual(multifield(`bt-${p}`, "w7-l2.bar", "Stapeln står för 1 hel. Vilken procent, vilket decimaltal och vilket bråk (enklaste form) är det färgade?", [{ label: "Procent", accept: [p] }, { label: "Decimaltal", accept: dcAcc(p, 2) }, { label: "Bråk (t.ex. 3/4)", accept: [`${p / g}/${100 / g}`] }], `${p} % = ${dc(p, 2)} = ${p / g}/${100 / g}.`, []), { type: "percentbar", pct: p }); } },
  ],
  teacher: {
    title: "25 % är inte 1/25",
    scenarios: ["Elias (åk 5) skriver att 25 % är 1/25 och att 50 % är 1/50: \"Procenttalet är ju nedre delen.\""],
    prompt: "Förklara för Elias vad 25 % egentligen är som bråk, och varför 1/25 är något annat. Visa hur du kan använda ett hundrarutnät, och vad 1/25 blir i procent.",
    minChars: 170,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "hundra", label: "att 25 % är 25/100", any: ["25/100", "25 av 100", "25 hundradelar", "av hundra"] },
        { id: "fjard", label: "förkortning till 1/4 (en fjärdedel)", any: ["1/4", "fjärdedel", "förkorta"] },
        { id: "ruta", label: "ett rutnät (25 rutor av 100, fyra lika delar)", any: ["rutnät", "rutor", "fyra lika", "4 lika", "rita"] },
        { id: "fel", label: "att 1/25 är 4 % (eller en tjugofemtedel)", any: ["4 %", "4 procent", "tjugofemtedel", "1/25 är", "1/25 = 4"] },
        { id: "nam", label: "att procenttalet är täljaren över 100", any: ["täljare", "över 100", "nämnaren är 100", "nämnare 100"] },
      ],
    },
    modelAnswer: "Elias, procent betyder av hundra. 25 % är alltså 25/100 – procenttalet är täljaren och nämnaren är 100. Förkortar vi med 25 får vi 1/4, en fjärdedel. Rita ett hundrarutnät och dela det i fyra lika delar: varje del har 25 rutor, alltså 25 %. 1/25 är något helt annat: en tjugofemtedel, som är 4/100 eller 4 %. Så 25 % = 1/4, och 1/25 = 4 %.",
  },
};

// ───────── Lektion 3: Vanliga procent i huvudet ─────────
export const lesson3: Lesson = {
  id: "w7-l3", worldId: "w7", title: "Vanliga procent i huvudet", grades: "åk 4–6",
  summary: "10 %, 50 %, 25 %, 20 %, 5 % och 1 % – bygg alla andra procent av dem.",
  lgr: "Tal i procentform; metoder för beräkningar vid huvudräkning; rimlighetsbedömning",
  objectives: ["Räkna 10 %, 50 %, 25 %, 75 %, 20 %, 5 % och 1 % av ett tal i huvudet.", "Bygga andra procenttal av de enkla (35 % = 3 · 10 % + 5 %).", "Förklara varför strategierna fungerar."],
  intro: "Procent av ett tal kan räknas ”hårt” med formler – men de flesta vardagliga procent går att räkna i huvudet om du kan **några få byggstenar**. Den som behärskar $10\\,\\%$, $50\\,\\%$ och $1\\,\\%$ kan bygga nästan vad som helst. Och byggstenarna är bara division.",
  theory: [
    { heading: "Byggstenarna", body: "- $50\\,\\% = \\frac{1}{2}$ → dela med 2\n\n- $25\\,\\% = \\frac{1}{4}$ → dela med 4\n\n- $10\\,\\% = \\frac{1}{10}$ → dela med 10\n\n- $1\\,\\% = \\frac{1}{100}$ → dela med 100\n\n- $20\\,\\% = 2 \\cdot 10\\,\\%$, $75\\,\\% = 3 \\cdot 25\\,\\%$, $5\\,\\% = \\frac{1}{2} \\cdot 10\\,\\%$", visual: { type: "doublenumberline", total: 80, unit: "kr", marks: [{ pct: 10 }, { pct: 25 }, { pct: 50 }] } },
    { heading: "Bygg andra procent", body: "$35\\,\\%$ av 200: $10\\,\\% = 20$, så $30\\,\\% = 60$; $5\\,\\% = 10$. Tillsammans $60 + 10 = 70$. Tänk i *bitar* du kan: $35 = 30 + 5$." },
    { heading: "5 % är inte ”dela med 5”", body: "$5\\,\\%$ är $\\frac{5}{100}$ – en tjugondel – inte en femtedel. Dela med 20, eller ta hälften av $10\\,\\%$. ”Dela med procenttalet” är ett vanligt (och fel) minnesknep." },
    { heading: "Kolla rimligheten", body: "Under $100\\,\\%$ ska svaret vara *mindre* än helheten. $5\\,\\%$ av 80 är 4 – inte 16." },
  ],
  worked: [
    { title: "Bygga 35 %", problem: "Beräkna 35 % av 240 kr.", steps: [{ text: "10 % av 240.", math: "240 \\div 10 = 24" }, { text: "30 % = 3 · 10 %, och 5 % är hälften av 10 %.", math: "30\\,\\% = 72,\\quad 5\\,\\% = 12" }, { text: "Lägg ihop.", math: "72 + 12 = 84" }], why: "$35\\,\\% = 30\\,\\% + 5\\,\\%$ – procent kan läggas ihop eftersom de är delar av samma helhet.", alternative: "$25\\,\\% + 10\\,\\% = 60 + 24 = 84$." },
    { title: "75 %", problem: "Beräkna 75 % av 80.", steps: [{ text: "25 % = en fjärdedel.", math: "80 \\div 4 = 20" }, { text: "75 % = 3 fjärdedelar.", math: "3 \\cdot 20 = 60" }], why: "$75\\,\\% = \\frac{3}{4}$.", alternative: "Hela minus 25 %: $80 - 20 = 60$." },
  ],
  drawing: { task: "Rita en dubbel tallinje: övre linjen 0 %–100 %, nedre linjen 0–200 kr. Markera 10 %, 25 % och 50 % och skriv beloppen.", tool: "numberline" },
  pupils: [{ pupil: "Axel", said: "5 % av 80 är 80 ÷ 5 = 16. Man delar ju med procenttalet.", misconception: "Delar med procenttalet i stället för att tänka 5/100.", response: "Fråga: ”Hur mycket är 10 % av 80? Är 5 % mer eller mindre än 10 %?” 10 % = 8, 5 % = 4. 16 är 20 %." }],
  knowledge: [
    { id: "tenPct", skill: "w7-l3.ten", gen: (rng) => { const N = rng.int(3, 60) * 10; return numeric(`t-${N}`, "w7-l3.ten", `10 % av ${sv(N)} = ?`, N / 10, `${sv(N)} ÷ 10 = ${N / 10}.`, ["10 % = en tiondel."]); } },
    { id: "half", skill: "w7-l3.half", gen: (rng) => { const N = rng.int(4, 90) * 2; return numeric(`h-${N}`, "w7-l3.half", `50 % av ${sv(N)} = ?`, N / 2, `Hälften: ${N / 2}.`, ["50 % = hälften."]); } },
    { id: "quarter", skill: "w7-l3.quarter", gen: (rng) => { const N = rng.int(3, 40) * 4; const three = rng.chance(0.5); return numeric(`q-${N}-${three}`, "w7-l3.quarter", `${three ? 75 : 25} % av ${N} = ?`, three ? (3 * N) / 4 : N / 4, three ? `75 % = 3 fjärdedelar: 3 · ${N / 4} = ${(3 * N) / 4}.` : `${N} ÷ 4 = ${N / 4}.`, ["25 % = en fjärdedel."]); } },
    { id: "twenty", skill: "w7-l3.twenty", gen: (rng) => { const N = rng.int(2, 40) * 10; return numeric(`tw-${N}`, "w7-l3.twenty", `20 % av ${N} = ?`, N / 5, `10 % = ${N / 10}, så 20 % = ${N / 5}.`, ["20 % = 2 · 10 %."]); } },
    { id: "five", skill: "w7-l3.five", gen: (rng) => { const N = rng.int(2, 30) * 20; return numeric(`fv-${N}`, "w7-l3.five", `5 % av ${N} = ?`, N / 20, `10 % = ${N / 10}, hälften är ${N / 20}.`, ["5 % = hälften av 10 %."]); } },
    { id: "one", skill: "w7-l3.one", gen: (rng) => { const k = rng.int(3, 90); return numeric(`on-${k}`, "w7-l3.one", `1 % av ${sv(k * 100)} = ?`, k, `${sv(k * 100)} ÷ 100 = ${k}.`, ["1 % = en hundradel."]); } },
    { id: "buildMc", skill: "w7-l3.strategy", gen: (rng) => { const N = rng.int(2, 15) * 20; return mc(`bm-${N}`, "w7-l3.strategy", `Hur kan du räkna 5 % av ${N} i huvudet?`, `Ta 10 % (${N / 10}) och halvera`, [{ text: `Dela ${N} med 5`, note: "Det vore 20 %, inte 5 %." }, { text: `Multiplicera ${N} med 5` }, { text: `Dubbla 10 % (${N / 10})`, note: "Dubbelt av 10 % är 20 %." }], `5 % är hälften av 10 %: ${N / 10} ÷ 2 = ${N / 20}.`, ["Hur många procent är 5 jämfört med 10?"], rng); } },
    { id: "builtNumeric", skill: "w7-l3.build", gen: (rng) => { const N = rng.int(2, 20) * 20; const k = rng.pick([3, 4, 6, 7]); return numeric(`bn-${N}-${k}`, "w7-l3.build", `10 % av ${N} är ${N / 10}. Hur mycket är ${k * 10} %?`, k * (N / 10), `${k} · ${N / 10} = ${k * (N / 10)}.`, ["Hur många 10 %?"]); } },
  ],
  method: [
    { id: "buildSteps", skill: "w7-l3.build", gen: (rng) => { const N = rng.int(2, 20) * 20; const k = rng.int(2, 9); const extra = rng.pick([5, 0]); const p = k * 10 + extra; return multifield(`bs-${N}-${p}`, "w7-l3.build", `Räkna ${p} % av ${N} genom att bygga av 10 %.`, [{ label: "10 %", accept: [N / 10] }, { label: `${k * 10} %`, accept: [k * (N / 10)] }, ...(extra ? [{ label: "5 %", accept: [N / 20] }] : []), { label: `${p} %`, accept: [pctOf(p, N)] }], `${k * 10} % = ${k * (N / 10)}${extra ? `, 5 % = ${N / 20}` : ""}; ${p} % = ${pctOf(p, N)}.`, ["Dela med 10 först."]); } },
    { id: "fifteen", skill: "w7-l3.build", gen: (rng) => { const N = rng.int(2, 20) * 20; return multifield(`ft-${N}`, "w7-l3.build", `Räkna 15 % av ${N}: 15 % = 10 % + 5 %.`, [{ label: "10 %", accept: [N / 10] }, { label: "5 %", accept: [N / 20] }, { label: "15 %", accept: [pctOf(15, N)] }], `${N / 10} + ${N / 20} = ${pctOf(15, N)}.`, []); } },
  ],
  representation: [
    { id: "doubleLineFind", skill: "w7-l3.doubleline", gen: (rng) => { const p = rng.pick([10, 25, 50, 75, 20]); const N = baseFor(p, rng.int(2, 8) * 2); return withVisual(numeric(`dl-${p}-${N}`, "w7-l3.doubleline", `På den dubbla tallinjen motsvarar 100 % hela beloppet. Hur mycket är ${pc(p)}?`, pctOf(p, N), `${p} % av ${N} = ${pctOf(p, N)}.`, ["Bygg av 10 %, 25 % eller 50 %."], "kr"), { type: "doublenumberline", total: N, unit: "kr", marks: [{ pct: p, showAmount: false }] }); } },
    { id: "shade25", skill: "w7-l3.shade", gen: (rng) => { const p = rng.pick([10, 20, 25, 30, 40, 50, 60, 70, 75, 80]); return gridshadeEx(`s-${p}`, "w7-l3.shade", `Färglägg ${pc(p)} av rutnätet. Tänk: hur många rader av 10 rutor?`, p, `${p} % = ${p} rutor.`, ["10 % = en rad."]); } },
  ],
  teacher: {
    title: "5 % är inte ”dela med 5”",
    scenarios: ["Axel (åk 6) räknar 5 % av 80 genom att göra 80 ÷ 5 = 16. Han förklarar: \"Man delar alltid med procenttalet.\""],
    prompt: "Visa Axel hur han kan upptäcka att 16 är orimligt och hur man räknar 5 % av 80 i huvudet. Förklara vad 80 ÷ 5 egentligen ger i procent.",
    minChars: 170,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "tio", label: "10 % av 80 är 8", any: ["10 % av 80", "10 procent av 80", "8"] },
        { id: "halv", label: "5 % är hälften av 10 % = 4", any: ["hälften", "halvera", "4"] },
        { id: "tjugo", label: "att 80 ÷ 5 = 16 är 20 %", any: ["20 %", "20 procent", "en femtedel"] },
        { id: "rimlig", label: "rimlighet: 5 % ska vara mindre än 10 %", any: ["mindre än 10", "rimlig", "orimlig", "mer än 10 %", "större än 8"] },
        { id: "bruk", label: "att 5 % = 5/100 (en tjugondel)", any: ["5/100", "tjugondel", "dela med 20", "per hundra"] },
      ],
    },
    modelAnswer: "Axel, räkna först 10 % av 80: det är 80 ÷ 10 = 8. 5 % är mindre än 10 %, så svaret måste vara mindre än 8 – då kan 16 inte stämma. 5 % är hälften av 10 %, alltså 4. Det du räknade, 80 ÷ 5 = 16, är en femtedel av 80 och motsvarar 20 %. 5 % är 5/100, en tjugondel, så du kan också dela med 20. Dela inte med procenttalet – tänk i hundradelar och bygg av 10 %.",
  },
};

// ───────── Lektion 4: Procent av ett tal ─────────
export const lesson4: Lesson = {
  id: "w7-l4", worldId: "w7", title: "Procent av ett tal", grades: "åk 4–6",
  summary: "35 % av 240 – tre metoder: bygga, via 1 % och med decimaltal.",
  lgr: "Tal i procentform; metoder för beräkningar med enkla tal i decimalform; proportionalitet uttryckt i procentform",
  objectives: ["Beräkna p % av ett tal med flera metoder.", "Förklara varför man dividerar med 100.", "Kontrollera med rimlighet."],
  intro: "$35\\,\\%$ av 240 – hur många sätt kan du räkna det på? **Alla tre bygger på att $35\\,\\% = \\frac{35}{100} = 0{,}35$.** I den här lektionen gör vi metoderna medvetna, så att du kan välja den som passar talen – och så att du kan se vad som är fel när ett svar blir orimligt.",
  theory: [
    { heading: "Metod 1: via 1 %", body: "$1\\,\\%$ av 240 $= 240 \\div 100 = 2{,}4$. Då är $35\\,\\% = 35 \\cdot 2{,}4 = 84$. Först *ett* procent, sedan så många procent du vill.", visual: { type: "doublenumberline", total: 240, unit: "kr", marks: [{ pct: 35, showAmount: true }] } },
    { heading: "Metod 2: decimaltal", body: "$35\\,\\% = 0{,}35$, och ”av” betyder gånger: $0{,}35 \\cdot 240 = 84$. (Räkna $35 \\cdot 240 = 8\\,400$ och dela med 100.)" },
    { heading: "Metod 3: bygg av 10 %", body: "$10\\,\\% = 24$, $30\\,\\% = 72$, $5\\,\\% = 12$, tillsammans $84$. Bäst när procenten är ”snälla”." },
    { heading: "Rimlighet", body: "$35\\,\\%$ av 240 är mer än $25\\,\\%$ (60) och mindre än $50\\,\\%$ (120). 84 ligger där – 8 400 gör det inte." },
  ],
  worked: [
    { title: "Via 1 %", problem: "Beräkna 12 % av 500.", steps: [{ text: "1 % av 500:", math: "500 \\div 100 = 5" }, { text: "12 % = 12 · 5:", math: "60" }], why: "$12\\,\\%$ är 12 av 100 lika stora delar, och varje del är 5.", alternative: "$0{,}12 \\cdot 500 = 60$." },
    { title: "Med decimaltal", problem: "Beräkna 35 % av 240.", steps: [{ text: "Procent till decimaltal.", math: "35\\,\\% = 0{,}35" }, { text: "Gånger helheten.", math: "0{,}35 \\cdot 240 = 84" }, { text: "Rimlighet: mellan 25 % (60) och 50 % (120).", math: "60 < 84 < 120" }], why: "Av betyder gånger, och 0,35 är andelen.", alternative: "$35 \\cdot 240 = 8\\,400$, dela med 100: 84." },
  ],
  drawing: { task: "Rita en procentstapel för 240 kr. Markera 10 %, 25 % och 35 % och skriv hur många kronor varje del är.", tool: "numberline" },
  pupils: [{ pupil: "Nils", said: "35 % av 240: 35 · 240 = 8 400. ’Av’ betyder ju gånger.", misconception: "Multiplicerar med procenttalet utan att dividera med 100.", response: "Fråga: ”Kan 35 % av 240 kr vara mer än 240 kr?” Visa att 35 % = 0,35 eller 35/100 och att svaret ska vara mindre än helheten." }],
  knowledge: [
    { id: "pctOfN", skill: "w7-l4.pct-of", gen: (rng, { level }) => { const p = rng.pick(level > 1 ? [12, 15, 35, 45, 65, 8, 55, 95] : [12, 15, 35, 45, 65, 8]); const { N, part } = pb(rng, p); return numeric(`po-${p}-${N}`, "w7-l4.pct-of", `${pc(p)} av ${sv(N)} = ?`, part, `${sv(N)} ÷ 100 = ${N / 100}, ${p} · ${N / 100} = ${part}.`, ["Räkna 1 % först."]); } },
    { id: "expressionMc", skill: "w7-l4.expression", gen: (rng) => { const p = rng.pick([12, 35, 45, 65]); const N = rng.int(2, 9) * 100 + rng.pick([0, 40, 60]); return mc(`ex-${p}-${N}`, "w7-l4.expression", `Vilket uttryck är lika med ${pc(p)} av ${N}?`, `${dc(p, 2).replace(/0$/, "")} · ${N}`.replace(/^0,0/, "0,0"), [{ text: `${p} · ${N}`, note: "Du har glömt att dela med 100." }, { text: `${N} ÷ ${dc(p, 2).replace(/0$/, "")}` }, { text: `${p} ÷ ${N}` }], `${p} % = ${dc(p, 2)}, och av betyder gånger.`, ["Procent som decimaltal."], rng); } },
    { id: "reasonable", skill: "w7-l4.reasonable", gen: (rng) => { const p = rng.pick([30, 35, 45, 60]); const N = rng.int(2, 9) * 100; const r = pctOf(p, N); return mc(`rs-${p}-${N}`, "w7-l4.reasonable", `Vilket svar är rimligt för ${pc(p)} av ${N}?`, sv(r), [{ text: sv(r * 10), note: "Det är mer än helheten – orimligt." }, { text: sv(r / 10), note: "Tio gånger för litet." }, { text: sv(N + r), note: "Mer än helheten." }], `${p} % är en andel av ${N}: ${r}.`, ["Ska svaret vara större eller mindre än " + N + "?"], rng); } },
    { id: "decimalWay", skill: "w7-l4.decimal", gen: (rng) => { const p = rng.pick([12, 35, 45, 65, 85, 55]); const { N, part } = pb(rng, p, 2, 9); return numeric(`dw-${p}-${N}`, "w7-l4.decimal", `${dc(p, 2)} · ${sv(N)} = ?`, part, `${dc(p, 2)} = ${p} %, så svaret är ${p} % av ${sv(N)} = ${part}.`, ["Det är samma som " + p + " % av " + sv(N) + "."]); } },
    { id: "over100", skill: "w7-l4.over-100", gen: (rng) => { const p = rng.pick([150, 120, 200, 125, 175]); const N = baseFor(p, rng.int(2, 8)); return numeric(`ov-${p}-${N}`, "w7-l4.over-100", `${pc(p)} av ${N} = ?`, pctOf(p, N), `${p} % är mer än en hel: ${pctOf(p, N)}.`, ["Över 100 % är mer än helheten."]); } },
  ],
  method: [
    { id: "viaOne", skill: "w7-l4.via-one", gen: (rng) => { const p = rng.pick([12, 15, 35, 45, 65, 8, 55]); const k = rng.int(2, 12); const N = k * 100; return multifield(`v1-${p}-${k}`, "w7-l4.via-one", `Räkna ${p} % av ${N} via 1 %.`, [{ label: "1 %", accept: [k] }, { label: `${p} %`, accept: [p * k] }], `1 % = ${k}; ${p} % = ${p} · ${k} = ${p * k}.`, ["1 % = en hundradel."]); } },
    { id: "viaDecimal", skill: "w7-l4.decimal", gen: (rng) => { const p = rng.pick([12, 35, 45, 65, 85, 55]); const { N, part } = pb(rng, p, 2, 9); return multifield(`vd-${p}-${N}`, "w7-l4.decimal", `Räkna ${p} % av ${sv(N)} med decimaltal.`, [{ label: `${p} % som decimaltal`, accept: dcAcc(p, 2) }, { label: `Decimaltalet · ${sv(N)}`, accept: [part] }, { label: "Rimligt? (1 = ja)", accept: [1] }], `${dc(p, 2)} · ${sv(N)} = ${part}.`, []); } },
  ],
  representation: [
    { id: "doubleFind", skill: "w7-l4.doubleline", gen: (rng) => { const p = rng.pick([12, 15, 35, 45, 65]); const k = rng.int(2, 9); const N = k * 100; return withVisual(numeric(`df-${p}-${N}`, "w7-l4.doubleline", `Dubbel tallinje: hela beloppet är ${N} kr (100 %). Hur mycket är ${pc(p)}?`, p * k, `1 % = ${k} kr, ${p} % = ${p * k} kr.`, ["Räkna 1 % först."], "kr"), { type: "doublenumberline", total: N, unit: "kr", marks: [{ pct: p, showAmount: false }] }); } },
    { id: "barAmount", skill: "w7-l4.bar", gen: (rng) => { const p = rng.pick([20, 40, 60, 80, 30, 70]); const N = baseFor(p, rng.int(2, 8) * 5); return withVisual(numeric(`ba-${p}-${N}`, "w7-l4.bar", `Hela stapeln är ${N} kr. Det färgade är ${pc(p)}. Hur många kronor är det?`, pctOf(p, N), `${p} % av ${N} = ${pctOf(p, N)}.`, [], "kr"), { type: "percentbar", pct: p, label: `${p} %` }); } },
  ],
  teacher: {
    title: "”Av” är gånger – men gånger vad?",
    scenarios: ["Nils (åk 6) räknar 35 % av 240 som 35 · 240 = 8 400 och är nöjd: \"Av betyder gånger.\" Han har inte reagerat på att svaret är mycket större än 240."],
    prompt: "Förklara för Nils vad som saknas i hans beräkning, hur man räknar 35 % av 240 på minst ett riktigt sätt, och hur han kan upptäcka att 8 400 är orimligt.",
    minChars: 170,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "hundra", label: "att dela med 100 / 35 % = 0,35 eller 35/100", any: ["dela med 100", "delat med 100", "0,35", "35/100", "hundradelar"] },
        { id: "svar", label: "rätt svar 84", any: ["84"] },
        { id: "rimlig", label: "rimlighet: mindre än 240 / 100 % är 240", any: ["mindre än 240", "större än 240", "orimlig", "rimlig", "mer än helheten", "mer än 240", "inte vara mer"] },
        { id: "metod", label: "en metod (1 %, 10 % eller decimaltal)", any: ["1 %", "10 %", "2,4", "24", "decimaltal"] },
        { id: "andel", label: "att 35 % är en andel (35 av 100)", any: ["andel", "35 av 100", "av hundra", "del av"] },
      ],
    },
    modelAnswer: "Nils, 35 % betyder 35 av 100, alltså 35/100 = 0,35. Därför räknar du 0,35 · 240 = 84, eller så tar du 35 · 240 = 8 400 och delar med 100. Du glömde att dela med 100. Du kan också räkna 1 % = 240 ÷ 100 = 2,4 och 35 · 2,4 = 84, eller bygga av 10 % = 24. Ett överslag avslöjar felet: 100 % är hela 240, så 35 % måste vara mindre än 240. Svaret 8 400 är orimligt, och 84 är rimligt – mellan 25 % (60) och 50 % (120).",
  },
};

// ───────── Lektion 5: Proportionalitet ─────────
export const lesson5: Lesson = {
  id: "w7-l5", worldId: "w7", title: "Dubbel tallinje och proportionalitet", grades: "åk 4–6",
  summary: "Procent växer i takt med beloppet: dubbla procenten, dubbla beloppet.",
  lgr: "Proportionalitet samt hur proportionella samband uttrycks i bråk-, decimal- och procentform",
  objectives: ["Använda dubbel tallinje för att resonera om procent.", "Förstå att procent och belopp är proportionella (multiplikativt, inte additivt).", "Räkna ut helheten eller andra procent när en procent är känd."],
  intro: "Om $10\\,\\%$ av ett tal är 8 – hur mycket är $20\\,\\%$? $18$? Nej: $16$. **Dubbelt så många procent ger dubbelt så mycket.** Det är idén om *proportionalitet*, och den är hjärtat i all procentlära. Den dubbla tallinjen gör den synlig.",
  theory: [
    { heading: "Dubbel tallinje", body: "Den övre linjen visar procent (0–100 %), den undre visar beloppet (0–helheten). Samma avstånd på linjerna hör ihop: halva sträckan är 50 % och halva beloppet.", visual: { type: "doublenumberline", total: 80, unit: "kr", marks: [{ pct: 10 }, { pct: 20 }, { pct: 50 }] } },
    { heading: "Multiplicera – lägg inte till", body: "Går vi från $10\\,\\%$ till $20\\,\\%$ *multiplicerar* vi med 2, och beloppet också: $8 \\to 16$. Man lägger **inte** till 10 till beloppet. Additivt tänkande ($8 + 10 = 18$) är det vanligaste proportionalitetsfelet." },
    { heading: "Hitta andra procent", body: "Känd: $10\\,\\% = 8$. Då $30\\,\\% = 3 \\cdot 8 = 24$, $50\\,\\% = 5 \\cdot 8 = 40$, $100\\,\\% = 10 \\cdot 8 = 80$." },
    { heading: "Hitta helheten", body: "Känd: $25\\,\\% = 15$. $25\\,\\%$ går 4 gånger på $100\\,\\%$, så helheten är $4 \\cdot 15 = 60$. Det är samma tankesätt baklänges." },
  ],
  worked: [
    { title: "Skala upp", problem: "10 % av ett tal är 8. Hur mycket är 30 %?", steps: [{ text: "30 % är 3 gånger så mycket som 10 %.", math: "30 \\div 10 = 3" }, { text: "Beloppet blir 3 gånger så stort.", math: "3 \\cdot 8 = 24" }], why: "Procent och belopp är proportionella – samma faktor på båda linjerna.", alternative: "Dubbel tallinje: 10 % → 8, 20 % → 16, 30 % → 24." },
    { title: "Hitta helheten", problem: "20 % av ett tal är 12. Vilket är talet?", steps: [{ text: "100 % är 5 gånger så mycket som 20 %.", math: "100 \\div 20 = 5" }, { text: "Beloppet blir 5 gånger så stort.", math: "5 \\cdot 12 = 60" }, { text: "Kontroll:", math: "20\\,\\%\\ \\text{av}\\ 60 = 12" }], why: "Vi går uppåt på linjerna med samma faktor.", alternative: "10 % = 6, 100 % = 60." },
  ],
  drawing: { task: "Rita en dubbel tallinje (0–100 % ovanför, 0–60 kr nedanför). Markera 10 %, 20 % och 50 %. Om 10 % är 6 kr, vad är de andra?", tool: "numberline" },
  pupils: [{ pupil: "Vera", said: "10 % är 8, så 20 % är 18. Det är ju 10 mer både uppe och nere.", misconception: "Additivt tänkande: lägger till samma tal i stället för att multiplicera.", response: "Rita dubbel tallinje: dubbla procenten, dubbla beloppet. 20 % är 2 · 10 % = 16." }],
  knowledge: [
    { id: "scaleUp", skill: "w7-l5.scale", gen: (rng) => { const a = rng.int(3, 20), k = rng.pick([2, 3, 4, 5, 6, 7, 8]); return numeric(`su-${a}-${k}`, "w7-l5.scale", `10 % av ett tal är ${a}. Hur mycket är ${k * 10} %?`, k * a, `${k * 10} % = ${k} · 10 %: ${k} · ${a} = ${k * a}.`, ["Hur många 10 %?"]); } },
    { id: "wholeFrom", skill: "w7-l5.whole", gen: (rng) => { const p = rng.pick([5, 10, 20, 25, 50]); const part = rng.int(2, 15); return numeric(`wf-${p}-${part}`, "w7-l5.whole", `${pc(p)} av ett tal är ${part}. Vilket är talet?`, (100 / p) * part, `100 % är ${100 / p} gånger ${p} %: ${100 / p} · ${part} = ${(100 / p) * part}.`, ["Hur många " + p + " % går på 100 %?"]); } },
    { id: "otherPct", skill: "w7-l5.scale", gen: (rng) => { const p = rng.pick([10, 20, 25, 5]); const part = rng.int(2, 14); const k = rng.int(2, Math.floor(100 / p) - 1); return numeric(`op-${p}-${part}-${k}`, "w7-l5.scale", `${pc(p)} av ett tal är ${part}. Hur mycket är ${pc(p * k)} av samma tal?`, k * part, `${p * k} % = ${k} · ${p} %: ${k} · ${part} = ${k * part}.`, ["Hur många gånger större är procenten?"]); } },
    { id: "additiveMc", skill: "w7-l5.concept", gen: (rng) => { const a = rng.int(4, 12); return mc(`am-${a}`, "w7-l5.concept", `10 % av ett tal är ${a}. Hur mycket är 20 %?`, String(2 * a), [{ text: String(a + 10), note: "Du har lagt till 10 i stället för att multiplicera med 2." }, { text: String(a + 20) }, { text: String(a / 2) }], `20 % är dubbelt så mycket som 10 %: 2 · ${a} = ${2 * a}.`, ["Dubbelt så många procent ger dubbelt så mycket."], rng); } },
    { id: "halfWay", skill: "w7-l5.half", gen: (rng) => { const a = rng.int(2, 25) * 2; return numeric(`hw-${a}`, "w7-l5.half", `50 % av ett tal är ${a}. Hur mycket är 100 %?`, 2 * a, `100 % är dubbelt så mycket som 50 %.`, ["Hur många 50 % går på 100 %?"]); } },
  ],
  method: [
    { id: "tableFill", skill: "w7-l5.table", gen: (rng) => { const a = rng.int(3, 15); return multifield(`tb-${a}`, "w7-l5.table", `10 % av ett belopp är ${a} kr. Fyll i tabellen.`, [{ label: "20 %", accept: [2 * a] }, { label: "30 %", accept: [3 * a] }, { label: "50 %", accept: [5 * a] }, { label: "100 %", accept: [10 * a] }], `Alla är ett multipel av ${a}: ${2 * a}, ${3 * a}, ${5 * a}, ${10 * a}.`, ["Multiplicera, lägg inte till."]); } },
    { id: "wholeSteps", skill: "w7-l5.whole", gen: (rng) => { const p = rng.pick([20, 25, 50]); const part = rng.int(3, 18); return multifield(`ws-${p}-${part}`, "w7-l5.whole", `${p} % av ett tal är ${part}. Räkna ut hela talet i steg.`, [{ label: `Hur många ${p} % går på 100 %?`, accept: [100 / p] }, { label: "Hela talet", accept: [(100 / p) * part] }, { label: `Kontroll: ${p} % av hela talet`, accept: [part] }], `${100 / p} · ${part} = ${(100 / p) * part}.`, []); } },
  ],
  representation: [
    { id: "doubleWhole", skill: "w7-l5.doubleline", gen: (rng) => { const p = rng.pick([20, 25, 50]); const part = rng.int(4, 18); const N = (100 / p) * part; return withVisual(numeric(`dw-${p}-${part}`, "w7-l5.doubleline", `På den dubbla tallinjen motsvarar ${pc(p)} beloppet ${part} kr. Hur mycket motsvarar 100 %?`, N, `${100 / p} · ${part} = ${N}.`, ["Hur många gånger större är 100 % än " + p + " %?"], "kr"), { type: "doublenumberline", total: N, unit: "kr", hideTotal: true, marks: [{ pct: p, showAmount: true }] }); } },
    { id: "doubleOther", skill: "w7-l5.doubleline", gen: (rng) => { const a = rng.int(3, 14), q = rng.pick([30, 40, 60, 70]); const N = 10 * a; return withVisual(numeric(`do-${a}-${q}`, "w7-l5.doubleline", `10 % motsvarar ${a} kr. Hur mycket motsvarar ${pc(q)}?`, (q / 10) * a, `${q / 10} · ${a} = ${(q / 10) * a}.`, [], "kr"), { type: "doublenumberline", total: N, unit: "kr", hideTotal: true, marks: [{ pct: 10, showAmount: true }, { pct: q, showAmount: false }] }); } },
  ],
  teacher: {
    title: "Multiplicera, lägg inte till",
    scenarios: ["Vera (åk 6) vet att 10 % av ett tal är 8 och räknar 20 % som 8 + 10 = 18. \"Det är ju 10 mer procent, så 10 mer.\""],
    prompt: "Förklara för Vera varför 20 % av talet är 16 och inte 18. Använd en dubbel tallinje eller en tabell, och förklara vad som skiljer additivt från multiplikativt tänkande.",
    minChars: 170,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "dubbelt", label: "att 20 % är dubbelt så mycket som 10 %", any: ["dubbelt", "2 gånger", "två gånger", "2 · 8", "2·8"] },
        { id: "svar", label: "rätt svar 16", any: ["16"] },
        { id: "mult", label: "att man multiplicerar (inte adderar)", any: ["multiplicer", "gånger", "inte lägga till", "inte addera", "adderar inte"] },
        { id: "linje", label: "dubbel tallinje / tabell / proportionalitet", any: ["dubbel tallinje", "tallinje", "tabell", "proportion", "samma faktor"] },
        { id: "kontr", label: "kontroll (10 % → 8, 100 % → 80)", any: ["80", "100 %", "kontroll", "10 gånger"] },
      ],
    },
    modelAnswer: "Vera, 20 % är dubbelt så många procent som 10 %, så beloppet blir dubbelt så stort: 2 · 8 = 16. På en dubbel tallinje ligger 20 % dubbelt så långt från noll som 10 %, och det gäller både procent och belopp. Du ska multiplicera med samma faktor, inte lägga till samma tal. Kontrollera: 100 % är 10 gånger 10 %, alltså 80, och 20 % av 80 är 16. Additivt tänkande (8 + 10) fungerar inte här eftersom procent och belopp växer i samma förhållande.",
  },
};
