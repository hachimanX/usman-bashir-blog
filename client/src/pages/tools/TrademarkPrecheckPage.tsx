import { useEffect, useState } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Seo, { SITE_ORIGIN } from "@/components/Seo";
import Footer from "@/components/Footer";
import TrademarkPrecheck from "@/components/tools/TrademarkPrecheck";
import { findTool } from "@/lib/tools";
import { AUTHOR_REF } from "@shared/person";

const tool = findTool("trademark-precheck")!;

/**
 * Articles this tool belongs next to. Rendered only once the matching post is
 * actually published — linking to an unpublished slug ships a 404 that Google
 * finds by crawling this page, which is worse than showing nothing.
 */
const RELATED = [
  {
    slug: "best-llc-formation-services",
    title: "The best LLC formation services, compared",
    note: "a state approving your company name is not the same as nobody owning it.",
  },
  {
    slug: "how-to-start-print-on-demand-business",
    title: "How to start a print-on-demand business",
    note: "the trademark section is the one that closes shops.",
  },
];

export default function TrademarkPrecheckPage() {
  const [publishedSlugs, setPublishedSlugs] = useState<string[] | null>(null);

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((posts: { slug: string }[]) =>
        setPublishedSlugs(Array.isArray(posts) ? posts.map((p) => p.slug) : []),
      )
      .catch(() => setPublishedSlugs([]));
  }, []);

  const related = RELATED.filter((r) => publishedSlugs?.includes(r.slug));

  return <Page related={related} />;
}

function Page({ related }: { related: typeof RELATED }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Seo
        title={`${tool.name} — Free, No Signup`}
        description={tool.description}
        path={`/tools/${tool.slug}`}
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: tool.name,
          url: `${SITE_ORIGIN}/tools/${tool.slug}`,
          applicationCategory: "BusinessApplication",
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
              Before you commit to a name, a brand or a design, find out whether somebody already
              owns it. This searches the live US federal trademark register and shows the results
              below.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Free, no signup, nothing stored. It queries the USPTO’s own public search service
              directly from your browser.
            </p>
          </div>
        </section>

        <section className="py-10 sm:py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <TrademarkPrecheck />
          </div>
        </section>

        {related.length > 0 && (
          <section className="border-t bg-muted/30 py-12">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-xl font-bold">Where this fits</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                I built this while writing about two things that keep colliding with it: naming a
                company, and putting phrases on products you sell.
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/article/${r.slug}`} className="text-primary hover:underline">
                      {r.title}
                    </Link>{" "}
                    <span className="text-muted-foreground">— {r.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
