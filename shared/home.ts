/**
 * Homepage copy. The React page renders it and the worker prints the same words
 * as plain HTML for crawlers that do not run JavaScript, so it lives here once.
 * Edit the wording in this file and both stay in step.
 */
export const HOME_META = {
  title: "Usman Bashir | SEO, Content & AI-Built Tools",
  description:
    "I'm Usman Bashir. I help online businesses grow search traffic with articles that rank and free tools built with AI. Real data, battle-tested strategies, zero fluff.",
};

// Headlines are split so the React page can set the accent word in italic.
// The worker joins the parts back into one plain sentence.
export const HERO = {
  lead: "I help businesses grow organic search traffic with high-ranking content and tools built",
  accent: "with AI.",
  sub: "No fluff, no vanity metrics. Just clear keyword strategies, honest articles that rank, and free tools people actually bookmark.",
};

export type WorkArea = {
  key: "seo" | "pr" | "design" | "ai";
  title: string;
  body: string;
};

export const WORK_AREAS: WorkArea[] = [
  {
    key: "seo",
    title: "SEO & Organic Content",
    body: "I focus on high-intent keywords and content that directly answers what buyers type into Google. Since 2020, I've run SEO across ecommerce, SaaS, and service sites—currently leading content and organic search at StartFleet.",
  },
  {
    key: "pr",
    title: "Digital PR & Outreach",
    body: "Earning genuine coverage and links on publications people already read. Effective outreach isn't cold email blast spam; it starts with creating assets that editors and writers genuinely want to cite.",
  },
  {
    key: "design",
    title: "Marketing & Content Strategy",
    body: "Through my agency, Bobcat Digital, we help brands with marketing strategy, content systems, and creative storefronts. I direct the growth and content side, helping ecommerce and service businesses attract search traffic and convert visitors into buyers.",
  },
  {
    key: "ai",
    title: "Building with AI",
    body: "I build fast, interactive web tools and calculators with AI, then audit and refine every line by hand. Useful utility tools attract backlinks naturally, solve real user problems, and drive compounding search traffic.",
  },
];

/**
 * Proof screenshots from Usman's own projects. Client names and domains are
 * deliberately left out (the Search Console card already has the domain
 * blurred). Only screenshots he remembers the project for go here.
 */
export const RESULTS = {
  intro: "Recent organic performance from campaigns I've managed. Client domains and proprietary metrics are kept confidential.",
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
  lead: "Let's talk about your",
  accent: "growth",
  tail: "",
  body: "Whether you want to audit an underperforming site, build high-ranking content, or discuss an SEO project, send me a message. If I'm not the right fit for your goals, I'll tell you honestly.",
};
