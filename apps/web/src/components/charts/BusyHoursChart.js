import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import React from 'react'
import { motion } from 'framer-motion'
import ReactECharts from 'echarts-for-react'
import { Clock, Users, Loader2, TrendingUp } from 'lucide-react'
export const BusyHoursChart = ({ data, loading }) => {
  // Transform data for ECharts
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) {
      // Sample data for demonstration
      return Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        visitors:
          Math.floor(Math.random() * 50) +
          10 +
          (i >= 11 && i <= 14 ? 20 : 0) +
          (i >= 18 && i <= 21 ? 15 : 0),
      }))
    }
    return data
  }, [data])
  const labels = chartData.map(
    (item) => `${item.hour.toString().padStart(2, '0')}:00`
  )
  const values = chartData.map((item) => item.visitors)
  const totalVisitors = values.reduce((sum, value) => sum + value, 0)
  const avgVisitors = totalVisitors / values.length
  const peakHour = chartData.reduce((max, current) =>
    current.visitors > max.visitors ? current : max
  )
  const option = {
    backgroundColor: 'transparent',
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: labels,
      axisLine: {
        lineStyle: { color: '#33304a' },
      },
      axisLabel: {
        color: '#9ca3af',
        fontSize: 10,
        rotate: 45,
        interval: 1,
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
        formatter: (value) => `${value}`,
      },
    },
    series: [
      {
        name: 'Ziyaretçi',
        type: 'bar',
        data: values.map((value, index) => ({
          value,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: value === peakHour.visitors ? '#f59e0b' : '#10b981',
                },
                {
                  offset: 1,
                  color: value === peakHour.visitors ? '#d97706' : '#059669',
                },
              ],
            },
            borderRadius: [4, 4, 0, 0],
          },
        })),
        barWidth: '60%',
        emphasis: {
          focus: 'series',
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(16, 185, 129, 0.5)',
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
        const isPeak = param.value === peakHour.visitors
        return `
          <div style="padding: 4px 0;">
            <div style="color: #9ca3af; font-size: 11px; margin-bottom: 4px;">${param.name}</div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <div style="width: 8px; height: 8px; border-radius: 50%; background: ${param.color};"></div>
              <span style="color: #ffffff; font-weight: 600;">${param.value} ziyaretçi</span>
              ${isPeak ? '<span style="color: #f59e0b; font-size: 10px; margin-left: 4px;">🔥 Pik</span>' : ''}
            </div>
          </div>
        `
      },
    },
    animation: true,
    animationDuration: 1200,
    animationEasing: 'elasticOut',
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
              className: 'rounded-lg bg-green-500/20 p-2',
              children: _jsx(Clock, { className: 'h-5 w-5 text-green-400' }),
            }),
            _jsx('h3', {
              className: 'text-lg font-semibold text-white',
              children: 'Yo\u011Fun Saatler',
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
  if (!chartData || chartData.length === 0) {
    return _jsxs(motion.div, {
      className: 'glass-card h-[400px] rounded-xl p-6',
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      children: [
        _jsxs('div', {
          className: 'mb-4 flex items-center gap-3',
          children: [
            _jsx('div', {
              className: 'rounded-lg bg-green-500/20 p-2',
              children: _jsx(Clock, { className: 'h-5 w-5 text-green-400' }),
            }),
            _jsx('h3', {
              className: 'text-lg font-semibold text-white',
              children: 'Yo\u011Fun Saatler',
            }),
          ],
        }),
        _jsx('div', {
          className: 'flex h-[300px] items-center justify-center',
          children: _jsxs('div', {
            className: 'text-center text-gray-400',
            children: [
              _jsx(Users, { className: 'mx-auto mb-3 h-12 w-12 opacity-50' }),
              _jsx('p', { children: 'Veri bulunamad\u0131' }),
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
    transition: { duration: 0.5, delay: 0.2 },
    children: [
      _jsx('div', {
        className: 'mb-6 flex items-center justify-between',
        children: _jsxs('div', {
          className: 'flex items-center gap-3',
          children: [
            _jsx('div', {
              className: 'rounded-lg bg-green-500/20 p-2',
              children: _jsx(Clock, { className: 'h-5 w-5 text-green-400' }),
            }),
            _jsxs('div', {
              children: [
                _jsx('h3', {
                  className: 'text-lg font-semibold text-white',
                  children: 'Yo\u011Fun Saatler',
                }),
                _jsx('p', {
                  className: 'text-sm text-gray-400',
                  children:
                    'Saatlik ziyaret\u00E7i da\u011F\u0131l\u0131m\u0131',
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
              'rounded-lg border border-green-500/20 bg-gradient-to-r from-green-500/10 to-green-600/10 p-3',
            children: [
              _jsx('div', {
                className: 'mb-1 text-xs text-green-300',
                children: 'Toplam Ziyaret\u00E7i',
              }),
              _jsx('div', {
                className: 'text-lg font-bold text-white',
                children: totalVisitors.toLocaleString('tr-TR'),
              }),
            ],
          }),
          _jsxs('div', {
            className:
              'rounded-lg border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-blue-600/10 p-3',
            children: [
              _jsx('div', {
                className: 'mb-1 text-xs text-blue-300',
                children: 'Saatlik Ortalama',
              }),
              _jsx('div', {
                className: 'text-lg font-bold text-white',
                children: Math.round(avgVisitors),
              }),
            ],
          }),
          _jsxs('div', {
            className:
              'rounded-lg border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-amber-600/10 p-3',
            children: [
              _jsxs('div', {
                className: 'mb-1 flex items-center gap-1',
                children: [
                  _jsx(TrendingUp, { className: 'h-3 w-3 text-amber-400' }),
                  _jsx('div', {
                    className: 'text-xs text-amber-300',
                    children: 'En Yo\u011Fun',
                  }),
                ],
              }),
              _jsxs('div', {
                className: 'text-lg font-bold text-white',
                children: [peakHour.hour.toString().padStart(2, '0'), ':00'],
              }),
            ],
          }),
        ],
      }),
      _jsx('div', {
        className: 'h-[280px]',
        children: _jsx(ReactECharts, {
          option: option,
          style: { height: '100%', width: '100%' },
          opts: { renderer: 'canvas' },
        }),
      }),
    ],
  })
}
