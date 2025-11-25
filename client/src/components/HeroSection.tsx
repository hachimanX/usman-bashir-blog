import NewsletterSignup from "./NewsletterSignup";

export default function HeroSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl" data-testid="text-hero-title">
          Digital Marketing & SEO Insights
        </h1>
        <p className="mt-6 text-lg text-muted-foreground sm:text-xl" data-testid="text-hero-subtitle">
          In-depth articles on SEO, content strategy, and digital marketing from years of hands-on experience in the field.
        </p>
        <div className="mt-8 flex justify-center">
          <NewsletterSignup variant="inline" />
        </div>
        <p className="mt-4 text-sm text-muted-foreground" data-testid="text-subscribers">
          Join 10,000+ subscribers getting weekly insights
        </p>
      </div>
    </section>
  );
}
