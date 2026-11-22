import type { Lesson } from "../types";
import { mc, numeric, multifield, withVisual, numberlineEx, dcAcc, dcTrim } from "@/lib/engine/gen-helpers";
import type { Rng } from "@/lib/engine/rng";
import { LEN, MASS, VOL, balanceConv, cmpEx, convEx, convSteps, signBalance, type U } from "./units";

const LEN2: U[] = LEN.filter((u) => u.n !== "dm");
const DOMAINS: U[][] = [LEN2, MASS, VOL];
const anyDomain = (rng: Rng) => rng.pick(DOMAINS);

// ───────── Lektion 7: Omvandling mellan enheter ─────────
const TRUE_S = ["1 km = 1 000 m", "1 kg = 1 000 g", "1 l = 1 000 ml", "1 m = 100 cm", "1 dl = 100 ml", "1 cm = 10 mm", "1 ton = 1 000 kg", "1 l = 10 dl"];
const FALSE_S = ["1 m = 10 cm", "1 l = 100 ml", "1 kg = 100 g", "1 km = 100 m", "1 dl = 10 ml", "1 ton = 100 kg", "1 cm = 100 mm", "1 l = 100 dl"];
const PREFIX: [string, string][] = [["kilo", "tusen gånger större"], ["deci", "tio gånger mindre"], ["centi", "hundra gånger mindre"], ["milli", "tusen gånger mindre"]];

export const lesson7: Lesson = {
  id: "w11-l7", worldId: "w11", title: "Omvandling mellan enheter – systematiskt", grades: "åk 4–6",
  summary: "Prefixen avgör faktorn. Större enhet → mindre tal. Mindre enhet → större tal.",
  lgr: "Enhetsbyten mellan enheter för längd, massa och volym",
  objectives: ["Använda prefixen kilo, deci, centi och milli.", "Byta mellan två enheter som ligger långt ifrån varandra.", "Kontrollera rimligheten genom att fråga: ska talet växa eller krympa?"],
  intro: "Du har bytt enhet inom längd, massa och volym. Nu samlar vi det i **en** metod som fungerar överallt. Tre frågor: (1) Vilken enhet är störst? (2) Hur många gånger större? (3) Ska talet **växa** eller **krympa**? Prefixen berättar svaret: *kilo* = 1 000, *deci* = $\\tfrac{1}{10}$, *centi* = $\\tfrac{1}{100}$, *milli* = $\\tfrac{1}{1000}$.",
  theory: [
    { heading: "Prefixen", body: "**kilo** 1 000 gånger större: 1 km = 1 000 m. **deci** tiondel: 1 dl = 0,1 l. **centi** hundradel: 1 cm = 0,01 m. **milli** tusendel: 1 mm = 0,001 m. Prefixen betyder samma sak för meter, gram och liter." },
    { heading: "Större enhet → mindre tal", body: "Måttet är detsamma, bara skrivet med en annan enhet. Går du till en **större** enhet behövs det **färre** av dem: $450\\ \\text{cm} = 4{,}5\\ \\text{m}$. Går du till en **mindre** enhet behövs **fler**: $2\\ \\text{kg} = 2\\,000\\ \\text{g}$.", visual: { type: "numberline", min: 0, max: 200, step: 10, labelEvery: 50, marks: [150], unit: "cm" } },
    { heading: "Flera steg på en gång", body: "$0{,}5\\ \\text{km}$ i cm: $0{,}5 \\cdot 1\\,000 = 500$ m, och $500 \\cdot 100 = 50\\,000$ cm. Faktorn är $1\\,000 \\cdot 100 = 100\\,000$. Du kan också flytta kommat lika många steg som antalet nollor i faktorn." },
    { heading: "Rimlighetskontroll", body: "Fråga alltid: *vilket håll* ska talet gå? Ett svar som $3{,}5\\ \\text{km} = 0{,}0035\\ \\text{m}$ är orimligt: en kilometer är en lång sträcka, och den kan inte vara mindre än en meter." },
  ],
  worked: [
    { title: "Två steg", problem: "Skriv om 0,5 km i cm.", steps: [{ text: "km → m: större enhet till mindre, talet växer.", math: "0{,}5 \\cdot 1\\,000 = 500" }, { text: "m → cm:", math: "500 \\cdot 100 = 50\\,000" }, { text: "Svar: 50 000 cm." }], why: "Varje steg är en tiopotens, och vi multiplicerar faktorerna.", alternative: "1 km = 100 000 cm, så hälften är 50 000 cm." },
    { title: "Åt andra hållet", problem: "Skriv om 3 450 g i kg.", steps: [{ text: "g → kg: större enhet, så talet krymper. Dela med 1 000.", math: "3\\,450 \\div 1\\,000 = 3{,}45" }], why: "Det går 1 000 g på 1 kg.", alternative: "3 000 g är 3 kg, 450 g är 0,45 kg." },
  ],
  drawing: { task: "Rita en tallinje 0–2 m med markeringar för varje dm. Markera 1,3 m. Hur många cm är det?", tool: "numberline" },
  pupils: [{ pupil: "Hampus", said: "3,5 km är 0,0035 m, för jag flyttade kommat tre steg.", misconception: "Flyttar kommat åt fel håll – mindre enhet ska ge större tal.", response: "Fråga: ”Är 3,5 km längre eller kortare än 1 m?” Då ska mätetalet i meter bli större: 3,5 · 1 000 = 3 500 m." }],
  knowledge: [
    { id: "convDown", skill: "w11-l7.convert", gen: (rng) => convEx(rng, "w11-l7.convert", anyDomain(rng), { dir: "down", maxGap: 6, maxDec: 3 }) },
    { id: "convUp", skill: "w11-l7.convert", gen: (rng) => convEx(rng, "w11-l7.convert", anyDomain(rng), { dir: "up", maxGap: 6, maxDec: 3 }) },
    { id: "prefix", skill: "w11-l7.prefix", gen: (rng) => { const [p, ok] = rng.pick(PREFIX); return mc(`pf-${p}`, "w11-l7.prefix", `Vad betyder prefixet ${p}- (som i ${p === "kilo" ? "kilometer" : p === "deci" ? "deciliter" : p === "centi" ? "centimeter" : "millimeter"})?`, ok, PREFIX.filter(([q]) => q !== p).map(([, t]) => ({ text: t })), `${p}- betyder ${ok}.`, ["Tänk på 1 km, 1 dl, 1 cm och 1 mm."], rng); } },
    { id: "trueStatement", skill: "w11-l7.facts", gen: (rng) => { const ok = rng.pick(TRUE_S); return mc(`ts-${ok}`, "w11-l7.facts", "Vilket påstående är sant?", ok, rng.shuffle([...FALSE_S]).slice(0, 3).map((text) => ({ text })), `${ok} är rätt. De andra blandar ihop faktorerna 10, 100 och 1 000.`, ["Prefixet avgör faktorn."], rng); } },
    { id: "direction", skill: "w11-l7.direction", gen: (rng) => { const c = rng.pick([["kg", "g"], ["m", "cm"], ["km", "m"], ["l", "ml"], ["cm", "m"], ["g", "kg"], ["ml", "l"], ["mm", "cm"]] as const); const toSmaller = ["kg g", "m cm", "km m", "l ml"].includes(`${c[0]} ${c[1]}`);
      return mc(`dr-${c[0]}-${c[1]}`, "w11-l7.direction", `Du skriver om ett mått från ${c[0]} till ${c[1]}. Vad händer med mätetalet?`, toSmaller ? "Talet blir större" : "Talet blir mindre", [{ text: toSmaller ? "Talet blir mindre" : "Talet blir större" }, { text: "Talet är oförändrat" }], `${c[0]} är ${toSmaller ? "större" : "mindre"} än ${c[1]}, så det går åt ${toSmaller ? "fler" : "färre"} ${c[1]}.`, ["Är den nya enheten större eller mindre?"], rng); } },
    { id: "compare", skill: "w11-l7.compare", gen: (rng) => cmpEx(rng, "w11-l7.compare", rng.pick([LEN2.filter((u) => u.n !== "km"), MASS.filter((u) => u.n !== "ton"), VOL]), "mängd") },
    { id: "twoStep", skill: "w11-l7.context", gen: (rng) => { const f = rng.pick([[1.5, "l", "cl", 150], [2.5, "kg", "g", 2500], [0.75, "l", "dl", 7.5], [3.2, "m", "mm", 3200], [0.4, "km", "m", 400]] as const); return numeric(`t2-${f[0]}-${f[2]}`, "w11-l7.context", `Skriv om ${String(f[0]).replace(".", ",")} ${f[1]} i ${f[2]}.`, String(f[3]), `Gör om med faktorn mellan ${f[1]} och ${f[2]}: ${String(f[0]).replace(".", ",")} ${f[1]} = ${String(f[3]).replace(".", ",")} ${f[2]}.`, ["Ska talet växa eller krympa?"], f[2]); } },
  ],
  method: [
    { id: "convSteps", skill: "w11-l7.convert", gen: (rng) => convSteps(rng, "w11-l7.convert", anyDomain(rng), { maxGap: 6, maxDec: 3 }) },
    { id: "chain", skill: "w11-l7.chain", gen: (rng) => { const a = rng.pick([0.2, 0.5, 1.5, 2, 3]); const m = Math.round(a * 1000); return multifield(`ch-${a}`, "w11-l7.chain", `Skriv om ${String(a).replace(".", ",")} km i cm, i två steg via meter.`, [{ label: "Antal m", suffix: "m", accept: [m] }, { label: "Antal cm", suffix: "cm", accept: [m * 100] }], `${String(a).replace(".", ",")} km = ${m} m = ${m * 100} cm.`, ["km → m, sedan m → cm."]); } },
  ],
  representation: [
    { id: "lineMark", skill: "w11-l7.line", gen: (rng) => { const k = rng.int(3, 19); return numberlineEx(`lm-${k}`, "w11-l7.line", `Tallinjen är graderad i cm. Markera ${dcTrim(k * 10, 2)} m.`, k * 10, { min: 0, max: 200, step: 10, labelEvery: 50, unit: "cm" }, `${dcTrim(k * 10, 2)} m = ${k * 10} cm.`, ["1 m = 100 cm."]); } },
    { id: "balanceFind", skill: "w11-l7.balance", gen: (rng) => balanceConv(rng, "w11-l7.balance", anyDomain(rng)) },
    { id: "balanceSign", skill: "w11-l7.balance", gen: (rng) => signBalance(rng, "w11-l7.balance", rng.pick([LEN2, MASS, VOL])) },
  ],
  teacher: {
    title: "Komma åt fel håll",
    scenarios: ["Hampus (åk 5) skriver 3,5 km = 0,0035 m."],
    prompt: "Förklara för Hampus vad som blev fel, hur många meter 3,5 km är, och hur han kan kontrollera i förväg om svaret ska bli större eller mindre.",
    minChars: 170,
    rubric: { minConcepts: 4, concepts: [
      { id: "stor", label: "km är en större enhet än m / 1 km = 1 000 m", any: ["större enhet", "1 000 m", "1000 m", "tusen meter", "längre"] },
      { id: "svar", label: "rätt svar 3 500 m", any: ["3 500", "3500"] },
      { id: "mult", label: "multiplicera med 1 000 / flytta komma åt andra hållet", any: ["multiplicera", "gånger 1 000", "· 1 000", "·1 000", "x 1000", "åt andra hållet", "fel håll"] },
      { id: "rimlig", label: "rimlighet: 3,5 km är mer än 3,5 m, så talet ska bli större", any: ["rimlig", "större tal", "blir större", "fler meter", "orimlig"] },
      { id: "regel", label: "mindre enhet → större tal", any: ["mindre enhet", "större enhet", "fler", "färre"] },
    ] },
    modelAnswer: "Hampus, du har flyttat kommat åt fel håll. Kilometer är en större enhet än meter, 1 km är 1 000 m, så det går åt fler meter. Då ska talet bli större: 3,5 · 1 000 = 3 500 m, inte 0,0035. Du kan kontrollera rimligheten: 3,5 km är en lång sträcka, så mätetalet i den mindre enheten meter måste bli större, och 0,0035 m är orimligt. Regeln är: mindre enhet ger fler, alltså större tal.",
  },
};

// ───────── Lektion 8: Uppskatta och välja enhet ─────────
const REASON: [string, string, string[]][] = [
  ["höjden på ett skolbord", "75 cm", ["75 mm", "75 m", "7,5 m"]],
  ["massan hos en banan", "150 g", ["150 kg", "15 g", "1,5 kg"]],
  ["volymen i en kaffekopp", "2 dl", ["2 l", "2 ml", "20 l"]],
  ["längden på en lektion", "45 min", ["45 s", "45 tim", "4,5 min"]],
  ["längden på en tioåring", "140 cm", ["140 mm", "14 m", "1,4 mm"]],
  ["massan hos en vuxen", "70 kg", ["70 g", "7 kg", "700 kg"]],
  ["bredden på en dörr", "90 cm", ["90 mm", "9 m", "9 cm"]],
  ["volymen i ett badkar", "150 l", ["150 ml", "15 dl", "1 500 l"]],
  ["sträckan från hemmet till skolan (gående)", "1 km", ["1 mm", "100 km", "1 cm"]],
];
const SPEED: [number, number][] = [[15, 40], [12, 30], [18, 20], [60, 45], [30, 10], [20, 15]];
const SENSIBLE = ["En cykel väger 12 kg", "Ett klassrum är 8 m långt", "En tesked rymmer 5 ml", "En film varar 90 minuter", "En penna är 15 cm lång"];
const NONSENSE = ["En cykel väger 12 g", "Ett klassrum är 8 mm långt", "En tesked rymmer 5 l", "En film varar 90 sekunder", "En penna är 15 m lång"];

export const lesson8: Lesson = {
  id: "w11-l8", worldId: "w11", title: "Uppskatta, mäta och välja enhet", grades: "åk 4–6",
  summary: "Rimliga mått, avrundade mätvärden, referensmått och hastighet.",
  lgr: "Uppskattning och mätning; rimlighet; mätvärdens noggrannhet",
  objectives: ["Bedöma om ett mått är rimligt.", "Förstå att mätvärden är avrundade och därför osäkra.", "Använda referensmått och räkna med hastighet (km/h)."],
  intro: "Att kunna mäta är bara halva kompetensen. Minst lika viktigt är att **veta ungefär** hur stort något är, så att du upptäcker ett fel innan du skriver det. Och varje mätvärde är **osäkert**: en planka som mäts till 83 cm är inte exakt 83,000 cm.",
  theory: [
    { heading: "Referensmått", body: "Lär dig några fasta punkter: en dörr är ca 2 m hög, en tumnagel ca 1 cm bred, en liter mjölk väger 1 kg, en vuxen väger ca 70 kg, en skoldag är ca 6 timmar. Jämför med dem när du ska uppskatta." },
    { heading: "Rimlighetsfrågan", body: "Innan du lämnar ett svar: stämmer *enheten* och *storleken*? ”Ett bord är 75 m högt” är fel – bordet är 75 cm. Fel med faktor 10, 100 eller 1 000 är vanliga och går att upptäcka med referensmått." },
    { heading: "Avrundade mätvärden", body: "Mäter du 83 cm, avrundat till närmaste cm, kan längden vara allt från $82{,}5$ cm till strax under $83{,}5$ cm. Felet är högst $0{,}5$ cm. Mer precision kräver en finare skala." },
    { heading: "Hastighet", body: "Hastighet är sträcka per tid: 15 km/h betyder 15 km på 1 timme. På 40 min (två tredjedelar av en timme) hinner du $15 \\cdot \\tfrac{40}{60} = 10$ km. Gör om tiden till timmar först." },
  ],
  worked: [
    { title: "Hur långt hinner jag?", problem: "Du cyklar 15 km/h i 40 minuter. Hur långt kommer du?", steps: [{ text: "40 min är 40/60 = 2/3 timme." }, { text: "Sträcka.", math: "15 \\cdot \\tfrac{2}{3} = 10" }], why: "Sträcka = hastighet · tid, med tiden i timmar.", alternative: "10 min är 1/6 timme: 15 km/h ger 2,5 km på 10 min, och 4 sådana är 10 km." },
    { title: "Avrundat mått", problem: "En planka är 83 cm, avrundat till närmaste cm. Vad är den minsta längd den kan ha?", steps: [{ text: "Avrundat till närmaste cm betyder högst 0,5 cm fel." }, { text: "Minsta:", math: "83 - 0{,}5 = 82{,}5" }], why: "Allt från 82,5 och uppåt avrundas till 83.", alternative: "Rita en tallinje: 82,5 ligger mitt mellan 82 och 83." },
  ],
  drawing: { task: "Uppskatta höjden på din dörr med din egen handsbredd. Mät handsbredden i cm. Hur många handsbredder går det på 2 m?", tool: "grid" },
  pupils: [{ pupil: "Ellie", said: "Vårt skolbord är 75 m högt.", misconception: "Kontrollerar inte rimlighet – blandar ihop cm och m.", response: "Fråga: ”Är bordet högre än klassrummet?” 75 m vore en skyskrapa. Låt Ellie jämföra med en dörr (2 m): bordet når ungefär till midjan, alltså 75 cm." }],
  knowledge: [
    { id: "reasonable", skill: "w11-l8.reasonable", gen: (rng) => { const [what, ok, wrong] = rng.pick(REASON); return mc(`rs-${what}`, "w11-l8.reasonable", `Vilket värde är rimligast för ${what}?`, ok, wrong.map((text) => ({ text })), `${what[0].toUpperCase()}${what.slice(1)} är ungefär ${ok}. De andra värdena är fel enhet eller fel storleksordning (faktor 10, 100 eller 1 000).`, ["Jämför med något du känner till, som en dörr (2 m) eller en liter mjölk (1 kg)."], rng); } },
    { id: "nonsense", skill: "w11-l8.reasonable", gen: (rng) => { const i = rng.int(0, NONSENSE.length - 1); const others = rng.shuffle(SENSIBLE.filter((_, j) => j !== i)).slice(0, 3); return mc(`ns-${i}`, "w11-l8.reasonable", "Vilket påstående är orimligt?", NONSENSE[i], others.map((text) => ({ text })), `${NONSENSE[i]} är orimligt: enheten är fel. Rätt är: ${SENSIBLE[i]}.`, ["Vilket mått är fel enhet?"], rng); } },
    { id: "roundMin", skill: "w11-l8.rounding", gen: (rng) => { const v = rng.int(20, 200); return numeric(`rm-${v}`, "w11-l8.rounding", `Du mäter en planka och får ${v} cm, avrundat till närmaste cm. Vilken är den minsta längd plankan kan ha?`, `${v - 1}.5`, `Avrundat till närmaste cm betyder högst 0,5 cm fel. Minsta: ${v} − 0,5 = ${v - 1},5 cm.`, ["Hur mycket kan det skilja högst?"], "cm"); } },
    { id: "brokenTape", skill: "w11-l8.error", gen: (rng) => { const lost = rng.pick([2, 3, 5]), v = rng.int(20, 120); return numeric(`bt-${lost}-${v}`, "w11-l8.error", `Måttbandets första ${lost} cm är avbrutna, så bandet börjar vid ${lost} cm i stället för 0. Du lägger bandet med änden mot väggen och läser ${v} cm. Hur lång är sträckan egentligen?`, v - lost, `Bandet börjar vid ${lost}, så ${lost} cm av avläsningen ingår inte: ${v} − ${lost} = ${v - lost} cm.`, ["Var börjar skalan egentligen?"], "cm"); } },
    { id: "speed", skill: "w11-l8.speed", gen: (rng) => { const [v, t] = rng.pick(SPEED); return numeric(`sp-${v}-${t}`, "w11-l8.speed", `Du cyklar ${v} km/h i ${t} minuter. Hur långt kommer du?`, (v * t) / 60, `${t} min = ${t}/60 tim. ${v} · ${t} ÷ 60 = ${(v * t) / 60} km.`, ["Gör om minuter till timmar."], "km"); } },
    { id: "handspan", skill: "w11-l8.reference", gen: (rng) => { const h = rng.pick([10, 20]), m = rng.pick([2, 2.5, 3]); return numeric(`hs-${h}-${m}`, "w11-l8.reference", `En handsbredd är ungefär ${h} cm. Ungefär hur många handsbredder är ${String(m).replace(".", ",")} m?`, (m * 100) / h, `${String(m).replace(".", ",")} m = ${m * 100} cm. ${m * 100} ÷ ${h} = ${(m * 100) / h}.`, ["Gör om till cm."]); } },
    { id: "stack", skill: "w11-l8.reference", gen: (rng) => { const t = rng.pick([2, 3, 4, 5]), n = rng.pick([10, 20, 30, 40]); return numeric(`sk-${t}-${n}`, "w11-l8.reference", `En bok är ${t} cm tjock. Hur hög blir en hög med ${n} böcker? Svara i m.`, dcAcc(t * n, 2), `${n} · ${t} = ${t * n} cm = ${dcTrim(t * n, 2)} m.`, ["Räkna i cm, byt sedan till m."], "m"); } },
  ],
  method: [
    { id: "roundSteps", skill: "w11-l8.rounding", gen: (rng) => { let N: number; do N = rng.int(120, 480); while (N % 10 === 5); return multifield(`ro-${N}`, "w11-l8.rounding", `En planka är ${dcTrim(N, 2)} m. Skriv längden i dm och avrunda sedan till närmaste hela dm.`, [{ label: "Längd i dm", suffix: "dm", accept: dcAcc(N, 1) }, { label: "Avrundat till hela dm", suffix: "dm", accept: [Math.round(N / 10)] }], `${dcTrim(N, 2)} m = ${dcTrim(N, 1)} dm. Närmaste hela dm: ${Math.round(N / 10)}.`, ["1 m = 10 dm."]); } },
    { id: "speedSteps", skill: "w11-l8.speed", gen: (rng) => { const v = rng.pick([20, 40, 60]), t = rng.pick([6, 12, 15, 30, 45]); return multifield(`ss-${v}-${t}`, "w11-l8.speed", `Du cyklar ${v} km/h i ${t} minuter. Räkna i steg.`, [{ label: "Tiden i timmar", suffix: "tim", accept: [String(t / 60)] }, { label: "Sträckan", suffix: "km", accept: [String((v * t) / 60)] }], `${t} min = ${t / 60} tim. ${v} · ${t / 60} = ${(v * t) / 60} km.`, ["Tid i timmar först."]); } },
  ],
  representation: [
    { id: "rulerRead", skill: "w11-l8.ruler", gen: (rng) => { const from = rng.int(0, 3) * 10, len = rng.int(15, Math.min(75, 95 - from)); return withVisual(numeric(`rr-${from}-${len}`, "w11-l8.ruler", "Hur långt är föremålet (markerat) i millimeter?", len, `Längd = slut − början = ${(from + len) / 10} − ${from / 10} = ${len / 10} cm = ${len} mm.`, ["Slut minus början."], "mm"), { type: "ruler", cm: 10, from, to: from + len }); } },
    { id: "lineMm", skill: "w11-l8.line", gen: (rng) => { const k = rng.int(2, 18); return numberlineEx(`lm-${k}`, "w11-l8.line", `Tallinjen är graderad i mm. Markera ${dcTrim(k * 5, 1)} cm.`, k * 5, { min: 0, max: 100, step: 5, labelEvery: 20, unit: "mm" }, `${dcTrim(k * 5, 1)} cm = ${k * 5} mm.`, ["1 cm = 10 mm."]); } },
  ],
  teacher: {
    title: "Är svaret rimligt?",
    scenarios: ["Ellie (åk 4) har mätt skolbordets höjd och skriver ”75 m”. Hon tycker att det är rätt eftersom hon räknade noga."],
    prompt: "Förklara för Ellie hur hon kan upptäcka att 75 m är orimligt, vilken enhet som troligen är rätt, och hur hon kan använda referensmått för att kontrollera mått i framtiden.",
    minChars: 170,
    rubric: { minConcepts: 4, concepts: [
      { id: "orimlig", label: "75 m är orimligt (högre än klassrummet/en byggnad)", any: ["orimlig", "för högt", "för stort", "klassrum", "byggnad", "skyskrapa", "för långt"] },
      { id: "cm", label: "rätt enhet cm (75 cm)", any: ["75 cm", "centimeter"] },
      { id: "ref", label: "referensmått (dörr 2 m, egen längd, midja)", any: ["referens", "dörr", "midja", "jämför", "egen längd", "handsbredd"] },
      { id: "rimlig", label: "rimlighetskontroll i förväg (stämmer enhet och storlek)", any: ["rimlig", "kontroll", "uppskatta", "stämmer"] },
      { id: "faktor", label: "fel med faktor 100 (m och cm)", any: ["100 gånger", "faktor", "tiopotens", "fel enhet", "enhet"] },
    ] },
    modelAnswer: "Ellie, att räkna noga räcker inte, man måste också fråga om svaret är rimligt. Ett bord som är 75 m högt vore högre än klassrummet och som en byggnad, alltså orimligt. Rätt enhet är centimeter: 75 cm. Du har blandat ihop enheten, ett fel med faktor 100. Använd referensmått: jämför med dörren som är ungefär 2 m hög, bordet når ungefär till midjan. Då ser du att 75 cm stämmer. Uppskatta alltid i förväg för att kontrollera enhet och storlek.",
  },
};
