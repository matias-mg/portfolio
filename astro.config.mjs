import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import { defaultLang } from './src/i18n/ui';

// https://astro.build/config
export default defineConfig({
  site: "https://matias-mg.github.io",
  base: "/portfolio",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap({
    i18n: {
      defaultLocale: defaultLang,
      locales: {
        en: "en",
        es: "es",
        pt: "pt",
      },
    },
  })],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es", "pt"],
  },
  output: 'static',
});
