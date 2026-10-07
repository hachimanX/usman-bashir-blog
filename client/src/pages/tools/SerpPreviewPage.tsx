import { Link } from "wouter";
import Header from "@/components/Header";
import Seo, { SITE_ORIGIN } from "@/components/Seo";
import Footer from "@/components/Footer";
import SerpPreview from "@/components/tools/SerpPreview";
import { findTool } from "@/lib/tools";
import { AUTHOR_REF } from "@shared/person";

const tool = findTool("serp-preview")!;

export default function SerpPreviewPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Seo
        title={`${tool.name} — Pixel-Accurate Google Preview`}
        description={tool.description}
        path={`/tools/${tool.slug}`}
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: tool.name,
          url: `${SITE_ORIGIN}/tools/${tool.slug}`,
          applicationCategory: "SEOApplication",
          operatingSystem: "Any",
          description: tool.description,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          author: AUTHOR_REF,
        }}
      />
      <Header />
      <main id="main" className="flex-1">
        <section className="border-b py-10 sm:py-14">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/tools"
              className="inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-foreground"
            >
              ← All tools
            </Link>
            <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">{tool.name}</h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Google hasn&apos;t judged title tags by character count in over a decade. It truncates by
              actual Arial pixel width. Enter your title, target query, and meta description to test
              truncation, keyword bolding, and rich snippets in real time.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Free, 100% in-browser, no accounts. Export clean PNG screenshots or copy a shareable link
              for client sign-off.
            </p>
          </div>
        </section>

        <section className="py-10 sm:py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <SerpPreview />
          </div>
        </section>

        <section className="border-t bg-muted/30 py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold">How Google Truncation Actually Works</h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Desktop search results allocate roughly <strong className="text-foreground">600 pixels</strong>{" "}
                for title tags before cutting off with an ellipsis (<code className="text-foreground font-mono">...</code>).
                On mobile devices, this drops to approximately <strong className="text-foreground">580 pixels</strong>.
              </p>
              <p>
                Because Arial is a proportionally spaced font, wide uppercase letters like <strong className="text-foreground">W</strong> and <strong className="text-foreground">M</strong> take up more than triple the horizontal space of narrow characters like <strong className="text-foreground">i</strong> or <strong className="text-foreground">l</strong>.
                Crucially, when searchers type a query that matches your title or description, Google <strong className="text-foreground">bolds</strong> those terms, which expands their pixel footprint by about 15% and accelerates truncation.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
