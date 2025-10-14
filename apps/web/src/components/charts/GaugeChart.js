import { jsx as _jsx } from 'react/jsx-runtime'
/**
 * Gauge Chart Component
 */
import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { getGaugeOption } from './echarts-theme'
export const GaugeChart = ({
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
  return _jsx(ReactECharts, {
    option: option,
    style: { height: `${height}px` },
    className: className,
    opts: { renderer: 'svg' },
    lazyUpdate: true,
  })
}
