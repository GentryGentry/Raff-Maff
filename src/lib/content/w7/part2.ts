import type { Lesson } from "../types";
import { mc, numeric, multifield, withVisual, numberlineEx, gridshadeEx, gcd, dc, dcTrim, dcAcc, pctOf, baseFor, pc, sv } from "@/lib/engine/gen-helpers";
import type { Rng } from "@/lib/engine/rng";

const PCT_LIST = [10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 5, 15, 35, 45, 55, 65, 85];
/** whole N with p % of N whole, and the part. Wholes chosen from "nice" sizes. */
function whole(rng: Rng, p: number, lo = 2, hi = 12) {
  const step = 100 / gcd(p, 100);
  const N = step * rng.int(lo, hi) * (step < 10 ? 5 : 1);
  return { N, part: pctOf(p, N) };
}
const nice = (n: number) => sv(n);

// ───────── Lektion 6: Hur många procent är delen? ─────────
export const lesson6: Lesson = {
  id: "w7-l6", worldId: "w7", title: "Hur många procent är delen?", grades: "åk 4–6",
  summary: "12 av 40 är 30 % – gör delen och helheten till hundradelar.",
  lgr: "Tal i procentform och deras samband med tal i bråk- och decimalform; proportionalitet",
  objectives: ["Beräkna hur många procent en del är av en helhet.", "Använda bråk och decimaltal som mellanled.", "Rita andelar i hundrarutnät och på procentlinje."],
  intro: "”Hur många procent av eleverna är flickor?”, ”Hur stor del av provet hade jag rätt på?” – i vardagen är det oftare **andelen** vi vill veta, inte delen. Metoden är alltid densamma: **del ÷ helhet** ger ett bråk eller decimaltal, och det gör vi om till procent.",
  theory: [
    { heading: "Del genom helhet", body: "$12$ av $40$: andelen är $\\frac{12}{40}$. Förkorta till $\\frac{3}{10}$, förläng till $\\frac{30}{100}$ – alltså $30\\,\\%$. Eller dividera: $12 \\div 40 = 0{,}3 = 30\\,\\%$.", visual: { type: "percentbar", pct: 30, label: "12 av 40 = 30 %" } },
    { heading: "Förläng till hundradelar", body: "När helheten går i 100 (4, 5, 10, 20, 25, 50) kan vi förlänga direkt: $\\frac{18}{25} = \\frac{72}{100} = 72\\,\\%$ (gånger 4)." },
    { heading: "Division och decimaltal", body: "Går inte helheten i 100: dividera och gör om. $\\frac{21}{40} = 0{,}525 = 52{,}5\\,\\%$. Här räcker ofta ”ungefär”." },
    { heading: "Fallgropen", body: "$12$ av $40$ är **inte** $12\\,\\%$. Delen är inte procenten – den ska sättas i *förhållande* till helheten." },
  ],
  worked: [
    { title: "Förlänga", problem: "På ett prov hade Sara 18 av 24 rätt. Hur många procent?", steps: [{ text: "Andelen:", math: "\\frac{18}{24} = \\frac{3}{4}" }, { text: "Förläng till hundradelar (4 · 25 = 100).", math: "\\frac{75}{100}" }, { text: "Procent:", math: "75\\,\\%" }], why: "Procent är hundradelar – vi söker täljaren när nämnaren är 100.", alternative: "$18 \\div 24 = 0{,}75 = 75\\,\\%$." },
    { title: "Decimalvägen", problem: "Hur många procent är 12 av 40?", steps: [{ text: "Dividera del med helhet.", math: "12 \\div 40 = 0{,}3" }, { text: "Gör om till procent (gånger 100).", math: "0{,}3 = 30\\,\\%" }], why: "0,3 = 30/100.", alternative: "$\\frac{12}{40} = \\frac{3}{10} = \\frac{30}{100}$." },
  ],
  drawing: { task: "Rita ett hundrarutnät. En klass har 25 elever och 15 är flickor. Färga flickornas andel av rutnätet. Hur många procent är det?", tool: "hundredgrid" },
  pupils: [{ pupil: "Alma", said: "12 av 40 är 12 %. Man tar ju bara siffran.", misconception: "Tar delen som procenttal utan att sätta den i förhållande till helheten.", response: "Fråga: ”Är 12 av 40 lika mycket som 12 av 100?” Visa att 12/40 = 30/100." }],
  knowledge: [
    { id: "pctOfWhole", skill: "w7-l6.part-whole", gen: (rng) => { const p = rng.pick(PCT_LIST); const { N, part } = whole(rng, p); return numeric(`pw-${p}-${N}`, "w7-l6.part-whole", `Hur många procent är ${nice(part)} av ${nice(N)}?`, p, `${part}/${N} = ${p}/100 = ${p} %.`, ["Del genom helhet."]); } },
    { id: "testScore", skill: "w7-l6.word", gen: (rng) => { const N = rng.pick([20, 25, 40, 50, 10, 4]); const p = rng.pick([40, 60, 70, 75, 80, 90, 50].filter((x) => (x * N) % 100 === 0)); return numeric(`ts-${N}-${p}`, "w7-l6.word", `På ett prov hade Omar ${pctOf(p, N)} rätt av ${N} frågor. Hur många procent rätt?`, p, `${pctOf(p, N)}/${N} = ${p} %.`, ["Hur många procent är delen av helheten?"]); } },
    { id: "class", skill: "w7-l6.word", gen: (rng) => { const N = rng.pick([20, 25, 40, 50]); const p = rng.pick([30, 40, 60, 70, 80, 20, 25, 75].filter((x) => (x * N) % 100 === 0)); const part = pctOf(p, N); return numeric(`cl-${N}-${p}`, "w7-l6.word", `I en klass med ${N} elever är ${part} flickor. Hur många procent är flickor?`, p, `${part}/${N} = ${p} %.`, []); } },
    { id: "notTheNumber", skill: "w7-l6.concept", gen: (rng) => { const N = rng.pick([20, 25, 40, 50]); const p = rng.pick([30, 40, 60, 80].filter((x) => (x * N) % 100 === 0)); const part = pctOf(p, N); return mc(`nn-${N}-${p}`, "w7-l6.concept", `${part} av ${N} elever är flickor. Stämmer det att ${part} % är flickor?`, `Nej – ${part} av ${N} är ${p} %`, [{ text: `Ja – delen är procenten`, note: "Delen ska sättas i förhållande till helheten." }, { text: `Ja – om ${N} är 100` }], `${part}/${N} = ${p}/100.`, ["Är " + N + " lika med 100?"], rng); } },
    { id: "fractionFirst", skill: "w7-l6.fraction", gen: (rng) => { const d = rng.pick([4, 5, 10, 20, 25, 50]); const n = rng.int(1, d - 1); const p = (100 / d) * n; return numeric(`ff-${n}-${d}`, "w7-l6.fraction", `${n} av ${d} = ? %`, p, `${n}/${d} = ${p}/100 = ${p} %.`, ["Förläng till nämnare 100."]); } },
  ],
  method: [
    { id: "extendSteps", skill: "w7-l6.fraction", gen: (rng) => { const d = rng.pick([4, 5, 20, 25, 50]); const n = rng.int(1, d - 1); const f = 100 / d; return multifield(`es-${n}-${d}`, "w7-l6.fraction", `Hur många procent är ${n} av ${d}? Förläng till hundradelar.`, [{ label: `Förlängningstal (${d} · □ = 100)`, accept: [f] }, { label: "Täljare efter förlängning", accept: [n * f] }, { label: "Procent", accept: [n * f] }], `${n}/${d} = ${n * f}/100 = ${n * f} %.`, []); } },
    { id: "divideSteps", skill: "w7-l6.decimal", gen: (rng) => { const p = rng.pick([30, 35, 45, 55, 65, 85, 15]); const { N, part } = whole(rng, p, 2, 9); return multifield(`ds-${p}-${N}`, "w7-l6.decimal", `Hur många procent är ${nice(part)} av ${nice(N)}? Räkna med division.`, [{ label: `${nice(part)} ÷ ${nice(N)} (decimaltal)`, accept: dcAcc(p, 2) }, { label: "Procent (gånger 100)", accept: [p] }], `${part} ÷ ${N} = ${dc(p, 2)} = ${p} %.`, ["Dela del med helhet."]); } },
  ],
  representation: [
    { id: "shadeShare", skill: "w7-l6.shade", gen: (rng) => { const N = rng.pick([20, 25, 40, 50]); const p = rng.pick([30, 40, 60, 70, 80, 20, 25, 75].filter((x) => (x * N) % 100 === 0)); const part = pctOf(p, N); return gridshadeEx(`sh-${N}-${p}`, "w7-l6.shade", `En klass har ${N} elever och ${part} har cykel. Färglägg andelen som har cykel på rutnätet (100 rutor).`, p, `${part}/${N} = ${p} %: ${p} rutor.`, ["Hur många procent är " + part + " av " + N + "?"]); } },
    { id: "markShare", skill: "w7-l6.numberline", gen: (rng) => { const N = rng.pick([20, 40, 50, 25]); const p = rng.pick([10, 20, 25, 30, 40, 50, 60, 70, 75, 80].filter((x) => (x * N) % 100 === 0)); const part = pctOf(p, N); return numberlineEx(`ms-${N}-${p}`, "w7-l6.numberline", `${part} av ${N} är en andel. Markera andelen i procent på tallinjen.`, p, { min: 0, max: 100, step: 5, labelEvery: 25, unit: "%" }, `${part}/${N} = ${p} %.`, ["Del genom helhet, gånger 100."]); } },
  ],
  teacher: {
    title: "Delen är inte procenttalet",
    scenarios: ["Alma (åk 5) räknar att 12 av 40 elever är 12 procent. \"Det står ju tolv.\" Du vill att hon själv ska se att det inte stämmer."],
    prompt: "Förklara för Alma hur man räknar ut hur många procent 12 av 40 är, och varför svaret inte är 12 %. Visa med ett bråk, ett hundrarutnät eller en procentstapel.",
    minChars: 170,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "bråk", label: "bråket 12/40 (= 3/10)", any: ["12/40", "3/10", "12 av 40", "bråk"] },
        { id: "hundra", label: "förlänga till hundradelar / 30/100", any: ["30/100", "hundradelar", "förläng", "av 100"] },
        { id: "svar", label: "rätt svar 30 %", any: ["30 %", "30 procent", "30%"] },
        { id: "fel", label: "att 12 av 100 är 12 % men 40 är inte 100", any: ["12 av 100", "inte 100", "40 är inte", "helheten är 40", "helheten"] },
        { id: "modell", label: "en modell (rutnät, stapel) eller division 12 ÷ 40 = 0,3", any: ["rutnät", "stapel", "rita", "0,3", "12 ÷ 40", "bild"] },
      ],
    },
    modelAnswer: "Alma, helheten är 40, inte 100. 12 av 40 är bråket 12/40, som förkortas till 3/10. Förläng till hundradelar: 3/10 = 30/100, alltså 30 %. Du kan också dela: 12 ÷ 40 = 0,3 = 30 %. Svaret 12 % hade stämt om det varit 12 av 100, men här är helheten 40. Rita en stapel för 40 elever: 12 elever fyller 30 % av stapeln. Delen måste alltid sättas i förhållande till helheten.",
  },
};

// ───────── Lektion 7: Hela talet ─────────
export const lesson7: Lesson = {
  id: "w7-l7", worldId: "w7", title: "Hitta helheten", grades: "åk 4–6",
  summary: "25 % av ett tal är 15 – vilket är talet? Räkna baklänges med procent.",
  lgr: "Tal i procentform; proportionalitet samt hur proportionella samband uttrycks i procentform; strategier för problemlösning",
  objectives: ["Räkna ut helheten när en procentdel är känd.", "Använda procentstapel, dubbel tallinje och bråk som hjälp.", "Kontrollera genom att räkna framåt."],
  intro: "Det här är den svåraste procentuppgiften – och den vanligaste i vardagen: ”Rabatten är 30 kr och det är 20 %. Vad kostade varan?” Nästan alla räknar först fel åt andra hållet. Nyckeln: **tänk på hela som en trappa av lika stora procentdelar.**",
  theory: [
    { heading: "En procentdel räcker", body: "$25\\,\\%$ av ett tal är 15. Eftersom $25\\,\\% = \\frac{1}{4}$ går fyra sådana delar på helheten: $4 \\cdot 15 = 60$.", visual: { type: "percentbar", pct: 25, label: "25 % = 15" } },
    { heading: "Via 10 % eller 1 %", body: "$40\\,\\%$ är 24. Då är $10\\,\\% = 24 \\div 4 = 6$ och $100\\,\\% = 10 \\cdot 6 = 60$. Eller $1\\,\\% = 24 \\div 40 = 0{,}6$ och $100\\,\\% = 60$." },
    { heading: "Dubbel tallinje", body: "Ritar vi 100 % (okänt) och 40 % (24 kr) ser vi att helheten är $\\frac{100}{40}$ gånger större än 24: $2{,}5 \\cdot 24 = 60$.", visual: { type: "doublenumberline", total: 60, unit: "kr", hideTotal: true, marks: [{ pct: 40, showAmount: true }] } },
    { heading: "Kontrollera framåt", body: "Räkna alltid ut p % av ditt svar: $40\\,\\%$ av 60 är 24. ✓ Kontrollen fångar den vanliga felmetoden att multiplicera: $24 \\cdot 0{,}4 = 9{,}6$ (som är 40 % av 24, inte helheten)." },
  ],
  worked: [
    { title: "25 % är 15", problem: "25 % av ett tal är 15. Vilket är talet?", steps: [{ text: "25 % är en fjärdedel.", math: "25\\,\\% = \\frac{1}{4}" }, { text: "Hela är 4 fjärdedelar.", math: "4 \\cdot 15 = 60" }, { text: "Kontroll:", math: "25\\,\\%\\ \\text{av}\\ 60 = 15" }], why: "Fyra lika stora delar à 15 bildar helheten.", alternative: "10 % ≈ 6; 100 % = 60 – eller dubbel tallinje." },
    { title: "40 % är 24", problem: "En rabatt på 24 kr är 40 % av priset. Vad kostade varan?", steps: [{ text: "10 % är en fjärdedel av 40 %.", math: "24 \\div 4 = 6" }, { text: "100 % är 10 gånger 10 %.", math: "10 \\cdot 6 = 60" }, { text: "Kontroll:", math: "40\\,\\%\\ \\text{av}\\ 60 = 24" }], why: "Vi går från 40 % ned till 10 % och upp till 100 %.", alternative: "$24 \\div 0{,}4 = 60$." },
  ],
  drawing: { task: "Rita en procentstapel (100 % = hela). Märk ut 40 % och skriv 24 kr. Dela stapeln i 10 lika delar (10 % var) och skriv hur mycket varje del är.", tool: "numberline" },
  pupils: [{ pupil: "Teo", said: "25 % av ett tal är 15, så talet är 15 · 0,25 = 3,75.", misconception: "Räknar framåt (procent av 15) i stället för baklänges.", response: "Fråga: ”Är 15 större eller mindre än talet?” 15 är bara en del. 25 % är en fjärdedel – hur många fjärdedelar finns i en hel?" }],
  knowledge: [
    { id: "wholeSimple", skill: "w7-l7.whole", gen: (rng) => { const p = rng.pick([10, 20, 25, 50, 5]); const N = whole(rng, p, 2, 9).N; const part = pctOf(p, N); return numeric(`ws-${p}-${N}`, "w7-l7.whole", `${pc(p)} av ett tal är ${part}. Vilket är talet?`, N, `${pc(p)} av ${N} = ${part}. Helheten är ${(100 / p)} gånger ${part}.`, ["Hur många " + p + " % går på 100 %?"]); } },
    { id: "wholeHard", skill: "w7-l7.whole", gen: (rng) => { const p = rng.pick([30, 40, 60, 70, 75, 80, 15, 35]); const { N, part } = whole(rng, p, 2, 8); return numeric(`wh-${p}-${N}`, "w7-l7.whole", `${pc(p)} av ett tal är ${part}. Vilket är talet?`, N, `${pc(p)} av ${N} = ${part}. (1 % = ${part / p}, 100 % = ${N}).`, ["Hitta 10 % eller 1 % först."]); } },
    { id: "discount", skill: "w7-l7.word", gen: (rng) => { const p = rng.pick([10, 20, 25, 50, 30, 40]); const { N, part } = whole(rng, p, 3, 10); return numeric(`dc-${p}-${N}`, "w7-l7.word", `En rabatt på ${part} kr motsvarar ${pc(p)} av ordinarie pris. Vad kostar varan ordinarie?`, N, `${p} % = ${part} kr. 100 % = ${N} kr.`, ["Procent av priset = rabatten."], "kr"); } },
    { id: "exprMc", skill: "w7-l7.expression", gen: (rng) => { const p = rng.pick([40, 25, 60, 20]); const { N, part } = whole(rng, p, 2, 8); return mc(`ex-${p}-${part}`, "w7-l7.expression", `${pc(p)} av ett tal är ${part}. Vilken räkning ger talet?`, `(${part} ÷ ${p}) · 100`, [{ text: `${part} · ${dc(p, 2).replace(/0$/, "")}`, note: "Det är " + p + " % av " + part + " – inte helheten." }, { text: `${part} · ${p} ÷ 100`, note: "Det är " + p + " % av " + part + " – inte helheten." }, { text: `${part} + ${p}` }], `1 % = ${part} ÷ ${p}, 100 % = (${part} ÷ ${p}) · 100 = ${N}.`, ["Från " + p + " % till 100 %."], rng); } },
    { id: "check", skill: "w7-l7.check", gen: (rng) => { const p = rng.pick([20, 25, 40, 50, 60]); const { N, part } = whole(rng, p, 2, 8); return numeric(`ck-${p}-${N}`, "w7-l7.check", `Du har räknat att ${pc(p)} av ett tal är ${part}, och att talet är ${N}. Kontrollera: ${pc(p)} av ${N} = ?`, part, `${p} % av ${N} = ${part}. ✓`, ["Räkna framåt."]); } },
    { id: "reasonableMc", skill: "w7-l7.reasonable", gen: (rng) => { const p = rng.pick([20, 25, 40]); const { N, part } = whole(rng, p, 3, 8); return mc(`rs-${p}-${N}`, "w7-l7.reasonable", `${pc(p)} av ett tal är ${part}. Vilket svar är rimligt för talet?`, sv(N), [{ text: sv(part / 10), note: "Talet måste vara större än delen." }, { text: dc(Math.round(part * (p / 100) * 100), 2), note: "Det är " + p + " % av " + part + "." }, { text: sv(part - 1) }].filter((o) => o.text !== sv(N)), `Helheten är större än delen: ${N} > ${part}.`, ["Är helheten större eller mindre än delen?"], rng); } },
  ],
  method: [
    { id: "tenSteps", skill: "w7-l7.steps", gen: (rng) => { const k = rng.pick([2, 3, 4, 6, 7, 8]); const per = rng.int(2, 15); return multifield(`ts-${k}-${per}`, "w7-l7.steps", `${k * 10} % av ett tal är ${k * per}. Räkna ut talet i steg.`, [{ label: `Hur många gånger går 10 % på ${k * 10} %?`, accept: [k] }, { label: "10 %", accept: [per] }, { label: "Hela talet (100 %)", accept: [10 * per] }], `10 % = ${k * per} ÷ ${k} = ${per}; 100 % = 10 · ${per} = ${10 * per}.`, []); } },
    { id: "quarterSteps", skill: "w7-l7.steps", gen: (rng) => { const p = rng.pick([25, 20, 50]); const part = rng.int(3, 18); return multifield(`qs-${p}-${part}`, "w7-l7.steps", `${p} % av ett tal är ${part}. Fyll i.`, [{ label: `Antal ${p} %-delar i helheten`, accept: [100 / p] }, { label: "Hela talet", accept: [(100 / p) * part] }, { label: `Kontroll: ${p} % av talet`, accept: [part] }], `${100 / p} · ${part} = ${(100 / p) * part}.`, []); } },
  ],
  representation: [
    { id: "barWhole", skill: "w7-l7.bar", gen: (rng) => { const p = rng.pick([20, 25, 40, 50, 60]); const { N, part } = whole(rng, p, 2, 8); return withVisual(numeric(`bw-${p}-${N}`, "w7-l7.bar", `Det färgade är ${pc(p)} av stapeln och motsvarar ${part} kr. Hur många kronor är hela stapeln?`, N, `Hela = ${N} kr.`, ["Hur många gånger går det färgade på hela?"], "kr"), { type: "percentbar", pct: p, label: `${part} kr` }); } },
    { id: "doubleWhole", skill: "w7-l7.doubleline", gen: (rng) => { const p = rng.pick([20, 25, 40, 50, 60, 30]); const { N, part } = whole(rng, p, 2, 8); return withVisual(numeric(`dw-${p}-${N}`, "w7-l7.doubleline", `På den dubbla tallinjen motsvarar ${pc(p)} beloppet ${part} kr. Hur mycket motsvarar 100 %?`, N, `100 % = ${N} kr.`, [], "kr"), { type: "doublenumberline", total: N, unit: "kr", hideTotal: true, marks: [{ pct: p, showAmount: true }] }); } },
  ],
  teacher: {
    title: "Framåt eller baklänges?",
    scenarios: ["Teo (åk 6) har fått: ”25 % av ett tal är 15. Vilket är talet?” Han räknar 15 · 0,25 = 3,75 och blir förvirrad när läraren säger att det är fel."],
    prompt: "Förklara för Teo vad hans räkning egentligen ger, varför talet måste vara större än 15, och hur han kan hitta det riktiga talet (och kontrollera det).",
    minChars: 170,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "fel", label: "att 3,75 är 25 % av 15 (framåt, fel håll)", any: ["25 % av 15", "3,75 är", "framåt", "fel håll", "av 15"] },
        { id: "fjard", label: "att 25 % är en fjärdedel / fyra delar", any: ["fjärdedel", "1/4", "fyra delar", "4 delar", "4 gånger"] },
        { id: "svar", label: "rätt svar 60", any: ["60"] },
        { id: "storre", label: "att talet är större än delen 15", any: ["större än 15", "mer än 15", "mindre än 15", "delen", "orimlig"] },
        { id: "kontroll", label: "kontroll: 25 % av 60 = 15", any: ["25 % av 60", "kontroll", "räkna framåt", "15 igen"] },
      ],
    },
    modelAnswer: "Teo, 15 · 0,25 = 3,75 är 25 % av 15, men 15 är redan 25 % av talet, så vi ska räkna åt andra hållet. 25 % är en fjärdedel, så helheten är fyra gånger så stor som 15: 4 · 15 = 60. Talet måste vara större än 15, eftersom 15 bara är en del. Kontrollera: 25 % av 60 är 15. Det stämmer. Rita gärna en stapel med fyra lika delar à 15.",
  },
};

// ───────── Lektion 8: Ökning och minskning ─────────
export const lesson8: Lesson = {
  id: "w7-l8", worldId: "w7", title: "Rabatt och prisökning", grades: "åk 4–6 (fördjupning)",
  summary: "Minska och öka med procent – och varför +20 % och −20 % inte tar ut varandra.",
  lgr: "Tal i procentform och deras användning i vardagliga situationer; proportionalitet. Obs: procentuell förändring nämns inte uttryckligen i centralt innehåll för åk 4–6 – lektionen är en vardagsnära fördjupning.",
  objectives: ["Räkna ut rabatt och nytt pris.", "Se att man betalar (100 − p) % efter p % rabatt.", "Förklara varför ökning och minskning med samma procent inte tar ut varandra."],
  intro: "Rabatter, prishöjningar och avgifter är där de flesta möter procent i verkligheten. **20 % rabatt** betyder inte 20 kr av – det betyder *en femtedel av priset*. Och en av de vanligaste frågorna är om +20 % följt av −20 % tar oss tillbaka. Det gör det inte.",
  theory: [
    { heading: "Rabatt = procent av priset", body: "$20\\,\\%$ rabatt på 250 kr: rabatten är $20\\,\\%$ av 250 $= 50$ kr. Nytt pris $250 - 50 = 200$ kr. Procenten räknas på **det ursprungliga priset**.", visual: { type: "doublenumberline", total: 250, unit: "kr", marks: [{ pct: 20 }, { pct: 80 }] } },
    { heading: "Genväg: betala resten", body: "Efter 20 % rabatt betalar du $80\\,\\%$ av priset: $0{,}8 \\cdot 250 = 200$. Efter $25\\,\\%$ ökning betalar du $125\\,\\%$: $1{,}25 \\cdot N$." },
    { heading: "Prisökning", body: "Ökar priset med $10\\,\\%$ läggs $10\\,\\%$ av priset till: 200 kr → $200 + 20 = 220$ kr (eller $110\\,\\%$ av 200)." },
    { heading: "+20 % och −20 % tar inte ut varandra", body: "$100$ kr $+20\\,\\% = 120$. Sedan $-20\\,\\%$ av **120** (= 24) ger $96$. Procenten räknas på olika helheter (100 respektive 120), så vi hamnar inte på 100." },
  ],
  worked: [
    { title: "Rabatt", problem: "En jacka kostar 250 kr. Det är 20 % rabatt. Vad kostar den?", steps: [{ text: "Rabatten är 20 % av 250.", math: "0{,}2 \\cdot 250 = 50" }, { text: "Nytt pris.", math: "250 - 50 = 200" }, { text: "Kontroll: 80 % av 250.", math: "0{,}8 \\cdot 250 = 200" }], why: "Du sparar en femtedel och betalar fyra femtedelar.", alternative: "10 % = 25 kr, så 20 % = 50 kr." },
    { title: "Upp och ned", problem: "Ett pris på 100 kr höjs med 20 % och sänks sedan med 20 %. Vilket pris får vi?", steps: [{ text: "Höjning:", math: "100 + 20 = 120" }, { text: "Sänkning: 20 % av 120 = 24.", math: "120 - 24 = 96" }], why: "De 20 % räknas på olika helheter (100 och 120).", alternative: "$1{,}2 \\cdot 0{,}8 = 0{,}96$." },
  ],
  drawing: { task: "Rita en procentstapel för 250 kr. Färga 20 % (rabatten) i en färg och 80 % (det du betalar) i en annan. Skriv beloppen.", tool: "numberline" },
  pupils: [{ pupil: "Linn", said: "Först höjs priset med 20 % och sedan sänks det med 20 %. Då är det som förut.", misconception: "Tror att ökning och minskning med samma procent tar ut varandra.", response: "Räkna ett konkret exempel: 100 → 120 → 96. Förklara att procent räknas på nuvarande pris." }],
  knowledge: [
    { id: "discountAmount", skill: "w7-l8.discount", gen: (rng) => { const p = rng.pick([10, 20, 25, 30, 40, 50]); const { N, part } = whole(rng, p, 3, 12); return numeric(`da-${p}-${N}`, "w7-l8.discount", `En vara kostar ${nice(N)} kr. Rabatten är ${pc(p)}. Hur många kronor är rabatten?`, part, `${p} % av ${N} = ${part} kr.`, ["Procent av ordinarie pris."], "kr"); } },
    { id: "newPrice", skill: "w7-l8.discount", gen: (rng) => { const p = rng.pick([10, 20, 25, 30, 40, 50]); const { N, part } = whole(rng, p, 3, 12); return numeric(`np-${p}-${N}`, "w7-l8.discount", `En vara kostar ${nice(N)} kr och sänks med ${pc(p)}. Vad kostar den nu?`, N - part, `${N} − ${part} = ${N - part} kr.`, ["Ta bort rabatten."], "kr"); } },
    { id: "increase", skill: "w7-l8.increase", gen: (rng) => { const p = rng.pick([10, 20, 25, 50]); const { N, part } = whole(rng, p, 3, 12); return numeric(`in-${p}-${N}`, "w7-l8.increase", `Ett pris på ${nice(N)} kr höjs med ${pc(p)}. Vad är det nya priset?`, N + part, `${p} % av ${N} = ${part}; ${N} + ${part} = ${N + part} kr.`, ["Lägg till procenten."], "kr"); } },
    { id: "payPercent", skill: "w7-l8.pay", gen: (rng) => { const p = rng.pick([10, 20, 25, 30, 40, 15]); return numeric(`pp-${p}`, "w7-l8.pay", `Vid ${pc(p)} rabatt betalar du □ % av ordinarie pris.`, 100 - p, `100 % − ${p} % = ${100 - p} %.`, ["Resten betalar du."]); } },
    { id: "upDown", skill: "w7-l8.concept", gen: (rng) => { const p = rng.pick([10, 20, 25, 50]); const up = 100 + p; const downCenti = up * (100 - p); return mc(`ud-${p}`, "w7-l8.concept", `Ett pris på 100 kr höjs med ${pc(p)} och sänks sedan med ${pc(p)}. Hamnar priset på 100 kr igen?`, "Nej – de två procenten räknas på olika belopp", [{ text: `Ja – +${p} % och −${p} % tar ut varandra`, note: "Ta ett konkret exempel: 100 → " + up + " → " + dcTrim(downCenti, 2) + "." }, { text: "Ja – om procenten är samma" }], `100 → ${up} → ${dcTrim(downCenti, 2)} kr. Inte 100.`, ["Räkna steg för steg."], rng); } },
    { id: "wrongSubtract", skill: "w7-l8.concept", gen: (rng) => { const p = rng.pick([10, 20, 25]); const { N, part } = whole(rng, p, 4, 12); return mc(`ws-${p}-${N}`, "w7-l8.concept", `${pc(p)} rabatt på ${N} kr. Vilken beräkning är rätt?`, `${N} − ${part} = ${N - part} kr`, [{ text: `${N} − ${p} = ${N - p} kr`, note: "Du har dragit av procenttalet som kronor." }, { text: `${N} ÷ ${p}` }, { text: `${N} + ${part}` }], `Rabatten är ${p} % av ${N} = ${part} kr.`, ["Procent av vad?"], rng); } },
  ],
  method: [
    { id: "discountSteps", skill: "w7-l8.discount", gen: (rng) => { const p = rng.pick([10, 20, 25, 30, 40, 50]); const { N, part } = whole(rng, p, 3, 12); return multifield(`ds-${p}-${N}`, "w7-l8.discount", `${pc(p)} rabatt på ${nice(N)} kr. Fyll i.`, [{ label: "Rabatt (kr)", accept: [part] }, { label: "Nytt pris (kr)", accept: [N - part] }, { label: "Du betalar (%)", accept: [100 - p] }], `${p} % av ${N} = ${part}; ${N} − ${part} = ${N - part}; betalar ${100 - p} %.`, []); } },
    { id: "increaseSteps", skill: "w7-l8.increase", gen: (rng) => { const p = rng.pick([10, 20, 25, 50]); const { N, part } = whole(rng, p, 3, 12); return multifield(`is-${p}-${N}`, "w7-l8.increase", `Priset ${nice(N)} kr höjs med ${pc(p)}. Fyll i.`, [{ label: "Höjning (kr)", accept: [part] }, { label: "Nytt pris (kr)", accept: [N + part] }, { label: "Nytt pris i % av gamla", accept: [100 + p] }], `${N} + ${part} = ${N + part}; ${100 + p} % av ${N}.`, []); } },
  ],
  representation: [
    { id: "barPay", skill: "w7-l8.bar", gen: (rng) => { const p = rng.pick([10, 20, 25, 30, 40, 50]); const { N } = whole(rng, p, 3, 12); return withVisual(numeric(`bp-${p}-${N}`, "w7-l8.bar", `Hela stapeln är ordinarie pris ${nice(N)} kr. Det färgade är det du betalar efter ${pc(p)} rabatt. Hur många kronor betalar du?`, pctOf(100 - p, N), `${100 - p} % av ${N} = ${pctOf(100 - p, N)} kr.`, [], "kr"), { type: "percentbar", pct: 100 - p, label: `${100 - p} %` }); } },
    { id: "doubleDiscount", skill: "w7-l8.doubleline", gen: (rng) => { const p = rng.pick([20, 25, 40, 50, 10]); const { N, part } = whole(rng, p, 3, 10); return withVisual(numeric(`dd-${p}-${N}`, "w7-l8.doubleline", `Dubbel tallinje: ordinarie pris ${nice(N)} kr = 100 %. Hur många kronor är rabatten (${pc(p)})?`, part, `${p} % av ${N} = ${part}.`, [], "kr"), { type: "doublenumberline", total: N, unit: "kr", marks: [{ pct: p, showAmount: false }] }); } },
  ],
  teacher: {
    title: "+20 % och −20 % tar inte ut varandra",
    scenarios: ["Linn (åk 6) tycker att ett pris som först höjs med 20 % och sedan sänks med 20 % hamnar på samma pris som från början: \"Plus 20 och minus 20 är ju noll.\""],
    prompt: "Förklara för Linn med ett konkret räkneexempel (100 kr) varför priset inte blir 100 kr igen, och vad som är fel i att tänka ”plus 20 och minus 20 är noll”.",
    minChars: 170,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "ex", label: "exemplet 100 → 120 → 96", any: ["120", "96"] },
        { id: "olika", label: "att procenten räknas på olika belopp/helheter", any: ["olika belopp", "olika helheter", "olika tal", "nuvarande pris", "120 kr", "av 120", "helheten ändras"] },
        { id: "tjugo", label: "att 20 % av 120 är 24 (mer än 20 kr)", any: ["24", "20 % av 120"] },
        { id: "fel", label: "att procent inte är samma sak som kronor", any: ["procent är inte kronor", "inte 20 kr", "andel", "procent av", "relativt"] },
        { id: "slut", label: "slutpris 96 kr / 4 kr lägre", any: ["96", "4 kr", "lägre"] },
      ],
    },
    modelAnswer: "Linn, ta ett exempel med 100 kr. En höjning med 20 % ger 100 + 20 = 120 kr. En sänkning med 20 % räknas nu på 120 kr, inte på 100 kr: 20 % av 120 är 24 kr, så priset blir 120 − 24 = 96 kr. Det är 4 kr lägre än från början. Procenten är en andel av det belopp den räknas på, och här är beloppen olika (100 och 120), så ”plus 20 och minus 20” blir inte noll. Procent är inte samma sak som kronor.",
  },
};

// ───────── Lektion 9: Jämföra procent ─────────
export const lesson9: Lesson = {
  id: "w7-l9", worldId: "w7", title: "Jämföra och tolka procent", grades: "åk 4–6",
  summary: "Procent är relativt: helheten avgör – och hur man jämför andelar.",
  lgr: "Tal i procentform och deras samband; proportionalitet; tolkning av data",
  objectives: ["Förstå att procent av olika helheter inte kan jämföras utan helheterna.", "Jämföra andelar med procent.", "Skilja på procent och procentenheter."],
  intro: "”20 % är ju mer än 10 %!” – men $20\\,\\%$ av 50 är *mindre* än $10\\,\\%$ av 500. Procent säger hur stor andel, inte hur mycket. Den som jämför procent utan att veta helheterna gör ofta fel. Procent är dock ett utmärkt sätt att jämföra **andelar** av olika stora grupper.",
  theory: [
    { heading: "Procent beror på helheten", body: "$20\\,\\%$ av 50 $= 10$ men $10\\,\\%$ av 500 $= 50$. Det större procenttalet ger inte alltid det större antalet." },
    { heading: "Jämföra andelar med procent", body: "Klass A: 9 av 25 elever är med i orkestern. Klass B: 12 av 40. Vilken klass har störst *andel*? A: $\\frac{9}{25} = 36\\,\\%$. B: $\\frac{12}{40} = 30\\,\\%$. A har störst andel, fast B har fler elever i orkestern.", visual: { type: "percentbar", pct: 36, label: "A: 36 %" } },
    { heading: "Procentenheter", body: "Går andelen från $30\\,\\%$ till $36\\,\\%$ har den ökat med $6$ **procentenheter** (36 − 30). Man säger inte ”6 procent” – för det skulle vara 6 % av 30 %, alltså 1,8 procentenheter." },
    { heading: "Läs rubriken noga", body: "När en tidning skriver ”40 procent” – 40 procent av vad? Fråga alltid efter helheten." },
  ],
  worked: [
    { title: "Olika helheter", problem: "Vad är mest: 20 % av 50 eller 10 % av 500?", steps: [{ text: "20 % av 50:", math: "0{,}2 \\cdot 50 = 10" }, { text: "10 % av 500:", math: "0{,}1 \\cdot 500 = 50" }, { text: "Slutsats:", math: "50 > 10" }], why: "Helheten 500 är 10 gånger större, vilket väger tyngre än att procenttalet är hälften så stort.", alternative: "Överslag: 10 % av 500 är ett jättestort belopp jämfört med 20 % av 50." },
    { title: "Jämföra andelar", problem: "Klass A: 9 av 25. Klass B: 12 av 40. Vilken har störst andel?", steps: [{ text: "A: 9/25, förläng med 4.", math: "\\frac{36}{100} = 36\\,\\%" }, { text: "B: 12/40 = 3/10.", math: "30\\,\\%" }, { text: "A har högst andel.", math: "36\\,\\% > 30\\,\\%" }], why: "Procent gör olika stora grupper jämförbara.", alternative: "Decimaltal: 9 ÷ 25 = 0,36 och 12 ÷ 40 = 0,3." },
  ],
  drawing: { task: "Rita två procentstaplar (A: 36 %, B: 30 %). Skriv hur många av 25 respektive 40 elever det motsvarar.", tool: "numberline" },
  pupils: [{ pupil: "Rasmus", said: "20 % av 50 är mer än 10 % av 500, för 20 är mer än 10.", misconception: "Jämför procenttalen utan att ta hänsyn till helheterna.", response: "Låt Rasmus räkna ut båda: 10 och 50. Fråga: ”Vad är en procent värd i vart och ett av fallen?”" }],
  knowledge: [
    { id: "differentWholes", skill: "w7-l9.wholes", gen: (rng) => { const p1 = rng.pick([20, 25, 30, 40, 50]); const a = baseFor(p1, rng.int(1, 3) * 5); const p2 = rng.pick([5, 10]); let b = baseFor(p2, rng.int(30, 60)); const v1 = pctOf(p1, a); if (pctOf(p2, b) === v1) b += 100; const v2 = pctOf(p2, b); const t1 = `${pc(p1)} av ${nice(a)}`, t2 = `${pc(p2)} av ${nice(b)}`; return mc(`dw-${p1}-${a}-${b}`, "w7-l9.wholes", `Vad är mest: ${t1} eller ${t2}?`, v2 > v1 ? t2 : t1, [{ text: v2 > v1 ? t1 : t2, note: "Du har jämfört procenttalen – titta på helheterna." }, { text: "De är lika mycket" }], `${t1} = ${v1} och ${t2} = ${v2}.`, ["Räkna ut båda."], rng); } },
    { id: "shares", skill: "w7-l9.shares", gen: (rng) => { const pA = rng.pick([36, 44, 28, 32]); let pB = rng.pick([30, 40, 35, 25]); if (pA === pB) pB += 5; const nA = 25, nB = 40; if ((pA * nA) % 100 !== 0 || (pB * nB) % 100 !== 0) return numeric("sh-x", "w7-l9.shares", "9 av 25 är hur många procent?", 36, "9/25 = 36 %.", []); return mc(`sr-${pA}-${pB}`, "w7-l9.shares", `Klass A: ${pctOf(pA, nA)} av ${nA} elever. Klass B: ${pctOf(pB, nB)} av ${nB} elever. Vilken klass har störst andel?`, pA > pB ? "Klass A" : "Klass B", [{ text: pA > pB ? "Klass B" : "Klass A", note: "Jämför andelarna i procent, inte antalet." }, { text: "Lika stor andel" }], `A: ${pA} %, B: ${pB} %.`, ["Gör om båda till procent."], rng); } },
    { id: "pctUnits", skill: "w7-l9.units", gen: (rng) => { const a = rng.int(20, 60), d = rng.int(3, 15); return numeric(`pu-${a}-${d}`, "w7-l9.units", `Andelen ökar från ${pc(a)} till ${pc(a + d)}. Hur många procentenheter har den ökat?`, d, `${a + d} − ${a} = ${d} procentenheter.`, ["Subtrahera procenttalen."]); } },
    { id: "diffAmount", skill: "w7-l9.compare", gen: (rng) => { const N = 20 * rng.int(2, 15); const a = rng.pick([20, 30, 40, 50]), b = rng.pick([10, 15, 5]); const dp = pctOf(a, N) - pctOf(b, N); return numeric(`df-${N}-${a}-${b}`, "w7-l9.compare", `Hur många kronor mer är ${pc(a)} av ${nice(N)} kr än ${pc(b)} av ${nice(N)} kr?`, dp, `${pctOf(a, N)} − ${pctOf(b, N)} = ${dp}.`, ["Räkna ut båda."], "kr"); } },
    { id: "whichMc", skill: "w7-l9.concept", gen: (rng) => mc("wc", "w7-l9.concept", "Kan man jämföra 20 % av en grupp med 30 % av en annan grupp genom att bara jämföra procenttalen?", "Nej – man måste veta hur stora grupperna är", [{ text: "Ja – 30 % är alltid mer än 20 %" }, { text: "Ja – om båda är över 10 %" }], "Procent är en andel – antalet beror på helheten.", ["Vad är 30 % av 10 och 20 % av 100?"], rng) },
  ],
  method: [
    { id: "compareFields", skill: "w7-l9.shares", gen: (rng) => { const opts: [number, number, number, number][] = [[9, 25, 12, 40], [14, 20, 20, 25], [6, 10, 22, 40], [15, 20, 18, 25], [7, 20, 8, 25]]; const [a, na, b, nb] = rng.pick(opts); const pa = (a * 100) / na, pb = (b * 100) / nb; return multifield(`cf-${a}-${b}`, "w7-l9.shares", `Klass A: ${a} av ${na}. Klass B: ${b} av ${nb}. Fyll i.`, [{ label: "A:s andel (%)", accept: [pa] }, { label: "B:s andel (%)", accept: [pb] }, { label: "Störst andel (1 = A, 2 = B)", accept: [pa > pb ? 1 : 2] }], `A: ${pa} %, B: ${pb} %.`, ["Förläng till hundradelar."]); } },
    { id: "amounts", skill: "w7-l9.wholes", gen: (rng) => { const p1 = rng.pick([20, 40]), a = baseFor(p1, rng.int(1, 3) * 5), p2 = p1 / 2, b = a * 8; return multifield(`am-${p1}-${a}`, "w7-l9.wholes", `Jämför ${pc(p1)} av ${nice(a)} och ${pc(p2)} av ${nice(b)}.`, [{ label: `${pc(p1)} av ${nice(a)}`, accept: [pctOf(p1, a)] }, { label: `${pc(p2)} av ${nice(b)}`, accept: [pctOf(p2, b)] }, { label: "Störst (1 eller 2)", accept: [pctOf(p2, b) > pctOf(p1, a) ? 2 : 1] }], `${pctOf(p1, a)} mot ${pctOf(p2, b)}.`, []); } },
  ],
  representation: [
    { id: "barsMc", skill: "w7-l9.bars", gen: (rng) => { const pa = rng.pick([36, 44, 52]), pb = rng.pick([30, 28, 40]); return withVisual(mc(`bm-${pa}-${pb}`, "w7-l9.bars", "Båda staplarna står för en hel grupp (100 %). Vilken grupp har störst andel?", pa > pb ? "Den övre (A)" : "Den nedre (B)", [{ text: pa > pb ? "Den nedre (B)" : "Den övre (A)" }, { text: "Samma andel" }], `A: ${pa} %, B: ${pb} %.`, ["Jämför det färgades längd."], rng), { type: "fractionbars", bars: [{ parts: 100, shaded: pa, label: `A: ${pa} %` }, { parts: 100, shaded: pb, label: `B: ${pb} %` }] }); } },
    { id: "markShare", skill: "w7-l9.numberline", gen: (rng) => { const opts: [number, number][] = [[12, 40], [14, 20], [6, 10], [15, 20], [7, 20], [9, 20], [3, 4]]; const [a, n] = rng.pick(opts); const p = (a * 100) / n; return numberlineEx(`ms-${a}-${n}`, "w7-l9.numberline", `${a} av ${n} elever. Markera andelen i procent på tallinjen.`, p, { min: 0, max: 100, step: 5, labelEvery: 25, unit: "%" }, `${a}/${n} = ${p} %.`, []); } },
  ],
  teacher: {
    title: "Procent av olika helheter",
    scenarios: ["Rasmus (åk 6) säger att 20 % av 50 kr är mer än 10 % av 500 kr, \"eftersom 20 är mer än 10\"."],
    prompt: "Förklara för Rasmus varför det inte räcker att jämföra procenttalen, och visa hur du jämför de två beloppen. Ge också ett exempel där procent används för att jämföra *andelar* i olika stora grupper.",
    minChars: 170,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "helhet", label: "att helheten spelar roll / procent är en andel", any: ["helheten", "helheter", "andel", "olika stora", "av vad"] },
        { id: "tio", label: "20 % av 50 = 10", any: ["10 kr", "= 10", "är 10"] },
        { id: "femtio", label: "10 % av 500 = 50", any: ["50 kr", "= 50", "är 50"] },
        { id: "svar", label: "slutsats: 10 % av 500 är mest", any: ["10 % av 500 är mer", "500 är mest", "10 % av 500 är störst", "mer är 10 % av 500", "10 % av 500"] },
        { id: "andel", label: "ett exempel på jämförelse av andelar (klasser, grupper)", any: ["klass", "grupp", "andelen", "andelar", "elever", "jämföra olika"] },
      ],
    },
    modelAnswer: "Rasmus, procent är en andel av en helhet, så man måste veta vad man tar procent av. 20 % av 50 kr är 10 kr. 10 % av 500 kr är 50 kr. Alltså är 10 % av 500 mer, trots att procenttalet är mindre, eftersom helheten är tio gånger större. Procent är däremot bra när man ska jämföra andelar i olika stora grupper: om 9 av 25 elever i klass A och 12 av 40 i klass B är med i orkestern, är det 36 % mot 30 %, så klass A har störst andel.",
  },
};

// ───────── Lektion 10: Procent i vardagen ─────────
export const lesson10: Lesson = {
  id: "w7-l10", worldId: "w7", title: "Procent i vardagen – välj rätt metod", grades: "åk 4–6",
  summary: "Moms, ränta, provresultat och textuppgifter: avgör vad som söks.",
  lgr: "Hur tal i procentform kan användas i vardagliga situationer; strategier för att lösa matematiska problem",
  objectives: ["Avgöra om en textuppgift söker delen, andelen eller helheten.", "Räkna moms, ränta och provresultat.", "Välja metod och kontrollera rimlighet."],
  intro: "Nästan varje procentuppgift är en av **tre frågor**: *Hur mycket är p % av helheten?* (delen), *Hur många procent är delen?* (andelen), eller *Vad är helheten?* Att avgöra vilken som ställs är halva jobbet. Den här lektionen binder ihop allt du lärt dig.",
  theory: [
    { heading: "Tre frågor, tre räkningar", body: "- **Delen söks:** helhet · p/100 (ex. 25 % moms på 80 kr).\n\n- **Andelen söks:** del ÷ helhet, gånger 100 (ex. 18 av 24 rätt).\n\n- **Helheten söks:** dela med p/100 – eller via 1 % / 10 % (ex. rabatten 30 kr = 20 %).", visual: { type: "percentbar", pct: 25, label: "25 %" } },
    { heading: "Moms", body: "Moms 25 % på 80 kr: momsen är $25\\,\\%$ av 80 $= 20$ kr. Pris med moms $80 + 20 = 100$ kr (eller $125\\,\\%$ av 80)." },
    { heading: "Enkel ränta", body: "Ränta 3 % per år på 2 000 kr: $3\\,\\%$ av 2 000 $= 60$ kr efter ett år. Räntan är en procentdel av beloppet." },
    { heading: "Rimlighet och kontroll", body: "Fråga alltid: *Ska svaret vara större eller mindre än helheten?* Kontrollera genom att räkna åt andra hållet." },
  ],
  worked: [
    { title: "Moms", problem: "En tröja kostar 200 kr utan moms. Momsen är 25 %. Vad kostar den med moms?", steps: [{ text: "Moms = 25 % av 200.", math: "200 \\div 4 = 50" }, { text: "Pris med moms.", math: "200 + 50 = 250" }], why: "Delen söks: procent av helheten.", alternative: "$125\\,\\%$ av 200 = 1,25 · 200 = 250." },
    { title: "Välj fråga", problem: "Sara hade 18 av 24 rätt. Vilken räkning ger andelen i procent?", steps: [{ text: "Andelen söks: del ÷ helhet.", math: "18 \\div 24 = 0{,}75" }, { text: "Gånger 100.", math: "75\\,\\%" }], why: "Vi har delen (18) och helheten (24), och söker procenten.", alternative: "$\\frac{18}{24} = \\frac{3}{4} = 75\\,\\%$." },
  ],
  drawing: { task: "Rita ett hundrarutnät och färga Saras resultat på provet (18 av 24 rätt). Hur många rutor färgade du, och vilken procent är det?", tool: "hundredgrid" },
  pupils: [{ pupil: "Elin", said: "20 % rabatt på 250 kr: 250 − 20 = 230 kr.", misconception: "Drar av procenttalet som kronor i stället för att räkna procent av priset.", response: "Fråga: ”20 av vad?” 20 % av 250 är 50 kr, inte 20 kr. Visa 10 % = 25 kr." }],
  knowledge: [
    { id: "vat", skill: "w7-l10.vat", gen: (rng) => { const N = rng.int(2, 25) * 4; return numeric(`vt-${N}`, "w7-l10.vat", `En vara kostar ${N} kr utan moms. Moms är 25 %. Vad kostar den med moms?`, N + N / 4, `Moms ${N / 4} kr; ${N} + ${N / 4} = ${N + N / 4} kr.`, ["25 % = en fjärdedel."], "kr"); } },
    { id: "interest", skill: "w7-l10.interest", gen: (rng) => { const p = rng.pick([2, 3, 4, 5]); const N = rng.int(2, 20) * 500; return numeric(`it-${p}-${N}`, "w7-l10.interest", `Räntan är ${pc(p)} per år på ${nice(N)} kr. Hur stor är räntan efter ett år?`, pctOf(p, N), `${p} % av ${N} = ${pctOf(p, N)} kr.`, ["Procent av beloppet."], "kr"); } },
    { id: "testPct", skill: "w7-l10.share", gen: (rng) => { const N = rng.pick([20, 25, 40, 50]); const p = rng.pick([40, 60, 70, 75, 80, 85, 90].filter((x) => (x * N) % 100 === 0)); return numeric(`tp-${N}-${p}`, "w7-l10.share", `Elin fick ${pctOf(p, N)} poäng av ${N}. Hur många procent är det?`, p, `${pctOf(p, N)}/${N} = ${p} %.`, ["Andelen söks."]); } },
    { id: "typeMc", skill: "w7-l10.type", gen: (rng) => { const kind = rng.pick(["part", "share", "whole"] as const); const q = { part: ["Hur mycket är 35 % av 240 kr?", "Delen söks"], share: ["Hur många procent är 15 av 60?", "Andelen söks"], whole: ["30 kr är 20 % av priset. Vad är priset?", "Helheten söks"] }[kind]; const all = ["Delen söks", "Andelen söks", "Helheten söks"]; return mc(`ty-${kind}`, "w7-l10.type", `Vad söks här? ${q[0]}`, q[1], all.filter((x) => x !== q[1]).map((text) => ({ text })), kind === "part" ? "Helheten och procenten är kända – delen söks." : kind === "share" ? "Delen och helheten är kända – andelen söks." : "Delen och procenten är kända – helheten söks.", ["Vilka två saker är kända?"], rng); } },
    { id: "share", skill: "w7-l10.share", gen: (rng) => { const N = rng.pick([20, 40]); const p = rng.pick([15, 25, 35, 45, 55, 65].filter((x) => (x * N) % 100 === 0)); return mc(`sx-${N}-${p}`, "w7-l10.share", `Vilken räkning ger hur många procent ${pctOf(p, N)} är av ${N}?`, `${pctOf(p, N)} ÷ ${N} · 100`, [{ text: `${N} ÷ ${pctOf(p, N)} · 100`, note: "Helheten ska stå i nämnaren (delas med)." }, { text: `${pctOf(p, N)} · ${N} ÷ 100` }, { text: `${N} − ${pctOf(p, N)}` }], "Del genom helhet, gånger 100.", ["Del ÷ helhet."], rng); } },
    { id: "wholeWord", skill: "w7-l10.whole", gen: (rng) => { const p = rng.pick([20, 25, 40, 50, 30]); const { N, part } = whole(rng, p, 3, 10); return numeric(`ww-${p}-${N}`, "w7-l10.whole", `Anna har sparat ${part} kr. Det är ${pc(p)} av vad hon behöver till en cykel. Vad kostar cykeln?`, N, `${p} % = ${part}; 100 % = ${N}.`, ["Helheten söks."], "kr"); } },
  ],
  method: [
    { id: "vatSteps", skill: "w7-l10.vat", gen: (rng) => { const N = rng.int(2, 25) * 4; return multifield(`vs-${N}`, "w7-l10.vat", `${N} kr utan moms, 25 % moms. Fyll i.`, [{ label: "Moms (kr)", accept: [N / 4] }, { label: "Pris med moms (kr)", accept: [N + N / 4] }, { label: "Pris med moms i % av priset utan moms", accept: [125] }], `${N / 4} kr moms; ${N + N / 4} kr totalt = 125 %.`, []); } },
    { id: "wordSteps", skill: "w7-l10.type", gen: (rng) => { const N = rng.pick([20, 25, 40, 50]); const p = rng.pick([40, 60, 70, 75, 80, 90, 25].filter((x) => (x * N) % 100 === 0)); const part = pctOf(p, N); return multifield(`wd-${N}-${p}`, "w7-l10.type", `I en skola med ${N} elever går ${part} i åk 6. Fyll i.`, [{ label: "Helheten", accept: [N] }, { label: "Delen", accept: [part] }, { label: "Andel i procent", accept: [p] }], `${part}/${N} = ${p} %.`, ["Vad är helheten och vad är delen?"]); } },
  ],
  representation: [
    { id: "shadeTest", skill: "w7-l10.shade", gen: (rng) => { const N = rng.pick([20, 25, 40, 50]); const p = rng.pick([40, 60, 70, 75, 80, 90, 25, 50].filter((x) => (x * N) % 100 === 0)); const part = pctOf(p, N); return gridshadeEx(`st-${N}-${p}`, "w7-l10.shade", `Lisa fick ${part} poäng av ${N} på ett prov. Färglägg hennes resultat på rutnätet (100 rutor = 100 %).`, p, `${part}/${N} = ${p} %.`, ["Hur många procent är " + part + " av " + N + "?"]); } },
    { id: "barVat", skill: "w7-l10.bar", gen: (rng) => { const N = rng.int(2, 25) * 4; return withVisual(numeric(`bv-${N}`, "w7-l10.bar", `Stapeln visar priset ${N} kr utan moms som 100 %. Momsen är 25 %. Hur många kronor är momsen?`, N / 4, `25 % av ${N} = ${N / 4}.`, [], "kr"), { type: "percentbar", pct: 25, label: "moms 25 %" }); } },
  ],
  teacher: {
    title: "20 % rabatt är inte 20 kr",
    scenarios: ["Elin (åk 5) ska räkna ut priset på en jacka som kostar 250 kr och har 20 % rabatt. Hon svarar 230 kr: \"250 minus 20.\""],
    prompt: "Förklara för Elin vad som är fel i hennes räkning, hur man räknar ut rätt pris, och hur hon själv kan kontrollera sitt svar med en rimlighetsbedömning.",
    minChars: 170,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "procent", label: "att 20 % är 20 av 100 / en andel av priset (inte 20 kr)", any: ["20 % av 250", "andel", "inte 20 kr", "en femtedel", "av priset"] },
        { id: "femtio", label: "rabatten är 50 kr", any: ["50 kr", "50 kronor", "= 50"] },
        { id: "svar", label: "rätt pris 200 kr", any: ["200 kr", "200 kronor", "= 200"] },
        { id: "rimlig", label: "rimlighet/kontroll (10 % = 25, 80 % betalar du)", any: ["10 %", "25 kr", "80 %", "rimlig", "kontroll"] },
        { id: "helhet", label: "att man tar procent av helheten 250", any: ["250", "helheten", "ursprungliga priset", "ordinarie pris"] },
      ],
    },
    modelAnswer: "Elin, 20 % rabatt betyder att du får 20 % av priset, inte 20 kronor. 20 % är en femtedel, så rabatten är 20 % av 250 kr = 50 kr. Priset blir 250 − 50 = 200 kr. Du kan kontrollera: 10 % av 250 är 25 kr, så 20 % är 50 kr, och du betalar 80 % av 250, vilket också blir 200 kr. Din 230 kr skulle motsvara en rabatt på bara 8 % – det är rimligt att ifrågasätta om det kan vara rätt.",
  },
};
