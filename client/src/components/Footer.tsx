import { Link } from "wouter";
import Wordmark from "@/components/Wordmark";
import { LEGAL_DOCS } from "@shared/legal";
import { Linkedin } from "lucide-react";
import { SiX } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <Wordmark className="text-lg" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              SEO, marketing and things I build with AI. Occasional digressions into PC gaming and
              anime.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Quick Links</h3>
            {/* min-h-11 rows: these were 17-19px tall, well under the 44px
                minimum touch target. */}
            <ul className="mt-2">
              <li><Link href="/"><span className="flex min-h-11 items-center text-sm text-muted-foreground hover:text-foreground">Home</span></Link></li>
              <li><Link href="/articles"><span className="flex min-h-11 items-center text-sm text-muted-foreground hover:text-foreground">Articles</span></Link></li>
              <li><Link href="/tools"><span className="flex min-h-11 items-center text-sm text-muted-foreground hover:text-foreground">Free Tools</span></Link></li>
              <li><Link href="/about"><span className="flex min-h-11 items-center text-sm text-muted-foreground hover:text-foreground">About</span></Link></li>
              <li>
                <a href="https://bobcatdigital.co" target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center text-sm text-muted-foreground hover:text-foreground">
                  Bobcat Digital
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Connect</h3>
            {/* -ml-2.5 pulls the enlarged hit areas back so the icons stay
                optically aligned with the heading above them. */}
            <div className="mt-2 -ml-2.5 flex gap-1">
              <a href="https://x.com/imusmanbashir" target="_blank" rel="noopener noreferrer" className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground hover:text-foreground" aria-label="X">
                <SiX className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href="https://linkedin.com/in/usmanbashir" target="_blank" rel="noopener noreferrer" className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground hover:text-foreground" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
            {/* Was a plain mailto to usman@bobcatdesigners.com — a different
                domain from the one in use, and harvestable straight out of the
                server-rendered HTML. Contact now lives on /about behind the
                ContactEmail component. */}
            <p className="mt-2 text-sm">
              <Link href="/about">
                <span className="text-muted-foreground hover:text-foreground">Contact →</span>
              </Link>
            </p>
          </div>
        </div>

        {/* Legal bar: copyright on one side, the policy pages on the other,
            pipe-separated. The affiliate disclosure that used to sit here as a
            paragraph now has its own page, linked from this bar on every page. */}
        <div className="mt-8 flex flex-col gap-2 border-t pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Usman Bashir. All rights reserved.</p>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap items-center">
              {LEGAL_DOCS.map((doc, i) => (
                <li key={doc.slug} className="flex items-center">
                  {i > 0 && (
                    <span aria-hidden="true" className="px-3 text-muted-foreground/50">
                      |
                    </span>
                  )}
                  <Link href={`/${doc.slug}`}>
                    <span className="inline-flex min-h-11 items-center hover:text-foreground">
                      {doc.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Signature wordmark, decorative only (the name is already in the footer
          as text). SVG rather than CSS text so textLength stretches the name to
          exactly the content width at every screen size, and the whole word sits
          inside the box with room below instead of being cropped. The fill is a
          pattern of thin lines so it reads as texture, not a slab of bold type. */}
      <div
        aria-hidden="true"
        className="pointer-events-none mx-auto max-w-7xl select-none px-4 pb-10 sm:px-6 lg:px-8"
      >
        <svg viewBox="0 0 1000 150" className="block h-auto w-full text-foreground/80">
          <defs>
            <pattern id="footer-wordmark-lines" width="8" height="5" patternUnits="userSpaceOnUse">
              <rect width="8" height="2.2" fill="currentColor" />
            </pattern>
            <linearGradient id="footer-wordmark-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="white" stopOpacity="1" />
              <stop offset="1" stopColor="white" stopOpacity="0.3" />
            </linearGradient>
            <mask id="footer-wordmark-mask">
              <rect width="1000" height="150" fill="url(#footer-wordmark-fade)" />
            </mask>
          </defs>
          <text
            x="500"
            y="138"
            textAnchor="middle"
            textLength="996"
            lengthAdjust="spacingAndGlyphs"
            fontSize="180"
            fontWeight="700"
            fill="url(#footer-wordmark-lines)"
            stroke="currentColor"
            strokeOpacity="0.35"
            strokeWidth="1.2"
            mask="url(#footer-wordmark-mask)"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Usman Bashir
          </text>
        </svg>
      </div>
    </footer>
  );
}
