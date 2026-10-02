/**
 * Recommendations shown on the homepage. Shared so the worker can print them
 * in the crawler HTML too: who vouches for the person is part of what this
 * site exists to show.
 *
 * Order is deliberate: the one with a measurable result and proof leads, then
 * the named, checkable person, then the rest. Generic one-liners from LinkedIn
 * or Upwork that say nothing specific were left out on purpose.
 */
export type Testimonial = {
  quote: string;
  /** Omitted for reviewers who are not public (Upwork clients). The project
   *  description then leads the attribution instead of a vague "Client". */
  author?: string;
  role: string;
  /** Only set where there is a real platform to point at. Omitted otherwise,
   *  and the line is dropped rather than filled with something meaningless. */
  source?: string;
  /** A page that proves the author is a real, findable person. */
  authorUrl?: string;
  /** "featured": first, full width, with its image. "beside-video": large,
   *  next to the video testimonial. Everything else goes in the grid. */
  placement?: "featured" | "beside-video";
  /** Evidence shown beside a featured quote. */
  image?: { src: string; alt: string; width: number; height: number; caption: string };
};

export const TESTIMONIALS: Testimonial[] = [
  {
    // Upwork review for a three-month SEO content contract. Opening paragraph
    // kept verbatim apart from one missing word ("enabled to company" ->
    // "enabled the company"). The client is not named: Upwork does not show a
    // public profile to link to. The bullet list of highlights was cut for length.
    quote:
      "Usman worked as a SEO Content Editor for a 3 month period and his work was excellent. His ability to conduct keyword research, proofread and publish online content was exceptional. Usman was able to produce engaging quality content that speaks to our audience. As a result, it enabled the company to increase its organic traffic 5x in short period of time, and generates more leads for our sales team.",
    role: "3-month SEO content contract",
    source: "Upwork",
    placement: "featured",
    image: {
      src: "/images/client-organic-traffic.webp",
      alt: "Ahrefs chart of the client's organic traffic over a year, rising from about 65K to a peak near 240K a month.",
      width: 1325,
      height: 472,
      caption: "The client's organic traffic in Ahrefs.",
    },
  },
  {
    // Zain's LinkedIn recommendation (January 2025), whole sentences kept
    // verbatim. Cut: the "2X or 3X your growth" line (a number nobody can
    // check) and the general-praise middle. "Mohammad Usman Bashir" is left as
    // he wrote it on purpose: it ties the full legal name to SEO on this page.
    // Named in full and linked because he is public and findable; "Zain Ul
    // Abdin" is the name on both his LinkedIn and his own site's title.
    quote:
      "I've had the pleasure of working with Mohammad Usman Bashir, and he's one of the best SEO specialists I've come across. He played a huge role in helping our startup push past its limits in SEO, driving amazing results. Plus, he's the kind of person who can fix your SEO rankings while cracking a joke to keep things light.",
    author: "Zain Ul Abdin",
    role: "Growth Marketer",
    source: "LinkedIn",
    authorUrl: "https://www.zainameen.com",
    placement: "beside-video",
  },
  {
    quote:
      "Usman helped manage the content and SEO edits of multiple WordPress sites I had under my portfolio. He was always quick to understand the instructions, communicated effectively, and had a great attitude!",
    author: "Nate T.",
    role: "Network Engineer",
    source: "LinkedIn",
  },
  {
    // Anna wrote "Mohammad", which is the legal first name. Swapped to "Usman"
    // outright rather than the bracketed [Usman]: brackets are a journalism
    // convention that reads as an odd typo to most people, and the substitution
    // changes nothing about the meaning.
    quote:
      "I will recommend Usman for any role that requires top-notch SEO expertise and high-quality writing. His blend of skills and professionalism will undoubtedly drive success and growth.",
    author: "Anna P.",
    role: "Admin Coordinator",
    source: "LinkedIn",
  },
  {
    // Verbatim, including the client's own grammar.
    quote:
      "Usman is a very cooperative and smart person who help me a lot for website management work. I would like to recommend him to any of my friends who need same service. Super nice!",
    role: "Website management",
    source: "Upwork",
  },
  {
    quote:
      "It is really a pleasure to work with Usman on various SEO activities. Looking forward to the next collab.",
    role: "SEO projects",
    source: "Upwork",
  },
  {
    // Abdullah's actual words, passed on verbatim by Usman. He said them to
    // Usman directly ("You did an amazing job..."), so the direct address is
    // converted to third person for readers who are not the person being
    // addressed. Nothing added, meaning unchanged.
    quote: "Usman did an amazing job on the design. Really loving the new look!",
    author: "Abdullah S.",
    role: "Co-Founder, MTR Co.",
  },
];

/**
 * Amanda Dong's video review (recorded January 2025). Self-hosted: 16.7 MB,
 * under the 25 MB per-file limit for Workers static assets, and remuxed with
 * +faststart so it starts playing before the whole file has downloaded.
 * TODO: add her company name once Usman confirms the exact spelling.
 */
export const VIDEO_TESTIMONIAL = {
  author: "Amanda Dong",
  role: "Overseas Director, Hong Kong",
  src: "/media/amanda-dong-testimonial.mp4",
  poster: "/images/amanda-dong-poster.webp",
  width: 480,
  height: 848,
  duration: "1:34",
};
