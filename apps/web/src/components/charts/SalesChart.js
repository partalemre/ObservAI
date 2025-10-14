import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import React from 'react'
import { motion } from 'framer-motion'
import ReactECharts from 'echarts-for-react'
import { TrendingUp, Loader2 } from 'lucide-react'
export const SalesChart = ({ data, loading }) => {
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
        formatter: (value) => `₺${(value / 1000).toFixed(0)}k`,
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
      formatter: (params) => {
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
    return _jsxs(motion.div, {
      className: 'glass-card h-[400px] rounded-xl p-6',
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      children: [
        _jsxs('div', {
          className: 'mb-4 flex items-center gap-3',
          children: [
            _jsx('div', {
              className: 'rounded-lg bg-blue-500/20 p-2',
              children: _jsx(TrendingUp, {
                className: 'h-5 w-5 text-blue-400',
              }),
            }),
            _jsx('h3', {
              className: 'text-lg font-semibold text-white',
              children: 'Sat\u0131\u015F Grafi\u011Fi',
            }),
          ],
        }),
        _jsx('div', {
          className: 'flex h-[300px] items-center justify-center',
          children: _jsxs('div', {
            className: 'flex items-center gap-2 text-gray-400',
            children: [
              _jsx(Loader2, { className: 'h-5 w-5 animate-spin' }),
              _jsx('span', { children: 'Y\u00FCkleniyor...' }),
            ],
          }),
        }),
      ],
    })
  }
  return _jsxs(motion.div, {
    className: 'glass-card rounded-xl p-6',
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, delay: 0.1 },
    children: [
      _jsx('div', {
        className: 'mb-6 flex items-center justify-between',
        children: _jsxs('div', {
          className: 'flex items-center gap-3',
          children: [
            _jsx('div', {
              className: 'rounded-lg bg-blue-500/20 p-2',
              children: _jsx(TrendingUp, {
                className: 'h-5 w-5 text-blue-400',
              }),
            }),
            _jsxs('div', {
              children: [
                _jsx('h3', {
                  className: 'text-lg font-semibold text-white',
                  children: 'Sat\u0131\u015F Grafi\u011Fi',
                }),
                _jsx('p', {
                  className: 'text-sm text-gray-400',
                  children: 'Son 24 saat',
                }),
              ],
            }),
          ],
        }),
      }),
      _jsxs('div', {
        className: 'mb-6 grid grid-cols-3 gap-4',
        children: [
          _jsxs('div', {
            className:
              'rounded-lg border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-blue-600/10 p-3',
            children: [
              _jsx('div', {
                className: 'mb-1 text-xs text-blue-300',
                children: 'Toplam Sat\u0131\u015F',
              }),
              _jsxs('div', {
                className: 'text-lg font-bold text-white',
                children: ['\u20BA', totalRevenue.toLocaleString('tr-TR')],
              }),
            ],
          }),
          _jsxs('div', {
            className:
              'rounded-lg border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-purple-600/10 p-3',
            children: [
              _jsx('div', {
                className: 'mb-1 text-xs text-purple-300',
                children: 'Ortalama',
              }),
              _jsxs('div', {
                className: 'text-lg font-bold text-white',
                children: [
                  '\u20BA',
                  Math.round(avgRevenue).toLocaleString('tr-TR'),
                ],
              }),
            ],
          }),
          _jsxs('div', {
            className:
              'rounded-lg border border-green-500/20 bg-gradient-to-r from-green-500/10 to-green-600/10 p-3',
            children: [
              _jsx('div', {
                className: 'mb-1 text-xs text-green-300',
                children: 'En Y\u00FCksek',
              }),
              _jsxs('div', {
                className: 'text-lg font-bold text-white',
                children: ['\u20BA', maxRevenue.toLocaleString('tr-TR')],
              }),
            ],
          }),
        ],
      }),
      _jsx('div', {
        className: 'h-[300px]',
        children: _jsx(ReactECharts, {
          option: option,
          style: { height: '100%', width: '100%' },
          opts: { renderer: 'canvas' },
        }),
      }),
    ],
  })
}
