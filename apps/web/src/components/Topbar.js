import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { motion } from 'framer-motion'
import { useUIStore } from '../store/uiStore'
import { useAuthStore } from '../store/authStore'
import { useIsMobile, useIsTablet } from '../hooks/useMediaQuery'
import { StoreSelect } from './StoreSelect'
import { CashDrawerBadge } from './payments/CashDrawerBadge'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useCommonTranslations } from '../hooks/useI18n'
import { Menu, Bell, Search, Settings, LogOut } from 'lucide-react'
export const Topbar = () => {
  const { sidebarOpen, setSidebarOpen } = useUIStore()
  const { user, logout } = useAuthStore()
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const t = useCommonTranslations()
  return _jsxs(motion.header, {
    className: 'glass-nav border-b border-white/10 sticky top-0 z-40',
    initial: { y: -64 },
    animate: { y: 0 },
    transition: { duration: 0.3 },
    children: [
      _jsxs('div', {
        className: 'flex h-16 items-center justify-between px-4 lg:px-6',
        children: [
          _jsxs('div', {
            className: 'flex items-center gap-3',
            children: [
              _jsxs(motion.button, {
                onClick: () => setSidebarOpen(!sidebarOpen),
                className:
                  'p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors lg:hidden',
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                children: [
                  _jsx('span', {
                    className: 'sr-only',
                    children: 'Toggle menu',
                  }),
                  _jsx(Menu, { className: 'h-5 w-5' }),
                ],
              }),
              !isMobile &&
                _jsxs(motion.button, {
                  onClick: () => setSidebarOpen(!sidebarOpen),
                  className:
                    'p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors',
                  whileHover: { scale: 1.05 },
                  whileTap: { scale: 0.95 },
                  children: [
                    _jsx('span', {
                      className: 'sr-only',
                      children: 'Toggle sidebar',
                    }),
                    _jsx(Menu, { className: 'h-5 w-5' }),
                  ],
                }),
              !isMobile &&
                _jsxs('div', {
                  className: 'relative',
                  children: [
                    _jsx(Search, {
                      className:
                        'absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50',
                    }),
                    _jsx('input', {
                      type: 'text',
                      placeholder: t('search'),
                      className:
                        'pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary-500 focus:bg-white/20 transition-all w-64 xl:w-80',
                    }),
                  ],
                }),
            ],
          }),
          _jsxs('div', {
            className: 'flex items-center gap-2 sm:gap-4',
            children: [
              isMobile &&
                _jsx(motion.button, {
                  className:
                    'p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors',
                  whileHover: { scale: 1.05 },
                  whileTap: { scale: 0.95 },
                  children: _jsx(Search, { className: 'h-5 w-5' }),
                }),
              !isMobile && _jsx(StoreSelect, {}),
              !isMobile && _jsx(CashDrawerBadge, {}),
              _jsxs(motion.button, {
                className:
                  'relative p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors',
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                children: [
                  _jsx(Bell, { className: 'h-5 w-5' }),
                  _jsx('div', {
                    className:
                      'absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center',
                    children: _jsx('span', {
                      className: 'text-xs text-white font-medium',
                      children: '3',
                    }),
                  }),
                ],
              }),
              _jsx(LanguageSwitcher, { variant: 'button', size: 'sm' }),
              !isMobile &&
                _jsx(motion.button, {
                  className:
                    'p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors',
                  whileHover: { scale: 1.05 },
                  whileTap: { scale: 0.95 },
                  children: _jsx(Settings, { className: 'h-5 w-5' }),
                }),
              _jsxs('div', {
                className: 'flex items-center gap-3',
                children: [
                  !isMobile &&
                    _jsxs('div', {
                      className: 'text-sm text-right',
                      children: [
                        _jsx('p', {
                          className: 'text-white font-medium',
                          children: user?.name || 'Admin User',
                        }),
                        _jsx('p', {
                          className: 'text-white/60 text-xs',
                          children: user?.email || 'admin@observai.com',
                        }),
                      ],
                    }),
                  _jsxs('div', {
                    className: 'relative',
                    children: [
                      _jsx(motion.div, {
                        className:
                          'w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center ring-2 ring-primary-500/30 cursor-pointer',
                        whileHover: { scale: 1.05 },
                        whileTap: { scale: 0.95 },
                        children: _jsx('span', {
                          className: 'text-white text-sm font-semibold',
                          children: user?.name?.charAt(0).toUpperCase() || 'A',
                        }),
                      }),
                      _jsx('div', {
                        className:
                          'absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-dark-900',
                      }),
                    ],
                  }),
                ],
              }),
              _jsxs(motion.button, {
                onClick: logout,
                className: `
              flex items-center gap-2 px-3 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors
              ${isMobile ? 'p-2' : ''}
            `,
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                children: [
                  _jsx(LogOut, { className: 'h-4 w-4' }),
                  !isMobile &&
                    _jsx('span', {
                      className: 'text-sm',
                      children: t('logout'),
                    }),
                ],
              }),
            ],
          }),
        ],
      }),
      isMobile &&
        _jsxs(motion.div, {
          className:
            'border-t border-white/10 px-4 py-2 flex items-center justify-between',
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.1 },
          children: [
            _jsxs('div', {
              className: 'text-sm',
              children: [
                _jsx('p', {
                  className: 'text-white font-medium',
                  children: user?.name || 'Admin User',
                }),
                _jsx('p', {
                  className: 'text-white/60 text-xs',
                  children: 'ObservAI Dashboard',
                }),
              ],
            }),
            _jsx('div', {
              className: 'flex items-center gap-2',
              children: _jsx(StoreSelect, {}),
            }),
          ],
        }),
    ],
  })
}
