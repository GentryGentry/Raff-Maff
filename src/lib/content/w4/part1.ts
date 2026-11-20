import type { Lesson } from "../types";
import { mc, numeric, multifield, sv, numberlineEx, withVisual } from "@/lib/engine/gen-helpers";

// ───────── Lektion 1: Delning och innehåll ─────────
export const lesson1: Lesson = {
  id: "w4-l1", worldId: "w4", title: "Division – delning och innehåll", grades: "åk 4–6",
  summary: "De två betydelserna av division: dela rättvist och ta reda på hur många som ryms.",
  lgr: "De fyra räknesätten och regler för deras användning vid beräkningar med naturliga tal",
  objectives: ["Skilja mellan delningsdivision och innehållsdivision.", "Skriva en division och kontrollera den med multiplikation.", "Koppla division till rektangelns area."],
  intro: "$12 \\div 4 = 3$ kan betyda två olika saker. *12 äpplen delas rättvist på 4 barn* – eller *12 meter snöre klipps i bitar om 4 meter*. Räkningen är densamma, men tanken är en annan. En lärare som bara kan den ena tolkningen kan inte hjälpa elever som fastnar på den andra.",
  theory: [
    { heading: "Delning", body: "**Delningsdivision:** en mängd delas rättvist på ett *givet antal* grupper. $12 \\div 4$: 12 äpplen på 4 barn, var och en får 3. Vi söker **hur många i varje grupp**." },
    { heading: "Innehåll", body: "**Innehållsdivision:** vi vet hur stor varje grupp är och söker **hur många grupper** det blir. $12 \\div 4$: 12 meter snöre, bitar om 4 meter ger 3 bitar. Här hoppar vi med steg om 4 på tallinjen tills vi når 12.", visual: { type: "numberline", min: 0, max: 12, step: 4, marks: [4, 8, 12], labelEvery: 4 } },
    { heading: "Division kontrolleras med multiplikation", body: "$12 \\div 4 = 3$ stämmer eftersom $3 \\cdot 4 = 12$. Dividend $=$ kvot $\\cdot$ delare. Termerna: **dividend** (talet som delas), **delare** (det man delar med), **kvot** (resultatet)." },
    { heading: "Division och area", body: "En rektangel med arean 24 och bredden 6 har höjden $24 \\div 6 = 4$. Ur multiplikationen $6 \\cdot 4 = 24$ får vi divisionen.", visual: { type: "area", a: 6, b: 4 } },
  ],
  worked: [
    { title: "Delning", problem: "48 kr delas lika på 6 personer. Hur mycket får var och en?", steps: [{ text: "Delningsdivision: antalet grupper (6) är givet.", math: "48 \\div 6" }, { text: "Vilket tal gånger 6 är 48?", math: "8 \\cdot 6 = 48" }, { text: "Var och en får:", math: "8\\ \\text{kr}" }], why: "Division är inversen till multiplikation: vi söker faktorn som saknas.", alternative: "Dela ut 1 krona i taget till var och en tills de 48 kronorna är slut." },
    { title: "Innehåll", problem: "Ett rep på 42 meter klipps i bitar om 6 meter. Hur många bitar?", steps: [{ text: "Innehållsdivision: bitens storlek (6) är given.", math: "42 \\div 6" }, { text: "Hur många 6:or ryms i 42?", math: "7 \\cdot 6 = 42" }, { text: "Antal bitar:", math: "7" }], why: "Samma räkning som i delning, men vi söker antalet grupper.", alternative: "Hoppa på tallinjen med steg om 6 tills du når 42 – räkna hoppen." },
  ],
  drawing: { task: "Rita 12 prickar och gör dem till 4 lika stora grupper (delning) – och sedan till grupper om 4 (innehåll). Hur många grupper blev det i varje fall?", tool: "grid" },
  pupils: [{ pupil: "Maria", said: "Division är bara att dela rättvist. Vad ska 12 ÷ 4 vara när man klipper snören?", misconception: "Känner bara delningstolkningen och blir förvirrad av innehåll.", response: "Visa att det är samma räkning med olika frågor. Rita tallinjen och låt Maria hoppa med steg om 4. Berätta båda historierna för 12 ÷ 4." }],
  knowledge: [
    { id: "fact", skill: "w4-l1.facts", gen: (rng, { level }) => { const b = rng.int(2, level > 1 ? 9 : 6), q = rng.int(2, 9); return numeric(`f-${b}-${q}`, "w4-l1.facts", `${b * q} ÷ ${b} = ?`, q, `${q} · ${b} = ${b * q}, så ${b * q} ÷ ${b} = ${q}.`, ["Vilket tal gånger " + b + " ger " + b * q + "?"]); } },
    { id: "whichType", skill: "w4-l1.meaning", gen: (rng) => { const b = rng.int(3, 6), q = rng.int(3, 8); const share = rng.chance(0.5); const text = share ? `${b * q} kulor delas lika på ${b} barn.` : `Du har ${b * q} meter band och klipper bitar om ${b} meter.`; return mc(`wt-${b}-${q}-${share}`, "w4-l1.meaning", `${text} Vilken sorts division är det?`, share ? "Delning (hur många i varje grupp)" : "Innehåll (hur många grupper)", [{ text: share ? "Innehåll (hur många grupper)" : "Delning (hur många i varje grupp)" }], share ? "Antalet grupper (barn) är givet; vi söker hur många kulor var och en får." : "Gruppens storlek (bitens längd) är given; vi söker hur många bitar det blir.", ["Är det antalet grupper eller gruppens storlek som är känt?"], rng); } },
    { id: "wordShare", skill: "w4-l1.word", gen: (rng) => { const b = rng.int(3, 9), q = rng.int(12, 48); return numeric(`ws-${b}-${q}`, "w4-l1.word", `${sv(b * q)} kr delas lika på ${b} personer. Hur många kronor får var och en?`, q, `${sv(b * q)} ÷ ${b} = ${q}.`, ["Rita och dela."], "kr"); } },
    { id: "wordContent", skill: "w4-l1.word", gen: (rng) => { const b = rng.int(3, 9), q = rng.int(4, 15); return numeric(`wc-${b}-${q}`, "w4-l1.word", `En låda rymmer ${b} burkar. Hur många lådor behövs för ${b * q} burkar?`, q, `${b * q} ÷ ${b} = ${q}.`, ["Hur många " + b + ":or ryms i " + b * q + "?"], "lådor"); } },
    { id: "checkMul", skill: "w4-l1.inverse", gen: (rng) => { const b = rng.int(3, 9), q = rng.int(3, 9); return numeric(`cm-${b}-${q}`, "w4-l1.inverse", `${b * q} ÷ ${b} = ${q}. Kontrollera: ${q} · ${b} = ?`, b * q, `Kvot · delare = dividend.`, ["Multiplikation ångrar division."]); } },
  ],
  method: [
    { id: "divAndCheck", skill: "w4-l1.inverse", gen: (rng) => { const b = rng.int(3, 9), q = rng.int(6, 19); return multifield(`dc-${b}-${q}`, "w4-l1.inverse", `Räkna ${b * q} ÷ ${b} och kontrollera med multiplikation.`, [{ label: `${b * q} ÷ ${b} =`, accept: [q] }, { label: `Kontroll: ${q} · ${b} =`, accept: [b * q] }], `${b * q} ÷ ${b} = ${q}; ${q} · ${b} = ${b * q}.`, ["Tabeller och uppdelning hjälper."]); } },
    { id: "terms", skill: "w4-l1.terms", gen: (rng) => { const b = rng.int(3, 9), q = rng.int(3, 9); return multifield(`tm-${b}-${q}`, "w4-l1.terms", `I divisionen ${b * q} ÷ ${b} = ${q}: vilket tal är dividend, delare och kvot?`, [{ label: "Dividend", accept: [b * q] }, { label: "Delare", accept: [b] }, { label: "Kvot", accept: [q] }], "Dividenden delas, delaren delar och kvoten är resultatet.", []); } },
  ],
  representation: [
    { id: "areaHeight", skill: "w4-l1.area", gen: (rng) => { const w = rng.int(3, 9), h = rng.int(3, 8); return withVisual(multifield(`ah-${w}-${h}`, "w4-l1.area", `Bilden visar en rektangel av rutor. Hur många rutor är den bred och hög, vilken area har den, och vilken division ger höjden?`, [{ label: "Bredd (rutor)", accept: [w] }, { label: "Höjd (rutor)", accept: [h] }, { label: "Area", accept: [w * h] }, { label: `${w * h} ÷ ${w} =`, accept: [h] }], `Area ${w * h}, bredd ${w}: höjd = ${w * h} ÷ ${w} = ${h}.`, []), { type: "area", a: w, b: h }); } },
    { id: "equalParts", skill: "w4-l1.numberline", gen: (rng) => { const k = rng.int(3, 6), s = rng.int(2, 9), a = k * s * 5; return numberlineEx(`ep-${a}-${k}`, "w4-l1.numberline", `Sträckan 0–${a} delas i ${k} lika långa delar. Markera första delningsstrecket (${a} ÷ ${k}).`, a / k, { min: 0, max: a, step: a / k, labelEvery: a / k }, `${a} ÷ ${k} = ${a / k}.`, ["Hur lång är varje del?"]); } },
  ],
  teacher: {
    title: "Två betydelser av division",
    scenarios: ["Maria (åk 4) kan 12 ÷ 4 = 3 när ”12 äpplen delas på 4 barn”. Men på uppgiften ”Du har 12 meter snöre och klipper bitar om 4 meter. Hur många bitar?” blir hon osäker: \"Det är ju inte att dela?\""],
    prompt: "Förklara för Maria att båda uppgifterna är 12 ÷ 4. Beskriv skillnaden mellan delning och innehåll, och visa hur du kan lösa snöre-uppgiften med en modell (tallinje, bild eller multiplikation).",
    minChars: 160,
    rubric: {
      minConcepts: 3,
      concepts: [
        { id: "samma", label: "att båda är samma räkning 12 ÷ 4 = 3", any: ["samma räkning", "samma tal", "12 ÷ 4", "båda", "samma sak"] },
        { id: "skillnad", label: "skillnaden: antal grupper givet vs gruppens storlek givet", any: ["hur många i varje", "hur många bitar", "hur många grupper", "storlek", "antal grupper", "innehåll", "delning"] },
        { id: "modell", label: "en modell (tallinje, hopp, bild)", any: ["tallinje", "hopp", "rita", "bild", "streck", "pratar", "grupper om 4"] },
        { id: "kontroll", label: "kontroll med multiplikation (3 · 4 = 12)", any: ["3 · 4", "3·4", "multiplikation", "gånger"] },
      ],
    },
    modelAnswer: "Maria, båda uppgifterna är samma räkning: 12 ÷ 4 = 3. Skillnaden är vad vi frågar efter. När äpplena delas på 4 barn är antalet grupper givet och vi söker hur många var och en får (delning). När vi klipper snöret i bitar om 4 meter är gruppens storlek given och vi söker hur många bitar det blir (innehåll). Rita en tallinje och hoppa med steg om 4 från 0 till 12 – det blir 3 hopp. Vi kan kontrollera med multiplikation: 3 · 4 = 12.",
  },
};

// ───────── Lektion 2: Division och multiplikation ─────────
export const lesson2: Lesson = {
  id: "w4-l2", worldId: "w4", title: "Division och multiplikation hänger ihop", grades: "åk 4–6",
  summary: "Räknefamiljer, saknade tal, division med 1 och 0 – och varför man inte kan dela med noll.",
  lgr: "De fyra räknesätten och regler för deras användning; samband mellan räknesätten",
  objectives: ["Använda multiplikationstabellerna baklänges.", "Skriva räknefamiljer med multiplikation och division.", "Förklara varför division med noll inte går."],
  intro: "Om du kan multiplikationstabellerna kan du redan dividera – du måste bara läsa dem baklänges. Och på köpet får du svaret på en klassisk elevfråga: *Varför kan man inte dela med noll?* Svaret finns i sambandet mellan division och multiplikation.",
  theory: [
    { heading: "Läs tabellen baklänges", body: "$7 \\cdot 6 = 42$ ger två divisioner: $42 \\div 7 = 6$ och $42 \\div 6 = 7$. Frågan ”$42 \\div 7$” betyder ”vilket tal gånger 7 är 42?”." },
    { heading: "Räknefamiljen", body: "Tre tal och fyra likheter: $6 \\cdot 7 = 42$, $7 \\cdot 6 = 42$, $42 \\div 6 = 7$, $42 \\div 7 = 6$. Helheten (42) står alltid först i divisionen. Till skillnad från multiplikation **byter inte division plats**: $42 \\div 7 \\neq 7 \\div 42$." },
    { heading: "Speciella fall", body: "- $n \\div 1 = n$\n\n- $n \\div n = 1$ (för $n \\neq 0$)\n\n- $0 \\div n = 0$ (inget delas upp)\n\n- $n \\div 0$ **går inte att beräkna**: vilket tal gånger 0 är 8? Inget, eftersom allt gånger 0 är 0." },
    { heading: "0 ÷ 0", body: "Även $0 \\div 0$ är inte definierat: *vilket* tal som helst gånger 0 är 0, så det finns inget entydigt svar. Matematiker säger att division med 0 är **odefinierad**." },
  ],
  worked: [
    { title: "Saknat tal", problem: "Lös □ ÷ 6 = 7.", steps: [{ text: "Dividenden är kvot · delare.", math: "\\square = 7 \\cdot 6" }, { text: "Beräkna.", math: "\\square = 42" }, { text: "Kontrollera:", math: "42 \\div 6 = 7" }], why: "Multiplikation ångrar division: dividend = kvot · delare.", alternative: "Rita 7 grupper om 6 och räkna alla." },
    { title: "Varför inte dela med noll?", problem: "Vad skulle 8 ÷ 0 vara?", steps: [{ text: "Division frågar: vilket tal gånger 0 är 8?", math: "\\square \\cdot 0 = 8" }, { text: "Allt gånger 0 blir 0, aldrig 8." }, { text: "Alltså finns det inget svar.", math: "8 \\div 0\\ \\text{är odefinierat}" }], why: "Det går inte att skapa 8 genom att multiplicera med 0.", alternative: "Innehåll: hur många grupper om 0 behövs för att få 8? Hur många hopp om 0 når 8? Aldrig." },
  ],
  drawing: { task: "Rita en rektangel med arean 42 och bredden 6. Skriv räknefamiljen som hör till bilden.", tool: "grid" },
  pupils: [{ pupil: "Vilgot", said: "8 ÷ 0 = 0, för man delar ju ingenting.", misconception: "Blandar ihop 0 ÷ 8 (= 0) med 8 ÷ 0 (odefinierat).", response: "Skilj på 0 ÷ 8 och 8 ÷ 0. Fråga: ”Vilket tal gånger 0 blir 8?” Det finns inget." }],
  knowledge: [
    { id: "fact", skill: "w4-l2.facts", gen: (rng, { level }) => { const b = rng.int(level > 1 ? 6 : 2, 9), q = rng.int(level > 1 ? 6 : 2, 9); return numeric(`f-${b}-${q}`, "w4-l2.facts", `${b * q} ÷ ${b} = ?`, q, `${q} · ${b} = ${b * q}.`, ["Läs tabellen baklänges."]); } },
    { id: "missingDividend", skill: "w4-l2.missing", gen: (rng) => { const b = rng.int(3, 9), q = rng.int(3, 12); return numeric(`md-${b}-${q}`, "w4-l2.missing", `□ ÷ ${b} = ${q}`, b * q, `${q} · ${b} = ${b * q}.`, ["Kvot gånger delare."]); } },
    { id: "missingDivisor", skill: "w4-l2.missing", gen: (rng) => { const b = rng.int(3, 9), q = rng.int(3, 12); return numeric(`mv-${b}-${q}`, "w4-l2.missing", `${b * q} ÷ □ = ${q}`, b, `${b * q} ÷ ${q} = ${b}.`, ["Hur många " + q + ":or ryms i " + b * q + "?"]); } },
    { id: "family", skill: "w4-l2.family", gen: (rng) => { const a = rng.int(3, 9), b = rng.int(3, 9), c = a * b; return mc(`fm-${a}-${b}`, "w4-l2.family", `Du vet att ${a} · ${b} = ${c}. Vilken är alltid sann?`, `${c} ÷ ${b} = ${a}`, [{ text: `${b} ÷ ${c} = ${a}`, note: "Division byter inte plats – dividenden (helheten) står först." }, { text: `${a} ÷ ${b} = ${c}` }, { text: `${c} ÷ ${a} = ${c - a}` }], `Från ${a} · ${b} = ${c} får vi ${c} ÷ ${b} = ${a} och ${c} ÷ ${a} = ${b}.`, ["Helheten står först i divisionen."], rng); } },
    { id: "zero", skill: "w4-l2.zero", gen: (rng) => { const n = rng.int(2, 9) * rng.pick([1, 10]); const zeroDividend = rng.chance(0.5); return zeroDividend ? mc(`z0-${n}`, "w4-l2.zero", `Vad är 0 ÷ ${n}?`, "0", [{ text: `${n}` }, { text: "Går inte att beräkna" }, { text: "1" }], "Ingenting delat i grupper ger ingenting: 0 · " + n + " = 0.", ["Vilket tal gånger " + n + " är 0?"], rng) : mc(`z1-${n}`, "w4-l2.zero", `Vad är ${n} ÷ 0?`, "Går inte att beräkna", [{ text: "0", note: "0 · 0 = 0, inte " + n + "." }, { text: `${n}` }, { text: "1" }], `Vilket tal gånger 0 är ${n}? Inget – därför är division med 0 odefinierad.`, ["Vilket tal gånger 0 är " + n + "?"], rng); } },
    { id: "noncomm", skill: "w4-l2.concept", gen: (rng) => { const b = rng.int(3, 9), q = rng.int(3, 9); return mc(`nc-${b}-${q}`, "w4-l2.concept", `Stämmer ${b * q} ÷ ${b} = ${b} ÷ ${b * q}?`, "Nej – division byter inte plats", [{ text: "Ja – talen kan alltid byta plats" }, { text: "Ja, om kvoten är ett heltal" }], `${b * q} ÷ ${b} = ${q}, men ${b} ÷ ${b * q} är mindre än 1.`, ["Räkna båda."], rng); } },
  ],
  method: [
    { id: "familyFill", skill: "w4-l2.family", gen: (rng) => { const a = rng.int(3, 9), b = rng.int(3, 9), c = a * b; return multifield(`ff-${a}-${b}`, "w4-l2.family", `Skriv räknefamiljen för ${a}, ${b} och ${c}. Fyll i de tre sista talen.`, [{ label: `${b} · ${a} =`, accept: [c] }, { label: `${c} ÷ ${a} =`, accept: [b] }, { label: `${c} ÷ ${b} =`, accept: [a] }], `${a}·${b}=${c}, ${b}·${a}=${c}, ${c}÷${a}=${b}, ${c}÷${b}=${a}.`, ["Helheten står först i divisionerna."]); } },
    { id: "zeroSteps", skill: "w4-l2.zero", gen: (rng) => { const n = rng.int(2, 9); return multifield(`zs-${n}`, "w4-l2.zero", `Undersök ${n} ÷ 0 genom att testa vad □ · 0 blir. Fyll i vad □ · 0 blir om □ = 1, 5 och ${n}, och om ${n} ÷ 0 går att beräkna (1 = ja, 0 = nej).`, [{ label: "1 · 0 =", accept: [0] }, { label: "5 · 0 =", accept: [0] }, { label: `${n} · 0 =`, accept: [0] }, { label: "Går det? (1/0)", accept: [0] }], `Allt gånger 0 är 0, aldrig ${n}, så ${n} ÷ 0 saknar svar.`, []); } },
  ],
  representation: [
    { id: "areaFamily", skill: "w4-l2.area", gen: (rng) => { const a = rng.int(3, 9), b = rng.int(3, 8); return withVisual(multifield(`af-${a}-${b}`, "w4-l2.area", "Rektangeln i bilden visar en multiplikation. Vilka två divisioner hör ihop med den?", [{ label: "Area", accept: [a * b] }, { label: `Area ÷ bredd (${a}) =`, accept: [b] }, { label: `Area ÷ höjd (${b}) =`, accept: [a] }], `${a * b} ÷ ${a} = ${b} och ${a * b} ÷ ${b} = ${a}.`, []), { type: "area", a, b }); } },
    { id: "halfLine", skill: "w4-l2.numberline", gen: (rng) => { const q = rng.int(2, 9), b = rng.pick([2, 4, 5]); return numberlineEx(`hl-${q}-${b}`, "w4-l2.numberline", `Markera ${q * b * 10} ÷ ${b} på tallinjen.`, q * 10, { min: 0, max: 100, step: 10, labelEvery: 50 }, `${q * b * 10} ÷ ${b} = ${q * 10}.`, ["Räkna först tabellfaktat, sedan tiotalen."]); } },
  ],
  teacher: {
    title: "Varför kan man inte dela med noll?",
    scenarios: ["Vilgot (åk 5) frågar: \"Om 0 ÷ 8 är 0, då måste väl 8 ÷ 0 också vara 0? Varför får man inte dela med noll?\""],
    prompt: "Förklara för Vilgot skillnaden mellan 0 ÷ 8 och 8 ÷ 0 och varför division med noll inte går. Använd sambandet mellan division och multiplikation.",
    minChars: 160,
    rubric: {
      minConcepts: 3,
      concepts: [
        { id: "skilj", label: "att 0 ÷ 8 = 0 men 8 ÷ 0 är något annat", any: ["0 ÷ 8", "skillnad", "inte samma", "är något annat", "skilj"] },
        { id: "mult", label: "multiplikationen □ · 0 = 8 har ingen lösning", any: ["gånger 0", "· 0", "·0", "multiplikation", "gånger noll"] },
        { id: "inget", label: "att allt gånger 0 blir 0 / inget svar / odefinierat", any: ["blir 0", "är 0", "inget tal", "odefinierad", "går inte", "inget svar", "ingen lösning"] },
        { id: "kontroll", label: "kontrollen: 0 · 8 = 0 stämmer för 0 ÷ 8", any: ["0 · 8", "0·8", "stämmer", "kontroll"] },
      ],
      misconceptions: [{ pattern: "8 ?÷ ?0 (är|blir|=) ?0\\b", message: "8 ÷ 0 är inte 0 – förklara varför." }],
    },
    modelAnswer: "Vilgot, 0 ÷ 8 och 8 ÷ 0 är olika saker. Division frågar efter ett tal som gånger delaren ger dividenden. För 0 ÷ 8: vilket tal gånger 8 är 0? Det är 0, för 0 · 8 = 0. För 8 ÷ 0: vilket tal gånger 0 är 8? Allt gånger 0 blir 0, så inget tal fungerar – det finns inget svar och vi säger att det är odefinierat. Därför får man inte dela med noll.",
  },
};

// ───────── Lektion 3: Rest ─────────
export const lesson3: Lesson = {
  id: "w4-l3", worldId: "w4", title: "Division med rest", grades: "åk 4–6",
  summary: "När det inte går jämnt upp: rest, kontroll och hur resten tolkas i en berättelse.",
  lgr: "De fyra räknesätten och regler för deras användning; rimlighetsbedömning vid beräkningar",
  objectives: ["Beräkna kvot och rest.", "Kontrollera med kvot · delare + rest = dividend.", "Tolka resten i en situation (avrunda uppåt eller nedåt)."],
  intro: "29 elever ska åka bil, fyra i varje. Hur många bilar behövs? $29 \\div 4 = 7$ rest $1$ – men svaret är **8 bilar**. Resten har betydelse, och vad vi gör med den beror på frågan. Det är en av de vanligaste fällorna i textuppgifter.",
  theory: [
    { heading: "Kvot och rest", body: "$29 \\div 4$: det största antalet fyror som ryms i 29 är 7 ($7 \\cdot 4 = 28$). Det blir **1 över**. Vi skriver $29 \\div 4 = 7$ rest $1$.", visual: { type: "numberline", min: 0, max: 32, step: 4, marks: [28, 29], labelEvery: 8 } },
    { heading: "Kontroll", body: "$\\text{kvot} \\cdot \\text{delare} + \\text{rest} = \\text{dividend}$: $7 \\cdot 4 + 1 = 29$. Resten är alltid **mindre än delaren** – annars ryms ytterligare en grupp." },
    { heading: "Vad gör vi med resten?", body: "- **Hur många fulla grupper?** Resten spelar ingen roll: 29 kr räcker till 7 glassar à 4 kr.\n\n- **Hur många grupper behövs?** Resten kräver en extra grupp: 29 elever behöver 8 bilar.\n\n- **Rättvis delning:** resten kan delas (bråk, decimal) – det kommer i senare världar." },
  ],
  worked: [
    { title: "Kvot och rest", problem: "Beräkna 47 ÷ 6.", steps: [{ text: "Största multipeln av 6 som ryms i 47.", math: "7 \\cdot 6 = 42" }, { text: "Resten:", math: "47 - 42 = 5" }, { text: "Kontroll:", math: "7 \\cdot 6 + 5 = 47" }], why: "Resten är det som blir över efter att vi tagit ut så många hela grupper som möjligt, och är mindre än 6.", alternative: "Hoppa på tallinjen med steg om 6: 42 är sista hoppet före 47." },
    { title: "Tolka resten", problem: "42 elever ska åka bussar som tar 8 elever. Hur många bussar behövs?", steps: [{ text: "Dividera.", math: "42 \\div 8 = 5\\ \\text{rest}\\ 2" }, { text: "5 bussar rymmer 40 elever. 2 elever blir över." }, { text: "De 2 behöver en buss till.", math: "6\\ \\text{bussar}" }], why: "Frågan är hur många bussar som *behövs*, så resten måste få en egen buss.", alternative: "Avrunda kvoten uppåt: $5{,}25 \\to 6$." },
  ],
  drawing: { task: "Rita 29 prickar och gör grupper om 4. Hur många fulla grupper blir det? Hur många blir över?", tool: "grid" },
  pupils: [{ pupil: "Elias", said: "29 elever, fyra per bil: 7 rest 1, så det behövs 7 bilar.", misconception: "Ignorerar resten när frågan kräver att alla ska med.", response: "Fråga: ”Vart tar den sista eleven vägen?” Rita 7 bilar med 4 i varje – en elev står kvar. Det behövs en åttonde bil." }],
  knowledge: [
    { id: "quotient", skill: "w4-l3.quotient", gen: (rng, { level }) => { const b = rng.int(3, 9), q = rng.int(3, level > 1 ? 15 : 9), r = rng.int(1, b - 1); return numeric(`q-${b}-${q}-${r}`, "w4-l3.quotient", `${b * q + r} ÷ ${b} = □ rest ${r}. Vilken är kvoten?`, q, `${q} · ${b} = ${b * q}, och ${b * q} + ${r} = ${b * q + r}.`, ["Hur många " + b + ":or ryms?"]); } },
    { id: "remainder", skill: "w4-l3.remainder", gen: (rng) => { const b = rng.int(3, 9), a = rng.int(20, 80); const r = a % b; return numeric(`r-${a}-${b}`, "w4-l3.remainder", `Vad är resten när du delar ${a} med ${b}? (Skriv 0 om det går jämnt upp.)`, r, `${a} = ${Math.floor(a / b)} · ${b} + ${r}.`, ["Största multipel av " + b + " som ryms i " + a + "."]); } },
    { id: "restest", skill: "w4-l3.check", gen: (rng) => { const b = rng.int(3, 9), q = rng.int(4, 12), r = rng.int(1, b - 1); return numeric(`rt-${b}-${q}-${r}`, "w4-l3.check", `Du har räknat ${q} · ${b} + ${r}. Vilket tal har du delat?`, q * b + r, `${q} · ${b} = ${q * b}, plus ${r} = ${q * b + r}.`, ["Kvot · delare + rest."]); } },
    { id: "interpret", skill: "w4-l3.interpret", gen: (rng) => { const b = rng.int(3, 8), q = rng.int(3, 9), r = rng.int(1, b - 1), a = b * q + r; const need = rng.chance(0.5); return need ? mc(`ip1-${a}-${b}`, "w4-l3.interpret", `${a} personer ska åka bussar som tar ${b} personer. Hur många bussar behövs?`, String(q + 1), [{ text: String(q), note: "Då blir " + r + " personer kvar utan buss." }, { text: String(r) }, { text: String(q - 1) }], `${a} ÷ ${b} = ${q} rest ${r}. De ${r} sista behöver en buss till: ${q + 1}.`, ["Vad händer med resten?"], rng) : mc(`ip2-${a}-${b}`, "w4-l3.interpret", `Du har ${a} kr. En bok kostar ${b} kr. Hur många böcker kan du köpa?`, String(q), [{ text: String(q + 1), note: "Du har inte råd med den sista boken." }, { text: String(r) }, { text: String(q - 1) }], `${a} ÷ ${b} = ${q} rest ${r}. De sista ${r} kronorna räcker inte till en bok: ${q}.`, ["Räcker resten till en hel bok?"], rng); } },
    { id: "impossibleRest", skill: "w4-l3.rule", gen: (rng) => { const b = rng.int(4, 9); return mc(`ir-${b}`, "w4-l3.rule", `Vilket av talen kan INTE vara en rest när man delar med ${b}?`, String(b), [{ text: "0" }, { text: String(b - 1) }, { text: "1" }], `Resten är alltid mindre än delaren – annars ryms en grupp till.`, ["Hur stor kan resten högst vara?"], rng); } },
  ],
  method: [
    { id: "qrCheck", skill: "w4-l3.check", gen: (rng) => { const b = rng.int(3, 9), q = rng.int(4, 14), r = rng.int(1, b - 1), a = b * q + r; return multifield(`qc-${a}-${b}`, "w4-l3.check", `Räkna ${a} ÷ ${b} med rest och kontrollera.`, [{ label: "Kvot", accept: [q] }, { label: "Rest", accept: [r] }, { label: `Kontroll: kvot · ${b} + rest =`, accept: [a] }], `${q} · ${b} + ${r} = ${a}.`, ["Största multipeln som ryms."]); } },
    { id: "interpretSteps", skill: "w4-l3.interpret", gen: (rng) => { const b = rng.int(3, 8), q = rng.int(4, 12), r = rng.int(1, b - 1), a = b * q + r; return multifield(`is-${a}-${b}`, "w4-l3.interpret", `${a} personer ska åka i bilar som tar ${b}. Fyll i.`, [{ label: "Fulla bilar", accept: [q] }, { label: "Personer kvar", accept: [r] }, { label: "Bilar som behövs", accept: [q + 1] }], `${q} fulla bilar och ${r} kvar – en bil till: ${q + 1}.`, []); } },
  ],
  representation: [
    { id: "lastJump", skill: "w4-l3.numberline", gen: (rng) => { const b = rng.int(3, 8), q = rng.int(3, 9), r = rng.int(1, b - 1), a = b * q + r; return numberlineEx(`lj-${a}-${b}`, "w4-l3.numberline", `Hoppa med steg om ${b} från 0. Markera det sista hoppet som inte går förbi ${a}.`, q * b, { min: 0, max: b * 10, step: b, labelEvery: b * 5 }, `${q} hopp om ${b} når ${q * b}; ett till skulle passera ${a}.`, ["Det största strecket som är mindre än " + a + "."]); } },
    { id: "restVisual", skill: "w4-l3.remainder", gen: (rng) => { const b = rng.int(3, 7), q = rng.int(3, 6), r = rng.int(1, b - 1); return withVisual(multifield(`rv-${b}-${q}-${r}`, "w4-l3.remainder", `Du har ${b * q + r} rutor och lägger dem i rader med ${b} rutor. Bilden visar bara de fulla raderna. Hur många fulla rader är det, och hur många rutor ryms inte i någon full rad?`, [{ label: "Fulla rader", accept: [q] }, { label: "Rutor över", accept: [r] }], `${b * q + r} ÷ ${b} = ${q} rest ${r}.`, ["Bilden visar " + b * q + " rutor."]), { type: "area", a: b, b: q }); } },
  ],
  teacher: {
    title: "Vad gör man med resten?",
    scenarios: ["Elias (åk 5) löser: ”29 elever ska åka bil, fyra i varje bil. Hur många bilar behövs?” Han räknar 29 ÷ 4 = 7 rest 1 och svarar 7 bilar."],
    prompt: "Förklara för Elias vad resten betyder i den här uppgiften, och varför rätt svar blir 8 bilar. Förklara också skillnaden mot en uppgift där resten *inte* ska ge en extra grupp.",
    minChars: 160,
    rubric: {
      minConcepts: 3,
      concepts: [
        { id: "rest", label: "att resten 1 är en elev som blir kvar", any: ["en elev", "1 elev", "blir kvar", "blir över", "över"] },
        { id: "svar", label: "rätt svar 8 bilar", any: ["8 bilar", "åtta", "8"] },
        { id: "kontroll", label: "kontroll (7 · 4 = 28, 28 + 1 = 29)", any: ["7 · 4", "28", "kontroll"] },
        { id: "annan", label: "en annan situation där resten ignoreras (t.ex. köpa böcker/glass)", any: ["köpa", "kr", "räcker", "inte råd", "hela", "ska inte", "ingen extra", "ignorer"] },
      ],
    },
    modelAnswer: "Elias, 29 ÷ 4 = 7 rest 1. 7 bilar rymmer 7 · 4 = 28 elever, så en elev blir över och har ingen bil. Frågan är hur många bilar som behövs, så den eleven behöver en åttonde bil. Svaret är alltså 8 bilar. Jämför med en uppgift som ”Du har 29 kr och en glass kostar 4 kr. Hur många glassar kan du köpa?” Där blir svaret 7, för 1 kr över räcker inte till en glass. Resten tolkas olika beroende på frågan.",
  },
};
