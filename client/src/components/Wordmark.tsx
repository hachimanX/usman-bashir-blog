interface WordmarkProps {
  className?: string;
}

/**
 * The site wordmark: the UB logo plus the full name. Single source of truth
 * for the header and footer.
 *
 * The full name is spelled out rather than "Usman." because this site exists
 * to be the page that answers a search for that name. The favicon uses the
 * flatter app-icon variant of the mark, which survives being shrunk to 16px.
 */
export default function Wordmark({ className = "text-lg" }: WordmarkProps) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 font-display font-semibold tracking-tight ${className}`}
    >
      <img
        src="/ub-logo.png"
        alt=""
        aria-hidden="true"
        width={45}
        height={32}
        className="h-8 w-auto shrink-0"
      />
      Usman Bashir
    </span>
  );
}
