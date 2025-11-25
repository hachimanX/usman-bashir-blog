import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ArticleCard from "@/components/ArticleCard";
import TestimonialSection from "@/components/TestimonialSection";
import NewsletterSignup from "@/components/NewsletterSignup";

const latestUpdates = [
  {
    id: "1",
    title: "13 Advanced Link Building Strategies You (Probably) Haven't Used",
    date: "Nov 20, 2025",
    readTime: "15 min",
  },
  {
    id: "2",
    title: "The State of SEO in 2025: An In-Depth Report",
    date: "Nov 15, 2025",
    readTime: "12 min",
  },
  {
    id: "3",
    title: "How to Generate Six-Figure Profits from SEO Audits",
    date: "Nov 10, 2025",
    readTime: "10 min",
  },
];

const playbooks = [
  {
    id: "1",
    title: "13 Advanced Link Building Strategies You (Probably) Haven't Used",
    excerpt: "Unique, creative ways to achieve better rankings. Learn how to analyze competitors, find private networks, and build high-quality backlinks that actually move the needle.",
    date: "Nov 20, 2025",
    readTime: "15 min read",
    commentCount: 635,
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
  },
  {
    id: "2",
    title: "The State of SEO in 2025: An In-Depth Report",
    excerpt: "What's happening right now in search. An analysis of algorithm updates, ranking factors, and what's actually working in today's SEO landscape.",
    date: "Nov 15, 2025",
    readTime: "12 min read",
    commentCount: 375,
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
  },
  {
    id: "4",
    title: "Content Marketing Strategies That Drive Real Results",
    excerpt: "Proven frameworks for creating content that ranks, engages, and converts. Learn from case studies of successful content campaigns.",
    date: "Nov 5, 2025",
    readTime: "8 min read",
    commentCount: 89,
    imageUrl: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=250&fit=crop",
  },
  {
    id: "5",
    title: "Technical SEO: The Complete Checklist for 2025",
    excerpt: "Everything you need to know about technical optimization. From Core Web Vitals to structured data and crawl budget optimization.",
    date: "Oct 28, 2025",
    readTime: "14 min read",
    commentCount: 156,
    imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=250&fit=crop",
  },
  {
    id: "6",
    title: "Local SEO: Dominating Your Geographic Market",
    excerpt: "Strategies for ranking in local search results. Google Business Profile optimization, local citations, and review management.",
    date: "Oct 20, 2025",
    readTime: "9 min read",
    commentCount: 72,
    imageUrl: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=400&h=250&fit=crop",
  },
  {
    id: "3",
    title: "How to Generate Six-Figure Profits from SEO Audits",
    excerpt: "A detailed guide on building a profitable SEO audit business. From pricing strategies to deliverables that clients actually value.",
    date: "Nov 10, 2025",
    readTime: "10 min read",
    commentCount: 127,
    imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="border-b py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
              <div>
                <h2 className="mb-6 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  Latest Updates
                </h2>
                <div className="space-y-6">
                  {latestUpdates.map((update, index) => (
                    <a
                      key={update.id}
                      href={`/article/${update.id}`}
                      className="block group"
                      data-testid={`link-update-${index}`}
                    >
                      <h3 className="font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
                        {update.title}
                      </h3>
                      <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                        {update.date.split(' ')[0]} {update.date.split(' ')[1]}
                      </p>
                    </a>
                  ))}
                  <a
                    href="/articles"
                    className="inline-block text-sm font-semibold text-primary hover:underline"
                    data-testid="link-view-all-updates"
                  >
                    VIEW ALL LATEST UPDATES →
                  </a>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {playbooks.slice(0, 4).map((article, index) => (
                  <a
                    key={article.id}
                    href={`/article/${article.id}`}
                    className="group block overflow-hidden rounded-lg border transition-shadow hover:shadow-lg"
                    data-testid={`card-playbook-${index}`}
                  >
                    {article.imageUrl && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-bold leading-tight group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
                        {article.commentCount} COMMENTS
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-3xl font-bold" data-testid="text-playbooks-heading">
              SEO Playbooks
            </h2>
            <p className="mb-8 text-muted-foreground">
              We've worked with companies like Ahrefs, Kinsta, Buffer & ConvertKit.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {playbooks.map((article, index) => (
                <a
                  key={article.id}
                  href={`/article/${article.id}`}
                  className="group block overflow-hidden rounded-lg border transition-shadow hover:shadow-lg"
                  data-testid={`card-article-${index}`}
                >
                  {article.imageUrl && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold leading-tight group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
                      {article.commentCount} COMMENTS
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b bg-muted/30 py-16">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl" data-testid="text-newsletter-heading">
              "Think of us like the Bloomberg of SEO."
            </h2>
            <p className="mb-8 text-muted-foreground">
              Exclusive insights from tracking the rankings & revenue of digital businesses.
            </p>
            <NewsletterSignup variant="inline" />
          </div>
        </section>

        <TestimonialSection />
      </main>

      <Footer />
    </div>
  );
}
