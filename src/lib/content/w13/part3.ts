import type { Lesson } from "../types";
import { mc, numeric, multifield, withVisual, dcTrim, pctOf, gcd } from "@/lib/engine/gen-helpers";
import type { Rng } from "@/lib/engine/rng";

const rnd = (n: number, to: number) => Math.round(n / to) * to;

// ───────── Lektion 6: Rimlighet och kontroll ─────────
function tieFree(rng: Rng, lo: number, hi: number, to: number) { for (;;) { const n = rng.int(lo, hi); if (n % to !== to / 2) return n; } }
export const lesson6: Lesson = {
  id: "w13-l6", worldId: "w13", title: "Rimlighet, överslag och kontroll", grades: "åk 4–6",
  summary: "Avrunda, uppskatta och kontrollera med motsatt räknesätt innan du litar på ett svar.",
  lgr: "Bedöma rimlighet i resultat; överslagsräkning; kontroll",
  objectives: ["Göra överslag genom att avrunda.", "Bedöma om ett svar är rimligt (storleksordning, decimalkommats plats).", "Kontrollera ett resultat med det motsatta räknesättet."],
  intro: "Ett svar är inte klart förrän du har frågat *”kan det stämma?”* Det tar några sekunder: gör ett **överslag**, jämför med svaret och kontrollera med ett **motsatt räknesätt**. Så fångar du fel med kommat, med noll för mycket eller med fel räknesätt.",
  theory: [
    { heading: "Överslag", body: "Avrunda talen så att de blir lätta att räkna med. $48 + 73 + 21 \\approx 50 + 70 + 20 = 140$. Det exakta svaret 142 ligger nära. Överslaget säger att svaret ska vara *ungefär* 140 – inte 14 eller 1 400." },
    { heading: "Produkter", body: "$398 \\cdot 21 \\approx 400 \\cdot 20 = 8\\,000$. Exakt: $8\\,358$. Avrunda **uppåt** ett tal och **nedåt** ett annat? Då är det svårt att veta om överslaget är för högt eller lågt. Avrundar du *båda* uppåt är svaret mindre än överslaget; *båda* nedåt är det större.", visual: { type: "balance", left: "42 · 31", right: "40 · 30", tilt: "left" } },
    { heading: "Decimalkommats plats", body: "$4{,}8 \\cdot 5{,}1$: överslag $5 \\cdot 5 = 25$. Svaret är alltså ungefär 25, så $24{,}48$ är rimligt men $2{,}448$ eller $244{,}8$ är det inte. Det är det snabbaste sättet att kontrollera kommat." },
    { heading: "Motsatt räknesätt", body: "Elin räknar $1\\,296 \\div 12 = 118$. Kontroll: $118 \\cdot 12 = 1\\,416$, inte 1 296, så det stämmer inte. Rätt: $108 \\cdot 12 = 1\\,296$ ✓." },
  ],
  worked: [
    { title: "Överslag", problem: "Gör ett överslag för 398 · 21.", steps: [{ text: "Avrunda: 398 ≈ 400 och 21 ≈ 20." }, { text: "Multiplicera:", math: "400 \\cdot 20 = 8\\,000" }], why: "Runda till tal som du kan räkna i huvudet.", alternative: "400 · 21 = 8 400; svaret är lite mindre, eftersom 398 < 400." },
    { title: "Kommat", problem: "Vilket svar är rimligt för 4,8 · 5,1: 2,448 eller 24,48 eller 244,8?", steps: [{ text: "Överslag: 5 · 5 = 25." }, { text: "24,48 ligger nära 25. De andra är 10 gånger för små eller stora." }], why: "Storleksordningen avgör var kommat ska stå.", alternative: "Räkna 48 · 51 = 2 448 och placera kommat efter två decimaler: 24,48." },
  ],
  drawing: { task: "Rita en tallinje och markera överslaget och det exakta svaret för 38 + 47. Hur långt ifrån varandra är de?", tool: "numberline" },
  pupils: [{ pupil: "Linnea", said: "4,8 · 5,1 = 2,448. Jag räknade noga, så det måste stämma.", misconception: "Kontrollerar inte storleksordningen – litar på uträkningen.", response: "Be Linnea göra överslag: 5 · 5 = 25. Då är 2,448 alldeles för litet. Kommat hamnade fel; rätt svar är 24,48." }],
  knowledge: [
    { id: "roundSum", skill: "w13-l6.estimate", gen: (rng) => { const a = tieFree(rng, 11, 99, 10), b = tieFree(rng, 11, 99, 10), c = tieFree(rng, 11, 99, 10); const e = rnd(a, 10) + rnd(b, 10) + rnd(c, 10); return numeric(`rs-${a}-${b}-${c}`, "w13-l6.estimate", `Gör ett överslag genom att avrunda varje tal till närmaste tiotal: ${a} + ${b} + ${c}. Vad blir överslaget?`, e, `${rnd(a, 10)} + ${rnd(b, 10)} + ${rnd(c, 10)} = ${e}.`, ["Avrunda varje tal först."]); } },
    { id: "roundMul", skill: "w13-l6.estimate", gen: (rng) => { const a = tieFree(rng, 120, 980, 100), b = tieFree(rng, 11, 98, 10); const e = rnd(a, 100) * rnd(b, 10); return numeric(`rm-${a}-${b}`, "w13-l6.estimate", `Avrunda ${a} till närmaste hundratal och ${b} till närmaste tiotal. Vad blir överslaget för ${a} · ${b}?`, e, `${rnd(a, 100)} · ${rnd(b, 10)} = ${e}.`, ["Avrunda först, multiplicera sedan."]); } },
    { id: "decimalMc", skill: "w13-l6.decimal", gen: (rng) => { const a = rng.int(21, 79), b = rng.int(21, 79), N = a * b; return mc(`dm-${a}-${b}`, "w13-l6.decimal", `Vilket svar är rimligt för ${dcTrim(a, 1)} · ${dcTrim(b, 1)}? Uppskatta – räkna inte exakt.`, dcTrim(N, 2), [{ text: dcTrim(N, 1), note: "Kommat står fel – överslaget visar det." }, { text: dcTrim(N, 3) }, { text: dcTrim(N, 0) }], `Överslag ${Math.round(a / 10)} · ${Math.round(b / 10)} = ${Math.round(a / 10) * Math.round(b / 10)}. Det exakta svaret är ${dcTrim(N, 2)}.`, ["Avrunda till heltal och multiplicera."], rng); } },
    { id: "inverse", skill: "w13-l6.inverse", gen: (rng) => { const b = rng.int(3, 15), c0 = rng.int(6, 40), a = b * c0, right = rng.chance(0.5), c = right ? c0 : c0 + rng.pick([-3, -2, -1, 1, 2, 3]);
      return mc(`iv-${a}-${b}-${c}`, "w13-l6.inverse", `Elin räknade ${a} ÷ ${b} = ${c}. Är det rätt?`, right ? "Ja – det stämmer" : "Nej – det stämmer inte", [{ text: right ? "Nej – det stämmer inte" : "Ja – det stämmer" }, { text: "Går inte att kontrollera" }], `Kontroll med multiplikation: ${c} · ${b} = ${c * b}${right ? ` = ${a} ✓` : `, inte ${a}`}.`, ["Multiplicera kvoten med delaren."], rng); } },
    { id: "bigOrSmall", skill: "w13-l6.direction", gen: (rng) => { const down = rng.chance(0.5), da = rng.int(1, 4), db = rng.int(1, 4), a = down ? 40 + da : 50 - da, b = down ? 30 + db : 30 - db; const est = (down ? 40 : 50) * 30; const sign = a * b > est ? ">" : "<";
      return withVisual(mc(`bs-${a}-${b}`, "w13-l6.direction", `Är ${a} · ${b} större eller mindre än överslaget ${est.toString()}? (Avrundningen gjordes till närmaste tiotal.)`, sign, ["<", ">"].filter((x) => x !== sign).map((text) => ({ text })), `Båda talen avrundades ${down ? "nedåt" : "uppåt"}, så den exakta produkten är ${down ? "större" : "mindre"} än överslaget.`, ["Avrundades talen uppåt eller nedåt?"], rng), { type: "balance", left: `${a} · ${b}`, right: String(est), tilt: a * b > est ? "left" : "right" }); } },
  ],
  method: [
    { id: "estimateSteps", skill: "w13-l6.estimate", gen: (rng) => { const a = tieFree(rng, 11, 99, 10), b = tieFree(rng, 11, 99, 10); return multifield(`es-${a}-${b}`, "w13-l6.estimate", `Gör ett överslag för ${a} · ${b} genom att avrunda båda tal till närmaste tiotal. Räkna i steg.`, [{ label: `${a} avrundat`, accept: [rnd(a, 10)] }, { label: `${b} avrundat`, accept: [rnd(b, 10)] }, { label: "Överslag", accept: [rnd(a, 10) * rnd(b, 10)] }], `${rnd(a, 10)} · ${rnd(b, 10)} = ${rnd(a, 10) * rnd(b, 10)}.`, ["Avrunda först."]); } },
  ],
  representation: [
    { id: "balanceEstimate", skill: "w13-l6.picture", gen: (rng) => { const down = rng.chance(0.5), da = rng.int(1, 4), db = rng.int(1, 4), a = down ? 20 + da : 30 - da, b = down ? 50 + db : 40 - db, est = (down ? 20 : 30) * (down ? 50 : 40);
      return withVisual(numeric(`be-${a}-${b}`, "w13-l6.picture", `Vågen jämför ${a} · ${b} med ett överslag. Vad är överslaget (avrunda till närmaste tiotal)?`, rnd(a, 10) * rnd(b, 10), `${rnd(a, 10)} · ${rnd(b, 10)} = ${rnd(a, 10) * rnd(b, 10)}.`, ["Avrunda båda tal."]), { type: "balance", left: `${a} · ${b}`, right: `${est}`, tilt: a * b > est ? "left" : "right" }); } },
  ],
  teacher: {
    title: "”Jag räknade noga”",
    scenarios: ["Linnea (åk 6) har räknat 4,8 · 5,1 = 2,448. Hon säger att hon räknat noga och därför är säker på svaret."],
    prompt: "Förklara för Linnea hur ett överslag visar att svaret är orimligt, vad svaret ungefär borde bli, vad som troligen gick fel och vad det rätta svaret är.",
    minChars: 190,
    rubric: { minConcepts: 4, concepts: [
      { id: "overslag", label: "överslag/avrunda (5 · 5 = 25)", any: ["överslag", "avrunda", "5 · 5", "5·5", "ungefär 25"] },
      { id: "orimlig", label: "2,448 är för litet/orimligt", any: ["för litet", "orimlig", "för lågt", "stämmer inte", "inte rimlig"] },
      { id: "komma", label: "decimalkommat står fel", any: ["komma", "decimal", "kommat"] },
      { id: "svar", label: "rätt svar 24,48", any: ["24,48"] },
      { id: "kontroll", label: "kontroll alltid efteråt", any: ["kontroll", "kolla", "alltid", "efteråt"] },
    ] },
    modelAnswer: "Linnea, att räkna noga är bra, men man ska alltid kontrollera att svaret är rimligt. Gör ett överslag: 4,8 är ungefär 5 och 5,1 är ungefär 5, och 5 · 5 = 25. Svaret borde alltså vara ungefär 25, och 2,448 är alldeles för litet, orimligt. Det som troligen gick fel är decimalkommat: siffrorna 2448 stämmer men kommat ska stå efter två decimaler, så rätt svar är 24,48. Gör en sådan kontroll varje gång.",
  },
};

// ───────── Lektion 7: Välj strategi ─────────
const STRAT: [string, string][] = [
  ["Du vet vad du fick efter flera räknesteg och söker talet du började med.", "Arbeta baklänges"],
  ["Tillsammans har två personer 60 kr och den ena har 3 gånger så mycket som den andra.", "Rita en modell"],
  ["Hitta två tal med summan 20 och produkten 91.", "Prova och pröva"],
  ["Hur många olika sätt kan 5 personer sitta på en bänk? Du vill vara säker på att få med allt.", "Gör en systematisk lista eller tabell"],
  ["Figur 1 har 3 rutor, figur 2 har 5, figur 3 har 7. Hur många rutor har figur 20?", "Hitta ett mönster"],
  ["Ett problem med mycket stora tal där du inte ser vad som händer.", "Förenkla med mindre tal"],
];
const STRATS = STRAT.map(([, s]) => s);
const dd = (n: number) => String(n).padStart(2, "0");

export const lesson7: Lesson = {
  id: "w13-l7", worldId: "w13", title: "Välj strategi – blandade problem", grades: "åk 4–6",
  summary: "Rita, pröva, arbeta baklänges, göra listor, hitta mönster eller förenkla – och kontrollera.",
  lgr: "Strategier för att lösa matematiska problem; val av metod; digitala verktyg",
  objectives: ["Välja en strategi som passar problemet.", "Lösa blandade problem i flera steg.", "Förklara varför strategin fungerar och kontrollera svaret."],
  intro: "Du har nu en verktygslåda: **rita en modell**, **prova och pröva**, **arbeta baklänges**, **göra en lista eller tabell**, **hitta ett mönster** och **förenkla med mindre tal**. Skickligheten ligger i att *välja* verktyget. En bra tumregel: om du fastnar, prova en annan strategi i stället för att göra samma sak igen.",
  theory: [
    { heading: "Verktygslådan", body: "**Rita** när det finns delar och helhet. **Prova och pröva** när du kan kontrollera ett förslag. **Baklänges** när slutet är känt. **Lista/tabell** när du ska hitta *alla* möjligheter. **Mönster** när något växer steg för steg. **Förenkla** när talen är krångliga: lös först med små tal." },
    { heading: "Flera steg", body: "En jacka kostar 800 kr och har 25 % rabatt. Rabatten är $\\tfrac{25}{100} \\cdot 800 = 200$ kr, och jackan kostar $800 - 200 = 600$ kr. Dela upp problemet: först rabatten, sedan priset." },
    { heading: "Proportionellt", body: "Ett recept för 4 personer kräver 200 g mjöl. För 10 personer: för 1 person $200 \\div 4 = 50$ g, för 10 personer $10 \\cdot 50 = 500$ g." },
    { heading: "Kontrollera alltid", body: "Svarar jag på frågan? Är svaret rimligt (överslag)? Stämmer det med alla uppgifter i texten? Kan jag lösa det på ett annat sätt och få samma svar?" },
  ],
  worked: [
    { title: "Rabatt", problem: "En jacka kostar 800 kr och har 25 % rabatt. Vad kostar den nu?", steps: [{ text: "25 % av 800 = 200 kr." }, { text: "800 − 200 = 600 kr." }, { text: "Kontroll: 75 % av 800 = 600 ✓." }], why: "Två steg: rabatten, sedan priset.", alternative: "Räkna direkt 75 % av 800 = 600." },
    { title: "Tåg", problem: "Tåget avgår 14.35 och resan tar 95 minuter. När är det framme?", steps: [{ text: "14.35 + 25 min = 15.00." }, { text: "Resten: 95 − 25 = 70 min = 1 h 10 min." }, { text: "15.00 + 1 h 10 min = 16.10." }], why: "Gå via hel timme.", alternative: "1 h 35 min på 14.35 = 16.10." },
  ],
  drawing: { task: "Välj ett problem du tycker är svårt och prova två olika strategier på det. Vilken passade bäst och varför?", tool: "grid" },
  pupils: [{ pupil: "Lisa", said: "Jag fastnade, så jag är dålig på det här. Jag tänker bara om och om igen på samma sätt.", misconception: "Tror att man antingen ”kan” eller ”inte kan”, och byter inte strategi när det fastnar.", response: "Fråga: ”Vilka andra sätt finns det att angripa det?” Låt Lisa rita, prova med små tal eller arbeta baklänges. Att fastna är normalt, men man byter strategi." }],
  knowledge: [
    { id: "strategyMc", skill: "w13-l7.strategy", gen: (rng) => { const [p, ok] = rng.pick(STRAT); return mc(`sm-${ok}`, "w13-l7.strategy", `${p} Vilken strategi passar bäst?`, ok, rng.shuffle(STRATS.filter((x) => x !== ok)).slice(0, 3).map((text) => ({ text })), `Här passar ”${ok.toLowerCase()}” bäst.`, ["Vad är känt och vad söks?"], rng); } },
    { id: "discount", skill: "w13-l7.percent", gen: (rng) => { const R = rng.pick([10, 20, 25, 50]), P = (100 / gcd(R, 100)) * rng.int(2, 12) * 10; const pr = P - pctOf(R, P); return numeric(`dc-${P}-${R}`, "w13-l7.percent", `En jacka kostar ${P} kr. Den är nedsatt med ${R} %. Vad kostar jackan nu?`, pr, `${R} % av ${P} = ${pctOf(R, P)}. ${P} − ${pctOf(R, P)} = ${pr} kr.`, ["Räkna först rabatten."], "kr"); } },
    { id: "recipe", skill: "w13-l7.proportion", gen: (rng) => { const u = rng.int(2, 9) * 10, n = rng.pick([2, 6, 8, 10, 12]); return numeric(`rc-${u}-${n}`, "w13-l7.proportion", `Ett recept för 4 personer kräver ${4 * u} g mjöl. Hur mycket mjöl behövs för ${n} personer?`, u * n, `Per person ${u} g. ${n} · ${u} = ${u * n} g.`, ["Hur mycket per person?"], "g"); } },
    { id: "train", skill: "w13-l7.time", gen: (rng) => { for (;;) { const h = rng.int(6, 20), m = rng.int(0, 11) * 5, d = rng.int(4, 30) * 5, t = h * 60 + m + d; if (t < 24 * 60) return numeric(`tr-${h}-${m}-${d}`, "w13-l7.time", `Tåget avgår ${dd(h)}.${dd(m)} och resan tar ${d} minuter. När är tåget framme? Skriv som tt.mm.`, `${dd(Math.floor(t / 60))}.${dd(t % 60)}`, `${dd(h)}.${dd(m)} + ${d} min = ${dd(Math.floor(t / 60))}.${dd(t % 60)}.`, ["Gå via nästa hela timme."]); } } },
    { id: "floorCost", skill: "w13-l7.area", gen: (rng) => { const a = rng.int(3, 8), b = rng.int(2, 6), k = rng.pick([100, 150, 200, 250]); return numeric(`fc-${a}-${b}-${k}`, "w13-l7.area", `Ett rum är ${a} m långt och ${b} m brett. Golvet kostar ${k} kr per m². Vad kostar golvet?`, a * b * k, `Area ${a} · ${b} = ${a * b} m². ${a * b} · ${k} = ${a * b * k} kr.`, ["Räkna först arean."], "kr"); } },
  ],
  method: [
    { id: "discountSteps", skill: "w13-l7.percent", gen: (rng) => { const R = rng.pick([10, 20, 25, 50]), P = (100 / gcd(R, 100)) * rng.int(2, 12) * 10; return multifield(`ds-${P}-${R}`, "w13-l7.percent", `En jacka kostar ${P} kr. Den är nedsatt med ${R} %. Räkna i steg.`, [{ label: "Rabatten", suffix: "kr", accept: [pctOf(R, P)] }, { label: "Nytt pris", suffix: "kr", accept: [P - pctOf(R, P)] }], `${pctOf(R, P)}; ${P - pctOf(R, P)}.`, ["Rabatten först."]); } },
  ],
  representation: [
    { id: "discountBar", skill: "w13-l7.percent", gen: (rng) => { const R = rng.pick([10, 20, 25, 50]), P = (100 / gcd(R, 100)) * rng.int(2, 12) * 10; return withVisual(numeric(`db-${P}-${R}`, "w13-l7.percent", `Stapeln visar rabatten (${R} %) på en vara som kostar ${P} kr. Vad kostar varan efter rabatten?`, P - pctOf(R, P), `Rabatten är ${pctOf(R, P)} kr. ${P} − ${pctOf(R, P)} = ${P - pctOf(R, P)} kr.`, ["Hur stor del är rabatt?"], "kr"), { type: "percentbar", pct: R, label: `${R} % rabatt` }); } },
    { id: "strategyPick", skill: "w13-l7.strategy", gen: (rng) => { const k = rng.int(2, 5), u = rng.int(3, 12); return withVisual(numeric(`sp-${k}-${u}`, "w13-l7.strategy", `Modellen visar ett problem där en person har ${k} gånger så mycket som en annan. Varje ruta är värd ${u}. Hur mycket har de tillsammans?`, (k + 1) * u, `${k + 1} rutor · ${u} = ${(k + 1) * u}.`, ["Räkna alla rutor."]), { type: "barmodel", rows: [{ label: "A", parts: 1 }, { label: "B", parts: k }], boxLabel: String(u), total: "tillsammans" }); } },
  ],
  teacher: {
    title: "Byt strategi när du fastnar",
    scenarios: ["Lisa (åk 5) har fastnat på ett problem och säger: ”Jag är dålig på det här.” Hon fortsätter försöka lösa det på samma sätt om och om igen."],
    prompt: "Förklara för Lisa att det är normalt att fastna, vilka strategier hon kan prova i stället (ge minst tre med exempel på när varje passar) och hur hon kontrollerar att hennes svar stämmer.",
    minChars: 220,
    rubric: { minConcepts: 4, concepts: [
      { id: "normalt", label: "att det är normalt att fastna", any: ["normalt", "alla fastnar", "inte dålig", "vanligt", "inget fel på dig"] },
      { id: "rita", label: "rita en bild/modell", any: ["rita", "bild", "modell", "stapel"] },
      { id: "prova", label: "prova och pröva", any: ["prova", "pröva", "gissa med plan"] },
      { id: "bak", label: "arbeta baklänges / förenkla / lista / mönster", any: ["baklänges", "förenkla", "mindre tal", "lista", "tabell", "mönster"] },
      { id: "kontroll", label: "kontrollera svaret", any: ["kontroll", "rimlig", "stämmer", "överslag", "kolla"] },
    ] },
    modelAnswer: "Lisa, det är helt normalt att fastna, det händer alla, och det betyder inte att du är dålig. Skillnaden är att man byter strategi. Du kan rita en bild eller modell när det finns delar och en helhet, prova och pröva när du kan kontrollera ett förslag, arbeta baklänges när du känner slutresultatet, förenkla med mindre tal när talen är krångliga, eller göra en lista eller tabell för att hitta alla möjligheter. Kontrollera sedan alltid: svarar jag på frågan, är svaret rimligt och stämmer det med alla uppgifter?",
  },
};
