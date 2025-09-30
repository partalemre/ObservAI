import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Gauge,
  Camera,
  ShoppingCart,
  ChefHat,
  Package,
  Bell,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { NavItem } from './NavItem'
import { Logo } from './Logo'

interface MenuItem {
  icon: React.ComponentType<any>
  label: string
  path: string
  roles: string[]
}

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)

  // Role-based menu items
  const menuItems: MenuItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', roles: ['*'] },
    {
      icon: Gauge,
      label: 'Analytics',
      path: '/analytics',
      roles: ['owner', 'manager'],
    },
    {
      icon: Camera,
      label: 'Camera AI',
      path: '/camera',
      roles: ['owner', 'manager'],
    },
    { icon: ShoppingCart, label: 'POS', path: '/pos', roles: ['*'] },
    { icon: ChefHat, label: 'Kitchen', path: '/kitchen', roles: ['*'] },
    {
      icon: Package,
      label: 'Inventory',
      path: '/inventory',
      roles: ['manager', 'owner'],
    },
    { icon: Bell, label: 'Alerts', path: '/alerts', roles: ['*'] },
  ]

  return (
    <motion.aside
      animate={{ width: collapsed ? 60 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-dark-800 glass-card flex h-screen flex-col border-r border-white/5"
    >
      {/* Logo area */}
      <div className="flex h-16 items-center justify-center border-b border-white/5 px-4">
        <Logo collapsed={collapsed} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {menuItems.map((item) => (
          <NavItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Toggle button */}
      <motion.button
        onClick={() => setCollapsed(!collapsed)}
        className="glass-button flex items-center justify-center border-t border-white/5 p-4 text-white/70 transition-colors duration-200 hover:text-white"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {collapsed ? (
          <ChevronRight className="h-5 w-5" />
        ) : (
          <>
            <ChevronLeft className="mr-2 h-5 w-5" />
            {!collapsed && <span className="text-sm">Collapse</span>}
          </>
        )}
      </motion.button>
    </motion.aside>
  )
}

export default Sidebar
