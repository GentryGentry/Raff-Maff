import type { Lesson } from "../types";
import { mc, numeric, multifield, withVisual, numberlineEx, exprEx } from "@/lib/engine/gen-helpers";
import type { Rng } from "@/lib/engine/rng";
import { lin } from "./part1";

const M = "−"; // minus sign
type Eq1 = { text: string; x: number; a: number; b: number; kind: "add" | "sub" | "mul" | "div" | "addFirst" };

function eq1(rng: Rng, kind?: Eq1["kind"]): Eq1 {
  const k = kind ?? rng.pick(["add", "sub", "mul", "div", "addFirst"] as const);
  if (k === "add") { const x = rng.int(2, 20), a = rng.int(2, 15); return { text: `x + ${a} = ${x + a}`, x, a, b: x + a, kind: k }; }
  if (k === "addFirst") { const x = rng.int(2, 20), a = rng.int(2, 15); return { text: `${a} + x = ${x + a}`, x, a, b: x + a, kind: "add" }; }
  if (k === "sub") { const x = rng.int(8, 30), a = rng.int(2, 7); return { text: `x ${M} ${a} = ${x - a}`, x, a, b: x - a, kind: k }; }
  if (k === "mul") { const x = rng.int(2, 12), a = rng.int(2, 9); return { text: `${a}x = ${a * x}`, x, a, b: a * x, kind: k }; }
  const b = rng.int(2, 9), a = rng.int(2, 6); return { text: `x ÷ ${a} = ${b}`, x: a * b, a, b, kind: "div" };
}
const opText = (e: Eq1) => ({ add: `Subtrahera ${e.a} från båda sidor`, sub: `Addera ${e.a} till båda sidor`, mul: `Dividera båda sidor med ${e.a}`, div: `Multiplicera båda sidor med ${e.a}`, addFirst: `Subtrahera ${e.a} från båda sidor` })[e.kind];

// ───────── Lektion 5: Enkla ekvationer ─────────
export const lesson5: Lesson = {
  id: "w9-l5", worldId: "w9", title: "Enkla ekvationer – balansmodellen", grades: "åk 4–6",
  summary: "Lös x + 7 = 15 genom att göra samma sak på båda sidor.",
  lgr: "Matematiska likheter och hur likhetstecknet används för att teckna enkla ekvationer; metoder, däribland algebraiska, för att lösa enkla ekvationer",
  objectives: ["Förklara en ekvation som en våg i balans med ett okänt tal.", "Lösa enkla ekvationer genom att göra samma sak på båda sidor.", "Kontrollera en lösning genom att sätta in den."],
  intro: "En **ekvation** är en likhet där ett tal är okänt: $x + 7 = 15$. Att *lösa* den betyder att hitta det $x$ som gör likheten sann. Metoden är balansvågens: **allt du gör på ena sidan måste du göra på den andra**, annars tippar vågen.",
  theory: [
    { heading: "Ekvation = våg i balans", body: "$x + 7 = 15$: en okänd klots $x$ och 7 kilo i vänster skål, 15 kilo i den högra. För att få reda på $x$ tar vi bort 7 från *båda* sidor – då är vågen kvar i balans.", visual: { type: "balance", left: "x + 7", right: "15", tilt: "level" } },
    { heading: "Gör motsatsen", body: "- $x + 7 = 15$: **subtrahera** 7 på båda sidor: $x = 8$.\n\n- $x - 4 = 9$: **addera** 4: $x = 13$.\n\n- $3x = 12$: **dividera** med 3: $x = 4$.\n\n- $x \\div 4 = 5$: **multiplicera** med 4: $x = 20$.\n\nDu använder den *omvända* räkneoperationen." },
    { heading: "Kontrollera", body: "Sätt alltid in svaret: $x = 8$ i $x + 7 = 15$ ger $8 + 7 = 15$. ✓ Det är hela beviset." },
    { heading: "Skriv så här", body: "Skriv en rad per steg och likhetstecken under varandra: $x + 7 = 15$, sedan $x = 15 - 7$, sedan $x = 8$ – eller visa operationen: $x + 7 - 7 = 15 - 7$." },
  ],
  worked: [
    { title: "x + 7 = 15", problem: "Lös x + 7 = 15.", steps: [{ text: "Subtrahera 7 från båda sidor.", math: "x + 7 - 7 = 15 - 7" }, { text: "Förenkla.", math: "x = 8" }, { text: "Kontroll:", math: "8 + 7 = 15" }], why: "Att ta bort 7 från båda sidor håller vågen i balans och lämnar x ensamt.", alternative: "Tänk: vilket tal plus 7 är 15? 8." },
    { title: "3x = 12", problem: "Lös 3x = 12.", steps: [{ text: "3x betyder 3 gånger x. Dividera båda sidor med 3.", math: "\\frac{3x}{3} = \\frac{12}{3}" }, { text: "Förenkla.", math: "x = 4" }, { text: "Kontroll:", math: "3 \\cdot 4 = 12" }], why: "Division är motsatsen till multiplikation.", alternative: "Tre lika tunga klossar väger 12: en kloss väger 4." },
  ],
  drawing: { task: "Rita en balansvåg för x + 5 = 12. Visa hur du tar bort 5 från båda skålarna. Vad väger x?", tool: "grid" },
  pupils: [{ pupil: "Edvin", said: "x + 7 = 15. Då lägger jag ihop: x = 15 + 7 = 22.", misconception: "Använder fel operation – lägger till i stället för att göra motsatsen.", response: "Be Edvin sätta in 22: 22 + 7 = 29, inte 15. Rita vågen: för att få bort 7 från vänster skål måste man ta *bort* 7." }],
  knowledge: [
    { id: "solve", skill: "w9-l5.solve", gen: (rng) => { const e = eq1(rng); return numeric(`sv-${e.text}`, "w9-l5.solve", `Lös ekvationen ${e.text}`, e.x, `${opText(e)}: x = ${e.x}. Kontroll: ${e.text.replace("x", String(e.x))}.`, [opText(e) + "."]); } },
    { id: "operation", skill: "w9-l5.operation", gen: (rng) => { const e = eq1(rng); const all = [opText({ ...e, kind: "add" }), opText({ ...e, kind: "sub" }), opText({ ...e, kind: "mul" }), opText({ ...e, kind: "div" })]; const right = opText(e); return mc(`op-${e.text}`, "w9-l5.operation", `Vilken räkning löser ${e.text}?`, right, all.filter((t) => t !== right).map((text) => ({ text })), `Gör motsatsen: ${right.toLowerCase()}.`, ["Vilken operation har ekvationen?"], rng); } },
    { id: "isSolution", skill: "w9-l5.check", gen: (rng) => { const e = eq1(rng); const ok = rng.chance(0.5); const v = ok ? e.x : e.x + rng.pick([-2, -1, 1, 2, 3]); const real = v === e.x; return mc(`is-${e.text}-${v}`, "w9-l5.check", `Är x = ${v} en lösning till ${e.text}?`, real ? "Ja" : "Nej", [{ text: real ? "Nej" : "Ja" }], `Sätt in x = ${v}: ${e.text.replace("x", String(v))}${real ? " stämmer" : " stämmer inte"}. Lösningen är x = ${e.x}.`, ["Sätt in talet i ekvationen."], rng); } },
    { id: "unknownFirst", skill: "w9-l5.solve", gen: (rng) => { const e = eq1(rng, "addFirst"); return numeric(`uf-${e.text}`, "w9-l5.solve", `Lös ekvationen ${e.text}`, e.x, `${e.b} − ${e.a} = ${e.x}.`, ["Vilket tal plus " + e.a + " är " + e.b + "?"]); } },
    { id: "sameBoth", skill: "w9-l5.concept", gen: (rng) => mc("sb", "w9-l5.concept", "Varför måste man göra samma sak på båda sidor av en ekvation?", "För att likheten ska fortsätta vara sann (vågen i balans)", [{ text: "För att det ser snyggare ut" }, { text: "För att man alltid ska räkna två gånger" }, { text: "Det behöver man inte – bara den sida med x spelar roll", note: "Då ändras ena sidans värde och likheten bryts." }], "Ändrar man bara ena sidan tippar vågen.", ["Tänk på en våg."], rng) },
  ],
  method: [
    { id: "stepsAdd", skill: "w9-l5.solve", gen: (rng) => { const e = eq1(rng, "add"); return multifield(`sa-${e.text}`, "w9-l5.solve", `Lös ${e.text} i steg.`, [{ label: `Höger sida när du subtraherar ${e.a}`, accept: [e.x] }, { label: "x =", accept: [e.x] }, { label: `Kontroll: ${e.x} + ${e.a} =`, accept: [e.b] }], `x = ${e.b} − ${e.a} = ${e.x}.`, []); } },
    { id: "stepsMul", skill: "w9-l5.solve", gen: (rng) => { const e = eq1(rng, rng.pick(["mul", "sub", "div"] as const)); const [l1, chk] = e.kind === "mul" ? [`Höger sida när du dividerar med ${e.a}`, `Kontroll: ${e.a} · ${e.x} =`] : e.kind === "sub" ? [`Höger sida när du adderar ${e.a}`, `Kontroll: ${e.x} ${M} ${e.a} =`] : [`Höger sida när du multiplicerar med ${e.a}`, `Kontroll: ${e.x} ÷ ${e.a} =`]; return multifield(`sm-${e.text}`, "w9-l5.solve", `Lös ${e.text} i steg.`, [{ label: l1, accept: [e.x] }, { label: "x =", accept: [e.x] }, { label: chk, accept: [e.b] }], `x = ${e.x}.`, []); } },
  ],
  representation: [
    { id: "balanceAdd", skill: "w9-l5.balance", gen: (rng) => { const x = rng.int(2, 15), a = rng.int(2, 12); return withVisual(numeric(`ba-${x}-${a}`, "w9-l5.balance", "Vågen är i balans. Hur mycket väger klossen x?", x, `x + ${a} = ${x + a}, så x = ${x}.`, ["Ta bort lika mycket från båda skålarna."]), { type: "balance", left: `x + ${a}`, right: `${x + a}`, tilt: "level" }); } },
    { id: "balanceMul", skill: "w9-l5.balance", gen: (rng) => { const k = rng.int(2, 5), x = rng.int(2, 9); return withVisual(numeric(`bm-${k}-${x}`, "w9-l5.balance", `Vågen är i balans med ${k} lika tunga klossar x. Hur mycket väger en kloss?`, x, `${k}x = ${k * x}, så x = ${x}.`, ["Dela lika."]), { type: "balance", left: Array(k).fill("x").join(" + "), right: `${k * x}`, tilt: "level" }); } },
  ],
  teacher: {
    title: "Fel operation",
    scenarios: ["Edvin (åk 5) löser x + 7 = 15 genom att räkna 15 + 7 = 22. \"Man lägger ihop talen.\""],
    prompt: "Förklara för Edvin med balansmodellen hur man löser x + 7 = 15, varför hans svar 22 är fel, och hur han kan kontrollera sitt svar.",
    minChars: 170,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "balans", label: "balansvåg / samma sak på båda sidor", any: ["balans", "våg", "båda sidor", "samma på båda", "samma sak"] },
        { id: "subtrahera", label: "att subtrahera 7 (motsatsen)", any: ["subtrahera 7", "ta bort 7", "minus 7", "15 − 7", "15 - 7", "motsatsen"] },
        { id: "svar", label: "rätt svar x = 8", any: ["8"] },
        { id: "kontroll", label: "kontroll: sätt in 8 (8 + 7 = 15) / 22 + 7 = 29", any: ["8 + 7", "22 + 7", "sätta in", "sätt in", "kontroll"] },
        { id: "fel", label: "att 22 ger 29, inte 15", any: ["29", "inte 15", "stämmer inte"] },
      ],
    },
    modelAnswer: "Edvin, tänk dig en våg med en okänd kloss x och 7 kilo i vänstra skålen, och 15 kilo i den högra. För att få x ensamt tar vi bort 7 från båda sidor så att vågen förblir i balans: x = 15 − 7 = 8. Du lade i stället till 7. Kontrollera genom att sätta in svaret: 22 + 7 = 29, men det ska bli 15, så 22 stämmer inte. 8 + 7 = 15 stämmer. Gör alltid motsatsen på båda sidor.",
  },
};

// ───────── Lektion 6: Ekvationer i flera steg ─────────
type Eq2 = { text: string; x: number; a: number; b: number; c: number; kind: "plus" | "minus" | "div" };
function eq2(rng: Rng, kind?: Eq2["kind"]): Eq2 {
  const k = kind ?? rng.pick(["plus", "minus", "div"] as const);
  if (k === "plus") { const x = rng.int(2, 12), a = rng.int(2, 6), b = rng.int(1, 15); return { text: `${a}x + ${b} = ${a * x + b}`, x, a, b, c: a * x + b, kind: k }; }
  if (k === "minus") { const a = rng.int(2, 6), x = rng.int(3, 12), b = rng.int(1, a * x - 1); return { text: `${a}x ${M} ${b} = ${a * x - b}`, x, a, b, c: a * x - b, kind: k }; }
  const a = rng.int(2, 5), q = rng.int(2, 9), b = rng.int(1, 9); return { text: `x ÷ ${a} + ${b} = ${q + b}`, x: a * q, a, b, c: q + b, kind: "div" };
}

export const lesson6: Lesson = {
  id: "w9-l6", worldId: "w9", title: "Ekvationer i flera steg", grades: "åk 4–6",
  summary: "2x + 3 = 11: ta bort det som är utanför först, dividera sedan.",
  lgr: "Metoder, däribland algebraiska, för att lösa enkla ekvationer",
  objectives: ["Lösa ekvationer som kräver två steg.", "Välja rätt ordning på stegen.", "Kontrollera lösningen."],
  intro: "$2x + 3 = 11$ har *två* saker som sker med $x$: det multipliceras med 2 och sedan läggs 3 till. För att lösa den ångrar vi dem i **omvänd ordning**: först ta bort 3, sedan dividera med 2. Som att ta av sig strumpor *efter* skorna.",
  theory: [
    { heading: "Ångra i omvänd ordning", body: "$2x + 3 = 11$. Först $+3$ (det sista som hände med $x$): subtrahera 3 på båda sidor: $2x = 8$. Sedan $\\cdot 2$: dividera med 2: $x = 4$.", visual: { type: "balance", left: "x + x + 3", right: "11", tilt: "level" } },
    { heading: "Med minus", body: "$3x - 5 = 16$: addera 5 på båda sidor: $3x = 21$. Dividera med 3: $x = 7$." },
    { heading: "Ordningen spelar roll", body: "Dividera du först med 2 måste du dividera *varje* term: $x + 1{,}5 = 5{,}5$. Det går, men svårare. Dividerar du bara högra sidan ($11 \\div 2$) och sedan tar bort 3 får du $2{,}5$ – fel." },
    { heading: "Kontrollera alltid", body: "$x = 4$ i $2x + 3$: $2 \\cdot 4 + 3 = 11$. ✓" },
  ],
  worked: [
    { title: "2x + 3 = 11", problem: "Lös 2x + 3 = 11.", steps: [{ text: "Subtrahera 3 från båda sidor.", math: "2x = 8" }, { text: "Dividera båda sidor med 2.", math: "x = 4" }, { text: "Kontroll:", math: "2 \\cdot 4 + 3 = 11" }], why: "Vi ångrar +3 först, sedan ·2.", alternative: "Tänk: vilket tal gånger 2 plus 3 är 11?" },
    { title: "3x − 5 = 16", problem: "Lös 3x − 5 = 16.", steps: [{ text: "Addera 5 till båda sidor.", math: "3x = 21" }, { text: "Dividera med 3.", math: "x = 7" }, { text: "Kontroll:", math: "3 \\cdot 7 - 5 = 16" }], why: "Minus 5 ångras med plus 5.", alternative: "Balansvåg: lägg 5 kg på båda skålarna." },
  ],
  drawing: { task: "Rita en våg för 2x + 4 = 14. Visa första steget (ta bort 4) och andra steget (dela i två lika delar).", tool: "grid" },
  pupils: [{ pupil: "Maja", said: "2x + 3 = 11: jag delar 11 med 2 och tar bort 3: 5,5 − 3 = 2,5.", misconception: "Dividerar bara högra sidan och i fel ordning.", response: "Be Maja sätta in 2,5: 2 · 2,5 + 3 = 8. Förklara att man först tar bort 3 från båda sidor och sedan delar hela ”2x”." },],
  knowledge: [
    { id: "solve", skill: "w9-l6.solve", gen: (rng, { level }) => { const e = eq2(rng); void level; return numeric(`s2-${e.text}`, "w9-l6.solve", `Lös ekvationen ${e.text}`, e.x, `${e.kind === "minus" ? "Addera" : "Subtrahera"} ${e.b}, sedan ${e.kind === "div" ? "multiplicera" : "dividera"} med ${e.a}: x = ${e.x}.`, ["Ångra i omvänd ordning."]); } },
    { id: "orderMc", skill: "w9-l6.order", gen: (rng) => { const e = eq2(rng, rng.pick(["plus", "minus"] as const)); const first = e.kind === "plus" ? `Subtrahera ${e.b} från båda sidor, sedan dividera med ${e.a}` : `Addera ${e.b} till båda sidor, sedan dividera med ${e.a}`; return mc(`or-${e.text}`, "w9-l6.order", `Hur löser du ${e.text}?`, first, [{ text: `Dividera bara högra sidan (${e.c}) med ${e.a}, och sedan ${e.kind === "plus" ? "ta bort" : "lägg till"} ${e.b}`, note: "Man måste göra samma sak på hela båda sidor." }, { text: `Multiplicera båda sidor med ${e.a}` }, { text: `Addera ${e.b} till båda sidor och subtrahera sedan ${e.a}` }], `Först ${e.kind === "plus" ? "−" : "+"}${e.b}: ${e.a}x = ${e.kind === "plus" ? e.c - e.b : e.c + e.b}. Sedan ÷ ${e.a}: x = ${e.x}.`, ["Det som hände sist ångras först."], rng); } },
    { id: "chooseValue", skill: "w9-l6.check", gen: (rng) => { const e = eq2(rng, rng.pick(["plus", "minus"] as const)); const wrongs = [e.kind === "plus" ? e.c - e.b : e.c + e.b, e.x + 1, e.x - 1, e.x + 2].filter((v) => v !== e.x && v > 0); return mc(`cv-${e.text}`, "w9-l6.check", `Vilket värde på x löser ${e.text}?`, String(e.x), [...new Set(wrongs)].slice(0, 3).map((v) => ({ text: String(v) })), `${e.text.replace("x", String(e.x))} stämmer.`, ["Sätt in alternativen."], rng); } },
    { id: "substitute", skill: "w9-l6.check", gen: (rng) => { const a = rng.int(2, 6), b = rng.int(1, 9), x = rng.int(2, 9); return numeric(`su-${a}-${b}-${x}`, "w9-l6.check", `Sätt in x = ${x} i ${a}x + ${b}. Vad får du?`, a * x + b, `${a} · ${x} + ${b} = ${a * x + b}.`, ["Multiplikation först."]); } },
    { id: "wordCheck", skill: "w9-l6.solve", gen: (rng) => { const e = eq2(rng, "plus"); return numeric(`wc-${e.text}`, "w9-l6.solve", `Jag tänker på ett tal x. Jag multiplicerar det med ${e.a} och lägger till ${e.b}. Resultatet blir ${e.c}. Vilket är x?`, e.x, `${e.a}x + ${e.b} = ${e.c}: x = ${e.x}.`, ["Skriv ekvationen först."]); } },
  ],
  method: [
    { id: "steps", skill: "w9-l6.solve", gen: (rng) => { const e = eq2(rng, rng.pick(["plus", "minus"] as const)); const mid = e.kind === "plus" ? e.c - e.b : e.c + e.b; return multifield(`st-${e.text}`, "w9-l6.solve", `Lös ${e.text} i steg.`, [{ label: `Efter att du ${e.kind === "plus" ? "subtraherat" : "adderat"} ${e.b}: ${e.a}x =`, accept: [mid] }, { label: "x =", accept: [e.x] }, { label: `Kontroll: ${e.a} · x ${e.kind === "plus" ? "+" : M} ${e.b} =`, accept: [e.c] }], `${e.a}x = ${mid}, x = ${e.x}.`, []); } },
    { id: "stepsDiv", skill: "w9-l6.solve", gen: (rng) => { const e = eq2(rng, "div"); return multifield(`sd-${e.text}`, "w9-l6.solve", `Lös ${e.text} i steg.`, [{ label: `Efter att du subtraherat ${e.b}: x ÷ ${e.a} =`, accept: [e.c - e.b] }, { label: "x =", accept: [e.x] }, { label: `Kontroll: ${e.x} ÷ ${e.a} + ${e.b} =`, accept: [e.c] }], `x = ${e.x}.`, []); } },
  ],
  representation: [
    { id: "balanceTwo", skill: "w9-l6.balance", gen: (rng) => { const a = rng.int(2, 4), x = rng.int(2, 9), b = rng.int(1, 9); return withVisual(numeric(`bt-${a}-${x}-${b}`, "w9-l6.balance", "Vågen är i balans (x är en kloss). Hur mycket väger x?", x, `${a}x + ${b} = ${a * x + b} ger x = ${x}.`, ["Ta först bort vikten."]), { type: "balance", left: `${Array(a).fill("x").join(" + ")} + ${b}`, right: `${a * x + b}`, tilt: "level" }); } },
    { id: "writeLeft", skill: "w9-l6.expression", gen: (rng) => { const a = rng.int(2, 4), b = rng.int(1, 9); return exprEx(`wl-${a}-${b}`, "w9-l6.expression", `Vågens vänstra skål har ${a} klossar x och en vikt på ${b}. Skriv ett uttryck för vänstra sidan.`, lin(a, b, "x"), `${a}x + ${b}.`, ["Klossarna först."], { variable: "x", visual: { type: "balance", left: `${Array(a).fill("x").join(" + ")} + ${b}`, right: "?", tilt: "level" } }); } },
  ],
  teacher: {
    title: "Rätt ordning",
    scenarios: ["Maja (åk 6) löser 2x + 3 = 11 genom att dela 11 med 2 och sedan dra bort 3. Hon får 2,5 och säger att svaret måste vara rätt \"för jag har ju gjort allt\"."],
    prompt: "Förklara för Maja hur du löser 2x + 3 = 11 steg för steg, varför hennes ordning blir fel, och hur hon själv kan upptäcka felet.",
    minChars: 170,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "forst", label: "att ta bort 3 först (från båda sidor)", any: ["ta bort 3", "subtrahera 3", "minus 3", "11 − 3", "11 - 3", "först"] },
        { id: "dela", label: "sedan dividera med 2 (2x = 8)", any: ["dividera med 2", "dela med 2", "2x = 8", "8 ÷ 2"] },
        { id: "svar", label: "rätt svar x = 4", any: ["x = 4", "4"] },
        { id: "kontroll", label: "kontroll: 2 · 2,5 + 3 = 8 / 2 · 4 + 3 = 11", any: ["2 · 4 + 3", "2·4+3", "2 · 2,5", "kontroll", "sätta in", "sätt in"] },
        { id: "bada", label: "samma sak på båda sidor / hela sidan", any: ["båda sidor", "hela", "samma sak", "bara högra"] },
      ],
    },
    modelAnswer: "Maja, i 2x + 3 = 11 sker två saker med x: det multipliceras med 2 och sedan läggs 3 till. Vi ångrar dem i omvänd ordning och gör samma sak på båda sidor. Först tar vi bort 3: 2x = 8. Sedan dividerar vi med 2: x = 4. Du delade bara högra sidan med 2, men vänster sida (2x + 3) delades inte på samma sätt. Kontrollera genom att sätta in: 2 · 2,5 + 3 = 8, inte 11, så 2,5 är fel. 2 · 4 + 3 = 11 stämmer.",
  },
};

// ───────── Lektion 7: Från text till ekvation ─────────
export const lesson7: Lesson = {
  id: "w9-l7", worldId: "w9", title: "Från text till ekvation", grades: "åk 4–6",
  summary: "Skriv en berättelse som en ekvation, lös den och kontrollera mot berättelsen.",
  lgr: "Matematiska likheter och hur likhetstecknet används för att teckna enkla ekvationer; variabler och deras användning i ekvationer; strategier för att lösa matematiska problem",
  objectives: ["Översätta en berättelse till en ekvation.", "Lösa ekvationen och tolka svaret i berättelsen.", "Kontrollera att svaret stämmer med texten."],
  intro: "Algebra är till för att lösa problem: ”Jag tänker på ett tal …”. Strategin är **tre steg**: 1) vad är okänt? Kalla det $x$. 2) Skriv en ekvation som berättar samma sak som texten. 3) Lös den och kontrollera *mot texten*, inte bara mot ekvationen.",
  theory: [
    { heading: "Tre steg", body: "1. **Okänd:** vad ska jag ta reda på? Kalla det $x$.\n\n2. **Ekvation:** skriv texten som en likhet.\n\n3. **Lös och kontrollera:** passar svaret berättelsen?", visual: { type: "balance", left: "x + 25", right: "80", tilt: "level" } },
    { heading: "Exempel", body: "”Anna har några kronor. Hon får 25 kr och har då 80 kr.” $x + 25 = 80$, så $x = 55$. Anna hade 55 kr från början." },
    { heading: "Två steg i berättelsen", body: "”3 biljetter och en glass för 15 kr kostar 75 kr.” $3x + 15 = 75$, så $3x = 60$ och $x = 20$. En biljett kostar 20 kr." },
    { heading: "Nyckelord kan lura", body: "”*Får*” betyder inte alltid plus i räkningen: i $x + 25 = 80$ räknar vi $80 - 25$. Tänk på **situationens struktur**, inte på ord." },
  ],
  worked: [
    { title: "Tänka ett tal", problem: "Jag tänker på ett tal. Jag multiplicerar det med 4 och lägger till 3. Resultatet är 27. Vilket tal tänker jag på?", steps: [{ text: "Okänt: x. Skriv ekvationen.", math: "4x + 3 = 27" }, { text: "Subtrahera 3, dividera med 4.", math: "4x = 24 \\Rightarrow x = 6" }, { text: "Kontroll mot texten: 6 · 4 + 3 = 27.", math: "27" }], why: "Ekvationen berättar samma sak som texten i matematikens språk.", alternative: "Räkna baklänges: 27 − 3 = 24, 24 ÷ 4 = 6." },
    { title: "Biljetter", problem: "3 biljetter och en glass som kostar 15 kr kostar tillsammans 75 kr. Vad kostar en biljett?", steps: [{ text: "Okänt: x = priset för en biljett.", math: "3x + 15 = 75" }, { text: "Lös.", math: "3x = 60 \\Rightarrow x = 20" }, { text: "Kontroll: 3 · 20 + 15 = 75.", math: "75" }], why: "Biljetterna är 3 · x och glassen en känd del.", alternative: "Hela priset minus glassen, delat på 3 biljetter." },
  ],
  drawing: { task: "Rita en våg för berättelsen: ”Anna har x kr, får 25 kr och har då 80 kr”. Skriv ekvationen och lös den.", tool: "grid" },
  pupils: [{ pupil: "Tilda", said: "Anna har x kr, får 25 kr och har då 80 kr. ’Får’ är plus, så x = 25 + 80 = 105.", misconception: "Följer nyckelordet ”får” = plus och lägger ihop talen utan att tänka på vad som är okänt.", response: "Låt Tilda skriva x + 25 = 80 och sätta in 105: 105 + 25 = 130. Rita en stapel: hela 80, delen 25, delen x." }],
  knowledge: [
    { id: "thinkNumber", skill: "w9-l7.story", gen: (rng) => { const x = rng.int(2, 15), a = rng.int(2, 6), b = rng.int(1, 12); return numeric(`tn-${x}-${a}-${b}`, "w9-l7.story", `Jag tänker på ett tal. Jag multiplicerar det med ${a} och lägger till ${b}. Resultatet är ${a * x + b}. Vilket tal tänker jag på?`, x, `${a}x + ${b} = ${a * x + b}: x = ${x}.`, ["Skriv ekvationen."]); } },
    { id: "money", skill: "w9-l7.story", gen: (rng) => { const x = rng.int(15, 90), b = rng.int(10, 40); return numeric(`mn-${x}-${b}`, "w9-l7.story", `Anna har några kronor. Hon får ${b} kr och har då ${x + b} kr. Hur många kronor hade hon från början?`, x, `x + ${b} = ${x + b}: x = ${x}. (”Får” betyder plus i berättelsen, men vi räknar minus.)`, ["Okänt: x. Skriv x + " + b + " = " + (x + b) + "."], "kr"); } },
    { id: "tickets", skill: "w9-l7.story", gen: (rng) => { const a = rng.int(2, 5), x = rng.int(8, 30), g = rng.int(5, 25); return numeric(`tk-${a}-${x}-${g}`, "w9-l7.story", `${a} biljetter och en glass som kostar ${g} kr kostar tillsammans ${a * x + g} kr. Vad kostar en biljett?`, x, `${a}x + ${g} = ${a * x + g}: x = ${x}.`, ["Biljetterna är a · x."], "kr"); } },
    { id: "equationMc", skill: "w9-l7.equation", gen: (rng) => { const v = rng.int(0, 2); if (v === 0) { const b = rng.int(10, 40), c = b + rng.int(15, 60); return mc(`em0-${b}-${c}`, "w9-l7.equation", `Anna har x kr, får ${b} kr och har då ${c} kr. Vilken ekvation beskriver det?`, `x + ${b} = ${c}`, [{ text: `x = ${b} + ${c}`, note: "Det är inte en ekvation om vad som hände." }, { text: `x ${M} ${b} = ${c}` }, { text: `${b}x = ${c}` }], `Hon hade x, fick ${b} och har ${c}: x + ${b} = ${c}.`, ["Vad hände, i den ordning det hände?"], rng); } if (v === 1) { const a = rng.int(2, 6), c = a * rng.int(8, 25); return mc(`em1-${a}-${c}`, "w9-l7.equation", `${a} biljetter à x kr kostar tillsammans ${c} kr. Vilken ekvation beskriver det?`, `${a}x = ${c}`, [{ text: `x + ${a} = ${c}` }, { text: `x = ${a} · ${c}` }, { text: `${a} + ${c} = x` }], `${a} gånger priset x är ${c}.`, ["Hur många gånger priset?"], rng); } const a = rng.int(2, 6), b = rng.int(3, 12); return mc(`em2-${a}-${b}`, "w9-l7.equation", `Ett tal x delas med ${a} och blir ${b}. Vilken ekvation beskriver det?`, `x ÷ ${a} = ${b}`, [{ text: `${a} ÷ x = ${b}` }, { text: `x ${M} ${a} = ${b}` }, { text: `${a}x = ${b}` }], `x delat med ${a} är ${b}.`, [], rng); } },
    { id: "checkText", skill: "w9-l7.check", gen: (rng) => { const a = rng.int(2, 5), x = rng.int(6, 20), g = rng.int(4, 18); const total = a * x + g; const wrong = total - g; return mc(`ct-${a}-${x}-${g}`, "w9-l7.check", `${a} biljetter och en glass à ${g} kr kostar ${total} kr. Eleven svarar att en biljett kostar ${wrong} kr. Stämmer det?`, `Nej – ${a} biljetter à ${wrong} kr blir ${a * wrong} kr, inte ${wrong} kr`, [{ text: "Ja – totalen minus glassen är priset för en biljett", note: "Det är priset för *alla* biljetter, inte en." }, { text: `Ja – ${total} − ${g} = ${wrong}` }], `Kontrollera mot texten: ${a} · ${x} + ${g} = ${total}; en biljett kostar ${x} kr.`, ["Kontrollera mot berättelsen."], rng); } },
  ],
  method: [
    { id: "ticketFields", skill: "w9-l7.story", gen: (rng) => { const a = rng.int(2, 5), x = rng.int(8, 30), g = rng.int(5, 25); return multifield(`tf-${a}-${x}-${g}`, "w9-l7.story", `${a} biljetter och en glass à ${g} kr kostar ${a * x + g} kr. Fyll i.`, [{ label: "Antal biljetter", accept: [a] }, { label: "Glassens pris (kr)", accept: [g] }, { label: "Totalt (kr)", accept: [a * x + g] }, { label: "Pris för en biljett (kr)", accept: [x] }], `${a}x + ${g} = ${a * x + g}: x = ${x}.`, ["Skriv ekvationen: antal · x + glass = totalt."]); } },
    { id: "thinkFields", skill: "w9-l7.story", gen: (rng) => { const x = rng.int(2, 12), a = rng.int(2, 6), b = rng.int(1, 12); return multifield(`tkf-${x}-${a}-${b}`, "w9-l7.story", `Jag tänker på ett tal x. ${a} gånger talet plus ${b} blir ${a * x + b}. Fyll i.`, [{ label: `Efter att ha tagit bort ${b}: ${a}x =`, accept: [a * x] }, { label: "x =", accept: [x] }, { label: `Kontroll: ${a} · x + ${b} =`, accept: [a * x + b] }], `x = ${x}.`, []); } },
  ],
  representation: [
    { id: "balanceStory", skill: "w9-l7.balance", gen: (rng) => { const x = rng.int(15, 60), b = rng.int(10, 35); return withVisual(numeric(`bs-${x}-${b}`, "w9-l7.balance", "Vågen visar berättelsen: Anna har x kr och får några kronor till. Hur mycket hade hon från början?", x, `x + ${b} = ${x + b}: x = ${x}.`, ["Ta bort " + b + " från båda sidor."], "kr"), { type: "balance", left: `x + ${b}`, right: `${x + b}`, tilt: "level" }); } },
    { id: "balanceMc", skill: "w9-l7.equation", gen: (rng) => { const a = rng.int(2, 4), b = rng.int(2, 9), x = rng.int(2, 9); const c = a * x + b; return withVisual(mc(`bm-${a}-${b}-${c}`, "w9-l7.equation", "Vågen visar en situation. Vilken ekvation beskriver den?", `${a}x + ${b} = ${c}`, [{ text: `x + ${a + b} = ${c}` }, { text: `${a}x = ${c + b}` }, { text: `x + ${b} = ${c}` }], `${a} klossar x och ${b} väger ${c}.`, ["Räkna klossarna."], rng), { type: "balance", left: `${Array(a).fill("x").join(" + ")} + ${b}`, right: `${c}`, tilt: "level" }); } },
  ],
  teacher: {
    title: "”Får” betyder inte alltid plus",
    scenarios: ["Tilda (åk 5) löser ”Anna har några kronor, får 25 kr och har då 80 kr. Hur mycket hade hon från början?” genom att räkna 25 + 80 = 105."],
    prompt: "Förklara för Tilda hur man gör en ekvation av berättelsen, varför hennes svar blir fel, och hur hon kontrollerar svaret mot texten.",
    minChars: 170,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "ekv", label: "ekvationen x + 25 = 80", any: ["x + 25 = 80", "x+25=80", "ekvation"] },
        { id: "svar", label: "rätt svar 55", any: ["55"] },
        { id: "nyckel", label: "att nyckelordet ”får” kan lura", any: ["nyckelord", "får betyder", "ordet får", "lura", "orden"] },
        { id: "kontroll", label: "kontroll mot texten (105 + 25 = 130 / 55 + 25 = 80)", any: ["55 + 25", "105 + 25", "130", "kontroll", "stämmer"] },
        { id: "okand", label: "att x är det okända (hennes start)", any: ["okända", "okänt", "från början", "x är", "kalla"] },
      ],
    },
    modelAnswer: "Tilda, kalla det Anna hade från början för x. Hon fick 25 kr och hade då 80 kr, så ekvationen är x + 25 = 80. Då är x = 80 − 25 = 55. Ordet ”får” lurade dig att addera 25 och 80, men det okända är en del av 80. Kontrollera mot texten: 105 + 25 = 130, så 105 stämmer inte. 55 + 25 = 80 stämmer. Tänk på vad som är okänt och i vilken ordning det hände, inte på nyckelord.",
  },
};

// ───────── Lektion 8: Algoritmer ─────────
const collatz = (n: number) => (n % 2 === 0 ? n / 2 : 3 * n + 1);

export const lesson8: Lesson = {
  id: "w9-l8", worldId: "w9", title: "Algoritmer – stegvisa instruktioner", grades: "åk 4–6",
  summary: "Följa, beskriva och rätta instruktioner med upprepning och villkor – grunden i programmering.",
  lgr: "Entydiga stegvisa instruktioner och hur de konstrueras, beskrivs och följs som grund för programmering; hur algoritmer skapas och används",
  objectives: ["Följa en algoritm med upprepning och villkor.", "Beskriva ett mönster som en algoritm.", "Hitta fel i en algoritm (t.ex. fel antal upprepningar)."],
  intro: "En **algoritm** är en exakt, stegvis instruktion som alltid ger samma resultat. Recept, vägbeskrivningar och datorprogram är algoritmer. Lgr22 lyfter fram att eleverna ska kunna följa och skapa dem – och det kräver samma precision som algebra: *exakt vad ska göras, och hur många gånger?*",
  theory: [
    { heading: "Steg i ordning", body: "En algoritm är steg i en bestämd ordning. ”Börja med 5. Addera 3. Dubbla.” ger $5 \\to 8 \\to 16$. Byter vi ordning blir resultatet ett annat: $5 \\to 10 \\to 13$." },
    { heading: "Upprepning", body: "”Börja med 2. **Upprepa 4 gånger:** addera 3.” Efter varje upprepning: $5, 8, 11, 14$. Slutvärdet är 14. Vi kan skriva det som $2 + 4 \\cdot 3$." },
    { heading: "Villkor", body: "”Om talet är jämnt: dela med 2. Annars: multiplicera med 3 och addera 1.” Börjar vi på 6 (jämnt) blir det 3. Börjar vi på 5 (udda) blir det 16.", visual: { type: "numberline", min: 0, max: 18, step: 1, marks: [5, 16], labelEvery: 2 } },
    { heading: "Fel att se upp för", body: "- **Fel antal upprepningar:** ”börja med 2 och skriv talet; upprepa 5 gånger: addera 3 och skriv” skriver **6** tal, inte 5.\n\n- Oklara steg: ”lägg till lite” är ingen algoritm.\n\n- Fel ordning. Testa algoritmen med ett litet exempel innan du litar på den." },
  ],
  worked: [
    { title: "Upprepning", problem: "Börja med 5. Upprepa 3 gånger: dubbla talet. Vilket tal får du?", steps: [{ text: "Efter varje upprepning:", math: "5 \\to 10 \\to 20 \\to 40" }, { text: "Svar:", math: "40" }], why: "Vi gör exakt det som står, i ordning, och räknar upprepningarna.", alternative: "$5 \\cdot 2 \\cdot 2 \\cdot 2 = 40$." },
    { title: "Villkor", problem: "Regel: jämnt tal → dela med 2, udda tal → multiplicera med 3 och addera 1. Börja med 6 och tillämpa regeln tre gånger.", steps: [{ text: "6 är jämnt.", math: "6 \\to 3" }, { text: "3 är udda.", math: "3 \\to 3 \\cdot 3 + 1 = 10" }, { text: "10 är jämnt.", math: "10 \\to 5" }], why: "Vi väljer vilket steg som gäller för varje tal.", alternative: "Skriv en tabell: steg, tal, jämnt/udda, resultat." },
  ],
  drawing: { task: "Rita ett flödesschema för: ”Börja med 100. Dra bort 15. Är talet fortfarande minst 30? Om ja: dra bort 15 igen. Om nej: sluta.” Vilket tal slutar du på?", tool: "grid" },
  pupils: [{ pupil: "Oskar", said: "Börja på 2 och skriv talet. Upprepa 5 gånger: addera 3 och skriv. Det blir 5 tal: 2, 5, 8, 11, 14.", misconception: "Glömmer att startvärdet också skrivs – räknar fel antal tal (stolpfel).", response: "Låt Oskar följa instruktionen steg för steg på papper: 2, 5, 8, 11, 14, 17. Det blir 6 tal – startvärdet plus 5 upprepningar." }],
  knowledge: [
    { id: "loopAdd", skill: "w9-l8.loop", gen: (rng) => { const s = rng.int(1, 20), d = rng.int(2, 9), k = rng.int(3, 7); return numeric(`la-${s}-${d}-${k}`, "w9-l8.loop", `Börja med ${s}. Upprepa ${k} gånger: addera ${d}. Vilket tal får du?`, s + k * d, `${s} + ${k} · ${d} = ${s + k * d}.`, ["Räkna upprepningarna noga."]); } },
    { id: "loopDouble", skill: "w9-l8.loop", gen: (rng) => { const s = rng.int(1, 5), k = rng.int(2, 5); return numeric(`ld-${s}-${k}`, "w9-l8.loop", `Börja med ${s}. Upprepa ${k} gånger: dubbla talet. Vilket tal får du?`, s * 2 ** k, `${s} · 2^${k} = ${s * 2 ** k}.`, ["Dubbla " + k + " gånger."]); } },
    { id: "condition", skill: "w9-l8.condition", gen: (rng) => { const n = rng.int(2, 25); return numeric(`cd-${n}`, "w9-l8.condition", `Regel: om talet är jämnt, dela med 2; annars multiplicera med 3 och addera 1. Börja med ${n} och tillämpa regeln en gång. Vilket tal får du?`, collatz(n), `${n} är ${n % 2 === 0 ? "jämnt" : "udda"}: ${collatz(n)}.`, ["Är talet jämnt eller udda?"]); } },
    { id: "condThree", skill: "w9-l8.condition", gen: (rng) => { const n = rng.int(3, 12); return numeric(`c3-${n}`, "w9-l8.condition", `Regel: om talet är jämnt, dela med 2; annars multiplicera med 3 och addera 1. Börja med ${n} och tillämpa regeln tre gånger. Vilket tal får du?`, collatz(collatz(collatz(n))), `${n} → ${collatz(n)} → ${collatz(collatz(n))} → ${collatz(collatz(collatz(n)))}.`, ["Ett steg i taget."]); } },
    { id: "until", skill: "w9-l8.until", gen: (rng) => { const N = rng.int(60, 120), d = rng.int(7, 16), m = rng.int(20, 35); let v = N, c = 0; while (v >= m) { v -= d; c++; } return numeric(`un-${N}-${d}-${m}`, "w9-l8.until", `Börja med ${N}. Dra bort ${d} så länge talet är minst ${m}. Hur många gånger drar du bort ${d}?`, c, `${N} → ${Array.from({ length: c }, (_, i) => N - (i + 1) * d).join(" → ")}.`, ["Kontrollera villkoret före varje steg."]); } },
    { id: "outputCount", skill: "w9-l8.count", gen: (rng) => { const s = rng.int(1, 9), d = rng.int(2, 6), k = rng.int(3, 7); return numeric(`oc-${s}-${d}-${k}`, "w9-l8.count", `Börja med ${s} och skriv talet. Upprepa ${k} gånger: addera ${d} och skriv talet. Hur många tal skriver du totalt?`, k + 1, `Startvärdet plus ${k} upprepningar: ${k + 1} tal.`, ["Glöm inte startvärdet."]); } },
    { id: "whichAlg", skill: "w9-l8.describe", gen: (rng) => { const dbl = rng.chance(0.4); if (dbl) { const a = rng.int(2, 5); return mc(`wa-d-${a}`, "w9-l8.describe", `Vilken algoritm ger talföljden ${a}, ${2 * a}, ${4 * a}, ${8 * a}, …?`, `Börja med ${a}. Dubbla talet varje steg.`, [{ text: `Börja med ${a}. Addera ${a} varje steg.` }, { text: `Börja med ${2 * a}. Dubbla talet varje steg.` }, { text: `Börja med ${a}. Addera 2 varje steg.` }], "Varje tal är dubbelt så stort som det förra.", ["Ökar den lika mycket varje gång?"], rng); } const a = rng.int(2, 9); let d = rng.int(3, 8); if (d === a) d += 1; const s = [a, a + d, a + 2 * d, a + 3 * d]; return mc(`wa-${a}-${d}`, "w9-l8.describe", `Vilken algoritm ger talföljden ${s.join(", ")}, …?`, `Börja med ${a}. Addera ${d} varje steg.`, [{ text: `Börja med ${d}. Addera ${a} varje steg.`, note: "Startvärdet och steget har bytt plats." }, { text: `Börja med ${a}. Multiplicera med ${d} varje steg.` }, { text: `Börja med ${a}. Addera ${a} varje steg.` }], `Första talet ${a}, skillnad ${d}.`, ["Vilket är startvärdet, vilket är steget?"], rng); } },
  ],
  method: [
    { id: "trace", skill: "w9-l8.trace", gen: (rng) => { const s = rng.int(2, 15), d = rng.int(2, 8); return multifield(`tr-${s}-${d}`, "w9-l8.trace", `Börja med ${s}. Upprepa 4 gånger: addera ${d}. Fyll i talet efter varje upprepning.`, [1, 2, 3, 4].map((i) => ({ label: `Efter upprepning ${i}`, accept: [s + i * d] })), `${[1, 2, 3, 4].map((i) => s + i * d).join(", ")}.`, []); } },
    { id: "condTrace", skill: "w9-l8.trace", gen: (rng) => { const n = rng.int(3, 11); const a = collatz(n), b = collatz(a), c = collatz(b); return multifield(`ct-${n}`, "w9-l8.trace", `Regel: jämnt → dela med 2, udda → ·3 + 1. Börja med ${n}. Fyll i talet efter varje steg.`, [{ label: "Efter steg 1", accept: [a] }, { label: "Efter steg 2", accept: [b] }, { label: "Efter steg 3", accept: [c] }], `${n} → ${a} → ${b} → ${c}.`, ["Jämnt eller udda?"]); } },
  ],
  representation: [
    { id: "markEnd", skill: "w9-l8.numberline", gen: (rng) => { const s = rng.int(1, 6), d = rng.int(2, 4), k = rng.int(3, 5); return numberlineEx(`me-${s}-${d}-${k}`, "w9-l8.numberline", `Börja vid ${s}. Upprepa ${k} gånger: hoppa ${d} åt höger. Markera var du hamnar.`, s + k * d, { min: 0, max: 30, step: 1, labelEvery: 5 }, `${s} + ${k} · ${d} = ${s + k * d}.`, ["Räkna hoppen."]); } },
    { id: "readJumps", skill: "w9-l8.numberline", gen: (rng) => { const s = rng.int(1, 6), d = rng.int(2, 6); return withVisual(numeric(`rj-${s}-${d}`, "w9-l8.numberline", "Markeringarna visar vad algoritmen skrev. Hur stort är varje hopp?", d, `Skillnaden mellan markeringarna är ${d}.`, ["Räkna steg mellan granntal."]), { type: "numberline", min: 0, max: 30, step: 1, marks: [s, s + d, s + 2 * d, s + 3 * d], labelEvery: 5 }); } },
  ],
  teacher: {
    title: "Hur många tal skrivs?",
    scenarios: ["Oskar (åk 5) skriver en algoritm: ”Börja på 2 och skriv talet. Upprepa 5 gånger: addera 3 och skriv.” Han säger att den skriver 5 tal."],
    prompt: "Förklara för Oskar hur man följer algoritmen steg för steg, hur många tal som skrivs, och hur man kan testa en algoritm för att hitta den här sortens fel.",
    minChars: 170,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "sex", label: "att det skrivs 6 tal", any: ["6 tal", "sex tal", "6 stycken", "sex"] },
        { id: "start", label: "att startvärdet också skrivs", any: ["startvärdet", "startvärde", "första talet", "börja med 2", "2 skrivs"] },
        { id: "lista", label: "talen 2, 5, 8, 11, 14, 17", any: ["17", "2, 5, 8, 11, 14"] },
        { id: "testa", label: "att testa/följa steg för steg på papper med litet exempel", any: ["testa", "steg för steg", "papper", "prova", "litet exempel", "följa"] },
        { id: "upprep", label: "att 5 upprepningar ger 5 tillägg", any: ["upprepning", "5 gånger", "fem gånger", "tillägg", "stolpe"] },
      ],
    },
    modelAnswer: "Oskar, följ algoritmen exakt på papper. Först skriver du startvärdet 2. Sedan upprepar du 5 gånger att addera 3 och skriva: 5, 8, 11, 14, 17. Totalt skrivs 6 tal: 2, 5, 8, 11, 14, 17 – startvärdet plus 5 upprepningar. Det är ett vanligt fel att glömma att startvärdet också skrivs. Bästa sättet att hitta sådana fel är att testa algoritmen steg för steg med ett litet exempel innan man litar på den.",
  },
};

// ───────── Lektion 9: Förenkla uttryck ─────────
export const lesson9: Lesson = {
  id: "w9-l9", worldId: "w9", title: "Förenkla uttryck", grades: "åk 4–6 (fördjupning)",
  summary: "Samla lika termer: 3n + 2n = 5n – men 3n + 2 kan inte slås ihop.",
  lgr: "Variabler och deras användning i enkla algebraiska uttryck; metoder, däribland algebraiska, för att lösa enkla ekvationer. Obs: att förenkla uttryck är en vardagsnära fördjupning av detta.",
  objectives: ["Förenkla uttryck genom att samla lika termer.", "Skilja mellan termer som kan och inte kan slås ihop.", "Använda parenteser: k(n + m) = kn + km."],
  intro: "$3n + 2n$ är fem n – men $3n + 2$ är inte $5n$. Skillnaden är den mellan **lika och olika termer**: tre äpplen plus två äpplen är fem äpplen, men tre äpplen plus två päron är inte fem av något. Och som alltid: **testa med ett tal** när du är osäker.",
  theory: [
    { heading: "Lika termer", body: "$3n + 2n = 5n$: tre n och två n är fem n. Siffrorna framför n läggs ihop. $5n - 2n = 3n$." },
    { heading: "Olika termer", body: "$3n + 2$ går inte att förenkla. $3n$ är ”n-saker” och $2$ är ett vanligt tal. Testa med $n = 2$: $3n + 2 = 8$, men $5n = 10$ – olika!" },
    { heading: "Samla lika termer", body: "$4n + 3 + 2n + 5 = (4n + 2n) + (3 + 5) = 6n + 8$. Samla n-termer för sig och talen för sig." },
    { heading: "Parenteser", body: "$2(n + 3)$ betyder 2 grupper om $(n + 3)$: $2n + 6$. Multiplicera *varje* term i parentesen med 2. Vanligt fel: $2n + 3$ (glömmer att gånga 3).", visual: { type: "balance", left: "2(n + 3)", right: "2n + 6", tilt: "level" } },
  ],
  worked: [
    { title: "Samla lika termer", problem: "Förenkla 4n + 3 + 2n + 5.", steps: [{ text: "Samla n-termerna och talen.", math: "(4n + 2n) + (3 + 5)" }, { text: "Räkna.", math: "6n + 8" }, { text: "Kontroll med n = 2: 4·2+3+2·2+5 = 20 och 6·2+8 = 20.", math: "20 = 20" }], why: "Termer av samma sort kan läggas ihop – som äpplen med äpplen.", alternative: "Rita rutor för n och enskilda rutor för talen." },
    { title: "Parentes", problem: "Förenkla 2(n + 3).", steps: [{ text: "Multiplicera varje term med 2.", math: "2 \\cdot n + 2 \\cdot 3" }, { text: "Resultat:", math: "2n + 6" }, { text: "Kontroll med n = 4: 2·7 = 14 och 2·4+6 = 14.", math: "14 = 14" }], why: "2 grupper om (n + 3) är 2 grupper om n plus 2 grupper om 3.", alternative: "Areamodell: rektangel 2 × (n + 3)." },
  ],
  drawing: { task: "Rita en rektangel med höjd 2 och bredd n + 3 (dela bredden i n och 3). Skriv areorna och visa att 2(n + 3) = 2n + 6.", tool: "area" },
  pupils: [{ pupil: "Vera", said: "3x + 2 = 5x. Man lägger ihop 3 och 2, och x finns ju kvar.", misconception: "Slår ihop termer som inte är lika (3x och 2).", response: "Testa med x = 2: 3·2 + 2 = 8 men 5·2 = 10. Använd äpplen och päron: 3 äpplen + 2 päron är inte 5 äpplen." }],
  knowledge: [
    { id: "collect", skill: "w9-l9.collect", gen: (rng) => { const p = rng.int(2, 9), q = rng.int(2, 9); return exprEx(`co-${p}-${q}`, "w9-l9.collect", `Förenkla ${p}n + ${q}n`, lin(p + q, 0), `${p}n + ${q}n = ${p + q}n.`, ["Lägg ihop siffrorna framför n."], { simplified: true }); } },
    { id: "mixed", skill: "w9-l9.collect", gen: (rng) => { const a = rng.int(2, 8), b = rng.int(1, 9), c = rng.int(2, 8), d = rng.pick([0, 1, 2, 3]); return exprEx(`mx-${a}-${b}-${c}`, "w9-l9.collect", `Förenkla ${a}n + ${b} + ${c}n${d ? ` + ${d}` : ""}`, lin(a + c, b + d), `n-termer: ${a + c}n. Tal: ${b + d}.`, ["Samla n-termer och tal var för sig."], { simplified: true }); } },
    { id: "minus", skill: "w9-l9.collect", gen: (rng) => { const b = rng.int(2, 5), a = b + rng.int(1, 5), c = rng.int(1, 9); return exprEx(`mn-${a}-${b}-${c}`, "w9-l9.collect", `Förenkla ${a}n ${M} ${b}n + ${c}`, lin(a - b, c), `${a}n − ${b}n = ${a - b}n, plus ${c}.`, []); } },
    { id: "distribute", skill: "w9-l9.parentheses", gen: (rng) => { const k = rng.int(2, 6), m = rng.int(2, 9); return exprEx(`ds-${k}-${m}`, "w9-l9.parentheses", `Förenkla ${k}(n + ${m}) – skriv utan parentes.`, lin(k, k * m), `${k} · n + ${k} · ${m} = ${k}n + ${k * m}.`, ["Multiplicera varje term i parentesen."], { simplified: true }); } },
    { id: "distMc", skill: "w9-l9.parentheses", gen: (rng) => { const k = rng.int(2, 6), m = rng.int(2, 9); return mc(`dm-${k}-${m}`, "w9-l9.parentheses", `Vilket uttryck är lika med ${k}(n + ${m})?`, `${k}n + ${k * m}`, [{ text: `${k}n + ${m}`, note: "Du har glömt att multiplicera även " + m + " med " + k + "." }, { text: `n + ${k * m}` }, { text: `${k + m}n` }], `${k}(n + ${m}) = ${k}n + ${k * m}.`, ["Alla termer i parentesen."], rng); } },
    { id: "unlike", skill: "w9-l9.unlike", gen: (rng) => { const a = rng.int(2, 6), b = rng.int(2, 6); return mc(`ul-${a}-${b}`, "w9-l9.unlike", `Kan ${a}n + ${b} förenklas till ${a + b}n?`, `Nej – ${a}n och ${b} är olika slags termer`, [{ text: "Ja – man lägger ihop siffrorna" }, { text: "Ja, om n är jämnt" }], `Testa med n = 2: ${a}·2 + ${b} = ${2 * a + b}, men ${a + b}·2 = ${2 * (a + b)}.`, ["Testa med ett tal."], rng); } },
    { id: "substitute", skill: "w9-l9.check", gen: (rng) => { const p = rng.int(2, 8), q = rng.int(2, 8), n = rng.int(2, 9); return numeric(`sb-${p}-${q}-${n}`, "w9-l9.check", `Vad är värdet av ${p}n + ${q}n när n = ${n}?`, (p + q) * n, `${p}·${n} + ${q}·${n} = ${(p + q) * n} = ${p + q}·${n}.`, ["Sätt in talet."]); } },
  ],
  method: [
    { id: "collectFields", skill: "w9-l9.collect", gen: (rng) => { const a = rng.int(2, 7), b = rng.int(1, 9), c = rng.int(2, 7), d = rng.int(1, 9); return multifield(`cf-${a}-${b}-${c}-${d}`, "w9-l9.collect", `Förenkla ${a}n + ${b} + ${c}n + ${d}. Fyll i.`, [{ label: `Antal n (${a} + ${c})`, accept: [a + c] }, { label: `Tal (${b} + ${d})`, accept: [b + d] }, { label: `Kontroll för n = 2: ${a}·2+${b}+${c}·2+${d} =`, accept: [2 * (a + c) + b + d] }], `${a + c}n + ${b + d}.`, ["Lika termer för sig."]); } },
    { id: "exprSimplify", skill: "w9-l9.collect", gen: (rng) => { const a = rng.int(2, 8), b = rng.int(1, 9), c = rng.int(1, 6); return exprEx(`es-${a}-${b}-${c}`, "w9-l9.collect", `Förenkla ${a}n + ${b} + ${c}n`, lin(a + c, b), `${a + c}n + ${b}.`, [], { simplified: true }); } },
  ],
  representation: [
    { id: "boxes", skill: "w9-l9.story", gen: (rng) => { const p = rng.int(2, 6), q = rng.int(2, 6); return exprEx(`bx-${p}-${q}`, "w9-l9.story", `Du har ${p} lådor som väger n kg var och ${q} lådor till som också väger n kg var. Skriv den totala vikten så enkelt som möjligt.`, lin(p + q, 0), `${p}n + ${q}n = ${p + q}n.`, [], { simplified: true }); } },
    { id: "shirts", skill: "w9-l9.story", gen: (rng) => { const k = rng.int(2, 5), m = rng.int(5, 20); return exprEx(`sh-${k}-${m}`, "w9-l9.story", `En tröja kostar n kr. Du köper ${k} tröjor och betalar ${m} kr i frakt. Sedan köper du 2 tröjor till (ingen ny frakt). Skriv totalpriset så enkelt som möjligt.`, lin(k + 2, m), `${k}n + ${m} + 2n = ${k + 2}n + ${m}.`, ["Samla tröjorna."], { simplified: true }); } },
  ],
  teacher: {
    title: "3x + 2 är inte 5x",
    scenarios: ["Vera (åk 6) förenklar 3x + 2 till 5x: \"Man lägger ihop 3 och 2, och x finns kvar.\""],
    prompt: "Förklara för Vera varför 3x + 2 inte är 5x, hur hon själv kan testa det, och vad som är rätt att göra med 3x + 2x.",
    minChars: 170,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "olika", label: "att 3x och 2 är olika slags termer", any: ["olika slags", "olika sorters", "olika sorts", "olika termer", "inte lika", "äpplen", "päron"] },
        { id: "test", label: "testa med ett tal (t.ex. x = 2: 8 mot 10)", any: ["x = 2", "testa", "sätta in", "sätt in", "prova", "8", "10"] },
        { id: "femx", label: "att 3x + 2x = 5x", any: ["3x + 2x", "5x"] },
        { id: "lika", label: "lika termer kan läggas ihop", any: ["lika termer", "samma sorts", "samma slags", "lägga ihop"] },
        { id: "forklara", label: "en förklaring (x är ett tal, 3 x:n och 2 x:n är 5 x:n)", any: ["3 x", "tre x", "fem x", "x är ett tal", "x:n"] },
      ],
    },
    modelAnswer: "Vera, 3x och 2 är olika slags termer, som tre äpplen och två päron – de kan inte läggas ihop till fem av något. Testa med ett tal: om x = 2 är 3x + 2 = 8, men 5x = 10. De är alltså inte lika. Lika termer kan däremot läggas ihop: 3x + 2x är tre x och två x, alltså fem x, så 3x + 2x = 5x. Förenkla genom att samla lika termer, och testa alltid med ett tal om du är osäker.",
  },
};
