/**
 * Homepage copy. The React page renders it and the worker prints the same words
 * as plain HTML for crawlers that do not run JavaScript, so it lives here once.
 * Edit the wording in this file and both stay in step.
 */
export const HOME_META = {
  title: "Usman Bashir | SEO, Marketing and Building with AI",
  description:
    "I'm Usman Bashir. I work in SEO and marketing, and I build apps and tools with AI. What I've built, what I've written, and how to reach me.",
};

// Headlines are split so the React page can set the accent word in italic.
// The worker joins the parts back into one plain sentence.
export const HERO = {
  lead: "I work in SEO and marketing, and I build apps and tools",
  accent: "with AI.",
  sub: "This is where I keep what I build and what I learn, including the parts that didn't work.",
};

export type WorkArea = {
  key: "seo" | "pr" | "design" | "ai";
  title: string;
  body: string;
};

export const WORK_AREAS: WorkArea[] = [
  {
    key: "seo",
    title: "SEO and content",
    body: "I've worked in SEO since 2020, mostly on WordPress, ecommerce and service sites. These days I run content and SEO at StartFleet, which helps people outside the US set up American companies.",
  },
  {
    key: "pr",
    title: "Digital PR and outreach",
    body: "Getting brands mentioned on sites people already read. It goes a lot better when there's something worth mentioning first.",
  },
  {
    key: "design",
    title: "Marketing and design",
    body: "Through Bobcat Digital I help brands with marketing and graphic design, from ecommerce storefronts to apparel graphics.",
  },
  {
    key: "ai",
    title: "Building with AI",
    body: "I build apps, tools and websites with AI, then check the work by hand. A few are public on this site. Most are private experiments, and what I learn from them ends up in my writing.",
  },
];

/**
 * Proof screenshots from Usman's own projects. Client names and domains are
 * deliberately left out (the Search Console card already has the domain
 * blurred). Only screenshots he remembers the project for go here.
 */
export const RESULTS = {
  intro: "From projects I've worked on. Names and domains are left out on purpose.",
  gsc: {
    value: "70K",
    label: "clicks from Google Search in 28 days",
    source: "Google Search Console",
    image: { src: "/images/gsc-70k-clicks.webp", width: 467, height: 650 },
    alt: "Google Search Console card: the site reached 70K clicks from Google Search in the past 28 days.",
  },
  ahrefs: {
    value: "52.6K",
    label: "monthly organic traffic on a DR 3.9 site",
    source: "Ahrefs site overview",
    image: { src: "/images/ahrefs-site-overview.webp", width: 1879, height: 468 },
    alt: "Ahrefs overview: Domain Rating 3.9, 58 referring domains, 2.9K organic keywords and 52.6K organic traffic.",
  },
};

export const CONTACT = {
  lead: "Get in",
  accent: "touch",
  tail: "",
  body: "Email is the quickest way to reach me. LinkedIn works too.",
};
