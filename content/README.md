# Articles

The site is static. Every article in `content/articles/` is built into its own
page when the site is built. There is no CMS and no database for articles.

## Publish an article

1. Put the finished Markdown file in `content/articles/`. It needs this front
   matter above the usual header:

   ```
   ---
   date: 2026-10-02T09:00:00Z
   category: AI & Marketing
   ---

   # The Article Title

   **Meta description:** One or two sentences for search results.

   **URL slug:** `/the-article-slug`
   ```

   Newest `date` shows first on the homepage and the articles page.
2. Build and deploy: `npm run deploy`. Once GitHub auto-deploy is connected,
   pushing to GitHub does this for you.

To unpublish, move the file out of `content/articles/` and deploy again.

## Drafts

`content/drafts/` is git-ignored, so nothing in it reaches the public GitHub
repo. To preview drafts on your own machine, run `npm run build:drafts` and then
`npm run dev:api`. Never deploy a drafts build.
