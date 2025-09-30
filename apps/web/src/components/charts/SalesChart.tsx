import React from 'react'
import { motion } from 'framer-motion'
import ReactECharts from 'echarts-for-react'
import { t } from '../../lib/i18n'
import { formatCurrency } from '../../lib/format'
import { TrendingUp, Loader2 } from 'lucide-react'

interface SalesData {
  ts: string
  revenue: number
  orders: number
}

interface SalesChartProps {
  data?: SalesData[]
  loading?: boolean
}

export const SalesChart: React.FC<SalesChartProps> = ({ data, loading }) => {
  // Transform data for ECharts
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) {
      // Sample data for demonstration
      const now = new Date()
      const sampleData = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(now.getTime() - (11 - i) * 2 * 60 * 60 * 1000)
        return {
          ts: date.toISOString(),
          revenue: Math.floor(Math.random() * 50000) + 10000,
          orders: Math.floor(Math.random() * 20) + 5,
        }
      })
      return sampleData
    }
    return data
  }, [data])

  const labels = chartData.map((item) => {
    const date = new Date(item.ts)
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  })

  const values = chartData.map((item) => item.revenue)

  const totalRevenue = values.reduce((sum, value) => sum + value, 0)
  const avgRevenue = totalRevenue / values.length
  const maxRevenue = Math.max(...values)

  const option = {
    backgroundColor: 'transparent',
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: labels,
      axisLine: {
        lineStyle: { color: '#33304a' },
      },
      axisLabel: {
        color: '#9ca3af',
        fontSize: 11,
      },
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: {
        lineStyle: {
          color: '#252336',
          type: 'dashed',
        },
      },
      axisLabel: {
        color: '#9ca3af',
        fontSize: 11,
        formatter: (value: number) => `₺${(value / 1000).toFixed(0)}k`,
      },
    },
    series: [
      {
        name: 'Satışlar',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#3b82f6',
          borderWidth: 2,
          borderColor: '#ffffff',
        },
        lineStyle: {
          width: 3,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#3b82f6' },
              { offset: 1, color: '#8b5cf6' },
            ],
          },
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
              { offset: 1, color: 'rgba(139, 92, 246, 0.05)' },
            ],
          },
        },
        data: values,
        emphasis: {
          focus: 'series',
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(59, 130, 246, 0.5)',
          },
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 14, 23, 0.95)',
      borderColor: '#33304a',
      borderWidth: 1,
      textStyle: {
        color: '#ffffff',
        fontSize: 12,
      },
      extraCssText:
        'backdrop-filter: blur(8px); border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);',
      formatter: (params: any) => {
        const param = params[0]
        return `
          <div style="padding: 4px 0;">
            <div style="color: #9ca3af; font-size: 11px; margin-bottom: 4px;">${param.name}</div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <div style="width: 8px; height: 8px; border-radius: 50%; background: ${param.color};"></div>
              <span style="color: #ffffff; font-weight: 600;">₺${param.value.toLocaleString('tr-TR')}</span>
            </div>
          </div>
        `
      },
    },
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicOut',
  }

  if (loading) {
    return (
      <motion.div
        className="glass-card h-[400px] rounded-xl p-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-blue-500/20 p-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Satış Grafiği</h3>
        </div>
        <div className="flex h-[300px] items-center justify-center">
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Yükleniyor...</span>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="glass-card rounded-xl p-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-500/20 p-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Satış Grafiği</h3>
            <p className="text-sm text-gray-400">Son 24 saat</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-blue-600/10 p-3">
          <div className="mb-1 text-xs text-blue-300">Toplam Satış</div>
          <div className="text-lg font-bold text-white">
            ₺{totalRevenue.toLocaleString('tr-TR')}
          </div>
        </div>

        <div className="rounded-lg border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-purple-600/10 p-3">
          <div className="mb-1 text-xs text-purple-300">Ortalama</div>
          <div className="text-lg font-bold text-white">
            ₺{Math.round(avgRevenue).toLocaleString('tr-TR')}
          </div>
        </div>

        <div className="rounded-lg border border-green-500/20 bg-gradient-to-r from-green-500/10 to-green-600/10 p-3">
          <div className="mb-1 text-xs text-green-300">En Yüksek</div>
          <div className="text-lg font-bold text-white">
            ₺{maxRevenue.toLocaleString('tr-TR')}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px]">
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>
    </motion.div>
  )
}
