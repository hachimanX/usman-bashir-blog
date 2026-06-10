import { Link } from "wouter";
import { Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-2xl font-bold" style={{ fontFamily: "Allura, cursive" }}>Bashir</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Notes on SEO, digital marketing, and building things online — with occasional digressions into PC gaming and anime.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="/"><span className="text-sm text-muted-foreground hover:text-foreground">Home</span></Link></li>
              <li><Link href="/articles"><span className="text-sm text-muted-foreground hover:text-foreground">Articles</span></Link></li>
              <li><Link href="/about"><span className="text-sm text-muted-foreground hover:text-foreground">About</span></Link></li>
              <li>
                <a href="https://bobcatdigital.co" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground">
                  Bobcat Digital
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Connect</h3>
            <div className="mt-4 flex gap-4">
              <a href="https://x.com/imusmanbashir" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" title="Twitter / X">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/in/usmanbashir" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" title="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:usman@bobcatdesigners.com" className="text-muted-foreground hover:text-foreground" title="Email">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Usman Bashir. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
