import type { Lesson } from "../types";
import { mc, numeric, multifield, sv, numberlineEx, withVisual } from "@/lib/engine/gen-helpers";

const r100 = (n: number) => Math.round(n / 100) * 100;
const r1000 = (n: number) => Math.round(n / 1000) * 1000;

// ───────── Lektion 5 ─────────
export const lesson5: Lesson = {
  id: "w2-l5", worldId: "w2", title: "Addition och subtraktion hänger ihop", grades: "åk 4–6",
  summary: "Räknefamiljer, saknade tal och kontroll med motsatt räknesätt.",
  lgr: "De fyra räknesätten och regler för deras användning; samband mellan räknesätten",
  objectives: ["Skriva räknefamiljer (tre tal, fyra likheter).", "Lösa saknade tal med motsatt räknesätt.", "Kontrollera beräkningar med inversen."],
  intro: "Addition och subtraktion är två sidor av samma mynt: de beskriver samma samband mellan tre tal. När du ser det kan du lösa ”saknade tal”-uppgifter (som $□ + 347 = 1\\,000$) och inför du algebra: det är i grunden ekvationer.",
  theory: [
    { heading: "Räknefamiljen", body: "Tre tal, en helhet och två delar, ger fyra likheter: $23 + 45 = 68$, $45 + 23 = 68$, $68 - 23 = 45$, $68 - 45 = 23$. Helheten står alltid ensam i en addition och först i en subtraktion.", visual: { type: "compare", a: 23, b: 45 } },
    { heading: "Saknade tal", body: "För att lösa $□ + 347 = 1\\,000$ tänker vi: delen = helheten − den andra delen. Alltså $□ = 1\\,000 - 347 = 653$. Det här är **ekvationslösning** med inversa räknesätt." },
    { heading: "Kontroll", body: "Kontrollera subtraktion med addition och addition med subtraktion: $523 - 178 = 345$ stämmer om $345 + 178 = 523$." },
  ],
  worked: [
    { title: "Saknad term", problem: "Lös 83 + □ = 140.", steps: [{ text: "Helheten är 140 och den kända delen är 83.", math: "\\text{helhet} = 140,\\ \\text{del} = 83" }, { text: "Den saknade delen är helheten minus den kända delen.", math: "140 - 83 = 57" }, { text: "Kontrollera:", math: "83 + 57 = 140" }], why: "Subtraktion 'ångrar' addition: om $83 + x = 140$ så är $x = 140 - 83$.", alternative: "Räkna uppåt: 83 → 100 (17), 100 → 140 (40): $17 + 40 = 57$." },
    { title: "Ordningen i subtraktion", problem: "Vilken räknefamilj hör till 12, 5 och 17?", steps: [{ text: "Helheten är 17 (störst).", math: "5 + 12 = 17,\\ 12 + 5 = 17" }, { text: "Subtraktionerna börjar med helheten.", math: "17 - 5 = 12,\\ 17 - 12 = 5" }], why: "$5 - 12$ ingår inte – den hör inte till familjen (negativt tal).", alternative: "Rita en del-helhet-modell (stapel delad i två delar)." },
  ],
  drawing: { task: "Rita en del-helhet-stapel för 68 = 23 + 45 och skriv alla fyra likheterna.", tool: "grid" },
  pupils: [{ pupil: "Alma", said: "Om 8 + 5 = 13 så är väl 5 − 8 = 3 också? Det är ju samma tal.", misconception: "Blandar ihop kommutativitet (addition) med subtraktion.", response: "Visa räknefamiljen: helheten står först i subtraktion. Använd en stapelmodell." }],
  knowledge: [
    { id: "missingPart", skill: "w2-l5.missing", gen: (rng, { level }) => { const a = rng.int(21, level > 1 ? 689 : 89), whole = a + rng.int(11, level > 1 ? 489 : 79); const front = rng.chance(0.5); return numeric(`mp-${a}-${whole}-${front}`, "w2-l5.missing", front ? `□ + ${sv(a)} = ${sv(whole)}` : `${sv(a)} + □ = ${sv(whole)}`, whole - a, `${sv(whole)} − ${sv(a)} = ${sv(whole - a)}.`, ["Hela talet minus den kända delen."]); } },
    { id: "missingMinuend", skill: "w2-l5.missing", gen: (rng) => { const b = rng.int(14, 98), d = rng.int(12, 85); return numeric(`mm-${b}-${d}`, "w2-l5.missing", `□ − ${b} = ${d}`, b + d, `Det man börjar med är differensen plus det som tas bort: ${d} + ${b} = ${b + d}.`, ["Ångra subtraktionen med addition."]); } },
    { id: "familyMc", skill: "w2-l5.family", gen: (rng) => { const a = rng.int(11, 59), b = rng.int(11, 59), c = a + b; return mc(`fm-${a}-${b}`, "w2-l5.family", `Du vet att ${a} + ${b} = ${c}. Vilken av dessa är alltid sann?`, `${c} − ${a} = ${b}`, [{ text: `${a} − ${c} = ${b}`, note: "Det vore ett negativt resultat – helheten står först." }, { text: `${b} − ${c} = ${a}` }, { text: `${a} − ${b} = ${c}` }], `Helheten ${c} står först i subtraktionen.`, ["Helheten måste stå först i subtraktionen."], rng); } },
    { id: "checkOp", skill: "w2-l5.check", gen: (rng) => { const a = rng.int(300, 900), b = rng.int(110, 299), d = a - b; return mc(`co-${a}-${b}`, "w2-l5.check", `Vilken beräkning kontrollerar att ${a} − ${b} = ${d}?`, `${d} + ${b}`, [{ text: `${a} + ${b}` }, { text: `${d} − ${b}` }, { text: `${a} − ${d}` , note: "Det är faktiskt också en giltig kontroll (får tillbaka " + b + "), men den vanligaste är addition." }].filter((w) => !w.text.includes(`${a} − ${d}`)), `${d} + ${b} = ${a} – då stämmer differensen.`, ["Vilken operation ångrar subtraktion?"], rng); } },
  ],
  method: [
    { id: "familyFill", skill: "w2-l5.family", gen: (rng) => { const a = rng.int(21, 69), b = rng.int(21, 69), c = a + b; return multifield(`ff-${a}-${b}`, "w2-l5.family", `Skriv räknefamiljen för ${a}, ${b} och ${c}. Fyll i de tre sista talen.`, [{ label: `${b} + ${a} =`, accept: [c] }, { label: `${c} − ${a} =`, accept: [b] }, { label: `${c} − ${b} =`, accept: [a] }], `Familjen: ${a}+${b}=${c}, ${b}+${a}=${c}, ${c}−${a}=${b}, ${c}−${b}=${a}.`, ["Helheten står först i subtraktion."]); } },
    { id: "countUp", skill: "w2-l5.count-up", gen: (rng) => { const b = rng.int(21, 94) * 10 + rng.int(1, 9); const t = (Math.floor(b / 100) + 1) * 100, a = t + rng.int(2, 7) * 100; return multifield(`cu-${a}-${b}`, "w2-l5.count-up", `Räkna ${sv(a)} − ${sv(b)} genom att räkna uppåt från ${sv(b)}.`, [{ label: `${sv(b)} → ${sv(t)}`, accept: [t - b] }, { label: `${sv(t)} → ${sv(a)}`, accept: [a - t] }, { label: "Differens", accept: [a - b] }], `${t - b} + ${a - t} = ${a - b}.`, ["Hoppa till nästa jämna hundratal."]); } },
  ],
  representation: [
    { id: "partWhole", skill: "w2-l5.bar", gen: (rng) => { const a = rng.int(120, 480), b = rng.int(120, 480); return multifield(`pw-${a}-${b}`, "w2-l5.bar", `En stapel visar helheten ${sv(a + b)}. Den ena delen är ${sv(a)}. Fyll i den andra delen och skriv en subtraktion och en addition för bilden.`, [{ label: "Den andra delen", accept: [b] }, { label: `${sv(a + b)} − ${sv(a)} =`, accept: [b] }, { label: `${sv(a)} + ${sv(b)} =`, accept: [a + b] }], `Delarna ${sv(a)} och ${sv(b)} bildar helheten ${sv(a + b)}.`, []); } },
    { id: "distLine", skill: "w2-l5.numberline", gen: (rng) => { const a = rng.int(1, 5) * 10, d = rng.int(1, 5) * 10; return numberlineEx(`dli-${a}-${d}`, "w2-l5.numberline", `Skillnaden mellan två tal är ${d} och det större talet är ${a + d}. Markera det mindre talet.`, a, { min: 0, max: 120, step: 10, labelEvery: 20 }, `${a + d} − ${d} = ${a}.`, []); } },
  ],
  teacher: {
    title: "Räknefamiljer och kommutativitet",
    scenarios: ["Alma (åk 4) vet att 8 + 5 = 13 och drar slutsatsen: \"Då är 5 − 8 också 3, de har ju samma siffror.\""],
    prompt: "Förklara för Alma vad som skiljer addition från subtraktion när man byter plats på talen, och hur räknefamiljen hjälper henne att veta vilken subtraktion som stämmer.",
    minChars: 160,
    rubric: {
      minConcepts: 3,
      concepts: [
        { id: "komm", label: "att addition kan byta plats men subtraktion inte", any: ["byta plats", "kommutativ", "spelar roll", "ordningen"] },
        { id: "familj", label: "räknefamiljen/helheten står först", any: ["räknefamilj", "helheten", "helhet", "störst"] },
        { id: "ex", label: "rätt subtraktioner (13 − 5 = 8 och 13 − 8 = 5)", any: ["13 − 5", "13 - 5", "13 − 8", "13 - 8"] },
        { id: "modell", label: "en modell (stapel, tallinje, kuber)", any: ["stapel", "tallinje", "kuber", "bild", "modell", "rita"] },
      ],
    },
    modelAnswer: "Alma, addition får byta plats: 8 + 5 = 5 + 8 = 13. Men subtraktion gör det inte. Tänk på en stapel med helheten 13 delad i 8 och 5. Från helheten kan vi ta bort en del: 13 − 5 = 8 och 13 − 8 = 5. Helheten måste stå först. 5 − 8 hör inte till familjen och blir inte 3. Det är ett negativt tal. Ordningen spelar roll i subtraktion.",
  },
};

// ───────── Lektion 6 ─────────
export const lesson6: Lesson = {
  id: "w2-l6", worldId: "w2", title: "Överslagsräkning och rimlighet", grades: "åk 4–6",
  summary: "Avrunda smart, räkna ungefär och bedöm om ett svar är rimligt.",
  lgr: "Överslagsräkning; rimlighetsbedömning vid uppskattningar och beräkningar",
  objectives: ["Göra överslag vid addition och subtraktion.", "Välja lämplig avrundning.", "Bedöma om ett svar är rimligt."],
  intro: "Räknemaskiner och telefoner gör fel räkningar nästan aldrig – men *vi* trycker fel. Förmågan att avgöra om ett svar kan stämma är därför viktigare än någonsin, och en förmåga som Lgr22 uttryckligen lyfter fram.",
  theory: [
    { heading: "Överslag", body: "Avrunda talen till samma enhet och räkna: $4\\,987 + 3\\,012 \\approx 5\\,000 + 3\\,000 = 8\\,000$. Tecknet $\\approx$ betyder ”ungefär lika med”." },
    { heading: "Välj avrundning efter syftet", body: "Vill du veta om pengarna *räcker*, avrunda uppåt (pessimistiskt). Vill du ha en rimlig gissning, avrunda till närmaste. Det är ingen exakt vetenskap – men var tydlig med vad du gör." },
    { heading: "Rimlighetsbedömning", body: "Fråga: har svaret rätt storleksordning? Ska det bli större eller mindre än talen jag började med? $4\\,987 + 3\\,012 = 800$ är orimligt, eftersom en summa är större än varje term." },
  ],
  worked: [
    { title: "Överslag med tusental", problem: "Gör ett överslag för 6 842 + 2 179.", steps: [{ text: "Avrunda till närmaste tusental.", math: "6\\,842 \\approx 7\\,000,\\ 2\\,179 \\approx 2\\,000" }, { text: "Räkna.", math: "7\\,000 + 2\\,000 = 9\\,000" }], why: "Den exakta summan är 9 021 – nära överslaget. Skillnaden beror på avrundningen.", alternative: "Avrunda till hundratal för ett noggrannare överslag: $6\\,800 + 2\\,200 = 9\\,000$." },
    { title: "Rimlig differens", problem: "Är 5 003 − 1 234 = 4 769 rimligt?", steps: [{ text: "Överslag: 5 000 − 1 000 = 4 000.", math: "5\\,000 - 1\\,000 = 4\\,000" }, { text: "4 769 är ganska långt från 4 000 (nästan 800 för mycket).", math: "4\\,769 - 4\\,000 = 769" }, { text: "Rätt svar är 3 769 – du har sannolikt glömt en växling.", math: "3\\,769" }], why: "Överslaget är grovt men fångar fel av storleksordningen 1 000.", alternative: "Kontrollera med addition: $4\\,769 + 1\\,234 = 6\\,003 \\neq 5\\,003$." },
  ],
  drawing: { task: "Rita en tallinje och markera 6 842 och 2 179 med avrundade tusental. Visa vilket det ligger närmast.", tool: "numberline" },
  pupils: [{ pupil: "Leo", said: "Överslag är bara att gissa, och gissningen är nästan alltid fel. Det är onödigt.", misconception: "Ser överslag som oprecis i stället för som en kontroll.", response: "Visa en räkning med uppenbart fel svar där överslaget hade fångat det. Förklara att överslaget är en kontroll, inte ett exakt svar." }],
  knowledge: [
    { id: "estimateAdd", skill: "w2-l6.estimate", gen: (rng, { level }) => { const a = rng.int(1200, 8800), b = rng.int(1200, 8800); return numeric(`ea-${a}-${b}`, "w2-l6.estimate", `Överslag: avrunda till närmaste tusental och addera ${sv(a)} + ${sv(b)}.`, r1000(a) + r1000(b), `${sv(r1000(a))} + ${sv(r1000(b))} = ${sv(r1000(a) + r1000(b))}.`, ["Avrunda var och en för sig."]); } },
    { id: "estimateSub", skill: "w2-l6.estimate", gen: (rng) => { const b = rng.int(1200, 4800), a = b + rng.int(1500, 4000); return numeric(`es-${a}-${b}`, "w2-l6.estimate", `Överslag: avrunda till närmaste hundratal och subtrahera ${sv(a)} − ${sv(b)}.`, r100(a) - r100(b), `${sv(r100(a))} − ${sv(r100(b))} = ${sv(r100(a) - r100(b))}.`, ["Avrunda först."]); } },
    { id: "reasonable", skill: "w2-l6.reasonable", gen: (rng) => { const a = rng.int(2100, 6900), b = rng.int(1100, 3900), s = a + b; return mc(`rs-${a}-${b}`, "w2-l6.reasonable", `Vilket svar är rimligt för ${sv(a)} + ${sv(b)}?`, sv(r100(s)), [{ text: sv(s * 10), note: "Svaret är orimligt stort." }, { text: sv(Math.round(s / 10)), note: "Svaret är orimligt litet." }, { text: sv(Math.round(s / 3 / 100) * 100), note: "Summan är större än varje term." }], `Överslaget ${sv(r1000(a) + r1000(b))} visar var svaret bör ligga.`, ["Räkna ett överslag."], rng); } },
    { id: "whichBigger", skill: "w2-l6.concept", gen: (rng) => mc("wb", "w2-l6.concept", "Du gör ett överslag och får cirka 8 000, men miniräknaren visar 800. Vad är mest sannolikt?", "Du har tryckt fel på miniräknaren", [{ text: "Överslaget är fel" }, { text: "Miniräknaren har alltid rätt" }, { text: "Överslag och exakt svar kan skilja en faktor 10" }], "Skillnaden är en faktor 10 – ett typiskt knappfel. Rimlighetsbedömningen fångar det.", [], rng) },
  ],
  method: [
    { id: "estimateSteps", skill: "w2-l6.estimate", gen: (rng) => { const a = rng.int(1200, 8800), b = rng.int(1200, 8800); return multifield(`est-${a}-${b}`, "w2-l6.estimate", `Gör ett överslag för ${sv(a)} + ${sv(b)} i steg (närmaste tusental).`, [{ label: `${sv(a)} avrundat`, accept: [r1000(a)] }, { label: `${sv(b)} avrundat`, accept: [r1000(b)] }, { label: "Överslag", accept: [r1000(a) + r1000(b)] }], `${sv(r1000(a))} + ${sv(r1000(b))} = ${sv(r1000(a) + r1000(b))}.`, []); } },
    { id: "compareEst", skill: "w2-l6.reasonable", gen: (rng) => { const a = rng.int(2100, 6900), b = rng.int(1100, 3900), s = a + b; const diff = Math.abs(s - (r1000(a) + r1000(b))); return multifield(`ce-${a}-${b}`, "w2-l6.reasonable", `Räkna ${sv(a)} + ${sv(b)} exakt och med överslag (närmaste tusental). Hur stor är skillnaden mellan dem?`, [{ label: "Exakt summa", accept: [s] }, { label: "Överslag", accept: [r1000(a) + r1000(b)] }, { label: "Skillnad (positivt tal)", accept: [diff] }], `Exakt ${sv(s)}, överslag ${sv(r1000(a) + r1000(b))}, skillnad ${sv(diff)}.`, []); } },
  ],
  representation: [
    { id: "estLine", skill: "w2-l6.numberline", gen: (rng) => { const a = rng.int(1500, 8499); return numberlineEx(`el-${a}`, "w2-l6.numberline", `${sv(a)} avrundas till närmaste tusental. Markera det på tallinjen.`, r1000(a), { min: 0, max: 10000, step: 1000, labelEvery: 2000 }, `${sv(a)} ligger närmast ${sv(r1000(a))}.`, []); } },
    { id: "estSumLine", skill: "w2-l6.numberline", gen: (rng) => { const a = rng.int(1, 4) * 1000, b = rng.int(1, 4) * 1000; return numberlineEx(`esl-${a}-${b}`, "w2-l6.numberline", `Överslaget för två tal blev ${sv(a)} + ${sv(b)}. Markera summan.`, a + b, { min: 0, max: 10000, step: 1000, labelEvery: 2000 }, `${sv(a)} + ${sv(b)} = ${sv(a + b)}.`, []); } },
  ],
  teacher: {
    title: "Varför överslag?",
    scenarios: ["Leo (åk 6) säger: \"Överslag är onödigt. Om jag ändå ska räkna exakt kan jag ju bara göra det direkt.\" Han har just fått 5 003 − 1 234 = 4 769 och sett att läraren strukit under."],
    prompt: "Förklara för Leo vad syftet med överslag är, hur man gör ett överslag för 5 003 − 1 234 och varför det hjälper honom att upptäcka sitt fel.",
    minChars: 160,
    rubric: {
      minConcepts: 3,
      concepts: [
        { id: "syfte", label: "att överslag är en kontroll/rimlighetsbedömning", any: ["kontroll", "rimlig", "rimlighet", "kolla", "upptäck"] },
        { id: "metod", label: "avrundning (5 000 − 1 000)", any: ["avrunda", "5 000", "5000", "4 000", "4000"] },
        { id: "fel", label: "att 4 769 är för stort / fel upptäcks", any: ["för stort", "för högt", "orimlig", "inte rimligt", "stämmer inte", "långt från"] },
        { id: "rat", label: "rätt svar 3 769 eller en växling", any: ["3 769", "3769", "växl"] },
      ],
    },
    modelAnswer: "Leo, ett överslag är inte till för att ersätta exakt räkning, utan för att kontrollera att svaret är rimligt. 5 003 − 1 234 ≈ 5 000 − 1 000 = 4 000. Ditt svar 4 769 är långt från 4 000, så det är orimligt stort. Det tyder på att du glömt en växling. Rätt svar är 3 769, vilket ligger nära överslaget. Överslag fångar fel som ”tusental fel” innan någon annan hinner göra det.",
  },
};

// ───────── Lektion 7 ─────────
const CONTEXTS: { who: string; item: string; unit: string }[] = [
  { who: "Maja", item: "kronor", unit: "kr" }, { who: "Elias", item: "klistermärken", unit: "st" }, { who: "Sara", item: "böcker", unit: "st" }, { who: "Omar", item: "poäng", unit: "p" },
];

export const lesson7: Lesson = {
  id: "w2-l7", worldId: "w2", title: "Textuppgifter och val av räknesätt", grades: "åk 4–6",
  summary: "Förstå en berättelse, välj räknesätt och modellera med delar och helhet.",
  lgr: "Strategier för att lösa matematiska problem i elevnära situationer; formulera och lösa problem",
  objectives: ["Tolka en textuppgift och ange vad som är känt och sökt.", "Välja räknesätt utifrån situationens struktur (inte nyckelord).", "Använda del-helhet-modell."],
  intro: "”Hur många blir kvar?” betyder inte alltid minus, och ”tillsammans” betyder inte alltid plus. Elever som lär sig att leta efter *nyckelord* misslyckas ofta i lite svårare uppgifter. Det som fungerar är att förstå **situationens struktur**.",
  theory: [
    { heading: "Fyra frågor", body: "1. Vad vet jag?\n\n2. Vad söker jag?\n\n3. Hur hänger det ihop (del–helhet, förändring, jämförelse)?\n\n4. Är svaret rimligt?" },
    { heading: "Tre vanliga strukturer", body: "- **Del–helhet:** delar läggs ihop till en helhet (eller helheten delas upp).\n\n- **Förändring:** en mängd ökar eller minskar.\n\n- **Jämförelse:** två mängder jämförs – skillnaden är differensen." },
    { heading: "Rita en modell", body: "Rita en stapel. Är helheten okänd lägger du ihop delarna. Är en del okänd drar du bort den kända delen från helheten. Bilden hjälper oavsett vilka tal som ingår." },
  ],
  worked: [
    { title: "Okänd start", problem: "Maja hade några kronor. Hon fick 45 kr och har nu 120 kr. Hur många kronor hade hon från början?", steps: [{ text: "Förändring: starttal + 45 = 120.", math: "x + 45 = 120" }, { text: "Det söks en del när helheten (120) och den andra delen (45) är kända.", math: "x = 120 - 45 = 75" }, { text: "Kontrollera:", math: "75 + 45 = 120" }], why: "Ordet ”fick” pekar på plus, men det vi räknar är minus. Därför fungerar inte nyckelordsmetoden.", alternative: "Rita en stapel med helheten 120 och delen 45." },
    { title: "Jämförelse", problem: "Elias har 128 klistermärken och Sara har 85. Hur många fler har Elias?", steps: [{ text: "Jämförelse: skillnaden mellan mängderna.", math: "128 - 85" }, { text: "Beräkna.", math: "= 43" }], why: "”Hur många fler” frågar efter skillnaden. Räkna uppåt: 85 → 100 → 128: $15 + 28 = 43$.", alternative: "Skillnad: $128 - 85 = 43$." },
  ],
  drawing: { task: "Rita en del-helhet-stapel för Majas problem (helhet 120, delar 45 och ?).", tool: "grid" },
  pupils: [{ pupil: "Vera", said: "I uppgiften står 'fick', så jag lägger ihop: 45 + 120 = 165.", misconception: "Nyckelordsstrategi i stället för att förstå situationen.", response: "Be Vera rita och berätta berättelsen med egna ord. Fråga: Har Maja mer eller mindre än 120 från början?" }],
  knowledge: [
    { id: "wordAdd", skill: "w2-l7.word-add", gen: (rng) => { const c = rng.pick(CONTEXTS), a = rng.int(120, 480), b = rng.int(110, 390); return numeric(`wa-${a}-${b}`, "w2-l7.word-add", `${c.who} har ${a} ${c.item}. Hen får ${b} till. Hur många ${c.item} har ${c.who} nu?`, a + b, `${a} + ${b} = ${a + b}.`, ["Rita en stapel."], c.unit); } },
    { id: "wordSub", skill: "w2-l7.word-sub", gen: (rng) => { const c = rng.pick(CONTEXTS), b = rng.int(110, 390), a = b + rng.int(40, 400); return numeric(`ws-${a}-${b}`, "w2-l7.word-sub", `${c.who} har ${a} ${c.item} och ger bort ${b}. Hur många ${c.item} har ${c.who} kvar?`, a - b, `${a} − ${b} = ${a - b}.`, [], c.unit); } },
    { id: "wordUnknownStart", skill: "w2-l7.word-start", gen: (rng) => { const c = rng.pick(CONTEXTS), add = rng.int(25, 95), total = rng.int(110, 290); return numeric(`wu-${add}-${total}`, "w2-l7.word-start", `${c.who} hade några ${c.item}. Efter att ha fått ${add} till har hen ${total}. Hur många ${c.item} hade ${c.who} från början?`, total - add, `Start + ${add} = ${total}, alltså start = ${total} − ${add} = ${total - add}. (Ordet ”fick” pekar på plus, men det vi räknar är minus.)`, ["Rita start, ändring och slut."], c.unit); } },
    { id: "chooseOp", skill: "w2-l7.choose", gen: (rng) => { const a = rng.int(120, 480), b = rng.int(50, 119); return mc(`ch-${a}-${b}`, "w2-l7.choose", `Elias har ${a} kr och köper en bok för ${b} kr. Hur mycket har han kvar? Vilken beräkning ska du göra?`, `${a} − ${b}`, [{ text: `${a} + ${b}` }, { text: `${b} − ${a}`, note: "Det vore ett negativt tal." }, { text: `${a} · ${b}` }], "Pengar tas bort, och vi vill veta vad som är kvar: helheten minus delen.", ["Blir det mer eller mindre?"], rng); } },
    { id: "compareDiff", skill: "w2-l7.compare", gen: (rng) => { const b = rng.int(85, 190), a = b + rng.int(15, 140); return numeric(`cmp-${a}-${b}`, "w2-l7.compare", `Anna har ${a} kort och Elias har ${b} kort. Hur många fler kort har Anna än Elias?`, a - b, `Jämförelse: skillnaden är ${a} − ${b} = ${a - b}.`, ["Skillnaden mellan mängderna."]); } },
  ],
  method: [
    { id: "problemSteps", skill: "w2-l7.model", gen: (rng) => { const a = rng.int(120, 480), b = rng.int(90, 340); return multifield(`pb-${a}-${b}`, "w2-l7.model", `Maja sparar ${sv(a)} kr i januari och ${sv(b)} kr i februari. Fyll i modellen.`, [{ label: "Helheten (alla pengar)", accept: [a + b] }, { label: "Del 1", accept: [a] }, { label: "Del 2", accept: [b] }, { label: "Räkneuttryck: del 1 + del 2 =", accept: [a + b] }], `${sv(a)} + ${sv(b)} = ${sv(a + b)}.`, []); } },
    { id: "unknownPart", skill: "w2-l7.model", gen: (rng) => { const w = rng.int(300, 880), p = rng.int(110, 280); return multifield(`up-${w}-${p}`, "w2-l7.model", `I en klass finns ${w} elever totalt i skolan, varav ${p} går i åk 5. Hur många går inte i åk 5? Fyll i modellen.`, [{ label: "Helheten", accept: [w] }, { label: "Känd del", accept: [p] }, { label: "Okänd del (svar)", accept: [w - p] }], `${w} − ${p} = ${w - p}.`, []); } },
  ],
  representation: [
    { id: "barModel", skill: "w2-l7.bar", gen: (rng) => { const w = rng.int(150, 480), p = rng.int(50, 140); return multifield(`bar-${w}-${p}`, "w2-l7.bar", `Stapeln visar helheten ${w} och en del ${p}. Vilken beräkning och vilket svar ger den andra delen?`, [{ label: `${w} − ${p} =`, accept: [w - p] }, { label: `Kontroll: ${p} + (svaret) =`, accept: [w] }], `${w} − ${p} = ${w - p}. Kontroll: ${p} + ${w - p} = ${w}.`, []); } },
    { id: "barLine", skill: "w2-l7.numberline", gen: (rng) => { const a = rng.int(2, 6) * 10, b = rng.int(1, 4) * 10; return numberlineEx(`bar2-${a}-${b}`, "w2-l7.numberline", `Maja har ${a} kr och får ${b} kr. Markera hennes nya summa på tallinjen.`, a + b, { min: 0, max: 120, step: 10, labelEvery: 20 }, `${a} + ${b} = ${a + b}.`, []); } },
  ],
  teacher: {
    title: "Nyckelord eller förståelse?",
    scenarios: ["Vera (åk 4) har fått lära sig att 'fick' betyder plus. I uppgiften 'Maja hade några kronor, fick 45 kr och har nu 120 kr. Hur många hade hon från början?' räknar hon 45 + 120 = 165."],
    prompt: "Förklara hur du hjälper Vera att förstå uppgiftens struktur i stället för att leta nyckelord. Beskriv en modell och visa hur uppgiften löses.",
    minChars: 160,
    rubric: {
      minConcepts: 3,
      concepts: [
        { id: "nyckel", label: "att nyckelord kan vilseleda", any: ["nyckelord", "vilseled", "ordet fick", "fick betyder", "orden"] },
        { id: "modell", label: "att rita en modell/stapel", any: ["rita", "stapel", "modell", "bild", "tallinje"] },
        { id: "rimlig", label: "rimlighet (hade hon mer än 120?)", any: ["rimlig", "mer än 120", "mindre än 120", "större än 120", "orimlig"] },
        { id: "svar", label: "rätt lösning 120 − 45 = 75", any: ["75", "120 − 45", "120 - 45"] },
      ],
    },
    modelAnswer: "Vera, ordet ”fick” kan vilseleda. Vi ritar en stapel: 120 är helheten, 45 är den del Maja fick, och vi söker den del hon hade från början. Då ser vi att vi ska ta helheten minus den kända delen: 120 − 45 = 75. Är det rimligt? Maja hade mindre än 120 från början, eftersom hon fick mer. Kontroll: 75 + 45 = 120. Genom att rita förstår vi situationen i stället för att gissa operationen av ett ord.",
  },
};
