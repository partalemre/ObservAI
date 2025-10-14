/**
 * Sparkline Chart Component (mini line chart)
 */
import React from 'react'
interface SparklineChartProps {
  data: number[]
  color?: string
  height?: number
  className?: string
}
export declare const SparklineChart: React.FC<SparklineChartProps>
export {}
