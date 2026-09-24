# MedaStaré — website

Static marketing site plus the legal and store-compliance pages for MedaStaré Inc.
No build step: the deployed files are the source files.

## Run it locally

```bash
npm start          # http://localhost:5173
node preview.js    # same thing, without npm
node preview.js 8080
```

`preview.js` mirrors `vercel.json` (`cleanUrls: true`, `trailingSlash: false`), so root-absolute
asset paths and extensionless document links behave exactly as they do in production.

**Do not open `index.html` directly from disk.** Over `file://` the browser resolves `/assets/...`
against your drive root, so the CSS, JS and images all 404 and the page renders unstyled.

## Layout

| Path | What it is |
|---|---|
| `index.html` | Homepage |
| `delete-account.html` | Account-deletion request flow (Google Play / App Store requirement) |
| `assets/v4/` | All production images, `site.css`, `site.js`, favicons |
| `legal.css`, `legal.js` | Shared styling for the legal pages |
| `*.html` (rest) | Legal and policy pages — see below |
| `website/` | Client-supplied source artwork. Not deployed. |
| `assets/*.png`, `hero-*.png` | Source images the `assets/v4/` set is generated from. Not deployed. |

## Legal and compliance pages

These are compliance artifacts. **Do not remove, rename, rewrite or reorganize any of them, or the
links that point to them** — doing so can break a store submission or a commitment already made to a
regulator. Add new pages instead of editing these.

`privacy` · `terms` · `privacy-choices` · `account-deletion` · `delete-account` ·
`ai-data-processing` · `subscription-terms` · `support` · `cookies` · `legal` · `subprocessors` ·
`accessibility` · `copyright` · `community-guidelines` · `stargift-terms` ·
`creator-program-terms` · `creator-payout-schedule` · `contact` (redirects to `support`)

`account-deletion` is the governing policy; `delete-account` is the user-facing request flow that
links to it. Both are required — keep them.

## Before going live

1. **Store URLs.** Paste the live App Store and Google Play links into `STORE_LINKS` at the top of
   `assets/v4/site.js`. Until they are set, every download badge scrolls to the download section.
2. **MedArena copy.** The StarDrop™ / The Staré Prize™ / StarTrip™ descriptions in `index.html` are
   placeholders pending final wording.
3. See `LEGAL_LAUNCH_REVIEW.md` for the outstanding legal confirmations.

## Deployment

Deploy the whole folder to Vercel. `.vercelignore` keeps the source artwork and local tooling out of
the build. Do not deploy `index.html` alone — the app and the store listings depend on the legal
pages shipping with it.
