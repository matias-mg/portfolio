import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import robotsTxt from 'astro-robots-txt';
import { defaultLang } from './src/i18n/ui';

// https://astro.build/config
export default defineConfig({
  site: "https://matias-mg.github.io/portfolio/",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [robotsTxt({
    policy: [
      {
        userAgent: '*',
        disallow: '/cvs/',
        allow: '/',
      }
    ]
  }), sitemap({
    i18n: {
      defaultLocale: defaultLang,
      locales: {
        en: "en",
        es: "es",
        pt: "pt",
      },
    },
    lastmod: new Date(),
  })],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es", "pt"],
  },
  output: 'static',
});
