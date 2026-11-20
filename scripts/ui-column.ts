/* Drives the real UI: solves a structured column-addition assessment by typing into carry + result cells. */
import { generateAssessment } from "../src/lib/engine/assessment";
const { chromium, devices } = require("playwright");
const OUT = process.argv[2] ?? ".";
(async () => {
  const b = await chromium.launch();
  const page = await (await b.newContext({ ...devices["iPhone 14"] })).newPage();
  let token = "";
  page.on("response", async (r: any) => { if (r.url().endsWith("/api/assessment/start")) token = (await r.json()).token; });
  await page.goto("http://localhost:3000/lektion/w2-l3?steg=10");
  await page.waitForSelector("text=Skriftlig metod");
  await page.locator("div.card", { hasText: "Skriftlig metod" }).getByRole("button").first().click();
  await page.waitForSelector("text=Ställ upp och räkna");
  const p = JSON.parse(Buffer.from(token.split(".")[0], "base64url").toString());
  const ex = generateAssessment(p.l, p.k, p.s);
  for (let i = 0; i < ex.length; i++) {
    const s = ex[i].solution as any;
    // carries
    for (let c = 0; c < s.carries.length; c++) if (s.carries[c]) await page.getByLabel(`minnessiffra kolumn ${c + 1}`).fill(s.carries[c]);
    // result digits, ones first (auto-advance moves focus left)
    const digits = String(s.result).split("").reverse();
    for (let k = 0; k < digits.length; k++) await page.getByLabel(`svar ${k + 1}`, { exact: true }).fill(digits[k]);
    if (i === 0) await page.screenshot({ path: OUT + "/column-filled.png" });
    await page.getByRole("button", { name: i < ex.length - 1 ? "Nästa" : "Lämna in", exact: true }).click();
  }
  await page.waitForSelector("text=Godkänt!");
  const full = await page.locator("text=Rätt svar och rätt skriftlig metod!").count();
  console.log("PASS column UI flow; items with full marks:", full, "of", ex.length);
  await page.screenshot({ path: OUT + "/column-result.png" });
  await b.close();
})().catch((e) => { console.error("FAIL", e.message.slice(0, 300)); process.exit(1); });
