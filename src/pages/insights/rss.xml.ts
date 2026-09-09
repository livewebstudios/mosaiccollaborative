import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { site } from "../../data/site";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getCollection("insights", ({ data }) => !data.draft);
  return rss({
    title: `${site.name} Insights`,
    description:
      "Practical thinking on leadership, culture, organizational effectiveness and leading through AI-driven change.",
    site: context.site ?? site.url,
    items: posts
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.date,
        categories: [post.data.category],
        link: `/insights/${post.id}/`,
      })),
    customData: "<language>en-us</language>",
  });
}
