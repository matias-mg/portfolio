# Matias Medina's portfolio

A static portfolio built with Astro and Tailwind CSS, available in English, Spanish, and Portuguese. It is deployed to [GitHub Pages](https://matias-mg.github.io/portfolio/).

## Getting started

Use Node.js 24 and pnpm 9, matching the deployment workflow.

```sh
pnpm install
pnpm dev
```

The development server runs at `http://localhost:4321`.

```sh
pnpm build        # Build the site into dist/
pnpm preview      # Preview the production build
pnpm astro check  # Check Astro and TypeScript files
```

The GitHub Pages workflow builds with the deployment base path. Translations live in `src/i18n/ui.js`, pages in `src/pages/`, and shared components in `src/components/`.
