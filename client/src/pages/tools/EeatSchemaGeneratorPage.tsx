import { Link } from "wouter";
import Header from "@/components/Header";
import Seo, { SITE_ORIGIN } from "@/components/Seo";
import Footer from "@/components/Footer";
import EeatSchemaGenerator from "@/components/tools/EeatSchemaGenerator";
import { findTool } from "@/lib/tools";
import { AUTHOR_REF } from "@shared/person";

const tool = findTool("eeat-schema-generator")!;

export default function EeatSchemaGeneratorPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Seo
        title={`${tool.name} — Author & Entity JSON-LD`}
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
              Google uses Schema.org structured data to link content bylines to real entities in its
              Knowledge Graph. Generate interconnected Person, Organization, and Article JSON-LD with
              verified social proof and Wikipedia entity reconciliation.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Free, 100% in-browser, no accounts. Verified against Google Search Quality Rater E-E-A-T guidelines.
            </p>
          </div>
        </section>

        <section className="py-10 sm:py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <EeatSchemaGenerator />
          </div>
        </section>

        <section className="border-t bg-muted/30 py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold">Why Entity Architecture Matters for E-E-A-T</h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                When Google crawls an article, a plain author name like <span className="text-foreground font-medium">&quot;John Doe&quot;</span> is ambiguous.
                By assigning a persistent <code className="text-foreground font-mono">@id</code> (e.g. <code className="text-foreground font-mono">https://yoursite.com/#person</code>)
                and attaching <code className="text-foreground font-mono">sameAs</code> references to external authority sources like LinkedIn or Crunchbase,
                you allow Google&apos;s Knowledge Graph to unambiguously resolve the author&apos;s identity across the web.
              </p>
              <p>
                Furthermore, using <code className="text-foreground font-mono">knowsAbout</code> with standard Wikipedia/Wikidata entity URIs explicitly informs
                Google NLP of your primary topical domains, establishing domain authority without guessing.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
