import type { Lesson } from "../types";
import { mc, numeric, multifield, withVisual, numberlineEx, exprEx, sv, SQUARE_PATTERNS } from "@/lib/engine/gen-helpers";
import { equivalent } from "@/lib/engine/expr";
import type { Rng } from "@/lib/engine/rng";

/** "3n+2" (ascii, for grading) and "3n + 2" (for display, with a real minus sign). */
const term = (a: number, v: string) => (a === 1 ? v : a === -1 ? `-${v}` : `${a}${v}`);
export const lin = (a: number, b: number, v = "n") => `${term(a, v)}${b > 0 ? `+${b}` : b < 0 ? `-${-b}` : ""}`;
export const dlin = (a: number, b: number, v = "n") => `${a === 1 ? v : `${a}${v}`}${b > 0 ? ` + ${b}` : b < 0 ? ` − ${-b}` : ""}`;
const seq = (a: number, d: number, k: number) => Array.from({ length: k }, (_, i) => a + i * d);
const SIGN = (c: number) => (c < 0 ? "<" : c > 0 ? ">" : "=");

// ───────── Lektion 1: Likhetstecknet ─────────
export const lesson1: Lesson = {
  id: "w9-l1", worldId: "w9", title: "Likhetstecknet – lika mycket på båda sidor", grades: "åk 4–6",
  summary: "= betyder ”har samma värde som”, inte ”nu kommer svaret”.",
  lgr: "Matematiska likheter och hur likhetstecknet används för att teckna enkla ekvationer",
  objectives: ["Förklara likhetstecknet som balans mellan två sidor.", "Avgöra om en likhet är sann eller falsk.", "Hitta ett saknat tal så att båda sidor blir lika."],
  intro: "Vad betyder $=$? Många elever (och vuxna) läser det som ”och nu kommer svaret”: $8 + 4 = $ ... Men likhetstecknet betyder något annat och mycket viktigare: **vänster sida och höger sida har exakt samma värde**. Den förståelsen är grunden för all algebra och för ekvationer.",
  theory: [
    { heading: "En balansvåg", body: "$5 + 3 = 4 + 4$ är sant: båda sidor är värda 8. Likhetstecknet är som en våg i balans – lika mycket i båda skålarna.", visual: { type: "balance", left: "5 + 3", right: "4 + 4", tilt: "level" } },
    { heading: "Sidorna kan byta plats", body: "$8 = 3 + 5$ är lika sant som $3 + 5 = 8$. Likhetstecknet pekar inte åt något håll. Det är *inte* en pil som betyder ”blir”." },
    { heading: "Saknat tal", body: "$7 + 5 = \\square + 4$: vänster sida är 12, så $\\square + 4$ måste också vara 12. Rutan är $8$. Det här är en ekvation i miniformat." },
    { heading: "Ett vanligt fel: kedjan", body: "$8 + 4 = 12 + 3 = 15$ är **fel**. $8 + 4$ är 12, men $12 + 3$ är 15, och 12 är inte 15. Skriv i stället två rader: $8 + 4 = 12$ och sedan $12 + 3 = 15$." },
  ],
  worked: [
    { title: "Saknat tal", problem: "Vilket tal ska stå i rutan? 7 + 5 = □ + 4", steps: [{ text: "Räkna vänster sida.", math: "7 + 5 = 12" }, { text: "Höger sida måste också bli 12.", math: "\\square + 4 = 12" }, { text: "Rutan är det som saknas upp till 12.", math: "\\square = 8" }, { text: "Kontroll: båda sidor.", math: "12 = 8 + 4" }], why: "Likhet betyder lika värde, så vi får räkna ut den sida som är känd.", alternative: "Vågen: vänster 12, höger 4 + något – hur mycket ska läggas till?" },
    { title: "Sant eller falskt?", problem: "Stämmer 6 + 7 = 5 + 9?", steps: [{ text: "Vänster:", math: "6 + 7 = 13" }, { text: "Höger:", math: "5 + 9 = 14" }, { text: "13 ≠ 14: likheten är falsk.", math: "13 \\neq 14" }], why: "Båda sidor måste ha samma värde.", alternative: "Vågen lutar åt höger." },
  ],
  drawing: { task: "Rita en balansvåg. Lägg 8 + 5 i den ena skålen och □ + 6 i den andra. Vad ska rutan vara för att vågen ska vara i balans?", tool: "grid" },
  pupils: [{ pupil: "Elin", said: "8 + 4 = 12 + 3 = 15. Jag räknar ju bara vidare.", misconception: "Läser likhetstecknet som ”blir” eller ”nu kommer svaret” och kedjar uträkningar.", response: "Fråga: ”Är 8 + 4 lika med 15?” Låt Elin kontrollera båda sidor av varje likhetstecken och skriva en uträkning per rad." }],
  knowledge: [
    { id: "missingRight", skill: "w9-l1.missing", gen: (rng) => { const a = rng.int(3, 20), b = rng.int(3, 20), c = rng.int(1, a + b - 2); return numeric(`mr-${a}-${b}-${c}`, "w9-l1.missing", `${a} + ${b} = □ + ${c}`, a + b - c, `Vänster sida är ${a + b}. □ + ${c} = ${a + b}, så □ = ${a + b - c}.`, ["Räkna vänster sida först."]); } },
    { id: "missingLeft", skill: "w9-l1.missing", gen: (rng) => { const c = rng.int(4, 20), d = rng.int(4, 20), b = rng.int(2, c + d - 2); return numeric(`ml-${b}-${c}-${d}`, "w9-l1.missing", `□ + ${b} = ${c} + ${d}`, c + d - b, `Höger sida är ${c + d}. □ + ${b} = ${c + d}, så □ = ${c + d - b}.`, ["Räkna den sida som saknar rutan."]); } },
    { id: "trueFalse", skill: "w9-l1.true-false", gen: (rng) => { const a = rng.int(3, 15), b = rng.int(3, 15), c = rng.int(3, 15); const equal = rng.chance(0.5); const d = a + b - c + (equal ? 0 : rng.pick([-2, -1, 1, 2])); if (d < 1) return numeric("tf-fb", "w9-l1.true-false", "4 + 5 = □ + 3", 6, "9 = □ + 3, så □ = 6.", []); const real = a + b === c + d; return mc(`tf-${a}-${b}-${c}-${d}`, "w9-l1.true-false", `Stämmer det att ${a} + ${b} = ${c} + ${d}?`, real ? "Ja – båda sidor är värda lika mycket" : "Nej – sidorna är olika", [{ text: real ? "Nej – sidorna är olika" : "Ja – båda sidor är värda lika mycket" }], `${a} + ${b} = ${a + b} och ${c} + ${d} = ${c + d}.`, ["Räkna båda sidor."], rng); } },
    { id: "mulBalance", skill: "w9-l1.missing", gen: (rng) => { const a = rng.int(2, 9), b = rng.int(2, 9), P = a * b; const divs = Array.from({ length: P }, (_, i) => i + 1).filter((x) => P % x === 0 && x > 1 && x < P); const c = rng.pick(divs); return numeric(`mb-${a}-${b}-${c}`, "w9-l1.missing", `${a} · ${b} = ${c} · □`, P / c, `Vänster sida är ${P}. ${c} · □ = ${P}, så □ = ${P / c}.`, ["Räkna vänster sida."]); } },
    { id: "subBalance", skill: "w9-l1.missing", gen: (rng) => { const a = rng.int(12, 30), b = rng.int(2, 9), c = rng.int(1, a - b - 1); return numeric(`sb-${a}-${b}-${c}`, "w9-l1.missing", `${a} − ${b} = ${c} + □`, a - b - c, `Vänster sida är ${a - b}. ${c} + □ = ${a - b}, så □ = ${a - b - c}.`, []); } },
    { id: "runningEquals", skill: "w9-l1.concept", gen: (rng) => { const a = rng.int(3, 12), b = rng.int(3, 12), c = rng.int(2, 9); const s = a + b, t = s + c; return mc(`re-${a}-${b}-${c}`, "w9-l1.concept", `Elin skriver ${a} + ${b} = ${s} + ${c} = ${t}. Vad är fel?`, `${a} + ${b} är ${s}, inte ${t} – likhetstecknet säger att båda sidor är lika`, [{ text: "Inget – likhetstecknet betyder att svaret kommer", note: "Likhetstecknet betyder lika värde på båda sidor." }, { text: "Man får bara använda likhetstecknet en gång per rad" }, { text: "Talen är för stora för att räkna så" }], `${a} + ${b} = ${s}, och ${s} + ${c} = ${t}. Skriv det på två rader.`, ["Är " + a + " + " + b + " lika med " + t + "?"], rng); } },
  ],
  method: [
    { id: "sidesFields", skill: "w9-l1.missing", gen: (rng) => { const a = rng.int(4, 20), b = rng.int(4, 20), c = rng.int(2, a + b - 2); return multifield(`sf-${a}-${b}-${c}`, "w9-l1.missing", `${a} + ${b} = □ + ${c}. Fyll i.`, [{ label: "Vänster sida", accept: [a + b] }, { label: `Höger sida utan rutan (${c})`, accept: [c] }, { label: "Talet i rutan", accept: [a + b - c] }], `${a + b} = □ + ${c}, så □ = ${a + b - c}.`, ["Vänster sida först."]); } },
    { id: "checkBoth", skill: "w9-l1.check", gen: (rng) => { const a = rng.int(4, 20), b = rng.int(4, 20), c = rng.int(2, a + b - 2); const box = a + b - c; return multifield(`cb-${a}-${b}-${c}`, "w9-l1.check", `Du har satt □ = ${box} i ${a} + ${b} = □ + ${c}. Kontrollera genom att räkna båda sidor.`, [{ label: "Vänster sida", accept: [a + b] }, { label: `Höger sida (${box} + ${c})`, accept: [box + c] }, { label: "Är de lika? (1 = ja, 0 = nej)", accept: [1] }], `${a + b} = ${box + c}. ✓`, []); } },
  ],
  representation: [
    { id: "balanceFind", skill: "w9-l1.balance", gen: (rng) => { const a = rng.int(3, 15), b = rng.int(3, 15), c = rng.int(2, a + b - 2); return withVisual(numeric(`bf-${a}-${b}-${c}`, "w9-l1.balance", "Vågen är i balans. Vilket tal är rutan (□)?", a + b - c, `Vänster ${a + b}, höger □ + ${c}: □ = ${a + b - c}.`, ["Lika mycket på båda sidor."]), { type: "balance", left: `${a} + ${b}`, right: `${c} + □`, tilt: "level" }); } },
    { id: "balanceSign", skill: "w9-l1.balance", gen: (rng) => { const a = rng.int(3, 12), b = rng.int(3, 12), c = rng.int(3, 12); let d = rng.int(3, 12); if (a + b === c + d) d += 2; const sign = SIGN(a + b - (c + d)); return withVisual(mc(`bs-${a}-${b}-${c}-${d}`, "w9-l1.balance", "Vågen lutar. Vilket tecken ska stå mellan sidorna?", sign, ["<", ">", "="].filter((x) => x !== sign).map((text) => ({ text })), `${a + b} ${sign} ${c + d}. Den tyngre sidan är störst.`, ["Åt vilket håll lutar vågen?"], rng), { type: "balance", left: `${a} + ${b}`, right: `${c} + ${d}`, tilt: a + b > c + d ? "left" : "right" }); } },
  ],
  teacher: {
    title: "”Likhetstecknet betyder att svaret kommer”",
    scenarios: ["Elin (åk 4) skriver 8 + 4 = 12 + 3 = 15. Hon är nöjd: \"Jag räknade ju bara vidare.\""],
    prompt: "Förklara för Elin vad likhetstecknet egentligen betyder, varför hennes rad är fel, och hur hon kan skriva uträkningen rätt. Använd gärna en våg.",
    minChars: 160,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "lika", label: "att båda sidor är lika mycket värda", any: ["lika mycket", "samma värde", "lika stora", "lika värde", "är lika"] },
        { id: "vag", label: "en balansvåg/balans", any: ["våg", "balans", "vågskål"] },
        { id: "fel", label: "att 8 + 4 = 12 men 12 + 3 = 15 (12 är inte 15)", any: ["8 + 4 = 12", "12 + 3 = 15", "12 är inte 15", "inte lika med 15", "8 + 4 är inte"] },
        { id: "rader", label: "skriv ett steg per rad", any: ["ny rad", "flera rader", "en rad", "två rader", "varje rad", "separata rader"] },
        { id: "inte", label: "att likhetstecknet inte betyder ”blir”/”nu kommer svaret”", any: ["inte betyder", "betyder inte", "inte ”blir”", "inte blir", "kommer svaret"] },
      ],
    },
    modelAnswer: "Elin, likhetstecknet betyder att vänster och höger sida är lika mycket värda, som en våg i balans. Din rad påstår att 8 + 4 är lika med 15, men 8 + 4 = 12 och 12 + 3 = 15, så 12 är inte 15. Likhetstecknet betyder inte ”blir” eller ”nu kommer svaret”. Skriv i stället ett steg per rad: först 8 + 4 = 12 och på en ny rad 12 + 3 = 15. Då är varje likhet sann.",
  },
};

// ───────── Lektion 2: Talmönster ─────────
export const lesson2: Lesson = {
  id: "w9-l2", worldId: "w9", title: "Talmönster och talföljder", grades: "åk 4–6",
  summary: "Hitta regeln, fortsätt följden och förutsäg det 10:e talet.",
  lgr: "Mönster i talföljder och geometriska mönster samt hur de konstrueras, beskrivs och uttrycks",
  objectives: ["Beskriva en talföljd med en regel.", "Fortsätta en följd och hitta saknade tal.", "Förutsäga ett tal långt fram utan att räkna alla led."],
  intro: "$2, 5, 8, 11, \\ldots$ – vad kommer sen? Att se **mönstret** och kunna beskriva det med en regel är algebrans första steg. Och det som skiljer en bra regel från en gissning är att den fungerar för *alla* led – också det 100:e.",
  theory: [
    { heading: "Talföljd och regel", body: "En **talföljd** är tal i en bestämd ordning. Varje tal kallas ett **led**. $2, 5, 8, 11, \\ldots$ börjar på 2 och *ökar med 3* varje gång. Regeln: ”börja på 2 och addera 3”.", visual: { type: "numberline", min: 0, max: 16, step: 1, marks: [2, 5, 8, 11, 14], labelEvery: 2 } },
    { heading: "Skillnaden mellan led", body: "Räkna skillnaden mellan **alla** par av grannar för att kontrollera regeln: $5-2=3$, $8-5=3$, $11-8=3$. Är skillnaden alltid lika är följden en **aritmetisk** följd." },
    { heading: "Avtagande och dubblande", body: "$50, 44, 38, \\ldots$ minskar med 6. $3, 6, 12, 24, \\ldots$ *dubblas* – regeln är ”multiplicera med 2”, inte ”addera”." },
    { heading: "Det 10:e talet", body: "I $2, 5, 8, \\ldots$ är det första talet 2. Till det 10:e gör vi 9 steg om 3: $2 + 9 \\cdot 3 = 29$. Det 10:e ledet är *första + 9 · skillnaden*." },
  ],
  worked: [
    { title: "Nästa tal", problem: "Fortsätt: 7, 12, 17, 22, …", steps: [{ text: "Skillnaden mellan grannarna.", math: "12-7 = 5,\\ 17-12 = 5,\\ 22-17=5" }, { text: "Addera 5 till sista talet.", math: "22 + 5 = 27" }], why: "Skillnaden är konstant, så följden ökar med 5 varje gång.", alternative: "Räkna också baklänges: före 7 kommer 2." },
    { title: "Det tionde talet", problem: "Vilket är det 10:e talet i 4, 9, 14, …?", steps: [{ text: "Skillnaden är 5. Från 1:a till 10:e är 9 steg.", math: "9 \\cdot 5 = 45" }, { text: "Första talet plus stegen:", math: "4 + 45 = 49" }], why: "Varje steg lägger till 5, och det är 9 steg från 1:a till 10:e (inte 10).", alternative: "Skriv ut hela följden: 4, 9, 14, 19, 24, 29, 34, 39, 44, 49." },
  ],
  drawing: { task: "Rita en tallinje från 0 till 20 och markera talföljden 2, 5, 8, 11, 14. Skriv skillnaden mellan varje par av grannar.", tool: "numberline" },
  pupils: [{ pupil: "Alva", said: "2, 5, 8, 11 – nästa tal är 13, för det brukar vara plus två.", misconception: "Gissar regeln utan att kontrollera skillnaderna.", response: "Låt Alva räkna skillnaden mellan varje par: 3, 3, 3. Då är nästa 14. Kontrollera alltid *alla* par." }],
  knowledge: [
    { id: "nextTerm", skill: "w9-l2.next", gen: (rng) => { const a = rng.int(2, 20), d = rng.int(2, 9); const s = seq(a, d, 4); return numeric(`nt-${a}-${d}`, "w9-l2.next", `Fortsätt följden: ${s.join(", ")}, … Vilket tal kommer sedan?`, a + 4 * d, `Skillnaden är ${d}: ${a + 3 * d} + ${d} = ${a + 4 * d}.`, ["Räkna skillnaden mellan granntalen."]); } },
    { id: "decreasing", skill: "w9-l2.decrease", gen: (rng) => { const d = rng.int(3, 9), a = rng.int(30, 90); const s = seq(a, -d, 4); return numeric(`dc-${a}-${d}`, "w9-l2.decrease", `Fortsätt följden: ${s.join(", ")}, … Vilket tal kommer sedan?`, a - 4 * d, `Följden minskar med ${d}: ${a - 3 * d} − ${d} = ${a - 4 * d}.`, ["Går talen upp eller ned?"]); } },
    { id: "missing", skill: "w9-l2.missing", gen: (rng) => { const a = rng.int(2, 15), d = rng.int(2, 8); const s = seq(a, d, 5); return numeric(`ms-${a}-${d}`, "w9-l2.missing", `Vilket tal saknas? ${s[0]}, ${s[1]}, □, ${s[3]}, ${s[4]}`, s[2], `Skillnaden är ${d}: ${s[1]} + ${d} = ${s[2]}.`, ["Räkna skillnaden."]); } },
    { id: "doubling", skill: "w9-l2.double", gen: (rng) => { const a = rng.int(2, 6); return numeric(`db-${a}`, "w9-l2.double", `Fortsätt följden: ${a}, ${2 * a}, ${4 * a}, ${8 * a}, … Vilket tal kommer sedan?`, 16 * a, `Varje tal dubblas: ${8 * a} · 2 = ${16 * a}.`, ["Dubblas den eller ökar den med lika mycket?"]); } },
    { id: "ruleMc", skill: "w9-l2.rule", gen: (rng) => { const a = rng.int(3, 9), d = rng.int(3, 9); const s = seq(a, d, 4); return mc(`rl-${a}-${d}`, "w9-l2.rule", `Vilken regel beskriver ${s.join(", ")}, …?`, `Börja på ${a} och addera ${d}`, [{ text: `Börja på ${d} och addera ${a}`, note: "Första talet och skillnaden har bytt plats." }, { text: `Börja på ${a} och multiplicera med ${d}` }, { text: `Addera ${a} varje gång` }], `Första talet är ${a}, skillnaden ${d}.`, ["Vilket är första talet? Hur stor är skillnaden?"], rng); } },
    { id: "tenth", skill: "w9-l2.tenth", gen: (rng) => { const a = rng.int(2, 12), d = rng.int(2, 9); return numeric(`tn-${a}-${d}`, "w9-l2.tenth", `Följden börjar ${seq(a, d, 3).join(", ")}, … Vilket är det 10:e talet?`, a + 9 * d, `9 steg om ${d} från ${a}: ${a} + ${9 * d} = ${a + 9 * d}.`, ["Hur många steg är det från 1:a till 10:e?"]); } },
  ],
  method: [
    { id: "diffFields", skill: "w9-l2.next", gen: (rng) => { const a = rng.int(2, 14), d = rng.int(2, 8); const s = seq(a, d, 4); return multifield(`df-${a}-${d}`, "w9-l2.next", `Följden: ${s.join(", ")}, … Fyll i.`, [{ label: "Skillnaden mellan led", accept: [d] }, { label: "5:e talet", accept: [a + 4 * d] }, { label: "6:e talet", accept: [a + 5 * d] }], `Skillnad ${d}: ${a + 4 * d}, ${a + 5 * d}.`, []); } },
    { id: "tenthSteps", skill: "w9-l2.tenth", gen: (rng) => { const a = rng.int(2, 12), d = rng.int(2, 9); return multifield(`ts-${a}-${d}`, "w9-l2.tenth", `Följden börjar ${a}, ${a + d}, ${a + 2 * d}, … Hitta det 10:e talet i steg.`, [{ label: "Antal steg från 1:a till 10:e", accept: [9] }, { label: `Så mycket läggs till (9 · ${d})`, accept: [9 * d] }, { label: "Det 10:e talet", accept: [a + 9 * d] }], `${a} + ${9 * d} = ${a + 9 * d}.`, ["9 steg, inte 10."]); } },
  ],
  representation: [
    { id: "markTerm", skill: "w9-l2.numberline", gen: (rng) => { const a = rng.int(2, 8), d = rng.int(2, 6); return numberlineEx(`mt-${a}-${d}`, "w9-l2.numberline", `Följden börjar på ${a} och ökar med ${d}. Markera det 4:e talet.`, a + 3 * d, { min: 0, max: 30, step: 1, labelEvery: 5 }, `${a} + 3 · ${d} = ${a + 3 * d}.`, ["Tre steg från första talet."]); } },
    { id: "gapRead", skill: "w9-l2.numberline", gen: (rng) => { const a = rng.int(1, 6), d = rng.int(2, 6); return withVisual(numeric(`gr-${a}-${d}`, "w9-l2.numberline", "Markeringarna visar en talföljd. Hur stor är skillnaden mellan två granntal?", d, `Skillnaden är ${d}.`, ["Räkna steg mellan två markeringar."]), { type: "numberline", min: 0, max: 30, step: 1, marks: seq(a, d, 4), labelEvery: 5 }); } },
  ],
  teacher: {
    title: "Kontrollera alla skillnader",
    scenarios: ["Alva (åk 4) ser följden 2, 5, 8, 11 och säger att nästa tal är 13 \"för det brukar vara plus två\"."],
    prompt: "Förklara för Alva hur man hittar regeln för talföljden 2, 5, 8, 11, …, vad nästa tal är och hur man kontrollerar att regeln stämmer. Hur skulle du hitta det 10:e talet?",
    minChars: 170,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "skillnad", label: "att räkna skillnaden mellan granntalen", any: ["skillnad", "mellan talen", "mellan varje", "hur mycket det ökar"] },
        { id: "tre", label: "att skillnaden är 3", any: ["3", "tre"] },
        { id: "nasta", label: "rätt nästa tal 14", any: ["14"] },
        { id: "kontroll", label: "kontrollera alla par/led", any: ["alla par", "alla led", "kontroll", "varje par", "hela följden"] },
        { id: "tionde", label: "det 10:e talet 29 (9 steg · 3 + 2)", any: ["29", "9 steg", "nio steg", "9 · 3", "9·3"] },
      ],
    },
    modelAnswer: "Alva, räkna skillnaden mellan varje par av grannar: 5 − 2 = 3, 8 − 5 = 3, 11 − 8 = 3. Skillnaden är alltid 3, så regeln är ”börja på 2 och addera 3”. Då är nästa tal 11 + 3 = 14, inte 13. Du måste kontrollera alla par och inte bara det första. För det 10:e talet gör vi 9 steg om 3 från 2: 2 + 9 · 3 = 29.",
  },
};

// ───────── Lektion 3: Geometriska mönster ─────────
type PatKey = keyof typeof SQUARE_PATTERNS;
const PAT_KEYS = Object.keys(SQUARE_PATTERNS) as PatKey[];
const figs = (k: PatKey, upTo = 3) => Array.from({ length: upTo }, (_, i) => SQUARE_PATTERNS[k].heights(i + 1));
const total = (k: PatKey, n: number) => SQUARE_PATTERNS[k].a * n + SQUARE_PATTERNS[k].b;
const rule = (k: PatKey) => lin(SQUARE_PATTERNS[k].a, SQUARE_PATTERNS[k].b);

export const lesson3: Lesson = {
  id: "w9-l3", worldId: "w9", title: "Geometriska mönster", grades: "åk 4–6",
  summary: "Figurer som växer: räkna, fortsätt och skriv en regel med bokstav.",
  lgr: "Mönster i talföljder och geometriska mönster samt hur de konstrueras, beskrivs och uttrycks",
  objectives: ["Beskriva hur ett figurmönster växer.", "Räkna antalet rutor i en figur längre fram.", "Skriva en regel med en bokstav för antalet rutor i figur n."],
  intro: "Figurerna 1, 2, 3 … växer enligt ett mönster. Att räkna ut figur 4 är lätt – men figur 100? Då behöver vi en **regel med bokstav**: ”antalet rutor i figur $n$ är …”. Det är algebrans genombrott: en bokstav som står för *vilken figur som helst*.",
  theory: [
    { heading: "Hur växer figuren?", body: "Räkna rutorna i figur 1, 2 och 3: **3, 5, 7**. Från figur till figur *tillkommer 2 rutor*. Mönstret ökar med 2 varje gång.", visual: { type: "dotpattern", figures: figs("hook") } },
    { heading: "Regel med bokstav", body: "Figur $n$ har $2n + 1$ rutor. $2n$ eftersom det tillkommer 2 rutor per figur, och $+1$ eftersom figur 1 har 3 rutor ($2 \\cdot 1 + 1 = 3$). Kontrollera alltid regeln på de figurer du kan se: $n=2$: $5$ ✓, $n=3$: $7$ ✓." },
    { heading: "Använda regeln", body: "Figur 10: $2 \\cdot 10 + 1 = 21$. Vilken figur har 41 rutor? $2n + 1 = 41$, så $n = 20$." },
    { heading: "Se mönstret på flera sätt", body: "I figuren ovan kan du se en lodrät rad med $n + 1$ rutor plus $n$ rutor åt sidan: $(n+1) + n = 2n + 1$. Olika sätt att se samma figur ger likvärdiga uttryck." },
  ],
  worked: [
    { title: "Skriva regeln", problem: "Figur 1, 2 och 3 har 3, 5 och 7 rutor. Skriv en regel för figur n.", steps: [{ text: "Ökningen är 2 per figur.", math: "5-3 = 2,\\ 7-5 = 2" }, { text: "Regeln börjar med 2n. Då ger n = 1 talet 2 – men figur 1 har 3. Lägg till 1.", math: "2n + 1" }, { text: "Kontroll:", math: "n=2: 5,\\ n=3: 7" }], why: "Ökningen per figur blir talet framför n, och konstanten justerar så att regeln stämmer för figur 1.", alternative: "Se figuren som en lodrät rad (n + 1) och n rutor åt sidan." },
    { title: "Använda regeln", problem: "Hur många rutor har figur 10 enligt regeln 2n + 1? Vilken figur har 41 rutor?", steps: [{ text: "Sätt in n = 10:", math: "2 \\cdot 10 + 1 = 21" }, { text: "Lös 2n + 1 = 41:", math: "2n = 40 \\Rightarrow n = 20" }], why: "Regeln fungerar för varje n – vi sätter in det vi vet.", alternative: "Räkna 21 ger figur 10; skillnaden 41 − 21 = 20 rutor är 10 figurer till: figur 20." },
  ],
  drawing: { task: "Rita figur 1, 2, 3 och 4 för mönstret ”dubbla rader” (2 rutor per kolumn, en kolumn mer för varje figur). Hur många rutor har varje figur?", tool: "grid" },
  pupils: [{ pupil: "Rasmus", said: "Figur 1 har 3, figur 2 har 5, figur 3 har 7. Figur 10 har då 30, för 3 · 10.", misconception: "Tror att talet i figur 1 multipliceras med figurens nummer (proportionellt tänkande).", response: "Låt Rasmus kontrollera: 3 · 2 = 6, men figur 2 har 5. Räkna ökningen per figur: 2. Då blir figur 10 2 · 10 + 1 = 21." }],
  knowledge: [
    { id: "figure4", skill: "w9-l3.next", gen: (rng) => { const k = rng.pick(PAT_KEYS); return withVisual(numeric(`f4-${k}`, "w9-l3.next", "Hur många rutor har figur 4?", total(k, 4), `Mönstret ökar med ${SQUARE_PATTERNS[k].a} rutor per figur: figur 4 har ${total(k, 4)} rutor.`, ["Hur många rutor tillkommer?"]), { type: "dotpattern", figures: figs(k) }); } },
    { id: "figure10", skill: "w9-l3.far", gen: (rng) => { const k = rng.pick(PAT_KEYS); const n = rng.pick([8, 10, 12, 20]); return withVisual(numeric(`f10-${k}-${n}`, "w9-l3.far", `Hur många rutor har figur ${n}?`, total(k, n), `Regel ${rule(k)}: ${SQUARE_PATTERNS[k].a} · ${n} ${SQUARE_PATTERNS[k].b >= 0 ? "+" : "−"} ${Math.abs(SQUARE_PATTERNS[k].b)} = ${total(k, n)}.`, ["Hitta regeln för figur n."]), { type: "dotpattern", figures: figs(k) }); } },
    { id: "increase", skill: "w9-l3.increase", gen: (rng) => { const k = rng.pick(PAT_KEYS); return withVisual(numeric(`in-${k}`, "w9-l3.increase", "Hur många rutor tillkommer för varje ny figur?", SQUARE_PATTERNS[k].a, `Skillnaden mellan figurerna är ${SQUARE_PATTERNS[k].a}.`, ["Jämför antalet rutor i granfigurer."]), { type: "dotpattern", figures: figs(k) }); } },
    { id: "whichFigure", skill: "w9-l3.inverse", gen: (rng) => { const k = rng.pick(PAT_KEYS); const n = rng.int(8, 25); return withVisual(numeric(`wf-${k}-${n}`, "w9-l3.inverse", `Vilken figur har ${total(k, n)} rutor?`, n, `${rule(k)} = ${total(k, n)} ger n = ${n}.`, ["Vilket n ger det antalet?"]), { type: "dotpattern", figures: figs(k) }); } },
    { id: "ruleMc", skill: "w9-l3.rule", gen: (rng) => { const k = rng.pick(PAT_KEYS); const { a, b } = SQUARE_PATTERNS[k]; const correct = rule(k); const cands = [lin(1, a + b), lin(a + b, 0), lin(a, b + 1), lin(a + 1, b)].filter((c) => !equivalent(c, correct, "n")); const disp = (s: string) => s.replace(/-/g, " − ").replace(/\+/g, " + "); return withVisual(mc(`rm-${k}`, "w9-l3.rule", "Vilken regel ger antalet rutor i figur n?", disp(correct), cands.map((c) => ({ text: disp(c) })), `Ökning ${a} per figur och figur 1 har ${total(k, 1)} rutor: ${disp(correct)}.`, ["Prova regeln på figur 1, 2 och 3."], rng), { type: "dotpattern", figures: figs(k) }); } },
  ],
  method: [
    { id: "extendFields", skill: "w9-l3.next", gen: (rng) => { const k = rng.pick(PAT_KEYS); return withVisual(multifield(`ef-${k}`, "w9-l3.next", "Figurerna växer enligt ett mönster. Fyll i.", [{ label: "Rutor som tillkommer per figur", accept: [SQUARE_PATTERNS[k].a] }, { label: "Rutor i figur 4", accept: [total(k, 4)] }, { label: "Rutor i figur 5", accept: [total(k, 5)] }], `Ökning ${SQUARE_PATTERNS[k].a}: ${total(k, 4)}, ${total(k, 5)}.`, []), { type: "dotpattern", figures: figs(k) }); } },
    { id: "ruleSteps", skill: "w9-l3.far", gen: (rng) => { const k = rng.pick(PAT_KEYS); const { a, b } = SQUARE_PATTERNS[k]; return withVisual(multifield(`rs-${k}`, "w9-l3.far", `Regeln är ${a}n ${b >= 0 ? "+" : "−"} ${Math.abs(b)}. Räkna figur 10 i steg.`, [{ label: `${a} · 10 =`, accept: [a * 10] }, { label: `${b >= 0 ? "+" : "−"} ${Math.abs(b)} ger`, accept: [total(k, 10)] }], `${a * 10} ${b >= 0 ? "+" : "−"} ${Math.abs(b)} = ${total(k, 10)}.`, []), { type: "dotpattern", figures: figs(k) }); } },
  ],
  representation: [
    { id: "writeRule", skill: "w9-l3.expression", gen: (rng) => { const k = rng.pick(PAT_KEYS); return exprEx(`wr-${k}`, "w9-l3.expression", "Skriv ett uttryck med n för antalet rutor i figur n.", rule(k), `Regel: ${rule(k)}. Kontroll på figur 1: ${total(k, 1)}.`, ["Hur mycket tillkommer per figur? Vad behövs för att stämma på figur 1?"], { visual: { type: "dotpattern", figures: figs(k) } }); } },
    { id: "writeRule2", skill: "w9-l3.expression", gen: (rng) => { const a = rng.int(2, 5), b = rng.int(1, 6); const vals = [1, 2, 3].map((n) => a * n + b); return exprEx(`w2-${a}-${b}`, "w9-l3.expression", `Antalet tändstickor i figur 1, 2 och 3 är ${vals.join(", ")}. Skriv en regel med n för antalet i figur n.`, lin(a, b), `Ökning ${a}, figur 1 har ${vals[0]}: ${lin(a, b)}.`, ["Ökning per figur och startvärde."]); } },
  ],
  teacher: {
    title: "Figur 10 är inte 3 · 10",
    scenarios: ["Rasmus (åk 5) har tre figurer med 3, 5 och 7 rutor och säger att figur 10 har 30 rutor \"för 3 gånger 10\"."],
    prompt: "Förklara för Rasmus varför figur 10 inte har 30 rutor, hur man hittar en regel för figur n, och hur man kontrollerar regeln.",
    minChars: 170,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "okning", label: "att det tillkommer 2 rutor per figur", any: ["tillkommer 2", "ökar med 2", "2 rutor", "två rutor", "ökningen"] },
        { id: "regel", label: "regeln 2n + 1", any: ["2n + 1", "2n+1", "2 · n + 1", "2·n+1"] },
        { id: "svar", label: "rätt svar 21", any: ["21"] },
        { id: "fel", label: "att 3 · 2 = 6 stämmer inte med figur 2 (5)", any: ["3 · 2", "3·2", "6", "stämmer inte", "figur 2"] },
        { id: "kontroll", label: "kontroll av regeln på figur 1, 2, 3", any: ["kontroll", "figur 1", "stämmer", "sätta in"] },
      ],
    },
    modelAnswer: "Rasmus, om figur 10 var 3 · 10 = 30 skulle figur 2 vara 3 · 2 = 6, men den har 5. Mönstret är inte ”gånger 3”. Räkna ökningen: 5 − 3 = 2 och 7 − 5 = 2, så det tillkommer 2 rutor per figur. Regeln börjar med 2n, och eftersom figur 1 har 3 rutor lägger vi till 1: 2n + 1. Kontrollera på figur 1, 2 och 3: 3, 5 och 7 stämmer. Figur 10 har 2 · 10 + 1 = 21 rutor.",
  },
};

// ───────── Lektion 4: Variabler och uttryck ─────────
export const lesson4: Lesson = {
  id: "w9-l4", worldId: "w9", title: "Variabler och algebraiska uttryck", grades: "åk 4–6",
  summary: "En bokstav som står för ett tal: skriva uttryck och räkna ut deras värde.",
  lgr: "Variabler och deras användning i enkla algebraiska uttryck och ekvationer",
  objectives: ["Förklara att en bokstav (variabel) står för ett tal.", "Skriva uttryck för enkla situationer.", "Räkna ut värdet av ett uttryck när variabeln är känd."],
  intro: "$3n$ betyder inte ”tre och n bredvid varandra”. Det betyder **3 gånger n**. Om $n = 5$ är $3n = 15$, inte 35. Den förväxlingen är den vanligaste i hela algebran – och den försvinner när eleven förstår att en bokstav är ett *tal*.",
  theory: [
    { heading: "En bokstav är ett tal", body: "En **variabel** är en bokstav som står för ett tal som kan variera. $n + 5$: ”ett tal plus 5”. Om $n = 3$ är det $8$; om $n = 10$ är det $15$." },
    { heading: "Gånger skrivs utan tecken", body: "$3n$ betyder $3 \\cdot n$. Om $n = 5$: $3 \\cdot 5 = 15$. Siffran står *före* bokstaven. $2n$ och $n + 2$ är olika: för $n = 5$ är $2n = 10$ men $n + 2 = 7$." },
    { heading: "Från ord till uttryck", body: "- ”5 mer än $n$” $\\to n + 5$\n\n- ”3 gånger $n$” $\\to 3n$\n\n- ”2 mindre än $n$” $\\to n - 2$\n\n- ”$n$ delat med 2” $\\to n \\div 2$\n\n- ”3 gånger $n$ och sedan 2 mer” $\\to 3n + 2$" },
    { heading: "Värdet av ett uttryck", body: "Sätt in talet för bokstaven och räkna: $4n - 1$ när $n = 6$: $4 \\cdot 6 - 1 = 23$. Multiplikation före subtraktion." },
  ],
  worked: [
    { title: "Värdet av 3n + 2", problem: "Vad är värdet av 3n + 2 när n = 4?", steps: [{ text: "Byt ut n mot 4.", math: "3 \\cdot 4 + 2" }, { text: "Multiplikation först.", math: "12 + 2 = 14" }], why: "3n är 3 gånger n – inte siffrorna 3 och 4 bredvid varandra (34).", alternative: "Gör en tabell: n = 1, 2, 3, 4 → 5, 8, 11, 14." },
    { title: "Skriva uttryck", problem: "En bok kostar n kr. Du köper 3 böcker och en penna för 8 kr. Skriv ett uttryck för vad du betalar.", steps: [{ text: "3 böcker kostar 3 · n.", math: "3n" }, { text: "Lägg till pennan.", math: "3n + 8" }], why: "Uttrycket gäller för vilket bokpris som helst.", alternative: "Om boken kostar 20 kr: 3 · 20 + 8 = 68 kr." },
  ],
  drawing: { task: "Rita en tabell med n = 1, 2, 3, 4, 5. Räkna ut 2n, n + 2 och 3n − 1 för varje n. Vad ser du?", tool: "grid" },
  pupils: [{ pupil: "Nils", said: "Om n är 5 så är 2n lika med 25 – det är ju 2 och 5.", misconception: "Läser 2n som siffrorna 2 och n skrivna efter varandra.", response: "Skriv 2n som 2 · n. Fråga: ”Hur mycket är 2 gånger 5?” Jämför 2n och n + 2 för n = 5: 10 och 7." }],
  knowledge: [
    { id: "evaluate", skill: "w9-l4.evaluate", gen: (rng, { level }) => { const a = rng.int(2, 9), b = rng.int(1, 9), n = rng.int(2, level > 1 ? 12 : 8); const f = rng.int(0, 3); const [txt, val] = f === 0 ? [`${a}n + ${b}`, a * n + b] : f === 1 ? [`${a}n − ${b}`, a * n - b] : f === 2 ? [`n + ${b}`, n + b] : [`${a}(n + ${b})`, a * (n + b)]; if (val < 0) return numeric("ev-fb", "w9-l4.evaluate", "Vad är värdet av 3n + 2 när n = 4?", 14, "3 · 4 + 2 = 14.", []); return numeric(`ev-${f}-${a}-${b}-${n}`, "w9-l4.evaluate", `Vad är värdet av ${txt} när n = ${n}?`, val, `Sätt in n = ${n}: ${val}.`, ["Byt ut n mot talet. Multiplikation före addition."]); } },
    { id: "translate", skill: "w9-l4.translate", gen: (rng) => { const k = rng.int(2, 9); const form = rng.int(0, 3); const cases = [[`${k} mer än n`, `n + ${k}`, [`${k}n`, `n − ${k}`, `${k} − n`]], [`${k} gånger n`, `${k}n`, [`n + ${k}`, `n − ${k}`, `n ÷ ${k}`]], [`${k} mindre än n`, `n − ${k}`, [`${k} − n`, `n + ${k}`, `${k}n`]], [`${k} gånger n och sedan 2 mer`, `${k}n + 2`, [`${k}(n + 2)`, `n + ${k} + 2`, `${k}n − 2`]]] as const; const [word, right, wrong] = cases[form]; return mc(`tr-${form}-${k}`, "w9-l4.translate", `Vilket uttryck betyder ”${word}”?`, right, wrong.map((text) => ({ text })), `”${word}” skrivs ${right}.`, ["Vad ska göras med n?"], rng); } },
    { id: "concat", skill: "w9-l4.concept", gen: (rng) => { const a = rng.int(2, 9), n = rng.int(3, 9); return mc(`cn-${a}-${n}`, "w9-l4.concept", `Om n = ${n}, vad är ${a}n?`, String(a * n), [{ text: `${a}${n}`, note: "Det är siffrorna bredvid varandra. 2n betyder 2 gånger n." }, { text: String(a + n) }, { text: String(a * 10 + n * 2) }], `${a}n = ${a} · ${n} = ${a * n}.`, ["Gånger, inte bredvid varandra."], rng); } },
    { id: "shop", skill: "w9-l4.context", gen: (rng) => { const k = rng.int(3, 8), n = rng.int(8, 25); return numeric(`sh-${k}-${n}`, "w9-l4.context", `En påse kostar n kr. Vad kostar ${k} påsar när n = ${n}?`, k * n, `${k}n = ${k} · ${n} = ${k * n} kr.`, ["Uttrycket är " + k + "n."], "kr"); } },
    { id: "sameAs", skill: "w9-l4.equal", gen: (rng) => mc("sa", "w9-l4.equal", "Vilket uttryck är alltid lika med n + n?", "2n", [{ text: "n + 2", note: "n + 2 är 2 mer än n – inte dubbelt så mycket." }, { text: "n · n" }, { text: "2 + n + n" }], "n + n är n två gånger, alltså 2n.", ["Prova med n = 5."], rng) },
    { id: "bothWays", skill: "w9-l4.compare", gen: (rng) => { const a = rng.int(2, 6), n = rng.int(3, 9); return numeric(`bw-${a}-${n}`, "w9-l4.compare", `Hur mycket större är ${a}n än n + ${a} när n = ${n}?`, a * n - (n + a), `${a}n = ${a * n} och n + ${a} = ${n + a}. Skillnad ${a * n - n - a}.`, ["Räkna båda."]); } },
  ],
  method: [
    { id: "writeExpr", skill: "w9-l4.write", gen: (rng) => { const a = rng.int(2, 6), b = rng.int(2, 9); return exprEx(`we-${a}-${b}`, "w9-l4.write", `En bok kostar n kr. Du köper ${a} böcker och en penna för ${b} kr. Skriv ett uttryck för vad du betalar.`, lin(a, b), `${a} · n + ${b} = ${a}n + ${b}.`, ["Böckerna först, sedan pennan."]); } },
    { id: "table", skill: "w9-l4.table", gen: (rng) => { const a = rng.int(2, 5), b = rng.int(1, 6); return multifield(`tb-${a}-${b}`, "w9-l4.table", `Räkna ut ${a}n + ${b} för n = 2, 3 och 5.`, [{ label: "n = 2", accept: [2 * a + b] }, { label: "n = 3", accept: [3 * a + b] }, { label: "n = 5", accept: [5 * a + b] }], `${2 * a + b}, ${3 * a + b}, ${5 * a + b}.`, ["Sätt in talet för n."]); } },
  ],
  representation: [
    { id: "fromTable", skill: "w9-l4.table", gen: (rng) => { const a = rng.int(2, 5), b = rng.int(1, 5); const ns = [1, 2, 3, 4]; return exprEx(`ft-${a}-${b}`, "w9-l4.table", `En tabell visar n och värdet av ett uttryck:\nn: ${ns.join(", ")}\nvärde: ${ns.map((n) => a * n + b).join(", ")}\nSkriv uttrycket.`, lin(a, b), `Ökning ${a} per n och n = 1 ger ${a + b}: ${lin(a, b)}.`, ["Hur mycket ökar värdet när n ökar med 1?"]); } },
    { id: "bagWeight", skill: "w9-l4.write", gen: (rng) => { const k = rng.int(2, 7), m = rng.int(2, 9); return exprEx(`bg-${k}-${m}`, "w9-l4.write", `En ask väger n gram. Du har ${k} askar och en burk som väger ${m} gram. Skriv ett uttryck för vad allt väger.`, lin(k, m), `${k}n + ${m}.`, []); } },
  ],
  teacher: {
    title: "2n är inte 25",
    scenarios: ["Nils (åk 5) säger att om n = 5 så är 2n lika med 25 \"för det står ju 2 och 5\"."],
    prompt: "Förklara för Nils vad 2n betyder, varför det inte är 25, och hur man räknar ut värdet. Jämför också 2n med n + 2.",
    minChars: 160,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "gg", label: "att 2n betyder 2 gånger n", any: ["2 gånger n", "2 · n", "2·n", "gånger n", "multiplicera"] },
        { id: "svar", label: "att 2n = 10 när n = 5", any: ["10"] },
        { id: "fel", label: "att 25 är siffrorna bredvid varandra", any: ["bredvid varandra", "siffrorna", "efter varandra", "skriver ihop"] },
        { id: "tal", label: "att bokstaven står för ett tal", any: ["står för ett tal", "ett tal", "är ett tal", "bokstav"] },
        { id: "jfr", label: "jämförelse med n + 2 (7)", any: ["n + 2", "n+2", "7", "2 mer"] },
      ],
    },
    modelAnswer: "Nils, en bokstav som n står för ett tal. 2n betyder 2 gånger n, alltså 2 · n. Om n = 5 är det 2 · 5 = 10, inte 25. 25 skulle vara siffrorna 2 och 5 bredvid varandra, och så läser vi inte algebra. Jämför med n + 2: det betyder 2 mer än n, så när n = 5 blir det 7. 2n och n + 2 är alltså olika uttryck.",
  },
};
