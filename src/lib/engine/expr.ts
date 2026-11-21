/** Tiny, safe algebraic expression parser used to grade typed answers like "3n+2" or "2(n+3)".
 *  Supports numbers (decimal comma/point), ONE allowed variable, + - * · × / ÷ ^ ², parentheses and implicit
 *  multiplication (3n, 2(n+1), n(n+1)). Never uses eval. */
type Tok = { t: "num"; v: number } | { t: "var"; v: string } | { t: "op"; v: string };
export class ExprError extends Error {}

function tokenize(src: string, variable: string): Tok[] {
  let s = src
    .replace(/[−–—]/g, "-")
    .replace(/[·×⋅]/g, "*")
    .replace(/÷/g, "/")
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/[\s ]/g, "")
    .toLowerCase();
  if (s.length === 0 || s.length > 60) throw new ExprError("empty or too long");
  const out: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/[0-9]/.test(c) || ((c === "," || c === ".") && /[0-9]/.test(s[i + 1] ?? ""))) {
      let j = i;
      while (j < s.length && /[0-9,.]/.test(s[j])) j++;
      const v = Number(s.slice(i, j).replace(",", "."));
      if (!Number.isFinite(v)) throw new ExprError("bad number");
      out.push({ t: "num", v }); i = j;
    } else if (/[a-zåäö]/.test(c)) {
      if (c !== variable.toLowerCase()) throw new ExprError(`unknown variable ${c}`);
      out.push({ t: "var", v: c }); i++;
    } else if ("+-*/^()".includes(c)) { out.push({ t: "op", v: c }); i++; }
    else throw new ExprError(`bad character ${c}`);
  }
  return out;
}

export type Fn = (x: number) => number;

export function parseExpr(src: string, variable: string): Fn {
  const toks = tokenize(src, variable);
  let p = 0;
  const peek = () => toks[p];
  const isOp = (v: string) => peek()?.t === "op" && (peek() as { v: string }).v === v;
  const startsFactor = () => { const k = peek(); return !!k && (k.t === "num" || k.t === "var" || (k.t === "op" && k.v === "(")); };

  function expr(): Fn {
    let f = term();
    while (isOp("+") || isOp("-")) {
      const plus = (toks[p++] as { v: string }).v === "+";
      const l = f, r = term();
      f = plus ? (x) => l(x) + r(x) : (x) => l(x) - r(x);
    }
    return f;
  }
  function term(): Fn {
    let f = unary();
    for (;;) {
      if (isOp("*") || isOp("/")) {
        const mul = (toks[p++] as { v: string }).v === "*";
        const l = f, r = unary();
        f = mul ? (x) => l(x) * r(x) : (x) => l(x) / r(x);
      } else if (startsFactor()) { // implicit multiplication: 3n, 2(n+1), n(n+1)
        // Convention: coefficient first. "n3" or "(n)3" is ambiguous (n·3 or n³?) and is rejected.
        const nx = peek(), prev = toks[p - 1];
        if (nx.t === "num" && prev && (prev.t === "var" || (prev.t === "op" && prev.v === ")"))) throw new ExprError("write the number first");
        const l = f, r = power();
        f = (x) => l(x) * r(x);
      } else break;
    }
    return f;
  }
  function unary(): Fn {
    if (isOp("-")) { p++; const f = unary(); return (x) => -f(x); }
    if (isOp("+")) { p++; return unary(); }
    return power();
  }
  function power(): Fn {
    const base = atom();
    if (isOp("^")) {
      p++;
      const e = peek();
      if (!e || e.t !== "num" || !Number.isInteger(e.v) || e.v < 0 || e.v > 4) throw new ExprError("bad exponent");
      p++;
      const n = e.v;
      return (x) => Math.pow(base(x), n);
    }
    return base;
  }
  function atom(): Fn {
    const k = toks[p++];
    if (!k) throw new ExprError("unexpected end");
    if (k.t === "num") { const v = k.v; return () => v; }
    if (k.t === "var") return (x) => x;
    if (k.v === "(") {
      const f = expr();
      if (!isOp(")")) throw new ExprError("missing )");
      p++;
      return f;
    }
    throw new ExprError(`unexpected ${k.v}`);
  }
  const f = expr();
  if (p !== toks.length) throw new ExprError("trailing input");
  return f;
}

const POINTS = [-3, -1.5, 0, 1, 2, 3, 5, 7.25, 11];

export function equivalent(a: string, b: string, variable: string): boolean {
  let fa: Fn, fb: Fn;
  try { fa = parseExpr(a, variable); fb = parseExpr(b, variable); } catch { return false; }
  let compared = 0;
  for (const x of POINTS) {
    const va = fa(x), vb = fb(x);
    if (!Number.isFinite(va) || !Number.isFinite(vb)) continue;
    if (Math.abs(va - vb) > 1e-9 * Math.max(1, Math.abs(va), Math.abs(vb))) return false;
    compared++;
  }
  return compared >= 4;
}

/** Number of top-level terms ("3n+2" -> 2, "n+n+n" -> 3, "2(n+3)" -> 1). */
export function termCount(src: string, variable: string): number {
  const toks = tokenize(src, variable);
  let depth = 0, terms = 1;
  toks.forEach((k, i) => {
    if (k.t !== "op") return;
    if (k.v === "(") depth++;
    else if (k.v === ")") depth--;
    else if ((k.v === "+" || k.v === "-") && depth === 0 && i > 0) {
      const prev = toks[i - 1];
      if (prev.t !== "op" || prev.v === ")") terms++;
    }
  });
  return terms;
}

export const hasParens = (src: string) => /[()]/.test(src);

/** "Simplified" = equivalent, no parentheses, and no more terms than the reference answer. */
export function isSimplifiedLike(typed: string, reference: string, variable: string): boolean {
  try { return (!hasParens(typed) || hasParens(reference)) && termCount(typed, variable) <= termCount(reference, variable); }
  catch { return false; }
}
