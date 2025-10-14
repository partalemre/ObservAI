import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
/**
 * Live KPI Panel
 * Displays entries, exits, current, queue with sparkline
 */
import { useEffect, useRef } from 'react'
import { ArrowDown, ArrowUp, Users, Clock } from 'lucide-react'
import gsap from 'gsap'
import { GlassCard } from '../ui/GlassCard'
import { SparklineChart } from '../charts/SparklineChart'
import { useAnalyticsStore } from '../../store/analyticsStore'
import { theme } from '../../config/theme'
export const LiveKpiPanel = () => {
  const { globalData, history, connectionState, isDemoMode, toggleDemoMode } =
    useAnalyticsStore()
  const cardRef = useRef(null)
  useEffect(() => {
    if (cardRef.current) {
      gsap.from(cardRef.current, {
        scale: 0.96,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.out',
      })
    }
  }, [])
  const sparklineData = history.map((h) => h.current)
  const recentData = sparklineData.slice(-30) // Last 30 samples
  const kpis = [
    {
      icon: ArrowDown,
      label: 'Entries',
      value: globalData?.entries ?? 0,
      color: theme.colors.accent.lime,
    },
    {
      icon: ArrowUp,
      label: 'Exits',
      value: globalData?.exits ?? 0,
      color: theme.colors.accent.red,
    },
    {
      icon: Users,
      label: 'Current',
      value: globalData?.current ?? 0,
      color: theme.colors.accent.blue,
    },
    {
      icon: Clock,
      label: 'Queue',
      value: globalData?.queue ?? 0,
      color: theme.colors.accent.orange,
    },
  ]
  return _jsxs(GlassCard, {
    ref: cardRef,
    className: 'p-6',
    border: true,
    glow: connectionState === 'open',
    children: [
      _jsxs('div', {
        className: 'mb-6 flex items-center justify-between',
        children: [
          _jsxs('div', {
            children: [
              _jsx('h3', {
                className: 'text-lg font-semibold text-white',
                children: 'Live KPIs',
              }),
              _jsxs('p', {
                className: 'mt-1 text-xs text-gray-400',
                children: [
                  connectionState === 'open' &&
                    _jsx('span', {
                      className: 'text-green-400',
                      children: '\u25CF Live',
                    }),
                  connectionState === 'demo' &&
                    _jsx('span', {
                      className: 'text-yellow-400',
                      children: '\u25CF Demo',
                    }),
                  connectionState === 'retrying' &&
                    _jsx('span', {
                      className: 'text-orange-400',
                      children: '\u25CF Reconnecting...',
                    }),
                  connectionState === 'closed' &&
                    _jsx('span', {
                      className: 'text-red-400',
                      children: '\u25CF Disconnected',
                    }),
                ],
              }),
            ],
          }),
          _jsx('button', {
            onClick: toggleDemoMode,
            className:
              'rounded-lg border border-white/12 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-white/10',
            children: isDemoMode ? 'Try Live' : 'Demo Mode',
          }),
        ],
      }),
      _jsx('div', {
        className: 'grid grid-cols-2 gap-4',
        children: kpis.map((kpi, idx) => {
          const Icon = kpi.icon
          return _jsxs(
            'div',
            {
              className: 'flex flex-col',
              children: [
                _jsxs('div', {
                  className: 'mb-2 flex items-center gap-2',
                  children: [
                    _jsx(Icon, { size: 16, color: kpi.color }),
                    _jsx('span', {
                      className: 'text-xs font-medium text-gray-400',
                      children: kpi.label,
                    }),
                  ],
                }),
                _jsx('div', {
                  className: 'text-3xl font-bold',
                  style: { color: kpi.color },
                  children: kpi.value,
                }),
              ],
            },
            idx
          )
        }),
      }),
      recentData.length > 0 &&
        _jsxs('div', {
          className: 'mt-6',
          children: [
            _jsx('div', {
              className: 'mb-2 text-xs font-medium text-gray-400',
              children: 'Current (Last 30 samples)',
            }),
            _jsx(SparklineChart, {
              data: recentData,
              color: theme.colors.accent.blue,
              height: 50,
            }),
          ],
        }),
    ],
  })
}
