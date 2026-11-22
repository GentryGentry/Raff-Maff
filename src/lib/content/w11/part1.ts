import type { Lesson } from "../types";
import { mc, numeric, multifield, withVisual, dcAcc, dcTrim } from "@/lib/engine/gen-helpers";
import type { Rng } from "@/lib/engine/rng";
import { AREA, LEN, MASS, VOL, balanceConv, cmpEx, convEx, convSteps, mixedEx, signBalance, sumEx, type U } from "./units";

/** "Which unit fits?" items: correct unit + a text; wrong options are the other units of the set. */
function unitChoice(rng: Rng, id: string, skill: string, set: U[], items: [string, string][], what: string) {
  const [ctx, ok] = rng.pick(items);
  return mc(`${id}-${ctx}`, skill, `Vilken enhet passar bäst för ${what} ${ctx}?`, ok, rng.shuffle(set.map((u) => u.n).filter((n) => n !== ok)).slice(0, 3).map((text) => ({ text })), `${ctx[0].toUpperCase()}${ctx.slice(1)} mäts rimligast i ${ok}. Fel enhet ger ett orimligt tal (tänk på hur stort ett tal blir).`, ["Föreställ dig mätetalet: blir det ett lagom tal, som 5 eller 40?"], rng);
}

// ───────── Lektion 1: Längd ─────────
const LEN_ITEMS: [string, string][] = [["en penna", "cm"], ["ett mynt (tjockleken)", "mm"], ["sträckan Stockholm–Göteborg", "km"], ["en dörr (höjden)", "m"], ["din tumnagel (bredden)", "mm"], ["en fotbollsplan", "m"], ["ett dricksglas (höjden)", "cm"], ["sträckan du går på en timme", "km"]];

export const lesson1: Lesson = {
  id: "w11-l1", worldId: "w11", title: "Längd – mm, cm, dm, m och km", grades: "åk 4–6",
  summary: "Välj rätt enhet, läs av en linjal och byt mellan längdenheter.",
  lgr: "Jämförelse, uppskattning och mätning av längd; enheter och enhetsbyten",
  objectives: ["Välja lämplig längdenhet.", "Läsa av en linjal, även när föremålet inte börjar på 0.", "Byta mellan mm, cm, dm, m och km."],
  intro: "Att mäta betyder att jämföra med en **enhet**. För längd använder vi millimeter, centimeter, decimeter, meter och kilometer. Svårigheten är sällan själva mätningen utan **enhetsbytet**: ska talet bli större eller mindre? Prefixen hjälper: *milli* = tusendel, *centi* = hundradel, *deci* = tiondel, *kilo* = tusen.",
  theory: [
    { heading: "Enheterna och deras samband", body: "$1\\ \\text{cm} = 10\\ \\text{mm}$, $1\\ \\text{dm} = 10\\ \\text{cm}$, $1\\ \\text{m} = 10\\ \\text{dm} = 100\\ \\text{cm} = 1\\,000\\ \\text{mm}$ och $1\\ \\text{km} = 1\\,000\\ \\text{m}$. Mellan två enheter är det alltid en tiopotens." },
    { heading: "Avläsa en linjal", body: "Föremålets längd är **slutet minus början**. Börjar föremålet på 2 cm och slutar på 7,5 cm är det $7{,}5 - 2 = 5{,}5$ cm långt. Det vanliga felet är att läsa bara av där det slutar. Varje litet streck är 1 mm.", visual: { type: "ruler", cm: 10, from: 20, to: 75 } },
    { heading: "Byta enhet: större eller mindre tal?", body: "Går du till en **mindre** enhet blir talet **större** (det går åt fler små): $3\\ \\text{m} = 300\\ \\text{cm}$. Går du till en **större** enhet blir talet **mindre**: $450\\ \\text{cm} = 4{,}5\\ \\text{m}$. Fråga dig alltid: ska talet växa eller krympa?" },
    { heading: "Blandade enheter", body: "$3\\ \\text{m}\\ 45\\ \\text{cm}$ är $300 + 45 = 345$ cm, eller $3{,}45$ m. Gör om allt till samma enhet innan du räknar." },
  ],
  worked: [
    { title: "Från meter till centimeter", problem: "Skriv om 2,4 m i cm.", steps: [{ text: "1 m = 100 cm. Vi går till den mindre enheten, så talet blir större." }, { text: "Multiplicera med 100.", math: "2{,}4 \\cdot 100 = 240" }], why: "Det går 100 cm på varje meter.", alternative: "2 m = 200 cm och 0,4 m = 40 cm, tillsammans 240 cm." },
    { title: "Linjal som inte börjar på 0", problem: "Ett sugrör ligger från 2 cm till 7,5 cm på linjalen. Hur långt är det?", steps: [{ text: "Längd = slut − början.", math: "7{,}5 - 2 = 5{,}5" }], why: "Linjalens 0 är inte där föremålet börjar, så vi mäter avståndet mellan två avläsningar.", alternative: "Flytta föremålet så det börjar på 0 – då ser du längden direkt." },
  ],
  drawing: { task: "Rita en tallinje från 0 till 20 cm. Markera 12 cm och 85 mm. Vilken är längst?", tool: "numberline" },
  pupils: [{ pupil: "Vera", said: "Pennan slutar på 14 cm på linjalen, så den är 14 cm lång.", misconception: "Läser av bara slutet, fast pennan började på 2 cm.", response: "Fråga: ”Var börjar pennan?” Låt Vera räkna hur många cm som pennan täcker: 14 − 2 = 12 cm." }],
  knowledge: [
    { id: "convDown", skill: "w11-l1.convert", gen: (rng) => convEx(rng, "w11-l1.convert", LEN, { dir: "down" }) },
    { id: "convUp", skill: "w11-l1.convert", gen: (rng) => convEx(rng, "w11-l1.convert", LEN, { dir: "up" }) },
    { id: "unitChoice", skill: "w11-l1.unit", gen: (rng) => unitChoice(rng, "lu", "w11-l1.unit", LEN, LEN_ITEMS, "längden på") },
    { id: "mixed", skill: "w11-l1.mixed", gen: (rng) => mixedEx(rng, "w11-l1.mixed", LEN) },
    { id: "sum", skill: "w11-l1.add", gen: (rng) => sumEx(rng, "w11-l1.add", LEN) },
    { id: "diff", skill: "w11-l1.add", gen: (rng) => sumEx(rng, "w11-l1.add", LEN, true) },
    { id: "compare", skill: "w11-l1.compare", gen: (rng) => cmpEx(rng, "w11-l1.compare", LEN.filter((u) => u.n !== "dm" && u.n !== "km"), "längd") },
    { id: "walk", skill: "w11-l1.context", gen: (rng) => { const lap = rng.pick([200, 250, 400, 500]), k = rng.int(3, 9); const m = lap * k; return numeric(`wk-${lap}-${k}`, "w11-l1.context", `Du springer ${k} varv på en bana som är ${lap} m lång. Hur många km har du sprungit?`, dcAcc(m, 3), `${k} · ${lap} = ${m} m = ${dcTrim(m, 3)} km (1 km = 1 000 m).`, ["Räkna först i meter."], "km"); } },
  ],
  method: [
    { id: "convSteps", skill: "w11-l1.convert", gen: (rng) => convSteps(rng, "w11-l1.convert", LEN) },
    { id: "mixedSteps", skill: "w11-l1.mixed", gen: (rng) => { const k = rng.int(1, 9), s = rng.int(10, 99); return multifield(`ms-${k}-${s}`, "w11-l1.mixed", `Skriv ${k} m ${s} cm i centimeter, i steg.`, [{ label: `${k} m i cm`, suffix: "cm", accept: [k * 100] }, { label: "Totalt i cm", suffix: "cm", accept: [k * 100 + s] }], `${k} m = ${k * 100} cm. Lägg till ${s} cm: ${k * 100 + s} cm.`, ["1 m = 100 cm."]); } },
  ],
  representation: [
    { id: "rulerRead", skill: "w11-l1.ruler", gen: (rng) => { const from = rng.int(0, 4) * 10, len = rng.int(8, Math.min(70, 95 - from)); const to = from + len; return withVisual(numeric(`rr-${from}-${to}`, "w11-l1.ruler", "Föremålet (markerat) ligger mot en linjal. Hur långt är det i millimeter?", len, `Slut ${to / 10} cm minus början ${from / 10} cm = ${len / 10} cm = ${len} mm.`, ["Längd = slut − början. Varje streck är 1 mm."], "mm"), { type: "ruler", cm: 10, from, to }); } },
    { id: "rulerCm", skill: "w11-l1.ruler", gen: (rng) => { const from = rng.int(0, 5) * 10, len = rng.int(1, 4) * 10 + rng.pick([0, 5]); const to = from + len; return withVisual(numeric(`rc-${from}-${to}`, "w11-l1.ruler", "Hur långt är föremålet i centimeter? (Avläs på linjalen.)", dcAcc(len, 1), `Slut ${dcTrim(to, 1)} cm minus början ${dcTrim(from, 1)} cm = ${dcTrim(len, 1)} cm.`, ["Börjar föremålet på 0?"], "cm"), { type: "ruler", cm: 10, from, to }); } },
  ],
  teacher: {
    title: "Linjalen börjar inte på noll",
    scenarios: ["Vera (åk 4) mäter en penna som ligger från 2 cm till 14 cm på linjalen. Hon säger att pennan är 14 cm."],
    prompt: "Förklara för Vera hur man räknar ut pennans längd när den inte börjar på 0, vad rätt svar är, och hur hon kan kontrollera sig. Hur många millimeter är pennan?",
    minChars: 160,
    rubric: { minConcepts: 4, concepts: [
      { id: "skillnad", label: "slut minus början / skillnaden mellan avläsningarna", any: ["minus", "skillnad", "slut", "börjar", "början", "dra ifrån"] },
      { id: "svar", label: "rätt längd 12 cm", any: ["12 cm", "12 centimeter", "tolv"] },
      { id: "kontroll", label: "kontroll (flytta till 0, räkna centimeter)", any: ["flytta", "räkna", "kontroll", "noll", " 0 "] },
      { id: "mm", label: "120 mm", any: ["120"] },
      { id: "enhet", label: "att 1 cm = 10 mm", any: ["10 mm", "tio millimeter", "gånger 10", "· 10", "·10", "x 10"] },
    ] },
    modelAnswer: "Vera, pennan börjar inte på 0 utan på 2 cm, så du kan inte läsa av bara slutet. Längden är slut minus början: 14 − 2 = 12 cm. Du kan kontrollera genom att flytta pennan så att den börjar på 0 och se var den slutar, eller räkna centimeterstrecken från 2 till 14. Eftersom 1 cm är 10 mm blir pennan 12 · 10 = 120 mm.",
  },
};

// ───────── Lektion 2: Massa ─────────
const MASS_ITEMS: [string, string][] = [["ett äpple", "g"], ["en cyklist", "kg"], ["en bil", "kg"], ["en fjäder", "g"], ["en elefant", "ton"], ["en mjölkförpackning", "g"], ["en lastbil med last", "ton"]];

export const lesson2: Lesson = {
  id: "w11-l2", worldId: "w11", title: "Massa – g, kg och ton", grades: "åk 4–6",
  summary: "Hur mycket ”materia” något innehåller. 1 kg = 1 000 g, 1 ton = 1 000 kg.",
  lgr: "Jämförelse, uppskattning och mätning av massa; enheter och enhetsbyten",
  objectives: ["Välja lämplig massenhet.", "Byta mellan g, kg och ton.", "Lösa vardagsproblem med massa."],
  intro: "**Massa** säger hur mycket materia något innehåller; i vardagen kallar vi den ofta ”vikt”. Enheterna är gram, kilogram och ton, och de hänger ihop med faktorn **1 000**. Prefixet *kilo* betyder tusen: 1 kg är 1 000 g.",
  theory: [
    { heading: "Enheterna", body: "$1\\ \\text{kg} = 1\\,000\\ \\text{g}$ och $1\\ \\text{ton} = 1\\,000\\ \\text{kg}$. Ett äpple är runt 150 g, en cyklist runt 70 kg och en liten lastbil runt 3 ton." },
    { heading: "Större eller mindre tal?", body: "Från kg till g: talet blir 1 000 gånger **större**, för det går åt fler gram: $2{,}5\\ \\text{kg} = 2\\,500\\ \\text{g}$. Från g till kg blir talet **mindre**: $750\\ \\text{g} = 0{,}75\\ \\text{kg}$.", visual: { type: "balance", left: "2,5 kg", right: "2 500 g", tilt: "level" } },
    { heading: "Receptmassa", body: "Ett recept kräver 300 g mjöl per sats. Tre satser: $3 \\cdot 300 = 900$ g, alltså 0,9 kg. Räkna i samma enhet hela vägen och byt först i slutet." },
  ],
  worked: [
    { title: "Kg och g", problem: "Skriv om 3 450 g i kg.", steps: [{ text: "Vi går till en större enhet, så talet blir mindre. Dela med 1 000.", math: "3\\,450 \\div 1\\,000 = 3{,}45" }], why: "1 000 g är 1 kg.", alternative: "3 000 g = 3 kg och 450 g = 0,45 kg: 3,45 kg." },
    { title: "Hur många påsar?", problem: "En påse väger 750 g. Hur många påsar går det på 6 kg?", steps: [{ text: "6 kg = 6 000 g." }, { text: "Dela.", math: "6\\,000 \\div 750 = 8" }], why: "Vi jämför i samma enhet.", alternative: "Fyra påsar är 3 kg, åtta påsar 6 kg." },
  ],
  drawing: { task: "Rita en balansvåg med 1,5 kg på ena sidan. Hur många gram ska det vara på andra sidan för att vågen ska vara i balans?", tool: "grid" },
  pupils: [{ pupil: "Dani", said: "2,5 kg är 250 g, för kilo betyder att man flyttar ett nolla.", misconception: "Blandar ihop faktorerna 10, 100 och 1 000.", response: "Fråga: ”Hur många gram är 1 kg?” 1 000. Då är 2,5 kg = 2,5 · 1 000 = 2 500 g." }],
  knowledge: [
    { id: "convDown", skill: "w11-l2.convert", gen: (rng) => convEx(rng, "w11-l2.convert", MASS, { dir: "down", maxGap: 3 }) },
    { id: "convUp", skill: "w11-l2.convert", gen: (rng) => convEx(rng, "w11-l2.convert", MASS, { dir: "up", maxGap: 3 }) },
    { id: "unitChoice", skill: "w11-l2.unit", gen: (rng) => unitChoice(rng, "mu", "w11-l2.unit", MASS, MASS_ITEMS, "massan hos") },
    { id: "mixed", skill: "w11-l2.mixed", gen: (rng) => { const k = rng.int(1, 9), s = rng.int(10, 990); return numeric(`mx-${k}-${s}`, "w11-l2.mixed", `Skriv om ${k} kg ${s} g i g.`, k * 1000 + s, `${k} kg = ${k * 1000} g. Lägg till ${s}: ${k * 1000 + s} g.`, ["1 kg = 1 000 g."], "g"); } },
    { id: "sum", skill: "w11-l2.add", gen: (rng) => { const a = rng.int(1, 9) * 100 + rng.pick([0, 50]), b = rng.int(2, 9) * 100; return numeric(`sm-${a}-${b}`, "w11-l2.add", `Du köper ${dcTrim(a, 3)} kg äpplen och ${b} g bär. Hur många g väger det tillsammans?`, a + b, `${dcTrim(a, 3)} kg = ${a} g. ${a} + ${b} = ${a + b} g.`, ["Gör om till samma enhet."], "g"); } },
    { id: "bags", skill: "w11-l2.context", gen: (rng) => { const w = rng.pick([250, 500, 750, 200, 400]), n = rng.int(3, 12); return numeric(`bg-${w}-${n}`, "w11-l2.context", `En påse väger ${w} g. Hur många påsar går det på ${dcTrim(w * n, 3)} kg?`, n, `${dcTrim(w * n, 3)} kg = ${w * n} g. ${w * n} ÷ ${w} = ${n} påsar.`, ["Gör om kg till g, dela sedan."]); } },
    { id: "heaviest", skill: "w11-l2.compare", gen: (rng) => cmpEx(rng, "w11-l2.compare", MASS.filter((u) => u.n !== "ton"), "massa") },
    { id: "ton", skill: "w11-l2.context", gen: (rng) => { const car = rng.pick([900, 1200, 1500]), n = rng.int(3, 8); return numeric(`tn-${car}-${n}`, "w11-l2.context", `En bil väger ${car} kg. Hur många ton väger ${n} sådana bilar tillsammans?`, dcAcc(car * n, 3), `${n} · ${car} = ${car * n} kg = ${dcTrim(car * n, 3)} ton.`, ["1 ton = 1 000 kg."], "ton"); } },
  ],
  method: [
    { id: "convSteps", skill: "w11-l2.convert", gen: (rng) => convSteps(rng, "w11-l2.convert", MASS, { maxGap: 3 }) },
    { id: "bagSteps", skill: "w11-l2.context", gen: (rng) => { const w = rng.pick([250, 500, 750, 200, 400]), n = rng.int(3, 12); return multifield(`bs-${w}-${n}`, "w11-l2.context", `En påse väger ${w} g. Hur många påsar går det på ${dcTrim(w * n, 3)} kg? Räkna i steg.`, [{ label: "Totalt i gram", suffix: "g", accept: [w * n] }, { label: "Antal påsar", accept: [n] }], `${dcTrim(w * n, 3)} kg = ${w * n} g. ${w * n} ÷ ${w} = ${n}.`, ["Samma enhet först."]); } },
  ],
  representation: [
    { id: "balanceFind", skill: "w11-l2.balance", gen: (rng) => balanceConv(rng, "w11-l2.balance", MASS.filter((u) => u.n !== "ton")) },
    { id: "balanceSign", skill: "w11-l2.balance", gen: (rng) => signBalance(rng, "w11-l2.balance", MASS.filter((u) => u.n !== "ton")) },
  ],
  teacher: {
    title: "Kilo är tusen",
    scenarios: ["Dani (åk 5) räknar att 2,5 kg är 250 g. ”Man flyttar bara komma ett steg”, säger hen."],
    prompt: "Förklara för Dani vad prefixet kilo betyder, varför 2,5 kg inte är 250 g, och hur du räknar rätt. Ge också ett sätt att kontrollera att svaret är rimligt.",
    minChars: 160,
    rubric: { minConcepts: 4, concepts: [
      { id: "kilo", label: "kilo betyder tusen / 1 kg = 1 000 g", any: ["1 000", "1000", "tusen"] },
      { id: "svar", label: "rätt svar 2 500 g", any: ["2 500", "2500"] },
      { id: "mult", label: "multiplicera med 1 000", any: ["gånger 1 000", "· 1 000", "·1 000", "multiplicera", "gånger 1000", "x 1000", "x 1 000"] },
      { id: "rimlig", label: "rimlighetskontroll (2 kg är 2 000 g, så mer än 2 000)", any: ["rimlig", "2 kg", "två kilo", "mer än 2", "större"] },
      { id: "storre", label: "att talet blir större när man går till gram", any: ["större tal", "fler gram", "talet blir större", "blir större", "fler"] },
    ] },
    modelAnswer: "Dani, prefixet kilo betyder tusen, så 1 kg är 1 000 g och inte 100 eller 10. Därför multiplicerar man med 1 000: 2,5 · 1 000 = 2 500 g. Du kan kontrollera att det är rimligt: 2 kg är 2 000 g, så 2,5 kg måste vara mer än 2 000 g. Talet blir större när man går till gram, eftersom det går åt fler gram än kilo.",
  },
};

// ───────── Lektion 3: Volym ─────────
const VOL_ITEMS: [string, string][] = [["ett dricksglas", "dl"], ["ett badkar", "l"], ["en tesked", "ml"], ["en mjölkförpackning", "l"], ["en kaffekopp", "dl"], ["en regndroppe", "ml"]];

export const lesson3: Lesson = {
  id: "w11-l3", worldId: "w11", title: "Volym och rymd – liter, dl, cl, ml och dm³", grades: "åk 4–6",
  summary: "1 l = 10 dl = 100 cl = 1 000 ml, och 1 l = 1 dm³, 1 ml = 1 cm³.",
  lgr: "Jämförelse, uppskattning och mätning av volym; enheter och enhetsbyten",
  objectives: ["Byta mellan l, dl, cl och ml.", "Koppla liter till kubikdecimeter och ml till kubikcentimeter.", "Räkna volym av rätblock i liter."],
  intro: "Volym talar om hur mycket något ryms. För vätskor använder vi **liter**: liter, deciliter (tiondels liter), centiliter (hundradels) och milliliter (tusendels). Och det finns en genväg mellan *vätskemått* och *kubikmått*: en liter är precis en kubik som är 1 dm på varje led.",
  theory: [
    { heading: "Vätskemåtten", body: "$1\\ \\text{l} = 10\\ \\text{dl} = 100\\ \\text{cl} = 1\\,000\\ \\text{ml}$. Ett glas är ungefär 2 dl, en tesked 5 ml och ett badkar 150 l." },
    { heading: "Liter är kubikdecimeter", body: "$1\\ \\text{dm}^3 = 1\\ \\text{l}$ och $1\\ \\text{cm}^3 = 1\\ \\text{ml}$. En låda som är 1 dm lång, 1 dm bred och 1 dm hög rymmer exakt 1 liter.", visual: { type: "cuboid", l: 2, b: 2, h: 2, labels: ["1 dm", "1 dm", "1 dm"] } },
    { heading: "Volym av rätblock i liter", body: "Ett akvarium är 5 dm långt, 3 dm brett och 4 dm högt. Volym: $5 \\cdot 3 \\cdot 4 = 60\\ \\text{dm}^3 = 60$ liter. Mät i dm när du vill ha liter!" },
    { heading: "Hur många glas?", body: "Ett glas rymmer 2 dl. Hur många glas ryms i 1,5 l? $1{,}5\\ \\text{l} = 15\\ \\text{dl}$ och $15 \\div 2 = 7{,}5$ glas. Gör om till samma enhet först." },
  ],
  worked: [
    { title: "Från liter till ml", problem: "Skriv om 0,35 l i ml.", steps: [{ text: "1 l = 1 000 ml, vi går till mindre enhet: talet blir större." }, { text: "Multiplicera.", math: "0{,}35 \\cdot 1\\,000 = 350" }], why: "Det går 1 000 ml på en liter.", alternative: "0,35 l = 3,5 dl = 35 cl = 350 ml." },
    { title: "Liter av ett rätblock", problem: "En låda är 4 dm × 2 dm × 5 dm. Hur många liter ryms?", steps: [{ text: "Volym i dm³.", math: "4 \\cdot 2 \\cdot 5 = 40" }, { text: "1 dm³ = 1 l, så 40 liter." }], why: "En kubikdecimeter är en liter.", alternative: "Bottenyta 8 dm² gånger höjd 5 dm = 40 dm³." },
  ],
  drawing: { task: "Rita en kub med sidan 1 dm och skriv hur många liter den rymmer. Hur många cm³ är det? (Tips: 1 dm = 10 cm.)", tool: "grid" },
  pupils: [{ pupil: "Linus", said: "En låda som är 10 cm × 10 cm × 10 cm rymmer 10 liter.", misconception: "Räknar fel på sambandet mellan cm³ och liter.", response: "10 · 10 · 10 = 1 000 cm³ = 1 000 ml = 1 liter. Eller: 10 cm = 1 dm, och 1 · 1 · 1 = 1 dm³ = 1 liter." }],
  knowledge: [
    { id: "convDown", skill: "w11-l3.convert", gen: (rng) => convEx(rng, "w11-l3.convert", VOL, { dir: "down" }) },
    { id: "convUp", skill: "w11-l3.convert", gen: (rng) => convEx(rng, "w11-l3.convert", VOL, { dir: "up" }) },
    { id: "unitChoice", skill: "w11-l3.unit", gen: (rng) => unitChoice(rng, "vu", "w11-l3.unit", VOL, VOL_ITEMS, "volymen hos") },
    { id: "glasses", skill: "w11-l3.context", gen: (rng) => { const g = rng.pick([2, 3, 5]), k = rng.int(3, 12); return numeric(`gl-${g}-${k}`, "w11-l3.context", `Ett glas rymmer ${g} dl. Hur många glas kan du fylla med ${dcTrim(g * k, 1)} l?`, k, `${dcTrim(g * k, 1)} l = ${g * k} dl. ${g * k} ÷ ${g} = ${k} glas.`, ["Gör om liter till dl först."]); } },
    { id: "boxLiters", skill: "w11-l3.dm3", gen: (rng) => { const l = rng.int(2, 5), b = rng.int(2, 4), h = rng.int(2, 4); return withVisual(numeric(`bl-${l}-${b}-${h}`, "w11-l3.dm3", `En låda är ${l} dm lång, ${b} dm bred och ${h} dm hög. Hur många liter ryms i den?`, l * b * h, `${l} · ${b} · ${h} = ${l * b * h} dm³ = ${l * b * h} liter.`, ["1 dm³ = 1 liter."], "l"), { type: "cuboid", l, b, h }); } },
    { id: "cubeMl", skill: "w11-l3.dm3", gen: (rng) => { const s = rng.int(2, 9); return numeric(`cm-${s}`, "w11-l3.dm3", `En kub har kanten ${s} cm. Hur många ml vatten ryms i den?`, s ** 3, `${s} · ${s} · ${s} = ${s ** 3} cm³ = ${s ** 3} ml (1 cm³ = 1 ml).`, ["1 cm³ = 1 ml."], "ml"); } },
    { id: "compare", skill: "w11-l3.compare", gen: (rng) => cmpEx(rng, "w11-l3.compare", VOL, "volym") },
    { id: "recipe", skill: "w11-l3.context", gen: (rng) => { const dl = rng.int(2, 6), n = rng.int(3, 8); return numeric(`rc-${dl}-${n}`, "w11-l3.context", `Ett recept använder ${dl} dl mjölk per portion. Hur många liter mjölk behövs till ${n * 5} portioner?`, dcAcc(dl * n * 5 * 100, 3), `${dl} · ${n * 5} = ${dl * n * 5} dl = ${dcTrim(dl * n * 5 * 100, 3)} l.`, ["Räkna först i dl, byt sedan till l."], "l"); } },
  ],
  method: [
    { id: "convSteps", skill: "w11-l3.convert", gen: (rng) => convSteps(rng, "w11-l3.convert", VOL) },
    { id: "boxSteps", skill: "w11-l3.dm3", gen: (rng) => { const l = rng.int(2, 8), b = rng.int(2, 6), h = rng.int(2, 6); return multifield(`bx-${l}-${b}-${h}`, "w11-l3.dm3", `En låda är ${l} dm × ${b} dm × ${h} dm. Räkna i steg.`, [{ label: "Bottenyta", suffix: "dm²", accept: [l * b] }, { label: "Volym", suffix: "dm³", accept: [l * b * h] }, { label: "Antal liter", suffix: "l", accept: [l * b * h] }], `${l} · ${b} = ${l * b}; ${l * b} · ${h} = ${l * b * h} dm³ = ${l * b * h} l.`, ["1 dm³ är 1 liter."]); } },
  ],
  representation: [
    { id: "balanceFind", skill: "w11-l3.balance", gen: (rng) => balanceConv(rng, "w11-l3.balance", VOL) },
    { id: "cubeUnits", skill: "w11-l3.dm3", gen: (rng) => { const s = rng.int(2, 4); return withVisual(numeric(`cu-${s}`, "w11-l3.dm3", `Kuben består av små kuber, var och en 1 dm på varje led. Hur många liter ryms i hela kuben?`, s ** 3, `${s} · ${s} · ${s} = ${s ** 3} dm³ = ${s ** 3} liter.`, ["Varje liten kub rymmer 1 liter."], "l"), { type: "cuboid", l: s, b: s, h: s, labels: [`${s} dm`, `${s} dm`, `${s} dm`] }); } },
  ],
  teacher: {
    title: "Liter och kubikcentimeter",
    scenarios: ["Linus (åk 5) säger att en låda som är 10 cm × 10 cm × 10 cm rymmer 10 liter."],
    prompt: "Förklara för Linus hur många liter lådan egentligen rymmer och hur man ser det. Förklara sambandet mellan dm³ och liter och mellan cm³ och ml.",
    minChars: 170,
    rubric: { minConcepts: 4, concepts: [
      { id: "vol", label: "volym 10·10·10 = 1 000 cm³", any: ["1 000 cm", "1000 cm", "10 · 10 · 10", "10·10·10", "tusen"] },
      { id: "liter", label: "rätt svar 1 liter", any: ["1 liter", "en liter", "1 l"] },
      { id: "dm", label: "10 cm = 1 dm / 1 dm³ = 1 l", any: ["1 dm", "dm³", "kubikdecimeter"] },
      { id: "ml", label: "1 cm³ = 1 ml", any: ["1 ml", "cm³ = 1", "milliliter", "ml"] },
      { id: "fel", label: "förklara Linus fel", any: ["fel", "inte 10", "missförstått", "blandat", "stämmer inte"] },
    ] },
    modelAnswer: "Linus, lådan rymmer inte 10 liter utan 1 liter. Volymen är 10 · 10 · 10 = 1 000 cm³. Eftersom 1 cm³ är 1 ml är det 1 000 ml, och 1 000 ml är 1 liter. Du kan också tänka att 10 cm är 1 dm, så lådan är 1 dm på varje led och rymmer 1 dm³, vilket är en liter. Det stämmer alltså inte att det blir 10 liter.",
  },
};
// keep imports used
void AREA;
