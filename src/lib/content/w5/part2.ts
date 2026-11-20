import type { Lesson } from "../types";
import { mc, numeric, multifield, withVisual, numberlineEx, fractionbarEx, tf, gcd, lcm, fracAcc } from "@/lib/engine/gen-helpers";

const m = (n: number, d: number) => `$${tf(n, d)}$`;
const mixedTex = (w: number, n: number, d: number) => `$${w}\\,${tf(n, d)}$`;

// ───────── Lektion 5: Addera och subtrahera ─────────
const sumPairs: [number, number, number, number][] = [[1, 2, 1, 4], [1, 3, 1, 6], [1, 2, 1, 6], [1, 4, 1, 8], [2, 3, 1, 6], [3, 8, 1, 4], [1, 6, 1, 3], [1, 5, 3, 10], [1, 2, 1, 10], [1, 4, 1, 12], [1, 3, 1, 12], [1, 6, 1, 12], [3, 10, 1, 5], [1, 2, 1, 8]];

export const lesson5: Lesson = {
  id: "w5-l5", worldId: "w5", title: "Addera och subtrahera bråk", grades: "åk 4–6",
  summary: "Samma nämnare: räkna delarna. Olika nämnare: gör delarna lika stora först.",
  lgr: "Metoder för beräkningar med naturliga tal och enkla tal i bråkform; de fyra räknesätten",
  objectives: ["Addera och subtrahera bråk med samma nämnare.", "Använda gemensam nämnare vid olika nämnare.", "Förklara varför man inte adderar nämnarna."],
  intro: "$\\frac{1}{2} + \\frac{1}{3} = \\frac{2}{5}$? Det är det mest klassiska bråkfelet – och det är logiskt: eleven har adderat ”uppe och nere”. Det är därför bråkräkning måste byggas på **bilden av delar**, inte på regler.",
  theory: [
    { heading: "Samma nämnare: räkna delar", body: "$\\frac{2}{7} + \\frac{3}{7}$: 2 sjundedelar plus 3 sjundedelar är 5 sjundedelar. Delarnas storlek (nämnaren) ändras inte, vi räknar bara hur många vi har: $\\frac{5}{7}$.", visual: { type: "fractionbars", bars: [{ parts: 7, shaded: 2, label: "2/7" }, { parts: 7, shaded: 3, label: "3/7" }, { parts: 7, shaded: 5, label: "5/7" }] } },
    { heading: "Subtraktion på samma sätt", body: "$\\frac{5}{8} - \\frac{2}{8} = \\frac{3}{8}$: 5 åttondelar minus 2 åttondelar är 3 åttondelar." },
    { heading: "Olika nämnare: gemensam nämnare", body: "Vi kan bara lägga ihop delar som är lika stora. $\\frac{1}{2} + \\frac{1}{3}$: skriv båda i sjättedelar: $\\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}$. Gemensam nämnare är ett tal som båda nämnarna går i (t.ex. produkten eller minsta gemensamma multipeln)." },
    { heading: "Rimlighet", body: "$\\frac{1}{2} + \\frac{1}{3}$ måste bli större än $\\frac{1}{2}$. Svaret $\\frac{2}{5}$ är mindre än $\\frac{1}{2}$ – det kan inte stämma." },
  ],
  worked: [
    { title: "Samma nämnare", problem: "Beräkna 3/8 + 4/8.", steps: [{ text: "Delarna är åttondelar.", math: "\\text{3 åttondelar} + \\text{4 åttondelar}" }, { text: "Räkna delarna.", math: "\\frac{3+4}{8} = \\frac{7}{8}" }], why: "Nämnaren *namnger* delarna och ändras därför inte.", alternative: "Färglägg 3 delar och sedan 4 delar till i en stapel med 8 delar." },
    { title: "Olika nämnare", problem: "Beräkna 1/2 + 1/3.", steps: [{ text: "Gemensam nämnare: 6.", math: "\\frac{1}{2} = \\frac{3}{6},\\ \\frac{1}{3} = \\frac{2}{6}" }, { text: "Addera täljarna.", math: "\\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}" }], why: "Man kan bara lägga ihop lika stora delar – först efter förlängning är delarna lika.", alternative: "Rimlighet: $\\frac{5}{6}$ är större än $\\frac{1}{2}$ och mindre än 1. Det stämmer." },
  ],
  drawing: { task: "Rita en stapel delad i 6 delar. Färga 1/2 (3 delar) med en färg och 1/3 (2 delar) med en annan. Hur mycket är färgat sammanlagt?", tool: "fraction" },
  pupils: [{ pupil: "Alva", said: "1/2 + 1/3 = 2/5, för 1 + 1 = 2 och 2 + 3 = 5.", misconception: "Adderar både täljare och nämnare.", response: "Fråga: ”Hur kan summan av 1/2 och något mer bli mindre än 1/2?” Rita en stapel i sjättedelar och visa 3/6 + 2/6 = 5/6." }],
  knowledge: [
    { id: "sameAdd", skill: "w5-l5.same-add", gen: (rng) => { const d = rng.int(5, 12), a = rng.int(1, d - 2), b = rng.int(1, d - a - 1 || 1); return numeric(`sa-${a}-${b}-${d}`, "w5-l5.same-add", `${a}/${d} + ${b}/${d} = ? (Skriv som bråk, t.ex. 5/7.)`, fracAcc(a + b, d), `${a} + ${b} = ${a + b} ${d}-delar: ${m(a + b, d)}.`, ["Räkna delarna – nämnaren ändras inte."]); } },
    { id: "sameSub", skill: "w5-l5.same-sub", gen: (rng) => { const d = rng.int(5, 12), a = rng.int(2, d - 1), b = rng.int(1, a - 1); return numeric(`ss-${a}-${b}-${d}`, "w5-l5.same-sub", `${a}/${d} − ${b}/${d} = ? (Skriv som bråk.)`, fracAcc(a - b, d), `${a} − ${b} = ${a - b} ${d}-delar: ${m(a - b, d)}.`, ["Ta bort delarna."]); } },
    { id: "diffAdd", skill: "w5-l5.diff-add", gen: (rng) => { const [a, b, c, d] = rng.pick(sumPairs), l = lcm(b, d), n = a * (l / b) + c * (l / d); return numeric(`da-${a}-${b}-${c}-${d}`, "w5-l5.diff-add", `${a}/${b} + ${c}/${d} = ? (Skriv som bråk.)`, fracAcc(n, l), `Gemensam nämnare ${l}: ${a * (l / b)}/${l} + ${c * (l / d)}/${l} = ${n}/${l}.`, ["Skriv båda med gemensam nämnare."]); } },
    { id: "diffSub", skill: "w5-l5.diff-sub", gen: (rng) => { const [a, b, c, d] = rng.pick(sumPairs), l = lcm(b, d), x = a * (l / b), y = c * (l / d); if (x === y) return numeric("ds-0", "w5-l5.diff-sub", "3/4 − 1/2 = ? (Skriv som bråk.)", fracAcc(1, 4), "3/4 − 2/4 = 1/4.", []); const [hi, lo, nh, dh, nl, dl] = x > y ? [x, y, a, b, c, d] : [y, x, c, d, a, b]; return numeric(`ds-${a}-${b}-${c}-${d}`, "w5-l5.diff-sub", `${nh}/${dh} − ${nl}/${dl} = ? (Skriv som bråk.)`, fracAcc(hi - lo, l), `Gemensam nämnare ${l}: ${hi}/${l} − ${lo}/${l} = ${hi - lo}/${l}.`, ["Gemensam nämnare först."]); } },
    { id: "whySame", skill: "w5-l5.concept", gen: (rng) => mc("ws", "w5-l5.concept", "Varför är 1/5 + 2/5 = 3/5 och inte 3/10?", "Delarna är lika stora (femtedelar) – vi räknar bara hur många vi har", [{ text: "För att man alltid behåller den första nämnaren", note: "Det är en regel utan förklaring." }, { text: "För att 5 + 5 = 10" }, { text: "För att 1 + 2 = 3 och 5 + 5 = 10, så svaret är 3/10" }], "1 femtedel + 2 femtedelar = 3 femtedelar, precis som 1 äpple + 2 äpplen = 3 äpplen.", [], rng) },
    { id: "wordAdd", skill: "w5-l5.word", gen: (rng) => { const d = rng.int(6, 12), a = rng.int(1, 3), b = rng.int(1, 3); return numeric(`wa-${a}-${b}-${d}`, "w5-l5.word", `Elsa äter ${a}/${d} av en kaka och Omar äter ${b}/${d}. Hur stor del av kakan har de ätit tillsammans? (Skriv som bråk.)`, fracAcc(a + b, d), `${a}/${d} + ${b}/${d} = ${a + b}/${d}.`, ["Samma nämnare."]); } },
  ],
  method: [
    { id: "commonDenSteps", skill: "w5-l5.diff-add", gen: (rng) => { const [a, b, c, d] = rng.pick(sumPairs), l = lcm(b, d), x = a * (l / b), y = c * (l / d); return multifield(`cs-${a}-${b}-${c}-${d}`, "w5-l5.diff-add", `Räkna ${a}/${b} + ${c}/${d} med gemensam nämnare.`, [{ label: "Gemensam nämnare", accept: [l] }, { label: `${a}/${b} i ${l}-delar (täljare)`, accept: [x] }, { label: `${c}/${d} i ${l}-delar (täljare)`, accept: [y] }, { label: "Summa (t.ex. 5/6)", accept: fracAcc(x + y, l) }], `${x}/${l} + ${y}/${l} = ${x + y}/${l}.`, ["Hitta ett tal som båda nämnarna går i."]); } },
    { id: "sameSteps", skill: "w5-l5.same-add", gen: (rng) => { const d = rng.int(5, 12), a = rng.int(1, d - 2), b = rng.int(1, d - a - 1 || 1); return multifield(`ssp-${a}-${b}-${d}`, "w5-l5.same-add", `Räkna ${a}/${d} + ${b}/${d}. Fyll i.`, [{ label: "Täljare (delar tillsammans)", accept: [a + b] }, { label: "Nämnare (ändras den?)", accept: [d] }], `${a} + ${b} = ${a + b}; nämnaren är kvar ${d}.`, ["Delarna är lika stora."]); } },
  ],
  representation: [
    { id: "shadeSum", skill: "w5-l5.bar", gen: (rng) => { const d = rng.int(5, 12), a = rng.int(1, d - 2), b = rng.int(1, d - a - 1 || 1); return fractionbarEx(`sh-${a}-${b}-${d}`, "w5-l5.bar", `Färglägg ${m(a, d)} + ${m(b, d)} i stapeln (delad i ${d} delar).`, d, a + b, `${a} + ${b} = ${a + b} delar av ${d}.`, ["Hur många delar tillsammans?"]); } },
    { id: "barSum", skill: "w5-l5.bars", gen: (rng) => { const [a, b, c, d] = rng.pick(sumPairs), l = lcm(b, d), x = a * (l / b), y = c * (l / d); return withVisual(multifield(`bs-${a}-${b}-${c}-${d}`, "w5-l5.bars", `Staplarna visar ${a}/${b} och ${c}/${d} (tredje stapeln är delad i ${l} delar). Hur många ${l}-delar är vart och ett, och tillsammans?`, [{ label: `${a}/${b} i ${l}-delar`, accept: [x] }, { label: `${c}/${d} i ${l}-delar`, accept: [y] }, { label: "Tillsammans (antal delar)", accept: [x + y] }], `${x} + ${y} = ${x + y} av ${l} delar.`, []), { type: "fractionbars", bars: [{ parts: b, shaded: a }, { parts: d, shaded: c }, { parts: l, shaded: x + y, label: "summa" }] }); } },
  ],
  teacher: {
    title: "Varför adderar man inte nämnarna?",
    scenarios: ["Alva (åk 5) räknar 1/2 + 1/3 = 2/5 eftersom \"1 + 1 = 2 och 2 + 3 = 5\". Hon har en stapel framför sig men tycker att hennes svar \"ser rätt ut\"."],
    prompt: "Förklara för Alva varför 2/5 inte kan vara rätt och hur man räknar 1/2 + 1/3. Använd en modell och en rimlighetskontroll.",
    minChars: 170,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "rimlig", label: "rimlighet: summan måste vara större än 1/2", any: ["större än 1/2", "mer än 1/2", "mindre än 1/2", "orimlig", "rimlig", "hälften"] },
        { id: "lika", label: "att delarna måste vara lika stora / gemensam nämnare", any: ["lika stora", "gemensam nämnare", "samma nämnare", "sjättedel"] },
        { id: "svar", label: "rätt svar 5/6 (3/6 + 2/6)", any: ["5/6", "3/6", "2/6"] },
        { id: "modell", label: "en modell (stapel, pizza, bild)", any: ["stapel", "pizza", "rita", "bild", "modell"] },
        { id: "namn", label: "att nämnaren namnger delarna och inte ska adderas", any: ["nämnaren", "namnger", "inte adderas", "adderar inte", "ändras inte"] },
      ],
    },
    modelAnswer: "Alva, 1/2 + 1/3 måste bli mer än 1/2, men 2/5 är mindre än 1/2, så det kan inte stämma. Man kan bara lägga ihop delar som är lika stora, och halvor och tredjedelar är olika stora. Rita en stapel delad i 6 delar: 1/2 är 3 sjättedelar och 1/3 är 2 sjättedelar. Tillsammans blir det 3/6 + 2/6 = 5/6. Nämnaren namnger hur stora delarna är, och den ändras inte när vi lägger ihop – precis som 3 äpplen plus 2 äpplen är 5 äpplen.",
  },
};

// ───────── Lektion 6: Blandad form ─────────
export const lesson6: Lesson = {
  id: "w5-l6", worldId: "w5", title: "Blandad form och oäkta bråk", grades: "åk 4–6",
  summary: "Bråk större än 1: oäkta bråk, blandad form och sambandet med division.",
  lgr: "Tal i bråkform och deras användning; rationella tal och deras egenskaper",
  objectives: ["Skriva oäkta bråk i blandad form och tvärtom.", "Förklara sambandet med division med rest.", "Placera bråk större än 1 på tallinjen."],
  intro: "$\\frac{7}{4}$ är större än 1 – men många elever tycker att ”ett bråk kan inte vara större än en hel”. Genom att koppla bråket till division och till hela tal blir det naturligt: **7 fjärdedelar är en hel och 3 fjärdedelar.**",
  theory: [
    { heading: "Oäkta bråk och blandad form", body: "Ett bråk med täljare $\\geq$ nämnare kallas **oäkta**. $\\frac{7}{4}$ kan skrivas i **blandad form**: $1\\,\\frac{3}{4}$ (en hel och tre fjärdedelar).", visual: { type: "fractionbars", bars: [{ parts: 4, shaded: 4, label: "4/4" }, { parts: 4, shaded: 3, label: "3/4" }] } },
    { heading: "Division med rest", body: "$\\frac{7}{4} = 7 \\div 4 = 1$ rest $3$. Kvoten 1 är antalet hela, resten 3 blir täljaren: $1\\,\\frac{3}{4}$. Bråkstrecket betyder alltså ”delat med”." },
    { heading: "Från blandad form till bråk", body: "$2\\,\\frac{1}{3}$: 2 hela är $2 \\cdot 3 = 6$ tredjedelar, plus 1 tredjedel = $\\frac{7}{3}$. Skriv *inte* 21/3 – talet 21 skulle säga ”tjugoen tredjedelar”.", visual: { type: "numberline", min: 0, max: 9, step: 1, marks: [7], labelEvery: 3, den: 3 } },
  ],
  worked: [
    { title: "Oäkta till blandad", problem: "Skriv 17/5 i blandad form.", steps: [{ text: "Dividera täljaren med nämnaren.", math: "17 \\div 5 = 3\\ \\text{rest}\\ 2" }, { text: "Kvoten är antalet hela, resten är täljaren.", math: "3\\,\\frac{2}{5}" }], why: "15 femtedelar är 3 hela, och 2 femtedelar blir över.", alternative: "Rita 17 femtedelar och gruppera 5 i taget." },
    { title: "Blandad till oäkta", problem: "Skriv 2 1/3 som bråk.", steps: [{ text: "2 hela i tredjedelar:", math: "2 \\cdot 3 = 6" }, { text: "Lägg till 1 tredjedel.", math: "6 + 1 = 7" }, { text: "Bråket:", math: "\\frac{7}{3}" }], why: "Varje hel är $\\frac{3}{3}$, så 2 hela är $\\frac{6}{3}$.", alternative: "Tallinjen: gå 2 hela steg och en tredjedel till." },
  ],
  drawing: { task: "Rita 7 fjärdedelar som staplar: fyll en hel stapel (4/4) och en stapel med 3 delar. Skriv både 7/4 och 1 3/4.", tool: "fraction" },
  pupils: [{ pupil: "Edvin", said: "2 1/3 är 21/3, för jag skriver 2 och 1 bredvid varandra.", misconception: "Läser blandad form som en konkatenering av siffror.", response: "Låt Edvin rita 2 hela och 1/3 och dela alla hela i tredjedelar: 6 + 1 = 7 tredjedelar." }],
  knowledge: [
    { id: "wholeParts", skill: "w5-l6.whole", gen: (rng) => { const d = rng.int(3, 8), w = rng.int(1, 4), r = rng.int(1, d - 1); return numeric(`wp-${w}-${r}-${d}`, "w5-l6.whole", `Hur många hela finns i ${w * d + r}/${d}?`, w, `${w * d + r} ÷ ${d} = ${w} rest ${r}.`, ["Dela täljaren med nämnaren."]); } },
    { id: "toImproper", skill: "w5-l6.improper", gen: (rng) => { const d = rng.int(3, 8), w = rng.int(1, 4), r = rng.int(1, d - 1); return numeric(`ti-${w}-${r}-${d}`, "w5-l6.improper", `Skriv ${w} ${r}/${d} som ett bråk med nämnaren ${d}. (Skriv t.ex. 7/3.)`, `${w * d + r}/${d}`, `${w} · ${d} + ${r} = ${w * d + r}: ${m(w * d + r, d)}.`, ["Hur många " + d + "-delar går det på " + w + " hela?"]); } },
    { id: "bigger1", skill: "w5-l6.compare", gen: (rng) => { const d = rng.int(3, 8), w = rng.int(1, 3), r = rng.int(1, d - 1); return mc(`bg-${w}-${r}-${d}`, "w5-l6.compare", `Vilket tal är lika med ${mixedTex(w, r, d)}?`, m(w * d + r, d), [{ text: `$${w}${r}/${d}$`.replace("/", "\\!/\\!"), note: "Man skriver inte hela och täljare bredvid varandra – siffrorna ska räknas om till " + d + "-delar." }, { text: m(w + r, d) }, { text: m(w * d, d + r) }], `${w} hela = ${w * d}/${d}, plus ${r}/${d} = ${(w * d + r)}/${d}.`, ["Gör om hela till " + d + "-delar."], rng); } },
    { id: "mixedPos", skill: "w5-l6.between", gen: (rng) => { const d = rng.int(3, 6), w = rng.int(1, 3), r = rng.int(1, d - 1); return mc(`mp-${w}-${r}-${d}`, "w5-l6.between", `Mellan vilka hela tal ligger ${m(w * d + r, d)}?`, `${w} och ${w + 1}`, [{ text: `${w - 1} och ${w}` }, { text: `${w + 1} och ${w + 2}` }, { text: `0 och 1` }].filter((o) => o.text !== `${w} och ${w + 1}`), `${m(w * d + r, d)} = ${mixedTex(w, r, d)}, alltså mellan ${w} och ${w + 1}.`, ["Hur många hela får du?"], rng); } },
    { id: "divLink", skill: "w5-l6.division", gen: (rng) => { const d = rng.int(3, 9), q = rng.int(2, 6), r = rng.int(1, d - 1); return numeric(`dl-${q}-${r}-${d}`, "w5-l6.division", `${q * d + r} ÷ ${d} = □ rest ${r}. Vilket är det blandade talets hela? (Svara med kvoten.)`, q, `${q * d + r}/${d} = ${q} ${r}/${d}.`, ["Kvot = antal hela."]); } },
  ],
  method: [
    { id: "toMixed", skill: "w5-l6.whole", gen: (rng) => { const d = rng.int(3, 9), w = rng.int(1, 5), r = rng.int(1, d - 1); const n = w * d + r; return multifield(`tm-${n}-${d}`, "w5-l6.whole", `Skriv ${n}/${d} i blandad form med division.`, [{ label: `${n} ÷ ${d} = (hela)`, accept: [w] }, { label: "Rest (täljare)", accept: [r] }], `${n} ÷ ${d} = ${w} rest ${r}: ${w} ${r}/${d}.`, ["Division med rest."]); } },
    { id: "toImproperSteps", skill: "w5-l6.improper", gen: (rng) => { const d = rng.int(3, 8), w = rng.int(1, 4), r = rng.int(1, d - 1); return multifield(`tis-${w}-${r}-${d}`, "w5-l6.improper", `Skriv ${w} ${r}/${d} som bråk. Fyll i stegen.`, [{ label: `${w} · ${d} =`, accept: [w * d] }, { label: `Plus ${r} =`, accept: [w * d + r] }], `${w * d} + ${r} = ${w * d + r}: ${w * d + r}/${d}.`, ["Hela i " + d + "-delar."]); } },
  ],
  representation: [
    { id: "markImproper", skill: "w5-l6.numberline", gen: (rng) => { const d = rng.int(3, 5), w = rng.int(1, 2), r = rng.int(1, d - 1), n = w * d + r; return numberlineEx(`mi-${n}-${d}`, "w5-l6.numberline", `Markera ${mixedTex(w, r, d)} på tallinjen (varje helt steg är delat i ${d} delar).`, n, { min: 0, max: 3 * d, step: 1, labelEvery: 1, den: d }, `${w} hela och ${r}/${d}: streck ${n}.`, ["Gå " + w + " hela steg och " + r + " delar till."]); } },
    { id: "barsMixed", skill: "w5-l6.bars", gen: (rng) => { const d = rng.int(3, 6), w = rng.int(1, 2), r = rng.int(1, d - 1); const bars = [...Array.from({ length: w }, () => ({ parts: d, shaded: d })), { parts: d, shaded: r }]; return withVisual(multifield(`bm-${w}-${r}-${d}`, "w5-l6.bars", "Bilden visar staplar delade i lika många delar. Hur många hela staplar är fyllda, hur många delar är färgade i den sista, och hur många delar är det totalt?", [{ label: "Hela staplar", accept: [w] }, { label: "Delar i sista stapeln", accept: [r] }, { label: "Delar totalt (täljare)", accept: [w * d + r] }], `${w} hela och ${r}/${d} = ${w * d + r}/${d}.`, []), { type: "fractionbars", bars: bars.map((b, i) => ({ ...b, label: i < w ? "hel" : `${r}/${d}` })) }); } },
  ],
  teacher: {
    title: "Blandad form är inte två tal bredvid varandra",
    scenarios: ["Edvin (åk 5) skriver 2 1/3 som 21/3 \"eftersom 2 och 1 står bredvid varandra\". Han undrar varför läraren sa att det blev 7/3."],
    prompt: "Förklara för Edvin vad 2 1/3 betyder, varför det blir 7/3 och inte 21/3, och hur han kan kontrollera sig. Använd tredjedelar i förklaringen.",
    minChars: 170,
    rubric: {
      minConcepts: 3,
      concepts: [
        { id: "hela", label: "att 2 hela är 6 tredjedelar (2 · 3)", any: ["2 · 3", "2·3", "6 tredjedelar", "sex tredjedelar", "hela i tredjedelar", "6/3"] },
        { id: "svar", label: "rätt svar 7/3", any: ["7/3", "sju tredjedelar", "7 tredjedelar"] },
        { id: "fel", label: "att 21/3 är 21 tredjedelar / mycket större", any: ["21 tredjedelar", "tjugoen", "21/3 är", "7 hela", "mycket större", "7 · 3"] },
        { id: "modell", label: "modell eller kontroll (tallinje, stapel, division)", any: ["tallinje", "stapel", "rita", "division", "21 ÷ 3", "÷", "kontroll"] },
      ],
    },
    modelAnswer: "Edvin, 2 1/3 betyder två hela och en tredjedel. Varje hel är 3 tredjedelar, så 2 hela är 2 · 3 = 6 tredjedelar. Med den extra tredjedelen blir det 6 + 1 = 7 tredjedelar, alltså 7/3. 21/3 skulle betyda 21 tredjedelar, och det är 7 hela – mycket mer än två och en tredjedel. Du kan kontrollera med division: 7 ÷ 3 = 2 rest 1, vilket ger 2 1/3. Rita gärna på en tallinje: två hela steg och en tredjedel till.",
  },
};

// ───────── Lektion 7: Bråk av ett antal ─────────
export const lesson7: Lesson = {
  id: "w5-l7", worldId: "w5", title: "Bråk av ett antal", grades: "åk 4–6",
  summary: "3/4 av 20, enhetsbråk och sambandet mellan bråk och division.",
  lgr: "Hur tal i bråkform kan användas i vardagliga situationer; de fyra räknesätten",
  objectives: ["Beräkna ett bråk av ett antal.", "Se sambandet mellan bråk och division.", "Lösa vardagliga problem med bråk av ett antal."],
  intro: "Bråk handlar inte bara om pizzor – de beskriver också *delar av ett antal*: $\\frac{3}{4}$ av 20 elever, $\\frac{2}{5}$ av 30 kr. Metoden bygger på något eleverna redan kan: **division och multiplikation**.",
  theory: [
    { heading: "Enhetsbråk av ett antal", body: "$\\frac{1}{4}$ av 20 betyder 20 delat i 4 lika grupper: $20 \\div 4 = 5$. ”En n-del av” är samma sak som att dela med $n$.", visual: { type: "fractionset", total: 20, groups: 4, shadedGroups: 1 } },
    { heading: "Fler delar", body: "$\\frac{3}{4}$ av 20: först en fjärdedel (5), sedan tre sådana: $3 \\cdot 5 = 15$. Alltså $\\frac{3}{4}$ av 20 $= (20 \\div 4) \\cdot 3 = 15$.", visual: { type: "fractionset", total: 20, groups: 4, shadedGroups: 3 } },
    { heading: "Bråkstrecket är ett divisionstecken", body: "$\\frac{3}{4}$ kan läsas som $3 \\div 4$: tre hela som delas rättvist på fyra. Det hänger ihop: ”$\\frac{3}{4}$ av 20” är $\\frac{3 \\cdot 20}{4}$, vilket också är 15." },
    { heading: "Baklänges", body: "Vet vi att $\\frac{3}{4}$ av ett tal är 18? Då är en fjärdedel $18 \\div 3 = 6$ och hela talet $4 \\cdot 6 = 24$." },
  ],
  worked: [
    { title: "Bråk av ett antal", problem: "Beräkna 3/5 av 30.", steps: [{ text: "Dela 30 i 5 lika grupper.", math: "30 \\div 5 = 6" }, { text: "Ta 3 grupper.", math: "3 \\cdot 6 = 18" }], why: "En femtedel av 30 är 6; tre femtedelar är tre gånger så mycket.", alternative: "$\\frac{3 \\cdot 30}{5} = \\frac{90}{5} = 18$." },
    { title: "Hitta helheten", problem: "2/3 av ett tal är 14. Vilket är talet?", steps: [{ text: "2 tredjedelar = 14, så 1 tredjedel:", math: "14 \\div 2 = 7" }, { text: "Hela talet är 3 tredjedelar.", math: "3 \\cdot 7 = 21" }], why: "Vi går från delarna till en del, och sedan till helheten.", alternative: "Kontroll: $\\frac{2}{3}$ av 21 = 14." },
  ],
  drawing: { task: "Rita 20 prickar och dela dem i 4 lika grupper. Ringa in 3 grupper. Hur många prickar är det, och vilket bråk av alla?", tool: "grid" },
  pupils: [{ pupil: "Olle", said: "1/4 av 20 är 5, så 3/4 av 20 är också 5.", misconception: "Glömmer att multiplicera med täljaren.", response: "Rita 4 grupper om 5. Fråga: ”Hur många grupper ska vi ta?” 3 · 5 = 15." }],
  knowledge: [
    { id: "unitOf", skill: "w5-l7.unit-of", gen: (rng) => { const n = rng.int(3, 9), q = rng.int(3, 12); return numeric(`uo-${n}-${q}`, "w5-l7.unit-of", `1/${n} av ${n * q} = ?`, q, `${n * q} ÷ ${n} = ${q}.`, ["Dela med nämnaren."]); } },
    { id: "fractionOf", skill: "w5-l7.fraction-of", gen: (rng, { level }) => { const n = rng.int(3, level > 1 ? 10 : 8), a = rng.int(2, n - 1), q = rng.int(2, 9); return numeric(`fo-${a}-${n}-${q}`, "w5-l7.fraction-of", `${a}/${n} av ${n * q} = ?`, a * q, `${n * q} ÷ ${n} = ${q}, och ${a} · ${q} = ${a * q}.`, ["Först en del, sedan flera."]); } },
    { id: "wordProblem", skill: "w5-l7.word", gen: (rng) => { const n = rng.int(4, 8), a = rng.int(1, n - 1), q = rng.int(3, 9), total = n * q; return numeric(`wp-${a}-${n}-${total}`, "w5-l7.word", `I en klass med ${total} elever tycker ${a}/${n} att matte är roligast. Hur många elever är det?`, a * q, `${total} ÷ ${n} = ${q}, ${a} · ${q} = ${a * q}.`, ["Hur många elever i varje " + n + "-del?"], "elever"); } },
    { id: "backwards", skill: "w5-l7.whole", gen: (rng) => { const n = rng.int(3, 6), a = rng.int(2, n - 1), q = rng.int(2, 9); return numeric(`bw-${a}-${n}-${q}`, "w5-l7.whole", `${a}/${n} av ett tal är ${a * q}. Vilket är talet?`, n * q, `1/${n} är ${a * q} ÷ ${a} = ${q}, hela talet ${n} · ${q} = ${n * q}.`, ["Hitta först en " + n + "-del."]); } },
    { id: "exprMc", skill: "w5-l7.concept", gen: (rng) => { const n = rng.int(3, 6), a = rng.int(2, n - 1), q = rng.int(3, 9); const t = n * q; return mc(`ex-${a}-${n}-${q}`, "w5-l7.concept", `Hur räknar du ${a}/${n} av ${t}?`, `(${t} ÷ ${n}) · ${a}`, [{ text: `(${t} ÷ ${a}) · ${n}`, note: "Delare och multiplikator har bytt plats." }, { text: `${t} ÷ ${n} + ${a}` }, { text: `${t} − ${a}/${n}` }], `Först en ${n}-del: ${t} ÷ ${n} = ${q}. Sedan ${a} stycken: ${a} · ${q}.`, ["Dela först med nämnaren."], rng); } },
  ],
  method: [
    { id: "ofSteps", skill: "w5-l7.fraction-of", gen: (rng) => { const n = rng.int(3, 8), a = rng.int(2, n - 1), q = rng.int(3, 9); return multifield(`os-${a}-${n}-${q}`, "w5-l7.fraction-of", `Beräkna ${a}/${n} av ${n * q} i steg.`, [{ label: `En ${n}-del (${n * q} ÷ ${n})`, accept: [q] }, { label: `Antal delar (täljare)`, accept: [a] }, { label: "Svar", accept: [a * q] }], `${n * q} ÷ ${n} = ${q}; ${a} · ${q} = ${a * q}.`, []); } },
    { id: "wholeSteps", skill: "w5-l7.whole", gen: (rng) => { const n = rng.int(3, 6), a = rng.int(2, n - 1), q = rng.int(2, 9); return multifield(`ws-${a}-${n}-${q}`, "w5-l7.whole", `${a}/${n} av ett tal är ${a * q}. Hitta talet i steg.`, [{ label: `En ${n}-del (${a * q} ÷ ${a})`, accept: [q] }, { label: `Hela (${n} stycken)`, accept: [n * q] }], `${a * q} ÷ ${a} = ${q}; ${n} · ${q} = ${n * q}.`, []); } },
  ],
  representation: [
    { id: "dotsRead", skill: "w5-l7.dots", gen: (rng) => { const n = rng.int(3, 5), a = rng.int(1, n - 1), per = rng.int(2, 4); return withVisual(multifield(`dr-${a}-${n}-${per}`, "w5-l7.dots", "Bilden visar prickar i lika stora grupper. De markerade grupperna är en del av alla. Hur många prickar är det i varje grupp, hur många är markerade, och vilket bråk av alla prickar är det?", [{ label: "Prickar per grupp", accept: [per] }, { label: "Markerade prickar", accept: [a * per] }, { label: "Bråk (t.ex. 3/4)", accept: fracAcc(a, n) }], `${a} av ${n} grupper: ${a}/${n}, ${a * per} av ${n * per} prickar.`, []), { type: "fractionset", total: n * per, groups: n, shadedGroups: a }); } },
    { id: "shadeOf", skill: "w5-l7.bar", gen: (rng) => { const n = rng.int(4, 8), a = rng.int(1, n - 1); return fractionbarEx(`sf-${a}-${n}`, "w5-l7.bar", `Stapeln står för 1 hel. Färglägg ${m(a, n)} av stapeln (delad i ${n} delar).`, n, a, `${a} av ${n} delar.`, []); } },
  ],
  teacher: {
    title: "Enhetsbråk och flera delar",
    scenarios: ["Olle (åk 4) ska räkna 3/4 av 20 kronor. Han räknar 20 ÷ 4 = 5 och svarar 5 kr. Han säger: \"Fjärdedel betyder ju delat med fyra.\""],
    prompt: "Förklara för Olle vad hans svar 5 kr egentligen är och hur han får rätt svar på 3/4 av 20 kr. Använd en bild med grupper och förklara vad täljaren och nämnaren gör.",
    minChars: 170,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "fjard", label: "att 5 är en fjärdedel (1/4 av 20)", any: ["en fjärdedel", "1/4", "5 kr är", "bara en"] },
        { id: "tre", label: "att täljaren 3 betyder tre sådana delar (3 · 5)", any: ["3 · 5", "3·5", "tre grupper", "tre delar", "tre gånger", "täljaren"] },
        { id: "svar", label: "rätt svar 15", any: ["15"] },
        { id: "modell", label: "en bild med grupper (4 grupper om 5)", any: ["4 grupper", "fyra grupper", "grupper", "rita", "bild", "prickar", "mynt"] },
        { id: "namn", label: "att nämnaren säger hur många lika stora delar vi delar i", any: ["nämnaren", "delar i fyra", "delar i 4", "dela med 4"] },
      ],
    },
    modelAnswer: "Olle, 20 ÷ 4 = 5 ger dig en fjärdedel av 20 kr, alltså 1/4. Men frågan gällde 3/4. Rita 4 lika stora grupper med 5 kr i varje. Nämnaren 4 säger att vi delar i 4 grupper, och täljaren 3 säger att vi ska ta tre av dem. 3 · 5 = 15, så 3/4 av 20 kr är 15 kr. Du hade kommit halvvägs: du hittade en del, men du glömde att ta tre.",
  },
};
