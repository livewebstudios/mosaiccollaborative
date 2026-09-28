// src/data/journeys.ts
// Source: Mosaic pitch deck (Aug 2026), "A Journey Framework" slides. Copy is verbatim with typos fixed.
// Round 1 revisions (Sep 2026): the "How it works" phases were removed at the client's request
// (they give away the methodology). Each journey page is now Problem, Solution framework, Deliverable.

export type Journey = {
  slug: "clarify" | "build" | "activate" | "reignite";
  number: string;
  name: string;
  accent: "navy" | "slate" | "gold" | "burgundy";
  promise: string;          // one-line tagline used on Home, Services and the journey hero
  ceoQuestion: string;      // from the orientation table
  friction: string;         // orientation table: sources of friction
  solutions: string;        // orientation table: solutions
  quote: string;            // the italic hero quote on the journey page
  homeBlurb: string;        // rail copy on Home, verbatim from 03_CONTENT/home.html
  symptoms: string[];       // "Sound familiar?" list (the Problem)
  framework: string;        // Solution framework, 2 to 3 sentences
  deliverable: string;
  metaTitle: string;
  metaDescription: string;
};

export const journeys: Journey[] = [
  {
    slug: "clarify",
    number: "01",
    name: "Clarify",
    accent: "navy",
    promise: "Establish strategic direction.",
    ceoQuestion: "What's really going on?",
    friction: "Strategic direction and alignment. Understand where you are and what matters most.",
    solutions: "Discover root causes. Understand reality.",
    quote: "We know we need change, but we don't know what to do next.",
    homeBlurb: "Understand where you are and what matters most. Discover root causes. Understand reality.",
    symptoms: [
      "Too many priorities compete for our attention.",
      "Managers handle similar challenges in different ways.",
      "Expectations aren't consistent across teams.",
      "We're adopting AI faster than we're adapting how we work.",
      "Employees don't understand how their work connects to our mission.",
      "We're spending a lot of time coordinating without making clear progress.",
      "Growth has outpaced the way we operate."
    ],
    framework:
      "We assess what's happening across your organization, from strategy and leadership to structure, people, and processes. We connect perspectives and build alignment around what matters most. The result is a practical roadmap and the tools to move forward with clarity and confidence.",
    deliverable: "A shared direction.",
    metaTitle: "Clarify: Set Strategic Direction | Mosaic Collaborative",
    metaDescription: "When you know you need change but not what to do next. We build alignment around what matters most and leave you with a practical roadmap."
  },
  {
    slug: "build",
    number: "02",
    name: "Build",
    accent: "slate",
    promise: "Develop the capacity to execute.",
    ceoQuestion: "Do we have the right organization for where we're headed?",
    friction: "Create the leadership, systems, and capabilities needed for success.",
    solutions: "Design a coherent system. Create the conditions for success.",
    quote: "We have the strategy, now we need the people, processes and systems to support it.",
    homeBlurb: "Create the leadership, systems, and capabilities needed for success. Design a coherent system. Create the conditions for success.",
    symptoms: [
      "We're relying on heroic effort instead of reliable systems, and teams aren't working consistently.",
      "We're struggling to find and retain the talent we need, and too much depends on a few key people.",
      "Our structure has changed, but our roles, processes, and ways of working haven't kept pace.",
      "We're promoting strong contributors into management, but they need support to lead people and change.",
      "We've merged or reorganized, but we haven't yet figured out how to work as one team.",
      "Teams are adopting new processes at different rates.",
      "AI is changing the work, and we need to rethink roles, skills, career paths, and processes.",
      "We're not clear enough about who owns what, who makes which decisions, or how we measure success."
    ],
    framework:
      "We assess what you have today against where you want to go, then build what's needed to support sustainable growth: roles and talent, processes, systems, and measures of success. The result is an organization designed to scale with clarity and intention.",
    deliverable: "A stronger foundation.",
    metaTitle: "Build: Develop Capacity to Execute | Mosaic Collaborative",
    metaDescription: "You have the strategy. Now you need the people, processes and systems to support it. We build an organization designed to scale with intention."
  },
  {
    slug: "activate",
    number: "03",
    name: "Activate",
    accent: "gold",
    promise: "Turn plans into action.",
    ceoQuestion: "How do we make it happen?",
    friction: "Consistent execution, accountability, and momentum. Put strategy into action and drive execution.",
    solutions: "Embed new ways of working. Make the change real.",
    quote: "We have a plan, but we're struggling to execute.",
    homeBlurb: "Consistent execution, accountability, and momentum. Put strategy into action and drive execution. Embed new ways of working. Make the change real.",
    symptoms: [
      "Employees understand the vision, but they aren't changing how they work.",
      "Decisions stall or get revisited repeatedly, slowing progress.",
      "Strategic priorities compete with day-to-day demands.",
      "We're using AI to change how we work, but new practices aren't taking hold.",
      "Key initiatives start strong but lose momentum before they're completed.",
      "Managers need support leading change and helping their teams adopt new ways of working.",
      "We're struggling to turn strategic goals into results we can see and measure."
    ],
    framework:
      "We identify what's standing in the way of change and work with leaders and managers to build alignment, strengthen ownership, and translate strategy into day-to-day practice. The focus is on the people and practices that make change real and sustain it over time.",
    deliverable: "Sustainable traction.",
    metaTitle: "Activate: Turn Plans into Action | Mosaic Collaborative",
    metaDescription: "You have a plan but execution stalls. We work alongside your leaders and managers to turn plans into action and build sustainable traction."
  },
  {
    slug: "reignite",
    number: "04",
    name: "Reignite",
    accent: "burgundy",
    promise: "Restore trust, engagement, and commitment.",
    ceoQuestion: "How do we strengthen our organization?",
    friction: "Trust, cohesion, and organizational health. Restore momentum, engagement, and performance.",
    solutions: "Restore the human side of the organization. Renew trust and connection.",
    quote: "How do we restore trust, engagement, and a shared sense of purpose?",
    homeBlurb: "Trust, cohesion, and organizational health. Restore momentum, engagement, and performance. Renew trust and connection.",
    symptoms: [
      "Cross-functional work breaks down.",
      "People are protecting their roles instead of working towards shared goals.",
      "Trust in leadership has eroded.",
      "People are uncertain about what AI means for their roles, skills, and future.",
      "Change has left leaders feeling disconnected or burned out.",
      "Employee engagement and morale are declining.",
      "People are reacting differently to AI-driven change, and it's affecting trust and collaboration.",
      "High performers are leaving.",
      "People no longer feel connected to the organization's mission or one another."
    ],
    framework:
      "We uncover what's eroding trust and engagement, then reconnect the pieces that shape how people experience work, from leadership and culture to relationships and everyday practices. Together, we create the conditions for people to re-engage, work differently, and thrive.",
    deliverable: "Renewed momentum.",
    metaTitle: "Reignite: Restore Trust & Engagement | Mosaic Collaborative",
    metaDescription: "When trust has eroded and high performers are leaving. We help restore trust, engagement and commitment so your people re-engage and thrive."
  }
];
