import index from "@/generated/articles-index.json";
import { AUTHOR_REF, SITE_ORIGIN } from "@shared/person";

/**
 * Articles come from Markdown in content/, compiled at build time by
 * scripts/build-content.mjs. Nothing here touches a database: the list ships in
 * the bundle, and each article body is either embedded in its prerendered page
 * (window.__ARTICLE__) or fetched as a static JSON file on in-app navigation.
 */
export type ArticleMeta = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** ISO timestamp. */
  date: string;
  readTime: string;
};

export type Article = ArticleMeta & { html: string };

declare global {
  interface Window {
    __ARTICLE__?: Article;
  }
}

export const ARTICLES: ArticleMeta[] = index;

// The prerender passes the full articles in here before rendering, so an
// article page has its body on the very first render, same as the browser.
let serverArticles: Article[] | null = null;
export function setServerArticles(articles: Article[]) {
  serverArticles = articles;
}

/** The article available without a network request, if any. */
export function initialArticle(slug: string): Article | null {
  if (serverArticles) return serverArticles.find((a) => a.slug === slug) ?? null;
  if (typeof window !== "undefined" && window.__ARTICLE__?.slug === slug) return window.__ARTICLE__;
  return null;
}

export async function loadArticle(slug: string): Promise<Article> {
  const res = await fetch(`/data/articles/${encodeURIComponent(slug)}.json`);
  if (!res.ok) throw new Error("not found");
  return res.json();
}

export function formatArticleDate(iso: string, month: "short" | "long" = "short") {
  return new Date(iso).toLocaleDateString("en-US", { month, day: "numeric", year: "numeric", timeZone: "UTC" });
}

/** BlogPosting schema, shared by the prerender and the client <Seo>. */
export function articleSchema(a: ArticleMeta) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title,
    description: a.excerpt,
    datePublished: a.date,
    dateModified: a.date,
    mainEntityOfPage: `${SITE_ORIGIN}/article/${a.slug}`,
    author: AUTHOR_REF,
  };
}
