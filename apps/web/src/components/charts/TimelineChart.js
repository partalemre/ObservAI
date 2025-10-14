import { jsx as _jsx } from 'react/jsx-runtime'
/**
 * Timeline Chart Component (dual-axis line chart)
 */
import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { getTimelineOption } from './echarts-theme'
export const TimelineChart = ({
  timestamps,
  series,
  height = 320,
  className = '',
}) => {
  const option = useMemo(
    () => getTimelineOption(timestamps, series),
    [timestamps, series]
  )
  return _jsx(ReactECharts, {
    option: option,
    style: { height: `${height}px` },
    className: className,
    opts: { renderer: 'svg' },
    lazyUpdate: true,
  })
}
