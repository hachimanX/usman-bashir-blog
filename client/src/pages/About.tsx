import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link as LinkIcon, Calendar, Twitter, Linkedin, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function About() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl">
          <div className="relative">
            {/* Cover */}
            <div className="h-48 w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=400&fit=crop"
                alt="Cover"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="px-4 sm:px-6 lg:px-8">
              {/* Avatar */}
              <div className="-mt-16 mb-4">
                <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-background bg-muted">
                  <img
                    src="https://pbs.twimg.com/profile_images/1613256366423941128/G786p5tq_400x400.jpg"
                    alt="Usman Bashir"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Name */}
              <div className="mb-4">
                <h1 className="text-3xl font-bold">Usman Bashir</h1>
                <p className="text-muted-foreground">@imusmanbashir</p>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <p className="text-base leading-relaxed">
                  SEO practitioner, digital marketer, and MBA graduate. I write about what I'm learning and testing — from search rankings to building businesses online. Founder of{" "}
                  <a href="https://bobcatdigital.co" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    Bobcat Digital LLC
                  </a>
                  . When I'm not working, I'm usually PC gaming or going through an anime backlog that never gets shorter.
                </p>
              </div>

              {/* Meta */}
              <div className="mb-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <LinkIcon className="h-4 w-4" />
                  <a href="https://bobcatdigital.co" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    bobcatdigital.co
                  </a>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>In the field since 2020</span>
                </div>
              </div>

              {/* Social */}
              <div className="mb-8 flex gap-4">
                <a href="https://x.com/imusmanbashir" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors"><Twitter className="h-5 w-5" /></a>
                <a href="https://linkedin.com/in/usmanbashir" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors"><Linkedin className="h-5 w-5" /></a>
                <a href="mailto:usman@bobcatdesigners.com" className="text-muted-foreground hover:text-foreground transition-colors"><Mail className="h-5 w-5" /></a>
              </div>

              {/* Highlights */}
              <div className="border-t pt-8 pb-16">
                <h2 className="mb-6 text-2xl font-bold">Highlights</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="p-6">
                    <h3 className="mb-2 text-lg font-semibold">🎓 MBA Graduate</h3>
                    <p className="text-sm text-muted-foreground">
                      Master of Business Administration. My thesis focused on <em>Behavioral Intention to Adopt Fintech</em> — the intersection of finance, technology, and human behaviour.
                    </p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="mb-2 text-lg font-semibold">💼 Bobcat Digital</h3>
                    <p className="text-sm text-muted-foreground">
                      Founded Bobcat Digital LLC, a US-registered business providing SEO, content, and digital marketing services. Currently running alongside a day job.
                    </p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="mb-2 text-lg font-semibold">📈 SEO & Marketing</h3>
                    <p className="text-sm text-muted-foreground">
                      Working in SEO and content marketing since 2020. Helped clients improve organic visibility across WordPress, ecommerce, and service-based websites.
                    </p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="mb-2 text-lg font-semibold">🎮 Beyond Work</h3>
                    <p className="text-sm text-muted-foreground">
                      PC gamer and anime fan. Currently working through a backlog that grows faster than I can finish it. Vinland Saga and Berserk are permanent top-tier.
                    </p>
                  </Card>
                </div>

                <div className="mt-12">
                  <h2 className="mb-4 text-2xl font-bold">About This Site</h2>
                  <p className="mb-4 text-muted-foreground leading-relaxed">
                    This is where I document what I'm learning — SEO, digital marketing, business setup, and anything else I find worth writing about. It's a personal blog, not a media company.
                  </p>
                  <p className="mb-4 text-muted-foreground leading-relaxed">
                    I started it in 2026 as a place to write more consistently and share practical notes from real work. You'll find guides, tool reviews, and occasionally something about US LLC setup for non-US founders — since I've been through that process myself.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    No inflated claims, no fake authority. Just useful content written by someone who's still figuring it out — and writing about it along the way.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
