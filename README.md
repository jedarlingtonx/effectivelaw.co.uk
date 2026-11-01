# effectivelaw.co.uk

The Effective Law Group website. Built with [Eleventy](https://www.11ty.dev/) and hosted on Cloudflare (Workers with static assets).

## How it fits together

- `src/` is the whole site. Everything hand-written (pages, `site.css`, `site.js`, `consent.js`, images, icons) is copied to `_site/` exactly as it is.
- **Effective Perspective** (`/effective-perspective/`) is the one generated section. Articles are Markdown files in `src/effective-perspective/articles/`, written through the content manager at `/admin/`, and turned into pages by `src/_includes/article.njk`.
- `src/sitemap.njk` makes `sitemap.xml`, including every published article. When a new hand-written page is added, add it to that file too.
- `wrangler.jsonc` runs `npm run build` and serves `_site/`. Never add a folder called `functions`.

## Adding a hand-written page

Add `src/<folder>/index.html` and copy the header and footer from an existing page. It is published as it is.

## Content manager (Sveltia CMS)

- Lives at `/admin/`, self-hosted from `node_modules/@sveltia/cms` (no third-party CDN).
- Settings are in `src/admin/config.yml`. Articles have a headline, date, author, short summary, optional picture and description, a draft switch and the article text.
- Sign-in uses GitHub, through a small OAuth helper Worker (`base_url` in the config).
- `branch:` in the config decides where saves go. `staging` while testing, `main` for the live site.
- A draft article (`draft: true`) is saved but no page is made for it.

## Local build

```
npm install
npm run build      # writes _site/
npm start          # local preview with live reload
```
