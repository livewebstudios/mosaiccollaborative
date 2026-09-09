# CLAUDE.md: The Mosaic Collaborative website

Project owner: Jon Wolf, Live Web Studios (jonwolf@livewebstudios.com).
Client: Dr. Roz Cohen, The Mosaic Collaborative. Domain: mosaiccollaborative.com (two C's, one L in "Collaborative"... check spelling in every string).
Handoff folder with full brief, content, design system and assets: `mosaic-handoff/` (path supplied by Jon at kickoff). Read `00_START_HERE.md` first.

## Hard rules (never break these)

- NEVER output an em dash (Unicode U+2014, the long horizontal dash) anywhere: source, content, comments, commit messages, alt text. Use a period, comma, colon, or ellipsis. Grep for it before every commit: `grep -rn $'\xe2\x80\x94' src/ && echo "EM DASH FOUND"`.
- No stock-photo look. No people shaking hands, no desks, no laptops, no meeting rooms, no people looking at screens. Visuals are abstract: triangular tiles, the four brand colors, glass planes, paper texture, geometry, light. The only photos of humans are the three founder headshots.
- Do not invent facts about the client: services, timelines, credentials and bios come only from `03_CONTENT/`. If something is missing, insert a clearly marked `<!-- TODO: confirm with Roz -->` comment rather than guessing.
- Semantic HTML: one `<h1>` per page, correct heading order, `<main>`, `<nav>`, `<section>` with headings, `<article>` for posts. No inline styles.
- Every page must render and be readable with JavaScript disabled and with `prefers-reduced-motion: reduce`. Motion is progressive enhancement.
- Spell the founder's name "Roz" and the company "The Mosaic Collaborative". Do not use "Mosaic Collective" (that appears in an old deck and is wrong).

## Decisions made during the build (2026-09-09)

- **Astro 7, not the Astro 5 pin in the handoff.** Astro 5 carries a critical
  advisory set including remote code execution through AVIF image optimization,
  which this config uses. `npm audit` is clean on 7.3.2. Do not downgrade.
- **The Live Web Studios relative path rule is exempt on this project.** Jon
  approved root-relative asset paths because Astro emits them and Netlify deploy
  previews serve from the domain root. Canonical URLs stay absolute as usual.

## Stack

- Astro 7 (static output), TypeScript, Tailwind CSS v4 (via `@tailwindcss/vite`), GSAP 3 + ScrollTrigger, Lenis (smooth scroll), Astro View Transitions for page transitions.
- Content: Astro content collections (`src/content/insights/*.md`) for the blog. Site content lives in `src/data/*.ts` (journeys, services, team) so pages are generated from data, not hand-copied.
- Forms: Netlify Forms (`data-netlify="true"`, honeypot, `netlify-honeypot="bot-field"`), with a `/thank-you` page. No third-party form service.
- Hosting: Netlify from GitHub `main`. `netlify.toml` with headers, redirects and the form settings.
- Images: Astro `<Image />` / `<Picture />` with `sharp`; AVIF + WebP; explicit width/height everywhere. Video: MP4 (H.264) + WebM, `muted playsinline autoplay loop preload="metadata"`, poster image, paused when off-screen and under reduced-motion.
- Fonts: self-host via `@fontsource-variable/fraunces` (display) and `@fontsource-variable/inter` (body). No Google Fonts runtime calls.
- No jQuery, no Bootstrap, no UI kits, no Lottie files, no three.js unless specifically asked. GSAP + CSS + SVG can do everything in `04_MOTION_SPEC.md`.

## Repo layout

```
src/
  layouts/Base.astro          html shell, meta, fonts, Lenis + GSAP init, view transitions
  components/                 Nav, Footer, Hero, MosaicField (SVG tile system), JourneyRail, ServiceCard,
                              StatGrid, StickyPanels, Accordion, Team, ContactForm, Cursor, Marquee
  pages/                      index, about, how-we-work/[journey], services, contact, insights/[...], thank-you, privacy
  data/                       journeys.ts, services.ts, team.ts, site.ts (nav, contact, social)
  content/insights/           markdown posts
  styles/global.css           tokens (@theme), base, utilities, reduced-motion rules
public/
  media/video/  media/img/  fonts/  favicon.svg  og.jpg  robots.txt
netlify.toml
```

## Working agreements

- Build one page at a time, `npm run build` after each, commit after each. Do not push without Jon saying so.
- Mobile first. Check every section at 375, 768, 1024, 1440 and 1920 widths.
- Lighthouse targets on the Netlify deploy preview: Performance 90+, Accessibility 100, Best Practices 100, SEO 100.
- Use the design tokens in `02_DESIGN_SYSTEM.md` verbatim. Do not introduce new colors. Tints are allowed only via the listed alpha/tint values.
- Write copy exactly as given in `03_CONTENT/`. Fix obvious typos silently. Do not rewrite voice.
- When you are unsure between two design choices, choose the one with more negative space and fewer elements.
- Report at the end of each session: pages done, pages remaining, open TODOs, anything needing Roz's input.
