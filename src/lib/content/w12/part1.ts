import type { Lesson } from "../types";
import { mc, numeric, multifield, withVisual, barsEx } from "@/lib/engine/gen-helpers";
import type { Rng } from "@/lib/engine/rng";
import type { Visual } from "@/lib/engine/types";
import { barData, fmt, meanData, meanOf, sum } from "./stats";

// ───────── Lektion 1: Tabeller och diagram ─────────
const CHART_CTX: [string, string][] = [
  ["hur temperaturen ändras under ett dygn", "linjediagram"], ["hur många elever som valt olika frukter", "stapeldiagram"],
  ["hur en klass fördelar sin tid på olika aktiviteter (delar av en helhet)", "cirkeldiagram"], ["hur ett barns längd förändras år för år", "linjediagram"],
  ["hur många som har olika husdjur", "stapeldiagram"], ["hur stor andel av en budget som går till olika utgifter", "cirkeldiagram"],
];
const TIMES = ["06", "09", "12", "15", "18"];

export const lesson1: Lesson = {
  id: "w12-l1", worldId: "w12", title: "Tabeller och diagram", grades: "åk 4–6",
  summary: "Läsa och göra tabeller, stapeldiagram, piktogram och linjediagram – och välja rätt diagram.",
  lgr: "Tabeller och diagram för att beskriva resultat från enkla undersökningar; tolkning av data",
  objectives: ["Läsa av värden i tabeller och diagram, även när skalan går upp med 2, 5 eller 10.", "Rita ett stapeldiagram utifrån en tabell.", "Välja diagram som passar den sorts data man har."],
  intro: "Statistik handlar om att göra **data** begripliga. En enda lång lista med tal säger lite, men en **tabell** eller ett **diagram** visar mönstret direkt. Det svåra är inte att rita utan att **läsa rätt**: vad betyder varje streck på axeln? Och vilket diagram passar vilken sorts data?",
  theory: [
    { heading: "Frekvenstabell", body: "Du kastar en tärning 12 gånger: 3, 5, 2, 5, 6, 1, 5, 3, 4, 5, 2, 6. Räkna hur många gånger varje tal förekommer. **Frekvensen** för 5 är 4 (fem gånger femmor: 4). Tabellen visar frekvenserna för alla tal, och de ska tillsammans bli 12." },
    { heading: "Stapeldiagram", body: "Ett **stapeldiagram** jämför kategorier. Stapelns höjd läser du av på den lodräta axeln – titta alltid på **vad varje streck står för**. Här går axeln upp med 10 per streck, och staplarna slutar mellan strecken.", visual: { type: "barchart", cats: ["Äpple", "Banan", "Päron", "Apelsin"], vals: [20, 35, 15, 30], max: 40, step: 10 } },
    { heading: "Piktogram", body: "I ett **piktogram** står varje bild för ett visst antal. Står det ● = 4 betyder 3 bilder $3 \\cdot 4 = 12$.", visual: { type: "pictogram", rows: [{ label: "Måndag", count: 3 }, { label: "Tisdag", count: 5 }, { label: "Onsdag", count: 2 }], per: 4 } },
    { heading: "Linjediagram och val av diagram", body: "Ett **linjediagram** visar hur något **förändras över tid** (temperatur, längd). **Stapeldiagram** jämför kategorier. **Cirkeldiagram** visar delar av en helhet. Välj diagrammet efter vad du vill visa.", visual: { type: "linechart", xs: TIMES, ys: [8, 12, 18, 16, 10], max: 20, step: 2 } },
  ],
  worked: [
    { title: "Läsa av med skalsteg 10", problem: "Axeln har strecken 0, 10, 20, 30, 40. Staplen slutar halvvägs mellan 20 och 30. Vad är värdet?", steps: [{ text: "Halvvägs mellan 20 och 30 är 25." }, { text: "Kontroll: finns mellanstreck? Ja, ett vid 25. Värdet är 25." }], why: "Värdet är det tal staplens topp pekar på, inte det närmaste siffran på axeln.", alternative: "Dra en tänkt linje åt vänster från stapelns topp till axeln." },
    { title: "Frekvenstabell", problem: "Tärningskast: 3, 5, 2, 5, 6, 1, 5, 3. Hur många femmor?", steps: [{ text: "Gå igenom listan och sätt streck för varje 5: tre streck." }, { text: "Frekvensen för 5 är 3." }], why: "Systematiskt räknande minskar risken att glömma eller dubbelräkna.", alternative: "Sortera listan först: 1, 2, 3, 3, 5, 5, 5, 6." },
  ],
  drawing: { task: "Rita ett stapeldiagram över antal syskon i din klass (eller fantasidata). Sätt ut axelns siffror och namnge staplarna.", tool: "grid" },
  pupils: [{ pupil: "Alva", said: "Staplen går upp till mitt mellan 10 och 20, så den är 20.", misconception: "Rundar till närmaste siffra på axeln i stället för att läsa av värdet.", response: "Fråga: ”Vad står strecket mitt emellan för?” Låt Alva räkna streck: halvvägs mellan 10 och 20 är 15." }],
  knowledge: [
    { id: "readBar", skill: "w12-l1.read", gen: (rng) => { const d = barData(rng), i = rng.int(0, d.cats.length - 1); return withVisual(numeric(`rb-${d.vals.join("-")}-${i}`, "w12-l1.read", `Diagrammet visar ${d.topic}. Hur många valde ${d.cats[i]}?`, d.vals[i], `Stapeln för ${d.cats[i]} når upp till ${d.vals[i]}.`, ["Läs av stapelns topp mot axeln. Vad betyder varje streck?"]), d.visual); } },
    { id: "diffBar", skill: "w12-l1.compare", gen: (rng) => { const d = barData(rng); const order = d.vals.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]); const a = order[0][1], b = order[order.length - 1][1];
      return withVisual(numeric(`db-${d.vals.join("-")}`, "w12-l1.compare", `Diagrammet visar ${d.topic}. Hur många fler valde ${d.cats[a]} än ${d.cats[b]}?`, d.vals[a] - d.vals[b], `${d.vals[a]} − ${d.vals[b]} = ${d.vals[a] - d.vals[b]}.`, ["Läs av båda staplarna och subtrahera."]), d.visual); } },
    { id: "totalBar", skill: "w12-l1.total", gen: (rng) => { const d = barData(rng); return withVisual(numeric(`tb-${d.vals.join("-")}`, "w12-l1.total", `Diagrammet visar ${d.topic}. Hur många personer svarade totalt?`, sum(d.vals), `${d.vals.join(" + ")} = ${sum(d.vals)}.`, ["Addera alla staplar."]), d.visual); } },
    { id: "frequency", skill: "w12-l1.frequency", gen: (rng) => { const n = rng.int(12, 20), xs = Array.from({ length: n }, () => rng.int(1, 6)), k = rng.int(1, 6); const cnt = xs.filter((x) => x === k).length;
      return numeric(`fq-${xs.join("")}-${k}`, "w12-l1.frequency", `Resultat av ${n} tärningskast: ${xs.join(", ")}. Hur många gånger kom talet ${k}?`, cnt, `Räkna ${k}:orna i listan: ${cnt}.`, ["Sätt streck för varje förekomst."]); } },
    { id: "pictogram", skill: "w12-l1.pictogram", gen: (rng) => { const per = rng.pick([2, 4, 5, 10]), labels = ["Måndag", "Tisdag", "Onsdag", "Torsdag"], rows = labels.map((label) => ({ label, count: rng.int(1, 6) })), i = rng.int(0, 3);
      return withVisual(numeric(`pg-${per}-${rows.map((r) => r.count).join("")}-${i}`, "w12-l1.pictogram", `Varje cirkel står för ${per} böcker. Hur många böcker lästes på ${labels[i].toLowerCase()}?`, rows[i].count * per, `${rows[i].count} cirklar · ${per} = ${rows[i].count * per}.`, ["Antal bilder gånger vad varje bild är värd."]), { type: "pictogram", rows, per }); } },
    { id: "chooseChart", skill: "w12-l1.choose", gen: (rng) => { const [ctx, ok] = rng.pick(CHART_CTX); return mc(`cc-${ctx}`, "w12-l1.choose", `Vilket diagram passar bäst för att visa ${ctx}?`, ok, ["stapeldiagram", "linjediagram", "cirkeldiagram"].filter((x) => x !== ok).map((text) => ({ text })), `${ok === "linjediagram" ? "Förändring över tid visas bäst med en linje." : ok === "stapeldiagram" ? "Jämförelse mellan kategorier visas bäst med staplar." : "Delar av en helhet visas bäst i en cirkel."}`, ["Är det förändring över tid, kategorier eller delar av en helhet?"], rng); } },
    { id: "lineRead", skill: "w12-l1.line", gen: (rng) => { const ys = TIMES.map(() => rng.int(1, 8) * 2), i = rng.int(0, 4); return withVisual(numeric(`lr-${ys.join("-")}-${i}`, "w12-l1.line", `Linjen visar temperaturen (°C) under dagen. Vilken temperatur var det klockan ${TIMES[i]}?`, ys[i], `Punkten vid kl ${TIMES[i]} ligger vid ${ys[i]}.`, ["Gå från klockslaget upp till punkten, sedan åt sidan till axeln."], "°C"), { type: "linechart", xs: TIMES, ys, max: 20, step: 2 }); } },
    { id: "tick", skill: "w12-l1.scale", gen: (rng) => { const d = barData(rng, 4), i = rng.int(0, 3); const wrongs = [d.vals[i] + d.step, d.vals[i] - d.step, d.vals[i] + 1].filter((x) => x > 0);
      return withVisual(mc(`tk-${d.vals.join("-")}-${i}`, "w12-l1.scale", `Vad är värdet för ${d.cats[i]}? Var noga med hur mycket varje streck på axeln står för.`, String(d.vals[i]), wrongs.map((x) => ({ text: String(x) })), `Stapelns topp ligger på ${d.vals[i]}.`, ["Läs skalan: hur stor är skillnaden mellan två streck?"], rng), d.visual); } },
  ],
  method: [
    { id: "tableSteps", skill: "w12-l1.total", gen: (rng) => { const d = barData(rng); return withVisual(multifield(`ts-${d.vals.join("-")}`, "w12-l1.total", `Diagrammet visar ${d.topic}. Räkna ut i steg.`, [{ label: "Största stapeln", accept: [Math.max(...d.vals)] }, { label: "Minsta stapeln", accept: [Math.min(...d.vals)] }, { label: "Summa av alla staplar", accept: [sum(d.vals)] }], `Största ${Math.max(...d.vals)}, minsta ${Math.min(...d.vals)}, summa ${sum(d.vals)}.`, ["Läs av varje stapel först."]), d.visual); } },
    { id: "freqSteps", skill: "w12-l1.frequency", gen: (rng) => { const n = rng.int(12, 18), xs = Array.from({ length: n }, () => rng.int(1, 4)); const c = (k: number) => xs.filter((x) => x === k).length;
      return multifield(`fs-${xs.join("")}`, "w12-l1.frequency", `Du frågar ${n} personer hur många syskon de har: ${xs.join(", ")}. Fyll i frekvenstabellen för 1, 2 och 3 syskon.`, [{ label: "1 syskon", accept: [c(1)] }, { label: "2 syskon", accept: [c(2)] }, { label: "3 syskon", accept: [c(3)] }], `Räkna varje tal: ${c(1)}, ${c(2)}, ${c(3)} (och ${c(4)} med 4 syskon).`, ["Sätt streck, räkna ett tal i taget."]); } },
  ],
  representation: [
    { id: "buildBars", skill: "w12-l1.build", gen: (rng) => { const cats = rng.pick([["Äpple", "Banan", "Päron"], ["Katt", "Hund", "Fisk"], ["Röd", "Blå", "Grön"]]), vals = cats.map(() => rng.int(1, 9));
      return barsEx(`bb-${cats.join("")}-${vals.join("")}`, "w12-l1.build", `Rita stapeldiagrammet för tabellen: ${cats.map((c, i) => `${c} ${vals[i]}`).join(", ")}. Använd + och − under varje stapel.`, cats, vals, 10, `Varje stapel ska nå upp till sitt värde: ${cats.map((c, i) => `${c} ${vals[i]}`).join(", ")}.`, ["Ställ in en stapel i taget."]); } },
    { id: "readLine", skill: "w12-l1.line", gen: (rng) => { const ys = TIMES.map(() => rng.int(1, 8) * 2); const i = rng.int(0, 3), j = i + 1; return withVisual(numeric(`rl-${ys.join("-")}-${i}`, "w12-l1.line", `Linjen visar temperaturen (°C). Hur många grader ${ys[j] >= ys[i] ? "steg" : "sjönk"} temperaturen mellan klockan ${TIMES[i]} och ${TIMES[j]}?`, Math.abs(ys[j] - ys[i]), `Vid ${TIMES[i]}: ${ys[i]}, vid ${TIMES[j]}: ${ys[j]}. Skillnad ${Math.abs(ys[j] - ys[i])}.`, ["Läs av båda punkterna och ta skillnaden."], "°C"), { type: "linechart", xs: TIMES, ys, max: 20, step: 2 }); } },
  ],
  teacher: {
    title: "Läsa av mellan strecken",
    scenarios: ["Alva (åk 4) läser av ett stapeldiagram där axeln har siffrorna 0, 10, 20, 30. En stapel slutar halvvägs mellan 10 och 20. Hon säger att värdet är 20 ”för det är närmaste siffran”."],
    prompt: "Förklara för Alva hur man läser av ett värde i ett stapeldiagram, vad värdet blir här och hur hon ska tänka när staplarna inte slutar precis på ett streck med siffra.",
    minChars: 160,
    rubric: { minConcepts: 4, concepts: [
      { id: "skala", label: "att man måste läsa skalan / vad varje streck står för", any: ["skala", "streck", "axel", "står för", "varje streck"] },
      { id: "svar", label: "rätt värde 15", any: ["15"] },
      { id: "halva", label: "halvvägs betyder mitt emellan (hälften av steget)", any: ["halvvägs", "mitt emellan", "hälften", "mitten"] },
      { id: "topp", label: "läs av vid stapelns topp", any: ["topp", "överkant", "ovansida", "dra en linje", "rakt över"] },
      { id: "fel", label: "att närmaste siffra inte är värdet", any: ["närmaste siffra", "avrunda", "inte närmaste", "20 är fel", "fel"] },
    ] },
    modelAnswer: "Alva, värdet är det som stapelns topp pekar på, inte den närmaste siffran på axeln. Titta på skalan: strecken står för 0, 10, 20, 30, så en stapel som slutar halvvägs mellan 10 och 20 har värdet mitt emellan, hälften av 10 mer än 10, alltså 15. Dra en tänkt linje från stapelns topp åt sidan till axeln och läs av där. Att runda till närmaste siffra, 20, är fel.",
  },
};

// ───────── Lektion 2: Medelvärde ─────────
export const lesson2: Lesson = {
  id: "w12-l2", worldId: "w12", title: "Medelvärde", grades: "åk 4–6",
  summary: "Medelvärde = summan ÷ antalet. Det tal alla värden skulle vara om de var lika.",
  lgr: "Lägesmått: medelvärde",
  objectives: ["Räkna medelvärde av en lista och ur ett diagram.", "Förstå medelvärdet som det tal som ”jämnar ut” alla värden.", "Räkna baklänges: summa och saknat värde."],
  intro: "**Medelvärdet** svarar på frågan: *om alla hade fått lika mycket – hur mycket?* Du lägger ihop alla värden och delar med hur många de är. Det är inte det ”mittersta” talet (det kallas median, nästa lektion), och det behöver inte ens vara ett av talen i listan.",
  theory: [
    { heading: "Jämna ut", body: "Fyra kompisar har 3, 5, 6 och 10 kronor. Lägg ihop allt: $3 + 5 + 6 + 10 = 24$. Dela lika på fyra: $24 \\div 4 = 6$. Medelvärdet är 6 kr – så mycket var och en skulle få om de delade lika.", visual: { type: "barchart", cats: ["A", "B", "C", "D"], vals: [3, 5, 6, 10], max: 10, step: 2 } },
    { heading: "Formeln", body: "$$\\text{medelvärde} = \\frac{\\text{summan av alla värden}}{\\text{antal värden}}$$ Räkna alltid först summan, sedan antalet." },
    { heading: "Baklänges", body: "Medelvärdet av 4 tal är 7. Då är summan $4 \\cdot 7 = 28$. Är tre av talen 5, 8 och 6 (summa 19), är det fjärde $28 - 19 = 9$." },
    { heading: "Medelvärdet kan vara ett decimaltal", body: "Medelvärdet av 2, 3 och 4 är 3. Men av 2, 3, 4 och 5 är det $14 \\div 4 = 3{,}5$ – ett tal som inte finns i listan." },
  ],
  worked: [
    { title: "Medelvärde av en lista", problem: "Beräkna medelvärdet av 4, 8, 6, 10, 7.", steps: [{ text: "Summan:", math: "4 + 8 + 6 + 10 + 7 = 35" }, { text: "Antal tal: 5." }, { text: "Medelvärde:", math: "35 \\div 5 = 7" }], why: "Medelvärdet är den lika stora andelen om summan delas lika.", alternative: "Gissa 7 och se hur långt över/under varje tal är: −3, +1, −1, +3, 0 → summa 0." },
    { title: "Saknat värde", problem: "Medelvärdet av 5 tal är 8. Fyra av dem är 6, 9, 7 och 10. Vilket är det femte?", steps: [{ text: "Summan ska vara 5 · 8 = 40." }, { text: "De fyra ger 6 + 9 + 7 + 10 = 32." }, { text: "Femte talet: 40 − 32 = 8." }], why: "Medelvärde · antal = summa.", alternative: "Avvikelser från 8: −2, +1, −1, +2 summerar 0, så femte avviker 0." },
  ],
  drawing: { task: "Rita fem staplar med höjderna 2, 4, 6, 8, 10. Rita en linje där alla staplar jämnas ut – vilken höjd får den? (Medelvärdet.)", tool: "grid" },
  pupils: [{ pupil: "Kim", said: "Medelvärdet av 2, 4 och 12 är 4, för 4 är i mitten.", misconception: "Blandar ihop medelvärde med det mittersta talet.", response: "Låt Kim lägga ihop och dela: 2 + 4 + 12 = 18, 18 ÷ 3 = 6. Förklara att 4 är det mittersta talet (median), medelvärdet är 6." }],
  knowledge: [
    { id: "meanList", skill: "w12-l2.mean", gen: (rng) => { const a = meanData(rng, rng.int(4, 6), 2, 15); return numeric(`ml-${a.join("-")}`, "w12-l2.mean", `Beräkna medelvärdet av ${a.join(", ")}.`, meanOf(a), `Summa ${sum(a)}, antal ${a.length}: ${sum(a)} ÷ ${a.length} = ${meanOf(a)}.`, ["Lägg ihop och dela med antalet."]); } },
    { id: "meanHalf", skill: "w12-l2.mean", gen: (rng) => { const a = meanData(rng, rng.pick([4, 6]), 2, 15, true); return numeric(`mh-${a.join("-")}`, "w12-l2.mean", `Beräkna medelvärdet av ${a.join(", ")}.`, [String(meanOf(a)), fmt(meanOf(a))], `Summa ${sum(a)}, antal ${a.length}: ${sum(a)} ÷ ${a.length} = ${fmt(meanOf(a))}.`, ["Medelvärdet kan vara ett decimaltal."]); } },
    { id: "missing", skill: "w12-l2.missing", gen: (rng) => { const n = rng.int(4, 6), a = meanData(rng, n, 3, 14), m = meanOf(a), last = a[n - 1]; return numeric(`ms-${a.join("-")}`, "w12-l2.missing", `Medelvärdet av ${n} tal är ${m}. ${n - 1} av dem är ${a.slice(0, -1).join(", ")}. Vilket är det sista?`, last, `Summan ska vara ${n} · ${m} = ${n * m}. De givna ger ${sum(a.slice(0, -1))}. Sista: ${n * m} − ${sum(a.slice(0, -1))} = ${last}.`, ["Medelvärde · antal = summa."]); } },
    { id: "sumFromMean", skill: "w12-l2.missing", gen: (rng) => { const n = rng.int(3, 9), m = rng.int(4, 15); return numeric(`sf-${n}-${m}`, "w12-l2.missing", `${n} personers medelålder är ${m} år. Vad är summan av deras åldrar?`, n * m, `${n} · ${m} = ${n * m} år.`, ["Medelvärde gånger antal."], "år"); } },
    { id: "newMean", skill: "w12-l2.update", gen: (rng) => { const n = rng.int(3, 6), m = rng.int(5, 12), m2 = m + rng.int(1, 3); const v = m2 * (n + 1) - m * n; return numeric(`nm-${n}-${m}-${v}`, "w12-l2.update", `${n} elever har i medel ${m} poäng. En ny elev kommer med ${v} poäng. Vilket blir det nya medelvärdet?`, m2, `Gammal summa ${n} · ${m} = ${n * m}. Ny summa ${n * m + v}, antal ${n + 1}: ${n * m + v} ÷ ${n + 1} = ${m2}.`, ["Räkna om summan först."]); } },
    { id: "meaning", skill: "w12-l2.concept", gen: (rng) => mc("mm", "w12-l2.concept", "Vad säger medelvärdet?", "Det tal som alla värden skulle vara om de var lika stora", [{ text: "Det mittersta värdet när man sorterat", note: "Det är medianen." }, { text: "Det värde som förekommer flest gånger", note: "Det är typvärdet." }, { text: "Skillnaden mellan största och minsta värdet", note: "Det är variationsbredden." }], "Medelvärdet är summan delad lika på alla.", ["Tänk på att dela lika."], rng) },
    { id: "notInList", skill: "w12-l2.concept", gen: (rng) => mc("nl", "w12-l2.concept", "Medelvärdet av 2, 3, 4 och 5 är 3,5. Hur kan det vara ett tal som inte finns i listan?", "Medelvärdet är ett räknat tal och behöver inte vara ett av värdena", [{ text: "Det är fel – medelvärdet måste vara ett av talen" }, { text: "Man ska alltid runda till närmaste heltal" }, { text: "Man måste ha räknat fel" }], "14 ÷ 4 = 3,5. Medelvärdet kommer ur en räkning, inte ur listan.", ["Beräkna summa ÷ antal."], rng) },
  ],
  method: [
    { id: "meanSteps", skill: "w12-l2.mean", gen: (rng) => { const a = meanData(rng, rng.int(4, 6), 2, 15); return multifield(`mst-${a.join("-")}`, "w12-l2.mean", `Beräkna medelvärdet av ${a.join(", ")} i steg.`, [{ label: "Summan", accept: [sum(a)] }, { label: "Antal tal", accept: [a.length] }, { label: "Medelvärde", accept: [meanOf(a)] }], `${sum(a)} ÷ ${a.length} = ${meanOf(a)}.`, ["Summa, antal, dela."]); } },
    { id: "missingSteps", skill: "w12-l2.missing", gen: (rng) => { const n = rng.int(4, 5), a = meanData(rng, n, 3, 14), m = meanOf(a); return multifield(`mss-${a.join("-")}`, "w12-l2.missing", `Medelvärdet av ${n} tal är ${m}. ${n - 1} av dem är ${a.slice(0, -1).join(", ")}. Räkna ut det sista i steg.`, [{ label: "Summan av alla tal", accept: [n * m] }, { label: "Summan av de givna", accept: [sum(a.slice(0, -1))] }, { label: "Det sista talet", accept: [a[n - 1]] }], `${n * m} − ${sum(a.slice(0, -1))} = ${a[n - 1]}.`, ["Medelvärde · antal = summa."]); } },
  ],
  representation: [
    { id: "meanBars", skill: "w12-l2.chart", gen: (rng) => { const a = meanData(rng, 4, 2, 10), vis: Visual = { type: "barchart", cats: ["A", "B", "C", "D"], vals: a, max: 10, step: 2 };
      return withVisual(numeric(`mb-${a.join("-")}`, "w12-l2.chart", "Staplarna visar hur många poäng fyra elever fick. Vad är medelvärdet?", meanOf(a), `Staplarna: ${a.join(" + ")} = ${sum(a)}. ${sum(a)} ÷ 4 = ${meanOf(a)}.`, ["Läs av varje stapel, addera, dela med 4."]), vis); } },
    { id: "meanLine", skill: "w12-l2.chart", gen: (rng) => { const a = meanData(rng, 5, 2, 9).map((x) => x * 2); const xs = ["06", "09", "12", "15", "18"], vis: Visual = { type: "linechart", xs, ys: a, max: 20, step: 2 };
      return withVisual(numeric(`mlc-${a.join("-")}`, "w12-l2.chart", "Linjen visar temperaturen (°C) vid fem tillfällen. Vad är medeltemperaturen?", meanOf(a), `${a.join(" + ")} = ${sum(a)}. ${sum(a)} ÷ 5 = ${meanOf(a)} °C.`, ["Läs av alla fem punkter."], "°C"), vis); } },
  ],
  teacher: {
    title: "Medelvärde är inte det mittersta",
    scenarios: ["Kim (åk 5) ska ta fram medelvärdet av 2, 4 och 12. Kim säger 4, ”för det ligger i mitten”."],
    prompt: "Förklara för Kim vad medelvärde är, hur man räknar ut det för 2, 4 och 12, och vad Kim egentligen tagit fram. Varför blir medelvärdet större än 4?",
    minChars: 170,
    rubric: { minConcepts: 4, concepts: [
      { id: "summa", label: "lägg ihop alla värden (18)", any: ["18", "lägger ihop", "summan", "addera"] },
      { id: "dela", label: "dela med antalet (3)", any: ["dela", "delar", "÷ 3", "/ 3", "antalet"] },
      { id: "svar", label: "rätt medelvärde 6", any: ["6"] },
      { id: "median", label: "att Kim tog fram mittersta talet / medianen", any: ["median", "mittersta", "i mitten"] },
      { id: "stor", label: "att 12 drar upp medelvärdet", any: ["12 drar", "stort tal", "högt värde", "det stora talet", "drar upp", "12 är mycket större"] },
    ] },
    modelAnswer: "Kim, medelvärdet är det tal alla skulle ha om värdena delades lika. Man lägger ihop alla värden, 2 + 4 + 12 = 18, och delar med antalet, 18 ÷ 3 = 6. Du har tagit fram det mittersta talet, 4, som kallas median, och det är något annat. Medelvärdet blir större än 4 eftersom det stora talet 12 drar upp det.",
  },
};
