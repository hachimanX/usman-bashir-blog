import NewsletterSignup from "../NewsletterSignup";

export default function NewsletterSignupExample() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Inline Variant</h3>
        <NewsletterSignup variant="inline" />
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">Card Variant</h3>
        <NewsletterSignup variant="card" />
      </div>
    </div>
  );
}
