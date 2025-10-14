/**
 * Grouped Bar Chart Component
 */

import React, { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { getGroupedBarOption } from './echarts-theme'

interface GroupedBarChartProps {
  categories: string[]
  series: Array<{ name: string; data: number[]; color?: string }>
  height?: number
  className?: string
}

export const GroupedBarChart: React.FC<GroupedBarChartProps> = ({
  categories,
  series,
  height = 300,
  className = '',
}) => {
  const option = useMemo(
    () => getGroupedBarOption(categories, series),
    [categories, series]
  )

  return (
    <ReactECharts
      option={option}
      style={{ height: `${height}px` }}
      className={className}
      opts={{ renderer: 'svg' }}
      lazyUpdate
    />
  )
}
