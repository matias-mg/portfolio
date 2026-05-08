# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio site for Matías Medina, built as a static Astro 4 site. Deployed to GitHub Pages from `main` via `.github/workflows/deploy.yml`. Production URL: `https://matiasm.com`.

Stack: Astro + Tailwind CSS + vanilla TypeScript/JS in `<script>` blocks (no React/Vue). pnpm is the package manager (see workflow), though `package.json` scripts call `astro` directly.

## Commands

```sh
pnpm install        # install
pnpm dev            # dev server on localhost:4321
pnpm build          # production build to ./dist
pnpm preview        # preview the built site
pnpm astro check    # type-check Astro files
```

There is no test suite, no linter, and no formatter wired up — don't invent commands for them.

## Architecture

### i18n is the spine of the routing

Three locales: `en` (default, no prefix), `es` (`/es/`), `pt` (`/pt/`). Configured in `astro.config.mjs` and `src/i18n/ui.js`.

- All page text lives in `src/i18n/ui.js` as a single `ui` object keyed by locale, accessed via `useTranslations(lang)('key')` from `src/i18n/utils.js`.
- `getLangFromUrl(Astro.url)` reads the locale from the pathname; every component that renders text calls this directly rather than receiving `lang` as a prop.
- Locale-specific entry points (`src/pages/index.astro`, `src/pages/es/index.astro`, `src/pages/pt/index.astro`) are near-duplicates that import the same shared components — the components figure out the locale themselves. When adding a new section, no per-locale duplication is needed beyond translation keys.
- The root `index.astro` runs a client-side `navigator.language` redirect on first visit (gated by `sessionStorage.hasRedirected`).
- **Adding a locale** requires four edits: `languages` + `ui` in `src/i18n/ui.js`, the `locales` array in `astro.config.mjs` (and the sitemap `i18n.locales` map), and a new `src/pages/<locale>/index.astro`.

### Static assets and the GitHub Pages base path

`output: 'static'` plus the deploy workflow passes `--base "${{ steps.pages.outputs.base_path }}"` to `astro build`. Anything referenced by absolute path in client-rendered HTML must be prefixed with `import.meta.env.BASE_URL` — see `src/components/Technologies.astro` where every `iconRoute` is built as `${base}/icons/...`. Astro's `<Image>` and bundler-resolved imports handle the base automatically; raw `src="/foo"` strings do not.

PDFs in `public/cvs/` are blocked from indexing via `astro-robots-txt`. Only `EN` and `ES` CVs exist; `Hero.astro` falls back PT → ES (`buildCVLanguageFlag`).

### Scroll animations via `taos`

The `taos` library drives most scroll-in animations (the `taos:translate-x-[...] taos:opacity-0` classes). Two non-obvious pieces:

- `tailwind.config.mjs` strips the `taos:` prefix from scanned content (`transform: (content) => content.replace(/taos:/g, '')`) so Tailwind generates the underlying utility classes.
- `safelist` keeps `!duration-[0ms]`, `!delay-[0ms]`, and the `:where([class*="taos:"]:not(.taos-init))` selector alive.
- `<script src="/taos.min.js" is:inline defer>` is loaded from `Layout.astro`. The file lives in `public/`, not as a dependency.

Removing or reorganizing those config bits will silently break animations across the site.

### Image handling

`src/components/BlurImage.astro` is the standard `<img>` wrapper. It expects every image to have a `*-small.webp` companion in `public/` (e.g. `profile-pic.webp` ↔ `public/profile-pic-small.webp`) used as a CSS `background-image` placeholder while the full image loads. When adding new images to `src/images/`, generate the corresponding small placeholder in `public/` or `BlurImage` will fail at the regex match.

`astro.config.mjs` uses `passthroughImageService` — Astro does not re-encode images at build time, so dimensions/format are whatever you commit.

### Component conventions

- Astro components only. Interactivity lives in inline `<script>` blocks at the bottom of each component (e.g. `Header.astro`, `ImageComparisonSlider.astro`, `Technologies.astro`).
- Section anchors used by the nav: `#about-me`, `#experience`, `#technologies` — keep these IDs stable.
- Job entries are composed: `Experience.astro` → `DoubleImageExperienceContainer` → `BaseJobExperienceContainer` + `ImageComparisonSlider` + `ExperienceCard`. The `right={true|false}` prop flips layout direction and animation origin.
- Tailwind theme defines a deliberate `blue` / `gray` / `slate` palette in `tailwind.config.mjs` — prefer those tokens over arbitrary hex values to keep the design consistent.

## Skills

`.agents/skills/` and `skills-lock.json` are managed by an external skills tool — don't hand-edit either. The local skill set covers Astro, Tailwind, accessibility, SEO, and TypeScript patterns relevant to this repo.
