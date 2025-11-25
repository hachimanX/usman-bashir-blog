import { Card, CardContent } from "@/components/ui/card";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Usman's insights have been invaluable for our SEO strategy. His deep understanding of search algorithms is unmatched.",
    author: "Sarah Chen",
    role: "Head of Marketing",
    company: "TechFlow",
  },
  {
    quote: "The content strategies outlined in Usman's articles helped us triple our organic traffic in just six months.",
    author: "Michael Rodriguez",
    role: "CEO",
    company: "GrowthLabs",
  },
  {
    quote: "Clear, actionable advice that actually works. This is the go-to resource for anyone serious about SEO.",
    author: "Emily Thompson",
    role: "Marketing Director",
    company: "Innovate Co",
  },
];

export default function TestimonialSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} data-testid={`card-testimonial-${index}`}>
              <CardContent className="pt-6">
                <blockquote className="text-sm leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div className="mt-4">
                  <p className="font-semibold" data-testid={`text-author-${index}`}>
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-muted-foreground" data-testid={`text-role-${index}`}>
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
