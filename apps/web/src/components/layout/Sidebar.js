import {
  jsx as _jsx,
  Fragment as _Fragment,
  jsxs as _jsxs,
} from 'react/jsx-runtime'
import { useState } from 'react'
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
const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  // Role-based menu items
  const menuItems = [
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
  return _jsxs(motion.aside, {
    animate: { width: collapsed ? 60 : 240 },
    transition: { duration: 0.3, ease: 'easeInOut' },
    className:
      'h-screen bg-dark-800 border-r border-white/5 flex flex-col glass-card',
    children: [
      _jsx('div', {
        className:
          'h-16 flex items-center justify-center border-b border-white/5 px-4',
        children: _jsx(Logo, { collapsed: collapsed }),
      }),
      _jsx('nav', {
        className: 'flex-1 p-4 space-y-2',
        children: menuItems.map((item) =>
          _jsx(
            NavItem,
            {
              icon: item.icon,
              label: item.label,
              path: item.path,
              collapsed: collapsed,
            },
            item.path
          )
        ),
      }),
      _jsx(motion.button, {
        onClick: () => setCollapsed(!collapsed),
        className:
          'p-4 border-t border-white/5 flex items-center justify-center glass-button text-white/70 hover:text-white transition-colors duration-200',
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
        children: collapsed
          ? _jsx(ChevronRight, { className: 'w-5 h-5' })
          : _jsxs(_Fragment, {
              children: [
                _jsx(ChevronLeft, { className: 'w-5 h-5 mr-2' }),
                !collapsed &&
                  _jsx('span', { className: 'text-sm', children: 'Collapse' }),
              ],
            }),
      }),
    ],
  })
}
export default Sidebar
