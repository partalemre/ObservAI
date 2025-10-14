import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
/**
 * PerformanceHud - Performance metrics overlay
 * Small HUD showing FPS, latency, and dropped frames
 */
import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { useAnalyticsStore } from '../../store/analyticsStore'
import { theme } from '../../config/theme'
export const PerformanceHud = ({ className = '' }) => {
  const hudRef = useRef(null)
  const [isVisible, setIsVisible] = useState(true)
  // Get performance metrics from store
  const performance = useAnalyticsStore((state) => state.performance)
  // Mount animation
  useEffect(() => {
    if (!hudRef.current) return
    gsap.fromTo(
      hudRef.current,
      {
        scale: 0.96,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.35,
        ease: 'power2.out',
      }
    )
  }, [])
  // Toggle visibility
  const handleToggle = () => {
    if (!hudRef.current) return
    const newVisibility = !isVisible
    gsap.to(hudRef.current, {
      opacity: newVisibility ? 1 : 0,
      duration: 0.3,
      ease: 'power2.inOut',
    })
    setIsVisible(newVisibility)
  }
  // Determine status colors
  const getFpsColor = (fps) => {
    if (fps >= 50) return theme.colors.status.success
    if (fps >= 30) return theme.colors.status.moderate
    return theme.colors.status.critical
  }
  const getLatencyColor = (latency) => {
    if (latency < 50) return theme.colors.status.success
    if (latency < 150) return theme.colors.status.moderate
    return theme.colors.status.critical
  }
  return _jsxs('div', {
    className: `fixed top-4 right-4 z-40 ${className}`,
    style: { userSelect: 'none' },
    children: [
      _jsx('button', {
        onClick: handleToggle,
        className:
          'absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 hover:scale-110 z-10',
        style: {
          background: theme.gradients.primary,
          color: '#ffffff',
          boxShadow: theme.shadows.md,
        },
        children: isVisible ? '−' : '+',
      }),
      _jsxs('div', {
        ref: hudRef,
        className:
          'rounded-xl backdrop-blur-[22px] border border-white/12 p-3 min-w-[180px]',
        style: {
          background: 'rgba(20, 20, 28, 0.65)',
          boxShadow: theme.shadows.md,
        },
        children: [
          _jsxs('div', {
            className:
              'flex items-center justify-between mb-2 pb-2 border-b border-white/10',
            children: [
              _jsx('span', {
                className: 'text-xs font-semibold',
                style: { color: theme.colors.text.primary },
                children: 'Performance',
              }),
              _jsx('div', {
                className: 'w-2 h-2 rounded-full animate-pulse',
                style: {
                  background: theme.colors.status.success,
                  boxShadow: `0 0 8px ${theme.colors.status.success}`,
                },
              }),
            ],
          }),
          _jsxs('div', {
            className: 'space-y-2',
            children: [
              _jsxs('div', {
                className: 'flex items-center justify-between',
                children: [
                  _jsx('span', {
                    className: 'text-xs font-medium',
                    style: { color: theme.colors.text.secondary },
                    children: 'FPS',
                  }),
                  _jsx('span', {
                    className: 'text-sm font-mono font-bold',
                    style: { color: getFpsColor(performance.fps) },
                    children: performance.fps.toFixed(0),
                  }),
                ],
              }),
              _jsxs('div', {
                className: 'flex items-center justify-between',
                children: [
                  _jsx('span', {
                    className: 'text-xs font-medium',
                    style: { color: theme.colors.text.secondary },
                    children: 'Latency',
                  }),
                  _jsxs('span', {
                    className: 'text-sm font-mono font-bold',
                    style: { color: getLatencyColor(performance.latency) },
                    children: [performance.latency.toFixed(0), 'ms'],
                  }),
                ],
              }),
              _jsxs('div', {
                className: 'flex items-center justify-between',
                children: [
                  _jsx('span', {
                    className: 'text-xs font-medium',
                    style: { color: theme.colors.text.secondary },
                    children: 'Dropped',
                  }),
                  _jsx('span', {
                    className: 'text-sm font-mono font-bold',
                    style: {
                      color:
                        performance.droppedFrames > 10
                          ? theme.colors.status.critical
                          : theme.colors.text.primary,
                    },
                    children: performance.droppedFrames,
                  }),
                ],
              }),
              performance.memoryUsage !== undefined &&
                _jsxs('div', {
                  className: 'flex items-center justify-between',
                  children: [
                    _jsx('span', {
                      className: 'text-xs font-medium',
                      style: { color: theme.colors.text.secondary },
                      children: 'Memory',
                    }),
                    _jsxs('span', {
                      className: 'text-sm font-mono font-bold',
                      style: { color: theme.colors.text.primary },
                      children: [
                        (performance.memoryUsage / 1024 / 1024).toFixed(1),
                        'MB',
                      ],
                    }),
                  ],
                }),
            ],
          }),
          _jsx('div', {
            className: 'mt-3 pt-2 border-t border-white/10',
            children: _jsxs('div', {
              className: 'flex items-center gap-2',
              children: [
                _jsx('div', {
                  className: 'flex-1 h-1 rounded-full overflow-hidden',
                  style: { background: 'rgba(255, 255, 255, 0.1)' },
                  children: _jsx('div', {
                    className: 'h-full transition-all duration-300',
                    style: {
                      width: `${Math.min((performance.fps / 60) * 100, 100)}%`,
                      background: theme.gradients.primary,
                    },
                  }),
                }),
                _jsxs('span', {
                  className: 'text-[10px] font-medium',
                  style: { color: theme.colors.text.dim },
                  children: [((performance.fps / 60) * 100).toFixed(0), '%'],
                }),
              ],
            }),
          }),
        ],
      }),
    ],
  })
}
