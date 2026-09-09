// src/data/site.ts
// Nav, contact and credit. TODO items confirmed with Roz before launch.
export const site = {
  name: "The Mosaic Collaborative",
  tagline: "We align the pieces. Your business thrives.",
  strapline: "Strategy. Insight. Impact.",
  descriptor: "Consulting for meaningful progress.",
  url: "https://mosaiccollaborative.com",
  email: "TODO@mosaiccollaborative.com", // TODO confirm with Roz
  location: "New York metro area, working nationally", // TODO confirm
  linkedinCompany: "", // TODO
  nav: [
    { label: "About", href: "/about/" },
    { label: "How We Work", href: "/how-we-work/" },
    { label: "Services", href: "/services/" },
    { label: "Insights", href: "/insights/" },
    { label: "Contact", href: "/contact/", cta: true }
  ],
  credit: { label: "Site by Live Web Studios", href: "https://livewebstudios.com" }
};
