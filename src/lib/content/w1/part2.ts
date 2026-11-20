import type { Lesson } from "../types";
import { mc, numeric, multifield, sv, withVisual, numberlineEx } from "@/lib/engine/gen-helpers";

// ───────────────────────── Lektion 5 ─────────────────────────
export const lesson5: Lesson = {
  id: "w1-l5", worldId: "w1", title: "Jämföra och ordna tal", grades: "åk 4–6",
  summary: "Använd <, > och = och ordna tal efter storlek.",
  lgr: "Taluppfattning: jämföra och ordna naturliga tal",
  objectives: ["Jämföra tal med <, > och =.", "Ordna tal från minst till störst.", "Förklara en jämförelsestrategi utifrån platsvärde."],
  intro: "Vilket tal är störst: 9 876 eller 10 234? Många tror att det är 9 876 eftersom 9 är en stor siffra. Här lär du dig en säker strategi och hur du förklarar den.",
  theory: [
    { heading: "Strategin", body: "1. **Räkna siffror.** Fler siffror betyder större tal (om talen inte börjar med nollor).\n\n2. Om antalet siffror är lika: jämför siffrorna **från vänster**, plats för plats. Det första stället där de skiljer sig avgör.\n\nTecknen: $<$ betyder \"mindre än\", $>$ betyder \"större än\". Öppningen vetter mot det större talet.", visual: { type: "compare", a: 9876, b: 10234 } },
    { heading: "Ordna tal", body: "För att ordna tre tal: hitta först det minsta, sedan det näst minsta. Kontrollera alltid genom att läsa listan: varje tal ska vara mindre än nästa." },
  ],
  worked: [
    { title: "Olika många siffror", problem: "Jämför 9 876 och 10 234.", steps: [{ text: "Räkna siffror: 9 876 har 4, 10 234 har 5." }, { text: "Det talet med flest siffror är störst.", math: "9\\,876 < 10\\,234" }], why: "Ett femsiffrigt tal är minst 10 000, och ett fyrsiffrigt tal är högst 9 999.", alternative: "Placera talen på en tallinje – det längst till höger är störst." },
    { title: "Lika många siffror", problem: "Jämför 4 538 och 4 582.", steps: [{ text: "Tusental: 4 = 4. Hundratal: 5 = 5." }, { text: "Tiotal: 3 < 8. Här skiljer de sig åt.", math: "4\\,538 < 4\\,582" }], why: "Det högsta platsvärdet där talen skiljer sig avgör, eftersom en högre plats alltid väger tyngre än alla lägre platser tillsammans." },
  ],
  drawing: { task: "Rita en tallinje och placera 9 876 och 10 234. Skriv rätt jämförelsetecken.", tool: "numberline" },
  pupils: [{ pupil: "Emil", said: "9 876 är större än 10 234 för 9 är större än 1.", misconception: "Jämför första siffran utan att räkna antalet siffror.", response: "Låt Emil säga talen med ord: tiotusen vs niotusen. Räkna siffror först." }],
  knowledge: [
    {
      id: "compareSign", skill: "w1-l5.compare",
      gen: (rng, { level }) => {
        const len = level > 1 ? rng.int(4, 6) : rng.int(3, 5);
        const base = rng.int(10 ** (len - 1), 10 ** len - 1);
        const twin = rng.chance(0.5);
        let other = twin ? base + rng.pick([-1, 1]) * rng.pick([1, 10, 100]) : rng.int(10 ** (len - 1), 10 ** len - 1);
        if (other < 10 ** (len - 1)) other = base + 10;
        const sign = base < other ? "<" : base > other ? ">" : "=";
        return mc(`cs-${base}-${other}`, "w1-l5.compare", `Vilket tecken ska stå i rutan? ${sv(base)} □ ${sv(other)}`, sign, ["<", ">", "="].filter((s) => s !== sign).map((text) => ({ text })),
          `Jämför från vänster plats för plats. ${sv(base)} ${sign} ${sv(other)}.`, ["Jämför antalet siffror, sedan siffrorna från vänster."], rng);
      },
    },
    {
      id: "largest", skill: "w1-l5.order",
      gen: (rng) => {
        const nums = new Set<number>();
        while (nums.size < 4) nums.add(rng.int(900, 12000));
        const arr = [...nums];
        const max = Math.max(...arr), min = Math.min(...arr);
        const asksMax = rng.chance(0.5);
        const ans = asksMax ? max : min;
        return mc(`lg-${arr.join("-")}-${asksMax}`, "w1-l5.order", `Vilket av talen är ${asksMax ? "störst" : "minst"}?`, sv(ans), arr.filter((x) => x !== ans).map((x) => ({ text: sv(x) })),
          `Jämför antal siffror och sedan platsvärde. ${asksMax ? "Störst" : "Minst"} är ${sv(ans)}.`, ["Antal siffror först."], rng);
      },
    },
    {
      id: "biggestFromDigits", skill: "w1-l5.digits",
      gen: (rng) => {
        const ds = rng.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
        const asc = [...ds].sort((a, b) => a - b);
        const big = Number([...asc].reverse().join(""));
        return numeric(`bd-${ds.join("")}`, "w1-l5.digits", `Vilket är det största fyrsiffriga tal du kan bilda med siffrorna ${ds.join(", ")}? Använd varje siffra en gång.`, big, `Sätt den största siffran längst till vänster: ${sv(big)}.`, ["Stor siffra på den högsta platsen."]);
      },
    },
    {
      id: "betweenInt", skill: "w1-l5.between",
      gen: (rng) => {
        const a = rng.int(10, 900) * 10;
        return numeric(`bi-${a}`, "w1-l5.between", `Vilket tal ligger mellan ${sv(a)} och ${sv(a + 10)}, om du bara ser till heltal som slutar på 5? (Skriv talet.)`, a + 5, `${sv(a)} < ${sv(a + 5)} < ${sv(a + 10)}.`, ["Tänk på entalssiffran."]);
      },
    },
  ],
  method: [
    {
      id: "orderThree", skill: "w1-l5.order",
      gen: (rng) => {
        const nums = new Set<number>();
        while (nums.size < 3) nums.add(rng.int(1000, 99999));
        const arr = [...nums];
        const sorted = [...arr].sort((a, b) => a - b);
        return multifield(`o3-${arr.join("-")}`, "w1-l5.order", `Ordna talen ${arr.map(sv).join(", ")} från minst till störst.`, [
          { label: "Minst", accept: [sorted[0]] }, { label: "Mitten", accept: [sorted[1]] }, { label: "Störst", accept: [sorted[2]] },
        ], `Rätt ordning: ${sorted.map(sv).join(" < ")}.`, ["Ordna först efter antal siffror."]);
      },
    },
    {
      id: "compareWhy", skill: "w1-l5.compare",
      gen: (rng) => {
        const a = rng.int(2, 8) * 1000 + rng.int(1, 9) * 100 + rng.int(1, 8) * 10;
        const b = a + rng.pick([10, 20, -10, -20]);
        const idx = a < b ? "första" : "andra";
        return multifield(`cw-${a}-${b}`, "w1-l5.compare", `Jämför ${sv(a)} och ${sv(b)}. Vid vilken plats skiljer sig talen först (från vänster)? Skriv platsens värde (t.ex. 10 för tiotal), och vilket tal som är störst.`, [
          { label: "Platsens värde", accept: [10] }, { label: "Det största talet", accept: [Math.max(a, b)] },
        ], `Siffrorna är lika på tusental och hundratal. På tiotalsplatsen skiljer de sig. Störst är ${sv(Math.max(a, b))} (${idx} talet är ${a < b ? "mindre" : "större"}).`, ["Jämför från vänster – var skiljer det sig?"]);
      },
    },
  ],
  representation: [
    {
      id: "compareOnLine", skill: "w1-l5.numberline",
      gen: (rng) => {
        const a = rng.int(1, 4) * 100, bigger = a + rng.int(2, 5) * 100;
        return numberlineEx(`col-${a}-${bigger}`, "w1-l5.numberline", `Markera det större av talen ${sv(a)} och ${sv(bigger)} på tallinjen.`, bigger, { min: 0, max: 1000, step: 100, labelEvery: 500 },
          `${sv(bigger)} ligger längre åt höger och är större.`, ["Det som ligger längst åt höger är störst."]);
      },
    },
    {
      id: "compareVisual", skill: "w1-l5.compare",
      gen: (rng) => {
        const a = rng.int(1000, 9999), b = rng.int(10000, 12000);
        return withVisual(mc(`cvs-${a}-${b}`, "w1-l5.compare", `Bilden visar två tal i en tabell. Vilken beskrivning stämmer?`, `${sv(a)} < ${sv(b)} eftersom ${sv(b)} har fler siffror`, [
          { text: `${sv(a)} > ${sv(b)} eftersom ${sv(a)} har större första siffra` }, { text: `${sv(a)} = ${sv(b)}` }, { text: `${sv(a)} > ${sv(b)} eftersom 9 är större än 1` },
        ], `Tabellen visar att ${sv(b)} har en plats mer än ${sv(a)}, alltså är det större.`, ["Räkna antalet platser."], rng), { type: "compare", a, b });
      },
    },
  ],
  teacher: {
    title: "Strategi för att jämföra tal",
    scenarios: ["Emil (åk 4) hävdar att 9 876 är större än 10 234 \"för 9 är större än 1\". Hur svarar du?"],
    prompt: "Förklara för Emil varför fler siffror betyder ett större tal och beskriv din strategi för att jämföra två tal. Ge ett exempel där talen har lika många siffror.",
    minChars: 140,
    rubric: {
      minConcepts: 3,
      concepts: [
        { id: "antal", label: "att räkna antalet siffror/platser först", any: ["fler siffror", "antal siffror", "räkna siffror", "siffror först", "fler platser", "femsiffrig", "fyrsiffrig"] },
        { id: "vanster", label: "att jämföra från vänster/högsta platsvärdet", any: ["från vänster", "vänster", "högsta plats", "största plats", "första siffran"] },
        { id: "skillnad", label: "att det första stället där de skiljer sig avgör", any: ["skiljer", "första", "avgör"] },
        { id: "exempel", label: "ett konkret exempel", any: ["4 538", "4 582", "exempel", "t.ex", "till exempel", "tusen", "tiotusen"] },
      ],
      misconceptions: [{ pattern: "(störst|större).{0,25}första siffran.{0,10}(är större|störst)(?!.{0,40}antal)", message: "Att bara jämföra första siffran fungerar bara om talen har lika många siffror." }],
    },
    modelAnswer: "Emil, ett femsiffrigt tal som 10 234 är minst tiotusen, medan ett fyrsiffrigt tal som 9 876 är högst 9 999. Därför är fler siffror alltid större. Först räknar vi alltså siffrorna. Är det lika många jämför vi från vänster, plats för plats. Där talen först skiljer sig avgör: 4 538 och 4 582 har samma tusental och hundratal, men 5 tiotal mot 8 tiotal, så 4 582 är störst.",
  },
};

// ───────────────────────── Lektion 6 ─────────────────────────
const roundTo = (n: number, p: number) => Math.floor(n / p + 0.5) * p;

export const lesson6: Lesson = {
  id: "w1-l6", worldId: "w1", title: "Avrundning", grades: "åk 4–6",
  summary: "Avrunda till tiotal, hundratal och tusental och förstå varför.",
  lgr: "Taluppfattning: avrundning och rimlighetsbedömning",
  objectives: ["Avrunda naturliga tal till närmaste tiotal, hundratal och tusental.", "Förklara avrundning med hjälp av tallinjen.", "Använda avrundning för överslagsräkning."],
  intro: "Avrundning är inte en regel att lära sig utantill – det handlar om **vilket tal på tallinjen som ligger närmast**. När vi förstår det blir avrundning en användbar färdighet för överslagsräkning och rimlighetsbedömning.",
  theory: [
    { heading: "Närmaste tiotal, hundratal, tusental", body: "Avrunda 4 367 till närmaste hundratal: Det ligger mellan 4 300 och 4 400. Vilket är närmast? Titta på **siffran till höger om avrundningsplatsen**: är den 0–4 avrundar vi nedåt, är den 5–9 avrundar vi uppåt.", visual: { type: "numberline", min: 4300, max: 4400, step: 10, marks: [4367], labelEvery: 50 } },
    { heading: "Varför 5 avrundar uppåt", body: "Mitt emellan två hundratal, t.ex. 4 350, ligger exakt lika långt från 4 300 och 4 400. Vi har kommit överens om att det avrundas uppåt, så att alla tal har ett entydigt svar. Allt från 4 350 till 4 399 är närmare 4 400 eller lika nära." },
    { heading: "Överslagsräkning", body: "Avrunda talen först, räkna sedan. $4\\,367 + 2\\,918 \\approx 4\\,400 + 2\\,900 = 7\\,300$. Det är ett snabbt sätt att kontrollera om ett svar är rimligt." },
  ],
  worked: [
    { title: "Till närmaste hundratal", problem: "Avrunda 6 482 till närmaste hundratal.", steps: [{ text: "Avrundningsplatsen är hundratalsplatsen (4).", math: "6\\,\\underline{4}82" }, { text: "Siffran till höger är 8 (5–9), alltså avrundar vi uppåt: 4 hundratal blir 5 hundratal." }, { text: "Siffrorna till höger blir nollor.", math: "6\\,500" }], why: "6 482 ligger mellan 6 400 och 6 500, och är närmare 6 500 (avstånd 18 jämfört med 82).", alternative: "Titta på tallinjen: mitten är 6 450. Talet ligger till höger om mitten." },
    { title: "Gränsfallet", problem: "Avrunda 3 950 till närmaste hundratal.", steps: [{ text: "Siffran till höger om hundratalen är 5.", math: "3\\,9\\underline{5}0" }, { text: "5 avrundar uppåt: 9 hundratal + 1 = 10 hundratal. Tusentalet ökar med 1.", math: "4\\,000" }], why: "När nio blir tio flyttas ett steg till nästa plats – precis som i addition." },
  ],
  drawing: { task: "Rita en tallinje från 6 400 till 6 500 med steg om 10. Markera 6 482 och vilket hundratal det är närmast.", tool: "numberline" },
  pupils: [{ pupil: "Maja", said: "3 950 avrundat till hundratal är 3 900, för 9 är redan så stort.", misconception: "Glömmer att avrundningsplatsen blir tio och tusentalet ökar.", response: "Rita tallinjen 3 900–4 000. 3 950 ligger mitt emellan, och vi avrundar uppåt till 4 000." }],
  knowledge: [
    {
      id: "roundMc", skill: "w1-l6.round",
      gen: (rng, { level }) => {
        const p = rng.pick(level > 1 ? [10, 100, 1000] : [10, 100]);
        const n = rng.int(1100, 9999);
        const ans = roundTo(n, p);
        const nm = p === 10 ? "tiotal" : p === 100 ? "hundratal" : "tusental";
        const floor = Math.floor(n / p) * p;
        return mc(`rm-${n}-${p}`, "w1-l6.round", `Avrunda ${sv(n)} till närmaste ${nm}.`, sv(ans), [
          { text: sv(floor), note: "Titta på siffran till höger om avrundningsplatsen." }, { text: sv(floor + p) }, { text: sv(floor - p) }, { text: sv(n - (n % 10)) },
        ], `${sv(n)} ligger mellan ${sv(floor)} och ${sv(floor + p)}. Närmast är ${sv(ans)}.`, ["Vilken siffra står till höger om avrundningsplatsen?"], rng);
      },
    },
    {
      id: "roundNum", skill: "w1-l6.round",
      gen: (rng) => {
        const p = rng.pick([10, 100, 1000]);
        const n = rng.int(11000, 99999);
        const nm = p === 10 ? "tiotal" : p === 100 ? "hundratal" : "tusental";
        return numeric(`rn-${n}-${p}`, "w1-l6.round", `Avrunda ${sv(n)} till närmaste ${nm}.`, roundTo(n, p), `${sv(n)} → ${sv(roundTo(n, p))}.`, ["Är siffran till höger 0–4 eller 5–9?"]);
      },
    },
    {
      id: "estimate", skill: "w1-l6.estimate",
      gen: (rng) => {
        const a = rng.int(1200, 8800), b = rng.int(1200, 8800);
        const est = roundTo(a, 1000) + roundTo(b, 1000);
        return numeric(`es-${a}-${b}`, "w1-l6.estimate", `Gör ett överslag genom att avrunda båda talen till närmaste tusental: ${sv(a)} + ${sv(b)}.`, est,
          `${sv(roundTo(a, 1000))} + ${sv(roundTo(b, 1000))} = ${sv(est)}.`, ["Avrunda först, räkna sedan."]);
      },
    },
    {
      id: "boundary", skill: "w1-l6.boundary",
      gen: (rng) => {
        const h = rng.int(2, 8) * 100;
        const k = rng.int(0, 1);
        const n = h + 50 + k * 0; // exactly at the midpoint
        return numeric(`bd-${n}`, "w1-l6.boundary", `Avrunda ${sv(n)} till närmaste hundratal.`, h + 100, `${sv(n)} ligger precis mitt emellan ${sv(h)} och ${sv(h + 100)}. Vi avrundar uppåt: ${sv(h + 100)}.`, ["Vad gäller för talet som ligger mitt emellan?"]);
      },
    },
  ],
  method: [
    {
      id: "roundSteps", skill: "w1-l6.round",
      gen: (rng) => {
        const n = rng.int(1100, 9999);
        const ds = String(n);
        const dTens = Number(ds[2]); // round to hundreds
        const ans = roundTo(n, 100);
        return multifield(`rs-${n}`, "w1-l6.round", `Avrunda ${sv(n)} till närmaste hundratal i tre steg.`, [
          { label: "1. Siffran på hundratalsplatsen", accept: [Number(ds[1])] }, { label: "2. Siffran till höger (tiotal)", accept: [dTens] }, { label: "3. Avrundat tal", accept: [ans] },
        ], `Hundratalsplatsen: ${ds[1]}. Siffran till höger: ${dTens} → ${dTens >= 5 ? "uppåt" : "nedåt"}. Resultat ${sv(ans)}.`, ["Avrundningsplats, granne, avrunda."]);
      },
    },
    {
      id: "neighbours", skill: "w1-l6.neighbours",
      gen: (rng) => {
        const n = rng.int(1100, 9899);
        const lo = Math.floor(n / 100) * 100;
        return multifield(`nb-${n}`, "w1-l6.neighbours", `${sv(n)} ligger mellan två hela hundratal. Vilka? Och vilket är närmast?`, [
          { label: "Det lägre hundratalet", accept: [lo] }, { label: "Det högre hundratalet", accept: [lo + 100] }, { label: "Närmast", accept: [roundTo(n, 100)] },
        ], `${sv(lo)} och ${sv(lo + 100)}. Närmast är ${sv(roundTo(n, 100))}.`, ["Ta bort tiotal och ental för det lägre hundratalet."]);
      },
    },
  ],
  representation: [
    {
      id: "roundOnLine", skill: "w1-l6.numberline",
      gen: (rng) => {
        const base = rng.int(1, 8) * 1000;
        const n = base + rng.int(1, 9) * 100 + rng.int(1, 9) * 10 + rng.int(0, 9);
        const v = roundTo(n, 100);
        return numberlineEx(`rol-${n}`, "w1-l6.numberline", `${sv(n)} avrundas till närmaste hundratal. Markera det hundratalet på tallinjen.`, v, { min: base, max: base + 1000, step: 100, labelEvery: 500 },
          `${sv(n)} ligger närmast ${sv(v)}.`, ["Vilket hundratal ligger närmast?"]);
      },
    },
    {
      id: "midpointRound", skill: "w1-l6.numberline",
      gen: (rng) => {
        const base = rng.int(1, 8) * 1000 + rng.int(0, 8) * 100;
        const n = base + rng.pick([30, 49, 51, 70]);
        return numberlineEx(`mr-${n}`, "w1-l6.numberline", `Avrunda ${sv(n)} till närmaste hundratal. Markera det på tallinjen.`, roundTo(n, 100), { min: base - 100, max: base + 200, step: 100, labelEvery: 100 },
          `${sv(n)} ligger närmast ${sv(roundTo(n, 100))}.`, ["Mitten mellan två hundratal är 50 efter det lägre."]);
      },
    },
  ],
  teacher: {
    title: "Avrundning med tallinjen",
    scenarios: ["Maja (åk 5) avrundar 3 950 till närmaste hundratal och får 3 900. Hon säger: \"Nian är redan stor, så den kan inte ökas.\""],
    prompt: "Förklara för Maja hur du visar avrundningen på en tallinje, varför man avrundar uppåt vid 5 och vad som händer med tusentalssiffran.",
    minChars: 140,
    rubric: {
      minConcepts: 3,
      concepts: [
        { id: "tallinje", label: "tallinjen med närmaste hundratal", any: ["tallinje", "tallinjen", "närmast"] },
        { id: "mitt", label: "att 3 950 ligger mitt emellan (3 900 och 4 000)", any: ["mitt emellan", "mitten", "lika långt"] },
        { id: "uppat", label: "att man kommit överens om att avrunda uppåt vid 5", any: ["uppåt", "överens", "avrunda upp"] },
        { id: "tusental", label: "att tusentalet ökar (4 000)", any: ["4 000", "4000", "tusental", "tio hundratal", "10 hundratal"] },
      ],
    },
    modelAnswer: "Maja, rita en tallinje mellan 3 900 och 4 000. 3 950 ligger precis mitt emellan, lika långt från båda. Vi har kommit överens om att tal som ligger mitt emellan avrundas uppåt, så svaret blir 4 000. När nian i hundratalen ökar med ett blir det tio hundratal, och det motsvarar ett tusental – därför ökar tusentalet också.",
  },
};

// ───────────────────────── Lektion 7 ─────────────────────────
export const lesson7: Lesson = {
  id: "w1-l7", worldId: "w1", title: "Tio gånger mer, tio gånger mindre", grades: "åk 4–6",
  summary: "Hur siffrorna flyttar plats när vi multiplicerar eller dividerar med 10, 100 och 1 000.",
  lgr: "Taluppfattning: positionssystemet och multiplikation/division med 10, 100, 1 000",
  objectives: ["Multiplicera och dividera heltal med 10, 100 och 1 000.", "Förklara att siffrorna flyttar plats – inte att man \"lägger till nollor\".", "Använda sambandet mellan platserna."],
  intro: "\"När du multiplicerar med 10 lägger du till en nolla.\" Den regeln är en klassisk fälla – den fungerar för heltal men blir fel för decimaltal som 2,5 · 10. Här lär du dig den korrekta förklaringen: **siffrorna flyttar åt vänster**.",
  theory: [
    { heading: "Varje plats är tio gånger större", body: "När ett tal multipliceras med 10 blir varje siffra tio gånger mer värd, och den flyttar därför **en plats åt vänster**. Platsen som blir tom fylls med en nolla som platshållare. $36 \\cdot 10 = 360$: 3 tiotal blir 3 hundratal, 6 ental blir 6 tiotal.", visual: { type: "placevalue", value: 360 } },
    { heading: "Dividera med 10", body: "När ett tal delas med 10 blir varje siffra tio gånger mindre och flyttar en plats åt höger: $4\\,200 \\div 10 = 420$. Det fungerar utan rest om talet slutar på noll." },
    { heading: "Varför \"lägg till en nolla\" är riskabelt", body: "Eleven ser en regel om att nollan läggs sist. Men hen förstår då inte varför. Senare, med decimaltal ($2{,}5 \\cdot 10 = 25$), fungerar regeln inte alls. Därför lär vi ut idén **\"siffrorna flyttar\"** från början." },
  ],
  worked: [
    { title: "Multiplicera med 100", problem: "Beräkna 47 · 100.", steps: [{ text: "Varje siffra flyttar två platser åt vänster.", math: "47 \\to 4\\,700" }, { text: "Tomma platser fylls med nollor.", math: "4\\ 7\\ 0\\ 0" }], why: "100 = 10 · 10, så varje siffra flyttar två platser: tio gånger tio gånger större.", alternative: "47 · 100 = 47 hundratal = 4 700." },
    { title: "Dividera med 1 000", problem: "Beräkna 52 000 ÷ 1 000.", steps: [{ text: "Varje siffra flyttar tre platser åt höger.", math: "52\\,000 \\to 52" }], why: "Division med 1 000 är motsatsen till multiplikation med 1 000: 52 · 1 000 = 52 000.", alternative: "52 000 är 52 tusental. 52 tusental delat i tusental blir 52." },
  ],
  drawing: { task: "Rita en platsvärdestabell och visa hur 36 flyttar när du multiplicerar med 10 och 100.", tool: "grid" },
  pupils: [{ pupil: "Noa", said: "Man lägger bara till en nolla. 5 · 10 = 50.", misconception: "Förstår regeln som en 'trick' utan att veta varför.", response: "Fråga: Vad händer med 2,5 · 10? Låt Noa använda tabellen och se att siffrorna flyttar, inte att nollan 'läggs till'." }],
  knowledge: [
    {
      id: "mulPow", skill: "w1-l7.multiply",
      gen: (rng) => {
        const a = rng.int(2, 999), k = rng.pick([10, 100, 1000]);
        return numeric(`mp-${a}-${k}`, "w1-l7.multiply", `${sv(a)} · ${sv(k)} = ?`, a * k, `Siffrorna flyttar ${String(k).length - 1} plats(er) åt vänster: ${sv(a * k)}.`, ["Hur många platser flyttar siffrorna?"]);
      },
    },
    {
      id: "divPow", skill: "w1-l7.divide",
      gen: (rng) => {
        const a = rng.int(2, 999), k = rng.pick([10, 100, 1000]);
        return numeric(`dp-${a}-${k}`, "w1-l7.divide", `${sv(a * k)} ÷ ${sv(k)} = ?`, a, `Siffrorna flyttar ${String(k).length - 1} platser åt höger: ${sv(a)}.`, ["Division är motsatsen till multiplikation."]);
      },
    },
    {
      id: "missingFactor", skill: "w1-l7.missing",
      gen: (rng) => {
        const a = rng.int(2, 99), k = rng.pick([10, 100, 1000]);
        return numeric(`mf-${a}-${k}`, "w1-l7.missing", `${sv(a)} · □ = ${sv(a * k)}`, k, `${sv(a * k)} ÷ ${sv(a)} = ${sv(k)}.`, ["Hur många platser har siffrorna flyttat?"]);
      },
    },
    {
      id: "whyMc", skill: "w1-l7.concept",
      gen: (rng) => {
        const a = rng.int(2, 9);
        return mc(`wm-${a}`, "w1-l7.concept", `Vilken förklaring är matematiskt bäst för att ${a} · 10 = ${a * 10}?`, `${a} ental blir ${a} tiotal, siffran flyttar en plats åt vänster`, [
          { text: "Man lägger bara till en nolla", note: "Regeln fungerar inte för decimaltal – förklara hellre varför." }, { text: `${a} + 10 = ${a + 10}` }, { text: "Man dubblar talet tio gånger" },
        ], `Förklaringen med platsvärde förklarar *varför* och gäller även för decimaltal.`, ["Vad händer med platsvärdet?"], rng);
      },
    },
  ],
  method: [
    {
      id: "shiftTable", skill: "w1-l7.shift",
      gen: (rng) => {
        const a = rng.int(11, 99);
        const r = a * 100;
        const ds = String(r).padStart(4, "0").split("").map(Number);
        return multifield(`sht-${a}`, "w1-l7.shift", `Beräkna ${a} · 100 och visa i tabellen var siffrorna hamnar.`, [
          { label: "Tusental", accept: [ds[0]] }, { label: "Hundratal", accept: [ds[1]] }, { label: "Tiotal", accept: [ds[2]] }, { label: "Ental", accept: [ds[3]] }, { label: "Svar", accept: [r] },
        ], `${a} · 100 = ${sv(r)}. Siffrorna flyttade två platser åt vänster och nollor fyllde tomma platser.`, ["Två platser åt vänster."]);
      },
    },
    {
      id: "stepsTimes", skill: "w1-l7.steps",
      gen: (rng) => {
        const a = rng.int(2, 99);
        return multifield(`stm-${a}`, "w1-l7.steps", `Gå från ${a} till ${a * 1000} i tre steg, där varje steg är · 10.`, [
          { label: "Efter första · 10", accept: [a * 10] }, { label: "Efter andra · 10", accept: [a * 100] }, { label: "Efter tredje · 10", accept: [a * 1000] },
        ], `${a} → ${a * 10} → ${a * 100} → ${a * 1000}.`, ["Tre gånger · 10 = · 1 000."]);
      },
    },
  ],
  representation: [
    {
      id: "nlShift", skill: "w1-l7.numberline",
      gen: (rng) => {
        const a = rng.int(1, 9);
        return numberlineEx(`nls-${a}`, "w1-l7.numberline", `Tallinjen går från 0 till 100 med steg om 10. Markera ${a} · 10.`, a * 10, { min: 0, max: 100, step: 10, labelEvery: 50 }, `${a} · 10 = ${a * 10}.`, ["Räkna hur många tior."]);
      },
    },
    {
      id: "blockShift", skill: "w1-l7.baseten",
      gen: (rng) => {
        const a = rng.int(1, 4) * 10 + rng.int(1, 4);
        const r = a * 10;
        return withVisual(multifield(`bks-${a}`, "w1-l7.baseten", `Bilden visar ${r} med basblock. Hur många hundratal, tiotal och ental? Och vilket tal delat med 10 blir det? Svara med talet före multiplikation med 10.`, [
          { label: "Platter", accept: [Math.floor(r / 100)] }, { label: "Stavar", accept: [Math.floor(r / 10) % 10] }, { label: "Kuber", accept: [r % 10] }, { label: "Talet ÷ 10", accept: [a] },
        ], `${r} ÷ 10 = ${a}.`, []), { type: "baseten", value: r });
      },
    },
  ],
  teacher: {
    title: "Varför flyttar siffrorna?",
    scenarios: ["Noa (åk 4) säger: \"Det är lätt, man lägger bara till en nolla när man gånger tio.\" Hur reagerar du och hur förklarar du bättre?"],
    prompt: "Förklara för Noa varför siffrorna flyttar plats när man multiplicerar med 10. Förklara också varför regeln \"lägg till en nolla\" kan ställa till problem.",
    minChars: 140,
    rubric: {
      minConcepts: 3,
      concepts: [
        { id: "flytta", label: "att siffrorna flyttar en plats åt vänster", any: ["flyttar", "flytt", "en plats åt vänster", "plats åt vänster"] },
        { id: "tiogg", label: "att varje plats är tio gånger mer värd", any: ["tio gånger", "10 gånger", "tio gånger större", "tio gånger mer"] },
        { id: "decimal", label: "att nollregeln misslyckas för decimaltal (2,5 · 10)", any: ["decimal", "2,5", "kommatal", "decimaltal"] },
        { id: "modell", label: "en modell (tabell eller basblock)", any: ["tabell", "basblock", "platsvärdestabell", "block"] },
      ],
    },
    modelAnswer: "Noa, nollan som kommer sist är en följd av något annat. Varje plats i vårt talsystem är tio gånger mer värd än platsen till höger. När vi multiplicerar med 10 blir varje siffra tio gånger mer värd och flyttar en plats åt vänster. Det syns tydligt i en platsvärdestabell. Regeln \"lägg till en nolla\" fungerar inte för decimaltal, till exempel 2,5 · 10 = 25, där ingen nolla läggs till. Därför är det bättre att förstå att siffrorna flyttar.",
  },
};

// ───────────────────────── Lektion 8 ─────────────────────────
const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
const isPrime = (n: number) => n > 1 && PRIMES.includes(n);

export const lesson8: Lesson = {
  id: "w1-l8", worldId: "w1", title: "Tals egenskaper: delbarhet och primtal", grades: "åk 4–6 (fördjupning)",
  summary: "Jämna och udda tal, delbarhet, faktorer och primtal.",
  lgr: "Rationella tal och deras egenskaper samt hur tal kan delas upp. Obs: delbarhet och primtal nämns inte uttryckligen i centralt innehåll – lektionen är en fördjupning som stöder division och bråk.",
  objectives: ["Avgöra om ett tal är jämnt/udda och delbart med 2, 5, 10, 3.", "Hitta faktorer och faktorpar.", "Förklara vad ett primtal är."],
  intro: "Tal har egenskaper. Vissa går att dela rättvist, andra inte. Att kunna avgöra delbarhet snabbt är en genväg som hjälper vid division, bråk och faktorisering.",
  theory: [
    { heading: "Faktorer och delbarhet", body: "En **faktor** till ett tal är ett tal som går jämnt upp i det. Faktorerna till 12 är 1, 2, 3, 4, 6, 12. Faktorerna kommer i **par**: $1 \\cdot 12$, $2 \\cdot 6$, $3 \\cdot 4$. Ett tal är **delbart** med $k$ om det går jämnt upp i $k$ utan rest.", visual: { type: "area", a: 3, b: 4 } },
    { heading: "Delbarhetsregler", body: "- Med **2**: sista siffran 0, 2, 4, 6 eller 8 (jämnt).\n\n- Med **5**: sista siffran 0 eller 5.\n\n- Med **10**: sista siffran 0.\n\n- Med **3**: siffersumman är delbar med 3. (Ex. 417: 4+1+7 = 12 → delbart med 3.)" },
    { heading: "Primtal", body: "Ett **primtal** är ett tal större än 1 som bara har två faktorer: 1 och talet självt. Exempel: 2, 3, 5, 7, 11. Talet 1 är inte ett primtal. 2 är det enda jämna primtalet. Tal som inte är primtal (större än 1) kallas **sammansatta**." },
  ],
  worked: [
    { title: "Faktorpar", problem: "Hitta alla faktorer till 20.", steps: [{ text: "Gå igenom talen 1, 2, 3, 4 ... och testa om 20 är delbart.", math: "20 \\div 1 = 20,\\ 20 \\div 2 = 10,\\ 20 \\div 4 = 5" }, { text: "Skriv faktorparen.", math: "1\\cdot 20,\\ 2\\cdot 10,\\ 4\\cdot 5" }, { text: "Faktorerna: 1, 2, 4, 5, 10, 20." }], why: "Det räcker att testa upp till roten ur talet (här 4), eftersom varje faktor har en partner.", alternative: "Rita rektanglar med arean 20 – varje rektangel visar ett faktorpar." },
    { title: "Primtal eller inte?", problem: "Är 51 ett primtal?", steps: [{ text: "Testa delbarhet med 3: siffersumman 5 + 1 = 6, delbart med 3.", math: "51 = 3 \\cdot 17" }, { text: "51 har fler faktorer än 1 och 51, alltså inte ett primtal." }], why: "Det räcker att hitta en enda extra faktor för att visa att talet är sammansatt.", alternative: "Många tror att 51 är ett primtal, för det ser udda ut – men 3 · 17 = 51." },
  ],
  drawing: { task: "Rita alla rektanglar som har arean 12 rutor (1×12, 2×6, 3×4) på rutnätet.", tool: "grid" },
  pupils: [{ pupil: "Elsa", said: "1 är ett primtal, det går ju bara att dela med 1.", misconception: "Primtal måste ha exakt två olika faktorer. 1 har bara en.", response: "Låt Elsa lista faktorerna för 1, 2, 3 och 4 och jämföra." }],
  knowledge: [
    {
      id: "primeQ", skill: "w1-l8.primes",
      gen: (rng) => {
        const p = rng.pick(PRIMES.filter((x) => x > 10));
        const comps = [51, 57, 87, 91, 39, 33, 21, 27, 49, 77, 85, 95].filter((x) => !isPrime(x));
        const opts = rng.shuffle(comps).slice(0, 3);
        return mc(`pq-${p}`, "w1-l8.primes", `Vilket av talen är ett primtal?`, String(p), opts.map((x) => ({ text: String(x), note: `${x} är delbart med ${[3, 7, 11, 13, 5].find((d) => x % d === 0)}.` })),
          `${p} har bara faktorerna 1 och ${p}.`, ["Testa delbarhet med 2, 3, 5, 7."], rng);
      },
    },
    {
      id: "divisible", skill: "w1-l8.divisibility",
      gen: (rng) => {
        const k = rng.pick([2, 3, 5, 10]);
        const n = rng.int(100, 999);
        const yes = n % k === 0;
        return mc(`dv-${n}-${k}`, "w1-l8.divisibility", `Är ${n} delbart med ${k}?`, yes ? "Ja" : "Nej", [{ text: yes ? "Nej" : "Ja" }],
          `${n} ÷ ${k} ${yes ? "går jämnt upp" : "ger rest"} (${n} = ${k} · ${Math.floor(n / k)} + ${n % k}).`, [k === 3 ? "Räkna siffersumman." : "Titta på sista siffran."], rng);
      },
    },
    {
      id: "countFactors", skill: "w1-l8.factors",
      gen: (rng) => {
        const n = rng.pick([6, 8, 10, 12, 14, 15, 16, 18, 20, 21, 24, 28]);
        const count = Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0).length;
        return numeric(`cf-${n}`, "w1-l8.factors", `Hur många faktorer har ${n}? (Räkna även 1 och ${n}.)`, count, `Faktorerna är ${Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0).join(", ")} – ${count} stycken.`, ["Gå igenom 1, 2, 3 ... och testa."]);
      },
    },
    {
      id: "nextMultiple", skill: "w1-l8.multiples",
      gen: (rng) => {
        const k = rng.pick([5, 10, 3, 4]);
        const n = rng.int(40, 190);
        const next = (Math.floor(n / k) + 1) * k;
        return numeric(`nm-${n}-${k}`, "w1-l8.multiples", `Vilket är det minsta tal som är större än ${n} och delbart med ${k}?`, next, `Nästa multipel av ${k} efter ${n} är ${next}.`, ["Hitta närmaste multipel av talet."]);
      },
    },
  ],
  method: [
    {
      id: "factorPairs", skill: "w1-l8.factors",
      gen: (rng) => {
        const n = rng.pick([12, 18, 20, 28, 45, 50]);
        const smalls = Array.from({ length: n }, (_, i) => i + 1).filter((d) => d * d <= n && n % d === 0);
        return multifield(`fp-${n}`, "w1-l8.factors", `Skriv faktorparen till ${n}: skriv partnern till varje faktor.`, smalls.map((d) => ({ label: `${d} · ?`, accept: [n / d] })),
          `Faktorparen är ${smalls.map((d) => `${d}·${n / d}`).join(", ")}.`, ["Dela talet med den lilla faktorn."]);
      },
    },
    {
      id: "digitSum", skill: "w1-l8.divisibility",
      gen: (rng) => {
        const n = rng.int(100, 999);
        const s = String(n).split("").reduce((a, b) => a + Number(b), 0);
        return multifield(`ds-${n}`, "w1-l8.divisibility", `Avgör om ${n} är delbart med 3. Beräkna siffersumman och skriv sedan 1 (ja) eller 0 (nej).`, [
          { label: "Siffersumma", accept: [s] }, { label: "Delbart med 3 (1/0)", accept: [s % 3 === 0 ? 1 : 0] },
        ], `Siffersumman ${s} ${s % 3 === 0 ? "är" : "är inte"} delbar med 3.`, ["Addera alla siffror."]);
      },
    },
  ],
  representation: [
    {
      id: "multiplesOnLine", skill: "w1-l8.numberline",
      gen: (rng) => {
        const k = rng.pick([4, 5]);
        const n = rng.int(1, 4) * k + rng.int(1, k - 1);
        const next = (Math.floor(n / k) + 1) * k;
        return numberlineEx(`mol-${n}-${k}`, "w1-l8.numberline", `Markera det närmaste tal som är större än ${n} och delbart med ${k}.`, next, { min: 0, max: 30, step: 1, labelEvery: 5 }, `Multiplerna av ${k}: ${Array.from({ length: 8 }, (_, i) => (i + 1) * k).join(", ")}…`, ["Räkna steg om " + k + "."]);
      },
    },
    {
      id: "areaFactors", skill: "w1-l8.area",
      gen: (rng) => {
        const n = rng.pick([12, 18, 20, 24]);
        const smalls = Array.from({ length: n }, (_, i) => i + 1).filter((d) => d * d <= n && n % d === 0);
        const count = smalls.length;
        return withVisual(numeric(`af-${n}`, "w1-l8.area", `Du ritar alla rektanglar som har arean ${n} rutor, där sidorna är heltal. Rektanglarna 3 × 4 och 4 × 3 räknas som samma. Hur många olika rektanglar finns det för ${n}?`, count, `Varje faktorpar ger en rektangel. Paren för ${n}: ${smalls.map((d) => `${d}×${n / d}`).join(", ")}.`, ["Antalet faktorpar."]), { type: "area", a: smalls[1] ?? 2, b: n / (smalls[1] ?? 2) });
      },
    },
  ],
  teacher: {
    title: "Är 1 ett primtal?",
    scenarios: ["Elsa (åk 6) säger: \"1 är ett primtal, det går ju bara att dela med 1.\""],
    prompt: "Förklara för Elsa vad ett primtal är och varför 1 inte räknas som ett primtal. Ge ett exempel på ett primtal och ett tal som inte är ett primtal.",
    minChars: 140,
    rubric: {
      minConcepts: 3,
      concepts: [
        { id: "def", label: "definitionen: exakt två faktorer (1 och talet självt)", any: ["två faktorer", "exakt två", "bara delbart med 1 och", "endast delbart med 1 och", "1 och sig själv", "1 och talet självt"] },
        { id: "ett", label: "att 1 bara har en faktor", any: ["en faktor", "bara en", "bara 1", "enda faktor"] },
        { id: "primex", label: "exempel på primtal (2, 3, 5, 7, 11)", any: ["2", "3", "5", "7", "11", "13"] },
        { id: "sammansatt", label: "exempel på sammansatt tal (4, 6, 9, 12)", any: ["4", "6", "9", "12", "sammansatt"] },
      ],
    },
    modelAnswer: "Elsa, ett primtal har exakt två olika faktorer: 1 och talet självt. Talet 7 är ett primtal eftersom bara 1 och 7 går jämnt upp i det. Talet 1 har bara en faktor – 1 – så det har inte två olika faktorer och är därför inte ett primtal. Ett tal som 12 är inte ett primtal, eftersom det också har faktorerna 2, 3, 4 och 6.",
  },
};
