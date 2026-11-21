import type { Lesson } from "../types";
import { mc, numeric, multifield, withVisual, numberlineEx, fractionbarEx, columnEx, columnSolution, dc, dcTrim, dcAcc } from "@/lib/engine/gen-helpers";
import type { Rng } from "@/lib/engine/rng";

const T = (n: number, dp: number) => dcTrim(n, dp);

// ───────── Lektion 1: Tiondelar och hundradelar ─────────
export const lesson1: Lesson = {
  id: "w6-l1", worldId: "w6", title: "Tiondelar och hundradelar", grades: "åk 4–6",
  summary: "Positionssystemet fortsätter åt höger om kommatecknet.",
  lgr: "Positionssystemet för hela tal och tal i decimalform; hur tal i decimalform kan användas i vardagliga situationer",
  objectives: ["Förklara platserna efter decimalkommat som tiondelar, hundradelar och tusendelar.", "Ange värdet av siffror i decimaltal.", "Skriva decimaltal i utvecklad form och koppla dem till bilder."],
  intro: "Decimaltal är inget nytt system – det är **samma positionssystem**, förlängt åt höger. Varje plats är fortfarande tio gånger mindre än platsen till vänster om den. Kommatecknet visar bara var entalen slutar. Elever som missar det tolkar ofta $3{,}45$ som ”tre och fyrtiofem”.",
  theory: [
    { heading: "Platserna åt höger", body: "Till vänster om kommat finns ental, tiotal, hundratal … Till höger finns **tiondelar** ($\\frac{1}{10} = 0{,}1$), **hundradelar** ($\\frac{1}{100} = 0{,}01$), **tusendelar** ($0{,}001$). Varje plats är tio gånger mindre än platsen till vänster.", visual: { type: "decimalplace", value: "4,35" } },
    { heading: "Läs siffra för siffra", body: "$4{,}35$ är 4 ental, 3 tiondelar och 5 hundradelar: $4 + 0{,}3 + 0{,}05$. Vi läser ”fyra komma tre fem”, aldrig ”fyra komma trettiofem”, eftersom 3 och 5 står på olika platser." },
    { heading: "Hundrarutnätet", body: "Ett kvadratiskt rutnät med 100 rutor är ”1 hel”. En rad (10 rutor) är en tiondel, $0{,}1$; en ruta är en hundradel, $0{,}01$. Så $0{,}35$ är 3 rader och 5 rutor – eller 35 rutor.", visual: { type: "decimalgrid", hundredths: 35 } },
    { heading: "Nollor sist ändrar inget", body: "$0{,}5 = 0{,}50 = 0{,}500$. Samma mängd, men uppdelad i mindre delar: 5 tiondelar är lika med 50 hundradelar. Nollan *mellan* kommat och en siffra spelar däremot roll: $0{,}05 \\neq 0{,}5$." },
  ],
  worked: [
    { title: "Värdet av en siffra", problem: "Vilket värde har siffran 7 i 3,472?", steps: [{ text: "Siffrorna efter kommat: 4 tiondelar, 7 hundradelar, 2 tusendelar.", math: "3{,}\\underbrace{4}_{\\text{tiondel}}\\underbrace{7}_{\\text{hundradel}}\\underbrace{2}_{\\text{tusendel}}" }, { text: "7 hundradelar:", math: "7 \\cdot 0{,}01 = 0{,}07" }], why: "Värdet är siffran gånger platsens värde – samma regel som för hela tal.", alternative: "Läs: 472 tusendelar. Då är 7:an i mitten 70 tusendelar = 0,07." },
    { title: "Utvecklad form", problem: "Skriv 4,56 i utvecklad form.", steps: [{ text: "Dela upp efter plats.", math: "4 + 0{,}5 + 0{,}06" }, { text: "Eller med multiplikation:", math: "4 \\cdot 1 + 5 \\cdot 0{,}1 + 6 \\cdot 0{,}01" }], why: "Talet är summan av siffrornas värden.", alternative: "56 hundradelar: $4 + \\frac{56}{100}$." },
  ],
  drawing: { task: "Rita ett hundrarutnät (10 × 10 rutor). Färga 0,35 av rutnätet. Hur många rader och hur många enstaka rutor?", tool: "hundredgrid" },
  pupils: [{ pupil: "Vera", said: "3,45 är tre och fyrtiofem. Jag läser det som två tal med ett komma emellan.", misconception: "Ser kommatecknet som en gräns mellan två heltal.", response: "Låt Vera lägga 3,45 i en platsvärdestabell: 4 tiondelar och 5 hundradelar. Visa på rutnätet att 45 rutor är 4 rader och 5 rutor." }],
  knowledge: [
    { id: "digitValue", skill: "w6-l1.digit-value", gen: (rng) => { const i = rng.int(1, 9), t = rng.int(1, 9), h = rng.int(1, 9); const n = i * 100 + t * 10 + h; const ask = rng.chance(0.5) ? "t" : "h"; const val = ask === "t" ? t * 10 : h; return mc(`dv-${n}-${ask}`, "w6-l1.digit-value", `Vilket värde har siffran ${ask === "t" ? t : h} i talet ${dc(n, 2)}?`, T(val, 2), [{ text: String(ask === "t" ? t : h), note: "Du har bara angett siffran – inte dess värde." }, { text: T(ask === "t" ? h : t * 10, 2), note: "Kolla vilken plats siffran står på." }, { text: T(val * 10, 2) }, { text: T(Math.max(1, Math.round(val / 10)), 2) }], `${ask === "t" ? "Tiondelar" : "Hundradelar"}: ${T(val, 2)}.`, ["Platser: tiondel, hundradel."], rng); } },
    { id: "tenthsCount", skill: "w6-l1.count", gen: (rng) => { const n = rng.int(11, 99); return numeric(`tc-${n}`, "w6-l1.count", `Hur många tiondelar finns i ${dc(n, 1)}?`, n, `${dc(n, 1)} = ${n} tiondelar (${Math.floor(n / 10)} hela = ${Math.floor(n / 10) * 10} tiondelar, plus ${n % 10}).`, ["1 hel = 10 tiondelar."]); } },
    { id: "hundredthsCount", skill: "w6-l1.count", gen: (rng) => { const n = rng.int(11, 199); return numeric(`hc-${n}`, "w6-l1.count", `${dc(n, 2)} = □ hundradelar. Vilket tal ska stå i rutan?`, n, `${dc(n, 2)} är ${n} hundradelar.`, ["1 hel = 100 hundradelar."]); } },
    { id: "writeDecimal", skill: "w6-l1.write", gen: (rng) => { const i = rng.int(1, 9), h = rng.int(1, 9); const right = i * 100 + h; return mc(`wd-${i}-${h}`, "w6-l1.write", `Vilket tal består av ${i} ental, 0 tiondelar och ${h} hundradelar?`, dc(right, 2), [{ text: dc(i * 10 + h, 1), note: "Platsen för tiondelar måste ha en siffra: 0." }, { text: dc(i * 100 + h * 10, 2) }, { text: String(i * 10 + h) }], `${i} + 0,0${h} = ${dc(right, 2)}.`, ["Varje plats måste ha en siffra."], rng); } },
    { id: "zeroEnd", skill: "w6-l1.zeros", gen: (rng) => { const t = rng.int(1, 9); return mc(`ze-${t}`, "w6-l1.zeros", `Stämmer det att 0,${t} = 0,${t}0?`, "Ja – ${t} tiondelar är lika med ${t}0 hundradelar".replace(/\$\{t\}/g, String(t)), [{ text: "Nej – 0," + t + "0 är tio gånger större" }, { text: "Nej – det finns fler siffror, så talet är större" }], `${t} tiondelar = ${t}0 hundradelar.`, ["Hur många hundradelar går det på en tiondel?"], rng); } },
    { id: "unitCount", skill: "w6-l1.count", gen: (rng) => { const k = rng.pick([10, 100]); return numeric(`uc-${k}`, "w6-l1.count", `Hur många ${k === 10 ? "tiondelar" : "hundradelar"} går det på 1 hel?`, k, `1 = ${k}/${k}.`, ["Hur många delar har helheten?"]); } },
  ],
  method: [
    { id: "placeTable", skill: "w6-l1.table", gen: (rng) => { const i = rng.int(1, 9), t = rng.int(1, 9), h = rng.int(1, 9); return multifield(`pt-${i}-${t}-${h}`, "w6-l1.table", `Skriv ${i},${t}${h} i en platsvärdestabell. Vilken siffra står på varje plats?`, [{ label: "Ental", accept: [i] }, { label: "Tiondelar", accept: [t] }, { label: "Hundradelar", accept: [h] }], `${i},${t}${h}: ${i} ental, ${t} tiondelar, ${h} hundradelar.`, []); } },
    { id: "expanded", skill: "w6-l1.expanded", gen: (rng) => { const i = rng.int(1, 9), t = rng.int(1, 9), h = rng.int(1, 9); return multifield(`ex-${i}-${t}-${h}`, "w6-l1.expanded", `Skriv ${i},${t}${h} i utvecklad form. Fyll i värdet för varje del (som decimaltal).`, [{ label: "Ental", accept: [i] }, { label: "Tiondelar", accept: dcAcc(t * 10, 2) }, { label: "Hundradelar", accept: dcAcc(h, 2) }], `${i} + ${T(t * 10, 2)} + ${T(h, 2)} = ${i},${t}${h}.`, ["Värdet = siffran · platsens värde."]); } },
  ],
  representation: [
    { id: "gridRead", skill: "w6-l1.grid", gen: (rng) => { const n = rng.int(11, 99); return withVisual(multifield(`gr-${n}`, "w6-l1.grid", "Rutnätet har 100 rutor. De färgade rutorna är en del av helheten. Hur många hela rader (tiondelar), hur många enstaka rutor i sista raden (hundradelar), och vilket decimaltal?", [{ label: "Hela rader (tiondelar)", accept: [Math.floor(n / 10)] }, { label: "Rutor i sista raden", accept: [n % 10] }, { label: "Decimaltal", accept: dcAcc(n, 2) }], `${Math.floor(n / 10)} tiondelar och ${n % 10} hundradelar = ${dc(n, 2)}.`, ["En rad är 10 rutor."]), { type: "decimalgrid", hundredths: n }); } },
    { id: "shadeTenths", skill: "w6-l1.bar", gen: (rng) => { const k = rng.int(1, 9); return fractionbarEx(`st-${k}`, "w6-l1.bar", `Stapeln är delad i 10 lika delar. Färglägg ${dc(k * 10, 2).replace(/0$/, "")} av stapeln.`, 10, k, `0,${k} = ${k} tiondelar.`, ["Hur många tiondelar?"]); } },
    { id: "readTable", skill: "w6-l1.table", gen: (rng) => { const i = rng.int(1, 9), t = rng.int(0, 9), h = rng.int(1, 9); const v = `${i},${t}${h}`; return withVisual(multifield(`rt-${v}`, "w6-l1.table", "Bilden visar ett decimaltal i en platsvärdestabell. Hur många hundradelar är talet totalt?", [{ label: "Hundradelar totalt", accept: [i * 100 + t * 10 + h] }], `${v} = ${i * 100 + t * 10 + h} hundradelar.`, ["1 hel = 100 hundradelar."]), { type: "decimalplace", value: v }); } },
  ],
  teacher: {
    title: "Kommatecknet är ingen gräns",
    scenarios: ["Vera (åk 4) läser 3,45 som \"tre komma fyrtiofem\" och tycker att 4 och 5 är ett tal, 45, som står efter kommat."],
    prompt: "Förklara för Vera vad siffrorna 4 och 5 i 3,45 betyder, och varför man läser ”tre komma fyra fem”. Använd tiondelar, hundradelar och gärna ett hundrarutnät.",
    minChars: 160,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "tiondel", label: "att 4 betyder 4 tiondelar", any: ["4 tiondelar", "fyra tiondelar", "tiondelar", "tiondel"] },
        { id: "hundradel", label: "att 5 betyder 5 hundradelar", any: ["5 hundradelar", "fem hundradelar", "hundradelar", "hundradel"] },
        { id: "plats", label: "att varje siffra har sin egen plats / platsvärde", any: ["plats", "position", "platsvärde", "olika platser", "egen plats"] },
        { id: "modell", label: "en modell (rutnät, 4 rader och 5 rutor, tabell)", any: ["rutnät", "rutor", "rader", "tabell", "rita", "pengar", "hundra"] },
        { id: "los", label: "att kommat visar var entalen slutar", any: ["entalen", "ental", "komma", "kommat"] },
      ],
    },
    modelAnswer: "Vera, kommat är inte en gräns mellan två tal – det visar var entalen slutar. I 3,45 står 3 på entalsplatsen, 4 på tiondelsplatsen och 5 på hundradelsplatsen. Alltså är det 3 hela, 4 tiondelar och 5 hundradelar. Rita ett hundrarutnät: 4 rader är fyra tiondelar och 5 enstaka rutor är fem hundradelar, tillsammans 45 rutor av 100. Därför läser vi siffra för siffra: tre komma fyra fem. Varje siffra har sin egen plats och sitt eget platsvärde.",
  },
};

// ───────── Lektion 2: Decimaltal på tallinjen ─────────
export const lesson2: Lesson = {
  id: "w6-l2", worldId: "w6", title: "Decimaltal på tallinjen", grades: "åk 4–6",
  summary: "Zooma in mellan heltalen: tiondelar och hundradelar som lägen på tallinjen.",
  lgr: "Tal i decimalform och deras användning; rationella tal och deras egenskaper",
  objectives: ["Placera decimaltal på en tallinje.", "Förstå att tallinjen kan ”zoomas” in.", "Hoppa med steg om 0,1 och 0,01."],
  intro: "Mellan 0 och 1 finns oändligt många tal. Tallinjen låter oss **zooma in**: delar vi sträckan mellan två heltal i tio delar får vi tiondelar; delar vi en tiondel i tio delar får vi hundradelar. Det är samma idé som med bråk – men nu med positionssystemets hjälp.",
  theory: [
    { heading: "Tiondelar", body: "Sträckan 0–1 delas i 10 steg om $0{,}1$. Efter 7 steg är vi vid $0{,}7$. Efter 10 steg är vi vid 1: $10 \\cdot 0{,}1 = 1$.", visual: { type: "numberline", min: 0, max: 10, step: 1, marks: [7], labelEvery: 5, dp: 1 } },
    { heading: "Zooma in: hundradelar", body: "Mellan $0{,}4$ och $0{,}5$ finns 10 hundradelar. $0{,}47$ ligger vid det sjunde strecket efter $0{,}4$.", visual: { type: "numberline", min: 40, max: 50, step: 1, marks: [47], labelEvery: 5, dp: 2 } },
    { heading: "Över hela tal", body: "Decimaltal fortsätter förbi hela tal: efter $4{,}9$ kommer $5{,}0$, eftersom 10 tiondelar är en hel. Därför skriver vi $4{,}9 + 0{,}1 = 5{,}0 = 5$." },
    { heading: "Läs skalan först", body: "Precis som med heltal och bråk avgör skalan var ett tal ligger: på en tallinje mellan 0 och 10 är ett steg 1 – inte 0,1." },
  ],
  worked: [
    { title: "Placera 2,6", problem: "Markera 2,6 på en tallinje från 2 till 3 delad i tiondelar.", steps: [{ text: "Sträckan 2–3 delas i 10 lika steg om 0,1.", math: "2,\\ 2{,}1,\\ 2{,}2,\\ \\ldots,\\ 3" }, { text: "6 steg från 2:", math: "2{,}6" }], why: "Siffran efter kommat räknar tiondelar från heltalet till vänster.", alternative: "2,6 är 26 tiondelar – det 26:e strecket från 0." },
    { title: "Hundradelar", problem: "Mellan vilka två tiondelar ligger 0,47?", steps: [{ text: "Tiondelarna: 0,4 och 0,5.", math: "0{,}4 < 0{,}47 < 0{,}5" }, { text: "7 hundradelar efter 0,4 – närmare 0,5.", math: "0{,}47 \\approx 0{,}5" }], why: "Varje tiondel kan delas i tio hundradelar.", alternative: "Hälften av 0,1 är 0,05: 0,47 ligger över mitten 0,45." },
  ],
  drawing: { task: "Rita en tallinje från 0 till 1 delad i 10 steg och markera 0,3, 0,7 och 0,5. Zooma sedan in mellan 0,4 och 0,5 och markera 0,47.", tool: "numberline" },
  pupils: [{ pupil: "Ida", said: "0,7 sätter jag vid sjunde strecket på tallinjen 0–10, för 7 är 7.", misconception: "Läser inte skalan – tar siffran som strecknummer.", response: "Fråga: ”Är 0,7 större eller mindre än 1?” På en linje där varje streck är 1 ligger 0,7 före första strecket." }],
  knowledge: [
    { id: "hops", skill: "w6-l2.hops", gen: (rng) => { const k = rng.int(3, 15); return numeric(`hp-${k}`, "w6-l2.hops", `Du hoppar med steg om 0,1 från 0. Vilket tal har du nått efter ${k} hopp?`, dcAcc(k, 1), `${k} · 0,1 = ${T(k, 1)}.`, ["Räkna tiondelar."]); } },
    { id: "between", skill: "w6-l2.between", gen: (rng) => { const w = rng.int(1, 8), t = rng.int(1, 9); return numeric(`bw-${w}-${t}`, "w6-l2.between", `Mellan vilka två hela tal ligger ${w},${t}? Skriv det mindre.`, w, `${w} < ${w},${t} < ${w + 1}.`, ["Siffran före kommat."]); } },
    { id: "next", skill: "w6-l2.next", gen: (rng) => { const w = rng.int(1, 8); return numeric(`nx-${w}`, "w6-l2.next", `Vilket tal kommer efter ${w},9 om du hoppar 0,1?`, w + 1, `${w},9 + 0,1 = ${w + 1},0 = ${w + 1}.`, ["10 tiondelar är en hel."]); } },
    { id: "stepsBetween", skill: "w6-l2.steps", gen: (rng) => { const a = rng.int(1, 5), b = a + rng.int(2, 8); return numeric(`sb-${a}-${b}`, "w6-l2.steps", `Hur många steg om 0,1 är det från ${dc(a * 10, 1)} till ${dc(b * 10 + 0, 1)}?`, (b - a) * 10, `${dc(b * 10, 1)} − ${dc(a * 10, 1)} = ${b - a} hela = ${(b - a) * 10} tiondelar.`, ["1 hel = 10 steg."]); } },
    { id: "halfway", skill: "w6-l2.half", gen: (rng) => mc("hf", "w6-l2.half", "Var ligger 0,5 på tallinjen mellan 0 och 1?", "Mitt emellan 0 och 1", [{ text: "Närmare 1 än 0" }, { text: "Vid 5, långt efter 1" }, { text: "Precis vid 0,1" }], "5 tiondelar är hälften av 10 tiondelar.", [], rng) },
    { id: "betweenTenths", skill: "w6-l2.zoom", gen: (rng) => { const t = rng.int(1, 8), h = rng.int(1, 9); return numeric(`bt-${t}-${h}`, "w6-l2.zoom", `${dc(t * 10 + h, 2)} ligger mellan två tiondelar. Skriv den lägre.`, dcAcc(t * 10, 2), `${T(t * 10, 2)} < ${dc(t * 10 + h, 2)} < ${T((t + 1) * 10, 2)}.`, ["Ta bort hundradelarna."]); } },
  ],
  method: [
    { id: "zoomFields", skill: "w6-l2.zoom", gen: (rng) => { const t = rng.int(1, 8), h = rng.int(1, 9); const v = t * 10 + h; return multifield(`zf-${v}`, "w6-l2.zoom", `${dc(v, 2)} ligger mellan två tiondelar. Fyll i.`, [{ label: "Närmast lägre tiondel", accept: dcAcc(t * 10, 2) }, { label: "Närmast högre tiondel", accept: dcAcc((t + 1) * 10, 2) }, { label: "Närmast (avrundat)", accept: dcAcc(h >= 5 ? (t + 1) * 10 : t * 10, 2) }], `${dc(v, 2)} ligger ${h} hundradelar efter ${T(t * 10, 2)}.`, ["Är hundradelarna 5 eller mer?"]); } },
    { id: "hopFields", skill: "w6-l2.hops", gen: (rng) => { const k = rng.int(2, 9); return multifield(`hf-${k}`, "w6-l2.hops", `Hoppa ${k} steg om 0,1 från 0. Fyll i.`, [{ label: "Antal tiondelar", accept: [k] }, { label: "Decimaltal", accept: dcAcc(k, 1) }, { label: "Som bråk (täljare av 10)", accept: [k] }], `${k} tiondelar = 0,${k} = ${k}/10.`, []); } },
  ],
  representation: [
    { id: "markTenth", skill: "w6-l2.numberline", gen: (rng) => { const k = rng.int(1, 9); return numberlineEx(`mt-${k}`, "w6-l2.numberline", `Tallinjen mellan 0 och 1 är delad i tiondelar. Markera 0,${k}.`, k, { min: 0, max: 10, step: 1, labelEvery: 5, dp: 1 }, `0,${k} finns vid streck ${k}.`, ["Räkna tiondelar från 0."]); } },
    { id: "markWhole", skill: "w6-l2.numberline", gen: (rng) => { const w = rng.int(1, 8), t = rng.int(1, 9); return numberlineEx(`mw-${w}-${t}`, "w6-l2.numberline", `Tallinjen går från ${w} till ${w + 1} i tiondelar. Markera ${w},${t}.`, w * 10 + t, { min: w * 10, max: (w + 1) * 10, step: 1, labelEvery: 5, dp: 1 }, `${w},${t} är ${t} tiondelar efter ${w}.`, ["Räkna steg från " + w + "."]); } },
    { id: "markHundredth", skill: "w6-l2.numberline", gen: (rng) => { const t = rng.int(1, 8), h = rng.int(1, 9); return numberlineEx(`mh-${t}-${h}`, "w6-l2.numberline", `Tallinjen är inzoomad mellan 0,${t} och 0,${t + 1} (hundradelar). Markera 0,${t}${h}.`, t * 10 + h, { min: t * 10, max: (t + 1) * 10, step: 1, labelEvery: 5, dp: 2 }, `0,${t}${h} är ${h} hundradelar efter 0,${t}.`, ["Räkna hundradelar."]); } },
  ],
  teacher: {
    title: "Läs skalan",
    scenarios: ["Ida (åk 5) ska markera 0,7 på en tallinje som går från 0 till 10 med steg om 1. Hon sätter krysset vid det sjunde strecket och säger: \"Sju, för det är 0,7.\""],
    prompt: "Förklara för Ida varför 0,7 inte ligger vid det sjunde strecket på den här tallinjen, vad ett steg är värt, och var 0,7 ska ligga. Hur kan hon själv kontrollera?",
    minChars: 160,
    rubric: {
      minConcepts: 3,
      concepts: [
        { id: "skala", label: "att ett steg är 1 / skalan avgör", any: ["skala", "ett steg är 1", "steg är värt", "varje steg", "avstånd"] },
        { id: "mindre", label: "att 0,7 är mindre än 1 / ligger före första strecket", any: ["mindre än 1", "före 1", "innan 1", "mellan 0 och 1", "första strecket"] },
        { id: "tiondel", label: "att 0,7 är 7 tiondelar av ett steg (zooma in)", any: ["tiondel", "tiondelar", "zooma", "tio delar", "delas i tio"] },
        { id: "kontroll", label: "kontroll (större eller mindre än 1)", any: ["kontroll", "kolla", "fråga dig", "större eller mindre", "jämför"] },
      ],
    },
    modelAnswer: "Ida, titta först på skalan: på den här tallinjen är varje steg 1, inte 0,1. 0,7 är mindre än 1, så det ligger före första strecket, mellan 0 och 1. Om vi zoomar in och delar sträckan mellan 0 och 1 i tio delar är varje del en tiondel, och 0,7 är 7 tiondelar. Du kan kontrollera genom att fråga dig: är talet större eller mindre än 1? Då ser du att 0,7 inte kan ligga vid det sjunde strecket.",
  },
};

// ───────── Lektion 3: Jämföra och ordna ─────────
const sign3 = (c: number) => (c < 0 ? "<" : c > 0 ? ">" : "=");

export const lesson3: Lesson = {
  id: "w6-l3", worldId: "w6", title: "Jämföra och ordna decimaltal", grades: "åk 4–6",
  summary: "Vilket är störst: 0,5 eller 0,45? Fyll ut med nollor och jämför plats för plats.",
  lgr: "Tal i decimalform; rationella tal och deras egenskaper",
  objectives: ["Jämföra decimaltal med olika antal decimaler.", "Ordna decimaltal från minst till störst.", "Avgöra om ett tal ligger mellan två andra."],
  intro: "”Längre tal är större” gäller för heltal – men inte för decimaltal. $0{,}45$ har fler siffror än $0{,}5$ men är *mindre*. Det är en av de vanligaste missuppfattningarna, och den försvinner när eleven fyller ut med nollor och tänker **hundradelar**.",
  theory: [
    { heading: "Jämför plats för plats från vänster", body: "Jämför hela talen först, sedan tiondelar, sedan hundradelar … Det första stället där talen skiljer sig avgör: $0{,}45$ och $0{,}5$: tiondelarna 4 och 5 – alltså $0{,}45 < 0{,}5$." },
    { heading: "Fyll ut med nollor", body: "Skriv båda talen med lika många decimaler: $0{,}5 = 0{,}50$. Nu syns det: 45 hundradelar mot 50 hundradelar. Nollan ändrar inte värdet.", visual: { type: "fractionbars", bars: [{ parts: 10, shaded: 5, label: "0,5" }, { parts: 100, shaded: 45, label: "0,45" }] } },
    { heading: "Ordna tal", body: "Skriv talen med lika många decimaler, jämför som vanliga heltal (45, 50, 38) och ordna. $0{,}38 < 0{,}45 < 0{,}5$." },
    { heading: "Mellan två tal", body: "Det finns alltid ett tal mellan två decimaltal: mellan $0{,}3$ och $0{,}4$ ligger $0{,}35$. Zooma in till hundradelar (eller tusendelar)." },
  ],
  worked: [
    { title: "Fyll ut med nollor", problem: "Vilket är störst: 0,5 eller 0,45?", steps: [{ text: "Skriv med lika många decimaler.", math: "0{,}50\\ \\text{och}\\ 0{,}45" }, { text: "Jämför hundradelarna: 50 mot 45.", math: "50 > 45" }, { text: "Slutsats:", math: "0{,}5 > 0{,}45" }], why: "5 tiondelar är lika med 50 hundradelar, så det är mer än 45 hundradelar.", alternative: "Pengar: 0,50 kr (50 öre) mot 0,45 kr (45 öre)." },
    { title: "Ordna tre tal", problem: "Ordna 0,3, 0,29 och 0,305 från minst till störst.", steps: [{ text: "Tre decimaler:", math: "0{,}300,\\ 0{,}290,\\ 0{,}305" }, { text: "Jämför som heltal: 290 < 300 < 305.", math: "0{,}29 < 0{,}3 < 0{,}305" }], why: "Med lika många decimaler är det vanlig heltalsjämförelse.", alternative: "Placera talen på en tallinje." },
  ],
  drawing: { task: "Rita en tallinje från 0,3 till 0,5 delad i hundradelar. Markera 0,38, 0,4 och 0,45 och ordna dem.", tool: "numberline" },
  pupils: [{ pupil: "Sam", said: "0,45 är större än 0,5, för 45 är större än 5.", misconception: "Jämför decimaldelarna som heltal (45 mot 5) utan att se platserna.", response: "Skriv 0,5 som 0,50. Fråga: ”Hur många hundradelar är 0,5?” Visa med pengar: 50 öre mot 45 öre." }],
  knowledge: [
    { id: "compare", skill: "w6-l3.compare", gen: (rng) => { const a1 = rng.int(1, 9) * 10 + rng.int(0, 1) * 0; let b2 = a1 + rng.int(-9, 9); if (b2 % 10 === 0) b2 += 1; if (b2 < 1) b2 = a1 + 3; const swap = rng.chance(0.5); const A = swap ? b2 : a1, B = swap ? a1 : b2; const tx = (n: number) => (n % 10 === 0 ? T(n, 2) : dc(n, 2)); const c = sign3(A - B); return mc(`cp-${A}-${B}`, "w6-l3.compare", `Vilket tecken ska stå i rutan? ${tx(A)} □ ${tx(B)}`, c, ["<", ">", "="].filter((x) => x !== c).map((text) => ({ text })), `Fyll ut med nollor: ${dc(A, 2)} och ${dc(B, 2)}. Jämför hundradelarna: ${A} ${c} ${B}.`, ["Skriv båda med två decimaler."], rng); } },
    { id: "largest", skill: "w6-l3.order", gen: (rng) => { const set = new Set<number>(); while (set.size < 4) set.add(rng.int(11, 99)); const arr = [...set]; const mx = Math.max(...arr); const fmt = (n: number) => (n % 10 === 0 ? T(n, 2) : dc(n, 2)); const wantMax = rng.chance(0.5); const ans = wantMax ? mx : Math.min(...arr); return mc(`lg-${arr.join("-")}-${wantMax}`, "w6-l3.order", `Vilket av talen är ${wantMax ? "störst" : "minst"}?`, fmt(ans), arr.filter((x) => x !== ans).slice(0, 3).map((x) => ({ text: fmt(x) })), `Med två decimaler: ${arr.map((x) => dc(x, 2)).join(", ")}.`, ["Fyll ut med nollor."], rng); } },
    { id: "between", skill: "w6-l3.between", gen: (rng) => { const t = rng.int(1, 8); return numeric(`bt-${t}`, "w6-l3.between", `Vilket tal ligger mitt emellan ${T(t * 10, 2)} och ${T((t + 1) * 10, 2)}?`, dcAcc(t * 10 + 5, 2), `Mitt emellan i hundradelar: ${t * 10 + 5} = ${dc(t * 10 + 5, 2)}.`, ["Zooma in till hundradelar."]); } },
    { id: "padZero", skill: "w6-l3.zeros", gen: (rng) => { const t = rng.int(1, 9); return mc(`pz-${t}`, "w6-l3.zeros", `Vilket tal är lika med 0,${t}?`, `0,${t}0`, [{ text: `0,0${t}`, note: "En nolla mellan kommat och siffran ändrar värdet." }, { text: `0,${t}${t}` }, { text: `${t},0` }], `${t} tiondelar = ${t}0 hundradelar.`, [], rng); } },
    { id: "largestType", skill: "w6-l3.order", gen: (rng) => { const a = rng.int(2, 8) * 10, b = a - rng.int(1, 9); return numeric(`lt-${a}-${b}`, "w6-l3.order", `Vilket av talen ${T(a, 2)} och ${dc(b, 2)} är störst? Skriv talet.`, dcAcc(a, 2), `${dc(a, 2)} mot ${dc(b, 2)}: ${a} > ${b}.`, ["Fyll ut med noll."]); } },
  ],
  method: [
    { id: "equalDecimals", skill: "w6-l3.compare", gen: (rng) => { const a = rng.int(2, 8) * 10, b = a + rng.pick([-9, -7, -4, 3, 6, 8]); const big = Math.max(a, b); return multifield(`ed-${a}-${b}`, "w6-l3.compare", `Jämför ${T(a, 2)} och ${dc(b, 2)}. Skriv båda med två decimaler och avgör vilket som är störst.`, [{ label: `${T(a, 2)} med två decimaler`, accept: dcAcc(a, 2) }, { label: `${dc(b, 2)} med två decimaler`, accept: dcAcc(b, 2) }, { label: "Det större talet", accept: dcAcc(big, 2) }], `${dc(a, 2)} och ${dc(b, 2)}: ${a} ${a > b ? ">" : "<"} ${b}.`, []); } },
    { id: "orderThree", skill: "w6-l3.order", gen: (rng) => { const set = new Set<number>(); while (set.size < 3) set.add(rng.int(11, 99)); const arr = [...set]; const s = [...arr].sort((x, y) => x - y); return multifield(`o3-${arr.join("-")}`, "w6-l3.order", `Ordna ${arr.map((x) => dc(x, 2)).join(", ")} från minst till störst.`, [{ label: "Minst", accept: dcAcc(s[0], 2) }, { label: "Mitten", accept: dcAcc(s[1], 2) }, { label: "Störst", accept: dcAcc(s[2], 2) }], `${s.map((x) => dc(x, 2)).join(" < ")}.`, ["Alla har två decimaler."]); } },
  ],
  representation: [
    { id: "markLarger", skill: "w6-l3.numberline", gen: (rng) => { const Tn = rng.int(3, 8) * 10; let H = Tn + rng.int(-9, 9); if (H % 10 === 0) H += 1; const big = Math.max(Tn, H); return numberlineEx(`ml-${Tn}-${H}`, "w6-l3.numberline", `Tallinjen är inzoomad (hundradelar). Markera det större av ${T(Tn, 2)} och ${dc(H, 2)}.`, big, { min: Tn - 10, max: Tn + 10, step: 1, labelEvery: 5, dp: 2 }, `${dc(Tn, 2)} och ${dc(H, 2)}: störst är ${dc(big, 2)}.`, ["Det som ligger längst åt höger."]); } },
    { id: "barsCompare", skill: "w6-l3.bars", gen: (rng) => { const t = rng.int(2, 8); let h = rng.int(11, 79); const tenth = t * 10; if (h === tenth) h += 1; const bigFirst = tenth > h; return withVisual(mc(`bc-${t}-${h}`, "w6-l3.bars", "Båda staplarna står för 1 hel. Vilken stapel har mest färgat?", bigFirst ? `Den övre (${T(tenth, 2)})` : `Den nedre (${dc(h, 2)})`, [{ text: bigFirst ? `Den nedre (${dc(h, 2)})` : `Den övre (${T(tenth, 2)})` }, { text: "De är lika" }], `${T(tenth, 2)} = ${tenth} hundradelar och ${dc(h, 2)} = ${h} hundradelar.`, ["Jämför längderna."], rng), { type: "fractionbars", bars: [{ parts: 10, shaded: t, label: T(tenth, 2) }, { parts: 100, shaded: h, label: dc(h, 2) }] }); } },
  ],
  teacher: {
    title: "Längre tal är inte större",
    scenarios: ["Sam (åk 5) påstår att 0,45 är större än 0,5 \"eftersom 45 är större än 5\". Han är övertygad."],
    prompt: "Förklara för Sam hur han kan avgöra vilket tal som är störst, och varför 0,5 är större. Använd gärna hundradelar, pengar eller en tallinje.",
    minChars: 160,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "noll", label: "att fylla ut 0,5 med en nolla: 0,50", any: ["0,50", "fylla ut", "lika många decimaler", "nolla"] },
        { id: "hundradelar", label: "50 hundradelar mot 45 hundradelar", any: ["50 hundradelar", "45 hundradelar", "hundradelar", "50 mot 45", "50 > 45"] },
        { id: "modell", label: "en modell (pengar, öre, tallinje, rutnät)", any: ["öre", "kr", "pengar", "tallinje", "rutnät", "rutor"] },
        { id: "svar", label: "att 0,5 är större", any: ["0,5 är större", "0,5 > 0,45", "0,5 är störst", "femtio är mer", "större"] },
        { id: "plats", label: "att platsen avgör, inte antalet siffror", any: ["plats", "tiondel", "antalet siffror", "inte längden"] },
      ],
    },
    modelAnswer: "Sam, antalet siffror avgör inte hur stort ett decimaltal är, utan vilka platser de står på. Fyll ut 0,5 med en nolla: 0,50. Nu är det 50 hundradelar mot 45 hundradelar, och 50 är mer än 45, så 0,5 är större än 0,45. Tänk på pengar: 0,50 kr är 50 öre, och det är mer än 45 öre. På en tallinje ligger 0,45 mellan 0,4 och 0,5 – alltså före 0,5. Tiondelarna 4 och 5 avgör: 5 tiondelar är mer än 4.",
  },
};

// ───────── Lektion 4: Addition och subtraktion ─────────
function pair(rng: Rng, op: "add" | "sub", needCarry: boolean): [number, number] {
  for (let i = 0; i < 300; i++) {
    const A = rng.int(105, 9999), B = rng.int(105, 9999);
    const a = op === "sub" ? Math.max(A, B) : A, b = op === "sub" ? Math.min(A, B) : B;
    if (a === b) continue;
    const c = columnSolution(op, a, b).carries.filter(Boolean).length;
    if (!needCarry || c >= 1) return [a, b];
  }
  return op === "add" ? [1285, 478] : [1205, 478];
}

export const lesson4: Lesson = {
  id: "w6-l4", worldId: "w6", title: "Addition och subtraktion med decimaltal", grades: "åk 4–6",
  summary: "Komma under komma, fyll ut med nollor – och förstå varför.",
  lgr: "Metoder för beräkningar med enkla tal i decimalform vid huvudräkning, överslag och skriftlig beräkning",
  objectives: ["Utföra addition och subtraktion med decimaltal i uppställning.", "Förklara varför kommatecknen ska stå under varandra.", "Använda överslag för att kontrollera."],
  intro: "Uppställning med decimaltal är samma metod som för heltal – men **platserna måste stämma**. Tiondelar ska adderas med tiondelar och hundradelar med hundradelar. Därför står komma under komma. Det är därför du *bedöms på mellanstegen*: minnessiffror och växlingar.",
  theory: [
    { heading: "Komma under komma", body: "Ställ upp så att varje plats ligger i samma kolumn: ental under ental, tiondelar under tiondelar. Då hamnar kommatecknen automatiskt under varandra. $4{,}5 + 2{,}25$ ställs upp som $4{,}50 + 2{,}25$ – vi fyller ut med en nolla." },
    { heading: "Räkna som vanligt", body: "Börja längst till höger. $0 + 5 = 5$ hundradelar, $5 + 2 = 7$ tiondelar, $4 + 2 = 6$ ental. Svaret: $6{,}75$. Kommat i svaret hamnar under de andra." },
    { heading: "Minnessiffra och växling", body: "$10$ hundradelar blir $1$ tiondel (minnessiffra); en tiondel kan växlas till 10 hundradelar vid subtraktion – precis som tiotal och ental." },
    { heading: "Överslag", body: "$4{,}9 + 3{,}2 \\approx 5 + 3 = 8$. Svaret $8{,}1$ är rimligt, men $81$ eller $0{,}81$ är det inte." },
  ],
  worked: [
    { title: "Addition", problem: "Beräkna 4,5 + 2,25.", steps: [{ text: "Fyll ut med noll så att båda har två decimaler.", math: "4{,}50 + 2{,}25" }, { text: "Hundradelar: 0 + 5 = 5. Tiondelar: 5 + 2 = 7. Ental: 4 + 2 = 6.", math: "6{,}75" }], why: "Tiondelar adderas med tiondelar – annars blandar vi olika sorters delar.", alternative: "Som hundradelar: 450 + 225 = 675, alltså 6,75." },
    { title: "Subtraktion med växling", problem: "Beräkna 5,2 − 1,75.", steps: [{ text: "Fyll ut: 5,20 − 1,75.", math: "5{,}20 - 1{,}75" }, { text: "0 − 5 går inte: växla en tiondel. 10 − 5 = 5. Tiondelar: 1 − 7 går inte: växla ett ental. 11 − 7 = 4. Ental: 4 − 1 = 3.", math: "3{,}45" }, { text: "Kontroll:", math: "3{,}45 + 1{,}75 = 5{,}20" }], why: "Vi växlar precis som i heltalssubtraktion: 1 ental = 10 tiondelar.", alternative: "Hundradelar: 520 − 175 = 345." },
  ],
  drawing: { task: "Rita ett hundrarutnät. Färga 0,35. Lägg till 0,2 och färga det med en annan färg. Hur många rutor är färgade, och vilket tal är det?", tool: "hundredgrid" },
  pupils: [{ pupil: "Mia", said: "4,5 + 2,25: 4 + 2 = 6 och 5 + 25 = 30, så svaret är 6,30.", misconception: "Behandlar decimalerna som ett separat heltal och adderar 5 med 25.", response: "Fråga: ”Är 5 tiondelar och 25 hundradelar samma sorts delar?” Skriv 4,50 och räkna kolumnvis: 6,75." }],
  knowledge: [
    { id: "addDec", skill: "w6-l4.add", gen: (rng) => { const a1 = rng.int(11, 99), b2 = rng.int(101, 999); const A = a1 * 10; return numeric(`ad-${a1}-${b2}`, "w6-l4.add", `${dc(a1, 1)} + ${dc(b2, 2)} = ?`, dcAcc(A + b2, 2), `${dc(A, 2)} + ${dc(b2, 2)} = ${dc(A + b2, 2)}.`, ["Fyll ut med nollor."]); } },
    { id: "subDec", skill: "w6-l4.sub", gen: (rng) => { const b2 = rng.int(101, 499), a1 = rng.int(51, 99); const A = a1 * 10 + 0; return numeric(`sd-${a1}-${b2}`, "w6-l4.sub", `${dc(a1, 1)} − ${dc(b2, 2)} = ?`, dcAcc(A - b2, 2), `${dc(A, 2)} − ${dc(b2, 2)} = ${dc(A - b2, 2)}.`, ["Hundradelar: " + A + " − " + b2 + "."]); } },
    { id: "money", skill: "w6-l4.word", gen: (rng) => { const a = rng.int(1500, 4999), b = rng.int(750, 2999); return numeric(`mn-${a}-${b}`, "w6-l4.word", `Du köper en bok för ${dc(a, 2)} kr och en penna för ${dc(b, 2)} kr. Hur mycket kostar det tillsammans?`, dcAcc(a + b, 2), `${dc(a, 2)} + ${dc(b, 2)} = ${dc(a + b, 2)}.`, ["Kronor med kronor, ören med ören."], "kr"); } },
    { id: "alignMc", skill: "w6-l4.align", gen: (rng) => mc("al", "w6-l4.align", "Hur ställer man upp 4,5 + 2,25 rätt?", "Komma under komma: 4,50 + 2,25", [{ text: "Siffrorna högerjusterade: 4,5 under 2,25 med 5 under 5", note: "Då hamnar tiondelar under hundradelar." }, { text: "Ta bort kommatecknen: 45 + 225" }, { text: "Räkna heltalen och decimalerna var för sig: 4 + 2 och 5 + 25" }], "Varje plats måste hamna i samma kolumn.", ["Vilken sorts delar adderar vi?"], rng) },
    { id: "estimate", skill: "w6-l4.estimate", gen: (rng) => { const a = rng.int(31, 89), b = rng.int(21, 79); const ra = Math.round(a / 10), rb = Math.round(b / 10); return numeric(`es-${a}-${b}`, "w6-l4.estimate", `Överslag: avrunda ${dc(a, 1)} och ${dc(b, 1)} till närmaste heltal och addera.`, ra + rb, `${ra} + ${rb} = ${ra + rb}.`, ["Avrunda var och en."]); } },
  ],
  method: [
    { id: "colAddDec", skill: "w6-l4.col", gen: (rng) => { const [a, b] = pair(rng, "add", true); return columnEx(`ca-${a}-${b}`, "w6-l4.col", "add", a, b, `${dc(a, 2)} + ${dc(b, 2)} = ${dc(a + b, 2)}.`, ["Komma under komma. Skriv minnessiffrorna."], "Ställ upp (komma under komma) och räkna. Skriv minnessiffror och svar (utan komma).", 2); } },
    { id: "colSubDec", skill: "w6-l4.col", gen: (rng) => { const [a, b] = pair(rng, "sub", true); return columnEx(`cs-${a}-${b}`, "w6-l4.col", "sub", a, b, `${dc(a, 2)} − ${dc(b, 2)} = ${dc(a - b, 2)}.`, ["Skriv 1 i kolumnen som växlas."], "Ställ upp (komma under komma) och räkna. Markera växlingarna och skriv svaret (utan komma).", 2); } },
  ],
  representation: [
    { id: "hopDec", skill: "w6-l4.numberline", gen: (rng) => { const s = rng.int(5, 25), h = rng.int(3, 20); return numberlineEx(`hd-${s}-${h}`, "w6-l4.numberline", `Starta vid ${dc(s, 1)} och hoppa ${dc(h, 1)} åt höger. Markera var du hamnar.`, s + h, { min: 0, max: 50, step: 1, labelEvery: 10, dp: 1 }, `${dc(s, 1)} + ${dc(h, 1)} = ${dc(s + h, 1)}.`, ["Hur många tiondelar hoppar du?"]); } },
    { id: "gridAdd", skill: "w6-l4.grid", gen: (rng) => { const a = rng.int(20, 60), b = rng.int(10, 30); return withVisual(multifield(`ga-${a}-${b}`, "w6-l4.grid", `Rutnätet visar ${dc(a, 2)}. Du lägger till ${dc(b, 2)}. Hur många rutor är färgade sammanlagt, och vilket decimaltal är det?`, [{ label: "Färgade rutor totalt", accept: [a + b] }, { label: "Decimaltal", accept: dcAcc(a + b, 2) }], `${a} + ${b} = ${a + b} rutor = ${dc(a + b, 2)}.`, []), { type: "decimalgrid", hundredths: a }); } },
  ],
  teacher: {
    title: "5 tiondelar + 25 hundradelar",
    scenarios: ["Mia (åk 5) räknar 4,5 + 2,25 genom att addera 4 + 2 = 6 och 5 + 25 = 30. Hon svarar 6,30 och säger att det \"blir ju tre efter kommat\"."],
    prompt: "Förklara för Mia vad som är fel i hennes beräkning och hur du kan visa rätt väg i uppställning. Förklara varför kommatecknen ska stå under varandra.",
    minChars: 170,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "olika", label: "att tiondelar och hundradelar är olika sorters delar", any: ["olika sorter", "olika delar", "olika platser", "tiondelar och hundradelar", "inte samma sort"] },
        { id: "noll", label: "att fylla ut med en nolla: 4,50", any: ["4,50", "fylla ut", "nolla"] },
        { id: "svar", label: "rätt svar 6,75", any: ["6,75"] },
        { id: "komma", label: "komma under komma / samma plats i samma kolumn", any: ["komma under komma", "under varandra", "samma kolumn", "samma plats", "kolumn"] },
        { id: "hund", label: "50 + 25 hundradelar = 75", any: ["50 + 25", "75 hundradelar", "75"] },
      ],
    },
    modelAnswer: "Mia, 5 tiondelar och 25 hundradelar är olika sorters delar, så man kan inte bara lägga ihop 5 och 25. Fyll ut 4,5 med en nolla: 4,50. Nu ställer vi upp med komma under komma så att varje plats hamnar i samma kolumn: hundradelar 0 + 5 = 5, tiondelar 5 + 2 = 7, ental 4 + 2 = 6. Svaret är 6,75. Som hundradelar: 50 + 25 = 75 hundradelar. Kommatecknen står under varandra just för att tiondelar ska adderas med tiondelar.",
  },
};
