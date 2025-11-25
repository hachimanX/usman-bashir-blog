import { useRoute } from "wouter";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import ArticleCard from "@/components/ArticleCard";
import { Calendar, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const articleData: Record<string, any> = {
  "1": {
    title: "13 Advanced Link Building Strategies You (Probably) Haven't Used",
    date: "Nov 20, 2025",
    lastUpdated: "November 25, 2025",
    readTime: "15 min read",
    commentCount: 635,
    content: `
      <p>Link building remains one of the most important factors in SEO, yet most websites rely on the same tired strategies. In this comprehensive guide, we'll explore advanced tactics that can give you a competitive edge.</p>

      <h2>1. Analyzing Comment Patterns to Find Link-Worthy Content</h2>
      <p>Instead of just looking at social shares, analyze which articles receive the most comments. Articles that spark conversation are more likely to attract natural backlinks.</p>

      <h3>How to Implement This Strategy</h3>
      <p>Use tools like Screaming Frog to crawl competitor blogs and extract comment counts. Sort by highest engagement to identify content themes that resonate with audiences.</p>

      <h2>2. Finding Private Blog Networks Through Search Operators</h2>
      <p>While we don't recommend building your own PBN, understanding how they work can help you identify link opportunities and competitive advantages.</p>

      <p>Search for phone numbers or email addresses associated with your competitors to uncover network sites they might be using.</p>

      <h2>3. The Power of Data-Driven Content</h2>
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
        <article className="py-8">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_200px]">
              <div className="min-w-0">
                <header className="mb-8">
                  <h1 className="text-4xl font-bold leading-tight sm:text-5xl" data-testid="text-article-title">
                    {article.title}
                  </h1>
                </header>

                <Card className="mb-8 bg-muted/50 p-6">
                  <div className={showFullIntro ? "" : "relative"}>
                    <p className="leading-relaxed text-muted-foreground">
                      I focus on creating content that goes beyond SEO basics. I've been working in digital marketing for over a decade, consulting for companies ranging from startups to established enterprises.
                    </p>
                    {!showFullIntro && (
                      <>
                        <div className="mt-4 h-20 bg-gradient-to-b from-transparent to-muted/50" />
                        <p className="mt-2 leading-relaxed text-muted-foreground">
                          The basics can be incredibly effective, but I want to focus on unique, creative ways to achieve better rankings.
                        </p>
                      </>
                    )}
                    {showFullIntro && (
                      <>
                        <p className="mt-4 leading-relaxed text-muted-foreground">
                          The basics can be incredibly effective, but hundreds of sites cover them well and I want to focus on unique, creative ways to achieve better rankings.
                        </p>
                        <p className="mt-4 leading-relaxed text-muted-foreground">
                          Instead, here's my promise: <strong>I will put my absolute all into guides like this one to give original insights that help you get an edge over your competition</strong>.
                        </p>
                        <p className="mt-4 leading-relaxed text-muted-foreground">
                          That's it. That's my pitch for you to stick around (or perhaps let you know this isn't the site for you).
                        </p>
                        <p className="mt-4 leading-relaxed text-muted-foreground">
                          Thank you for being here!
                        </p>
                      </>
                    )}
                  </div>
                  <button
                    className="mt-4 p-0 h-auto font-normal text-primary underline hover:text-primary/80 transition-colors"
                    onClick={() => setShowFullIntro(!showFullIntro)}
                    data-testid="button-toggle-intro"
                  >
                    {showFullIntro ? "Show less" : "Read more"}
                  </button>
                </Card>

                <div 
                  className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-3xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-2xl prose-p:leading-relaxed prose-p:mb-6 prose-a:text-primary prose-a:underline prose-ul:my-6 prose-li:my-2 prose-li:leading-relaxed prose-strong:font-semibold"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                  data-testid="content-article-body"
                />
              </div>

              <aside className="hidden lg:block">
                <div className="sticky top-24 space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="mt-1 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Comments</p>
                        <p className="text-2xl font-bold" data-testid="text-sidebar-comments">
                          {article.commentCount}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Calendar className="mt-1 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Last Updated</p>
                        <p className="text-sm text-muted-foreground" data-testid="text-sidebar-updated">
                          {article.lastUpdated}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>

            <div className="mt-8 border-t pt-8 lg:hidden">
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{article.commentCount} comments</span>
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
