import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ArticleCard from "@/components/ArticleCard";
import TestimonialSection from "@/components/TestimonialSection";
import NewsletterSignup from "@/components/NewsletterSignup";

const featuredArticles = [
  {
    id: "1",
    title: "13 Advanced Link Building Strategies You (Probably) Haven't Used",
    excerpt: "Unique, creative ways to achieve better rankings. Learn how to analyze competitors, find private networks, and build high-quality backlinks that actually move the needle.",
    date: "Nov 20, 2025",
    readTime: "15 min read",
    commentCount: 635,
    featured: true,
  },
  {
    id: "2",
    title: "The State of SEO in 2025: An In-Depth Report",
    excerpt: "What's happening right now in search. An analysis of algorithm updates, ranking factors, and what's actually working in today's SEO landscape.",
    date: "Nov 15, 2025",
    readTime: "12 min read",
    commentCount: 375,
    featured: true,
  },
  {
    id: "3",
    title: "How to Generate Six-Figure Profits from SEO Audits",
    excerpt: "A detailed guide on building a profitable SEO audit business. From pricing strategies to deliverables that clients actually value.",
    date: "Nov 10, 2025",
    readTime: "10 min read",
    commentCount: 127,
    featured: true,
  },
];

const recentArticles = [
  {
    id: "4",
    title: "Content Marketing Strategies That Drive Real Results",
    excerpt: "Proven frameworks for creating content that ranks, engages, and converts. Learn from case studies of successful content campaigns.",
    date: "Nov 5, 2025",
    readTime: "8 min read",
    commentCount: 89,
  },
  {
    id: "5",
    title: "Technical SEO: The Complete Checklist for 2025",
    excerpt: "Everything you need to know about technical optimization. From Core Web Vitals to structured data and crawl budget optimization.",
    date: "Oct 28, 2025",
    readTime: "14 min read",
    commentCount: 156,
  },
  {
    id: "6",
    title: "Local SEO: Dominating Your Geographic Market",
    excerpt: "Strategies for ranking in local search results. Google Business Profile optimization, local citations, and review management.",
    date: "Oct 20, 2025",
    readTime: "9 min read",
    commentCount: 72,
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <HeroSection />

        <section className="border-t py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold" data-testid="text-featured-heading">Featured Articles</h2>
              <p className="mt-2 text-muted-foreground">In-depth guides and analysis</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredArticles.map((article) => (
                <ArticleCard key={article.id} {...article} />
              ))}
            </div>
          </div>
        </section>

        <TestimonialSection />

        <section className="border-t py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold" data-testid="text-recent-heading">Recent Articles</h2>
              <p className="mt-2 text-muted-foreground">Latest insights and updates</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentArticles.map((article) => (
                <ArticleCard key={article.id} {...article} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-t py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <NewsletterSignup variant="card" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
