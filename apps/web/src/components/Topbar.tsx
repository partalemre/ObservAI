import React from 'react'
import { motion } from 'framer-motion'
import { useUIStore } from '../store/uiStore'
import { useAuthStore } from '../store/authStore'
import { useIsMobile, useIsTablet } from '../hooks/useMediaQuery'
import { Button } from './ui'
import { StoreSelect } from './StoreSelect'
import { CashDrawerBadge } from './payments/CashDrawerBadge'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useCommonTranslations } from '../hooks/useI18n'
import { Menu, Bell, Search, Settings, LogOut, User } from 'lucide-react'

export const Topbar: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useUIStore()
  const { user, logout } = useAuthStore()
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const t = useCommonTranslations()

  return (
    <motion.header
      className="glass-nav sticky top-0 z-40 border-b border-white/10"
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left section */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <motion.button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-xl p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="sr-only">Toggle menu</span>
            <Menu className="h-5 w-5" />
          </motion.button>

          {/* Desktop menu button */}
          {!isMobile && (
            <motion.button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-xl p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="sr-only">Toggle sidebar</span>
              <Menu className="h-5 w-5" />
            </motion.button>
          )}

          {/* Search - Hidden on mobile */}
          {!isMobile && (
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-white/50" />
              <input
                type="text"
                placeholder={t('search')}
                className="focus:border-primary-500 w-64 rounded-lg border border-white/20 bg-white/10 py-2 pr-4 pl-10 text-white placeholder-white/50 transition-all focus:bg-white/20 focus:outline-none xl:w-80"
              />
            </div>
          )}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile search button */}
          {isMobile && (
            <motion.button
              className="rounded-xl p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search className="h-5 w-5" />
            </motion.button>
          )}

          {/* Store Select - Hidden on mobile */}
          {!isMobile && <StoreSelect />}

          {/* Cash Drawer Badge - Hidden on mobile */}
          {!isMobile && <CashDrawerBadge />}

          {/* Notifications */}
          <motion.button
            className="relative rounded-xl p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="h-5 w-5" />
            {/* Notification badge */}
            <div className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500">
              <span className="text-xs font-medium text-white">3</span>
            </div>
          </motion.button>

          {/* Language Switcher */}
          <LanguageSwitcher variant="button" size="sm" />

          {/* Settings - Hidden on mobile */}
          {!isMobile && (
            <motion.button
              className="rounded-xl p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="h-5 w-5" />
            </motion.button>
          )}

          {/* User Profile */}
          <div className="flex items-center gap-3">
            {/* User info - Hidden on mobile */}
            {!isMobile && (
              <div className="text-right text-sm">
                <p className="font-medium text-white">
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-xs text-white/60">
                  {user?.email || 'admin@observai.com'}
                </p>
              </div>
            )}

            {/* User avatar */}
            <div className="relative">
              <motion.div
                className="from-primary-500 ring-primary-500/30 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br to-purple-500 ring-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-sm font-semibold text-white">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </motion.div>

              {/* Online indicator */}
              <div className="border-dark-900 absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 bg-green-400"></div>
            </div>
          </div>

          {/* Logout button */}
          <motion.button
            onClick={logout}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white ${isMobile ? 'p-2' : ''} `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="h-4 w-4" />
            {!isMobile && <span className="text-sm">{t('logout')}</span>}
          </motion.button>
        </div>
      </div>

      {/* Mobile secondary bar */}
      {isMobile && (
        <motion.div
          className="flex items-center justify-between border-t border-white/10 px-4 py-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-sm">
            <p className="font-medium text-white">
              {user?.name || 'Admin User'}
            </p>
            <p className="text-xs text-white/60">ObservAI Dashboard</p>
          </div>

          <div className="flex items-center gap-2">
            <StoreSelect />
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}
