import React, { useEffect, useState, useRef } from 'react'
import { Card } from '../../components/ui/Card'

interface CameraMetrics {
  ts: string
  peopleIn: number
  peopleOut: number
  current: number
  ageBuckets: {
    child: number
    teen: number
    adult: number
    senior: number
  }
  gender: {
    male: number
    female: number
    unknown: number
  }
  queue: {
    current: number
    averageWaitSeconds: number
    longestWaitSeconds: number
  }
  tables: Array<{
    id: string
    name: string
    currentOccupants: number
    avgStaySeconds: number
    longestStaySeconds: number
  }>
  heatmap: number[][]
}

const CameraView: React.FC = () => {
  const [metrics, setMetrics] = useState<CameraMetrics | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket('ws://localhost:8001/ws')

    ws.onopen = () => {
      console.log('WebSocket connected')
      setIsConnected(true)
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setMetrics(data)
      } catch (error) {
        console.error('Failed to parse metrics:', error)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      setIsConnected(false)
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
      setIsConnected(false)
    }

    wsRef.current = ws

    return () => {
      ws.close()
    }
  }, [])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}m ${secs}s`
  }

  const getOccupancyStatus = (
    occupants: number
  ): { color: string; label: string } => {
    if (occupants === 0)
      return { color: 'bg-gray-500/30 border-gray-400', label: 'Empty' }
    if (occupants <= 2)
      return { color: 'bg-green-500/30 border-green-400', label: 'Available' }
    if (occupants <= 4)
      return { color: 'bg-yellow-500/30 border-yellow-400', label: 'Moderate' }
    return { color: 'bg-red-500/30 border-red-400', label: 'Full' }
  }

  const getQueueAlert = (waitTime: number): boolean => {
    return waitTime > 300 // Alert if wait > 5 minutes
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Connection Status */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${isConnected ? 'animate-pulse bg-green-400' : 'bg-red-400'}`}
          />
          <span className="text-sm font-medium text-white">
            {isConnected ? 'Camera Feed Active' : 'Disconnected'}
          </span>
        </div>
        <div className="text-sm text-white/60">
          {metrics?.ts && new Date(metrics.ts).toLocaleTimeString()}
        </div>
      </div>

      {/* Main Camera View Container */}
      <div className="relative aspect-video overflow-hidden rounded-xl border border-purple-500/30 bg-black/50 backdrop-blur-sm">
        {/* Simulated Camera Feed Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />

        {/* Camera Feed Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="font-mono text-lg text-white/40">
            Live Camera Feed (Visualization Only)
          </div>
        </div>

        {/* Glass Overlay Cards */}
        {metrics && (
          <div className="absolute inset-0 p-6">
            {/* Top Stats Bar */}
            <div className="mb-4 flex gap-4">
              <GlassCard>
                <div className="text-sm font-semibold text-green-400">IN</div>
                <div className="text-2xl font-bold text-white">
                  {metrics.peopleIn}
                </div>
              </GlassCard>

              <GlassCard>
                <div className="text-sm font-semibold text-red-400">OUT</div>
                <div className="text-2xl font-bold text-white">
                  {metrics.peopleOut}
                </div>
              </GlassCard>

              <GlassCard>
                <div className="text-sm font-semibold text-blue-400">
                  CURRENT
                </div>
                <div className="text-2xl font-bold text-white">
                  {metrics.current}
                </div>
              </GlassCard>
            </div>

            {/* Queue Status */}
            {metrics.queue.current > 0 && (
              <GlassCard
                className={`mb-4 ${
                  getQueueAlert(metrics.queue.longestWaitSeconds)
                    ? 'border-red-500 bg-red-500/20'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="mb-1 text-sm font-semibold text-purple-400">
                      QUEUE
                    </div>
                    <div className="text-xl font-bold text-white">
                      {metrics.queue.current} waiting
                    </div>
                    <div className="mt-1 text-xs text-white/60">
                      Avg: {formatTime(metrics.queue.averageWaitSeconds)} |
                      Longest: {formatTime(metrics.queue.longestWaitSeconds)}
                    </div>
                  </div>
                  {getQueueAlert(metrics.queue.longestWaitSeconds) && (
                    <div className="animate-pulse text-xs font-bold text-red-400">
                      ⚠ ALERT
                    </div>
                  )}
                </div>
              </GlassCard>
            )}

            {/* Table Grid */}
            <div className="mb-4 grid grid-cols-3 gap-3">
              {metrics.tables.map((table) => {
                const status = getOccupancyStatus(table.currentOccupants)
                const hasLongStay = table.longestStaySeconds > 3600 // Alert if > 1 hour

                return (
                  <GlassCard
                    key={table.id}
                    className={`${status.color} ${hasLongStay ? 'border-orange-500' : ''}`}
                  >
                    <div className="mb-1 text-sm font-bold text-white">
                      {table.name || table.id}
                    </div>
                    <div className="mb-2 text-xs text-white/80">
                      {status.label}
                    </div>
                    <div className="text-lg font-bold text-white">
                      {table.currentOccupants}{' '}
                      {table.currentOccupants === 1 ? 'guest' : 'guests'}
                    </div>
                    {table.currentOccupants > 0 && (
                      <div className="mt-1 text-xs text-white/50">
                        Stay: {formatTime(table.longestStaySeconds)}
                      </div>
                    )}
                    {hasLongStay && (
                      <div className="mt-1 text-xs font-bold text-orange-400">
                        ⏰ Long Stay
                      </div>
                    )}
                  </GlassCard>
                )
              })}
            </div>

            {/* Demographics */}
            <div className="flex gap-4">
              <GlassCard className="flex-1">
                <div className="mb-2 text-sm font-semibold text-cyan-400">
                  AGE GROUPS
                </div>
                <div className="space-y-1">
                  <DemoBar
                    label="Child (0-12)"
                    value={metrics.ageBuckets.child}
                    max={metrics.current}
                  />
                  <DemoBar
                    label="Teen (13-19)"
                    value={metrics.ageBuckets.teen}
                    max={metrics.current}
                  />
                  <DemoBar
                    label="Adult (20-59)"
                    value={metrics.ageBuckets.adult}
                    max={metrics.current}
                  />
                  <DemoBar
                    label="Senior (60+)"
                    value={metrics.ageBuckets.senior}
                    max={metrics.current}
                  />
                </div>
              </GlassCard>

              <GlassCard className="flex-1">
                <div className="mb-2 text-sm font-semibold text-pink-400">
                  GENDER
                </div>
                <div className="space-y-1">
                  <DemoBar
                    label="Male"
                    value={metrics.gender.male}
                    max={metrics.current}
                  />
                  <DemoBar
                    label="Female"
                    value={metrics.gender.female}
                    max={metrics.current}
                  />
                  {metrics.gender.unknown > 0 && (
                    <DemoBar
                      label="Unknown"
                      value={metrics.gender.unknown}
                      max={metrics.current}
                    />
                  )}
                </div>
              </GlassCard>
            </div>
          </div>
        )}

        {/* Grid Overlay (Kibsi-style) */}
        <div className="pointer-events-none absolute inset-0">
          <svg className="h-full w-full opacity-10">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="cyan"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>
    </div>
  )
}

// Glassmorphism Card Component
const GlassCard: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className = '' }) => {
  return (
    <div
      className={`rounded-lg border border-purple-500/30 bg-slate-800/40 p-3 shadow-lg backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  )
}

// Demographics Bar Component
const DemoBar: React.FC<{ label: string; value: number; max: number }> = ({
  label,
  value,
  max,
}) => {
  const percentage = max > 0 ? (value / max) * 100 : 0

  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-white/70">
        <span>{label}</span>
        <span className="font-mono">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default CameraView
