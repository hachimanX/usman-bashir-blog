/**
 * The one Person entity for the whole site, plus the profile links that prove
 * it. The worker injects this at the edge and the client <Seo> writes the same
 * object on navigation, so both read from here instead of keeping two copies
 * that drift apart.
 *
 * `alternateName` carries the full legal name, so a search for "Muhammad Usman
 * Bashir" resolves to this person without the copy having to use it everywhere.
 * `@id` lets the homepage, the About page and every article byline point at the
 * same entity rather than declaring three separate Usmans.
 */
export const SITE_ORIGIN = "https://usmanbashir.net";
export const PERSON_ID = `${SITE_ORIGIN}/#person`;

export const PROFILE_LINKS = {
  linkedin: "https://linkedin.com/in/usmanbashir",
  x: "https://x.com/imusmanbashir",
  startfleet: "https://startfleet.io",
  bobcat: "https://bobcatdigital.co",
} as const;

// Entities are linked to Wikipedia via sameAs so search engines and AI systems
// can resolve them against a knowledge graph rather than guessing from context.
const TOPIC_ENTITIES = [
  {
    "@type": "Thing",
    name: "Search engine optimization",
    sameAs: "https://en.wikipedia.org/wiki/Search_engine_optimization",
  },
  {
    "@type": "Thing",
    name: "Content marketing",
    sameAs: "https://en.wikipedia.org/wiki/Content_marketing",
  },
  {
    "@type": "Thing",
    name: "Artificial intelligence",
    sameAs: "https://en.wikipedia.org/wiki/Artificial_intelligence",
  },
  {
    "@type": "Thing",
    name: "Print on demand",
    sameAs: "https://en.wikipedia.org/wiki/Print_on_demand",
  },
  {
    "@type": "Thing",
    name: "Limited liability company",
    sameAs: "https://en.wikipedia.org/wiki/Limited_liability_company",
  },
];

/** Person fields without @context, for nesting inside ProfilePage or an author. */
export const PERSON = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Usman Bashir",
  alternateName: ["Muhammad Usman Bashir"],
  url: SITE_ORIGIN,
  image: `${SITE_ORIGIN}/usman.jpg`,
  jobTitle: "SEO and Content Practitioner",
  worksFor: { "@type": "Organization", name: "StartFleet", url: PROFILE_LINKS.startfleet },
  owns: { "@type": "Organization", name: "Bobcat Digital LLC", url: PROFILE_LINKS.bobcat },
  knowsAbout: TOPIC_ENTITIES,
  sameAs: [PROFILE_LINKS.x, PROFILE_LINKS.linkedin],
};

export const PERSON_SCHEMA = { "@context": "https://schema.org", ...PERSON };

/** The About page is the profile page for that same person. */
export const PROFILE_PAGE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: `${SITE_ORIGIN}/about`,
  mainEntity: PERSON,
};

/** Byline reference for articles and tools: points at the entity, not a copy. */
export const AUTHOR_REF = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Usman Bashir",
  url: `${SITE_ORIGIN}/about`,
};
