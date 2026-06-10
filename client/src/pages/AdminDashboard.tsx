import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PenLine, Trash2, Plus, LogOut, Eye, EyeOff } from "lucide-react";
import type { Post } from "@shared/schema";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => { if (!r.ok) setLocation("/admin/login"); })
      .catch(() => setLocation("/admin/login"));

    fetch("/api/admin/posts")
      .then((r) => r.json())
      .then((data) => { setPosts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggleStatus = async (post: Post) => {
    const newStatus = post.status === "published" ? "draft" : "published";
    const res = await fetch(`/api/admin/posts/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...post, status: newStatus }),
    });
    const updated = await res.json();
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setLocation("/admin/login");
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="sticky top-0 z-50 border-b bg-background px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Blog Admin</h1>
            <p className="text-xs text-muted-foreground">usmanbashir.net</p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild size="sm">
              <Link href="/admin/posts/new"><Plus className="mr-1 h-4 w-4" /> New Post</Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-1 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">All Posts</h2>
          <span className="text-sm text-muted-foreground">{posts.length} total</span>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground mb-4">No posts yet.</p>
              <Button asChild>
                <Link href="/admin/posts/new"><Plus className="mr-1 h-4 w-4" /> Write your first post</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <Card key={post.id} className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-center justify-between gap-4 py-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-semibold">{post.title}</h3>
                      <Badge variant={post.status === "published" ? "default" : "secondary"}>
                        {post.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {post.category} · {post.readTime}
                      {post.publishedAt
                        ? ` · Published ${new Date(post.publishedAt).toLocaleDateString()}`
                        : ` · Created ${new Date(post.createdAt!).toLocaleDateString()}`}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      title={post.status === "published" ? "Unpublish" : "Publish"}
                      onClick={() => handleToggleStatus(post)}
                    >
                      {post.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" asChild title="Edit">
                      <Link href={`/admin/posts/${post.id}`}><PenLine className="h-4 w-4" /></Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Delete"
                      onClick={() => handleDelete(post.id, post.title)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
