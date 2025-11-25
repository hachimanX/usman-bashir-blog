import { useRoute } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import ArticleCard from "@/components/ArticleCard";
import { Calendar, Clock, MessageSquare, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const articleData: Record<string, any> = {
  "1": {
    title: "13 Advanced Link Building Strategies You (Probably) Haven't Used",
    date: "Nov 20, 2025",
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
  const articleId = params?.id || "1";
  const article = articleData[articleId] || articleData["1"];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <article className="py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Link href="/articles" data-testid="link-back-articles">
              <Button variant="ghost" size="sm" className="mb-8">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Articles
              </Button>
            </Link>

            <header className="mb-8">
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl" data-testid="text-article-title">
                {article.title}
              </h1>
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1" data-testid="text-article-date">
                  <Calendar className="h-4 w-4" />
                  {article.date}
                </div>
                <div className="flex items-center gap-1" data-testid="text-article-readtime">
                  <Clock className="h-4 w-4" />
                  {article.readTime}
                </div>
                <div className="flex items-center gap-1" data-testid="text-article-comments">
                  <MessageSquare className="h-4 w-4" />
                  {article.commentCount} comments
                </div>
              </div>
            </header>

            <div 
              className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-h2:mt-8 prose-h2:text-3xl prose-h3:mt-6 prose-h3:text-2xl prose-p:leading-relaxed prose-a:text-primary prose-a:underline prose-ul:my-6 prose-li:my-2"
              dangerouslySetInnerHTML={{ __html: article.content }}
              data-testid="content-article-body"
            />
          </div>
        </article>

        <section className="border-t py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
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
