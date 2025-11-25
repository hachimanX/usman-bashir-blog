import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import { Card, CardContent } from "@/components/ui/card";
import { Award, BookOpen, Users, TrendingUp } from "lucide-react";

const highlights = [
  {
    icon: Award,
    title: "10+ Years Experience",
    description: "Over a decade of hands-on experience in SEO and digital marketing",
  },
  {
    icon: BookOpen,
    title: "100+ Articles Published",
    description: "In-depth guides and case studies read by thousands of professionals",
  },
  {
    icon: Users,
    title: "Consulted 50+ Brands",
    description: "Helped businesses from startups to enterprise scale their organic traffic",
  },
  {
    icon: TrendingUp,
    title: "Proven Results",
    description: "Delivered measurable growth in rankings, traffic, and conversions",
  },
];

export default function About() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="border-b py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold sm:text-5xl" data-testid="text-page-title">About Me</h1>
            <div className="prose prose-lg mt-8 max-w-none dark:prose-invert">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Hi, I'm Usman Bashir. I've been working in digital marketing and SEO for over a decade, helping businesses of all sizes improve their online visibility and drive meaningful growth through organic search.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                This website is where I share what I've learned along the way—in-depth strategies, case studies, and practical insights you can apply to your own projects. I focus on creating content that goes beyond the basics, offering unique perspectives and actionable advice.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                I've consulted for companies ranging from early-stage startups to established enterprises, and I've seen what works (and what doesn't) across different industries and competitive landscapes. My goal is to help you cut through the noise and focus on strategies that actually move the needle.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-3xl font-bold" data-testid="text-highlights-heading">Highlights</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {highlights.map((highlight, index) => {
                const Icon = highlight.icon;
                return (
                  <Card key={index} data-testid={`card-highlight-${index}`}>
                    <CardContent className="pt-6">
                      <Icon className="mb-4 h-8 w-8 text-primary" />
                      <h3 className="mb-2 font-semibold" data-testid={`text-highlight-title-${index}`}>
                        {highlight.title}
                      </h3>
                      <p className="text-sm text-muted-foreground" data-testid={`text-highlight-desc-${index}`}>
                        {highlight.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-t py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-3xl font-bold" data-testid="text-expertise-heading">Areas of Expertise</h2>
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>
                  <span>Technical SEO and website optimization</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>
                  <span>Content strategy and creation</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>
                  <span>Link building and outreach</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>
                  <span>Local and e-commerce SEO</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>
                  <span>Analytics and data-driven decision making</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>
                  <span>Algorithm analysis and SERP research</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="border-t py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-3xl font-bold" data-testid="text-contact-heading">Get in Touch</h2>
            <p className="mb-6 text-lg text-muted-foreground">
              For agency services and client work, please visit my main website. This personal site is primarily for publishing articles and sharing insights.
            </p>
            <p className="text-muted-foreground">
              Feel free to connect with me on social media or subscribe to the newsletter to stay updated with new articles.
            </p>
            <div className="mt-8">
              <NewsletterSignup variant="card" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
