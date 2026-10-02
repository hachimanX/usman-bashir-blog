import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Wordmark from "@/components/Wordmark";
import { liveTools } from "@/lib/tools";

const NAV_LINKS = [
  { href: "/", label: "Home", testId: "link-nav-home" },
  { href: "/articles", label: "Articles", testId: "link-nav-articles" },
  { href: "/about", label: "About", testId: "link-nav-about" },
];

export default function Header() {
  const [location] = useLocation();
  // Pages are prerendered, and the server cannot know a visitor's saved theme,
  // so the first render always assumes the default (dark) and matches the
  // prerendered HTML. The inline script in index.html has already applied the
  // real theme to <html> before paint; this only syncs the toggle icon to it.
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number>();

  const tools = liveTools();

  // Close the mobile menu on navigation, otherwise it stays open over the new page.
  useEffect(() => {
    setMenuOpen(false);
    setToolsOpen(false);
  }, [location]);

  // Escape closes the tools dropdown, and a click outside dismisses it. Hover
  // alone is not enough — keyboard and touch users need a way out.
  useEffect(() => {
    if (!toolsOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setToolsOpen(false);
    const onClick = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) setToolsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [toolsOpen]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    document.documentElement.style.colorScheme = newTheme;
  };

  // Sub-pages keep their section highlighted — /tools/trademark-precheck should
  // light up "Tools", not nothing.
  const isActive = (path: string) =>
    path === "/" ? location === "/" : location === path || location.startsWith(path + "/");

  const linkClass = (path: string) =>
    `text-sm font-medium transition-colors hover:text-foreground/80 ${
      isActive(path) ? "text-foreground" : "text-muted-foreground"
    }`;

  // A short close delay stops the menu vanishing while the pointer crosses the
  // gap between the trigger and the panel.
  const openTools = () => {
    window.clearTimeout(closeTimer.current);
    setToolsOpen(true);
  };
  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setToolsOpen(false), 150);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            data-testid="link-home"
            aria-label="Usman Bashir, home"
            className="inline-flex min-h-11 items-center"
          >
            <Wordmark />
          </Link>

          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-6 sm:flex" aria-label="Main">
              {NAV_LINKS.slice(0, 2).map((link) => (
                <Link key={link.href} href={link.href} data-testid={link.testId}>
                  <span
                    className={linkClass(link.href)}
                    aria-current={isActive(link.href) ? "page" : undefined}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}

              {/* Tools + dropdown */}
              <div
                ref={toolsRef}
                className="relative"
                onMouseEnter={openTools}
                onMouseLeave={scheduleClose}
              >
                <Link href="/tools" data-testid="link-nav-tools">
                  <span
                    className={`flex items-center gap-1 ${linkClass("/tools")}`}
                    aria-current={isActive("/tools") ? "page" : undefined}
                    aria-expanded={toolsOpen}
                    aria-haspopup="true"
                    onFocus={openTools}
                  >
                    Tools
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${toolsOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </span>
                </Link>

                {toolsOpen && tools.length > 0 && (
                  <div className="absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3">
                    <div className="overflow-hidden rounded-lg border bg-background shadow-lg">
                      <ul className="p-2">
                        {tools.map((tool) => (
                          <li key={tool.slug}>
                            <Link href={`/tools/${tool.slug}`}>
                              <span className="block rounded-md px-3 py-2 hover:bg-muted">
                                <span className="block text-sm font-semibold">{tool.name}</span>
                                <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                                  {tool.blurb}
                                </span>
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link href="/tools">
                        <span className="block border-t px-5 py-2.5 text-xs font-semibold text-primary hover:bg-muted">
                          All free tools →
                        </span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {NAV_LINKS.slice(2).map((link) => (
                <Link key={link.href} href={link.href} data-testid={link.testId}>
                  <span
                    className={linkClass(link.href)}
                    aria-current={isActive(link.href) ? "page" : undefined}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>

            <Button
              size="icon"
              variant="ghost"
              onClick={toggleTheme}
              aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
              data-testid="button-theme-toggle"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="sm:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              data-testid="button-mobile-menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {menuOpen && (
          <nav
            id="mobile-nav"
            aria-label="Main"
            className="flex flex-col gap-1 border-t py-2 sm:hidden"
          >
            {/* py-3 keeps each row at the 44px minimum touch target. */}
            {NAV_LINKS.slice(0, 2).map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`flex min-h-11 items-center py-3 ${linkClass(link.href)}`}
                  aria-current={isActive(link.href) ? "page" : undefined}
                >
                  {link.label}
                </span>
              </Link>
            ))}

            {/* No hover on touch, so the tools are simply listed inline. */}
            <Link href="/tools">
              <span
                className={`flex min-h-11 items-center py-3 ${linkClass("/tools")}`}
                aria-current={isActive("/tools") ? "page" : undefined}
              >
                Tools
              </span>
            </Link>
            {tools.map((tool) => (
              <Link key={tool.slug} href={`/tools/${tool.slug}`}>
                <span className="flex min-h-11 items-center py-3 pl-4 text-sm text-muted-foreground hover:text-foreground">
                  {tool.name}
                </span>
              </Link>
            ))}

            {NAV_LINKS.slice(2).map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`flex min-h-11 items-center py-3 ${linkClass(link.href)}`}
                  aria-current={isActive(link.href) ? "page" : undefined}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
