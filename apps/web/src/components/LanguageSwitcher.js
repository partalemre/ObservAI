import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from 'react/jsx-runtime'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Check, ChevronDown } from 'lucide-react'
import { useLocaleInfo } from '../hooks/useI18n'
import { useI18nStore } from '../store/i18nStore'
import { cn } from '../lib/utils'
export const LanguageSwitcher = ({
  className,
  variant = 'dropdown',
  size = 'md',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const { setLang } = useI18nStore()
  const {
    locale: currentLocale,
    name: currentName,
    flag: currentFlag,
  } = useLocaleInfo()
  // Define locales and config locally
  const locales = ['tr', 'en']
  const localeConfig = {
    tr: { name: 'Türkçe', flag: '🇹🇷', direction: 'ltr' },
    en: { name: 'English', flag: '🇺🇸', direction: 'ltr' },
  }
  const handleLocaleChange = (newLocale) => {
    setLang(newLocale)
    setIsOpen(false)
  }
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-3',
  }
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }
  if (variant === 'inline') {
    return _jsx('div', {
      className: cn('flex items-center gap-2', className),
      children: locales.map((locale) => {
        const config = localeConfig[locale]
        const isActive = locale === currentLocale
        return _jsxs(
          motion.button,
          {
            onClick: () => handleLocaleChange(locale),
            className: cn(
              'flex items-center gap-2 rounded-lg transition-all',
              sizeClasses[size],
              isActive
                ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            ),
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 },
            children: [
              _jsx('span', { className: 'text-lg', children: config.flag }),
              _jsx('span', { className: 'font-medium', children: config.name }),
            ],
          },
          locale
        )
      }),
    })
  }
  if (variant === 'button') {
    return _jsxs(motion.button, {
      onClick: () => {
        const nextLocale = currentLocale === 'tr' ? 'en' : 'tr'
        handleLocaleChange(nextLocale)
      },
      className: cn(
        'flex items-center gap-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all',
        sizeClasses[size],
        className
      ),
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
      children: [
        _jsx(Globe, { className: iconSizes[size] }),
        _jsx('span', { className: 'text-lg', children: currentFlag }),
        _jsx('span', { className: 'font-medium', children: currentName }),
      ],
    })
  }
  // Dropdown variant
  return _jsxs('div', {
    className: cn('relative', className),
    children: [
      _jsxs(motion.button, {
        onClick: () => setIsOpen(!isOpen),
        className: cn(
          'flex items-center gap-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all',
          sizeClasses[size]
        ),
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
        children: [
          _jsx(Globe, { className: iconSizes[size] }),
          _jsx('span', { className: 'text-lg', children: currentFlag }),
          _jsx('span', { className: 'font-medium', children: currentName }),
          _jsx(ChevronDown, {
            className: cn(
              iconSizes[size],
              'transition-transform',
              isOpen && 'rotate-180'
            ),
          }),
        ],
      }),
      _jsx(AnimatePresence, {
        children:
          isOpen &&
          _jsxs(_Fragment, {
            children: [
              _jsx('div', {
                className: 'fixed inset-0 z-40',
                onClick: () => setIsOpen(false),
              }),
              _jsx(motion.div, {
                className:
                  'absolute top-full right-0 mt-2 min-w-[160px] bg-gray-800/95 backdrop-blur-lg border border-white/20 rounded-lg shadow-xl z-50',
                initial: { opacity: 0, scale: 0.95, y: -10 },
                animate: { opacity: 1, scale: 1, y: 0 },
                exit: { opacity: 0, scale: 0.95, y: -10 },
                transition: { duration: 0.2 },
                children: _jsx('div', {
                  className: 'py-2',
                  children: locales.map((locale) => {
                    const config = localeConfig[locale]
                    const isActive = locale === currentLocale
                    return _jsxs(
                      motion.button,
                      {
                        onClick: () => handleLocaleChange(locale),
                        className: cn(
                          'w-full flex items-center justify-between px-4 py-2 text-sm transition-colors',
                          isActive
                            ? 'bg-primary-500/20 text-primary-300'
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                        ),
                        whileHover: { x: 4 },
                        children: [
                          _jsxs('div', {
                            className: 'flex items-center gap-3',
                            children: [
                              _jsx('span', {
                                className: 'text-lg',
                                children: config.flag,
                              }),
                              _jsx('span', {
                                className: 'font-medium',
                                children: config.name,
                              }),
                            ],
                          }),
                          isActive &&
                            _jsx(Check, {
                              className: 'w-4 h-4 text-primary-400',
                            }),
                        ],
                      },
                      locale
                    )
                  }),
                }),
              }),
            ],
          }),
      }),
    ],
  })
}
