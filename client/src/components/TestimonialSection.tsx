import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote: "Usman helped manage the content and SEO edits of multiple WordPress sites I had under my portfolio. He was always quick to understand the instructions, communicated effectively, and had a great attitude!",
    author: "Nate T.",
    role: "Network Engineer",
    source: "LinkedIn",
  },
  {
    quote: "I will recommend Mohammad for any role that requires top-notch SEO expertise and high-quality writing. His blend of skills and professionalism will undoubtedly drive success and growth.",
    author: "Anna P.",
    role: "Admin Coordinator",
    source: "LinkedIn",
  },
  {
    quote: "Usman's work on my ecommerce website was outstanding. He designed and optimized it thoroughly — my online store has never looked better.",
    author: "A. Shahid",
    role: "Co-Founder, MTR Co.",
    source: "Client",
  },
];

export default function TestimonialSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <blockquote className="text-sm leading-relaxed">"{t.quote}"</blockquote>
                <div className="mt-4">
                  <p className="font-semibold">{t.author}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                  <p className="mt-1 text-xs text-muted-foreground/60">via {t.source}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
