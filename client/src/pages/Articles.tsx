import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Seo from "@/components/Seo";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Link } from "wouter";
import type { Post } from "@shared/schema";

function formatDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function Articles() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/posts").then((r) => r.json()).then(setPosts).catch(() => {});
  }, []);

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Seo
        title="All Articles — Usman Bashir"
        description="Every article: SEO, print-on-demand, digital marketing, and US business setup. Practical write-ups from real projects."
        path="/articles"
      />
      <Header />
      <main id="main" className="flex-1">
        <section className="border-b py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold sm:text-5xl">All Articles</h1>
            <p className="mt-4 text-lg text-muted-foreground">Insights on SEO, digital marketing, business setup, and design.</p>
            <div className="mt-8 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search articles…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {filtered.length > 0 ? (
              <>
                <p className="mb-6 text-sm text-muted-foreground">{filtered.length} {filtered.length === 1 ? "article" : "articles"}</p>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((post) => (
                    <Link key={post.id} href={`/article/${post.slug}`} className="group block overflow-hidden rounded-2xl border bg-card transition-colors hover:border-primary">
                      {post.coverImage && (
                        <div className="aspect-video overflow-hidden">
                          <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                        </div>
                      )}
                      <div className="p-5">
                        <span className="text-xs font-semibold uppercase tracking-wide text-primary">{post.category}</span>
                        <h3 className="mt-2 font-bold leading-tight group-hover:text-primary transition-colors">{post.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                        <p className="mt-3 text-xs text-muted-foreground">{formatDate(post.publishedAt as any)} · {post.readTime}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">{posts.length === 0 ? "No articles published yet." : "No articles match your search."}</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
