import type { Lesson } from "../types";
import { mc, numeric, multifield, withVisual, numberlineEx, fractionbarEx, tf, gcd, dc, dcTrim, dcAcc } from "@/lib/engine/gen-helpers";

const T = (n: number, dp: number) => dcTrim(n, dp);
const m = (n: number, d: number) => `$${tf(n, d)}$`;

// ───────── Lektion 5: Multiplikation och division med 10, 100, 1 000 ─────────
export const lesson5: Lesson = {
  id: "w6-l5", worldId: "w6", title: "Gånger och delat med 10, 100 och 1 000", grades: "åk 4–6",
  summary: "Siffrorna flyttar plats – nollregeln fungerar inte för decimaltal.",
  lgr: "Positionssystemet för hela tal och tal i decimalform; metoder för beräkningar vid huvudräkning",
  objectives: ["Multiplicera och dividera decimaltal med 10, 100 och 1 000.", "Förklara att siffrorna flyttar plats (inte att man ”lägger till nollor”).", "Koppla till bråk och platsvärde."],
  intro: "I Värld 1 lärde du dig att $5 \\cdot 10 = 50$ för att siffran flyttar en plats åt vänster. Nu får den idén sitt verkliga test: $2{,}5 \\cdot 10 = 25$. Här finns ingen nolla att lägga till – och regeln ”lägg till en nolla” ger det felaktiga svaret $2{,}50$.",
  theory: [
    { heading: "Tio gånger större", body: "Varje plats är tio gånger mer värd än platsen till höger. När ett tal multipliceras med 10 flyttar **siffrorna en plats åt vänster**: $2{,}5 \\cdot 10$: 2 ental blir 2 tiotal, 5 tiondelar blir 5 ental. Svaret är $25$.", visual: { type: "decimalplace", value: "2,5" } },
    { heading: "Tio gånger mindre", body: "Vid division med 10 flyttar siffrorna en plats åt höger: $56 \\div 10 = 5{,}6$ och $56 \\div 100 = 0{,}56$. Tomma platser fylls med nollor: $4 \\div 100 = 0{,}04$." },
    { heading: "Antal nollor = antal platser", body: "$\\cdot 10$ flyttar 1 plats, $\\cdot 100$ flyttar 2 platser, $\\cdot 1\\,000$ flyttar 3 platser. Division flyttar åt andra hållet." },
    { heading: "Varför ”lägg till en nolla” är farligt", body: "Regeln fungerar för heltal ($7 \\cdot 10 = 70$) men blir fel för decimaltal ($0{,}7 \\cdot 10 = 7$, inte $0{,}70$). Elever som lärt sig reglen utan förklaring gör ofta felet. Förklaringen med platsvärde fungerar *alltid*." },
  ],
  worked: [
    { title: "Multiplicera med 100", problem: "Beräkna 3,45 · 100.", steps: [{ text: "Siffrorna flyttar 2 platser åt vänster.", math: "3{,}45 \\to 345" }, { text: "Svar:", math: "345" }], why: "3 ental blir 3 hundratal, 4 tiondelar blir 4 tiotal, 5 hundradelar blir 5 ental.", alternative: "3,45 är 345 hundradelar; 100 gånger så mycket är 345 hela." },
    { title: "Dividera med 100", problem: "Beräkna 56 ÷ 100.", steps: [{ text: "Siffrorna flyttar 2 platser åt höger.", math: "56 \\to 0{,}56" }, { text: "Kontroll:", math: "0{,}56 \\cdot 100 = 56" }], why: "56 delat i 100 delar ger 56 hundradelar.", alternative: "56 ÷ 100 = 56/100 = 0,56." },
  ],
  drawing: { task: "Rita en platsvärdestabell med ental, tiondelar och hundradelar. Skriv 2,5 och visa hur siffrorna flyttar när du multiplicerar med 10.", tool: "grid" },
  pupils: [{ pupil: "Noa", said: "2,5 · 10 = 2,50. Man lägger bara till en nolla.", misconception: "Tillämpar heltalsregeln ”lägg till en nolla” på ett decimaltal.", response: "Visa att 2,50 är samma tal som 2,5. Låt Noa lägga i en platsvärdestabell: siffrorna flyttar och 25 blir svaret." }],
  knowledge: [
    { id: "mul", skill: "w6-l5.multiply", gen: (rng, { level }) => { const dp = rng.int(1, 2), X = rng.int(11, 999), k = rng.pick(level > 1 ? [10, 100, 1000] : [10, 100]); return numeric(`mu-${X}-${dp}-${k}`, "w6-l5.multiply", `${dc(X, dp)} · ${k.toLocaleString("sv-SE").replace(/ | /g, " ")} = ?`, dcAcc(X * k, dp), `Siffrorna flyttar ${String(k).length - 1} plats(er) åt vänster: ${T(X * k, dp)}.`, ["Flytta siffrorna – lägg inte till nollor."]); } },
    { id: "div", skill: "w6-l5.divide", gen: (rng) => { const N = rng.int(3, 999), k = rng.pick([1, 2, 3]); const kk = 10 ** k; return numeric(`dv-${N}-${k}`, "w6-l5.divide", `${N} ÷ ${kk} = ?`, dcAcc(N, k), `Siffrorna flyttar ${k} plats(er) åt höger: ${T(N, k)}.`, ["Flytta siffrorna åt höger."]); } },
    { id: "divDec", skill: "w6-l5.divide", gen: (rng) => { const X = rng.int(11, 99), k = rng.pick([10, 100]); const dp = 1 + String(k).length - 1; return numeric(`dd-${X}-${k}`, "w6-l5.divide", `${dc(X, 1)} ÷ ${k} = ?`, dcAcc(X, dp), `${dc(X, 1)} ÷ ${k}: siffrorna flyttar ${String(k).length - 1} plats(er) åt höger: ${T(X, dp)}.`, ["Siffrorna flyttar åt höger."]); } },
    { id: "missingFactor", skill: "w6-l5.missing", gen: (rng) => { const dp = rng.int(1, 2), X = rng.int(11, 99); return numeric(`mf-${X}-${dp}`, "w6-l5.missing", `${dc(X, dp)} · □ = ${X}`, 10 ** dp, `${X} är ${10 ** dp} gånger större än ${dc(X, dp)}.`, ["Hur många platser flyttar siffrorna?"]); } },
    { id: "whyMc", skill: "w6-l5.concept", gen: (rng) => mc("wm", "w6-l5.concept", "Varför är 2,5 · 10 = 25 och inte 2,50?", "Siffrorna flyttar en plats åt vänster: 5 tiondelar blir 5 ental", [{ text: "Man lägger bara till en nolla", note: "Nollregeln ger 2,50 – det är samma tal som 2,5." }, { text: "Man flyttar bara kommat – siffrorna står kvar" }, { text: "För att 2,5 + 10 = 25" }], "Varje siffra blir tio gånger mer värd och flyttar en plats åt vänster.", ["Vad händer med platsvärdet?"], rng) },
  ],
  method: [
    { id: "shiftMul", skill: "w6-l5.multiply", gen: (rng) => { const dp = 2, X = rng.int(111, 999), k = rng.pick([10, 100]); return multifield(`sm-${X}-${k}`, "w6-l5.multiply", `Beräkna ${dc(X, dp)} · ${k}.`, [{ label: "Antal platser siffrorna flyttar åt vänster", accept: [String(k).length - 1] }, { label: "Resultat", accept: dcAcc(X * k, dp) }], `${T(X * k, dp)}.`, ["Antalet nollor i " + k + "."]); } },
    { id: "shiftDiv", skill: "w6-l5.divide", gen: (rng) => { const N = rng.int(11, 999), k = rng.pick([1, 2]); return multifield(`sd-${N}-${k}`, "w6-l5.divide", `Beräkna ${N} ÷ ${10 ** k}.`, [{ label: "Antal platser siffrorna flyttar åt höger", accept: [k] }, { label: "Resultat", accept: dcAcc(N, k) }], `${T(N, k)}.`, []); } },
  ],
  representation: [
    { id: "numberlineMul", skill: "w6-l5.numberline", gen: (rng) => { const k = rng.int(1, 9); return numberlineEx(`nm-${k}`, "w6-l5.numberline", `Markera 0,${k} · 10 på tallinjen (varje streck är 1).`, k, { min: 0, max: 10, step: 1, labelEvery: 5 }, `0,${k} · 10 = ${k}.`, ["Flytta siffran en plats åt vänster."]); } },
    { id: "numberlineDiv", skill: "w6-l5.numberline", gen: (rng) => { const k = rng.int(1, 9); return numberlineEx(`nd-${k}`, "w6-l5.numberline", `Markera ${k * 10} ÷ 100 på tallinjen (varje streck är 0,1).`, k, { min: 0, max: 10, step: 1, labelEvery: 5, dp: 1 }, `${k * 10} ÷ 100 = 0,${k}.`, ["Flytta siffrorna två platser åt höger."]); } },
    { id: "tableShift", skill: "w6-l5.table", gen: (rng) => { const t = rng.int(1, 9), h = rng.int(1, 9); const v = `${rng.int(1, 9)},${t}${h}`; const n = Number(v.replace(",", "")); return withVisual(multifield(`ts-${v}`, "w6-l5.table", `Bilden visar ${v}. Vad blir ${v} · 100?`, [{ label: "Antal platser åt vänster", accept: [2] }, { label: "Resultat", accept: [n] }], `${v} · 100 = ${n}.`, []), { type: "decimalplace", value: v }); } },
  ],
  teacher: {
    title: "Mer än ”lägg till en nolla”",
    scenarios: ["Noa (åk 5) räknar 2,5 · 10 och svarar 2,50: \"Man lägger bara till en nolla när man gånger 10.\" Hen visar sin tabell där alla heltal blir till tiotal på det sättet."],
    prompt: "Förklara för Noa varför svaret är 25 och inte 2,50, och vad som egentligen händer med siffrorna när man multiplicerar med 10. Varför är regeln ”lägg till en nolla” riskabel?",
    minChars: 170,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "flytta", label: "att siffrorna flyttar en plats åt vänster", any: ["flyttar", "flytt", "en plats åt vänster", "plats åt vänster"] },
        { id: "tio", label: "att varje plats är tio gånger mer värd", any: ["tio gånger", "10 gånger", "tio gånger mer", "tio gånger större"] },
        { id: "samma", label: "att 2,50 är samma tal som 2,5 (nollan ändrar inget)", any: ["samma tal", "2,50 är", "lika mycket", "ändrar inte", "ändras inte"] },
        { id: "svar", label: "rätt svar 25", any: ["25"] },
        { id: "regel", label: "att nollregeln bara fungerar för heltal / saknar förklaring", any: ["heltal", "regeln", "nollregel", "lägga till en nolla", "fungerar inte"] },
      ],
    },
    modelAnswer: "Noa, när vi multiplicerar med 10 blir varje siffra tio gånger mer värd och flyttar en plats åt vänster. I 2,5 är 2 ental och 5 tiondelar. Efter · 10 är 2 tiotal och 5 ental, alltså 25. Din 2,50 är samma tal som 2,5 – en nolla sist ändrar ingenting – så den kan inte vara tio gånger större. Regeln ”lägg till en nolla” fungerar bara för heltal och ger fel för decimaltal. Därför är det bättre att förstå att siffrorna flyttar plats.",
  },
};

// ───────── Lektion 6: Avrunda decimaltal ─────────
const rnd = (X: number, drop: number) => Math.floor(X / 10 ** drop + 0.5); // round half up; result in units of 10^drop

export const lesson6: Lesson = {
  id: "w6-l6", worldId: "w6", title: "Avrunda decimaltal och överslag", grades: "åk 4–6",
  summary: "Avrunda till heltal, tiondelar och hundradelar – och räkna överslag.",
  lgr: "Positionssystemet för tal i decimalform; överslagsräkning; rimlighetsbedömning",
  objectives: ["Avrunda decimaltal till närmaste heltal, tiondel och hundradel.", "Förklara avrundning med tallinjen.", "Göra överslag med decimaltal."],
  intro: "Avrundning av decimaltal är samma idé som i Värld 1: **vilket tal på tallinjen ligger närmast?** Men det blir också ett nytt problem: $4{,}96$ avrundat till tiondelar är $5{,}0$ – och hela talets siffror ändras.",
  theory: [
    { heading: "Titta på grannsiffran", body: "Avrunda $3{,}47$ till närmaste tiondel: tiondelssiffran är 4, grannsiffran (hundradelar) är 7. 5–9 avrundar uppåt: $3{,}5$. Är grannsiffran 0–4 behåller vi siffran och stryker resten.", visual: { type: "numberline", min: 30, max: 40, step: 1, marks: [34, 35], labelEvery: 5, dp: 1 } },
    { heading: "Heltal och hundradelar", body: "Till närmaste heltal tittar vi på tiondelssiffran: $6{,}4 \\approx 6$, $6{,}5 \\approx 7$. Till hundradelar tittar vi på tusendelssiffran: $2{,}346 \\approx 2{,}35$." },
    { heading: "När nian rullar över", body: "$4{,}96$ till tiondelar: 9 tiondelar + 1 = 10 tiondelar = 1 hel. Resultatet är $5{,}0$ (som är $5$). Vi *skriver* gärna $5{,}0$ för att visa att vi avrundat till tiondelar." },
    { heading: "Överslag", body: "$4{,}9 + 3{,}2 \\approx 5 + 3 = 8$. I affären: $19{,}90 \\approx 20$ kronor. Överslag hjälper att kontrollera svar." },
  ],
  worked: [
    { title: "Till närmaste tiondel", problem: "Avrunda 3,47 till närmaste tiondel.", steps: [{ text: "Tiondelssiffran är 4, grannsiffran (hundradelar) är 7.", math: "3{,}\\underline{4}7" }, { text: "7 är 5 eller mer – avrunda uppåt: 4 tiondelar blir 5.", math: "3{,}5" }], why: "3,47 ligger mellan 3,4 och 3,5, och är närmare 3,5.", alternative: "Mitten mellan 3,4 och 3,5 är 3,45. 3,47 ligger över mitten." },
    { title: "Rullar över", problem: "Avrunda 4,96 till närmaste tiondel.", steps: [{ text: "Grannsiffran 6 → uppåt: 9 tiondelar + 1 = 10 tiondelar.", math: "4{,}9 + 0{,}1" }, { text: "10 tiondelar är 1 hel.", math: "5{,}0" }], why: "4,96 ligger mellan 4,9 och 5,0, närmast 5,0.", alternative: "Avstånd: 5,0 − 4,96 = 0,04 och 4,96 − 4,9 = 0,06." },
  ],
  drawing: { task: "Rita en tallinje från 3,0 till 4,0 med steg om 0,1. Markera 3,47 och visa vilket tiondelstal den avrundas till.", tool: "numberline" },
  pupils: [{ pupil: "Maria", said: "4,96 avrundat till tiondelar är 4,10. Nian blir en tia.", misconception: "Skriver tio tiondelar bredvid siffran i stället för att föra över till nästa plats.", response: "Rita tallinjen 4,9–5,0: 4,96 ligger närmast 5,0. Förklara att 10 tiondelar är 1 hel." }],
  knowledge: [
    { id: "roundTenth", skill: "w6-l6.tenth", gen: (rng) => { let X = rng.int(101, 999); if (X % 10 === 0) X += 3; const r = rnd(X, 1); return numeric(`rt-${X}`, "w6-l6.tenth", `Avrunda ${dc(X, 2)} till närmaste tiondel.`, dcAcc(r, 1), `${dc(X, 2)} → ${dc(r, 1)}.`, ["Titta på hundradelssiffran."]); } },
    { id: "roundWhole", skill: "w6-l6.whole", gen: (rng) => { let X = rng.int(11, 199); if (X % 10 === 0) X += 1; const r = rnd(X, 1); return numeric(`rw-${X}`, "w6-l6.whole", `Avrunda ${dc(X, 1)} till närmaste heltal.`, r, `${dc(X, 1)} → ${r}.`, ["Titta på tiondelssiffran."]); } },
    { id: "roundHundredth", skill: "w6-l6.hundredth", gen: (rng) => { let X = rng.int(1001, 9999); if (X % 10 === 0) X += 7; const r = rnd(X, 1); return numeric(`rh-${X}`, "w6-l6.hundredth", `Avrunda ${dc(X, 3)} till närmaste hundradel.`, dcAcc(r, 2), `${dc(X, 3)} → ${dc(r, 2)}.`, ["Titta på tusendelssiffran."]); } },
    { id: "boundary", skill: "w6-l6.boundary", gen: (rng) => { const t = rng.int(1, 8); const X = t * 100 + rng.int(0, 9) * 10 + 5; return numeric(`bd-${X}`, "w6-l6.boundary", `Avrunda ${dc(X, 2)} till närmaste tiondel.`, dcAcc(rnd(X, 1), 1), `${dc(X, 2)} ligger mitt emellan, avrundas uppåt: ${dc(rnd(X, 1), 1)}.`, ["5 avrundas uppåt."]); } },
    { id: "rollover", skill: "w6-l6.rollover", gen: (rng) => { const w = rng.int(1, 8); const X = w * 100 + 95 + rng.int(0, 4); return numeric(`ro-${X}`, "w6-l6.rollover", `Avrunda ${dc(X, 2)} till närmaste tiondel.`, dcAcc(rnd(X, 1), 1), `${dc(X, 2)} ligger närmast ${w + 1},0.`, ["10 tiondelar = 1 hel."]); } },
    { id: "estimate", skill: "w6-l6.estimate", gen: (rng) => { const a = rng.int(31, 89), b = rng.int(21, 79); const ra = rnd(a, 1), rb = rnd(b, 1); return numeric(`es-${a}-${b}`, "w6-l6.estimate", `Överslag: avrunda ${dc(a, 1)} och ${dc(b, 1)} till närmaste heltal och multiplicera inte – addera.`, ra + rb, `${ra} + ${rb} = ${ra + rb}.`, ["Avrunda var och en."]); } },
  ],
  method: [
    { id: "roundSteps", skill: "w6-l6.tenth", gen: (rng) => { let X = rng.int(101, 999); if (X % 10 === 0) X += 3; const tenthDigit = Math.floor(X / 10) % 10, hundred = X % 10; return multifield(`rs-${X}`, "w6-l6.tenth", `Avrunda ${dc(X, 2)} till närmaste tiondel i tre steg.`, [{ label: "Tiondelssiffran", accept: [tenthDigit] }, { label: "Grannsiffran (hundradelar)", accept: [hundred] }, { label: "Avrundat tal", accept: dcAcc(rnd(X, 1), 1) }], `Tiondelssiffra ${tenthDigit}, granne ${hundred} → ${dc(rnd(X, 1), 1)}.`, ["Granne 5–9: uppåt."]); } },
    { id: "neighbors", skill: "w6-l6.neighbors", gen: (rng) => { let X = rng.int(101, 999); if (X % 10 === 0) X += 3; const lo = Math.floor(X / 10) * 10; return multifield(`nb-${X}`, "w6-l6.neighbors", `${dc(X, 2)} ligger mellan två tiondelar. Fyll i.`, [{ label: "Lägre tiondel", accept: dcAcc(lo, 2) }, { label: "Högre tiondel", accept: dcAcc(lo + 10, 2) }, { label: "Närmast", accept: dcAcc(rnd(X, 1) * 10, 2) }], `${dc(lo, 2)} < ${dc(X, 2)} < ${dc(lo + 10, 2)}.`, []); } },
  ],
  representation: [
    { id: "roundOnLine", skill: "w6-l6.numberline", gen: (rng) => { const w = rng.int(1, 8); let h = rng.int(1, 99); if (h % 10 === 0) h += 1; const X = w * 100 + h; return numberlineEx(`ol-${X}`, "w6-l6.numberline", `${dc(X, 2)} avrundas till närmaste tiondel. Markera den på tallinjen (steg om 0,1).`, rnd(X, 1), { min: w * 10, max: (w + 1) * 10, step: 1, labelEvery: 5, dp: 1 }, `${dc(X, 2)} → ${dc(rnd(X, 1), 1)}.`, ["Vilken tiondel ligger närmast?"]); } },
    { id: "wholeOnLine", skill: "w6-l6.numberline", gen: (rng) => { let X = rng.int(11, 99); if (X % 10 === 0) X += 1; return numberlineEx(`wl-${X}`, "w6-l6.numberline", `${dc(X, 1)} avrundas till närmaste heltal. Markera det på tallinjen.`, rnd(X, 1), { min: 0, max: 10, step: 1, labelEvery: 5 }, `${dc(X, 1)} → ${rnd(X, 1)}.`, ["Närmaste hela tal."]); } },
  ],
  teacher: {
    title: "När nian blir en tia",
    scenarios: ["Maria (åk 5) avrundar 4,96 till närmaste tiondel och skriver 4,10: \"Nian är redan störst, så jag lägger på en tia.\""],
    prompt: "Förklara för Maria hur du kan visa avrundningen på en tallinje, vad som händer när nian ska öka, och vad rätt svar är.",
    minChars: 160,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "linje", label: "tallinjen: 4,96 mellan 4,9 och 5,0", any: ["tallinje", "mellan 4,9 och 5", "4,9 och 5,0", "närmast"] },
        { id: "tio", label: "att 10 tiondelar är 1 hel", any: ["10 tiondelar", "tio tiondelar", "1 hel", "en hel", "ett ental"] },
        { id: "svar", label: "rätt svar 5,0 (5)", any: ["5,0", "svaret är 5", "5 hela"] },
        { id: "grann", label: "grannsiffran 6 → uppåt", any: ["grannsiffra", "6", "uppåt", "5 eller mer"] },
        { id: "fel", label: "att 4,10 är något helt annat/orimligt", any: ["4,10", "4,1", "mindre", "annat tal", "fel"] },
      ],
    },
    modelAnswer: "Maria, rita en tallinje med steg om 0,1 mellan 4,9 och 5,0. 4,96 ligger närmast 5,0. Grannsiffran 6 är 5 eller mer, så vi ökar tiondelarna: 9 tiondelar + 1 = 10 tiondelar, och 10 tiondelar är 1 hel. Därför blir det 5,0, inte 4,10. 4,10 är ett helt annat tal som ligger nära 4,1, långt från 4,96. Avrundning handlar om vilket tal som ligger närmast på tallinjen.",
  },
};

// ───────── Lektion 7: Decimaltal och bråk ─────────
const PAIRS: [number, number][] = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 20], [3, 20], [1, 25], [7, 10], [9, 20], [11, 25], [3, 25]];
const asScaled = (n: number, d: number) => { const dp = d === 2 || d === 5 || d === 10 ? 1 : 2; return [(n * 10 ** dp) / d, dp] as const; };

export const lesson7: Lesson = {
  id: "w6-l7", worldId: "w6", title: "Decimaltal och bråk", grades: "åk 4–6",
  summary: "Samma tal, olika skrivsätt: tiondelar, hundradelar och vanliga bråk.",
  lgr: "Tal i bråk- och decimalform och deras samband; hur tal i bråk- och decimalform kan användas i vardagliga situationer",
  objectives: ["Skriva bråk med nämnare 10 och 100 som decimaltal och tvärtom.", "Omvandla enkla bråk (1/2, 1/4, 3/4, 1/5) till decimaltal.", "Förklara sambandet med positionssystemet."],
  intro: "Decimaltal och bråk är två sätt att skriva samma tal. $0{,}3$ *är* $\\frac{3}{10}$. Och $\\frac{1}{4}$ är *inte* $0{,}4$ – ett mycket vanligt fel som bygger på att man läser ”fyra” i nämnaren som ”fyra tiondelar”.",
  theory: [
    { heading: "Tiondelar och hundradelar", body: "$\\frac{3}{10} = 0{,}3$ och $\\frac{17}{100} = 0{,}17$. Nämnaren 10 eller 100 säger direkt vilken plats siffrorna står på." },
    { heading: "Förläng till tiondelar eller hundradelar", body: "För att skriva $\\frac{1}{4}$ som decimaltal, förläng till nämnare 100: $\\frac{1}{4} = \\frac{25}{100} = 0{,}25$. $\\frac{3}{5} = \\frac{6}{10} = 0{,}6$.", visual: { type: "decimalgrid", hundredths: 25 } },
    { heading: "Vanliga omvandlingar", body: "$\\frac{1}{2} = 0{,}5$, $\\frac{1}{4} = 0{,}25$, $\\frac{3}{4} = 0{,}75$, $\\frac{1}{5} = 0{,}2$, $\\frac{1}{10} = 0{,}1$. Bra att kunna utantill – de används ständigt (och i procent senare)." },
    { heading: "Bråkstrecket är ett delat-med-tecken", body: "$\\frac{1}{4} = 1 \\div 4 = 0{,}25$. Dividerar vi täljaren med nämnaren får vi decimaltalet – men förlängning är ofta snabbare i huvudet." },
  ],
  worked: [
    { title: "Bråk till decimaltal", problem: "Skriv 3/4 som decimaltal.", steps: [{ text: "Förläng till hundradelar (4 · 25 = 100).", math: "\\frac{3}{4} = \\frac{3 \\cdot 25}{4 \\cdot 25} = \\frac{75}{100}" }, { text: "75 hundradelar:", math: "0{,}75" }], why: "Nämnare 100 betyder hundradelar, och 75 hundradelar skrivs 0,75.", alternative: "$3 \\div 4 = 0{,}75$." },
    { title: "Decimaltal till bråk", problem: "Skriv 0,35 som bråk i enklaste form.", steps: [{ text: "35 hundradelar.", math: "\\frac{35}{100}" }, { text: "Förkorta med 5.", math: "\\frac{35 \\div 5}{100 \\div 5} = \\frac{7}{20}" }], why: "35 och 100 har gemensamma faktorn 5.", alternative: "Tänk pengar: 35 öre av 100 öre." },
  ],
  drawing: { task: "Rita ett hundrarutnät. Färga 1/4 av det. Hur många rutor? Vilket decimaltal blir det?", tool: "hundredgrid" },
  pupils: [{ pupil: "Elias", said: "1/4 är 0,4 – för det är en fyra.", misconception: "Läser nämnaren som tiondelssiffra.", response: "Visa att 0,4 är 4 tiondelar. Dela en hundrarutnät i 4 lika delar: 25 rutor, 0,25." }],
  knowledge: [
    { id: "tenthsFrac", skill: "w6-l7.tenth", gen: (rng) => { const n = rng.int(1, 9); return numeric(`tf-${n}`, "w6-l7.tenth", `${n}/10 = ? (Skriv som decimaltal.)`, dcAcc(n, 1), `${n} tiondelar = 0,${n}.`, ["Nämnare 10: tiondelar."]); } },
    { id: "hundredthsFrac", skill: "w6-l7.hundredth", gen: (rng) => { const n = rng.int(1, 99); return numeric(`hf-${n}`, "w6-l7.hundredth", `${n}/100 = ? (Skriv som decimaltal.)`, dcAcc(n, 2), `${n} hundradelar = ${dc(n, 2)}.`, ["Nämnare 100: hundradelar."]); } },
    { id: "common", skill: "w6-l7.common", gen: (rng) => { const [n, d] = rng.pick(PAIRS); const [X, dp] = asScaled(n, d); return numeric(`cm-${n}-${d}`, "w6-l7.common", `${n}/${d} = ? (Skriv som decimaltal.)`, dcAcc(X, dp), `${n}/${d} = ${X}/${10 ** dp} = ${dc(X, dp)}.`, ["Förläng till 10 eller 100."]); } },
    { id: "decToFrac", skill: "w6-l7.back", gen: (rng) => { const dp = rng.int(1, 2), X = rng.int(1, 9) * (dp === 2 ? 10 : 1) + (dp === 2 ? rng.int(1, 9) : 0); return numeric(`df-${X}-${dp}`, "w6-l7.back", `${dc(X, dp)} = □/${10 ** dp}. Vilket tal ska stå i rutan?`, X, `${dc(X, dp)} är ${X} ${dp === 1 ? "tiondelar" : "hundradelar"}.`, ["Hur många " + (dp === 1 ? "tiondelar" : "hundradelar") + "?"]); } },
    { id: "equalMc", skill: "w6-l7.concept", gen: (rng) => mc("eq", "w6-l7.concept", "Vilket decimaltal är lika med 3/4?", "0,75", [{ text: "0,34", note: "Du har satt ihop 3 och 4 bredvid varandra." }, { text: "3,4" }, { text: "0,43" }], "3/4 = 75/100 = 0,75.", ["Förläng till hundradelar."], rng) },
    { id: "equalMc2", skill: "w6-l7.common", gen: (rng) => mc("eq2", "w6-l7.common", `Vilket bråk är lika med 0,5?`, m(1, 2), [{ text: m(1, 5) }, { text: m(5, 1) }, { text: m(1, 4) }], "0,5 = 5/10 = 1/2.", [], rng) },
  ],
  method: [
    { id: "fracToDecSteps", skill: "w6-l7.common", gen: (rng) => { const [n, d] = rng.pick(PAIRS.filter(([, dd]) => dd !== 25 || true)); const [X, dp] = asScaled(n, d); const newDen = 10 ** dp; return multifield(`fs-${n}-${d}`, "w6-l7.common", `Skriv ${n}/${d} som decimaltal genom att förlänga.`, [{ label: "Ny nämnare (10 eller 100)", accept: [newDen] }, { label: "Ny täljare", accept: [X] }, { label: "Decimaltal", accept: dcAcc(X, dp) }], `${n}/${d} = ${X}/${newDen} = ${dc(X, dp)}.`, ["Vad gånger " + d + " blir 10 eller 100?"]); } },
    { id: "decToFracSteps", skill: "w6-l7.back", gen: (rng) => { const X = rng.pick([25, 35, 45, 55, 65, 75, 85, 15, 5, 20, 40, 60, 80]); const g = gcd(X, 100); return multifield(`ds-${X}`, "w6-l7.back", `Skriv ${dc(X, 2)} som bråk i enklaste form.`, [{ label: "Hundradelar (täljare)", accept: [X] }, { label: "Enklaste form (t.ex. 7/20)", accept: [`${X / g}/${100 / g}`] }], `${X}/100 = ${X / g}/${100 / g}.`, ["Förkorta."]); } },
  ],
  representation: [
    { id: "gridToFrac", skill: "w6-l7.grid", gen: (rng) => { const n = rng.pick([25, 50, 75, 20, 40, 60, 80, 10]); const g = gcd(n, 100); return withVisual(multifield(`gf-${n}`, "w6-l7.grid", "Rutnätet har 100 rutor. Hur många är färgade, vilket decimaltal är det, och vilket är bråket i enklaste form?", [{ label: "Färgade rutor", accept: [n] }, { label: "Decimaltal", accept: dcAcc(n, 2) }, { label: "Enklaste bråk (t.ex. 1/4)", accept: [`${n / g}/${100 / g}`] }], `${n}/100 = ${dc(n, 2)} = ${n / g}/${100 / g}.`, []), { type: "decimalgrid", hundredths: n }); } },
    { id: "shadeBar", skill: "w6-l7.bar", gen: (rng) => { const k = rng.int(1, 9); return fractionbarEx(`sb-${k}`, "w6-l7.bar", `Stapeln är delad i 10 delar. Färglägg ${dc(k, 1)} (som decimaltal) – det är ${m(k, 10)}.`, 10, k, `0,${k} = ${k}/10.`, []); } },
  ],
  teacher: {
    title: "1/4 är inte 0,4",
    scenarios: ["Elias (åk 5) skriver att 1/4 = 0,4 \"för det står ju en fyra\". Samtidigt tycker han att 1/2 = 0,2."],
    prompt: "Förklara för Elias varför 1/4 inte är 0,4, hur man kommer fram till rätt decimaltal, och hur han kan kontrollera med en bild.",
    minChars: 160,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "tiondel", label: "att 0,4 betyder 4 tiondelar (inte en fjärdedel)", any: ["4 tiondelar", "fyra tiondelar", "tiondelar"] },
        { id: "forlang", label: "att förlänga 1/4 till 25/100", any: ["25/100", "förläng", "25 hundradelar", "hundradelar"] },
        { id: "svar", label: "rätt svar 0,25", any: ["0,25"] },
        { id: "bild", label: "en bild (rutnät, pizza i fyra delar)", any: ["rutnät", "rutor", "rita", "bild", "pizza", "cirkel", "fyra delar", "4 delar"] },
        { id: "namn", label: "att nämnaren säger hur många delar", any: ["nämnare", "fyra lika stora", "delad i 4", "delad i fyra"] },
      ],
    },
    modelAnswer: "Elias, 0,4 betyder 4 tiondelar, men 1/4 är en av fyra lika stora delar. De är inte samma. Förläng 1/4 till hundradelar: 1/4 = 25/100 eftersom 4 · 25 = 100. 25 hundradelar skrivs 0,25. Rita ett hundrarutnät och dela det i fyra lika delar: varje del har 25 rutor, så 1/4 = 0,25. Nämnaren 4 säger hur många lika stora delar helheten är delad i, inte vilken siffra som står efter kommat.",
  },
};

// ───────── Lektion 8: Räkna med decimaltal i vardagen ─────────
export const lesson8: Lesson = {
  id: "w6-l8", worldId: "w6", title: "Gånger och delat med heltal – i vardagen", grades: "åk 4–6",
  summary: "Multiplicera och dividera decimaltal med heltal – pengar, längd och vikt.",
  lgr: "Metoder för beräkningar med enkla tal i decimalform vid huvudräkning och överslag; hur tal i decimalform kan användas i vardagliga situationer",
  objectives: ["Multiplicera ett decimaltal med ett heltal.", "Dividera ett decimaltal med ett heltal.", "Använda överslag för att placera kommat rätt."],
  intro: "$0{,}3 \\cdot 4$ – är det $1{,}2$ eller $0{,}12$? Elever får ofta rätt siffror (12) men placerar kommat fel. Lösningen är återigen **platsvärde**: 3 tiondelar gånger 4 är 12 tiondelar, och 12 tiondelar är 1,2.",
  theory: [
    { heading: "Räkna i delar", body: "$0{,}3 \\cdot 4$: 3 tiondelar $\\cdot$ 4 $=$ 12 tiondelar $= 1{,}2$. Samma tanke som $30 \\cdot 4$: 3 tiotal gånger 4 är 12 tiotal." },
    { heading: "Räkna som heltal – sedan placera kommat", body: "$0{,}35 \\cdot 6$: räkna $35 \\cdot 6 = 210$. Talet 0,35 har 2 decimaler, så svaret har 2 decimaler: $2{,}10$. Kontrollera med överslag: $0{,}35 \\approx 0{,}4$, $0{,}4 \\cdot 6 = 2{,}4$ – ja, runt 2." },
    { heading: "Division", body: "$7{,}2 \\div 3$: 72 tiondelar delat på 3 är 24 tiondelar, alltså $2{,}4$. Kontroll: $2{,}4 \\cdot 3 = 7{,}2$." },
    { heading: "Överslag avgör kommat", body: "Räkna alltid ett grovt överslag så att kommat hamnar rätt: $4{,}8 \\cdot 5 \\approx 5 \\cdot 5 = 25$, så svaret är $24$, inte $2{,}4$ eller $240$.", visual: { type: "numberline", min: 0, max: 200, step: 25, marks: [100], labelEvery: 50, dp: 2 } },
  ],
  worked: [
    { title: "Multiplikation", problem: "Beräkna 0,35 · 6.", steps: [{ text: "Som hundradelar: 35 · 6.", math: "35 \\cdot 6 = 210" }, { text: "210 hundradelar:", math: "2{,}10" }, { text: "Överslag: 0,4 · 6 = 2,4 – rimligt.", math: "2{,}1" }], why: "35 hundradelar gånger 6 är 210 hundradelar, alltså 2,10.", alternative: "Upprepad addition: 0,35 · 6 = 0,35 + 0,35 + 0,35 + 0,35 + 0,35 + 0,35 = 2,10." },
    { title: "Division", problem: "Beräkna 7,2 ÷ 3.", steps: [{ text: "72 tiondelar delat på 3.", math: "72 \\div 3 = 24" }, { text: "24 tiondelar:", math: "2{,}4" }, { text: "Kontroll:", math: "2{,}4 \\cdot 3 = 7{,}2" }], why: "Vi delar tiondelar lika på 3 grupper.", alternative: "Dela först heltalen (7 ÷ 3) och växla resten till tiondelar – som i liggande stolen." },
  ],
  drawing: { task: "Rita en tallinje från 0 till 2 och hoppa 0,25 åt gången. Hur många hopp tar du till 2?", tool: "numberline" },
  pupils: [{ pupil: "Lisa", said: "0,3 · 4: 3 · 4 = 12, så svaret är 0,12.", misconception: "Behåller kommats plats i stället för att tänka tiondelar.", response: "Visa upprepad addition: 0,3 + 0,3 + 0,3 + 0,3 = 1,2. Fråga: ”Kan fyra tiondelar-tal bli mindre än 0,3?”" }],
  knowledge: [
    { id: "mulInt", skill: "w6-l8.multiply", gen: (rng) => { const dp = rng.int(1, 2), X = rng.int(dp === 1 ? 11 : 101, dp === 1 ? 99 : 499), k = rng.int(2, 9); return numeric(`mi-${X}-${dp}-${k}`, "w6-l8.multiply", `${dc(X, dp)} · ${k} = ?`, dcAcc(X * k, dp), `${X} · ${k} = ${X * k}, med ${dp} decimal${dp > 1 ? "er" : ""}: ${dc(X * k, dp)}.`, ["Räkna som heltal – placera sedan kommat."]); } },
    { id: "divInt", skill: "w6-l8.divide", gen: (rng) => { const dp = rng.int(1, 2), q = rng.int(dp === 1 ? 11 : 101, dp === 1 ? 99 : 399), k = rng.int(2, 9); return numeric(`di-${q}-${dp}-${k}`, "w6-l8.divide", `${dc(q * k, dp)} ÷ ${k} = ?`, dcAcc(q, dp), `${q * k} ÷ ${k} = ${q}, med ${dp} decimal${dp > 1 ? "er" : ""}: ${dc(q, dp)}.`, ["Räkna som heltal – placera sedan kommat."]); } },
    { id: "word", skill: "w6-l8.word", gen: (rng) => { const p = rng.int(5, 29) * 100 + rng.pick([0, 50, 90, 75]), k = rng.int(2, 6); return numeric(`wd-${p}-${k}`, "w6-l8.word", `Äpplen kostar ${dc(p, 2)} kr per kg. Vad kostar ${k} kg?`, dcAcc(p * k, 2), `${dc(p, 2)} · ${k} = ${dc(p * k, 2)}.`, ["Räkna som hundradelar."], "kr"); } },
    { id: "rope", skill: "w6-l8.word", gen: (rng) => { const q = rng.int(11, 99), k = rng.int(2, 6); return numeric(`rp-${q}-${k}`, "w6-l8.word", `Ett rep på ${dc(q * k, 1)} m klipps i ${k} lika långa bitar. Hur lång är varje bit?`, dcAcc(q, 1), `${dc(q * k, 1)} ÷ ${k} = ${dc(q, 1)}.`, ["Dela tiondelar lika."], "m"); } },
    { id: "reasonable", skill: "w6-l8.reasonable", gen: (rng) => { const a = rng.int(21, 89), k = rng.int(3, 7); const prod = a * k; const right = dc(prod, 1); return mc(`rs-${a}-${k}`, "w6-l8.reasonable", `Vilket svar är rimligt för ${dc(a, 1)} · ${k}?`, right, [{ text: dc(prod, 2), note: "Tio gånger för litet." }, { text: String(prod), note: "Tio gånger för stort." }, { text: dc(prod, 3), note: "Hundra gånger för litet." }], `Överslag: ${Math.round(a / 10)} · ${k} ≈ ${Math.round(a / 10) * k}. Svaret ${right} ligger nära.`, ["Gör ett överslag."], rng); } },
  ],
  method: [
    { id: "mulSteps", skill: "w6-l8.multiply", gen: (rng) => { const dp = 2, X = rng.int(101, 499), k = rng.int(2, 9); return multifield(`ms-${X}-${k}`, "w6-l8.multiply", `Räkna ${dc(X, dp)} · ${k} i steg.`, [{ label: `Som heltal: ${X} · ${k} =`, accept: [X * k] }, { label: "Antal decimaler i svaret", accept: [dp] }, { label: "Svar", accept: dcAcc(X * k, dp) }], `${X * k} med ${dp} decimaler: ${dc(X * k, dp)}.`, []); } },
    { id: "divSteps", skill: "w6-l8.divide", gen: (rng) => { const dp = 1, q = rng.int(11, 99), k = rng.int(2, 9); return multifield(`ds-${q}-${k}`, "w6-l8.divide", `Räkna ${dc(q * k, dp)} ÷ ${k} i steg.`, [{ label: `Som heltal: ${q * k} ÷ ${k} =`, accept: [q] }, { label: "Antal decimaler i svaret", accept: [dp] }, { label: "Svar", accept: dcAcc(q, dp) }], `${q} med ${dp} decimal: ${dc(q, dp)}.`, []); } },
  ],
  representation: [
    { id: "hopLine", skill: "w6-l8.numberline", gen: (rng) => { const k = rng.int(2, 8); return numberlineEx(`hl-${k}`, "w6-l8.numberline", `Hoppa ${k} gånger med steg om 0,25 från 0. Markera var du hamnar.`, k * 25, { min: 0, max: 200, step: 25, labelEvery: 50, dp: 2 }, `${k} · 0,25 = ${dc(k * 25, 2)}.`, ["Varje streck är 0,25."]); } },
    { id: "gridDouble", skill: "w6-l8.grid", gen: (rng) => { const a = rng.int(11, 45); return withVisual(multifield(`gd-${a}`, "w6-l8.grid", `Rutnätet visar ${dc(a, 2)}. Du dubblar det (· 2). Hur många rutor blir färgade, och vilket decimaltal?`, [{ label: "Färgade rutor", accept: [a * 2] }, { label: "Decimaltal", accept: dcAcc(a * 2, 2) }], `2 · ${a} = ${a * 2} rutor = ${dc(a * 2, 2)}.`, []), { type: "decimalgrid", hundredths: a }); } },
  ],
  teacher: {
    title: "Var hamnar kommat?",
    scenarios: ["Lisa (åk 5) räknar 0,3 · 4 och får 3 · 4 = 12. Hon skriver 0,12 \"för det var ett komma före trean\"."],
    prompt: "Förklara för Lisa varför svaret är 1,2 och inte 0,12. Använd tiondelar, upprepad addition och ett överslag/rimlighetskontroll.",
    minChars: 170,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "tiondelar", label: "3 tiondelar · 4 = 12 tiondelar", any: ["12 tiondelar", "tolv tiondelar", "3 tiondelar", "tre tiondelar"] },
        { id: "svar", label: "rätt svar 1,2", any: ["1,2"] },
        { id: "addition", label: "upprepad addition (0,3 + 0,3 + 0,3 + 0,3)", any: ["0,3 + 0,3", "upprepad addition", "lägga ihop fyra", "fyra gånger 0,3"] },
        { id: "rimlig", label: "rimlighet (större än 0,3 / mer än 1)", any: ["rimlig", "större än 0,3", "mer än 1", "mer än 0,3", "orimlig", "överslag"] },
        { id: "komma", label: "att 12 tiondelar skrivs som 1,2 (platsvärde)", any: ["1 hel", "tio tiondelar", "10 tiondelar", "platsvärde"] },
      ],
    },
    modelAnswer: "Lisa, 0,3 är 3 tiondelar. 3 tiondelar gånger 4 är 12 tiondelar. Tio tiondelar är 1 hel, så 12 tiondelar är 1 hel och 2 tiondelar, alltså 1,2. Du kan kontrollera med upprepad addition: 0,3 + 0,3 + 0,3 + 0,3 = 1,2. Ett överslag visar också att svaret inte kan vara 0,12: fyra grupper om 0,3 måste bli mer än 0,3, och mer än 1. Siffrorna 12 stämde, men kommats plats avgörs av platsvärdet.",
  },
};
