import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useRoute } from "wouter";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered,
  Quote, Code, Minus, Undo, Redo, Link2, Image as ImageIcon,
  ArrowLeft, Save, Eye, EyeOff, Upload, Sun, Moon
} from "lucide-react";

// Mirrors the content pillars in content-plan.md. Categories the uploader sends
// must exist here or the Select renders blank.
const CATEGORIES = [
  "Print on Demand",
  "US LLC & Business Setup",
  "AI & Marketing",
  "SEO & Digital Marketing",
  "Design & Creative",
  "Tutorials & Reviews",
  "General",
];

export default function AdminPostEditor() {
  const [, setLocation] = useLocation();
  const [, paramsEdit] = useRoute("/admin/posts/:id");
  const isNew = paramsEdit?.id === "new";
  const postId = isNew ? null : paramsEdit?.id;

  const [title, setTitle] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("General");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [schemaMarkup, setSchemaMarkup] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [savedMsg, setSavedMsg] = useState("");
  const [isDark, setIsDark] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Apply dark mode to document
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Default to dark on mount
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
      }),
      Placeholder.configure({ placeholder: "Start writing your article here…" }),
      // Without these, TipTap has no schema node for <table> and silently drops
      // the element on load, leaving every cell concatenated into one paragraph.
      // Comparison tables are the backbone of most articles here, so they matter.
      Table.configure({ resizable: false, HTMLAttributes: { class: "article-table" } }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    editorProps: {
      attributes: { class: "prose prose-lg dark:prose-invert max-w-none min-h-[400px] focus:outline-none px-1" },
    },
  });

  useEffect(() => {
    if (!postId || !editor) return;
    fetch("/api/admin/posts")
      .then((r) => r.json())
      .then((posts: any[]) => {
        const post = posts.find((p: any) => p.id === postId);
        if (!post) return;
        setTitle(post.title);
        setCustomSlug(post.slug || "");
        setExcerpt(post.excerpt || "");
        setCategory(post.category || "General");
        setCoverImage(post.coverImage || "");
        setStatus(post.status);
        setSeoTitle(post.seoTitle || "");
        setMetaDescription(post.metaDescription || "");
        setSchemaMarkup(post.schemaMarkup || "");
        editor.commands.setContent(post.content);
      });
  }, [postId, editor]);

  const addLink = useCallback(() => {
    const url = window.prompt("Enter URL (e.g. https://example.com):");
    if (!url) return;
    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImageUrl = useCallback(() => {
    const url = window.prompt("Enter image URL:");
    if (!url) return;
    editor?.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageData: base64 }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.message || "Upload failed"); setUploading(false); return; }
        setCoverImage(data.url);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch { setError("Upload failed"); setUploading(false); }
  };

  const handleSave = async (overrideStatus?: "draft" | "published") => {
    if (!title.trim()) { setError("Title is required"); return; }
    setError(""); setSaving(true);
    const finalStatus = overrideStatus ?? status;
    const body = {
      title, content: editor?.getHTML() || "", excerpt, category,
      coverImage: coverImage || null, status: finalStatus,
      slug: customSlug || undefined, seoTitle: seoTitle || null,
      metaDescription: metaDescription || null, schemaMarkup: schemaMarkup || null,
    };
    try {
      const res = await fetch(
        postId ? `/api/admin/posts/${postId}` : "/api/admin/posts",
        { method: postId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
      );
      if (!res.ok) { const d = await res.json(); setError(d.message || "Save failed"); return; }
      const saved = await res.json();
      setStatus(finalStatus);
      setCustomSlug(saved.slug);
      setSavedMsg(finalStatus === "published" ? "Published!" : "Draft saved");
      setTimeout(() => setSavedMsg(""), 2500);
      if (isNew) setLocation(`/admin/posts/${saved.id}`);
    } catch { setError("Save failed. Check your connection."); }
    finally { setSaving(false); }
  };

  if (!editor) return null;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b bg-background px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/admin")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="font-semibold">{isNew ? "New Post" : "Edit Post"}</span>
            <Badge variant={status === "published" ? "default" : "secondary"}>{status}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" title="Toggle theme" onClick={() => setIsDark(!isDark)}>
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            {error && <span className="text-sm text-red-500">{error}</span>}
            {savedMsg && <span className="text-sm text-green-500">{savedMsg}</span>}
            <Button variant="outline" size="sm" onClick={() => handleSave("draft")} disabled={saving}>
              <Save className="mr-1 h-4 w-4" /> Save Draft
            </Button>
            <Button size="sm" onClick={() => handleSave("published")} disabled={saving}>
              <Eye className="mr-1 h-4 w-4" /> {status === "published" ? "Update" : "Publish"}
            </Button>
            {status === "published" && (
              <Button variant="ghost" size="sm" onClick={() => handleSave("draft")} disabled={saving}>
                <EyeOff className="mr-1 h-4 w-4" /> Unpublish
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 py-8">
        <Tabs defaultValue="content">
          <TabsList className="mb-6">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="settings">Post Settings</TabsTrigger>
            <TabsTrigger value="seo">SEO & Schema</TabsTrigger>
          </TabsList>

          {/* ── Content tab ── */}
          <TabsContent value="content" className="space-y-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title…"
              className="border-none px-0 text-4xl font-bold shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/50"
            />

            {/* URL slug */}
            <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm">
              <span className="text-muted-foreground">usmanbashir.net/article/</span>
              <input
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                placeholder={title ? title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-") : "custom-url-slug"}
                className="flex-1 bg-transparent outline-none font-mono text-primary"
              />
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 rounded-lg border bg-muted/40 p-2">
              <TB onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold"><Bold className="h-4 w-4" /></TB>
              <TB onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic"><Italic className="h-4 w-4" /></TB>
              <div className="mx-1 w-px bg-border" />
              <TB onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2"><Heading2 className="h-4 w-4" /></TB>
              <TB onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3"><Heading3 className="h-4 w-4" /></TB>
              <div className="mx-1 w-px bg-border" />
              <TB onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list"><List className="h-4 w-4" /></TB>
              <TB onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered list"><ListOrdered className="h-4 w-4" /></TB>
              <TB onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Quote"><Quote className="h-4 w-4" /></TB>
              <TB onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Code"><Code className="h-4 w-4" /></TB>
              <TB onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider"><Minus className="h-4 w-4" /></TB>
              <div className="mx-1 w-px bg-border" />
              <TB onClick={addLink} active={editor.isActive("link")} title="Add link (opens in new tab)"><Link2 className="h-4 w-4" /></TB>
              <TB onClick={addImageUrl} title="Add image by URL"><ImageIcon className="h-4 w-4" /></TB>
              <div className="mx-1 w-px bg-border" />
              <TB onClick={() => editor.chain().focus().undo().run()} title="Undo"><Undo className="h-4 w-4" /></TB>
              <TB onClick={() => editor.chain().focus().redo().run()} title="Redo"><Redo className="h-4 w-4" /></TB>
            </div>

            <div className="min-h-[400px] rounded-lg border bg-background p-4">
              <EditorContent editor={editor} />
            </div>
          </TabsContent>

          {/* ── Settings tab ── */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-1">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label>Cover Image</Label>
                <div className="flex gap-2">
                  <Input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="Paste URL or upload below…" className="flex-1" />
                  <Button
                    type="button" variant="outline" size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    title="Upload image (requires IMGBB_API_KEY in Railway)"
                  >
                    {uploading ? <span className="text-xs">…</span> : <Upload className="h-4 w-4" />}
                  </Button>
                  <input
                    ref={fileInputRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Upload requires IMGBB_API_KEY env var in Railway. URL paste always works.</p>
                {coverImage && <img src={coverImage} alt="Cover preview" className="mt-2 h-32 w-full rounded object-cover" />}
              </div>

              <div className="col-span-full space-y-1">
                <Label>Excerpt <span className="text-muted-foreground">(shown in article cards)</span></Label>
                <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="1–2 sentence summary…" rows={3} />
              </div>
            </div>
          </TabsContent>

          {/* ── SEO tab ── */}
          <TabsContent value="seo" className="space-y-6">
            <div className="space-y-1">
              <Label>SEO Title <span className="text-muted-foreground">(shown in Google — leave blank to use post title)</span></Label>
              <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder={title || "SEO title…"} maxLength={60} />
              <p className="text-xs text-muted-foreground">{seoTitle.length}/60 characters</p>
            </div>

            <div className="space-y-1">
              <Label>Meta Description <span className="text-muted-foreground">(shown in Google results)</span></Label>
              <Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="Brief description of this article for search engines…" rows={3} maxLength={160} />
              <p className="text-xs text-muted-foreground">{metaDescription.length}/160 characters</p>
            </div>

            <div className="space-y-1">
              <Label>Schema Markup <span className="text-muted-foreground">(JSON-LD — visible to Google & AI, not readers)</span></Label>
              <Textarea
                value={schemaMarkup}
                onChange={(e) => setSchemaMarkup(e.target.value)}
                placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "${title || "Article title"}"\n}`}
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">Paste valid JSON-LD. This is injected as a script tag on the article page — invisible to readers but read by Google and AI crawlers.</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function TB({ onClick, active, title, children }: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} title={title}
      className={`rounded p-1.5 transition-colors hover:bg-background ${active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>
      {children}
    </button>
  );
}
