// src/data/site.ts
// Nav, contact and credit. TODO items confirmed with Roz before launch.
export const site = {
  name: "The Mosaic Collaborative",
  tagline: "We align the pieces. Your business thrives.",
  strapline: "Strategy. Insight. Impact.",
  descriptor: "Consulting for meaningful progress.",
  url: "https://mosaiccollaborative.com",
  // TODO: new public address from Roz (leaning letstalk@, hello@ or contact@ also floated).
  // Do NOT use info@: it still receives mail for the previous Mosaic organization.
  // While this starts with "TODO" the site shows no address and routes people to the contact form.
  email: "TODO@mosaiccollaborative.com",
  location: "New York metro area, working nationally", // TODO confirm
  linkedinCompany: "", // TODO
  nav: [
    { label: "About", href: "/about/" },
    // How We Work was dropped in round 1. The journey pages keep their /how-we-work/ URLs
    // and count as part of Services for the active nav state.
    { label: "Services", href: "/services/", match: ["/how-we-work/"] },
    { label: "Insights", href: "/insights/" },
    { label: "Contact", href: "/contact/", cta: true }
  ],
  credit: { label: "Site by Live Web Studios", href: "https://livewebstudios.com" }
};
