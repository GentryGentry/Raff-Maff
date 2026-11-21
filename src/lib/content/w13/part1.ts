import type { Lesson } from "../types";
import { mc, numeric, multifield, withVisual } from "@/lib/engine/gen-helpers";
import type { Rng } from "@/lib/engine/rng";

// ───────── Lektion 1: Förstå problemet och planera ─────────
function shop(rng: Rng) {
  const a = rng.int(2, 6), p = rng.int(8, 20), j = rng.int(10, 25), d = rng.int(2, 5), M = Math.ceil((a * p + j + rng.int(5, 40)) / 10) * 10;
  return { a, p, j, d, M, ans: M - (a * p + j) };
}
const MISSING: [string, string, string[]][] = [
  ["Ett tåg avgår klockan 08.15. Hur länge har det åkt när det är framme?", "Vilken tid tåget kommer fram", ["Vad tåget heter", "Hur många vagnar det har", "Färgen på tåget"]],
  ["Mia köper pennor. Hur mycket får hon betala?", "Vad en penna kostar och hur många hon köper", ["Vilken färg pennorna har", "Hur gammal Mia är", "Vilken dag det är"]],
  ["Ett rum är 4 m långt. Hur stor är golvytan?", "Hur brett rummet är", ["Hur högt det är i taket", "Vilken färg golvet har", "Hur många fönster det har"]],
];
const ASKABLE: [string, string, string[]][] = [
  ["Ett paket kostar 45 kr och du köper 4 paket.", "Vad kostar 4 paket tillsammans?", ["Hur lång tid tar det att packa upp dem?", "Hur tunga är paketen?", "Vilken butik är billigast?"]],
  ["Ett tåg går 90 km på 1 timme och åker i 3 timmar.", "Hur långt åker tåget?", ["Hur många passagerare var det?", "Vad kostade biljetten?", "Hur många stationer passerade det?"]],
  ["Ett rum är 5 m långt och 3 m brett.", "Hur stor är golvytan?", ["Hur mycket kostar golvet?", "Hur mycket väger golvet?", "Hur högt är rummet?"]],
];

export const lesson1: Lesson = {
  id: "w13-l1", worldId: "w13", title: "Förstå problemet och planera", grades: "åk 4–6",
  summary: "Vad frågas efter? Vilken information behövs, och vilken är överflödig?",
  lgr: "Strategier för att lösa matematiska problem; formulera frågeställningar",
  objectives: ["Avgöra vad ett problem frågar efter.", "Skilja nödvändig från överflödig information och se när något saknas.", "Dela upp ett problem i delsteg och kontrollera svaret mot frågan."],
  intro: "De flesta fel i textuppgifter uppstår **innan** man räknar: man har inte riktigt förstått vad som frågas. Ett bra sätt är fyra steg: **1. Förstå** (vad är känt, vad söks?), **2. Planera** (vilka delsteg?), **3. Genomför**, **4. Kontrollera** (svarar jag på frågan, och är svaret rimligt?). Alla siffror i texten behöver inte användas.",
  theory: [
    { heading: "Vad frågas efter?", body: "Läs frågan sist, men läs den **noga**. ”Hur mycket *får hon tillbaka*?” är något annat än ”Hur mycket *kostar det*?” Understryk det som söks och skriv ned enheten (kr, m, minuter)." },
    { heading: "Överflödig information", body: "Ibland innehåller texten siffror som inte behövs: ”Bullarna är 3 dagar gamla.” Fråga för varje tal: *behöver jag det för att svara på frågan?* Att räkna med alla tal är ett vanligt fel." },
    { heading: "Det som saknas", body: "Ibland går problemet **inte** att lösa: ”Ett rum är 4 m långt. Hur stor är golvytan?” Bredden saknas. Då är första steget att säga *vad som saknas*." },
    { heading: "Planera i delsteg", body: "Elin köper 3 bullar à 12 kr och en juice för 15 kr och betalar med 100 kr. Delsteg: (1) bullarna $3 \\cdot 12 = 36$, (2) allt $36 + 15 = 51$, (3) växel $100 - 51 = 49$. Skriv gärna planen innan du räknar.", visual: { type: "barmodel", rows: [{ label: "Pris", parts: 3, end: "36 kr" }], total: "51 kr tillsammans med juicen" } },
  ],
  worked: [
    { title: "Med överflödig information", problem: "Elin köper 3 bullar för 12 kr styck och en juice för 15 kr. Bullarna är 3 dagar gamla. Hon betalar med 100 kr. Hur mycket får hon tillbaka?", steps: [{ text: "Sökt: växeln. ”3 dagar gamla” behövs inte." }, { text: "Bullarna: 3 · 12 = 36 kr." }, { text: "Totalt: 36 + 15 = 51 kr." }, { text: "Växel: 100 − 51 = 49 kr." }, { text: "Kontroll: 51 + 49 = 100 ✓." }], why: "Vi svarar på det som frågas och använder bara relevant information.", alternative: "Dra av varje köp från 100 kr i tur och ordning." },
    { title: "När något saknas", problem: "Ett rum är 4 m långt. Hur stor är golvytan?", steps: [{ text: "Area = längd · bredd. Längden är känd (4 m)." }, { text: "Bredden saknas, så problemet går inte att lösa ännu." }], why: "Att upptäcka vad som saknas är en del av problemlösningen.", alternative: "Fråga eller mät det som saknas." },
  ],
  drawing: { task: "Hitta på ett eget textproblem med en överflödig uppgift. Understryk vad som frågas efter, och stryk över det som inte behövs.", tool: "grid" },
  pupils: [{ pupil: "Ella", said: "Bullarna kostar 12 kr, juicen 15, de är 3 dagar gamla och hon betalar 100. Jag lägger ihop allt: 12 + 15 + 3 + 100 = 130.", misconception: "Räknar med alla tal utan att ha förstått vad som frågas.", response: "Be Ella läsa frågan högt: ”Hur mycket får hon tillbaka?” Låt henne stryka det som inte behövs och göra en plan i delsteg." }],
  knowledge: [
    { id: "extraInfo", skill: "w13-l1.extra", gen: (rng) => { const s = shop(rng); return numeric(`ei-${s.a}-${s.p}-${s.j}-${s.M}`, "w13-l1.extra", `Elin köper ${s.a} bullar för ${s.p} kr styck och en juice för ${s.j} kr. Bullarna är ${s.d} dagar gamla. Hon betalar med ${s.M} kr. Hur mycket får hon tillbaka?`, s.ans, `${s.a} · ${s.p} = ${s.a * s.p}; ${s.a * s.p} + ${s.j} = ${s.a * s.p + s.j}; ${s.M} − ${s.a * s.p + s.j} = ${s.ans} kr. Uppgiften om dagar behövs inte.`, ["Vilken information behövs inte?"], "kr"); } },
    { id: "twoStep", skill: "w13-l1.steps", gen: (rng) => { const M = rng.int(10, 30) * 10, n = rng.int(2, 4), p = rng.int(5, 15), q = rng.int(5, 20); if (M - n * p - q < 0) return numeric("ts-fb", "w13-l1.steps", "Du har 100 kr. Du köper 2 biljetter för 30 kr styck och en popcorn för 20 kr. Hur mycket har du kvar?", 20, "100 − (60 + 20) = 20.", [], "kr");
      return numeric(`ts-${M}-${n}-${p}-${q}`, "w13-l1.steps", `Du har ${M} kr. Du köper ${n} biljetter för ${p} kr styck och en popcorn för ${q} kr. Hur mycket har du kvar?`, M - n * p - q, `${n} · ${p} = ${n * p}; ${n * p} + ${q} = ${n * p + q}; ${M} − ${n * p + q} = ${M - n * p - q} kr.`, ["Dela upp i delsteg."], "kr"); } },
    { id: "missing", skill: "w13-l1.missing", gen: (rng) => { const [q, ok, wr] = rng.pick(MISSING); return mc(`ms-${q.slice(0, 12)}`, "w13-l1.missing", `${q} Vad behöver du veta för att kunna svara?`, ok, wr.map((text) => ({ text })), `Utan ”${ok.toLowerCase()}” går det inte att lösa problemet.`, ["Vad saknas i uppgiften?"], rng); } },
    { id: "askable", skill: "w13-l1.question", gen: (rng) => { const [facts, ok, wr] = rng.pick(ASKABLE); return mc(`ak-${facts.slice(0, 12)}`, "w13-l1.question", `${facts} Vilken fråga kan du svara på med bara dessa uppgifter?`, ok, wr.map((text) => ({ text })), `Bara ”${ok}” kan besvaras med uppgifterna i texten.`, ["Vilken information har du, och vilken saknas?"], rng); } },
    { id: "sumCheck", skill: "w13-l1.check", gen: (rng) => { const s = shop(rng); const total = s.a * s.p + s.j; return numeric(`sc-${s.a}-${s.p}-${s.j}-${s.M}`, "w13-l1.check", `Elin köpte ${s.a} bullar för ${s.p} kr styck och en juice för ${s.j} kr (${s.d} dagar gamla bullar). Hur mycket kostade allt tillsammans?`, total, `${s.a} · ${s.p} + ${s.j} = ${total} kr.`, ["Vilken information hör till frågan?"], "kr"); } },
  ],
  method: [
    { id: "shopSteps", skill: "w13-l1.steps", gen: (rng) => { for (;;) { const M = rng.int(10, 30) * 10, n = rng.int(2, 4), p = rng.int(5, 15), q = rng.int(5, 20); if (M - n * p - q < 0) continue;
      return multifield(`ss-${M}-${n}-${p}-${q}`, "w13-l1.steps", `Du har ${M} kr. Du köper ${n} biljetter för ${p} kr styck och en popcorn för ${q} kr. Räkna i steg.`, [{ label: "Pris för biljetterna", suffix: "kr", accept: [n * p] }, { label: "Totalt pris", suffix: "kr", accept: [n * p + q] }, { label: "Kvar", suffix: "kr", accept: [M - n * p - q] }], `${n * p}; ${n * p + q}; ${M - n * p - q}.`, ["Ett delsteg i taget."]); } } },
  ],
  representation: [
    { id: "modelRead", skill: "w13-l1.model", gen: (rng) => { const n = rng.int(3, 8), v = rng.pick([5, 8, 12, 15]); return withVisual(numeric(`mr-${n}-${v}`, "w13-l1.model", `Varje ruta i modellen är värd ${v} kr. Hur mycket är hela modellen värd?`, n * v, `${n} rutor · ${v} kr = ${n * v} kr.`, ["Räkna rutorna."], "kr"), { type: "barmodel", rows: [{ label: "Allt", parts: n }], boxLabel: `${v}` }); } },
    { id: "chooseCalc", skill: "w13-l1.model", gen: (rng) => { const s = shop(rng); const ok = `${s.M} − (${s.a} · ${s.p} + ${s.j})`; const opts = [{ t: `${s.M} − ${s.a} · (${s.p} + ${s.j})` }, { t: `${s.M} − ${s.a} · ${s.p}` }, { t: `${s.a} · ${s.p} + ${s.j}` }];
      return mc(`cc-${s.a}-${s.p}-${s.j}-${s.M}`, "w13-l1.model", `Elin köper ${s.a} bullar för ${s.p} kr styck och en juice för ${s.j} kr. Hon betalar med ${s.M} kr. Vilken uträkning ger hennes växel?`, ok, opts.map((o) => ({ text: o.t })), `Först allt hon köper, ${s.a} · ${s.p} + ${s.j}, sedan det dras från ${s.M}.`, ["Vad ska dras från vad?"], rng); } },
  ],
  teacher: {
    title: "Alla tal ska inte användas",
    scenarios: ["Ella (åk 4) läser: ”Elin köper 3 bullar för 12 kr styck och en juice för 15 kr. Bullarna är 3 dagar gamla. Hon betalar med 100 kr. Hur mycket får hon tillbaka?” Ella adderar alla tal: 12 + 15 + 3 + 100 = 130."],
    prompt: "Förklara för Ella hur hon ska gå tillväga: vad frågan söker, vilka tal som behövs och vilka som inte gör det, hur hon planerar delstegen och hur hon kontrollerar svaret. Vad är rätt svar?",
    minChars: 190,
    rubric: { minConcepts: 4, concepts: [
      { id: "fraga", label: "läsa frågan: vad söks (växeln)", any: ["frågan", "söks", "frågar", "växel", "tillbaka"] },
      { id: "onodig", label: "att talet 3 dagar inte behövs", any: ["dagar", "behövs inte", "överflödig", "onödig", "inte nödvändig"] },
      { id: "steg", label: "delsteg (bullarna, totalt, växel)", any: ["delsteg", "steg", "först", "sedan", "36", "51"] },
      { id: "svar", label: "rätt svar 49 kr", any: ["49"] },
      { id: "kontroll", label: "kontroll (51 + 49 = 100)", any: ["kontroll", "51 + 49", "100", "rimlig", "stämmer"] },
    ] },
    modelAnswer: "Ella, läs frågan noga först: det som söks är hur mycket Elin får tillbaka, alltså växeln. Fråga dig för varje tal om det behövs. Att bullarna är 3 dagar gamla behövs inte. Gör en plan i delsteg: först bullarna, 3 · 12 = 36 kr, sedan allt tillsammans, 36 + 15 = 51 kr, och sist växeln, 100 − 51 = 49 kr. Kontrollera genom att kolla att 51 + 49 = 100 och att svaret är rimligt. Rätt svar är 49 kr.",
  },
};

// ───────── Lektion 2: Rita och modellera ─────────
const NAMES: [string, string][] = [["Mia", "Alex"], ["Eva", "Olle"], ["Sara", "Leo"], ["Noor", "Kim"]];
export const lesson2: Lesson = {
  id: "w13-l2", worldId: "w13", title: "Rita och modellera – stapelmodellen", grades: "åk 4–6",
  summary: "En enkel bild (stapelmodell) gör relationer mellan tal synliga innan man räknar.",
  lgr: "Strategier för att lösa matematiska problem; matematiska modeller",
  objectives: ["Rita en stapelmodell för del–helhet, ”gånger så många” och ”fler än”.", "Läsa ett svar ur modellen.", "Koppla modellen till en uträkning och kontrollera."],
  intro: "Ibland är en **bild** bättre än en formel. En **stapelmodell** låter dig rita talen som rutor och se hur de hänger ihop. Du räknar först efteråt. Det är **matematisk modellering**: du bygger en förenklad bild av situationen.",
  theory: [
    { heading: "”Gånger så många”", body: "Mia har 3 gånger så många kort som Alex. Tillsammans har de 48. Rita Alex som 1 ruta och Mia som 3 lika stora rutor: tillsammans 4 rutor. En ruta är $48 \\div 4 = 12$. Alex har 12 och Mia $3 \\cdot 12 = 36$.", visual: { type: "barmodel", rows: [{ label: "Alex", parts: 1 }, { label: "Mia", parts: 3 }], total: "48 tillsammans" } },
    { heading: "”Fler än”", body: "Eva har 6 fler äpplen än Olle. Tillsammans 30. Rita Olle som en stapel och Eva som samma stapel plus 6 extra. Tar du bort de 6 extra är resten $30 - 6 = 24$ två lika stora staplar: en stapel är 12. Olle har 12 och Eva 18.", visual: { type: "barmodel", rows: [{ label: "Olle", parts: 2 }, { label: "Eva", parts: 2, extra: { n: 1, label: "+6" } }], total: "30 tillsammans" } },
    { heading: "Del av helhet", body: "En klass har 25 elever och $\\tfrac{2}{5}$ cyklar. Dela helheten i 5 lika delar: varje del är $25 \\div 5 = 5$. Två delar cyklar: 10 elever. De övriga är $3 \\cdot 5 = 15$.", visual: { type: "barmodel", rows: [{ label: "Klassen", parts: 5, end: "25" }] } },
    { heading: "Kontrollera mot texten", body: "Efter beräkningen: stämmer relationen i texten? Alex 12 och Mia 36: 36 är tre gånger 12 ✓ och $12 + 36 = 48$ ✓." },
  ],
  worked: [
    { title: "Gånger så många", problem: "Mia har 3 gånger så många kort som Alex. Tillsammans 48. Hur många har Alex?", steps: [{ text: "Alex 1 ruta, Mia 3 rutor: 4 rutor." }, { text: "En ruta:", math: "48 \\div 4 = 12" }], why: "Modellen visar att helheten består av 4 lika stora delar.", alternative: "Prova och pröva: Alex 10 → Mia 30 → 40; Alex 12 → 48 ✓." },
    { title: "Fler än", problem: "Eva har 6 fler äpplen än Olle. Tillsammans 30. Hur många har Olle?", steps: [{ text: "Ta bort de 6 extra: 30 − 6 = 24." }, { text: "Dela lika:", math: "24 \\div 2 = 12" }], why: "Utan skillnaden är de lika många.", alternative: "Lägg till 6 i stället? Olle 12, Eva 18: summa 30 ✓." },
  ],
  drawing: { task: "Rita en stapelmodell: Kim har 4 gånger så många pärlor som Noor, tillsammans 60. Hur många har var och en?", tool: "grid" },
  pupils: [{ pupil: "Jon", said: "Mia har 3 gånger så många som Alex, tillsammans 48. Då är det 48 ÷ 3 = 16, så Mia har 16.", misconception: "Delar med 3 i stället för med antalet delar totalt (4).", response: "Låt Jon rita: Alex 1 ruta, Mia 3 rutor. Hur många rutor är det totalt? Dela 48 med 4." }],
  knowledge: [
    { id: "ratio", skill: "w13-l2.ratio", gen: (rng) => { const k = rng.int(2, 5), u = rng.int(3, 15), T = (k + 1) * u, [big, small] = rng.pick(NAMES), who = rng.pick([small, big]);
      return withVisual(numeric(`ra-${k}-${T}-${who}`, "w13-l2.ratio", `${big} har ${k} gånger så många kort som ${small}. Tillsammans har de ${T} kort. Hur många kort har ${who}?`, who === small ? u : k * u, `${k + 1} lika stora delar: ${T} ÷ ${k + 1} = ${u}. ${small} har ${u}, ${big} har ${k * u}.`, ["Rita staplar: hur många lika delar är det totalt?"]), { type: "barmodel", rows: [{ label: small, parts: 1 }, { label: big, parts: k }], total: `${T} tillsammans` }); } },
    { id: "diff", skill: "w13-l2.diff", gen: (rng) => { const d = rng.int(2, 10), u = rng.int(4, 20), T = 2 * u + d, [big, small] = rng.pick(NAMES), who = rng.pick([small, big]);
      return withVisual(numeric(`df-${d}-${T}-${who}`, "w13-l2.diff", `${big} har ${d} fler äpplen än ${small}. Tillsammans har de ${T} äpplen. Hur många äpplen har ${who}?`, who === small ? u : u + d, `${T} − ${d} = ${T - d}; ${T - d} ÷ 2 = ${u}. ${small} har ${u}, ${big} har ${u + d}.`, ["Ta bort skillnaden först."]), { type: "barmodel", rows: [{ label: small, parts: 2 }, { label: big, parts: 2, extra: { n: 1, label: `+${d}` } }], total: `${T} tillsammans` }); } },
    { id: "fraction", skill: "w13-l2.fraction", gen: (rng) => { const b = rng.pick([4, 5, 8, 10]), a = rng.int(1, b - 1), N = b * rng.int(2, 8); return withVisual(numeric(`fr-${a}-${b}-${N}`, "w13-l2.fraction", `En klass har ${N} elever. ${a}/${b} av dem cyklar till skolan. Hur många elever cyklar inte?`, N - (N / b) * a, `Varje del är ${N} ÷ ${b} = ${N / b}. ${a} delar cyklar: ${(N / b) * a}. Övriga: ${N} − ${(N / b) * a} = ${N - (N / b) * a}.`, ["Dela helheten i lika många delar som nämnaren."]), { type: "barmodel", rows: [{ label: "Klassen", parts: b, end: String(N) }] }); } },
    { id: "unitValue", skill: "w13-l2.unit", gen: (rng) => { const n = rng.int(3, 8), v = rng.int(2, 9) * 5; return withVisual(numeric(`uv-${n}-${v}`, "w13-l2.unit", `Modellen visar ${n} lika stora delar som tillsammans är ${n * v}. Hur mycket är en del?`, v, `${n * v} ÷ ${n} = ${v}.`, ["Dela helheten med antal delar."]), { type: "barmodel", rows: [{ label: "Allt", parts: n, end: String(n * v) }] }); } },
    { id: "chooseModel", skill: "w13-l2.choose", gen: (rng) => mc("cm", "w13-l2.choose", "Emil har dubbelt så många kulor som Ida. Vilken modell passar?", "Ida 1 ruta, Emil 2 lika stora rutor", [{ text: "Ida 2 rutor, Emil 1 ruta" }, { text: "Ida och Emil har lika många rutor" }, { text: "Emil 1 ruta, Ida 3 rutor" }], "Dubbelt så många betyder två lika stora delar mot en.", ["Vem har fler?"], rng) },
  ],
  method: [
    { id: "ratioSteps", skill: "w13-l2.ratio", gen: (rng) => { const k = rng.int(2, 5), u = rng.int(3, 15), T = (k + 1) * u, [big, small] = rng.pick(NAMES); return multifield(`rst-${k}-${T}`, "w13-l2.ratio", `${big} har ${k} gånger så många kort som ${small}. Tillsammans har de ${T} kort. Räkna i steg.`, [{ label: "Antal lika stora delar totalt", accept: [k + 1] }, { label: `Så många kort är en del (${small})`, accept: [u] }, { label: `${big}s kort`, accept: [k * u] }], `${k + 1} delar; ${u}; ${k * u}.`, ["Rita först."]); } },
  ],
  representation: [
    { id: "readRatio", skill: "w13-l2.picture", gen: (rng) => { const k = rng.int(2, 4), v = rng.int(2, 9) * 2; return withVisual(numeric(`rd-${k}-${v}`, "w13-l2.picture", `Modellen visar två staplar. Varje ruta är värd ${v}. Hur mycket är den längre stapeln värd?`, k * v, `${k} rutor · ${v} = ${k * v}.`, ["Räkna rutorna i den längre stapeln."]), { type: "barmodel", rows: [{ label: "Kort", parts: 1 }, { label: "Lång", parts: k }], boxLabel: String(v) }); } },
    { id: "readDiff", skill: "w13-l2.picture", gen: (rng) => { const u = rng.int(3, 9), d = rng.int(2, 6); return withVisual(numeric(`rf-${u}-${d}`, "w13-l2.picture", `Båda staplarna började lika stora, men den undre har fått ${d} extra. Den övre stapeln är ${u}. Hur stor är den undre?`, u + d, `${u} + ${d} = ${u + d}.`, ["Lägg till de extra."]), { type: "barmodel", rows: [{ label: "Övre", parts: 2, end: String(u) }, { label: "Undre", parts: 2, extra: { n: 1, label: `+${d}` } }] }); } },
  ],
  teacher: {
    title: "Dela med rätt tal",
    scenarios: ["Jon (åk 5) löser: ”Mia har 3 gånger så många kort som Alex. Tillsammans har de 48 kort.” Han räknar 48 ÷ 3 = 16 och svarar att Mia har 16."],
    prompt: "Förklara för Jon hur en stapelmodell visar hur många delar helheten består av, vad som är fel i hans uträkning, och räkna rätt hur många kort var och en har. Hur kontrollerar han?",
    minChars: 190,
    rubric: { minConcepts: 4, concepts: [
      { id: "delar", label: "4 lika stora delar (1 + 3)", any: ["4 delar", "fyra delar", "4 rutor", "fyra rutor", "1 + 3", "1+3"] },
      { id: "alex", label: "Alex har 12", any: ["12"] },
      { id: "mia", label: "Mia har 36", any: ["36"] },
      { id: "modell", label: "rita staplar/modell", any: ["rita", "stapel", "modell", "rutor"] },
      { id: "kontroll", label: "kontroll (12 + 36 = 48, tre gånger så många)", any: ["12 + 36", "kontroll", "tre gånger", "3 · 12", "3·12", "stämmer"] },
    ] },
    modelAnswer: "Jon, rita en stapelmodell: Alex får 1 ruta och Mia 3 lika stora rutor. Då är det 4 lika stora delar tillsammans, inte 3, så du ska dela 48 med 4: 48 ÷ 4 = 12. Alex har 12 kort och Mia 3 · 12 = 36. Kontrollera: 12 + 36 = 48 och 36 är tre gånger 12, så båda villkoren i texten stämmer.",
  },
};

// ───────── Lektion 3: Prova och pröva ─────────
function pairs(S: number, P: number) { const r: number[][] = []; for (let a = 1; a < S; a++) if (a * (S - a) === P && a < S - a) r.push([a, S - a]); return r; }
export const lesson3: Lesson = {
  id: "w13-l3", worldId: "w13", title: "Prova och pröva – systematiskt", grades: "åk 4–6",
  summary: "Gissa med plan: pröva, se hur nära du kom och justera. Skriv ned försöken.",
  lgr: "Strategier för att lösa matematiska problem: pröva sig fram, systematisk lista",
  objectives: ["Pröva sig fram med nästa försök styrt av det förra.", "Föra en tabell över försöken.", "Kontrollera att alla villkor stämmer."],
  intro: "**Prova och pröva** är inte vilda gissningar. Det är en metod: du gör ett första försök, ser *hur långt fel* det blev och väljer nästa försök därefter. Med en tabell över försöken ser du mönstret och hittar svaret snabbt.",
  theory: [
    { heading: "Ett försök leder till nästa", body: "Två tal har summan 12 och produkten 35. Prova 6 och 6: produkt 36 (för stor, nästan). Prova 5 och 7: produkt 35 ✓. Du ser riktningen: produkten sjunker när talen glider isär." },
    { heading: "Tabell", body: "Skriv upp försöken: \n\n(1,11): 11 – för liten. (2,10): 20. (3,9): 27. (4,8): 32. (5,7): 35 ✓. En tabell hindrar dig från att prova samma sak två gånger." },
    { heading: "Hönor och kor", body: "På en gård ser man 10 huvuden och 28 ben. Hönor har 2 ben, kor 4. Börja med att ge alla djur 2 ben: 20 ben. Det saknas $28 - 20 = 8$ ben. Varje ko har 2 extra ben: $8 \\div 2 = 4$ kor.", visual: { type: "barmodel", rows: [{ label: "Djur", parts: 10, end: "2 ben var" }], total: "alla har minst 2 ben" } },
    { heading: "Kontrollera alla villkor", body: "Svaret ska uppfylla **alla** villkor. 5 och 7: summan 12 ✓, produkten 35 ✓. Kontrollera alltid mot texten." },
  ],
  worked: [
    { title: "Summa och produkt", problem: "Två heltal har summan 14 och produkten 45. Vilka?", steps: [{ text: "Prova 7 och 7: produkt 49 – för stor." }, { text: "Prova 6 och 8: 48 – fortfarande för stor. 5 och 9: 45 ✓." }, { text: "Kontroll: 5 + 9 = 14 ✓." }], why: "Produkten minskar när talen glider isär, så vi vet åt vilket håll vi ska pröva.", alternative: "Lista alla par som summerar till 14." },
    { title: "Hönor och kor", problem: "8 djur har 22 ben (hönor 2 ben, kor 4). Hur många kor?", steps: [{ text: "Alla har 2 ben: 16 ben. Saknas 6." }, { text: "2 extra ben per ko: 3 kor." }, { text: "Kontroll: 3 kor (12 ben) + 5 hönor (10) = 22 ✓." }], why: "Vi startar i ett läge som nästan stämmer och justerar.", alternative: "Pröva antal kor 1, 2, 3 … tills benen stämmer." },
  ],
  drawing: { task: "Gör en tabell: två tal har summan 16 och produkten 63. Skriv upp varje försök och se hur produkten förändras.", tool: "grid" },
  pupils: [{ pupil: "Siri", said: "Jag gissade 3 och 9 (summan 12 och produkten 27), men det blev fel, så jag vet inte vad jag ska göra.", misconception: "Ser inte att ett försök ger information om nästa.", response: "Fråga: ”Var produkten för stor eller för liten?” 27 är för liten, så talen måste ligga närmare varandra." }],
  knowledge: [
    { id: "sumProd", skill: "w13-l3.pairs", gen: (rng) => { for (;;) { const a = rng.int(2, 11), b = rng.int(a + 1, 14), S = a + b, P = a * b; if (pairs(S, P).length === 1) return numeric(`sp-${S}-${P}`, "w13-l3.pairs", `Två heltal har summan ${S} och produkten ${P}. Vilket är det mindre talet?`, a, `${a} och ${b}: ${a} + ${b} = ${S} och ${a} · ${b} = ${P}.`, ["Prova par med summan " + S + " och se vad produkten blir."]); } } },
    { id: "animals", skill: "w13-l3.animals", gen: (rng) => { const H = rng.int(5, 12), c = rng.int(1, H - 1), L = 2 * (H - c) + 4 * c; return numeric(`an-${H}-${L}`, "w13-l3.animals", `På en gård finns hönor (2 ben) och kor (4 ben). Man ser ${H} huvuden och ${L} ben. Hur många kor finns det?`, c, `Alla djur har 2 ben: ${2 * H}. Saknas ${L - 2 * H}, två per ko: ${c} kor.`, ["Ge alla 2 ben först."]); } },
    { id: "digits", skill: "w13-l3.digits", gen: (rng) => { for (;;) { const n = rng.int(12, 98); const a = Math.floor(n / 10), b = n % 10; if (a === 0 || b === 0 || a === b) continue; const s = a + b, p = a * b; const cands = []; for (let m = 10; m < 100; m++) if (Math.floor(m / 10) + (m % 10) === s && Math.floor(m / 10) * (m % 10) === p) cands.push(m);
      return numeric(`dg-${s}-${p}`, "w13-l3.digits", `Ett tvåsiffrigt tal har siffersumman ${s} och siffrorna har produkten ${p}. Vilket är det största talet?`, Math.max(...cands), `Siffrorna är ${a} och ${b}. Talen är ${cands.join(" och ")}. Största: ${Math.max(...cands)}.`, ["Vilka siffror har summan och produkten?"]); } } },
    { id: "ages", skill: "w13-l3.ages", gen: (rng) => { const a = rng.int(5, 12), d = rng.int(2, 6), S = 5 * a + 2 * d; return numeric(`ag-${d}-${S}`, "w13-l3.ages", `Pappa är 4 gånger så gammal som Anna. Om ${d} år är deras åldrar tillsammans ${S} år. Hur gammal är Anna nu?`, a, `Nu: Anna ${a}, pappa ${4 * a}. Om ${d} år: ${a + d} + ${4 * a + d} = ${S} ✓.`, ["Pröva olika åldrar för Anna."]); } },
    { id: "strategy", skill: "w13-l3.concept", gen: (rng) => mc("st", "w13-l3.concept", "Vad skiljer ett bra ”prova och pröva” från en ren gissning?", "Nästa försök väljs utifrån hur fel det förra blev", [{ text: "Man provar tal i slumpmässig ordning" }, { text: "Man provar bara jämna tal" }, { text: "Man slutar när man fått ett svar, utan att kontrollera" }], "Metoden använder resultatet av varje försök för att styra nästa.", ["Vad lär du dig av ett försök?"], rng) },
  ],
  method: [
    { id: "trialSteps", skill: "w13-l3.pairs", gen: (rng) => { for (;;) { const a = rng.int(2, 9), b = rng.int(a + 1, 12), S = a + b, P = a * b; const t1 = rng.int(1, Math.floor((S - 1) / 2)), t2 = rng.int(1, Math.floor((S - 1) / 2)); if (t1 === t2 || pairs(S, P).length !== 1) continue;
      return multifield(`ts-${S}-${P}-${t1}-${t2}`, "w13-l3.pairs", `Två heltal har summan ${S} och produkten ${P}. Prova först ${t1} och ${S - t1}, sedan ${t2} och ${S - t2}.`, [{ label: `Produkt för ${t1} och ${S - t1}`, accept: [t1 * (S - t1)] }, { label: `Produkt för ${t2} och ${S - t2}`, accept: [t2 * (S - t2)] }, { label: "Det mindre talet", accept: [a] }], `${t1 * (S - t1)}; ${t2 * (S - t2)}; svar ${a} och ${b}.`, ["Räkna produkten för varje försök."]); } } },
  ],
  representation: [
    { id: "animalModel", skill: "w13-l3.model", gen: (rng) => { const H = rng.int(4, 8), c = rng.int(1, H - 1), L = 2 * H + 2 * c; return withVisual(numeric(`am-${H}-${L}`, "w13-l3.model", `Det finns ${H} djur (hönor med 2 ben och kor med 4 ben) och ${L} ben tillsammans. Modellen ger varje djur 2 ben. Hur många kor är det?`, c, `${2 * H} ben är fördelade. Resten ${L - 2 * H} ben ger 2 extra till varje ko: ${c} kor.`, ["Hur många ben är kvar att fördela, och hur många får varje ko?"]), { type: "barmodel", rows: [{ label: "Djur", parts: H }], boxLabel: "2 ben", total: `${2 * H} ben hittills` }); } },
  ],
  teacher: {
    title: "Gissa med plan",
    scenarios: ["Siri (åk 5) ska hitta två tal med summan 12 och produkten 35. Hon provar 3 och 9 (produkt 27) och säger att det är fel och att hon ger upp."],
    prompt: "Förklara för Siri hur man provar sig fram systematiskt: vad försöket 3 och 9 ger för information, vad nästa försök bör vara, hur man för ned försöken och vilka två tal som är rätt.",
    minChars: 190,
    rubric: { minConcepts: 4, concepts: [
      { id: "info", label: "att produkten 27 är för liten", any: ["för liten", "för lite", "27 är", "för låg"] },
      { id: "riktning", label: "justera: talen närmare varandra", any: ["närmare", "närmare varandra", "ligga närmare", "justera", "ändra"] },
      { id: "tabell", label: "tabell/lista över försök", any: ["tabell", "lista", "skriv ned", "skriva upp", "anteckna"] },
      { id: "svar", label: "rätt tal 5 och 7", any: ["5 och 7", "7 och 5", "5, 7"] },
      { id: "kontroll", label: "kontroll av alla villkor (summan 12, produkten 35)", any: ["kontroll", "summan", "båda villkoren", "stämmer", "12"] },
    ] },
    modelAnswer: "Siri, att 3 och 9 gav produkten 27 är värdefull information: produkten var för liten, vilket betyder att talen ska ligga närmare varandra. Justera därför och prova 4 och 8, som ger 32, och sedan 5 och 7, som ger 35. Skriv ned varje försök i en tabell så att du inte provar samma igen och ser mönstret. Rätt tal är 5 och 7. Kontrollera båda villkoren: 5 + 7 = 12 och 5 · 7 = 35, så det stämmer.",
  },
};
