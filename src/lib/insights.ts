// Helpers shared by the Insights index and post pages (round 3).
import categoryData from "../data/insights-categories.json";

/** Category names in the order the team set in Decap (Settings > Insight categories). */
export const categoryNames: string[] = categoryData.categories.map((c) => c.name.trim()).filter(Boolean);

/**
 * The categories that live posts actually use, in the team's order. A post that still
 * carries a category no longer on the list sorts after the listed ones.
 */
export const orderCategories = (used: string[]) => {
  const rank = (c: string) => {
    const i = categoryNames.indexOf(c);
    return i === -1 ? categoryNames.length : i;
  };
  return [...new Set(used)].sort((a, b) => rank(a) - rank(b));
};

/** Words in a post's markdown body, ignoring markup characters. */
export const wordCount = (body = "") =>
  body.replace(/[#>*_`\[\]()!-]/g, " ").split(/\s+/).filter(Boolean).length;

/** A short post that points elsewhere (a podcast, a LinkedIn piece) links straight out. */
export const linksOut = (externalUrl: string | undefined, body: string | undefined) =>
  Boolean(externalUrl) && wordCount(body) < 40;

export const externalText = (label?: string) => label?.trim() || "Read the original";

export const fmtDate = (d: Date) =>
  d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
