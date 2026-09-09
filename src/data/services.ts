// src/data/services.ts
// Source: Mosaic pitch deck (Aug 2026), "04 Core Offerings" slides. Verbatim, typos fixed.
// Durations are shown only where the deck gives one. Do not invent durations or prices.

export type Offering = { name: string; duration?: string; includes: string[]; description?: string };

export type ServiceFamily = {
  slug: "diagnostic" | "development" | "belonging" | "executive";
  name: string;
  motto: string;
  accent: "navy" | "slate" | "gold" | "burgundy";
  intro: string;
  offerings: Offering[];
  deliverable: string;
};

export const services: ServiceFamily[] = [
  {
    slug: "diagnostic",
    name: "Diagnostic Services",
    motto: "Assess. Understand. Prioritize.",
    accent: "navy",
    intro: "Structured assessments that show you what's really going on, what matters most, and where to focus first.",
    offerings: [
      { name: "Change Readiness Assessment", duration: "6 to 8 weeks", includes: ["Stakeholder interviews", "Readiness survey", "Risk analysis", "Readiness scorecard"] },
      { name: "Leadership Effectiveness Assessment", duration: "8 to 12 weeks", includes: ["Interviews", "Leadership survey", "Management practices review"] },
      { name: "Organizational Health Check", duration: "3 months", includes: ["Stakeholder interviews", "Culture and engagement assessment", "Management review", "Organizational effectiveness scan"] },
      { name: "Next Stage Readiness Assessment", duration: "6 to 9 months", includes: ["Leadership capacity assessment", "Organizational structure assessment", "HR systems assessment", "Readiness scorecard", "Growth roadmap"] }
    ],
    deliverable: "Actionable insights and a practical roadmap."
  },
  {
    slug: "development",
    name: "Development Services",
    motto: "Build. Strengthen. Grow.",
    accent: "slate",
    intro: "Practical programs that equip leaders and teams with the tools and repeatable practices to lead well.",
    offerings: [
      { name: "Leadership Team Alignment Workshop", duration: "6 weeks with a 1 to 2 day workshop", includes: ["DISC assessments", "Individual profiles", "Team dynamics assessment", "Facilitated alignment session", "Action plan"] },
      { name: "Executive Retreat", duration: "6 weeks with a 1 to 2 day workshop", includes: ["Decision-making assessment", "Team effectiveness exercises", "Strategic priority alignment", "Team commitments roadmap"] },
      { name: "Manager Bootcamp", duration: "Flexible based on business needs", includes: ["Manager toolkit", "DISC-based communication training", "Coaching and feedback skills", "Delegation and accountability"] },
      { name: "Management Infrastructure Package", duration: "3 months", includes: ["Role clarity", "Meeting structure", "Decision rights", "Performance expectations", "Accountability framework"] },
      { name: "DISC Team Effectiveness Package", duration: "2 to 6 months based on business size, with a 1 to 2 day workshop", includes: ["DISC assessments", "Individual debriefs", "Team workshop", "Communication guide"] }
    ],
    deliverable: "Practical tools, equipped leaders and consistent, repeatable practices."
  },
  {
    slug: "belonging",
    name: "Belonging & Inclusion",
    motto: "Listen. Engage. Transform.",   // deck also lists "Listen. Learn. Thrive." TODO confirm with Roz
    accent: "gold",
    intro: "Research-backed programs that build the everyday skills and practices that make people feel they belong.",
    offerings: [
      { name: "Culture of Belonging Assessment", duration: "6 to 8 weeks", includes: ["Stakeholder interviews", "Inclusion survey", "Policy and practice review", "Prioritized findings report"] },
      { name: "Respectful Communication Across Difference", duration: "1 day workshop", includes: ["Microaggressions and difficult conversations", "The P.A.U.S.E. framework for hard conversations", "Guidelines for engaging across difference", "Communicating with colleagues and clients"] },
      { name: "Radical Connectivity", duration: "1 day workshop", includes: ["Inclusive leadership self-assessment", "Research-backed experience framework", "Inclusive leadership behavior skills application guide"] },
      { name: "Belonging Champions Program", duration: "3 to 6 months", includes: ["Internal champions training", "Embedding practices", "Progress metrics", "Transition toolkit"] }
    ],
    deliverable: "Practical skills and practices that foster belonging."
  },
  {
    slug: "executive",
    name: "Executive Partnership",
    motto: "Embed. Build. Transition.",
    accent: "burgundy",
    intro: "Senior operators embedded alongside your leadership team, building capacity and then handing it back.",
    offerings: [
      { name: "People & Culture Advisor", description: "Provides strategic HR leadership.", includes: ["Talent strategy, leadership coaching, and employee engagement", "Organizational design and management practices", "HR infrastructure to support growth and change"] },
      { name: "Chief of Staff", description: "Partners with senior leaders to improve focus, execution, and organizational effectiveness.", includes: ["Strategic planning and priority management", "Executive team coordination and decision support", "Cross-functional initiatives and organizational communication"] },
      { name: "Organizational Effectiveness Advisor", description: "Partners with senior leaders to align strategy, operations, and leadership.", includes: ["Organizational structure and operating model", "Change leadership and implementation support", "Performance systems and continuous improvement"] }
    ],
    deliverable: "Executive support to build leadership capacity."
  }
];

