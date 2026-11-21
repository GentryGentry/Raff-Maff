import type { Lesson } from "../types";
import { mc, numeric, multifield, withVisual, numberlineEx, sv } from "@/lib/engine/gen-helpers";
import type { Rng } from "@/lib/engine/rng";

const n = (x: number) => sv(x);
const par = (x: number) => (x < 0 ? `(${sv(x)})` : sv(x));
const nz = (rng: Rng, lo: number, hi: number) => { let v = 0; while (v === 0) v = rng.int(lo, hi); return v; };
const DAYS = ["måndag", "tisdag", "onsdag", "torsdag", "fredag"];

// ───────── Lektion 4: Addition och subtraktion ─────────
export const lesson4: Lesson = {
  id: "w8-l4", worldId: "w8", title: "Addition och subtraktion med negativa tal", grades: "åk 4–6",
  summary: "Räkna som förflyttningar på tallinjen: plus = åt höger, minus = åt vänster.",
  lgr: "Rationella tal, däribland negativa tal, och deras egenskaper samt hur talen kan delas upp och användas",
  objectives: ["Addera och subtrahera ett positivt tal till/från ett negativt tal.", "Förklara resultatet som hopp på tallinjen och som temperaturförändring.", "Passera noll korrekt."],
  intro: "$-3 + 5$ och $2 - 5$: båda går över noll. Elever tar ofta ”den största minus den minsta” och glömmer att tecknet kan ändras. Tallinjen löser det: **plus är steg åt höger, minus är steg åt vänster.** Den bilden räcker för det här kapitlet.",
  theory: [
    { heading: "Hopp på tallinjen", body: "Starta vid första talet. $+ b$: hoppa $b$ steg åt höger. $- b$: hoppa $b$ steg åt vänster. $-3 + 5$: från $-3$ fem steg åt höger – 3 steg till noll, 2 steg till: $2$.", visual: { type: "numberline", min: -5, max: 5, step: 1, marks: [-3, 2], labelEvery: 1 } },
    { heading: "Passera noll", body: "$2 - 5$: från 2 hoppar vi 5 åt vänster. 2 steg till noll, 3 steg till: $-3$. Resultatet blir negativt när vi hoppar förbi noll åt vänster." },
    { heading: "Temperatur", body: "Det är $-4\\,^\\circ\\text{C}$ och temperaturen *stiger* 7 grader: $-4 + 7 = 3$. Sjunker den 5 grader från 2 °C: $2 - 5 = -3$." },
    { heading: "Lägga till ett negativt tal", body: "$4 + (-7)$ betyder att lägga till en skuld på 7. Det är samma som $4 - 7 = -3$. $-3 + (-4) = -7$: två skulder blir en större skuld." },
  ],
  worked: [
    { title: "−3 + 5", problem: "Beräkna −3 + 5.", steps: [{ text: "Starta vid −3, hoppa 5 åt höger.", math: "-3 \\to -2, -1, 0, 1, 2" }, { text: "Eller: 3 steg till noll, 2 steg kvar.", math: "-3 + 5 = 2" }], why: "Plus betyder åt höger, och vi passerar noll.", alternative: "Skuld 3 kr, sätter in 5 kr: 2 kr kvar." },
    { title: "2 − 5", problem: "Beräkna 2 − 5.", steps: [{ text: "Starta vid 2, hoppa 5 åt vänster.", math: "2 \\to 1, 0, -1, -2, -3" }, { text: "2 steg till noll, 3 steg kvar åt vänster.", math: "2 - 5 = -3" }], why: "Vi hoppar förbi noll åt vänster, så resultatet är negativt.", alternative: "Du har 2 kr och köper något för 5 kr: du är skyldig 3 kr." },
  ],
  drawing: { task: "Rita en tallinje från −8 till 8. Visa med bågar: −3 + 5 och 2 − 5. Skriv svaren.", tool: "numberline" },
  pupils: [{ pupil: "Tim", said: "2 − 5: det går inte, så jag gör 5 − 2 = 3.", misconception: "Vänder på talen så att det största står först (som i heltalsräkning) och ignorerar tecknet.", response: "Rita tallinjen: 5 steg åt vänster från 2 går förbi noll. Kontrollera med temperatur: 2 °C som sjunker 5 grader blir kallt, inte 3 °C." }],
  knowledge: [
    { id: "addPos", skill: "w8-l4.add", gen: (rng) => { const a = rng.int(-10, -1), b = rng.int(1, 12); return numeric(`ap-${a}-${b}`, "w8-l4.add", `${n(a)} + ${b} = ?`, a + b, `${n(a)} + ${b} = ${n(a + b)}. (${Math.abs(a)} steg till noll, ${b - Math.abs(a)} ${b >= Math.abs(a) ? "steg till" : "kvar"}.)`, ["Hoppa åt höger."]); } },
    { id: "subPos", skill: "w8-l4.subtract", gen: (rng) => { const a = rng.int(-6, 9), b = rng.int(1, 10); return numeric(`sp-${a}-${b}`, "w8-l4.subtract", `${n(a)} − ${b} = ?`, a - b, `${n(a)} − ${b} = ${n(a - b)} (hoppa ${b} steg åt vänster).`, ["Minus är åt vänster."]); } },
    { id: "addNeg", skill: "w8-l4.add-negative", gen: (rng) => { const a = rng.int(-8, 8), b = rng.int(-8, -1); return numeric(`an-${a}-${b}`, "w8-l4.add-negative", `${n(a)} + ${par(b)} = ?`, a + b, `Att lägga till ${n(b)} är samma som att ta bort ${Math.abs(b)}: ${n(a + b)}.`, ["Plus ett negativt tal = minus."]); } },
    { id: "tempChange", skill: "w8-l4.context", gen: (rng) => { const s = rng.int(-9, 6), d = rng.int(2, 12), up = rng.chance(0.5); return numeric(`tc-${s}-${d}-${up}`, "w8-l4.context", `Temperaturen är ${n(s)} °C och ${up ? "stiger" : "sjunker"} ${d} grader. Vilken temperatur blir det? (Skriv i grader.)`, up ? s + d : s - d, `${n(s)} ${up ? "+" : "−"} ${d} = ${n(up ? s + d : s - d)}.`, ["Stiger = åt höger."], "°C"); } },
    { id: "whichExpr", skill: "w8-l4.concept", gen: (rng) => { const a = rng.int(1, 5), t = -rng.int(1, 6); const b = a - t; const correct = `${a} − ${b}`; const wrong = [`${b} − ${a}`, `${a} + ${b}`, `${n(-a)} − ${b}`]; return mc(`we-${a}-${t}`, "w8-l4.concept", `Vilken beräkning ger ${n(t)}?`, correct, wrong.map((text) => ({ text })), `${a} − ${b} = ${n(t)}.`, ["Räkna varje alternativ på tallinjen."], rng); } },
    { id: "hop", skill: "w8-l4.hop", gen: (rng) => { const s = rng.int(-8, 3), k = rng.int(2, 9), right = rng.chance(0.5); return numeric(`hp-${s}-${k}-${right}`, "w8-l4.hop", `Starta vid ${n(s)} och hoppa ${k} steg åt ${right ? "höger" : "vänster"}. Var hamnar du?`, right ? s + k : s - k, `${n(s)} ${right ? "+" : "−"} ${k} = ${n(right ? s + k : s - k)}.`, ["Rita tallinjen."]); } },
  ],
  method: [
    { id: "crossAdd", skill: "w8-l4.add", gen: (rng) => { const a = rng.int(-9, -2), b = rng.int(Math.abs(a) + 1, Math.abs(a) + 8); return multifield(`ca-${a}-${b}`, "w8-l4.add", `Beräkna ${n(a)} + ${b} i steg över noll.`, [{ label: "Steg till noll", accept: [Math.abs(a)] }, { label: "Steg kvar efter noll", accept: [b - Math.abs(a)] }, { label: "Resultat", accept: [a + b] }], `${Math.abs(a)} steg till noll, ${b - Math.abs(a)} kvar: ${n(a + b)}.`, ["Hur långt är det till noll?"]); } },
    { id: "crossSub", skill: "w8-l4.subtract", gen: (rng) => { const a = rng.int(1, 8), b = rng.int(a + 1, a + 8); return multifield(`cs-${a}-${b}`, "w8-l4.subtract", `Beräkna ${a} − ${b} i steg över noll.`, [{ label: "Steg till noll", accept: [a] }, { label: "Steg kvar åt vänster", accept: [b - a] }, { label: "Resultat", accept: [a - b] }], `${a} steg till noll, ${b - a} kvar: ${n(a - b)}.`, ["Hur långt är det ner till noll?"]); } },
  ],
  representation: [
    { id: "markResult", skill: "w8-l4.numberline", gen: (rng) => { const a = rng.int(-9, -1), b = rng.int(1, 10); const sub = rng.chance(0.5); const A = sub ? rng.int(0, 8) : a, B = sub ? rng.int(1, 9) : b; const r = sub ? A - B : A + B; return numberlineEx(`mr-${A}-${B}-${sub}`, "w8-l4.numberline", `Markera resultatet av ${n(A)} ${sub ? "−" : "+"} ${B} på tallinjen.`, r, { min: -10, max: 10, step: 1, labelEvery: 5 }, `${n(A)} ${sub ? "−" : "+"} ${B} = ${n(r)}.`, ["Hoppa från startpunkten."]); } },
    { id: "stepsBetween", skill: "w8-l4.hop", gen: (rng) => { const a = rng.int(-8, -1), b = rng.int(1, 8); return withVisual(numeric(`sb-${a}-${b}`, "w8-l4.hop", `Hoppet startar vid ${n(a)} och slutar vid ${n(b)}. Hur många steg åt höger?`, b - a, `${Math.abs(a)} + ${b} = ${b - a} steg.`, ["Via noll."]), { type: "numberline", min: -10, max: 10, step: 1, marks: [a, b], labelEvery: 5 }); } },
  ],
  teacher: {
    title: "2 − 5 är inte 3",
    scenarios: ["Tim (åk 5) räknar 2 − 5 och säger: \"Det går inte att ta 5 från 2, så jag tar 5 − 2 och får 3.\""],
    prompt: "Förklara för Tim varför 2 − 5 inte är 3, och hur han kan räkna rätt med tallinjen eller en temperatur. Vilket svar får han?",
    minChars: 160,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "vanda", label: "att man inte kan vända på talen i subtraktion", any: ["vända på", "byta plats", "inte samma", "ordningen", "5 − 2", "5 - 2"] },
        { id: "linje", label: "tallinjen: hoppa åt vänster / förbi noll", any: ["tallinje", "åt vänster", "förbi noll", "passera noll", "hoppa"] },
        { id: "svar", label: "rätt svar −3", any: ["−3", "-3", "minus tre"] },
        { id: "noll", label: "2 steg till noll, 3 steg kvar", any: ["2 steg", "3 steg", "två steg", "tre steg", "till noll"] },
        { id: "temp", label: "temperatur/pengar som kontroll", any: ["temperatur", "grader", "kallt", "skyldig", "pengar", "skuld"] },
      ],
    },
    modelAnswer: "Tim, du kan inte vända på talen i subtraktion: 5 − 2 är något annat än 2 − 5. Rita en tallinje och starta vid 2. Minus 5 betyder fem steg åt vänster: 2 steg tar oss till noll, och 3 steg till förbi noll. Vi hamnar på −3. Du kan kontrollera med temperatur: om det är 2 grader och det sjunker 5 grader blir det minusgrader, −3 °C, inte plusgrader. Svaret är −3.",
  },
};

// ───────── Lektion 5: Skillnad och avstånd ─────────
export const lesson5: Lesson = {
  id: "w8-l5", worldId: "w8", title: "Skillnad och avstånd mellan tal", grades: "åk 4–6 (fördjupning)",
  summary: "Skillnaden mellan 5 °C och −3 °C är 8 grader – och vad det säger om subtraktion.",
  lgr: "Rationella tal, däribland negativa tal, och deras egenskaper. Obs: subtraktion av negativa tal (a − (−b)) nämns inte uttryckligen i centralt innehåll för åk 4–6 – delen är en fördjupning.",
  objectives: ["Beräkna skillnaden mellan två tal som avstånd på tallinjen.", "Lösa vardagsproblem om temperatur- och höjdskillnader.", "Förstå (fördjupning) varför 5 − (−3) = 8."],
  intro: "Hur många grader kallare är −3 °C än 5 °C? 8 – inte 2. Skillnaden mellan två tal är **avståndet mellan dem på tallinjen**. När det ena talet är negativt och det andra positivt passerar avståndet noll, och vi måste lägga ihop de två delarna.",
  theory: [
    { heading: "Skillnad = avstånd", body: "Skillnaden mellan $5$ och $-3$: 3 steg från $-3$ till noll och 5 steg från noll till 5. Tillsammans $3 + 5 = 8$.", visual: { type: "numberline", min: -5, max: 6, step: 1, marks: [-3, 5], labelEvery: 1 } },
    { heading: "Samma sida om noll", body: "Skillnaden mellan $-9$ och $-2$: båda ligger åt vänster. Avståndet är $9 - 2 = 7$ (större avstånd minus mindre avstånd)." },
    { heading: "Vardagen", body: "Dalen ligger 35 m under havet och toppen 120 m över: höjdskillnaden är $35 + 120 = 155$ m. Dag $4\\,^\\circ$ och natt $-6\\,^\\circ$: skillnaden är $4 + 6 = 10$ grader." },
    { heading: "Fördjupning: a − (−b)", body: "Skillnaden mellan två tal är *större minus mindre*: $5 - (-3) = 8$. Att dra bort en skuld på 3 kr ger dig 3 kr mer. Det förklarar varför ”minus minus blir plus” – men den regeln hör till senare år; här räcker avståndsbilden." },
  ],
  worked: [
    { title: "Temperaturskillnad", problem: "På måndag var det 4 °C och på tisdag −6 °C. Hur många grader kallare var det på tisdag?", steps: [{ text: "Avstånd från 4 till 0 och från 0 till −6.", math: "4 + 6" }, { text: "Skillnaden:", math: "10\\ \\text{grader}" }], why: "Termometern passerar noll, så vi lägger ihop de två avstånden.", alternative: "$4 - (-6) = 10$." },
    { title: "Båda negativa", problem: "Hur långt är det mellan −9 och −2?", steps: [{ text: "Båda är åt vänster om noll.", math: "9\\ \\text{och}\\ 2\\ \\text{steg från noll}" }, { text: "Avståndet:", math: "9 - 2 = 7" }], why: "Det längre avståndet minus det kortare.", alternative: "Hoppa från −9 åt höger tills du når −2: 7 steg." },
  ],
  drawing: { task: "Rita en tallinje från −8 till 8. Markera −3 och 5 och rita en båge mellan dem. Hur många steg är det? Skriv uträkningen.", tool: "numberline" },
  pupils: [{ pupil: "Maja", said: "Skillnaden mellan 5 grader och −3 grader är 2: jag tar 5 − 3.", misconception: "Ignorerar minustecknet och subtraherar siffrorna.", response: "Rita termometern: 5 grader och 3 grader under noll. Hur många streck är det från −3 till 5? 8." }],
  knowledge: [
    { id: "diff", skill: "w8-l5.diff", gen: (rng) => { const a = rng.int(-10, 10); let b = rng.int(-10, 10); if (a === b) b += 3; const hi = Math.max(a, b), lo = Math.min(a, b); const [x, y] = rng.chance(0.5) ? [a, b] : [b, a]; return numeric(`df-${a}-${b}`, "w8-l5.diff", `Vilken är skillnaden mellan ${n(x)} och ${n(y)}?`, hi - lo, `Avståndet mellan ${n(lo)} och ${n(hi)} är ${hi - lo}.`, ["Hur många steg är det mellan dem?"]); } },
    { id: "tempDiff", skill: "w8-l5.context", gen: (rng) => { const a = rng.int(-4, 9), b = rng.int(-12, -5); const [d1, d2] = rng.pick([DAYS.slice(0, 2), DAYS.slice(1, 3), DAYS.slice(2, 4)]); return numeric(`td-${a}-${b}`, "w8-l5.context", `${d1[0].toUpperCase() + d1.slice(1)} var det ${n(a)} °C och ${d2} ${n(b)} °C. Hur många grader kallare var det ${d2}?`, a - b, `${n(a)} − ${n(b)}: ${a - b} grader.`, ["Skillnaden mellan temperaturerna."], "grader"); } },
    { id: "height", skill: "w8-l5.context", gen: (rng) => { const top = rng.int(20, 200), deep = rng.int(10, 90); return numeric(`ht-${top}-${deep}`, "w8-l5.context", `En fjälltopp ligger ${top} m över havet och en dal ${deep} m under havet. Hur stor är höjdskillnaden?`, top + deep, `${top} + ${deep} = ${top + deep} m.`, ["Via havsytan (noll)."], "m"); } },
    { id: "subNeg", skill: "w8-l5.subtract-negative", gen: (rng) => { const a = rng.int(-6, 8), b = rng.int(-8, -1); return numeric(`sn-${a}-${b}`, "w8-l5.subtract-negative", `(Fördjupning) ${n(a)} − ${par(b)} = ?`, a - b, `Skillnaden mellan ${n(a)} och ${n(b)} är ${a - b}.`, ["Det är avståndet mellan talen."]); } },
    { id: "distanceSteps", skill: "w8-l5.diff", gen: (rng) => { const a = rng.int(-10, -1), b = rng.int(1, 10); return numeric(`ds-${a}-${b}`, "w8-l5.diff", `Hur många steg är det från ${n(a)} till ${b} på tallinjen?`, b - a, `${Math.abs(a)} + ${b} = ${b - a}.`, ["Via noll."]); } },
    { id: "whyMc", skill: "w8-l5.concept", gen: (rng) => mc("wy", "w8-l5.concept", "Varför är 5 − (−3) = 8?", "Skillnaden mellan −3 och 5 är 8 steg på tallinjen", [{ text: "För att man bara får lära sig att minus minus blir plus", note: "En regel utan förklaring – avståndet förklarar varför." }, { text: "För att 5 − 3 = 2" }, { text: "För att man alltid lägger ihop siffrorna" }], "Subtraktion är skillnad, och skillnaden mellan −3 och 5 är avståndet 8.", ["Rita tallinjen."], rng) },
  ],
  method: [
    { id: "crossDiff", skill: "w8-l5.diff", gen: (rng) => { const a = rng.int(1, 9), b = rng.int(-9, -1); return multifield(`cd-${a}-${b}`, "w8-l5.diff", `Skillnaden mellan ${a} och ${n(b)}. Fyll i.`, [{ label: `Avstånd från ${n(b)} till 0`, accept: [Math.abs(b)] }, { label: `Avstånd från 0 till ${a}`, accept: [a] }, { label: "Skillnad", accept: [a - b] }], `${Math.abs(b)} + ${a} = ${a - b}.`, ["Passera noll."]); } },
    { id: "bothNeg", skill: "w8-l5.diff", gen: (rng) => { const a = rng.int(2, 8), b = rng.int(a + 1, 12); return multifield(`bn-${a}-${b}`, "w8-l5.diff", `Skillnaden mellan ${n(-a)} och ${n(-b)}. Fyll i.`, [{ label: `Avstånd från noll för ${n(-a)}`, accept: [a] }, { label: `Avstånd från noll för ${n(-b)}`, accept: [b] }, { label: "Skillnad", accept: [b - a] }], `${b} − ${a} = ${b - a}.`, ["Båda på samma sida om noll."]); } },
  ],
  representation: [
    { id: "gapVisual", skill: "w8-l5.numberline", gen: (rng) => { const a = rng.int(-9, -1), b = rng.int(1, 9); return withVisual(numeric(`gv-${a}-${b}`, "w8-l5.numberline", "Hur långt är det mellan markeringarna på tallinjen?", b - a, `${Math.abs(a)} + ${b} = ${b - a}.`, ["Räkna via noll."]), { type: "numberline", min: -10, max: 10, step: 1, marks: [a, b], labelEvery: 5 }); } },
    { id: "jumpFrom", skill: "w8-l5.numberline", gen: (rng) => { const a = rng.int(-8, -2), k = rng.int(2, 9); return numberlineEx(`jf-${a}-${k}`, "w8-l5.numberline", `Starta vid ${n(a)} och hoppa ${k} steg åt höger. Markera var du hamnar.`, a + k, { min: -10, max: 10, step: 1, labelEvery: 5 }, `${n(a)} + ${k} = ${n(a + k)}.`, ["Åt höger."]); } },
  ],
  teacher: {
    title: "Skillnaden mellan 5 °C och −3 °C",
    scenarios: ["Maja (åk 6) ska räkna ut hur många grader kallare −3 °C är än 5 °C. Hon svarar 2 grader: \"5 − 3.\""],
    prompt: "Förklara för Maja hur man räknar skillnaden mellan 5 °C och −3 °C, varför svaret inte är 2, och visa med termometer eller tallinje.",
    minChars: 160,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "noll", label: "att avståndet passerar noll (3 + 5)", any: ["passerar noll", "via noll", "3 + 5", "3+5", "förbi noll", "genom noll"] },
        { id: "svar", label: "rätt svar 8 grader", any: ["8 grader", "8 steg", "är 8", "= 8"] },
        { id: "linje", label: "tallinje/termometer", any: ["tallinje", "termometer", "streck", "steg"] },
        { id: "fel", label: "att 5 − 3 ignorerar minustecknet", any: ["minustecknet", "ignorerar", "−3 är under noll", "under noll", "tecknet"] },
        { id: "skillnad", label: "skillnad = avstånd", any: ["avstånd", "skillnaden", "mellan"] },
      ],
    },
    modelAnswer: "Maja, skillnaden är avståndet mellan temperaturerna på termometern. Från −3 °C upp till noll är det 3 grader, och från noll upp till 5 °C är det 5 grader till. Tillsammans 3 + 5 = 8 grader. Din 5 − 3 = 2 ignorerar att −3 ligger under noll, så avståndet passerar noll och de två delarna ska läggas ihop. Rita en tallinje eller termometer och räkna strecken: det blir 8 steg. Skillnaden är alltså 8 grader.",
  },
};

// ───────── Lektion 6: Vardagsproblem ─────────
export const lesson6: Lesson = {
  id: "w8-l6", worldId: "w8", title: "Negativa tal i vardagen", grades: "åk 4–6",
  summary: "Temperatur, bankkonto, hiss och havsdjup – modellera, räkna och kontrollera.",
  lgr: "Rationella tal, däribland negativa tal, och deras användning; strategier för att lösa matematiska problem i elevnära situationer",
  objectives: ["Översätta en vardagssituation till tal med tecken.", "Räkna förändringar och skillnader.", "Bedöma om ett svar är rimligt."],
  intro: "Negativa tal är inte abstrakta – de används när man pratar om skulder, kyla, djup och våningar under marken. Här binder du ihop allt: **skriv situationen som tal, rita tallinjen, räkna, kontrollera.** Och passa på att tänka på hur du själv skulle förklara det för en elev.",
  theory: [
    { heading: "Fyra steg", body: "1. Vad är startvärdet? (med tecken)\n\n2. Vad är förändringen? (plus = upp/in, minus = ned/ut)\n\n3. Räkna på tallinjen.\n\n4. Är svaret rimligt?", visual: { type: "thermometer", value: -5, min: -20, max: 20 } },
    { heading: "Bankkonto", body: "Saldo $-120$ kr (skuld). Du sätter in 200 kr: $-120 + 200 = 80$ kr. Du betalar 50 kr från saldo 20 kr: $20 - 50 = -30$ kr." },
    { heading: "Hiss och djup", body: "Hissen står på våning $-2$ och åker 5 våningar upp: $-2 + 5 = 3$. En ubåt på $-45$ m stiger 20 m: $-45 + 20 = -25$ m (fortfarande under ytan)." },
    { heading: "Rimlighet", body: "Är du skyldig 120 kr och sätter in 50 kr är du fortfarande skyldig pengar: $-70$. En inbetalning kan aldrig *öka* skulden." },
  ],
  worked: [
    { title: "Bankkonto", problem: "Kontot visar −120 kr. Du sätter in 50 kr. Vad visar kontot?", steps: [{ text: "Före:", math: "-120" }, { text: "Förändring: in = plus.", math: "+ 50" }, { text: "Efter:", math: "-120 + 50 = -70" }], why: "Du är fortfarande skyldig 70 kr – skulden blev mindre.", alternative: "Tallinjen: 50 steg åt höger från −120." },
    { title: "Ubåt", problem: "En ubåt är på −45 m och stiger 20 m. Var är den nu?", steps: [{ text: "Stiger = upp = plus.", math: "-45 + 20 = -25" }], why: "Den är fortfarande under ytan, men närmare den.", alternative: "Termometern vänd: lodrät tallinje." },
  ],
  drawing: { task: "Rita en lodrät tallinje (som en termometer) från −10 till 10 och markera −4. Visa hur temperaturen ändras om den stiger 7 grader och sedan sjunker 9 grader.", tool: "numberline" },
  pupils: [{ pupil: "Ida", said: "Kontot visar −200 kr och jag sätter in 50 kr, då har jag −250 kr. Jag lägger ihop 200 och 50.", misconception: "Lägger ihop beloppen utan att se att insättningen minskar skulden.", response: "Fråga: ”Blir du mer eller mindre skyldig när du sätter in pengar?” Rita tallinjen: 50 steg åt höger från −200 är −150." }],
  knowledge: [
    { id: "bank", skill: "w8-l6.bank", gen: (rng) => { const s = rng.int(-30, 20) * 10, d = rng.int(2, 25) * 10, dep = rng.chance(0.5); return numeric(`bk-${s}-${d}-${dep}`, "w8-l6.bank", `Kontot visar ${n(s)} kr. Du ${dep ? "sätter in" : "tar ut"} ${d} kr. Vad visar kontot nu?`, dep ? s + d : s - d, `${n(s)} ${dep ? "+" : "−"} ${d} = ${n(dep ? s + d : s - d)} kr.`, [dep ? "In = plus." : "Ut = minus."], "kr"); } },
    { id: "elevator", skill: "w8-l6.elevator", gen: (rng) => { const f = rng.int(-3, 5), k = rng.int(2, 7), up = rng.chance(0.5); return numeric(`el-${f}-${k}-${up}`, "w8-l6.elevator", `Hissen står på våning ${n(f)} och åker ${k} våningar ${up ? "upp" : "ner"}. Vilken våning står den på nu?`, up ? f + k : f - k, `${n(f)} ${up ? "+" : "−"} ${k} = ${n(up ? f + k : f - k)}.`, ["Upp = plus."]); } },
    { id: "submarine", skill: "w8-l6.depth", gen: (rng) => { const d = rng.int(-80, -15), r = rng.int(5, 40); return numeric(`sm-${d}-${r}`, "w8-l6.depth", `En ubåt ligger på ${n(d)} m och stiger ${r} m. Var ligger den nu (i meter)?`, d + r, `${n(d)} + ${r} = ${n(d + r)} m.`, ["Stiger = plus."], "m"); } },
    { id: "spread", skill: "w8-l6.range", gen: (rng) => { const set = new Set<number>(); while (set.size < 4) set.add(rng.int(-12, 10)); const arr = [...set]; return numeric(`sd-${arr.join("_")}`, "w8-l6.range", `Temperaturerna under fyra nätter var ${arr.map(n).join(", ")} °C. Vilken är skillnaden mellan högsta och lägsta?`, Math.max(...arr) - Math.min(...arr), `${n(Math.max(...arr))} − ${par(Math.min(...arr))} = ${Math.max(...arr) - Math.min(...arr)}.`, ["Största minus minsta."], "grader"); } },
    { id: "interpret", skill: "w8-l6.interpret", gen: (rng) => { const s = -rng.int(8, 20) * 10, d = rng.int(2, 6) * 10; const left = -(s + d); return mc(`ip-${s}-${d}`, "w8-l6.interpret", `Kontot visar ${n(s)} kr. Du sätter in ${d} kr. Vilket påstående stämmer?`, `Du är fortfarande skyldig ${-(s + d)} kr`, [{ text: `Du har ${-(s + d)} kr`, note: "Du är fortfarande skyldig pengar." }, { text: `Du är skyldig ${-s + d} kr`, note: "En insättning minskar skulden." }, { text: `Du är skyldig ${d} kr` }], `${n(s)} + ${d} = ${n(s + d)}: skulden är ${left} kr.`, ["Blir skulden större eller mindre?"], rng); } },
    { id: "plausible", skill: "w8-l6.reasonable", gen: (rng) => { const s = -rng.int(4, 10) * 10, d = rng.int(1, 3) * 10; return mc(`pl-${s}-${d}`, "w8-l6.reasonable", `Saldot är ${n(s)} kr och du sätter in ${d} kr. Kan nya saldot vara ${n(s - d)} kr?`, `Nej – en insättning gör saldot större (${n(s + d)} kr)`, [{ text: "Ja – man lägger ihop beloppen" }, { text: "Ja – skulden växer" }], `${n(s)} + ${d} = ${n(s + d)}.`, ["Åt höger eller vänster?"], rng); } },
  ],
  method: [
    { id: "beforeChangeAfter", skill: "w8-l6.model", gen: (rng) => { const s = rng.int(-60, -10), k = rng.int(5, 40); return multifield(`bc-${s}-${k}`, "w8-l6.model", `En ubåt är på ${n(s)} m och stiger ${k} m. Fyll i.`, [{ label: "Före (m)", accept: [s] }, { label: "Förändring (med tecken)", accept: [k] }, { label: "Efter (m)", accept: [s + k] }], `${n(s)} + ${k} = ${n(s + k)}.`, ["Stiger = plus."]); } },
    { id: "bankModel", skill: "w8-l6.model", gen: (rng) => { const s = rng.int(1, 20) * 10, d = rng.int(s / 10 + 1, s / 10 + 15) * 10; return multifield(`bm-${s}-${d}`, "w8-l6.model", `Saldot är ${s} kr. Du betalar ${d} kr. Fyll i.`, [{ label: "Före (kr)", accept: [s] }, { label: "Förändring (med tecken)", accept: [-d] }, { label: "Efter (kr)", accept: [s - d] }], `${s} − ${d} = ${n(s - d)}.`, ["Ut = minus."]); } },
  ],
  representation: [
    { id: "thermoChange", skill: "w8-l6.thermometer", gen: (rng) => { const s = rng.int(-8, 8), d = rng.int(2, 9), up = rng.chance(0.5); const r = up ? s + d : s - d; return withVisual(numeric(`tc-${s}-${d}-${up}`, "w8-l6.thermometer", `Termometern visar nuvarande temperatur. Den ${up ? "stiger" : "sjunker"} ${d} grader. Vilken temperatur blir det? (Svara i grader.)`, r, `${n(s)} ${up ? "+" : "−"} ${d} = ${n(r)}.`, ["Avläs först termometern."], "°C"), { type: "thermometer", value: s, min: -20, max: 20 }); } },
    { id: "markFloor", skill: "w8-l6.numberline", gen: (rng) => { const f = rng.int(-4, 3), k = rng.int(2, 6); return numberlineEx(`mf-${f}-${k}`, "w8-l6.numberline", `Hissen står på våning ${n(f)} och åker ${k} våningar upp. Markera var den hamnar.`, f + k, { min: -10, max: 10, step: 1, labelEvery: 5 }, `${n(f)} + ${k} = ${n(f + k)}.`, ["Upp = åt höger."]); } },
  ],
  teacher: {
    title: "Skuld och insättning",
    scenarios: ["Ida (åk 5) har ett konto som visar −200 kr och sätter in 50 kr. Hon räknar: \"200 plus 50 är 250, så −250.\""],
    prompt: "Förklara för Ida vad som händer med skulden när man sätter in pengar, och hur hon räknar rätt. Använd tallinjen eller en liknelse, och förklara hur hon kan kontrollera sitt svar.",
    minChars: 160,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "minskar", label: "att skulden blir mindre när man sätter in pengar", any: ["skulden minskar", "mindre skuld", "mindre skyldig", "skulden blir mindre", "fortfarande skyldig"] },
        { id: "svar", label: "rätt svar −150", any: ["−150", "-150", "minus 150", "150 kr"] },
        { id: "linje", label: "tallinjen: 50 steg åt höger", any: ["åt höger", "tallinje", "50 steg", "steg"] },
        { id: "rimlig", label: "rimlighet/kontroll (−250 är större skuld)", any: ["rimlig", "kontroll", "orimlig", "större skuld", "mer skyldig", "kolla"] },
        { id: "plus", label: "att plus (insättning) går åt höger", any: ["plus", "insättning", "sätter in", "höger"] },
      ],
    },
    modelAnswer: "Ida, när du sätter in pengar på ett konto som visar −200 kr blir du mindre skyldig, inte mer. Insättningen är plus, och plus betyder steg åt höger på tallinjen: 50 steg åt höger från −200 ger −150. Kontot visar alltså −150 kr, och du är fortfarande skyldig 150 kr. Ditt svar −250 skulle betyda att skulden blev större av insättningen, vilket är orimligt. Det är en bra kontroll: ska skulden bli större eller mindre?",
  },
};
