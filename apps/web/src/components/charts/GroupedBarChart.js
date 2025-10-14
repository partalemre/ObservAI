import { jsx as _jsx } from 'react/jsx-runtime'
/**
 * Grouped Bar Chart Component
 */
import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { getGroupedBarOption } from './echarts-theme'
export const GroupedBarChart = ({
  categories,
  series,
  height = 300,
  className = '',
}) => {
  const option = useMemo(
    () => getGroupedBarOption(categories, series),
    [categories, series]
  )
  return _jsx(ReactECharts, {
    option: option,
    style: { height: `${height}px` },
    className: className,
    opts: { renderer: 'svg' },
    lazyUpdate: true,
  })
}
