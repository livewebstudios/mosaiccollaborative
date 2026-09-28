import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://mosaiccollaborative.com",
  trailingSlash: "always",
  // How We Work was dropped from the nav in round 1 (Sep 2026). The journey pages keep their
  // /how-we-work/<slug>/ URLs; the old index now points at the Custom Offerings on Services.
  redirects: { "/how-we-work/": "/services/#custom-offerings" },
  integrations: [sitemap({ filter: (page) => !page.includes("/thank-you/") })],
  vite: { plugins: [tailwindcss()] },
  image: { formats: ["avif", "webp"] },
});
