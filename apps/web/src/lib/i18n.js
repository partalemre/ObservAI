import { en } from '../i18n/en'
import { tr } from '../i18n/tr'
import { useI18nStore } from '../store/i18nStore'
const dictionaries = { en, tr }
export const getLang = () => {
  return useI18nStore.getState().lang
}
export const setLang = (lang) => {
  useI18nStore.getState().setLang(lang)
}
export const t = (path) => {
  const lang = getLang()
  const dict = dictionaries[lang]
  const keys = path.split('.')
  let value = dict
  for (const key of keys) {
    value = value?.[key]
  }
  return typeof value === 'string' ? value : path
}
