import { useRoute } from "wouter";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import ArticleCard from "@/components/ArticleCard";
import { Calendar } from "lucide-react";

const articleData: Record<string, any> = {
  "1": {
    title: "13 Advanced Link Building Strategies You (Probably) Haven't Used",
    author: "Usman Bashir",
    followers: "10.7K",
    readTime: "12 min read",
    date: "Nov 20, 2025",
    lastUpdated: "November 25, 2025",
    commentCount: 635,
    featuredImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop",
    content: `
      <p>Copyblogger has long been one of the most authoritative blogs on copywriting and content marketing.</p>

      <p>While they used to reveal their most popular blog posts in their sidebar (sorted by most comments), it seems that's no longer the case.</p>

      <p><em>But what if it was?</em></p>

      <p>What if you could analyse any blog and see which of their articles have the most comments, in order?</p>

      <p>If you could rank them by how many backlinks those articles have, you're left with foolproof solution for finding content ideas that attract links and comments.</p>

      <p>Fortunately, with the technology available today this is totally achievable in minutes and doesn't require you to fork out for a virtual assistant to do all of the grunt work.</p>

      <h2>"This is just a list of pages from Copyblogger. How does that help?"</h2>
      
      <p>As you probably guessed, there's a bit more to this tactic than simply finding all posts on the Copyblogger blog.</p>

      <p>In a previous version of this article (now updated in December of 2017) I recommended a tool called <em>URL Profiler</em> to help you with the next steps.</p>

      <p>However, ScreamingFrog is more than capable of handling them these days.</p>

      <p>What we want to do next is head on over to the website in question, Copyblogger.com, and select the data you wish to extract. This is slightly easier to do in Chrome than it is Firefox, but both are suitable.</p>

      <h2>A Unique Formula for Finding Popular, Linked-to Content</h2>

      <p>When it comes to analysing content to see what people are interested in reading about, we already have the likes of BuzzSumo to analyse how popular something was <em>socially</em>, but social shares don't always correspond to links.</p>

      <p>What does correspond to links? <strong>Getting people talking</strong>.</p>

      <p>If something is worth commenting on in 2017, it's far more likely to attract a link. And if you want to attract links to your articles, write something worth commenting on.</p>

      <p>Just like you can learn from articles which received thousands of <em>Pins</em> on Pinterest or <em>Likes</em> on Facebook, you can also learn from the success of others in attracting comments, and then apply that to your own endeavours.</p>

      <h3>How to Implement This Strategy</h3>

      <p>Use tools like Screaming Frog to crawl competitor blogs and extract comment counts. Sort by highest engagement to identify content themes that resonate with audiences.</p>

      <p>Articles that receive a lot of comments are usually great to model in terms of content to write for your own website, and <strong>typically receive more links from articles that wouldn't invoke readers to leave a comment</strong>.</p>

      <h2>Finding Private Blog Networks Through Search Operators</h2>

      <p>While we don't recommend building your own PBN, understanding how they work can help you identify link opportunities and competitive advantages.</p>

      <p>Search for phone numbers or email addresses associated with your competitors to uncover network sites they might be using.</p>

      <h2>The Power of Data-Driven Content</h2>

      <p>Original research and data analysis naturally attract links. Consider conducting industry surveys, analyzing large datasets, or creating unique visualizations.</p>

      <h3>Case Study: SEO Industry Analysis</h3>

      <p>When we published our analysis of 10,000 search results, it generated over 300 backlinks from authoritative domains within the first month.</p>

      <h2>Key Takeaways</h2>
      <ul>
        <li>Focus on content that naturally encourages discussion and sharing</li>
        <li>Use advanced search operators to uncover hidden link opportunities</li>
        <li>Original research and data analysis are link magnets</li>
        <li>Quality always trumps quantity in link building</li>
      </ul>

      <h2>Conclusion</h2>
      <p>Link building in 2025 requires creativity, analysis, and a focus on creating genuinely valuable content. The strategies outlined here go beyond the basics and can help you build a stronger backlink profile.</p>
    `,
  },
};

const relatedArticles = [
  {
    id: "2",
    title: "The State of SEO in 2025: An In-Depth Report",
    excerpt: "What's happening right now in search. An analysis of algorithm updates and ranking factors.",
    date: "Nov 15, 2025",
    readTime: "12 min read",
    commentCount: 375,
  },
  {
    id: "4",
    title: "Content Marketing Strategies That Drive Real Results",
    excerpt: "Proven frameworks for creating content that ranks, engages, and converts.",
    date: "Nov 5, 2025",
    readTime: "8 min read",
    commentCount: 89,
  },
  {
    id: "5",
    title: "Technical SEO: The Complete Checklist for 2025",
    excerpt: "Everything about technical optimization and Core Web Vitals.",
    date: "Oct 28, 2025",
    readTime: "14 min read",
    commentCount: 156,
  },
];

export default function Article() {
  const [, params] = useRoute("/article/:id");
  const [showFullIntro, setShowFullIntro] = useState(false);
  const articleId = params?.id || "1";
  const article = articleData[articleId] || articleData["1"];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <article className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <header className="mb-8 text-center">
              <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl" data-testid="text-article-title">
                {article.title}
              </h1>
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span>Written by {article.author}</span>
                <span>|</span>
                <span className="font-semibold">{article.followers} Followers</span>
                <span>|</span>
                <span>{article.readTime}</span>
              </div>
            </header>

            {article.featuredImage && (
              <div className="mb-12">
                <img 
                  src={article.featuredImage} 
                  alt={article.title}
                  className="w-full rounded-lg"
                  data-testid="img-featured"
                />
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  PICTURED: Stock image for illustration purposes
                </p>
              </div>
            )}

            <div className="grid gap-8 lg:grid-cols-[200px_1fr_280px]">
              <aside className="hidden lg:block">
                <div className="sticky top-24 space-y-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Comments</p>
                    <p className="mt-1 text-5xl font-bold text-primary" data-testid="text-sidebar-comments">
                      {article.commentCount}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Last Updated</p>
                    <p className="mt-1 text-sm" data-testid="text-sidebar-updated">
                      {article.lastUpdated}
                    </p>
                  </div>
                </div>
              </aside>

              <div className="min-w-0">
                <div 
                  className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-3xl prose-h2:font-black prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-xl prose-h3:font-bold prose-p:leading-relaxed prose-p:text-[17px] prose-p:mb-6 prose-a:text-primary prose-a:underline prose-ul:my-6 prose-li:my-2 prose-li:leading-relaxed prose-strong:font-bold prose-em:italic"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                  data-testid="content-article-body"
                />
              </div>

              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <div className="rounded-lg border bg-muted/30 p-6">
                    <div className={showFullIntro ? "" : "relative"}>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        I focus on creating content that goes beyond SEO basics (or at least looking to level-up quickly).
                      </p>
                      {!showFullIntro && (
                        <>
                          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-muted/30 to-transparent" />
                        </>
                      )}
                      {showFullIntro && (
                        <>
                          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                            I've been working in digital marketing for over a decade, helping businesses ranging from startups to established brands improve their online presence.
                          </p>
                          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                            The basics can be incredibly effective, but hundreds of sites cover them well. I want to focus on unique, creative strategies to achieve better results.
                          </p>
                          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                            Here's my promise: <strong>I will put my absolute all into guides like this one to give original insights that help you get an edge over your competition</strong>.
                          </p>
                          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                            That's it. That's my pitch for you to stick around (or perhaps let you know this isn't the site for you).
                          </p>
                          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                            This is already too much text for a 'click-to-read-more-fade-thing' but there's more if you like.
                          </p>
                          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                            Thank you for being here!
                          </p>
                          <div className="mt-6 border-t pt-6">
                            <p className="text-4xl font-bold" style={{ fontFamily: 'Allura, cursive' }}>
                              Bashir
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                    <button
                      className="mt-4 text-sm font-semibold text-primary underline hover:text-primary/80 transition-colors"
                      onClick={() => setShowFullIntro(!showFullIntro)}
                      data-testid="button-toggle-intro"
                    >
                      {showFullIntro ? "Show less" : "Read more"}
                    </button>
                  </div>
                </div>
              </aside>
            </div>

            <div className="mt-8 border-t pt-8 lg:hidden">
              <div className="flex flex-wrap gap-6 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Comments</p>
                  <p className="mt-1 text-2xl font-bold text-primary">{article.commentCount}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Last updated: {article.lastUpdated}</span>
                </div>
              </div>
            </div>
          </div>
        </article>

        <section className="border-t py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <NewsletterSignup variant="card" />
          </div>
        </section>

        <section className="border-t py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-3xl font-bold" data-testid="text-related-heading">Related Articles</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedArticles.map((relatedArticle) => (
                <ArticleCard key={relatedArticle.id} {...relatedArticle} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
