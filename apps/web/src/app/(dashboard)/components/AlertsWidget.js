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
        return _jsx(AlertTriangle, { className: 'h-4 w-4' })
      case 'error':
        return _jsx(XCircle, { className: 'h-4 w-4' })
      case 'success':
        return _jsx(CheckCircle, { className: 'h-4 w-4' })
      case 'info':
      default:
        return _jsx(Info, { className: 'h-4 w-4' })
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
          className: 'mb-4 flex items-center gap-3',
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
                className: 'rounded-lg border p-3',
                children: _jsxs('div', {
                  className: 'flex items-start gap-3',
                  children: [
                    _jsx(Skeleton, { className: 'h-4 w-4 rounded' }),
                    _jsxs('div', {
                      className: 'flex-1',
                      children: [
                        _jsx(Skeleton, { className: 'mb-2 h-4 w-full' }),
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
      'glass-card rounded-xl p-6 transition-all duration-300 hover:border-white/20',
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: 0.5 },
    children: [
      _jsxs('div', {
        className: 'mb-6 flex items-center justify-between',
        children: [
          _jsxs('div', {
            className: 'flex items-center gap-3',
            children: [
              _jsxs('div', {
                className:
                  'relative flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20',
                children: [
                  _jsx(Bell, { className: 'h-5 w-5 text-red-400' }),
                  alerts &&
                    alerts.length > 0 &&
                    _jsx(motion.div, {
                      className:
                        'absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white',
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
              'flex items-center gap-2 rounded-full bg-white/10 px-2 py-1 text-xs text-white/60',
            children: [_jsx(Clock, { className: 'h-3 w-3' }), 'Canl\u0131'],
          }),
        ],
      }),
      _jsx('div', {
        className: 'custom-scrollbar max-h-64 space-y-3 overflow-y-auto',
        children: _jsx(AnimatePresence, {
          children:
            alerts && alerts.length > 0
              ? alerts.map((alert, index) =>
                  _jsx(
                    motion.div,
                    {
                      className: `rounded-lg border p-3 transition-all duration-200 hover:scale-[1.02] ${getAlertStyle(alert.type)}`,
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
                                className: `absolute -top-1 -right-1 h-2 w-2 rounded-full ${getPulseColor(alert.type)}`,
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
                            className: 'min-w-0 flex-1',
                            children: [
                              _jsx('p', {
                                className:
                                  'mb-1 text-sm font-medium text-white/90',
                                children: alert.message,
                              }),
                              _jsxs('div', {
                                className:
                                  'flex items-center gap-1 text-xs opacity-70',
                                children: [
                                  _jsx(Clock, { className: 'h-3 w-3' }),
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
                  className: 'py-8 text-center',
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  children: [
                    _jsx('div', {
                      className:
                        'mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20',
                      children: _jsx(CheckCircle, {
                        className: 'h-8 w-8 text-green-400',
                      }),
                    }),
                    _jsx('p', {
                      className: 'text-white/60',
                      children: 'Aktif uyar\u0131 yok',
                    }),
                    _jsx('p', {
                      className: 'mt-1 text-sm text-white/40',
                      children: 'Sistem normal \u00E7al\u0131\u015F\u0131yor',
                    }),
                  ],
                }),
        }),
      }),
      alerts &&
        alerts.length > 3 &&
        _jsx('div', {
          className: 'mt-4 border-t border-white/10 pt-4',
          children: _jsxs('button', {
            className:
              'text-primary-400 hover:text-primary-300 w-full text-sm font-medium transition-colors duration-200',
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
