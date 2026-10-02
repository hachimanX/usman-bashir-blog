/**
 * Single source of truth for the free tools.
 *
 * The tools index page, the header/footer nav and the worker's sitemap all read
 * from here, so adding a tool means adding one entry plus a route in App.tsx.
 * Keep `worker/index.ts`'s TOOLS list in sync — the worker cannot import from
 * client code, so that copy is deliberate and small.
 */
export type Tool = {
  slug: string;
  name: string;
  /** One line for the index card and the nav dropdown. */
  blurb: string;
  /** Longer description for the tool page's own intro and meta description. */
  description: string;
  /** Which content pillar it supports — used for grouping once there are more. */
  pillar: "Business" | "Print on Demand" | "SEO";
  status: "live" | "soon";
};

export const TOOLS: Tool[] = [
  {
    slug: "trademark-precheck",
    name: "Trademark Pre-Check",
    blurb: "Screen brand names across all 45 US trademark classes in seconds.",
    description:
      "Search the live US federal trademark database before committing to a name or domain. Filter by relevant classes with zero signup, ads, or data collection.",
    pillar: "Business",
    status: "live",
  },
  {
    slug: "pod-profit-calculator",
    name: "Print-on-Demand Profit Calculator",
    blurb: "Calculate your true net margin after manufacturing, shipping, and platform cuts.",
    description:
      "Enter your base production costs, shipping, and sales channel fees to see your exact unit margin, break-even volume, and target retail price.",
    pillar: "Print on Demand",
    status: "soon",
  },
];

export const liveTools = () => TOOLS.filter((t) => t.status === "live");
export const findTool = (slug: string) => TOOLS.find((t) => t.slug === slug);
