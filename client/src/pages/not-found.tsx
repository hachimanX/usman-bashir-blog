import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";

/** Prerendered as 404.html; Cloudflare serves it with a real 404 status. */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Seo
        title="Page not found | Usman Bashir"
        description="That page does not exist or has moved."
        path="/404"
      />
      <Header />
      <main id="main" className="flex flex-1 items-center">
        <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-primary">404</p>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.1] sm:text-5xl">
            This page doesn't <span className="accent-word">exist</span>
          </h1>
          <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-muted-foreground">
            The link may be old, or the page may have moved.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/">
                Go to the homepage <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/articles">Read the articles</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
