import { chromium } from "playwright";
const BASE = process.env.BASE || "http://localhost:4340";
const pages = (process.env.PAGES || "/").split(",");
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const fails = [];

for (const p of pages) {
  await page.goto(BASE + p, { waitUntil: "load" });
  const rows = await page.evaluate(() => {
    // Chrome serializes color-mix() several different ways depending on the mixing
    // space: "color(srgb 0.84 0.62 0.24)" for srgb and "oklab(0.89 0.002 0.014)"
    // for oklab, while plain colors come back as "rgb(212, 148, 42)". All three
    // have to normalize to 0 to 255 sRGB or the ratios are nonsense.
    const enc = (v) => {
      const c = v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(Math.max(v, 0), 1 / 2.4) - 0.055;
      return Math.min(255, Math.max(0, c * 255));
    };
    const oklabToRgb = (L, A, B) => {
      const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
      const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
      const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
      return [
        enc(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
        enc(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
        enc(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
      ];
    };
    const parse = (c) => {
      if (!c || c === "transparent" || c === "none") return [0, 0, 0, 0];
      const nums = (c.match(/-?[\d.]+(?:e-?\d+)?/g) || []).map(Number);
      if (c.startsWith("oklab(")) {
        const [L, A, B, a] = nums;
        return [...oklabToRgb(L, A, B), a ?? 1];
      }
      if (c.startsWith("oklch(")) {
        const [L, C, H, a] = nums;
        const rad = (H * Math.PI) / 180;
        return [...oklabToRgb(L, C * Math.cos(rad), C * Math.sin(rad)), a ?? 1];
      }
      if (c.startsWith("color(")) {
        const [r, g, b, a] = nums;
        return [r * 255, g * 255, b * 255, a ?? 1];
      }
      return [nums[0], nums[1], nums[2], nums[3] ?? 1];
    };
    const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)]; const hi = Math.max(x, y), lo = Math.min(x, y); return (hi + 0.05) / (lo + 0.05); };
    const bgOf = (el) => {
      let n = el;
      while (n && n !== document.documentElement) {
        const c = parse(getComputedStyle(n).backgroundColor);
        if (c[3] > 0.9) return c;
        n = n.parentElement;
      }
      return parse(getComputedStyle(document.body).backgroundColor);
    };
    const out = [];
    const els = document.querySelectorAll("main h1, main h2, main h3, main p, main li, main a, main span, main td, main th, footer a, footer p, footer li, nav a");
    for (const el of els) {
      if (!el.textContent.trim()) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      // Only leaf-ish nodes, so we do not double count containers.
      if ([...el.children].some((c) => c.textContent.trim().length > 0 && !["EM","STRONG","CITE","B","I","SPAN","SVG"].includes(c.tagName))) continue;
      const cs = getComputedStyle(el);
      const size = parseFloat(cs.fontSize);
      const weight = Number(cs.fontWeight) || 400;
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      const need = large ? 3 : 4.5;
      const got = ratio(parse(cs.color), bgOf(el));
      if (got < need) out.push({ text: el.textContent.trim().slice(0, 44), color: cs.color, size: Math.round(size), need, got: Number(got.toFixed(2)), tag: el.tagName });
    }
    return out;
  });
  for (const r of rows) fails.push({ page: p, ...r });
}
if (!fails.length) console.log("PASS: every text node meets WCAG AA against its background");
else {
  console.log(`${fails.length} contrast failures:`);
  const seen = new Set();
  for (const f of fails) {
    const k = f.color + f.size + f.page;
    if (seen.has(k)) continue; seen.add(k);
    console.log(`  ${f.page} ${f.tag} ${f.size}px ${f.color} got ${f.got} need ${f.need}  "${f.text}"`);
  }
}
await browser.close();
