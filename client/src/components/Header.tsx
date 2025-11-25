import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const [location] = useLocation();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const isActive = (path: string) => location === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" data-testid="link-home">
            <span className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'Allura, cursive' }}>Bashir</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link href="/" data-testid="link-nav-home">
              <span className={`text-sm font-medium transition-colors hover:text-foreground/80 ${isActive("/") ? "text-foreground" : "text-muted-foreground"}`}>
                Home
              </span>
            </Link>
            <Link href="/articles" data-testid="link-nav-articles">
              <span className={`text-sm font-medium transition-colors hover:text-foreground/80 ${isActive("/articles") ? "text-foreground" : "text-muted-foreground"}`}>
                Articles
              </span>
            </Link>
            <Link href="/about" data-testid="link-nav-about">
              <span className={`text-sm font-medium transition-colors hover:text-foreground/80 ${isActive("/about") ? "text-foreground" : "text-muted-foreground"}`}>
                About
              </span>
            </Link>
            <a 
              href="https://bobcatdigital.co" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground/80"
              data-testid="link-nav-agency"
            >
              Bobcat Digital
            </a>
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
