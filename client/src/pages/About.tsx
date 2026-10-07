import Header from "@/components/Header";
import Seo from "@/components/Seo";
import { PROFILE_PAGE_SCHEMA } from "@shared/person";
import Footer from "@/components/Footer";
import ContactEmail from "@/components/ContactEmail";
import { Link as LinkIcon, Calendar, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function About() {
  return (
    <div className="flex min-h-screen flex-col">
      <Seo
        title="About Usman Bashir — SEO & Digital Marketing"
        description="SEO and content practitioner at StartFleet, MBA graduate, and owner of Bobcat Digital LLC. Writing about search, marketing, and US company setup."
        path="/about"
        schema={PROFILE_PAGE_SCHEMA}
      />
      <Header />
      <main id="main" className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          {/* Self-hosted rather than hotlinked. The previous version pulled from
              a Twitter CDN URL, and the LinkedIn equivalent carries an `e=`
              expiry parameter — both break silently once the token rotates.
              Explicit width/height reserve the space so the page does not shift
              as it loads. */}
          <img
            src="/usman.jpg"
            alt="Usman Bashir"
            width={112}
            height={112}
            {...{ fetchpriority: "high" }}
            className="h-28 w-28 rounded-full border object-cover"
          />
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">Usman Bashir</h1>
          {/* The full legal name, said once in plain words. Search engines pick it
              up here and from alternateName in the schema, so nothing else on the
              site has to carry it. */}
          <p className="mt-2 text-muted-foreground">
            Muhammad Usman Bashir on paper, Usman to everyone else.{" "}
            <span className="font-mono text-sm">@imusmanbashir</span>
          </p>

          <div className="mt-6 space-y-4 text-base leading-relaxed">
            <p>
              I work in SEO and content, mostly on{" "}
              <a
                href="https://startfleet.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                StartFleet
              </a>
              , which helps people outside the US register American companies, and on{" "}
              <a
                href="https://bobcatdigital.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Bobcat Digital
              </a>
              , which helps brands with marketing and graphic design. StartFleet is where most of
              my week goes.
            </p>
            <p>
              This site is separate from both. It is where I write up what I am actually testing:
              SEO and marketing, search rankings, US company setup, business
              writing, gaming, and whatever else is worth the time. Including the parts that did
              not work.
            </p>
            <p>
              StartFleet pays my salary, so any article here that touches what they do carries a
              disclosure at the top. That is the point of keeping this site separate.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" aria-hidden="true" />
              <a
                href="https://startfleet.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                startfleet.io
              </a>
            </span>
            <span className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" aria-hidden="true" />
              <a
                href="https://bobcatdigital.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                bobcatdigital.co
              </a>
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <span>Working in SEO since 2020</span>
            </span>
          </div>

          {/* Highlights */}
          <div className="mt-14 border-t pt-10">
            <h2 className="mb-6 text-2xl font-bold">Background</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="p-6">
                <h3 className="mb-2 text-lg font-semibold">MBA</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Master of Business Administration. My thesis looked at behavioral intention to
                  adopt fintech — why people do and do not trust financial technology, which turned
                  out to be more about habit and perceived risk than about features.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="mb-2 text-lg font-semibold">StartFleet</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  My primary work. I run content and SEO for a company that handles US LLC
                  formation, EINs and banking access for people who are not US residents. Most of
                  what I know about company setup came from doing this daily.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="mb-2 text-lg font-semibold">Bobcat Digital</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Bobcat helps brands with marketing and graphic design — from ecommerce
                  storefronts to apparel graphics.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="mb-2 text-lg font-semibold">SEO &amp; content since 2020</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Mostly WordPress, ecommerce and service businesses. The work that actually moved
                  rankings was rarely the clever stuff — it was fixing what was broken and then
                  publishing consistently for long enough to matter.
                </p>
              </Card>
              <Card className="p-6 sm:col-span-2">
                <h3 className="mb-2 text-lg font-semibold">Outside work</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  PC gaming and anime, with a backlog that grows faster than I can clear it.{" "}
                  <em>Attack on Titan</em> is the best romance anime ever made and I stand by that.
                  Hachiman is the GOAT — the only character I have seen get self-awareness
                  genuinely right. Gojo is the strongest and I will not be taking questions. And{" "}
                  <em>Frieren</em> deserves to be{" "}
                  <a
                    href="https://myanimelist.net/anime/52991/Sousou_no_Frieren"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    number one on MAL
                  </a>
                  .
                </p>
              </Card>
            </div>
          </div>

          {/* About the site */}
          <div className="mt-14 border-t pt-10">
            <h2 className="mb-4 text-2xl font-bold">About this site</h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                This is a personal blog, not a media company. I started it in 2026 to write more
                consistently and to keep notes from real work in one place. You will find guides,
                tool comparisons, free tools, and a fair amount about US company setup for
                non-residents, since that is what I do all day.
              </p>
              <p>
                Every price, fee and statistic here is checked against a primary source before it
                goes in, and dated so it ages honestly. If I have not done something myself, the
                article says so.
              </p>
            </div>
          </div>

          {/* AI disclosure */}
          <div className="mt-14 border-t pt-10">
            <h2 className="mb-4 text-2xl font-bold">How this site is built</h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                I use AI heavily, and it would be strange to write about AI tools while pretending
                otherwise. The site itself was built with AI assistance, the free tools here were
                built the same way, and AI is part of how I research, draft and edit what I
                publish.
              </p>
              <p>
                What AI does not do here is decide what is true. Every factual claim is checked
                against a primary source by hand before publishing, and anything I could not verify
                is either labelled as opinion or cut. If you find something wrong, tell me and I
                will fix it.
              </p>
            </div>
          </div>

          {/* Contact / legal */}
          <div className="mt-14 border-t pt-10">
            <h2 className="mb-4 text-2xl font-bold">Contact, corrections and copyright</h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                If something here is factually wrong, out of date, or you believe any content or
                image on this site infringes your copyright, email me and I will look at it
                properly. I do not knowingly publish anyone else's material, but mistakes happen
                and I would rather fix one quickly than argue about it.
              </p>
              <p>
                For copyright claims, please include the URL on this site, a description of the
                work you say it infringes, and how to reach you.
              </p>
              <p className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-foreground">Email:</span>
                <ContactEmail className="text-primary hover:underline" />
              </p>
              <p className="text-sm">
                Nothing on this site is legal, tax or financial advice.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
