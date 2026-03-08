import { createI18n } from 'sveltekit-i18n';

/** Supported languages */
const LOCALES = {
  de: { name: 'Deutsch', fallback: true },
  it: { name: 'Italiano', fallback: false },
  en: { name: 'English', fallback: false },
  ld: { name: 'Ladin', fallback: false }
};

type Locale = keyof typeof LOCALES;

/** Load locale files */
const loadLocale = (locale: Locale) => import(`./locales/${locale}.json`);

/** i18n configuration */
const config = {
  loaders: [
    { locale: 'de', key: 'common', loader: () => loadLocale('de') },
    { locale: 'it', key: 'common', loader: () => loadLocale('it') },
    { locale: 'en', key: 'common', loader: () => loadLocale('en') },
    { locale: 'ld', key: 'common', loader: () => loadLocale('ld') }
  ],
  fallbackLocale: 'de',
  loader: async ({ key, locale }) => {
    const loaded = await loadLocale(locale as Locale);
    return loaded[key] || null;
  }
};

export const { t, locale, locales, loading, detetectLocale } = createI18n(config);

/** Detect user's preferred locale */
export function detectLocale(): Locale {
  // Check stored preference
  const stored = localStorage.getItem('suedtirol-wetter-locale');
  if (stored && stored in LOCALES) {
    return stored as Locale;
  }
  
  // Check browser language
  const browserLang = navigator.language.split('-')[0];
  if (browserLang in LOCALES) {
    return browserLang as Locale;
  }
  
  // Default to German
  return 'de';
}
