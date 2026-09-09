// src/data/team.ts
// Source: 03_CONTENT/about.html and the Mosaic pitch deck (Aug 2026). Verbatim.

export type Member = {
  slug: string;
  name: string;
  title: string;
  accent: "navy" | "slate" | "gold" | "burgundy";
  /** null when no usable headshot exists yet. The UI renders an initials tile instead. */
  photo: string | null;
  bullets: string[];
  credentials?: string;
  linkedin: string;
};

export const team: Member[] = [
  {
    slug: "roz-cohen",
    name: "Roz Cohen, PhD",
    title: "Founder, Chief Executive Officer",
    accent: "burgundy",
    photo: "roz-cohen.jpg",
    bullets: [
      "Translates doctoral research on inclusive leadership into models that improve engagement and retention.",
      "Applies cross-industry experience to distinguish standard practice from genuine organizational risk.",
      "Connects culture strategy to measurable business outcomes."
    ],
    credentials: "25+ year corporate HR executive. PhD, Leadership & Change. Author of The Engagement Dilemma.",
    linkedin: "" // TODO: confirm with Roz
  },
  {
    slug: "debra-defrancesco",
    name: "Debra DeFrancesco",
    title: "Founder, Chief Operating Officer",
    accent: "slate",
    // TODO: confirm with Roz. The handoff shipped Roz's photograph twice, once under
    // Debra's filename, so no headshot of Debra exists yet. Initials tile until one arrives.
    photo: null,
    bullets: [
      "Brings 25+ years of leadership experience connecting business decisions with the realities of people and work.",
      "Identifies where roles, processes, and management practices are limiting organizational performance.",
      "Works alongside leaders and teams to build practical solutions they can sustain."
    ],
    linkedin: "" // TODO: confirm with Roz
  },
  {
    slug: "amalia-egri-freedman",
    name: "Amalia Egri Freedman",
    title: "Founder, Chief Strategy Officer",
    accent: "gold",
    photo: "amalia-egri-freedman.jpg",
    bullets: [
      "Brings a systems perspective to focus attention where it can have the greatest impact.",
      "Builds leadership capacity to navigate change with clarity, trust, and shared ownership.",
      "Turns strategy into action through clear priorities, strong structures, and accountability."
    ],
    linkedin: "" // TODO: confirm with Roz
  }
];
