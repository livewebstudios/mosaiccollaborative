import { chromium } from "playwright";
const BASE = process.env.BASE || "http://localhost:4340";
const pages = (process.env.PAGES || "/").split(",");
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const problems = [];
page.on("pageerror", (e) => problems.push("pageerror " + e));
page.on("console", (m) => { if (m.type() === "error") problems.push("console " + m.text()); });
page.on("response", (r) => { if (r.status() >= 400) problems.push(`${r.status()} ${r.url()}`); });

for (const p of pages) {
  await page.goto(BASE + p, { waitUntil: "load" });
  await page.waitForTimeout(400);
  const r = await page.evaluate(() => {
    const hs = [...document.querySelectorAll("main h1, main h2, main h3, main h4")];
    const levels = hs.map((h) => Number(h.tagName[1]));
    let skips = [];
    for (let i = 1; i < levels.length; i++) if (levels[i] - levels[i - 1] > 1) skips.push(`${hs[i-1].tagName}->${hs[i].tagName} at "${hs[i].textContent.trim().slice(0,40)}"`);
    return {
      title: document.title.length,
      desc: (document.querySelector('meta[name=description]')?.content || "").length,
      canonical: !!document.querySelector("link[rel=canonical]"),
      og: !!document.querySelector('meta[property="og:image"]'),
      jsonld: document.querySelectorAll('script[type="application/ld+json"]').length,
      h1: document.querySelectorAll("main h1").length,
      headingSkips: skips,
      imgNoAlt: [...document.images].filter((i) => !i.hasAttribute("alt")).length,
      brokenImgs: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map(i=>i.currentSrc||i.src),
      emptyLinks: [...document.querySelectorAll("a")].filter((a) => !a.textContent.trim() && !a.getAttribute("aria-label")).length,
      landmarks: ["header","nav","main","footer"].filter((t) => !document.querySelector(t)),
    };
  });
  console.log(p, JSON.stringify(r));
}
console.log(problems.length ? "PROBLEMS: " + [...new Set(problems)].join(" | ") : "no console errors, no failed requests");
await browser.close();
