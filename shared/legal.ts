/**
 * Terms, privacy and affiliate pages. Plain data so the React page and the
 * worker's crawler HTML print the same words.
 *
 * Written from what the code actually does (checked October 2026): no
 * analytics, ad scripts or cookies, newsletter stores an
 * email address and signup date, the Trademark Pre-Check calls the USPTO from
 * the visitor's browser. If any of that changes, change this file with it.
 *
 * A paragraph that is exactly CONTACT_LINE renders the anti-scrape email
 * component in React and a pointer to the About page in crawler HTML.
 */
export const CONTACT_LINE = "__contact__";

export type LegalDoc = {
  slug: "terms" | "privacy" | "affiliate-disclosure";
  title: string;
  /** Short label for the footer link. */
  label: string;
  description: string;
  updated: string;
  sections: { heading?: string; paragraphs: string[] }[];
};

const UPDATED = "2 October 2026";

export const LEGAL_DOCS: LegalDoc[] = [
  {
    slug: "terms",
    title: "Terms of Service",
    label: "Terms of Service",
    description: "The terms for using usmanbashir.net, its articles and its free tools.",
    updated: UPDATED,
    sections: [
      {
        paragraphs: [
          "This is a personal website run by Usman Bashir. It is free to read and the tools are free to use. By using the site you agree to the terms below. They are written to be read, so they are short.",
        ],
      },
      {
        heading: "Not professional advice",
        paragraphs: [
          "Articles and tools here are general information. They are not legal, tax, financial or other professional advice. Check anything important with a qualified professional before you act on it.",
          "Prices, fees and plan details change. Articles say when they were checked, but verify on the provider's own site before you buy anything.",
        ],
      },
      {
        heading: "Free tools",
        paragraphs: [
          "The tools are provided as they are, with no guarantee that they are accurate, complete or always available. The Trademark Pre-Check is a first look at the US federal register, not a legal clearance search. A clear result does not mean a name is safe to use.",
        ],
      },
      {
        heading: "Copyright",
        paragraphs: [
          "The writing, images and code on this site are mine unless a page says otherwise. You are welcome to quote a short passage with a link back to the page it came from. Please do not republish whole articles.",
        ],
      },
      {
        heading: "Other websites",
        paragraphs: [
          "Some pages link to other websites. I do not control them and I am not responsible for their content, products or policies.",
        ],
      },
      {
        heading: "Liability",
        paragraphs: [
          "To the extent the law allows, I am not liable for any loss that comes from using this site, its articles or its tools.",
        ],
      },
      {
        heading: "Changes and contact",
        paragraphs: [
          "If these terms change, the date at the top of this page changes with them. Questions go to the same address as everything else:",
          CONTACT_LINE,
        ],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    label: "Privacy Policy",
    description: "What usmanbashir.net collects, which is very little, and what happens to it.",
    updated: UPDATED,
    sections: [
      {
        paragraphs: [
          "This page explains what this site collects about you and what happens to it. The short version: very little.",
        ],
      },
      {
        heading: "What I collect",
        paragraphs: [
          "If you subscribe to the newsletter, I store your email address and the date you signed up. I use it only to send you new posts and news about free tools. I do not sell it or share it with anyone.",
          "Nothing else. The site does not run analytics, advertising pixels or any other tracking scripts.",
        ],
      },
      {
        heading: "Cookies and local storage",
        paragraphs: [
          "This site does not set tracking cookies or third-party cookies.",
          "If you switch between the light and dark theme, that choice is saved in your browser's local storage. It stays on your device and is never sent to me.",
        ],
      },
      {
        heading: "Services that handle requests",
        paragraphs: [
          "Cloudflare hosts the site. Like any host, it processes your IP address and request details to deliver pages and block abuse.",
          "Fonts load from Google Fonts, so your browser connects to Google's servers to fetch them.",
          "Newsletter addresses are stored in a database hosted by Neon.",
          "The Trademark Pre-Check sends the name you search straight from your browser to the USPTO's public search service. This site does not see or store your search.",
        ],
      },
      {
        heading: "Your choices",
        paragraphs: [
          "You can unsubscribe at any time. To have your email address deleted, or to ask what I hold about you, email me and I will deal with it.",
          CONTACT_LINE,
        ],
      },
      {
        heading: "Changes",
        paragraphs: ["If this policy changes, the date at the top of this page changes with it."],
      },
    ],
  },
  {
    slug: "affiliate-disclosure",
    title: "Affiliate Disclosure",
    label: "Affiliate Disclosure",
    description: "Which links on usmanbashir.net can earn a commission, and who pays my salary.",
    updated: UPDATED,
    sections: [
      {
        paragraphs: [
          "Some links on this site are affiliate or referral links, and I may earn a commission or credit if you buy through them. It costs you nothing extra.",
          "My opinion of a product is the same whether or not it pays me, and I recommend plenty of things I earn nothing from. Several articles carry no affiliate links at all and say so.",
        ],
      },
      {
        heading: "Disclosures in articles",
        paragraphs: [
          "Each article discloses its own links and relationships, at the top, at the end, or both.",
        ],
      },
      {
        heading: "StartFleet",
        paragraphs: [
          "I work in content and SEO at StartFleet, which helps people outside the US set up American companies. StartFleet pays my salary, so any article here that touches what they do carries a disclosure, and StartFleet is treated as one option among several, not the default answer.",
        ],
      },
      {
        heading: "Questions",
        paragraphs: ["If a link or a recommendation looks off to you, tell me.", CONTACT_LINE],
      },
    ],
  },
];

export const findLegalDoc = (slug: string) => LEGAL_DOCS.find((d) => d.slug === slug);
