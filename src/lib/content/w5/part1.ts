import type { Lesson } from "../types";
import { mc, numeric, multifield, withVisual, numberlineEx, fractionbarEx, tf, gcd, lcm, fracAcc } from "@/lib/engine/gen-helpers";

/** Inline KaTeX fraction for prompts and options. */
const m = (n: number, d: number) => `$${tf(n, d)}$`;
const NAMES: Record<number, string> = { 2: "halva", 3: "tredjedel", 4: "fjärdedel", 5: "femtedel", 6: "sjättedel", 8: "åttondel", 10: "tiondel", 12: "tolftedel" };

// ───────── Lektion 1: Vad är ett bråk? ─────────
export const lesson1: Lesson = {
  id: "w5-l1", worldId: "w5", title: "Vad är ett bråk?", grades: "åk 4–6",
  summary: "En del av en helhet: täljare, nämnare och varför delarna måste vara lika stora.",
  lgr: "Tal i bråkform och deras användning i vardagliga och matematiska situationer",
  objectives: ["Förklara bråk som del av en helhet delad i lika stora delar.", "Förklara täljare och nämnare.", "Avläsa och rita bråk i bilder."],
  intro: "Ett bråk är ett tal – men det är också en *berättelse om en helhet*. Frågar du en elev vad $\\frac{3}{8}$ betyder får du ofta ”tre och åtta”. Din uppgift är att få eleven att se: **åtta lika stora delar, och jag har tre av dem.**",
  theory: [
    { heading: "Helhet och delar", body: "Delas en helhet i **lika stora** delar kan vi namnge delarna. Delas den i 4 lika delar heter varje del en *fjärdedel* och skrivs $\\frac{1}{4}$. Tre sådana delar är $\\frac{3}{4}$.", visual: { type: "fractionbar", parts: 4, shaded: 3 } },
    { heading: "Täljare och nämnare", body: "I $\\frac{3}{8}$ är **nämnaren** 8 – den *nämner* hur många lika stora delar helheten är delad i. **Täljaren** 3 *räknar* hur många av delarna vi har. Bråkstrecket betyder ”delat med”.", visual: { type: "fractioncircle", parts: 8, shaded: 3 } },
    { heading: "Delarna måste vara lika stora", body: "En cirkel som delats i tre delar av olika storlek visar **inte** tredjedelar. ”Lika stora” är själva definitionen." },
    { heading: "En hel och noll", body: "$\\frac{4}{4} = 1$ (alla delarna är med) och $\\frac{0}{4} = 0$ (inga delar). Bråk kan alltså vara hela tal." },
  ],
  worked: [
    { title: "Läsa av en bild", problem: "En pizza är delad i 8 lika stora bitar. Du har ätit 3. Vilket bråk har du ätit, och vilket är kvar?", steps: [{ text: "Nämnare: antalet lika stora delar.", math: "8" }, { text: "Täljare: delarna du ätit.", math: "\\frac{3}{8}" }, { text: "Kvar är resten av bitarna:", math: "8 - 3 = 5 \\Rightarrow \\frac{5}{8}" }], why: "Hela pizzan är $\\frac{8}{8} = 1$. Det du ätit och det som är kvar fyller upp helheten: $\\frac{3}{8} + \\frac{5}{8} = \\frac{8}{8}$.", alternative: "Rita pizzan som en cirkel och färga de tre bitarna." },
    { title: "Ett bråk är en del av helheten", problem: "En stapel är delad i 6 lika delar och 4 är färgade. Skriv bråket.", steps: [{ text: "Hur många delar är helheten delad i?", math: "6" }, { text: "Hur många är färgade?", math: "4" }, { text: "Bråket:", math: "\\frac{4}{6}" }], why: "Täljaren kan aldrig ”läsas ensam”: 4 betyder bara något i förhållande till helheten.", alternative: "Det är lika mycket som $\\frac{2}{3}$ (se lektion 3)." },
  ],
  drawing: { task: "Rita en cirkel och dela den i 8 lika stora delar (som en pizza). Färga 3 delar och skriv bråket.", tool: "fractioncircle" },
  pupils: [{ pupil: "Elias", said: "Jag delar cirkeln i tre delar – en liten, en mitt emellan och en stor. En av dem är en tredjedel.", misconception: "Delarna behöver inte vara lika stora.", response: "Låt Elias klippa ut cirkeln och jämföra bitarna. Fråga: ”Skulle ni få lika mycket om ni delade en pizza så här?”" }],
  knowledge: [
    { id: "readBar", skill: "w5-l1.read", gen: (rng) => { const d = rng.pick([3, 4, 5, 6, 8, 10]), n = rng.int(1, d - 1); return withVisual(multifield(`rb-${n}-${d}`, "w5-l1.read", "Bilden visar en stapel. Hur många lika stora delar är det totalt och hur många är färgade?", [{ label: "Delar totalt (nämnare)", accept: [d] }, { label: "Färgade delar (täljare)", accept: [n] }], `${n} av ${d} lika stora delar: ${n}/${d}.`, ["Räkna alla rutor, sedan de färgade."]), { type: "fractionbar", parts: d, shaded: n }); } },
    { id: "pizza", skill: "w5-l1.part", gen: (rng) => { const d = rng.pick([6, 8, 10, 12]), n = rng.int(1, d - 1); return numeric(`pz-${n}-${d}`, "w5-l1.part", `En pizza delas i ${d} lika stora bitar. Du äter ${n} bitar. Vilket bråk har du ätit? (Skriv som t.ex. 3/8.)`, fracAcc(n, d), `${n} av ${d} bitar: ${m(n, d)}.`, ["Täljare = det du har, nämnare = alla delar."]); } },
    { id: "rest", skill: "w5-l1.part", gen: (rng) => { const d = rng.pick([6, 8, 10, 12]), n = rng.int(1, d - 1); return numeric(`rs-${n}-${d}`, "w5-l1.part", `En tårta är delad i ${d} lika stora bitar. ${n} bitar är uppätna. Vilket bråk är kvar? (Skriv t.ex. 3/8.)`, fracAcc(d - n, d), `${d} − ${n} = ${d - n} bitar kvar: ${m(d - n, d)}.`, ["Hela tårtan är " + d + "/" + d + "."]); } },
    { id: "denomMeaning", skill: "w5-l1.terms", gen: (rng) => { const d = rng.pick([5, 6, 8, 9]), n = rng.int(2, d - 2); return mc(`dm-${n}-${d}`, "w5-l1.terms", `I bråket ${m(n, d)}: vad visar nämnaren ${d}?`, "Hur många lika stora delar helheten är delad i", [{ text: "Hur många delar som är färgade", note: "Det är täljaren." }, { text: "Hur stor varje del är i centimeter" }, { text: "Hur många hela helheter det finns" }], `Nämnaren namnger delarna (${NAMES[d] ?? d + "-delar"}). Täljaren ${n} räknar hur många vi har.`, ["Vilken siffra räknar delarna?"], rng); } },
    { id: "equalParts", skill: "w5-l1.equal", gen: (rng) => mc("eq", "w5-l1.equal", "En cirkel delas i tre delar: två små och en stor. Är varje del en tredjedel?", "Nej – delarna måste vara lika stora", [{ text: "Ja – det är tre delar" }, { text: "Ja, om den stora delen är störst" }], "Namnet ”tredjedel” förutsätter tre lika stora delar.", [], rng) },
    { id: "wholeCount", skill: "w5-l1.whole", gen: (rng) => { const d = rng.pick([3, 4, 5, 6, 8, 10]); return numeric(`wc-${d}`, "w5-l1.whole", `Hur många ${NAMES[d]}ar behövs för att fylla en hel? (Skriv ett tal.)`, d, `${d} stycken ${NAMES[d]}ar: ${m(d, d)} = 1.`, ["Nämnaren säger hur många delar som går på en hel."]); } },
  ],
  method: [
    { id: "readFields", skill: "w5-l1.read", gen: (rng) => { const d = rng.pick([4, 5, 6, 8, 10]), n = rng.int(1, d - 1); return withVisual(multifield(`rf-${n}-${d}`, "w5-l1.read", "Bilden visar en helhet delad i lika stora delar. Fyll i för det färgade och för det som inte är färgat.", [{ label: "Färgade delar", accept: [n] }, { label: "Delar totalt", accept: [d] }, { label: "Ofärgade delar", accept: [d - n] }, { label: "Ofärgat bråk (t.ex. 3/8)", accept: fracAcc(d - n, d) }], `${n}/${d} färgat, ${d - n}/${d} ofärgat – tillsammans ${d}/${d} = 1.`, []), { type: "fractionbar", parts: d, shaded: n }); } },
    { id: "writeFraction", skill: "w5-l1.write", gen: (rng) => { const d = rng.pick([3, 4, 5, 6, 8]), n = rng.int(1, d - 1); return multifield(`wf-${n}-${d}`, "w5-l1.write", `Du har ${n} av ${d} lika stora delar. Skriv bråket genom att fylla i täljare och nämnare.`, [{ label: "Täljare", accept: [n] }, { label: "Nämnare", accept: [d] }], `${n} av ${d}: ${m(n, d)}.`, ["Täljare = det du har."]); } },
  ],
  representation: [
    { id: "shadeBar", skill: "w5-l1.bar", gen: (rng) => { const d = rng.pick([3, 4, 5, 6, 8, 10]), n = rng.int(1, d - 1); return fractionbarEx(`sb-${n}-${d}`, "w5-l1.bar", `Stapeln är delad i ${d} lika delar. Färglägg ${m(n, d)} av stapeln.`, d, n, `${n} av ${d} delar färgas.`, ["Tryck på de första " + n + " delarna."]); } },
    { id: "readCircle", skill: "w5-l1.circle", gen: (rng) => { const d = rng.pick([3, 4, 5, 6, 8]), n = rng.int(1, d - 1); return withVisual(multifield(`rc-${n}-${d}`, "w5-l1.circle", "Bilden visar en bråkcirkel. Hur många lika stora delar och hur många färgade?", [{ label: "Delar totalt", accept: [d] }, { label: "Färgade delar", accept: [n] }], `${n}/${d} av cirkeln är färgad.`, []), { type: "fractioncircle", parts: d, shaded: n }); } },
  ],
  teacher: {
    title: "Lika stora delar",
    scenarios: ["Elias (åk 4) delar en cirkel i tre delar – en liten, en medelstor och en stor – och säger: \"Här är en tredjedel, och här är en tredjedel till.\" Han pekar på två olika stora bitar."],
    prompt: "Förklara för Elias vad som krävs för att en del ska kallas en tredjedel och hur du kan få honom att upptäcka problemet själv. Beskriv också vad nämnaren och täljaren säger.",
    minChars: 160,
    rubric: {
      minConcepts: 3,
      concepts: [
        { id: "lika", label: "att delarna måste vara lika stora", any: ["lika stora", "lika stor", "samma storlek", "lika mycket"] },
        { id: "upptack", label: "ett sätt att upptäcka det (klippa, jämföra, rättvis delning)", any: ["klipp", "jämför", "lägg", "rättvis", "dela pizza", "pizza", "fråga"] },
        { id: "namn", label: "att nämnaren säger hur många delar helheten delas i", any: ["nämnare", "hur många delar", "delad i"] },
        { id: "tal", label: "att täljaren räknar delarna man har", any: ["täljare", "hur många delar vi har", "delar man har", "räknar"] },
      ],
    },
    modelAnswer: "Elias, för att något ska kallas en tredjedel måste helheten vara delad i tre lika stora delar. Dina bitar är inte lika stora. Du kan klippa ut dem och lägga dem ovanpå varandra, eller fråga om tre kompisar skulle få lika mycket pizza om de fick en bit var. Nämnaren, 3, säger hur många lika stora delar helheten är delad i. Täljaren räknar hur många av de delarna man har, så 2/3 är två av tre lika stora delar.",
  },
};

// ───────── Lektion 2: Bråk på tallinjen ─────────
export const lesson2: Lesson = {
  id: "w5-l2", worldId: "w5", title: "Bråk på tallinjen", grades: "åk 4–6",
  summary: "Bråk som tal med en plats på tallinjen – också bråk större än 1.",
  lgr: "Tal i bråkform och deras användning; rationella tal och deras egenskaper",
  objectives: ["Placera bråk på en tallinje.", "Förstå att nämnaren bestämmer hur enhetsintervallet är delat.", "Se att bråk kan vara större än 1."],
  intro: "Elever ser ofta bråk som ”en pizza i bitar” men inte som **tal på tallinjen**. Det är en av de viktigaste förflyttningarna: $\\frac{3}{4}$ är ett tal, precis som 3, med en bestämd plats mellan 0 och 1.",
  theory: [
    { heading: "Dela enhetsintervallet", body: "Tallinjens sträcka mellan 0 och 1 delas i **nämnaren** lika stora steg. För fjärdedelar delas den i 4 steg, och $\\frac{3}{4}$ finns vid det tredje strecket.", visual: { type: "numberline", min: 0, max: 4, step: 1, marks: [3], labelEvery: 1, den: 4 } },
    { heading: "Hoppa med enhetsbråk", body: "Hoppar du med steg om $\\frac{1}{5}$ från 0 är du efter 3 hopp vid $\\frac{3}{5}$, och efter 5 hopp vid $\\frac{5}{5} = 1$. Täljaren räknar hoppen." },
    { heading: "Större än 1", body: "Fortsätter vi förbi 1 når vi $\\frac{5}{4}$, $\\frac{6}{4}$ ... Ett bråk där täljaren är större än nämnaren är större än 1 och kallas **oäkta bråk**. $\\frac{7}{4}$ ligger mellan 1 och 2.", visual: { type: "numberline", min: 0, max: 8, step: 1, marks: [7], labelEvery: 4, den: 4 } },
    { heading: "Hälften", body: "$\\frac{1}{2}$ ligger mitt emellan 0 och 1. Det är en viktig hållpunkt när vi bedömer bråk." },
  ],
  worked: [
    { title: "Placera ett bråk", problem: "Var ligger 3/5 på tallinjen mellan 0 och 1?", steps: [{ text: "Dela sträckan 0–1 i 5 lika steg (nämnaren).", math: "0, \\frac{1}{5}, \\frac{2}{5}, \\frac{3}{5}, \\frac{4}{5}, 1" }, { text: "Räkna 3 steg från 0.", math: "\\frac{3}{5}" }], why: "Nämnaren bestämmer *hur stora* stegen är, täljaren *hur många* vi tar.", alternative: "Hoppa med $\\frac{1}{5}$ tre gånger." },
    { title: "Mellan vilka heltal?", problem: "Mellan vilka hela tal ligger 7/4?", steps: [{ text: "Fyra fjärdedelar är en hel.", math: "\\frac{4}{4} = 1" }, { text: "7 fjärdedelar är mer än 4 och mindre än 8.", math: "\\frac{4}{4} < \\frac{7}{4} < \\frac{8}{4}" }, { text: "Alltså mellan:", math: "1\\ \\text{och}\\ 2" }], why: "Varje gång vi samlat nämnaren fjärdedelar har vi en hel till.", alternative: "$7 \\div 4 = 1$ rest $3$: en hel och tre fjärdedelar." },
  ],
  drawing: { task: "Rita en tallinje från 0 till 2. Dela varje helt steg i 4 delar och markera 3/4, 1 och 5/4.", tool: "numberline" },
  pupils: [{ pupil: "Hanna", said: "3/4 ligger vid det tredje strecket – men på min linje är det åtta streck mellan 0 och 1.", misconception: "Tar täljaren som strecknummer utan att se hur linjen är delad.", response: "Låt Hanna räkna hur många steg det är mellan 0 och 1: åtta. Då är varje steg 1/8 och 3/4 = 6/8 ligger vid sjätte strecket." }],
  knowledge: [
    { id: "hops", skill: "w5-l2.hops", gen: (rng) => { const d = rng.int(3, 8), k = rng.int(2, d); return numeric(`hp-${d}-${k}`, "w5-l2.hops", `Du hoppar med steg om ${m(1, d)} från 0. Vilket bråk har du nått efter ${k} hopp? (Skriv t.ex. 3/5.)`, fracAcc(k, d), `${k} hopp om ${m(1, d)} = ${m(k, d)}.`, ["Täljaren räknar hoppen."]); } },
    { id: "between", skill: "w5-l2.between", gen: (rng) => { const d = rng.int(3, 6), w = rng.int(1, 3), r = rng.int(1, d - 1), n = w * d + r; return numeric(`bw-${n}-${d}`, "w5-l2.between", `Bråket ${n}/${d} ligger mellan två hela tal. Vilket är det mindre?`, w, `${d}/${d} = 1, ${2 * d}/${d} = 2 ...: ${n}/${d} ligger mellan ${w} och ${w + 1}.`, ["Hur många hela får du ihop av " + n + " " + NAMES[d] + "ar?"]); } },
    { id: "bigger1", skill: "w5-l2.compare-one", gen: (rng) => { const d = rng.int(3, 9), big = d + rng.int(1, 4), s1 = rng.int(1, d - 1), s2 = rng.int(1, d - 1); return mc(`b1-${big}-${d}`, "w5-l2.compare-one", "Vilket av bråken är större än 1?", m(big, d), [{ text: m(s1, d) }, { text: m(s2 === s1 ? Math.max(1, s1 - 1) : s2, d + 1) }, { text: m(d - 1, d) }], `${big} > ${d}, så ${m(big, d)} är mer än en hel.`, ["Är täljaren större än nämnaren?"], rng); } },
    { id: "half", skill: "w5-l2.half", gen: (rng) => { const d = rng.pick([4, 6, 8, 10]); return numeric(`hf-${d}`, "w5-l2.half", `Vilken täljare ska stå i ?/${d} för att bråket ska ligga mitt emellan 0 och 1?`, d / 2, `Hälften av ${d} är ${d / 2}: ${m(d / 2, d)} = ${m(1, 2)}.`, ["Hälften av nämnaren."]); } },
    { id: "unitDefine", skill: "w5-l2.unit", gen: (rng) => { const d = rng.int(4, 8); return mc(`ud-${d}`, "w5-l2.unit", `Mellan 0 och 1 på en tallinje finns ${d} lika långa steg. Hur lång är varje steg?`, m(1, d), [{ text: String(d) }, { text: m(d, 1) }, { text: m(1, d + 1) }], `Sträckan 1 delas i ${d} lika delar, så varje del är ${m(1, d)}.`, ["Nämnaren är antalet steg."], rng); } },
  ],
  method: [
    { id: "hopSteps", skill: "w5-l2.hops", gen: (rng) => { const d = rng.int(3, 8), k = rng.int(2, d + 3); return multifield(`hs-${d}-${k}`, "w5-l2.hops", `Hoppa ${k} steg om 1/${d} från 0. Fyll i.`, [{ label: "Steglängd (nämnare)", accept: [d] }, { label: "Antal hopp (täljare)", accept: [k] }, { label: "Är du förbi 1? (1 = ja, 0 = nej)", accept: [k > d ? 1 : 0] }], `${k}/${d}${k > d ? " är större än 1" : k === d ? " är exakt 1" : " ligger mellan 0 och 1"}.`, ["Ligger " + k + " över " + d + "?"]); } },
    { id: "lineParts", skill: "w5-l2.unit", gen: (rng) => { const d = rng.int(3, 8), k = rng.int(1, d - 1); return multifield(`lp-${d}-${k}`, "w5-l2.unit", `Mellan 0 och 1 är tallinjen delad i ${d} lika steg. Vilket streck ligger ${k}/${d} vid, och hur många steg är det kvar till 1?`, [{ label: "Streck nummer", accept: [k] }, { label: "Steg kvar till 1", accept: [d - k] }], `${k} steg från 0, ${d - k} kvar till 1.`, []); } },
  ],
  representation: [
    { id: "markProper", skill: "w5-l2.numberline", gen: (rng) => { const d = rng.int(3, 8), k = rng.int(1, d - 1); return numberlineEx(`mp-${k}-${d}`, "w5-l2.numberline", `Tallinjen mellan 0 och 1 är delad i ${d} lika steg. Markera ${m(k, d)}.`, k, { min: 0, max: d, step: 1, labelEvery: 1, den: d }, `${m(k, d)} finns vid streck ${k}.`, ["Räkna steg från 0."]); } },
    { id: "markImproper", skill: "w5-l2.numberline", gen: (rng) => { const d = rng.int(3, 6), k = rng.int(d + 1, 2 * d - 1); return numberlineEx(`mi-${k}-${d}`, "w5-l2.numberline", `Tallinjen går från 0 till 2 och varje helt steg är delat i ${d} delar. Markera ${m(k, d)}.`, k, { min: 0, max: 2 * d, step: 1, labelEvery: 1, den: d }, `${m(k, d)} ligger efter 1 (${m(d, d)}), vid streck ${k}.`, ["Räkna förbi 1."]); } },
  ],
  teacher: {
    title: "Vilket streck är 3/4?",
    scenarios: ["Hanna (åk 5) ska markera 3/4 på en tallinje som är delad i 8 steg mellan 0 och 1. Hon sätter ett kryss vid det tredje strecket och säger: \"Tre-fjärdedelar, då tar jag tre.\""],
    prompt: "Förklara för Hanna hur hon hittar rätt plats för 3/4 på den här tallinjen. Vad säger nämnaren om tallinjen, och hur kan hon använda likvärdiga bråk?",
    minChars: 160,
    rubric: {
      minConcepts: 3,
      concepts: [
        { id: "namn", label: "att nämnaren säger hur många delar mellan 0 och 1", any: ["nämnare", "delad i", "hur många steg", "hur många delar", "delar mellan"] },
        { id: "ekv", label: "att 3/4 = 6/8 (förlänga)", any: ["6/8", "6 åttondelar", "sex åttondelar", "likvärdig", "förläng"] },
        { id: "svar", label: "rätt streck: det sjätte", any: ["sjätte", "6:e", "streck 6", "vid 6", "sex"] },
        { id: "steg", label: "att varje steg är 1/8 (inte 1/4)", any: ["1/8", "en åttondel", "åttondelar", "åttondel"] },
      ],
    },
    modelAnswer: "Hanna, nämnaren säger hur många lika stora steg sträckan mellan 0 och 1 är delad i. Din tallinje har 8 steg, så varje steg är 1/8, inte 1/4. Därför ligger tre strecken bara vid 3/8. Fjärdedelar och åttondelar hänger ihop: 3/4 är lika mycket som 6/8 (förläng med 2). Alltså ska du sätta krysset vid det sjätte strecket. Man kan också dela tallinjen i hälften och hälften igen.",
  },
};

// ───────── Lektion 3: Likvärdiga bråk ─────────
const coprimePairs: [number, number][] = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 6], [5, 6], [3, 8], [5, 8], [7, 8]];

export const lesson3: Lesson = {
  id: "w5-l3", worldId: "w5", title: "Likvärdiga bråk", grades: "åk 4–6",
  summary: "Olika bråk för samma tal: förlänga, förkorta och varför det fungerar.",
  lgr: "Tal i bråkform; rationella tal och deras egenskaper",
  objectives: ["Förklara att olika bråk kan vara samma tal.", "Förlänga och förkorta bråk.", "Skilja mellan att multiplicera och att addera till täljare och nämnare."],
  intro: "$\\frac{1}{2}$, $\\frac{2}{4}$ och $\\frac{4}{8}$ är **samma tal** med olika namn. Det här är nyckeln till att jämföra och räkna med bråk – och en källa till klassiska fel: ”jag la till 2 både upptill och nedtill”.",
  theory: [
    { heading: "Samma del, andra delar", body: "Delar vi varje fjärdedel i två lika delar får vi åttondelar. $\\frac{3}{4}$ blir då $\\frac{6}{8}$ – lika mycket färgat, men fler och mindre delar.", visual: { type: "fractionbars", bars: [{ parts: 4, shaded: 3 }, { parts: 8, shaded: 6 }, { parts: 12, shaded: 9 }] } },
    { heading: "Förlänga", body: "Att **förlänga** är att multiplicera täljare *och* nämnare med samma tal: $\\frac{3}{4} = \\frac{3 \\cdot 2}{4 \\cdot 2} = \\frac{6}{8}$. Vi delar varje del i lika många mindre delar, så antalet delar (täljare och nämnare) växer lika mycket." },
    { heading: "Förkorta", body: "Att **förkorta** är motsatsen: dela täljare och nämnare med samma tal. $\\frac{12}{18} = \\frac{12 \\div 6}{18 \\div 6} = \\frac{2}{3}$. Ett bråk är i **enklaste form** när täljare och nämnare inte har någon gemensam faktor utom 1." },
    { heading: "Inte plus!", body: "$\\frac{1}{2}$ är *inte* lika med $\\frac{3}{4}$ fast vi lagt till 2 både upp och ner. Att addera ändrar storleken. Bara **multiplikation och division** med samma tal bevarar värdet (vi multiplicerar med 1 i förklädnad: $\\frac{2}{2}$)." },
  ],
  worked: [
    { title: "Förlänga", problem: "Fyll i: 3/5 = □/20.", steps: [{ text: "Hur har nämnaren förändrats?", math: "5 \\cdot 4 = 20" }, { text: "Gör samma sak med täljaren.", math: "3 \\cdot 4 = 12" }, { text: "Resultat:", math: "\\frac{3}{5} = \\frac{12}{20}" }], why: "Vi multiplicerar med $\\frac{4}{4} = 1$, så värdet är oförändrat.", alternative: "Rita en stapel i femtedelar och dela varje femtedel i 4." },
    { title: "Förkorta", problem: "Förkorta 12/18 till enklaste form.", steps: [{ text: "Största gemensamma delaren av 12 och 18 är 6.", math: "\\gcd(12,18) = 6" }, { text: "Dela täljare och nämnare med 6.", math: "\\frac{12 \\div 6}{18 \\div 6}" }, { text: "Enklaste form:", math: "\\frac{2}{3}" }], why: "Vi delar med $\\frac{6}{6} = 1$.", alternative: "Förkorta i omgångar: med 2 (→ 6/9), sedan med 3 (→ 2/3)." },
  ],
  drawing: { task: "Rita två lika långa staplar: den ena delad i 3 delar, den andra i 6. Färga så att samma del är färgad. Skriv de två bråken.", tool: "fraction" },
  pupils: [{ pupil: "Moa", said: "1/2 = 3/4, för jag la till 2 på båda ställena.", misconception: "Adderar samma tal till täljare och nämnare.", response: "Låt Moa rita 1/2 och 3/4 som staplar och jämföra. Visa att 1/2 = 2/4 (multiplicera med 2), och att 3/4 är större." }],
  knowledge: [
    { id: "expandNum", skill: "w5-l3.expand", gen: (rng) => { const [a, b] = rng.pick(coprimePairs), f = rng.int(2, 6); return numeric(`en-${a}-${b}-${f}`, "w5-l3.expand", `${a}/${b} = □/${b * f}`, a * f, `${b} · ${f} = ${b * f}, så täljaren: ${a} · ${f} = ${a * f}.`, ["Vad har nämnaren multiplicerats med?"]); } },
    { id: "expandDen", skill: "w5-l3.expand", gen: (rng) => { const [a, b] = rng.pick(coprimePairs), f = rng.int(2, 6); return numeric(`ed-${a}-${b}-${f}`, "w5-l3.expand", `${a}/${b} = ${a * f}/□`, b * f, `${a} · ${f} = ${a * f}, så nämnaren: ${b} · ${f} = ${b * f}.`, ["Vad har täljaren multiplicerats med?"]); } },
    { id: "reduce", skill: "w5-l3.reduce", gen: (rng) => { const [a, b] = rng.pick(coprimePairs), f = rng.int(2, 6); return numeric(`rd-${a}-${b}-${f}`, "w5-l3.reduce", `Förkorta ${a * f}/${b * f} till enklaste form. (Skriv t.ex. 2/3.)`, `${a}/${b}`, `Dela täljare och nämnare med ${f}: ${a * f} ÷ ${f} = ${a}, ${b * f} ÷ ${f} = ${b}.`, ["Vilket tal går i båda?"]); } },
    { id: "equivMc", skill: "w5-l3.concept", gen: (rng) => { const [a, b] = rng.pick(coprimePairs.filter(([x, y]) => y >= 3)), f = rng.int(2, 4); return mc(`eq-${a}-${b}-${f}`, "w5-l3.concept", `Vilket bråk är lika med ${m(a, b)}?`, m(a * f, b * f), [{ text: m(a + f, b + f), note: "Du har adderat " + f + " – bara multiplikation bevarar värdet." }, { text: m(a * f, b) }, { text: m(a, b * f) }], `Multiplicera täljare och nämnare med ${f}: ${m(a * f, b * f)}.`, ["Samma operation på båda."], rng); } },
    { id: "isSimplest", skill: "w5-l3.simplest", gen: (rng) => { const [a, b] = rng.pick(coprimePairs), f = rng.int(2, 5); const bad = rng.chance(0.5); const n = bad ? a * f : a, d = bad ? b * f : b; return mc(`sm-${n}-${d}`, "w5-l3.simplest", `Är ${m(n, d)} i enklaste form?`, bad ? "Nej – täljare och nämnare kan båda delas med " + f : "Ja – inga gemensamma faktorer utom 1", [{ text: bad ? "Ja – inga gemensamma faktorer utom 1" : "Nej – det går att förkorta" }], bad ? `${n} och ${d} är båda delbara med ${f}.` : `Största gemensamma delaren av ${n} och ${d} är 1.`, ["Finns det något tal (utom 1) som går i båda?"], rng); } },
  ],
  method: [
    { id: "expandSteps", skill: "w5-l3.expand", gen: (rng) => { const [a, b] = rng.pick(coprimePairs), f = rng.int(2, 5); return multifield(`es-${a}-${b}-${f}`, "w5-l3.expand", `Förläng ${a}/${b} med ${f}. Fyll i.`, [{ label: `Täljare: ${a} · ${f} =`, accept: [a * f] }, { label: `Nämnare: ${b} · ${f} =`, accept: [b * f] }, { label: "Är värdet ändrat? (1 = ja, 0 = nej)", accept: [0] }], `${a}/${b} = ${a * f}/${b * f}. Vi multiplicerade med ${f}/${f} = 1.`, []); } },
    { id: "reduceSteps", skill: "w5-l3.reduce", gen: (rng) => { const [a, b] = rng.pick(coprimePairs), f = rng.int(2, 6); const n = a * f, d = b * f; return multifield(`rs-${n}-${d}`, "w5-l3.reduce", `Förkorta ${n}/${d}. Fyll i.`, [{ label: "Största gemensamma delare", accept: [gcd(n, d)] }, { label: "Ny täljare", accept: [a] }, { label: "Ny nämnare", accept: [b] }], `Delar med ${gcd(n, d)}: ${a}/${b}.`, ["Vilket är det största tal som går i båda?"]); } },
  ],
  representation: [
    { id: "twoBars", skill: "w5-l3.bars", gen: (rng) => { const [a, b] = rng.pick(coprimePairs.filter(([x, y]) => y <= 5)), f = rng.int(2, 3); return withVisual(multifield(`tb-${a}-${b}-${f}`, "w5-l3.bars", `Staplarna är lika långa och samma del är färgad. Hur många delar är färgade i den nedre stapeln, och hur många delar har den?`, [{ label: "Färgade (nedre)", accept: [a * f] }, { label: "Delar totalt (nedre)", accept: [b * f] }], `${a}/${b} = ${a * f}/${b * f}.`, []), { type: "fractionbars", bars: [{ parts: b, shaded: a }, { parts: b * f, shaded: a * f }] }); } },
    { id: "shadeEquiv", skill: "w5-l3.bar", gen: (rng) => { const [a, b] = rng.pick(coprimePairs.filter(([x, y]) => y <= 4)), f = rng.int(2, 3); return fractionbarEx(`se-${a}-${b}-${f}`, "w5-l3.bar", `${m(a, b)} = ${m(a * f, b * f)}. Stapeln är delad i ${b * f} delar. Färglägg lika mycket som ${m(a, b)}.`, b * f, a * f, `${a * f} av ${b * f} delar.`, ["Hur många mindre delar går det på varje stor del?"]); } },
  ],
  teacher: {
    title: "Multiplicera, inte addera",
    scenarios: ["Moa (åk 5) fyller i 1/2 = □/4 och skriver 3. Hon förklarar: \"Jag la till 2 på nämnaren och då måste jag lägga till 2 på täljaren också.\""],
    prompt: "Förklara för Moa varför hennes svar blir fel och hur man ska göra i stället. Visa med bråkstaplar eller en bild att 1/2 = 2/4. Förklara varför man multiplicerar.",
    minChars: 170,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "mult", label: "att man multiplicerar (förlänger) med samma tal", any: ["multiplicera", "multiplicerar", "gånger", "förläng"] },
        { id: "plus", label: "att addition ändrar bråkets värde", any: ["addition", "lägga till", "lägger till", "adderar", "ändrar värdet", "inte samma"] },
        { id: "svar", label: "rätt svar 2 (1/2 = 2/4)", any: ["2/4", "2 fjärdedelar", "två fjärdedelar", "2"] },
        { id: "bild", label: "en bild/modell (stapel, pizza)", any: ["stapel", "rita", "pizza", "bild", "modell", "cirkel"] },
        { id: "varfor", label: "varför: varje del delas i lika många mindre delar / multiplicerar med 1", any: ["varje del", "mindre delar", "delar varje", "samma sak som 1", "2/2", "1 i förklädnad"] },
      ],
    },
    modelAnswer: "Moa, när vi lägger till 2 på båda ställena ändras bråkets värde: 3/4 är större än 1/2. Man ska multiplicera täljare och nämnare med samma tal. Rita en stapel delad i 2 lika delar och färga 1. Dela sedan varje del i 2 mindre delar. Nu är stapeln delad i 4 delar och 2 är färgade: 1/2 = 2/4. Vi har delat varje del i lika många bitar, så både antalet färgade delar och antalet delar totalt dubblas. Det är samma sak som att multiplicera med 2/2, vilket är 1, och då ändras inte värdet.",
  },
};

// ───────── Lektion 4: Jämföra bråk ─────────
const sign = (c: number) => (c < 0 ? "<" : c > 0 ? ">" : "=");

export const lesson4: Lesson = {
  id: "w5-l4", worldId: "w5", title: "Jämföra bråk", grades: "åk 4–6",
  summary: "Vilket bråk är störst? Gemensam nämnare, hållpunkter och enhetsbråk.",
  lgr: "Tal i bråkform och deras användning; rationella tal och deras egenskaper",
  objectives: ["Jämföra bråk med samma nämnare eller samma täljare.", "Jämföra bråk med olika nämnare via gemensam nämnare.", "Använda hållpunkter (1/2, 1)."],
  intro: "Vilket är störst: $\\frac{1}{3}$ eller $\\frac{1}{2}$? Många elever väljer $\\frac{1}{3}$ ”eftersom 3 är större än 2”. De har då generaliserat sina erfarenheter från hela tal. Din uppgift är att få dem att **se delarnas storlek**.",
  theory: [
    { heading: "Samma nämnare", body: "Är delarna lika stora räcker det att jämföra täljarna: $\\frac{5}{8} > \\frac{3}{8}$, för 5 åttondelar är mer än 3 åttondelar.", visual: { type: "fractionbars", bars: [{ parts: 8, shaded: 5 }, { parts: 8, shaded: 3 }] } },
    { heading: "Samma täljare", body: "Har bråken samma täljare avgör delarnas storlek: ju fler delar helheten delas i, desto mindre blir varje del. $\\frac{1}{3} > \\frac{1}{5}$ (en tredjedel är större än en femtedel).", visual: { type: "fractionbars", bars: [{ parts: 3, shaded: 1 }, { parts: 5, shaded: 1 }] } },
    { heading: "Olika nämnare: gemensam nämnare", body: "Skriv båda med samma nämnare. $\\frac{2}{3}$ och $\\frac{3}{4}$: gemensam nämnare 12. $\\frac{2}{3} = \\frac{8}{12}$ och $\\frac{3}{4} = \\frac{9}{12}$. Alltså $\\frac{2}{3} < \\frac{3}{4}$." },
    { heading: "Hållpunkter", body: "Jämför med $\\frac{1}{2}$ eller 1. $\\frac{3}{7} < \\frac{1}{2}$ eftersom hälften av 7 är 3,5. $\\frac{9}{8} > 1$. Ofta räcker det för att avgöra." },
  ],
  worked: [
    { title: "Gemensam nämnare", problem: "Vilket är störst: 3/4 eller 5/8?", steps: [{ text: "Gemensam nämnare: 8.", math: "\\frac{3}{4} = \\frac{6}{8}" }, { text: "Jämför täljarna.", math: "6 > 5" }, { text: "Slutsats:", math: "\\frac{3}{4} > \\frac{5}{8}" }], why: "När delarna är lika stora avgör antalet.", alternative: "Hållpunkt: $\\frac{5}{8}$ är lite mer än hälften (4/8), $\\frac{3}{4}$ är hälften plus en fjärdedel – större." },
    { title: "Enhetsbråk", problem: "Vilket är störst: 1/3 eller 1/5?", steps: [{ text: "Båda har en del. Hur stora är delarna?" }, { text: "Delas helheten i 3 blir delarna större än om den delas i 5.", math: "\\frac{1}{3} > \\frac{1}{5}" }], why: "Fler delar av samma helhet betyder mindre delar.", alternative: "Pizza: en av 3 bitar mot en av 5 bitar." },
  ],
  drawing: { task: "Rita två lika långa staplar, delade i 3 respektive 4 delar. Färga 2 delar i den första och 3 i den andra. Vilket är störst?", tool: "fraction" },
  pupils: [{ pupil: "Sam", said: "1/3 är större än 1/2, för 3 är större än 2.", misconception: "Tillämpar hela-tal-resonemang på nämnaren.", response: "Dela två lika stora pizzor i 2 respektive 3 bitar och låt Sam välja en bit. Vilken bit är störst?" }],
  knowledge: [
    { id: "sameDen", skill: "w5-l4.same-den", gen: (rng) => { const d = rng.int(4, 12), a = rng.int(1, d - 1); let b = rng.int(1, d - 1); if (b === a) b = a === 1 ? 2 : a - 1; return mc(`sd-${a}-${b}-${d}`, "w5-l4.same-den", `Vilket tecken ska stå i rutan? ${m(a, d)} □ ${m(b, d)}`, sign(a - b), ["<", ">", "="].filter((x) => x !== sign(a - b)).map((text) => ({ text })), `Samma nämnare: jämför täljarna ${a} och ${b}.`, ["Delarna är lika stora."], rng); } },
    { id: "unit", skill: "w5-l4.unit", gen: (rng) => { const p = rng.int(2, 8); let q = rng.int(2, 9); if (q === p) q = p + 1; return mc(`un-${p}-${q}`, "w5-l4.unit", `Vilket är störst: ${m(1, p)} eller ${m(1, q)}?`, m(1, Math.min(p, q)), [{ text: m(1, Math.max(p, q)), note: "Fler delar betyder mindre delar." }], `${m(1, Math.min(p, q))} är störst: helheten delas i färre delar, så varje del är större.`, ["Hur stor är en bit om helheten delas i fler delar?"], rng); } },
    { id: "commonDen", skill: "w5-l4.common", gen: (rng) => { const pairs: [number, number, number, number][] = [[1, 2, 3, 6], [2, 3, 3, 4], [3, 4, 5, 8], [2, 5, 3, 10], [5, 6, 3, 4], [3, 8, 1, 3], [4, 5, 7, 10], [1, 4, 2, 6], [5, 8, 2, 3]]; const [a, b, c, d] = rng.pick(pairs); const cmp = a * d - c * b; return mc(`cd-${a}-${b}-${c}-${d}`, "w5-l4.common", `Vilket tecken ska stå i rutan? ${m(a, b)} □ ${m(c, d)}`, sign(cmp), ["<", ">", "="].filter((x) => x !== sign(cmp)).map((text) => ({ text })), `Gemensam nämnare ${lcm(b, d)}: ${a * (lcm(b, d) / b)}/${lcm(b, d)} och ${c * (lcm(b, d) / d)}/${lcm(b, d)}.`, ["Skriv båda med gemensam nämnare."], rng); } },
    { id: "benchmark", skill: "w5-l4.benchmark", gen: (rng) => { const d = rng.pick([5, 7, 9, 10, 11]), n = rng.int(1, d - 1); const more = 2 * n > d; return mc(`bm-${n}-${d}`, "w5-l4.benchmark", `Är ${m(n, d)} större eller mindre än ${m(1, 2)}?`, more ? "Större" : "Mindre", [{ text: more ? "Mindre" : "Större" }], `Hälften av ${d} är ${String(d / 2).replace(".", ",")}. ${n} är ${more ? "mer" : "mindre"}, så ${m(n, d)} är ${more ? "större" : "mindre"} än hälften.`, ["Jämför täljaren med hälften av nämnaren."], rng); } },
    { id: "whyMc", skill: "w5-l4.concept", gen: (rng) => mc("wm", "w5-l4.concept", "Varför är 1/3 större än 1/5?", "Helheten delas i färre delar, så varje del blir större", [{ text: "För att 3 är mindre än 5, och mindre tal är alltid större", note: "Förklaringen saknar poäng: det handlar om delarnas storlek." }, { text: "För att 5 är större än 3" }, { text: "Det går inte att jämföra" }], "Samma helhet delas i 3 respektive 5 delar.", ["Tänk på en pizza."], rng) },
  ],
  method: [
    { id: "compareSteps", skill: "w5-l4.common", gen: (rng) => { const pairs: [number, number, number, number][] = [[2, 3, 3, 4], [3, 4, 5, 8], [2, 5, 3, 10], [1, 4, 2, 6], [5, 6, 3, 4], [3, 8, 1, 3], [4, 5, 7, 10]]; const [a, b, c, d] = rng.pick(pairs); const l = lcm(b, d), x = a * (l / b), y = c * (l / d); const big = x > y ? [`${a}/${b}`, `${x}/${l}`] : [`${c}/${d}`, `${y}/${l}`]; return multifield(`cs-${a}-${b}-${c}-${d}`, "w5-l4.common", `Jämför ${a}/${b} och ${c}/${d} med gemensam nämnare.`, [{ label: "Gemensam nämnare", accept: [l] }, { label: `${a}/${b} i ${l}-delar (täljare)`, accept: [x] }, { label: `${c}/${d} i ${l}-delar (täljare)`, accept: [y] }, { label: "Det större bråket (t.ex. 3/4)", accept: big }], `${x}/${l} ${x > y ? ">" : "<"} ${y}/${l}.`, ["Hitta ett tal som både nämnarna går i."]); } },
    { id: "orderThree", skill: "w5-l4.order", gen: (rng) => { const d = rng.int(5, 12); const set = new Set<number>(); while (set.size < 3) set.add(rng.int(1, d - 1)); const arr = [...set]; const s = [...arr].sort((x, y) => x - y); return multifield(`o3-${arr.join("-")}-${d}`, "w5-l4.order", `Ordna ${arr.map((n) => `${n}/${d}`).join(", ")} från minst till störst. Skriv bara täljarna.`, [{ label: "Minst", accept: [s[0]] }, { label: "Mitten", accept: [s[1]] }, { label: "Störst", accept: [s[2]] }], `Samma nämnare ${d}: ordna täljarna ${s.join(" < ")}.`, ["Samma nämnare – jämför täljarna."]); } },
  ],
  representation: [
    { id: "compareBars", skill: "w5-l4.bars", gen: (rng) => { const pairs: [number, number, number, number][] = [[1, 2, 2, 5], [2, 3, 3, 4], [3, 4, 5, 8], [1, 3, 3, 8]]; const [a, b, c, d] = rng.pick(pairs); const bigFirst = a * d > c * b; return withVisual(mc(`cb-${a}-${b}-${c}-${d}`, "w5-l4.bars", "Staplarna är lika långa. Vilken stapel har mest färgat?", bigFirst ? "Den övre" : "Den nedre", [{ text: bigFirst ? "Den nedre" : "Den övre" }, { text: "De är lika" }], `${a}/${b} ${bigFirst ? ">" : "<"} ${c}/${d}.`, ["Jämför de färgade delarna längs stapeln."], rng), { type: "fractionbars", bars: [{ parts: b, shaded: a }, { parts: d, shaded: c }] }); } },
    { id: "markLarger", skill: "w5-l4.numberline", gen: (rng) => { const pairs: [number, number, number, number][] = [[1, 2, 3, 8], [3, 4, 5, 8], [1, 4, 3, 8], [1, 2, 5, 8]]; const [a, b, c, d] = rng.pick(pairs); const l = 8, x = a * (l / b), y = c * (l / d); return numberlineEx(`ml-${a}-${b}-${c}-${d}`, "w5-l4.numberline", `Tallinjen mellan 0 och 1 är delad i åttondelar. Markera det större av ${m(a, b)} och ${m(c, d)}.`, Math.max(x, y), { min: 0, max: l, step: 1, labelEvery: 1, den: l }, `${a}/${b} = ${x}/8 och ${c}/${d} = ${y}/8. Störst: ${Math.max(x, y)}/8.`, ["Skriv båda i åttondelar."]); } },
  ],
  teacher: {
    title: "Större nämnare – större bråk?",
    scenarios: ["Sam (åk 4) hävdar att 1/3 är större än 1/2 eftersom 3 är större än 2. Du vill få honom att inse felet utan att bara ge reglerna."],
    prompt: "Visa Sam hur han själv kan upptäcka att 1/2 är större än 1/3. Förklara varför ett större tal i nämnaren ger mindre delar, och hur man jämför bråk med olika nämnare.",
    minChars: 170,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "modell", label: "en konkret modell (pizza, stapel, bit)", any: ["pizza", "stapel", "bit", "rita", "paj", "tårta", "klipp"] },
        { id: "delar", label: "att fler delar ger mindre delar", any: ["mindre delar", "mindre bitar", "fler delar", "fler bitar", "delas i fler", "mindre bit"] },
        { id: "svar", label: "rätt slutsats 1/2 > 1/3", any: ["1/2 större", "1/2 är större", "1/2 > 1/3", "hälften är större", "en halv är större", "1/2 störst"] },
        { id: "gemensam", label: "gemensam nämnare (3/6 och 2/6)", any: ["gemensam nämnare", "3/6", "2/6", "sjättedel"] },
        { id: "nam", label: "att nämnaren säger hur många delar helheten delas i", any: ["nämnare", "delas i", "delad i"] },
      ],
    },
    modelAnswer: "Sam, tänk dig två lika stora pizzor. Den ena delar vi i 2 bitar, den andra i 3 bitar. Vilken bit är störst? Bitarna i den som delats i 2 är större. Ju fler delar en helhet delas i, desto mindre blir varje bit. Nämnaren säger hur många delar helheten delas i – inte hur stor delen är. Alltså är 1/2 större än 1/3. Vi kan också skriva båda med gemensam nämnare 6: 1/2 = 3/6 och 1/3 = 2/6, och 3 sjättedelar är mer än 2 sjättedelar.",
  },
};
