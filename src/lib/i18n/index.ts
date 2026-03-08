import i18n from 'sveltekit-i18n';

/** @type {import('sveltekit-i18n').Config} */
const config = {
  loaders: [
    {
      locale: 'de',
      key: 'common',
      loader: async () => (await import('./locales/de.json')).default,
    },
    {
      locale: 'it',
      key: 'common',
      loader: async () => (await import('./locales/it.json')).default,
    },
    {
      locale: 'en',
      key: 'common',
      loader: async () => (await import('./locales/en.json')).default,
    },
    {
      locale: 'ld',
      key: 'common',
      loader: async () => (await import('./locales/ld.json')).default,
    },
  ],
};

/** i18n instance */
export const {
  t,
  locale,
  locales,
  loading,
  loadTranslations,
} = new i18n(config);

/** Supported languages */
export type Locale = 'de' | 'it' | 'en' | 'ld';

export const LOCALES: Record<Locale, { name: string; fallback: boolean }> = {
  de: { name: 'Deutsch', fallback: true },
  it: { name: 'Italiano', fallback: false },
  en: { name: 'English', fallback: false },
  ld: { name: 'Ladin', fallback: false },
};

/** Detect user's preferred locale */
export function detectLocale(): Locale {
  // Check stored preference
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('suedtirol-wetter-locale');
    if (stored && stored in LOCALES) {
      return stored as Locale;
    }
  }

  // Check browser language
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language.split('-')[0] as Locale;
    if (browserLang in LOCALES) {
      return browserLang;
    }
  }

  // Default to German
  return 'de';
}

/** Set user's preferred locale */
export function setLocale(locale: Locale) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('suedtirol-wetter-locale', locale);
    location.reload();
  }
}

/** Get all supported locales */
export function getLocales(): Locale[] {
  return Object.keys(LOCALES) as Locale[];
}