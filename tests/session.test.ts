import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { makeSessionValue, passcodeMatches, SESSION_MAX_AGE_S, verifySessionValue } from "@/lib/server/session";

describe("single-user access code", () => {
  beforeEach(() => { process.env.ASSESSMENT_SECRET = "test-secret-1"; process.env.APP_PASSCODE = "correct horse"; });
  afterEach(() => { delete process.env.APP_PASSCODE; });

  it("accepts a freshly issued session cookie", async () => {
    expect(await verifySessionValue(await makeSessionValue())).toBe(true);
  });
  it("rejects missing, malformed and tampered cookies", async () => {
    expect(await verifySessionValue(undefined)).toBe(false);
    expect(await verifySessionValue("")).toBe(false);
    expect(await verifySessionValue("abc")).toBe(false);
    const good = await makeSessionValue();
    const [t, sig] = good.split(".");
    expect(await verifySessionValue(`${t}.${sig.slice(0, -2)}AA`)).toBe(false);
    expect(await verifySessionValue(`${(parseInt(t, 36) + 1).toString(36)}.${sig}`)).toBe(false);
  });
  it("rejects expired and future-dated cookies", async () => {
    const now = Date.now();
    expect(await verifySessionValue(await makeSessionValue(now - (SESSION_MAX_AGE_S + 5) * 1000), now)).toBe(false);
    expect(await verifySessionValue(await makeSessionValue(now + 3_600_000), now)).toBe(false);
    expect(await verifySessionValue(await makeSessionValue(now - 86_400_000), now)).toBe(true);
  });
  it("a cookie signed with another secret is rejected", async () => {
    const v = await makeSessionValue();
    process.env.ASSESSMENT_SECRET = "different-secret";
    expect(await verifySessionValue(v)).toBe(false);
  });
  it("checks the access code", async () => {
    expect(await passcodeMatches("correct horse")).toBe(true);
    expect(await passcodeMatches("correct hors")).toBe(false);
    expect(await passcodeMatches("")).toBe(false);
    delete process.env.APP_PASSCODE;
    expect(await passcodeMatches("anything")).toBe(false);
  });
});
