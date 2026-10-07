import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Monitor,
  Smartphone,
  Copy,
  Check,
  Share2,
  Download,
  RotateCcw,
  Star,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  Info,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Google SERP limits (pixel thresholds)
const DESKTOP_TITLE_MAX_PX = 600;
const MOBILE_TITLE_MAX_PX = 580;
const DESKTOP_DESC_MAX_PX = 960;
const MOBILE_DESC_MAX_PX = 680;

/** Measure text width in pixels using HTML5 canvas matching Google font styling */
function measureTextWidth(text: string, font: string): number {
  if (typeof window === "undefined") return text.length * 9;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return text.length * 9;
  ctx.font = font;
  return Math.round(ctx.measureText(text).width);
}

/** Measures text width accounting for bold keywords */
function measureRichTextWidth(text: string, keyword: string, baseFont: string, boldFont: string): number {
  if (!keyword.trim()) return measureTextWidth(text, baseFont);
  const regex = new RegExp(`(${keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  let total = 0;
  for (const part of parts) {
    if (regex.test(part)) {
      total += measureTextWidth(part, boldFont);
    } else {
      total += measureTextWidth(part, baseFont);
    }
  }
  return total;
}

export default function SerpPreview() {
  const { toast } = useToast();

  // Form State
  const [title, setTitle] = useState("Best SEO Tools for Content Teams in 2026 (Tested & Ranked)");
  const [description, setDescription] = useState(
    "We tested 24 leading SEO tools on real client sites. Here is our honest comparison of keyword data, audit speed, and which tool actually drives compounding organic traffic.",
  );
  const [url, setUrl] = useState("https://usmanbashir.net/articles/best-seo-tools");
  const [keyword, setKeyword] = useState("SEO tools");
  const [siteName, setSiteName] = useState("Usman Bashir");

  // Options State
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [showRating, setShowRating] = useState(true);
  const [rating, setRating] = useState("4.9");
  const [reviewCount, setReviewCount] = useState("128");
  const [showDate, setShowDate] = useState(true);
  const [dateStr, setDateStr] = useState("Oct 7, 2026");
  const [copiedMeta, setCopiedMeta] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Read URL hash on mount for shareable links
  useEffect(() => {
    if (typeof window === "undefined" || !window.location.hash) return;
    try {
      const params = new URLSearchParams(window.location.hash.slice(1));
      if (params.get("t")) setTitle(params.get("t")!);
      if (params.get("d")) setDescription(params.get("d")!);
      if (params.get("u")) setUrl(params.get("u")!);
      if (params.get("k")) setKeyword(params.get("k")!);
      if (params.get("s")) setSiteName(params.get("s")!);
    } catch (e) {
      // Ignore hash parse errors
    }
  }, []);

  // Compute clean breadcrumbs and domain
  const { domain, breadcrumbPath } = useMemo(() => {
    try {
      const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
      const pathParts = parsed.pathname.split("/").filter(Boolean);
      const breadcrumbs = [parsed.hostname, ...pathParts].join(" › ");
      return { domain: parsed.hostname, breadcrumbPath: breadcrumbs };
    } catch {
      return { domain: "example.com", breadcrumbPath: "example.com › article" };
    }
  }, [url]);

  // Pixel calculations
  const titleFont = "20px Arial, sans-serif";
  const titleBoldFont = "bold 20px Arial, sans-serif";
  const descFont = "14px Arial, sans-serif";
  const descBoldFont = "bold 14px Arial, sans-serif";

  const titlePx = useMemo(
    () => measureRichTextWidth(title, keyword, titleFont, titleBoldFont),
    [title, keyword],
  );

  const descPx = useMemo(
    () => measureRichTextWidth(description, keyword, descFont, descBoldFont),
    [description, keyword],
  );

  const titleMaxPx = viewMode === "desktop" ? DESKTOP_TITLE_MAX_PX : MOBILE_TITLE_MAX_PX;
  const descMaxPx = viewMode === "desktop" ? DESKTOP_DESC_MAX_PX : MOBILE_DESC_MAX_PX;

  const isTitleTruncated = titlePx > titleMaxPx;
  const isDescTruncated = descPx > descMaxPx;

  // Percentage for progress bars
  const titlePct = Math.min(100, Math.round((titlePx / titleMaxPx) * 100));
  const descPct = Math.min(100, Math.round((descPx / descMaxPx) * 100));

  // Keyword highlighting helper
  const renderHighlighted = (text: string, boldWeight = "font-bold text-foreground") => {
    if (!keyword.trim()) return text;
    const regex = new RegExp(`(${keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <strong key={i} className={boldWeight}>
          {part}
        </strong>
      ) : (
        part
      ),
    );
  };

  // Actions
  const handleCopyMeta = () => {
    const metaTags = `<title>${title}</title>\n<meta name="description" content="${description}">\n<link rel="canonical" href="${url}">`;
    navigator.clipboard.writeText(metaTags);
    setCopiedMeta(true);
    toast({
      title: "Meta tags copied",
      description: "HTML title and description copied to clipboard.",
    });
    setTimeout(() => setCopiedMeta(false), 2000);
  };

  const handleShareLink = () => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams({
      t: title,
      d: description,
      u: url,
      k: keyword,
      s: siteName,
    });
    const shareUrl = `${window.location.origin}${window.location.pathname}#${params.toString()}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    toast({
      title: "Share link copied",
      description: "Send this URL to a client or team member to show this exact preview.",
    });
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleReset = () => {
    setTitle("Best SEO Tools for Content Teams in 2026 (Tested & Ranked)");
    setDescription(
      "We tested 24 leading SEO tools on real client sites. Here is our honest comparison of keyword data, audit speed, and which tool actually drives compounding organic traffic.",
    );
    setUrl("https://usmanbashir.net/articles/best-seo-tools");
    setKeyword("SEO tools");
    setSiteName("Usman Bashir");
  };

  // High-res Canvas Snapshot Export
  const previewRef = useRef<HTMLDivElement>(null);
  const handleDownloadImage = () => {
    if (!previewRef.current) return;
    const canvas = document.createElement("canvas");
    const width = 800;
    const height = viewMode === "desktop" ? 380 : 440;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fill background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Border
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Header badge
    ctx.fillStyle = "#64748b";
    ctx.font = "12px sans-serif";
    ctx.fillText(`GOOGLE SERP PREVIEW (${viewMode.toUpperCase()}) — usmanbashir.net`, 30, 40);

    // Favicon placeholder circle
    ctx.fillStyle = "#e2e8f0";
    ctx.beginPath();
    ctx.arc(42, 80, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText(siteName.slice(0, 2).toUpperCase(), 35, 84);

    // Site Name and Breadcrumb
    ctx.fillStyle = "#202124";
    ctx.font = "14px Arial, sans-serif";
    ctx.fillText(siteName, 68, 76);
    ctx.fillStyle = "#4d5156";
    ctx.font = "12px Arial, sans-serif";
    ctx.fillText(breadcrumbPath, 68, 93);

    // Title (Blue link)
    ctx.fillStyle = "#1a0dab";
    ctx.font = "20px Arial, sans-serif";
    const titleText = isTitleTruncated ? title.slice(0, 58) + "..." : title;
    ctx.fillText(titleText, 30, 135);

    // Rich snippet rating
    let textY = 165;
    if (showRating) {
      ctx.fillStyle = "#e37400";
      ctx.font = "14px Arial, sans-serif";
      ctx.fillText(`★ ${rating} ★★★★★ (${reviewCount})`, 30, textY);
      textY += 26;
    }

    // Description
    ctx.fillStyle = "#4d5156";
    ctx.font = "14px Arial, sans-serif";
    const datePrefix = showDate ? `${dateStr} — ` : "";
    const fullSnippet = datePrefix + description;
    const line1 = fullSnippet.slice(0, 85);
    const line2 = fullSnippet.length > 85 ? fullSnippet.slice(85, 170) + (isDescTruncated ? "..." : "") : "";

    ctx.fillText(line1, 30, textY);
    if (line2) ctx.fillText(line2, 30, textY + 22);

    // Watermark
    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px sans-serif";
    ctx.fillText("Generated with free SERP Preview on usmanbashir.net", 30, height - 25);

    // Trigger download
    const link = document.createElement("a");
    link.download = `serp-preview-${domain}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    toast({
      title: "Image downloaded",
      description: "Clean PNG preview exported for client decks or reports.",
    });
  };

  return (
    <div className="space-y-8">
      {/* Controls & Mode Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card/60 p-4 backdrop-blur-xs">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "desktop" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("desktop")}
            className="rounded-full gap-2"
          >
            <Monitor className="h-4 w-4" />
            Desktop
          </Button>
          <Button
            variant={viewMode === "mobile" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("mobile")}
            className="rounded-full gap-2"
          >
            <Smartphone className="h-4 w-4" />
            Mobile
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} className="rounded-full gap-1.5 text-xs">
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
          <Button variant="outline" size="sm" onClick={handleShareLink} className="rounded-full gap-1.5 text-xs">
            {copiedLink ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Share2 className="h-3.5 w-3.5" />}
            {copiedLink ? "Link Copied" : "Share Client Link"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadImage} className="rounded-full gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" />
            Export PNG
          </Button>
          <Button variant="secondary" size="sm" onClick={handleCopyMeta} className="rounded-full gap-1.5 text-xs">
            {copiedMeta ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
            {copiedMeta ? "Copied" : "Copy Meta Tags"}
          </Button>
        </div>
      </div>

      {/* Main Interactive Preview Card */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> Live Google Search Result
          </h2>
          <span className="text-xs text-muted-foreground">
            {viewMode === "desktop" ? "Desktop Simulation (600px title limit)" : "Mobile Card (580px title limit)"}
          </span>
        </div>

        <div
          ref={previewRef}
          className={`rounded-2xl border p-6 transition-all ${
            viewMode === "desktop"
              ? "bg-[#ffffff] dark:bg-[#202124] text-[#4d5156] dark:text-[#bdc1c6] max-w-full"
              : "bg-[#ffffff] dark:bg-[#202124] text-[#4d5156] dark:text-[#bdc1c6] max-w-md mx-auto shadow-sm"
          }`}
        >
          {/* Top Row: Favicon, Site Name, URL & Options */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f1f3f4] dark:bg-[#303134] text-[#202124] dark:text-[#e8eaed] font-bold text-xs">
                {siteName.slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="truncate font-medium text-[#202124] dark:text-[#dadce0] text-[13px]">
                  {siteName || domain}
                </div>
                <div className="truncate text-[12px] text-[#4d5156] dark:text-[#bdc1c6]">
                  {breadcrumbPath}
                </div>
              </div>
            </div>
            <div className="text-muted-foreground opacity-60">
              <span className="cursor-pointer text-lg leading-none">⋮</span>
            </div>
          </div>

          {/* Title Tag */}
          <div className="mt-2.5">
            <a
              href="#preview"
              onClick={(e) => e.preventDefault()}
              className="font-normal text-[20px] leading-[1.3] text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer break-words"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              {renderHighlighted(title, "font-bold text-[#1a0dab] dark:text-[#8ab4f8]")}
            </a>
          </div>

          {/* Optional Rich Snippet: Star Rating */}
          {showRating && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#e37400] dark:text-[#f2994a]">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <span className="font-semibold text-[#70757a] dark:text-[#9aa0a6]">
                {rating} ({reviewCount})
              </span>
            </div>
          )}

          {/* Meta Description with Date */}
          <div
            className="mt-2 text-[14px] leading-[1.58] text-[#4d5156] dark:text-[#bdc1c6] break-words"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            {showDate && (
              <span className="text-[#70757a] dark:text-[#9aa0a6] mr-1.5 font-normal">
                {dateStr} —
              </span>
            )}
            {renderHighlighted(description, "font-bold text-[#202124] dark:text-[#e8eaed]")}
          </div>
        </div>
      </div>

      {/* Real-Time Pixel & Character Meters */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Title Meter */}
        <Card className="p-5 rounded-2xl border bg-card">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">Title Tag Width</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs">{title.length} chars</span>
              <Badge
                variant={isTitleTruncated ? "destructive" : titlePx > titleMaxPx - 40 ? "secondary" : "outline"}
                className="font-mono text-xs"
              >
                {titlePx} / {titleMaxPx} px
              </Badge>
            </div>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full transition-all duration-300 ${
                isTitleTruncated ? "bg-red-500" : titlePx > titleMaxPx - 40 ? "bg-amber-500" : "bg-primary"
              }`}
              style={{ width: `${titlePct}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1.5">
            {isTitleTruncated ? (
              <>
                <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                <span>Google will likely truncate this title with &apos;...&apos;. Shorten by ~{titlePx - titleMaxPx}px.</span>
              </>
            ) : (
              <>
                <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                <span>Safe. Your title fits comfortably within Google&apos;s pixel boundaries.</span>
              </>
            )}
          </p>
        </Card>

        {/* Description Meter */}
        <Card className="p-5 rounded-2xl border bg-card">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">Snippet Width</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs">{description.length} chars</span>
              <Badge
                variant={isDescTruncated ? "destructive" : descPx > descMaxPx - 60 ? "secondary" : "outline"}
                className="font-mono text-xs"
              >
                {descPx} / {descMaxPx} px
              </Badge>
            </div>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full transition-all duration-300 ${
                isDescTruncated ? "bg-red-500" : descPx > descMaxPx - 60 ? "bg-amber-500" : "bg-primary"
              }`}
              style={{ width: `${descPct}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1.5">
            {isDescTruncated ? (
              <>
                <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                <span>Snippet exceeds {viewMode} display limit. It may be truncated or rewritten by Google.</span>
              </>
            ) : (
              <>
                <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                <span>Optimal length. Clean 2-line snippet on Google search.</span>
              </>
            )}
          </p>
        </Card>
      </div>

      {/* Input Editors Form */}
      <div className="space-y-6 rounded-2xl border bg-card p-6">
        <h3 className="text-lg font-bold">Edit Snippet Details</h3>

        <div className="grid gap-5">
          {/* Title Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="title-input">Page Title (Title Tag)</Label>
              <span className="text-xs text-muted-foreground font-mono">
                {titlePx}px / {title.length} chars
              </span>
            </div>
            <Input
              id="title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Best SEO Tools for 2026 (Honest Comparison)"
              className="rounded-xl text-base"
            />
          </div>

          {/* Search Query / Keyword Bolding Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="keyword-input" className="flex items-center gap-1.5">
                Target Keyword / Search Query
                <span className="text-xs font-normal text-muted-foreground">(simulates Google bolding)</span>
              </Label>
            </div>
            <Input
              id="keyword-input"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. SEO tools"
              className="rounded-xl"
            />
            <p className="text-xs text-muted-foreground">
              When a searcher types your keyword, Google bolds it in results. Bold letters take up ~15% more pixel width.
            </p>
          </div>

          {/* Meta Description Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="desc-input">Meta Description</Label>
              <span className="text-xs text-muted-foreground font-mono">
                {descPx}px / {description.length} chars
              </span>
            </div>
            <Textarea
              id="desc-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a compelling summary that entices searchers to click..."
              rows={3}
              className="rounded-xl text-base leading-relaxed"
            />
          </div>

          {/* URL & Site Name */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="url-input">Page URL</Label>
              <Input
                id="url-input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/blog/article-slug"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site-input">Site Name (Brand)</Label>
              <Input
                id="site-input"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="e.g. YourBrand"
                className="rounded-xl"
              />
            </div>
          </div>

          {/* Rich Snippet Toggles */}
          <div className="border-t pt-5">
            <h4 className="text-sm font-semibold mb-3">Rich Snippet Options</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Star Rating Toggle */}
              <div className="flex items-center justify-between rounded-xl border p-3">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Star Review Rating</Label>
                  <p className="text-xs text-muted-foreground">Simulate Schema.org AggregateRating</p>
                </div>
                <Switch checked={showRating} onCheckedChange={setShowRating} />
              </div>

              {/* Date Stamp Toggle */}
              <div className="flex items-center justify-between rounded-xl border p-3">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Publication Date</Label>
                  <p className="text-xs text-muted-foreground">Simulate article date badge</p>
                </div>
                <Switch checked={showDate} onCheckedChange={setShowDate} />
              </div>
            </div>

            {/* Custom Rating & Date inputs if enabled */}
            {(showRating || showDate) && (
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {showRating && (
                  <>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Rating Score</Label>
                      <Input
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        placeholder="4.9"
                        className="rounded-lg h-9 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Review Count</Label>
                      <Input
                        value={reviewCount}
                        onChange={(e) => setReviewCount(e.target.value)}
                        placeholder="128"
                        className="rounded-lg h-9 text-xs"
                      />
                    </div>
                  </>
                )}
                {showDate && (
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Date Text</Label>
                    <Input
                      value={dateStr}
                      onChange={(e) => setDateStr(e.target.value)}
                      placeholder="Oct 7, 2026"
                      className="rounded-lg h-9 text-xs"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Copy-Paste HTML Block */}
      <div className="rounded-2xl border bg-muted/40 p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" /> Generated HTML Head Tags
          </h4>
          <Button variant="outline" size="sm" onClick={handleCopyMeta} className="rounded-full text-xs gap-1.5">
            {copiedMeta ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
            {copiedMeta ? "Copied" : "Copy Tags"}
          </Button>
        </div>
        <pre className="overflow-x-auto rounded-xl bg-background/80 p-4 font-mono text-xs text-muted-foreground border">
          {`<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${url}">`}
        </pre>
      </div>
    </div>
  );
}
