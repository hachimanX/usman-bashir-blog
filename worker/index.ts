import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { deleteCookie, getSignedCookie, setSignedCookie } from "hono/cookie";

import { createDb } from "./db";
import { createStorage, type IStorage } from "./storage";

export type Env = {
  DATABASE_URL: string;
  SESSION_SECRET: string;
  ADMIN_USERNAME: string;
  ADMIN_PASSWORD: string;
  IMGBB_API_KEY?: string;
};

type Vars = { storage: IStorage };

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

// Build the per-request database client once and hand it to every handler.
app.use("/api/*", async (c, next) => {
  if (!c.env.DATABASE_URL) {
    return c.json({ message: "Server misconfigured: DATABASE_URL is not set" }, 500);
  }
  c.set("storage", createStorage(createDb(c.env.DATABASE_URL)));
  await next();
});

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
app.get("/api/posts", async (c) => {
  return c.json(await c.get("storage").getPosts(true));
});

app.get("/api/posts/:slug", async (c) => {
  const post = await c.get("storage").getPostBySlug(c.req.param("slug"));
  if (!post || post.status !== "published") return c.json({ message: "Not found" }, 404);
  return c.json(post);
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

app.all("/api/*", (c) => c.json({ message: "Not found" }, 404));

app.onError((err, c) => {
  console.error(err);
  return c.json({ message: err.message || "Internal Server Error" }, 500);
});

export default app;
