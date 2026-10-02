import { Link } from "wouter";
import Header from "@/components/Header";
import Seo from "@/components/Seo";
import Footer from "@/components/Footer";
import { TOOLS } from "@/lib/tools";

export default function Tools() {
  return (
    <div className="flex min-h-screen flex-col">
      <Seo
        title="Free Tools — Usman Bashir"
        description="Free, no-signup tools for people running small online businesses. No accounts, no email walls, nothing stored."
        path="/tools"
      />
      <Header />
      <main id="main" className="flex-1">
        <section className="border-b py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Free Tools</h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Small tools I built because I needed them. No signup, no email wall, nothing stored
              on a server. They run in your browser and they stay free.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {TOOLS.map((tool) =>
                tool.status === "live" ? (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="group block rounded-2xl border bg-card p-6 transition-colors hover:border-primary"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {tool.pillar}
                    </p>
                    <h2 className="mt-2 text-lg font-bold leading-tight group-hover:text-primary">
                      {tool.name}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {tool.blurb}
                    </p>
                  </Link>
                ) : (
                  <div
                    key={tool.slug}
                    className="rounded-2xl border border-dashed p-6 opacity-70"
                    aria-label={`${tool.name} — coming soon`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {tool.pillar} · Coming soon
                    </p>
                    <h2 className="mt-2 text-lg font-bold leading-tight">{tool.name}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {tool.blurb}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
