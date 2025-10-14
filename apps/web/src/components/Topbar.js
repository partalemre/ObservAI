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
    className: 'glass-nav sticky top-0 z-40 border-b border-white/10',
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
                  'rounded-xl p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white lg:hidden',
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
                    'rounded-xl p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white',
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
                        'absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-white/50',
                    }),
                    _jsx('input', {
                      type: 'text',
                      placeholder: t('search'),
                      className:
                        'focus:border-primary-500 w-64 rounded-lg border border-white/20 bg-white/10 py-2 pr-4 pl-10 text-white placeholder-white/50 transition-all focus:bg-white/20 focus:outline-none xl:w-80',
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
                    'rounded-xl p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white',
                  whileHover: { scale: 1.05 },
                  whileTap: { scale: 0.95 },
                  children: _jsx(Search, { className: 'h-5 w-5' }),
                }),
              !isMobile && _jsx(StoreSelect, {}),
              !isMobile && _jsx(CashDrawerBadge, {}),
              _jsxs(motion.button, {
                className:
                  'relative rounded-xl p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white',
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                children: [
                  _jsx(Bell, { className: 'h-5 w-5' }),
                  _jsx('div', {
                    className:
                      'absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500',
                    children: _jsx('span', {
                      className: 'text-xs font-medium text-white',
                      children: '3',
                    }),
                  }),
                ],
              }),
              _jsx(LanguageSwitcher, { variant: 'button', size: 'sm' }),
              !isMobile &&
                _jsx(motion.button, {
                  className:
                    'rounded-xl p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white',
                  whileHover: { scale: 1.05 },
                  whileTap: { scale: 0.95 },
                  children: _jsx(Settings, { className: 'h-5 w-5' }),
                }),
              _jsxs('div', {
                className: 'flex items-center gap-3',
                children: [
                  !isMobile &&
                    _jsxs('div', {
                      className: 'text-right text-sm',
                      children: [
                        _jsx('p', {
                          className: 'font-medium text-white',
                          children: user?.name || 'Admin User',
                        }),
                        _jsx('p', {
                          className: 'text-xs text-white/60',
                          children: user?.email || 'admin@observai.com',
                        }),
                      ],
                    }),
                  _jsxs('div', {
                    className: 'relative',
                    children: [
                      _jsx(motion.div, {
                        className:
                          'from-primary-500 ring-primary-500/30 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br to-purple-500 ring-2',
                        whileHover: { scale: 1.05 },
                        whileTap: { scale: 0.95 },
                        children: _jsx('span', {
                          className: 'text-sm font-semibold text-white',
                          children: user?.name?.charAt(0).toUpperCase() || 'A',
                        }),
                      }),
                      _jsx('div', {
                        className:
                          'border-dark-900 absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 bg-green-400',
                      }),
                    ],
                  }),
                ],
              }),
              _jsxs(motion.button, {
                onClick: logout,
                className: `flex items-center gap-2 rounded-xl px-3 py-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white ${isMobile ? 'p-2' : ''} `,
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
            'flex items-center justify-between border-t border-white/10 px-4 py-2',
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.1 },
          children: [
            _jsxs('div', {
              className: 'text-sm',
              children: [
                _jsx('p', {
                  className: 'font-medium text-white',
                  children: user?.name || 'Admin User',
                }),
                _jsx('p', {
                  className: 'text-xs text-white/60',
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
