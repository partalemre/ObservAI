/**
 * Grouped Bar Chart Component
 */
import React from 'react'
interface GroupedBarChartProps {
  categories: string[]
  series: Array<{
    name: string
    data: number[]
    color?: string
  }>
  height?: number
  className?: string
}
export declare const GroupedBarChart: React.FC<GroupedBarChartProps>
export {}
