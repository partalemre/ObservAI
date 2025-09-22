interface I18nState {
  lang: 'en' | 'tr'
  setLang: (lang: 'en' | 'tr') => void
}
export declare const useI18nStore: import('zustand').UseBoundStore<
  import('zustand').StoreApi<I18nState>
>
export {}
