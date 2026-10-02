import { ArrowUpRight, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TESTIMONIALS, VIDEO_TESTIMONIAL, type Testimonial } from "@shared/testimonials";

/**
 * Three tiers, strongest proof first: the review with a measurable result and
 * its traffic chart, then the video next to the named recommendation, then the
 * rest in a grid whose rows (3 + 2) never leave a single orphan card.
 */
export default function TestimonialSection() {
  const featured = TESTIMONIALS.find((t) => t.placement === "featured");
  const besideVideo = TESTIMONIALS.find((t) => t.placement === "beside-video");
  const rest = TESTIMONIALS.filter((t) => !t.placement);

  return (
    <section className="py-20 sm:py-24" aria-labelledby="testimonials-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Visible now: on a page whose job is "is this a real person", who
            vouches for him is content, not decoration. */}
        <h2
          id="testimonials-heading"
          className="text-3xl font-semibold leading-[1.1] sm:text-4xl"
        >
          What people I've worked with <span className="accent-word">say</span>
        </h2>

        {featured && (
          <Card className="relative mt-10 overflow-hidden">
            <div aria-hidden="true" className="brand-glow pointer-events-none absolute inset-0" />
            <CardContent className="relative p-7 sm:p-10">
              <Quote className="h-8 w-8 text-primary" aria-hidden="true" />
              <figure className="mt-5">
                <blockquote className="max-w-[68ch] font-display text-lg font-medium leading-relaxed tracking-[-0.01em] sm:text-xl">
                  &ldquo;{featured.quote}&rdquo;
                </blockquote>
                <Attribution t={featured} className="mt-6" />
              </figure>
              {featured.image && (
                <figure className="mt-8">
                  <a
                    href={featured.image.src}
                    target="_blank"
                    rel="noopener"
                    className="block overflow-hidden rounded-xl border transition-colors hover:border-primary/60"
                  >
                    <img
                      src={featured.image.src}
                      alt={featured.image.alt}
                      width={featured.image.width}
                      height={featured.image.height}
                      loading="lazy"
                      className="h-auto w-full"
                    />
                  </a>
                  <figcaption className="mt-3 text-sm text-muted-foreground">
                    {featured.image.caption}
                  </figcaption>
                </figure>
              )}
            </CardContent>
          </Card>
        )}

        <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,300px)_1fr]">
          {/* A face and a voice beat any quote. preload="none" so the 16 MB
              file only downloads when someone presses play. */}
          <Card className="overflow-hidden">
            <figure>
              <video
                controls
                playsInline
                preload="none"
                poster={VIDEO_TESTIMONIAL.poster}
                width={VIDEO_TESTIMONIAL.width}
                height={VIDEO_TESTIMONIAL.height}
                aria-label={`Video review from ${VIDEO_TESTIMONIAL.author}, ${VIDEO_TESTIMONIAL.duration}`}
                className="block aspect-[480/848] h-auto w-full bg-black object-cover"
              >
                <source src={VIDEO_TESTIMONIAL.src} type="video/mp4" />
              </video>
              <figcaption className="p-5">
                <p className="font-semibold">{VIDEO_TESTIMONIAL.author}</p>
                <p className="text-sm text-muted-foreground">
                  {VIDEO_TESTIMONIAL.role} &middot; video, {VIDEO_TESTIMONIAL.duration}
                </p>
              </figcaption>
            </figure>
          </Card>

          {besideVideo && (
            <Card className="relative flex overflow-hidden">
              <div aria-hidden="true" className="surface-grid pointer-events-none absolute inset-y-0 right-0 w-1/2" />
              <CardContent className="relative flex flex-col justify-center p-7 sm:p-10">
                <Quote className="h-8 w-8 text-primary" aria-hidden="true" />
                <figure className="mt-5">
                  <blockquote className="max-w-[56ch] font-display text-xl font-medium leading-relaxed tracking-[-0.01em] sm:text-2xl">
                    &ldquo;{besideVideo.quote}&rdquo;
                  </blockquote>
                  <Attribution t={besideVideo} className="mt-8" />
                </figure>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-6">
          {rest.map((t, i) => (
            <Card
              key={`${t.author ?? t.role}-${t.quote.slice(0, 24)}`}
              className={`flex ${i < 3 ? "md:col-span-2" : "md:col-span-3"}`}
            >
              <CardContent className="flex flex-col p-7">
                <Quote className="h-6 w-6 text-primary" aria-hidden="true" />
                <figure className="mt-4 flex flex-1 flex-col">
                  {/* Typographic quotes, not the straight ASCII pair. */}
                  <blockquote className="flex-1 leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <Attribution t={t} className="mt-6 border-t pt-4" />
                </figure>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Named reviewers: name, then role and source. Unnamed ones (Upwork clients
 * have no public profile) lead with the work itself, e.g. "3-month SEO content
 * contract / Review on Upwork", which says more than a bare "Client" would.
 */
function Attribution({ t, className = "" }: { t: Testimonial; className?: string }) {
  if (!t.author) {
    return (
      <figcaption className={className}>
        <p className="font-semibold">{t.role}</p>
        {t.source && <p className="text-sm text-muted-foreground">Review on {t.source}</p>}
      </figcaption>
    );
  }
  return (
    <figcaption className={className}>
      <p className="font-semibold">
        {t.authorUrl ? (
          <a
            href={t.authorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-primary"
          >
            {t.author}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        ) : (
          t.author
        )}
      </p>
      <p className="text-sm text-muted-foreground">
        {t.role}
        {t.source && <> &middot; via {t.source}</>}
      </p>
    </figcaption>
  );
}
