import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react'
import { fetchAlerts } from '../../../lib/api/dashboard'
import { Skeleton } from '../../../components/ui'
export const AlertsWidget = () => {
  const { data: alerts, isLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn: fetchAlerts,
    refetchInterval: 15000, // 15 saniyede bir güncelle
  })
  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return _jsx(AlertTriangle, { className: 'w-4 h-4' })
      case 'error':
        return _jsx(XCircle, { className: 'w-4 h-4' })
      case 'success':
        return _jsx(CheckCircle, { className: 'w-4 h-4' })
      case 'info':
      default:
        return _jsx(Info, { className: 'w-4 h-4' })
    }
  }
  const getAlertStyle = (type) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
      case 'error':
        return 'bg-red-500/10 border-red-500/20 text-red-400'
      case 'success':
        return 'bg-green-500/10 border-green-500/20 text-green-400'
      case 'info':
      default:
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400'
    }
  }
  const getPulseColor = (type) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-400'
      case 'error':
        return 'bg-red-400'
      case 'success':
        return 'bg-green-400'
      case 'info':
      default:
        return 'bg-blue-400'
    }
  }
  if (isLoading) {
    return _jsxs('div', {
      className: 'glass-card rounded-xl p-6',
      children: [
        _jsxs('div', {
          className: 'flex items-center gap-3 mb-4',
          children: [
            _jsx(Skeleton, { className: 'h-10 w-10 rounded-lg' }),
            _jsx(Skeleton, { className: 'h-6 w-24' }),
          ],
        }),
        _jsx('div', {
          className: 'space-y-3',
          children: Array.from({ length: 3 }).map((_, i) =>
            _jsx(
              'div',
              {
                className: 'p-3 border rounded-lg',
                children: _jsxs('div', {
                  className: 'flex items-start gap-3',
                  children: [
                    _jsx(Skeleton, { className: 'h-4 w-4 rounded' }),
                    _jsxs('div', {
                      className: 'flex-1',
                      children: [
                        _jsx(Skeleton, { className: 'h-4 w-full mb-2' }),
                        _jsx(Skeleton, { className: 'h-3 w-16' }),
                      ],
                    }),
                  ],
                }),
              },
              i
            )
          ),
        }),
      ],
    })
  }
  return _jsxs(motion.div, {
    className:
      'glass-card rounded-xl p-6 hover:border-white/20 transition-all duration-300',
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: 0.5 },
    children: [
      _jsxs('div', {
        className: 'flex items-center justify-between mb-6',
        children: [
          _jsxs('div', {
            className: 'flex items-center gap-3',
            children: [
              _jsxs('div', {
                className:
                  'relative w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center',
                children: [
                  _jsx(Bell, { className: 'w-5 h-5 text-red-400' }),
                  alerts &&
                    alerts.length > 0 &&
                    _jsx(motion.div, {
                      className:
                        'absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold',
                      initial: { scale: 0 },
                      animate: { scale: 1 },
                      transition: {
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                      },
                      children: alerts.length,
                    }),
                ],
              }),
              _jsxs('div', {
                children: [
                  _jsx('h3', {
                    className: 'text-lg font-semibold text-white',
                    children: 'Uyar\u0131lar',
                  }),
                  _jsx('p', {
                    className: 'text-sm text-white/60',
                    children: 'Anl\u0131k bildirimler',
                  }),
                ],
              }),
            ],
          }),
          _jsxs('div', {
            className:
              'flex items-center gap-2 text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full',
            children: [_jsx(Clock, { className: 'w-3 h-3' }), 'Canl\u0131'],
          }),
        ],
      }),
      _jsx('div', {
        className: 'space-y-3 max-h-64 overflow-y-auto custom-scrollbar',
        children: _jsx(AnimatePresence, {
          children:
            alerts && alerts.length > 0
              ? alerts.map((alert, index) =>
                  _jsx(
                    motion.div,
                    {
                      className: `p-3 rounded-lg border transition-all duration-200 hover:scale-[1.02] ${getAlertStyle(alert.type)}`,
                      initial: { opacity: 0, x: -20, scale: 0.95 },
                      animate: { opacity: 1, x: 0, scale: 1 },
                      exit: { opacity: 0, x: 20, scale: 0.95 },
                      transition: { delay: index * 0.1 },
                      layout: true,
                      children: _jsxs('div', {
                        className: 'flex items-start gap-3',
                        children: [
                          _jsxs('div', {
                            className: 'relative mt-0.5',
                            children: [
                              getAlertIcon(alert.type),
                              _jsx(motion.div, {
                                className: `absolute -top-1 -right-1 w-2 h-2 rounded-full ${getPulseColor(alert.type)}`,
                                animate: {
                                  scale: [1, 1.2, 1],
                                  opacity: [0.7, 1, 0.7],
                                },
                                transition: {
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                                },
                              }),
                            ],
                          }),
                          _jsxs('div', {
                            className: 'flex-1 min-w-0',
                            children: [
                              _jsx('p', {
                                className:
                                  'text-sm font-medium text-white/90 mb-1',
                                children: alert.message,
                              }),
                              _jsxs('div', {
                                className:
                                  'flex items-center gap-1 text-xs opacity-70',
                                children: [
                                  _jsx(Clock, { className: 'w-3 h-3' }),
                                  alert.time,
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    },
                    alert.id
                  )
                )
              : _jsxs(motion.div, {
                  className: 'text-center py-8',
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  children: [
                    _jsx('div', {
                      className:
                        'w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center',
                      children: _jsx(CheckCircle, {
                        className: 'w-8 h-8 text-green-400',
                      }),
                    }),
                    _jsx('p', {
                      className: 'text-white/60',
                      children: 'Aktif uyar\u0131 yok',
                    }),
                    _jsx('p', {
                      className: 'text-sm text-white/40 mt-1',
                      children: 'Sistem normal \u00E7al\u0131\u015F\u0131yor',
                    }),
                  ],
                }),
        }),
      }),
      alerts &&
        alerts.length > 3 &&
        _jsx('div', {
          className: 'mt-4 pt-4 border-t border-white/10',
          children: _jsxs('button', {
            className:
              'w-full text-sm text-primary-400 hover:text-primary-300 transition-colors duration-200 font-medium',
            children: [
              'T\u00FCm\u00FCn\u00FC G\u00F6r\u00FCnt\u00FCle (',
              alerts.length - 3,
              ' daha)',
            ],
          }),
        }),
    ],
  })
}
