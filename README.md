# /DH.arc seminars — website template

A production-ready, editorially-styled website for the **/DH.arc seminars**, a recurring
academic seminar series hosted by the DH.arc group at the University of Bologna.

The architecture is built for **annual reuse**: each edition is published in its own
`/<edition-slug>/` folder, and the site **root always redirects to the current edition** — all
inside a single repository served from a single `gh-pages` branch.

- **Stack:** React 18 + JavaScript + Tailwind CSS v3 + Vite
- **No** React Router / client-side routing — one long anchor-scrolled page
- **No** TypeScript
- **Deployment:** GitHub Pages via a manually-triggered GitHub Actions workflow

> The published URLs are derived automatically from your **repo name** at deploy time (from
> `GITHUB_REPOSITORY`), so you don't hardcode them anywhere. If the repo is `dharc-org/dharc-seminars`,
> the current edition lives at `https://dharc-org.github.io/dharc-seminars/<slug>/` and the base
> URL `https://dharc-org.github.io/dharc-seminars/` redirects to it.

---

## The one constraint you must never break: relative asset paths

`vite.config.js` sets **`base: './'`**. This makes Vite emit **relative** asset paths
(`./assets/index.js`, not `/assets/index.js`). It is the single most important setting in the
project: because every edition is served from a **subfolder** (`/<slug>/`), an absolute path
like `/assets/...` would request assets from the domain root and break the page completely.

The same rule applies to data fetches: the program is loaded with
`fetch('./data/program.json')` — **never** `'/data/program.json'`. Keep every asset reference
relative.

---

## 1. Run the project locally

Requires **Node 20+**.

```bash
npm install      # first time only
npm run dev      # start the dev server (Vite prints a localhost URL)
```

Other scripts:

```bash
npm run build    # production build into dist/
npm run preview  # serve the built dist/ locally to sanity-check it
```

### Where things live

| What | Where |
| --- | --- |
| Current edition metadata (name, **slug**, year) | `src/config/edition.js` |
| Past editions (nav dropdown) | `src/config/editions.js` |
| **Program schedule (only runtime data)** | `public/data/program.json` |
| Hero image | `public/hero.webp` |
| Page `<head>`, SEO/Open Graph, Event JSON-LD | `index.html` |
| **Theme — colors & fonts (retheme here)** | `src/styles/theme.css` |
| All other copy (hero, about, committee, footer) | hardcoded in `src/components/*.jsx` |

**Rethemeing:** change the CSS variables in `src/styles/theme.css` and nothing else.
Components reference those variables through Tailwind tokens (`text-accent`, `font-heading`, …)
or `var(--…)` — no component hardcodes a hex value or font name.

---

## 2. First deployment

The site deploys to the `gh-pages` branch and is served by GitHub Pages.

1. **Create the GitHub repo** inside the organisation and push this project to its **`main`** branch.
2. **Allow Actions to write to the repo:**
   `Settings → Actions → General → Workflow permissions → Read and write permissions` → Save.
   (The workflow requests `contents: write`; this per-repo setting must also allow it.)
3. **Run the deploy workflow manually:**
   `Actions` tab → **Deploy edition** → **Run workflow** → run on `main`. This builds the site,
   publishes it into `/<slug>/`, writes the root redirect, and creates the `gh-pages` branch on
   the first run.
4. **Enable GitHub Pages:**
   `Settings → Pages → Build and deployment → Source: Deploy from a branch` →
   Branch: **`gh-pages`**, folder: **`/ (root)`** → Save.
5. After a minute the base URL `https://<org>.github.io/<repo>/` redirects to the current
   edition at `https://<org>.github.io/<repo>/<slug>/`.

> The workflow triggers on **`workflow_dispatch` only** — it never deploys automatically on push.
> You consciously decide when to publish. The repo must be **public** for GitHub Pages on a
> standard plan.

### What the deploy workflow does (each run)

1. Checks out `main`, runs `npm ci` and `npm run build` → `dist/`.
2. Reads the current edition `slug`, `name`, `year` from `src/config/edition.js`.
3. Checks out the existing `gh-pages` branch (or starts a fresh one).
4. **Cleans the branch root**, keeping `.git` and every existing **edition folder** (any
   top-level directory that contains an `index.html`). Past editions are preserved untouched.
5. Replaces `/<slug>/` with the fresh `dist/` build.
6. **Injects absolute URLs:** replaces the `__SITE_URL__` placeholder in the edition's
   `index.html`, `sitemap.xml` and `robots.txt` with `https://<org>.github.io/<repo>/<slug>` —
   so canonical, Open Graph, Twitter and Event JSON-LD URLs are always correct for this edition.
7. Writes the **root redirect** `index.html` (meta-refresh + JS, `noindex`, canonical) pointing
   at `./<slug>/`, plus `.nojekyll` and a `.edition-meta.json` marker.
8. Commits and pushes `gh-pages`.

You never edit the `gh-pages` branch by hand. Re-deploying the **same** slug simply rewrites
that edition's folder (no "already published" error).

---

## 3. Launching a new edition — yearly checklist

Do all of this on `main`, commit, then deploy.

### a) `src/config/edition.js` — set the new edition (required)

```js
export const currentEdition = {
  name: "The New Edition Title",
  slug: "the-new-edition-title",   // ← MUST be new & unique (kebab-case). This is the folder name.
  year: 2027,
  seriesName: "/DH.arc seminars",  // unchanged
};
```

⚠️ The `slug` **must change** every edition — it's the folder each edition lives in and the
target the root redirect points to.

### b) `public/data/program.json` — replace the schedule (required)

Replace the contents with the new edition’s schedule. Schema:

```
days[]              → date (e.g. "05.11.26") + sessions[]
  sessions[]        → label ("morning session") + theme ("…<LEARNING>") + slots[]
    slots[]         → time, type, title, (speaker, abstract, bio)
```

- `type` is one of:
  - `"talk"` / `"keynote"` — `speaker` + `title` (keynote shows an accent left-border)
  - `"break"` — `title` only, muted (no `speaker`)
- Add `abstract` and/or `bio` to a slot to give it an expandable **+/−** toggle in the program.
- Give every `day`, `session`, and `slot` a unique `id`.

### c) `index.html` — refresh the page metadata (recommended)

Update the `<title>`, description, Open Graph/Twitter text, and the Event **JSON-LD** (dates,
location, speakers). The **absolute URLs auto-fill at deploy** via `__SITE_URL__`, so you only
change the *content*, not the links.

Also update the hero/about/committee/footer copy in `src/components/*.jsx`, swap
`public/hero.webp` for new artwork, and retheme via `src/styles/theme.css` if desired.

### d) `src/config/editions.js` — add the edition you’re *replacing*

This powers the **Previous Editions** dropdown. Add **one entry for the now-outgoing edition**,
pointing at its own in-repo slug URL (newest-first):

```js
export const pastEditions = [
  {
    name: "From thought to practice",
    slug: "from-thought-to-practice",
    year: 2026,
    url: "https://<org>.github.io/<repo>/from-thought-to-practice/",
  },
  // older editions stay here too, newest-first
];
```

If `pastEditions` is empty, the dropdown is hidden entirely.

> **Special case — the 2025 edition lives in another repo.** *Building Knowledge Landscapes
> Across the Digital Humanities* was published from a separate repository and is already live at
> its own GitHub Pages URL, so its `editions.js` entry links **directly to that external URL**.
> It's a one-off hardcoded link and does not affect the normal flow.

### e) Deploy

`Actions → Deploy edition → Run workflow` on `main`. The new edition is published at `/<slug>/`,
every past edition folder is preserved, and the **root redirect automatically updates** to point
at the new edition.

### Quick recap

| Step | File | Action |
| --- | --- | --- |
| 1 | `src/config/edition.js` | New `name`, **new unique `slug`**, new `year` |
| 2 | `public/data/program.json` | New schedule (optionally with `abstract`/`bio`) |
| 3 | `index.html` | Refresh title / description / Event JSON-LD content |
| 4 | `src/components/*.jsx`, `public/hero.webp`, `src/styles/theme.css` | New copy / image / theme (optional) |
| 5 | `src/config/editions.js` | Add the edition being replaced (with its `/<slug>/` URL) |
| 6 | — | Run **Deploy edition** workflow manually |

---

## Project structure

```
.
├── public/
│   ├── data/program.json        # the only runtime data file
│   ├── hero.webp                # hero background image
│   ├── favicon.svg  apple-touch-icon.png  og-image.jpg
│   ├── logos/                   # centre / partner logos
│   ├── robots.txt  sitemap.xml  # __SITE_URL__ is injected at deploy
├── src/
│   ├── config/
│   │   ├── edition.js           # current edition metadata
│   │   └── editions.js          # past editions for the nav dropdown
│   ├── components/
│   │   ├── Nav.jsx  Hero.jsx  About.jsx  Program.jsx  Committee.jsx  Footer.jsx
│   ├── styles/theme.css         # CSS custom properties — the single place to retheme
│   ├── App.jsx  main.jsx  index.css
├── index.html                   # <head>, SEO, Event JSON-LD (uses __SITE_URL__)
├── .github/workflows/deploy.yml # manual deploy: /<slug>/ + root redirect
├── vite.config.js               # base: './'  (non-negotiable)
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

### gh-pages layout

```
gh-pages/
├── index.html                       # redirect → current edition
├── .edition-meta.json               # { slug, name, year } of the current edition
├── from-thought-to-practice/        # the 2026 edition (self-contained build)
│   ├── index.html  assets/  data/  hero.webp  og-image.jpg  sitemap.xml  …
└── <future-slug>/                   # each future edition, preserved across deploys
```
