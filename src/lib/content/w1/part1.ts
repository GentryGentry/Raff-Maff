import type { Lesson } from "../types";
import { mc, numeric, multifield, textTask, placeParts, sv, tex, withVisual, numberlineEx, digitsNoZero } from "@/lib/engine/gen-helpers";

const NAMES = ["ental", "tiotal", "hundratal", "tusental"] as const;
const digitsOf = (n: number) => String(n).split("").map(Number);

// ───────────────────────── Lektion 1 ─────────────────────────
const l1id = "w1-l1";
export const lesson1: Lesson = {
  id: l1id, worldId: "w1", title: "Positionssystemet", grades: "åk 4–6",
  summary: "Hur en siffras plats bestämmer dess värde.",
  lgr: "Taluppfattning: positionssystemet för naturliga tal",
  objectives: [
    "Förklara att en siffras värde beror på dess position.",
    "Ange värdet av en siffra och antalet ental, tiotal, hundratal och tusental i ett tal.",
    "Förklara nollans roll som platshållare.",
  ],
  intro:
    "Vi använder bara tio siffror, 0 till 9, men kan skriva hur stora tal som helst. Hemligheten är att **platsen avgör värdet**. I 3 och i 30 finns samma siffra, men i 30 står den en plats längre åt vänster och är värd tio gånger mer. I den här lektionen bygger du den förståelse som allt annat i matematiken vilar på – och som dina elever ofta saknar.",
  theory: [
    {
      heading: "Tio siffror, oändligt många tal",
      body: "Vårt talsystem kallas **tiosystemet** (decimalsystemet) eftersom varje plats är **tio gånger mer värd** än platsen till höger om den.\n\nFrån höger: ental ($1$), tiotal ($10$), hundratal ($100$), tusental ($1\\,000$). I talet $4\\,305$ betyder siffran 4 alltså fyra tusen, 3 betyder tre hundra, 0 betyder noll tiotal och 5 betyder fem ental.",
      visual: { type: "placevalue", value: 4305 },
    },
    {
      heading: "Nollan är en platshållare",
      body: "Talet $4\\,305$ har **inga tiotal**. Nollan behövs för att visa det. Utan den skulle vi skriva $435$ – ett helt annat tal. Nollan har värdet noll, men den håller kvar platsen så att de andra siffrorna hamnar rätt.",
      visual: { type: "baseten", value: 1205 },
    },
    {
      heading: "Att läsa och skriva tal",
      body: "Vi läser talet från vänster: $4\\,305$ = fyra tusen tre hundra fem. Vi säger inte \"noll tiotal\" högt, men vi måste tänka det. Ett vanligt elevfel är att skriva tal precis som man hör dem: \"tvåhundratre\" blir då 2003 (två-hundra-tre i rad) i stället för 203.",
    },
  ],
  worked: [
    {
      title: "Värdet av en siffra",
      problem: "Vilket värde har siffran 7 i talet 5 724?",
      steps: [
        { text: "Sätt talet i en platsvärdestabell.", math: "5\\,724 \\to 5\\ \\text{(tusental)},\\ 7\\ \\text{(hundratal)},\\ 2\\ \\text{(tiotal)},\\ 4\\ \\text{(ental)}" },
        { text: "Siffran 7 står på hundratalsplatsen. Det betyder 7 hundratal.", math: "7 \\cdot 100" },
        { text: "Värdet är alltså:", math: "700" },
      ],
      why: "En siffras värde är siffran gånger platsens värde. Platsen är det som skiljer 7 från 700 och 70.",
      alternative: "Du kan också läsa talet högt: femtusen-sjuhundra-tjugofyra. Ordet \"sjuhundra\" visar direkt att 7 är på hundratalsplatsen.",
    },
    {
      title: "Skriva tal från delar",
      problem: "Skriv talet som består av 2 tusental, 0 hundratal, 4 tiotal och 8 ental.",
      steps: [
        { text: "Ordna delarna från största plats till minsta.", math: "\\text{tusental},\\ \\text{hundratal},\\ \\text{tiotal},\\ \\text{ental}" },
        { text: "Skriv en siffra per plats – även noll där platsen är tom.", math: "2\\quad 0\\quad 4\\quad 8" },
        { text: "Talet är:", math: "2\\,048" },
      ],
      why: "Varje plats måste ha en siffra. Om vi hoppar över nollan hamnar 4 och 8 fel och talet blir 248.",
    },
  ],
  drawing: { task: "Rita en platsvärdestabell med fyra kolumner (T, H, T, E) och placera siffrorna i talet 3 071. Rita sedan så många basblock du behöver.", tool: "grid" },
  pupils: [
    { pupil: "Omar", said: "Tvåhundratre skriver jag 2003, för jag hör två, hundra, tre.", misconception: "Skriver talet som det låter (konkatenering) i stället för att tänka platsvärde.", response: "Låt Omar lägga talet i en tabell: 2 hundratal, 0 tiotal, 3 ental. Fråga: \"Hur många platser har talet?\" Jämför med 2003 som har fyra platser." },
    { pupil: "Linnea", said: "Nollan är ju ingenting, så den kan man skippa.", misconception: "Ser noll som \"ingenting\" i stället för platshållare.", response: "Jämför 305 och 35 med basblock. Be Linnea visa hur många block varje tal är. Poängen: nollan betyder \"inga tiotal\" och håller kvar platserna." },
  ],
  knowledge: [
    {
      id: "valueOfDigit", skill: "w1-l1.digit-value",
      gen: (rng, { level }) => {
        const len = level >= 2 ? 5 : 4;
        const n = digitsNoZero(rng, len, false);
        const ds = digitsOf(n);
        const pos = rng.int(0, len - 1); // from left
        const place = len - 1 - pos;
        const val = ds[pos] * 10 ** place;
        const wrong = [
          { text: sv(ds[pos]), note: "Du har bara angett siffran – inte dess värde på platsen." },
          { text: sv(ds[pos] * 10 ** Math.max(0, place - 1)), note: "Kolla vilken plats siffran står på igen." },
          { text: sv(ds[pos] * 10 ** (place + 1)), note: "Kolla vilken plats siffran står på igen." },
          { text: sv(ds[pos] * 10 ** Math.min(len, place + 2)) },
        ];
        return mc(`vod-${n}-${pos}`, "w1-l1.digit-value", `Vilket värde har siffran ${ds[pos]} (den ${pos + 1}:a siffran från vänster) i talet ${sv(n)}?`, sv(val), wrong,
          `Siffran står på ${10 ** place === 1 ? "entalsplatsen" : `${sv(10 ** place)}-platsen`}. Värdet är ${ds[pos]} · ${sv(10 ** place)} = ${sv(val)}.`,
          ["Vilken plats står siffran på – ental, tiotal, hundratal, tusental …?", "Värdet = siffran · platsens värde."], rng);
      },
    },
    {
      id: "howManyTens", skill: "w1-l1.count-units",
      gen: (rng) => {
        const n = rng.int(1200, 9899);
        return numeric(`hmt-${n}`, "w1-l1.count-units", `Hur många hela tiotal finns i talet ${sv(n)}?`, Math.floor(n / 10),
          `${sv(n)} = ${Math.floor(n / 10)} tiotal och ${n % 10} ental. Man får antalet hela tiotal genom att ta bort entalssiffran.`,
          ["Stryk entalssiffran – det som blir kvar är antalet tiotal.", "100 tiotal är lika med 1 000."]);
      },
    },
    {
      id: "writeNumber", skill: "w1-l1.write-number",
      gen: (rng) => {
        const t = rng.int(1, 9), h = rng.chance(0.5) ? 0 : rng.int(1, 9), te = rng.int(1, 9), e = rng.chance(0.3) ? 0 : rng.int(1, 9);
        const n = t * 1000 + h * 100 + te * 10 + e;
        const parts = `${t} tusental, ${h} hundratal, ${te} tiotal och ${e} ental`;
        const wrongs = [
          { text: sv(Number(`${t}${te}${e}`)), note: "Du har hoppat över en plats. Varje plats måste ha en siffra." },
          { text: sv(Number(`${t}${e}${te}${h}`)), note: "Siffrorna hamnade på fel plats." },
          { text: sv(Number(`${t}${h}${te}`) * 10 + (e + 1) % 10) },
          { text: sv(Number(`${e}${te}${h}${t}`)), note: "Du skrev talet baklänges." },
        ];
        return mc(`wn-${n}`, "w1-l1.write-number", `Vilket tal består av ${parts}?`, sv(n), wrongs,
          `Skriv en siffra per plats: ${t} ${h} ${te} ${e} → ${sv(n)}.`, ["Börja med tusentalen. Varje plats ska ha en siffra, även 0."], rng);
      },
    },
    {
      id: "whichDigit", skill: "w1-l1.digit-place",
      gen: (rng) => {
        const n = digitsNoZero(rng, 4);
        const placeIdx = rng.int(0, 3);
        return numeric(`wd-${n}-${placeIdx}`, "w1-l1.digit-place", `Vilken siffra står på ${NAMES[placeIdx]}splatsen i talet ${sv(n)}?`, digitsOf(n)[3 - placeIdx],
          `Platserna från höger: ental, tiotal, hundratal, tusental. På ${NAMES[placeIdx]}splatsen står siffran ${digitsOf(n)[3 - placeIdx]}.`,
          ["Räkna platserna från höger: ental, tiotal, hundratal, tusental."]);
      },
    },
  ],
  method: [
    {
      id: "placeTable", skill: "w1-l1.table",
      gen: (rng) => {
        const n = digitsNoZero(rng, 4);
        const ds = digitsOf(n);
        return multifield(`pt-${n}`, "w1-l1.table", `Skriv ${sv(n)} i en platsvärdestabell: vilken siffra står på varje plats?`,
          [{ label: "Tusental", accept: [ds[0]] }, { label: "Hundratal", accept: [ds[1]] }, { label: "Tiotal", accept: [ds[2]] }, { label: "Ental", accept: [ds[3]] }],
          `Talet ${sv(n)} läses av platserna från vänster: ${ds.join(", ")}.`, ["Börja längst till vänster med tusentalen."]);
      },
    },
    {
      id: "wordsToNumber", skill: "w1-l1.words",
      gen: (rng) => {
        const parts = [rng.int(1, 9), rng.int(0, 9), rng.int(0, 9), rng.int(1, 9)];
        const n = Number(parts.join(""));
        return multifield(`w2n-${n}`, "w1-l1.words", `Talet ${sv(n)}: skriv hur många av varje enhet som talet innehåller (hela tusental, hundratal, tiotal och ental i respektive plats).`,
          [{ label: "Tusental", accept: [parts[0]] }, { label: "Hundratal", accept: [parts[1]] }, { label: "Tiotal", accept: [parts[2]] }, { label: "Ental", accept: [parts[3]] }],
          `${sv(n)} = ${parts[0]} tusental + ${parts[1]} hundratal + ${parts[2]} tiotal + ${parts[3]} ental.`, ["Skriv 0 om en plats är tom."]);
      },
    },
  ],
  representation: [
    {
      id: "baseTenCount", skill: "w1-l1.baseten",
      gen: (rng) => {
        const h = rng.int(1, 4), t = rng.int(0, 7), e = rng.int(1, 9);
        const n = h * 100 + t * 10 + e;
        return withVisual(multifield(`bt-${n}`, "w1-l1.baseten", `Bilden visar ett tal med basblock. Hur många platter (100), stavar (10) och kuber (1) är det, och vilket tal visar bilden?`,
          [{ label: "Platter (100)", accept: [h] }, { label: "Stavar (10)", accept: [t] }, { label: "Kuber (1)", accept: [e] }, { label: "Talet", accept: [n] }],
          `${h} platter = ${h * 100}, ${t} stavar = ${t * 10}, ${e} kuber = ${e}. Tillsammans ${n}.`, ["Räkna varje sorts block för sig."]), { type: "baseten", value: n });
      },
    },
    {
      id: "numberlineThousands", skill: "w1-l1.numberline",
      gen: (rng) => {
        const base = rng.int(1, 8) * 1000;
        const v = base + rng.int(1, 9) * 100;
        return numberlineEx(`nlt-${v}`, "w1-l1.numberline", `Markera ${sv(v)} på tallinjen.`, v,
          { min: base, max: base + 1000, step: 100, labelEvery: 500 },
          `Tallinjen går från ${sv(base)} till ${sv(base + 1000)} i steg om 100. ${sv(v)} ligger ${(v - base) / 100} steg från ${sv(base)}.`, ["Varje streck är 100. Börja räkna från vänster."]);
      },
    },
  ],
  teacher: {
    title: "Nollan som platshållare",
    scenarios: [
      "Linnea (åk 4) skriver 305 som 35 och säger: \"Nollan är ju ingenting, den kan man skippa.\"",
      "Omar (åk 4) ska skriva tvåhundratre med siffror och skriver 2003. Han säger: \"Jag skrev det jag hörde: två, hundra, tre.\"",
    ],
    prompt: "Förklara för eleven med egna ord varför nollan behövs i talet och vad som händer med talets värde om den tas bort. Använd ett konkret exempel eller en modell (t.ex. basblock eller en platsvärdestabell).",
    minChars: 140,
    rubric: {
      minConcepts: 3,
      concepts: [
        { id: "plats", label: "att siffrans plats/position avgör värdet", any: ["plats", "position", "platsvärde"] },
        { id: "platshallare", label: "att nollan håller platsen / visar att platsen är tom (inga tiotal)", any: ["platshåll", "inga tiotal", "noll tiotal", "inget tiotal", "tom plats", "tomma platsen", "hålla platsen", "håller platsen"] },
        { id: "exempel", label: "ett konkret exempel eller en modell", any: ["basblock", "tabell", "kuber", "stavar", "platta", "exempel", "till exempel", "t.ex", "305", "203", "300"] },
        { id: "forandring", label: "hur talets värde ändras utan nollan", any: ["blir ett annat tal", "helt annat tal", "mindre", "tio gånger", "35", "23", "fel värde", "flyttas", "flyttar"] },
      ],
      misconceptions: [{ pattern: "nollan (är|betyder) (ingenting|inget|ingen betydelse)(?! utan)", message: "Var försiktig: nollan har värdet noll men har en viktig betydelse som platshållare – den är inte \"ingenting\"." }],
    },
    modelAnswer:
      "Nollan i 305 visar att det inte finns några tiotal. Den håller kvar platsen så att 3:an står på hundratalsplatsen. Lägger vi 305 med basblock blir det 3 platter, inga stavar och 5 kuber. Tar vi bort nollan får vi 35, som är 3 stavar och 5 kuber – ett helt annat och mycket mindre tal. Siffrans plats avgör alltså värdet, och nollan behövs för att markera att tiotalsplatsen är tom.",
  },
};

// ───────────────────────── Lektion 2 ─────────────────────────
export const lesson2: Lesson = {
  id: "w1-l2", worldId: "w1", title: "Stora tal", grades: "åk 4–6",
  summary: "Tusental, miljoner och miljarder – grupper om tre siffror.",
  lgr: "Taluppfattning: stora naturliga tal",
  objectives: ["Läsa och skriva tal upp till miljarder.", "Dela in stora tal i grupper om tre siffror.", "Förstå hur stora tal hänger ihop (1 000 · 1 000 = 1 miljon)."],
  intro: "Befolkningen i Sverige är cirka tio miljoner. Ett fotbollsmål per minut dygnet runt i ett år blir ungefär en halv miljon. Stora tal är lätta att läsa om man känner till deras mönster – de byggs av **grupper om tre siffror**.",
  theory: [
    { heading: "Grupper om tre", body: "Från höger delar vi in siffrorna i grupper om tre: **ental**, **tusental**, **miljontal**, **miljarder**. Varje grupp har samma slags mönster: hundratal, tiotal, ental. Därför skriver vi $4\\,082\\,350$ med ett mellanrum mellan grupperna.", visual: { type: "grouping", value: 4082350 } },
    { heading: "Tusen gånger tusen", body: "$1\\,000 \\cdot 1\\,000 = 1\\,000\\,000$, alltså en miljon. En miljard är tusen miljoner: $1\\,000\\,000\\,000$. Varje ny grupp är tusen gånger större än gruppen före.\n\nNär du läser ett stort tal läser du varje grupp som ett vanligt tretalsnummer och lägger till gruppens namn: $4\\,082\\,350$ = fyra miljoner åttiotvå tusen trehundrafemtio." },
    { heading: "Nollor i stora tal", body: "Nollor betyder tomma platser. $3\\,000\\,200$ är tre miljoner och tvåhundra. Tusengruppen är helt tom, men den måste ändå vara med som \"000\"." },
  ],
  worked: [
    { title: "Läsa ett stort tal", problem: "Skriv 5 306 044 med ord.", steps: [{ text: "Dela in i grupper om tre från höger.", math: "5\\,306\\,044" }, { text: "Miljontal: 5. Tusental: 306. Ental: 044.", math: "5\\ \\text{milj.}\\ \\ 306\\ \\text{tusen}\\ \\ 44" }, { text: "Läs: fem miljoner trehundrasex tusen fyrtiofyra." }], why: "Varje grupp läses för sig. Ordet miljoner/tusen berättar vilken grupp det är.", alternative: "Du kan skriva talet i en tabell med kolumner för miljontal, tusental och ental." },
    { title: "Skriva från ord", problem: "Skriv 'tolv miljoner fyrahundra tusen sju' med siffror.", steps: [{ text: "Miljongruppen: 12.", math: "12" }, { text: "Tusengruppen: fyrahundra = 400 (tre siffror).", math: "400" }, { text: "Entalsgruppen: sju = 007 (tre siffror, fyll med nollor).", math: "007" }, { text: "Sätt ihop:", math: "12\\,400\\,007" }], why: "Alla grupper utom den första ska ha exakt tre siffror. Därför blir sju till 007.", },
  ],
  drawing: { task: "Rita en platsvärdestabell med grupperna miljontal, tusental, ental. Skriv in 4 082 350 med en siffra per ruta.", tool: "grid" },
  pupils: [{ pupil: "Hugo", said: "Tre miljoner och tvåhundra skriver jag 3 200.", misconception: "Hoppar över grupperna och skriver bara siffror han hör.", response: "Låt Hugo skriva i en tabell med grupper om tre: miljontal 3, tusental 000, ental 200." }],
  knowledge: [
    {
      id: "readBig", skill: "w1-l2.read-write",
      gen: (rng) => {
        const m = rng.int(1, 9), t = rng.chance(0.3) ? 0 : rng.int(1, 999), e = rng.int(1, 999);
        const n = m * 1_000_000 + t * 1000 + e;
        const words = `${m} miljoner${t ? ` ${t} tusen` : ""} ${e}`;
        return mc(`rb-${n}`, "w1-l2.read-write", `Vilket tal är ${words}?`, sv(n), [
          { text: sv(Number(`${m}${t}${e}`)), note: "Alla grupper utom den första ska ha exakt tre siffror." },
          { text: sv(m * 1_000_000 + e), note: "Tusengruppen försvann." },
          { text: sv(m * 100_000 + t * 1000 + e) },
          { text: sv(m * 1_000_000 + t * 100 + e) },
        ], `Skriv varje grupp med tre siffror: ${m} | ${String(t).padStart(3, "0")} | ${String(e).padStart(3, "0")} → ${sv(n)}.`, ["Tänk grupper: miljoner, tusen, ental."], rng);
      },
    },
    {
      id: "thousandsCount", skill: "w1-l2.groups",
      gen: (rng) => {
        const m = rng.int(1, 9), t = rng.int(100, 999);
        const n = m * 1_000_000 + t * 1000 + rng.int(0, 999);
        return numeric(`tc-${n}`, "w1-l2.groups", `Hur många tusental finns i ${sv(n)}? (Räkna alla hela tusental.)`, Math.floor(n / 1000),
          `${sv(n)} delat i tusental: ${sv(Math.floor(n / 1000))} hela tusental (ta bort de tre sista siffrorna).`, ["Stryk de tre sista siffrorna."]);
      },
    },
    {
      id: "millionsDigit", skill: "w1-l2.place",
      gen: (rng) => {
        const n = digitsNoZero(rng, 7);
        const ds = digitsOf(n);
        const names = ["miljontal", "hundratusental", "tiotusental", "tusental", "hundratal", "tiotal", "ental"];
        const i = rng.int(0, 6);
        return numeric(`md-${n}-${i}`, "w1-l2.place", `Vilken siffra står på ${names[i]}splatsen i ${sv(n)}?`, ds[i],
          `Från vänster har ett 7-siffrigt tal platserna: ${names.join(", ")}. Där står ${ds[i]}.`, ["Skriv ut platsnamnen under talet."]);
      },
    },
    {
      id: "tenTimes", skill: "w1-l2.relations",
      gen: (rng) => {
        const pairs: [string, string, number][] = [["tusen", "hundra", 10], ["en miljon", "tusen", 1000], ["en miljon", "hundratusen", 10], ["en miljard", "en miljon", 1000]];
        const [big, small, k] = rng.pick(pairs);
        return numeric(`tt-${big}-${small}`, "w1-l2.relations", `Hur många gånger större är ${big} än ${small}?`, k, `Skriv båda med siffror och jämför antalet nollor.`, ["Skriv båda talen med siffror."]);
      },
    },
  ],
  method: [
    {
      id: "groupsTable", skill: "w1-l2.table",
      gen: (rng) => {
        const m = rng.int(1, 99), t = rng.int(0, 999), e = rng.int(0, 999);
        const n = m * 1_000_000 + t * 1000 + e;
        return multifield(`gt-${n}`, "w1-l2.table", `Dela upp ${sv(n)} i grupper. Skriv talet i varje grupp (utan inledande nollor).`, [
          { label: "Miljontal", accept: [m] }, { label: "Tusental", accept: [t] }, { label: "Ental", accept: [e] },
        ], `${sv(n)} = ${m} miljoner, ${t} tusen och ${e}.`, ["Tre siffror per grupp från höger."]);
      },
    },
    {
      id: "writeFromWords", skill: "w1-l2.write",
      gen: (rng) => {
        const m = rng.int(1, 40), t = rng.int(1, 999), e = rng.int(1, 999);
        const n = m * 1_000_000 + t * 1000 + e;
        return multifield(`wfw-${n}`, "w1-l2.write", `Skriv "${m} miljoner ${t} tusen ${e}" med siffror. Fyll i varje grupp med exakt tre siffror (förutom miljongruppen), därefter hela talet utan mellanslag.`, [
          { label: "Tusengrupp", accept: [String(t).padStart(3, "0")] }, { label: "Entalsgrupp", accept: [String(e).padStart(3, "0")] }, { label: "Hela talet", accept: [String(n)] },
        ], `${m} | ${String(t).padStart(3, "0")} | ${String(e).padStart(3, "0")} = ${sv(n)}.`, ["Fyll på med nollor till tre siffror."]);
      },
    },
  ],
  representation: [
    {
      id: "nlMillion", skill: "w1-l2.numberline",
      gen: (rng) => {
        const v = rng.int(1, 9) * 100_000;
        return numberlineEx(`nlm-${v}`, "w1-l2.numberline", `Markera ${sv(v)} på tallinjen (0 till 1 000 000).`, v, { min: 0, max: 1_000_000, step: 100_000, labelEvery: 500_000 },
          `Varje streck är 100 000. ${sv(v)} är streck nummer ${v / 100_000}.`, ["Hur många hundratusental är talet?"]);
      },
    },
    {
      id: "groupVisual", skill: "w1-l2.grouping",
      gen: (rng) => {
        const m = rng.int(1, 9), t = rng.int(1, 999), e = rng.int(1, 999);
        const n = m * 1_000_000 + t * 1000 + e;
        return withVisual(multifield(`gv-${n}`, "w1-l2.grouping", `Bilden visar ${sv(n)} indelat i grupper. Vilket är miljontalet, tusentalet och entalen?`, [
          { label: "Miljontal", accept: [m] }, { label: "Tusental", accept: [t] }, { label: "Ental", accept: [e] },
        ], `Grupperna: ${m} | ${t} | ${e}.`, ["Läs gruppen för sig."]), { type: "grouping", value: n });
      },
    },
  ],
  teacher: {
    title: "Läsa och skriva stora tal",
    scenarios: ["Hugo (åk 5) skriver tre miljoner och tvåhundra som 3 200 och är säker på att det stämmer: \"Jag skrev ju tre, och tvåhundra.\""],
    prompt: "Förklara för Hugo hur grupper om tre siffror hjälper honom att skriva stora tal rätt. Visa med hans eget tal hur du skulle göra.",
    minChars: 140,
    rubric: {
      minConcepts: 3,
      concepts: [
        { id: "grupper", label: "grupper om tre siffror", any: ["grupp", "tre siffror", "tretal", "tre och tre"] },
        { id: "namn", label: "gruppernas namn (miljontal, tusental, ental)", any: ["miljon", "tusental", "tusen", "ental"] },
        { id: "nollor", label: "att tomma grupper fylls med nollor (000)", any: ["000", "nollor", "tomma", "noll"] },
        { id: "exempel", label: "att visa Hugos tal med grupperna (3 000 200)", any: ["3 000 200", "3000200", "3 | 000 | 200", "3 000 200"] },
      ],
    },
    modelAnswer: "Hugo, vi delar talet i grupper om tre siffror från höger: miljontal, tusental och ental. Tre miljoner och tvåhundra har 3 i miljongruppen, ingen tusengrupp – den blir 000 – och 200 i entalsgruppen. Hela talet blir 3 000 200. Om du skriver 3 200 har du glömt att tusengruppen och miljongruppen behöver nollor som platshållare.",
  },
};

// ───────────────────────── Lektion 3 ─────────────────────────
export const lesson3: Lesson = {
  id: "w1-l3", worldId: "w1", title: "Utvecklad form", grades: "åk 4–6",
  summary: "Dela upp tal efter platsvärde och bygg ihop dem igen.",
  lgr: "Taluppfattning: hur tal kan delas upp och sättas ihop",
  objectives: ["Skriva tal i utvecklad form.", "Använda platsvärdesuppdelning som beräkningsstrategi.", "Förstå sambandet mellan platsvärde och multiplikation."],
  intro: "Att dela upp ett tal i tusental, hundratal, tiotal och ental kallas **utvecklad form**. Det är grunden för nästan alla huvudräknings- och uppställningsmetoder – och en bra förklaringsmodell för elever.",
  theory: [
    { heading: "Utvecklad form", body: "$4\\,305 = 4\\,000 + 300 + 0 + 5$. Varje term är siffran gånger platsvärdet: $4 \\cdot 1\\,000 + 3 \\cdot 100 + 0 \\cdot 10 + 5 \\cdot 1$.", visual: { type: "placevalue", value: 4305 } },
    { heading: "Varför är det användbart?", body: "Med utvecklad form kan du räkna del för del. Exempel: $4\\,305 + 2\\,010$: addera tusental med tusental, hundratal med hundratal och så vidare: $6\\,000 + 300 + 10 + 5 = 6\\,315$. Det är också det som egentligen sker i uppställning." },
  ],
  worked: [
    { title: "Skriva i utvecklad form", problem: "Skriv 7 062 i utvecklad form.", steps: [{ text: "Hitta siffran på varje plats.", math: "7\\ |\\ 0\\ |\\ 6\\ |\\ 2" }, { text: "Multiplicera med platsvärdet.", math: "7\\cdot 1000 + 0\\cdot 100 + 6\\cdot 10 + 2\\cdot 1" }, { text: "Termen med 0 kan utelämnas.", math: "7\\,000 + 60 + 2" }], why: "Varje siffra visar hur många av platsens enhet vi har. Summan blir talet.", alternative: "Du kan skriva \"7 tusental, 6 tiotal och 2 ental\"." },
    { title: "Bygga ihop", problem: "Vilket tal är 9 000 + 400 + 3?", steps: [{ text: "Skriv i tabell: 9 tusental, 4 hundratal, 0 tiotal, 3 ental.", math: "9\\ 4\\ 0\\ 3" }, { text: "Talet är:", math: "9\\,403" }], why: "Tiotalsplatsen saknas i uppdelningen, alltså är den tom och får en nolla." },
  ],
  drawing: { task: "Rita basblock för 1 243 och skriv talet i utvecklad form under.", tool: "grid" },
  pupils: [{ pupil: "Sara", said: "4 305 är 4 + 3 + 0 + 5.", misconception: "Skriver bara siffrorna med plus och glömmer platsvärdet.", response: "Fråga: \"Hur mycket är 4:an värd?\" Låt henne lägga basblock: 4 stora kuber (tusental)…" }],
  knowledge: [
    {
      id: "expandedToNumber", skill: "w1-l3.compose",
      gen: (rng) => {
        const d = [rng.int(1, 9), rng.int(0, 9), rng.int(0, 9), rng.int(1, 9)];
        const n = Number(d.join(""));
        const parts = placeParts(n);
        const text = parts.map(sv).join(" + ");
        return mc(`etn-${n}`, "w1-l3.compose", `Vilket tal är ${text}?`, sv(n), [
          { text: sv(Number(parts.map((p) => String(p)[0]).join(""))), note: "Siffrorna är rätt, men du måste tänka på platsvärdena och tomma platser." },
          { text: sv(parts.reduce((a, b) => a + b, 0) + 10) },
          { text: sv(parts.reduce((a, b) => a + b, 0) - 1) },
          { text: sv(parts.reduce((a, b) => a + b, 0) * 10) },
        ], `Summan av termerna är ${sv(n)}.`, ["Lägg ihop termerna – börja med de största."], rng);
      },
    },
    {
      id: "valueExpanded", skill: "w1-l3.expand",
      gen: (rng) => {
        const n = digitsNoZero(rng, 4, false);
        const ds = digitsOf(n);
        return numeric(`ve-${n}`, "w1-l3.expand", `${sv(n)} = ${ds[0]} · 1 000 + ${ds[1]} · 100 + ${ds[2]} · □ + ${ds[3]} · 1. Vilket tal ska stå i rutan?`, 10,
          "Tiotalsplatsen har värdet 10.", ["Vilken plats står siffran " + ds[2] + " på?"]);
      },
    },
    {
      id: "missingTerm", skill: "w1-l3.missing",
      gen: (rng) => {
        const n = digitsNoZero(rng, 4);
        const parts = placeParts(n);
        const miss = rng.int(0, parts.length - 1);
        const shown = parts.map((p, i) => (i === miss ? "□" : sv(p))).join(" + ");
        return numeric(`mt-${n}-${miss}`, "w1-l3.missing", `${sv(n)} = ${shown}. Vilket tal saknas?`, parts[miss], `Det saknade talet är ${sv(parts[miss])}, eftersom ${parts.map(sv).join(" + ")} = ${sv(n)}.`, ["Vilken plats är tom i uppdelningen?"]);
      },
    },
    {
      id: "add2", skill: "w1-l3.strategy",
      gen: (rng) => {
        const a = rng.int(1, 4) * 1000 + rng.int(1, 4) * 100 + rng.int(0, 4) * 10 + rng.int(1, 4);
        const b = rng.int(1, 4) * 1000 + rng.int(0, 4) * 100 + rng.int(1, 4) * 10 + rng.int(1, 4);
        return numeric(`ad-${a}-${b}`, "w1-l3.strategy", `Räkna med platsvärdesuppdelning: ${sv(a)} + ${sv(b)}`, a + b,
          `Tusental + tusental, hundratal + hundratal ... → ${sv(a + b)}.`, ["Lägg tusental med tusental, hundratal med hundratal ..."]);
      },
    },
  ],
  method: [
    {
      id: "expandedSteps", skill: "w1-l3.write",
      gen: (rng) => {
        const n = digitsNoZero(rng, 4, false);
        const ds = digitsOf(n);
        return multifield(`es-${n}`, "w1-l3.write", `Skriv ${sv(n)} i utvecklad form. Fyll i värdet för varje del.`, [
          { label: "Tusental", accept: [ds[0] * 1000] }, { label: "Hundratal", accept: [ds[1] * 100] }, { label: "Tiotal", accept: [ds[2] * 10] }, { label: "Ental", accept: [ds[3]] },
        ], `${ds[0]}·1000 + ${ds[1]}·100 + ${ds[2]}·10 + ${ds[3]} = ${sv(ds[0] * 1000)} + ${sv(ds[1] * 100)} + ${ds[2] * 10} + ${ds[3]}.`, ["Siffran gånger platsvärdet."]);
      },
    },
    {
      id: "addSteps", skill: "w1-l3.strategy",
      gen: (rng) => {
        const a = rng.int(1, 5) * 100 + rng.int(1, 5) * 10 + rng.int(1, 4);
        const b = rng.int(1, 4) * 100 + rng.int(1, 4) * 10 + rng.int(1, 5);
        const sums = [Math.floor(a / 100) * 100 + Math.floor(b / 100) * 100, (Math.floor(a / 10) % 10) * 10 + (Math.floor(b / 10) % 10) * 10, (a % 10) + (b % 10)];
        return multifield(`as-${a}-${b}`, "w1-l3.strategy", `Beräkna ${a} + ${b} med utvecklad form. Fyll i delsummorna.`, [
          { label: "Hundratalen", accept: [sums[0]] }, { label: "Tiotalen", accept: [sums[1]] }, { label: "Entalen", accept: [sums[2]] }, { label: "Summa", accept: [a + b] },
        ], `${sums.join(" + ")} = ${a + b}.`, ["Addera varje plats för sig."]);
      },
    },
  ],
  representation: [
    {
      id: "baseTenExpand", skill: "w1-l3.baseten",
      gen: (rng) => {
        const n = rng.int(1, 3) * 1000 + rng.int(1, 4) * 100 + rng.int(0, 4) * 10 + rng.int(1, 6);
        const ds = digitsOf(n);
        return withVisual(multifield(`bte-${n}`, "w1-l3.baseten", `Bilden visar ett tal med basblock (tusenkuber, platter, stavar, kuber). Fyll i antalen och talet.`, [
          { label: "Tusenkuber", accept: [ds[0]] }, { label: "Platter", accept: [ds[1]] }, { label: "Stavar", accept: [ds[2]] }, { label: "Kuber", accept: [ds[3]] }, { label: "Talet", accept: [n] },
        ], `Antalet block per sort ger siffrorna: ${ds.join(" ")}.`, []), { type: "baseten", value: n });
      },
    },
    {
      id: "nlExpanded", skill: "w1-l3.numberline",
      gen: (rng) => {
        const v = rng.int(1, 9) * 100 + rng.int(0, 1) * 50;
        return numberlineEx(`nle-${v}`, "w1-l3.numberline", `Markera ${sv(v)} på tallinjen. Tänk: ${placeParts(v).map(sv).join(" + ")}.`, v, { min: 0, max: 1000, step: 50, labelEvery: 250 },
          `${sv(v)} ligger vid ${placeParts(v).map(sv).join(" + ")}.`, ["Välj det streck som är närmast. Streckens avstånd är 50."].slice(0, 1));
      },
    },
  ],
  teacher: {
    title: "Utvecklad form som förklaringsmodell",
    scenarios: ["Sara (åk 4) skriver 4 305 som 4 + 3 + 0 + 5 och tycker att det blir ett jättelitet tal. Hon förstår inte varför det inte stämmer."],
    prompt: "Förklara för Sara vad som saknas och hur utvecklad form egentligen fungerar. Använd gärna en modell (basblock eller tabell).",
    minChars: 140,
    rubric: {
      minConcepts: 3,
      concepts: [
        { id: "platsvarde", label: "att varje siffra multipliceras med platsens värde", any: ["platsvärde", "gånger", "multipl", "värd", "·", "tusen", "hundra"] },
        { id: "summa", label: "att talet är summan av delarna (4 000 + 300 + 0 + 5)", any: ["4 000", "4000", "summa", "lägg ihop", "plus"] },
        { id: "modell", label: "en modell (basblock, tabell, pengar)", any: ["basblock", "tabell", "block", "kuber", "pengar", "sedlar"] },
        { id: "noll", label: "att nollan betyder att tiotalsplatsen är tom", any: ["noll", "tom", "inga tiotal"] },
      ],
    },
    modelAnswer: "Sara, siffrorna i 4 305 är inte värda sig själva – de är värda efter plats. 4:an står på tusentalsplatsen och är därför 4 000, 3:an är 300, nollan betyder inga tiotal och 5:an är 5. Talet är summan 4 000 + 300 + 0 + 5. Vi kan lägga det med basblock: 4 stora kuber, 3 platter, inga stavar och 5 småkuber.",
  },
};

// ───────────────────────── Lektion 4 ─────────────────────────
export const lesson4: Lesson = {
  id: "w1-l4", worldId: "w1", title: "Talraden och tallinjen", grades: "åk 4–6",
  summary: "Placera tal på tallinjen och hitta mitten mellan två tal.",
  lgr: "Taluppfattning: tals ordning och storlek, representation på tallinje",
  objectives: ["Placera tal på en tallinje med given skala.", "Hitta talet mitt emellan två tal.", "Använda tallinjen som tankemodell."],
  intro: "Tallinjen är den viktigaste bilden i matematiken: den visar tal som **sträckor och lägen**. Heltal, bråk, decimaltal och negativa tal bor alla på samma linje. Läraren måste kunna läsa skalan – inte bara gissa var talet ligger.",
  theory: [
    { heading: "Skalan avgör", body: "På en tallinje är avståndet mellan två streck alltid lika stort. Börja med att avgöra **vad ett steg är värt**: (slutvärde − startvärde) ÷ antal steg.", visual: { type: "numberline", min: 0, max: 100, step: 10, marks: [30], labelEvery: 50 } },
    { heading: "Mitt emellan", body: "Talet mitt emellan $a$ och $b$ ligger lika långt från båda. Du hittar det genom att ta **halva avståndet**: mitten $= a + (b - a) \\div 2$. Mitten mellan 40 och 100 är $40 + 30 = 70$." },
  ],
  worked: [
    { title: "Mitten mellan två tal", problem: "Vilket tal ligger mitt emellan 120 och 200?", steps: [{ text: "Räkna avståndet.", math: "200 - 120 = 80" }, { text: "Ta hälften av avståndet.", math: "80 \\div 2 = 40" }, { text: "Lägg hälften till det mindre talet.", math: "120 + 40 = 160" }], why: "Mitten ligger lika långt från båda ändar, alltså ett halvt avstånd från vardera.", alternative: "Addera talen och dela med två: $(120+200) \\div 2 = 160$." },
    { title: "Avläsa skalan", problem: "En tallinje går från 0 till 1 000 med 10 steg. Var ligger tredje strecket efter 0?", steps: [{ text: "Ett steg:", math: "1\\,000 \\div 10 = 100" }, { text: "Tredje strecket:", math: "3 \\cdot 100 = 300" }], why: "Tallinjens skala är jämn – varje steg är lika långt." },
  ],
  drawing: { task: "Rita en tallinje från 0 till 1 000 med steg om 100 och markera 650.", tool: "numberline" },
  pupils: [{ pupil: "Ali", said: "Mitt emellan 40 och 100 är 50.", misconception: "Tar medelvärdet av siffrorna (4 och 10?) eller gissar utan beräkning.", response: "Be Ali rita tallinjen och räkna avståndet: 100 − 40 = 60. Hälften är 30. Då hamnar vi på 70." }],
  knowledge: [
    {
      id: "midpoint", skill: "w1-l4.midpoint",
      gen: (rng, { level }) => {
        const a = rng.int(1, 20) * 10, d = rng.int(2, 15) * 10 + (level > 1 ? 20 : 0);
        return numeric(`mp-${a}-${d}`, "w1-l4.midpoint", `Vilket tal ligger mitt emellan ${sv(a)} och ${sv(a + 2 * d)}?`, a + d, `Avståndet är ${2 * d}; hälften är ${d}; ${a} + ${d} = ${a + d}.`, ["Hälften av avståndet från det mindre talet."]);
      },
    },
    {
      id: "nextTerm", skill: "w1-l4.sequence",
      gen: (rng) => {
        const step = rng.pick([10, 100, 1000, 50, 25]);
        const s = rng.int(1, 9) * step;
        const seq = [s, s + step, s + 2 * step];
        return numeric(`nt-${s}-${step}`, "w1-l4.sequence", `Fortsätt talföljden: ${seq.map(sv).join(", ")}, …  Vilket tal kommer sedan?`, s + 3 * step, `Ökningen är ${sv(step)} per steg. ${sv(s + 2 * step)} + ${sv(step)} = ${sv(s + 3 * step)}.`, ["Hur mycket ökar följden varje gång?"]);
      },
    },
    {
      id: "thousandMore", skill: "w1-l4.neighbours",
      gen: (rng) => {
        const n = rng.int(1100, 9800), k = rng.pick([10, 100, 1000]), up = rng.chance(0.5);
        const ans = up ? n + k : n - k;
        return numeric(`tm-${n}-${k}-${up}`, "w1-l4.neighbours", `Vilket tal är ${sv(k)} ${up ? "mer" : "mindre"} än ${sv(n)}?`, ans, `Ändra rätt plats. ${sv(n)} ${up ? "+" : "−"} ${sv(k)} = ${sv(ans)}.`, ["Vilken siffra ska ändras?"]);
      },
    },
    {
      id: "scaleStep", skill: "w1-l4.scale",
      gen: (rng) => {
        const steps = rng.pick([4, 5, 10]);
        const unit = rng.int(2, 20) * 5;
        return numeric(`ss-${steps}-${unit}`, "w1-l4.scale", `En tallinje går från 0 till ${sv(steps * unit)} med ${steps} lika stora steg. Hur stort är varje steg?`, unit, `${sv(steps * unit)} ÷ ${steps} = ${unit}.`, ["Dela hela sträckan med antalet steg."]);
      },
    },
  ],
  method: [
    {
      id: "midpointSteps", skill: "w1-l4.midpoint",
      gen: (rng) => {
        const a = rng.int(1, 30) * 10, d = rng.int(2, 25) * 10;
        const b = a + 2 * d;
        return multifield(`mps-${a}-${b}`, "w1-l4.midpoint", `Hitta talet mitt emellan ${sv(a)} och ${sv(b)} i tre steg.`, [
          { label: "1. Avståndet", accept: [2 * d] }, { label: "2. Hälften av avståndet", accept: [d] }, { label: "3. Mittentalet", accept: [a + d] },
        ], `${b} − ${a} = ${2 * d}; ${2 * d} ÷ 2 = ${d}; ${a} + ${d} = ${a + d}.`, ["Räkna först sträckan mellan talen."]);
      },
    },
    {
      id: "scaleSteps", skill: "w1-l4.scale",
      gen: (rng) => {
        const steps = rng.pick([4, 5, 8, 10]);
        const unit = rng.int(1, 8) * 10;
        const k = rng.int(2, steps - 1);
        return multifield(`scs-${steps}-${unit}-${k}`, "w1-l4.scale", `En tallinje går från 0 till ${sv(steps * unit)} i ${steps} lika stora steg. Beräkna steget och talet vid streck nummer ${k}.`, [
          { label: "Ett steg", accept: [unit] }, { label: `Streck ${k}`, accept: [k * unit] },
        ], `${steps * unit} ÷ ${steps} = ${unit}. ${k} · ${unit} = ${k * unit}.`, ["Steget = sträckan ÷ antal steg."]);
      },
    },
  ],
  representation: [
    {
      id: "placeOnLine", skill: "w1-l4.numberline",
      gen: (rng) => {
        const step = rng.pick([10, 20, 50, 100]);
        const v = rng.int(1, 9) * step;
        return numberlineEx(`pol-${v}-${step}`, "w1-l4.numberline", `Markera ${sv(v)} på tallinjen.`, v, { min: 0, max: step * 10, step, labelEvery: step * 5 },
          `Varje steg är ${step}. ${sv(v)} är streck nummer ${v / step}.`, ["Räkna steg från noll."]);
      },
    },
    {
      id: "midpointLine", skill: "w1-l4.numberline",
      gen: (rng) => {
        const a = rng.int(0, 4) * 10, b = a + rng.int(1, 4) * 20;
        const v = (a + b) / 2;
        return numberlineEx(`mpl-${a}-${b}`, "w1-l4.numberline", `Markera talet som ligger mitt emellan ${a} och ${b}.`, v, { min: 0, max: 100, step: 10, labelEvery: 50 },
          `Mitten är (${a} + ${b}) ÷ 2 = ${v}.`, ["Hur långt är det mellan talen?"]);
      },
    },
  ],
  teacher: {
    title: "Lära ut tallinjen",
    scenarios: ["Ali (åk 5) ska markera talet mitt emellan 40 och 100 och säger: \"Det är 50, för det är mitt emellan 4 och 10-ish.\" Han ritar en tallinje utan skala."],
    prompt: "Visa hur du vägleder Ali att hitta mitten på ett sätt han förstår. Förklara också varför skalan på tallinjen är viktig.",
    minChars: 140,
    rubric: {
      minConcepts: 3,
      concepts: [
        { id: "avstand", label: "att räkna avståndet mellan talen", any: ["avstånd", "skillnad", "100 − 40", "100 - 40", "60"] },
        { id: "halva", label: "att halvera avståndet", any: ["hälften", "halvera", "dela med 2", "delat med 2", "30"] },
        { id: "svar", label: "rätt mittpunkt (70)", any: ["70"] },
        { id: "skala", label: "att tallinjen behöver en jämn skala", any: ["skala", "lika långt", "jämn", "lika stora", "steg"] },
      ],
    },
    modelAnswer: "Ali, vi ritar en tallinje med 40 till vänster och 100 till höger. Först räknar vi hur långt det är mellan dem: 100 − 40 = 60. Mitten ligger lika långt från båda, alltså hälften av 60, som är 30, från 40. Det blir 70. En tallinje måste ha en jämn skala där alla steg är lika stora, annars går det inte att avgöra var mitten ligger.",
  },
};
