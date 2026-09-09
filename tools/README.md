# Visual QA tools

Dev only. Not part of the site build and not shipped.

```bash
npm run build
node tools/serve.mjs &                              # serves dist on http://localhost:4340
BASE=http://localhost:4340 PAGES="/,/about/" W=1440 node tools/shot.mjs
node tools/slice.mjs /tmp/shots/home-1440.png /tmp/shots/h 1500
```

`shot.mjs` captures full page screenshots with Playwright, forces lazy images to
load, and reports console errors and failed requests. Set `MOTION=on` to capture
with animation enabled; the default emulates `prefers-reduced-motion: reduce`,
which is the state the QA checklist cares about most.
