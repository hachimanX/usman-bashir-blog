import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import type { Post } from "@shared/schema";

function formatDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) { el = document.createElement("meta"); el.setAttribute("name", name); document.head.appendChild(el); }
  el.setAttribute("content", content);
}

function injectSchema(json: string) {
  const existing = document.getElementById("article-schema");
  if (existing) existing.remove();
  const script = document.createElement("script");
  script.id = "article-schema";
  script.type = "application/ld+json";
  script.textContent = json;
  document.head.appendChild(script);
}

function removeSchema() {
  document.getElementById("article-schema")?.remove();
}

export default function Article() {
  const [, params] = useRoute("/article/:slug");
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!params?.slug) return;
    fetch(`/api/posts/${params.slug}`)
      .then((r) => { if (!r.ok) { setNotFound(true); setLoading(false); return null; } return r.json(); })
      .then((data) => { if (data) { setPost(data); setLoading(false); } })
      .catch(() => { setNotFound(true); setLoading(false); });
    return () => { removeSchema(); };
  }, [params?.slug]);

  // Inject SEO meta + schema after post loads
  useEffect(() => {
    if (!post) return;
    const pageTitle = post.seoTitle || post.title;
    document.title = `${pageTitle} — Usman Bashir`;
    if (post.metaDescription) setMeta("description", post.metaDescription);
    if (post.schemaMarkup) injectSchema(post.schemaMarkup);
    return () => { document.title = "Usman Bashir"; removeSchema(); };
  }, [post]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center"><p className="text-muted-foreground">Loading…</p></main>
        <Footer />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center gap-4">
          <h1 className="text-3xl font-bold">Article not found</h1>
          <Link href="/articles" className="text-primary hover:underline">← Back to Articles</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <article className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link href="/articles" className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> All Articles
            </Link>

            <header className="mb-8">
              <span className="text-sm font-semibold uppercase tracking-wide text-primary">{post.category}</span>
              <h1 className="mt-2 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{post.title}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{formatDate(post.publishedAt as any)}</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{post.readTime}</span>
              </div>
            </header>

            {post.coverImage && (
              <div className="mb-12">
                <img src={post.coverImage} alt={post.title} className="w-full rounded-lg object-cover" style={{ maxHeight: "500px" }} />
              </div>
            )}

            <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
              <div
                className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-3xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-xl prose-p:leading-relaxed prose-p:text-[17px] prose-p:mb-6 prose-a:text-primary prose-a:underline prose-a:target-blank"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              <aside className="hidden lg:block">
                <div className="sticky top-24 rounded-lg border bg-muted/30 p-6">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    I write about SEO, digital marketing, and building businesses online. Practical notes, no fluff.
                  </p>
                  <p className="mt-4 text-4xl font-bold" style={{ fontFamily: "Allura, cursive" }}>Bashir</p>
                  <div className="mt-4 flex gap-3">
                    <a href="https://x.com/imusmanbashir" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">Twitter</a>
                    <a href="https://linkedin.com/in/usmanbashir" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">LinkedIn</a>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </article>

        <section className="border-t py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <NewsletterSignup variant="card" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
