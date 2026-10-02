import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface NewsletterSignupProps {
  variant?: "inline" | "card";
}

export default function NewsletterSignup({ variant = "inline" }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      toast({
        title: "You're on the list",
        description: "New posts will land in your inbox.",
      });
      setEmail("");
    } catch (err) {
      // Never claim success we did not get — a silent failure here costs a subscriber.
      toast({
        title: "That didn't go through",
        description: err instanceof Error ? err.message : "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const form = (
    <form onSubmit={handleSubmit} className={variant === "card" ? "mt-6 flex gap-2" : "flex gap-2"}>
      <label htmlFor={`newsletter-email-${variant}`} className="sr-only">
        Email address
      </label>
      <Input
        id={`newsletter-email-${variant}`}
        // `name` was missing, which breaks autofill heuristics in several
        // browsers even with autoComplete set.
        name="email"
        type="email"
        inputMode="email"
        spellCheck={false}
        autoCapitalize="off"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={submitting}
        autoComplete="email"
        data-testid="input-newsletter-email"
        className={`rounded-full px-4 ${variant === "card" ? "flex-1" : "flex-1 max-w-xs"}`}
      />
      <Button type="submit" disabled={submitting} data-testid="button-newsletter-submit">
        {submitting ? "Subscribing…" : "Subscribe"}
      </Button>
    </form>
  );

  if (variant === "card") {
    return (
      <div className="rounded-lg border bg-card p-8">
        <h3 className="text-2xl font-bold">Subscribe to the Newsletter</h3>
        <p className="mt-2 text-muted-foreground">
          Get the latest articles and insights delivered directly to your inbox.
        </p>
        {form}
      </div>
    );
  }

  return <div className="mx-auto flex max-w-md justify-center">{form}</div>;
}
