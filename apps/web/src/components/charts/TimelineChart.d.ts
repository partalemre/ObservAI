/**
 * Timeline Chart Component (dual-axis line chart)
 */
import React from 'react'
interface TimelineChartProps {
  timestamps: string[]
  series: Array<{
    name: string
    data: number[]
    yAxisIndex?: number
    color?: string
  }>
  height?: number
  className?: string
}
export declare const TimelineChart: React.FC<TimelineChartProps>
export {}
