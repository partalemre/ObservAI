import { useI18nStore } from '../store/i18nStore'
import { t } from '../lib/i18n'

// Type definitions
export type Locale = 'en' | 'tr'

// Custom hook for getting current locale info
export const useLocaleInfo = () => {
  const { lang } = useI18nStore()

  const localeConfig = {
    tr: {
      name: 'Türkçe',
      flag: '🇹🇷',
      direction: 'ltr' as 'ltr' | 'rtl',
    },
    en: {
      name: 'English',
      flag: '🇺🇸',
      direction: 'ltr' as 'ltr' | 'rtl',
    },
  } as const

  return {
    locale: lang,
    name: localeConfig[lang].name,
    flag: localeConfig[lang].flag,
    direction: localeConfig[lang].direction,
    isRTL: localeConfig[lang].direction === 'rtl',
  }
}

// Custom hook factory for translations
const createTranslationHook = (namespace: string) => {
  return () => {
    return (key: string) => t(`${namespace}.${key}`)
  }
}

// Custom hook for common translations
export const useCommonTranslations = createTranslationHook('common')

// Custom hook for navigation translations
export const useNavigationTranslations = createTranslationHook('navigation')

// Custom hook for dashboard translations
export const useDashboardTranslations = createTranslationHook('dashboard')

// Custom hook for POS translations
export const usePOSTranslations = createTranslationHook('pos')

// Custom hook for camera translations
export const useCameraTranslations = createTranslationHook('camera')

// Custom hook for menu translations
export const useMenuTranslations = createTranslationHook('menu')

// Custom hook for kitchen translations
export const useKitchenTranslations = createTranslationHook('kitchen')

// Custom hook for inventory translations
export const useInventoryTranslations = createTranslationHook('inventory')

// Custom hook for alerts translations
export const useAlertsTranslations = createTranslationHook('alerts')

// Custom hook for settings translations
export const useSettingsTranslations = createTranslationHook('settings')

// Custom hook for user translations
export const useUserTranslations = createTranslationHook('user')

// Custom hook for error translations
export const useErrorTranslations = createTranslationHook('errors')

// Custom hook for success translations
export const useSuccessTranslations = createTranslationHook('success')

// Custom hook for time translations
export const useTimeTranslations = createTranslationHook('time')

// Custom hook for currency formatting
export const useCurrencyTranslations = () => {
  const { lang } = useI18nStore()

  const formatCurrency = (amount: number): string => {
    const symbol = t('currency.symbol')
    const format = t('currency.format')

    // Format number based on locale
    const formattedAmount = new Intl.NumberFormat(
      lang === 'tr' ? 'tr-TR' : 'en-US',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    ).format(amount)

    return format
      .replace('{amount}', formattedAmount)
      .replace('{symbol}', symbol)
  }

  return { formatCurrency, symbol: t('currency.symbol') }
}

// Custom hook for date formatting
export const useDateFormatting = () => {
  const { lang } = useI18nStore()

  const formatDate = (
    date: Date | string,
    options?: Intl.DateTimeFormatOptions
  ): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const localeCode = lang === 'tr' ? 'tr-TR' : 'en-US'

    return new Intl.DateTimeFormat(localeCode, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    }).format(dateObj)
  }

  const formatTime = (
    date: Date | string,
    options?: Intl.DateTimeFormatOptions
  ): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const localeCode = lang === 'tr' ? 'tr-TR' : 'en-US'

    return new Intl.DateTimeFormat(localeCode, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: lang === 'en',
      ...options,
    }).format(dateObj)
  }

  const formatDateTime = (
    date: Date | string,
    options?: Intl.DateTimeFormatOptions
  ): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const localeCode = lang === 'tr' ? 'tr-TR' : 'en-US'

    return new Intl.DateTimeFormat(localeCode, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: lang === 'en',
      ...options,
    }).format(dateObj)
  }

  const getRelativeTime = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffInMs = now.getTime() - dateObj.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInMinutes < 1) return t('time.now')
    if (diffInMinutes < 60)
      return `${diffInMinutes} ${diffInMinutes === 1 ? t('time.minute') : t('time.minutes')}`
    if (diffInHours < 24)
      return `${diffInHours} ${diffInHours === 1 ? t('time.hour') : t('time.hours')}`
    if (diffInDays === 1) return t('time.yesterday')
    if (diffInDays < 7) return `${diffInDays} gün önce`

    return formatDate(dateObj)
  }

  return {
    formatDate,
    formatTime,
    formatDateTime,
    getRelativeTime,
  }
}

// Custom hook for number formatting
export const useNumberFormatting = () => {
  const { lang } = useI18nStore()

  const formatNumber = (
    number: number,
    options?: Intl.NumberFormatOptions
  ): string => {
    const localeCode = lang === 'tr' ? 'tr-TR' : 'en-US'
    return new Intl.NumberFormat(localeCode, options).format(number)
  }

  const formatPercentage = (
    number: number,
    options?: Intl.NumberFormatOptions
  ): string => {
    const localeCode = lang === 'tr' ? 'tr-TR' : 'en-US'
    return new Intl.NumberFormat(localeCode, {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
      ...options,
    }).format(number / 100)
  }

  const formatCompactNumber = (number: number): string => {
    const localeCode = lang === 'tr' ? 'tr-TR' : 'en-US'
    return new Intl.NumberFormat(localeCode, {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(number)
  }

  return {
    formatNumber,
    formatPercentage,
    formatCompactNumber,
  }
}
