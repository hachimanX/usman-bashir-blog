/**
 * Turns the Markdown articles in content/ into the data the static build uses.
 *
 *   content/articles/*.md   published, committed to the public repo
 *   content/drafts/*.md     git-ignored; included only by `npm run build:drafts`
 *
 * Each file: a small front matter block, then the writing pipeline's header.
 *
 *   ---
 *   date: 2026-10-02T13:09:42Z
 *   category: AI & Marketing
 *   ---
 *   # Title
 *   **Meta description:** ...
 *   **URL slug:** `/the-slug`
 *
 * Writes:
 *   client/src/generated/articles-index.json   list data, bundled into the client
 *   client/src/generated/articles-full.json    with bodies, used only by the prerender
 *   client/public/data/articles/<slug>.json    one body per file, fetched on in-app navigation
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";
import MarkdownIt from "markdown-it";

const includeDrafts = process.argv.includes("--drafts") || process.env.INCLUDE_DRAFTS === "1";
// html: true because articles embed hand-built HTML charts and anchors.
const md = new MarkdownIt({ html: true, linkify: false, typographer: false });
const META_LINE = /^\*\*(Meta description|URL slug(?: suggestion)?|Target keyword|Pillar|Status):\*\*\s*(.*)$/;

function parse(raw, file) {
  const text = raw.replace(/\r\n/g, "\n");
  const fm = {};
  let rest = text;
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (m) {
    for (const line of m[1].split("\n")) {
      const i = line.indexOf(":");
      if (i > 0) fm[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
    rest = text.slice(m[0].length);
  }

  const lines = rest.split("\n");
  let i = 0;
  while (i < lines.length && !lines[i].startsWith("# ")) i++;
  if (i === lines.length) throw new Error(`${file}: no "# Title" line`);
  const title = lines[i].slice(2).trim();
  i++;
  const meta = {};
  for (; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "" || line.startsWith("<!--")) continue;
    const h = line.match(META_LINE);
    if (!h) break;
    meta[h[1].toLowerCase()] = h[2].trim();
  }
  // A horizontal rule straight after the header belongs to the header.
  if (lines[i]?.trim() === "---") i++;

  const body = lines.slice(i).join("\n").replace(/<!--[\s\S]*?-->/g, "").trim();
  const slug = (meta["url slug"] || meta["url slug suggestion"] || "")
    .replace(/[`\s]/g, "")
    .replace(/^\/+|\/+$/g, "")
    .replace(/^article\//, "");
  if (!slug) throw new Error(`${file}: no **URL slug:** line`);
  if (!fm.date || Number.isNaN(Date.parse(fm.date))) throw new Error(`${file}: front matter needs a valid "date:"`);

  const html = md.render(body);
  const words = html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
  return {
    slug,
    title,
    excerpt: meta["meta description"] || "",
    category: fm.category || "General",
    date: new Date(fm.date).toISOString(),
    readTime: `${Math.max(1, Math.round(words / 200))} min read`,
    html,
  };
}

function readDir(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_") && f !== "README.md")
    .map((f) => parse(readFileSync(join(dir, f), "utf8"), join(dir, f)));
}

const articles = [...readDir("content/articles"), ...(includeDrafts ? readDir("content/drafts") : [])].sort(
  (a, b) => b.date.localeCompare(a.date),
);

const slugs = new Set();
for (const a of articles) {
  if (slugs.has(a.slug)) throw new Error(`Duplicate slug: ${a.slug}`);
  slugs.add(a.slug);
}

mkdirSync("client/src/generated", { recursive: true });
rmSync("client/public/data/articles", { recursive: true, force: true });
mkdirSync("client/public/data/articles", { recursive: true });

const index = articles.map(({ html, ...meta }) => meta);
writeFileSync("client/src/generated/articles-index.json", JSON.stringify(index, null, 2));
writeFileSync("client/src/generated/articles-full.json", JSON.stringify(articles));
for (const a of articles) writeFileSync(`client/public/data/articles/${a.slug}.json`, JSON.stringify(a));

console.log(
  `content: ${articles.length} article(s)${includeDrafts ? " incl. drafts" : ""}: ${articles.map((a) => a.slug).join(", ")}`,
);
