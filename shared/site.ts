/**
 * Site-wide switches.
 *
 * SITE_NOINDEX keeps every page out of search results: the prerender adds
 * <meta name="robots" content="noindex"> to each page and an X-Robots-Tag
 * header to every response. robots.txt stays open on purpose, because a page
 * blocked there is never fetched, so Google would never see the noindex.
 *
 * Set it to false and push to let Google index the site.
 */
export const SITE_NOINDEX = true;
