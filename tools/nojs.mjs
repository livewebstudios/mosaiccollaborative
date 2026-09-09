import { chromium } from "playwright";
const BASE = process.env.BASE || "http://localhost:4340";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
const page = await ctx.newPage();
for (const p of (process.env.PAGES || "/").split(",")) {
  await page.goto(BASE + p, { waitUntil: "load" });
  const r = await page.evaluate === undefined ? null : null;
  // With JS off we cannot evaluate; measure by screenshot height and visible text instead.
  const text = (await page.textContent("main")) || "";
  const box = await page.locator("main").boundingBox();
  console.log(p, "| main height", Math.round(box.height), "| chars", text.replace(/\s+/g, " ").trim().length);
  await page.screenshot({ path: `/tmp/shots/nojs${p.replace(/\//g, "-")}.png`, fullPage: true });
}
await browser.close();
