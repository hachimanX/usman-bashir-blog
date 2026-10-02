---
date: 2026-10-02T13:09:42Z
category: AI & Marketing
---

# How to Actually Use ChatGPT for Marketing (Beyond the Generic Advice)

**Meta description:** Five ChatGPT marketing workflows that work, with the exact prompts. Plus the honest point where ChatGPT stops being the right tool and what to use instead.

**URL slug:** `/how-to-use-chatgpt-for-marketing`

**Target keyword:** chatgpt for marketing
**Pillar:** AI & Marketing (hub article)
**Status:** Ready to publish

---

Almost every article on this topic is a list of prompts. "Write me a social media calendar." "Generate 10 blog title ideas." You paste it in, you get something generic back, and you quietly stop using the tool for anything that matters.

The problem is not the prompts. It is that most people are using ChatGPT for the jobs it is worst at, and not using it for the jobs where it genuinely saves hours.

This article covers five workflows I actually use, with the prompts. Then it covers the ceiling — the specific point where ChatGPT stops being the right tool, which nobody selling you a prompt pack will mention.

## Where ChatGPT Is Genuinely Excellent

### 1. Email, and it is not close

This is the single best use of ChatGPT in marketing and it gets the least attention because it is unglamorous.

ChatGPT has an unusually good internal model of what a normal business email looks like. The register, the length, the sign-off. It needs less instruction here than for anything else, and the first draft is usually sendable.

The prompt that works is not "write a sales email." It is this shape:

> Here is a thread. [paste]
>
> Reply to this. I want to decline the March timeline but keep the project alive for Q3. Warm but not apologetic. Four sentences maximum. Do not open with "I hope this finds you well."

Three things make that work: real context pasted in, a stated outcome rather than a topic, and a length constraint. The last line matters more than you would think — banning specific phrases you hate is the fastest way to fix ChatGPT's default register.

### 2. Turning one asset into many

You wrote something good. Now you need it as a LinkedIn post, a newsletter intro, and three social captions. This is genuine drudgery and ChatGPT removes most of it.

> Below is an article I wrote. [paste full text]
>
> Pull out the single sharpest claim in it — not a summary, the one line that would make someone stop scrolling. Then write a LinkedIn post built around only that claim. Short lines, whitespace between them, no hashtags, no link. Do not summarise the article. End on a question I could answer in the comments.

The instruction that changes the output is "not a summary." Left alone, ChatGPT will summarise, because summarizing is safe. Repurposing well means throwing away 90% of the source and going deep on the remaining 10%.

### 3. Mining reviews for language you would not invent

This is the most underrated one on the list.

Your customers describe their problem in words you have stopped using, because you are too close to the product. Those words are sitting in reviews — yours and your competitors'.

> Below are 40 customer reviews of a competing product. [paste]
>
> Ignore the star ratings. Extract the exact phrases people use to describe the problem the product solved, and the exact phrases they use to describe what frustrated them. Group them by theme. Quote verbatim — do not paraphrase into marketing language.

"Do not paraphrase into marketing language" is doing the heavy lifting. Without it you get "customers value reliability." With it you get the sentence a real person typed, which is what belongs on your landing page.

### 4. Attacking your own copy

ChatGPT is a better critic than it is a writer. Most people never use it this way.

> Here is my landing page copy. [paste]
>
> You are a skeptical buyer who has been burned by three similar products. Read this and list every claim you would not believe, and why. Then list every question it leaves unanswered that would stop you buying. Do not rewrite anything and do not be encouraging.

"Do not be encouraging" is mandatory. ChatGPT's default is to praise your work, which is worse than useless.

### 5. Structured drudgery

Reformatting a messy list into a clean table. Converting notes into a structured brief. Turning a transcript into an outline. Pulling every question out of a long support thread.

Unglamorous, and it works essentially every time. This is where the real time savings are, and nobody writes about it because "ChatGPT tidied my spreadsheet" does not make a good headline.

## Where ChatGPT Stops Working

Here is the part the prompt lists leave out.

Every workflow above shares one property: **all the information is in the chat window.** You pasted the reviews. You pasted the article. You pasted the thread.

Real marketing work is usually not like that. A genuine content brief looks like this:

- Pull the last 16 months of Search Console data for this domain
- Find the queries ranking between positions 9 and 30 with enough impressions to be worth attacking
- Check the rank tracker to see which of those are trending up
- Read the existing article on that topic
- Read the brand voice file so nothing gets misquoted
- Then write

Six data steps, one writing step. **The ChatGPT chat window cannot do the six.** Export a CSV by hand and it will read it, but it will not connect to the Search Console API itself, and it will not re-read your brand files every time it drafts.

Here is the part worth knowing: your ChatGPT Plus subscription already includes **Codex**, an agent that runs on your machine and can. Most people paying for Plus have never opened it. So the ceiling described above is a ceiling of the chat window, not of your subscription.

Worth saying plainly, though: Codex is the weaker of the two agents. Claude Pro includes Claude Code at the same $20, and in my own use it holds far longer sessions, remembers how a project is set up between runs, and fixes its own errors and re-runs without being walked through each step. If you are picking a plan specifically to build this kind of pipeline, that gap matters more than anything else on either pricing page.

Custom GPTs do not solve this either, which is the objection I get most. A Custom GPT is a saved prompt with static files attached. The files sit there until you replace them by hand. There is no point at which one wakes up, authenticates against your analytics, and reads yesterday's data.

## What I Use Instead, and Why

For anything that has to be correct about my own numbers, I use Claude — specifically Claude Code, which runs on my machine and can execute scripts rather than just describe them.

The setup for a client site I run: a folder of ordinary Python scripts that hit documented APIs. `gsc-fetch.py` for Search Console. `bing-fetch.py` for Bing Webmaster Tools. `nozzle-fetch.py` for rank tracking. `striking-distance.py` to find the near-miss rankings worth attacking. None of them are clever. What matters is that the writing tool can run them itself, read the output, read my brand files, and then draft — in one pass, with no manual exports.

That capability is worth more than any difference in prose quality between the two tools. One concrete example: the standard SEO advice is "filter pages to average position 9–30 and optimize those." That advice is wrong. A page's average position is an impression-weighted blend across every query, device and country it appears for, so it hides a query sitting at #4 and drags in ones at #60. I only found that because the tool and the data were in the same place and I could actually look. My script works at the query-and-page-pair level instead, with an impressions floor so it does not chase terms nobody searches.

You cannot arrive at that correction from a chat window.

## The Split, Stated Plainly

| Job | Use |
|---|---|
| Email, replies, outreach | **ChatGPT** |
| Short social copy, captions | **ChatGPT** |
| Repurposing something you paste in | **ChatGPT** |
| Review mining and customer language | **ChatGPT** |
| Critiquing your own copy | **ChatGPT** |
| Long-form against a style guide | **Claude** |
| Anything using your own analytics | **Claude Code** |
| A repeatable workflow rather than a one-off | **Claude Code** |

*The line is not quality. It is whether the information is already in front of the tool or has to be fetched.*

I pay for both. They are $40 a month combined and they do different jobs. Treating this as a which-one-wins question costs more than the second subscription does.

## Three Rules That Improve Every Prompt

Regardless of which tool you use:

1. **Give it context, not a topic.** Paste the real thread, the real reviews, the real draft. A prompt with no input produces the average of the internet, which is exactly what generic AI output is.
2. **State the outcome, not the task.** "Decline the timeline but keep the relationship" beats "write a polite email."
3. **Ban the tics you hate, explicitly.** Naming the phrase is faster than editing it out forever.

## Frequently Asked Questions

**Is ChatGPT good for marketing?**
Genuinely good for email, repurposing, review analysis and critiquing copy. Weak at anything requiring your own live data, because it has no way to fetch it.

**What is the best ChatGPT prompt for marketing?**
There is no best prompt. The pattern that beats any single prompt is: paste real context, state the outcome you want, set a length limit, and name the phrases to avoid.

**Can ChatGPT read my Google Analytics or Search Console?**
Not on its own. You can export a file and upload it. It cannot connect to those APIs and pull data itself.

**Is Claude better than ChatGPT for marketing?**
For work that depends on your own data, yes, and by a wide margin. For email and short copy, no. See [Claude vs ChatGPT for writing](/article/claude-vs-chatgpt-for-writing) for the full comparison, and [Claude Pro vs ChatGPT Plus](/article/claude-pro-vs-chatgpt-plus) if you are deciding which $20 plan to buy.

**Do I need to know how to code?**
For everything in the first half of this article, no. For the Claude Code setup, you need to be comfortable with a terminal. That is a real barrier and worth being honest about.

---

## The Summary

Use ChatGPT for the jobs where the information is already in front of it. It is excellent at those and most people never touch them, because the prompt lists point them at "write a content calendar" instead.

The moment the work depends on data the tool has to go and get, you have hit the ceiling, and no prompt gets you past it.

---

**If the data-fetching part is what you actually need,** Claude Code is included in Claude Pro at $20/month, and [this referral link gives you a free week to try it](https://claude.ai/referral/UHw2Yi_K2A). If you subscribe afterwards I get $10 in usage credits — that is all, and it costs you nothing.

**I write about building marketing systems rather than collecting prompts.** [Subscribe here](#newsletter) — the Search Console fetch setup is going out cleaned up and documented.

---

**Disclosure:** No commercial relationship with OpenAI or Anthropic. I pay for both at retail.
