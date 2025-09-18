import { create } from 'zustand'

interface I18nState {
  lang: 'en' | 'tr'
  setLang: (lang: 'en' | 'tr') => void
}

export const useI18nStore = create<I18nState>((set) => ({
  lang: 'en',
  setLang: (lang: 'en' | 'tr') => set({ lang }),
}))
