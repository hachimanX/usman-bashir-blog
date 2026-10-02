/**
 * Server entry for the build-time prerender (scripts/prerender.mjs). Vite
 * compiles this to dist/server; the script imports it, renders every route to
 * HTML once, and writes static files. Nothing here runs in production.
 */
import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import App from "./App";
import { setSeoSink, seoHeadTags, type SeoProps } from "@/components/Seo";
import { setServerArticles, type Article } from "@/lib/content";
import { liveTools } from "@/lib/tools";
import full from "@/generated/articles-full.json";
import { LEGAL_DOCS } from "@shared/legal";
import { SITE_NOINDEX } from "@shared/site";
import { SITE_ORIGIN } from "@shared/person";

const articles = full as Article[];
setServerArticles(articles);

export type PrerenderRoute = {
  path: string;
  /** Output file under dist/public. Extensionless URLs map to .html files. */
  file: string;
  /** Embedded so the article page hydrates without fetching its own body. */
  article?: Article;
  /** Listed in sitemap.xml. */
  sitemap: boolean;
  priority?: string;
  lastmod?: string;
};

export const routes: PrerenderRoute[] = [
  { path: "/", file: "index.html", sitemap: true, priority: "1.0" },
  { path: "/about", file: "about.html", sitemap: true, priority: "0.8" },
  { path: "/articles", file: "articles.html", sitemap: true, priority: "0.7" },
  { path: "/tools", file: "tools.html", sitemap: true, priority: "0.7" },
  ...liveTools().map((t) => ({
    path: `/tools/${t.slug}`,
    file: `tools/${t.slug}.html`,
    sitemap: true,
    priority: "0.7",
  })),
  ...LEGAL_DOCS.map((d) => ({ path: `/${d.slug}`, file: `${d.slug}.html`, sitemap: true, priority: "0.2" })),
  ...articles.map((a) => ({
    path: `/article/${a.slug}`,
    file: `article/${a.slug}.html`,
    article: a,
    sitemap: true,
    priority: "0.6",
    lastmod: a.date.slice(0, 10),
  })),
  // Any unmatched path renders the NotFound page.
  { path: "/__not-found__", file: "404.html", sitemap: false },
];

/** Renders one route; returns the app markup and the head tags its <Seo> asked for. */
export function render(path: string): { html: string; head: string; title: string; description: string } {
  let seo: SeoProps | null = null;
  setSeoSink((props) => {
    seo = props;
  });
  const html = renderToString(
    <Router ssrPath={path}>
      <App />
    </Router>,
  );
  setSeoSink(null);
  const meta = seo as SeoProps | null;
  if (!meta) throw new Error(`Route ${path} rendered no <Seo>`);
  return { html, head: seoHeadTags(meta), title: meta.title, description: meta.description };
}

export { SITE_NOINDEX, SITE_ORIGIN };
