# Learning Buddy

A fun, friendly learning app for young children (ages 3–7, speech-delay friendly).
Single-file offline PWA — Chinese, English, Maths, Science, Speech/Phonics, and more.

## Deploy

This is a static site. Any static host works.

**GitHub Pages:** repo → Settings → Pages → Branch: `main`, folder `/ (root)` → Save.
You'll get a URL like `https://<username>.github.io/<repo>/`.

**Vercel:** import the repo; no build step needed (it's static).

## Files

- `index.html` — the whole app
- `sw.js` — service worker (offline cache)
- `manifest.json` — PWA manifest (installable)
- `privacy.html` — privacy policy (fill in the `[INSERT...]` blanks first)
- `icon-*.png`, `apple-touch-icon.png` — app icons

## Updating

**Every time you upload a new `index.html`, bump the cache version first:**
open `sw.js` and change `const CACHE_VERSION = 'v3'` to `'v4'`, etc.
Without this, devices that already opened the app keep showing the old cached version.

## Note

Educational practice tool for young children — not a clinical speech-language assessment.
