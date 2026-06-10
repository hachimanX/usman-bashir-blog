import { useEffect, useState } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import TestimonialSection from "@/components/TestimonialSection";
import type { Post } from "@shared/schema";

function formatDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/posts").then((r) => r.json()).then(setPosts).catch(() => {});
  }, []);

  const latest = posts.slice(0, 3);
  const featured = posts.slice(0, 4);
  const grid = posts.slice(0, 6);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {posts.length > 0 ? (
          <>
            <section className="border-b py-12">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
                  <div>
                    <h2 className="mb-6 text-sm font-bold uppercase tracking-wide text-muted-foreground">Latest Updates</h2>
                    <div className="space-y-6">
                      {latest.map((post) => (
                        <Link key={post.id} href={`/article/${post.slug}`} className="block group">
                          <h3 className="font-bold leading-tight text-foreground group-hover:text-primary transition-colors">{post.title}</h3>
                          <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{formatDate(post.publishedAt as any)}</p>
                        </Link>
                      ))}
                      <Link href="/articles" className="inline-block text-sm font-semibold text-primary hover:underline">
                        VIEW ALL ARTICLES →
                      </Link>
                    </div>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    {featured.map((post) => (
                      <Link key={post.id} href={`/article/${post.slug}`} className="group block overflow-hidden rounded-lg border transition-shadow hover:shadow-lg">
                        {post.coverImage && (
                          <div className="aspect-video overflow-hidden">
                            <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-bold leading-tight group-hover:text-primary transition-colors">{post.title}</h3>
                          <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">{post.category}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="border-b py-16">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="mb-8 text-3xl font-bold">All Articles</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {grid.map((post) => (
                    <Link key={post.id} href={`/article/${post.slug}`} className="group block overflow-hidden rounded-lg border transition-shadow hover:shadow-lg">
                      {post.coverImage && (
                        <div className="aspect-video overflow-hidden">
                          <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-bold leading-tight group-hover:text-primary transition-colors">{post.title}</h3>
                        <p className="mt-2 text-xs text-muted-foreground">{post.excerpt?.slice(0, 80)}{post.excerpt?.length > 80 ? "…" : ""}</p>
                        <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">{post.readTime}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="py-24 text-center">
            <div className="mx-auto max-w-xl px-4">
              <h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
              <p className="text-muted-foreground">Articles are being prepared. Check back soon.</p>
            </div>
          </section>
        )}

        <section className="border-b bg-muted/30 py-16">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">"Think of us like the Bloomberg of SEO."</h2>
            <p className="mb-8 text-muted-foreground">Exclusive insights from tracking the rankings & revenue of digital businesses.</p>
            <NewsletterSignup variant="inline" />
          </div>
        </section>
        <TestimonialSection />
      </main>
      <Footer />
    </div>
  );
}
