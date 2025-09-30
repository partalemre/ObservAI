import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Check, ChevronDown } from 'lucide-react'
import { useLocaleInfo, type Locale } from '../hooks/useI18n'
import { useI18nStore } from '../store/i18nStore'
import { cn } from '../lib/utils'

interface LanguageSwitcherProps {
  className?: string
  variant?: 'button' | 'dropdown' | 'inline'
  size?: 'sm' | 'md' | 'lg'
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
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
  const locales: Locale[] = ['tr', 'en']
  const localeConfig = {
    tr: { name: 'Türkçe', flag: '🇹🇷', direction: 'ltr' },
    en: { name: 'English', flag: '🇺🇸', direction: 'ltr' },
  }

  const handleLocaleChange = (newLocale: Locale) => {
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
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {locales.map((locale) => {
          const config = localeConfig[locale]
          const isActive = locale === currentLocale

          return (
            <motion.button
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              className={cn(
                'flex items-center gap-2 rounded-lg transition-all',
                sizeClasses[size],
                isActive
                  ? 'bg-primary-500/20 text-primary-300 border-primary-500/30 border'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-lg">{config.flag}</span>
              <span className="font-medium">{config.name}</span>
            </motion.button>
          )
        })}
      </div>
    )
  }

  if (variant === 'button') {
    return (
      <motion.button
        onClick={() => {
          const nextLocale = currentLocale === 'tr' ? 'en' : 'tr'
          handleLocaleChange(nextLocale)
        }}
        className={cn(
          'flex items-center gap-2 rounded-lg text-white/70 transition-all hover:bg-white/10 hover:text-white',
          sizeClasses[size],
          className
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Globe className={iconSizes[size]} />
        <span className="text-lg">{currentFlag}</span>
        <span className="font-medium">{currentName}</span>
      </motion.button>
    )
  }

  // Dropdown variant
  return (
    <div className={cn('relative', className)}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 rounded-lg text-white/70 transition-all hover:bg-white/10 hover:text-white',
          sizeClasses[size]
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Globe className={iconSizes[size]} />
        <span className="text-lg">{currentFlag}</span>
        <span className="font-medium">{currentName}</span>
        <ChevronDown
          className={cn(
            iconSizes[size],
            'transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              className="absolute top-full right-0 z-50 mt-2 min-w-[160px] rounded-lg border border-white/20 bg-gray-800/95 shadow-xl backdrop-blur-lg"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="py-2">
                {locales.map((locale) => {
                  const config = localeConfig[locale]
                  const isActive = locale === currentLocale

                  return (
                    <motion.button
                      key={locale}
                      onClick={() => handleLocaleChange(locale)}
                      className={cn(
                        'flex w-full items-center justify-between px-4 py-2 text-sm transition-colors',
                        isActive
                          ? 'bg-primary-500/20 text-primary-300'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      )}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{config.flag}</span>
                        <span className="font-medium">{config.name}</span>
                      </div>
                      {isActive && (
                        <Check className="text-primary-400 h-4 w-4" />
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
