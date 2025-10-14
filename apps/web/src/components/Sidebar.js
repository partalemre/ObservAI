import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from 'react/jsx-runtime'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'
import { useUIStore } from '../store/uiStore'
import { useIsMobile, useIsTablet } from '../hooks/useMediaQuery'
import { useNavigationTranslations } from '../hooks/useI18n'
import {
  Home,
  BarChart3,
  UtensilsCrossed,
  ChefHat,
  Package,
  Bell,
  Settings,
  Camera,
  X,
} from 'lucide-react'
import { BrandLogo } from './brand/BrandLogo'
import { BrandMark } from './brand/BrandMark'
const getNavigation = (t) => [
  { name: t('dashboard'), href: '/', icon: Home },
  { name: t('pos'), href: '/pos', icon: BarChart3 },
  { name: t('camera'), href: '/camera', icon: Camera },
  { name: t('menu'), href: '/menu', icon: UtensilsCrossed },
  { name: t('kitchen'), href: '/kitchen', icon: ChefHat },
  { name: t('inventory'), href: '/inventory', icon: Package },
  { name: t('alerts'), href: '/alerts', icon: Bell },
  { name: t('settings'), href: '/settings', icon: Settings },
]
export const Sidebar = () => {
  const location = useLocation()
  const { sidebarOpen, setSidebarOpen } = useUIStore()
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const t = useNavigationTranslations()
  const navigation = getNavigation(t)
  // On mobile, sidebar should be closed by default and overlay the content
  // On desktop, sidebar should be persistent
  const shouldShowOverlay = isMobile && sidebarOpen
  const shouldCollapse = !isMobile && !sidebarOpen
  const sidebarVariants = {
    open: {
      x: 0,
      width: isMobile ? '280px' : '256px',
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
      },
    },
    closed: {
      x: isMobile ? '-100%' : 0,
      width: isMobile ? '280px' : '64px',
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
      },
    },
  }
  const overlayVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
  }
  return _jsxs(_Fragment, {
    children: [
      _jsx(AnimatePresence, {
        children:
          shouldShowOverlay &&
          _jsx(motion.div, {
            className:
              'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden',
            variants: overlayVariants,
            initial: 'closed',
            animate: 'open',
            exit: 'closed',
            onClick: () => setSidebarOpen(false),
          }),
      }),
      _jsx(motion.aside, {
        'data-testid': 'sidebar',
        role: 'navigation',
        className: cn(
          'glass-nav fixed top-0 left-0 z-50 h-full text-white/90 lg:relative lg:z-auto',
          'border-r border-white/10',
          isMobile && 'shadow-2xl'
        ),
        variants: sidebarVariants,
        initial: 'closed',
        animate: sidebarOpen ? 'open' : 'closed',
        children: _jsxs('div', {
          className: 'flex h-full flex-col',
          children: [
            _jsxs('div', {
              className:
                'flex h-16 items-center justify-between border-b border-white/10 px-4',
              children: [
                _jsx('div', {
                  className: 'flex items-center',
                  children:
                    sidebarOpen || isMobile
                      ? _jsx(BrandLogo, { size: 'sm', className: 'text-white' })
                      : _jsx(BrandMark, { size: 32, className: 'text-white' }),
                }),
                isMobile &&
                  sidebarOpen &&
                  _jsx(motion.button, {
                    onClick: () => setSidebarOpen(false),
                    className:
                      'rounded-lg p-2 transition-colors hover:bg-white/10',
                    whileHover: { scale: 1.05 },
                    whileTap: { scale: 0.95 },
                    children: _jsx(X, { className: 'h-5 w-5 text-white/70' }),
                  }),
              ],
            }),
            _jsx('nav', {
              className: 'flex-1 space-y-1 overflow-y-auto px-2 py-4',
              children: navigation.map((item, index) => {
                const isActive = location.pathname === item.href
                return _jsx(
                  motion.div,
                  {
                    initial: { opacity: 0, x: -20 },
                    animate: { opacity: 1, x: 0 },
                    transition: { delay: index * 0.05 },
                    children: _jsxs(Link, {
                      to: item.href,
                      onClick: () => isMobile && setSidebarOpen(false),
                      className: cn(
                        'group relative flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                        'hover:bg-white/10 active:bg-white/20',
                        isActive
                          ? 'bg-primary-500/20 text-primary-300 border-primary-500/30 border'
                          : 'text-white/70 hover:text-white'
                      ),
                      children: [
                        isActive &&
                          _jsx(motion.div, {
                            className:
                              'from-primary-400 to-primary-600 absolute top-0 bottom-0 left-0 w-1 rounded-r-full bg-gradient-to-b',
                            layoutId: 'activeIndicator',
                            transition: {
                              type: 'spring',
                              bounce: 0.2,
                              duration: 0.6,
                            },
                          }),
                        _jsx(item.icon, {
                          className: cn(
                            'h-5 w-5 flex-shrink-0 transition-colors',
                            sidebarOpen || isMobile ? 'mr-3' : 'mx-auto',
                            isActive
                              ? 'text-primary-400'
                              : 'text-white/70 group-hover:text-white'
                          ),
                        }),
                        _jsx(AnimatePresence, {
                          children:
                            (sidebarOpen || isMobile) &&
                            _jsx(motion.span, {
                              className: 'truncate',
                              initial: { opacity: 0, width: 0 },
                              animate: { opacity: 1, width: 'auto' },
                              exit: { opacity: 0, width: 0 },
                              transition: { duration: 0.2 },
                              children: item.name,
                            }),
                        }),
                        !sidebarOpen &&
                          !isMobile &&
                          _jsx('div', {
                            className:
                              'pointer-events-none absolute left-full z-50 ml-2 rounded bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100',
                            children: item.name,
                          }),
                      ],
                    }),
                  },
                  item.name
                )
              }),
            }),
            _jsx('div', {
              className: 'border-t border-white/10 p-4',
              children: _jsxs('div', {
                className: cn(
                  'flex items-center text-xs text-white/50',
                  sidebarOpen || isMobile ? 'justify-between' : 'justify-center'
                ),
                children: [
                  (sidebarOpen || isMobile) &&
                    _jsx('span', { children: 'ObservAI v1.0' }),
                  _jsxs('div', {
                    className: cn(
                      'flex items-center gap-1',
                      !(sidebarOpen || isMobile) && 'flex-col'
                    ),
                    children: [
                      _jsx('div', {
                        className:
                          'h-2 w-2 animate-pulse rounded-full bg-green-400',
                      }),
                      (sidebarOpen || isMobile) &&
                        _jsx('span', { children: 'Online' }),
                    ],
                  }),
                ],
              }),
            }),
          ],
        }),
      }),
    ],
  })
}
