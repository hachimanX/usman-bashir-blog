import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import Header from "@/components/Header";
import Seo from "@/components/Seo";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { AUTHOR_REF, PROFILE_LINKS } from "@shared/person";
import type { Post } from "@shared/schema";

function formatDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
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
  }, [params?.slug]);

  // Prefer the post's hand-written schema; fall back to a generated BlogPosting
  // so every article ships with structured data even when the field is empty.
  const articleSchema = post
    ? (() => {
        if (post.schemaMarkup) {
          try {
            return JSON.parse(post.schemaMarkup) as Record<string, unknown>;
          } catch {
            /* fall through to the generated one */
          }
        }
        return {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.metaDescription || post.excerpt,
          image: post.coverImage || undefined,
          datePublished: post.publishedAt ?? undefined,
          dateModified: post.updatedAt ?? post.publishedAt ?? undefined,
          author: AUTHOR_REF,
        } as Record<string, unknown>;
      })()
    : null;

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main id="main" className="flex flex-1 items-center justify-center"><p className="text-muted-foreground">Loading…</p></main>
        <Footer />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main id="main" className="flex flex-1 flex-col items-center justify-center gap-4">
          <h1 className="text-3xl font-bold">Article not found</h1>
          <Link href="/articles" className="text-primary hover:underline">← Back to Articles</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Seo
        title={`${post.seoTitle || post.title} — Usman Bashir`}
        description={post.metaDescription || post.excerpt}
        path={`/article/${post.slug}`}
        image={post.coverImage}
        type="article"
        publishedTime={post.publishedAt ? new Date(post.publishedAt).toISOString() : null}
        schema={articleSchema}
      />
      <Header />
      <main id="main" className="flex-1">
        <article className="py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Link href="/articles" className="mb-8 inline-flex min-h-11 items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> All Articles
            </Link>

            {/* Titles here run long ("The Best LLC Formation Services, Compared
                (What Actually Matters)"), so the scale tops out at 5xl and the
                measure is capped instead of letting it sprawl across four lines. */}
            <header className="mb-10 max-w-4xl">
              <span className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-primary">{post.category}</span>
              <h1 className="mt-3 text-4xl font-semibold leading-[1.1] sm:text-5xl">{post.title}</h1>
              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {post.publishedAt && (
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{formatDate(post.publishedAt as any)}</span>
                )}
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{post.readTime}</span>
              </div>
            </header>

            {post.coverImage && (
              <div className="mb-12">
                <img src={post.coverImage} alt={post.title} className="w-full rounded-lg object-cover" style={{ maxHeight: "500px" }} />
              </div>
            )}

            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
              {/* prose-brand maps the typography plugin's colours to the site
                  tokens, so body text, tables and quotes follow the theme
                  instead of the plugin's neutral greys. max-w-[72ch] keeps lines
                  readable next to the sidebar. */}
              <div
                className="prose prose-lg prose-brand min-w-0 max-w-[72ch] prose-headings:font-semibold prose-h2:mt-14 prose-h2:mb-4 prose-h2:text-3xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-xl prose-p:leading-relaxed prose-p:text-[17px] prose-p:mb-6 prose-a:underline-offset-2 prose-table:text-base"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              {/* Author box: a face and a link to /about on every article is what
                  ties the writing back to a real, checkable person. */}
              <aside className="hidden lg:block">
                <div className="sticky top-24 rounded-2xl border bg-card p-6">
                  <div className="flex items-center gap-3">
                    <img
                      src="/usman.jpg"
                      alt=""
                      width={48}
                      height={48}
                      loading="lazy"
                      className="h-12 w-12 rounded-full border object-cover"
                    />
                    <div>
                      <p className="font-display font-semibold leading-tight">Usman Bashir</p>
                      <p className="text-xs text-muted-foreground">SEO, marketing, building with AI</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    I write up what I've tested myself, including the parts that didn't work.
                  </p>
                  <Link
                    href="/about"
                    className="mt-4 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-primary hover:underline"
                  >
                    More about me <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <div className="flex gap-4 border-t pt-3 text-sm">
                    <a href={PROFILE_LINKS.x} target="_blank" rel="noopener noreferrer me" className="text-muted-foreground hover:text-foreground">X</a>
                    <a href={PROFILE_LINKS.linkedin} target="_blank" rel="noopener noreferrer me" className="text-muted-foreground hover:text-foreground">LinkedIn</a>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </article>

        {/* id matches the "#newsletter" links written into article bodies. */}
        <section id="newsletter" className="scroll-mt-24 border-t py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <NewsletterSignup variant="card" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
