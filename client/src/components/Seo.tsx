import { useEffect } from "react";

const SITE_NAME = "Usman Bashir";
const SITE_ORIGIN = "https://usmanbashir.net";
const DEFAULT_IMAGE = `${SITE_ORIGIN}/og-default.png`;

interface SeoProps {
  title: string;
  description: string;
  /** Path only, e.g. "/about". Combined with the canonical origin. */
  path: string;
  image?: string | null;
  type?: "website" | "article";
  publishedTime?: string | null;
  /** Extra JSON-LD to publish alongside the page. */
  schema?: Record<string, unknown> | null;
}

/**
 * Head management for a client-rendered SPA. Every tag is tagged with
 * data-seo so a route change can clear the previous page's tags before
 * writing its own — otherwise they accumulate as the user navigates.
 */
function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
  el.setAttribute("data-seo", "");
}

export default function Seo({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  schema,
}: SeoProps) {
  useEffect(() => {
    const url = `${SITE_ORIGIN}${path}`;
    const img = image || DEFAULT_IMAGE;

    document.title = title;

    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", img);
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", img);
    upsertMeta("name", "twitter:creator", "@imusmanbashir");
    if (publishedTime) upsertMeta("property", "article:published_time", publishedTime);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    // The worker injects the same schema into the shell at the edge. Drop it
    // before adding the client copy so navigation never leaves two blocks.
    document.head.querySelectorAll("[data-seo-schema]").forEach((el) => el.remove());

    let ld: HTMLScriptElement | null = null;
    if (schema) {
      ld = document.createElement("script");
      ld.type = "application/ld+json";
      ld.setAttribute("data-seo-schema", "");
      ld.textContent = JSON.stringify(schema);
      document.head.appendChild(ld);
    }

    return () => {
      ld?.remove();
      document.head
        .querySelectorAll('meta[data-seo][property^="article:"]')
        .forEach((el) => el.remove());
    };
  }, [title, description, path, image, type, publishedTime, schema]);

  return null;
}

export { SITE_NAME, SITE_ORIGIN };
