// Helpers shared by the Insights index and post pages (round 3).

/** Words in a post's markdown body, ignoring markup characters. */
export const wordCount = (body = "") =>
  body.replace(/[#>*_`\[\]()!-]/g, " ").split(/\s+/).filter(Boolean).length;

/** A short post that points elsewhere (a podcast, a LinkedIn piece) links straight out. */
export const linksOut = (externalUrl: string | undefined, body: string | undefined) =>
  Boolean(externalUrl) && wordCount(body) < 40;

export const externalText = (label?: string) => label?.trim() || "Read the original";

export const fmtDate = (d: Date) =>
  d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
