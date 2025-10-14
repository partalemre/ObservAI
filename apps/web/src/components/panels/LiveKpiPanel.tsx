/**
 * Live KPI Panel
 * Displays entries, exits, current, queue with sparkline
 */

import React, { useEffect, useRef } from 'react'
import { ArrowDown, ArrowUp, Users, Clock } from 'lucide-react'
import gsap from 'gsap'
import { GlassCard } from '../ui/GlassCard'
import { SparklineChart } from '../charts/SparklineChart'
import { useAnalyticsStore } from '../../store/analyticsStore'
import { theme } from '../../config/theme'

export const LiveKpiPanel: React.FC = () => {
  const { globalData, history, connectionState, isDemoMode, toggleDemoMode } =
    useAnalyticsStore()
  const cardRef = useRef<HTMLDivElement>(null)

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

  return (
    <GlassCard
      ref={cardRef}
      className="p-6"
      border
      glow={connectionState === 'open'}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Live KPIs</h3>
          <p className="mt-1 text-xs text-gray-400">
            {connectionState === 'open' && (
              <span className="text-green-400">● Live</span>
            )}
            {connectionState === 'demo' && (
              <span className="text-yellow-400">● Demo</span>
            )}
            {connectionState === 'retrying' && (
              <span className="text-orange-400">● Reconnecting...</span>
            )}
            {connectionState === 'closed' && (
              <span className="text-red-400">● Disconnected</span>
            )}
          </p>
        </div>
        <button
          onClick={toggleDemoMode}
          className="rounded-lg border border-white/12 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-white/10"
        >
          {isDemoMode ? 'Try Live' : 'Demo Mode'}
        </button>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-2 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <div key={idx} className="flex flex-col">
              <div className="mb-2 flex items-center gap-2">
                <Icon size={16} color={kpi.color} />
                <span className="text-xs font-medium text-gray-400">
                  {kpi.label}
                </span>
              </div>
              <div className="text-3xl font-bold" style={{ color: kpi.color }}>
                {kpi.value}
              </div>
            </div>
          )
        })}
      </div>

      {/* Sparkline */}
      {recentData.length > 0 && (
        <div className="mt-6">
          <div className="mb-2 text-xs font-medium text-gray-400">
            Current (Last 30 samples)
          </div>
          <SparklineChart
            data={recentData}
            color={theme.colors.accent.blue}
            height={50}
          />
        </div>
      )}
    </GlassCard>
  )
}
