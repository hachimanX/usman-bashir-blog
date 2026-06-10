import { useState, useEffect, useCallback } from "react";
import { useLocation, useRoute } from "wouter";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered,
  Quote, Code, Minus, Undo, Redo, Link2, Image as ImageIcon,
  ArrowLeft, Save, Eye, EyeOff
} from "lucide-react";

const CATEGORIES = [
  "SEO & Digital Marketing",
  "Business & Startups",
  "Design & Creative",
  "Tutorials & Reviews",
  "General",
];

export default function AdminPostEditor() {
  const [, setLocation] = useLocation();
  const [matchEdit, paramsEdit] = useRoute("/admin/posts/:id");
  const isNew = paramsEdit?.id === "new";
  const postId = isNew ? null : paramsEdit?.id;

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("General");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Start writing your article here…" }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-lg dark:prose-invert max-w-none min-h-[400px] focus:outline-none px-1",
      },
    },
  });

  useEffect(() => {
    if (!postId) return;
    fetch(`/api/admin/posts`)
      .then((r) => r.json())
      .then((posts: any[]) => {
        const post = posts.find((p: any) => p.id === postId);
        if (!post) return;
        setTitle(post.title);
        setExcerpt(post.excerpt || "");
        setCategory(post.category || "General");
        setCoverImage(post.coverImage || "");
        setStatus(post.status);
        editor?.commands.setContent(post.content);
      });
  }, [postId, editor]);

  const addLink = useCallback(() => {
    const url = window.prompt("Enter URL:");
    if (!url) return;
    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt("Enter image URL:");
    if (!url) return;
    editor?.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const handleSave = async (overrideStatus?: "draft" | "published") => {
    if (!title.trim()) { setError("Title is required"); return; }
    setError("");
    setSaving(true);
    const finalStatus = overrideStatus ?? status;
    const body = {
      title,
      content: editor?.getHTML() || "",
      excerpt,
      category,
      coverImage: coverImage || null,
      status: finalStatus,
    };
    try {
      const res = await fetch(
        postId ? `/api/admin/posts/${postId}` : "/api/admin/posts",
        {
          method: postId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      if (!res.ok) {
        const d = await res.json();
        setError(d.message || "Save failed");
        return;
      }
      const saved = await res.json();
      setStatus(finalStatus);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      if (isNew) setLocation(`/admin/posts/${saved.id}`);
    } catch {
      setError("Save failed. Check your connection.");
    } finally {
      setSaving(false);
    }
  };

  if (!editor) return null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
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
            {error && <span className="text-sm text-red-500">{error}</span>}
            {saved && <span className="text-sm text-green-600">Saved!</span>}
            <Button variant="outline" size="sm" onClick={() => handleSave("draft")} disabled={saving}>
              <Save className="mr-1 h-4 w-4" /> Save Draft
            </Button>
            <Button size="sm" onClick={() => handleSave("published")} disabled={saving}>
              {status === "published" ? (
                <><Eye className="mr-1 h-4 w-4" /> Update</>
              ) : (
                <><Eye className="mr-1 h-4 w-4" /> Publish</>
              )}
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
        {/* Title */}
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title…"
          className="mb-6 border-none px-0 text-4xl font-bold shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/50"
        />

        {/* Toolbar */}
        <div className="mb-4 flex flex-wrap gap-1 rounded-lg border bg-muted/40 p-2">
          <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold"><Bold className="h-4 w-4" /></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic"><Italic className="h-4 w-4" /></ToolbarBtn>
          <div className="mx-1 w-px bg-border" />
          <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2"><Heading2 className="h-4 w-4" /></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3"><Heading3 className="h-4 w-4" /></ToolbarBtn>
          <div className="mx-1 w-px bg-border" />
          <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list"><List className="h-4 w-4" /></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered list"><ListOrdered className="h-4 w-4" /></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Quote"><Quote className="h-4 w-4" /></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Inline code"><Code className="h-4 w-4" /></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider"><Minus className="h-4 w-4" /></ToolbarBtn>
          <div className="mx-1 w-px bg-border" />
          <ToolbarBtn onClick={addLink} active={editor.isActive("link")} title="Add link"><Link2 className="h-4 w-4" /></ToolbarBtn>
          <ToolbarBtn onClick={addImage} title="Add image"><ImageIcon className="h-4 w-4" /></ToolbarBtn>
          <div className="mx-1 w-px bg-border" />
          <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} title="Undo"><Undo className="h-4 w-4" /></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} title="Redo"><Redo className="h-4 w-4" /></ToolbarBtn>
        </div>

        {/* Editor */}
        <div className="min-h-[400px] rounded-lg border bg-background p-4">
          <EditorContent editor={editor} />
        </div>

        {/* Post settings */}
        <div className="mt-8 grid gap-6 rounded-lg border bg-muted/20 p-6 md:grid-cols-2">
          <h3 className="col-span-full font-semibold">Post Settings</h3>

          <div className="space-y-1">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Cover Image URL (optional)</Label>
            <Input
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://images.unsplash.com/…"
            />
          </div>

          <div className="col-span-full space-y-1">
            <Label>Excerpt (shown in article cards)</Label>
            <Textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A short 1–2 sentence summary of this post…"
              rows={3}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function ToolbarBtn({
  onClick, active, title, children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded p-1.5 transition-colors hover:bg-background ${active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
    >
      {children}
    </button>
  );
}
