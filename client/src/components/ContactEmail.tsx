import { useEffect, useState } from "react";

/**
 * Renders the contact address without ever putting it in the served HTML.
 *
 * Harvesters overwhelmingly scrape static markup and regex for `mailto:` or an
 * address pattern. The worker server-renders this page for crawlers, so a plain
 * `<a href="mailto:...">` would sit in the response body permanently. Assembling
 * it in an effect means the address only exists after JavaScript runs, which
 * defeats the cheap scrapers without hiding it from any real person.
 *
 * It is not encryption, and a determined scraper that executes JS will still get
 * it. The point is to not be the easiest address on the page.
 */
const USER = ["usman"];
const DOMAIN = ["bobcatdigital", "co"];

export default function ContactEmail({ className = "" }: { className?: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  // Plain text, no mailto. A `mailto:` href is the single easiest thing for a
  // harvester to find, and the (@) form means the visible string is not a valid
  // address either. A person reads it and types it; a scraper gets nothing.
  const display = `${USER.join("")}(@)${DOMAIN.join(".")}`;

  return <span className={className}>{ready ? display : "…"}</span>;
}
