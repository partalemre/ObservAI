import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
}))

// Supported locales
export const locales = ['tr', 'en'] as const
export type Locale = (typeof locales)[number]

// Default locale
export const defaultLocale: Locale = 'tr'

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
} as const
