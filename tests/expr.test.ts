import { describe, expect, it } from "vitest";
import { equivalent, isSimplifiedLike, parseExpr, termCount } from "@/lib/engine/expr";
import { gradeExercise, perfectAnswer } from "@/lib/engine/grading";
import { exprEx } from "@/lib/engine/gen-helpers";

const eq = (a: string, b: string, v = "n") => equivalent(a, b, v);

describe("expression equivalence", () => {
  it("accepts equivalent ways of writing the same expression", () => {
    for (const t of ["3n+2", "3*n+2", "3·n+2", "3×n+2", "2+3n", "n*3+2", "3 n + 2", "3N+2", "(3n)+2", "n+n+n+2", "6n/2+2", "3,0n+2", "3n+2"]) expect(eq(t, "3n+2"), t).toBe(true);
    expect(eq("2(n+3)", "2n+6")).toBe(true);
    expect(eq("2·(n+3)", "2n+6")).toBe(true);
    expect(eq("n(n+1)", "n^2+n")).toBe(true);
    expect(eq("n²+n", "n^2+n")).toBe(true);
    expect(eq("n−5", "n-5")).toBe(true);
    expect(eq("-(n-5)", "5-n")).toBe(true);
    expect(eq("0,5n", "n/2")).toBe(true);
    expect(eq("x+x", "2x", "x")).toBe(true);
  });
  it("rejects different expressions (the classic mistakes)", () => {
    for (const t of ["2n+3", "3n", "n+5", "5n", "3n-2", "32n", "3+2n", "n3+2", "3(n+2)", "n^3+2"]) expect(eq(t, "3n+2"), t).toBe(false);
    expect(eq("2n", "n+2")).toBe(false); // concatenation/“2 gånger” vs “2 mer”
    expect(eq("2(n+3)", "2n+3")).toBe(false); // forgot to distribute
    expect(eq("5x", "3x+2", "x")).toBe(false); // combining unlike terms
    expect(eq("n-5", "5-n")).toBe(false);
  });
  it("rejects garbage and wrong variables without throwing", () => {
    for (const t of ["", "   ", "abc", "3m+2", "3n+", "((3n)", "3n+2)", "n^9", "n^-1", "3n=2", "alert(1)", "3n+2;", "1".repeat(80), "n^n"]) expect(eq(t, "3n+2"), t).toBe(false);
  });
  it("division by the variable doesn't crash", () => {
    expect(() => equivalent("1/n", "1/n", "n")).not.toThrow();
    expect(eq("1/n", "1/n")).toBe(true);
    expect(eq("1/n", "n")).toBe(false);
  });
  it("evaluates correctly", () => {
    expect(parseExpr("3n+2", "n")(4)).toBe(14);
    expect(parseExpr("2(n+3)", "n")(4)).toBe(14);
    expect(parseExpr("-n+10", "n")(4)).toBe(6);
    expect(parseExpr("2n^2", "n")(3)).toBe(18);
  });
});

describe("'simplified' mode", () => {
  const ref = "3n+2";
  it("counts terms", () => {
    expect(termCount("3n+2", "n")).toBe(2);
    expect(termCount("n+n+n+2", "n")).toBe(4);
    expect(termCount("2(n+3)", "n")).toBe(1);
    expect(termCount("-n+5", "n")).toBe(2);
    expect(termCount("2(n-3)+4", "n")).toBe(2);
  });
  it("accepts simplified forms, rejects unsimplified equivalents", () => {
    expect(isSimplifiedLike("3n+2", ref, "n")).toBe(true);
    expect(isSimplifiedLike("2+3n", ref, "n")).toBe(true);
    expect(isSimplifiedLike("n+n+n+2", ref, "n")).toBe(false);
    expect(isSimplifiedLike("2n+n+2", ref, "n")).toBe(false);
    expect(isSimplifiedLike("3(n)+2", ref, "n")).toBe(false);
  });
  it("graded exercise: expanded form required when the reference has no parentheses", () => {
    const ex = exprEx("e", "s", "Förenkla 2(n+3)", "2n+6", "", [], { simplified: true });
    const ok = (v: string) => gradeExercise(ex, { kind: "expr", value: v });
    expect(ok("2n+6").correct).toBe(true);
    expect(ok("6+2n").correct).toBe(true);
    expect(ok("2(n+3)").correct).toBe(false);
    expect(ok("2(n+3)").feedback).toMatch(/inte förenklat/);
    expect(ok("n+n+6").correct).toBe(false);
    expect(ok("2n+3").correct).toBe(false);
    expect(ok("").correct).toBe(false);
    expect(gradeExercise(ex, perfectAnswer(ex)).correct).toBe(true);
  });
  it("graded exercise: equivalence is enough when not in simplified mode", () => {
    const ex = exprEx("e", "s", "Skriv ett uttryck", "3n+2", "", []);
    expect(gradeExercise(ex, { kind: "expr", value: "n+n+n+2" }).correct).toBe(true);
    expect(gradeExercise(ex, { kind: "expr", value: "2+3·n" }).correct).toBe(true);
  });
});
