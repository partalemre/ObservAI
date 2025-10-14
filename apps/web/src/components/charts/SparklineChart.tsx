/**
 * Sparkline Chart Component (mini line chart)
 */

import React, { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { getSparklineOption } from './echarts-theme'

interface SparklineChartProps {
  data: number[]
  color?: string
  height?: number
  className?: string
}

export const SparklineChart: React.FC<SparklineChartProps> = ({
  data,
  color,
  height = 60,
  className = '',
}) => {
  const option = useMemo(() => getSparklineOption(data, color), [data, color])

  return (
    <ReactECharts
      option={option}
      style={{ height: `${height}px` }}
      className={className}
      opts={{ renderer: 'svg' }}
      lazyUpdate
      notMerge
    />
  )
}
