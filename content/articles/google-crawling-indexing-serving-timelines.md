---
date: 2026-10-08T19:00:00Z
category: Technical SEO
---

# Google Crawling, Indexing, and Serving Timelines: What the Internal Data Proves

**Meta description:** Google just revealed how long crawling, indexing, and ranking changes take internally. Here is what the 20-hour discovery vs. 30-day refresh gap means for your site.

**URL slug:** `/google-crawling-indexing-serving-timelines`

**Target keyword:** google crawling indexing serving timelines
**Pillar:** Technical SEO & Digital Marketing Strategy (usmanbashir.net)
**Status:** Ready to publish

---

For twenty years, SEOs answered every timeline question with the same maddening cop-out: *"It depends."*

When a founder asked why a rewritten landing page hadn't indexed, or why a domain move was crawling through its fourth month, nobody had official numbers to point to. We explained that Google is a distributed system, that queues exist, that PageRank has to recalculate, and that everyone needs patience. 

That changed in Barcelona at **Google Search Central Live**. 

In a room of search practitioners, Google’s **Gary Illyes** put up slides showing Google’s internal processing clocks across every major milestone of **crawling**, **indexing**, and **serving**.

As Gary later told Barry Schwartz:
> *"Mind that this was an exercise to see if the audience can relate to the numbers we pulled internally and put in those slides."*

Credit where it belongs: this isn't my original research. The numbers come straight from Google's engineering data presented by Gary Illyes, John Mueller, and Cherry Sireetorn Prommawin. John Campbell, Head of Innovation & AI at [We Are ROAST](https://weareroast.com), broke the details in his [Day 3 Barcelona recap](https://weareroast.com/news/google-search-central-live-deep-dive-barcelona-day-3-recap/). Barry Schwartz published the complete data tables on [Search Engine Roundtable](https://www.seroundtable.com/google-crawling-indexing-serving-data-42225.html), and Chris Long at Nectiv kicked off a sharp debate on [LinkedIn](https://www.linkedin.com/posts/chris-long-marketing_holy-moly-seos-google-just-gave-us-a-goldmine-share-7513587278787584000-9K1O/).

Here is what the numbers actually reveal, why delays stack up, and how you should run your technical SEO in light of them.

---

## The First Rule: Google’s Pipeline Is Sequential

Before looking at any single row, keep Gary Illyes’ main caveat in mind: **Google's pipeline is strictly sequential.**

```
[ 1. Discovery / Crawl ] ──▶ [ 2. Render & Parse ] ──▶ [ 3. Canonicalize & Index ] ──▶ [ 4. Score & Serve ]
```

A page cannot be rendered until it has been fetched. It cannot be indexed until it has cleared the rendering queue. And it cannot appear in ranking algorithms until it is committed to the index. 

If your JavaScript bundles add a three-week delay at stage two, every downstream step—structured data ingestion, canonical clustering, and snippet generation—gets pushed back by that exact amount of time.

Let's look at each stage.

---

## 1. Crawling: The 20-Hour Discovery vs. 30-Day Refresh Paradox

The crawling numbers reveal a stark imbalance: **Google finds a new page in about 20 hours, but takes roughly 30 days to revisit an existing one.**

![Google Crawling and Indexing Timelines](/images/google-search-timelines-table.png)
*Google's internal crawling and indexing timelines presented at Search Central Live Barcelona.*

### Official Crawling Timelines

| Process | Typical | Slowest | What This Means in Practice |
| :--- | :--- | :--- | :--- |
| **Discovery (new URL)** | **~20 hours** | Weeks to never | Google hunts aggressively for new links across the web. |
| **Refresh (known URL)** | **~30 days** | Weeks to never | Once a URL is known, Google conserves crawl budget and leaves it alone. |
| **Sitemap processing** | **~24 hours** | Up to 14 days, or never (quality) | Your fastest direct lever to cut the 30-day wait. |
| **robots.txt update** | **~24 hours** | 25 hours | Remarkably consistent across global caches. |
| **Crawl capacity update** | **4 hours to 1–2 weeks** | 1–3 weeks (in recovery) | Adjusts dynamically based on origin server health. |
| **Crawl demand update** | **~20 hours** | Weeks to months | Driven by user interest, query volume, and brand search. |

> **Google’s warning:** *Crawl capacity can drop in seconds when Google backs off, e.g. if your server struggles.*

### Why the Discovery vs. Refresh Gap Matters

The gap between a 20-hour discovery and a 30-day refresh caught the entire industry by surprise. 

Why does Google discover new pages so fast while ignoring updates to old ones?

Because Google’s scheduler allocates compute where it produces the highest return. It sweeps continuously for net-new information to expand its index. But for a page it already knows, Google assumes the content is static until proved otherwise.

As **Sanjay Ananda Behera** pointed out in the LinkedIn discussion:
> *"A known page is refreshed in about 30 days. The full table also says a title change shows in 1 to 2 days. So the real wait for an on-page change can be a month, unless you prompt the recrawl. The lever is in the same table: Sitemaps are processed in about 24 hours. An honest `<lastmod>` on changed pages is the cheapest way to cut that month down."*

If you rewrite a title tag or revamp a key landing page, sitting around waiting for Google’s 30-day cycle is a mistake. 

To get that page recrawled in 24 hours:
1. Update the XML sitemap with an accurate `<lastmod>` timestamp.
2. Link to the updated URL from a frequently crawled hub (like your homepage or latest blog post).
3. For single critical URLs, submit them through the Search Console URL Inspection tool.

### The Server Trap: Capacity Drops in Seconds

Google's note on server capacity is one every developer should pin to their desk: **crawl capacity drops in seconds, but takes one to three weeks to recover.**

Developer **Muhammad "Riz" Rizwan** explained the operational mechanics:
> *"Crawl capacity drops in seconds and comes back in weeks, and that asymmetry is a server property rather than a content one. What sets it is response time during your worst hour, and almost every monitoring setup I inherit reports a weekly average, which is the exact number that hides a bad Monday morning. Pull p95 for the hour your traffic actually peaks, then put it next to the figure you'd quote if a client asked how fast the site is."*

If your origin server returns 503s or response times spike during peak traffic, Googlebot chokes its crawl rate immediately to avoid crashing your site. Restoring that throughput isn't instant—it takes weeks of consistent, fast responses. 

Keep origin response times under 300ms, use edge caching via Cloudflare or Fastly, and monitor your 95th-percentile (p95) latency during peak traffic hours.

---

## 2. Indexing: The JavaScript Holding Pen & Site Migrations

Once Google fetches the HTML, the document enters the indexing pipeline. Here, the difference between plain HTML and heavy JavaScript becomes glaring.

### Official Indexing Timelines

| Process | Typical | Slowest | What This Means in Practice |
| :--- | :--- | :--- | :--- |
| **Rendering** | **Seconds to render, hours in the queue** | Days to weeks | Headless Chromium executes scripts only after clearing a holding queue. |
| **Meta annotations** | **45–90 minutes** | 1–4 days | Extraction of `<title>`, meta robots, and descriptions. |
| **Link annotations** | **Minutes to 1–3 weeks** | Months | Feeding internal and external links into the link graph. |
| **Indexing (end to end)** | **~1.5 hours** | Months or never (quality) | Fast execution once quality validation passes. |
| **Removal** | **1–3 weeks** | Months | Natural de-indexing of 404/410/noindex URLs. |
| **Canonicalisation change** | **1–3 weeks** | Months (conflicting signals) | Re-evaluating rel=canonical shifts and cluster primaries. |
| **Site move** | **1–3 months** | 6 months to 1 year+ | Full re-calculation of entity trust and historical link equity. |
| **Structured data updates** | **Hours to 1–2 weeks** | Weeks or never (quality) | Schema validation and rich result eligibility. |
| **Images processing** | **Hours to days** | Weeks to months | Visual feature extraction and image indexation. |
| **Videos processing** | **Hours to days** | Weeks to months (deep analysis) | Multimodal transcripts and key moments analysis. |

> **Google’s note:** *End to end means all the critical processes finish successfully. A small site move can be done in a few weeks.*

### The Real Cost of Client-Side Rendering

Notice how Google describes rendering: *"Seconds to render, hours in the queue."* At its slowest, rendering drags out to *"Days to weeks."*

Google renders pages using headless Chromium, and Chromium requires massive compute. 

When your site uses Server-Side Rendering (SSR) or Static Site Generation (SSG), Google parses your content on the initial crawl. 

When your site relies on pure Client-Side Rendering (CSR), Google fetches a blank HTML shell with script tags. That URL enters a holding pen until headless browser compute frees up. 

If your pages are commercial, client-side rendering introduces an unnecessary multi-day handicap.

### The Migration Reality: 1 to 3 Months (Up to a Year)

If you have ever planned a domain migration, bookmark this row: **site moves take 1 to 3 months typically, and 6 months to over 1 year when signals conflict.**

Three senior practitioners confirmed this in the LinkedIn discussion:
- **Casey Yandle III** (*SEO Director*): *"So far, this past year, every site move each client has done has taken at least 6 months for the site move to be complete."*
- **Seth Nickerson** (*VP, SEO at IDX*): *"The best way to ensure it takes 1-3 months is to complete a mistake-free migration. Botch that, and it can take up to a year to recoup."*
- **Apoorv Sharma** (*DerivateX*): *"Site moves is the number I'd put in front of anyone running growth experiments on their main domain... Getting hit by a spam update is quick (1-2 days). Moving away from it is 1 to 3 months on a good day, and Google's own range goes past a year."*

If you are planning a rebrand, platform migration, or URL restructuring ahead of Q4, do not start it in October. Give yourself at least three months of runway.

---

## 3. Serving: Core Update Recovery vs. 1-Day Spam Updates

Serving is the phase where indexed content gets scored, matches search intent, and displays in search results.

### Official Serving Timelines

| Process | Typical | Slowest | What This Means in Practice |
| :--- | :--- | :--- | :--- |
| **Removal in Search Console (owner)** | **~2 hours** | 24 hours | Fast-track URL eviction from active search serving. |
| **Snippet update** | **1–2 days** | Several weeks to months | Re-evaluating text snippets after page edits. |
| **Title update** | **1–2 days** | Several weeks to months | Showing updated title tags in SERP listings. |
| **Text result image update** | **1–2 weeks** | Several weeks to months | Pairing image thumbnails with text listings. |
| **Manual action removal** | **1–2 weeks** | 4–6 weeks (longer for dormant sites) | Human review turnaround on reconsideration filings. |
| **Core update recovery** | **3–6 months to recover** | 6 months to 1 year (next core update) | Broad algorithmic quality re-indexing cycles. |
| **Spam update change** | **1–2 weeks (continuous)** | Months (batch refreshes) | Algorithmic spam classifiers updating continuously. |

> **Google’s note:** *Core updates take 2–4 weeks to roll out. Spam updates roll out in 1–2 days.*

### Why Core Update Recovery Takes 3 to 6 Months

If a core update hits your site, you cannot fix it with a weekend sprint.

Google’s typical recovery window is **3 to 6 months**. At its slowest, a site stays depressed until the next core update rolls out—**6 to 12 months later**.

As **Guilherme Hortinha** (*Founder @ Index Lab*) and **Muhammed Rıza Mimaroğlu** pointed out:
> *"Core update recovery taking 3-6 months with some sites waiting for the next update is the number that should be in every client proposal and kickoff deck. Most of the panic after an update comes from expecting a fix to show up in weeks."*

Core updates evaluate holistic, site-wide quality over extended observation windows. Refreshing five articles and fixing three broken links will not trigger an immediate reversal. You need sustained quality improvements across months before the next algorithmic sweep recognizes the change.

### 40 Billion Pages a Day Filtered

Gary Illyes shared a staggering metric during the event: **Google filters out 40 billion spam pages every day.**

Because generative AI makes churning out commodity text practically free, the web is flooded with low-effort content. Google responded by accelerating its spam defenses:
- **Spam updates roll out in 1 to 2 days** (compared to 2 to 4 weeks for Core Updates).
- Classifiers run continuously to catch scaled programmatic abuse.

Notice how the word **"never"** appears in the "Slowest" column for several processes:
- *Discovery: "Weeks to never"*
- *Refresh: "Weeks to never"*
- *Indexing: "Months or never (quality)"*

When Google says "never," it is not an infrastructure bug. It is a quality gate. If your content lacks firsthand research, original imagery, and genuine utility, Google’s systems simply refuse to spend resources indexing it.

---

## What Google Revealed About AI Search & Discover

Beyond the timeline tables, the presentations in Barcelona cleared up several debates about AI search:

1. **"AI on Google is Just SEO."**  
   Gary Illyes pushed back against the hype surrounding GEO (Generative Engine Optimization):  
   > *"AI features in Google Search use exactly the same processes as traditional results. We didn't need a new acronym for mobile-first indexing or structured data, and we likely don't need one for AI on Search."*  
   If your page isn't crawled, rendered, and indexed in the core database, it cannot appear in an AI Overview. Standard technical SEO is the foundation of AI visibility.

2. **Google Discover Image Standards.**  
   Google Trust & Safety analyst Eric Murillo shared the non-negotiable image criteria for Google Discover:
   - Minimum width: **1,200px**
   - Total pixels: **300,000+**
   - Aspect ratio: **16:9**
   - Required meta tag: `max-image-preview:large`
   - Avoid generic logos or text-heavy graphics.

3. **Query Understanding & Fan-Out.**  
   John Mueller explained that in AI search experiences, Google's LLM generates multiple "fan-out" queries to pull diverse sources from the search index. Each fan-out query still runs through traditional retrieval and ranking.

---

## The Strategic Playbook: 5 Directives for Your Site

With Google's internal timelines public, here is how you should run your search strategy:

1. **Use Google’s Own Numbers to Set Expectations.**  
   Stop letting clients or managers invent deadlines. Quote Google's documented ranges:
   - *Title updates:* 1–2 days after recrawl.
   - *Site migrations:* 1–3 months typical, up to 1 year.
   - *Core update recovery:* 3–6 months minimum.

2. **Automate XML Sitemaps with Reliable `<lastmod>` Dates.**  
   Because Google’s default refresh cycle averages 30 days, relying on automatic recrawls wastes time. Sitemaps are processed in ~24 hours. Ensure your CMS outputs accurate `<lastmod>` timestamps whenever content changes.

3. **Monitor Peak Hour p95 Server Latency.**  
   Crawl capacity drops in seconds when origin servers struggle. Weekly uptime averages hide traffic spikes. Watch your 95th-percentile (p95) response times during peak hours and keep latency under 300ms.

4. **Plan Site Moves with a 90-Day Buffer.**  
   Never schedule a CMS or domain migration immediately before a key revenue season. Give your team at least three months for Google to consolidate canonical signals and recalculate link equity.

5. **Pass the Quality Gate.**  
   When pages sit in *"Discovered – currently not indexed,"* the issue is rarely robots directives. It is almost always content quality. Provide firsthand data, original testing, and clear value that an AI summary cannot replace.

---

## Sources & Credits

- **John Campbell (We Are ROAST):** [Day 3 Barcelona Recap](https://weareroast.com/news/google-search-central-live-deep-dive-barcelona-day-3-recap/) · [Google Inspection API Tool](https://weareroast.com/resources/tools/google-inspection-api-tool/) · [LinkedIn Post](https://www.linkedin.com/feed/update/urn:li:activity:7511830814138011648/)
- **Barry Schwartz (Search Engine Roundtable):** [Google: How Long It Takes Google Search For Crawling, Indexing & Serving](https://www.seroundtable.com/google-crawling-indexing-serving-data-42225.html)
- **Chris Long (Nectiv):** [LinkedIn Viral Breakdown & Discussion](https://www.linkedin.com/posts/chris-long-marketing_holy-moly-seos-google-just-gave-us-a-goldmine-share-7513587278787584000-9K1O/)
- **Google Speakers:** Gary Illyes, John Mueller, Cherry Sireetorn Prommawin, Duy Nguyen, Eric Murillo, Alex Jansen, Ariel Kroszynski.
- **Industry Contributors:** Wasim Sheikh, Ryan Edwards, Sanjay Ananda Behera, Muhammad "Riz" Rizwan, Amit Tiwari, Casey Yandle III, Seth Nickerson, Apoorv Sharma, Guilherme Hortinha, Hassaan Khalil, and Muhammad Hamza Munir.

---
*Published on [usmanbashir.net](https://usmanbashir.net)*
