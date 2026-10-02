/**
 * Turns the built client into a static site: renders every route once with the
 * server bundle and writes finished HTML files into dist/public, plus
 * sitemap.xml, robots.txt and the noindex header. Runs as the last build step.
 *
 * Visitors then get complete pages straight from Cloudflare's edge. No worker,
 * no database on the way, and the content is on screen before any JS runs.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const OUT = resolve("dist/public");
const server = await import(pathToFileURL(resolve("dist/server/entry-server.js")).href);
const { render, routes, SITE_NOINDEX, SITE_ORIGIN } = server;

const template = readFileSync(join(OUT, "index.html"), "utf8");
const escapeHtml = (v) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const robotsMeta = SITE_NOINDEX ? `<meta name="robots" content="noindex">` : "";

for (const route of routes) {
  const { html, head, title, description } = render(route.path);
  // Embed the article body so the page hydrates without fetching it again.
  const data = route.article
    ? `<script>window.__ARTICLE__=${JSON.stringify(route.article).replace(/</g, "\\u003c")}</script>`
    : "";
  const page = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escapeHtml(description)}" />`)
    .replace("</head>", `${head}${robotsMeta}</head>`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>${data}`);
  if (page === template) throw new Error(`Template markers not found for ${route.path}`);
  const file = join(OUT, route.file);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page);
}

const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
    .filter((r) => r.sitemap)
    .map(
      (r) =>
        `  <url><loc>${SITE_ORIGIN}${r.path === "/" ? "/" : r.path}</loc><lastmod>${r.lastmod ?? today}</lastmod><priority>${r.priority ?? "0.5"}</priority></url>`,
    )
    .join("\n")}\n</urlset>\n`,
);

// Open on purpose even while noindex is on: Google has to fetch a page to see
// its noindex. Blocking it here would leave old URLs lingering in results.
writeFileSync(join(OUT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`);

if (SITE_NOINDEX) {
  const headers = readFileSync(join(OUT, "_headers"), "utf8").replace(/\s*$/, "");
  writeFileSync(join(OUT, "_headers"), `${headers}\n  X-Robots-Tag: noindex\n`);
}

// The server bundle is a build tool, not something to upload.
rmSync(resolve("dist/server"), { recursive: true, force: true });

console.log(`prerendered ${routes.length} pages${SITE_NOINDEX ? " (noindex on)" : ""}`);
