import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Link as LinkIcon, Calendar, Twitter, Linkedin, Github, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";

const highlights = [
  {
    label: "Location",
    value: "Hong Kong",
  },
  {
    label: "Website",
    value: "detailed.com",
    link: "https://bobcatdigital.co",
  },
  {
    label: "Joined",
    value: "January 2008",
  },
  {
    label: "Posts",
    value: "625",
  },
  {
    label: "Following",
    value: "41.3K",
  },
  {
    label: "Followers",
    value: "40.7K",
  },
];

export default function About() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="mx-auto max-w-3xl">
          <div className="relative">
            <div className="h-48 w-full bg-gradient-to-r from-primary/20 to-primary/40">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=400&fit=crop"
                alt="Cover"
                className="h-full w-full object-cover"
              />
            </div>
            
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="-mt-16 mb-4">
                <div className="h-32 w-32 rounded-full border-4 border-background bg-muted overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
                    alt="Usman Bashir"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="mb-6">
                <h1 className="text-3xl font-bold" data-testid="text-name">Usman Bashir</h1>
                <p className="text-muted-foreground">@usmanbashir</p>
              </div>

              <div className="mb-6">
                <p className="text-base leading-relaxed">
                  Created <a href="https://bobcatdigital.co" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">bobcatdigital.co</a> (500K+ weekly users 📈). Now proudly working at Bobcat Digital. 
                  Somehow mentioned on TechCrunch, Forbes, FT, BBC etc.
                </p>
              </div>

              <div className="mb-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>Hong Kong</span>
                </div>
                <div className="flex items-center gap-1">
                  <LinkIcon className="h-4 w-4" />
                  <a href="https://bobcatdigital.co" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    bobcatdigital.co
                  </a>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined January 2008</span>
                </div>
              </div>

              <div className="mb-6 flex gap-4 text-sm">
                <div>
                  <span className="font-bold">625</span>{" "}
                  <span className="text-muted-foreground">Following</span>
                </div>
                <div>
                  <span className="font-bold">41.3K</span>{" "}
                  <span className="text-muted-foreground">Followers</span>
                </div>
              </div>

              <div className="mb-6">
                <p className="mb-2 text-sm text-muted-foreground">
                  Followed by Jake Ward, SEO Bear, and 120 others you follow
                </p>
              </div>

              <div className="mb-8 flex gap-4">
                <a
                  href="https://x.com/imusmanbashir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="https://linkedin.com/in/usmanbashir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-linkedin"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://github.com/usmanbashir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-github"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="mailto:contact@usmanbashir.net"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-email"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>

              <div className="border-t pt-8 pb-16">
                <h2 className="mb-6 text-2xl font-bold">Highlights</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="p-6">
                    <h3 className="mb-2 text-lg font-semibold">🎯 Experience</h3>
                    <p className="text-sm text-muted-foreground">
                      Over a decade of hands-on experience in SEO and digital marketing, consulting for companies ranging from startups to enterprise brands.
                    </p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="mb-2 text-lg font-semibold">📊 Track Record</h3>
                    <p className="text-sm text-muted-foreground">
                      Helped businesses achieve measurable growth in rankings, organic traffic, and conversions through data-driven strategies.
                    </p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="mb-2 text-lg font-semibold">✍️ Published Work</h3>
                    <p className="text-sm text-muted-foreground">
                      Hundreds of in-depth articles and case studies read by thousands of SEO professionals worldwide.
                    </p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="mb-2 text-lg font-semibold">🚀 Focus Areas</h3>
                    <p className="text-sm text-muted-foreground">
                      Technical SEO, content strategy, link building, algorithm analysis, and scaling organic growth.
                    </p>
                  </Card>
                </div>

                <div className="mt-12">
                  <h2 className="mb-4 text-2xl font-bold">About This Site</h2>
                  <p className="mb-4 text-muted-foreground leading-relaxed">
                    This is my personal site where I share what I've learned along the way—in-depth strategies, case studies, and practical insights you can apply to your own projects.
                  </p>
                  <p className="mb-4 text-muted-foreground leading-relaxed">
                    I focus on creating content that goes beyond the basics, offering unique perspectives and actionable advice. The basics can be incredibly effective, but hundreds of sites cover them well. I want to focus on unique, creative strategies to achieve better results.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Here's my promise: <strong>I will put my absolute all into guides like this one to give original insights that help you get an edge over your competition</strong>.
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
