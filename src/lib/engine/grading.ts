import { equivalent, isSimplifiedLike } from "./expr";
import type { Answer, ConcreteExercise, ItemResult, Rubric, Solution } from "./types";

export function normNum(s: string): string {
  return s
    .replace(/[\u2212\u2013\u2014]/g, "-") // minus sign, en dash, em dash -> hyphen-minus
    .replace(/[\s\u00a0\u202f]/g, "") // spaces, nbsp, narrow nbsp
    .replace(/%/g, "") // "35 %" == "35"
    .replace(",", ".")
    .replace(/^\+/, "");
}

/** Canonical form for numeric comparison: "3.50" == "3.5", "03" == "3", "6/8" stays literal. */
export function canonNum(s: string): string {
  const t = normNum(s);
  if (/^-?\d+(\.\d+)?$/.test(t)) {
    const n = Number(t);
    return Number.isFinite(n) ? String(n) : t;
  }
  return t.toLowerCase();
}

/** Gör text jämförbar: gemener, enhetliga räknetecken, utan tusentalsmellanrum och utan mellanrum runt operatorer. */
function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\u00a0\u202f]/g, " ")
    .replace(/[\u2212\u2013\u2014]/g, "-")
    .replace(/(\d) (?=\d{3}(?!\d))/g, "$1")
    .replace(/[×*]/g, "·")
    .replace(/(\d)\s*x\s*(?=\d)/g, "$1·")
    .replace(/\s*([·+\-÷/=])\s*/g, "$1")
    .replace(/\s+/g, " ");
}

/** Räknar ett nyckelord som träffat om det står i texten, med böjning (stam), andra skrivsätt för tal och räknetecken. */
function keywordHit(textN: string, words: string[], kw: string): boolean {
  const k = norm(kw);
  if (textN.includes(k) || textN.replace(/\s/g, "").includes(k.replace(/\s/g, ""))) return true;
  if (/^\p{L}{6,}$/u.test(k)) {
    const stem = k.slice(0, Math.max(5, k.length - 2));
    return words.some((w) => w.startsWith(stem));
  }
  return false;
}

/**
 * Bedömer en förklaring mot en rubrik. Rättningen är medvetet generös: det räcker att täcka de flesta av de viktiga idéerna
 * (en färre än rubrikens krav), böjningar och olika skrivsätt godkänns, och minimilängden är 65 % av den angivna.
 * Skydd mot nyckelordsfyllning och kända missuppfattningar gäller fortfarande.
 */
export function gradeRubric(text: string, rubric: Rubric, minChars: number) {
  const lower = text.toLowerCase();
  const textN = norm(text);
  const words = lower.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  const uniq = new Set(words);
  const hits = rubric.concepts.filter((c) => c.any.some((k) => keywordHit(textN, words, k)));
  const missing = rubric.concepts.filter((c) => !hits.includes(c));
  const flagged = (rubric.misconceptions ?? []).filter((m) => new RegExp(m.pattern, "i").test(lower));
  const need = Math.min(rubric.concepts.length, Math.max(2, rubric.minConcepts - 1));
  const minLen = Math.round(minChars * 0.65);
  const tooShort = text.trim().length < minLen;
  const stuffed = words.length > 12 && uniq.size / words.length < 0.45;
  const enough = hits.length >= need;
  const pass = !rubric.aiOnly && enough && flagged.length === 0 && !tooShort && !stuffed;
  /** Räcker för att en AI-bedömning ska få avgöra: ingen känd missuppfattning, inte för kort, inte fyllning, minst två idéer (elevfall behöver inga nyckelord). */
  const guardsOk = flagged.length === 0 && !tooShort && !stuffed && (!!rubric.aiOnly || hits.length >= Math.min(2, rubric.concepts.length));
  return { pass, hits, missing, flagged, tooShort, stuffed, need, minLen, guardsOk };
}

function expectedAnswerText(sol: Solution, spec: ConcreteExercise["spec"]): string {
  switch (sol.kind) {
    case "mc":
      return spec.kind === "mc" ? spec.options[sol.value] : String(sol.value);
    case "numeric":
      return sol.accept[0];
    case "column":
      return sol.result;
    case "numberline":
    case "fractionbar":
    case "gridshade":
      return String(sol.value);
    case "areamodel":
      return `${sol.cells.join(", ")} → ${sol.total}`;
    case "expr":
      return sol.accept;
    case "point":
      return `(${sol.x}, ${sol.y})`;
    case "bars":
      return sol.values.join(", ");
    case "longdiv":
      return `${sol.quotient}${sol.remainder ? ` rest ${sol.remainder}` : ""}`;
    case "multifield":
      return sol.values.map((v) => v[0]).join(" · ");
    case "text":
      return sol.modelAnswer;
  }
}

/** Grade one exercise. Text exercises are graded by rubric only here; AI may veto afterwards. */
export function gradeExercise(ex: ConcreteExercise, ans: Answer | undefined): ItemResult {
  const { spec, solution: sol } = ex;
  const base = { id: spec.id, skill: spec.skill, kind: spec.kind, correctAnswerText: expectedAnswerText(sol, spec) };
  const wrong = (feedback: string, max = 1): ItemResult => ({ ...base, points: 0, max, correct: false, feedback });
  if (!ans || ans.kind !== sol.kind) return wrong("Inget svar angavs.", ["column", "areamodel", "longdiv"].includes(sol.kind) ? 2 : 1);

  switch (sol.kind) {
    case "mc": {
      const a = ans as Extract<Answer, { kind: "mc" }>;
      const ok = a.value === sol.value;
      const note = !ok && a.value != null ? ex.distractorNotes?.[a.value] : undefined;
      return ok ? { ...base, points: 1, max: 1, correct: true, feedback: "Rätt!" } : wrong(note ?? "Inte riktigt.");
    }
    case "numeric": {
      const a = ans as Extract<Answer, { kind: "numeric" }>;
      const ok = sol.accept.map(canonNum).includes(canonNum(a.value ?? ""));
      return ok ? { ...base, points: 1, max: 1, correct: true, feedback: "Rätt!" } : wrong("Inte riktigt.");
    }
    case "numberline":
    case "fractionbar":
    case "gridshade": {
      const a = ans as { value: number | null };
      const ok = a.value != null && Math.abs(a.value - sol.value) < 1e-9;
      return ok ? { ...base, points: 1, max: 1, correct: true, feedback: "Rätt!" } : wrong("Inte riktigt.");
    }
    case "point": {
      const a = ans as Extract<Answer, { kind: "point" }>;
      if (a.x == null || a.y == null) return wrong("Tryck på en punkt i koordinatsystemet.");
      if (a.x === sol.x && a.y === sol.y) return { ...base, points: 1, max: 1, correct: true, feedback: "Rätt!" };
      const hint = a.y === sol.y ? "x-värdet stämmer inte." : a.x === sol.x ? "y-värdet stämmer inte." : a.x === sol.y && a.y === sol.x ? "Du har bytt plats på x och y: gå först åt sidan (x), sedan uppåt (y)." : "Gå först åt sidan (x) och sedan uppåt (y).";
      return wrong(`Inte riktigt. ${hint}`);
    }
    case "bars": {
      const a = ans as Extract<Answer, { kind: "bars" }>;
      const n = sol.values.length;
      const good = sol.values.filter((v, i) => (a.values?.[i] ?? 0) === v).length;
      return { ...base, points: good / n, max: 1, correct: good === n, feedback: good === n ? "Rätt!" : `${good} av ${n} staplar stämmer. Jämför varje stapel med tabellen.` };
    }
    case "multifield": {
      const a = ans as Extract<Answer, { kind: "multifield" }>;
      const n = sol.values.length;
      let good = 0;
      sol.values.forEach((acc, i) => {
        if (acc.map(canonNum).includes(canonNum(a.values[i] ?? ""))) good++;
      });
      const ok = good === n;
      return {
        ...base,
        points: good / n,
        max: 1,
        correct: ok,
        feedback: ok ? "Rätt!" : `${good} av ${n} fält stämmer.`,
      };
    }
    case "areamodel": {
      const a = ans as Extract<Answer, { kind: "areamodel" }>;
      const cellsOk = sol.cells.every((c, i) => canonNum(a.cells[i] ?? "") === canonNum(c));
      const totalOk = canonNum(a.total ?? "") === canonNum(sol.total);
      // method = delprodukterna, result = summan
      const pts = (cellsOk ? 1 : 0) + (totalOk ? 1 : 0);
      return {
        ...base,
        points: pts,
        max: 2,
        correct: cellsOk && totalOk,
        methodOk: cellsOk,
        feedback: cellsOk
          ? totalOk ? "Rätt delprodukter och rätt summa!" : "Delprodukterna stämmer, men summan är fel."
          : "Någon delprodukt stämmer inte – kontrollera varje ruta för sig.",
      };
    }
    case "column": {
      const a = ans as Extract<Answer, { kind: "column" }>;
      const resultOk = canonNum(a.result ?? "") === canonNum(sol.result);
      const carriesOk =
        sol.carries.length === 0 ||
        sol.carries.every((c, i) => (a.carries?.[i] ?? "").replace(/\s/g, "") === c);
      const partialsOk =
        sol.partials.length === 0 ||
        sol.partials.every((p, i) => canonNum(a.partials?.[i] ?? "") === canonNum(p));
      const methodOk = carriesOk && partialsOk;
      const pts = (resultOk ? 1 : 0) + (methodOk ? 1 : 0);
      let feedback = "Rätt svar och rätt skriftlig metod!";
      if (!resultOk && methodOk) feedback = "Metoden stämmer men svaret är fel – kontrollera uppställningen.";
      else if (resultOk && !methodOk) feedback = "Svaret är rätt, men dina mellansteg (minnessiffror/växlingar/delprodukter) saknas eller stämmer inte. Metoden räknas också.";
      else if (!resultOk && !methodOk) feedback = "Varken svar eller mellansteg stämmer. Gå igenom stegen en kolumn i taget.";
      return { ...base, points: pts, max: 2, correct: resultOk && methodOk, methodOk, feedback };
    }
    case "expr": {
      const a = ans as Extract<Answer, { kind: "expr" }>;
      const variable = ex.spec.kind === "expr" ? ex.spec.variable : "n";
      const typed = (a.value ?? "").trim();
      if (!typed) return wrong("Inget uttryck angavs.");
      if (!equivalent(typed, sol.accept, variable)) return wrong(`Uttrycket är inte rätt, eller så använder det en annan bokstav än ${variable}. Testa genom att sätta in ett tal för ${variable} i både ditt uttryck och uppgiften.`);
      if (sol.simplified && !isSimplifiedLike(typed, sol.accept, variable)) return wrong("Uttrycket har rätt värde men är inte förenklat. Samla lika termer och skriv utan parenteser.");
      return { ...base, points: 1, max: 1, correct: true, feedback: "Rätt!" };
    }
    case "longdiv": {
      const a = ans as Extract<Answer, { kind: "longdiv" }>;
      const n = sol.q.length;
      const eq = (x: string[] | undefined, y: string[]) => y.every((v, i) => canonNum(x?.[i] ?? "") === canonNum(v));
      const qOk = eq(a.q, sol.q);
      const lastRemOk = canonNum(a.rem?.[n - 1] ?? "") === canonNum(sol.rem[n - 1]);
      const resultOk = qOk && lastRemOk;
      const methodOk = eq(a.prod, sol.prod) && eq(a.rem, sol.rem);
      let feedback = "Rätt kvot och rätt delsteg (produkter och rester)!";
      if (!resultOk && methodOk) feedback = "Delstegen stämmer men kvotsiffrorna/resten blev fel – läs av kvoten igen.";
      else if (resultOk && !methodOk) feedback = "Svaret är rätt, men någon produkt eller rest i delstegen stämmer inte. Metoden räknas också.";
      else if (!resultOk && !methodOk) feedback = "Gå igenom steg för steg: hur många gånger går delaren i talet? Skriv produkten och beräkna resten.";
      return { ...base, points: (resultOk ? 1 : 0) + (methodOk ? 1 : 0), max: 2, correct: resultOk && methodOk, methodOk, feedback };
    }
    case "text": {
      const a = ans as Extract<Answer, { kind: "text" }>;
      const minChars = ex.spec.kind === "text" ? ex.spec.minChars : 100;
      const g = gradeRubric(a.value ?? "", sol.rubric, minChars);
      let feedback = "Din förklaring täcker de viktiga delarna.";
      if (!g.pass) {
        const parts: string[] = [];
        if (g.tooShort) parts.push(`Förklaringen är för kort (minst ${g.minLen} tecken).`);
        if (g.stuffed) parts.push("Förklaringen upprepar samma ord – skriv med egna meningar.");
        if (g.flagged.length) parts.push(...g.flagged.map((f) => f.message));
        if (g.hits.length < g.need)
          parts.push(`Förklaringen saknar: ${g.missing.map((m) => m.label).join("; ")}.`);
        feedback = parts.join(" ");
      }
      return { ...base, points: g.pass ? 1 : 0, max: 1, correct: g.pass, feedback };
    }
  }
}

export function pct(points: number, max: number) {
  return max === 0 ? 0 : points / max;
}

/** The answer that would be graded fully correct. Used by tests and the dev "fusk" tooling. */
export function perfectAnswer(ex: ConcreteExercise): Answer {
  const s = ex.solution;
  switch (s.kind) {
    case "mc": return { kind: "mc", value: s.value };
    case "numeric": return { kind: "numeric", value: s.accept[0] };
    case "numberline": return { kind: "numberline", value: s.value };
    case "fractionbar": return { kind: "fractionbar", value: s.value };
    case "gridshade": return { kind: "gridshade", value: s.value };
    case "expr": return { kind: "expr", value: s.accept };
    case "point": return { kind: "point", x: s.x, y: s.y };
    case "bars": return { kind: "bars", values: s.values };
    case "column": return { kind: "column", result: s.result, carries: s.carries, partials: s.partials };
    case "areamodel": return { kind: "areamodel", cells: s.cells, total: s.total };
    case "longdiv": return { kind: "longdiv", q: s.q, prod: s.prod, rem: s.rem };
    case "multifield": return { kind: "multifield", values: s.values.map((v) => v[0]) };
    case "text": return { kind: "text", value: s.modelAnswer };
  }
}
