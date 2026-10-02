import { Hono } from "hono";
import { createMiddleware } from "hono/factory";

import { createDb } from "./db";
import { createStorage, type IStorage } from "./storage";
import { subscribeSchema } from "@shared/schema";

/**
 * The site itself is static: every page is prerendered at build time
 * (scripts/prerender.mjs) and served by Cloudflare's asset layer without
 * touching this worker. wrangler.toml routes only /api/* here.
 *
 * What is left is the one thing a static file cannot do: store a newsletter
 * signup. That is the only request path that reaches the database.
 */
export type Env = {
  DATABASE_URL: string;
  ASSETS: { fetch: (request: Request) => Promise<Response> };
};

type Vars = { storage: IStorage };

const app = new Hono<{ Bindings: Env; Variables: Vars }>();

const dbMiddleware = createMiddleware<{ Bindings: Env; Variables: Vars }>(async (c, next) => {
  if (!c.env.DATABASE_URL) {
    return c.json({ message: "Server misconfigured: DATABASE_URL is not set" }, 500);
  }
  c.set("storage", createStorage(createDb(c.env.DATABASE_URL)));
  await next();
});

app.post("/api/subscribe", dbMiddleware, async (c) => {
  const parsed = subscribeSchema.safeParse(await c.req.json().catch(() => ({})));
  if (!parsed.success) return c.json({ message: "Enter a valid email address" }, 400);
  await c.get("storage").addSubscriber(parsed.data.email);
  return c.json({ ok: true });
});

app.all("/api/*", (c) => c.json({ message: "Not found" }, 404));

app.onError((err, c) => {
  console.error(err);
  return c.json({ message: "Something went wrong. Please try again." }, 500);
});

export default app;
