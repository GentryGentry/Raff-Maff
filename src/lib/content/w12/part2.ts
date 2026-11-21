import type { Lesson } from "../types";
import { mc, numeric, multifield, withVisual, numberlineEx, barsEx, fracAcc, gcd, tf } from "@/lib/engine/gen-helpers";
import type { Rng } from "@/lib/engine/rng";
import type { Visual } from "@/lib/engine/types";
import { COLOR_NAMES, PLUR, fmt, meanOf, medianOf, modeOf, rangeOf, sum } from "./stats";

const nums = (a: number[]) => a.join(", ");
const withHalf = (x: number) => (Number.isInteger(x) ? [String(x)] : [String(x), fmt(x)]);

/** A list with a single most frequent value. */
function modeList(rng: Rng, n = rng.int(8, 11)) {
  for (;;) { const a = Array.from({ length: n }, () => rng.int(1, 9)); if (modeOf(a) !== null && a.filter((x) => x === modeOf(a)).length >= 3) return a; }
}

// ───────── Lektion 3: Median, typvärde och variationsbredd ─────────
export const lesson3: Lesson = {
  id: "w12-l3", worldId: "w12", title: "Median, typvärde och variationsbredd", grades: "åk 4–6",
  summary: "Median = mittersta värdet när listan är sorterad. Typvärde = vanligast. Variationsbredd = största − minsta.",
  lgr: "Lägesmått: median och typvärde; variationsbredd",
  objectives: ["Sortera data och hitta medianen (även för jämnt antal värden).", "Hitta typvärdet.", "Välja det lägesmått som passar bäst."],
  intro: "Medelvärdet är inte det enda sättet att beskriva data. **Medianen** är det mittersta värdet och påverkas inte av enstaka extrema tal. **Typvärdet** är det värde som förekommer oftast. **Variationsbredden** visar hur spridda värdena är. Rätt mått beror på vad du vill veta.",
  theory: [
    { heading: "Median: sortera först!", body: "Listan 7, 2, 9, 4, 5 ska **sorteras**: 2, 4, 5, 7, 9. Det mittersta är 5, så medianen är 5. Glöm aldrig att sortera – det mittersta talet i den osorterade listan (9) är inte medianen." },
    { heading: "Jämnt antal värden", body: "2, 4, 6, 10 har två mittental: 4 och 6. Medianen är **medelvärdet av de två**: $(4 + 6) \\div 2 = 5$." },
    { heading: "Typvärde och variationsbredd", body: "I 3, 5, 5, 7, 5, 9 förekommer 5 oftast, så typvärdet är 5. Variationsbredden är $9 - 3 = 6$. Typvärdet fungerar även för kategorier (”vanligaste färgen”).", visual: { type: "barchart", cats: ["36", "37", "38", "39", "40"], vals: [2, 5, 8, 4, 1], max: 8, step: 2 } },
    { heading: "Vilket mått passar?", body: "Löner i en grupp där en person tjänar miljarder: **medelvärdet** blir missvisande högt, **medianen** visar vad en typisk person tjänar. Den vanligaste skostorleken i en affär? **Typvärdet**. En total som ska fördelas lika? **Medelvärdet**." },
  ],
  worked: [
    { title: "Median", problem: "Hitta medianen av 12, 5, 9, 3, 7.", steps: [{ text: "Sortera: 3, 5, 7, 9, 12." }, { text: "Fem tal – det mittersta är det tredje: 7." }], why: "Medianen delar de sorterade värdena i två lika stora halvor.", alternative: "Stryk ett tal i varje ände tills ett är kvar." },
    { title: "Jämnt antal", problem: "Median av 8, 2, 6, 10, 4, 12.", steps: [{ text: "Sortera: 2, 4, 6, 8, 10, 12." }, { text: "Mittentalen: 6 och 8." }, { text: "Medelvärde av dem:", math: "(6 + 8) \\div 2 = 7" }], why: "Det finns inget enskilt mittersta värde, så vi tar mitt emellan de två.", alternative: "Stryk par i ändarna tills två är kvar." },
  ],
  drawing: { task: "Skriv ned antalet syskon för tio personer, sortera dem och markera medianen med en ring. Vad är typvärdet?", tool: "numberline" },
  pupils: [{ pupil: "Noor", said: "Talen är 7, 2, 9, 4, 5. Medianen är 9 för det står i mitten.", misconception: "Glömmer att sortera – tar det mittersta i listan som den står.", response: "Be Noor sortera: 2, 4, 5, 7, 9. Nu är mittersta 5. Visa att medianen alltid hör till den sorterade raden." }],
  knowledge: [
    { id: "medianOdd", skill: "w12-l3.median", gen: (rng) => { const a = Array.from({ length: rng.pick([5, 7]) }, () => rng.int(1, 30)); return numeric(`mo-${a.join("-")}`, "w12-l3.median", `Vilken är medianen av ${nums(a)}?`, medianOf(a), `Sorterat: ${nums([...a].sort((x, y) => x - y))}. Mittersta: ${medianOf(a)}.`, ["Sortera först."]); } },
    { id: "medianEven", skill: "w12-l3.median", gen: (rng) => { const a = Array.from({ length: rng.pick([4, 6]) }, () => rng.int(1, 30)); const m = medianOf(a); return numeric(`me-${a.join("-")}`, "w12-l3.median", `Vilken är medianen av ${nums(a)}?`, withHalf(m), `Sorterat: ${nums([...a].sort((x, y) => x - y))}. Mittentalen medelvärdesbildas: ${fmt(m)}.`, ["Sortera, ta de två mittersta och räkna deras medelvärde."]); } },
    { id: "mode", skill: "w12-l3.mode", gen: (rng) => { const a = modeList(rng); return numeric(`md-${a.join("-")}`, "w12-l3.mode", `Vilket är typvärdet av ${nums(a)}?`, modeOf(a)!, `${modeOf(a)} förekommer flest gånger.`, ["Vilket tal förekommer oftast?"]); } },
    { id: "range", skill: "w12-l3.range", gen: (rng) => { const a = Array.from({ length: rng.int(5, 8) }, () => rng.int(1, 40)); return numeric(`rg-${a.join("-")}`, "w12-l3.range", `Vad är variationsbredden för ${nums(a)}?`, rangeOf(a), `${Math.max(...a)} − ${Math.min(...a)} = ${rangeOf(a)}.`, ["Största minus minsta."]); } },
    { id: "freqMedian", skill: "w12-l3.table", gen: (rng) => { const f = [rng.int(1, 6), rng.int(1, 6), rng.int(1, 6), rng.int(1, 4)]; const all = f.flatMap((c, i) => Array(c).fill(i)); return numeric(`fm-${f.join("")}`, "w12-l3.table", `Tabellen visar antal syskon: ${f.map((c, i) => `${i} syskon – ${c} ${c === 1 ? "elev" : "elever"}`).join("; ")}. Vilken är medianen för antalet syskon?`, withHalf(medianOf(all)), `Det finns ${all.length} elever. Skriv ut dem i ordning: ${nums(all)}. Medianen är ${fmt(medianOf(all))}.`, ["Skriv ut alla värden i ordning, eller räkna ut mittpositionen."]); } },
    { id: "chooseMeasure", skill: "w12-l3.choose", gen: (rng) => { const C: [string, string][] = [["den vanligaste skostorleken i en klass", "typvärdet"], ["en typisk lön när en person tjänar extremt mycket", "medianen"], ["hur mycket var och en får om summan delas lika", "medelvärdet"], ["den färg flest elever föredrar", "typvärdet"]]; const [c, ok] = rng.pick(C);
      return mc(`cm-${c}`, "w12-l3.choose", `Vilket mått passar bäst för ${c}?`, ok, ["medelvärdet", "medianen", "typvärdet"].filter((x) => x !== ok).map((text) => ({ text })), `${ok === "typvärdet" ? "Typvärdet visar vad som är vanligast." : ok === "medianen" ? "Medianen påverkas inte av enstaka extrema värden." : "Medelvärdet fördelar summan lika."}`, ["Vad vill du veta?"], rng); } },
    { id: "outlier", skill: "w12-l3.outlier", gen: (rng) => { const b = [rng.int(3, 6), rng.int(4, 7), 5, 5, rng.int(5, 8)].sort((x, y) => x - y), out = rng.int(40, 99), a = [...b, out]; return mc(`ot-${a.join("-")}`, "w12-l3.outlier", `Talen är ${nums(a)}. Vilket mått påverkas mest av det stora talet ${out}?`, "medelvärdet", [{ text: "medianen", note: "Medianen ändras knappt – det mittersta talet är i stort sett detsamma." }, { text: "typvärdet" }], `Medelvärdet blir ${fmt(Math.round(meanOf(a) * 10) / 10)}, medianen ${fmt(medianOf(a))}. Medelvärdet dras kraftigt av det stora talet.`, ["Vilket mått använder alla värden?"], rng); } },
    { id: "meanMedian", skill: "w12-l3.compare", gen: (rng) => { for (;;) { const a = Array.from({ length: 5 }, () => rng.int(1, 30)); if (sum(a) % 5 === 0 && meanOf(a) !== medianOf(a)) return numeric(`mm-${a.join("-")}`, "w12-l3.compare", `Talen är ${nums(a)}. Hur stor är skillnaden mellan medelvärdet och medianen?`, Math.abs(meanOf(a) - medianOf(a)), `Medelvärde ${meanOf(a)}, median ${medianOf(a)}: skillnad ${Math.abs(meanOf(a) - medianOf(a))}.`, ["Räkna båda måtten."]); } } },
  ],
  method: [
    { id: "medianSteps", skill: "w12-l3.median", gen: (rng) => { const n = rng.pick([5, 7, 9]), a = Array.from({ length: n }, () => rng.int(1, 40)); return multifield(`ms-${a.join("-")}`, "w12-l3.median", `Hitta medianen av ${nums(a)} i steg.`, [{ label: "Antal tal", accept: [n] }, { label: "Mittersta platsen i den sorterade listan", accept: [(n + 1) / 2] }, { label: "Medianen", accept: [medianOf(a)] }], `${n} tal ger mittplats ${(n + 1) / 2}. Sorterat: ${nums([...a].sort((x, y) => x - y))}: medianen är ${medianOf(a)}.`, ["Sortera, räkna ut mittplatsen."]); } },
    { id: "rangeSteps", skill: "w12-l3.range", gen: (rng) => { const a = Array.from({ length: 6 }, () => rng.int(1, 40)); return multifield(`rs-${a.join("-")}`, "w12-l3.range", `Räkna ut ${nums(a)}: största, minsta och variationsbredd.`, [{ label: "Största", accept: [Math.max(...a)] }, { label: "Minsta", accept: [Math.min(...a)] }, { label: "Variationsbredd", accept: [rangeOf(a)] }], `${Math.max(...a)} − ${Math.min(...a)} = ${rangeOf(a)}.`, ["Hitta största och minsta först."]); } },
  ],
  representation: [
    { id: "modeBar", skill: "w12-l3.chart", gen: (rng) => { for (;;) { const cats = ["36", "37", "38", "39", "40"], vals = cats.map(() => rng.int(1, 4) * 2); const m = Math.max(...vals); if (vals.filter((v) => v === m).length !== 1) continue; return withVisual(mc(`mb-${vals.join("-")}`, "w12-l3.chart", "Diagrammet visar skostorlekar i en klass. Vilken storlek är typvärdet?", cats[vals.indexOf(m)], cats.filter((_, i) => i !== vals.indexOf(m)).slice(0, 3).map((text) => ({ text })), `Högsta stapeln är storlek ${cats[vals.indexOf(m)]}: det är typvärdet.`, ["Typvärdet är vanligast – den högsta stapeln."], rng), { type: "barchart", cats, vals, max: 8, step: 2 }); } } },
    { id: "medianBar", skill: "w12-l3.chart", gen: (rng) => { const cats = ["0", "1", "2", "3", "4"], vals = cats.map(() => rng.int(1, 3) * 2), all = vals.flatMap((c, i) => Array(c).fill(i)); return withVisual(numeric(`mdb-${vals.join("-")}`, "w12-l3.chart", "Diagrammet visar hur många syskon eleverna har (staplarna visar antal elever). Vilken är medianen för antalet syskon?", withHalf(medianOf(all)), `Det är ${all.length} elever. I ordning: ${nums(all)}. Medianen: ${fmt(medianOf(all))}.`, ["Skriv ut eleverna i ordning efter antal syskon."]), { type: "barchart", cats, vals, max: 6, step: 2 }); } },
  ],
  teacher: {
    title: "Sortera före medianen",
    scenarios: ["Noor (åk 5) ska hitta medianen av 7, 2, 9, 4, 5. Hon svarar 9 ”för det står i mitten”."],
    prompt: "Förklara för Noor vad en median är, vad hon glömt att göra, och vad medianen blir. Räkna också medelvärdet och förklara varför det blir något annat.",
    minChars: 170,
    rubric: { minConcepts: 4, concepts: [
      { id: "sortera", label: "att sortera först", any: ["sortera", "i storleksordning", "ordning"] },
      { id: "svar", label: "rätt median 5", any: ["5"] },
      { id: "mitt", label: "medianen är det mittersta värdet", any: ["mittersta", "i mitten", "mitt"] },
      { id: "medel", label: "medelvärdet 5,4 (27 ÷ 5)", any: ["5,4", "27"] },
      { id: "skillnad", label: "att medianen och medelvärdet mäter olika saker", any: ["olika", "inte samma", "mäter", "summan", "alla värden"] },
    ] },
    modelAnswer: "Noor, medianen är det mittersta värdet när alla tal står i storleksordning, och det glömde du: du måste sortera först. Sorterat blir det 2, 4, 5, 7, 9 och det mittersta är 5, så medianen är 5. Medelvärdet är 27 ÷ 5 = 5,4. De är olika eftersom medelvärdet använder alla värdens storlek via summan, medan medianen bara tittar på det mittersta.",
  },
};

// ───────── Lektion 4: Chans och sannolikhet ─────────
const DICE: [string, number][] = [["ett jämnt tal", 3], ["ett tal större än 4", 2], ["en sexa", 1], ["ett tal mindre än 3", 2], ["ett primtal", 3], ["inte en sexa", 5]];
function marbleSet(rng: Rng, nColors = rng.int(2, 3), maxN = 6) {
  const colors = rng.shuffle([...COLOR_NAMES]).slice(0, nColors);
  return colors.map((color) => ({ color, n: rng.int(1, maxN) }));
}
const probWord = (n: number, d: number) => (n === 0 ? "omöjlig" : n === d ? "säker" : 2 * n === d ? "lika sannolik som inte" : 2 * n < d ? "osannolik" : "sannolik");

export const lesson4: Lesson = {
  id: "w12-l4", worldId: "w12", title: "Chans och sannolikhet", grades: "åk 4–6",
  summary: "Sannolikhet = antal gynnsamma utfall ÷ antal möjliga utfall (när alla är lika sannolika). Från 0 till 1.",
  lgr: "Slumpmässiga händelser; sannolikhet; chans och risk",
  objectives: ["Räkna sannolikhet som bråk och procent.", "Placera sannolikheter på en skala 0–1.", "Förstå vad ”lika sannolika utfall” betyder."],
  intro: "**Sannolikhet** mäter hur troligt det är att något händer. Den är ett tal mellan **0** (omöjligt) och **1** (säkert). När alla utfall är lika sannolika, som på en rättvis tärning eller en blandad påse kulor, räknar du: *hur många utfall är gynnsamma, delat på hur många som finns*.",
  theory: [
    { heading: "Skalan 0–1", body: "$0$: händelsen kan inte hända. $1$: den händer alltid. $\\tfrac{1}{2}$: lika troligt som inte. Sannolikheter kan skrivas som bråk, decimaltal eller procent: $\\tfrac{1}{4} = 0{,}25 = 25\\ \\%$.", visual: { type: "numberline", min: 0, max: 4, step: 1, marks: [1, 2, 3], labelEvery: 1, den: 4 } },
    { heading: "Gynnsamma genom möjliga", body: "En påse har 3 röda och 5 blå kulor. Du drar en utan att titta. Antal möjliga utfall: 8. Gynnsamma för röd: 3. Sannolikheten är $\\tfrac{3}{8}$.", visual: { type: "marbles", counts: [{ color: "röd", n: 3 }, { color: "blå", n: 5 }] } },
    { heading: "Tärning och snurra", body: "En tärning har 6 lika sannolika utfall. Sannolikheten att slå **ett jämnt tal** (2, 4, 6) är $\\tfrac{3}{6} = \\tfrac{1}{2}$. På en snurra med 8 lika stora fält, 2 av dem gröna, är sannolikheten för grönt $\\tfrac{2}{8} = \\tfrac{1}{4}$.", visual: { type: "spinner", sectors: ["grön", "röd", "blå", "röd", "grön", "blå", "röd", "blå"] } },
    { heading: "Att inte hända", body: "Sannolikheten att något **inte** händer är $1 -$ sannolikheten att det händer. Är chansen för röd $\\tfrac{3}{8}$ så är chansen för *inte* röd $1 - \\tfrac{3}{8} = \\tfrac{5}{8}$." },
  ],
  worked: [
    { title: "Kulor", problem: "Påse: 2 röda, 3 blå, 5 gröna. Sannolikhet att dra blå?", steps: [{ text: "Möjliga: 2 + 3 + 5 = 10." }, { text: "Gynnsamma: 3." }, { text: "Sannolikhet:", math: "\\tfrac{3}{10} = 30\\ \\%" }], why: "Alla kulor har lika stor chans att dras.", alternative: "Tänk 100 drag: ungefär 30 blir blå." },
    { title: "Tärningen", problem: "Sannolikheten att slå ett tal större än 4?", steps: [{ text: "5 och 6 är större än 4: 2 gynnsamma." }, { text: "6 möjliga.", math: "\\tfrac{2}{6} = \\tfrac{1}{3}" }], why: "Förkorta när det går.", alternative: "Hälften av sex är tre; en tredjedel är två." },
  ],
  drawing: { task: "Rita en snurra med 6 lika stora fält där sannolikheten för rött är 1/3. Hur många fält blir röda?", tool: "fractioncircle" },
  pupils: [{ pupil: "Max", said: "Chansen att slå en sexa är 1/2, för antingen slår man sexa eller så gör man inte det.", misconception: "Tror att två möjligheter betyder 50 %, trots att de inte är lika sannolika.", response: "Räkna utfallen: sex lika sannolika (1–6). Bara en är sexa: 1/6. ”Sexa eller inte” är inte lika många fall – ”inte sexa” har fem." }],
  knowledge: [
    { id: "marbleProb", skill: "w12-l4.prob", gen: (rng) => { const m = marbleSet(rng), t = rng.pick(m), tot = sum(m.map((x) => x.n)); return withVisual(numeric(`mp-${m.map((x) => x.color + x.n).join("")}-${t.color}`, "w12-l4.prob", `Du drar en kula utan att titta. Vad är sannolikheten att den är ${t.color}? Svara som bråk.`, fracAcc(t.n, tot), `${t.n} ${PLUR[t.color]} av ${tot} kulor: ${t.n}/${tot}.`, ["Gynnsamma genom möjliga."]), { type: "marbles", counts: m }); } },
    { id: "diceProb", skill: "w12-l4.prob", gen: (rng) => { const [ev, k] = rng.pick(DICE); return numeric(`dp-${ev}`, "w12-l4.prob", `Du slår en vanlig tärning. Vad är sannolikheten att få ${ev}? Svara som bråk.`, fracAcc(k, 6), `${k} gynnsamma av 6: ${k}/6${gcd(k, 6) > 1 ? ` = ${k / gcd(k, 6)}/${6 / gcd(k, 6)}` : ""}.`, ["Vilka sidor är gynnsamma?"]); } },
    { id: "percentProb", skill: "w12-l4.percent", gen: (rng) => { const tot = rng.pick([4, 5, 10, 20]), c = rng.pick(COLOR_NAMES), k = rng.int(1, tot - 1), o = rng.pick(COLOR_NAMES.filter((x) => x !== c));
      return withVisual(numeric(`pp-${tot}-${k}-${c}`, "w12-l4.percent", `Du drar en kula utan att titta. Vad är sannolikheten att den är ${c}? Svara i procent.`, String((k * 100) / tot), `${k}/${tot} = ${(k * 100) / tot} %.`, ["Bråk först, sedan procent."], "%"), { type: "marbles", counts: [{ color: c, n: k }, { color: o, n: tot - k }] }); } },
    { id: "extremes", skill: "w12-l4.scale", gen: (rng) => { const certain = rng.chance(0.5), n = rng.int(3, 9); return withVisual(numeric(`ex-${certain}-${n}`, "w12-l4.scale", `En påse har bara ${certain ? "blå" : "röda"} kulor. Vad är sannolikheten att dra en blå kula? Svara 0 eller 1.`, certain ? "1" : "0", certain ? "Alla kulor är blå: säkert, sannolikheten är 1." : "Det finns inga blå kulor: omöjligt, sannolikheten är 0.", ["Är det säkert eller omöjligt?"]), { type: "marbles", counts: [{ color: certain ? "blå" : "röd", n }] }); } },
    { id: "wordMc", skill: "w12-l4.scale", gen: (rng) => { const [n, d] = rng.pick([[0, 6], [1, 6], [1, 4], [1, 2], [2, 3], [5, 6], [6, 6]]); const ok = probWord(n, d);
      return mc(`wm-${n}-${d}`, "w12-l4.scale", `Sannolikheten för en händelse är ${n}/${d}. Hur kan man beskriva händelsen?`, ok, ["omöjlig", "osannolik", "lika sannolik som inte", "sannolik", "säker"].filter((x) => x !== ok).slice(0, 3).map((text) => ({ text })), `${n}/${d} ${n === 0 ? "är 0" : n === d ? "är 1" : n * 2 === d ? "är exakt hälften" : n * 2 < d ? "är mindre än hälften" : "är mer än hälften"}: ${ok}.`, ["Jämför med 0, 1/2 och 1."], rng); } },
    { id: "mostLikely", skill: "w12-l4.compare", gen: (rng) => { for (;;) { const m = marbleSet(rng, 3, 7), mx = Math.max(...m.map((x) => x.n)); if (m.filter((x) => x.n === mx).length !== 1) continue; const best = m.find((x) => x.n === mx)!;
      return withVisual(mc(`ml-${m.map((x) => x.color + x.n).join("")}`, "w12-l4.compare", "Du drar en kula utan att titta. Vilken färg är mest sannolik?", best.color, m.filter((x) => x !== best).map((x) => ({ text: x.color })), `${best.color} har flest kulor (${best.n}), alltså störst sannolikhet.`, ["Vilken färg finns det flest av?"], rng), { type: "marbles", counts: m }); } } },
    { id: "complement", skill: "w12-l4.complement", gen: (rng) => { const d = rng.pick([4, 5, 8, 10]), n = rng.int(1, d - 1); return numeric(`cp-${n}-${d}`, "w12-l4.complement", `Sannolikheten att det regnar imorgon är ${n}/${d}. Vad är sannolikheten att det inte regnar? Svara som bråk.`, fracAcc(d - n, d), `1 − ${n}/${d} = ${d - n}/${d}.`, ["De två måste tillsammans bli 1."]); } },
    { id: "equalMc", skill: "w12-l4.concept", gen: (rng) => mc("eq", "w12-l4.concept", "Vilken av dessa påståenden stämmer för en rättvis tärning?", "Alla sex sidor är lika sannolika", [{ text: "Sexan är svårare att få än de andra", note: "På en rättvis tärning är alla sidor lika sannolika." }, { text: "Jämna tal är mer sannolika än udda" }, { text: "En tärning som kommit sexa är ”slut” på sexor" }], "Rättvis betyder att varje utfall har samma sannolikhet, 1/6.", ["Vad betyder ”rättvis”?"], rng) },
  ],
  method: [
    { id: "probSteps", skill: "w12-l4.prob", gen: (rng) => { const m = marbleSet(rng), t = rng.pick(m), tot = sum(m.map((x) => x.n)); return withVisual(multifield(`ps-${m.map((x) => x.color + x.n).join("")}-${t.color}`, "w12-l4.prob", `Du drar en kula utan att titta. Räkna ut sannolikheten för ${t.color} i steg.`, [{ label: `Antal ${PLUR[t.color]} kulor (gynnsamma)`, accept: [t.n] }, { label: "Antal kulor totalt (möjliga)", accept: [tot] }, { label: "Sannolikhet (som bråk)", accept: fracAcc(t.n, tot) }], `${t.n}/${tot}.`, ["Räkna varje sort, sedan alla."]), { type: "marbles", counts: m }); } },
    { id: "diceSteps", skill: "w12-l4.prob", gen: (rng) => { const [ev, k] = rng.pick(DICE); return multifield(`ds-${ev}`, "w12-l4.prob", `Du slår en tärning. Räkna ut sannolikheten att få ${ev}.`, [{ label: "Antal gynnsamma sidor", accept: [k] }, { label: "Antal möjliga sidor", accept: [6] }, { label: "Sannolikhet (som bråk)", accept: fracAcc(k, 6) }], `${k}/6.`, ["Vilka sidor räknas?"]); } },
  ],
  representation: [
    { id: "spinnerProb", skill: "w12-l4.picture", gen: (rng) => { const n = rng.pick([6, 8]), c = rng.pick(COLOR_NAMES), o = rng.pick(COLOR_NAMES.filter((x) => x !== c)), k = rng.int(1, n - 1), sectors = rng.shuffle([...Array(k).fill(c), ...Array(n - k).fill(o)]);
      return withVisual(numeric(`sp-${sectors.join("")}-${c}`, "w12-l4.picture", `Snurran har ${n} lika stora fält. Vad är sannolikheten att den stannar på ${c}? Svara som bråk.`, fracAcc(k, n), `${k} av ${n} fält är ${PLUR[c]}: ${k}/${n}.`, ["Räkna fälten av färgen."]), { type: "spinner", sectors }); } },
    { id: "markProb", skill: "w12-l4.line", gen: (rng) => { const d = rng.pick([4, 5, 8, 10]), k = rng.int(1, d - 1); return numberlineEx(`mk-${k}-${d}`, "w12-l4.line", `Sannolikheten att något händer är ${k}/${d}. Markera den på tallinjen mellan 0 (omöjligt) och 1 (säkert), delad i ${d} lika delar.`, k, { min: 0, max: d, step: 1, labelEvery: 1, den: d }, `${k}/${d} ligger vid streck ${k} av ${d}.`, ["Räkna steg från 0."]); } },
  ],
  teacher: {
    title: "”Sexa eller inte” är inte 50–50",
    scenarios: ["Max (åk 5) säger: ”Chansen att slå en sexa är 1/2, för det finns två möjligheter: antingen slår man sexa eller så gör man inte det.”"],
    prompt: "Förklara för Max vad som är fel i resonemanget, vad sannolikheten att slå en sexa verkligen är, och hur man räknar sannolikhet när utfallen är lika sannolika.",
    minChars: 170,
    rubric: { minConcepts: 4, concepts: [
      { id: "sex", label: "6 möjliga utfall på en tärning", any: ["sex sidor", "6 sidor", "sex utfall", "6 utfall", "sex möjliga", "6 möjliga"] },
      { id: "svar", label: "rätt sannolikhet 1/6", any: ["1/6", "en sjättedel", "1 av 6", "ett av sex"] },
      { id: "lika", label: "att utfallen måste vara lika sannolika", any: ["lika sannolika", "lika stor chans", "lika troliga", "lika många"] },
      { id: "inte", label: "att ”inte sexa” har fem utfall", any: ["fem", "5 sidor", "5/6", "inte sexa", "fem av sex"] },
      { id: "formel", label: "gynnsamma genom möjliga", any: ["gynnsamma", "delat på", "genom antalet", "möjliga"] },
    ] },
    modelAnswer: "Max, två möjligheter betyder inte 50–50 om de inte är lika sannolika. En tärning har sex sidor och alla sex är lika sannolika. Bara en av dem är en sexa, så sannolikheten är 1/6. ”Inte sexa” innehåller fem av sidorna, 5/6. Man räknar sannolikhet som antalet gynnsamma utfall delat på antalet möjliga, när alla utfall är lika sannolika.",
  },
};

// ───────── Lektion 5: Experiment och förväntat antal ─────────
const dsCount = (s: number) => { let c = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b === s) c++; return c; };

export const lesson5: Lesson = {
  id: "w12-l5", worldId: "w12", title: "Experiment, relativ frekvens och förväntat antal", grades: "åk 4–6",
  summary: "Relativ frekvens = antal gånger ÷ antal försök. Förväntat antal = sannolikhet · antal försök.",
  lgr: "Slumpmässiga händelser; jämföra sannolikhet i experiment och teori",
  objectives: ["Räkna relativ frekvens i ett experiment.", "Räkna förväntat antal med sannolikhet.", "Förstå att slumpen jämnar ut sig först vid många försök, och att tidigare kast inte påverkar nästa."],
  intro: "Teori och verklighet pratar inte alltid samma språk. Sannolikhet 1/6 för en sexa betyder **inte** att exakt var sjätte kast blir en sexa. I ett **experiment** får du en **relativ frekvens**, hur ofta det faktiskt hände. Med få försök kan den avvika mycket; med många kommer den nära sannolikheten.",
  theory: [
    { heading: "Relativ frekvens", body: "Du snurrar en snurra 20 gånger och får rött 7 gånger. Den **relativa frekvensen** är $\\tfrac{7}{20} = 35\\ \\%$. Den beskriver vad som hände i just ditt experiment.", visual: { type: "barchart", cats: ["Röd", "Blå", "Grön"], vals: [7, 8, 5], max: 10, step: 2 } },
    { heading: "Förväntat antal", body: "Sannolikheten att vinna är $\\tfrac{1}{4}$. På 80 spel förväntar du dig ungefär $\\tfrac{1}{4} \\cdot 80 = 20$ vinster. Det är en förväntan – inte ett löfte." },
    { heading: "Få och många försök", body: "Fem kast med ett mynt kan mycket väl ge 4 klave (80 %). Men 5 000 kast kommer att ligga mycket nära 50 %. Slumpen jämnar ut sig bara på **lång sikt**." },
    { heading: "Slumpen har inget minne", body: "Har du fått klave fem gånger i rad är sannolikheten för klave nästa kast **fortfarande** $\\tfrac{1}{2}$. Myntet minns inget. Att tro något annat kallas *spelarens villfarelse*." },
  ],
  worked: [
    { title: "Relativ frekvens", problem: "Ett mynt kastas 50 gånger, 28 klave. Relativ frekvens för klave i procent?", steps: [{ text: "Bråk:", math: "\\tfrac{28}{50}" }, { text: "Förläng till hundradelar:", math: "\\tfrac{56}{100} = 56\\ \\%" }], why: "Andelen gånger det hände, uttryckt i procent.", alternative: "28 ÷ 50 = 0,56." },
    { title: "Förväntat antal", problem: "Sannolikheten för sexa är 1/6. Hur många sexor förväntar du dig på 300 kast?", steps: [{ text: "Multiplicera sannolikheten med antal kast.", math: "\\tfrac{1}{6} \\cdot 300 = 50" }], why: "1/6 av alla kast ska i genomsnitt vara sexor.", alternative: "Dela 300 i sex lika delar: 50 i varje." },
  ],
  drawing: { task: "Kasta ett mynt 20 gånger och rita ett stapeldiagram för klave och krona. Vad blev den relativa frekvensen för klave? Jämför med 50 %.", tool: "grid" },
  pupils: [{ pupil: "Noor", said: "Jag fick klave fem gånger i rad, så nu måste det bli krona.", misconception: "Spelarens villfarelse – tror att slumpen ”jämnar ut” nästa kast.", response: "Fråga: ”Minns myntet vad det gjorde förra gången?” Nästa kast har fortfarande 1/2 för klave, oavsett historia." }],
  knowledge: [
    { id: "relFreq", skill: "w12-l5.relative", gen: (rng) => { for (;;) { const n = rng.pick([10, 20, 25, 40, 50, 100]), k = rng.int(1, n - 1); if ((k * 100) % n === 0) return numeric(`rf-${n}-${k}`, "w12-l5.relative", `Du snurrar en snurra ${n} gånger och får rött ${k} gånger. Hur stor är den relativa frekvensen för rött, i procent?`, String((k * 100) / n), `${k}/${n} = ${(k * 100) / n} %.`, ["Antal gånger genom antal försök."], "%"); } } },
    { id: "expected", skill: "w12-l5.expected", gen: (rng) => { const [a, b] = rng.pick([[1, 6], [1, 4], [1, 2], [1, 3], [2, 3], [3, 4]]), N = b * rng.int(2, 25); return numeric(`ex-${a}-${b}-${N}`, "w12-l5.expected", `Sannolikheten att vinna är ${a}/${b}. Hur många vinster förväntar du dig på ${N} spel?`, (N * a) / b, `${a}/${b} · ${N} = ${(N * a) / b}.`, ["Multiplicera sannolikheten med antalet spel."]); } },
    { id: "expectedPct", skill: "w12-l5.expected", gen: (rng) => { const p = rng.pick([10, 20, 25, 50]), N = (100 / gcd(p, 100)) * rng.int(1, 6) * 2; return numeric(`ep-${p}-${N}`, "w12-l5.expected", `Sannolikheten att en lampa är trasig är ${p} %. Hur många trasiga lampor förväntar du dig i en låda med ${N} lampor?`, (p * N) / 100, `${p} % av ${N} = ${(p * N) / 100}.`, ["Procent av ett tal."]); } },
    { id: "fewTrials", skill: "w12-l5.concept", gen: (rng) => mc("ft", "w12-l5.concept", "Du slår en tärning 6 gånger och får inte en enda sexa. Vad kan man säga?", "Det är normalt vid få kast – slumpen kan avvika", [{ text: "Tärningen är trasig", note: "Med bara 6 kast är en avvikelse inte ovanlig." }, { text: "Nästa kast måste bli en sexa" }, { text: "Sannolikheten för sexa är 0" }], "Slumpen jämnar ut sig först vid många försök.", ["Hur många försök är sex?"], rng) },
    { id: "gambler", skill: "w12-l5.gambler", gen: (rng) => { const k = rng.int(4, 8), coin = rng.chance(0.5); return numeric(`gb-${k}-${coin}`, "w12-l5.gambler", coin ? `Du har kastat ett mynt och fått klave ${k} gånger i rad. Vad är sannolikheten för klave i nästa kast? Svara som bråk.` : `Du har slagit en sexa ${Math.min(k, 4)} gånger i rad med en rättvis tärning. Vad är sannolikheten för sexa i nästa kast? Svara som bråk.`, coin ? ["1/2"] : ["1/6"], "Tidigare kast påverkar inte nästa: sannolikheten är densamma som alltid.", ["Har myntet/tärningen något minne?"]); } },
    { id: "diceSum", skill: "w12-l5.twodice", gen: (rng) => { const s = rng.int(2, 12); return numeric(`dsm-${s}`, "w12-l5.twodice", `Du slår två tärningar. På hur många av de 36 möjliga sätten blir summan ${s}?`, dsCount(s), `Skriv alla par: det finns ${dsCount(s)} par med summan ${s}.`, ["Rita en tabell 6 × 6."]); } },
    { id: "diceSumProb", skill: "w12-l5.twodice", gen: (rng) => { const s = rng.int(2, 12); return numeric(`dsp-${s}`, "w12-l5.twodice", `Du slår två tärningar. Vad är sannolikheten att summan blir ${s}? Svara som bråk.`, fracAcc(dsCount(s), 36), `${dsCount(s)} gynnsamma av 36: ${dsCount(s)}/36.`, ["Räkna först antalet sätt."]); } },
  ],
  method: [
    { id: "relSteps", skill: "w12-l5.relative", gen: (rng) => { for (;;) { const n = rng.pick([20, 25, 50]), k = rng.int(2, n - 2); if ((k * 100) % n === 0) return multifield(`rs-${n}-${k}`, "w12-l5.relative", `Ett mynt kastas ${n} gånger och blir klave ${k} gånger. Räkna ut den relativa frekvensen i steg.`, [{ label: "Antal gånger klave", accept: [k] }, { label: "Antal kast", accept: [n] }, { label: "Relativ frekvens i procent", suffix: "%", accept: [(k * 100) / n] }], `${k}/${n} = ${(k * 100) / n} %.`, ["Gånger genom försök."]); } } },
    { id: "expSteps", skill: "w12-l5.expected", gen: (rng) => { const [a, b] = rng.pick([[1, 6], [1, 4], [1, 5], [2, 5], [3, 4]]), N = b * rng.int(2, 20); return multifield(`es-${a}-${b}-${N}`, "w12-l5.expected", `Sannolikheten att vinna är ${a}/${b}. Hur många vinster förväntas på ${N} spel? Räkna i steg.`, [{ label: `${N} ÷ ${b} (en del)`, accept: [N / b] }, { label: "Förväntat antal vinster", accept: [(N * a) / b] }], `${N} ÷ ${b} = ${N / b}; gånger ${a}: ${(N * a) / b}.`, ["Dela först, multiplicera sedan."]); } },
  ],
  representation: [
    { id: "barPct", skill: "w12-l5.chart", gen: (rng) => { const T = rng.pick([20, 50]), cats = ["Röd", "Blå", "Grön"], u = 5; let parts: number[]; do { const a = rng.int(1, T / u - 2), b = rng.int(1, T / u - a - 1); parts = [a, b, T / u - a - b].map((x) => x * u); } while (parts.some((x) => x < u)); const i = rng.int(0, 2);
      return withVisual(numeric(`bp-${T}-${parts.join("-")}-${i}`, "w12-l5.chart", `Diagrammet visar ${T} snurrningar. Hur stor är den relativa frekvensen för ${cats[i].toLowerCase()}, i procent?`, String((parts[i] * 100) / T), `${parts[i]}/${T} = ${(parts[i] * 100) / T} %.`, ["Läs av stapeln, dela med alla försök."], "%"), { type: "barchart", cats, vals: parts, max: T === 20 ? 15 : 40, step: 5 } as Visual); } },
    { id: "buildResults", skill: "w12-l5.chart", gen: (rng) => { const cats = ["Klave", "Krona"], k = rng.int(2, 8), n = rng.int(k + 1, 10 + 2);
      return barsEx(`br-${k}-${n}`, "w12-l5.chart", `Ett mynt kastades ${n} gånger och blev klave ${k} gånger (resten krona). Rita stapeldiagrammet över resultatet.`, cats, [k, n - k], 12, `Klave ${k}, krona ${n - k}.`, ["Hur många gånger blev det krona?"]); } },
  ],
  teacher: {
    title: "Myntet minns inte",
    scenarios: ["Noor (åk 5) har kastat ett mynt och fått klave fem gånger i rad. Hon säger att nästa kast ”nästan säkert” blir krona."],
    prompt: "Förklara för Noor varför myntet inte ”måste” ge krona nu, vad sannolikheten för krona är i nästa kast, och vad som händer med slumpen när man kastar många gånger.",
    minChars: 180,
    rubric: { minConcepts: 4, concepts: [
      { id: "minne", label: "myntet har inget minne / kasten påverkar inte varandra", any: ["inget minne", "minns inte", "oberoende", "påverkar inte", "påverkas inte"] },
      { id: "half", label: "sannolikheten är 1/2 (50 %) för krona", any: ["1/2", "50 %", "50 procent", "hälften", "lika stor chans"] },
      { id: "forvill", label: "spelarens villfarelse / felaktigt tänkande", any: ["villfarelse", "fel tänkande", "missuppfattning", "fel att tro", "stämmer inte"] },
      { id: "langsikt", label: "att slumpen jämnar ut sig på lång sikt / vid många kast", any: ["lång sikt", "många kast", "många försök", "jämnar ut", "i längden"] },
      { id: "relativ", label: "relativ frekvens närmar sig sannolikheten", any: ["relativ frekvens", "närmar sig", "nära 50", "andelen"] },
    ] },
    modelAnswer: "Noor, myntet har inget minne, och varje kast påverkar inte nästa. Sannolikheten för krona är fortfarande 1/2, 50 %, precis som vid första kastet. Att tro att krona är mer sannolik efter många klave är en villfarelse. Slumpen jämnar ut sig bara på lång sikt: kastar man många tusen gånger närmar sig den relativa frekvensen 50 %, men det betyder inte att nästa kast ”kompenserar”.",
  },
};
void tf;
