import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from 'react/jsx-runtime'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../lib/utils'
import { useUIStore } from '../store/uiStore'
import {
  Home,
  BarChart3,
  UtensilsCrossed,
  ChefHat,
  Package,
  Bell,
  Settings,
} from 'lucide-react'
import { BrandLogo } from './brand/BrandLogo'
import { BrandMark } from './brand/BrandMark'
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'POS', href: '/pos', icon: BarChart3 },
  { name: 'Menu', href: '/menu', icon: UtensilsCrossed },
  { name: 'Kitchen', href: '/kitchen', icon: ChefHat },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Alerts', href: '/alerts', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings },
]
export const Sidebar = () => {
  const location = useLocation()
  const { sidebarOpen } = useUIStore()
  return _jsxs(_Fragment, {
    children: [
      sidebarOpen &&
        _jsx('div', {
          className:
            'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden',
        }),
      _jsx('aside', {
        'data-testid': 'sidebar',
        role: 'navigation',
        className: cn(
          'bg-ink fixed top-0 left-0 z-50 h-full text-white/90 transition-all duration-300 ease-in-out lg:relative lg:z-auto',
          sidebarOpen ? 'w-64' : 'w-16'
        ),
        children: _jsxs('div', {
          className: 'flex h-full flex-col',
          children: [
            _jsx('div', {
              className: 'flex h-16 items-center border-b border-white/10 px-4',
              children: sidebarOpen
                ? _jsx(BrandLogo, { size: 'sm', className: 'text-white' })
                : _jsx(BrandMark, { size: 32, className: 'text-white' }),
            }),
            _jsx('nav', {
              className: 'flex-1 space-y-1 px-2 py-4',
              children: navigation.map((item) => {
                const isActive = location.pathname === item.href
                return _jsxs(
                  Link,
                  {
                    to: item.href,
                    className: cn(
                      'group relative flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    ),
                    children: [
                      isActive &&
                        _jsx('div', {
                          className:
                            'from-brand to-accent absolute top-0 bottom-0 left-0 w-1 rounded-r-full bg-gradient-to-b',
                        }),
                      _jsx(item.icon, {
                        className: cn(
                          'h-5 w-5 flex-shrink-0 transition-colors',
                          sidebarOpen ? 'mr-3' : 'mx-auto',
                          isActive
                            ? 'text-white'
                            : 'text-white/70 group-hover:text-white'
                        ),
                      }),
                      sidebarOpen &&
                        _jsx('span', {
                          className: 'truncate',
                          children: item.name,
                        }),
                    ],
                  },
                  item.name
                )
              }),
            }),
          ],
        }),
      }),
    ],
  })
}
