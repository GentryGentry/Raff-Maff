import type { Lesson } from "../types";
import { mc, numeric, multifield, sv, numberlineEx, areaEx, withVisual, placeParts } from "@/lib/engine/gen-helpers";

// ───────── Lektion 1: Grupper och rader ─────────
export const lesson1: Lesson = {
  id: "w3-l1", worldId: "w3", title: "Multiplikation – grupper och rader", grades: "åk 4–6",
  summary: "Vad multiplikation betyder: lika stora grupper, rader och kolumner.",
  lgr: "De fyra räknesätten och regler för deras användning vid beräkningar med naturliga tal",
  objectives: ["Förklara multiplikation som lika stora grupper och som rader × kolumner.", "Skriva en multiplikation som upprepad addition.", "Använda 0 och 1 som faktorer."],
  intro: "Många elever lär sig multiplikation som ”en ny sorts plus” eller som ett antal tabellfakta att plugga. Men multiplikation är en *tanke*: **lika stora grupper**. Förstår eleven den tanken kan hen härleda resten – och som lärare behöver du kunna visa den på flera sätt.",
  theory: [
    { heading: "Lika stora grupper", body: "$4 \\cdot 6$ läses ”4 gånger 6” och betyder **4 grupper med 6 i varje**: $6 + 6 + 6 + 6 = 24$. Talen kallas **faktorer** och resultatet **produkt**. Multiplikation är en genväg för upprepad addition – men bara när alla termer är lika stora." },
    { heading: "Rader och kolumner", body: "Ställ upp föremålen i en rektangel: 3 rader med 5 i varje rad. Antalet är $3 \\cdot 5 = 15$. Samma rektangel har 5 kolumner med 3 i varje: $5 \\cdot 3 = 15$. Därför är $a \\cdot b = b \\cdot a$ (**kommutativa lagen**).", visual: { type: "area", a: 5, b: 3 } },
    { heading: "Speciella fall", body: "- $n \\cdot 1 = n$ (en grupp med $n$)\n\n- $n \\cdot 0 = 0$ (inga grupper, eller grupper utan innehåll)\n\n- $0 \\cdot n = 0$\n\nDet här är inga regler att lära sig utantill – de följer av gruppbilden." },
  ],
  worked: [
    { title: "Upprepad addition", problem: "Skriv 5 · 7 som en addition och beräkna.", steps: [{ text: "5 grupper med 7 i varje.", math: "7 + 7 + 7 + 7 + 7" }, { text: "Räkna ihop.", math: "7+7=14,\\ 14+7=21,\\ 21+7=28,\\ 28+7=35" }, { text: "Produkten är:", math: "5 \\cdot 7 = 35" }], why: "Multiplikation sammanfattar att samma tal läggs till flera gånger.", alternative: "Rita 5 rader med 7 rutor – eller 7 rader med 5, det blir lika många." },
    { title: "Rektangel", problem: "En rektangel har 6 rader med 8 rutor i varje. Hur många rutor?", steps: [{ text: "Rader gånger antal i varje rad.", math: "6 \\cdot 8" }, { text: "Räkna.", math: "6 \\cdot 8 = 48" }], why: "Varje rad har lika många, så multiplikation passar.", alternative: "Det är samma som 8 rader med 6 i varje." },
  ],
  drawing: { task: "Rita en rektangel av rutor med 4 rader och 7 kolumner. Skriv både 4 · 7 och 7 · 4 och förklara varför produkterna är lika.", tool: "grid" },
  pupils: [{ pupil: "Jonas", said: "3 · 5 är 8, för det är ju en sorts plus.", misconception: "Ser multiplikation som addition av faktorerna.", response: "Be Jonas rita 3 påsar med 5 kulor i varje. Fråga: ”Hur många kulor är det tillsammans?” Visa att 3 · 5 betyder 5 + 5 + 5." }],
  knowledge: [
    { id: "basicFact", skill: "w3-l1.facts", gen: (rng) => { const a = rng.int(2, 9), b = rng.int(2, 9); return numeric(`bf-${a}-${b}`, "w3-l1.facts", `${a} · ${b} = ?`, a * b, `${a} grupper med ${b}: ${a * b}.`, ["Tänk grupper eller rader."]); } },
    { id: "repeatedAdd", skill: "w3-l1.meaning", gen: (rng) => { const g = rng.int(3, 7), s = rng.int(3, 9); const sum = (n: number) => Array(n).fill(s).join(" + "); return mc(`ra-${g}-${s}`, "w3-l1.meaning", `Vilken addition visar ${g} grupper med ${s} i varje?`, sum(g), [{ text: `${g} + ${s}` }, { text: sum(g - 1) }, { text: sum(g + 1) }], `${g} grupper betyder ${g} termer, alla lika med ${s}.`, ["Hur många termer ska det vara?"], rng); } },
    { id: "rectCount", skill: "w3-l1.array", gen: (rng) => { const r = rng.int(3, 9), c = rng.int(3, 9); return numeric(`rc-${r}-${c}`, "w3-l1.array", `En rektangel har ${r} rader med ${c} rutor i varje rad. Hur många rutor är det?`, r * c, `${r} · ${c} = ${r * c}.`, ["Rader gånger rutor per rad."], "rutor"); } },
    { id: "zeroOne", skill: "w3-l1.special", gen: (rng) => { const n = rng.int(12, 487), z = rng.chance(0.5); const e = z ? `${n} · 0` : `1 · ${n}`; return numeric(`zo-${n}-${z}`, "w3-l1.special", `${e} = ?`, z ? 0 : n, z ? "Noll grupper (eller tomma grupper) ger noll." : "En grupp med " + n + " ger " + n + ".", ["Tänk grupper."]); } },
    { id: "whyMeaning", skill: "w3-l1.meaning", gen: (rng) => mc("wm", "w3-l1.meaning", "Vad betyder 4 · 6?", "4 grupper med 6 i varje (6 + 6 + 6 + 6)", [{ text: "4 + 6", note: "Det är addition av faktorerna, inte multiplikation." }, { text: "4 grupper med 4 i varje" }, { text: "6 grupper, varav 4 räknas" }], "Första faktorn säger hur många grupper, andra hur stor varje grupp är.", ["Hur många grupper?"], rng) },
  ],
  method: [
    { id: "asSum", skill: "w3-l1.repeated-add", gen: (rng) => { const g = rng.int(3, 8), s = rng.int(3, 9); return multifield(`as-${g}-${s}`, "w3-l1.repeated-add", `Skriv ${g} · ${s} som upprepad addition och beräkna.`, [{ label: "Antal termer", accept: [g] }, { label: "Varje term är", accept: [s] }, { label: "Summa", accept: [g * s] }], `${Array(g).fill(s).join(" + ")} = ${g * s}.`, ["Antalet termer = antalet grupper."]); } },
    { id: "arrayFill", skill: "w3-l1.array", gen: (rng) => { const r = rng.int(3, 8), c = rng.int(3, 8); return multifield(`af-${r}-${c}`, "w3-l1.array", `Du ställer upp ${r * c} kuber i ${r} rader med lika många i varje. Fyll i.`, [{ label: "Kuber per rad", accept: [c] }, { label: `${r} · (kuber per rad) =`, accept: [r * c] }, { label: "Antal kolumner", accept: [c] }], `${r * c} ÷ ${r} = ${c} kuber per rad.`, ["Dela jämnt på raderna."]); } },
  ],
  representation: [
    { id: "areaCount", skill: "w3-l1.array", gen: (rng) => { const c = rng.int(3, 9), r = rng.int(3, 7); return withVisual(multifield(`ac-${c}-${r}`, "w3-l1.array", "Bilden visar en rektangel av rutor. Hur många kolumner och rader har den, och hur många rutor totalt?", [{ label: "Kolumner", accept: [c] }, { label: "Rader", accept: [r] }, { label: "Rutor totalt", accept: [c * r] }], `${c} kolumner · ${r} rader = ${c * r} rutor.`, ["Räkna kolumner och rader."]), { type: "area", a: c, b: r }); } },
    { id: "skipLine", skill: "w3-l1.numberline", gen: (rng) => { const s = rng.int(3, 9), k = rng.int(2, 9); return numberlineEx(`sl-${s}-${k}`, "w3-l1.numberline", `Hoppa ${s} steg åt höger ${k} gånger, med start på 0. Markera var du hamnar.`, s * k, { min: 0, max: s * 10, step: s, labelEvery: s * 5 }, `${k} hopp om ${s} = ${k} · ${s} = ${s * k}.`, ["Varje streck är ett hopp."]); } },
  ],
  teacher: {
    title: "Multiplikation är inte plus",
    scenarios: ["Jonas (åk 4) säger: \"3 · 5 är 8, för det är ju en sorts plus.\" Han har lärt sig att gånger ”läggs ihop”."],
    prompt: "Förklara för Jonas vad 3 · 5 egentligen betyder, och visa med en modell (grupper, rader eller upprepad addition) varför svaret är 15 och inte 8.",
    minChars: 150,
    rubric: {
      minConcepts: 3,
      concepts: [
        { id: "grupper", label: "att det är lika stora grupper (3 grupper om 5)", any: ["grupper", "grupp", "lika stora", "påsar", "gånger fem"] },
        { id: "upprepad", label: "upprepad addition (5 + 5 + 5)", any: ["5 + 5 + 5", "5+5+5", "upprepad", "lägger till samma"] },
        { id: "svar", label: "rätt svar 15", any: ["15"] },
        { id: "modell", label: "en modell (rutor, rektangel, rader)", any: ["rektangel", "rader", "rutor", "rita", "kulor", "modell", "bild"] },
      ],
      misconceptions: [{ pattern: "3 ?(·|gånger|x) ?5 (är|blir|=) 8", message: "3 · 5 är 15, inte 8 – förklara varför 8 är en addition av faktorerna." }],
    },
    modelAnswer: "Jonas, 3 · 5 betyder 3 grupper med 5 i varje, alltså 5 + 5 + 5 = 15. 3 + 5 = 8 är en helt annan sak: då lägger vi ihop två olika tal. Rita 3 påsar med 5 kulor i varje, eller en rektangel med 3 rader och 5 rutor per rad. Räkna alla kulor – det blir 15. Multiplikation är ett kortare sätt att skriva upprepad addition av lika stora grupper.",
  },
};

// ───────── Lektion 2: Tabellerna ─────────
export const lesson2: Lesson = {
  id: "w3-l2", worldId: "w3", title: "Multiplikationstabellerna – strategier", grades: "åk 4–6",
  summary: "Härleda tabellfakta med dubblor, 5:ans- och 9:ans-tricket och uppdelning.",
  lgr: "De fyra räknesätten och regler för deras användning; metoder för beräkningar vid huvudräkning",
  objectives: ["Härleda tabellfakta med strategier i stället för att bara minnas dem.", "Använda kommutativitet för att halvera inlärningsmängden.", "Förklara varför strategierna fungerar."],
  intro: "Elever som bara ”plugger” tabellerna fastnar när de glömmer ett fakta. Elever som har **strategier** kan bygga fram det de saknar: har du 5 · 7 så har du 6 · 7. Här tränar du de strategier du själv ska kunna lära ut.",
  theory: [
    { heading: "Dubbla och dubbla igen", body: "$2 \\cdot n$ är dubbelt. $4 \\cdot n$ är dubbelt av dubbelt: $4 \\cdot 7 = 2 \\cdot 14 = 28$. $8 \\cdot n$ är dubbelt av $4 \\cdot n$: $8 \\cdot 7 = 56$." },
    { heading: "Femmans tabell och sexans", body: "$5 \\cdot n$ är hälften av $10 \\cdot n$: $5 \\cdot 8 = 40$ (hälften av 80). Sexans tabell: $6 \\cdot n = 5 \\cdot n + n$, alltså $6 \\cdot 7 = 35 + 7 = 42$." , visual: { type: "area", a: 7, b: 6 } },
    { heading: "Nians tabell", body: "$9 \\cdot n = 10 \\cdot n - n$: $9 \\cdot 7 = 70 - 7 = 63$. Det fungerar eftersom $9 = 10 - 1$ (distributiva lagen)." },
    { heading: "Byta plats", body: "Eftersom $a \\cdot b = b \\cdot a$ behöver du bara lära dig hälften av tabellen. Har du $7 \\cdot 3$ har du $3 \\cdot 7$." },
  ],
  worked: [
    { title: "Nians tabell", problem: "Beräkna 9 · 8.", steps: [{ text: "Tänk 10 grupper minus en grupp.", math: "10 \\cdot 8 = 80" }, { text: "Dra bort en åtta.", math: "80 - 8 = 72" }], why: "$9 \\cdot 8 = (10 - 1) \\cdot 8 = 80 - 8$.", alternative: "Tiotalssiffran är en mindre än faktorn (7 här) och siffersumman är 9 (7 + 2)." },
    { title: "Sexans tabell", problem: "Beräkna 6 · 7.", steps: [{ text: "Börja med femman.", math: "5 \\cdot 7 = 35" }, { text: "Lägg till en grupp.", math: "35 + 7 = 42" }], why: "$6 \\cdot 7 = (5 + 1) \\cdot 7 = 5 \\cdot 7 + 7$.", alternative: "$3 \\cdot 7 = 21$, dubblat: $42$." },
  ],
  drawing: { task: "Rita en rektangel 6 × 7 och dela den i 5 × 7 och 1 × 7. Skriv areorna.", tool: "area" },
  pupils: [{ pupil: "Sofia", said: "Jag kommer aldrig ihåg 7 · 8, så jag brukar bara hoppa över den.", misconception: "Ser tabellerna som isolerade fakta att pluggas, inte som ett nätverk.", response: "Visa att 7 · 8 kan byggas: 5 · 8 = 40 och 2 · 8 = 16, alltså 56. Eller 7 · 4 dubblat." }],
  knowledge: [
    { id: "tableFact", skill: "w3-l2.facts", gen: (rng, { level }) => { const a = rng.int(level > 1 ? 6 : 2, 9), b = rng.int(level > 1 ? 6 : 2, 9); return numeric(`tf-${a}-${b}`, "w3-l2.facts", `${a} · ${b} = ?`, a * b, `${a} · ${b} = ${a * b}.`, ["Använd en strategi: dubbla, 5:an eller 10 minus 1."]); } },
    { id: "missingFactor", skill: "w3-l2.missing", gen: (rng) => { const a = rng.int(3, 9), b = rng.int(3, 9); return numeric(`mf-${a}-${b}`, "w3-l2.missing", `□ · ${a} = ${a * b}`, b, `${a * b} ÷ ${a} = ${b}.`, ["Hur många grupper om " + a + " ryms?"]); } },
    { id: "nineTrick", skill: "w3-l2.nine", gen: (rng) => { const n = rng.int(3, 9); return numeric(`nt-${n}`, "w3-l2.nine", `Använd 10 · ${n} − ${n} för att räkna 9 · ${n}.`, 9 * n, `10 · ${n} = ${10 * n}, minus ${n} = ${9 * n}.`, ["Räkna först 10 · " + n + "."]); } },
    { id: "strategyMc", skill: "w3-l2.strategy", gen: (rng) => { const n = rng.int(4, 9); return mc(`sm-${n}`, "w3-l2.strategy", `Du kan 5 · ${n} = ${5 * n}. Hur får du 6 · ${n} härifrån?`, `${5 * n} + ${n}`, [{ text: `${5 * n} + 5` }, { text: `${5 * n} · 6` }, { text: `${5 * n} − ${n}` }], `6 grupper är 5 grupper plus en grupp till: ${5 * n} + ${n} = ${6 * n}.`, ["En grupp mer."], rng); } },
    { id: "doubleDouble", skill: "w3-l2.double", gen: (rng) => { const n = rng.int(3, 9); return numeric(`dd-${n}`, "w3-l2.double", `Räkna 4 · ${n} genom att dubbla ${n}, och sedan dubbla igen.`, 4 * n, `${n} → ${2 * n} → ${4 * n}.`, ["Dubbla två gånger."]); } },
  ],
  method: [
    { id: "sixSteps", skill: "w3-l2.derive", gen: (rng) => { const n = rng.int(4, 9); return multifield(`ss-${n}`, "w3-l2.derive", `Härled 6 · ${n} i steg.`, [{ label: `5 · ${n} =`, accept: [5 * n] }, { label: "Plus en grupp (+ " + n + ") =", accept: [6 * n] }], `5 · ${n} = ${5 * n}; ${5 * n} + ${n} = ${6 * n}.`, []); } },
    { id: "nineSteps", skill: "w3-l2.derive", gen: (rng) => { const n = rng.int(4, 9); return multifield(`ns-${n}`, "w3-l2.derive", `Härled 9 · ${n} med 10 minus 1.`, [{ label: `10 · ${n} =`, accept: [10 * n] }, { label: `Minus ${n} =`, accept: [9 * n] }], `${10 * n} − ${n} = ${9 * n}.`, []); } },
    { id: "eightSteps", skill: "w3-l2.derive", gen: (rng) => { const n = rng.int(3, 9); return multifield(`es-${n}`, "w3-l2.derive", `Härled 8 · ${n} genom att dubbla tre gånger.`, [{ label: `2 · ${n} =`, accept: [2 * n] }, { label: "4 · " + n + " =", accept: [4 * n] }, { label: "8 · " + n + " =", accept: [8 * n] }], `${2 * n} → ${4 * n} → ${8 * n}.`, []); } },
  ],
  representation: [
    { id: "splitRect", skill: "w3-l2.area", gen: (rng) => { const n = rng.int(4, 9); return withVisual(multifield(`sr-${n}`, "w3-l2.area", `Rektangeln är 6 kolumner × ${n} rader. Dela den i 5 kolumner och 1 kolumn. Fyll i areorna.`, [{ label: `5 · ${n} =`, accept: [5 * n] }, { label: `1 · ${n} =`, accept: [n] }, { label: `6 · ${n} =`, accept: [6 * n] }], `${5 * n} + ${n} = ${6 * n}.`, []), { type: "area", a: 6, b: n }); } },
    { id: "skipTable", skill: "w3-l2.numberline", gen: (rng) => { const s = rng.int(3, 9), k = rng.int(3, 9); return numberlineEx(`st-${s}-${k}`, "w3-l2.numberline", `Markera ${k} · ${s} på tallinjen (varje streck är ${s}).`, k * s, { min: 0, max: s * 10, step: s, labelEvery: s * 5 }, `${k} hopp om ${s} = ${k * s}.`, []); } },
  ],
  teacher: {
    title: "Strategier i stället för att plugga",
    scenarios: ["Sofia (åk 4) säger att hon aldrig kan komma ihåg 7 · 8 och hoppar över den. Hennes lärare vill att alla ska 'kunna tabellerna utantill'."],
    prompt: "Visa Sofia hur hon kan bygga fram 7 · 8 från fakta hon redan kan, och förklara varför strategin fungerar. Förklara även varför det är bra att kunna flera vägar till samma svar.",
    minChars: 150,
    rubric: {
      minConcepts: 3,
      concepts: [
        { id: "delar", label: "att dela upp (5 · 8 + 2 · 8)", any: ["5 · 8", "5 gånger 8", "5·8", "2 · 8", "dela upp", "delar upp"] },
        { id: "svar", label: "rätt svar 56 (40 + 16)", any: ["56"] },
        { id: "alt", label: "ett alternativ (dubbla 7 · 4, 8 · 7, 10 − 2)", any: ["7 · 4", "dubbl", "8 · 7", "byta plats", "10 · 8"] },
        { id: "varfor", label: "varför: distributiva/lika stora grupper", any: ["lika många", "grupper", "distributiv", "varför", "eftersom"] },
      ],
    },
    modelAnswer: "Sofia, du kan 5 · 8 = 40 och 2 · 8 = 16 (dubbelt av 8). 7 grupper om 8 är 5 grupper plus 2 grupper, alltså 40 + 16 = 56. Det fungerar eftersom grupperna är lika stora, så vi kan dela upp antalet grupper hur vi vill. Du kan också dubbla: 7 · 4 = 28, och dubbelt är 56. Flera vägar gör att du kan kontrollera och att du aldrig behöver stå utan svar.",
  },
};

// ───────── Lektion 3: Areamodellen ─────────
export const lesson3: Lesson = {
  id: "w3-l3", worldId: "w3", title: "Areamodellen", grades: "åk 4–6",
  summary: "Multiplicera stora tal genom att dela upp i delprodukter.",
  lgr: "Metoder för beräkningar med naturliga tal; de fyra räknesätten och regler för deras användning",
  objectives: ["Rita och fylla i en areamodell för flersiffriga produkter.", "Förklara varför delprodukterna behövs (distributiva lagen).", "Koppla areamodellen till uppställning."],
  intro: "Areamodellen är den bästa bron mellan ”förstå” och ”räkna”. En rektangel med sidorna $23$ och $14$ har arean $23 \\cdot 14$. Delar vi sidorna efter platsvärde delas rektangeln i fyra enkla rutor, och summan av ruturnas areor är produkten.",
  theory: [
    { heading: "Dela efter platsvärde", body: "$23 = 20 + 3$ och $14 = 10 + 4$. Rektangeln delas i fyra rutor: $20 \\cdot 10$, $20 \\cdot 4$, $3 \\cdot 10$ och $3 \\cdot 4$. Varje del av det ena talet multipliceras med **varje** del av det andra.", visual: { type: "area", a: 8, b: 6 } },
    { heading: "Summan blir produkten", body: "$200 + 80 + 30 + 12 = 322$. Därför är $23 \\cdot 14 = 322$. Metoden bygger på **distributiva lagen**: $(20 + 3)(10 + 4) = 20 \\cdot 10 + 20 \\cdot 4 + 3 \\cdot 10 + 3 \\cdot 4$." },
    { heading: "Vanligt fel", body: "Många elever multiplicerar bara ”ytterdelarna”: $20 \\cdot 10 + 3 \\cdot 4 = 212$ och glömmer de två korsprodukterna. Areamodellen gör det synligt: det saknas två rutor." },
  ],
  worked: [
    { title: "Två tvåsiffriga tal", problem: "Beräkna 23 · 14 med areamodell.", steps: [{ text: "Dela upp båda talen.", math: "23 = 20 + 3,\\ 14 = 10 + 4" }, { text: "Fyra delprodukter.", math: "200,\\ 80,\\ 30,\\ 12" }, { text: "Summera.", math: "200 + 80 + 30 + 12 = 322" }], why: "Alla fyra rutor ingår i rektangeln. Arean är summan av delarna.", alternative: "Beräkna $23 \\cdot 10 = 230$ och $23 \\cdot 4 = 92$: $230 + 92 = 322$ (det är samma sak med två rutor större)." },
    { title: "Tvåsiffrigt gånger ensiffrigt", problem: "Beräkna 47 · 6.", steps: [{ text: "Dela upp 47.", math: "47 = 40 + 7" }, { text: "Två delprodukter.", math: "40 \\cdot 6 = 240,\\ 7 \\cdot 6 = 42" }, { text: "Summera.", math: "240 + 42 = 282" }], why: "6 grupper om 47 är 6 grupper om 40 plus 6 grupper om 7.", alternative: "Runda och kompensera: $50 \\cdot 6 - 3 \\cdot 6 = 300 - 18 = 282$." },
  ],
  drawing: { task: "Rita en areamodell för 23 · 14. Skriv delprodukterna i rutorna och summan under.", tool: "area" },
  pupils: [{ pupil: "Elin", said: "23 · 14: 20 · 10 = 200 och 3 · 4 = 12. Svaret blir 212.", misconception: "Multiplicerar bara tiotal med tiotal och ental med ental.", response: "Låt Elin rita rektangeln. Fråga: ”Vilka rutor har du inte räknat?” Hon ska se de två korsrutorna (20 · 4 och 3 · 10)." }],
  knowledge: [
    { id: "area2x1", skill: "w3-l3.product", gen: (rng) => { const a = rng.int(12, 89), b = rng.int(3, 9); return numeric(`a21-${a}-${b}`, "w3-l3.product", `${a} · ${b} = ?`, a * b, `${a} = ${placeParts(a).join(" + ")}. ${placeParts(a).map((p) => `${p} · ${b} = ${p * b}`).join(", ")}. Summa ${a * b}.`, ["Dela upp " + a + " i tiotal och ental."]); } },
    { id: "area2x2", skill: "w3-l3.product", gen: (rng, { level }) => { const a = rng.int(12, level > 1 ? 99 : 49), b = rng.int(12, level > 1 ? 49 : 29); return numeric(`a22-${a}-${b}`, "w3-l3.product", `${a} · ${b} = ?`, a * b, `Delprodukterna: ${placeParts(a).flatMap((p) => placeParts(b).map((q) => p * q)).join(" + ")} = ${a * b}.`, ["Rita en areamodell med fyra rutor."]); } },
    { id: "rectArea", skill: "w3-l3.area", gen: (rng) => { const a = rng.int(12, 48), b = rng.int(3, 9); return numeric(`ra-${a}-${b}`, "w3-l3.area", `En rektangel är ${a} cm lång och ${b} cm bred. Vilken area har den?`, a * b, `Area = längd · bredd = ${a} · ${b} = ${a * b}.`, ["Längd gånger bredd."], "cm²"); } },
    { id: "whichCells", skill: "w3-l3.cells", gen: (rng) => { const a = rng.int(2, 8) * 10 + rng.int(2, 9), b = rng.int(1, 5) * 10 + rng.int(2, 9); const right = placeParts(a).flatMap((p) => placeParts(b).map((q) => p * q)); const txt = (x: number[]) => x.map(sv).join(" + "); return mc(`wc-${a}-${b}`, "w3-l3.cells", `Vilka delprodukter ger ${a} · ${b} i en areamodell?`, txt(right), [{ text: txt([placeParts(a)[0] * placeParts(b)[0], placeParts(a)[1] * placeParts(b)[1]]), note: "Du har bara tagit med två av fyra rutor – korsprodukterna saknas." }, { text: txt(right.map((x) => x * 10)) }, { text: txt([placeParts(a)[0] + placeParts(b)[0], placeParts(a)[1] + placeParts(b)[1]]) }], `Varje del av ${a} multipliceras med varje del av ${b}: fyra rutor.`, ["Hur många rutor har rektangeln?"], rng); } },
  ],
  method: [
    { id: "areaModel2x2", skill: "w3-l3.model", gen: (rng) => { const a = rng.int(12, 49), b = rng.int(12, 39); return areaEx(`am-${a}-${b}`, "w3-l3.model", a, b, `${a} · ${b} = ${a * b}.`, ["Varje del av ena talet gånger varje del av det andra."]); } },
    { id: "areaModel2x1", skill: "w3-l3.model", gen: (rng) => { const a = rng.int(23, 89), b = rng.int(3, 9); return areaEx(`am1-${a}-${b}`, "w3-l3.model", a, b, `${a} · ${b} = ${a * b}.`, ["Dela upp " + a + " i tiotal och ental."]); } },
  ],
  representation: [
    { id: "areaModel3x1", skill: "w3-l3.model", gen: (rng) => { const a = rng.int(1, 8) * 100 + rng.int(2, 9) * 10 + rng.int(2, 9), b = rng.int(3, 8); return areaEx(`am3-${a}-${b}`, "w3-l3.model", a, b, `${a} · ${b} = ${a * b}.`, ["Tre delar: hundratal, tiotal, ental."]); } },
    { id: "cellValues", skill: "w3-l3.cells", gen: (rng) => { const a = rng.int(2, 8) * 10 + rng.int(2, 9), b = rng.int(2, 7) * 10 + rng.int(2, 9); const [at, ae] = placeParts(a), [bt, be] = placeParts(b); return multifield(`cv-${a}-${b}`, "w3-l3.cells", `En rektangel ${a} × ${b} delas efter platsvärde. Hur stor är arean av var och en av de fyra delarna?`, [{ label: `${at} · ${bt}`, accept: [at * bt] }, { label: `${at} · ${be}`, accept: [at * be] }, { label: `${ae} · ${bt}`, accept: [ae * bt] }, { label: `${ae} · ${be}`, accept: [ae * be] }], `Delarna: ${at * bt}, ${at * be}, ${ae * bt}, ${ae * be}. Summa ${a * b}.`, []); } },
  ],
  teacher: {
    title: "De två saknade rutorna",
    scenarios: ["Elin (åk 5) räknar 23 · 14 som 20 · 10 + 3 · 4 = 212. Hon har ritat en rektangel men bara fyllt i två av rutorna."],
    prompt: "Förklara för Elin med hjälp av en areamodell varför hennes svar blir fel och hur hon får rätt svar. Använd termerna delprodukter och rutor.",
    minChars: 160,
    rubric: {
      minConcepts: 3,
      concepts: [
        { id: "fyra", label: "att det ska vara fyra rutor/delprodukter", any: ["fyra", "4 rutor", "alla rutor", "saknar två", "två rutor"] },
        { id: "kors", label: "korsprodukterna (20 · 4 = 80 och 3 · 10 = 30)", any: ["20 · 4", "20·4", "80", "30", "3 · 10", "3·10", "korsprodukt"] },
        { id: "summa", label: "rätt svar 322 (200 + 80 + 30 + 12)", any: ["322"] },
        { id: "varfor", label: "att varje del multipliceras med varje del / rektangelns area", any: ["varje del", "alla delar", "area", "hela rektangeln", "distributiv"] },
      ],
    },
    modelAnswer: "Elin, i din rektangel delas 23 i 20 + 3 och 14 i 10 + 4, så det blir fyra rutor, inte två. Du har räknat 20 · 10 = 200 och 3 · 4 = 12, men du saknar de två rutorna 20 · 4 = 80 och 3 · 10 = 30. Alla fyra rutor är en del av rektangelns area. Summan 200 + 80 + 30 + 12 = 322. Varje del av det ena talet måste multipliceras med varje del av det andra.",
  },
};
