import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Insights posts live in src/content/insights as markdown files.
 * Frontmatter:
 *   title       string, the h1 and the card heading
 *   description string, the card blurb and the meta description, under 155 chars
 *   date        YYYY-MM-DD, rendered in UTC so it never shifts a day
 *   category    a name from src/data/insights-categories.json (edited in Decap under Settings)
 *   draft       true keeps it out of the build entirely
 *   heroAccent  navy, burgundy, gold or moss, tints the post header
 *   author      one of the three founders, or the company
 *   hero        optional photo, a path under /media/img/insights/
 *   externalUrl / externalLabel  optional link out to where the piece lives
 * Roz and the team edit these through Decap at /admin/ (public/admin/config.yml).
 */
const insights = defineCollection({
  loader: glob({ base: "./src/content/insights", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    // Free text on purpose: the team manages the list in Decap, and a renamed or removed
    // category must never fail the build for posts that still carry the old name.
    category: z.string().trim().min(1),
    draft: z.boolean().default(true),
    heroAccent: z.enum(["navy", "burgundy", "gold", "moss"]).default("navy"),
    author: z
      .enum(["Roz Cohen", "Debra DeFrancesco", "Amalia Egri Freedman", "The Mosaic Collaborative"])
      .default("The Mosaic Collaborative"),
    /** Path under /media/img/insights/ (Decap's media folder). */
    hero: z.string().optional(),
    /** Link to where the piece lives (LinkedIn, Substack, a podcast episode, an event page). */
    externalUrl: z.string().url().optional(),
    /** "Read on Substack", "Listen to the episode", "Event details". Defaults to "Read the original". */
    externalLabel: z.string().optional(),
  }),
});

export const collections = { insights };
