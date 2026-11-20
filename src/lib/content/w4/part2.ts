import type { Lesson } from "../types";
import { mc, numeric, multifield, sv, numberlineEx, withVisual, longdivEx, longdivSolution } from "@/lib/engine/gen-helpers";

// ───────── Lektion 4: Division med tiotal och hundratal ─────────
export const lesson4: Lesson = {
  id: "w4-l4", worldId: "w4", title: "Division med tiotal och hundratal", grades: "åk 4–6",
  summary: "480 ÷ 6, 4 200 ÷ 60 och 2 400 ÷ 100 – med platsvärde i stället för ”stryk nollor”.",
  lgr: "Positionssystemet och de fyra räknesätten; metoder för beräkningar vid huvudräkning",
  objectives: ["Dividera tiotal och hundratal med ensiffriga tal i huvudet.", "Dividera med tiotal (t.ex. 360 ÷ 40).", "Förklara varför man får dela båda talen med 10 utan att kvoten ändras."],
  intro: "”Stryk lika många nollor i båda talen” fungerar – men eleven vet inte varför, och regeln blir fel när man delar *med* ett tiotal: $480 \\div 60$ är **8**, inte 80. Den här lektionen ger dig det som förklarar.",
  theory: [
    { heading: "Tiotal som enheter", body: "$480 \\div 6$: 48 tiotal delat på 6 är 8 tiotal. $48 \\div 6 = 8$, så 8 tiotal = $80$. Det är samma tankemodell som vid multiplikation med tiotal." },
    { heading: "Dela med ett tiotal", body: "$360 \\div 40$ frågar: hur många fyrtior ryms i 360? Det är samma som hur många fyror som ryms i 36 (tiotal): $36 \\div 4 = 9$. **Kvoten ändras inte när vi delar båda talen med 10.**", visual: { type: "numberline", min: 0, max: 360, step: 40, marks: [360], labelEvery: 120 } },
    { heading: "Varför?", body: "$\\dfrac{360}{40} = \\dfrac{36 \\cdot 10}{4 \\cdot 10} = \\dfrac{36}{4}$. Om man delar både dividend och delare med samma tal är kvoten oförändrad." },
    { heading: "Hundratal", body: "$2\\,400 \\div 100 = 24$: 2 400 är 24 hundratal, och 24 hundratal delat i hundratal ger 24. Siffrorna flyttar två platser åt höger." },
  ],
  worked: [
    { title: "Dela tiotal", problem: "Beräkna 560 ÷ 7.", steps: [{ text: "56 tiotal delat på 7.", math: "56 \\div 7 = 8" }, { text: "8 tiotal är:", math: "80" }], why: "560 = 56 tiotal; 7 grupper får lika många tiotal var.", alternative: "Kontroll: $80 \\cdot 7 = 560$." },
    { title: "Dela med ett tiotal", problem: "Beräkna 4 200 ÷ 60.", steps: [{ text: "Dela båda talen med 10.", math: "420 \\div 6" }, { text: "42 tiotal delat på 6: 7 tiotal.", math: "420 \\div 6 = 70" }, { text: "Kontroll:", math: "70 \\cdot 60 = 4\\,200" }], why: "Kvoten ändras inte när båda talen delas med 10.", alternative: "Hur många sextior ryms i 4 200? $60 \\cdot 70 = 4\\,200$." },
  ],
  drawing: { task: "Rita en tallinje 0–360 med steg om 40 och räkna hoppen till 360. Hur många hopp blev det?", tool: "numberline" },
  pupils: [{ pupil: "Axel", said: "480 ÷ 60: 48 ÷ 6 = 8, och så lägger man på en nolla. Svaret är 80.", misconception: "Lägger tillbaka en nolla som hör till delaren – men delaren hade också en.", response: "Kontrollera: 80 · 60 = 4 800, inte 480. Förklara att båda talen delats med 10 och kvoten är oförändrad: 8." }],
  knowledge: [
    { id: "tensByOne", skill: "w4-l4.tens", gen: (rng, { level }) => { const b = rng.int(2, 9), q = rng.int(2, 9), h = level > 1 && rng.chance(0.5); const f = h ? 100 : 10; return numeric(`t1-${b}-${q}-${f}`, "w4-l4.tens", `${sv(b * q * f)} ÷ ${b} = ?`, q * f, `${b * q} ${h ? "hundratal" : "tiotal"} delat på ${b} är ${q} ${h ? "hundratal" : "tiotal"}: ${sv(q * f)}.`, ["Tänk tiotal/hundratal som enheter."]); } },
    { id: "tensByTens", skill: "w4-l4.by-tens", gen: (rng) => { const b = rng.int(2, 9), q = rng.int(2, 9); return numeric(`bt-${b}-${q}`, "w4-l4.by-tens", `${sv(b * q * 10)} ÷ ${b * 10} = ?`, q, `Dela båda med 10: ${b * q} ÷ ${b} = ${q}.`, ["Hur många " + b * 10 + ":or ryms?"]); } },
    { id: "trap", skill: "w4-l4.trap", gen: (rng) => { const b = rng.int(2, 9), q = rng.int(2, 9); return numeric(`tr-${b}-${q}`, "w4-l4.trap", `${sv(b * q * 100)} ÷ ${b * 10} = ?`, q * 10, `Dela båda med 10: ${b * q * 10} ÷ ${b} = ${q * 10}. Kontroll: ${q * 10} · ${b * 10} = ${sv(b * q * 100)}.`, ["Dela båda talen med 10 först."]); } },
    { id: "byHundred", skill: "w4-l4.hundreds", gen: (rng) => { const n = rng.int(12, 99); return numeric(`bh-${n}`, "w4-l4.hundreds", `${sv(n * 100)} ÷ 100 = ?`, n, `Siffrorna flyttar två platser åt höger.`, ["Hur många hundratal är det?"]); } },
    { id: "whyMc", skill: "w4-l4.concept", gen: (rng) => mc("wm", "w4-l4.concept", "Varför är 480 ÷ 60 = 8 och inte 80?", "Båda talen kan delas med 10 utan att kvoten ändras: 48 ÷ 6 = 8", [{ text: "För att man alltid lägger tillbaka en nolla", note: "Kontrollera: 80 · 60 = 4 800, inte 480." }, { text: "För att 480 ÷ 6 = 80, och 60 är ungefär 6" }, { text: "För att man ska stryka en nolla bara i dividenden" }], "Dela båda talen med 10: 48 ÷ 6 = 8. Kontroll: 8 · 60 = 480.", ["Kontrollera med multiplikation."], rng) },
  ],
  method: [
    { id: "tensSteps", skill: "w4-l4.tens", gen: (rng) => { const b = rng.int(2, 9), q = rng.int(2, 9); return multifield(`ts-${b}-${q}`, "w4-l4.tens", `Räkna ${sv(b * q * 10)} ÷ ${b} i steg.`, [{ label: "Antal tiotal i talet", accept: [b * q] }, { label: `${b * q} ÷ ${b} =`, accept: [q] }, { label: "Svar", accept: [q * 10] }], `${b * q} tiotal ÷ ${b} = ${q} tiotal = ${q * 10}.`, ["Tiotal är enheter."]); } },
    { id: "byTensSteps", skill: "w4-l4.by-tens", gen: (rng) => { const b = rng.int(2, 9), q = rng.int(2, 9); return multifield(`bs-${b}-${q}`, "w4-l4.by-tens", `Räkna ${sv(b * q * 100)} ÷ ${b * 10} genom att dela båda talen med 10.`, [{ label: "Nytt dividend", accept: [b * q * 10] }, { label: "Ny delare", accept: [b] }, { label: "Kvot", accept: [q * 10] }, { label: "Kontroll: kvot · " + b * 10 + " =", accept: [b * q * 100] }], `${b * q * 10} ÷ ${b} = ${q * 10}.`, []); } },
  ],
  representation: [
    { id: "hundredLine", skill: "w4-l4.numberline", gen: (rng) => { const k = rng.int(1, 9); return numberlineEx(`hl-${k}`, "w4-l4.numberline", `Markera ${sv(k * 1000)} ÷ 100 på tallinjen.`, k * 10, { min: 0, max: 100, step: 10, labelEvery: 50 }, `${sv(k * 1000)} ÷ 100 = ${k * 10}.`, ["Hur många hundratal är " + sv(k * 1000) + "?"]); } },
    { id: "jumpsLine", skill: "w4-l4.numberline", gen: (rng) => { const b = rng.int(2, 9), q = rng.int(3, 9); return withVisual(multifield(`jl-${b}-${q}`, "w4-l4.numberline", `Du hoppar med steg om ${b * 10} från 0 och når ${sv(b * q * 10)}. Hur många hopp? Och hur många tiotal är varje steg respektive hela sträckan?`, [{ label: "Tiotal per steg", accept: [b] }, { label: "Tiotal totalt", accept: [b * q] }, { label: "Antal hopp", accept: [q] }], `${b * q} ÷ ${b} = ${q} hopp.`, []), { type: "numberline", min: 0, max: b * 10 * 10, step: b * 10, labelEvery: b * 50 }); } },
  ],
  teacher: {
    title: "Mer än ”stryk nollor”",
    scenarios: ["Axel (åk 5) räknar 480 ÷ 60 genom att göra 48 ÷ 6 = 8 och sedan ”lägga på en nolla”. Svaret blir 80. Han frågar: \"Men det brukar ju bli rätt när man tar bort nollor?\""],
    prompt: "Förklara för Axel varför svaret blir 8 och inte 80, och varför man får stryka en nolla i båda talen. Visa en kontroll med multiplikation.",
    minChars: 160,
    rubric: {
      minConcepts: 3,
      concepts: [
        { id: "bada", label: "att båda talen delas med 10 / kvoten är oförändrad", any: ["båda talen", "båda", "kvoten ändras inte", "oförändrad", "samma kvot", "delar båda"] },
        { id: "svar", label: "rätt svar 8", any: ["8"] },
        { id: "kontroll", label: "kontroll med multiplikation (8 · 60 = 480 / 80 · 60 = 4 800)", any: ["8 · 60", "8·60", "480", "4 800", "4800", "kontroll"] },
        { id: "regel", label: "varför regeln om nollor är otillräcklig utan förklaring", any: ["regel", "nollor", "nolla", "förklaring", "lägga på"] },
      ],
    },
    modelAnswer: "Axel, 480 ÷ 60 frågar hur många sextior som ryms i 480. Om vi delar båda talen med 10 får vi 48 ÷ 6 = 8, och kvoten ändras inte när båda talen delas med samma tal. Därför är svaret 8. Du lade på en nolla som inte hör dit: nollan i 60 försvann redan när du delade båda talen med 10. Kontrollera med multiplikation: 8 · 60 = 480, men 80 · 60 = 4 800. En regel om nollor fungerar bara om man förstår varför.",
  },
};

// ───────── Lektion 5: Liggande stolen ─────────
const bigDiv = (rng: { int: (a: number, b: number) => number }, rem: boolean) => {
  for (let i = 0; i < 300; i++) {
    const b = rng.int(2, 9), a = rng.int(100, 999);
    const s = longdivSolution(a, b);
    if (s.q.length >= 2 && (a % b !== 0) === rem) return [a, b] as const;
  }
  return rem ? ([749, 4] as const) : ([534, 3] as const);
};

export const lesson5: Lesson = {
  id: "w4-l5", worldId: "w4", title: "Liggande stolen", grades: "åk 4–6",
  summary: "Skriftlig division steg för steg: kvotsiffra, produkt, rest – och varför resten flyttas ner.",
  lgr: "Metoder för beräkningar med naturliga tal vid skriftlig beräkning; rimlighetsbedömning",
  objectives: ["Utföra skriftlig division med ensiffrig delare.", "Förklara växlingen (resten blir tiotal/ental som tas med ner).", "Kontrollera med multiplikation."],
  intro: "Liggande stolen är den skriftliga metoden för division. Den fungerar som en **rättvis utdelning, plats för plats**: först delas hundratalen, det som blir över växlas till tiotal, och så vidare. Här bedöms inte bara kvoten utan varje delsteg.",
  theory: [
    { heading: "Så fungerar den", body: "För $534 \\div 3$: börja längst till vänster. *Hur många gånger går 3 i 5?* 1 gång ($1 \\cdot 3 = 3$), rest $2$. Ta ner nästa siffra: $23$. *Hur många gånger går 3 i 23?* 7 gånger ($21$), rest $2$. Ta ner 4: $24$. 8 gånger ($24$), rest $0$. Kvoten är $178$." },
    { heading: "Varför tar vi ner siffran?", body: "Resten 2 efter första steget är **2 hundratal**. De växlas till 20 tiotal och läggs ihop med de 3 tiotalen som redan finns: 23 tiotal. Nedtagningen av siffran 3 är alltså en växling – samma idé som vid subtraktion." },
    { heading: "Varje steg har samma tre delar", body: "1. Hur många gånger går delaren i talet? (**kvotsiffra**)\n\n2. Multiplicera: kvotsiffra · delare (**produkt**)\n\n3. Subtrahera: talet − produkten (**rest**). Resten ska vara mindre än delaren.\n\nSedan tas nästa siffra ner." },
    { heading: "Slutresten", body: "Om den sista resten inte är 0 har vi en division med rest: $749 \\div 4 = 187$ rest $1$. Kontroll: $187 \\cdot 4 + 1 = 749$." },
  ],
  worked: [
    { title: "Jämn division", problem: "Beräkna 534 ÷ 3.", steps: [{ text: "5 ÷ 3 = 1, produkt 3, rest 2.", math: "5 - 3 = 2" }, { text: "Ta ner 3: 23 ÷ 3 = 7, produkt 21, rest 2.", math: "23 - 21 = 2" }, { text: "Ta ner 4: 24 ÷ 3 = 8, produkt 24, rest 0.", math: "24 - 24 = 0" }, { text: "Kvoten:", math: "178" }], why: "Varje steg delar ut så mycket som möjligt på den platsen. Resten växlas till nästa plats.", alternative: "Kontroll: $178 \\cdot 3 = 534$." },
    { title: "Med rest", problem: "Beräkna 749 ÷ 4.", steps: [{ text: "7 ÷ 4 = 1, produkt 4, rest 3.", math: "7 - 4 = 3" }, { text: "Ta ner 4: 34 ÷ 4 = 8, produkt 32, rest 2.", math: "34 - 32 = 2" }, { text: "Ta ner 9: 29 ÷ 4 = 7, produkt 28, rest 1.", math: "29 - 28 = 1" }, { text: "Kvot och rest:", math: "187\\ \\text{rest}\\ 1" }], why: "Resten blir över eftersom 749 inte är en multipel av 4.", alternative: "Kontroll: $187 \\cdot 4 + 1 = 748 + 1 = 749$." },
  ],
  drawing: { task: "Lägg 534 med basblock (5 platter, 3 stavar, 4 kuber) och dela på 3 personer. Vad gör du med de 2 platter som blir över?", tool: "grid" },
  pupils: [{ pupil: "Siri", said: "534 ÷ 3: 5 ÷ 3 = 1, 3 ÷ 3 = 1, 4 ÷ 3 = 1. Det blir 111.", misconception: "Delar varje siffra för sig och ignorerar resten som ska föras vidare.", response: "Kontrollera: 111 · 3 = 333, inte 534. Använd basblock: 2 platter blir över och växlas till 20 stavar." }],
  knowledge: [
    { id: "divQuotient", skill: "w4-l5.quotient", gen: (rng, { level }) => { const [a, b] = bigDiv(rng, false); void level; return numeric(`dq-${a}-${b}`, "w4-l5.quotient", `Beräkna med liggande stolen: ${sv(a)} ÷ ${b}`, a / b, `${sv(a)} ÷ ${b} = ${sv(a / b)}. Kontroll: ${sv(a / b)} · ${b} = ${sv(a)}.`, ["Ett steg per siffra."]); } },
    { id: "divWithRest", skill: "w4-l5.remainder", gen: (rng) => { const [a, b] = bigDiv(rng, true); return numeric(`dr-${a}-${b}`, "w4-l5.remainder", `Vilken rest får du när du delar ${sv(a)} med ${b}?`, a % b, `${sv(a)} = ${Math.floor(a / b)} · ${b} + ${a % b}.`, ["Räkna med liggande stolen eller kvot · delare."]); } },
    { id: "firstStep", skill: "w4-l5.step", gen: (rng) => { const b = rng.int(2, 6), a = rng.int(b, 9) * 100 + rng.int(10, 99); const d1 = Math.floor(a / 100); return numeric(`fs-${a}-${b}`, "w4-l5.step", `I ${a} ÷ ${b}: vilken är den första kvotsiffran? (Hur många gånger går ${b} i ${d1}?)`, Math.floor(d1 / b), `${b} går ${Math.floor(d1 / b)} gång(er) i ${d1} (${Math.floor(d1 / b) * b}), rest ${d1 % b}.`, ["Hur många gånger går " + b + " i " + d1 + "?"]); } },
    { id: "whyBringDown", skill: "w4-l5.concept", gen: (rng) => mc("wbd", "w4-l5.concept", "I 534 ÷ 3 blir resten 2 efter första steget. Vad betyder det att man tar ner nästa siffra (3)?", "De 2 hundratalen som blev över växlas till 20 tiotal och läggs ihop med 3 tiotal: 23 tiotal", [{ text: "Man bara skriver siffran bredvid resten, utan betydelse" }, { text: "Resten 2 blir 2 ental" }, { text: "Man hoppar över siffran" }], "Det är en växling: hundratal → tiotal.", ["Vad är 2 hundratal i tiotal?"], rng) },
    { id: "zeroInQuot", skill: "w4-l5.zero", gen: (rng) => { const b = rng.int(2, 9), q = rng.int(1, 9) * 100 + rng.int(1, 9); return numeric(`zq-${b}-${q}`, "w4-l5.zero", `${sv(b * q)} ÷ ${b} = ?`, q, `Tiotalen går inte åt (kvotsiffran är 0): ${sv(q)}. Kontroll: ${sv(q)} · ${b} = ${sv(b * q)}.`, ["Kvotsiffran kan vara 0 – den måste skrivas."]); } },
  ],
  method: [
    { id: "longdivExact", skill: "w4-l5.longdiv", gen: (rng) => { const [a, b] = bigDiv(rng, false); return longdivEx(`ld-${a}-${b}`, "w4-l5.longdiv", a, b, `${sv(a)} ÷ ${b} = ${sv(a / b)}. Delstegen visar hur resterna förs vidare.`, ["Första steget: hur många gånger går " + b + " i första siffran (eller de två första)?"]); } },
    { id: "longdivRest", skill: "w4-l5.longdiv", gen: (rng) => { const [a, b] = bigDiv(rng, true); return longdivEx(`lr-${a}-${b}`, "w4-l5.longdiv", a, b, `${sv(a)} ÷ ${b} = ${Math.floor(a / b)} rest ${a % b}.`, ["Resten i sista steget är resten av hela divisionen."]); } },
  ],
  representation: [
    { id: "regroupDiv", skill: "w4-l5.regroup", gen: (rng) => { const b = rng.int(2, 5), d1 = rng.int(b, 9), d2 = rng.int(0, 9); const q1 = Math.floor(d1 / b), r1 = d1 % b; return multifield(`rg-${b}-${d1}-${d2}`, "w4-l5.regroup", `Du delar ${d1} platter (100) och ${d2} stavar (10) rättvist på ${b} personer. Hur många platter får var och en, hur många platter blir över, och hur många stavar ska då delas (de överblivna plattorna växlas till stavar och läggs till de ${d2} som finns)?`, [{ label: "Platter var", accept: [q1] }, { label: "Platter över", accept: [r1] }, { label: "Stavar att dela", accept: [r1 * 10 + d2] }], `${d1} ÷ ${b} = ${q1} rest ${r1}; ${r1} platter = ${r1 * 10} stavar; ${r1 * 10} + ${d2} = ${r1 * 10 + d2} stavar.`, ["1 platta = 10 stavar."]); } },
    { id: "quotientDigits", skill: "w4-l5.regroup", gen: (rng) => { const [a, b] = bigDiv(rng, false); const s = longdivSolution(a, b); return multifield(`qd-${a}-${b}`, "w4-l5.regroup", `Beräkna ${sv(a)} ÷ ${b}. Hur många siffror har kvoten, och vilken är kvoten? Kontrollera med multiplikation.`, [{ label: "Antal siffror i kvoten", accept: [s.q.length] }, { label: "Kvot", accept: [a / b] }, { label: `Kontroll: kvot · ${b} =`, accept: [a] }], `${sv(a)} ÷ ${b} = ${sv(a / b)}.`, []); } },
  ],
  teacher: {
    title: "Varför tar man ner siffran?",
    scenarios: ["Siri (åk 5) räknar 534 ÷ 3 genom att dela varje siffra för sig: 5 ÷ 3 = 1, 3 ÷ 3 = 1, 4 ÷ 3 = 1. Hon får 111 och förstår inte varför kontrollen 111 · 3 inte ger 534."],
    prompt: "Förklara för Siri hur liggande stolen fungerar för 534 ÷ 3, särskilt vad som händer med resten efter första steget. Använd gärna basblock (platter, stavar, kuber).",
    minChars: 180,
    rubric: {
      minConcepts: 4,
      concepts: [
        { id: "rest", label: "att resten (2) måste tas med vidare", any: ["rest", "blir över", "över"] },
        { id: "vaxla", label: "växling: 2 hundratal = 20 tiotal, plus 3 tiotal = 23", any: ["växl", "20 tiotal", "23", "tjugo"] },
        { id: "modell", label: "en modell (basblock, platter, stavar)", any: ["basblock", "platter", "stavar", "platta", "kuber"] },
        { id: "svar", label: "rätt svar 178", any: ["178"] },
        { id: "kontroll", label: "kontroll (178 · 3 = 534)", any: ["178 · 3", "178·3", "534", "kontroll"] },
      ],
    },
    modelAnswer: "Siri, vi delar 534 på 3 personer med basblock: 5 platter, 3 stavar och 4 kuber. Först delar vi plattorna: var och en får 1 platta, och 2 platter blir över. Dem kan vi inte dela, så vi växlar dem till 20 stavar och lägger ihop med de 3 stavarna: 23 stavar. Var och en får 7 stavar (21), och 2 stavar blir över som växlas till 20 kuber och blir 24 kuber med de 4 som fanns. Var och en får 8 kuber. Kvoten är 178. Kontroll: 178 · 3 = 534. När du tar ner siffran gör du alltså en växling av resten.",
  },
};

// ───────── Lektion 6: Tvåsiffrig delare ─────────
export const lesson6: Lesson = {
  id: "w4-l6", worldId: "w4", title: "Division med tvåsiffrig delare", grades: "åk 4–6",
  summary: "Dela i omgångar: ta ut tiogrupper först, sedan resten (trappan).",
  lgr: "Metoder för beräkningar med naturliga tal vid skriftlig beräkning och överslagsräkning",
  objectives: ["Dividera med tvåsiffrig delare genom att ta ut hela grupper i omgångar.", "Använda 10 · delaren som hållpunkt.", "Använda överslag för att välja rimliga omgångar."],
  intro: "$156 \\div 12$ ser svårt ut – men vi behöver inte räkna siffra för siffra. Vi kan ta ut **stora grupper** i taget: först tiogrupper ($10 \\cdot 12 = 120$), sedan det som finns kvar. Metoden kallas ofta *trappan* eller *division i omgångar* och bygger på samma idé som innehållsdivision.",
  theory: [
    { heading: "Ta ut stora grupper", body: "$156 \\div 12$: hur många tolvor ryms? Börja med 10 tolvor: $10 \\cdot 12 = 120$. Kvar: $156 - 120 = 36$. Hur många tolvor i 36? $3 \\cdot 12 = 36$. Totalt $10 + 3 = 13$ tolvor.", visual: { type: "numberline", min: 0, max: 156, step: 12, marks: [120, 156], labelEvery: 60 } },
    { heading: "Det är innehållsdivision", body: "Vi hoppar med steg om 12 på tallinjen, men tar flera hopp åt gången: ett jättehopp om 10 tolvor (120), sedan 3 små. Det är samma sak som upprepad subtraktion, bara snabbare." },
    { heading: "Överslag hjälper", body: "$156 \\div 12$: 12 är nästan 10, och $156 \\div 10 \\approx 15$. Kvoten bör alltså ligga strax under 16. 13 är rimligt." },
    { heading: "Kontroll", body: "$13 \\cdot 12 = 156$. Vid rest: $\\text{kvot} \\cdot \\text{delare} + \\text{rest} = \\text{dividend}$." },
  ],
  worked: [
    { title: "I omgångar", problem: "Beräkna 156 ÷ 12.", steps: [{ text: "Ta ut 10 grupper.", math: "10 \\cdot 12 = 120" }, { text: "Kvar:", math: "156 - 120 = 36" }, { text: "Hur många tolvor i 36?", math: "3 \\cdot 12 = 36" }, { text: "Kvot:", math: "10 + 3 = 13" }], why: "$156 = 120 + 36 = 10 \\cdot 12 + 3 \\cdot 12 = 13 \\cdot 12$ – distributiva lagen baklänges.", alternative: "Med liggande stolen: 15 ÷ 12 = 1 rest 3; 36 ÷ 12 = 3: kvot 13." },
    { title: "Två tiogrupper", problem: "Beräkna 462 ÷ 21.", steps: [{ text: "Ta ut 20 grupper.", math: "20 \\cdot 21 = 420" }, { text: "Kvar:", math: "462 - 420 = 42" }, { text: "Hur många 21:or i 42?", math: "2 \\cdot 21 = 42" }, { text: "Kvot:", math: "20 + 2 = 22" }], why: "Vi tog ut så stora grupper som möjligt först.", alternative: "Överslag: $462 \\approx 460$ och $21 \\approx 20$: $460 \\div 20 = 23$ – nära 22." },
  ],
  drawing: { task: "Rita en tallinje 0–156 med ett stort hopp till 120 och ett litet till 156. Skriv hur många tolvor varje hopp motsvarar.", tool: "numberline" },
  pupils: [{ pupil: "Ebba", said: "156 ÷ 12 går inte, jag kan bara dela med ett ensiffrigt tal.", misconception: "Tror att metoden bara fungerar för ensiffriga delare.", response: "Visa att 12 · 10 = 120 är en bra hållpunkt. Fråga: ”Hur många tolvor kan du ta ut direkt?”" }],
  knowledge: [
    { id: "chunkDiv", skill: "w4-l6.chunk", gen: (rng) => { const b = rng.int(11, 19), q = rng.int(11, 19); return numeric(`cd-${b}-${q}`, "w4-l6.chunk", `${sv(b * q)} ÷ ${b} = ?`, q, `10 · ${b} = ${10 * b}, kvar ${b * q - 10 * b} = ${q - 10} · ${b}. Kvot ${q}.`, ["Ta ut 10 grupper först."]); } },
    { id: "chunkDiv2", skill: "w4-l6.chunk", gen: (rng) => { const b = rng.int(12, 24), q = rng.int(21, 29); return numeric(`c2-${b}-${q}`, "w4-l6.chunk", `${sv(b * q)} ÷ ${b} = ?`, q, `20 · ${b} = ${20 * b}, kvar ${b * q - 20 * b} = ${q - 20} · ${b}. Kvot ${q}.`, ["Ta ut 20 grupper först."]); } },
    { id: "benchmark", skill: "w4-l6.benchmark", gen: (rng) => { const b = rng.int(12, 49); return numeric(`bm-${b}`, "w4-l6.benchmark", `10 · ${b} = ?`, b * 10, `Tiogruppen är en bra hållpunkt: ${b * 10}.`, ["Flytta siffrorna en plats."]); } },
    { id: "estimateMc", skill: "w4-l6.estimate", gen: (rng) => { const b = rng.int(11, 19), q = rng.int(12, 18); return mc(`em-${b}-${q}`, "w4-l6.estimate", `Vilken kvot är rimlig för ${sv(b * q)} ÷ ${b}? (Tips: ${b} är nära 10.)`, String(q), [{ text: String(q * 10), note: "Orimligt stort: " + q * 10 + " · " + b + " är mycket mer än " + b * q + "." }, { text: String(Math.round(q / 10) || 1) }, { text: String(q + 40) }], `Kontroll: ${q} · ${b} = ${sv(b * q)}.`, ["Hur många tior ryms ungefär?"], rng); } },
    { id: "whyChunk", skill: "w4-l6.concept", gen: (rng) => mc("wc", "w4-l6.concept", "Varför kan man räkna 156 ÷ 12 som 120 ÷ 12 + 36 ÷ 12?", "För att 156 = 120 + 36 och varje del kan delas för sig (distributiva lagen)", [{ text: "För att man får dela vilka tal som helst med 12" }, { text: "För att 120 och 36 är jämna tal" }, { text: "Det går inte att göra så" }], "Division fördelar sig över en summa i dividenden: $(a + b) \\div c = a \\div c + b \\div c$.", [], rng) },
  ],
  method: [
    { id: "chunkSteps", skill: "w4-l6.chunk", gen: (rng) => { const b = rng.int(11, 19), u = rng.int(1, 9), q = 10 + u; return multifield(`ch-${b}-${q}`, "w4-l6.chunk", `Räkna ${sv(b * q)} ÷ ${b} i omgångar.`, [{ label: `10 · ${b} =`, accept: [10 * b] }, { label: `Kvar (${sv(b * q)} − ${10 * b})`, accept: [b * q - 10 * b] }, { label: "Antal grupper till", accept: [u] }, { label: "Kvot", accept: [q] }], `${10 * b} + ${u * b} = ${b * q}; kvot 10 + ${u} = ${q}.`, ["Ta ut tiogruppen först."]); } },
    { id: "chunkSteps2", skill: "w4-l6.chunk", gen: (rng) => { const b = rng.int(12, 24), u = rng.int(1, 9), q = 20 + u; return multifield(`c2-${b}-${q}`, "w4-l6.chunk", `Räkna ${sv(b * q)} ÷ ${b} i omgångar (ta ut 20 grupper först).`, [{ label: `20 · ${b} =`, accept: [20 * b] }, { label: "Kvar", accept: [b * q - 20 * b] }, { label: "Antal grupper till", accept: [u] }, { label: "Kvot", accept: [q] }], `${20 * b} + ${u * b} = ${b * q}; kvot 20 + ${u} = ${q}.`, []); } },
  ],
  representation: [
    { id: "bigJump", skill: "w4-l6.numberline", gen: (rng) => { const b = rng.int(11, 19), q = rng.int(12, 19); return numberlineEx(`bj-${b}-${q}`, "w4-l6.numberline", `Du ska räkna ${sv(b * q)} ÷ ${b} på tallinjen med steg om ${b}. Markera var du hamnar efter ett stort hopp med 10 tolvor-grupper (10 · ${b}).`, 10 * b, { min: 0, max: b * q, step: b, labelEvery: b * 5 }, `10 · ${b} = ${10 * b}.`, ["Tio hopp om " + b + "."]); } },
    { id: "areaSplit", skill: "w4-l6.area", gen: (rng) => { const b = rng.int(11, 19), u = rng.int(2, 8), q = 10 + u; return withVisual(multifield(`as-${b}-${q}`, "w4-l6.area", `En rektangel har arean ${sv(b * q)} och bredden ${b}. Den delas i en del med 10 rader och en del med resten. Fyll i.`, [{ label: "Area av 10 rader", accept: [10 * b] }, { label: "Area av resten", accept: [b * q - 10 * b] }, { label: "Antal rader i resten", accept: [u] }, { label: "Höjd totalt", accept: [q] }], `${10 * b} + ${u * b} = ${b * q}; höjd ${q}.`, []), { type: "area", a: b, b: q }); } },
  ],
  teacher: {
    title: "Dela i omgångar",
    scenarios: ["Ebba (åk 6) säger att hon inte kan räkna 156 ÷ 12 eftersom ”man kan bara dela med ensiffriga tal i liggande stolen”."],
    prompt: "Visa Ebba hur hon kan räkna 156 ÷ 12 genom att dela i omgångar, och förklara varför metoden fungerar (vilken räknelag den bygger på). Förklara också hur hon kan kontrollera svaret.",
    minChars: 170,
    rubric: {
      minConcepts: 3,
      concepts: [
        { id: "tio", label: "att ta ut 10 grupper (120) först", any: ["10 · 12", "10 gånger 12", "120", "tiogrupp", "10 grupper", "tio grupper"] },
        { id: "rest", label: "att hantera det som är kvar (36 = 3 · 12)", any: ["36", "3 · 12", "3 gånger 12", "kvar"] },
        { id: "svar", label: "rätt svar 13", any: ["13"] },
        { id: "lag", label: "distributiva lagen / dela upp 156 = 120 + 36 / kontroll 13 · 12", any: ["distributiv", "120 + 36", "13 · 12", "13·12", "kontroll", "dela upp"] },
      ],
    },
    modelAnswer: "Ebba, du kan ta ut stora grupper i omgångar. Först 10 tolvor: 10 · 12 = 120. Då är 156 − 120 = 36 kvar, och 3 · 12 = 36. Alltså ryms 10 + 3 = 13 tolvor i 156, så 156 ÷ 12 = 13. Metoden fungerar eftersom vi delar upp 156 som 120 + 36 och delar varje del för sig – distributiva lagen. Kontroll: 13 · 12 = 156.",
  },
};

// ───────── Lektion 7: Rimlighet och problem ─────────
export const lesson7: Lesson = {
  id: "w4-l7", worldId: "w4", title: "Överslag, rimlighet och problemlösning", grades: "åk 4–6",
  summary: "Bedöm om en kvot är rimlig och välj rätt tolkning i textuppgifter.",
  lgr: "Rimlighetsbedömning vid uppskattningar och beräkningar; strategier för att lösa matematiska problem",
  objectives: ["Göra överslag vid division med lämpliga tal.", "Upptäcka orimliga kvoter (storleksordning).", "Välja räknesätt och tolka resten i textuppgifter."],
  intro: "De vanligaste felen vid division handlar om storleksordning: ett saknat nolla i kvoten, en felaktig växling, en kvot som är tio gånger för liten. Ett överslag på tio sekunder fångar dem. Och i textuppgifter avgör **vad frågan vill veta** hur resten tolkas.",
  theory: [
    { heading: "Överslag med lämpliga tal", body: "Byt ut dividenden mot ett närliggande tal som delar sig bra: $4\\,536 \\div 6 \\approx 4\\,800 \\div 6 = 800$. Svaret bör ligga nära 800 – 756 är rimligt, 75 är det inte." },
    { heading: "Rimlighet", body: "Fråga: ska kvoten vara större eller mindre än dividenden? (Delar vi med ett tal större än 1 blir den mindre.) Hur många siffror bör den ha? Slutar den på rätt siffra? ($756 \\cdot 6$ slutar på 6, precis som 4 536.)" },
    { heading: "Välj tolkning", body: "Läs frågan: *hur många per grupp*, *hur många grupper*, *hur många fulla* eller *hur många behövs*? Det bestämmer om vi avrundar upp, ner eller delar resten rättvist." },
  ],
  worked: [
    { title: "Fånga ett fel", problem: "Elev: 4 536 ÷ 6 = 75. Är det rimligt?", steps: [{ text: "Byt 4 536 mot 4 800.", math: "4\\,800 \\div 6 = 800" }, { text: "Kvoten bör vara nära 800 men eleven fick 75 – tio gånger för liten.", math: "75 \\ll 800" }, { text: "Rätt kvot:", math: "756" }], why: "Överslaget visar storleksordningen. Felet beror troligen på en saknad siffra i kvoten.", alternative: "Kontrollera: $75 \\cdot 6 = 450 \\neq 4\\,536$." },
    { title: "Tolka resten", problem: "158 kr ska delas på 7 personer, bara hela kronor. Hur mycket får var och en, och hur många kronor blir över?", steps: [{ text: "Dividera.", math: "158 \\div 7 = 22\\ \\text{rest}\\ 4" }, { text: "Var och en får 22 kr, 4 kr blir över.", math: "22 \\cdot 7 + 4 = 158" }], why: "Här söker vi hur många kronor var och en får – resten är pengar som inte går att dela i hela kronor.", alternative: "Resten kan delas i kommande världar med bråk och decimaltal." },
  ],
  drawing: { task: "Rita en tallinje 0–1 000 och markera ett överslag för 4 536 ÷ 6 (cirka 800) samt elevens svar 75. Vilken ser rimlig ut?", tool: "numberline" },
  pupils: [{ pupil: "Noel", said: "4 536 ÷ 6 = 75. Jag tog 45 ÷ 6 = 7 och 36 ÷ 6 = 6 – det blir 75?", misconception: "Delar delar av talet var för sig utan att ta hänsyn till platsvärde och rest.", response: "Fråga: ”Är 75 · 6 ungefär 4 536?” Låt Noel göra ett överslag: 4 800 ÷ 6." }],
  knowledge: [
    { id: "estimate", skill: "w4-l7.estimate", gen: (rng) => { const b = rng.int(3, 9), q = rng.int(60, 99) * 10 + rng.int(1, 9); const a = b * q; const compat = Math.round(a / (b * 100)) * b * 100; return numeric(`es-${a}-${b}`, "w4-l7.estimate", `Överslag: ${sv(a)} ≈ ${sv(compat)}. Räkna ${sv(compat)} ÷ ${b}.`, compat / b, `${sv(compat)} ÷ ${b} = ${sv(compat / b)}.`, ["Tabellfaktat och hundratal."]); } },
    { id: "reasonable", skill: "w4-l7.reasonable", gen: (rng) => { const b = rng.int(3, 9), q = rng.int(31, 99) * 10 + rng.int(1, 9); const a = b * q; return mc(`rs-${a}-${b}`, "w4-l7.reasonable", `Vilket svar är rimligt för ${sv(a)} ÷ ${b}?`, sv(q), [{ text: sv(Math.round(q / 10)), note: "Tio gånger för litet." }, { text: sv(q * 10), note: "Tio gånger för stort." }, { text: sv(Math.round(q / 100)), note: "Hundra gånger för litet." }], `Överslag visar storleksordningen. Kontroll: ${sv(q)} · ${b} = ${sv(a)}.`, ["Gör ett överslag."], rng); } },
    { id: "checkMc", skill: "w4-l7.check", gen: (rng) => { const b = rng.int(3, 9), q = rng.int(31, 99); return mc(`ck-${b}-${q}`, "w4-l7.check", `Du har räknat ${sv(b * q)} ÷ ${b} = ${q}. Hur kontrollerar du svaret?`, `${q} · ${b} ska bli ${sv(b * q)}`, [{ text: `${q} + ${b} ska bli ${sv(b * q)}` }, { text: `${sv(b * q)} · ${b} ska bli ${q}` }, { text: `${q} ÷ ${b} ska bli ${sv(b * q)}` }], "Division ångras med multiplikation.", [], rng); } },
    { id: "wordProblem", skill: "w4-l7.word", gen: (rng) => { const b = rng.int(3, 9), q = rng.int(21, 79); return numeric(`wp-${b}-${q}`, "w4-l7.word", `${sv(b * q)} kr ska delas lika på ${b} personer. Hur mycket får var och en?`, q, `${sv(b * q)} ÷ ${b} = ${q}.`, ["Delningsdivision."], "kr"); } },
    { id: "wordRest", skill: "w4-l7.interpret", gen: (rng) => { const b = rng.int(4, 9), q = rng.int(10, 40), r = rng.int(1, b - 1), a = b * q + r; return numeric(`wr-${a}-${b}`, "w4-l7.interpret", `${a} bullar ska packas i kartonger med ${b} bullar i varje. Hur många kartonger behövs för att alla bullar ska få plats?`, q + 1, `${a} ÷ ${b} = ${q} rest ${r}. De ${r} sista bullarna behöver en extra kartong: ${q + 1}.`, ["Vad gör du med resten?"]); } },
  ],
  method: [
    { id: "estimateSteps", skill: "w4-l7.estimate", gen: (rng) => { const b = rng.int(3, 9), q = rng.int(31, 99) * 10 + rng.int(1, 9), a = b * q, compat = Math.round(a / (b * 100)) * b * 100; return multifield(`es2-${a}-${b}`, "w4-l7.estimate", `Räkna ${sv(a)} ÷ ${b} med överslag och exakt.`, [{ label: "Närliggande tal i " + b + ":ans tabell (hundratal)", accept: [compat] }, { label: "Överslag (kvot)", accept: [compat / b] }, { label: "Exakt kvot", accept: [q] }], `Överslag ${sv(compat / b)}, exakt ${sv(q)}.`, []); } },
    { id: "wordSteps", skill: "w4-l7.interpret", gen: (rng) => { const b = rng.int(4, 9), q = rng.int(10, 40), r = rng.int(1, b - 1), a = b * q + r; return multifield(`ws-${a}-${b}`, "w4-l7.interpret", `${a} bullar packas i kartonger med ${b} i varje. Fyll i.`, [{ label: "Fulla kartonger", accept: [q] }, { label: "Bullar över", accept: [r] }, { label: "Kartonger som behövs", accept: [q + 1] }], `${q} fulla och ${r} över – en extra kartong: ${q + 1}.`, []); } },
  ],
  representation: [
    { id: "estimateLine", skill: "w4-l7.numberline", gen: (rng) => { const b = rng.int(3, 9), k = rng.int(2, 9); return numberlineEx(`el-${b}-${k}`, "w4-l7.numberline", `Överslaget för ${sv(k * b * 100 + 20)} ÷ ${b} är ${k * 100}. Markera överslaget på tallinjen.`, k * 100, { min: 0, max: 1000, step: 100, labelEvery: 500 }, `${sv(k * b * 100)} ÷ ${b} = ${k * 100}.`, []); } },
    { id: "barModel", skill: "w4-l7.bar", gen: (rng) => { const b = rng.int(3, 9), q = rng.int(21, 79); return multifield(`bm-${b}-${q}`, "w4-l7.bar", `En stapel visar helheten ${sv(b * q)} delad i ${b} lika delar. Fyll i.`, [{ label: "Antal delar", accept: [b] }, { label: "En del (division)", accept: [q] }, { label: `Kontroll: ${b} · (en del) =`, accept: [b * q] }], `${sv(b * q)} ÷ ${b} = ${q}.`, []); } },
  ],
  teacher: {
    title: "Fånga felet med ett överslag",
    scenarios: ["Noel (åk 5) har räknat 4 536 ÷ 6 = 75 och är nöjd: \"45 ÷ 6 är 7 och 36 ÷ 6 är 6, så 76 ungefär.\" Han tycker att överslag är onödigt."],
    prompt: "Visa Noel hur ett överslag avslöjar att 75 är för litet, och hjälp honom hitta rätt svar. Förklara också varför hans metod (45 och 36 var för sig) går fel.",
    minChars: 170,
    rubric: {
      minConcepts: 3,
      concepts: [
        { id: "overslag", label: "ett överslag (4 800 ÷ 6 = 800)", any: ["4 800", "4800", "800", "överslag"] },
        { id: "rimlig", label: "att 75 är orimligt litet / tio gånger för litet", any: ["tio gånger", "för litet", "orimlig", "för lågt", "inte rimlig"] },
        { id: "svar", label: "rätt svar 756", any: ["756"] },
        { id: "kontroll", label: "kontroll med multiplikation (756 · 6 = 4 536)", any: ["756 · 6", "756·6", "75 · 6", "450", "kontroll", "4 536"] },
        { id: "metod", label: "att platsvärde/växling saknas i hans delning", any: ["platsvärde", "växl", "rest", "hundratal", "tiotal"] },
      ],
    },
    modelAnswer: "Noel, ett överslag visar storleksordningen: 4 536 är nära 4 800, och 4 800 ÷ 6 = 800. Då ser vi att 75 är tio gånger för litet. Kontrollera också med multiplikation: 75 · 6 = 450, inte 4 536. Din metod delar 45 och 36 var för sig, men 45 är egentligen 45 hundratal och resten 3 hundratal måste växlas till tiotal. Om man gör det steg för steg får man 756, och 756 · 6 = 4 536. Överslaget tar tio sekunder och fångar fel av den här storleken.",
  },
};
