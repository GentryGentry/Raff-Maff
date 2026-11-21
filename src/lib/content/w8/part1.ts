import type { Lesson } from "../types";
import { mc, numeric, multifield, withVisual, numberlineEx, sv } from "@/lib/engine/gen-helpers";
import type { Rng } from "@/lib/engine/rng";

/** Negative numbers are shown with a real minus sign (sv adds U+2212). */
const n = (x: number) => sv(x);
const par = (x: number) => (x < 0 ? `(${sv(x)})` : sv(x));
const nz = (rng: Rng, lo: number, hi: number) => { let v = 0; while (v === 0) v = rng.int(lo, hi); return v; };
const DAYS = ["måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag", "söndag"];

// ───────── Lektion 1: Negativa tal och tallinjen ─────────
export const lesson1: Lesson = {
  id: "w8-l1", worldId: "w8", title: "Negativa tal och tallinjen", grades: "åk 4–6",
  summary: "Tal under noll: temperatur, skuld och djup – och tallinjen åt vänster.",
  lgr: "Rationella tal, däribland negativa tal, och deras egenskaper samt hur talen kan delas upp och användas",
  objectives: ["Förklara vad ett negativt tal är och ge vardagsexempel.", "Läsa av och placera negativa tal på en tallinje och en termometer.", "Förstå att tallinjen fortsätter åt vänster om noll."],
  intro: "Hur kallt kan det bli? Under noll finns fler tal – **negativa tal**. De används ständigt: temperatur, skulder på ett bankkonto, våningar under marken, djup under havsytan. För elever är de ofta förvirrande eftersom ”minst” plötsligt inte är noll. Tallinjen gör dem begripliga.",
  theory: [
    { heading: "Tallinjen fortsätter åt vänster", body: "Till höger om noll finns de **positiva** talen, till vänster de **negativa**. $-3$ läses ”minus tre” och ligger 3 steg till vänster om noll. Noll är varken positivt eller negativt.", visual: { type: "numberline", min: -6, max: 6, step: 1, marks: [-3], labelEvery: 1 } },
    { heading: "Vardagens negativa tal", body: "- **Temperatur:** $-8\\,^\\circ\\text{C}$ betyder 8 grader *under* noll.\n\n- **Pengar:** $-120$ kr på kontot betyder att du är skyldig 120 kr.\n\n- **Höjd:** $-35$ m är 35 meter under havsytan.\n\n- **Hiss:** våning $-2$ är två våningar under entréplanet.", visual: { type: "thermometer", value: -8, min: -20, max: 20 } },
    { heading: "Ett steg åt vänster = ett mindre", body: "Går vi åt vänster blir talen *mindre*: $0$, $-1$, $-2$, $-3$ … Vi kan alltid gå ett steg till åt vänster – det finns inget minsta tal." },
    { heading: "Två sorters minustecken", body: "I $5 - 3$ är minus ett *räknesätt* (ta bort). I $-3$ är minus en del av *talet* (tre steg åt vänster om noll). Samma tecken, två betydelser – det är en källa till förvirring." },
  ],
  worked: [
    { title: "Läsa av tallinjen", problem: "Pilen på tallinjen står 4 steg till vänster om noll. Vilket tal är det?", steps: [{ text: "Åt vänster om noll är talen negativa.", math: "0, -1, -2, -3, -4" }, { text: "Fyra steg:", math: "-4" }], why: "Avståndet från noll är 4, och riktningen åt vänster ger minustecknet.", alternative: "Skuld: −4 kr betyder att du är skyldig 4 kr." },
    { title: "Termometern", problem: "Termometern visar 6 streck under noll (1 streck = 1 grad). Vilken temperatur är det?", steps: [{ text: "Under noll = negativt.", math: "-6\\,^\\circ\\text{C}" }, { text: "Det är kallare än −5 °C och varmare än −7 °C.", math: "-7 < -6 < -5" }], why: "Nedåt på termometern = åt vänster på tallinjen.", alternative: "Rita en lodrät tallinje: noll i mitten, positiva tal uppåt." },
  ],
  drawing: { task: "Rita en tallinje från −8 till 8. Markera −5, −1, 0 och 3. Rita sedan en termometer och markera −5 °C.", tool: "numberline" },
  pupils: [{ pupil: "Hugo", said: "Det finns inga tal under noll. Man kan ju inte ha mindre än ingenting.", misconception: "Tror att noll är det minsta talet (tänker på antal/mängder).", response: "Fråga om temperatur: ”Kan det vara −5 °C ute?” Låt Hugo hitta fler exempel: skuld, hiss, havsdjup. Visa att tallinjen fortsätter." }],
  knowledge: [
    { id: "readLine", skill: "w8-l1.read-line", gen: (rng) => { const v = nz(rng, -9, 9); return withVisual(numeric(`rl-${v}`, "w8-l1.read-line", "Vilket tal visar markeringen på tallinjen?", v, `Markeringen är ${Math.abs(v)} steg ${v < 0 ? "till vänster" : "till höger"} om noll: ${n(v)}.`, ["Vänster om noll är negativt."]), { type: "numberline", min: -10, max: 10, step: 1, marks: [v], labelEvery: 5 }); } },
    { id: "readThermo", skill: "w8-l1.thermometer", gen: (rng) => { const v = rng.int(-18, 24); return withVisual(numeric(`rt-${v}`, "w8-l1.thermometer", "Vilken temperatur visar termometern (i grader)?", v, `Termometern visar ${n(v)} °C.`, ["Ligger kvicksilvret över eller under noll?"], "°C"), { type: "thermometer", value: v, min: -20, max: 30 }); } },
    { id: "belowZero", skill: "w8-l1.sign", gen: (rng) => { const neg = rng.int(2, 15); const pos = rng.shuffle([1, 3, 5, 8, 12, 17, 20].filter((x) => x !== neg)).slice(0, 3); return mc(`bz-${neg}`, "w8-l1.sign", "Vilken temperatur är under noll?", `${n(-neg)} °C`, pos.map((x) => ({ text: `${x} °C` })), `${n(-neg)} är ett negativt tal, alltså under noll.`, ["Under noll = negativt tal."], rng); } },
    { id: "oneLess", skill: "w8-l1.neighbours", gen: (rng) => { const k = rng.int(-8, 3); const less = rng.chance(0.5); return numeric(`ol-${k}-${less}`, "w8-l1.neighbours", `Vilket tal är 1 ${less ? "mindre" : "mer"} än ${n(k)}?`, less ? k - 1 : k + 1, `${less ? "Ett steg åt vänster" : "Ett steg åt höger"} från ${n(k)}: ${n(less ? k - 1 : k + 1)}.`, ["Åt vänster blir talet mindre."]); } },
    { id: "meaning", skill: "w8-l1.meaning", gen: (rng) => { const k = rng.int(3, 20); const kind = rng.pick(["temp", "debt", "depth"] as const); const cfg = { temp: [`Vad betyder ${n(-k)} °C?`, `${k} grader under noll`, [`${k} grader över noll`, `Ingen temperatur`, `${k} grader i genomsnitt`]], debt: [`Vad betyder ${n(-k * 10)} kr på ett konto?`, `Du är skyldig ${k * 10} kr`, [`Du har ${k * 10} kr`, `Kontot är tomt`, `Banken är skyldig dig ${k * 10} kr`]], depth: [`Vad betyder höjden ${n(-k)} m?`, `${k} meter under havsytan`, [`${k} meter över havsytan`, `${k} meter från land`, `Precis vid havsytan`]] } as const; const [q, right, wrong] = cfg[kind]; return mc(`mn-${kind}-${k}`, "w8-l1.meaning", q, right, wrong.map((text) => ({ text })), "Minustecknet betyder ”under noll” eller ”skuld”.", ["Under eller över noll?"], rng); } },
    { id: "stepsToZero", skill: "w8-l1.steps", gen: (rng) => { const k = rng.int(2, 12); return numeric(`sz-${k}`, "w8-l1.steps", `Hur många steg är det från ${n(-k)} till 0?`, k, `${k} steg åt höger.`, ["Räkna steg på tallinjen."]); } },
  ],
  method: [
    { id: "walkLeft", skill: "w8-l1.walk", gen: (rng) => { const k = rng.int(4, 9); return multifield(`wl-${k}`, "w8-l1.walk", `Starta vid 0 och gå ${k} steg åt vänster. Fyll i.`, [{ label: "Var hamnar du?", accept: [-k] }, { label: "Ett steg till åt vänster", accept: [-k - 1] }, { label: "Tre steg tillbaka åt höger (från första platsen)", accept: [-k + 3] }], `0 → ${n(-k)} → ${n(-k - 1)}; tillbaka: ${n(-k + 3)}.`, ["Vänster = mindre."]); } },
    { id: "countDown", skill: "w8-l1.sequence", gen: (rng) => { const s = rng.int(2, 5); return multifield(`cd-${s}`, "w8-l1.sequence", `Fortsätt talföljden: ${[s, s - 1, s - 2].map(n).join(", ")}, …`, [{ label: "Nästa tal", accept: [s - 3] }, { label: "Därefter", accept: [s - 4] }, { label: "Därefter", accept: [s - 5] }], `Varje tal är 1 mindre: ${n(s - 3)}, ${n(s - 4)}, ${n(s - 5)}.`, ["Minska med 1 varje gång."]); } },
  ],
  representation: [
    { id: "markNeg", skill: "w8-l1.numberline", gen: (rng) => { const v = nz(rng, -9, 9); return numberlineEx(`mk-${v}`, "w8-l1.numberline", `Markera ${n(v)} på tallinjen.`, v, { min: -10, max: 10, step: 1, labelEvery: 5 }, `${n(v)} ligger ${Math.abs(v)} steg ${v < 0 ? "till vänster" : "till höger"} om noll.`, ["Räkna steg från 0."]); } },
    { id: "markTemp", skill: "w8-l1.numberline", gen: (rng) => { const v = rng.int(-9, -1); return numberlineEx(`mt-${v}`, "w8-l1.numberline", `Det är ${n(v)} °C ute. Markera temperaturen på tallinjen.`, v, { min: -10, max: 10, step: 1, labelEvery: 5, unit: "°" }, `${n(v)} °C är ${Math.abs(v)} grader under noll.`, ["Under noll = vänster."]); } },
  ],
  teacher: {
    title: "Finns det tal under noll?",
    scenarios: ["Hugo (åk 4) säger: \"Noll är minst. Man kan inte ha mindre än ingenting.\" Samtidigt har hans app visat −3 °C utomhus."],
    prompt: "Förklara för Hugo vad negativa tal är och varför de behövs. Använd minst två vardagsexempel och beskriv hur tallinjen fortsätter åt vänster om noll.",
    minChars: 160,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "temp", label: "temperatur under noll", any: ["temperatur", "grader", "kallt", "termometer", "−3", "-3"] },
        { id: "skuld", label: "ett andra exempel (skuld, pengar, hiss, djup)", any: ["skuld", "skyldig", "konto", "hiss", "våning", "havsyta", "djup", "under havet"] },
        { id: "tallinje", label: "att tallinjen fortsätter åt vänster om noll", any: ["åt vänster", "vänster om noll", "fortsätter", "tallinje"] },
        { id: "mindre", label: "att talen blir mindre åt vänster / inget minsta tal", any: ["mindre", "kallare", "inget minsta", "fler tal", "under noll"] },
        { id: "noll", label: "att noll inte är minst / noll är utgångspunkten", any: ["noll är inte", "utgångspunkt", "nollpunkt", "noll är mitten", "varken"] },
      ],
    },
    modelAnswer: "Hugo, negativa tal är tal som är mindre än noll, och de används i vardagen. När termometern visar −3 °C är det 3 grader under noll – kallare än noll. Och om du har −50 kr på kontot är du skyldig 50 kr. Tallinjen slutar inte vid noll utan fortsätter åt vänster: 0, −1, −2, −3 … Varje steg åt vänster gör talet mindre, så noll är inte det minsta talet, bara utgångspunkten. Det finns inget minsta tal.",
  },
};

// ───────── Lektion 2: Motsatta tal ─────────
export const lesson2: Lesson = {
  id: "w8-l2", worldId: "w8", title: "Motsatta tal och avstånd från noll", grades: "åk 4–6",
  summary: "−3 och 3 ligger lika långt från noll – på varsin sida.",
  lgr: "Rationella tal, däribland negativa tal, och deras egenskaper",
  objectives: ["Ange motsatta tal.", "Förklara avstånd från noll (absolutbelopp).", "Se symmetrin kring noll på tallinjen."],
  intro: "Tallinjen är **symmetrisk kring noll**: för varje positivt tal finns ett negativt tal lika långt från noll på andra sidan. De kallas **motsatta tal**. Idén förklarar nästan alla regler för negativa tal – och varför en skuld på 5 kr och en tillgång på 5 kr tar ut varandra.",
  theory: [
    { heading: "Motsatta tal", body: "$3$ och $-3$ är motsatta tal: de ligger lika långt från noll, åt varsitt håll. Motsatta talet till $-7$ är $7$, och till $0$ är $0$.", visual: { type: "numberline", min: -6, max: 6, step: 1, marks: [-4, 4], labelEvery: 1 } },
    { heading: "Avstånd från noll", body: "Avståndet från noll kallas **absolutbelopp**. Både $-5$ och $5$ ligger 5 steg från noll, så absolutbeloppet av båda är 5. Avstånd är aldrig negativt." },
    { heading: "Motsatta tal tar ut varandra", body: "$5 + (-5) = 0$: ett steg 5 åt höger och sedan 5 åt vänster tar oss tillbaka. Skulden $-5$ kr och tillgången $5$ kr tar ut varandra." },
    { heading: "Se upp: samma siffra är inte samma tal", body: "$-4$ och $4$ har samma siffra men är **olika tal** med olika plats på tallinjen. Det är bara avståndet från noll som är lika." },
  ],
  worked: [
    { title: "Motsatt tal", problem: "Vilket tal är motsatt till −7? Hur långt från noll ligger det?", steps: [{ text: "Byt sida om noll.", math: "-(-7) = 7" }, { text: "Avståndet från noll:", math: "|7| = 7" }], why: "Motsatta tal speglas i noll.", alternative: "Hoppa 7 steg åt vänster från noll, och sedan 7 åt andra hållet." },
    { title: "Summan blir noll", problem: "Beräkna −9 + 9.", steps: [{ text: "9 steg åt vänster från noll, sedan 9 steg åt höger.", math: "0 \\to -9 \\to 0" }, { text: "Vi är tillbaka vid noll.", math: "-9 + 9 = 0" }], why: "Motsatta tal ligger lika långt från noll åt varsitt håll.", alternative: "Skuld 9 kr plus tillgång 9 kr: 0 kr." },
  ],
  drawing: { task: "Rita en tallinje från −8 till 8. Markera −5 och dess motsvarighet 5. Rita en båge mellan dem över noll och skriv avståndet.", tool: "numberline" },
  pupils: [{ pupil: "Elias", said: "−4 och 4 är samma tal – siffran är ju 4.", misconception: "Blandar ihop avstånd från noll med själva talet.", response: "Låt Elias placera båda på tallinjen. De ligger lika långt från noll, men på olika sidor – olika tal. Använd temperatur: −4 °C och 4 °C är mycket olika." }],
  knowledge: [
    { id: "opposite", skill: "w8-l2.opposite", gen: (rng) => { const x = nz(rng, -15, 15); return numeric(`op-${x}`, "w8-l2.opposite", `Vilket är det motsatta talet till ${n(x)}?`, -x, `Motsatta talet ligger lika långt från noll på andra sidan: ${n(-x)}.`, ["Byt sida om noll."]); } },
    { id: "distance", skill: "w8-l2.distance", gen: (rng) => { const x = nz(rng, -20, 20); return numeric(`ds-${x}`, "w8-l2.distance", `Hur många steg från noll ligger ${n(x)}?`, Math.abs(x), `Avståndet från noll är ${Math.abs(x)}.`, ["Avstånd är aldrig negativt."]); } },
    { id: "symmetry", skill: "w8-l2.symmetry", gen: (rng) => { const k = rng.int(2, 12); return mc(`sy-${k}`, "w8-l2.symmetry", `Vilket tal ligger lika långt från noll som ${n(-k)}, men åt andra hållet?`, String(k), [{ text: n(-k), note: "Det är samma tal." }, { text: "0" }, { text: n(-k - 1) }], `${n(-k)} och ${k} är motsatta tal.`, ["Spegla i noll."], rng); } },
    { id: "sumOpp", skill: "w8-l2.sum-zero", gen: (rng) => { const x = nz(rng, -12, 12); return numeric(`so-${x}`, "w8-l2.sum-zero", `${n(x)} + ${par(-x)} = ?`, 0, "Motsatta tal tar ut varandra.", ["Hur långt från noll är de?"]); } },
    { id: "farthest", skill: "w8-l2.compare-distance", gen: (rng) => { const set = new Set<number>(); while (set.size < 4) set.add(rng.int(-12, 12)); const arr = [...set]; const abs = arr.map(Math.abs); if (new Set(abs).size < 4) return numeric("fz", "w8-l2.compare-distance", "Hur långt från noll ligger −9?", 9, "|−9| = 9.", []); const best = arr[abs.indexOf(Math.max(...abs))]; return mc(`fr-${arr.join("_")}`, "w8-l2.compare-distance", "Vilket av talen ligger längst från noll?", n(best), arr.filter((x) => x !== best).map((x) => ({ text: n(x) })), `Avstånden: ${arr.map((x) => `${n(x)} → ${Math.abs(x)}`).join(", ")}.`, ["Räkna steg till noll."], rng); } },
    { id: "zeroOpp", skill: "w8-l2.opposite", gen: (rng) => mc("zo", "w8-l2.opposite", "Vilket är det motsatta talet till 0?", "0", [{ text: "1" }, { text: n(-1) }, { text: "Det saknas" }], "Noll ligger 0 steg från noll – dess motsats är noll själv.", [], rng) },
  ],
  method: [
    { id: "oppFields", skill: "w8-l2.opposite", gen: (rng) => { const x = nz(rng, -12, 12); return multifield(`of-${x}`, "w8-l2.opposite", `Undersök ${n(x)}. Fyll i.`, [{ label: "Motsatt tal", accept: [-x] }, { label: `Avstånd från noll för ${n(x)}`, accept: [Math.abs(x)] }, { label: "Summan av talet och dess motsats", accept: [0] }], `${n(x)} och ${n(-x)} är motsatta; avstånd ${Math.abs(x)}; summa 0.`, []); } },
    { id: "gap", skill: "w8-l2.gap", gen: (rng) => { const x = rng.int(2, 9); return multifield(`gp-${x}`, "w8-l2.gap", `${n(-x)} och ${x} är motsatta tal. Fyll i.`, [{ label: `Avstånd ${n(-x)} → 0`, accept: [x] }, { label: `Avstånd 0 → ${x}`, accept: [x] }, { label: `Avstånd ${n(-x)} → ${x}`, accept: [2 * x] }], `${x} + ${x} = ${2 * x}.`, []); } },
  ],
  representation: [
    { id: "markOpp", skill: "w8-l2.numberline", gen: (rng) => { const x = nz(rng, -9, 9); return numberlineEx(`mo-${x}`, "w8-l2.numberline", `Markera det motsatta talet till ${n(x)}.`, -x, { min: -10, max: 10, step: 1, labelEvery: 5 }, `${n(x)} och ${n(-x)} är motsatta tal.`, ["Spegla i noll."]); } },
    { id: "bridge", skill: "w8-l2.gap", gen: (rng) => { const x = rng.int(2, 9); return withVisual(numeric(`br-${x}`, "w8-l2.gap", "Markeringarna står för två motsatta tal. Hur många steg är det mellan dem?", 2 * x, `${x} + ${x} = ${2 * x}.`, ["Via noll."]), { type: "numberline", min: -10, max: 10, step: 1, marks: [-x, x], labelEvery: 5 }); } },
  ],
  teacher: {
    title: "−4 och 4 – samma tal?",
    scenarios: ["Elias (åk 5) hävdar att −4 och 4 är samma tal: \"Siffran är ju 4 båda gångerna.\""],
    prompt: "Förklara för Elias vad som är lika och vad som är olika hos −4 och 4. Använd tallinjen, avstånd från noll och gärna en temperaturliknelse.",
    minChars: 160,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "lika", label: "att de ligger lika långt från noll (4 steg)", any: ["lika långt", "4 steg", "samma avstånd", "fyra steg"] },
        { id: "olika", label: "att de ligger åt olika håll / olika tal", any: ["olika håll", "olika sidor", "andra sidan", "olika tal", "vänster", "höger"] },
        { id: "motsatta", label: "att de är motsatta tal", any: ["motsatta", "motsats", "spegel", "spegla"] },
        { id: "temp", label: "en liknelse (temperatur, skuld)", any: ["temperatur", "grader", "kallt", "varmt", "skuld", "konto"] },
        { id: "noll", label: "att noll är mitten/symmetripunkten", any: ["noll", "mitten", "0"] },
      ],
    },
    modelAnswer: "Elias, −4 och 4 är inte samma tal, men de hör ihop. På tallinjen ligger båda 4 steg från noll – lika långt – men på olika sidor: 4 åt höger och −4 åt vänster. De är motsatta tal och speglar varandra i noll. Det är bara avståndet från noll som är lika. Tänk på temperatur: 4 °C är en mild dag och −4 °C är kallt – helt olika. Siffran är lika, men talen är olika.",
  },
};

// ───────── Lektion 3: Jämföra och ordna ─────────
const cmp = (a: number, b: number) => (a < b ? "<" : a > b ? ">" : "=");

export const lesson3: Lesson = {
  id: "w8-l3", worldId: "w8", title: "Jämföra och ordna negativa tal", grades: "åk 4–6",
  summary: "−7 är mindre än −2 – större tal ligger längre åt höger.",
  lgr: "Rationella tal, däribland negativa tal, och deras egenskaper",
  objectives: ["Jämföra två tal med <, > och =, även när de är negativa.", "Ordna tal från minst till störst.", "Använda tallinje och temperatur för att kontrollera."],
  intro: "Vilket är kallast, −2 °C eller −7 °C? Naturligtvis −7 °C – men eftersom 7 är större än 2 tror många att $-7 > -2$. Hela-tals-instinkten ”större siffra, större tal” gäller inte för negativa tal. **Tallinjen avgör**: ju längre åt vänster, desto mindre.",
  theory: [
    { heading: "Åt höger = större", body: "På tallinjen är ett tal större än alla tal som ligger till vänster om det. $-2$ ligger till höger om $-7$, alltså $-2 > -7$.", visual: { type: "numberline", min: -8, max: 2, step: 1, marks: [-7, -2], labelEvery: 1 } },
    { heading: "Tre regler", body: "- Alla negativa tal är **mindre än noll** och mindre än alla positiva tal.\n\n- Av två positiva tal är det med störst siffra störst.\n\n- Av två *negativa* tal är det med **minst** siffra störst: $-2 > -7$." },
    { heading: "Temperaturtanken", body: "Kallare = mindre. $-7\\,^\\circ\\text{C}$ är kallare än $-2\\,^\\circ\\text{C}$, så $-7 < -2$. Tänk alltid på termometern om du är osäker." },
    { heading: "Ordna tal", body: "Ordna $-3$, $5$, $-8$, $0$ från minst till störst: $-8 < -3 < 0 < 5$. Börja med de negativa (störst avstånd från noll minst)." },
  ],
  worked: [
    { title: "Två negativa tal", problem: "Vilket är störst: −7 eller −2?", steps: [{ text: "Placera på tallinjen: −7 är 7 steg, −2 är 2 steg till vänster om noll.", math: "-7\\ \\ \\ -2\\ \\ \\ 0" }, { text: "Det som ligger längst åt höger är störst.", math: "-2 > -7" }], why: "−2 ligger närmare noll och därmed till höger om −7.", alternative: "−2 °C är varmare än −7 °C." },
    { title: "Ordna", problem: "Ordna −3, 5, −8 och 0 från minst till störst.", steps: [{ text: "Negativa först: störst avstånd från noll är minst.", math: "-8 < -3" }, { text: "Sedan 0 och positiva.", math: "-8 < -3 < 0 < 5" }], why: "Ordningen följer tallinjen från vänster till höger.", alternative: "Skriv talen som temperaturer." },
  ],
  drawing: { task: "Rita en tallinje och markera −9, −4, 0 och 3. Skriv < eller > mellan −9 och −4 och förklara med en temperatur.", tool: "numberline" },
  pupils: [{ pupil: "Sam", said: "−7 är större än −2, för 7 är större än 2.", misconception: "Jämför siffrorna (avstånd från noll) i stället för talens plats på tallinjen.", response: "Fråga om temperatur: ”Vilket är kallast, −7 °C eller −2 °C?” Rita tallinjen: −7 ligger längre åt vänster." }],
  knowledge: [
    { id: "compareSign", skill: "w8-l3.compare", gen: (rng) => { let a = rng.int(-12, 12), b = rng.int(-12, 12); if (a === b) b += 1; const c = cmp(a, b); return mc(`cp-${a}-${b}`, "w8-l3.compare", `Vilket tecken ska stå i rutan? ${n(a)} □ ${n(b)}`, c, ["<", ">", "="].filter((x) => x !== c).map((text) => ({ text })), `${n(a)} ${c} ${n(b)} – kolla på tallinjen.`, ["Vilket ligger längst åt höger?"], rng); } },
    { id: "largest", skill: "w8-l3.order", gen: (rng) => { const set = new Set<number>(); while (set.size < 4) set.add(rng.int(-12, 12)); const arr = [...set]; const big = rng.chance(0.5); const ans = big ? Math.max(...arr) : Math.min(...arr); return mc(`lg-${arr.join("_")}-${big}`, "w8-l3.order", `Vilket av talen är ${big ? "störst" : "minst"}?`, n(ans), arr.filter((x) => x !== ans).map((x) => ({ text: n(x) })), `${big ? "Störst" : "Minst"} är ${n(ans)} (ordna: ${[...arr].sort((x, y) => x - y).map(n).join(" < ")}).`, ["Tallinjen från vänster till höger."], rng); } },
    { id: "between", skill: "w8-l3.between", gen: (rng) => { const a = rng.int(-9, -3); return numeric(`bt-${a}`, "w8-l3.between", `Vilket heltal ligger mellan ${n(a - 1)} och ${n(a + 1)}?`, a, `${n(a - 1)} < ${n(a)} < ${n(a + 1)}.`, ["Ett steg åt höger från det mindre."]); } },
    { id: "midpoint", skill: "w8-l3.midpoint", gen: (rng) => { const a = rng.int(-12, -2), d = rng.int(1, 6); const b = a + 2 * d; return numeric(`mp-${a}-${b}`, "w8-l3.midpoint", `Vilket tal ligger mitt emellan ${n(a)} och ${n(b)}?`, a + d, `Avståndet är ${2 * d}, hälften är ${d}: ${n(a)} + ${d} = ${n(a + d)}.`, ["Hälften av avståndet."]); } },
    { id: "coldest", skill: "w8-l3.context", gen: (rng) => { const temps = rng.shuffle([-9, -6, -3, -1, 0, 2, 4, 7]).slice(0, 4); const days = DAYS.slice(0, 4); const min = Math.min(...temps); return mc(`cd-${temps.join("_")}`, "w8-l3.context", `Temperaturen kl. 06 var: ${days.map((d, i) => `${d} ${n(temps[i])} °C`).join(", ")}. Vilken dag var kallast?`, days[temps.indexOf(min)], days.filter((_, i) => temps[i] !== min).map((text) => ({ text })), `Lägst är ${n(min)} °C.`, ["Kallast = minst tal."], rng); } },
    { id: "smallestGreater", skill: "w8-l3.neighbours", gen: (rng) => { const k = rng.int(-9, -2); return numeric(`sg-${k}`, "w8-l3.neighbours", `Vilket är det minsta heltalet som är större än ${n(k)}?`, k + 1, `Ett steg åt höger: ${n(k + 1)}.`, ["Åt höger = större."]); } },
  ],
  method: [
    { id: "orderThree", skill: "w8-l3.order", gen: (rng) => { const set = new Set<number>(); while (set.size < 3) set.add(rng.int(-10, 10)); const arr = [...set]; const s = [...arr].sort((x, y) => x - y); return multifield(`o3-${arr.join("_")}`, "w8-l3.order", `Ordna ${arr.map(n).join(", ")} från minst till störst.`, [{ label: "Minst", accept: [s[0]] }, { label: "Mitten", accept: [s[1]] }, { label: "Störst", accept: [s[2]] }], `${s.map(n).join(" < ")}.`, ["Minst längst åt vänster."]); } },
    { id: "twoNeg", skill: "w8-l3.compare", gen: (rng) => { const a = rng.int(2, 12); let b = rng.int(2, 12); if (a === b) b += 1; return multifield(`tn-${a}-${b}`, "w8-l3.compare", `Jämför ${n(-a)} och ${n(-b)}. Fyll i.`, [{ label: `Avstånd från noll för ${n(-a)}`, accept: [a] }, { label: `Avstånd från noll för ${n(-b)}`, accept: [b] }, { label: "Det mindre talet", accept: [-Math.max(a, b)] }], `${n(-a)} och ${n(-b)}: det med störst avstånd från noll är minst.`, ["Längst åt vänster = minst."]); } },
  ],
  representation: [
    { id: "markLarger", skill: "w8-l3.numberline", gen: (rng) => { const a = rng.int(-9, 3); let b = rng.int(-9, 3); if (a === b) b += 1; return numberlineEx(`ml-${a}-${b}`, "w8-l3.numberline", `Markera det större av ${n(a)} och ${n(b)}.`, Math.max(a, b), { min: -10, max: 10, step: 1, labelEvery: 5 }, `${n(Math.max(a, b))} ligger längst åt höger.`, ["Det som ligger längst åt höger."]); } },
    { id: "whichBigger", skill: "w8-l3.compare", gen: (rng) => { const a = rng.int(-9, -1); let b = rng.int(-9, -1); if (a === b) b -= 1; return withVisual(mc(`wb-${a}-${b}`, "w8-l3.compare", "Markeringarna på tallinjen visar två tal. Vilket av dem är störst?", n(Math.max(a, b)), [{ text: n(Math.min(a, b)), note: "Det talet ligger längre åt vänster." }], `${n(Math.max(a, b))} ligger längre åt höger.`, ["Åt höger är större."], rng), { type: "numberline", min: -10, max: 0, step: 1, marks: [a, b], labelEvery: 5 }); } },
  ],
  teacher: {
    title: "Är −7 större än −2?",
    scenarios: ["Sam (åk 5) hävdar att −7 är större än −2 \"för 7 är större än 2\". Han ser att läraren skrivit −7 < −2 och tycker att det är fel."],
    prompt: "Förklara för Sam varför −7 < −2, med hjälp av tallinjen och temperatur. Förklara också hur man jämför två negativa tal.",
    minChars: 160,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "linje", label: "tallinjen: längre åt vänster = mindre", any: ["tallinje", "åt vänster", "längre åt vänster", "åt höger"] },
        { id: "temp", label: "temperatur: −7 °C är kallare än −2 °C", any: ["kallare", "kallast", "temperatur", "grader"] },
        { id: "svar", label: "slutsatsen −7 < −2 / −2 är större", any: ["−7 < −2", "-7 < -2", "−2 är större", "-2 är större", "−7 är mindre", "-7 är mindre", "−2 > −7", "-2 > -7"] },
        { id: "avstand", label: "att större siffra betyder större avstånd från noll (inte större tal)", any: ["avstånd från noll", "längre från noll", "närmare noll", "siffran"] },
        { id: "regel", label: "hur man jämför två negativa tal", any: ["två negativa", "närmast noll", "minst siffra", "störst avstånd"] },
      ],
    },
    modelAnswer: "Sam, tänk på temperatur: −7 °C är kallare än −2 °C, och kallare betyder mindre. På tallinjen ligger −7 längre åt vänster än −2, och ju längre åt vänster, desto mindre är talet. Alltså −7 < −2, eller −2 > −7. Siffran 7 är större än 2, men siffran visar bara avståndet från noll, inte talets storlek. När två tal är negativa är det som ligger närmast noll störst, eftersom det ligger längst åt höger.",
  },
};
