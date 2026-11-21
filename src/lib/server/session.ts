/** Signed session cookie for the single-user access code. Uses WebCrypto so it works in both the proxy and API routes. */
export const COOKIE = "rm_session";
export const SESSION_MAX_AGE_S = 60 * 60 * 24 * 400;

const enc = new TextEncoder();

function secret(): string {
  const s = process.env.ASSESSMENT_SECRET || (process.env.NODE_ENV !== "production" ? "dev-only-secret" : "");
  if (!s) throw new Error("ASSESSMENT_SECRET saknas.");
  return s;
}

async function hmac(msg: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(msg)));
  let bin = "";
  sig.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

const sameString = (a: string, b: string) => {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
};

export async function makeSessionValue(now = Date.now()): Promise<string> {
  const t = now.toString(36);
  return `${t}.${await hmac("session." + t)}`;
}

export async function verifySessionValue(value: string | undefined | null, now = Date.now()): Promise<boolean> {
  if (!value) return false;
  const [t, sig] = value.split(".");
  if (!t || !sig) return false;
  const issued = parseInt(t, 36);
  if (!Number.isFinite(issued) || issued > now + 60_000 || now - issued > SESSION_MAX_AGE_S * 1000) return false;
  return sameString(sig, await hmac("session." + t));
}

/** Constant-time comparison of the entered access code against APP_PASSCODE. */
export async function passcodeMatches(input: string): Promise<boolean> {
  const real = process.env.APP_PASSCODE;
  if (!real) return false;
  return sameString(await hmac("pc." + input), await hmac("pc." + real));
}
