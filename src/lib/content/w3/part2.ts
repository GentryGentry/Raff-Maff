import type { Lesson } from "../types";
import { mc, numeric, multifield, sv, numberlineEx, areaEx, columnEx, withVisual } from "@/lib/engine/gen-helpers";

// ───────── Lektion 4: Tiotal och hundratal ─────────
export const lesson4: Lesson = {
  id: "w3-l4", worldId: "w3", title: "Multiplikation med tiotal och hundratal", grades: "åk 4–6",
  summary: "Använda tabellfakta för 30 · 40, 200 · 30 och liknande – utan ”nollregler”.",
  lgr: "Positionssystemet och de fyra räknesätten; metoder för huvudräkning",
  objectives: ["Beräkna produkter som 30 · 4, 30 · 40 och 200 · 30 i huvudet.", "Förklara resultatet med platsvärde (inte bara ”lägg till nollor”).", "Hantera fall där tabellsvaret slutar på noll (50 · 20)."],
  intro: "”Multiplicera först, lägg sedan till lika många nollor” fungerar nästan alltid – men eleven vet inte varför, och gör fel när tabellsvaret självt slutar på noll: $50 \\cdot 20$. Vi bygger i stället på det eleven redan kan: **tiotal är enheter**.",
  theory: [
    { heading: "Tiotal är enheter", body: "$30 \\cdot 4$ betyder 3 tiotal gånger 4 = 12 tiotal = 120. Med tabellfakta: $3 \\cdot 4 = 12$, och 12 *tiotal* är $120$. Det är samma flyttning av platser som i Värld 1." },
    { heading: "Tiotal gånger tiotal", body: "$30 \\cdot 40$: tiotal gånger tiotal ger **hundratal**. $3 \\cdot 4 = 12$ och alltså 12 hundratal = $1\\,200$. Skriver man $30 \\cdot 40 = (3 \\cdot 10) \\cdot (4 \\cdot 10) = 12 \\cdot 100$ ser man varför.", visual: { type: "area", a: 4, b: 3 } },
    { heading: "När nollorna ”blir fler”", body: "$50 \\cdot 20$: $5 \\cdot 2 = 10$ och 10 hundratal = $1\\,000$. Regeln ”lika många nollor som faktorerna” ger *tre* nollor här, trots att faktorerna bara har två. Tänker du platsvärde klarar du även det." },
  ],
  worked: [
    { title: "Tiotal gånger ental", problem: "Beräkna 60 · 4.", steps: [{ text: "6 tiotal gånger 4.", math: "6 \\cdot 4 = 24" }, { text: "24 tiotal är:", math: "240" }], why: "Enheten är tio: 24 tiotal = 240.", alternative: "$60 \\cdot 4 = 6 \\cdot (10 \\cdot 4) = 6 \\cdot 40 = 240$." },
    { title: "Tiotal gånger tiotal", problem: "Beräkna 50 · 20.", steps: [{ text: "Tabellfakta.", math: "5 \\cdot 2 = 10" }, { text: "Tiotal gånger tiotal = hundratal, så 10 hundratal.", math: "10 \\cdot 100 = 1\\,000" }], why: "$50 \\cdot 20 = (5 \\cdot 10) \\cdot (2 \\cdot 10) = (5 \\cdot 2) \\cdot (10 \\cdot 10) = 10 \\cdot 100$.", alternative: "Areamodell: rutorna är $50 \\cdot 20$ – kan delas i $5 \\cdot 2$ rutor à $10 \\cdot 10 = 100$." },
  ],
  drawing: { task: "Rita en rektangel 30 × 40 där varje ruta står för 10 × 10 = 100. Hur många rutor? Vad är arean?", tool: "area" },
  pupils: [{ pupil: "Sixten", said: "50 · 20: 5 · 2 = 10 och så lägger man till en nolla. Svaret är 100.", misconception: "Lägger till bara en nolla i stället för två (en per faktor).", response: "Fråga: ”Hur många tiotal är 50? Hur många tiotal är 20?” Tiotal gånger tiotal blir hundratal: 10 hundratal." }],
  knowledge: [
    { id: "tensTimesOne", skill: "w3-l4.tens", gen: (rng) => { const a = rng.int(2, 9), b = rng.int(2, 9), hund = rng.chance(0.3); const x = a * (hund ? 100 : 10); return numeric(`t1-${x}-${b}`, "w3-l4.tens", `${sv(x)} · ${b} = ?`, x * b, `${a} · ${b} = ${a * b}, och ${a * b} ${hund ? "hundratal" : "tiotal"} är ${sv(x * b)}.`, ["Tänk tiotal/hundratal som enheter."]); } },
    { id: "tensTimesTens", skill: "w3-l4.tens-tens", gen: (rng) => { const a = rng.int(2, 9), b = rng.int(2, 9); return numeric(`tt-${a}-${b}`, "w3-l4.tens-tens", `${a * 10} · ${b * 10} = ?`, a * b * 100, `${a} · ${b} = ${a * b}, och tiotal gånger tiotal är hundratal: ${sv(a * b * 100)}.`, ["Tiotal gånger tiotal blir hundratal."]); } },
    { id: "trapZero", skill: "w3-l4.trap", gen: (rng) => { const pairs: [number, number][] = [[50, 20], [50, 40], [20, 50], [60, 50], [40, 25 * 2], [30, 30]]; const [a, b] = rng.pick(pairs.filter(([x, y]) => (x * y) % 1000 === 0 || x * y === 900 || x * y === 3000 || x * y === 2000)); return numeric(`tz-${a}-${b}`, "w3-l4.trap", `${a} · ${b} = ?`, a * b, `${a / 10} · ${b / 10} = ${(a / 10) * (b / 10)}, och det är ${(a / 10) * (b / 10)} hundratal: ${sv(a * b)}.`, ["Räkna först tabellfaktat, sedan platsvärdet."]); } },
    { id: "hundredsTens", skill: "w3-l4.tens-tens", gen: (rng) => { const a = rng.int(2, 9), b = rng.int(2, 9); return numeric(`ht-${a}-${b}`, "w3-l4.tens-tens", `${a * 100} · ${b * 10} = ?`, a * b * 1000, `${a} · ${b} = ${a * b}, hundratal gånger tiotal är tusental: ${sv(a * b * 1000)}.`, ["Hundratal gånger tiotal blir tusental."]); } },
    { id: "whyMc", skill: "w3-l4.concept", gen: (rng) => mc("wmc", "w3-l4.concept", "Varför är 50 · 20 = 1 000 och inte 100?", "5 · 2 = 10 och tiotal gånger tiotal är hundratal, så 10 hundratal", [{ text: "För att det alltid är två nollor till", note: "Regeln om nollor räcker inte – tabellsvaret 10 har själv en nolla." }, { text: "För att 5 · 20 = 100" }, { text: "För att 50 + 20 = 70" }], "Platsvärdet förklarar svaret: 10 hundratal = 1 000.", ["Vad är tiotal · tiotal?"], rng) },
  ],
  method: [
    { id: "splitTens", skill: "w3-l4.steps", gen: (rng) => { const a = rng.int(2, 9), b = rng.int(2, 9); return multifield(`st-${a}-${b}`, "w3-l4.steps", `Räkna ${a * 10} · ${b * 10} i steg.`, [{ label: `${a} · ${b} =`, accept: [a * b] }, { label: "10 · 10 =", accept: [100] }, { label: `${a * 10} · ${b * 10} =`, accept: [a * b * 100] }], `${a * b} · 100 = ${sv(a * b * 100)}.`, ["Dela upp i tabellfakta och 10 · 10."]); } },
    { id: "splitTrap", skill: "w3-l4.trap", gen: (rng) => { const a = rng.pick([5, 6, 8]), b = rng.pick([2, 5, 4].filter((x) => (a * x) % 10 === 0)); return multifield(`sp-${a}-${b}`, "w3-l4.trap", `Räkna ${a * 10} · ${b * 10}. Tabellsvaret slutar på noll – var försiktig!`, [{ label: `${a} · ${b} =`, accept: [a * b] }, { label: "Antal hundratal", accept: [a * b] }, { label: "Svar", accept: [a * b * 100] }], `${a * b} hundratal = ${sv(a * b * 100)}.`, []); } },
  ],
  representation: [
    { id: "tensLine", skill: "w3-l4.numberline", gen: (rng) => { const k = rng.int(2, 9); return numberlineEx(`tl-${k}`, "w3-l4.numberline", `Markera ${k} · 30 på tallinjen (varje streck är 30).`, k * 30, { min: 0, max: 300, step: 30, labelEvery: 150 }, `${k} hopp om 30 = ${k * 30}.`, []); } },
    { id: "gridHundreds", skill: "w3-l4.area", gen: (rng) => { const a = rng.int(2, 6), b = rng.int(2, 6); return withVisual(multifield(`gh-${a}-${b}`, "w3-l4.area", `Varje ruta i bilden står för 10 · 10 = 100. Rektangeln är ${a} rutor bred och ${b} rutor hög. Hur stor är sidorna och arean i riktiga tal?`, [{ label: "Bredd (a · 10)", accept: [a * 10] }, { label: "Höjd (b · 10)", accept: [b * 10] }, { label: "Area", accept: [a * b * 100] }], `Bredd ${a * 10}, höjd ${b * 10}, area ${a * b} · 100 = ${sv(a * b * 100)}.`, []), { type: "area", a, b }); } },
  ],
  teacher: {
    title: "Mer än ”lägg till nollor”",
    scenarios: ["Sixten (åk 5) räknar 50 · 20 genom att göra 5 · 2 = 10 och \"lägga till en nolla\". Svaret blir 100."],
    prompt: "Förklara för Sixten hur man bör tänka när man multiplicerar 50 · 20, varför hans svar blir fel, och varför ”lägg till nollor” är en riskabel regel utan förklaring.",
    minChars: 160,
    rubric: {
      minConcepts: 3,
      concepts: [
        { id: "tiotal", label: "att tiotal gånger tiotal blir hundratal", any: ["tiotal gånger tiotal", "hundratal", "10 · 10", "10 gånger 10"] },
        { id: "svar", label: "rätt svar 1 000", any: ["1 000", "1000", "tusen"] },
        { id: "tabell", label: "tabellfaktat 5 · 2 = 10 som antal hundratal", any: ["10 hundratal", "tio hundratal", "5 · 2", "5 gånger 2"] },
        { id: "regel", label: "att nollregeln är otillräcklig/förenklad", any: ["nollregel", "regeln", "lägga till nollor", "lägger till en nolla", "fungerar inte"] },
      ],
    },
    modelAnswer: "Sixten, 50 är 5 tiotal och 20 är 2 tiotal. 5 · 2 = 10, och tiotal gånger tiotal blir hundratal, så vi har 10 hundratal = 1 000. Du lade bara till en nolla, men det ska vara två – en från varje faktor – och dessutom har tabellsvaret 10 en egen nolla. Regeln ”lägg till nollor” säger inte varför och blir lätt fel. Genom att tänka tiotal och hundratal ser du alltid vad som gäller.",
  },
};

// ───────── Lektion 5: Uppställning ─────────
export const lesson5: Lesson = {
  id: "w3-l5", worldId: "w3", title: "Uppställning: multiplikation", grades: "åk 4–6",
  summary: "Skriftlig multiplikation med delprodukter – och varför man skriver en nolla.",
  lgr: "Metoder för beräkningar med naturliga tal vid skriftlig beräkning; rimlighetsbedömning",
  objectives: ["Utföra multiplikation med tvåsiffrig faktor i uppställning.", "Förklara delprodukterna och nollan med platsvärde.", "Kontrollera med överslag."],
  intro: "Uppställning för multiplikation är areamodellen i komprimerad form. Varje rad i uppställningen är en delprodukt, och nollan sist på andra raden är en **platshållare**. Din förklaring måste kunna koppla ihop de två.",
  theory: [
    { heading: "Delprodukter", body: "För $23 \\cdot 14$ multiplicerar vi först $23$ med entalssiffran $4$: $23 \\cdot 4 = 92$. Sedan multiplicerar vi $23$ med tiotalssiffran, som är **10** (inte 1!): $23 \\cdot 10 = 230$. Slutligen lägger vi ihop: $92 + 230 = 322$." },
    { heading: "Varför en nolla?", body: "Tiotalssiffran 1 betyder 1 tiotal, så andra raden är $23 \\cdot 10 = 230$. Nollan i $230$ är platshållare för entalen. Skriver vi bara 23 blir produkten fel med en faktor 10 – precis det fel som ger $92 + 23 = 115$." },
    { heading: "Koppling till areamodellen", body: "Delprodukten $23 \\cdot 4$ är rutorna $20 \\cdot 4$ och $3 \\cdot 4$ (80 + 12 = 92). Delprodukten $23 \\cdot 10$ är rutorna $20 \\cdot 10$ och $3 \\cdot 10$ (200 + 30 = 230).", visual: { type: "area", a: 8, b: 4 } },
    { heading: "Överslag", body: "$23 \\cdot 14 \\approx 20 \\cdot 10 = 200$ (för lågt) eller $25 \\cdot 15 = 375$ (för högt). Rätt svar 322 ligger mellan. Ett överslag avslöjar fel av storleksordningen 10." },
  ],
  worked: [
    { title: "Tvåsiffrig faktor", problem: "Beräkna 36 · 24 med uppställning.", steps: [{ text: "Delprodukt med entalssiffran 4.", math: "36 \\cdot 4 = 144" }, { text: "Delprodukt med tiotalssiffran: 36 · 20 = 720 (nollan är platshållare).", math: "36 \\cdot 20 = 720" }, { text: "Lägg ihop.", math: "144 + 720 = 864" }], why: "$36 \\cdot 24 = 36 \\cdot (4 + 20) = 36 \\cdot 4 + 36 \\cdot 20$.", alternative: "Areamodell: $30 \\cdot 20 + 30 \\cdot 4 + 6 \\cdot 20 + 6 \\cdot 4 = 600 + 120 + 120 + 24 = 864$." },
    { title: "Treställigt tal", problem: "Beräkna 148 · 12.", steps: [{ text: "148 · 2 = 296.", math: "148 \\cdot 2 = 296" }, { text: "148 · 10 = 1 480.", math: "148 \\cdot 10 = 1\\,480" }, { text: "Summera.", math: "296 + 1\\,480 = 1\\,776" }], why: "Samma princip som med två siffror.", alternative: "Överslag: $150 \\cdot 10 = 1\\,500$ plus $150 \\cdot 2 = 300$ → ca 1 800." },
  ],
  drawing: { task: "Rita en areamodell för 36 · 24 och markera vilka rutor som ingår i delprodukten 36 · 4 och vilka i 36 · 20.", tool: "area" },
  pupils: [{ pupil: "Lova", said: "23 · 14: jag gör 23 · 4 = 92 och 23 · 1 = 23. Svaret blir 92 + 23 = 115.", misconception: "Behandlar tiotalssiffran som ental – glömmer platshållaren.", response: "Fråga: ”Är 14 mer eller mindre än 10? Då ska produkten vara mer än 230. Passar 115?” Visa att 1:an betyder 10." }],
  knowledge: [
    { id: "mul2x2", skill: "w3-l5.product", gen: (rng, { level }) => { const a = rng.int(level > 1 ? 24 : 13, level > 1 ? 98 : 49), b = rng.int(12, level > 1 ? 49 : 29); return numeric(`m22-${a}-${b}`, "w3-l5.product", `Beräkna med uppställning: ${a} · ${b}`, a * b, `${a} · ${b % 10} = ${a * (b % 10)}, ${a} · ${b - (b % 10)} = ${a * (b - (b % 10))}; summa ${a * b}.`, ["Räkna två delprodukter."]); } },
    { id: "partialTens", skill: "w3-l5.partial", gen: (rng) => { const a = rng.int(13, 59), t = rng.int(1, 5); const b = t * 10 + rng.int(2, 9); return numeric(`pt-${a}-${b}`, "w3-l5.partial", `Vad blir delprodukten för tiotalssiffran när du räknar ${a} · ${b}? (Skriv med nollan, alltså ${a} · ${t * 10}.)`, a * t * 10, `${a} · ${t * 10} = ${sv(a * t * 10)}.`, ["Tiotalssiffran " + t + " är " + t * 10 + "."]); } },
    { id: "whyZero", skill: "w3-l5.concept", gen: (rng) => mc("wz", "w3-l5.concept", "Varför skriver man en nolla sist på andra raden när man räknar 23 · 14 i uppställning?", "Raden är 23 · 10 = 230; nollan är platshållare för entalen", [{ text: "För att det ser snyggt ut" }, { text: "För att tiotalssiffran 1 betyder 1" , note: "1:an står på tiotalsplatsen och betyder 10." }, { text: "För att svaret alltid ska sluta på noll" }], "Tiotalssiffran är värd 10. Nollan håller kvar platsen så att siffrorna hamnar i rätt kolumner.", ["Vad är tiotalssiffran 1 värd?"], rng) },
    { id: "estimate", skill: "w3-l5.estimate", gen: (rng) => { const a = rng.int(21, 79), b = rng.int(21, 69); const est = Math.round(a / 10) * 10 * Math.round(b / 10) * 10; return numeric(`es-${a}-${b}`, "w3-l5.estimate", `Överslag: avrunda båda talen till närmaste tiotal och beräkna ${a} · ${b}.`, est, `${Math.round(a / 10) * 10} · ${Math.round(b / 10) * 10} = ${sv(est)}.`, ["Avrunda var och en till närmaste tiotal."]); } },
  ],
  method: [
    { id: "colMul2", skill: "w3-l5.col", gen: (rng) => { const a = rng.int(13, 59), b = rng.int(1, 3) * 10 + rng.int(2, 9); return columnEx(`cm-${a}-${b}`, "w3-l5.col", "mul", a, b, `${a} · ${b} = ${sv(a * b)}. Delprodukterna är ${a} · ${b % 10} = ${a * (b % 10)} och ${a} · ${b - (b % 10)} = ${a * (b - (b % 10))}.`, ["Första raden: ental. Andra raden: tiotal (skriv nollan!)."], "Ställ upp och räkna. Skriv delprodukterna (andra raden med nollan) och svaret."); } },
    { id: "colMul3", skill: "w3-l5.col", gen: (rng) => { const a = rng.int(112, 389), b = rng.int(1, 2) * 10 + rng.int(2, 9); return columnEx(`cm3-${a}-${b}`, "w3-l5.col", "mul", a, b, `${a} · ${b} = ${sv(a * b)}.`, ["Två delprodukter, sedan summa."], "Ställ upp och räkna. Skriv delprodukterna och svaret."); } },
  ],
  representation: [
    { id: "linkModels", skill: "w3-l5.link", gen: (rng) => { const t = rng.int(2, 5), e = rng.int(2, 9), b = rng.int(2, 4) * 10 + rng.int(2, 6); const a = t * 10 + e; const be = b % 10; return multifield(`lm-${a}-${b}`, "w3-l5.link", `Koppla areamodellen till uppställningen för ${a} · ${b}. Fyll i delprodukterna för entalssiffran ${be}.`, [{ label: `${t * 10} · ${be} =`, accept: [t * 10 * be] }, { label: `${e} · ${be} =`, accept: [e * be] }, { label: `${a} · ${be} = (summan av de två)`, accept: [a * be] }], `${t * 10 * be} + ${e * be} = ${a * be}.`, []); } },
    { id: "areaForCol", skill: "w3-l5.link", gen: (rng) => { const a = rng.int(13, 39), b = rng.int(12, 28); return areaEx(`afc-${a}-${b}`, "w3-l5.link", a, b, `${a} · ${b} = ${a * b}.`, []); } },
  ],
  teacher: {
    title: "Nollan på andra raden",
    scenarios: ["Lova (åk 5) räknar 23 · 14 genom att göra 23 · 4 = 92 och 23 · 1 = 23 och lägger ihop till 115. Hon säger: \"Läraren sa att man tar tal för tal.\""],
    prompt: "Förklara för Lova varför svaret 115 inte kan stämma, vad tiotalssiffran 1 egentligen betyder, och varför man skriver en nolla på andra raden. Hjälp henne med ett överslag.",
    minChars: 170,
    rubric: {
      minConcepts: 3,
      concepts: [
        { id: "tio", label: "att tiotalssiffran 1 betyder 10 (23 · 10 = 230)", any: ["23 · 10", "230", "betyder 10", "är 10", "tio"] },
        { id: "noll", label: "nollan som platshållare", any: ["platshåll", "nolla", "nollan"] },
        { id: "overslag", label: "överslag/rimlighet (mer än 200)", any: ["överslag", "rimlig", "mer än 200", "större än 200", "mer än 230", "orimlig"] },
        { id: "svar", label: "rätt svar 322", any: ["322"] },
      ],
    },
    modelAnswer: "Lova, siffran 1 i 14 står på tiotalsplatsen och betyder 10, inte 1. Därför ska den andra delprodukten vara 23 · 10 = 230, inte 23. Nollan i 230 är platshållare för entalen så att siffrorna hamnar rätt. Ett överslag visar problemet: 14 är större än 10, så 23 · 14 måste vara mer än 230, men 115 är mycket mindre. Rätt är 92 + 230 = 322.",
  },
};

// ───────── Lektion 6: Räknelagar ─────────
export const lesson6: Lesson = {
  id: "w3-l6", worldId: "w3", title: "Räknelagar och räkneordning", grades: "åk 4–6",
  summary: "Kommutativa, associativa och distributiva lagen – och att multiplikation går före addition.",
  lgr: "De fyra räknesätten och regler för deras användning vid beräkningar med naturliga tal",
  objectives: ["Använda räknelagarna för smarta beräkningar.", "Tillämpa räkneordning (multiplikation före addition, parenteser först).", "Förklara räkneordningen med en berättelse."],
  intro: "”Räknelagar” låter torrt, men de är verktygen bakom alla smarta huvudräkningsstrategier. Och **räkneordningen** är en överenskommelse som gör att alla läser $3 + 4 \\cdot 5$ på samma sätt. Din uppgift är att kunna visa varför den överenskommelsen är rimlig.",
  theory: [
    { heading: "Tre lagar", body: "- **Kommutativa:** $a \\cdot b = b \\cdot a$\n\n- **Associativa:** $(a \\cdot b) \\cdot c = a \\cdot (b \\cdot c)$\n\n- **Distributiva:** $a \\cdot (b + c) = a \\cdot b + a \\cdot c$\n\nDen distributiva lagen är grunden för areamodellen: $7 \\cdot 13 = 7 \\cdot 10 + 7 \\cdot 3 = 70 + 21 = 91$." },
    { heading: "Smart multiplikation", body: "$25 \\cdot 12 = 25 \\cdot 4 \\cdot 3 = 100 \\cdot 3 = 300$. Vi bröt ut $12 = 4 \\cdot 3$ (associativa) för att få $25 \\cdot 4 = 100$." },
    { heading: "Räkneordning", body: "1. Parenteser först.\n\n2. Multiplikation och division före addition och subtraktion.\n\n3. Annars från vänster till höger.\n\n$3 + 4 \\cdot 5 = 3 + 20 = 23$, men $(3 + 4) \\cdot 5 = 35$. Parenteserna ändrar betydelsen." },
    { heading: "Varför multiplikation först?", body: "Berättelse: Du har 3 kr och köper 4 påsar med 5 kr i varje... eller rättare: du har 3 kr och får sedan 4 sedlar à 5 kr. Då har du $3 + 4 \\cdot 5 = 23$ kr. Multiplikation är en genväg för upprepad addition, så den hör ihop *innan* den läggs till resten." },
  ],
  worked: [
    { title: "Distributiva lagen", problem: "Beräkna 7 · 18.", steps: [{ text: "Dela upp 18.", math: "18 = 10 + 8" }, { text: "Multiplicera delarna.", math: "7 \\cdot 10 = 70,\\ 7 \\cdot 8 = 56" }, { text: "Summera.", math: "70 + 56 = 126" }], why: "$7 \\cdot (10 + 8) = 7 \\cdot 10 + 7 \\cdot 8$ – 7 grupper om 18 är 7 grupper om 10 och 7 grupper om 8.", alternative: "$7 \\cdot 20 - 7 \\cdot 2 = 140 - 14 = 126$." },
    { title: "Räkneordning", problem: "Beräkna 6 + 3 · 4.", steps: [{ text: "Multiplikation före addition.", math: "3 \\cdot 4 = 12" }, { text: "Addera.", math: "6 + 12 = 18" }], why: "$3 \\cdot 4$ är en samlad mängd (3 grupper om 4) som läggs till 6.", alternative: "Om man räknade från vänster: $(6 + 3) \\cdot 4 = 36$ – ett annat tal. Parentes behövs för det." },
  ],
  drawing: { task: "Rita en rektangel 8 × 15 och dela den i 8 × 10 och 8 × 5. Skriv areorna och summan.", tool: "area" },
  pupils: [{ pupil: "Hedda", said: "3 + 4 · 5 = 35, jag räknar ju från vänster.", misconception: "Räknar uttrycket strikt från vänster utan hänsyn till räkneordningen.", response: "Använd berättelsen: 3 kr plus 4 sedlar à 5 kr. Hur många kronor är det? 23. Visa att 35 hör till (3 + 4) · 5." }],
  knowledge: [
    { id: "distributive", skill: "w3-l6.distributive", gen: (rng) => { const a = rng.int(3, 9), b = rng.int(13, 29); return numeric(`di-${a}-${b}`, "w3-l6.distributive", `Räkna smart: ${a} · ${b} (Tips: ${a} · ${Math.floor(b / 10) * 10} + ${a} · ${b % 10})`, a * b, `${a * Math.floor(b / 10) * 10} + ${a * (b % 10)} = ${a * b}.`, ["Dela upp " + b + "."]); } },
    { id: "smartMul", skill: "w3-l6.associative", gen: (rng) => { const k = rng.int(2, 9); return numeric(`sm-${k}`, "w3-l6.associative", `25 · ${4 * k} = ? (Tips: 25 · 4 = 100)`, 100 * k, `25 · ${4 * k} = 25 · 4 · ${k} = 100 · ${k} = ${100 * k}.`, ["Bryt ut 4 ur " + 4 * k + "."]); } },
    { id: "order", skill: "w3-l6.order", gen: (rng) => { const a = rng.int(2, 9), b = rng.int(2, 6), c = rng.int(2, 9); const plus = rng.chance(0.5); const e = plus ? `${a} + ${b} · ${c}` : `${a} · ${b} + ${c}`; const v = plus ? a + b * c : a * b + c; return numeric(`or-${a}-${b}-${c}-${plus}`, "w3-l6.order", `${e} = ?`, v, `Multiplikation först: ${plus ? `${b} · ${c} = ${b * c}, ${a} + ${b * c}` : `${a} · ${b} = ${a * b}, ${a * b} + ${c}`} = ${v}.`, ["Vad räknar man först?"]); } },
    { id: "parentheses", skill: "w3-l6.order", gen: (rng) => { const a = rng.int(2, 8), b = rng.int(2, 7), c = rng.int(2, 9); return numeric(`pa-${a}-${b}-${c}`, "w3-l6.order", `(${a} + ${b}) · ${c} = ?`, (a + b) * c, `Parentesen först: ${a + b}, sedan · ${c} = ${(a + b) * c}.`, ["Parenteser först."]); } },
    { id: "equivMc", skill: "w3-l6.distributive", gen: (rng) => { const a = rng.int(3, 9), b = rng.int(11, 19); return mc(`eq-${a}-${b}`, "w3-l6.distributive", `Vilket uttryck är lika med ${a} · ${b}?`, `${a} · 10 + ${a} · ${b - 10}`, [{ text: `${a} · 10 + ${b - 10}`, note: "Du har glömt att multiplicera även entalsdelen med " + a + "." }, { text: `${a} + 10 · ${b - 10}` }, { text: `${a} · 10 · ${b - 10}` }], `${a} · ${b} = ${a} · (10 + ${b - 10}) = ${a} · 10 + ${a} · ${b - 10}.`, ["Distributiva lagen: multiplicera varje del."], rng); } },
  ],
  method: [
    { id: "distSteps", skill: "w3-l6.distributive", gen: (rng) => { const a = rng.int(4, 9), b = rng.int(13, 28); const t = Math.floor(b / 10) * 10, e = b % 10; return multifield(`ds-${a}-${b}`, "w3-l6.distributive", `Räkna ${a} · ${b} med distributiva lagen: ${a} · (${t} + ${e}).`, [{ label: `${a} · ${t} =`, accept: [a * t] }, { label: `${a} · ${e} =`, accept: [a * e] }, { label: "Summa", accept: [a * b] }], `${a * t} + ${a * e} = ${a * b}.`, []); } },
    { id: "orderSteps", skill: "w3-l6.order", gen: (rng) => { const a = rng.int(2, 9), b = rng.int(2, 6), c = rng.int(2, 9); return multifield(`os-${a}-${b}-${c}`, "w3-l6.order", `Beräkna ${a} + ${b} · ${c} i steg.`, [{ label: "Steg 1 (multiplikationen)", accept: [b * c] }, { label: "Steg 2 (additionen)", accept: [a + b * c] }], `${b} · ${c} = ${b * c}; ${a} + ${b * c} = ${a + b * c}.`, ["Multiplikation först."]); } },
  ],
  representation: [
    { id: "splitRect", skill: "w3-l6.area", gen: (rng) => { const a = rng.int(4, 9), b = rng.int(13, 19); return areaEx(`sr-${a}-${b}`, "w3-l6.area", a, b, `${a} · ${b} = ${a} · 10 + ${a} · ${b - 10} = ${a * b}.`, [], `Rektangeln är ${a} hög och ${b} bred. Dela efter platsvärde och fyll i areorna.`); } },
    { id: "storyOrder", skill: "w3-l6.story", gen: (rng) => { const a = rng.int(2, 9), b = rng.int(2, 5), c = rng.int(2, 9); return mc(`so-${a}-${b}-${c}`, "w3-l6.story", `Du har ${a} kr och får sedan ${b} sedlar med ${c} kr på varje. Vilket uttryck beskriver hur många kronor du har?`, `${a} + ${b} · ${c}`, [{ text: `(${a} + ${b}) · ${c}`, note: "Det vore om du la ihop sedlar och kronor först – det stämmer inte här." }, { text: `${a} · ${b} + ${c}` }, { text: `${a} + ${b} + ${c}` }], `${b} sedlar à ${c} kr är ${b} · ${c} kr. Det läggs till ${a} kr.`, ["Vad är multiplikationen i berättelsen?"], rng); } },
  ],
  teacher: {
    title: "Räkneordningen med en berättelse",
    scenarios: ["Hedda (åk 5) räknar 3 + 4 · 5 från vänster och får 35. Hon frågar: \"Varför får man inte räkna från vänster? Det är väl logiskast?\""],
    prompt: "Förklara för Hedda varför multiplikation räknas före addition med hjälp av en berättelse, och visa vilken räkning som ger 35 och hur man skriver den.",
    minChars: 160,
    rubric: {
      minConcepts: 3,
      concepts: [
        { id: "berattelse", label: "en berättelse (kronor, sedlar, påsar)", any: ["kr", "sedlar", "påsar", "berättelse", "kronor", "äpplen"] },
        { id: "svar", label: "rätt svar 23 (3 + 20)", any: ["23", "3 + 20"] },
        { id: "parentes", label: "35 kräver parentes: (3 + 4) · 5", any: ["(3 + 4)", "parentes", "35"] },
        { id: "forklaring", label: "att multiplikation är upprepad addition / samlas först", any: ["upprepad", "grupper", "samlad", "överenskommelse", "alla läser lika"] },
      ],
    },
    modelAnswer: "Hedda, tänk dig att du har 3 kr och får 4 sedlar à 5 kr. Sedlarna är 4 · 5 = 20 kr, och med de 3 kronorna har du 3 + 20 = 23 kr. Därför räknar vi multiplikationen först – den är en genväg för upprepad addition av lika stora grupper och hör ihop. Räknar man från vänster får man 35, och den räkningen skrivs (3 + 4) · 5 med parentes. Räkneordningen är en överenskommelse som gör att alla läser uttrycket lika.",
  },
};
