import type { Lesson } from "../types";
import { mc, numeric, multifield, sv, numberlineEx, columnEx, columnSolution, withVisual } from "@/lib/engine/gen-helpers";
import type { Rng } from "@/lib/engine/rng";

const carriesOf = (a: number, b: number) => columnSolution("add", a, b).carries.filter(Boolean).length;
const borrowsOf = (a: number, b: number) => columnSolution("sub", a, b).carries.filter(Boolean).length;

function addPair(rng: Rng, digits: number, needCarry: boolean) {
  for (let i = 0; i < 200; i++) {
    const a = rng.int(10 ** (digits - 1), 10 ** digits - 1), b = rng.int(10 ** (digits - 2), 10 ** digits - 1);
    if (!needCarry || carriesOf(a, b) >= 1) return [a, b] as const;
  }
  return [478, 256] as const;
}
function subPair(rng: Rng, digits: number, needBorrow: boolean) {
  for (let i = 0; i < 200; i++) {
    const a = rng.int(10 ** (digits - 1), 10 ** digits - 1), b = rng.int(10 ** (digits - 2), a - 1);
    if (b > 0 && (!needBorrow || borrowsOf(a, b) >= 1)) return [a, b] as const;
  }
  return [532, 278] as const;
}

// ───────── Lektion 1: Huvudräkning addition ─────────
export const lesson1: Lesson = {
  id: "w2-l1", worldId: "w2", title: "Huvudräkning: addition", grades: "åk 4–6",
  summary: "Smarta strategier: dela upp, runda och kompensera, hoppa på tallinjen.",
  lgr: "Metoder för beräkningar med naturliga tal vid huvudräkning och överslagsräkning; de fyra räknesätten",
  objectives: ["Använda flera huvudräkningsstrategier för addition.", "Välja strategi efter talens egenskaper.", "Förklara varför strategierna fungerar."],
  intro: "Det finns sällan *ett* rätt sätt att räkna i huvudet. Skickliga räknare väljer strategi efter talen. Som lärare behöver du kunna flera – och förklara varför de fungerar, eftersom elever ofta upptäcker egna vägar.",
  theory: [
    { heading: "Dela upp efter platsvärde", body: "Dela upp båda talen och lägg ihop del för del: $47 + 35 = (40 + 30) + (7 + 5) = 70 + 12 = 82$. Det här är samma tanke som i uppställning, men uttalad. Fördel: fungerar alltid. Fara: man tappar lätt bort en del.", visual: { type: "placevalue", value: 47 } },
    { heading: "Runda och kompensera", body: "Om ett tal ligger nära ett jämnt tiotal: runda, räkna, justera. $49 + 36$: $50 + 36 = 86$, men vi lade till 1 för mycket, så $86 - 1 = 85$. Det fungerar eftersom $49 = 50 - 1$." },
    { heading: "Hoppa på tallinjen", body: "Börja med det ena talet och hoppa med det andra i delar: $47 + 35$: $47 \\to 50$ (+3) $\\to 80$ (+30) $\\to 82$ (+2). Strategin visar att addition är en **förflyttning** längs tallinjen.", visual: { type: "numberline", min: 40, max: 90, step: 5, marks: [47, 50, 80, 82], labelEvery: 10 } },
    { heading: "Ordningen spelar ingen roll", body: "Vid addition får termerna byta plats: $a + b = b + a$ (**kommutativa lagen**). Därför kan du börja med det största talet, vilket ofta är lättast." },
  ],
  worked: [
    { title: "Dela upp", problem: "Beräkna 58 + 27 i huvudet.", steps: [{ text: "Dela upp i tiotal och ental.", math: "58 = 50 + 8,\\ 27 = 20 + 7" }, { text: "Addera tiotalen och entalen var för sig.", math: "70 + 15" }, { text: "Lägg ihop.", math: "70 + 15 = 85" }], why: "Addition är associativ: vi får gruppera termerna om hur vi vill utan att summan ändras.", alternative: "Kompensera: $58 + 27 = 60 + 27 - 2 = 85$." },
    { title: "Kompensera", problem: "Beräkna 398 + 156.", steps: [{ text: "398 ligger nära 400.", math: "398 = 400 - 2" }, { text: "Räkna med det runda talet.", math: "400 + 156 = 556" }, { text: "Justera med det du lade till för mycket.", math: "556 - 2 = 554" }], why: "Vi adderade 2 för mycket, så vi tar bort 2 från summan.", alternative: "Dela upp: $300 + 100 + 90 + 50 + 8 + 6$." },
  ],
  drawing: { task: "Rita en tallinje och visa hoppen för 47 + 35 (till närmaste tiotal, sedan hela tiotal, sedan resten).", tool: "numberline" },
  pupils: [{ pupil: "Ida", said: "38 + 27: 3 + 2 = 5 och 8 + 7 = 15, så svaret är 515.", misconception: "Adderar siffror utan hänsyn till platsvärde och skriver delsvaren efter varandra.", response: "Fråga vad 3:an i 38 är värd. Låt Ida använda tiotalsstavar och ental: 3 tiotal + 2 tiotal = 5 tiotal (50) och 8 + 7 = 15 ental, tillsammans 65." }],
  knowledge: [
    { id: "mental2", skill: "w2-l1.add-mental", gen: (rng, { level }) => { const a = rng.int(23, level > 1 ? 489 : 89), b = rng.int(11, level > 1 ? 387 : 59); return numeric(`m-${a}-${b}`, "w2-l1.add-mental", `Räkna i huvudet: ${sv(a)} + ${sv(b)}`, a + b, `${sv(a)} + ${sv(b)} = ${sv(a + b)}.`, ["Dela upp i hundratal, tiotal och ental.", "Eller runda och kompensera."]); } },
    { id: "compensate", skill: "w2-l1.compensate", gen: (rng) => { const k = rng.int(2, 7) * 10, d = rng.pick([1, 2, 3]), b = rng.int(24, 96); return numeric(`c-${k}-${d}-${b}`, "w2-l1.compensate", `${k - d} + ${b} = ? (Tips: ${k} + ${b} − ${d})`, k - d + b, `${k} + ${b} = ${k + b}, och eftersom ${k} är ${d} större än ${k - d} drar vi av ${d}: ${k + b - d}.`, [`Räkna först ${k} + ${b}.`]); } },
    { id: "strategyMc", skill: "w2-l1.strategy", gen: (rng) => { const a = rng.int(2, 8) * 10 - 1, b = rng.int(21, 76); return mc(`s-${a}-${b}`, "w2-l1.strategy", `Vilken strategi är smartast för ${a} + ${b}?`, `Räkna ${a + 1} + ${b} och dra bort 1`, [{ text: `Räkna ${a} + ${b} siffra för siffra` }, { text: `Räkna ${a + 1} + ${b} och lägg till 1` , note: "Du lade redan till 1 för mycket – då ska du dra bort 1." }, { text: `Dela upp ${b} i ental och lägg till ett i taget` }], `${a} ligger ett steg från ${a + 1}. Räkna med det runda talet och justera.`, ["Vilket tal ligger nära ett jämnt tiotal?"], rng); } },
    { id: "tenFriends", skill: "w2-l1.complement", gen: (rng) => { const t = rng.pick([100, 1000]), a = t === 100 ? rng.int(11, 89) : rng.int(11, 89) * 10; return numeric(`tf-${t}-${a}`, "w2-l1.complement", `${sv(a)} + □ = ${sv(t)}`, t - a, `${sv(t)} − ${sv(a)} = ${sv(t - a)}.`, ["Hur mycket saknas upp till " + sv(t) + "?"]); } },
  ],
  method: [
    { id: "splitAdd", skill: "w2-l1.split", gen: (rng) => { const a = rng.int(21, 79), b = rng.int(21, 79); const ts = (Math.floor(a / 10) + Math.floor(b / 10)) * 10, es = (a % 10) + (b % 10); return multifield(`sp-${a}-${b}`, "w2-l1.split", `Räkna ${a} + ${b} genom att dela upp i tiotal och ental. Fyll i mellanstegen.`, [{ label: "Tiotalen tillsammans", accept: [ts] }, { label: "Entalen tillsammans", accept: [es] }, { label: "Summa", accept: [a + b] }], `${ts} + ${es} = ${a + b}.`, ["Tiotal för sig, ental för sig."]); } },
    { id: "jumpAdd", skill: "w2-l1.jump", gen: (rng) => { const a = rng.int(23, 68), b = rng.int(23, 38); const toTen = (10 - (a % 10)) % 10 || 10; const step1 = a + toTen; return multifield(`jp-${a}-${b}`, "w2-l1.jump", `Räkna ${a} + ${b} med hopp på tallinjen. Hoppa först till nästa heltal tiotal.`, [{ label: "Hoppa till (nästa jämna tiotal)", accept: [step1] }, { label: "Hur långt är hoppet?", accept: [toTen] }, { label: "Svar", accept: [a + b] }], `${a} → ${step1} (+${toTen}) → ${a + b} (+${b - toTen}).`, ["Hur många ental till nästa tiotal?"]); } },
  ],
  representation: [
    { id: "jumpLine", skill: "w2-l1.numberline", gen: (rng) => { const a = rng.int(1, 7) * 10, b = rng.int(1, 4) * 10; return numberlineEx(`jl-${a}-${b}`, "w2-l1.numberline", `Starta på ${a} och hoppa ${b} åt höger. Markera var du hamnar.`, a + b, { min: 0, max: 120, step: 10, labelEvery: 20 }, `${a} + ${b} = ${a + b}.`, ["Hur många tiotal hoppar du?"]); } },
    { id: "tenFrame", skill: "w2-l1.numberline", gen: (rng) => { const a = rng.int(2, 9) * 10 + rng.int(1, 9); const target = Math.ceil(a / 10) * 10; return numberlineEx(`tf2-${a}`, "w2-l1.numberline", `Du ska räkna ${a} + 20. Första hoppet går till nästa jämna tiotal. Markera det.`, target, { min: 0, max: 120, step: 10, labelEvery: 20 }, `Närmaste jämna tiotal efter ${a} är ${target}.`, []); } },
  ],
  teacher: {
    title: "När siffror adderas utan platsvärde",
    scenarios: ["Ida (åk 4) räknar 38 + 27 så här: \"3 + 2 = 5 och 8 + 7 = 15. Alltså 515.\" Hon är nöjd med att hon räknat \"var del för sig\"."],
    prompt: "Förklara för Ida vad som är rätt och fel i hennes tänkande, och visa hur man delar upp talen med platsvärde för att få rätt svar. Använd en modell.",
    minChars: 160,
    rubric: {
      minConcepts: 3,
      concepts: [
        { id: "ratt", label: "att uppdelningen är en bra idé men tiotalen är tiotal (30 + 20)", any: ["30", "20", "tiotal", "tiotalen"] },
        { id: "plats", label: "platsvärde (3:an är 30, inte 3)", any: ["platsvärde", "är värd", "betyder 30", "30 och", "trettio"] },
        { id: "svar", label: "rätt svar 65 (eller 50 + 15)", any: ["65", "50 + 15", "50+15"] },
        { id: "modell", label: "en modell (basblock, tallinje, tabell)", any: ["basblock", "tallinje", "tabell", "stavar", "pengar", "kuber"] },
      ],
    },
    modelAnswer: "Ida, tanken att dela upp talen är bra! Men 3:an i 38 är trettio, inte tre, och 2:an i 27 är tjugo. Tiotalen är alltså 30 + 20 = 50, och entalen 8 + 7 = 15. Tillsammans 50 + 15 = 65. Med basblock: 3 + 2 tiostavar blir 5 stavar (50), och 8 + 7 kuber blir 15 kuber, som du kan växla till 1 stav och 5 kuber. Då blir det 6 stavar och 5 kuber: 65.",
  },
};

// ───────── Lektion 2: Huvudräkning subtraktion ─────────
export const lesson2: Lesson = {
  id: "w2-l2", worldId: "w2", title: "Huvudräkning: subtraktion", grades: "åk 4–6",
  summary: "Stegvis subtraktion, kompensation och skillnad som avstånd.",
  lgr: "Metoder för beräkningar med naturliga tal vid huvudräkning; de fyra räknesätten och deras samband",
  objectives: ["Använda flera strategier för subtraktion i huvudet.", "Förstå subtraktion som både \"ta bort\" och \"skillnad\".", "Undvika vanliga fel (att vända på siffrorna)."],
  intro: "Subtraktion är svårare än addition för många elever – delvis för att ordningen *spelar* roll, och delvis för att den kan betyda två olika saker: att ta bort och att jämföra (skillnad). Att välja rätt tolkning gör beräkningen enklare.",
  theory: [
    { heading: "Ta bort stegvis", body: "Dela upp det du subtraherar: $83 - 27 = 83 - 20 - 7 = 63 - 7 = 56$. Eller subtrahera till ett jämnt tiotal först: $83 - 3 = 80$, $80 - 24 = 56$." },
    { heading: "Skillnad som avstånd", body: "När talen ligger nära varandra är det enklare att tänka *avstånd*: $1\\,002 - 998$: från 998 till 1 000 är 2, och till 1 002 är ytterligare 2. Skillnaden är 4. Räkna uppåt från det lilla talet.", visual: { type: "numberline", min: 990, max: 1010, step: 2, marks: [998, 1002], labelEvery: 10 } },
    { heading: "Kompensera", body: "$83 - 29 = 83 - 30 + 1 = 54$. Vi tog bort 1 för mycket (30 i stället för 29), så vi lägger tillbaka 1." },
    { heading: "Ordningen spelar roll", body: "$12 - 5 \\neq 5 - 12$. Subtraktion är **inte** kommutativ. Resultatet av $5 - 12$ är ett negativt tal (se Värld 8). I skolan använder vi först bara fallet där det första talet är störst." },
  ],
  worked: [
    { title: "Stegvis", problem: "Beräkna 74 − 38.", steps: [{ text: "Ta bort tiotalen först.", math: "74 - 30 = 44" }, { text: "Ta bort entalen.", math: "44 - 8 = 36" }], why: "Vi delade upp 38 som 30 + 8. Att ta bort en summa är att ta bort delarna efter varandra.", alternative: "Kompensera: $74 - 40 + 2 = 36$." },
    { title: "Skillnad", problem: "Beräkna 1 000 − 647.", steps: [{ text: "Hoppa upp från 647 till 650.", math: "647 \\to 650:\\ 3" }, { text: "Hoppa till 1 000.", math: "650 \\to 1\\,000:\\ 350" }, { text: "Lägg ihop hoppen.", math: "3 + 350 = 353" }], why: "Subtraktion är skillnaden mellan talen, alltså hela avståndet på tallinjen.", alternative: "Räkna $999 - 646 = 353$ (båda talen minskas med 1 – skillnaden är oförändrad)." },
  ],
  drawing: { task: "Rita en tallinje och visa 1 000 − 647 som avstånd i två hopp.", tool: "numberline" },
  pupils: [{ pupil: "Tim", said: "52 − 27: jag kan inte ta 2 minus 7, så jag gör 7 minus 2 = 5, och 5 − 2 = 3. Svaret är 35.", misconception: "Vänder på siffrorna så att den största alltid dras ifrån den minsta.", response: "Fråga: Är 52 − 27 större eller mindre än 35? Använd basblock: 5 stavar och 2 kuber – hur tar man bort 7 kuber?" }],
  knowledge: [
    { id: "sub2", skill: "w2-l2.sub-mental", gen: (rng, { level }) => { const b = rng.int(12, level > 1 ? 289 : 59), a = b + rng.int(21, level > 1 ? 400 : 59); return numeric(`s-${a}-${b}`, "w2-l2.sub-mental", `Räkna i huvudet: ${sv(a)} − ${sv(b)}`, a - b, `${sv(a)} − ${sv(b)} = ${sv(a - b)}.`, ["Ta bort tiotal/hundratal först, sedan ental."]); } },
    { id: "closeDiff", skill: "w2-l2.difference", gen: (rng) => { const a = rng.int(2, 9) * 100 + rng.int(1, 3), b = a - rng.int(4, 9); return numeric(`cd-${a}-${b}`, "w2-l2.difference", `Räkna skillnaden: ${sv(a)} − ${sv(b)}`, a - b, `Talen ligger nära varandra – avståndet är ${a - b}.`, ["Räkna uppåt från det lilla talet."]); } },
    { id: "compSub", skill: "w2-l2.compensate", gen: (rng) => { const k = rng.int(3, 9) * 10, d = rng.pick([1, 2]), a = rng.int(120, 480); return numeric(`cs-${a}-${k}-${d}`, "w2-l2.compensate", `${a} − ${k - d} = ? (Tips: ${a} − ${k} + ${d})`, a - k + d, `${a} − ${k} = ${a - k}. Vi tog ${d} för mycket, så +${d}: ${a - k + d}.`, ["Räkna först med det runda talet."]); } },
    { id: "noncomm", skill: "w2-l2.concept", gen: (rng) => { const a = rng.int(10, 30), b = rng.int(2, 9); return mc(`nc-${a}-${b}`, "w2-l2.concept", `Stämmer det att ${a} − ${b} = ${b} − ${a}?`, "Nej – subtraktion är inte kommutativ", [{ text: "Ja – talen får alltid byta plats" }, { text: "Ja, men bara om talen är jämna" }, { text: `Ja, för båda ger ${a - b}` }], `${a} − ${b} = ${a - b}, men ${b} − ${a} är ett negativt tal. Ordningen spelar roll.`, ["Prova med små tal, t.ex. 5 − 2 och 2 − 5."], rng); } },
  ],
  method: [
    { id: "stepSub", skill: "w2-l2.stepwise", gen: (rng) => { const a = rng.int(61, 99), b = rng.int(21, 58); const t = Math.floor(b / 10) * 10, e = b % 10; return multifield(`ss-${a}-${b}`, "w2-l2.stepwise", `Räkna ${a} − ${b} stegvis: ta bort tiotalen först, sedan entalen.`, [{ label: `${a} − ${t}`, accept: [a - t] }, { label: `Sedan − ${e}`, accept: [a - b] }], `${a} − ${t} = ${a - t}; ${a - t} − ${e} = ${a - b}.`, ["Dela upp " + b + " som " + t + " + " + e + "."]); } },
    { id: "diffUp", skill: "w2-l2.difference", gen: (rng) => { const b = rng.int(31, 94) * 10 + rng.int(1, 9), top = (Math.floor(b / 100) + 1) * 100; const a = top + rng.int(1, 5) * 50; return multifield(`du-${a}-${b}`, "w2-l2.difference", `Räkna ${a} − ${b} som avstånd: hoppa uppåt från ${b}.`, [{ label: `Från ${b} till ${top}`, accept: [top - b] }, { label: `Från ${top} till ${a}`, accept: [a - top] }, { label: "Skillnad", accept: [a - b] }], `${top - b} + ${a - top} = ${a - b}.`, ["Hoppa till nästa jämna hundratal."]); } },
  ],
  representation: [
    { id: "backLine", skill: "w2-l2.numberline", gen: (rng) => { const a = rng.int(5, 10) * 10, b = rng.int(1, 4) * 10; return numberlineEx(`bl-${a}-${b}`, "w2-l2.numberline", `Starta på ${a} och hoppa ${b} åt vänster. Markera var du hamnar.`, a - b, { min: 0, max: 120, step: 10, labelEvery: 20 }, `${a} − ${b} = ${a - b}.`, ["Åt vänster betyder minus."]); } },
    { id: "gapLine", skill: "w2-l2.numberline", gen: (rng) => { const b = rng.int(2, 6) * 10, d = rng.int(1, 4) * 10; return numberlineEx(`gl-${b}-${d}`, "w2-l2.numberline", `Skillnaden mellan två tal är ${d}. Det mindre talet är ${b}. Markera det större talet.`, b + d, { min: 0, max: 120, step: 10, labelEvery: 20 }, `${b} + ${d} = ${b + d}.`, []); } },
  ],
  teacher: {
    title: "Subtraktion – ”vända på siffrorna”",
    scenarios: ["Tim (åk 4) räknar 52 − 27 och säger: \"2 − 7 går inte, så jag tar 7 − 2 = 5. Svaret blir 35.\" Han tycker att det blev smart."],
    prompt: "Förklara för Tim varför hans metod ger fel svar och hur man i stället kan tänka (t.ex. med växling, basblock eller tallinje). Visa rätt svar.",
    minChars: 160,
    rubric: {
      minConcepts: 3,
      concepts: [
        { id: "fel", label: "att subtraktion inte är kommutativ / siffrorna får inte vändas", any: ["inte kommutativ", "kan inte vända", "inte samma", "ordningen", "vända på"] },
        { id: "vaxla", label: "växling (ett tiotal blir 10 ental)", any: ["växl", "tio ental", "10 ental", "ett tiotal"] },
        { id: "svar", label: "rätt svar 25", any: ["25"] },
        { id: "modell", label: "en modell (basblock, tallinje, uppställning)", any: ["basblock", "tallinje", "stavar", "kuber", "uppställning", "tabell"] },
      ],
    },
    modelAnswer: "Tim, när du gör 7 − 2 istället för 2 − 7 vänder du på talen, men subtraktion är inte kommutativ – ordningen spelar roll. Vi tar 52 − 27 så här: vi har 5 tiostavar och 2 kuber. För att kunna ta bort 7 kuber växlar vi en tiostav till 10 kuber. Då har vi 4 stavar och 12 kuber. 12 − 7 = 5 kuber och 4 − 2 = 2 stavar, alltså 25. På tallinjen: från 27 till 30 är 3, till 50 är 20, till 52 är 2: totalt 25.",
  },
};

// ───────── Lektion 3: Uppställning addition ─────────
export const lesson3: Lesson = {
  id: "w2-l3", worldId: "w2", title: "Uppställning: addition", grades: "åk 4–6",
  summary: "Skriftlig addition med minnessiffror – och varför det fungerar.",
  lgr: "Skriftliga beräkningsmetoder med naturliga tal; de fyra räknesätten",
  objectives: ["Utföra addition i uppställning med minnessiffror.", "Förklara minnessiffran med platsvärde (10 ental = 1 tiotal).", "Kontrollera svaret med överslag."],
  intro: "Uppställning är en effektiv metod för stora tal. Men den är bara matematik – inte magi – om du förstår vad **minnessiffran** egentligen är: en växling. I den här lektionen bedöms både ditt svar *och* dina mellansteg.",
  theory: [
    { heading: "Ställ upp rätt", body: "Skriv talen under varandra så att ental står under ental, tiotal under tiotal och så vidare. Räkna kolumn för kolumn **från höger**.", visual: { type: "placevalue", value: 478 } },
    { heading: "Minnessiffran", body: "Om en kolumns summa är 10 eller mer, skriver vi entalssiffran i kolumnen och **överför ett tiotal** (1) till nästa kolumn. $8 + 6 = 14$: 4 ental stannar kvar, 1 tiotal flyttas åt vänster. Minnessiffran är alltså $10$ ental som växlats till $1$ tiotal." },
    { heading: "Kontrollera med överslag", body: "Avrunda talen och räkna ungefär: $478 + 256 \\approx 500 + 300 = 800$. Svaret 734 är rimligt. Om du fått 1 634 skulle överslaget avslöja felet." },
  ],
  worked: [
    { title: "Med två minnessiffror", problem: "Beräkna 478 + 256 i uppställning.", steps: [{ text: "Entalen: 8 + 6 = 14. Skriv 4, minnessiffra 1.", math: "8 + 6 = 14" }, { text: "Tiotalen: 7 + 5 + 1 (minne) = 13. Skriv 3, minnessiffra 1.", math: "7 + 5 + 1 = 13" }, { text: "Hundratalen: 4 + 2 + 1 = 7.", math: "4 + 2 + 1 = 7" }, { text: "Svaret:", math: "734" }], why: "Varje gång en kolumn blir 10 eller mer växlar vi tio av en enhet till en enhet på nästa plats.", alternative: "Utvecklad form: $400 + 70 + 8 + 200 + 50 + 6 = 600 + 120 + 14 = 734$." },
    { title: "Ny siffra i svaret", problem: "Beräkna 867 + 345.", steps: [{ text: "7 + 5 = 12, skriv 2 och minnessiffra 1.", math: "7 + 5 = 12" }, { text: "6 + 4 + 1 = 11, skriv 1 och minnessiffra 1.", math: "6 + 4 + 1 = 11" }, { text: "8 + 3 + 1 = 12, skriv 12.", math: "8 + 3 + 1 = 12" }, { text: "Svaret:", math: "1\\,212" }], why: "Summan i sista kolumnen får bli tvåsiffrig – då växer svaret med en plats.", alternative: "Överslag: $900 + 300 = 1\\,200$ – rimligt." },
  ],
  drawing: { task: "Rita basblock för 478 + 256 och visa hur 14 kuber växlas till 1 stav och 4 kuber.", tool: "column" },
  pupils: [{ pupil: "Hanna", said: "Jag skriver alltid 1:an över nästa tal – men jag vet inte varför.", misconception: "Procedurellt kunnande utan förståelse.", response: "Låt Hanna lägga 8 + 6 med kuber. Fråga: \"Vad gör vi med tio kuber?\" – växla till en stav, och den flyttas till tiotalskolumnen." }],
  knowledge: [
    { id: "add3", skill: "w2-l3.add-col", gen: (rng, { level }) => { const [a, b] = addPair(rng, level > 1 ? 4 : 3, true); return numeric(`a3-${a}-${b}`, "w2-l3.add-col", `Beräkna med uppställning: ${sv(a)} + ${sv(b)}`, a + b, `${sv(a)} + ${sv(b)} = ${sv(a + b)}.`, ["Räkna från höger. Skriv minnessiffror."]); } },
    { id: "countCarry", skill: "w2-l3.carries", gen: (rng) => { const [a, b] = addPair(rng, 3, true); return numeric(`cc-${a}-${b}`, "w2-l3.carries", `Hur många minnessiffror behövs när du räknar ${sv(a)} + ${sv(b)} i uppställning? (Räkna alla gånger en kolumn blir 10 eller mer.)`, carriesOf(a, b) + (a + b >= 10 ** String(Math.max(a, b)).length ? 1 : 0), `Kolumnerna som blir 10 eller mer ger minnessiffror: ${columnSolution("add", a, b).carries.map((c, i) => (c ? `kolumn ${i + 1}` : "")).filter(Boolean).join(", ")}${a + b >= 10 ** String(Math.max(a, b)).length ? " och den sista kolumnen ger en ny siffra" : ""}.`, ["Kontrollera varje kolumn från höger."]); } },
    { id: "whyCarry", skill: "w2-l3.concept", gen: (rng) => mc("wc", "w2-l3.concept", "Vad betyder minnessiffran 1 som skrivs ovanför tiotalskolumnen när entalen blir 14?", "10 ental har växlats till 1 tiotal", [{ text: "Man lägger till en etta för säkerhets skull" }, { text: "Ental blev 1 för mycket" }, { text: "Det är en gissning som man rättar senare" }], "14 ental är 1 tiotal och 4 ental. Tiotalet flyttas till tiotalskolumnen.", ["Hur många ental går det på ett tiotal?"], rng) },
    { id: "checkEstimate", skill: "w2-l3.estimate", gen: (rng) => { const [a, b] = addPair(rng, 3, true); const right = a + b; return mc(`ce-${a}-${b}`, "w2-l3.estimate", `Du räknar ${a} + ${b}. Vilket svar är rimligt enligt ett överslag?`, sv(right), [{ text: sv(right + 1000) }, { text: sv(right - 300) }, { text: sv(Math.round(right / 10)) }], `Avrunda: ${Math.round(a / 100) * 100} + ${Math.round(b / 100) * 100} ≈ ${Math.round(a / 100) * 100 + Math.round(b / 100) * 100}. Svaret ${sv(right)} ligger nära.`, ["Avrunda till hundratal."], rng); } },
  ],
  method: [
    { id: "colAdd3", skill: "w2-l3.add-col", gen: (rng) => { const [a, b] = addPair(rng, 3, true); return columnEx(`ca-${a}-${b}`, "w2-l3.add-col", "add", a, b, `${sv(a)} + ${sv(b)} = ${sv(a + b)}. Minnessiffrorna visar var kolumnsumman blev 10 eller mer.`, ["Skriv minnessiffran 1 ovanför nästa kolumn."], "Ställ upp och räkna. Skriv minnessiffror och svar."); } },
    { id: "colAdd4", skill: "w2-l3.add-col", gen: (rng) => { const [a, b] = addPair(rng, 4, true); return columnEx(`ca4-${a}-${b}`, "w2-l3.add-col", "add", a, b, `${sv(a)} + ${sv(b)} = ${sv(a + b)}.`, ["Börja i entalskolumnen."], "Ställ upp och räkna. Skriv minnessiffror och svar."); } },
  ],
  representation: [
    { id: "regroup", skill: "w2-l3.regroup", gen: (rng) => { const e = rng.int(11, 18), t = rng.int(2, 6); return multifield(`rg-${e}-${t}`, "w2-l3.regroup", `${t} tiostavar och ${e} kuber ska skrivas med så få kuber som möjligt. Hur många stavar och kuber får du då?`, [{ label: "Stavar", accept: [t + 1] }, { label: "Kuber", accept: [e - 10] }], `${e} kuber = 1 stav + ${e - 10} kuber. Totalt ${t + 1} stavar och ${e - 10} kuber.`, ["10 kuber = 1 stav."]); } },
    { id: "blocksSum", skill: "w2-l3.regroup", gen: (rng) => { const a = rng.int(12, 49), b = rng.int(12, 49); return withVisual(multifield(`bs-${a}-${b}`, "w2-l3.regroup", `Bilden visar ${a}. Du lägger till ${b}. Hur många tiotal och ental har du efter att du växlat (så att entalen är färre än 10)?`, [{ label: "Tiotal", accept: [Math.floor((a + b) / 10)] }, { label: "Ental", accept: [(a + b) % 10] }, { label: "Summa", accept: [a + b] }], `${a} + ${b} = ${a + b}.`, []), { type: "baseten", value: a }); } },
  ],
  teacher: {
    title: "Varför minnessiffran?",
    scenarios: ["Hanna (åk 4) kan metoden perfekt: \"Man skriver en etta ovanför nästa tal.\" Men när du frågar varför, säger hon: \"För att läraren sa det.\""],
    prompt: "Förklara för Hanna vad minnessiffran betyder med hjälp av platsvärde (och gärna basblock). Använd ett räkneexempel, t.ex. 478 + 256.",
    minChars: 160,
    rubric: {
      minConcepts: 3,
      concepts: [
        { id: "tio", label: "tio ental = ett tiotal (växling)", any: ["tio ental", "10 ental", "växl", "ett tiotal", "1 tiotal"] },
        { id: "plats", label: "platsvärde / kolumner", any: ["platsvärde", "kolumn", "tiotalskolumn", "plats"] },
        { id: "ex", label: "ett räkneexempel (14 ental, 8 + 6 …)", any: ["14", "8 + 6", "478", "256", "734"] },
        { id: "modell", label: "en modell (basblock, stavar, kuber)", any: ["basblock", "stavar", "kuber", "pengar", "sedlar"] },
      ],
    },
    modelAnswer: "Hanna, minnessiffran är en växling. Tänk 8 + 6 = 14 kuber. Tio kuber kan bytas mot en tiostav, så vi får 1 stav och 4 kuber. De 4 kuberna skriver vi under entalen, och tiostaven flyttar vi till tiotalskolumnen – det är minnessiffran 1. Platsvärdet gör att tio i en kolumn alltid motsvarar ett i kolumnen till vänster. Därför blir 478 + 256 = 734.",
  },
};

// ───────── Lektion 4: Uppställning subtraktion ─────────
export const lesson4: Lesson = {
  id: "w2-l4", worldId: "w2", title: "Uppställning: subtraktion med växling", grades: "åk 4–6",
  summary: "Skriftlig subtraktion, växling och varför den behövs.",
  lgr: "Skriftliga beräkningsmetoder med naturliga tal; de fyra räknesätten",
  objectives: ["Utföra subtraktion i uppställning med växling, även över nollor.", "Förklara växling med platsvärde.", "Kontrollera med addition."],
  intro: "Växling är det som flest elever (och vuxna!) trasslar med. Vi går därför in på **varför** den behövs: när vi inte kan ta bort så många ental som vi vill, gör vi om ett tiotal till tio ental. Mängden är densamma – bara skriven på ett annat sätt.",
  theory: [
    { heading: "När måste vi växla?", body: "Om siffran i det översta talet är **mindre** än siffran under, kan vi inte subtrahera direkt. Då växlar vi: vi tar ett tiotal från nästa kolumn och gör om det till **tio ental**. $52 - 27$: 2 ental räcker inte för att ta bort 7, så vi växlar ett tiotal: $12 - 7 = 5$ och tiotalen blir $4 - 2 = 2$. Svar: $25$." },
    { heading: "Växla över nollor", body: "I $5\\,003 - 1\\,234$ finns inga tiotal eller hundratal att växla från. Vi växlar steg för steg: ett tusental blir 10 hundratal, ett av dem blir 10 tiotal, ett av dem blir 10 ental. Resultatet: $3\\,769$. I uppställning markerar vi varje kolumn som växlats." },
    { heading: "Kontrollera med addition", body: "Subtraktion och addition är varandras motsatser. Kontrollera att differens + det du drog bort = det du började med: $3\\,769 + 1\\,234 = 5\\,003$." },
  ],
  worked: [
    { title: "En växling", problem: "Beräkna 532 − 278.", steps: [{ text: "Ental: 2 − 8 går inte. Växla ett tiotal: 12 − 8 = 4. Tiotalen minskar med 1.", math: "12 - 8 = 4" }, { text: "Tiotal: 2 (3 − 1) − 7 går inte. Växla ett hundratal: 12 − 7 = 5.", math: "12 - 7 = 5" }, { text: "Hundratal: 4 (5 − 1) − 2 = 2.", math: "4 - 2 = 2" }, { text: "Svaret:", math: "254" }], why: "Varje växling bevarar mängden: 1 hundratal = 10 tiotal.", alternative: "Hoppa uppåt: från 278 till 300 är 22, till 532 är 232: $22 + 232 = 254$." },
    { title: "Över nollor", problem: "Beräkna 5 003 − 1 234.", steps: [{ text: "Ental: 3 < 4. Tiotal och hundratal är 0, så vi växlar från tusentalet.", math: "5\\,003 \\to 4\\,9\\,9\\,13" }, { text: "13 − 4 = 9; 9 − 3 = 6; 9 − 2 = 7; 4 − 1 = 3.", math: "13-4=9,\\ 9-3=6,\\ 9-2=7,\\ 4-1=3" }, { text: "Svaret:", math: "3\\,769" }], why: "Ett tusental är lika med 9 hundratal + 9 tiotal + 10 ental. Därför blir nollorna nior.", alternative: "Räkna uppåt från 1 234: till 1 300 är 66, till 5 000 är 3 700 och till 5 003 är 3. Tillsammans $66 + 3\\,700 + 3 = 3\\,769$." },
  ],
  drawing: { task: "Rita basblock för 52 och visa hur du växlar ett tiotal till tio ental innan du tar bort 27.", tool: "column" },
  pupils: [{ pupil: "Noor", said: "I 52 − 27 tar jag bara det lilla från det stora i varje kolumn. Det blir 35.", misconception: "Subtraherar den mindre siffran från den större i varje kolumn.", response: "Be Noor kontrollera: 35 + 27 = 62, inte 52. Använd basblock för att visa växlingen." }],
  knowledge: [
    { id: "sub3", skill: "w2-l4.sub-col", gen: (rng, { level }) => { const [a, b] = subPair(rng, level > 1 ? 4 : 3, true); return numeric(`s3-${a}-${b}`, "w2-l4.sub-col", `Beräkna med uppställning: ${sv(a)} − ${sv(b)}`, a - b, `${sv(a)} − ${sv(b)} = ${sv(a - b)}. Kontroll: ${sv(a - b)} + ${sv(b)} = ${sv(a)}.`, ["Växla när översta siffran är mindre än understa."]); } },
    { id: "whenBorrow", skill: "w2-l4.exchange", gen: (rng) => { const [a, b] = subPair(rng, 3, true); return numeric(`wb-${a}-${b}`, "w2-l4.exchange", `Hur många växlingar behövs i ${sv(a)} − ${sv(b)}?`, borrowsOf(a, b), `Kolumner som kräver växling: ${columnSolution("sub", a, b).carries.map((c, i) => (c ? `kolumn ${i + 1}` : "")).filter(Boolean).join(", ")}.`, ["Jämför översta och understa siffran i varje kolumn. Räkna med tidigare växlingar!"]); } },
    { id: "checkAdd", skill: "w2-l4.check", gen: (rng) => { const [a, b] = subPair(rng, 3, false); const d = a - b; return mc(`ck-${a}-${b}`, "w2-l4.check", `Du har räknat ${sv(a)} − ${sv(b)} = ${sv(d)}. Hur kan du kontrollera svaret?`, `${sv(d)} + ${sv(b)} ska bli ${sv(a)}`, [{ text: `${sv(d)} − ${sv(b)} ska bli ${sv(a)}` }, { text: `${sv(a)} + ${sv(b)} ska bli ${sv(d)}` }, { text: "Det går inte att kontrollera" }], "Subtraktion och addition är motsatser, så differens + det som drogs bort ger tillbaka det första talet.", ["Vilken räkneoperation 'ångrar' subtraktion?"], rng); } },
    { id: "whyExchange", skill: "w2-l4.concept", gen: (rng) => mc("we", "w2-l4.concept", "Varför växlar vi ett tiotal till tio ental i 52 − 27?", "Det finns för få ental att ta bort 7 från, så vi skriver om 1 tiotal som 10 ental", [{ text: "För att tiotalet är större än entalet" }, { text: "För att man alltid växlar i subtraktion" }, { text: "För att nästa kolumn blir större" }], "Mängden ändras inte – 5 tiotal och 2 ental är samma som 4 tiotal och 12 ental.", ["Har 2 ental räckt för att ta bort 7?"], rng) },
  ],
  method: [
    { id: "colSub3", skill: "w2-l4.sub-col", gen: (rng) => { const [a, b] = subPair(rng, 3, true); return columnEx(`cs-${a}-${b}`, "w2-l4.sub-col", "sub", a, b, `${sv(a)} − ${sv(b)} = ${sv(a - b)}. Markera de kolumner där du växlade.`, ["Skriv 1 i kolumnen du växlar i."], "Ställ upp och räkna. Markera växlingarna (skriv 1 i kolumnen som växlas)."); } },
    { id: "colSubZero", skill: "w2-l4.sub-col", gen: (rng) => { const a = rng.int(2, 9) * 1000 + rng.pick([0, 3, 5]), b = rng.int(110, Math.min(a - 1, 1999)); return columnEx(`cz-${a}-${b}`, "w2-l4.sub-col", "sub", a, b, `${sv(a)} − ${sv(b)} = ${sv(a - b)}.`, ["Nollorna kräver växling i flera steg."], "Ställ upp och räkna. Markera växlingarna."); } },
  ],
  representation: [
    { id: "exchangeUnits", skill: "w2-l4.regroup", gen: (rng) => { const t = rng.int(3, 8), e = rng.int(0, 5), take = rng.int(e + 1, 9); return multifield(`eu-${t}-${e}-${take}`, "w2-l4.regroup", `Du har ${t} stavar och ${e} kuber och ska ta bort ${take} kuber. Du växlar 1 stav till 10 kuber. Hur många stavar och kuber har du efter växlingen?`, [{ label: "Stavar", accept: [t - 1] }, { label: "Kuber", accept: [e + 10] }, { label: "Kuber kvar efter borttagning", accept: [e + 10 - take] }], `${t} stavar ${e} kuber = ${t - 1} stavar ${e + 10} kuber. ${e + 10} − ${take} = ${e + 10 - take}.`, ["1 stav = 10 kuber."]); } },
    { id: "diffLine", skill: "w2-l4.numberline", gen: (rng) => { const b = rng.int(2, 6) * 10, a = b + rng.int(1, 4) * 20; return numberlineEx(`dl-${a}-${b}`, "w2-l4.numberline", `${a} − ${b} är avståndet mellan ${b} och ${a}. Markera ${a} − ${b} på tallinjen (från 0).`, a - b, { min: 0, max: 120, step: 10, labelEvery: 20 }, `${a} − ${b} = ${a - b}.`, []); } },
  ],
  teacher: {
    title: "Förklara växling",
    scenarios: ["Noor (åk 5) räknar 52 − 27 genom att ta det lilla från det stora i varje kolumn och får 35. Du ska hjälpa henne förstå varför 'växling' behövs.", "Du ska undervisa en elev om växling: 'Varför måste vi växla i subtraktion?'. Eleven har gjort fel: 74 − 38 = 44."],
    prompt: "Förklara varför växling är nödvändig i subtraktion, och hur man genomför den. Använd ett konkret exempel (t.ex. 52 − 27) och en modell (basblock eller tabell).",
    minChars: 160,
    rubric: {
      minConcepts: 3,
      concepts: [
        { id: "behov", label: "att det saknas ental att ta bort", any: ["för få ental", "inte tillräckligt", "räcker inte", "går inte att ta", "kan inte ta", "saknas"] },
        { id: "vaxling", label: "att ett tiotal görs om till tio ental", any: ["tio ental", "10 ental", "ett tiotal", "1 tiotal", "växl"] },
        { id: "ex", label: "ett exempel (12 − 7, 4 − 2, 25)", any: ["12 − 7", "12 - 7", "25", "4 − 2", "4 - 2"] },
        { id: "bevar", label: "att mängden är oförändrad", any: ["samma", "oförändrad", "ändras inte", "lika mycket", "ändrar inte"] },
      ],
    },
    modelAnswer: "I 52 − 27 har vi 5 tiostavar och 2 kuber och ska ta bort 7 kuber, men vi har bara 2. Då växlar vi en tiostav till 10 kuber. Nu har vi 4 stavar och 12 kuber – exakt lika mycket som förut, bara uppdelat på ett annat sätt. 12 − 7 = 5 kuber och 4 − 2 = 2 stavar. Svaret är 25. Vi kan kontrollera: 25 + 27 = 52.",
  },
};
