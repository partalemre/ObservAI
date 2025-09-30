import { getRequestConfig } from 'next-intl/server'
export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
}))
// Supported locales
export const locales = ['tr', 'en']
// Default locale
export const defaultLocale = 'tr'
// Locale configuration
export const localeConfig = {
  tr: {
    name: 'Türkçe',
    flag: '🇹🇷',
    direction: 'ltr',
  },
  en: {
    name: 'English',
    flag: '🇺🇸',
    direction: 'ltr',
  },
}
