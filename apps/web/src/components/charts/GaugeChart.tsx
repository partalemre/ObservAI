/**
 * Gauge Chart Component
 */

import React, { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { getGaugeOption } from './echarts-theme'

interface GaugeChartProps {
  value: number
  max?: number
  title?: string
  height?: number
  className?: string
}

export const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  max = 100,
  title = '',
  height = 200,
  className = '',
}) => {
  const option = useMemo(
    () => getGaugeOption(value, max, title),
    [value, max, title]
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
