/**
 * Histogram Chart Component
 */

import React, { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { getHistogramOption } from './echarts-theme'

interface HistogramChartProps {
  bins: Array<{ label: string; value: number }>
  percentiles?: { p50?: number; p90?: number }
  height?: number
  className?: string
}

export const HistogramChart: React.FC<HistogramChartProps> = ({
  bins,
  percentiles,
  height = 280,
  className = '',
}) => {
  const option = useMemo(
    () => getHistogramOption(bins, percentiles),
    [bins, percentiles]
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
