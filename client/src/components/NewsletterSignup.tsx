import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface NewsletterSignupProps {
  variant?: "inline" | "card";
}

export default function NewsletterSignup({ variant = "inline" }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    toast({
      title: "Subscribed!",
      description: "You've been added to the newsletter.",
    });
    setEmail("");
  };

  if (variant === "card") {
    return (
      <div className="rounded-lg border bg-card p-8">
        <h3 className="text-2xl font-bold">Subscribe to the Newsletter</h3>
        <p className="mt-2 text-muted-foreground">
          Get the latest articles and insights delivered directly to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            data-testid="input-newsletter-email"
            className="flex-1"
          />
          <Button type="submit" data-testid="button-newsletter-submit">
            Subscribe
          </Button>
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        data-testid="input-newsletter-email"
        className="max-w-xs"
      />
      <Button type="submit" data-testid="button-newsletter-submit">
        Subscribe
      </Button>
    </form>
  );
}
