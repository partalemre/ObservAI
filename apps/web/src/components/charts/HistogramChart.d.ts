/**
 * Histogram Chart Component
 */
import React from 'react'
interface HistogramChartProps {
  bins: Array<{
    label: string
    value: number
  }>
  percentiles?: {
    p50?: number
    p90?: number
  }
  height?: number
  className?: string
}
export declare const HistogramChart: React.FC<HistogramChartProps>
export {}
