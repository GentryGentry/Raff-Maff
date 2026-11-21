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

export function gradeRubric(text: string, rubric: Rubric, minChars: number) {
  const lower = text.toLowerCase();
  const words = lower.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  const uniq = new Set(words);
  const hits = rubric.concepts.filter((c) => c.any.some((k) => lower.includes(k.toLowerCase())));
  const missing = rubric.concepts.filter((c) => !hits.includes(c));
  const flagged = (rubric.misconceptions ?? []).filter((m) => new RegExp(m.pattern, "i").test(lower));
  const tooShort = text.trim().length < minChars;
  const stuffed = words.length > 12 && uniq.size / words.length < 0.45;
  const enough = hits.length >= rubric.minConcepts;
  const pass = enough && flagged.length === 0 && !tooShort && !stuffed;
  return { pass, hits, missing, flagged, tooShort, stuffed };
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
        if (g.tooShort) parts.push(`Förklaringen är för kort (minst ${minChars} tecken).`);
        if (g.stuffed) parts.push("Förklaringen upprepar samma ord – skriv med egna meningar.");
        if (g.flagged.length) parts.push(...g.flagged.map((f) => f.message));
        if (g.hits.length < sol.rubric.minConcepts)
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
    case "column": return { kind: "column", result: s.result, carries: s.carries, partials: s.partials };
    case "areamodel": return { kind: "areamodel", cells: s.cells, total: s.total };
    case "longdiv": return { kind: "longdiv", q: s.q, prod: s.prod, rem: s.rem };
    case "multifield": return { kind: "multifield", values: s.values.map((v) => v[0]) };
    case "text": return { kind: "text", value: s.modelAnswer };
  }
}
