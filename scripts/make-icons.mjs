// Renders PNG icons + iOS splash screens from inline SVG using the preinstalled Playwright Chromium.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = (() => { try { return require("playwright"); } catch { return require(require("node:child_process").execSync("npm root -g").toString().trim() + "/playwright"); } })();
import { mkdirSync } from "node:fs";

mkdirSync("public/icons", { recursive: true });
const mark = (s, pad) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 512 512">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3d58a"/><stop offset="1" stop-color="#e8b64a"/></linearGradient>
  <linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#111d38"/><stop offset="1" stop-color="#070d1c"/></linearGradient></defs>
  <rect width="512" height="512" fill="url(#b)"/>
  <g transform="translate(${pad} ${pad}) scale(${(512 - 2 * pad) / 512})">
    <text x="256" y="318" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="800" font-size="230" fill="url(#g)">R·M</text>
    <rect x="136" y="352" width="240" height="10" rx="5" fill="#e8b64a" opacity=".6"/>
    <text x="256" y="420" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="600" font-size="46" fill="#ffffff" opacity=".85">+ − × ÷</text>
  </g></svg>`;
const browser = await chromium.launch();
const page = await browser.newPage();
async function shot(html, w, h, file) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<body style="margin:0;background:#070d1c">${html}</body>`);
  await page.screenshot({ path: `public/icons/${file}`, omitBackground: false });
}
await shot(mark(192, 0), 192, 192, "icon-192.png");
await shot(mark(512, 0), 512, 512, "icon-512.png");
await shot(mark(512, 70), 512, 512, "icon-maskable-512.png");
await shot(mark(180, 0), 180, 180, "apple-touch-icon.png");
for (const [w, h] of [[1290, 2796], [1179, 2556], [1170, 2532], [1125, 2436], [750, 1334]]) {
  const s = Math.round(w * 0.45);
  await shot(`<div style="width:${w}px;height:${h}px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(900px 600px at 50% 30%,#182848,#070d1c);color:#fff;font-family:Helvetica,Arial,sans-serif"><div style="width:${s}px;height:${s}px;border-radius:${s * 0.22}px;overflow:hidden">${mark(s, 0)}</div><div style="margin-top:${w * 0.06}px;font-size:${w * 0.09}px;font-weight:800">Raff <span style="color:#e8b64a">Maff</span></div></div>`, w, h, `splash-${w}x${h}.png`);
}
await browser.close();
console.log("icons done");
