/**
 * Timeline Chart Component (dual-axis line chart)
 */

import React, { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { getTimelineOption } from './echarts-theme'

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

export const TimelineChart: React.FC<TimelineChartProps> = ({
  timestamps,
  series,
  height = 320,
  className = '',
}) => {
  const option = useMemo(
    () => getTimelineOption(timestamps, series),
    [timestamps, series]
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
