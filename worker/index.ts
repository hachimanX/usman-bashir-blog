import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { deleteCookie, getSignedCookie, setSignedCookie } from "hono/cookie";

import { createDb } from "./db";
import { createStorage, type IStorage } from "./storage";
import { subscribeSchema } from "@shared/schema";
import { AUTHOR_REF, PERSON_SCHEMA, PROFILE_LINKS, PROFILE_PAGE_SCHEMA } from "@shared/person";
import { CONTACT, HERO, HOME_META, RESULTS, WORK_AREAS } from "@shared/home";
import { TESTIMONIALS, VIDEO_TESTIMONIAL } from "@shared/testimonials";
import { CONTACT_LINE, LEGAL_DOCS, type LegalDoc } from "@shared/legal";

export type Env = {
  DATABASE_URL: string;
  SESSION_SECRET: string;
  ADMIN_USERNAME: string;
  ADMIN_PASSWORD: string;
  IMGBB_API_KEY?: string;
  /** "true" keeps every page out of search results. Set in wrangler.toml [vars]. */
  SITE_NOINDEX?: string;
  /** Local only: `wrangler dev --var PREVIEW_DRAFTS:true`. Never set in wrangler.toml or secrets. */
  PREVIEW_DRAFTS?: string;
  ASSETS: { fetch: (request: Request) => Promise<Response> };
};

type Vars = { storage: IStorage };

const SITE_ORIGIN = "https://usmanbashir.net";

const COOKIE_NAME = "admin_session";
const COOKIE_VALUE = "1";
const SESSION_MAX_AGE = 7 * 24 * 60 * 60;

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

function estimateReadTime(content: string): string {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

const app = new Hono<{ Bindings: Env; Variables: Vars }>();

const dbMiddleware = createMiddleware<{ Bindings: Env; Variables: Vars }>(async (c, next) => {
  if (!c.env.DATABASE_URL) {
    return c.json({ message: "Server misconfigured: DATABASE_URL is not set" }, 500);
  }
  c.set("storage", createStorage(createDb(c.env.DATABASE_URL)));
  await next();
});

// Build the per-request database client once and hand it to every handler.
// /sitemap.xml is included because it is generated from published posts.
app.use("/api/*", dbMiddleware);
app.use("/sitemap.xml", dbMiddleware);


// The Express version stored sessions in process memory, which no longer exists
// on Workers. Auth now rides on a signed cookie, so SESSION_SECRET *is* the
// credential — there is deliberately no fallback default for it.
const requireAdmin = createMiddleware<{ Bindings: Env; Variables: Vars }>(async (c, next) => {
  if (!c.env.SESSION_SECRET) {
    return c.json({ message: "Server misconfigured: SESSION_SECRET is not set" }, 500);
  }
  const session = await getSignedCookie(c, c.env.SESSION_SECRET, COOKIE_NAME);
  if (session !== COOKIE_VALUE) return c.json({ message: "Unauthorized" }, 401);
  await next();
});

// Public
// Draft preview for local review. Needs the flag AND a localhost request, so a
// stray production variable still cannot expose unpublished posts.
const showDrafts = (c: any) =>
  c.env.PREVIEW_DRAFTS === "true" && ["localhost", "127.0.0.1"].includes(new URL(c.req.url).hostname);

app.get("/api/posts", async (c) => {
  return c.json(await c.get("storage").getPosts(!showDrafts(c)));
});

app.get("/api/posts/:slug", async (c) => {
  const post = await c.get("storage").getPostBySlug(c.req.param("slug"));
  if (!post || (post.status !== "published" && !showDrafts(c))) return c.json({ message: "Not found" }, 404);
  return c.json(post);
});

app.post("/api/subscribe", async (c) => {
  const parsed = subscribeSchema.safeParse(await c.req.json().catch(() => ({})));
  if (!parsed.success) return c.json({ message: "Enter a valid email address" }, 400);
  await c.get("storage").addSubscriber(parsed.data.email);
  return c.json({ ok: true });
});

// Auth
app.post("/api/admin/login", async (c) => {
  const { SESSION_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD } = c.env;
  if (!SESSION_SECRET || !ADMIN_USERNAME || !ADMIN_PASSWORD) {
    return c.json({ message: "Server misconfigured: admin credentials are not set" }, 500);
  }
  const { username, password } = await c.req.json<{ username?: string; password?: string }>();
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return c.json({ message: "Invalid credentials" }, 401);
  }
  await setSignedCookie(c, COOKIE_NAME, COOKIE_VALUE, SESSION_SECRET, {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return c.json({ ok: true });
});

app.post("/api/admin/logout", (c) => {
  deleteCookie(c, COOKIE_NAME, { path: "/" });
  return c.json({ ok: true });
});

app.get("/api/admin/me", requireAdmin, (c) => c.json({ ok: true }));

// Image upload via ImgBB
app.post("/api/admin/upload", requireAdmin, async (c) => {
  const apiKey = c.env.IMGBB_API_KEY;
  if (!apiKey) {
    return c.json({ message: "IMGBB_API_KEY not configured. Add it with `wrangler secret put IMGBB_API_KEY`." }, 400);
  }
  const { imageData } = await c.req.json<{ imageData?: string }>();
  if (!imageData) return c.json({ message: "No image data provided" }, 400);

  const formData = new URLSearchParams();
  formData.append("key", apiKey);
  formData.append("image", imageData.replace(/^data:image\/\w+;base64,/, ""));
  const response = await fetch("https://api.imgbb.com/1/upload", { method: "POST", body: formData });
  const data = (await response.json()) as any;
  if (!data.success) return c.json({ message: "Upload failed" }, 500);
  return c.json({ url: data.data.url });
});

// Admin posts
app.get("/api/admin/posts", requireAdmin, async (c) => {
  return c.json(await c.get("storage").getPosts(false));
});

app.post("/api/admin/posts", requireAdmin, async (c) => {
  const body = await c.req.json<Record<string, any>>();
  const { title, content, excerpt, coverImage, category, status, slug: customSlug, seoTitle, metaDescription, schemaMarkup } = body;
  if (!title) return c.json({ message: "Title is required" }, 400);
  const slug = customSlug ? slugify(customSlug) : slugify(title);
  try {
    const post = await c.get("storage").createPost({
      title, slug, content: content || "", excerpt: excerpt || "",
      coverImage: coverImage || null, category: category || "General",
      status: status || "draft", readTime: estimateReadTime(content || ""),
      seoTitle: seoTitle || null, metaDescription: metaDescription || null, schemaMarkup: schemaMarkup || null,
      publishedAt: status === "published" ? new Date() : null,
    });
    return c.json(post, 201);
  } catch (e: any) {
    if (e.message?.includes("unique")) return c.json({ message: "A post with this slug already exists — change the URL" }, 400);
    throw e;
  }
});

app.put("/api/admin/posts/:id", requireAdmin, async (c) => {
  const storage = c.get("storage");
  const body = await c.req.json<Record<string, any>>();
  const { title, content, excerpt, coverImage, category, status, slug: customSlug, seoTitle, metaDescription, schemaMarkup } = body;
  const existing = await storage.getPostById(c.req.param("id"));
  if (!existing) return c.json({ message: "Not found" }, 404);
  const nowPublishing = status === "published" && existing.status !== "published";
  try {
    const post = await storage.updatePost(c.req.param("id"), {
      title, content, excerpt, coverImage, category, status,
      readTime: estimateReadTime(content || ""),
      seoTitle: seoTitle || null, metaDescription: metaDescription || null, schemaMarkup: schemaMarkup || null,
      publishedAt: nowPublishing ? new Date() : existing.publishedAt,
      ...(customSlug ? { slug: slugify(customSlug) } : title ? { slug: slugify(title) } : {}),
    });
    return c.json(post);
  } catch (e: any) {
    if (e.message?.includes("unique")) return c.json({ message: "A post with this slug already exists — change the URL" }, 400);
    throw e;
  }
});

app.delete("/api/admin/posts/:id", requireAdmin, async (c) => {
  await c.get("storage").deletePost(c.req.param("id"));
  return c.json({ ok: true });
});

// Subscriber export. CSV so it imports straight into any email provider.
app.get("/api/admin/subscribers", requireAdmin, async (c) => {
  const rows = await c.get("storage").getSubscribers();
  const csv = ["email,source,created_at"]
    .concat(rows.map((r) => `${r.email},${r.source},${r.createdAt?.toISOString() ?? ""}`))
    .join("\n");
  return c.body(csv, 200, {
    "Content-Type": "text/csv; charset=utf-8",
    "Content-Disposition": 'attachment; filename="subscribers.csv"',
  });
});

app.all("/api/*", (c) => c.json({ message: "Not found" }, 404));

// Generated from published posts so it can never drift out of date. Reached
// because wrangler.toml lists these two paths in run_worker_first.
app.get("/sitemap.xml", async (c) => {
  const posts = await c.get("storage").getPosts(true);
  const urls = [
    { loc: `${SITE_ORIGIN}/`, lastmod: null, priority: "1.0" },
    { loc: `${SITE_ORIGIN}/articles`, lastmod: null, priority: "0.8" },
    { loc: `${SITE_ORIGIN}/tools`, lastmod: null, priority: "0.8" },
    ...TOOLS.map((t) => ({
      loc: `${SITE_ORIGIN}/tools/${t.slug}`,
      lastmod: null,
      priority: "0.7",
    })),
    { loc: `${SITE_ORIGIN}/about`, lastmod: null, priority: "0.5" },
    ...LEGAL_DOCS.map((d) => ({ loc: `${SITE_ORIGIN}/${d.slug}`, lastmod: null, priority: "0.2" })),
    ...posts.map((p) => ({
      loc: `${SITE_ORIGIN}/article/${p.slug}`,
      lastmod: (p.updatedAt ?? p.publishedAt)?.toISOString().slice(0, 10) ?? null,
      priority: "0.7",
    })),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}<priority>${u.priority}</priority></url>`,
  )
  .join("\n")}
</urlset>`;
  return c.body(body, 200, {
    "Content-Type": "application/xml; charset=utf-8",
    "Cache-Control": "public, max-age=3600",
  });
});

app.get("/robots.txt", (c) =>
  c.body(
    [
      "User-agent: *",
      "Allow: /",
      "Disallow: /admin",
      "",
      `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
      "",
    ].join("\n"),
    200,
    { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  ),
);


// ---------------------------------------------------------------------------
// Server-injected page metadata
//
// The client is a Vite SPA, so the shipped index.html carries no per-page head
// tags. Social scrapers (LinkedIn, X, Facebook) and non-rendering crawlers do
// not execute JavaScript, so the React <Seo> component is invisible to them.
// Here we rewrite the shell's <head> at the edge before it ever leaves, which
// makes titles, canonicals, OG cards and JSON-LD real HTML.
//
// The client <Seo> component still runs and upserts the same tags in place on
// client-side navigation, so the two never fight or duplicate.
// ---------------------------------------------------------------------------

const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-default.png`;

// client/public/_headers only covers responses served by the assets system.
// HTML now comes from renderShell, which builds its own Response, so the same
// headers have to be set here or the pages ship bare.
const SECURITY_HEADERS = {
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "DENY",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
};

type PageMeta = {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
  publishedTime?: string | null;
  schema?: Record<string, unknown> | null;
  /**
   * Real HTML for the page, injected into #root before the response leaves the
   * edge. Meta tags alone were not enough: the shipped shell had an empty body,
   * so the crawl that decides whether this site ranks saw no headings, no copy
   * and no internal links until it chose to spend a second pass rendering JS.
   * React clears #root on mount (see client/src/main.tsx), so this never fights
   * with the client tree.
   */
  body?: string;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// The Person entity (with the full legal name as alternateName) lives in
// shared/person.ts so this edge copy and the client <Seo> copy cannot drift.

// ---------------------------------------------------------------------------
// Edge-rendered body content
//
// These builders produce plain semantic HTML, not a copy of the React tree. The
// audience is a crawler that does not run JavaScript, so headings, links and
// prose are what matter; the visual layout arrives with the bundle a moment
// later. Keep them in sync with the pages' actual copy, not their styling.
// ---------------------------------------------------------------------------

type PostSummary = {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  publishedAt: Date | string | null;
};

const formatDate = (d: Date | string | null) =>
  d ? new Date(d).toISOString().slice(0, 10) : "";

function renderPostList(posts: PostSummary[]): string {
  if (posts.length === 0) {
    return `<p>No articles published yet.</p>`;
  }
  return `<ul>${posts
    .map(
      (p) =>
        `<li><h3><a href="/article/${escapeHtml(p.slug)}">${escapeHtml(p.title)}</a></h3>` +
        (p.publishedAt
          ? `<p><time datetime="${formatDate(p.publishedAt)}">${formatDate(p.publishedAt)}</time></p>`
          : "") +
        (p.excerpt ? `<p>${escapeHtml(p.excerpt)}</p>` : "") +
        `</li>`,
    )
    .join("")}</ul>`;
}

const SITE_NAV = `<nav aria-label="Main"><ul>
  <li><a href="/">Home</a></li>
  <li><a href="/articles">Articles</a></li>
  <li><a href="/tools">Free Tools</a></li>
  <li><a href="/about">About</a></li>
</ul></nav>`;

// Mirrors client/src/lib/tools.ts. The worker cannot import from client code,
// so this copy is deliberate — keep the two in sync when adding a tool.
const TOOLS: { slug: string; name: string; blurb: string }[] = [
  {
    slug: "trademark-precheck",
    name: "Trademark Pre-Check",
    blurb: "Search the US trademark register before you commit to a name.",
  },
];

function toolsBody(): string {
  return `${SITE_NAV}<main>
<h1>Free Tools</h1>
<p>Small tools I built because I needed them. No signup, no email wall, nothing stored on a server. They run in your browser and they stay free.</p>
<ul>${TOOLS.map(
    (t) =>
      `<li><h2><a href="/tools/${escapeHtml(t.slug)}">${escapeHtml(t.name)}</a></h2><p>${escapeHtml(t.blurb)}</p></li>`,
  ).join("")}</ul>
</main>`;
}

const TRADEMARK_TOOL_BODY = `${SITE_NAV}<main>
<h1>Trademark Pre-Check</h1>
<p>Before you commit to a name, a brand or a design, find out whether somebody already owns it. This searches the live US federal trademark register and shows the results on the page.</p>
<p>Free, no signup, nothing stored. It queries the USPTO's own public search service directly from your browser.</p>
<h2>How it works</h2>
<p>Enter the name or phrase you plan to use, optionally narrow the search to the product categories that apply to you, and read the results. Live registrations in a category you sell into are the ones that matter.</p>
<h2>What it will not catch</h2>
<p>A clear result is necessary, not sufficient. Unregistered common-law rights, pending applications, confusingly similar marks and registrations outside the United States are all outside what this covers. This is not legal advice.</p>
<p><a href="/tools">All free tools</a></p>
</main>`;

function homeBody(posts: PostSummary[]): string {
  const elsewhere = [
    [PROFILE_LINKS.linkedin, "LinkedIn"],
    [PROFILE_LINKS.x, "X"],
    [PROFILE_LINKS.startfleet, "StartFleet"],
    [PROFILE_LINKS.bobcat, "Bobcat Digital"],
  ]
    .map(([href, label]) => `<li><a href="${href}" rel="noopener me">${label}</a></li>`)
    .join("");
  const latest = posts.slice(0, 3);
  return `${SITE_NAV}<main>
<h1>Usman Bashir</h1>
<p>${escapeHtml(`${HERO.lead} ${HERO.accent}`)}</p>
<p>${escapeHtml(HERO.sub)}</p>
<p><a href="/about">More about me</a></p>
<h2>Find me elsewhere</h2>
<ul>${elsewhere}</ul>
<h2>What I work on</h2>
${WORK_AREAS.map((a) => `<h3>${escapeHtml(a.title)}</h3><p>${escapeHtml(a.body)}</p>`).join("")}
<h2>Some numbers from my work</h2>
<p>${escapeHtml(RESULTS.intro)}</p>
<ul>${[RESULTS.gsc, RESULTS.ahrefs]
    .map((r) => `<li><strong>${escapeHtml(r.value)}</strong> ${escapeHtml(r.label)} (${escapeHtml(r.source)})</li>`)
    .join("")}</ul>
<h2>Things I've built</h2>
<ul>${TOOLS.map(
    (t) =>
      `<li><h3><a href="/tools/${escapeHtml(t.slug)}">${escapeHtml(t.name)}</a></h3><p>${escapeHtml(t.blurb)}</p></li>`,
  ).join("")}</ul>
<h2>What people I've worked with say</h2>
${TESTIMONIALS.map(
    (t) =>
      `<figure><blockquote><p>${escapeHtml(t.quote)}</p></blockquote><figcaption>${
        t.authorUrl ? `<a href="${escapeHtml(t.authorUrl)}" rel="noopener">${escapeHtml(t.author ?? "")}</a>` : escapeHtml(t.author ?? "")
      }${t.author ? ", " : ""}${escapeHtml(t.role)}${t.source ? ` (${t.author ? "via" : "review on"} ${escapeHtml(t.source)})` : ""}</figcaption></figure>`,
  ).join("")}
<p><a href="${VIDEO_TESTIMONIAL.src}">Video review from ${escapeHtml(VIDEO_TESTIMONIAL.author)}, ${escapeHtml(VIDEO_TESTIMONIAL.role)}</a></p>
${latest.length > 0 ? `<h2>Latest writing</h2>
${renderPostList(latest)}` : ""}
<h2>${escapeHtml(`${CONTACT.lead} ${CONTACT.accent} ${CONTACT.tail}`.trim())}</h2>
<p>${escapeHtml(CONTACT.body)}</p>
</main>`;
}

function legalBody(doc: LegalDoc): string {
  const paragraphs = (ps: string[]) =>
    ps
      .map((p) =>
        p === CONTACT_LINE
          ? `<p>My email address is on the <a href="/about">About page</a>.</p>`
          : `<p>${escapeHtml(p)}</p>`,
      )
      .join("");
  return `${SITE_NAV}<main><article>
<h1>${escapeHtml(doc.title)}</h1>
<p>Last updated ${escapeHtml(doc.updated)}</p>
${doc.sections
  .map((s) => (s.heading ? `<h2>${escapeHtml(s.heading)}</h2>` : "") + paragraphs(s.paragraphs))
  .join("")}
</article></main>`;
}

function articlesBody(posts: PostSummary[]): string {
  return `${SITE_NAV}<main>
<h1>All Articles</h1>
<p>Insights on SEO, digital marketing, business setup, and design.</p>
${renderPostList(posts)}
</main>`;
}

const ABOUT_BODY = `${SITE_NAV}<main>
<h1>Usman Bashir</h1>
<p>Muhammad Usman Bashir on paper, Usman to everyone else.</p>
<p>I work in SEO and content, mostly on <a href="https://startfleet.io" rel="noopener">StartFleet</a>, which helps people outside the US register American companies, and on <a href="https://bobcatdigital.co" rel="noopener">Bobcat Digital</a>, which helps brands with marketing and graphic design. StartFleet is where most of my week goes.</p>
<p>This site is separate from both. It is where I write up what I am actually testing: SEO and marketing, search rankings, print-on-demand, US company setup, business writing, gaming, and whatever else is worth the time. Including the parts that did not work.</p>
<p>StartFleet pays my salary, so any article here that touches what they do carries a disclosure at the top. That is the point of keeping this site separate.</p>
<h2>Background</h2>
<h3>MBA</h3>
<p>Master of Business Administration. My thesis looked at behavioural intention to adopt fintech.</p>
<h3>StartFleet</h3>
<p>My primary work. I run content and SEO for a company handling US LLC formation, EINs and banking access for non-US residents.</p>
<h3>Bobcat Digital</h3>
<p>Bobcat helps brands with marketing and graphic design, from ecommerce storefronts to apparel graphics.</p>
<h3>SEO and content since 2020</h3>
<p>Mostly WordPress, ecommerce and service businesses.</p>
<h2>About this site</h2>
<p>A personal blog, not a media company. Every price, fee and statistic here is checked against a primary source before it goes in, and dated so it ages honestly. If I have not done something myself, the article says so.</p>
<h2>How this site is built</h2>
<p>I use AI heavily, and it would be strange to write about AI tools while pretending otherwise. The site and the free tools here were built with AI assistance, and AI is part of how I research, draft and edit. What it does not do is decide what is true — every factual claim is verified against a primary source by hand.</p>
<h2>Contact, corrections and copyright</h2>
<p>If something here is factually wrong, out of date, or you believe content on this site infringes your copyright, get in touch and I will look at it properly. For copyright claims, include the URL on this site, a description of the work, and how to reach you. Nothing on this site is legal, tax or financial advice.</p>
</main>`;

function articleBody(post: {
  title: string;
  content: string;
  category: string | null;
  readTime: string | null;
  publishedAt: Date | string | null;
}): string {
  return `${SITE_NAV}<main><article>
<h1>${escapeHtml(post.title)}</h1>
<p>${post.category ? escapeHtml(post.category) + " · " : ""}${
    post.publishedAt
      ? `<time datetime="${formatDate(post.publishedAt)}">${formatDate(post.publishedAt)}</time>`
      : ""
  }${post.readTime ? " · " + escapeHtml(post.readTime) : ""}</p>
${post.content}
</article>
<p><a href="/articles">All articles</a></p>
</main>`;
}

const STATIC_PAGES: Record<string, PageMeta> = {
  "/": {
    title: HOME_META.title,
    description: HOME_META.description,
    path: "/",
    schema: PERSON_SCHEMA,
  },
  "/articles": {
    title: "All Articles — Usman Bashir",
    description:
      "Every article: SEO, print-on-demand, digital marketing, and US business setup. Practical write-ups from real projects.",
    path: "/articles",
  },
  "/about": {
    title: "About Usman Bashir — SEO & Digital Marketing",
    description:
      "SEO and content practitioner at StartFleet, MBA graduate, and owner of Bobcat Digital LLC. Writing about search, print-on-demand, and US company setup.",
    path: "/about",
    // Previously only the client wrote this, so crawlers that skip JavaScript
    // saw an About page with no Person behind it.
    schema: PROFILE_PAGE_SCHEMA,
  },
  "/tools": {
    title: "Free Tools — Usman Bashir",
    description:
      "Free, no-signup tools for people running small online businesses. No accounts, no email walls, nothing stored.",
    path: "/tools",
  },
  "/tools/trademark-precheck": {
    title: "Trademark Pre-Check — Free, No Signup",
    description:
      "Search the live US federal trademark register for a name or design phrase, narrowed to the product categories that apply to you. Free, no signup, results shown on the page.",
    path: "/tools/trademark-precheck",
  },
};

function headTagsFor(meta: PageMeta): string {
  const url = `${SITE_ORIGIN}${meta.path}`;
  const image = meta.image || DEFAULT_OG_IMAGE;
  const tags = [
    `<link rel="canonical" href="${escapeHtml(url)}">`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" data-seo>`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" data-seo>`,
    `<meta property="og:type" content="${meta.type || "website"}" data-seo>`,
    `<meta property="og:url" content="${escapeHtml(url)}" data-seo>`,
    `<meta property="og:image" content="${escapeHtml(image)}" data-seo>`,
    `<meta property="og:site_name" content="Usman Bashir" data-seo>`,
    `<meta name="twitter:card" content="summary_large_image" data-seo>`,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" data-seo>`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" data-seo>`,
    `<meta name="twitter:image" content="${escapeHtml(image)}" data-seo>`,
    `<meta name="twitter:creator" content="@imusmanbashir" data-seo>`,
  ];
  if (meta.publishedTime) {
    tags.push(
      `<meta property="article:published_time" content="${escapeHtml(meta.publishedTime)}" data-seo>`,
    );
  }
  if (meta.schema) {
    // </script> inside JSON would close the tag early.
    const json = JSON.stringify(meta.schema).replace(/</g, String.fromCharCode(92) + "u003c");
    tags.push(`<script type="application/ld+json" data-seo-schema>${json}</script>`);
  }
  return tags.join("");
}

async function renderShell(c: any, meta: PageMeta, status = 200): Promise<Response> {
  // Site-wide noindex switch. The meta tag covers HTML; the header covers
  // crawlers that only read headers. robots.txt stays open on purpose: a page
  // blocked there is never fetched, so Google would never see the noindex.
  const noindex = c.env.SITE_NOINDEX === "true";
  const shellUrl = new URL("/index.html", new URL(c.req.url).origin);
  const shell = await c.env.ASSETS.fetch(new Request(shellUrl.toString()));
  let rewriter = new HTMLRewriter()
    .on("title", {
      element(el) {
        el.setInnerContent(meta.title);
      },
    })
    .on('meta[name="description"]', {
      element(el) {
        el.setAttribute("content", meta.description);
      },
    })
    .on("head", {
      element(el) {
        el.append(headTagsFor(meta), { html: true });
        if (noindex) el.append(`<meta name="robots" content="noindex">`, { html: true });
      },
    });

  if (meta.body) {
    rewriter = rewriter.on("#root", {
      element(el) {
        el.setInnerContent(meta.body!, { html: true });
      },
    });
  }

  const rewritten = rewriter.transform(shell);

  return new Response(rewritten.body, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // Browsers revalidate every time; shared caches may hold it briefly, which
      // keeps the per-request database read off the hot path for repeat traffic.
      "Cache-Control": "public, max-age=0, s-maxage=300, must-revalidate",
      ...SECURITY_HEADERS,
      ...(noindex ? { "X-Robots-Tag": "noindex" } : {}),
    },
  });
}

// "/" and "/articles" list published posts, so they need the database. "/about"
// is fixed copy and deliberately does not pay for a query.
app.get("/", dbMiddleware, async (c) => {
  const posts = (await c.get("storage").getPosts(!showDrafts(c))) as PostSummary[];
  return renderShell(c, { ...STATIC_PAGES["/"], body: homeBody(posts) });
});

app.get("/articles", dbMiddleware, async (c) => {
  const posts = (await c.get("storage").getPosts(!showDrafts(c))) as PostSummary[];
  return renderShell(c, { ...STATIC_PAGES["/articles"], body: articlesBody(posts) });
});

app.get("/about", (c) =>
  renderShell(c, { ...STATIC_PAGES["/about"], body: ABOUT_BODY }),
);

// Terms, privacy and affiliate pages: fixed copy, no database read.
for (const doc of LEGAL_DOCS) {
  app.get(`/${doc.slug}`, (c) =>
    renderShell(c, {
      title: `${doc.title} | Usman Bashir`,
      description: doc.description,
      path: `/${doc.slug}`,
      body: legalBody(doc),
    }),
  );
}

// Tool pages are fixed copy — no database read.
app.get("/tools", (c) => renderShell(c, { ...STATIC_PAGES["/tools"], body: toolsBody() }));

app.get("/tools/trademark-precheck", (c) =>
  renderShell(c, {
    ...STATIC_PAGES["/tools/trademark-precheck"],
    body: TRADEMARK_TOOL_BODY,
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Trademark Pre-Check",
      url: `${SITE_ORIGIN}/tools/trademark-precheck`,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any",
      description: STATIC_PAGES["/tools/trademark-precheck"].description,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: AUTHOR_REF,
    },
  }),
);

app.get("/article/:slug", dbMiddleware, async (c) => {
  const post = await c.get("storage").getPostBySlug(c.req.param("slug"));

  // Unknown or unpublished slug: serve the SPA's not-found view with a real
  // 404 status instead of the soft 200 the asset fallback would return.
  if (!post || (post.status !== "published" && !showDrafts(c))) {
    return renderShell(
      c,
      {
        title: "Article not found — Usman Bashir",
        description: "That article does not exist.",
        path: `/article/${c.req.param("slug")}`,
      },
      404,
    );
  }

  let schema: Record<string, unknown> | null = null;
  if (post.schemaMarkup) {
    try {
      schema = JSON.parse(post.schemaMarkup);
    } catch {
      schema = null;
    }
  }
  if (!schema) {
    schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.metaDescription || post.excerpt,
      image: post.coverImage || undefined,
      datePublished: post.publishedAt ?? undefined,
      dateModified: post.updatedAt ?? post.publishedAt ?? undefined,
      author: AUTHOR_REF,
    };
  }

  return renderShell(c, {
    title: `${post.seoTitle || post.title} — Usman Bashir`,
    description: post.metaDescription || post.excerpt,
    path: `/article/${post.slug}`,
    image: post.coverImage,
    type: "article",
    publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : null,
    schema,
    body: articleBody(post),
  });
});

app.onError((err, c) => {
  console.error(err);
  return c.json({ message: err.message || "Internal Server Error" }, 500);
});

export default app;
