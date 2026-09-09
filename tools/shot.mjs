import { chromium } from "playwright";

const BASE = process.env.BASE || "http://localhost:4340";
const OUT = process.env.OUT || "/tmp/shots";
const pages = (process.env.PAGES || "/").split(",");
const width = Number(process.env.W || 1440);
const reduced = process.env.MOTION !== "on";
const tag = process.env.TAG || "";

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: reduced ? "reduce" : "no-preference",
});
const page = await ctx.newPage();
const problems = [];
page.on("pageerror", (e) => problems.push("pageerror: " + String(e)));
page.on("console", (m) => { if (m.type() === "error") problems.push("console: " + m.text()); });
page.on("response", (r) => { if (r.status() >= 400) problems.push(`${r.status()} ${r.url()}`); });

for (const p of pages) {
  await page.goto(BASE + p, { waitUntil: "load" });
  // Force lazy images to load so the capture matches what a scrolling reader sees.
  await page.evaluate(async () => {
    document.querySelectorAll("img[loading=lazy]").forEach((i) => i.setAttribute("loading", "eager"));
    await new Promise((r) => setTimeout(r, 300));
    await Promise.all(
      Array.from(document.images).filter((i) => !i.complete).map((i) => i.decode().catch(() => {}))
    );
  });
  await page.waitForTimeout(500);
  const name = (p === "/" ? "home" : p.replace(/\//g, "-").replace(/^-|-$/g, "")) + `-${width}${tag}`;
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  console.log(name);
}

if (problems.length) console.log("PROBLEMS:\n" + [...new Set(problems)].join("\n"));
else console.log("no console errors, no failed requests");
await browser.close();
