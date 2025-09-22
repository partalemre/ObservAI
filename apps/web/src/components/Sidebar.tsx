import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../lib/utils'
import { useUIStore } from '../store/uiStore'
import { t } from '../lib/i18n'
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
  { name: 'POS', href: '/dashboard/pos', icon: BarChart3 },
  { name: 'Menu', href: '/dashboard/menu', icon: UtensilsCrossed },
  { name: 'Kitchen', href: '/dashboard/kitchen', icon: ChefHat },
  { name: 'Inventory', href: '/dashboard/inventory', icon: Package },
  { name: 'Alerts', href: '/dashboard/alerts', icon: Bell },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export const Sidebar: React.FC = () => {
  const location = useLocation()
  const { sidebarOpen } = useUIStore()

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" />
      )}

      <aside
        data-testid="sidebar"
        role="navigation"
        className={cn(
          'bg-ink fixed top-0 left-0 z-50 h-full text-white/90 transition-all duration-300 ease-in-out lg:relative lg:z-auto',
          sidebarOpen ? 'w-64' : 'w-16'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-white/10 px-4">
            {sidebarOpen ? (
              <BrandLogo size="sm" className="text-white" />
            ) : (
              <BrandMark size={32} className="text-white" />
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'group relative flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  )}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="from-brand to-accent absolute top-0 bottom-0 left-0 w-1 rounded-r-full bg-gradient-to-b" />
                  )}

                  <item.icon
                    className={cn(
                      'h-5 w-5 flex-shrink-0 transition-colors',
                      sidebarOpen ? 'mr-3' : 'mx-auto',
                      isActive
                        ? 'text-white'
                        : 'text-white/70 group-hover:text-white'
                    )}
                  />

                  {sidebarOpen && <span className="truncate">{item.name}</span>}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>
    </>
  )
}
