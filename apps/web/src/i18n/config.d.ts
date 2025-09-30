declare const _default: (
  params: import('next-intl/server').GetRequestConfigParams
) =>
  | import('next-intl/server').RequestConfig
  | Promise<import('next-intl/server').RequestConfig>
export default _default
export declare const locales: readonly ['tr', 'en']
export type Locale = (typeof locales)[number]
export declare const defaultLocale: Locale
export declare const localeConfig: {
  readonly tr: {
    readonly name: 'Türkçe'
    readonly flag: '🇹🇷'
    readonly direction: 'ltr'
  }
  readonly en: {
    readonly name: 'English'
    readonly flag: '🇺🇸'
    readonly direction: 'ltr'
  }
}
