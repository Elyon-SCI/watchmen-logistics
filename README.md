# watchmenlogistics.com

Plain static HTML served by Vercel (`cleanUrls`, headers in `vercel.json`).
No build step: what is in the repo is what ships.

## Editing the header, mobile menu or footer

The site chrome lives once, in `partials/nav.html` and `partials/footer.html`.
Every page carries a copy between `<!-- chrome:nav -->` / `<!-- /chrome:nav -->`
and `<!-- chrome:footer -->` / `<!-- /chrome:footer -->` markers.

1. Edit the partial, never a page's copy.
2. Run `node scripts/sync-chrome.mjs` to write it into every page.
3. Commit the partial and the pages together.

The nav link for the current page gets `aria-current="page"` automatically.
A new page needs the two marker pairs (copy them from any page) before the
script will fill them. CI runs `node scripts/sync-chrome.mjs --check` on every
pull request and fails if a page has drifted from the partials.

## Colours and other tokens

Every colour, border and spacing token is declared once, in the `:root` block
at the top of `site.css`. Pages use `var(--name)`; they do not declare their
own `:root`. Text greys are chosen to pass WCAG AA (4.5:1) on the dark
backgrounds; measure before changing one.
