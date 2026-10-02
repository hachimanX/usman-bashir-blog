import { useEffect } from "react";
import { SITE_ORIGIN } from "@shared/person";

const SITE_NAME = "Usman Bashir";
const DEFAULT_IMAGE = `${SITE_ORIGIN}/og-default.png`;

export interface SeoProps {
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
 * Head tags for a page, in two modes.
 *
 * At build time the prerender renders each page on the server, where effects
 * never run. Each <Seo> instead reports its props to the sink set below, and
 * the prerender writes those exact tags into the static HTML (seoHeadTags).
 * One source of truth: the page's own <Seo> props.
 *
 * In the browser it upserts the same tags on client-side navigation. Every
 * tag carries data-seo so a route change replaces the previous page's tags
 * instead of piling them up.
 */
let ssrSink: ((props: SeoProps) => void) | null = null;
export function setSeoSink(sink: ((props: SeoProps) => void) | null) {
  ssrSink = sink;
}

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

export default function Seo(props: SeoProps) {
  const { title, description, path, image, type = "website", publishedTime, schema } = props;
  if (ssrSink) ssrSink(props);

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

    // The prerender wrote this page's schema into the static HTML. Drop it
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

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** The same tags as the effect above, as an HTML string for the prerender. */
export function seoHeadTags(meta: SeoProps): string {
  const url = `${SITE_ORIGIN}${meta.path}`;
  const image = meta.image || DEFAULT_IMAGE;
  const tags = [
    `<link rel="canonical" href="${escapeHtml(url)}">`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" data-seo>`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" data-seo>`,
    `<meta property="og:type" content="${meta.type || "website"}" data-seo>`,
    `<meta property="og:url" content="${escapeHtml(url)}" data-seo>`,
    `<meta property="og:image" content="${escapeHtml(image)}" data-seo>`,
    `<meta property="og:site_name" content="${SITE_NAME}" data-seo>`,
    `<meta name="twitter:card" content="summary_large_image" data-seo>`,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" data-seo>`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" data-seo>`,
    `<meta name="twitter:image" content="${escapeHtml(image)}" data-seo>`,
    `<meta name="twitter:creator" content="@imusmanbashir" data-seo>`,
  ];
  if (meta.publishedTime) {
    tags.push(`<meta property="article:published_time" content="${escapeHtml(meta.publishedTime)}" data-seo>`);
  }
  if (meta.schema) {
    // "</script>" inside JSON would close the tag early.
    const json = JSON.stringify(meta.schema).replace(/</g, "\\u003c");
    tags.push(`<script type="application/ld+json" data-seo-schema>${json}</script>`);
  }
  return tags.join("");
}

export { SITE_NAME, SITE_ORIGIN };
