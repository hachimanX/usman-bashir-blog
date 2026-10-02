import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import Header from "@/components/Header";
import Seo from "@/components/Seo";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import { Calendar, Clock, ArrowLeft, ArrowRight, Linkedin } from "lucide-react";
import { SiX } from "react-icons/si";
import { PROFILE_LINKS } from "@shared/person";
import { articleSchema, formatArticleDate, initialArticle, loadArticle, type Article as ArticleData } from "@/lib/content";

export default function Article() {
  const [, params] = useRoute("/article/:slug");
  const slug = params?.slug ?? "";
  // Prerendered pages carry their own body, so the first render already has
  // the article and nothing is fetched. Only in-app navigation loads the
  // static JSON file for the next one.
  const [post, setPost] = useState<ArticleData | null>(() => initialArticle(slug));
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug || post?.slug === slug) return;
    let cancelled = false;
    setPost(null);
    setNotFound(false);
    loadArticle(slug)
      .then((a) => !cancelled && setPost(a))
      .catch(() => !cancelled && setNotFound(true));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (!post && !notFound) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main id="main" className="flex flex-1 items-center justify-center"><p className="text-muted-foreground">Loading…</p></main>
        <Footer />
      </div>
    );
  }

  if (!post) {
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
        title={`${post.title} — Usman Bashir`}
        description={post.excerpt}
        path={`/article/${post.slug}`}
        type="article"
        publishedTime={post.date}
        schema={articleSchema(post)}
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
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{formatArticleDate(post.date, "long")}</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{post.readTime}</span>
              </div>
            </header>


            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
              {/* prose-brand maps the typography plugin's colours to the site
                  tokens, so body text, tables and quotes follow the theme
                  instead of the plugin's neutral greys. max-w-[72ch] keeps lines
                  readable next to the sidebar. */}
              <div
                className="prose prose-lg prose-brand min-w-0 max-w-[72ch] prose-headings:font-semibold prose-h2:mt-14 prose-h2:mb-4 prose-h2:text-3xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-xl prose-p:leading-relaxed prose-p:text-[17px] prose-p:mb-6 prose-a:underline-offset-2 prose-table:text-base"
                dangerouslySetInnerHTML={{ __html: post.html }}
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
                  <div className="border-t pt-2">
                  <div className="-ml-3 flex gap-1 text-sm">
                    {/* Icons only: the X logo already says "X", so a text label beside it read as two. */}
                    <a href={PROFILE_LINKS.x} target="_blank" rel="noopener noreferrer me" aria-label="X" className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"><SiX className="h-4 w-4" aria-hidden="true" /></a>
                    <a href={PROFILE_LINKS.linkedin} target="_blank" rel="noopener noreferrer me" aria-label="LinkedIn" className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"><Linkedin className="h-5 w-5" aria-hidden="true" /></a>
                  </div>
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
