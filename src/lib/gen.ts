// Generated stills (Higgsfield, GPT Image 2, 2026-09-28). Sources live in
// assets/generated-2026-09-28/ at the project root; these are web-sized JPEG copies.
import type { ImageMetadata } from "astro";

const files = import.meta.glob<ImageMetadata>("../assets/img/gen/*.jpg", {
  eager: true,
  import: "default",
});

export function gen(name: string): ImageMetadata {
  const img = files[`../assets/img/gen/${name}.jpg`];
  if (!img) throw new Error(`Missing generated image: ${name}.jpg`);
  return img;
}

export const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
