import Header from "@/components/Header";
import Seo from "@/components/Seo";
import Footer from "@/components/Footer";
import ContactEmail from "@/components/ContactEmail";
import { CONTACT_LINE, findLegalDoc, type LegalDoc } from "@shared/legal";
import NotFound from "@/pages/not-found";

/** Terms, privacy and affiliate pages. Copy lives in shared/legal.ts. */
export default function Legal({ slug }: { slug: LegalDoc["slug"] }) {
  const doc = findLegalDoc(slug);
  if (!doc) return <NotFound />;

  return (
    <div className="flex min-h-screen flex-col">
      <Seo title={`${doc.title} | Usman Bashir`} description={doc.description} path={`/${doc.slug}`} />
      <Header />
      <main id="main" className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <h1 className="text-4xl font-semibold leading-[1.1] sm:text-5xl">{doc.title}</h1>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
            Last updated {doc.updated}
          </p>
          <div className="mt-10 space-y-10">
            {doc.sections.map((section, i) => (
              <section key={i} className="space-y-4">
                {section.heading && <h2 className="text-2xl font-semibold">{section.heading}</h2>}
                {section.paragraphs.map((p, j) =>
                  p === CONTACT_LINE ? (
                    <p key={j} className="leading-relaxed">
                      <span className="text-muted-foreground">Email: </span>
                      <ContactEmail className="font-mono text-primary" />
                    </p>
                  ) : (
                    <p key={j} className="leading-relaxed text-muted-foreground">
                      {p}
                    </p>
                  ),
                )}
              </section>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
