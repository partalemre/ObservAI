import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
export const NavItem = ({ icon: Icon, label, path, collapsed }) => {
  const location = useLocation()
  const isActive = location.pathname === path
  return _jsx(Link, {
    to: path,
    className: 'block',
    children: _jsxs(motion.div, {
      className: cn(
        'relative flex items-center rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 group',
        isActive
          ? 'bg-primary-500/20 text-primary-100 shadow-lg shadow-primary-500/20'
          : 'text-white/70 hover:bg-white/10 hover:text-white'
      ),
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
      children: [
        isActive &&
          _jsx(motion.div, {
            className:
              'absolute left-0 top-1/2 h-8 w-1 bg-primary-500 rounded-r-full',
            initial: { scale: 0 },
            animate: { scale: 1 },
            layoutId: 'activeIndicator',
          }),
        _jsx('div', {
          className: cn('flex-shrink-0', collapsed ? 'mx-auto' : 'mr-3'),
          children: _jsx(Icon, {
            className: cn(
              'w-5 h-5 transition-colors duration-200',
              isActive
                ? 'text-primary-300'
                : 'text-white/70 group-hover:text-white'
            ),
          }),
        }),
        _jsx(motion.span, {
          className: cn(
            'truncate font-medium',
            isActive ? 'text-primary-100' : 'text-white/90'
          ),
          initial: false,
          animate: {
            opacity: collapsed ? 0 : 1,
            width: collapsed ? 0 : 'auto',
          },
          transition: { duration: 0.2, ease: 'easeInOut' },
          style: { overflow: 'hidden' },
          children: label,
        }),
        collapsed &&
          _jsxs(motion.div, {
            className:
              'absolute left-16 top-1/2 -translate-y-1/2 bg-dark-700 text-white/90 px-2 py-1 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 border border-white/10',
            initial: { opacity: 0, x: -10 },
            animate: { opacity: 0, x: 0 },
            whileHover: { opacity: 1, x: 0 },
            children: [
              label,
              _jsx('div', {
                className:
                  'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-dark-700 border-l border-b border-white/10 rotate-45',
              }),
            ],
          }),
      ],
    }),
  })
}
