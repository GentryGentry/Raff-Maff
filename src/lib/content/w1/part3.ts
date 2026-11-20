import type { Lesson } from "../types";
import { mc, numeric, multifield, numberlineEx } from "@/lib/engine/gen-helpers";

const R: [number, string][] = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
export function toRoman(n: number): string {
  let out = "";
  for (const [v, s] of R) while (n >= v) { out += s; n -= v; }
  return out;
}
export function fromRoman(s: string): number {
  const val: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let t = 0;
  for (let i = 0; i < s.length; i++) {
    const v = val[s[i]], nx = val[s[i + 1]] ?? 0;
    t += v < nx ? -v : v;
  }
  return t;
}

export const lesson9: Lesson = {
  id: "w1-l9", worldId: "w1", title: "Talsystem genom historien", grades: "åk 4–6",
  summary: "Romerska siffror och andra talsystem – och varför vårt eget är så smart.",
  lgr: "Taluppfattning: olika talsystem och några talsystem som används i olika kulturer genom historien",
  objectives: ["Läsa och skriva romerska siffror upp till 3 999.", "Jämföra additiva system med positionssystemet.", "Förklara varför platsvärde och noll gör vårt system effektivt."],
  intro: "Vårt talsystem är inte det enda – och inte det äldsta. Genom att studera andra system förstår vi bättre varför **platsvärde och nollan** var så stora uppfinningar. Det är också ett utmärkt sätt att få elever att se sitt eget talsystem med nya ögon.",
  theory: [
    { heading: "Romerska siffror", body: "Symbolerna: $I=1$, $V=5$, $X=10$, $L=50$, $C=100$, $D=500$, $M=1\\,000$. Man **lägger ihop** symbolernas värden: $XVI = 10 + 5 + 1 = 16$. Om en mindre symbol står **före** en större dras den ifrån: $IV = 4$, $IX = 9$, $XL = 40$, $XC = 90$, $CD = 400$, $CM = 900$. Samma symbol skrivs högst tre gånger i rad." },
    { heading: "Inget platsvärde, ingen nolla", body: "I romerska siffror har varje symbol samma värde oavsett var den står (förutom subtraktionsregeln). Det finns ingen symbol för noll. Därför är beräkningar i uppställning mycket svårare: tänk dig att räkna $XLVII + XIX$ under varandra." },
    { heading: "Andra system", body: "Babylonierna använde för cirka 4 000 år sedan ett **positionssystem med basen 60** (vi har kvar det i 60 minuter och 60 sekunder). Egyptierna använde ett additivt system med hieroglyfer för 1, 10, 100 med flera. Vårt system med bas tio och noll som platshållare kom via Indien och den arabiska världen till Europa." },
  ],
  worked: [
    { title: "Romersk siffra till tal", problem: "Vilket tal är MCMXCIV?", steps: [{ text: "Dela upp i grupper: M, CM, XC, IV.", math: "M\\ |\\ CM\\ |\\ XC\\ |\\ IV" }, { text: "Värdena:", math: "1000 + 900 + 90 + 4" }, { text: "Summa:", math: "1\\,994" }], why: "Varje grupp motsvarar en plats i vårt system: tusental (M), hundratal (CM), tiotal (XC), ental (IV).", alternative: "Läs från vänster och dra av en symbol om nästa är större." },
    { title: "Tal till romersk siffra", problem: "Skriv 49 med romerska siffror.", steps: [{ text: "Dela upp efter platsvärde.", math: "49 = 40 + 9" }, { text: "40 = XL, 9 = IX.", math: "XL + IX" }, { text: "Skriv ihop:", math: "XLIX" }], why: "Det är samma platsvärdesuppdelning som i vårt system – varje plats skrivs för sig. Det är fel att skriva IL för 49 (en symbol dras bara från nästa tiopotens).", alternative: "Börja med största möjliga symbol och gå neråt." },
  ],
  drawing: { task: "Rita ett fyrfält: skriv talet 2 024 med romerska siffror och med positionssystemet och markera likheter och skillnader.", tool: "grid" },
  pupils: [{ pupil: "Theo", said: "IL är 49, för 50 minus 1.", misconception: "Använder subtraktionsregeln för fritt.", response: "Förklara att I bara får stå före V och X. Dela upp 49 som 40 + 9 = XL + IX." }],
  knowledge: [
    {
      id: "romanToNum", skill: "w1-l9.read",
      gen: (rng) => {
        const n = rng.int(4, 3000);
        return numeric(`rtn-${n}`, "w1-l9.read", `Vilket tal är ${toRoman(n)}?`, n, `${toRoman(n)} = ${n}.`, ["Dela upp i M, D, C, L, X, V, I och kolla subtraktionsfall."]);
      },
    },
    {
      id: "numToRomanMc", skill: "w1-l9.write",
      gen: (rng) => {
        const n = rng.int(4, 399);
        const wrong = [n + 1, n - 1, n + 10, n - 10].filter((x) => x > 0).map((x) => toRoman(x));
        return mc(`ntr-${n}`, "w1-l9.write", `Hur skrivs ${n} med romerska siffror?`, toRoman(n), wrong.map((text) => ({ text })), `${n} = ${toRoman(n)}.`, ["Dela upp talet i hundratal, tiotal, ental."], rng);
      },
    },
    {
      id: "romanAdd", skill: "w1-l9.calc",
      gen: (rng) => {
        const a = rng.int(2, 40), b = rng.int(2, 40);
        return numeric(`ra-${a}-${b}`, "w1-l9.calc", `Räkna: ${toRoman(a)} + ${toRoman(b)}. Svara med vårt vanliga talsystem.`, a + b, `${toRoman(a)} = ${a}, ${toRoman(b)} = ${b}. Summan är ${a + b}.`, ["Översätt först."]);
      },
    },
    {
      id: "concept", skill: "w1-l9.concept",
      gen: (rng) => mc("zc", "w1-l9.concept", "Vilken är den största fördelen med vårt talsystem jämfört med romerska siffror?", "Platsvärde och en symbol för noll gör uppställning och stora tal enkla", [
        { text: "Det har fler symboler" }, { text: "Det är äldre" }, { text: "Det använder bokstäver" },
      ], "Platsvärde och nollan gör att tio siffror räcker för alla tal och att vi kan räkna i uppställning.", ["Tänk på vad som skiljer de båda systemen."], rng),
    },
  ],
  method: [
    {
      id: "romanSplit", skill: "w1-l9.write",
      gen: (rng) => {
        const n = rng.int(11, 99);
        const t = Math.floor(n / 10) * 10, e = n % 10;
        return multifield(`rsp-${n}`, "w1-l9.write", `Skriv ${n} med romerska siffror i två steg: tiotalen och entalen, och sedan hela talet.`, [
          { label: `Tiotal (${t})`, accept: [toRoman(t)] }, { label: `Ental (${e})`, accept: [e ? toRoman(e) : "-"] }, { label: "Hela talet", accept: [toRoman(n)] },
        ], `${n} = ${t} + ${e} = ${toRoman(t)} + ${e ? toRoman(e) : ""} = ${toRoman(n)}.`, ["Skriv tiotal och ental var för sig."]);
      },
    },
    {
      id: "romanSum", skill: "w1-l9.read",
      gen: (rng) => {
        const n = rng.int(100, 1999);
        

        const m = Math.floor(n / 1000) * 1000, h = Math.floor((n % 1000) / 100) * 100, t = Math.floor((n % 100) / 10) * 10, e = n % 10;
        return multifield(`rsu-${n}`, "w1-l9.read", `Vilket tal är ${toRoman(n)}? Dela upp i tusental, hundratal, tiotal och ental.`, [
          { label: "Tusental", accept: [m] }, { label: "Hundratal", accept: [h] }, { label: "Tiotal", accept: [t] }, { label: "Ental", accept: [e] },
        ], `${toRoman(n)} = ${m} + ${h} + ${t} + ${e} = ${n}.`, ["Gruppera symbolerna per plats."]);
      },
    },
  ],
  representation: [
    {
      id: "romanLine", skill: "w1-l9.numberline",
      gen: (rng) => {
        const v = rng.int(1, 19) * 5;
        return numberlineEx(`rl-${v}`, "w1-l9.numberline", `Markera ${toRoman(v)} på tallinjen.`, v, { min: 0, max: 100, step: 5, labelEvery: 25 }, `${toRoman(v)} = ${v}.`, ["Översätt till vanliga tal först."]);
      },
    },
    {
      id: "compareSystems", skill: "w1-l9.concept",
      gen: (rng) => mc("cs", "w1-l9.concept", "Vilken beskrivning stämmer om romerska siffror?", "Symbolerna adderas (och subtraheras i vissa fall) och har inget platsvärde", [
        { text: "Varje plats är tio gånger mer värd än platsen till höger" }, { text: "Det finns en särskild symbol för noll" }, { text: "Man behöver bara fem symboler" },
      ], "Romerska siffror är ett additivt system med subtraktionsregel. Platsvärde och noll saknas.", [], rng),
    },
  ],
  teacher: {
    title: "Varför är vårt system smart?",
    scenarios: ["Theo (åk 5) frågar: \"Varför använder vi inte romerska siffror, de ser ju coola ut?\" Han tycker att XLVII + XIX borde vara lika lätt som 47 + 19."],
    prompt: "Förklara för Theo vad som skiljer romerska siffror från vårt talsystem och varför vårt är lättare att räkna med. Använd platsvärde och noll i din förklaring.",
    minChars: 140,
    rubric: {
      minConcepts: 3,
      concepts: [
        { id: "plats", label: "platsvärde (siffrans plats bestämmer värdet)", any: ["platsvärde", "plats", "position"] },
        { id: "noll", label: "nollan / platshållare", any: ["noll", "platshåll"] },
        { id: "uppst", label: "uppställning/beräkningar är enklare", any: ["uppställning", "räkna", "beräkning", "under varandra", "addition"] },
        { id: "rom", label: "att romerska siffror adderar symbolernas värden / få symboler för stora tal", any: ["adder", "lägger ihop", "symbol", "bokstäver", "samma värde"] },
      ],
    },
    modelAnswer: "Theo, i romerska siffror har varje symbol samma värde oavsett var den står, och man lägger ihop dem. Det finns ingen nolla. I vårt system bestämmer platsen värdet: 4 i 47 är fyra tiotal. Med platsvärde och noll räcker tio siffror för alla tal och vi kan räkna med uppställning, där ental läggs under ental och tiotal under tiotal. Med romerska siffror måste man översätta först, eller räkna symbol för symbol.",
  },
};
