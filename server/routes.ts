import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import MemoryStore from "memorystore";

const MemoryStoreSession = MemoryStore(session);

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function estimateReadTime(content: string): string {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if ((req.session as any).isAdmin) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "blog-secret-change-in-prod",
      resave: false,
      saveUninitialized: false,
      store: new MemoryStoreSession({ checkPeriod: 86400000 }),
      cookie: { secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 },
    })
  );

  // ── Public API ──────────────────────────────────────────────

  app.get("/api/posts", async (_req, res) => {
    try {
      const allPosts = await storage.getPosts(true);
      res.json(allPosts);
    } catch (e) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get("/api/posts/:slug", async (req, res) => {
    try {
      const post = await storage.getPostBySlug(req.params.slug);
      if (!post || post.status !== "published") {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (e) {
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  // ── Admin Auth ───────────────────────────────────────────────

  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    const adminUser = process.env.ADMIN_USERNAME || "admin";
    const adminPass = process.env.ADMIN_PASSWORD || "changeme";

    if (username === adminUser && password === adminPass) {
      (req.session as any).isAdmin = true;
      return res.json({ ok: true });
    }
    res.status(401).json({ message: "Invalid credentials" });
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy(() => res.json({ ok: true }));
  });

  app.get("/api/admin/me", requireAdmin, (_req, res) => {
    res.json({ ok: true });
  });

  // ── Admin Posts ──────────────────────────────────────────────

  app.get("/api/admin/posts", requireAdmin, async (_req, res) => {
    try {
      const allPosts = await storage.getPosts(false);
      res.json(allPosts);
    } catch (e) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.post("/api/admin/posts", requireAdmin, async (req, res) => {
    try {
      const { title, content, excerpt, coverImage, category, status } = req.body;
      if (!title) return res.status(400).json({ message: "Title is required" });

      const slug = slugify(title);
      const readTime = estimateReadTime(content || "");
      const publishedAt = status === "published" ? new Date() : null;

      const post = await storage.createPost({
        title,
        slug,
        content: content || "",
        excerpt: excerpt || "",
        coverImage: coverImage || null,
        category: category || "General",
        status: status || "draft",
        readTime,
        publishedAt,
      });
      res.status(201).json(post);
    } catch (e: any) {
      if (e.message?.includes("unique")) {
        return res.status(400).json({ message: "A post with this title already exists" });
      }
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.put("/api/admin/posts/:id", requireAdmin, async (req, res) => {
    try {
      const { title, content, excerpt, coverImage, category, status } = req.body;
      const existing = await storage.getPostById(req.params.id);
      if (!existing) return res.status(404).json({ message: "Post not found" });

      const wasPublished = existing.status === "published";
      const nowPublishing = status === "published" && !wasPublished;

      const post = await storage.updatePost(req.params.id, {
        title,
        content,
        excerpt,
        coverImage,
        category,
        status,
        readTime: estimateReadTime(content || ""),
        publishedAt: nowPublishing ? new Date() : existing.publishedAt,
        ...(title ? { slug: slugify(title) } : {}),
      });
      res.json(post);
    } catch (e: any) {
      if (e.message?.includes("unique")) {
        return res.status(400).json({ message: "A post with this title already exists" });
      }
      res.status(500).json({ message: "Failed to update post" });
    }
  });

  app.delete("/api/admin/posts/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deletePost(req.params.id);
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
