import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface NavItemProps {
  icon: React.ComponentType<any>
  label: string
  path: string
  collapsed: boolean
}

export const NavItem: React.FC<NavItemProps> = ({
  icon: Icon,
  label,
  path,
  collapsed,
}) => {
  const location = useLocation()
  const isActive = location.pathname === path

  return (
    <Link to={path} className="block">
      <motion.div
        className={cn(
          'group relative flex items-center rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200',
          isActive
            ? 'bg-primary-500/20 text-primary-100 shadow-primary-500/20 shadow-lg'
            : 'text-white/70 hover:bg-white/10 hover:text-white'
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Active indicator */}
        {isActive && (
          <motion.div
            className="bg-primary-500 absolute top-1/2 left-0 h-8 w-1 rounded-r-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            layoutId="activeIndicator"
          />
        )}

        {/* Icon */}
        <div className={cn('flex-shrink-0', collapsed ? 'mx-auto' : 'mr-3')}>
          <Icon
            className={cn(
              'h-5 w-5 transition-colors duration-200',
              isActive
                ? 'text-primary-300'
                : 'text-white/70 group-hover:text-white'
            )}
          />
        </div>

        {/* Label with animation */}
        <motion.span
          className={cn(
            'truncate font-medium',
            isActive ? 'text-primary-100' : 'text-white/90'
          )}
          initial={false}
          animate={{
            opacity: collapsed ? 0 : 1,
            width: collapsed ? 0 : 'auto',
          }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          style={{ overflow: 'hidden' }}
        >
          {label}
        </motion.span>

        {/* Tooltip for collapsed state */}
        {collapsed && (
          <motion.div
            className="bg-dark-700 pointer-events-none absolute top-1/2 left-16 z-50 -translate-y-1/2 rounded-md border border-white/10 px-2 py-1 text-xs whitespace-nowrap text-white/90 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 0, x: 0 }}
            whileHover={{ opacity: 1, x: 0 }}
          >
            {label}
            <div className="bg-dark-700 absolute top-1/2 left-0 h-2 w-2 -translate-x-1 -translate-y-1/2 rotate-45 border-b border-l border-white/10" />
          </motion.div>
        )}
      </motion.div>
    </Link>
  )
}
