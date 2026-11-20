import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export interface TokenPayload {
  u: string; // user id
  l: string; // lesson id (or wN-boss)
  k: string; // kind
  s: string; // seed
  n: string; // nonce
  t: number; // issued at (ms)
  sk?: string[]; // revision skills (chosen server-side)
}

function secret(): string {
  const s = process.env.ASSESSMENT_SECRET || (process.env.NODE_ENV !== "production" ? "dev-only-secret" : "");
  if (!s) throw new Error("ASSESSMENT_SECRET saknas.");
  return s;
}
const b64 = (b: Buffer) => b.toString("base64url");

export function signToken(p: Omit<TokenPayload, "n" | "t">): { token: string; payload: TokenPayload } {
  const payload: TokenPayload = { ...p, n: randomBytes(9).toString("hex"), t: Date.now() };
  const body = b64(Buffer.from(JSON.stringify(payload)));
  const sig = b64(createHmac("sha256", secret()).update(body).digest());
  return { token: `${body}.${sig}`, payload };
}

export function verifyToken(token: string, maxAgeMs = 3 * 3600_000): TokenPayload | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expect = createHmac("sha256", secret()).update(body).digest();
  const got = Buffer.from(sig, "base64url");
  if (got.length !== expect.length || !timingSafeEqual(got, expect)) return null;
  try {
    const p = JSON.parse(Buffer.from(body, "base64url").toString()) as TokenPayload;
    if (Date.now() - p.t > maxAgeMs) return null;
    return p;
  } catch { return null; }
}
