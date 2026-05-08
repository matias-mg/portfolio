# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio site for Matías Medina, built as a static Astro 4 site. Deployed to GitHub Pages from `main` via `.github/workflows/deploy.yml`. Production URL: `https://matias-mg.github.io/portfolio/`.

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

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/) — concise, lowercase, no trailing period. Format: `type(scope): subject`. Common types in this repo: `feat`, `fix`, `perf`, `chore`, `docs`, `refactor`. Split unrelated changes into separate commits.

**Subject line only by default — no body, no bullet list, no "why" paragraph.** The diff and the subject together should already explain the change. Only add a body when the change references something the diff cannot show (e.g. a specific incident, a constraint imposed elsewhere, a non-obvious tradeoff). If you find yourself restating what the diff shows, delete the body. Keep the subject under ~70 characters.

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

The `taos` library drives most scroll-in animations (the `taos:translate-x-[...] taos:opacity-0` classes). A few non-obvious pieces:

- `tailwind.config.mjs` (loaded by `src/styles/global.css` via `@config`) strips the `taos:` prefix from scanned content (`transform: (content) => content.replace(/taos:/g, '')`) so Tailwind generates the underlying utility classes, and registers `taos/plugin` which adds the `taos:` variant and the base `html.js :where([class*="taos:"]:not(.taos-init))` rule.
- `src/styles/global.css` keeps `!duration-[0ms]` and `!delay-[0ms]` alive via `@source inline(...)` (Tailwind v4's safelist replacement).
- `<script src="/taos.min.js" is:inline defer>` is loaded from `Layout.astro`. The file lives in `public/`, copied from `node_modules/taos/dist/taos.js` — bump it manually when upgrading taos.

Removing or reorganizing those config bits will silently break animations across the site.

### Image handling

`src/components/BlurImage.astro` is the standard `<img>` wrapper. It expects every image to have a `*-small.webp` companion in `public/` (e.g. `profile-pic.webp` ↔ `public/profile-pic-small.webp`) used as a CSS `background-image` placeholder while the full image loads. When adding new images to `src/images/`, generate the corresponding small placeholder in `public/` or `BlurImage` will fail at the regex match.

Astro uses its default sharp image service — images in `src/images/` are compressed at build time. Images in `public/` (small placeholders) are not processed. When adding new images to `src/images/`, commit the original high-quality file and let sharp handle compression.

### Component conventions

- Astro components only. Interactivity lives in inline `<script>` blocks at the bottom of each component (e.g. `Header.astro`, `ImageComparisonSlider.astro`, `Technologies.astro`).
- Section anchors used by the nav: `#about-me`, `#experience`, `#technologies` — keep these IDs stable.
- Job entries are composed: `Experience.astro` → `DoubleImageExperienceContainer` → `BaseJobExperienceContainer` + `ImageComparisonSlider` + `ExperienceCard`. The `right={true|false}` prop flips layout direction and animation origin.
- Tailwind v4 is wired via `@tailwindcss/vite` (in `astro.config.mjs`) plus `src/styles/global.css` imported from `Layout.astro`. The custom `blue` / `gray` / `slate` palette, `font-sans` (Inter variable), and `blob` / `background-scroll` animations live in `global.css` under `@theme` — prefer those tokens over arbitrary hex values to keep the design consistent.
- `tailwind.config.mjs` is reduced to the legacy bridge (content paths + `transform` + `taos` plugin) and is loaded via `@config` in `global.css`. Theme tokens belong in CSS, not the JS config.

## Skills

`.agents/skills/` and `skills-lock.json` are managed by an external skills tool — don't hand-edit either. The local skill set covers Astro, Tailwind, accessibility, SEO, and TypeScript patterns relevant to this repo.
