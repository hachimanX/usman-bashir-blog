import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Copy,
  Check,
  ExternalLink,
  Plus,
  Trash2,
  ShieldCheck,
  UserCheck,
  BookOpen,
  Sparkles,
  Info,
  RotateCcw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Popular knowledge graph topics with Wikipedia sameAs links
const SUGGESTED_TOPICS = [
  { name: "Search engine optimization", wiki: "https://en.wikipedia.org/wiki/Search_engine_optimization" },
  { name: "Content marketing", wiki: "https://en.wikipedia.org/wiki/Content_marketing" },
  { name: "Artificial intelligence", wiki: "https://en.wikipedia.org/wiki/Artificial_intelligence" },
  { name: "Digital marketing", wiki: "https://en.wikipedia.org/wiki/Digital_marketing" },
  { name: "E-commerce", wiki: "https://en.wikipedia.org/wiki/E-commerce" },
  { name: "Software as a service", wiki: "https://en.wikipedia.org/wiki/Software_as_a_service" },
  { name: "Personal finance", wiki: "https://en.wikipedia.org/wiki/Personal_finance" },
];

export type ArticleEntry = {
  id: string;
  headline: string;
  url: string;
  datePublished: string;
  dateModified: string;
  description: string;
};

export default function EeatSchemaGenerator() {
  const { toast } = useToast();

  // Author details - EMPTY by default (NO personal details)
  const [name, setName] = useState("");
  const [alternateName, setAlternateName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [bioUrl, setBioUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Affiliations - EMPTY by default
  const [companyName, setCompanyName] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [hasOwnedOrg, setHasOwnedOrg] = useState(false);
  const [ownedOrgName, setOwnedOrgName] = useState("");
  const [ownedOrgUrl, setOwnedOrgUrl] = useState("");

  // sameAs authority links - EMPTY by default
  const [sameAsLinks, setSameAsLinks] = useState<string[]>([]);
  const [newSameAs, setNewSameAs] = useState("");

  // knowsAbout topics - EMPTY by default
  const [topics, setTopics] = useState<{ name: string; wiki?: string }[]>([]);
  const [customTopicName, setCustomTopicName] = useState("");
  const [customTopicWiki, setCustomTopicWiki] = useState("");

  // Multiple Articles Schema
  const [articles, setArticles] = useState<ArticleEntry[]>([]);

  const [copied, setCopied] = useState(false);

  // Handlers for sameAs
  const handleAddSameAs = () => {
    if (!newSameAs.trim()) return;
    setSameAsLinks([...sameAsLinks, newSameAs.trim()]);
    setNewSameAs("");
  };

  const handleRemoveSameAs = (idx: number) => {
    setSameAsLinks(sameAsLinks.filter((_, i) => i !== idx));
  };

  // Handlers for topics
  const handleAddSuggestedTopic = (topic: { name: string; wiki: string }) => {
    if (topics.some((t) => t.name.toLowerCase() === topic.name.toLowerCase())) return;
    setTopics([...topics, topic]);
  };

  const handleAddCustomTopic = () => {
    if (!customTopicName.trim()) return;
    setTopics([...topics, { name: customTopicName.trim(), wiki: customTopicWiki.trim() || undefined }]);
    setCustomTopicName("");
    setCustomTopicWiki("");
  };

  const handleRemoveTopic = (idx: number) => {
    setTopics(topics.filter((_, i) => i !== idx));
  };

  // Handlers for Articles
  const handleAddArticle = () => {
    const newEntry: ArticleEntry = {
      id: Math.random().toString(36).slice(2, 9),
      headline: "",
      url: "",
      datePublished: new Date().toISOString().slice(0, 10),
      dateModified: new Date().toISOString().slice(0, 10),
      description: "",
    };
    setArticles([...articles, newEntry]);
  };

  const handleUpdateArticle = (id: string, field: keyof ArticleEntry, value: string) => {
    setArticles(
      articles.map((art) => (art.id === id ? { ...art, [field]: value } : art)),
    );
  };

  const handleRemoveArticle = (id: string) => {
    setArticles(articles.filter((art) => art.id !== id));
  };

  // Generate valid JSON-LD graph
  const jsonLdGraph = useMemo(() => {
    const rawOrigin = siteUrl.trim() || "https://example.com";
    const cleanOrigin = rawOrigin.replace(/\/+$/, "");
    const personId = `${cleanOrigin}/#person`;

    const topicEntities = topics.map((t) => {
      const entity: Record<string, any> = {
        "@type": "Thing",
        name: t.name,
      };
      if (t.wiki) entity.sameAs = t.wiki;
      return entity;
    });

    const personEntity: Record<string, any> = {
      "@type": "Person",
      "@id": personId,
      name: name.trim() || "Author Name",
      url: bioUrl.trim() || cleanOrigin,
    };

    if (alternateName.trim()) {
      personEntity.alternateName = [alternateName.trim()];
    }

    if (jobTitle.trim()) {
      personEntity.jobTitle = jobTitle.trim();
    }

    if (imageUrl.trim()) {
      personEntity.image = imageUrl.trim();
    }

    if (companyName.trim()) {
      personEntity.worksFor = {
        "@type": "Organization",
        name: companyName.trim(),
        ...(companyUrl.trim() ? { url: companyUrl.trim() } : {}),
      };
    }

    if (hasOwnedOrg && ownedOrgName.trim()) {
      personEntity.owns = {
        "@type": "Organization",
        name: ownedOrgName.trim(),
        ...(ownedOrgUrl.trim() ? { url: ownedOrgUrl.trim() } : {}),
      };
    }

    if (topicEntities.length > 0) {
      personEntity.knowsAbout = topicEntities;
    }

    const validSameAs = sameAsLinks.filter((s) => s.trim().length > 0);
    if (validSameAs.length > 0) {
      personEntity.sameAs = validSameAs;
    }

    // If no articles added, return Person entity
    if (articles.length === 0) {
      return {
        "@context": "https://schema.org",
        ...personEntity,
      };
    }

    // Build Article entities connected to this person
    const articleEntities = articles.map((art) => {
      const artUrl = art.url.trim() || `${cleanOrigin}/article`;
      const entity: Record<string, any> = {
        "@type": "BlogPosting",
        "@id": `${artUrl}#article`,
        headline: art.headline.trim() || "Article Headline",
        url: artUrl,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": artUrl,
        },
        author: {
          "@type": "Person",
          "@id": personId,
          name: name.trim() || "Author Name",
          url: bioUrl.trim() || cleanOrigin,
        },
      };

      if (art.description.trim()) {
        entity.description = art.description.trim();
      }
      if (art.datePublished.trim()) {
        entity.datePublished = art.datePublished.trim();
      }
      if (art.dateModified.trim()) {
        entity.dateModified = art.dateModified.trim();
      }
      if (companyName.trim()) {
        entity.publisher = {
          "@type": "Organization",
          name: companyName.trim(),
          ...(companyUrl.trim() ? { url: companyUrl.trim() } : {}),
        };
      }

      return entity;
    });

    return {
      "@context": "https://schema.org",
      "@graph": [personEntity, ...articleEntities],
    };
  }, [
    name,
    alternateName,
    jobTitle,
    siteUrl,
    bioUrl,
    imageUrl,
    companyName,
    companyUrl,
    hasOwnedOrg,
    ownedOrgName,
    ownedOrgUrl,
    sameAsLinks,
    topics,
    articles,
  ]);

  const jsonString = useMemo(() => JSON.stringify(jsonLdGraph, null, 2), [jsonLdGraph]);
  const scriptTagString = `<script type="application/ld+json">\n${jsonString}\n</script>`;

  // E-E-A-T Quality Score calculation
  const checklist = useMemo(() => {
    return [
      { label: "Unique @id Entity Anchor", passed: Boolean(siteUrl.trim()), tip: "Assigns persistent Knowledge Graph identity." },
      { label: "Authoritative sameAs Profiles", passed: sameAsLinks.length >= 2, tip: "At least 2 profiles (LinkedIn, X, etc.) verifying personhood." },
      { label: "Wikidata/Wikipedia Entity Topics", passed: topics.some((t) => Boolean(t.wiki)), tip: "Connects author expertise directly to recognized concepts." },
      { label: "Employer or Publisher Affiliation", passed: Boolean(companyName.trim()), tip: "Signals legitimate organization ties and accountability." },
      { label: "Linked Articles Connected", passed: articles.length > 0, tip: "Bylines connect to Person entity via @id." },
    ];
  }, [siteUrl, sameAsLinks, topics, companyName, articles]);

  const passedCount = checklist.filter((c) => c.passed).length;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(scriptTagString);
    setCopied(true);
    toast({
      title: "Schema JSON-LD copied",
      description: "Ready to paste into your site's <head> or CMS template.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenGoogleTester = () => {
    window.open("https://search.google.com/test/rich-results", "_blank", "noopener,noreferrer");
  };

  const handleClearAll = () => {
    setName("");
    setAlternateName("");
    setJobTitle("");
    setSiteUrl("");
    setBioUrl("");
    setImageUrl("");
    setCompanyName("");
    setCompanyUrl("");
    setHasOwnedOrg(false);
    setOwnedOrgName("");
    setOwnedOrgUrl("");
    setSameAsLinks([]);
    setTopics([]);
    setArticles([]);
  };

  const handleLoadGenericSample = () => {
    setName("Sarah Jenkins");
    setAlternateName("Sarah J. Jenkins");
    setJobTitle("Head of Content Strategy");
    setSiteUrl("https://example.com");
    setBioUrl("https://example.com/about/sarah");
    setImageUrl("https://example.com/images/sarah.jpg");
    setCompanyName("Acme Media Corp");
    setCompanyUrl("https://example.com");
    setHasOwnedOrg(false);
    setOwnedOrgName("");
    setOwnedOrgUrl("");
    setSameAsLinks(["https://linkedin.com/in/example-author", "https://x.com/example_author"]);
    setTopics([
      { name: "Search engine optimization", wiki: "https://en.wikipedia.org/wiki/Search_engine_optimization" },
      { name: "Content marketing", wiki: "https://en.wikipedia.org/wiki/Content_marketing" },
    ]);
    setArticles([
      {
        id: "art-1",
        headline: "How Search Intent Reshaped Modern SEO",
        url: "https://example.com/blog/search-intent-seo",
        datePublished: "2026-09-15",
        dateModified: "2026-10-01",
        description: "A comprehensive breakdown of how search algorithms identify and satisfy search intent.",
      },
      {
        id: "art-2",
        headline: "10 Editorial Rules for High-Ranking Articles",
        url: "https://example.com/blog/editorial-seo-rules",
        datePublished: "2026-09-28",
        dateModified: "2026-10-05",
        description: "Actionable frameworks for researching and writing authoritative content.",
      },
    ]);
  };

  return (
    <div className="space-y-8">
      {/* Top Status & Score Card */}
      <Card className="p-6 rounded-2xl border bg-card/60 backdrop-blur-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">E-E-A-T Schema Signals</h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Evaluates structured data completeness against Google Search Quality Rater Guidelines.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={passedCount === 5 ? "default" : passedCount >= 3 ? "secondary" : "outline"}
              className="text-sm px-3 py-1 font-mono"
            >
              Score: {passedCount} / 5 passed
            </Badge>
            <Button variant="outline" size="sm" onClick={handleLoadGenericSample} className="rounded-full text-xs">
              Load Sample Data
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClearAll} className="rounded-full text-xs gap-1">
              <RotateCcw className="h-3 w-3" /> Clear All
            </Button>
          </div>
        </div>

        {/* Checklist grid */}
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {checklist.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 rounded-xl border p-2.5 bg-background/50 text-xs">
              <div className={`mt-0.5 rounded-full p-0.5 ${item.passed ? "text-green-500" : "text-muted-foreground"}`}>
                <Check className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className={`font-semibold ${item.passed ? "text-foreground" : "text-muted-foreground"}`}>
                  {item.label}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{item.tip}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Editor Form Tabs */}
      <div className="rounded-2xl border bg-card p-6">
        <Tabs defaultValue="author" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 rounded-xl">
            <TabsTrigger value="author" className="gap-2 text-xs sm:text-sm">
              <UserCheck className="h-4 w-4" /> 1. Author & Entity
            </TabsTrigger>
            <TabsTrigger value="expertise" className="gap-2 text-xs sm:text-sm">
              <Sparkles className="h-4 w-4" /> 2. Authority & Topics
            </TabsTrigger>
            <TabsTrigger value="article" className="gap-2 text-xs sm:text-sm">
              <BookOpen className="h-4 w-4" /> 3. Articles ({articles.length})
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Author Details */}
          <TabsContent value="author" className="space-y-5 pt-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="author-name">Author Name *</Label>
                <Input
                  id="author-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author-alt-name">Legal / Alternate Name (Optional)</Label>
                <Input
                  id="author-alt-name"
                  value={alternateName}
                  onChange={(e) => setAlternateName(e.target.value)}
                  placeholder="e.g. Sarah Jane Jenkins"
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="author-title">Job Title / Role</Label>
                <Input
                  id="author-title"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Head of Search Marketing"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author-image">Headshot Image URL</Label>
                <Input
                  id="author-image"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/images/author.jpg"
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="site-url">Main Website URL (Sets the @id anchor) *</Label>
                <Input
                  id="site-url"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio-url">Author Bio / Profile Page URL</Label>
                <Input
                  id="bio-url"
                  value={bioUrl}
                  onChange={(e) => setBioUrl(e.target.value)}
                  placeholder="https://example.com/author/sarah"
                  className="rounded-xl"
                />
              </div>
            </div>

            {/* Organizations */}
            <div className="border-t pt-4 space-y-4">
              <h4 className="text-sm font-semibold">Organization Affiliation (worksFor)</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Company Name</Label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Media Corp"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Company Website</Label>
                  <Input
                    value={companyUrl}
                    onChange={(e) => setCompanyUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="rounded-xl"
                  />
                </div>
              </div>

              {/* Owned Organization Toggle */}
              <div className="flex items-center justify-between rounded-xl border p-3 mt-2">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Add Owned Company / Agency (owns)</Label>
                  <p className="text-xs text-muted-foreground">For agency owners or founders</p>
                </div>
                <Switch checked={hasOwnedOrg} onCheckedChange={setHasOwnedOrg} />
              </div>

              {hasOwnedOrg && (
                <div className="grid gap-4 sm:grid-cols-2 pt-1">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Owned Company Name</Label>
                    <Input
                      value={ownedOrgName}
                      onChange={(e) => setOwnedOrgName(e.target.value)}
                      placeholder="e.g. Jenkins Digital LLC"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Owned Company Website</Label>
                    <Input
                      value={ownedOrgUrl}
                      onChange={(e) => setOwnedOrgUrl(e.target.value)}
                      placeholder="https://jenkinsdigital.com"
                      className="rounded-xl"
                    />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* TAB 2: sameAs and knowsAbout */}
          <TabsContent value="expertise" className="space-y-6 pt-2">
            {/* sameAs links */}
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold">Authoritative Profiles (sameAs)</h4>
                <p className="text-xs text-muted-foreground">
                  Link external profiles that prove the author is a real, reputable person.
                </p>
              </div>

              <div className="space-y-2">
                {sameAsLinks.length === 0 ? (
                  <p className="text-xs italic text-muted-foreground">No authority profiles added yet.</p>
                ) : (
                  sameAsLinks.map((link, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input value={link} readOnly className="rounded-xl text-xs font-mono bg-muted/30" />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveSameAs(idx)}
                        className="text-muted-foreground hover:text-red-500 shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}

                <div className="flex items-center gap-2 pt-1">
                  <Input
                    value={newSameAs}
                    onChange={(e) => setNewSameAs(e.target.value)}
                    placeholder="https://linkedin.com/in/username or https://x.com/handle"
                    className="rounded-xl text-xs"
                    onKeyDown={(e) => e.key === "Enter" && handleAddSameAs()}
                  />
                  <Button variant="outline" size="sm" onClick={handleAddSameAs} className="rounded-full gap-1 shrink-0">
                    <Plus className="h-3.5 w-3.5" /> Add Profile
                  </Button>
                </div>
              </div>
            </div>

            {/* knowsAbout Knowledge Graph */}
            <div className="border-t pt-5 space-y-4">
              <div>
                <h4 className="text-sm font-semibold">Topics of Expertise (knowsAbout)</h4>
                <p className="text-xs text-muted-foreground">
                  Connect author expertise directly to Wikipedia entities so Google NLP recognizes your topical authority.
                </p>
              </div>

              {/* Active topics */}
              {topics.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {topics.map((t, idx) => (
                    <Badge key={idx} variant="secondary" className="gap-1.5 py-1 px-2.5 rounded-lg text-xs">
                      <span>{t.name}</span>
                      {t.wiki && <ExternalLink className="h-2.5 w-2.5 text-primary opacity-70" />}
                      <button
                        onClick={() => handleRemoveTopic(idx)}
                        className="ml-1 text-muted-foreground hover:text-red-500 cursor-pointer"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Suggested Topics Clickable Pills */}
              <div className="space-y-1.5">
                <span className="text-xs text-muted-foreground font-medium">Quick Add Verified Topics:</span>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_TOPICS.map((suggested, idx) => {
                    const isAdded = topics.some((t) => t.name.toLowerCase() === suggested.name.toLowerCase());
                    return (
                      <button
                        key={idx}
                        disabled={isAdded}
                        onClick={() => handleAddSuggestedTopic(suggested)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                          isAdded
                            ? "opacity-40 cursor-default border-dashed"
                            : "hover:border-primary hover:text-primary cursor-pointer bg-background"
                        }`}
                      >
                        + {suggested.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Add Custom Topic */}
              <div className="grid gap-2 sm:grid-cols-2 pt-1">
                <Input
                  value={customTopicName}
                  onChange={(e) => setCustomTopicName(e.target.value)}
                  placeholder="Custom Topic Name (e.g. Technical SEO)"
                  className="rounded-xl text-xs"
                />
                <div className="flex gap-2">
                  <Input
                    value={customTopicWiki}
                    onChange={(e) => setCustomTopicWiki(e.target.value)}
                    placeholder="Wikipedia URL (Optional)"
                    className="rounded-xl text-xs"
                  />
                  <Button variant="outline" size="sm" onClick={handleAddCustomTopic} className="rounded-full shrink-0">
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: Multiple Articles Integration */}
          <TabsContent value="article" className="space-y-5 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 bg-muted/20">
              <div className="space-y-0.5">
                <h4 className="text-sm font-semibold">Articles by This Author ({articles.length})</h4>
                <p className="text-xs text-muted-foreground">
                  Connect multiple articles/posts to this author entity via @id in a unified @graph.
                </p>
              </div>
              <Button onClick={handleAddArticle} size="sm" className="rounded-full gap-1.5 text-xs">
                <Plus className="h-3.5 w-3.5" /> Add Article
              </Button>
            </div>

            {articles.length === 0 ? (
              <div className="rounded-xl border border-dashed p-8 text-center space-y-2">
                <BookOpen className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
                <p className="text-sm font-medium">No articles attached yet</p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  If you only need an author/person schema, you can leave this empty. If you want to connect published articles to this author, click &quot;Add Article&quot;.
                </p>
                <Button onClick={handleAddArticle} variant="outline" size="sm" className="rounded-full text-xs mt-2">
                  + Add First Article
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {articles.map((art, idx) => (
                  <Card key={art.id} className="p-4 rounded-xl border space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Article #{idx + 1}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveArticle(art.id)}
                        className="text-muted-foreground hover:text-red-500 h-8 px-2 text-xs gap-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Headline *</Label>
                      <Input
                        value={art.headline}
                        onChange={(e) => handleUpdateArticle(art.id, "headline", e.target.value)}
                        placeholder="e.g. Complete Guide to Modern Search Intent"
                        className="rounded-lg text-sm"
                      />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="space-y-1 sm:col-span-1">
                        <Label className="text-xs">Canonical URL *</Label>
                        <Input
                          value={art.url}
                          onChange={(e) => handleUpdateArticle(art.id, "url", e.target.value)}
                          placeholder="https://example.com/blog/article-slug"
                          className="rounded-lg text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Date Published</Label>
                        <Input
                          value={art.datePublished}
                          onChange={(e) => handleUpdateArticle(art.id, "datePublished", e.target.value)}
                          placeholder="2026-10-07"
                          className="rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Date Modified</Label>
                        <Input
                          value={art.dateModified}
                          onChange={(e) => handleUpdateArticle(art.id, "dateModified", e.target.value)}
                          placeholder="2026-10-07"
                          className="rounded-lg text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">Short Description</Label>
                      <Textarea
                        value={art.description}
                        onChange={(e) => handleUpdateArticle(art.id, "description", e.target.value)}
                        placeholder="1-2 sentences summarizing the article content..."
                        rows={2}
                        className="rounded-lg text-xs"
                      />
                    </div>
                  </Card>
                ))}

                <Button onClick={handleAddArticle} variant="outline" size="sm" className="rounded-full text-xs gap-1">
                  <Plus className="h-3.5 w-3.5" /> Add Another Article
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Code Output Box */}
      <div className="space-y-3 rounded-2xl border bg-muted/40 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">Generated JSON-LD Structured Data</h3>
            <Badge variant="outline" className="font-mono text-xs">
              Schema.org / JSON-LD
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleOpenGoogleTester} className="rounded-full text-xs gap-1.5">
              <ExternalLink className="h-3 w-3" /> Test in Google Rich Results
            </Button>
            <Button variant="default" size="sm" onClick={handleCopyCode} className="rounded-full text-xs gap-1.5">
              {copied ? <Check className="h-3.5 w-3.5 text-green-300" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy Schema Code"}
            </Button>
          </div>
        </div>

        <pre className="overflow-x-auto rounded-xl bg-background/90 p-5 font-mono text-xs text-foreground/90 border max-h-[460px]">
          {scriptTagString}
        </pre>
      </div>

      {/* Installation Guide */}
      <div className="rounded-2xl border bg-card p-6 space-y-4">
        <h4 className="text-base font-bold flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" /> Where to Paste This Code
        </h4>
        <div className="grid gap-3 sm:grid-cols-2 text-xs leading-relaxed text-muted-foreground">
          <div className="rounded-xl border p-4 bg-muted/20">
            <strong className="text-foreground block text-sm mb-1">WordPress:</strong>
            Paste directly into your theme&apos;s <code className="font-mono text-foreground">&lt;head&gt;</code> using WPCode,
            Insert Headers and Footers plugin, or your SEO plugin&apos;s custom schema section.
          </div>
          <div className="rounded-xl border p-4 bg-muted/20">
            <strong className="text-foreground block text-sm mb-1">Ghost / Webflow / Shopify:</strong>
            Go to Settings → Code Injection / Custom Code → Paste into <code className="font-mono text-foreground">Header Code</code>.
          </div>
        </div>
      </div>
    </div>
  );
}
