#!/usr/bin/env node
// Copies the shared site chrome (partials/nav.html, partials/footer.html) into
// every page between its <!-- chrome:NAME --> and <!-- /chrome:NAME --> markers.
//
//   node scripts/sync-chrome.mjs           rewrite the pages
//   node scripts/sync-chrome.mjs --check   exit 1 if any page has drifted
//
// The one per-page difference is generated, not hand-edited: the nav link that
// points at the page itself gets aria-current="page" (how-it-works.html marks
// href="/how-it-works", and so on; index.html and 404.html mark nothing).
// No dependencies, no build step: the pages stay plain HTML that Vercel serves
// as-is, and CI runs --check on every pull request.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');
const NAMES = ['nav', 'footer'];

const partials = Object.fromEntries(
  NAMES.map((n) => [n, fs.readFileSync(path.join(root, 'partials', `${n}.html`), 'utf8').replace(/\n+$/, '')]),
);

const pages = fs.readdirSync(root).filter((f) => f.endsWith('.html')).sort();

function chromeFor(name, page) {
  let html = partials[name];
  const slug = page.replace(/\.html$/, '');
  if (name === 'nav' && slug !== 'index' && slug !== '404') {
    const href = `href="/${slug}"`;
    html = html.split(href + '>').join(`${href} aria-current="page">`);
  }
  return html;
}

let drifted = 0;
let missing = 0;
for (const page of pages) {
  const file = path.join(root, page);
  const before = fs.readFileSync(file, 'utf8');
  let after = before;
  for (const name of NAMES) {
    const re = new RegExp(`(<!-- chrome:${name} -->\\n)[\\s\\S]*?(\\n[ \\t]*<!-- /chrome:${name} -->)`);
    if (!re.test(after)) {
      console.error(`${page}: no <!-- chrome:${name} --> markers`);
      missing++;
      continue;
    }
    after = after.replace(re, (_, open, close) => open + chromeFor(name, page) + close);
  }
  if (after !== before) {
    drifted++;
    if (check) console.error(`${page}: chrome differs from partials/ (run: node scripts/sync-chrome.mjs)`);
    else {
      fs.writeFileSync(file, after);
      console.log(`${page}: updated`);
    }
  }
}

if (missing || (check && drifted)) process.exit(1);
console.log(check ? `chrome in sync across ${pages.length} pages` : `${drifted} page(s) updated`);
