import { describe, expect, it } from "vitest";
import { ALL_LESSONS, getLesson } from "@/lib/content";
import { gradeRubric } from "@/lib/engine/grading";

const TASKS = ALL_LESSONS.map((l) => ({ id: l.id, t: l.teacher }));

describe("teacher explanations: generous but not gullible", () => {
  it("every model answer passes", () => {
    for (const { id, t } of TASKS) expect(gradeRubric(t.modelAnswer, t.rubric, t.minChars).pass, id).toBe(true);
  });
  it("irrelevant text of full length fails in every lesson", () => {
    const off = "Det här är en lång text som handlar om helt andra saker, till exempel vädret i går, en promenad i skogen med hunden och vad vi åt till middag. Jag tycker att det var en trevlig dag och att vi borde göra om det snart igen, kanske nästa vecka när solen skiner.";
    for (const { id, t } of TASKS) { const g = gradeRubric(off, t.rubric, t.minChars); expect(g.pass, id).toBe(false); }
  });
  it("keyword stuffing and empty answers fail", () => {
    for (const { id, t } of TASKS) {
      expect(gradeRubric("", t.rubric, t.minChars).pass, id).toBe(false);
      const words = t.rubric.concepts.flatMap((c) => c.any).join(" ");
      const stuffed = Array(12).fill(words).join(" ");
      expect(gradeRubric(stuffed, t.rubric, t.minChars).pass, `${id} stuffed`).toBe(false);
    }
  });
  it("a single idea is not enough", () => {
    const filler = "Sedan blir det fredag och vi grillar korv i trädgården medan solen går ner bakom husen och fåglarna sjunger vackert, så vi sitter där hela kvällen och minns sommaren.";
    let checked = 0;
    for (const { id, t } of TASKS) {
      const one = t.rubric.concepts[0].any[0];
      const text = `Jag vill bara nämna ${one}. ${filler}`;
      const g = gradeRubric(text, t.rubric, t.minChars);
      if (g.hits.length === 1) { expect(g.pass, id).toBe(false); checked++; } // en träff räcker aldrig
    }
    expect(checked).toBeGreaterThan(60);
  });
  it("inflections, other number formats and operator spelling count", () => {
    const rubric = { minConcepts: 3, concepts: [
      { id: "a", label: "multiplicera", any: ["multiplicera"] }, { id: "b", label: "tusen", any: ["1 000"] }, { id: "c", label: "tre gånger fem", any: ["3 · 5"] }, { id: "d", label: "sortera", any: ["sortera"] },
    ] };
    const text = "Man multiplicerar med 1000 och 3 × 5 blir femton, men först sorterade vi talen i ordning och kontrollerade svaret en gång till på ett annat sätt.";
    const g = gradeRubric(text, rubric, 100);
    expect(g.hits.map((h) => h.id)).toEqual(["a", "b", "c", "d"]);
  });
  it("a paraphrase with different wording passes (the reported problem)", () => {
    const t = getLesson("w13-l4")!.teacher;
    const own = "Theo, du ska ångra stegen i omvänd ordning, med de motsatta räkneoperationerna. Det sista du gjorde var att dra bort 4, så du lägger till 4: 23 + 4 = 27. Sedan dividerar du med 3, eftersom du multiplicerade med 3, och får 27 ÷ 3 = 9. Talet var 9. Räkna framåt för att kontrollera: 9 · 3 − 4 = 23 stämmer.";
    expect(gradeRubric(own, t.rubric, t.minChars).pass).toBe(true);
    const own2 = "Du har gjort samma räkning en gång till i stället för att gå bakåt. Börja från slutet, 23, ta bort fyran du drog bort, alltså plus 4, och dela sedan med tre. Då blir det 9. Testa sedan att räkna åt andra hållet så ser du att det stämmer.";
    expect(gradeRubric(own2, t.rubric, t.minChars).pass).toBe(true);
  });
  it("known misconceptions still fail", () => {
    const rubric = { minConcepts: 2, concepts: [{ id: "a", label: "a", any: ["rektangel"] }, { id: "b", label: "b", any: ["fyra"] }], misconceptions: [{ pattern: "kvadrat är inte en rektangel", message: "fel" }] };
    const g = gradeRubric("En kvadrat är inte en rektangel, för en rektangel har fyra sidor men är lång och smal på riktigt.", rubric, 20);
    expect(g.pass).toBe(false);
    expect(g.guardsOk).toBe(false);
  });
});
