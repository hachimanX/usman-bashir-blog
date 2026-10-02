import type { ComponentType } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Hammer,
  Hourglass,
  Linkedin,
  Mail,
  Megaphone,
  Palette,
  SearchCheck,
  type LucideIcon,
} from "lucide-react";
import Header from "@/components/Header";
import Seo from "@/components/Seo";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import TestimonialSection from "@/components/TestimonialSection";
import ContactEmail from "@/components/ContactEmail";
import { Button } from "@/components/ui/button";
import { TOOLS } from "@/lib/tools";
import { PERSON_SCHEMA, PROFILE_LINKS } from "@shared/person";
import { CONTACT, HERO, HOME_META, RESULTS, WORK_AREAS, type WorkArea } from "@shared/home";
import { SiX } from "react-icons/si";
import { ARTICLES } from "@/lib/content";

/**
 * The homepage answers one question for someone who just searched the name or
 * clicked an email signature: is this a real person, and who is he? Name and
 * face first, then the profiles that confirm it, then the work.
 */

const ELSEWHERE: { href: string; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { href: PROFILE_LINKS.linkedin, label: "LinkedIn", icon: Linkedin },
  { href: PROFILE_LINKS.x, label: "X", icon: SiX },
  { href: PROFILE_LINKS.startfleet, label: "StartFleet", icon: Briefcase },
  { href: PROFILE_LINKS.bobcat, label: "Bobcat Digital", icon: Palette },
];

const AREA_ICONS: Record<WorkArea["key"], LucideIcon> = {
  seo: SearchCheck,
  pr: Megaphone,
  design: Palette,
  ai: Hammer,
};

// Two wide cells on a diagonal so the grid reads as a pattern, not a stack.
const AREA_LAYOUT: Record<WorkArea["key"], string> = {
  seo: "md:col-span-2",
  pr: "",
  design: "",
  ai: "md:col-span-2",
};

export default function Home() {
  // Built from content/ at deploy time: no request, no waiting.
  const latest = ARTICLES.slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col">
      <Seo
        title={HOME_META.title}
        description={HOME_META.description}
        path="/"
        schema={PERSON_SCHEMA}
      />
      <Header />
      <main id="main" className="flex-1">
        {/* Hero: name, one line, two ways forward, and a real face. */}
        <section className="relative overflow-hidden border-b">
          <div aria-hidden="true" className="brand-glow pointer-events-none absolute inset-0" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16 lg:px-8 lg:py-24">
            <div className="animate-in fade-in-0 slide-in-from-bottom-3 duration-700">
              {/* On small screens the portrait would land below the fold, so a
                  small round version sits above the name instead. */}
              <img
                src="/usman.jpg"
                alt=""
                width={80}
                height={80}
                className="mb-6 h-20 w-20 rounded-full border object-cover lg:hidden"
              />
              <h1 className="text-5xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
                Usman Bashir
              </h1>
              <p className="mt-6 max-w-[26ch] font-display text-2xl font-medium leading-[1.25] tracking-[-0.02em] sm:text-3xl">
                {HERO.lead} <span className="accent-word">{HERO.accent}</span>
              </p>
              <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-muted-foreground">
                {HERO.sub}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/about">
                    More about me <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="#contact">Get in touch</a>
                </Button>
              </div>
            </div>

            <div className="relative mx-auto hidden w-full max-w-[360px] lg:block">
              <div
                aria-hidden="true"
                className="brand-mark absolute -inset-5 rounded-[2.25rem] opacity-25 blur-2xl"
              />
              <img
                src="/usman.jpg"
                alt="Usman Bashir"
                width={400}
                height={400}
                {...{ fetchpriority: "high" }}
                className="relative aspect-square w-full rounded-[1.75rem] border object-cover"
              />
            </div>
          </div>
        </section>

        {/* The profiles that confirm the person on this page is the same one
            on LinkedIn, X and the two companies. */}
        <section className="border-b" aria-labelledby="elsewhere-heading">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:gap-8 sm:px-6 lg:px-8">
            <h2
              id="elsewhere-heading"
              className="shrink-0 font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground"
            >
              Find me elsewhere
            </h2>
            <ul className="flex flex-wrap gap-2">
              {ELSEWHERE.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* What I work on: four areas, two wide cells on a diagonal. */}
        <section className="py-20 sm:py-24" aria-labelledby="work-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 id="work-heading" className="text-3xl font-semibold leading-[1.1] sm:text-4xl lg:text-5xl">
              What I <span className="accent-word">work</span> on
            </h2>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {WORK_AREAS.map((area) => {
                const Icon = AREA_ICONS[area.key];
                return (
                  <article
                    key={area.key}
                    className={`relative overflow-hidden rounded-2xl border bg-card p-7 sm:p-8 ${AREA_LAYOUT[area.key]}`}
                  >
                    {area.key === "seo" && (
                      <div aria-hidden="true" className="brand-glow pointer-events-none absolute inset-0" />
                    )}
                    {area.key === "ai" && (
                      <div aria-hidden="true" className="surface-grid pointer-events-none absolute inset-y-0 right-0 w-2/3" />
                    )}
                    <div className="relative flex h-full flex-col gap-4">
                      <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                      <h3 className="text-xl font-semibold sm:text-2xl">{area.title}</h3>
                      <p className="max-w-[56ch] leading-relaxed text-muted-foreground">{area.body}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Results: real screenshots, no client names. The tall Search Console
            card sits beside the two headline numbers and the wide Ahrefs strip,
            so the columns end at roughly the same height. */}
        <section className="border-t py-20 sm:py-24" aria-labelledby="results-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 id="results-heading" className="text-3xl font-semibold leading-[1.1] sm:text-4xl lg:text-5xl">
              Some <span className="accent-word">numbers</span> from my work
            </h2>
            <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-muted-foreground">{RESULTS.intro}</p>
            <div className="mt-12 grid gap-4 lg:grid-cols-[5fr_7fr]">
              <figure className="overflow-hidden rounded-2xl border bg-card p-4 sm:p-6">
                <img
                  src={RESULTS.gsc.image.src}
                  alt={RESULTS.gsc.alt}
                  width={RESULTS.gsc.image.width}
                  height={RESULTS.gsc.image.height}
                  loading="lazy"
                  className="mx-auto h-auto w-full max-w-[380px] rounded-xl"
                />
                <figcaption className="mt-4 text-center text-sm text-muted-foreground">
                  {RESULTS.gsc.source}
                </figcaption>
              </figure>
              <div className="flex flex-col gap-4">
                <div className="grid flex-1 gap-4 sm:grid-cols-2">
                  {[RESULTS.gsc, RESULTS.ahrefs].map((r) => (
                    <div key={r.value} className="relative overflow-hidden rounded-2xl border bg-card p-7">
                      <div aria-hidden="true" className="brand-glow pointer-events-none absolute inset-0" />
                      <div className="relative flex h-full flex-col justify-end">
                        <p className="font-display text-5xl font-semibold tracking-[-0.03em] text-primary sm:text-6xl">
                          {r.value}
                        </p>
                        <p className="mt-3 text-lg leading-snug">{r.label}</p>
                        <p className="mt-2 font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
                          {r.source}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <figure className="overflow-hidden rounded-2xl border bg-card p-4 sm:p-5">
                  <img
                    src={RESULTS.ahrefs.image.src}
                    alt={RESULTS.ahrefs.alt}
                    width={RESULTS.ahrefs.image.width}
                    height={RESULTS.ahrefs.image.height}
                    loading="lazy"
                    className="h-auto w-full rounded-lg"
                  />
                </figure>
              </div>
            </div>
          </div>
        </section>

        {/* Things I've built: only what lives on this site. */}
        <section className="border-y bg-muted/40 py-20 sm:py-24" aria-labelledby="built-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 id="built-heading" className="text-3xl font-semibold leading-[1.1] sm:text-4xl lg:text-5xl">
              Things I've <span className="accent-word">built</span>
            </h2>
            <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-muted-foreground">
              Free, no signup, nothing stored. Each one started as something I needed myself.
            </p>
            <ul className="mt-10 border-t">
              {TOOLS.map((tool) => (
                <li key={tool.slug} className="border-b">
                  {tool.status === "live" ? (
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="group grid grid-cols-[1fr_auto] items-center gap-6 py-7"
                    >
                      <ToolText name={tool.name} blurb={tool.blurb} status="live" />
                      <span className="grid h-12 w-12 place-items-center rounded-full border transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                        <ArrowRight className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </Link>
                  ) : (
                    <div className="grid grid-cols-[1fr_auto] items-center gap-6 py-7">
                      <ToolText name={tool.name} blurb={tool.blurb} status="soon" />
                      <span className="grid h-12 w-12 place-items-center rounded-full border text-muted-foreground">
                        <Hourglass className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Writing appears once something is published. An empty "coming
            soon" block on the homepage reads as an abandoned site. */}
        {latest.length > 0 && (
          <section className="py-20 sm:py-24" aria-labelledby="writing-heading">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <h2 id="writing-heading" className="text-3xl font-semibold leading-[1.1] sm:text-4xl lg:text-5xl">
                Latest <span className="accent-word">writing</span>
              </h2>
              <ul className="mt-10">
                {latest.map((post) => (
                  <li key={post.slug} className="border-t last:border-b">
                    <Link
                      href={`/article/${post.slug}`}
                      className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 py-6 sm:grid-cols-[180px_1fr_auto]"
                    >
                      <span
                        className="col-span-2 font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground sm:col-span-1"
                      >
                        {post.category}
                      </span>
                      <span className="font-display text-xl font-semibold leading-snug tracking-[-0.015em] transition-colors group-hover:text-primary sm:text-2xl">
                        {post.title}
                      </span>
                      <ArrowUpRight
                        className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/articles"
                className="mt-8 inline-flex min-h-11 items-center gap-2 font-semibold text-primary hover:underline"
              >
                All articles <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </section>
        )}

        <TestimonialSection />

        <section id="contact" className="scroll-mt-24 pb-20 sm:pb-24" aria-labelledby="contact-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl border bg-card p-8 sm:p-12 lg:p-16">
              <div aria-hidden="true" className="brand-glow pointer-events-none absolute inset-0" />
              <div className="relative">
                <h2
                  id="contact-heading"
                  className="max-w-2xl pb-1 text-3xl font-semibold leading-[1.1] sm:text-4xl lg:text-5xl"
                >
                  {CONTACT.lead} <span className="accent-word">{CONTACT.accent}</span>
                  {CONTACT.tail && <> {CONTACT.tail}</>}
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{CONTACT.body}</p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <span
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border bg-background/60 px-5 font-mono text-sm"
                  >
                    <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
                    <ContactEmail />
                  </span>
                  <Button asChild size="lg" variant="outline">
                    <a href={PROFILE_LINKS.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin aria-hidden="true" /> Message me on LinkedIn
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <a href={PROFILE_LINKS.x} target="_blank" rel="noopener noreferrer">
                      <SiX aria-hidden="true" /> Message me on X
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t py-16" aria-labelledby="newsletter-heading">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
            <h2 id="newsletter-heading" className="text-2xl font-semibold sm:text-3xl">
              Get new posts and tools by email
            </h2>
            <p className="mt-3 text-muted-foreground">
              Occasional notes on SEO, marketing and the things I build, plus a heads-up when a
              new free tool goes live. No spam, unsubscribe any time.
            </p>
            <div className="mt-8">
              <NewsletterSignup variant="inline" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ToolText({ name, blurb, status }: { name: string; blurb: string; status: "live" | "soon" }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h3
          className={`text-xl font-semibold sm:text-2xl ${status === "live" ? "transition-colors group-hover:text-primary" : ""}`}
        >
          {name}
        </h3>
        <span
          className={`rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.08em] ${
            status === "live" ? "bg-primary/10 text-primary" : "border text-muted-foreground"
          }`}
        >
          {status === "live" ? "Live" : "Coming soon"}
        </span>
      </div>
      <p className="mt-2 text-muted-foreground">{blurb}</p>
    </div>
  );
}
