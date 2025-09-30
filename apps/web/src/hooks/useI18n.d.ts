export type Locale = 'en' | 'tr'
export declare const useLocaleInfo: () => {
  locale: 'en' | 'tr'
  name: 'Türkçe' | 'English'
  flag: '🇹🇷' | '🇺🇸'
  direction: 'ltr' | 'rtl'
  isRTL: boolean
}
export declare const useCommonTranslations: () => (key: string) => string
export declare const useNavigationTranslations: () => (key: string) => string
export declare const useDashboardTranslations: () => (key: string) => string
export declare const usePOSTranslations: () => (key: string) => string
export declare const useCameraTranslations: () => (key: string) => string
export declare const useMenuTranslations: () => (key: string) => string
export declare const useKitchenTranslations: () => (key: string) => string
export declare const useInventoryTranslations: () => (key: string) => string
export declare const useAlertsTranslations: () => (key: string) => string
export declare const useSettingsTranslations: () => (key: string) => string
export declare const useUserTranslations: () => (key: string) => string
export declare const useErrorTranslations: () => (key: string) => string
export declare const useSuccessTranslations: () => (key: string) => string
export declare const useTimeTranslations: () => (key: string) => string
export declare const useCurrencyTranslations: () => {
  formatCurrency: (amount: number) => string
  symbol: string
}
export declare const useDateFormatting: () => {
  formatDate: (
    date: Date | string,
    options?: Intl.DateTimeFormatOptions
  ) => string
  formatTime: (
    date: Date | string,
    options?: Intl.DateTimeFormatOptions
  ) => string
  formatDateTime: (
    date: Date | string,
    options?: Intl.DateTimeFormatOptions
  ) => string
  getRelativeTime: (date: Date | string) => string
}
export declare const useNumberFormatting: () => {
  formatNumber: (number: number, options?: Intl.NumberFormatOptions) => string
  formatPercentage: (
    number: number,
    options?: Intl.NumberFormatOptions
  ) => string
  formatCompactNumber: (number: number) => string
}
