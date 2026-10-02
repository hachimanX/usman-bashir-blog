# Content rules for usmanbashir.net

Read this before editing any copy on the site. These are decisions Usman has
already made. Do not undo them.

## What the site is for

An identity site. Someone who searched "Usman Bashir", or clicked the link in
his email signature, should land on a real, checkable person. It is not a
sales or lead-generation page. People can get in touch, but the copy should not
pitch.

## Already rejected: do not bring back

1. **Headlining a growth tactic.** No hero or meta copy built around "articles
   that rank and free tools people bookmark". That is his strategy, not his
   pitch. The hero says who he is and what he works on, in general terms: SEO,
   marketing, content, building with AI.
2. **Turning chat context into copy.** Things Usman explained privately (why he
   wants the site, how he does outreach) are background. Lines like "If I
   emailed you, that was really me" were removed for this reason.
3. **Claims nobody has confirmed.** Only state facts already on the About page
   or confirmed by Usman. Check before writing roles or titles such as
   "leading content and organic search at StartFleet" or "my agency... I direct
   the growth".
4. **Copying zainameen.com.** It was the design reference, not a copy source.
   Avoid its phrasing: "No vanity metrics", "minus the second full time job",
   "without the keyword soup", "Tell me what's stuck".
5. **AI-sounding copy.** No em dashes in site copy. No "battle-tested", "no
   fluff" / "zero fluff", "unlock", "elevate", "seamless", "leverage", "game-changer",
   or the "it's not just X, it's Y" construction. Full list in WRITING-GUIDE.md
   (in the writing workspace).
6. **Naming private projects.** His side projects stay unnamed. Anonymised
   screenshots are fine; names and domains are not.
7. **Dates on proof screenshots.** Captions say what a screenshot is, not when
   ("Google Search Console", not "Google Search Console, April 2024").
8. **"Client" as an attribution.** Unnamed reviewers lead with the work:
   "3-month SEO content contract" over "Review on Upwork".
9. **Editing testimonials.** Keep whole sentences verbatim. Cut sentences
   rather than reword them. Drop numbers nobody can check ("2X or 3X your
   growth").
10. **Graphs he does not remember.** Only post proof from projects he can
    explain if asked.
11. **His full name in copy.** Use "Usman Bashir". The legal name "Muhammad
    Usman Bashir" lives only in the schema (alternateName) and one line on
    About.

## Where the copy lives

| What | File |
|---|---|
| Homepage text (hero, work areas, results, contact) | `shared/home.ts` |
| Testimonials and the video review | `shared/testimonials.ts` |
| Terms, Privacy, Affiliate Disclosure | `shared/legal.ts` |
| About page | `client/src/pages/About.tsx` |
| Tools list | `client/src/lib/tools.ts` |
| Articles | `content/articles/*.md` (see `content/README.md`) |

Design and colours are settled (top of `design_guidelines.md`). Content edits
should not touch them.
