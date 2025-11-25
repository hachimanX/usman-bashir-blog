import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

const allArticles = [
  {
    id: "1",
    title: "13 Advanced Link Building Strategies You (Probably) Haven't Used",
    excerpt: "Unique, creative ways to achieve better rankings. Learn how to analyze competitors, find private networks, and build high-quality backlinks.",
    date: "Nov 20, 2025",
    readTime: "15 min read",
    commentCount: 635,
    featured: true,
  },
  {
    id: "2",
    title: "The State of SEO in 2025: An In-Depth Report",
    excerpt: "What's happening right now in search. An analysis of algorithm updates, ranking factors, and what's actually working.",
    date: "Nov 15, 2025",
    readTime: "12 min read",
    commentCount: 375,
    featured: true,
  },
  {
    id: "3",
    title: "How to Generate Six-Figure Profits from SEO Audits",
    excerpt: "A detailed guide on building a profitable SEO audit business. From pricing strategies to deliverables.",
    date: "Nov 10, 2025",
    readTime: "10 min read",
    commentCount: 127,
  },
  {
    id: "4",
    title: "Content Marketing Strategies That Drive Real Results",
    excerpt: "Proven frameworks for creating content that ranks, engages, and converts. Learn from successful campaigns.",
    date: "Nov 5, 2025",
    readTime: "8 min read",
    commentCount: 89,
  },
  {
    id: "5",
    title: "Technical SEO: The Complete Checklist for 2025",
    excerpt: "Everything about technical optimization. Core Web Vitals, structured data, and crawl budget optimization.",
    date: "Oct 28, 2025",
    readTime: "14 min read",
    commentCount: 156,
  },
  {
    id: "6",
    title: "Local SEO: Dominating Your Geographic Market",
    excerpt: "Strategies for ranking in local search. Google Business Profile optimization and review management.",
    date: "Oct 20, 2025",
    readTime: "9 min read",
    commentCount: 72,
  },
  {
    id: "7",
    title: "E-commerce SEO: Scaling Product Pages That Rank",
    excerpt: "Optimize product pages for search engines. Category architecture, product descriptions, and schema markup.",
    date: "Oct 12, 2025",
    readTime: "11 min read",
    commentCount: 103,
  },
  {
    id: "8",
    title: "Analyzing 10,000 Search Results: What Actually Ranks",
    excerpt: "Data-driven insights from analyzing thousands of SERPs. Common patterns in top-ranking content.",
    date: "Oct 5, 2025",
    readTime: "16 min read",
    commentCount: 284,
  },
  {
    id: "9",
    title: "The Future of AI in Content Creation and SEO",
    excerpt: "How AI is changing content marketing. Tools, strategies, and ethical considerations for AI-generated content.",
    date: "Sep 28, 2025",
    readTime: "10 min read",
    commentCount: 215,
  },
];

export default function Articles() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = allArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="border-b py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold sm:text-5xl" data-testid="text-page-title">All Articles</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Explore all published articles on SEO, digital marketing, and content strategy.
            </p>
            <div className="mt-8 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-articles"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {filteredArticles.length > 0 ? (
              <>
                <p className="mb-6 text-sm text-muted-foreground" data-testid="text-results-count">
                  {filteredArticles.length} {filteredArticles.length === 1 ? "article" : "articles"} found
                </p>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredArticles.map((article) => (
                    <ArticleCard key={article.id} {...article} />
                  ))}
                </div>
              </>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground" data-testid="text-no-results">
                  No articles found matching your search.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
