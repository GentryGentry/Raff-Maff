import type { Lesson } from "../types";
import { mc, numeric, multifield, withVisual } from "@/lib/engine/gen-helpers";
import type { Rng } from "@/lib/engine/rng";

// ───────── Lektion 4: Arbeta baklänges ─────────
type Op = { k: "add" | "sub" | "mul" | "div"; n: number };
const OP_TXT: Record<Op["k"], string> = { add: "lägger till", sub: "drar bort", mul: "multiplicerar med", div: "dividerar med" };
const OP_SYM: Record<Op["k"], string> = { add: "+", sub: "−", mul: "·", div: "÷" };
const apply = (x: number, o: Op) => (o.k === "add" ? x + o.n : o.k === "sub" ? x - o.n : o.k === "mul" ? x * o.n : x / o.n);
function chain(rng: Rng, steps: number) {
  for (;;) {
    const x = rng.int(2, 20); let cur = x; const ops: Op[] = [];
    for (let i = 0; i < steps; i++) {
      const k = rng.pick(["add", "sub", "mul", "div"] as const);
      if (k === "add") ops.push({ k, n: rng.int(2, 15) });
      else if (k === "sub") { if (cur < 4) { i--; continue; } ops.push({ k, n: rng.int(1, cur - 1) }); }
      else if (k === "mul") ops.push({ k, n: rng.int(2, 5) });
      else { const ds = Array.from({ length: cur }, (_, j) => j + 1).filter((d) => d > 1 && d <= 9 && cur % d === 0); if (!ds.length) { i--; continue; } ops.push({ k, n: rng.pick(ds) }); }
      cur = apply(cur, ops[ops.length - 1]);
    }
    if (cur > 0 && cur <= 150 && cur !== x) return { x, ops, R: cur };
  }
}
const joinOps = (ops: Op[]) => ops.map((o) => `${OP_TXT[o.k]} ${o.n}`).reduce((a, b, i, arr) => (i === 0 ? b : i === arr.length - 1 ? `${a} och ${b}` : `${a}, ${b}`), "");
const INVERSE: [string, string][] = [["multiplicera med 4", "dividera med 4"], ["addera 9", "subtrahera 9"], ["dividera med 3", "multiplicera med 3"], ["subtrahera 12", "addera 12"]];

export const lesson4: Lesson = {
  id: "w13-l4", worldId: "w13", title: "Arbeta baklänges", grades: "åk 4–6",
  summary: "Känner du resultatet och stegen? Gör motsatta räkneoperationer i omvänd ordning.",
  lgr: "Strategier för att lösa matematiska problem: arbeta baklänges; omvända räkneoperationer",
  objectives: ["Känna igen problem där man söker starttalet.", "Använda motsatta räkneoperationer i omvänd ordning.", "Kontrollera genom att räkna framåt."],
  intro: "Ibland känner du **slutresultatet** men söker **början**: ”Jag tänkte på ett tal, multiplicerade med 3, drog bort 4 och fick 23.” Då är det smartast att **arbeta baklänges**: ångra stegen ett i taget, i omvänd ordning, med de *motsatta* räkneoperationerna.",
  theory: [
    { heading: "Motsatta operationer", body: "Addition ↔ subtraktion, multiplikation ↔ division. Motsatsen till ”multiplicera med 4” är ”dividera med 4”, och till ”addera 9” är ”subtrahera 9”." },
    { heading: "Omvänd ordning", body: "Stegen gjordes: (1) multiplicera med 3, (2) dra bort 4 → 23. Baklänges: (2) lägg till 4: $23 + 4 = 27$, (1) dividera med 3: $27 \\div 3 = 9$. Talet var **9**." },
    { heading: "Kontrollera framåt", body: "$9 \\cdot 3 = 27$ och $27 - 4 = 23$ ✓. Alltid en kontroll! Om det inte stämmer har du ångrat stegen i fel ordning." },
    { heading: "I vardagen", body: "Du spenderade hälften av dina pengar och köpte sedan en bok för 40 kr. Då har du 60 kr kvar. Baklänges: före boken 100 kr, och det var hälften av pengarna: $2 \\cdot 100 = 200$ kr från början." },
  ],
  worked: [
    { title: "Talet jag tänkte på", problem: "Jag tänker på ett tal, multiplicerar med 3 och drar bort 4. Resultatet är 23.", steps: [{ text: "Baklänges: ångra ”drar bort 4”:", math: "23 + 4 = 27" }, { text: "Ångra ”multiplicerar med 3”:", math: "27 \\div 3 = 9" }, { text: "Kontroll: 9 · 3 − 4 = 23 ✓" }], why: "Varje steg ångras med sin motsats, i omvänd ordning.", alternative: "Prova och pröva framåt tills du får 23." },
    { title: "Pengar", problem: "Du spenderade hälften av dina pengar och köpte sedan en bok för 40 kr. Du har 60 kr kvar. Hur mycket hade du?", steps: [{ text: "Före boken: 60 + 40 = 100." }, { text: "Det var hälften: 100 · 2 = 200." }], why: "Motsatsen till ”hälften kvar” är ”dubbelt så mycket”.", alternative: "Pröva 200: hälften 100, minus 40 = 60 ✓." },
  ],
  drawing: { task: "Rita ett flödesschema: x → ·2 → +5 → 17. Rita sedan pilarna åt andra hållet med motsatta operationer. Vad är x?", tool: "grid" },
  pupils: [{ pupil: "Theo", said: "Jag multiplicerade med 3 och drog bort 4 och fick 23. Då gör jag 23 · 3 − 4.", misconception: "Gör samma operationer igen i stället för att ångra dem.", response: "Rita pilar: x → ·3 → −4 → 23. Baklänges: 23 → +4 → ÷3. Det blir (23 + 4) ÷ 3 = 9. Kontrollera framåt." }],
  knowledge: [
    { id: "chain", skill: "w13-l4.chain", gen: (rng) => { const c = chain(rng, rng.int(2, 3)); return numeric(`ch-${c.x}-${c.ops.map((o) => o.k + o.n).join("")}`, "w13-l4.chain", `Jag tänker på ett tal. Jag ${joinOps(c.ops)}. Resultatet är ${c.R}. Vilket tal tänkte jag på?`, c.x, `Ångra stegen i omvänd ordning: ${[...c.ops].reverse().map((o) => ({ add: `dra bort ${o.n}`, sub: `lägg till ${o.n}`, mul: `dividera med ${o.n}`, div: `multiplicera med ${o.n}` }[o.k])).join(", sedan ")}. Talet är ${c.x} (kontroll framåt ger ${c.R}).`, ["Ångra det sista steget först."]); } },
    { id: "money", skill: "w13-l4.money", gen: (rng) => { const b = rng.int(2, 9) * 10, R = rng.int(2, 9) * 10; return numeric(`mo-${b}-${R}`, "w13-l4.money", `Du spenderade hälften av dina pengar och köpte sedan en bok för ${b} kr. Då hade du ${R} kr kvar. Hur mycket hade du från början?`, 2 * (R + b), `Före boken: ${R} + ${b} = ${R + b}. Det var hälften: 2 · ${R + b} = ${2 * (R + b)} kr.`, ["Börja från slutet."], "kr"); } },
    { id: "inverse", skill: "w13-l4.inverse", gen: (rng) => { const [op, inv] = rng.pick(INVERSE); return mc(`iv-${op}`, "w13-l4.inverse", `Vilken räkneoperation ångrar ”${op}”?`, inv, INVERSE.filter(([o]) => o !== op).map(([o]) => ({ text: o })).concat([{ text: op }]).slice(0, 3), `Motsatsen till ”${op}” är ”${inv}”.`, ["Vilken operation tar dig tillbaka?"], rng); } },
    { id: "order", skill: "w13-l4.order", gen: (rng) => { const m = rng.int(2, 5), x = rng.int(3, 20), s = rng.int(2, Math.min(9, m * x - 1)); return mc(`or-${m}-${s}-${x}`, "w13-l4.order", `Jag tänker på ett tal, multiplicerar med ${m} och drar bort ${s}. Resultatet är ${m * x - s}. Vilken uträkning ger talet?`, `(${m * x - s} + ${s}) ÷ ${m}`, [{ text: `${m * x - s} · ${m} − ${s}`, note: "Det upprepar stegen – du ska ångra dem." }, { text: `(${m * x - s} − ${s}) ÷ ${m}` }, { text: `${m * x - s} ÷ ${m} + ${s}` }], `Ångra först ”drar bort ${s}” (lägg till), sedan ”multiplicerar med ${m}” (dividera).`, ["Omvänd ordning och motsatta operationer."], rng); } },
  ],
  method: [
    { id: "backSteps", skill: "w13-l4.chain", gen: (rng) => { const c = chain(rng, 2); const before = apply(c.x, c.ops[0]); return multifield(`bs-${c.x}-${c.ops.map((o) => o.k + o.n).join("")}`, "w13-l4.chain", `Jag tänker på ett tal. Jag ${joinOps(c.ops)}. Resultatet är ${c.R}. Räkna baklänges i steg.`, [{ label: "Värdet före sista steget", accept: [before] }, { label: "Talet jag tänkte på", accept: [c.x] }], `Före sista steget: ${before}. Starttal: ${c.x}.`, ["Ångra sista steget först."]); } },
  ],
  representation: [
    { id: "flow", skill: "w13-l4.flow", gen: (rng) => { const c = chain(rng, 2); return numeric(`fl-${c.x}-${c.ops.map((o) => o.k + o.n).join("")}`, "w13-l4.flow", `Talet x går genom en maskin: x → ${c.ops.map((o) => `${OP_SYM[o.k]}${o.n}`).join(" → ")} → ${c.R}. Vilket är x?`, c.x, `Ångra pilarna från höger: x = ${c.x}.`, ["Följ pilarna baklänges med motsatta operationer."]); } },
  ],
  teacher: {
    title: "Ångra stegen, upprepa dem inte",
    scenarios: ["Theo (åk 5) har ett tal som han multiplicerat med 3 och sedan dragit bort 4 från. Resultatet blev 23. Theo räknar 23 · 3 − 4 = 65."],
    prompt: "Förklara för Theo hur man arbetar baklänges: vilka operationer som ångrar stegen, i vilken ordning, vilket talet var och hur han kan kontrollera.",
    minChars: 190,
    rubric: { minConcepts: 4, concepts: [
      { id: "motsats", label: "motsatta operationer", any: ["motsatt", "omvänd", "ångra", "tvärtom", "inversa"] },
      { id: "ordning", label: "omvänd ordning (sista steget först)", any: ["omvänd ordning", "sista steget först", "baklänges", "från slutet", "bakifrån"] },
      { id: "steg", label: "23 + 4 = 27 och 27 ÷ 3", any: ["23 + 4", "27", "lägga till 4", "addera 4"] },
      { id: "svar", label: "rätt tal 9", any: ["9"] },
      { id: "kontroll", label: "kontroll framåt (9 · 3 − 4 = 23)", any: ["kontroll", "9 · 3", "9·3", "stämmer", "framåt"] },
    ] },
    modelAnswer: "Theo, när du känner resultatet ska du ångra stegen med motsatta operationer och i omvänd ordning, från slutet och bakåt. Stegen var: multiplicera med 3, dra bort 4. Baklänges: först lägger du till 4, 23 + 4 = 27, och sedan dividerar du med 3, 27 ÷ 3 = 9. Talet var 9. Du gjorde samma operationer igen, 23 · 3 − 4, och det ger fel. Kontrollera framåt: 9 · 3 = 27 och 27 − 4 = 23, så det stämmer.",
  },
};

// ───────── Lektion 5: Matematiska resonemang ─────────
const CLAIMS: [string, boolean, string][] = [
  ["Summan av två udda tal är alltid ett jämnt tal", true, "Udda tal är 2a + 1 och 2b + 1; summan 2a + 2b + 2 är jämn."],
  ["Produkten av två udda tal är alltid ett jämnt tal", false, "Motexempel: 3 · 5 = 15, som är udda."],
  ["Alla primtal är udda tal", false, "Motexempel: 2 är ett primtal och jämnt."],
  ["Ett tal som är delbart med 6 är alltid delbart med 3", true, "6 = 2 · 3, så allt som går att dela med 6 går också att dela med 3."],
  ["Ett tal som är delbart med 3 är alltid delbart med 6", false, "Motexempel: 9 är delbart med 3 men inte med 6."],
  ["Kvadraten av ett heltal är alltid större än talet självt", false, "Motexempel: 1 · 1 = 1, som inte är större än 1."],
  ["Summan av tre på varandra följande heltal är alltid delbar med 3", true, "n + (n+1) + (n+2) = 3n + 3 = 3(n + 1)."],
  ["Ett tal som slutar på 5 är alltid delbart med 10", false, "Motexempel: 15."],
  ["Ett jämnt tal multiplicerat med ett heltal blir alltid ett jämnt tal", true, "2a · b = 2(ab), som är jämnt."],
  ["Ett tal som är delbart med 4 är alltid jämnt", true, "4 = 2 · 2, så allt delbart med 4 är delbart med 2."],
];
const isPrime = (n: number) => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
const COND: [string, (n: number) => boolean, (n: number) => boolean][] = [
  ["Alla tal som slutar på 5 är delbara med 10", (n) => n % 10 === 5, (n) => n % 10 === 0],
  ["Alla tal som är delbara med 3 är delbara med 6", (n) => n % 3 === 0, (n) => n % 6 === 0],
  ["Alla primtal är udda", isPrime, (n) => n % 2 === 1],
  ["Alla jämna tal är delbara med 4", (n) => n % 2 === 0, (n) => n % 4 === 0],
  ["Alla tal som är delbara med 9 är delbara med 18", (n) => n % 9 === 0, (n) => n % 18 === 0],
];
const SOME: [string, string][] = [
  ["Summan av två primtal är ett jämnt tal", "ibland"], ["Ett tal som är delbart med 4 är jämnt", "alltid"], ["Ett jämnt tal är ett primtal", "ibland"],
  ["Kvadraten av ett heltal är negativ", "aldrig"], ["Summan av två jämna tal är ett udda tal", "aldrig"], ["Ett tal som är delbart med 5 slutar på 5", "ibland"], ["Ett tal som slutar på 0 är delbart med 10", "alltid"],
];

export const lesson5: Lesson = {
  id: "w13-l5", worldId: "w13", title: "Matematiska resonemang – påståenden, motexempel och argument", grades: "åk 4–6",
  summary: "Ett påstående kan prövas: ett motexempel motbevisar det, men många exempel bevisar inget. Ett allmänt argument gör det.",
  lgr: "Matematiska resonemang; motexempel; jämföra och bedöma resonemang",
  objectives: ["Avgöra om ett påstående är alltid, ibland eller aldrig sant.", "Hitta ett motexempel.", "Skilja ett exempel från ett argument som gäller för alla fall."],
  intro: "Att resonera matematiskt är att kunna *motivera* varför något är sant (eller falskt). Två viktiga verktyg: **motexempel** (ett enda exempel där påståendet misslyckas är nog för att visa att det är falskt) och **allmänna argument** (som gäller för *alla* tal, inte bara de du provat). Att prova fem exempel och alla stämmer är ingen bevisning.",
  theory: [
    { heading: "Ett motexempel räcker", body: "”Alla primtal är udda.” Prova 2: det är ett primtal och det är jämnt. Ett enda motexempel, 2, visar att påståendet är **falskt**." },
    { heading: "Många exempel bevisar inget", body: "”Summan av två jämna tal är jämn”: du provar $2 + 4$, $6 + 8$, $10 + 12$. Alla stämmer, men du har inte visat att det gäller för *alla* par. Alla jämna tal kan skrivas $2a$ och $2b$; summan är $2a + 2b = 2(a + b)$, som alltid är jämn. Det är ett **allmänt argument**." },
    { heading: "Alltid, ibland, aldrig", body: "”Summan av två primtal är jämn.” $3 + 5 = 8$ ✓, men $2 + 3 = 5$ ✗. Alltså **ibland**. ”Kvadraten av ett heltal är negativ”: aldrig, eftersom $n \\cdot n \\ge 0$." },
    { heading: "Se mönster i bilder", body: "Ett jämnt antal prickar kan ordnas i två lika kolumner. Ett udda antal får en prick över. Bilden visar *varför* tal är jämna eller udda.", visual: { type: "dotpattern", figures: [[3, 3], [3, 3, 1]] } },
  ],
  worked: [
    { title: "Motexempel", problem: "”Alla tal som är delbara med 3 är delbara med 6.” Sant?", steps: [{ text: "Hitta ett tal delbart med 3 men inte med 6: 9." }, { text: "9 ÷ 3 = 3 men 9 ÷ 6 = 1,5. Motexempel funnet: påståendet är falskt." }], why: "Ett motexempel räcker för att visa att ett ”alltid”-påstående är falskt.", alternative: "Lista tal delbara med 3: 3, 6, 9 – redan 3 är ett motexempel." },
    { title: "Allmänt argument", problem: "Visa att summan av två jämna tal är jämn.", steps: [{ text: "Skriv två jämna tal som 2a och 2b." }, { text: "Summan:", math: "2a + 2b = 2(a + b)" }, { text: "Det är 2 gånger ett heltal, alltså jämnt." }], why: "Argumentet gäller för alla jämna tal eftersom a och b kan vara vilka heltal som helst.", alternative: "Bild med prickar: två jämna högar bildar en jämn hög." },
  ],
  drawing: { task: "Rita prickar i två lika kolumner för 8 och för 9. Vad ser du? Hur visar bilden att summan av två jämna tal blir jämn?", tool: "grid" },
  pupils: [{ pupil: "Zeynep", said: "Jag provade 2 + 4, 6 + 8 och 10 + 12. Alla blev jämna, så summan av två jämna tal är alltid jämn. Då har jag bevisat det.", misconception: "Tror att några exempel är ett bevis.", response: "Berömma att hon provade – men fråga: ”Hur vet du att det gäller för 1 000 + 2 000, eller alla andra?” Visa att jämna tal är 2a och 2b och summan 2(a + b)." }],
  knowledge: [
    { id: "truth", skill: "w13-l5.claim", gen: (rng) => { const [c, ok, why] = rng.pick(CLAIMS); return mc(`tr-${c.slice(0, 20)}`, "w13-l5.claim", `Sant eller falskt? ”${c}.”`, ok ? "Sant" : "Falskt", [{ text: ok ? "Falskt" : "Sant" }], why, ["Pröva med små tal, leta efter ett motexempel."], rng); } },
    { id: "counter", skill: "w13-l5.counter", gen: (rng) => { const [claim, P, Q] = rng.pick(COND); const ctr: number[] = [], okP: number[] = [], other: number[] = []; for (let n = 1; n <= 60; n++) { if (P(n) && !Q(n)) ctr.push(n); else if (P(n) && Q(n)) okP.push(n); else other.push(n); }
      const c = rng.pick(ctr), w = rng.shuffle([...okP]).slice(0, 2).concat(rng.shuffle([...other]).slice(0, 1)); const uniq = [...new Set(w)].filter((x) => x !== c).slice(0, 3);
      return mc(`ce-${claim.slice(8, 24)}-${c}`, "w13-l5.counter", `Påstående: ”${claim}.” Vilket tal är ett motexempel?`, String(c), uniq.map((x) => ({ text: String(x) })), `${c} uppfyller första delen men inte andra delen, så påståendet gäller inte för ${c}.`, ["Ett motexempel uppfyller villkoret men inte slutsatsen."], rng); } },
    { id: "someNever", skill: "w13-l5.allsome", gen: (rng) => { const [s, ok] = rng.pick(SOME); return mc(`sn-${s.slice(0, 20)}`, "w13-l5.allsome", `Är påståendet alltid, ibland eller aldrig sant? ”${s}.”`, ok, ["alltid", "ibland", "aldrig"].filter((x) => x !== ok).map((text) => ({ text })), `Pröva olika fall: ${ok === "alltid" ? "det stämmer för alla" : ok === "aldrig" ? "det stämmer för inget" : "det stämmer för vissa men inte alla"}.`, ["Finns det både fall som stämmer och fall som inte stämmer?"], rng); } },
    { id: "proof", skill: "w13-l5.argument", gen: (rng) => mc("pf", "w13-l5.argument", "Vilket resonemang visar att summan av två jämna tal alltid är jämn?", "Jämna tal är 2a och 2b, och 2a + 2b = 2(a + b), som alltid är jämn", [{ text: "Jag provade 2 + 4, 6 + 8 och 10 + 12 och alla blev jämna", note: "Exempel visar inget om alla tal." }, { text: "Det är bara så – jämna tal är snälla" }, { text: "Jag provade 1 000 + 2 000, och det blev jämnt" }], "Ett allmänt argument gäller för alla tal; exempel gör det inte.", ["Gäller argumentet för alla tal?"], rng) },
    { id: "whyEnough", skill: "w13-l5.argument", gen: (rng) => mc("we", "w13-l5.argument", "Varför räcker ett motexempel för att visa att ett ”alltid”-påstående är falskt?", "Det visar att påståendet inte gäller i alla fall", [{ text: "För att man alltid har tur med exempel" }, { text: "För att fler exempel behövs för att vara säker" }, { text: "För att motexempel är tal som är jämna" }], "Påståendet säger att det gäller *alltid*; ett fall där det inte gäller motbevisar det.", ["Vad säger ordet ”alltid”?"], rng) },
  ],
  method: [
    { id: "counterSteps", skill: "w13-l5.counter", gen: (rng) => { const [claim, P, Q] = rng.pick(COND.slice(0, 2)), n = rng.int(5, 60); return multifield(`cs-${claim.slice(8, 20)}-${n}`, "w13-l5.counter", `Påstående: ”${claim}.” Pröva talet ${n}. Svara 1 för ja och 0 för nej.`, [{ label: claim.includes("5") ? `Slutar ${n} på 5?` : `Är ${n} delbart med 3?`, accept: [P(n) ? 1 : 0] }, { label: claim.includes("5") ? `Är ${n} delbart med 10?` : `Är ${n} delbart med 6?`, accept: [Q(n) ? 1 : 0] }, { label: `Är ${n} ett motexempel?`, accept: [P(n) && !Q(n) ? 1 : 0] }], `${n}: villkoret ${P(n) ? "uppfylls" : "uppfylls inte"}, slutsatsen ${Q(n) ? "stämmer" : "stämmer inte"}. Motexempel kräver att villkoret uppfylls men inte slutsatsen.`, ["Motexempel: villkor ja, slutsats nej."]); } },
  ],
  representation: [
    { id: "dotsParity", skill: "w13-l5.picture", gen: (rng) => { const k = rng.int(2, 6), odd = rng.chance(0.5); return withVisual(mc(`dp-${k}-${odd}`, "w13-l5.picture", "Är antalet prickar jämnt eller udda? Titta på hur de är ordnade.", odd ? "Udda" : "Jämnt", [{ text: odd ? "Jämnt" : "Udda" }], odd ? `Två lika kolumner (${2 * k}) och en prick över: ${2 * k + 1} är udda.` : `Två lika kolumner om ${k}: ${2 * k} är jämnt.`, ["Går de att ordna i två lika kolumner utan prick över?"], rng), { type: "dotpattern", figures: [odd ? [k, k, 1] : [k, k]] }); } },
    { id: "dotsTotal", skill: "w13-l5.picture", gen: (rng) => { const k = rng.int(2, 6), e = rng.int(0, 2); return withVisual(numeric(`dt-${k}-${e}`, "w13-l5.picture", "Hur många prickar är det totalt i bilden?", 2 * k + e, `${k} + ${k}${e ? ` + ${e}` : ""} = ${2 * k + e}.`, ["Räkna alla kolumner."]), { type: "dotpattern", figures: [e ? [k, k, e] : [k, k]] }); } },
  ],
  teacher: {
    title: "Några exempel är inget bevis",
    scenarios: ["Zeynep (åk 6) provar 2 + 4, 6 + 8 och 10 + 12. Alla summor blir jämna. Hon säger: ”Då har jag bevisat att summan av två jämna tal alltid är jämn.”"],
    prompt: "Förklara för Zeynep varför några exempel inte räcker som bevis, vad ett motexempel är, och visa med ett allmänt argument varför summan av två jämna tal alltid är jämn.",
    minChars: 200,
    rubric: { minConcepts: 4, concepts: [
      { id: "exempel", label: "exempel bevisar inte att det gäller för alla tal", any: ["alla tal", "inte alla", "bara några", "några exempel", "inte ett bevis", "räcker inte"] },
      { id: "motex", label: "motexempel räcker för att visa att något är falskt", any: ["motexempel", "ett enda", "ett fall", "falskt"] },
      { id: "2a", label: "jämna tal kan skrivas 2a och 2b", any: ["2a", "2 · a", "2·a", "2 gånger", "två gånger"] },
      { id: "summa", label: "summan 2(a + b) är jämn", any: ["2(a + b)", "2(a+b)", "2 · (a + b)", "jämn"] },
      { id: "allman", label: "argumentet gäller för alla jämna tal / allmänt", any: ["allmänt", "gäller för alla", "vilka jämna tal som helst", "alla jämna"] },
    ] },
    modelAnswer: "Zeynep, att du provade tre par och alla blev jämna är bra, men det visar bara att det stämmer för just de talen, inte för alla jämna tal. Ett motexempel, ett enda fall där det inte stämmer, räcker för att visa att något är falskt, men exempel som stämmer bevisar inte att det alltid gäller. Ett allmänt argument: alla jämna tal kan skrivas som 2a och 2b. Summan blir 2a + 2b = 2(a + b), alltså två gånger ett heltal, och därför är summan jämn. Det gäller för alla jämna tal.",
  },
};
