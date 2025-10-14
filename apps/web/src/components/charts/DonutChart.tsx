/**
 * Donut Chart Component
 */

import React, { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { getDonutOption } from './echarts-theme'

interface DonutChartProps {
  data: Array<{ name: string; value: number; color?: string }>
  height?: number
  className?: string
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  height = 280,
  className = '',
}) => {
  const option = useMemo(() => getDonutOption(data), [data])

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
