import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const insights = defineCollection({
  loader: glob({ base: "./src/content/insights", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.enum(["Leadership", "Culture", "Change", "AI at work", "Podcasts & appearances"]),
    draft: z.boolean().default(true),
    heroAccent: z.enum(["navy", "slate", "gold", "burgundy"]).default("navy"),
  }),
});

export const collections = { insights };
