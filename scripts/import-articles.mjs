/**
 * Publish Markdown articles into the posts table.
 *
 *   node scripts/import-articles.mjs <articles-dir> [--dry-run] [--status=draft|published]
 *     [--skip=slug,slug] [--order=slug,slug]
 *
 * --order lists slugs newest-first; on first publish they get publish times one
 * minute apart in that order, which is the order the homepage shows them in.
 *
 * Each file needs the house header the writing pipeline produces:
 *
 *   # Title
 *   **Meta description:** ...
 *   **URL slug:** `/the-slug`
 *   (optional **Target keyword:**, **Pillar:**, **Status:** lines, then ---)
 *
 * Upserts by slug, so it is safe to re-run after editing the Markdown. On an
 * existing post it replaces title, body, excerpt, meta description and read
 * time, but keeps the category, SEO title and schema markup set in the admin,
 * and never moves an existing publish date. Reads DATABASE_URL from .dev.vars.
 * Files ending .linkedin.md or .DRAFT.md are skipped.
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, basename } from "node:path";
import MarkdownIt from "markdown-it";
import { neon } from "@neondatabase/serverless";

const args = process.argv.slice(2);
const dir = args.find((a) => !a.startsWith("--"));
const dryRun = args.includes("--dry-run");
const status = (args.find((a) => a.startsWith("--status=")) || "--status=published").split("=")[1];
// Explicit skip list, e.g. --skip=claude-vs-chatgpt-marketing-writing,other-slug
const skip = new Set(
  (args.find((a) => a.startsWith("--skip=")) || "--skip=").split("=")[1].split(",").filter(Boolean),
);

const order = (args.find((a) => a.startsWith("--order=")) || "--order=").split("=")[1].split(",").filter(Boolean);
const rank = (slug) => (order.includes(slug) ? order.indexOf(slug) : order.length);

if (!dir) {
  console.error("Usage: node scripts/import-articles.mjs <articles-dir> [--dry-run] [--status=draft|published] [--skip=slug,slug]");
  process.exit(1);
}

const env = Object.fromEntries(
  readFileSync(".dev.vars", "utf8")
    .split(/\r?\n/)
    .filter((l) => /^[A-Z_]+=/.test(l))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).replace(/^"|"$/g, "")]),
);
const sql = neon(env.DATABASE_URL);

// html: true because articles embed hand-built HTML charts and anchors.
const md = new MarkdownIt({ html: true, linkify: false, typographer: false });

const META_LINE = /^\*\*(Meta description|URL slug(?: suggestion)?|Target keyword|Pillar|Status):\*\*\s*(.*)$/;

function parseArticle(raw) {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  let i = 0;
  while (i < lines.length && !lines[i].startsWith("# ")) i++;
  const title = lines[i].slice(2).trim();
  i++;

  const meta = {};
  for (; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "" || line.startsWith("<!--")) continue;
    const m = line.match(META_LINE);
    if (!m) break;
    meta[m[1].toLowerCase()] = m[2].trim();
  }
  // A horizontal rule straight after the header belongs to the header.
  if (lines[i]?.trim() === "---") i++;

  const body = lines.slice(i).join("\n").replace(/<!--[\s\S]*?-->/g, "").trim();
  const slugSource = meta["url slug"] || meta["url slug suggestion"] || "";
  const slug = slugSource.replace(/[`\s]/g, "").replace(/^\/+|\/+$/g, "").replace(/^article\//, "");
  return { title, slug, metaDescription: meta["meta description"] || "", body };
}

function readTime(html) {
  const words = html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

const files = readdirSync(dir)
  .filter((f) => f.endsWith(".md") && !f.endsWith(".linkedin.md") && !f.endsWith(".DRAFT.md"))
  .sort();

const articles = files
  .map((f) => ({ file: f, ...parseArticle(readFileSync(join(dir, f), "utf8")) }))
  .filter((a) => {
    if (skip.has(a.slug)) {
      console.log(`skip  ${a.file} (in --skip)`);
      return false;
    }
    if (!a.slug || !a.title) {
      console.log(`skip  ${a.file} (no title or slug in header)`);
      return false;
    }
    return true;
  })
  .sort((a, b) => rank(a.slug) - rank(b.slug));

const existing = await sql`select * from posts where slug = any(${articles.map((a) => a.slug)})`;
const bySlug = new Map(existing.map((r) => [r.slug, r]));

if (!dryRun && existing.length) {
  // Keep the rows being overwritten, so an import is never a one-way door.
  mkdirSync("scripts/backups", { recursive: true });
  const out = `scripts/backups/posts-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
  writeFileSync(out, JSON.stringify(existing, null, 2));
  console.log(`backup ${existing.length} existing rows -> ${out}`);
}

// Stagger publish times by a minute in the given order so the newest-first
// listing is deliberate rather than whatever order the inserts landed in.
const now = Date.now();
for (const [index, a] of articles.entries()) {
  const html = md.render(a.body);
  const prior = bySlug.get(a.slug);
  const publishedAt =
    status === "published" ? prior?.published_at ?? new Date(now - index * 60_000) : prior?.published_at ?? null;
  const row = {
    title: a.title,
    content: html,
    excerpt: a.metaDescription,
    metaDescription: a.metaDescription,
    readTime: readTime(html),
  };
  console.log(
    `${dryRun ? "would " : ""}${prior ? "update" : "insert"} ${a.slug}  [${status}]  ${row.readTime}  ${html.length} chars`,
  );
  if (dryRun) continue;

  if (prior) {
    await sql`
      update posts set
        title = ${row.title}, content = ${row.content}, excerpt = ${row.excerpt},
        meta_description = ${row.metaDescription}, read_time = ${row.readTime},
        status = ${status}, published_at = ${publishedAt}, updated_at = now()
      where slug = ${a.slug}`;
  } else {
    await sql`
      insert into posts (title, slug, content, excerpt, meta_description, read_time, status, published_at)
      values (${row.title}, ${a.slug}, ${row.content}, ${row.excerpt}, ${row.metaDescription},
              ${row.readTime}, ${status}, ${publishedAt})`;
  }
}
console.log(dryRun ? "dry run, nothing written" : "done");
