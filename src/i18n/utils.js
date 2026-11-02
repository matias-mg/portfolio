import { ui, defaultLang } from './ui';

const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** @param {URL} url @returns {keyof typeof ui} */
export function getLangFromUrl(url) {
  const pathname = BASE && url.pathname.startsWith(BASE)
    ? url.pathname.slice(BASE.length)
    : url.pathname;
  const [, lang] = pathname.split('/');
  if (Object.hasOwn(ui, lang)) return /** @type {keyof typeof ui} */ (lang);
  return defaultLang;
}

export function useTranslations(lang) {
  return function t(key) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}

export function getLocalizedUrl(lang) {
  return `/${lang !== defaultLang ? `${lang}/` : ''}`
}
