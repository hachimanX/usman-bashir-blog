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
    blurb: "Search the US trademark register before you commit to a name.",
    description:
      "Search the live US federal trademark register for a name or design phrase, narrowed to the product categories that actually apply to you. Free, no signup, results shown here.",
    pillar: "Business",
    status: "live",
  },
  {
    slug: "pod-profit-calculator",
    name: "Print-on-Demand Profit Calculator",
    blurb: "Work out what you actually keep after platform fees.",
    description:
      "Enter your costs and the fees your sales channel charges, and get your real profit per unit, break-even volume and a suggested price.",
    pillar: "Print on Demand",
    status: "soon",
  },
];

export const liveTools = () => TOOLS.filter((t) => t.status === "live");
export const findTool = (slug: string) => TOOLS.find((t) => t.slug === slug);
