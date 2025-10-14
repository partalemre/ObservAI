/**
 * Gauge Chart Component
 */
import React from 'react'
interface GaugeChartProps {
  value: number
  max?: number
  title?: string
  height?: number
  className?: string
}
export declare const GaugeChart: React.FC<GaugeChartProps>
export {}
