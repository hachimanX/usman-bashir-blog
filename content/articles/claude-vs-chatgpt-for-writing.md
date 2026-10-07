---
date: 2026-10-02T13:11:42Z
category: AI & Marketing
---

# Claude vs ChatGPT for Writing: I Tested Both on Real Work

**Meta description:** I use both daily. ChatGPT wins for emails and general writing. Claude wins the moment your writing depends on your own data. Here's the honest split.

**URL slug:** `/claude-vs-chatgpt-for-writing`

**Target keyword:** claude vs chatgpt for writing
**Pillar:** AI & Marketing (personal brand)
**Status:** Ready to publish

---

Most comparisons of these two tools ask the wrong question. They line up the same one-line prompt, paste both answers, and declare a winner on prose style.

That test tells you almost nothing, because prose style is the part you were going to edit anyway.

Here is the split I actually landed on after using both on paid client work: **ChatGPT is the better general writing assistant. Claude is the only one of the two that can write from your own data.** Those are different jobs. If you only ever need the first one, the $20 you spend is close to interchangeable. If you need the second one, it is not a close contest - and I will show you exactly where the line falls.

## Where ChatGPT Genuinely Wins

I want to start here, because I use ChatGPT every day and the "Claude is just better" takes are lazy.

**Email is the clearest case.** ChatGPT writes email better than Claude, and it needs less instruction to do it. I think this is a training-data artifact more than anything: it has a very strong internalized sense of what a normal business email looks like - the greeting, the ask, the sign-off, the right amount of warmth. I can type "reply to this, decline politely, leave the door open" and paste a thread, and the first draft is usually sendable.

Claude writes emails that are slightly too considered. It reaches for a more careful register than the situation needs. I end up trimming it back toward something more casual, which is the opposite of the editing problem I have with ChatGPT on long-form.

**Memory is the second case, and it is underrated.** ChatGPT has built up a genuinely useful picture of who I am, what I work on, and how I write. When I open a fresh chat and ask something ambiguous, it resolves the ambiguity in my direction more often than not. That is worth real time across a day of small requests.

**Short, high-volume work in general.** Social captions. Reply drafts. Rewording a paragraph three ways. Anything under a few hundred words where speed matters more than structure. ChatGPT is faster to a usable answer and I do not have to set anything up.

**And one thing that has nothing to do with writing.** ChatGPT has [parental controls](https://openai.com/index/introducing-parental-controls/), which link a parent's account to a teenager's, and a [Trusted Contact](https://openai.com/index/introducing-trusted-contact-in-chatgpt/) feature that can alert a nominated adult if the system detects a conversation indicating serious risk of self-harm. Claude has neither, because Claude is 18+ only - Anthropic does not permit under-18s at all, even with a parent's consent. If the person using this tool is a teenager, that decides it before you get anywhere near prose quality.

If your writing is mostly short-form - and for a lot of people it honestly is - ChatGPT Plus is the correct purchase and you can stop reading.

## Where the Two Stop Being Comparable

Here is the thing almost every comparison misses.

The interesting question is not "which one writes a better paragraph." It is **"which one can write a paragraph that depends on information it has to go and get."**

A real content brief for a client site looks something like this:

- Pull the last 16 months of Search Console data for the domain
- Find the queries where the site ranks between positions 9 and 30 with enough impressions to matter
- Cross-check those against the rank tracker to see which ones are moving
- Read the existing article on that topic
- Read the brand voice file and the pricing file so nothing gets misquoted
- Then write

Six of those seven steps are data retrieval. One of them is writing.

The **ChatGPT chat window** cannot do steps one through six. Upload a CSV you exported by hand and it will read that CSV, but it will not go and get the data itself, and it will not read a folder of your files as context every time it starts.

That is a limit of the chat interface, not of OpenAI. Your ChatGPT Plus subscription also includes **Codex**, an agent that runs on your machine and can do this kind of work - and most subscribers have never opened it.

I use Claude Code, and not out of habit. On this sort of work Claude Code is clearly the stronger agent: it holds far longer sessions without losing the thread, it remembers how a project is set up between sessions, and it runs a script, reads the error, fixes it and runs it again without me driving each step. Codex will handle short, self-contained jobs. It falls behind on the long ones. That is my experience from using both, not a benchmark.

**The real split is not Claude versus ChatGPT. It is chat window versus agent.** If you are comparing prose in two browser tabs, you are comparing the wrong two things.

## What This Looks Like in Practice

I run a content system for a client that helps non-US residents register American companies. The whole thing lives in a folder on my machine.

Inside that folder are scripts that pull from the real sources over their APIs:

| Script | What it pulls |
|---|---|
| `gsc-fetch.py` | Google Search Console search analytics, up to 16 months, by query, page and country |
| `bing-fetch.py` | Bing Webmaster Tools query and page data |
| `nozzle-fetch.py` | Nozzle rank-tracking history, 12 months of positions |
| `ga4-fetch.py` | Google Analytics 4 |
| `striking-distance.py` | Finds the near-miss rankings worth attacking |
| `site-audit.py` | Crawls the live site |
| `link-opportunities.py` | Internal linking gaps |

*Seven scripts, one folder. The point is not that the scripts are clever - it's that the writing tool can run them itself.*

None of that is exotic. They are ordinary Python scripts hitting documented APIs. What matters is what sits on top: Claude Code can run them, read the JSON that comes out, read my brand files, and then draft - in one pass, without me exporting anything.

The `striking-distance.py` one is a good example of why this matters more than it sounds. The standard advice is "filter your pages to average position 9 - 30 and optimize those." That advice is wrong, and I only found out because I could actually look at the data. A page's *average* position is an impression-weighted blend across every query, device and country it appears for. It hides a query ranking at #4 and drags in ones sitting at #60. The script works at the query-and-page pair level instead, with an impressions floor so it does not chase terms nobody searches.

That correction is worth more than any prose-quality difference between the two tools. And I could only make it because the writing tool and the data were in the same place.

## The Honest Scoring

If you asked me to score the two *chat windows* out of ten on the thing I actually get paid for - building a repeatable content workflow that runs on real data - I would give both a low score, because neither chat window can do it.

Score the *agents* instead and the picture changes. Claude Code and Codex both run on your machine and both execute, so it is a fair fight - and Claude Code wins it. I would put it at 9 to 6. It holds long multi-step jobs together, keeps your project setup in memory between sessions, and recovers from its own errors instead of confidently carrying on. Codex is a reasonable tool for short tasks. If the agent is the reason you are paying, it is not a close call.

Now flip it. Score them on "general purpose assistant that knows me and drafts a good email in one shot," and ChatGPT wins comfortably. Maybe 9 to 7.

Both scores are true. They are measuring different products.

| Job | ChatGPT | Claude | Why |
|---|---|---|---|
| Business emails | **Best** | Good | Stronger default register, needs less instruction |
| Short social copy | **Best** | Good | Faster to a usable draft |
| General questions, knows your context | **Best** | Good | Memory across chats is genuinely useful |
| Long-form articles from a brief | Good | **Best** | Holds structure past paragraph six |
| Writing against a style guide | Weak | **Best** | Reads the guide file as context every run |
| Writing from your own analytics | Not in chat - use Codex | Not in chat - **use Claude Code** | Both ship an agent that can fetch; Claude's is better at it |
| Building a repeatable workflow | Codex | **Claude Code** | Included in both plans, opened by almost nobody |

*The gap is zero at the short end. At the systems end there are two gaps: chat window versus agent, and then Claude Code versus Codex - and Claude Code wins the second one clearly.*

## "Custom GPTs Do This Though"

They do not, and this is the most common objection so I want to be specific about why.

A Custom GPT is a saved prompt with some files attached. That is genuinely useful - I have built a few. But the files are static. You upload them, and they sit there until you upload them again. There is no mechanism by which a Custom GPT wakes up, calls the Search Console API with your service-account key, and reads yesterday's numbers.

Claude Projects sit in roughly the same category, to be fair. The real jump is Claude Code, which runs on your machine with access to your files and your terminal. That is the piece that turns "AI that writes" into "AI that does the work before the writing."

If you have compared Custom GPTs to Claude Projects and found them similar, you are not wrong. You have just not tested the thing that actually differs.

## What I'd Tell You to Buy

**If your writing is emails, short copy, and general chat:** ChatGPT Plus at $20/month. Do not overthink it. The memory alone justifies it.

**If you write long-form against a style guide:** Claude Pro at $20/month ($17/month if you pay annually, which is $200 upfront). Claude Code is included in Pro, which most people do not realize.

**If your writing depends on data you own:** Claude Pro, and budget a weekend to set up the fetch scripts. That weekend is the whole return.

**If you are doing this professionally:** I pay for both. They are $40/month combined and they do different jobs. Treating this as a which-one-wins question costs you more than the second subscription does.

**If a teenager will use it:** ChatGPT, on the safety features alone. Claude is not an option here - it is 18+ only.

Prices above are as of August 2026, taken from each company's own pricing page. Both change these more often than you'd expect.

**Want to try Claude Code first?** [This referral link gives you a free week](https://claude.ai/referral/UHw2Yi_K2A). If you subscribe afterwards I get $10 in usage credits - that is all I get, it costs you nothing, and the article says what it says either way.

## Frequently Asked Questions

**Is Claude better than ChatGPT for writing?**
For long-form writing that has to follow a specific structure or style guide, yes. For emails and short copy, no - ChatGPT is better and needs less setup. On fetching your own data before writing, both plans ship an agent that can do it (Claude Code and Codex) and neither chat window can - but Claude Code is the better agent by a clear margin.

**Can ChatGPT read my Google Search Console data?**
Not on its own. You can export a CSV and upload it, and it will read that file. It cannot connect to the Search Console API and pull the data itself.

**Do I need to be a developer to use Claude Code?**
No, but you need to be comfortable with a terminal and willing to learn. If the phrase "run this script" makes you nervous, start with Claude Projects instead and come back to Claude Code later.

**Which one has a better free plan?**
Claude's free plan now includes memory and web search, which closed most of the gap. Neither company publishes an exact message limit - both use rolling windows. Test both before paying.

**Is it worth paying for both?**
If writing is part of your job, yes. $40/month for two tools that are genuinely best at different things is not a difficult call.

---

## Where I Land

The comparison everyone runs - same prompt, two windows, judge the prose - measures the least important thing.

Prose you can edit. What you cannot fix with editing is a tool that has no way to reach the information the writing is supposed to be about.

I still open ChatGPT first most mornings. It is the better assistant. But every piece of client work that has to be *correct* about real numbers goes through Claude, because that is the only one of the two that can go and check.

---

**Related:** [Claude Pro vs ChatGPT Plus](/article/claude-pro-vs-chatgpt-plus) - the same $20, what each plan actually includes, and the family-safety gap. · [How to actually use ChatGPT for marketing](/article/how-to-use-chatgpt-for-marketing) - five workflows with the exact prompts.

**If you're building a content system rather than just drafting in a chat window,** that's most of what I write about here. [Subscribe to the newsletter](#newsletter) and I'll send the setup posts as I publish them - including the Search Console fetch scripts, cleaned up and documented.

---

**Disclosure:** I have no commercial relationship with OpenAI or Anthropic, and I pay for both products at retail. The Claude link above is a personal referral link - if you subscribe after using it, I receive $10 in usage credits. That is the full extent of it.
