/* Drives the REAL UI through assessments of any exercise kind and checks the server accepts them.
   Usage: npx tsx scripts/ui-solve.ts <lessonId,lessonId,...> [sections=knowledge,method,representation] [shotDir]
   Needs a running dev server whose dev store has theory done for the lessons (run scripts/api-e2e.ts first). */
import { generateAssessment } from "../src/lib/engine/assessment";
const { chromium, devices } = require("playwright");

const lessons = (process.argv[2] ?? "w5-l1").split(",");
const sections = (process.argv[3] ?? "knowledge,method,representation").split(",");
const SHOTS = process.argv[4];
const LABEL: Record<string, string> = { knowledge: "Kunskapsprov", method: "Skriftlig metod", representation: "Representation", pedagogy: "Pedagogik" };

(async () => {
  const b = await chromium.launch();
  const page = await (await b.newContext({ ...devices["iPhone 14"] })).newPage();
  const errors: string[] = [];
  page.on("pageerror", (e: Error) => errors.push(e.message));
  let token = "";
  page.on("response", async (r: any) => { if (r.url().endsWith("/api/assessment/start") && r.ok()) token = (await r.json()).token; });
  let failed = 0;

  for (const lessonId of lessons) for (const section of sections) {
    let cur = -1;
    try {
      await page.goto(`http://localhost:3000/lektion/${lessonId}?steg=10`);
      const card = page.locator("div.card", { hasText: LABEL[section] }).filter({ has: page.getByRole("button") }).first();
      token = "";
      await card.getByRole("button").first().click();
      await page.waitForFunction(() => true);
      for (let w = 0; w < 100 && !token; w++) await page.waitForTimeout(100);
      if (!token) throw new Error("no assessment token received");
      await page.waitForSelector("text=/Uppgift|\\d\\/\\d/", { timeout: 10000 });
      const p = JSON.parse(Buffer.from(token.split(".")[0], "base64url").toString());
      const ex = generateAssessment(p.l, p.k, p.s);
      for (let i = 0; i < ex.length; i++) {
        cur = i;
        const s: any = ex[i].solution, spec: any = ex[i].spec;
        switch (s.kind) {
          case "mc": await page.getByRole("radio").nth(s.value).click(); break;
          case "numeric": await page.getByLabel("Ditt svar").fill(s.accept[0]); break;
          case "multifield": for (let k = 0; k < s.values.length; k++) await page.locator("label input.field").nth(k).fill(s.values[k][0]); break;
          case "numberline": for (let k = 0; k < Math.round((s.value - spec.min) / spec.step); k++) await page.getByRole("button", { name: "Flytta ett steg åt höger" }).click(); break;
          case "fractionbar": await page.locator('svg[aria-label^="Bråkstapel"] rect').nth(s.value - 1).click(); break;
          case "expr": await page.getByLabel("Ditt uttryck").fill(s.accept); break;
          case "point": await page.locator(`[aria-label="Punkt (${s.x}, ${s.y})"]`).click(); break;
          case "gridshade": await page.locator('svg[aria-label^="Hundrarutnät – tryck"] rect').nth(s.value - 1).click(); break;
          case "areamodel": for (let k = 0; k < s.cells.length; k++) await page.locator('input[aria-label*=" gånger "]').nth(k).fill(s.cells[k]); await page.locator("label:has-text('Summa') input").fill(s.total); break;
          case "column":
            for (let c = 0; c < s.carries.length; c++) if (s.carries[c]) await page.getByLabel(new RegExp(`(minnessiffra|växling) kolumn ${c + 1}$`)).fill(s.carries[c]);
            for (let r = 0; r < s.partials.length; r++) { const d = String(s.partials[r]).split("").reverse(); for (let k = 0; k < d.length; k++) await page.getByLabel(`delprodukt ${r + 1} ${k + 1}`, { exact: true }).fill(d[k]); }
            { const d = String(s.result).split("").reverse(); for (let k = 0; k < d.length; k++) await page.getByLabel(`svar ${k + 1}`, { exact: true }).fill(d[k]); }
            break;
          case "longdiv": for (let k = 0; k < s.q.length; k++) { await page.getByLabel(`kvotsiffra ${k + 1}`, { exact: true }).fill(s.q[k]); await page.getByLabel(`produkt ${k + 1}`, { exact: true }).fill(s.prod[k]); await page.getByLabel(`rest ${k + 1}`, { exact: true }).fill(s.rem[k]); } break;
          case "text": await page.getByLabel("Din förklaring").fill(s.modelAnswer); break;
        }
        if (SHOTS && i === 0 && ["numberline", "fractionbar", "multifield"].includes(s.kind)) await page.screenshot({ path: `${SHOTS}/${lessonId}-${section}-${s.kind}.png` });
        await page.getByRole("button", { name: i < ex.length - 1 ? "Nästa" : "Lämna in", exact: true }).click();
      }
      await page.waitForSelector("text=/Godkänt!|Inte godkänt än/", { timeout: 10000 });
      const ok = await page.locator("text=Godkänt!").count();
      if (!ok) console.log("   feedback:", (await page.locator("[role=status]").allInnerTexts()).filter((t: string) => !t.startsWith("✓")).slice(0, 4).join(" | ").replace(/\n/g, " ").slice(0, 600));
      console.log(`${ok ? "PASS" : "FAIL"}  ${lessonId} ${section} (${ex.map((e) => e.solution.kind).join(",")})`);
      if (!ok) failed++;
    } catch (e: any) { failed++; console.log(`FAIL  ${lessonId} ${section} (item ${typeof cur === "undefined" ? "?" : cur}): ${String(e.message).split("\n")[0].slice(0, 160)}`); if (SHOTS) await page.screenshot({ path: `${SHOTS}/fail-${lessonId}-${section}.png` }); }
  }
  if (errors.length) console.log("PAGE ERRORS:", errors.slice(0, 3));
  await b.close();
  process.exit(failed ? 1 : 0);
})();
