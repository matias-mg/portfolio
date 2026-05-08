import { defineConfig, passthroughImageService } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import robotsTxt from 'astro-robots-txt';
import { defaultLang } from './src/i18n/ui';

// https://astro.build/config
export default defineConfig({
  site: "https://matiasm.com",
  integrations: [tailwind(), robotsTxt({
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
    }
  })],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es", "pt"],
  },
  output: 'static',
});