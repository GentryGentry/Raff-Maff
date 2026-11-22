// Renders PNG icons + iOS splash screens from inline SVG using the preinstalled Playwright Chromium.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = (() => { try { return require("playwright"); } catch { return require(require("node:child_process").execSync("npm root -g").toString().trim() + "/playwright"); } })();
import { mkdirSync } from "node:fs";

mkdirSync("public/icons", { recursive: true });
const mark = (s, pad) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 512 512">
  <defs><pattern id="gr" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#DCE4F1" stroke-width="2"/></pattern></defs>
  <rect width="512" height="512" fill="#FBFCFE"/><rect width="512" height="512" fill="url(#gr)"/>
  <g transform="translate(${pad} ${pad}) scale(${(512 - 2 * pad) / 512})">
    <rect x="96" y="262" width="320" height="64" fill="#FFE27A"/>
    <text x="256" y="320" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="800" font-size="250" letter-spacing="-12" fill="#14214F">RM</text>
    <rect x="96" y="352" width="320" height="8" fill="#14214F"/>
    <text x="256" y="420" text-anchor="middle" font-family="Courier New, monospace" font-weight="700" font-size="44" fill="#14214F" opacity=".7">+ − × ÷</text>
  </g></svg>`;
const browser = await chromium.launch();
const page = await browser.newPage();
async function shot(html, w, h, file) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<body style="margin:0;background:#FBFCFE">${html}</body>`);
  await page.screenshot({ path: `public/icons/${file}`, omitBackground: false });
}
await shot(mark(192, 0), 192, 192, "icon-192.png");
await shot(mark(512, 0), 512, 512, "icon-512.png");
await shot(mark(512, 70), 512, 512, "icon-maskable-512.png");
await shot(mark(180, 0), 180, 180, "apple-touch-icon.png");
for (const [w, h] of [[1290, 2796], [1179, 2556], [1170, 2532], [1125, 2436], [750, 1334]]) {
  const s = Math.round(w * 0.45);
  await shot(`<div style="width:${w}px;height:${h}px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#FBFCFE;color:#14214F;font-family:Helvetica,Arial,sans-serif"><div style="width:${s}px;height:${s}px;border:${Math.round(w*0.006)}px solid #14214F;overflow:hidden">${mark(s, 0)}</div><div style="margin-top:${w * 0.06}px;font-size:${w * 0.09}px;font-weight:800">Raff <span style="background:linear-gradient(transparent 56%,#FFE27A 56% 94%,transparent 94%)">Maff</span></div></div>`, w, h, `splash-${w}x${h}.png`);
}
await browser.close();
console.log("icons done");
