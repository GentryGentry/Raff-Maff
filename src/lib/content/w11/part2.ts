import type { Lesson } from "../types";
import { mc, numeric, multifield, withVisual, dcAcc, dcTrim, rectPts, sv } from "@/lib/engine/gen-helpers";
import type { Rng } from "@/lib/engine/rng";
import { AREA, balanceConv, cmpEx, convEx, convSteps, signBalance } from "./units";

const hhmm = (min: number) => `${String(Math.floor(min / 60)).padStart(2, "0")}.${String(min % 60).padStart(2, "0")}`;

// ───────── Lektion 4: Tid ─────────
function elapsed(rng: Rng) {
  const start = rng.int(8, 23) * 60 + rng.int(0, 11) * 5, dur = rng.int(4, 96) * 5;
  const endAbs = start + dur, wrap = endAbs >= 24 * 60;
  return { start, dur, end: endAbs % (24 * 60), wrap };
}
const TIME_ITEMS: [string, string][] = [["att blinka", "sekunder"], ["att borsta tänderna", "minuter"], ["en skoldag", "timmar"], ["en semester", "dygn"], ["en fotbollsmatch", "minuter"], ["ett hjärtslag", "sekunder"]];

export const lesson4: Lesson = {
  id: "w11-l4", worldId: "w11", title: "Tid – sekunder, minuter, timmar och dygn", grades: "åk 4–6",
  summary: "Tid räknas inte i tiopotenser: 60 s = 1 min, 60 min = 1 tim, 24 tim = 1 dygn.",
  lgr: "Jämförelse, uppskattning och mätning av tid; enheter och enhetsbyten",
  objectives: ["Läsa av en analog klocka.", "Byta mellan sekunder, minuter, timmar och dygn.", "Räkna ut hur lång tid något tar, även över midnatt."],
  intro: "Tid är annorlunda än längd och massa: den följer **inte** tiopotenser. $60$ sekunder är en minut, $60$ minuter en timme och $24$ timmar ett dygn. Därför går det inte att ”flytta kommat” med tid, och därför blir tidsuppgifter ofta fel för vuxna: $1{,}5$ timmar är inte 1 timme 50 minuter.",
  theory: [
    { heading: "Enheterna", body: "$1\\ \\text{min} = 60\\ \\text{s}$, $1\\ \\text{tim} = 60\\ \\text{min}$, $1\\ \\text{dygn} = 24\\ \\text{tim}$. Det är ett **sextiosystem** (babylonierna), inte ett tiosystem.", visual: { type: "clock", h: 4, m: 35 } },
    { heading: "Klockan", body: "Den korta visaren visar timmar, den långa minuter. Den långa visaren går 6° per minut (360° på 60 min), den korta 30° per timme. Klockan 4.35 står den korta visaren mellan 4 och 5." },
    { heading: "Hur lång tid? Via hel timme", body: "Från 14.40 till 16.15: till nästa hela timme (15.00) är det 20 min, sedan 1 tim 15 min till 16.15. Tillsammans $20 + 60 + 15 = 95$ min. Dela upp tiden så att du alltid passerar en hel timme." },
    { heading: "Decimaltimmar är en fälla", body: "$1{,}5$ tim betyder $1 + 0{,}5$ tim, och $0{,}5$ tim är 30 min, så $1{,}5$ tim $= 1$ tim 30 min = 90 min. $2{,}25$ tim är $2$ tim $+ 15$ min = 135 min, eftersom $0{,}25 \\cdot 60 = 15$." },
  ],
  worked: [
    { title: "Hur lång är filmen?", problem: "Filmen börjar 18.45 och slutar 20.20. Hur många minuter är det?", steps: [{ text: "Till nästa hela timme (19.00): 15 min." }, { text: "19.00 till 20.00: 60 min." }, { text: "20.00 till 20.20: 20 min." }, { text: "Totalt.", math: "15 + 60 + 20 = 95" }], why: "Hela timmar är lätta att räkna, så vi går via dem.", alternative: "20.20 − 18.45: 20 h 20 min − 18 h 45 min = 1 h 35 min = 95 min." },
    { title: "Över midnatt", problem: "Tåget går 22.30 och kommer fram 01.15 nästa dag. Hur lång är resan?", steps: [{ text: "22.30 till 24.00: 90 min." }, { text: "00.00 till 01.15: 75 min." }, { text: "Totalt.", math: "90 + 75 = 165" }], why: "Vid midnatt börjar klockan om, så vi delar upp i före och efter 24.00.", alternative: "Lägg 24 tim till sluttiden: 25.15 − 22.30 = 2 h 45 min." },
  ],
  drawing: { task: "Rita en urtavla och markera klockan 4.35. Var hamnar timvisaren? Hur många grader har minutvisaren vridit sig från 12?", tool: "grid" },
  pupils: [{ pupil: "Amir", said: "1,5 timmar är 1 timme och 50 minuter.", misconception: "Läser decimaldelen som minuter i stället för bråkdel av 60 minuter.", response: "Fråga: ”Hur många minuter är en halv timme?” Då är 0,5 tim = 30 min och 1,5 tim = 1 tim 30 min = 90 min." }],
  knowledge: [
    { id: "hms", skill: "w11-l4.convert", gen: (rng) => { const [big, small, bs, ss] = rng.pick([["min", "s", "minuter", "sekunder"], ["tim", "min", "timmar", "minuter"]] as const); const k = rng.int(1, 9), s = rng.int(5, 55);
      return numeric(`hm-${k}-${big}-${s}`, "w11-l4.convert", `Skriv om ${k} ${big} ${s} ${small} i ${ss}.`, k * 60 + s, `${k} ${big} = ${k * 60} ${small}. Lägg till ${s}: ${k * 60 + s} ${small}.`, [`1 ${big} = 60 ${small} (inte 100).`], ss === "sekunder" ? "s" : "min"); } },
    { id: "decHours", skill: "w11-l4.decimal", gen: (rng) => { const k = rng.int(1, 5), f = rng.pick([[0.25, "25"], [0.5, "5"], [0.75, "75"]] as const); const m = k * 60 + f[0] * 60;
      return numeric(`dh-${k}-${f[1]}`, "w11-l4.decimal", `Skriv om ${k},${f[1]} tim i minuter.`, m, `0,${f[1]} tim = ${f[0] * 60} min (${f[0]} · 60). ${k} tim = ${k * 60} min. Tillsammans ${m} min.`, ["Decimaldelen är en del av 60 minuter."], "min"); } },
    { id: "days", skill: "w11-l4.convert", gen: (rng) => { const d = rng.int(1, 6), h = rng.int(1, 23); return numeric(`dg-${d}-${h}`, "w11-l4.convert", `Hur många timmar är ${d} dygn ${h} timmar?`, d * 24 + h, `${d} dygn = ${d * 24} tim. Lägg till ${h}: ${d * 24 + h} tim.`, ["1 dygn = 24 timmar."], "tim"); } },
    { id: "elapsed", skill: "w11-l4.elapsed", gen: (rng) => { const e = elapsed(rng), what = rng.pick(["Filmen", "Resan", "Lektionen"]);
      return numeric(`el-${e.start}-${e.dur}`, "w11-l4.elapsed", `${what} börjar ${hhmm(e.start)} och slutar ${hhmm(e.end)}${e.wrap ? " nästa dag" : ""}. Hur många minuter varar det?`, e.dur, `Gå via hela timmar${e.wrap ? " och midnatt" : ""}. Det blir ${e.dur} min.`, ["Räkna till nästa hela timme först."], "min"); } },
    { id: "addTime", skill: "w11-l4.add", gen: (rng) => { for (;;) { const t = rng.int(7, 21) * 60 + rng.int(0, 11) * 5, d = rng.int(2, 18) * 5; if (t + d < 24 * 60) return numeric(`at-${t}-${d}`, "w11-l4.add", `Klockan är ${hhmm(t)}. Vad är klockan ${d} minuter senare? Skriv som tt.mm, till exempel 06.15.`, hhmm(t + d), `${hhmm(t)} + ${d} min = ${hhmm(t + d)}.`, ["Gå via nästa hela timme."]); } } },
    { id: "unitChoice", skill: "w11-l4.unit", gen: (rng) => { const [ctx, ok] = rng.pick(TIME_ITEMS); return mc(`tu-${ctx}`, "w11-l4.unit", `Vilken enhet passar bäst för tiden ${ctx}?`, ok, ["sekunder", "minuter", "timmar", "dygn"].filter((x) => x !== ok).map((text) => ({ text })), `${ctx[0].toUpperCase()}${ctx.slice(1)} tar ungefär ${ok}.`, ["Hur lång tid tar det ungefär?"], rng); } },
    { id: "episodes", skill: "w11-l4.context", gen: (rng) => { const [per, step] = rng.pick([[30, 2], [45, 4], [90, 2], [20, 3], [15, 4]] as const), k = step * rng.int(1, 3); return numeric(`ep-${per}-${k}`, "w11-l4.context", `Ett avsnitt är ${per} minuter långt. Hur många timmar tar ${k} avsnitt?`, (per * k) / 60, `${k} · ${per} = ${per * k} min = ${(per * k) / 60} tim.`, ["Räkna minuter, dela med 60."], "tim"); } },
  ],
  method: [
    { id: "elapsedSteps", skill: "w11-l4.elapsed", gen: (rng) => { for (;;) { const h1 = rng.int(8, 20), m1 = rng.int(1, 11) * 5, h2 = h1 + rng.int(1, 3), m2 = rng.int(0, 11) * 5; const what = rng.pick(["Filmen", "Resan", "Lektionen"]);
      return multifield(`es-${h1}-${m1}-${h2}-${m2}`, "w11-l4.elapsed", `${what} börjar ${hhmm(h1 * 60 + m1)} och slutar ${hhmm(h2 * 60 + m2)}. Räkna ut hur många minuter det varar, i steg.`, [{ label: "Minuter till nästa hela timme", suffix: "min", accept: [60 - m1] }, { label: "Minuter från sista hela timmen till sluttiden", suffix: "min", accept: [m2] }, { label: "Totalt antal minuter", suffix: "min", accept: [(h2 * 60 + m2) - (h1 * 60 + m1)] }], `${60 - m1} + ${(h2 - h1 - 1) * 60} + ${m2} = ${(h2 * 60 + m2) - (h1 * 60 + m1)} min.`, ["Gå via hela timmar."]); } } },
    { id: "hmsSteps", skill: "w11-l4.convert", gen: (rng) => { const k = rng.int(1, 6), s = rng.int(5, 55); return multifield(`hs-${k}-${s}`, "w11-l4.convert", `Skriv om ${k} tim ${s} min i minuter, i steg.`, [{ label: `${k} tim i minuter`, suffix: "min", accept: [k * 60] }, { label: "Totalt i minuter", suffix: "min", accept: [k * 60 + s] }], `${k} · 60 = ${k * 60}; ${k * 60} + ${s} = ${k * 60 + s} min.`, ["1 tim = 60 min."]); } },
  ],
  representation: [
    { id: "clockRead", skill: "w11-l4.clock", gen: (rng) => { const h = rng.int(1, 12), m = rng.int(0, 11) * 5; return withVisual(multifield(`cr-${h}-${m}`, "w11-l4.clock", "Vad är klockan? Fyll i timme (1–12) och minut.", [{ label: "Timme", accept: [h] }, { label: "Minut", accept: [m] }], `Korta visaren står vid ${h} och den långa vid ${m / 5} (= ${m} min): klockan är ${h}.${String(m).padStart(2, "0")}.`, ["Den långa visaren: varje siffra är 5 minuter."]), { type: "clock", h, m }); } },
    { id: "clockToHour", skill: "w11-l4.clock", gen: (rng) => { const h = rng.int(1, 12), m = rng.int(1, 11) * 5; return withVisual(numeric(`ch-${h}-${m}`, "w11-l4.clock", "Hur många minuter är det kvar till nästa hela timme?", 60 - m, `Minutvisaren är på ${m} min, så det är 60 − ${m} = ${60 - m} min kvar.`, ["Ett helt varv är 60 minuter."], "min"), { type: "clock", h, m }); } },
  ],
  teacher: {
    title: "1,5 timmar är inte 1 tim 50 min",
    scenarios: ["Amir (åk 5) skriver att 1,5 timmar är 1 timme och 50 minuter."],
    prompt: "Förklara för Amir varför det blir fel, vad 1,5 timmar är i minuter, och varför tid inte kan räknas med ”flytta komma” som längd.",
    minChars: 170,
    rubric: { minConcepts: 4, concepts: [
      { id: "halv", label: "0,5 timme är en halv timme = 30 minuter", any: ["halv timme", "30 minuter", "30 min", "hälften av 60"] },
      { id: "svar", label: "rätt svar 90 minuter / 1 tim 30 min", any: ["90", "1 timme och 30", "1 timme 30", "1 tim 30"] },
      { id: "sextio", label: "en timme har 60 minuter (inte 100)", any: ["60 minuter", "60 min", "sextio"] },
      { id: "tiosystem", label: "tid är inte ett tiosystem", any: ["tiosystem", "tiopotens", "flytta komma", "100", "inte tio"] },
      { id: "fel", label: "att 50 minuter vore 0,83 timmar / att decimaldelen är en bråkdel av en timme", any: ["bråkdel", "del av en timme", "0,83", "decimaldelen"] },
    ] },
    modelAnswer: "Amir, 1,5 timmar betyder 1 timme plus 0,5 timme, och 0,5 timme är en halv timme, alltså 30 minuter. Därför är 1,5 timmar 1 timme och 30 minuter, 90 minuter, inte 50. En timme har 60 minuter och inte 100, så tid är inte ett tiosystem och man kan inte flytta komma. Decimaldelen är en bråkdel av en timme: 0,5 · 60 = 30 minuter.",
  },
};

// ───────── Lektion 5: Area och areaenheter ─────────
export const lesson5: Lesson = {
  id: "w11-l5", worldId: "w11", title: "Area och areaenheter – cm², dm² och m²", grades: "åk 4–6",
  summary: "1 m² = 100 dm² = 10 000 cm². Areaenheter byts med 100 per steg, inte 10.",
  lgr: "Jämförelse, uppskattning och mätning av area; enheter och enhetsbyten",
  objectives: ["Förklara varför 1 m² är 10 000 cm².", "Byta mellan cm², dm² och m².", "Räkna area av golv och ytor med plattor."],
  intro: "Du kan redan längdenheterna. Men **arean** mäts i kvadratenheter, och där räcker det inte att tänka ”1 m = 100 cm”: en kvadrat med sidan 1 m är 100 cm × 100 cm = **10 000** cm². Samma bytesfel gör att många vuxna tror att 1 m² är 100 cm².",
  theory: [
    { heading: "Varför 100 per steg?", body: "$1\\ \\text{dm}$ är 10 cm. En kvadrat 1 dm × 1 dm är $10 \\cdot 10 = 100$ cm². Alltså $1\\ \\text{dm}^2 = 100\\ \\text{cm}^2$. På samma sätt $1\\ \\text{m}^2 = 10 \\cdot 10 = 100\\ \\text{dm}^2$ och $1\\ \\text{m}^2 = 100 \\cdot 100 = 10\\,000\\ \\text{cm}^2$.", visual: { type: "area", a: 10, b: 10 } },
    { heading: "Använd samma enhet på sidorna", body: "Ett rum är 3,5 m × 4 m: $3{,}5 \\cdot 4 = 14$ m². Är sidorna i olika enheter (t.ex. 350 cm och 4 m) gör du först om till samma enhet, annars blir arean fel." },
    { heading: "Plattor på ett golv", body: "Golvet är 3 m × 4 m = 12 m². En platta är 50 cm × 50 cm = 0,25 m². Antal plattor: $12 \\div 0{,}25 = 48$. Eller: längs 3 m går 6 plattor, längs 4 m går 8, och $6 \\cdot 8 = 48$." },
  ],
  worked: [
    { title: "m² till cm²", problem: "Skriv om 0,5 m² i cm².", steps: [{ text: "1 m² = 10 000 cm².", math: "0{,}5 \\cdot 10\\,000 = 5\\,000" }], why: "1 m = 100 cm, så 1 m² = 100 · 100 cm².", alternative: "0,5 m² = 50 dm² = 5 000 cm²." },
    { title: "Plattor", problem: "Ett golv är 3 m × 2 m. Plattorna är 50 cm × 50 cm. Hur många plattor går åt?", steps: [{ text: "Längs 3 m: 6 plattor. Längs 2 m: 4 plattor." }, { text: "Antal.", math: "6 \\cdot 4 = 24" }], why: "Vi räknar hur många plattor som ryms längs varje sida.", alternative: "Golvet 6 m², plattan 0,25 m²: 6 ÷ 0,25 = 24." },
  ],
  drawing: { task: "Rita en kvadrat 1 dm × 1 dm på rutpapper (10 × 10 rutor av 1 cm). Hur många cm² är det? Hur många sådana behövs för 1 m²?", tool: "hundredgrid" },
  pupils: [{ pupil: "Nina", said: "1 m² är 100 cm², för 1 m är 100 cm.", misconception: "Applicerar längdfaktorn direkt på arean.", response: "Rita kvadraten: den är 100 cm lång och 100 cm bred, så den innehåller 100 · 100 = 10 000 rutor på 1 cm²." }],
  knowledge: [
    { id: "convDown", skill: "w11-l5.convert", gen: (rng) => convEx(rng, "w11-l5.convert", AREA, { dir: "down", maxGap: 4, maxDec: 4 }) },
    { id: "convUp", skill: "w11-l5.convert", gen: (rng) => convEx(rng, "w11-l5.convert", AREA, { dir: "up", maxGap: 4, maxDec: 4 }) },
    { id: "concept", skill: "w11-l5.concept", gen: (rng) => { const C: [string, string, string[]][] = [["Hur många cm² är 1 m²?", "10 000", ["100", "1 000", "1 000 000"]], ["Hur många dm² är 1 m²?", "100", ["10", "1 000", "10 000"]], ["Hur många cm² är 1 dm²?", "100", ["10", "1 000", "10 000"]]]; const [q, ok, w] = rng.pick(C);
      return mc(`cn-${q}`, "w11-l5.concept", q, ok, w.map((text) => ({ text, note: text === "10" || text === "100" ? "Det är längdsambandet. Area är längd · längd." : undefined })), `Kvadratens sida: 1 m = 100 cm, så 1 m² = 100 · 100 = 10 000 cm². 1 m = 10 dm → 1 m² = 100 dm². 1 dm = 10 cm → 1 dm² = 100 cm².`, ["Area är längd gånger längd."], rng); } },
    { id: "room", skill: "w11-l5.rect", gen: (rng) => { const l10 = rng.int(1, 9) * 10 + 5, w = rng.pick([2, 4, 6]); return numeric(`rm-${l10}-${w}`, "w11-l5.rect", `Ett rum är ${dcTrim(l10, 1)} m långt och ${w} m brett. Hur stor är golvytan?`, (l10 * w) / 10, `${dcTrim(l10, 1)} · ${w} = ${(l10 * w) / 10} m².`, ["Längd gånger bredd."], "m²"); } },
    { id: "tiles", skill: "w11-l5.tiles", gen: (rng) => { const a = rng.int(2, 6), b = rng.int(2, 5); return numeric(`tl-${a}-${b}`, "w11-l5.tiles", `Ett golv är ${a} m × ${b} m. Plattorna är 50 cm × 50 cm. Hur många plattor går åt?`, 4 * a * b, `Längs ${a} m går ${2 * a} plattor, längs ${b} m går ${2 * b}. ${2 * a} · ${2 * b} = ${4 * a * b}.`, ["Hur många plattor ryms längs en sida?"]); } },
    { id: "mixedSides", skill: "w11-l5.rect", gen: (rng) => { const A = rng.pick([150, 250, 350, 450, 300, 400]), B = rng.pick([2, 4, 6]); return numeric(`mxs-${A}-${B}`, "w11-l5.rect", `En rektangel är ${A} cm lång och ${B} m bred. Hur stor är arean i m²?`, dcAcc(A * B, 2), `${A} cm = ${dcTrim(A, 2)} m. ${dcTrim(A, 2)} · ${B} = ${dcTrim(A * B, 2)} m².`, ["Gör om sidorna till samma enhet först."], "m²"); } },
    { id: "compare", skill: "w11-l5.compare", gen: (rng) => cmpEx(rng, "w11-l5.compare", AREA, "area") },
    { id: "paint", skill: "w11-l5.rect", gen: (rng) => { const w = rng.int(2, 6), h = rng.int(2, 4); const area = w * h * 2; return numeric(`pn-${w}-${h}`, "w11-l5.rect", `Du ska måla två väggar, var och en ${w} m bred och ${h} m hög. Hur många m² ska målas?`, area, `En vägg är ${w} · ${h} = ${w * h} m². Två väggar: ${area} m².`, ["Area av en vägg gånger två."], "m²"); } },
  ],
  method: [
    { id: "convSteps", skill: "w11-l5.convert", gen: (rng) => convSteps(rng, "w11-l5.convert", AREA, { maxGap: 4, maxDec: 4 }) },
    { id: "sameUnit", skill: "w11-l5.rect", gen: (rng) => { const A = rng.pick([150, 250, 350, 450]), B = rng.pick([2, 4, 6]); return multifield(`su-${A}-${B}`, "w11-l5.rect", `En rektangel är ${A} cm lång och ${B} m bred. Räkna arean i m², i steg.`, [{ label: "Längden i m", suffix: "m", accept: dcAcc(A, 2) }, { label: "Arean", suffix: "m²", accept: dcAcc(A * B, 2) }], `${A} cm = ${dcTrim(A, 2)} m. ${dcTrim(A, 2)} · ${B} = ${dcTrim(A * B, 2)} m².`, ["Samma enhet på båda sidor."]); } },
  ],
  representation: [
    { id: "polyRoom", skill: "w11-l5.rect", gen: (rng) => { const l = rng.int(3, 7), b = rng.int(2, 4); return withVisual(numeric(`pr-${l}-${b}`, "w11-l5.rect", "Rummet har en ritning (sidorna anges i meter och decimeter). Hur stor är golvytan i m²?", l * b, `Längden ${l} m och bredden ${b * 10} dm = ${b} m. Area ${l} · ${b} = ${l * b} m².`, ["Gör om dm till m (1 m = 10 dm)."], "m²"), { type: "polygon", pts: rectPts(l, b), sides: [`${l} m`, `${b * 10} dm`, `${l} m`, `${b * 10} dm`] }); } },
    { id: "balanceFind", skill: "w11-l5.balance", gen: (rng) => balanceConv(rng, "w11-l5.balance", AREA) },
    { id: "balanceSign", skill: "w11-l5.balance", gen: (rng) => signBalance(rng, "w11-l5.balance", AREA) },
  ],
  teacher: {
    title: "1 m² är inte 100 cm²",
    scenarios: ["Nina (åk 6) säger att 1 m² är 100 cm², ”för 1 m är 100 cm”."],
    prompt: "Förklara för Nina varför 1 m² inte är 100 cm², hur många cm² det är, och hur hon kan se det med en bild av en kvadrat.",
    minChars: 170,
    rubric: { minConcepts: 4, concepts: [
      { id: "kvadrat", label: "en kvadrat 1 m × 1 m = 100 cm × 100 cm", any: ["100 cm", "100 · 100", "100·100", "100 gånger 100", "kvadrat"] },
      { id: "svar", label: "rätt svar 10 000 cm²", any: ["10 000", "10000", "tio tusen"] },
      { id: "area", label: "area är längd gånger längd / två dimensioner", any: ["längd gånger", "längd · bredd", "två dimensioner", "längd och bredd", "gånger varandra", "i kvadrat"] },
      { id: "fel", label: "att Ninas svar bara tar hänsyn till en dimension", any: ["en dimension", "bara längden", "bara ena", "längdsambandet", "bara 100"] },
      { id: "rutor", label: "rutor på 1 cm²", any: ["rutor", "små kvadrater", "1 cm²", "cm²-rutor"] },
    ] },
    modelAnswer: "Nina, 1 m är 100 cm, men arean är längd gånger längd. En kvadrat som är 1 m på varje sida är 100 cm lång och 100 cm bred, så den rymmer 100 · 100 = 10 000 små rutor på 1 cm². Alltså är 1 m² lika med 10 000 cm². Ditt svar 100 tar bara hänsyn till en dimension, längden, och inte bredden.",
  },
};

// ───────── Lektion 6: Skala ─────────
const DRAW_S = [10, 20, 50, 100, 200, 500];
const MAP_S = [10000, 25000, 50000, 100000];
export const lesson6: Lesson = {
  id: "w11-l6", worldId: "w11", title: "Skala – ritningar och kartor", grades: "åk 4–6",
  summary: "Skala 1:100 betyder att 1 cm på ritningen är 100 cm i verkligheten.",
  lgr: "Skala vid förminskning och förstoring",
  objectives: ["Räkna verklig längd ur en ritning i given skala.", "Räkna ritningens längd ur verkligheten.", "Avgöra skalan när ritning och verklighet är kända."],
  intro: "En **skala** berättar hur mycket en bild är förminskad eller förstorad. **1:100** betyder: *1 cm på ritningen är 100 cm i verkligheten*. Första talet är ritningen, andra verkligheten. Skala **10:1** är tvärtom en förstoring: 10 mm på ritningen är 1 mm på riktigt, som när man ritar en insekt.",
  theory: [
    { heading: "Läs skalan rätt", body: "I skala $1:50$ är 1 cm på ritningen 50 cm i verkligheten. En sträcka på 6 cm på ritningen är $6 \\cdot 50 = 300$ cm = 3 m. Gå från **ritning till verklighet**: multiplicera med skalans andra tal.", visual: { type: "polygon", pts: rectPts(6, 4), sides: ["6 cm", "4 cm", "6 cm", "4 cm"] } },
    { heading: "Från verklighet till ritning", body: "Ett rum är 4 m = 400 cm. I skala 1:100 blir det $400 \\div 100 = 4$ cm på ritningen. **Dela** med skalans andra tal." },
    { heading: "Kartor", body: "En karta i skala $1:100\\,000$: 3 cm på kartan är $300\\,000$ cm i verkligheten. $100\\,000$ cm $= 1\\,000$ m $= 1$ km, så 3 cm är 3 km. Byt enhet i slutet, så blir räkningen enklare." },
    { heading: "Hitta skalan", body: "5 cm på ritningen är 10 m = 1 000 cm i verkligheten. Skalan är $5 : 1000 = 1 : 200$. Gör om till samma enhet och dela båda talen så att ritningens tal blir 1." },
  ],
  worked: [
    { title: "Ritning till verklighet", problem: "Skala 1:50. Ritningen är 6 cm. Hur långt är det i m?", steps: [{ text: "Verklig längd i cm.", math: "6 \\cdot 50 = 300" }, { text: "Till meter.", math: "300 \\div 100 = 3" }], why: "1 cm på ritningen är 50 cm på riktigt.", alternative: "Hälften av 6 cm · 100: 6 cm i skala 1:100 vore 6 m, och 1:50 är dubbelt så stor ritning, alltså 3 m." },
    { title: "Karta", problem: "Skala 1:50 000. Sträckan på kartan är 4 cm. Hur många km?", steps: [{ text: "Verklighet i cm.", math: "4 \\cdot 50\\,000 = 200\\,000" }, { text: "Till km: 100 000 cm = 1 km.", math: "200\\,000 \\div 100\\,000 = 2" }], why: "Först multiplicera med skalan, sedan byt enhet.", alternative: "1 cm på kartan = 500 m, så 4 cm = 2 000 m = 2 km." },
  ],
  drawing: { task: "Mät ditt bord. Rita det i skala 1:10 på rutpapper. Hur lång blir ritningen i cm om bordet är 120 cm?", tool: "grid" },
  pupils: [{ pupil: "Selma", said: "Skala 1:100, och sträckan är 5 cm på ritningen. Då är den 5 : 100 = 0,05 i verkligheten.", misconception: "Delar i stället för att multiplicera när hon går från ritning till verklighet.", response: "Låt Selma läsa skalan: 1 cm på ritningen är 100 cm på riktigt. Då blir 5 cm 5 · 100 = 500 cm = 5 m, och det är rimligt för ett rum." }],
  knowledge: [
    { id: "drawToReal", skill: "w11-l6.real", gen: (rng) => { const S = rng.pick(DRAW_S), D = rng.int(2, 40);
      return numeric(`dr-${S}-${D}`, "w11-l6.real", `En ritning har skala 1:${S}. En sträcka är ${D} cm på ritningen. Hur lång är den i verkligheten? Svara i m.`, dcAcc(D * S, 2), `${D} · ${S} = ${D * S} cm = ${dcTrim(D * S, 2)} m.`, ["Multiplicera med skalans andra tal, byt sedan till meter."], "m"); } },
    { id: "mapToReal", skill: "w11-l6.map", gen: (rng) => { const S = rng.pick(MAP_S), D = rng.int(2, 12);
      return numeric(`mp-${S}-${D}`, "w11-l6.map", `En karta har skala 1:${sv(S)}. En sträcka är ${D} cm på kartan. Hur lång är den i verkligheten? Svara i km.`, dcAcc(D * S, 5), `${D} · ${sv(S)} = ${sv(D * S)} cm = ${dcTrim(D * S, 5)} km (1 km = 100 000 cm).`, ["Multiplicera med skalan, byt sedan till km."], "km"); } },
    { id: "realToDraw", skill: "w11-l6.draw", gen: (rng) => { for (;;) { const S = rng.pick([50, 100, 200, 500]), D = rng.int(2, 30); if ((D * S) % 100 === 0) return numeric(`rd-${S}-${D}`, "w11-l6.draw", `I verkligheten är en sträcka ${(D * S) / 100} m. Hur lång blir den på en ritning i skala 1:${S}? Svara i cm.`, D, `${(D * S) / 100} m = ${D * S} cm. ${D * S} ÷ ${S} = ${D} cm.`, ["Gör om till cm, dela med skalans andra tal."], "cm"); } } },
    { id: "findScale", skill: "w11-l6.find", gen: (rng) => { for (;;) { const S = rng.pick([20, 50, 100, 200, 500]), D = rng.pick([2, 4, 5, 10]); if ((D * S) % 100) continue; const R = (D * S) / 100;
      return mc(`fs-${S}-${D}`, "w11-l6.find", `En sträcka är ${D} cm på en ritning och ${R} m i verkligheten. Vilken skala har ritningen?`, `1:${S}`, [20, 50, 100, 200, 500].filter((x) => x !== S).map((x) => ({ text: `1:${x}` })), `${R} m = ${R * 100} cm. ${R * 100} ÷ ${D} = ${S}, alltså 1:${S}.`, ["Gör om till samma enhet och dela."], rng); } } },
    { id: "enlarge", skill: "w11-l6.enlarge", gen: (rng) => { const f = rng.pick([2, 5, 10]), mm = rng.int(2, 9); return numeric(`en-${f}-${mm}`, "w11-l6.enlarge", `En insekt är ${mm} mm lång. Du ritar den i skala ${f}:1. Hur lång blir ritningen i mm?`, mm * f, `Skala ${f}:1 är en förstoring ${f} gånger: ${mm} · ${f} = ${mm * f} mm.`, ["Första talet är ritningen: den är större."], "mm"); } },
    { id: "meaning", skill: "w11-l6.concept", gen: (rng) => { const S = rng.pick([20, 50, 100, 200]); return mc(`mn-${S}`, "w11-l6.concept", `Vad betyder skala 1:${S}?`, `1 cm på ritningen är ${S} cm i verkligheten`, [{ text: `1 cm på ritningen är ${S} mm i verkligheten` }, { text: `${S} cm på ritningen är 1 cm i verkligheten`, note: "Det vore en förstoring." }, { text: `Verkligheten är ${S} gånger mindre än ritningen` }], `Första talet är ritningen, andra verkligheten: 1 cm blir ${S} cm.`, ["Vilket tal är ritningen?"], rng); } },
  ],
  method: [
    { id: "scaleSteps", skill: "w11-l6.real", gen: (rng) => { const S = rng.pick(DRAW_S), D = rng.int(2, 40); return multifield(`ss-${S}-${D}`, "w11-l6.real", `Skala 1:${S}. Ritningen är ${D} cm. Räkna ut den verkliga längden i steg.`, [{ label: "Verklig längd i cm", suffix: "cm", accept: [D * S] }, { label: "Verklig längd i m", suffix: "m", accept: dcAcc(D * S, 2) }], `${D} · ${S} = ${D * S} cm = ${dcTrim(D * S, 2)} m.`, ["Multiplicera, byt sedan enhet."]); } },
    { id: "findSteps", skill: "w11-l6.find", gen: (rng) => { for (;;) { const S = rng.pick([20, 50, 100, 200]), D = rng.pick([2, 4, 5, 10]); if ((D * S) % 100) continue; const R = (D * S) / 100; return multifield(`fd-${S}-${D}`, "w11-l6.find", `${D} cm på en ritning motsvarar ${R} m i verkligheten. Räkna ut skalan 1:□ i steg.`, [{ label: "Verklig längd i cm", suffix: "cm", accept: [R * 100] }, { label: "□ (verklig längd ÷ ritningens längd)", accept: [S] }], `${R} m = ${R * 100} cm. ${R * 100} ÷ ${D} = ${S}.`, ["Samma enhet först."]); } } },
  ],
  representation: [
    { id: "drawingRoom", skill: "w11-l6.picture", gen: (rng) => { for (;;) { const S = rng.pick([50, 100]), l = rng.int(3, 8), b = rng.int(2, 6); if ((l * S) % 100 || (b * S) % 100) continue; return withVisual(multifield(`dm-${S}-${l}-${b}`, "w11-l6.picture", `Bilden är en ritning av ett rum i skala 1:${S}. Hur stort är rummet i verkligheten?`, [{ label: "Längd", suffix: "m", accept: [(l * S) / 100] }, { label: "Bredd", suffix: "m", accept: [(b * S) / 100] }, { label: "Golvyta", suffix: "m²", accept: [(l * b * S * S) / 10000] }], `Längd ${l} · ${S} = ${l * S} cm = ${(l * S) / 100} m, bredd ${(b * S) / 100} m; area ${(l * b * S * S) / 10000} m².`, ["Multiplicera varje sida med skalan, byt sedan till m."]), { type: "polygon", pts: rectPts(l, b), sides: [`${l} cm`, `${b} cm`, `${l} cm`, `${b} cm`] }); } } },
    { id: "rulerScale", skill: "w11-l6.picture", gen: (rng) => { const S = rng.pick([50, 100, 200]), from = rng.int(0, 3) * 10, len = rng.int(2, Math.floor((100 - from) / 10) - (from ? 0 : 1)) * 10; return withVisual(numeric(`rl-${S}-${from}-${len}`, "w11-l6.picture", `Linjalen visar en sträcka på en ritning i skala 1:${S}. Hur lång är sträckan i verkligheten? Svara i m.`, dcAcc((len / 10) * S, 2), `Sträckan är ${len / 10} cm på ritningen: ${len / 10} · ${S} = ${(len / 10) * S} cm = ${dcTrim((len / 10) * S, 2)} m.`, ["Läs av längden (slut − början), multiplicera med skalan."], "m"), { type: "ruler", cm: 10, from, to: from + len }); } },
  ],
  teacher: {
    title: "Multiplicera eller dela?",
    scenarios: ["Selma (åk 5) har en ritning i skala 1:100 där en vägg är 5 cm. Hon räknar 5 : 100 = 0,05 och tror att väggen är 0,05 m."],
    prompt: "Förklara för Selma vad skala 1:100 betyder, hur hon går från ritningen till verkligheten, vad väggen verkligen mäter och varför 0,05 m är orimligt.",
    minChars: 170,
    rubric: { minConcepts: 4, concepts: [
      { id: "betyder", label: "1 cm på ritningen är 100 cm i verkligheten", any: ["1 cm på ritningen", "ett cm", "100 cm i verkligheten", "100 gånger"] },
      { id: "mult", label: "multiplicera med 100", any: ["multiplicera", "gånger 100", "· 100", "·100", "5 · 100", "5 gånger 100", "x 100"] },
      { id: "svar", label: "rätt svar 500 cm = 5 m", any: ["500 cm", "5 m", "fem meter"] },
      { id: "rimlig", label: "0,05 m (5 cm) är orimligt för en vägg", any: ["orimlig", "rimlig", "för litet", "för liten", "för kort", "vägg är"] },
      { id: "forstorad", label: "ritningen är förminskad, verkligheten större", any: ["förminsk", "mindre än", "större i verkligheten", "ritningen är mindre"] },
    ] },
    modelAnswer: "Selma, skala 1:100 betyder att 1 cm på ritningen är 100 cm i verkligheten. Ritningen är förminskad, så verkligheten är större. När du går från ritning till verklighet ska du multiplicera med 100: 5 · 100 = 500 cm, alltså 5 m. Att dela ger 0,05 m, och det är orimligt, en vägg är inte 5 cm lång. Kolla alltid att svaret är rimligt.",
  },
};
void dcTrim;
