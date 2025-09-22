import { create } from 'zustand'
export const useI18nStore = create((set) => ({
  lang: 'en',
  setLang: (lang) => set({ lang }),
}))
