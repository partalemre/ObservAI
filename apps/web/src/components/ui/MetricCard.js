import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { useCallback } from 'react'
import { motion } from 'framer-motion'
import ReactECharts from 'echarts-for-react'
import CountUp from 'react-countup'
const MetricCard = ({ title, value, change, data, type = 'number', icon }) => {
  const formatValue = useCallback(
    (val) => {
      switch (type) {
        case 'currency':
          return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(val)
        case 'percentage':
          return `${val.toFixed(1)}%`
        default:
          return val.toLocaleString('tr-TR')
      }
    },
    [type]
  )
  const getChartOption = useCallback(() => {
    if (!data || data.length === 0) return null
    return {
      grid: {
        left: 0,
        right: 0,
        top: 5,
        bottom: 5,
      },
      xAxis: {
        show: false,
        type: 'category',
        boundaryGap: false,
      },
      yAxis: {
        show: false,
        type: 'value',
      },
      series: [
        {
          type: 'line',
          data: data,
          smooth: true,
          lineStyle: {
            color: '#3b82f6',
            width: 2,
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(59, 130, 246, 0.4)' },
                { offset: 1, color: 'rgba(59, 130, 246, 0)' },
              ],
            },
          },
          showSymbol: false,
          animation: true,
          animationDuration: 2000,
          animationEasing: 'cubicOut',
        },
      ],
    }
  }, [data])
  const chartOption = getChartOption()
  return _jsxs(motion.div, {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    whileHover: { scale: 1.02 },
    transition: { duration: 0.3 },
    className:
      'glass-card rounded-xl p-6 hover:border-white/20 transition-all duration-300 group',
    children: [
      _jsxs('div', {
        className: 'flex items-start justify-between mb-4',
        children: [
          _jsxs('div', {
            className: 'flex items-center gap-3',
            children: [
              icon &&
                _jsx(motion.div, {
                  className:
                    'w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-400 group-hover:bg-primary-500/30 transition-colors duration-300',
                  whileHover: { scale: 1.1 },
                  children: icon,
                }),
              _jsx('h3', {
                className: 'text-white/70 text-sm font-medium',
                children: title,
              }),
            ],
          }),
          change !== undefined &&
            _jsxs(motion.span, {
              className: `text-xs px-2 py-1 rounded-full font-medium transition-colors duration-300 ${
                change > 0
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : change < 0
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
              }`,
              initial: { opacity: 0, scale: 0.8 },
              animate: { opacity: 1, scale: 1 },
              transition: { delay: 0.2 },
              children: [change > 0 ? '+' : '', change.toFixed(1), '%'],
            }),
        ],
      }),
      _jsxs('div', {
        className: 'flex items-end justify-between',
        children: [
          _jsx(motion.div, {
            initial: { opacity: 0, x: -20 },
            animate: { opacity: 1, x: 0 },
            transition: { delay: 0.1 },
            children: _jsx(CountUp, {
              end: value,
              duration: 1.5,
              formattingFn: formatValue,
              className: 'text-2xl font-bold text-white animate-number-up',
              useEasing: true,
              easingFn: (t, b, c, d) => {
                // easeOutCubic
                return c * ((t = t / d - 1) * t * t + 1) + b
              },
            }),
          }),
          chartOption &&
            _jsx(motion.div, {
              className: 'w-20 h-12',
              initial: { opacity: 0, scale: 0.8 },
              animate: { opacity: 1, scale: 1 },
              transition: { delay: 0.3, duration: 0.5 },
              children: _jsx(ReactECharts, {
                option: chartOption,
                style: { height: '100%', width: '100%' },
                opts: { renderer: 'svg' },
                notMerge: true,
                lazyUpdate: true,
              }),
            }),
        ],
      }),
      _jsx('div', {
        className:
          'absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none',
      }),
    ],
  })
}
export default MetricCard
