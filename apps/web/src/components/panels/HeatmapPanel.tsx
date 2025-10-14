/**
 * HeatmapPanel - Real-time heatmap visualization
 * Custom canvas-based heatmap (no heatmap.js dependency)
 */

import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { GlassCard } from '../ui/GlassCard'
import { useAnalyticsStore } from '../../store/analyticsStore'
import { theme } from '../../config/theme'
import type { HeatmapData } from '../../types/streams'

interface HeatmapPanelProps {
  data?: HeatmapData
  onToggle?: () => void
  width?: number
  height?: number
  className?: string
}

export const HeatmapPanel: React.FC<HeatmapPanelProps> = ({
  data: externalData,
  onToggle,
  width = 800,
  height = 600,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isVisible, setIsVisible] = useState(true)

  // Get heatmap data from store if not provided externally
  const globalData = useAnalyticsStore((state) => state.globalData)
  const heatmapData = externalData || globalData?.heatmap

  const hexToRgb = (hex: string) => {
    const normalized = hex.replace('#', '')
    const bigint = parseInt(normalized, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return { r, g, b }
  }

  const drawHeatPoint = (
    ctx: CanvasRenderingContext2D,
    point: HeatmapData['points'][number]
  ) => {
    const x = point.x * width
    const y = point.y * height
    const intensity = Math.min(Math.max(point.intensity, 0), 1)
    const radius = 40

    let color: string
    if (intensity < 0.3) {
      color = theme.colors.accent.blue
    } else if (intensity < 0.6) {
      color = theme.colors.accent.purple
    } else if (intensity < 0.8) {
      color = theme.colors.accent.orange
    } else {
      color = theme.colors.accent.red
    }

    const { r, g, b } = hexToRgb(color)

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${intensity * 0.6})`)
    gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${intensity * 0.25})`)
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

    ctx.fillStyle = gradient
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2)
  }

  const renderHeatmap = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    data: HeatmapData
  ) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    if (!data || !data.points || data.points.length === 0) {
      return
    }

    ctx.save()
    ctx.globalCompositeOperation = 'lighter'

    data.points.forEach((point) => {
      drawHeatPoint(ctx, point)
    })

    ctx.restore()

    const blurCanvas = document.createElement('canvas')
    blurCanvas.width = width
    blurCanvas.height = height
    const blurCtx = blurCanvas.getContext('2d')
    if (!blurCtx) return

    blurCtx.filter = 'blur(18px)'
    blurCtx.drawImage(canvas, 0, 0)

    ctx.globalAlpha = 0.85
    ctx.drawImage(blurCanvas, 0, 0)
    ctx.globalAlpha = 1
  }

  // Update heatmap when data changes
  useEffect(() => {
    if (!canvasRef.current || !heatmapData || !isVisible) return

    const ctx = canvasRef.current.getContext('2d', {
      willReadFrequently: true,
    })
    if (!ctx) return

    renderHeatmap(ctx, canvasRef.current, heatmapData)
  }, [heatmapData, width, height, isVisible])

  // Mount animation
  useEffect(() => {
    if (!containerRef.current) return

    gsap.fromTo(
      containerRef.current,
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

  const handleToggle = () => {
    setIsVisible((prev) => !prev)
    if (onToggle) {
      onToggle()
    }
  }

  return (
    <GlassCard
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      border={true}
      glow={false}
    >
      <div className="p-4">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <h3
            className="text-sm font-semibold"
            style={{ color: theme.colors.text.primary }}
          >
            Heatmap Overlay
          </h3>
          <button
            onClick={handleToggle}
            className="rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-105"
            style={{
              background: isVisible
                ? theme.gradients.primary
                : 'rgba(255, 255, 255, 0.1)',
              color: theme.colors.text.primary,
              border: `1px solid ${theme.colors.border.light}`,
            }}
          >
            {isVisible ? 'Hide' : 'Show'}
          </button>
        </div>

        {/* Heatmap Canvas */}
        <div className="relative overflow-hidden rounded-lg">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="block"
            style={{
              background: theme.colors.surface.darkest,
              border: `1px solid ${theme.colors.border.default}`,
              opacity: isVisible ? 1 : 0.3,
              transition: 'opacity 350ms',
              maxWidth: '100%',
              height: 'auto',
            }}
          />
        </div>

        {/* Stats */}
        {heatmapData && (
          <div className="mt-3 flex items-center justify-between text-xs">
            <span style={{ color: theme.colors.text.secondary }}>
              Points: {heatmapData.points.length}
            </span>
            <span style={{ color: theme.colors.text.dim }}>
              Resolution: {width}x{height}
            </span>
          </div>
        )}
      </div>
    </GlassCard>
  )
}
