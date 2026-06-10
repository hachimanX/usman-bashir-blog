import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import MemoryStore from "memorystore";

const MemoryStoreSession = MemoryStore(session);

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

function estimateReadTime(content: string): string {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if ((req.session as any).isAdmin) return next();
  res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(session({
    secret: process.env.SESSION_SECRET || "blog-secret-change-in-prod",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStoreSession({ checkPeriod: 86400000 }),
    cookie: { secure: process.env.NODE_ENV === "production", maxAge: 7 * 24 * 60 * 60 * 1000 },
  }));

  // Public
  app.get("/api/posts", async (_req, res) => {
    try { res.json(await storage.getPosts(true)); }
    catch { res.status(500).json({ message: "Failed to fetch posts" }); }
  });

  app.get("/api/posts/:slug", async (req, res) => {
    try {
      const post = await storage.getPostBySlug(req.params.slug);
      if (!post || post.status !== "published") return res.status(404).json({ message: "Not found" });
      res.json(post);
    } catch { res.status(500).json({ message: "Failed to fetch post" }); }
  });

  // Auth
  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    if (username === (process.env.ADMIN_USERNAME || "admin") && password === (process.env.ADMIN_PASSWORD || "changeme")) {
      (req.session as any).isAdmin = true;
      return res.json({ ok: true });
    }
    res.status(401).json({ message: "Invalid credentials" });
  });

  app.post("/api/admin/logout", (req, res) => { req.session.destroy(() => res.json({ ok: true })); });
  app.get("/api/admin/me", requireAdmin, (_req, res) => res.json({ ok: true }));

  // Image upload via ImgBB
  app.post("/api/admin/upload", requireAdmin, async (req, res) => {
    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) return res.status(400).json({ message: "IMGBB_API_KEY not configured. Add it in Railway variables." });
    const { imageData } = req.body; // base64 string
    if (!imageData) return res.status(400).json({ message: "No image data provided" });
    try {
      const formData = new URLSearchParams();
      formData.append("key", apiKey);
      formData.append("image", imageData.replace(/^data:image\/\w+;base64,/, ""));
      const response = await fetch("https://api.imgbb.com/1/upload", { method: "POST", body: formData });
      const data = await response.json() as any;
      if (data.success) return res.json({ url: data.data.url });
      res.status(500).json({ message: "Upload failed" });
    } catch { res.status(500).json({ message: "Upload error" }); }
  });

  // Admin posts
  app.get("/api/admin/posts", requireAdmin, async (_req, res) => {
    try { res.json(await storage.getPosts(false)); }
    catch { res.status(500).json({ message: "Failed to fetch posts" }); }
  });

  app.post("/api/admin/posts", requireAdmin, async (req, res) => {
    try {
      const { title, content, excerpt, coverImage, category, status, slug: customSlug, seoTitle, metaDescription, schemaMarkup } = req.body;
      if (!title) return res.status(400).json({ message: "Title is required" });
      const slug = customSlug ? slugify(customSlug) : slugify(title);
      const post = await storage.createPost({
        title, slug, content: content || "", excerpt: excerpt || "",
        coverImage: coverImage || null, category: category || "General",
        status: status || "draft", readTime: estimateReadTime(content || ""),
        seoTitle: seoTitle || null, metaDescription: metaDescription || null, schemaMarkup: schemaMarkup || null,
        publishedAt: status === "published" ? new Date() : null,
      });
      res.status(201).json(post);
    } catch (e: any) {
      if (e.message?.includes("unique")) return res.status(400).json({ message: "A post with this slug already exists — change the URL" });
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.put("/api/admin/posts/:id", requireAdmin, async (req, res) => {
    try {
      const { title, content, excerpt, coverImage, category, status, slug: customSlug, seoTitle, metaDescription, schemaMarkup } = req.body;
      const existing = await storage.getPostById(req.params.id);
      if (!existing) return res.status(404).json({ message: "Not found" });
      const nowPublishing = status === "published" && existing.status !== "published";
      const post = await storage.updatePost(req.params.id, {
        title, content, excerpt, coverImage, category, status,
        readTime: estimateReadTime(content || ""),
        seoTitle: seoTitle || null, metaDescription: metaDescription || null, schemaMarkup: schemaMarkup || null,
        publishedAt: nowPublishing ? new Date() : existing.publishedAt,
        ...(customSlug ? { slug: slugify(customSlug) } : title ? { slug: slugify(title) } : {}),
      });
      res.json(post);
    } catch (e: any) {
      if (e.message?.includes("unique")) return res.status(400).json({ message: "A post with this slug already exists — change the URL" });
      res.status(500).json({ message: "Failed to update post" });
    }
  });

  app.delete("/api/admin/posts/:id", requireAdmin, async (req, res) => {
    try { await storage.deletePost(req.params.id); res.json({ ok: true }); }
    catch { res.status(500).json({ message: "Failed to delete post" }); }
  });

  return createServer(app);
}
