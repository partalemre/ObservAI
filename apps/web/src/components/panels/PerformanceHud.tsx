/**
 * PerformanceHud - Performance metrics overlay
 * Small HUD showing FPS, latency, and dropped frames
 */

import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { useAnalyticsStore } from '../../store/analyticsStore'
import { theme } from '../../config/theme'

interface PerformanceHudProps {
  className?: string
}

export const PerformanceHud: React.FC<PerformanceHudProps> = ({
  className = '',
}) => {
  const hudRef = useRef<HTMLDivElement>(null)
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
  const getFpsColor = (fps: number) => {
    if (fps >= 50) return theme.colors.status.success
    if (fps >= 30) return theme.colors.status.moderate
    return theme.colors.status.critical
  }

  const getLatencyColor = (latency: number) => {
    if (latency < 50) return theme.colors.status.success
    if (latency < 150) return theme.colors.status.moderate
    return theme.colors.status.critical
  }

  return (
    <div
      className={`fixed top-4 right-4 z-40 ${className}`}
      style={{ userSelect: 'none' }}
    >
      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className="absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all duration-200 hover:scale-110"
        style={{
          background: theme.gradients.primary,
          color: '#ffffff',
          boxShadow: theme.shadows.md,
        }}
      >
        {isVisible ? '−' : '+'}
      </button>

      {/* HUD Content */}
      <div
        ref={hudRef}
        className="min-w-[180px] rounded-xl border border-white/12 p-3 backdrop-blur-[22px]"
        style={{
          background: 'rgba(20, 20, 28, 0.65)',
          boxShadow: theme.shadows.md,
        }}
      >
        {/* Header */}
        <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-2">
          <span
            className="text-xs font-semibold"
            style={{ color: theme.colors.text.primary }}
          >
            Performance
          </span>
          <div
            className="h-2 w-2 animate-pulse rounded-full"
            style={{
              background: theme.colors.status.success,
              boxShadow: `0 0 8px ${theme.colors.status.success}`,
            }}
          />
        </div>

        {/* Metrics */}
        <div className="space-y-2">
          {/* FPS */}
          <div className="flex items-center justify-between">
            <span
              className="text-xs font-medium"
              style={{ color: theme.colors.text.secondary }}
            >
              FPS
            </span>
            <span
              className="font-mono text-sm font-bold"
              style={{ color: getFpsColor(performance.fps) }}
            >
              {performance.fps.toFixed(0)}
            </span>
          </div>

          {/* Latency */}
          <div className="flex items-center justify-between">
            <span
              className="text-xs font-medium"
              style={{ color: theme.colors.text.secondary }}
            >
              Latency
            </span>
            <span
              className="font-mono text-sm font-bold"
              style={{ color: getLatencyColor(performance.latency) }}
            >
              {performance.latency.toFixed(0)}ms
            </span>
          </div>

          {/* Dropped Frames */}
          <div className="flex items-center justify-between">
            <span
              className="text-xs font-medium"
              style={{ color: theme.colors.text.secondary }}
            >
              Dropped
            </span>
            <span
              className="font-mono text-sm font-bold"
              style={{
                color:
                  performance.droppedFrames > 10
                    ? theme.colors.status.critical
                    : theme.colors.text.primary,
              }}
            >
              {performance.droppedFrames}
            </span>
          </div>

          {/* Memory Usage (if available) */}
          {performance.memoryUsage !== undefined && (
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-medium"
                style={{ color: theme.colors.text.secondary }}
              >
                Memory
              </span>
              <span
                className="font-mono text-sm font-bold"
                style={{ color: theme.colors.text.primary }}
              >
                {(performance.memoryUsage / 1024 / 1024).toFixed(1)}MB
              </span>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="mt-3 border-t border-white/10 pt-2">
          <div className="flex items-center gap-2">
            <div
              className="h-1 flex-1 overflow-hidden rounded-full"
              style={{ background: 'rgba(255, 255, 255, 0.1)' }}
            >
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${Math.min((performance.fps / 60) * 100, 100)}%`,
                  background: theme.gradients.primary,
                }}
              />
            </div>
            <span
              className="text-[10px] font-medium"
              style={{ color: theme.colors.text.dim }}
            >
              {((performance.fps / 60) * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
