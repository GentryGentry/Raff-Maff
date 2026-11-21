import type { Lesson } from "../types";
import { mc, numeric, multifield, withVisual } from "@/lib/engine/gen-helpers";
import type { Rng } from "@/lib/engine/rng";
import type { Visual } from "@/lib/engine/types";
import { meanData, meanOf, medianOf } from "./stats";

const nums = (a: number[]) => a.join(", ");
const withHalf = (x: number) => (Number.isInteger(x) ? [String(x)] : [String(x), String(x).replace(".", ",")]);
const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));

// ───────── Lektion 6: Kombinatorik ─────────
const SHIRTS = ["Röd", "Blå", "Grön", "Gul", "Svart"], PANTS = ["Jeans", "Shorts", "Kjol", "Byxa", "Mjukis"];
const combo = (a: number, b: number): Visual => ({ type: "combotable", rows: SHIRTS.slice(0, a), cols: PANTS.slice(0, b) });

export const lesson6: Lesson = {
  id: "w12-l6", worldId: "w12", title: "Kombinatorik – att räkna alla möjligheter", grades: "åk 4–6",
  summary: "Multiplikationsprincipen: val i steg multipliceras. Tabell, träd och systematisk lista.",
  lgr: "Enkel kombinatorik; systematiskt räknande av möjligheter",
  objectives: ["Räkna kombinationer med multiplikationsprincipen.", "Skilja på när ordningen spelar roll och när den inte gör det.", "Hitta alla möjligheter systematiskt med tabell eller lista."],
  intro: "**Kombinatorik** är konsten att räkna alla möjligheter utan att skriva ut dem en och en. Idén är enkel men kraftfull: *om du gör flera val efter varandra multipliceras antalet möjligheter*. Och ibland frågar man om **ordningen spelar roll** – det ändrar svaret.",
  theory: [
    { heading: "Tabell: varje med varje", body: "Du har 3 tröjor och 4 byxor. Varje tröja kan kombineras med varje byxa: $3 \\cdot 4 = 12$ outfits. Tabellen visar alla.", visual: combo(3, 4) },
    { heading: "Val i flera steg", body: "En meny har 3 förrätter, 4 varmrätter och 2 efterrätter. Antal menyer: $3 \\cdot 4 \\cdot 2 = 24$. Varje nytt val multiplicerar." },
    { heading: "Ordning och upprepning", body: "En kod med 3 siffror ur 1–5 där siffrorna **får upprepas**: $5 \\cdot 5 \\cdot 5 = 125$. **Får inte** upprepas: $5 \\cdot 4 \\cdot 3 = 60$, eftersom ett val försvinner varje gång. $n$ personer i en kö: $n \\cdot (n-1) \\cdots 1$, till exempel $4 \\cdot 3 \\cdot 2 \\cdot 1 = 24$." },
    { heading: "När ordningen inte spelar roll", body: "Handskakning mellan 4 personer: var och en skakar hand med 3 andra, men varje handslag har räknats **två gånger** (A–B och B–A). Därför $4 \\cdot 3 \\div 2 = 6$ handslag." },
  ],
  worked: [
    { title: "Outfits", problem: "Du har 4 tröjor och 3 byxor. Hur många outfits?", steps: [{ text: "Fyra val för tröja, tre för byxor.", math: "4 \\cdot 3 = 12" }], why: "Varje tröja kombineras med var och en av byxorna.", alternative: "Rita en tabell med 4 rader och 3 kolumner: 12 rutor." },
    { title: "Handslag", problem: "5 personer skakar hand med varandra, en gång var. Hur många handslag?", steps: [{ text: "Varje person skakar 4 händer:", math: "5 \\cdot 4 = 20" }, { text: "Varje handslag är räknat två gånger:", math: "20 \\div 2 = 10" }], why: "Handslaget A–B är samma som B–A.", alternative: "Lista alla par: AB, AC, AD, AE, BC, BD, BE, CD, CE, DE = 10." },
  ],
  drawing: { task: "Rita ett träddiagram för att slå ett mynt två gånger. Skriv ut alla fyra utfall. Hur många om du slår tre gånger?", tool: "grid" },
  pupils: [{ pupil: "Sami", said: "Jag har 3 tröjor och 4 byxor, så jag kan göra 3 + 4 = 7 outfits.", misconception: "Adderar antalet val i stället för att multiplicera dem.", response: "Låt Sami skriva upp: tröja 1 med varje byxa (4 st), tröja 2 med varje byxa (4 st), tröja 3 (4 st). Då är det 3 grupper om 4 = 12." }],
  knowledge: [
    { id: "outfits", skill: "w12-l6.product", gen: (rng) => { const a = rng.int(2, 6), b = rng.int(2, 6); return numeric(`of-${a}-${b}`, "w12-l6.product", `Du har ${a} tröjor och ${b} byxor. Hur många olika outfits kan du göra (en tröja och ett par byxor)?`, a * b, `${a} · ${b} = ${a * b}.`, ["Varje tröja med varje byxa."]); } },
    { id: "menu", skill: "w12-l6.product", gen: (rng) => { const a = rng.int(2, 4), b = rng.int(2, 5), c = rng.int(2, 3); return numeric(`mn-${a}-${b}-${c}`, "w12-l6.product", `En meny har ${a} förrätter, ${b} varmrätter och ${c} efterrätter. Hur många olika menyer kan du sätta ihop med en av varje?`, a * b * c, `${a} · ${b} · ${c} = ${a * b * c}.`, ["Multiplicera antalet val i varje steg."]); } },
    { id: "lineup", skill: "w12-l6.order", gen: (rng) => { const n = rng.int(3, 6); return numeric(`lu-${n}`, "w12-l6.order", `På hur många olika sätt kan ${n} personer stå i en kö?`, fact(n), `${Array.from({ length: n }, (_, i) => n - i).join(" · ")} = ${fact(n)}.`, ["Först n val, sedan ett färre, …"]); } },
    { id: "codes", skill: "w12-l6.order", gen: (rng) => { const d = rng.int(4, 6), L = rng.int(2, 3), rep = rng.chance(0.5); const ans = rep ? d ** L : Array.from({ length: L }, (_, i) => d - i).reduce((x, y) => x * y, 1);
      return numeric(`cd-${d}-${L}-${rep}`, "w12-l6.order", `En kod består av ${L} siffror, valda ur siffrorna 1–${d}. Siffrorna ${rep ? "får" : "får inte"} upprepas. Hur många olika koder finns det?`, ans, rep ? `${d} val varje gång: ${Array(L).fill(d).join(" · ")} = ${ans}.` : `${Array.from({ length: L }, (_, i) => d - i).join(" · ")} = ${ans} (ett val färre varje gång).`, ["Hur många val har du i varje steg?"]); } },
    { id: "handshakes", skill: "w12-l6.pairs", gen: (rng) => { const n = rng.int(3, 8); return numeric(`hs-${n}`, "w12-l6.pairs", `${n} personer hälsar på varandra, och alla skakar hand med alla en gång. Hur många handslag blir det?`, (n * (n - 1)) / 2, `${n} · ${n - 1} = ${n * (n - 1)}, delat på 2 eftersom varje handslag räknats två gånger: ${(n * (n - 1)) / 2}.`, ["Varje handslag räknas två gånger."]); } },
    { id: "pairsPick", skill: "w12-l6.pairs", gen: (rng) => { const n = rng.int(4, 7); return numeric(`pk-${n}`, "w12-l6.pairs", `Du ska välja 2 olika glassmaker av ${n}. Ordningen spelar ingen roll. Hur många olika val finns det?`, (n * (n - 1)) / 2, `${n} · ${n - 1} ÷ 2 = ${(n * (n - 1)) / 2}.`, ["Ordningen spelar ingen roll: dela med 2."]); } },
    { id: "medals", skill: "w12-l6.order", gen: (rng) => { const n = rng.int(4, 8); return numeric(`md-${n}`, "w12-l6.order", `${n} lag tävlar. Hur många olika sätt kan guld och silver delas ut?`, n * (n - 1), `Guld: ${n} val. Silver: ${n - 1} val. ${n} · ${n - 1} = ${n * (n - 1)}.`, ["Här spelar ordningen roll."]); } },
    { id: "addVsMul", skill: "w12-l6.concept", gen: (rng) => { const a = rng.int(2, 5), b = rng.int(2, 5); return mc(`am-${a}-${b}`, "w12-l6.concept", `Du har ${a} sorters bröd och ${b} sorters pålägg och väljer ett av varje. Vilken uträkning ger antalet olika mackor?`, `${a} · ${b}`, [{ text: `${a} + ${b}`, note: "Addition räknar sorterna, inte kombinationerna." }, { text: `${a} · ${a}` }, { text: `${a + b} · 2` }].filter((o) => o.text !== `${a} · ${b}`), `Varje brödsort kan kombineras med varje pålägg: ${a} · ${b} = ${a * b}.`, ["Varje bröd med varje pålägg."], rng); } },
  ],
  method: [
    { id: "outfitSteps", skill: "w12-l6.product", gen: (rng) => { const a = rng.int(2, 6), b = rng.int(2, 6); return multifield(`os-${a}-${b}`, "w12-l6.product", `Du har ${a} tröjor och ${b} byxor. Räkna i steg.`, [{ label: "Val av tröja", accept: [a] }, { label: "Val av byxor", accept: [b] }, { label: "Antal outfits", accept: [a * b] }], `${a} · ${b} = ${a * b}.`, ["Multiplicera."]); } },
    { id: "handshakeSteps", skill: "w12-l6.pairs", gen: (rng) => { const n = rng.int(4, 8); return multifield(`hss-${n}`, "w12-l6.pairs", `${n} personer skakar hand med varandra, en gång per par. Räkna i steg.`, [{ label: "Handslag per person", accept: [n - 1] }, { label: "Alla handslag räknade dubbelt", accept: [n * (n - 1)] }, { label: "Antal olika handslag", accept: [(n * (n - 1)) / 2] }], `${n - 1}; ${n * (n - 1)}; ${(n * (n - 1)) / 2}.`, ["Dubbelräkning: dela med 2."]); } },
  ],
  representation: [
    { id: "tableCount", skill: "w12-l6.table", gen: (rng) => { const a = rng.int(2, 5), b = rng.int(2, 5); return withVisual(numeric(`tc-${a}-${b}`, "w12-l6.table", "Tabellen visar alla kombinationer av tröjor (rader) och byxor (kolumner). Hur många outfits finns det?", a * b, `${a} rader · ${b} kolumner = ${a * b} rutor.`, ["Räkna rader och kolumner."]), combo(a, b)); } },
    { id: "tableExpr", skill: "w12-l6.table", gen: (rng) => { const a = rng.int(2, 5), b = rng.int(2, 5); if (a === b) return numeric("te-fb", "w12-l6.table", "Tabellen har 3 rader och 3 kolumner. Hur många rutor?", 9, "3 · 3 = 9.", []); return withVisual(mc(`te-${a}-${b}`, "w12-l6.table", "Vilken uträkning ger antalet rutor i tabellen?", `${a} · ${b}`, [{ text: `${a} + ${b}` }, { text: `${a} · ${a}` }, { text: `${b} · ${b}` }], `${a} rader med ${b} rutor: ${a} · ${b}.`, ["Rader gånger kolumner."], rng), combo(a, b)); } },
  ],
  teacher: {
    title: "3 + 4 eller 3 · 4?",
    scenarios: ["Sami (åk 5) har 3 tröjor och 4 byxor och säger att han kan göra 3 + 4 = 7 outfits."],
    prompt: "Förklara för Sami varför det inte blir 7, hur många outfits det verkligen blir, och ge ett sätt att visa alla möjligheter systematiskt (till exempel en tabell eller ett träd).",
    minChars: 170,
    rubric: { minConcepts: 4, concepts: [
      { id: "varje", label: "varje tröja kan kombineras med varje byxa", any: ["varje tröja", "varje byxa", "var och en", "med varje", "alla byxor"] },
      { id: "mult", label: "multiplicera", any: ["multiplicera", "gånger", "3 · 4", "3·4", "3 x 4", "3 × 4"] },
      { id: "svar", label: "rätt svar 12", any: ["12"] },
      { id: "tabell", label: "tabell/träd/lista", any: ["tabell", "träd", "lista", "rita", "systematisk"] },
      { id: "add", label: "addition räknar bara sorterna", any: ["7", "addera", "lägger ihop", "bara antalet"] },
    ] },
    modelAnswer: "Sami, när du kombinerar kan varje tröja bäras med varje byxa, så du ska multiplicera i stället för att addera. Med tröja 1 finns det 4 val av byxor, och likadant för tröja 2 och 3: 3 · 4 = 12 outfits. Att lägga ihop 3 + 4 = 7 räknar bara hur många saker du har. För att visa alla möjligheter kan du rita en tabell med tröjorna som rader och byxorna som kolumner, 12 rutor, eller ett träddiagram.",
  },
};

// ───────── Lektion 7: Tolka och jämföra data ─────────
const TIMES = ["06", "09", "12", "15", "18"];
export const lesson7: Lesson = {
  id: "w12-l7", worldId: "w12", title: "Tolka, jämföra och granska data", grades: "åk 4–6",
  summary: "Jämföra grupper, upptäcka vilseledande diagram och dra rimliga slutsatser.",
  lgr: "Tolkning och jämförelse av data; kritisk granskning av statistik",
  objectives: ["Jämföra två grupper med lägesmått.", "Upptäcka vilseledande diagram (avkapad axel).", "Skilja mellan samband och orsak och bedöma urval."],
  intro: "Statistik kan upplysa – men den kan också *vilseleda*. Samma data ser helt olika ut beroende på hur diagrammet ritas, vem man frågat och vilket mått man väljer. I den här lektionen blir du en **kritisk läsare**: du läser av riktigt, jämför rättvist och ställer frågan *”kan man verkligen dra den slutsatsen?”*",
  theory: [
    { heading: "Jämför grupper", body: "Grupp A: 4, 6, 8, 10, 12 (medelvärde 8). Grupp B: 5, 7, 8, 9, 11 (medelvärde 8). Samma medelvärde, men A är mer **spridd**. Titta på flera mått: medelvärde, median, variationsbredd." },
    { heading: "Vilseledande axel", body: "Axeln här börjar inte på 0 utan på 50. Stapeln A (70) ser tre gånger så hög ut som B (60), men A är bara lite högre. **Kontrollera alltid var axeln börjar** och läs av de verkliga värdena.", visual: { type: "barchart", cats: ["A", "B"], vals: [70, 60], min: 50, max: 80, step: 10 } },
    { heading: "Samband är inte orsak", body: "Glassförsäljningen och antalet solbrända ökar samtidigt på sommaren. Glass orsakar inte solbränna – **solen** ligger bakom båda. Att två saker förändras tillsammans betyder inte att den ena orsakar den andra." },
    { heading: "Urval", body: "Vill du veta vad *alla* elever tycker men frågar bara fotbollslaget, får du ett **skevt urval**. Ett bra urval ska likna hela gruppen (vara representativt)." },
  ],
  worked: [
    { title: "Jämför två klasser", problem: "Klass A: 6, 8, 10, 12. Klass B: 7, 9, 9, 11. Vilken klass har högst medelvärde?", steps: [{ text: "A: 36 ÷ 4 = 9." }, { text: "B: 36 ÷ 4 = 9." }, { text: "Lika! Jämför då median: A 9, B 9. Lika även där, men A har större variationsbredd (6 mot 4)." }], why: "Ett enda mått räcker inte alltid för att skilja grupper åt.", alternative: "Rita båda som stapeldiagram." },
    { title: "Avkapad axel", problem: "Axeln börjar på 40. Stapel A är 60, stapel B är 50. Hur många gånger större är A egentligen?", steps: [{ text: "Läs av värdena: 60 och 50." }, { text: "60 ÷ 50 = 1,2 – bara 20 % större, inte dubbelt." }], why: "Axeln börjar inte på 0, så längderna på staplarna överdriver skillnaden.", alternative: "Rita om diagrammet med axeln från 0." },
  ],
  drawing: { task: "Rita samma två staplar (60 och 50) två gånger: först med axeln från 0, sedan från 40. Vad händer med intrycket?", tool: "grid" },
  pupils: [{ pupil: "Elias", said: "Stapel A är dubbelt så hög som B, så A är dubbelt så stor.", misconception: "Tolkar stapelhöjden utan att kontrollera att axeln börjar på 0.", response: "Låt Elias läsa av axeln: den börjar på 40. Läs av värdena (60 och 50) och räkna: A är inte dubbelt, bara lite större." }],
  knowledge: [
    { id: "meanCompare", skill: "w12-l7.groups", gen: (rng) => { for (;;) { const a = Array.from({ length: 5 }, () => rng.int(2, 20)), b = Array.from({ length: 5 }, () => rng.int(2, 20)); const ma = meanOf(a), mb = meanOf(b); if (ma === mb) continue; return mc(`mc-${a.join("")}-${b.join("")}`, "w12-l7.groups", `Grupp A: ${nums(a)}. Grupp B: ${nums(b)}. Vilken grupp har högst medelvärde?`, ma > mb ? "Grupp A" : "Grupp B", [{ text: ma > mb ? "Grupp B" : "Grupp A" }, { text: "De har lika högt medelvärde" }], `Medelvärde A = ${meanOf(a)}, B = ${meanOf(b)}.`, ["Räkna medelvärdet för båda."], rng); } } },
    { id: "medianDiff", skill: "w12-l7.groups", gen: (rng) => { const a = Array.from({ length: 5 }, () => rng.int(2, 30)), b = Array.from({ length: 5 }, () => rng.int(2, 30)); const d = Math.abs(medianOf(a) - medianOf(b)); return numeric(`md-${a.join("")}-${b.join("")}`, "w12-l7.groups", `Grupp A: ${nums(a)}. Grupp B: ${nums(b)}. Hur stor är skillnaden mellan gruppernas medianer?`, withHalf(d), `Median A ${medianOf(a)}, median B ${medianOf(b)}: skillnad ${d}.`, ["Sortera varje grupp."]); } },
    { id: "truncRead", skill: "w12-l7.axis", gen: (rng) => { const m = rng.pick([40, 50, 60, 80]), k = rng.pick([5, 10]); return withVisual(numeric(`tr-${m}-${k}`, "w12-l7.axis", "Diagrammets lodräta axel börjar inte på 0. Hur många enheter högre är stapel A än stapel B?", k, `A är ${m + 2 * k} och B är ${m + k}: skillnaden är ${k}.`, ["Läs av båda staplarna på axeln."]), { type: "barchart", cats: ["A", "B"], vals: [m + 2 * k, m + k], min: m, max: m + 3 * k, step: k }); } },
    { id: "truncMc", skill: "w12-l7.axis", gen: (rng) => { const m = rng.pick([40, 50, 60, 80]), k = rng.pick([5, 10]), A = m + 2 * k, B = m + k;
      return withVisual(mc(`tm-${m}-${k}`, "w12-l7.axis", "Stapel A ser ut att vara dubbelt så hög som B. Vad är sant?", `A (${A}) är inte dubbelt så stor som B (${B}) – axeln börjar inte på 0`, [{ text: "A är dubbelt så stor som B", note: "Läs av värdena – axeln börjar inte på 0." }, { text: "B är större än A" }, { text: `A är tre gånger så stor som B` }], `Värdena är ${A} och ${B}. ${A} ÷ ${B} är mindre än 2 – diagrammet är vilseledande.`, ["Var börjar axeln?"], rng), { type: "barchart", cats: ["A", "B"], vals: [A, B], min: m, max: m + 3 * k, step: k }); } },
    { id: "lineRise", skill: "w12-l7.line", gen: (rng) => { for (;;) { const ys = TIMES.map(() => rng.int(1, 9) * 2), rises = [1, 2, 3, 4].map((i) => ys[i] - ys[i - 1]), mx = Math.max(...rises); if (mx <= 0 || rises.filter((r) => r === mx).length !== 1) continue; const labels = [1, 2, 3, 4].map((i) => `${TIMES[i - 1]}–${TIMES[i]}`), best = rises.indexOf(mx);
      return withVisual(mc(`lm-${ys.join("-")}`, "w12-l7.line", "Linjediagrammet visar temperaturen. Under vilken period steg den mest?", labels[best], labels.filter((_, i) => i !== best).map((text) => ({ text })), `Förändringarna är ${rises.join(", ")}. Störst ökning ${mx} under ${labels[best]}.`, ["Räkna skillnaden mellan varje par av punkter."], rng), { type: "linechart", xs: TIMES, ys, max: 20, step: 2 }); } } },
    { id: "causation", skill: "w12-l7.reason", gen: (rng) => { const C: [string, string, string][] = [["Glassförsäljningen och antalet solbrända ökar samtidigt under sommaren. Vad kan man säga?", "Båda beror troligen på att det är soligt – glass orsakar inte solbränna", "Det visar att glass orsakar solbränna"], ["Städer med många storkar har också många födslar. Vad kan man säga?", "Det är ett samband, men storkar orsakar inte födslar", "Storkar bär dit bebisarna"], ["Elever som sover mycket får bra betyg i en undersökning. Vad kan man säga?", "Det finns ett samband, men man kan inte avgöra orsaken utan mer undersökning", "Sömn är den enda orsaken till bra betyg"]]; const [q, ok, bad] = rng.pick(C);
      return mc(`cs-${q.slice(0, 12)}`, "w12-l7.reason", q, ok, [{ text: bad, note: "Samband är inte samma sak som orsak." }, { text: "Ingenting – statistik kan aldrig säga något" }], "Att två saker förändras tillsammans betyder inte att den ena orsakar den andra.", ["Finns det en tredje faktor?"], rng); } },
    { id: "sampling", skill: "w12-l7.sample", gen: (rng) => { const C: [string, string][] = [["Du vill veta vilken sport alla elever i skolan gillar bäst, men frågar bara fotbollslaget.", "Urvalet är skevt – fotbollsspelare är inte representativa"], ["Du vill veta vad stadens invånare tycker om cykelbanor och frågar bara cyklister vid en cykelbana.", "Urvalet är skevt – de som cyklar har troligen andra åsikter än alla"], ["Du vill veta hur lång en 10-åring är och mäter bara de som är med i ett basketlag.", "Urvalet är skevt – basketspelare är längre än genomsnittet"]]; const [q, ok] = rng.pick(C);
      return mc(`sm-${q.slice(0, 14)}`, "w12-l7.sample", `${q} Vad är problemet?`, ok, [{ text: "Det är för få frågor ställda i varje fråga" }, { text: "Det finns inget problem – alla svar är rätt" }, { text: "Man borde bara räkna medelvärdet" }], "Ett bra urval ska likna hela gruppen.", ["Vem frågar du?"], rng); } },
  ],
  method: [
    { id: "compareSteps", skill: "w12-l7.groups", gen: (rng) => { for (;;) { const a = meanData(rng, 5, 2, 20), b = meanData(rng, 5, 2, 20); if (meanOf(a) !== meanOf(b)) return multifield(`cs-${a.join("")}-${b.join("")}`, "w12-l7.groups", `Grupp A: ${nums(a)}. Grupp B: ${nums(b)}. Räkna medelvärdena i steg.`, [{ label: "Medelvärde grupp A", accept: [meanOf(a)] }, { label: "Medelvärde grupp B", accept: [meanOf(b)] }, { label: "Skillnad", accept: [Math.abs(meanOf(a) - meanOf(b))] }], `A: ${meanOf(a)}, B: ${meanOf(b)}, skillnad ${Math.abs(meanOf(a) - meanOf(b))}.`, ["Summa ÷ antal för varje grupp."]); } } },
  ],
  representation: [
    { id: "shareBar", skill: "w12-l7.share", gen: (rng) => { const T = rng.pick([20, 50]), cats = rng.pick([["Fotboll", "Dans", "Schack"], ["Katt", "Hund", "Fisk"]]), u = 5; let parts: number[]; do { const a = rng.int(1, T / u - 2), b = rng.int(1, T / u - a - 1); parts = [a, b, T / u - a - b].map((x) => x * u); } while (parts.some((x) => x < u)); const i = rng.int(0, 2);
      return withVisual(numeric(`sb-${T}-${parts.join("-")}-${i}`, "w12-l7.share", `Diagrammet visar svaren från ${T} personer. Hur många procent valde ${cats[i].toLowerCase()}?`, String((parts[i] * 100) / T), `${parts[i]} av ${T}: ${(parts[i] * 100) / T} %.`, ["Läs av stapeln, dela med alla personer."], "%"), { type: "barchart", cats, vals: parts, max: T === 20 ? 15 : 40, step: 5 }); } },
    { id: "axisRead", skill: "w12-l7.axis", gen: (rng) => { const m = rng.pick([50, 60, 80]), k = rng.pick([5, 10]), A = m + 3 * k, B = m + k; return withVisual(numeric(`ar-${m}-${k}`, "w12-l7.axis", "Axeln börjar inte på 0. Vad är stapel A:s verkliga värde?", A, `Läs av skalan: A når ${A}.`, ["Titta på siffrorna på axeln, inte på stapelns längd."]), { type: "barchart", cats: ["A", "B"], vals: [A, B], min: m, max: m + 4 * k, step: k }); } },
  ],
  teacher: {
    title: "Avkapad axel",
    scenarios: ["Elias (åk 6) tittar på ett stapeldiagram där axeln börjar på 40. Stapel A är 60 och B är 50, men A ser dubbelt så hög ut. Elias säger: ”A är dubbelt så stor som B.”"],
    prompt: "Förklara för Elias varför diagrammet vilseleder, hur han läser av de verkliga värdena, och hur mycket större A faktiskt är än B. Hur borde diagrammet ritas för att inte lura läsaren?",
    minChars: 180,
    rubric: { minConcepts: 4, concepts: [
      { id: "axel", label: "att axeln inte börjar på 0", any: ["börjar inte på 0", "börjar på 40", "inte från 0", "avkapad", "axeln börjar", "avklippt"] },
      { id: "värden", label: "läs av värdena 60 och 50", any: ["60 och 50", "60 och 50", "värdena", "läs av"] },
      { id: "svar", label: "A är bara lite större (10 mer / 20 %)", any: ["10 mer", "10 högre", "20 %", "20 procent", "1,2", "lite större", "bara 10"] },
      { id: "rita", label: "rita axeln från 0", any: ["från 0", "börja på 0", "noll", "börja på noll"] },
      { id: "lura", label: "att diagrammet kan vilseleda/lura", any: ["lura", "vilsel", "överdriv", "missledande", "få det att se"] },
    ] },
    modelAnswer: "Elias, diagrammet vilseleder för axeln börjar inte på 0 utan på 40, så staplarna är avkortade. Det får A att se mycket högre ut. Läs i stället av värdena: A är 60 och B är 50. A är alltså bara 10 mer, ungefär 20 % större, inte dubbelt så stor. För att inte lura läsaren ska diagrammet ritas med axeln från 0, då blir höjderna rättvisa.",
  },
};
