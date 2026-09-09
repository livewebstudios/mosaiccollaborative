import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Insights posts live in src/content/insights as markdown files.
 * Frontmatter:
 *   title       string, the h1 and the card heading
 *   description string, the card blurb and the meta description, under 155 chars
 *   date        YYYY-MM-DD, rendered in UTC so it never shifts a day
 *   category    one of the five below
 *   draft       true keeps it out of the build entirely
 *   heroAccent  navy, slate, gold or burgundy, tints the post header
 */
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
