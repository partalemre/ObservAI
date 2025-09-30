import React, { ReactNode, useCallback } from 'react'
import { motion } from 'framer-motion'
import ReactECharts from 'echarts-for-react'
import CountUp from 'react-countup'

interface MetricCardProps {
  title: string
  value: number
  change?: number
  data?: number[]
  type?: 'currency' | 'number' | 'percentage'
  icon?: ReactNode
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  data,
  type = 'number',
  icon,
}) => {
  const formatValue = useCallback(
    (val: number) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="glass-card group rounded-xl p-6 transition-all duration-300 hover:border-white/20"
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <motion.div
              className="bg-primary-500/20 text-primary-400 group-hover:bg-primary-500/30 flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
            >
              {icon}
            </motion.div>
          )}
          <h3 className="text-sm font-medium text-white/70">{title}</h3>
        </div>

        {change !== undefined && (
          <motion.span
            className={`rounded-full px-2 py-1 text-xs font-medium transition-colors duration-300 ${
              change > 0
                ? 'border border-green-500/30 bg-green-500/20 text-green-400'
                : change < 0
                  ? 'border border-red-500/30 bg-red-500/20 text-red-400'
                  : 'border border-gray-500/30 bg-gray-500/20 text-gray-400'
            }`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {change > 0 ? '+' : ''}
            {change.toFixed(1)}%
          </motion.span>
        )}
      </div>

      {/* Value and Chart */}
      <div className="flex items-end justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CountUp
            end={value}
            duration={1.5}
            formattingFn={formatValue}
            className="animate-number-up text-2xl font-bold text-white"
            useEasing={true}
            easingFn={(t, b, c, d) => {
              // easeOutCubic
              return c * ((t = t / d - 1) * t * t + 1) + b
            }}
          />
        </motion.div>

        {chartOption && (
          <motion.div
            className="h-12 w-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <ReactECharts
              option={chartOption}
              style={{ height: '100%', width: '100%' }}
              opts={{ renderer: 'svg' }}
              notMerge={true}
              lazyUpdate={true}
            />
          </motion.div>
        )}
      </div>

      {/* Subtle background glow effect */}
      <div className="from-primary-500/5 pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </motion.div>
  )
}

export default MetricCard
