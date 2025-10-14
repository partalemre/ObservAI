import { jsx as _jsx } from 'react/jsx-runtime'
/**
 * Sparkline Chart Component (mini line chart)
 */
import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { getSparklineOption } from './echarts-theme'
export const SparklineChart = ({
  data,
  color,
  height = 60,
  className = '',
}) => {
  const option = useMemo(() => getSparklineOption(data, color), [data, color])
  return _jsx(ReactECharts, {
    option: option,
    style: { height: `${height}px` },
    className: className,
    opts: { renderer: 'svg' },
    lazyUpdate: true,
    notMerge: true,
  })
}
