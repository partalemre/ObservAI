import { jsx as _jsx } from 'react/jsx-runtime'
/**
 * Donut Chart Component
 */
import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { getDonutOption } from './echarts-theme'
export const DonutChart = ({ data, height = 280, className = '' }) => {
  const option = useMemo(() => getDonutOption(data), [data])
  return _jsx(ReactECharts, {
    option: option,
    style: { height: `${height}px` },
    className: className,
    opts: { renderer: 'svg' },
    lazyUpdate: true,
  })
}
