import { jsx as _jsx } from 'react/jsx-runtime'
/**
 * Histogram Chart Component
 */
import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { getHistogramOption } from './echarts-theme'
export const HistogramChart = ({
  bins,
  percentiles,
  height = 280,
  className = '',
}) => {
  const option = useMemo(
    () => getHistogramOption(bins, percentiles),
    [bins, percentiles]
  )
  return _jsx(ReactECharts, {
    option: option,
    style: { height: `${height}px` },
    className: className,
    opts: { renderer: 'svg' },
    lazyUpdate: true,
  })
}
