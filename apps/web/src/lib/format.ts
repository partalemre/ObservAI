import { getLang } from './i18n'

export const formatCurrency = (
  amount: number,
  locale = 'en-US',
  currency = 'TRY'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

export const formatDate = (date: Date | string, locale?: string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const lang = getLang()
  const defaultLocale = lang === 'tr' ? 'tr-TR' : 'en-US'

  return new Intl.DateTimeFormat(locale || defaultLocale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj)
}

export const formatDateTime = (
  date: Date | string,
  locale?: string
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const lang = getLang()
  const defaultLocale = lang === 'tr' ? 'tr-TR' : 'en-US'

  return new Intl.DateTimeFormat(locale || defaultLocale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}

export const formatNumber = (num: number, locale = 'en-US'): string => {
  return new Intl.NumberFormat(locale).format(num)
}
