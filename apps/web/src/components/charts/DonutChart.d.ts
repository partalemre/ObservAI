/**
 * Donut Chart Component
 */
import React from 'react'
interface DonutChartProps {
  data: Array<{
    name: string
    value: number
    color?: string
  }>
  height?: number
  className?: string
}
export declare const DonutChart: React.FC<DonutChartProps>
export {}
