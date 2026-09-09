// src/data/journeys.ts
// Source: Mosaic pitch deck (Aug 2026), "A Journey Framework" slides. Copy is verbatim with typos fixed.
// Phases: the first three are "primary" (top row in the deck), the last two are "supporting" (offset row).

export type JourneyPhase = { name: string; description: string; role: "primary" | "supporting" };

export type Journey = {
  slug: "clarify" | "build" | "activate" | "reignite";
  number: string;
  name: string;
  accent: "navy" | "slate" | "gold" | "burgundy";
  promise: string;          // one-line promise used on Home and How We Work
  ceoQuestion: string;      // from the orientation table
  quote: string;            // the italic hero quote on the journey page
  symptoms: string[];       // "Sound familiar?" list
  phases: JourneyPhase[];
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
    quote: "We know we need change, but we don't know what to do next.",
    symptoms: [
      "Too many priorities compete for our attention.",
      "Managers handle similar challenges in different ways.",
      "Expectations aren't consistent across teams.",
      "We're adopting AI faster than we're adapting how we work.",
      "Employees don't understand how their work connects to our mission.",
      "We're spending a lot of time coordinating without making clear progress.",
      "Growth has outpaced the way we operate."
    ],
    phases: [
      { role: "primary", name: "Organizational Assessment", description: "Evaluate leadership, structure, culture, and operations to identify opportunities for stronger alignment and organizational effectiveness." },
      { role: "primary", name: "Roadmap Development", description: "Turn insights into a practical roadmap with defined priorities, timelines, and accountability." },
      { role: "primary", name: "Implementation Toolkit", description: "Develop a practical playbook that defines roles, responsibilities, decision-making, and next steps so your team can carry the work forward." },
      { role: "supporting", name: "Executive Alignment", description: "Create a shared understanding of the challenges and a unified approach to addressing them." },
      { role: "supporting", name: "Stakeholder Alignment", description: "Bring together the people who will develop and lead the solutions, building shared understanding, aligned priorities, and a common approach to moving forward." }
    ],
    deliverable: "A shared direction.",
    metaTitle: "Clarify: Establish Strategic Direction | The Mosaic Collaborative",
    metaDescription: "When you know you need change but don't know what to do next. Organizational assessment, roadmap development and an implementation toolkit that deliver a shared direction."
  },
  {
    slug: "build",
    number: "02",
    name: "Build",
    accent: "slate",
    promise: "Develop the capacity to execute.",
    ceoQuestion: "Do we have the right organization for where we're headed?",
    quote: "We have the strategy, now we need the people, processes and systems to support it.",
    symptoms: [
      "We're struggling to find and retain the talent we need.",
      "Our structure has changed, but the way we work together hasn't.",
      "Our systems and processes haven't kept pace with our growth.",
      "AI is changing the work, and we need to rethink what skills and tools managers need.",
      "Teams adopt new processes at different rates.",
      "We promote strong contributors who need help becoming strong leaders.",
      "Too much depends on a few key people.",
      "We merged organizations, but we haven't become one team.",
      "We're relying on heroic effort instead of reliable systems.",
      "Managers need support leading change."
    ],
    phases: [
      { role: "primary", name: "Leadership Structure & Governance", description: "Assess leadership structure, decision-making, roles, and governance to identify opportunities for stronger alignment and accountability." },
      { role: "primary", name: "Operating Model", description: "Establish clear workflows and operating routines that improve consistency, efficiency, and execution." },
      { role: "primary", name: "Measurement & Reinforcement", description: "Align performance measures, incentives, recognition, and accountability to reinforce the behaviors and results that support your strategy for the long term." },
      { role: "supporting", name: "Structure & Role Design", description: "Refine organizational structure to align roles, responsibilities, and teams with your strategic priorities." },
      { role: "supporting", name: "Talent Strategy & Acquisition", description: "Build a talent strategy to attract, develop, and retain the people who will drive your success." }
    ],
    deliverable: "A stronger foundation.",
    metaTitle: "Build: Develop the Capacity to Execute | The Mosaic Collaborative",
    metaDescription: "You have the strategy. Now you need the people, processes and systems to support it. Leadership structure, operating model, talent strategy and measurement that build a stronger foundation."
  },
  {
    slug: "activate",
    number: "03",
    name: "Activate",
    accent: "gold",
    promise: "Turn strategy into sustained action.",
    ceoQuestion: "How do we make it happen?",
    quote: "We have a plan, but we're struggling to execute.",
    symptoms: [
      "Employees understand the vision but aren't changing how they work.",
      "Decisions stall or get revisited repeatedly.",
      "Strategic priorities compete with day-to-day demands.",
      "We're using AI to change how we work, but new practices aren't taking hold.",
      "Key efforts lose momentum before they're completed.",
      "We're struggling to turn strategy into measurable results.",
      "Managers need support leading change.",
      "Adoption is inconsistent, creating inefficiencies and frustration."
    ],
    phases: [
      { role: "primary", name: "Change Readiness", description: "Identify who will lead the change, what's standing in the way, and what it will take for the organization to adopt new ways of working." },
      { role: "primary", name: "Manager Effectiveness", description: "Equip managers with the tools and practices to set clear expectations, coach performance, and reinforce accountability." },
      { role: "primary", name: "Shared Ownership", description: "Refine and codify the tools, processes, and practices your team uses to confidently sustain and build on the work into the future." },
      { role: "supporting", name: "Stakeholder Alignment", description: "Bring together the people who need to make change happen, building shared understanding, aligned priorities, and a common approach to moving forward." },
      { role: "supporting", name: "Guided Application", description: "Support leaders and teams as they translate new processes and expectations into everyday practice." }
    ],
    deliverable: "Sustainable traction.",
    metaTitle: "Activate: Turn Strategy into Sustained Action | The Mosaic Collaborative",
    metaDescription: "You have a plan but execution stalls. Change readiness, manager effectiveness and shared ownership that turn strategy into sustainable traction."
  },
  {
    slug: "reignite",
    number: "04",
    name: "Reignite",
    accent: "burgundy",
    promise: "Restore trust, engagement, and momentum.",
    ceoQuestion: "How do we strengthen our organization?",
    quote: "How do we restore trust, engagement, and a shared sense of purpose?",
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
    phases: [
      { role: "primary", name: "Organizational Assessment", description: "Assess organizational trust, engagement, leadership, and culture to identify what's eroding momentum and where to focus first." },
      { role: "primary", name: "Culture & Engagement Strategy", description: "Develop practical strategies that strengthen communication, trust, engagement, and connection to your organization's purpose." },
      { role: "primary", name: "Internal Capability", description: "Equip your organization with the ownership, tools, and practices to sustain a strong, engaged organization." },
      { role: "supporting", name: "Stakeholder Alignment", description: "Build shared understanding and commitment among leaders to restore trust, strengthen relationships, and establish a common path forward." },
      { role: "supporting", name: "Guided Application", description: "Support leaders and teams as they rebuild trust, strengthen collaboration, and establish new ways of working together." }
    ],
    deliverable: "Renewed momentum.",
    metaTitle: "Reignite: Restore Trust, Engagement and Momentum | The Mosaic Collaborative",
    metaDescription: "When trust has eroded and high performers are leaving. Organizational assessment, culture and engagement strategy and internal capability that deliver renewed momentum."
  }
];
