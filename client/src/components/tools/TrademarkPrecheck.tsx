import { useState, useMemo, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

/**
 * Trademark Pre-Check
 *
 * Searches the US federal trademark register live, using the same endpoint the
 * USPTO's own search UI calls:
 *
 *   POST https://tmsearch.uspto.gov/prod-stage-v1-0-0/tmsearch
 *
 * Verified 2026-08-24: returns 200 with CORS open to any origin and no API key.
 * The body is Elasticsearch query DSL.
 *
 * Query shape that works (all verified against live data):
 *   must   → { match_phrase: { wordmark: "<phrase>" } }
 *   filter → { bool: { should: [{ match_phrase: { internationalClass: "IC 025" }}, …],
 *                      minimum_should_match: 1 } }
 *
 *   `{ term: { internationalClass: "IC 025" } }` returns 0 — the field is analysed,
 *   so match_phrase is required. `alive` IS a valid term filter, but we return dead
 *   marks too and badge them, because an abandoned mark is useful context.
 *
 * ⚠️ This is an undocumented internal endpoint with no stability guarantee. It can
 * change shape, rate-limit, or drop CORS at any time. Every call is wrapped and any
 * failure falls back to the manual copy-the-query flow, which always works.
 * Do not remove that fallback.
 *
 * Per-record links use TSDR, which does support deep linking. Verified 2026-08-24.
 */

const API = "https://tmsearch.uspto.gov/prod-stage-v1-0-0/tmsearch";
const UI_URL = "https://tmsearch.uspto.gov";
const TSDR = (serial: string) =>
  `https://tsdr.uspto.gov/#caseNumber=${encodeURIComponent(serial)}&caseType=SERIAL_NO&searchType=statusSearch`;
const MAX_RESULTS = 50;

/** All 45 Nice classes, per the USPTO/WIPO international schedule. */
const CLASSES: [number, string][] = [
  [1, "Chemicals"], [2, "Paints and coatings"], [3, "Cosmetics and cleaning products"],
  [4, "Lubricants and fuels"], [5, "Pharmaceuticals"], [6, "Metal goods"], [7, "Machinery"],
  [8, "Hand tools and cutlery"], [9, "Computers, software, electronics, phone cases"],
  [10, "Medical instruments"], [11, "Lighting, heating and cooking apparatus"], [12, "Vehicles"],
  [13, "Firearms and fireworks"], [14, "Jewellery and watches"], [15, "Musical instruments"],
  [16, "Paper, printed matter, posters, stickers"], [17, "Rubber and plastics"],
  [18, "Leather goods, bags, luggage"], [19, "Non-metallic building materials"], [20, "Furniture"],
  [21, "Housewares, glassware, mugs"], [22, "Ropes, cordage and fibres"], [23, "Yarns and threads"],
  [24, "Fabrics, textiles, blankets"], [25, "Clothing, footwear, headwear"],
  [26, "Lace, ribbons and embroidery"], [27, "Floor coverings"], [28, "Toys, games and sporting goods"],
  [29, "Meat and processed foods"], [30, "Staple foods, coffee, bread"],
  [31, "Agricultural products and live animals"], [32, "Beer and non-alcoholic drinks"],
  [33, "Wines and spirits"], [34, "Tobacco and smokers’ articles"],
  [35, "Advertising, business and retail services"], [36, "Insurance and financial services"],
  [37, "Construction and repair services"], [38, "Telecommunications"], [39, "Transport and storage"],
  [40, "Treatment of materials"], [41, "Education and entertainment services"],
  [42, "Software and scientific services"], [43, "Restaurant and hotel services"],
  [44, "Medical, beauty and agricultural services"], [45, "Legal, security and personal services"],
];

const PRESETS: { label: string; classes: number[] }[] = [
  { label: "Any category", classes: [] },
  { label: "Software or app", classes: [9, 42] },
  { label: "Agency or consulting", classes: [35, 41, 42] },
  { label: "Online store or retail", classes: [35] },
  { label: "Apparel & merchandise", classes: [25, 16, 21, 18, 24, 9] },
  { label: "Food & drink", classes: [29, 30, 32, 43] },
  { label: "Cosmetics & skincare", classes: [3, 5, 44] },
  { label: "Jewellery & accessories", classes: [14, 18, 25] },
];

/** Print and apparel classes — these get the extra copyright checks. */
const DESIGN_CLASSES = [16, 18, 21, 24, 25];

const UNIVERSAL_CHECKS = [
  {
    title: "I tried near-misses.",
    body: "Infringement turns on whether marks are confusingly similar, not identical. Try misspellings, singular and plural, and the name with a word dropped.",
  },
  {
    title: "I searched outside the register.",
    body: "Unregistered common-law rights exist in the US and never appear here. A plain web and social-handle search catches most of them.",
  },
  {
    title: "I thought about other countries.",
    body: "This is the US federal register only. The EU, UK and others are separate registers.",
  },
];

const DESIGN_CHECKS = [
  {
    title: "No brand names anywhere.",
    body: "Including “fits [Brand]” or “inspired by [Brand]” in tags. On marketplaces this is the most common cause of a takedown.",
  },
  {
    title: "No lyrics, quotes or characters.",
    body: "Those are copyright, not trademark, so a clean result here tells you nothing about them. There is no safe word count for lyrics.",
  },
  {
    title: "Fonts are licensed commercially.",
    body: "Free-for-personal-use fonts are not free for products you sell. Check the licence file, not the download page.",
  },
];

type Mark = {
  id?: string;
  wordmark?: string;
  alive?: boolean;
  internationalClass?: string[];
  goodsAndServices?: string[];
  ownerName?: string[];
  registrationId?: string | null;
  filedDate?: string | null;
};

type SearchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done"; total: number; marks: Mark[] }
  | { status: "error"; message: string };

const pad = (n: number) => String(n).padStart(3, "0");
const className = (n: number) => CLASSES.find((c) => c[0] === n)?.[1] ?? "";

export default function TrademarkPrecheck() {
  const [phrase, setPhrase] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [filter, setFilter] = useState("");
  const [showClasses, setShowClasses] = useState(false);
  const [state, setState] = useState<SearchState>({ status: "idle" });
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [note, setNote] = useState("");

  const showDesignChecks = selected.some((n) => DESIGN_CLASSES.includes(n));
  const activeChecks = showDesignChecks
    ? [...UNIVERSAL_CHECKS, ...DESIGN_CHECKS]
    : UNIVERSAL_CHECKS;

  const visibleClasses = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return CLASSES;
    return CLASSES.filter(
      ([n, label]) => label.toLowerCase().includes(q) || pad(n).includes(q),
    );
  }, [filter]);

  /** The field-tag query, used for the manual fallback when the API is down. */
  const manualQuery = useMemo(() => {
    const parts = [`"${phrase.trim()}"`];
    if (selected.length === 1) parts.push(`IC:${pad(selected[0])}`);
    else if (selected.length > 1)
      parts.push(`(${[...selected].sort((a, b) => a - b).map((n) => `IC:${pad(n)}`).join(" OR ")})`);
    parts.push("LD:true");
    return parts.join(" AND ");
  }, [phrase, selected]);

  async function runSearch(e?: FormEvent) {
    e?.preventDefault();
    const p = phrase.trim().replace(/\s+/g, " ");
    if (!p) return;

    setState({ status: "loading" });

    const filters: unknown[] = [];
    if (selected.length) {
      filters.push({
        bool: {
          should: selected.map((n) => ({
            match_phrase: { internationalClass: `IC ${pad(n)}` },
          })),
          minimum_should_match: 1,
        },
      });
    }

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: { bool: { must: [{ match_phrase: { wordmark: p } }], filter: filters } },
          size: MAX_RESULTS,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const marks: Mark[] = (json?.hits?.hits ?? []).map((h: any) => h.source);
      marks.sort((a, b) => Number(b.alive) - Number(a.alive));
      setState({ status: "done", total: json?.hits?.totalValue ?? marks.length, marks });
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Search failed",
      });
    }
  }

  function applyPreset(classes: number[]) {
    setSelected(classes);
    if (phrase.trim() && state.status === "done") runSearch();
  }

  function toggleClass(n: number) {
    setSelected((s) => (s.includes(n) ? s.filter((x) => x !== n) : [...s, n]));
  }

  async function copyManual() {
    try {
      await navigator.clipboard.writeText(manualQuery);
      setNote("Copied. Paste it into the search box that just opened.");
    } catch {
      setNote("Could not copy — select the query above and copy it manually.");
    }
    window.open(UI_URL, "_blank", "noopener");
  }

  function downloadRecord() {
    const p = phrase.trim();
    if (!p) return;
    const now = new Date();
    const L: string[] = [];
    L.push("TRADEMARK PRE-CHECK RECORD", "==========================", "");
    L.push(`Date checked : ${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)}`);
    L.push(`Name checked : ${p}`);
    L.push(
      `Categories   : ${
        selected.length
          ? [...selected].sort((a, b) => a - b).map((n) => `IC ${pad(n)} ${className(n)}`).join("; ")
          : "all 45 (not narrowed)"
      }`,
    );
    L.push("Database     : USPTO public trademark search, US federal register only", "");
    L.push("RESULT", "------");
    if (state.status === "done") {
      L.push(`Total matches : ${state.total}`);
      L.push(`Live marks    : ${state.marks.filter((m) => m.alive).length}`);
      L.push(`Shown         : ${state.marks.length}`);
    } else if (state.status === "error") {
      L.push(`Live search failed (${state.message}). Manual query: ${manualQuery}`);
    } else {
      L.push("No search was run before this record was saved.");
    }
    L.push("", "CHECKLIST", "---------");
    activeChecks.forEach((c) => L.push(`[${checked[c.title] ? "x" : " "}] ${c.title} ${c.body}`));
    L.push(
      "",
      `Completed: ${activeChecks.filter((c) => checked[c.title]).length} of ${activeChecks.length}`,
    );
    L.push("", "NOTE", "----");
    L.push("This is a diligence record, not legal advice and not a legal defence.");
    L.push("A clear result does not rule out unregistered common-law rights, pending");
    L.push("applications, confusingly similar marks, or non-US registrations.");
    L.push("", "Generated with the free pre-check tool at usmanbashir.net");

    const slug =
      p.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "name";
    const blob = new Blob([L.join("\r\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trademark-precheck-${slug}-${now.toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNote("Record downloaded.");
  }

  const liveCount = state.status === "done" ? state.marks.filter((m) => m.alive).length : 0;
  const scope = selected.length
    ? `in ${selected.length} selected ${selected.length === 1 ? "category" : "categories"}`
    : "across all categories";

  return (
    <div className="space-y-10">
      {/* 1 — the name */}
      <section>
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Step n={1} /> The name or phrase
        </h2>
        <form onSubmit={runSearch} className="mt-3 flex flex-wrap gap-2">
          <Input
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            placeholder="e.g. Northbound Coffee"
            aria-label="Name or phrase to check"
            autoComplete="off"
            spellCheck={false}
            className="min-w-[14rem] flex-1"
          />
          <Button type="submit" disabled={state.status === "loading" || !phrase.trim()}>
            {state.status === "loading" ? "Searching…" : "Search"}
          </Button>
        </form>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Check it everywhere it will appear — the product, the company name, the domain, the
          listing title, the tags. Using someone else’s mark for search visibility still counts as
          using it.
        </p>
      </section>

      {/* 2 — categories */}
      <section>
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Step n={2} /> Narrow it to your categories
          <span className="text-xs font-normal uppercase tracking-wide text-muted-foreground">
            optional
          </span>
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Trademarks are registered per category, so a mark registered for software does not
          necessarily block you on coffee. Leave this alone to search all 45.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {PRESETS.map((preset) => {
            const on =
              preset.classes.length === selected.length &&
              preset.classes.every((c) => selected.includes(c));
            return (
              <button
                key={preset.label}
                type="button"
                aria-pressed={on}
                onClick={() => applyPreset(preset.classes)}
                className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm transition-colors ${
                  on
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:border-primary/50"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {selected.length === 0 ? (
            <span className="text-sm text-muted-foreground">Searching all 45 categories</span>
          ) : (
            [...selected]
              .sort((a, b) => a - b)
              .map((n) => (
                <span
                  key={n}
                  className="inline-flex items-center gap-2 rounded-full border border-primary bg-background py-1 pl-3 pr-1 text-xs"
                >
                  {pad(n)} {className(n).split(",")[0]}
                  <button
                    type="button"
                    onClick={() => toggleClass(n)}
                    aria-label={`Remove category ${n}`}
                    className="px-1 text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </span>
              ))
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowClasses((v) => !v)}
          className="mt-4 text-sm font-semibold text-primary hover:underline"
        >
          {showClasses ? "Hide category list" : "Pick categories manually"}
        </button>

        {showClasses && (
          <div className="mt-3">
            <Input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter, e.g. clothing, software, coffee"
              aria-label="Filter categories"
              className="mb-3"
            />
            <div className="max-h-72 overflow-y-auto rounded-md border">
              {visibleClasses.map(([n, label]) => (
                <label
                  key={n}
                  className="flex cursor-pointer items-center gap-3 border-b px-3 py-2 text-sm last:border-b-0 hover:bg-muted/50"
                >
                  <Checkbox
                    checked={selected.includes(n)}
                    onCheckedChange={() => toggleClass(n)}
                  />
                  <span className="w-10 font-mono text-xs text-muted-foreground">{pad(n)}</span>
                  <span>{label}</span>
                </label>
              ))}
              {visibleClasses.length === 0 && (
                <p className="px-3 py-3 text-sm text-muted-foreground">No category matches that.</p>
              )}
            </div>
          </div>
        )}
      </section>

      {/* 3 — results */}
      {state.status !== "idle" && (
        <section>
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Step n={3} /> Results
          </h2>

          {state.status === "loading" && (
            <p className="mt-3 rounded-md border-l-[3px] border-l-primary bg-muted/30 p-4 text-sm">
              Searching the US federal trademark register…
            </p>
          )}

          {state.status === "error" && (
            <div className="mt-3 space-y-4">
              <div className="rounded-md border border-border border-l-[3px] border-l-primary bg-muted/30 p-4 text-sm leading-relaxed">
                <strong className="block">The USPTO search service did not respond.</strong>
                Here is the query to run by hand instead. This always works.
              </div>
              <div className="rounded-md border p-4">
                <code className="block break-words font-mono text-sm">{manualQuery}</code>
                <Button onClick={copyManual} className="mt-3">
                  Copy &amp; open USPTO
                </Button>
              </div>
              <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
                <li>Click the search box and paste.</li>
                <li>
                  If the dropdown says “Wordmark”, change it to{" "}
                  <strong className="text-foreground">“Field tag and Search builder”</strong>.
                </li>
                <li>Press Enter.</li>
              </ol>
            </div>
          )}

          {state.status === "done" && (
            <>
              <div className="mt-3 rounded-md border border-border border-l-[3px] border-l-primary bg-muted/30 p-4 text-sm leading-relaxed">
                {state.total === 0 ? (
                  <>
                    <strong className="block">No matching marks found {scope}.</strong>
                    That is a good sign, not a clearance. Unregistered common-law rights and
                    confusingly similar marks will not show up in this search.
                  </>
                ) : liveCount === 0 ? (
                  <>
                    <strong className="block">
                      {state.total} match{state.total === 1 ? "" : "es"}, none of them live.
                    </strong>
                    Every result below is dead or abandoned. Somebody once thought this name was
                    worth owning, which is worth knowing, but none of them currently blocks you.
                  </>
                ) : (
                  <>
                    <strong className="block">
                      {liveCount} live mark{liveCount === 1 ? "" : "s"} found {scope}.
                    </strong>
                    Read these before you commit to the name. A live registration in a category you
                    are selling into is the one to take seriously.
                  </>
                )}
              </div>

              <div className="mt-4 space-y-3">
                {state.marks.map((m, i) => (
                  <div key={m.id ?? i} className="rounded-md border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-bold">{m.wordmark || "(design mark)"}</p>
                      <Badge variant={m.alive ? "destructive" : "secondary"}>
                        {m.alive ? "Live" : "Dead"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {[
                        m.internationalClass?.join(", "),
                        m.filedDate ? `Filed ${String(m.filedDate).slice(0, 10)}` : null,
                        m.registrationId ? `Reg. ${m.registrationId}` : null,
                      ]
                        .filter(Boolean)
                        .join("  ·  ")}
                    </p>
                    {m.ownerName?.[0] && (
                      <p className="mt-1 text-xs text-muted-foreground">{m.ownerName[0]}</p>
                    )}
                    {m.goodsAndServices?.[0] && (
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                        {m.goodsAndServices[0].length > 180
                          ? `${m.goodsAndServices[0].slice(0, 180)}…`
                          : m.goodsAndServices[0]}
                      </p>
                    )}
                    {m.id && (
                      <a
                        href={TSDR(m.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-xs font-semibold text-primary hover:underline"
                      >
                        Full record on TSDR →
                      </a>
                    )}
                  </div>
                ))}
              </div>

              <p className="mt-3 text-sm text-muted-foreground">
                {state.total > state.marks.length ? (
                  <>
                    Showing the first {state.marks.length} of {state.total} matches. Narrow by
                    category above, or{" "}
                    <a
                      href={UI_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      search on the USPTO site
                    </a>{" "}
                    for the full list.
                  </>
                ) : (
                  "Data from the USPTO public search service."
                )}
              </p>
            </>
          )}
        </section>
      )}

      {/* 4 — checklist */}
      <section>
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Step n={4} /> What this search will not catch
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          A clear result is necessary, not sufficient. Tick each of these off honestly.
        </p>
        <ul className="mt-4 space-y-1">
          {activeChecks.map((c) => (
            <li key={c.title}>
              <label className="flex cursor-pointer items-start gap-3 rounded-md p-2 hover:bg-muted/50">
                <Checkbox
                  className="mt-0.5"
                  checked={!!checked[c.title]}
                  onCheckedChange={(v) =>
                    setChecked((s) => ({ ...s, [c.title]: v === true }))
                  }
                />
                <span className="text-sm leading-relaxed text-muted-foreground">
                  <strong className="text-foreground">{c.title}</strong> {c.body}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      {/* 5 — record */}
      <section>
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Step n={5} /> Keep a record
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          If a complaint ever lands, showing you checked before you launched is worth having.
          Downloads a dated text file including what the search returned.
        </p>
        <Button variant="outline" onClick={downloadRecord} disabled={!phrase.trim()} className="mt-3">
          Download my check record
        </Button>
        {note && <p className="mt-3 text-sm text-primary">{note}</p>}
      </section>

      <p className="border-t pt-6 text-sm leading-relaxed text-muted-foreground">
        <strong className="text-foreground">This is not legal advice.</strong> It is a research
        shortcut using the USPTO’s public search service. A clear result does not mean a name is
        free to use — unregistered common-law rights, pending applications, confusingly similar
        marks and non-US registrations are all outside what this covers. For anything you are about
        to build a business on, pay an attorney.
      </p>
    </div>
  );
}

function Step({ n }: { n: number }) {
  return (
    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
      {n}
    </span>
  );
}
