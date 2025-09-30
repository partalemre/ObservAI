import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import React from 'react'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from 'recharts'
import { Calendar, TrendingUp } from 'lucide-react'
const AGE_COLORS = [
  '#10B981', // 0-18: Green
  '#3B82F6', // 19-30: Blue
  '#8B5CF6', // 31-45: Purple
  '#F59E0B', // 46-60: Orange
  '#EF4444', // 60+: Red
]
export const AgeDistribution = ({ data }) => {
  const chartData = React.useMemo(() => {
    if (!data) return []
    return [
      {
        name: '0-18',
        value: data['0-18'],
        color: AGE_COLORS[0],
        label: '0-18 yaş',
      },
      {
        name: '19-30',
        value: data['19-30'],
        color: AGE_COLORS[1],
        label: '19-30 yaş',
      },
      {
        name: '31-45',
        value: data['31-45'],
        color: AGE_COLORS[2],
        label: '31-45 yaş',
      },
      {
        name: '46-60',
        value: data['46-60'],
        color: AGE_COLORS[3],
        label: '46-60 yaş',
      },
      {
        name: '60+',
        value: data['60+'],
        color: AGE_COLORS[4],
        label: '60+ yaş',
      },
    ].filter((item) => item.value > 0)
  }, [data])
  const total = React.useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0)
  }, [chartData])
  const maxValue = React.useMemo(() => {
    return Math.max(...chartData.map((item) => item.value), 1)
  }, [chartData])
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const percentage =
        total > 0 ? ((data.value / total) * 100).toFixed(1) : '0'
      return _jsxs('div', {
        className:
          'bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg',
        children: [
          _jsx('p', {
            className: 'text-white font-medium',
            children: data.payload.label,
          }),
          _jsxs('p', {
            className: 'text-gray-300',
            children: [data.value, ' ki\u015Fi (', percentage, '%)'],
          }),
        ],
      })
    }
    return null
  }
  const dominantAge = React.useMemo(() => {
    if (chartData.length === 0) return null
    return chartData.reduce((max, current) =>
      current.value > max.value ? current : max
    )
  }, [chartData])
  return _jsxs(motion.div, {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: 0.3 },
    className: 'glass-card rounded-xl p-6 h-full',
    children: [
      _jsxs('div', {
        className: 'flex items-center gap-3 mb-6',
        children: [
          _jsx('div', {
            className: 'p-2 bg-purple-500/20 rounded-lg',
            children: _jsx(Calendar, { className: 'w-5 h-5 text-purple-400' }),
          }),
          _jsxs('div', {
            children: [
              _jsx('h3', {
                className: 'text-lg font-semibold text-white',
                children: 'Ya\u015F Da\u011F\u0131l\u0131m\u0131',
              }),
              _jsxs('p', {
                className: 'text-sm text-gray-400',
                children: ['Toplam: ', total, ' ki\u015Fi'],
              }),
            ],
          }),
        ],
      }),
      dominantAge &&
        _jsx('div', {
          className:
            'mb-4 p-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20',
          children: _jsxs('div', {
            className: 'flex items-center gap-2',
            children: [
              _jsx(TrendingUp, { className: 'w-4 h-4 text-purple-400' }),
              _jsx('span', {
                className: 'text-sm text-purple-300',
                children: 'En yo\u011Fun grup:',
              }),
              _jsx('span', {
                className: 'text-sm font-semibold text-white',
                children: dominantAge.label,
              }),
              _jsxs('span', {
                className: 'text-xs text-gray-400',
                children: [
                  '(',
                  ((dominantAge.value / total) * 100).toFixed(1),
                  '%)',
                ],
              }),
            ],
          }),
        }),
      chartData.length > 0
        ? _jsx('div', {
            className: 'h-48',
            children: _jsx(ResponsiveContainer, {
              width: '100%',
              height: '100%',
              children: _jsxs(BarChart, {
                data: chartData,
                margin: { top: 5, right: 5, left: 5, bottom: 5 },
                children: [
                  _jsx(XAxis, {
                    dataKey: 'name',
                    axisLine: false,
                    tickLine: false,
                    tick: { fill: '#9CA3AF', fontSize: 12 },
                  }),
                  _jsx(YAxis, { hide: true }),
                  _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
                  _jsx(Bar, {
                    dataKey: 'value',
                    radius: [4, 4, 0, 0],
                    maxBarSize: 40,
                    children: chartData.map((entry, index) =>
                      _jsx(Cell, { fill: entry.color }, `cell-${index}`)
                    ),
                  }),
                ],
              }),
            }),
          })
        : _jsx('div', {
            className: 'h-48 flex items-center justify-center',
            children: _jsxs('div', {
              className: 'text-center text-gray-400',
              children: [
                _jsx(Calendar, {
                  className: 'w-12 h-12 mx-auto mb-3 opacity-50',
                }),
                _jsx('p', { children: 'Veri bekleniyor...' }),
              ],
            }),
          }),
      chartData.length > 0 &&
        _jsx('div', {
          className: 'mt-4 grid grid-cols-2 gap-3',
          children: chartData.slice(0, 4).map((item, index) => {
            const percentage =
              total > 0 ? ((item.value / total) * 100).toFixed(0) : '0'
            const isTop = item === dominantAge
            return _jsxs(
              'div',
              {
                className: `p-3 rounded-lg border ${
                  isTop
                    ? 'bg-purple-500/10 border-purple-500/30'
                    : 'bg-gray-800/50 border-gray-700/50'
                }`,
                children: [
                  _jsxs('div', {
                    className: 'flex items-center justify-between',
                    children: [
                      _jsxs('div', {
                        className: 'flex items-center gap-2',
                        children: [
                          _jsx('div', {
                            className: 'w-2 h-2 rounded-full',
                            style: { backgroundColor: item.color },
                          }),
                          _jsx('span', {
                            className: 'text-xs text-gray-300',
                            children: item.name,
                          }),
                        ],
                      }),
                      isTop &&
                        _jsx(TrendingUp, {
                          className: 'w-3 h-3 text-purple-400',
                        }),
                    ],
                  }),
                  _jsxs('div', {
                    className: 'mt-1',
                    children: [
                      _jsx('div', {
                        className: 'text-sm font-semibold text-white',
                        children: item.value,
                      }),
                      _jsxs('div', {
                        className: 'text-xs text-gray-400',
                        children: [percentage, '%'],
                      }),
                    ],
                  }),
                ],
              },
              item.name
            )
          }),
        }),
    ],
  })
}
