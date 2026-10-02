# Design Guidelines for usmanbashir.net

## Brand (October 2026). This section overrides anything below it.

The site is an identity site first: someone who searched "Usman Bashir" or clicked an email
signature should see a real, checkable person. Improve this site; do not rebuild it.

- **Theme:** dark by default (`client/index.html` sets it before paint). Light exists only for
  visitors who toggle.
- **Colours** are tokens in `client/src/index.css`. Night Ink `#0A1120` ground, Frost `#E6EDF7`
  text, Slate Mist `#9AA8BF` muted text, and one accent: Signal Aqua `#3CC6F2` (deep blue
  `#0F6AB8` in light mode). Ocean `#1A7BD4` appears only as the second stop in gradients.
  Never add a second accent colour.
- **Type:** Bricolage Grotesque for h1-h3 (applied globally), Geist for body, Geist Mono for
  small labels, Newsreader italic for at most one accent word per headline (`.accent-word`).
- **Shapes:** buttons and pills fully round, cards 16px (`rounded-2xl`).
- **Helpers:** `.brand-glow` (soft wash), `.brand-mark` (gradient: UB mark, portrait halo),
  `.surface-grid` (faded graph-paper texture).
- **Identity data** lives in `shared/person.ts` (Person schema, full legal name as
  `alternateName`, profile links). Homepage copy lives in `shared/home.ts`, which both the
  React page and the worker's crawler HTML read.

The sections below are the original Replit-era brief. Where they conflict with the above
(Inter, light cards, "no hero image"), the above wins.

## Design Approach

**Reference-Based Approach**: Inspired by Detailed.com's clean, content-first aesthetic
- Professional blog design emphasizing readability and authority
- Minimalist approach with focus on typography and content hierarchy
- Clean, spacious layouts that prioritize article content

## Core Design Elements

### A. Typography System
**Font Families:**
- Headlines: Inter or similar modern sans-serif (weights: 600, 700, 800)
- Body text: System font stack optimized for readability (weights: 400, 500, 600)
- Accent/Labels: Same as headlines but smaller sizes

**Hierarchy:**
- Hero Headlines: text-5xl to text-7xl, font-bold
- Article Titles (Cards): text-xl to text-2xl, font-semibold
- Section Headers: text-3xl to text-4xl, font-bold
- Body Text: text-base to text-lg, leading-relaxed (optimal line-height for reading)
- Meta Information: text-sm, font-medium
- CTAs: text-base, font-semibold

### B. Layout System
**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16, 20, 24 (e.g., p-4, mb-8, mt-12, py-20)

**Container Strategy:**
- Homepage/Blog Grid: max-w-7xl with px-4 to px-8 padding
- Article Content: max-w-3xl for optimal reading (65-75 characters per line)
- About Page: max-w-4xl

**Grid Layouts:**
- Article Cards: 3-column grid on desktop (lg:grid-cols-3), 2-column on tablet (md:grid-cols-2), single column on mobile
- Featured content: Can use 2-column layout with one larger featured card

### C. Component Library

**Homepage Components:**
1. **Header/Navigation**
   - Clean horizontal navigation: Logo/Name left, links right (Home, Articles, About)
   - Sticky header with subtle border-bottom
   - Newsletter CTA in header or prominent banner below

2. **Hero Section** (Similar to Detailed.com)
   - Bold headline introducing the blog's focus
   - Subheadline with personal tagline/value proposition
   - Newsletter signup form (email input + subscribe button)
   - Social proof elements: "Join X readers" or similar
   - NO hero image - typography-driven impact

3. **Featured/Latest Articles Grid**
   - Card-based layout with article thumbnail (placeholder or actual image)
   - Article title (prominent, clickable)
   - Excerpt/description (2-3 lines)
   - Meta information: Date, reading time, comment count (displayed but not functional yet)
   - Subtle hover states: slight scale or shadow increase

4. **Testimonials/Social Proof** (Optional but recommended)
   - 2-3 column layout with quotes
   - Attribution with name, title, optional avatar
   - Simple, clean presentation

5. **Footer**
   - Simple 2-3 column layout
   - Newsletter signup (if not in hero)
   - Quick navigation links
   - Social media links
   - Copyright notice

**Article Page Components:**
1. **Article Header**
   - Large, bold title (text-4xl to text-5xl)
   - Meta bar: Publish date, reading time, author name
   - Optional: Featured image with proper aspect ratio (16:9 or 21:9)

2. **Article Content**
   - Generous line-height (leading-relaxed to leading-loose)
   - Proper heading hierarchy (H2, H3 styled distinctively)
   - Blockquotes with left border accent
   - Code blocks with subtle background (if applicable)
   - Lists with proper spacing
   - Links with underline decoration
   - Images with captions

3. **Article Footer**
   - Newsletter CTA
   - "More Articles" section with 3 related/recent articles
   - Comment section placeholder (styling for future integration)

**About Page Components:**
- Hero section with professional headshot (optional)
- Biography in readable column width
- Professional highlights/timeline
- Skills or expertise areas (optional grid)
- Contact/Social links
- Newsletter signup

### D. Visual Treatment

**Card Design:**
- Subtle border or shadow (shadow-sm to shadow-md)
- Clean white/light background
- Generous padding (p-6 to p-8)
- Rounded corners (rounded-lg)
- Hover states: subtle shadow increase

**Buttons:**
- Primary CTA: Solid background, rounded, px-6 py-3
- Secondary: Outline style or subtle background
- All buttons: font-semibold, proper hover/active states

**Forms:**
- Newsletter input: Inline layout (email input + button side by side)
- Clean borders, focus states
- Proper spacing and alignment

**Spacing Philosophy:**
- Generous whitespace between sections (py-16 to py-24)
- Breathing room in cards and components
- Consistent vertical rhythm throughout

### E. Interactions
- Minimal, purposeful animations
- Subtle hover states on cards and links
- Smooth page transitions
- No distracting motion

## Images

**Hero Section**: NO hero image - typography and newsletter signup focused

**Article Cards**: Include placeholder for article thumbnail images (aspect ratio 16:9, use subtle gradients or solid placeholder for now)

**Article Pages**: Featured image at top (full-width or contained within max-w-3xl), optional but recommended

**About Page**: Professional headshot or personal photo (circular or rounded-lg, max-w-xs)

**Quality Note**: All images should be optimized, use responsive srcset when possible