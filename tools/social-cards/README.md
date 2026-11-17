# Link-preview card and favicon

The image that shows when a link to NewsHub is shared (Open Graph / Twitter card, 1200 × 630),
and the favicon's PNG sizes. They are drawn as HTML and SVG here and rendered to PNG:

- `newshub.html` + `card.css` → `public/og-newshub.png`
- `public/favicon.svg` → `public/favicon-32.png` and `public/apple-touch-icon.png`

Change the HTML, `card.css` or the SVG, then run, with Playwright installed:

```sh
node tools/social-cards/render.mjs
# or with another project's copy of Playwright:
PLAYWRIGHT=<path>/node_modules/playwright node tools/social-cards/render.mjs
```

The tags that use them are in `index.html`. After a deploy, run the page through
LinkedIn Post Inspector so LinkedIn fetches the new card.
