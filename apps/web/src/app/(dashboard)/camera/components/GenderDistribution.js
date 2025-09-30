import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import React from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Users, User } from 'lucide-react'
const COLORS = {
  male: '#3B82F6',
  female: '#EC4899',
  unknown: '#6B7280',
}
const GENDER_ICONS = {
  male: User,
  female: User,
  unknown: Users,
}
export const GenderDistribution = ({ data }) => {
  const chartData = React.useMemo(() => {
    if (!data) return []
    return [
      { name: 'Erkek', value: data.male, color: COLORS.male, key: 'male' },
      {
        name: 'Kadın',
        value: data.female,
        color: COLORS.female,
        key: 'female',
      },
      {
        name: 'Belirsiz',
        value: data.unknown,
        color: COLORS.unknown,
        key: 'unknown',
      },
    ].filter((item) => item.value > 0)
  }, [data])
  const total = React.useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0)
  }, [chartData])
  const CustomTooltip = ({ active, payload }) => {
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
            children: data.payload.name,
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
  return _jsxs(motion.div, {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: 0.2 },
    className: 'glass-card rounded-xl p-6 h-full',
    children: [
      _jsxs('div', {
        className: 'flex items-center gap-3 mb-6',
        children: [
          _jsx('div', {
            className: 'p-2 bg-blue-500/20 rounded-lg',
            children: _jsx(Users, { className: 'w-5 h-5 text-blue-400' }),
          }),
          _jsxs('div', {
            children: [
              _jsx('h3', {
                className: 'text-lg font-semibold text-white',
                children: 'Cinsiyet Da\u011F\u0131l\u0131m\u0131',
              }),
              _jsxs('p', {
                className: 'text-sm text-gray-400',
                children: ['Toplam: ', total, ' ki\u015Fi'],
              }),
            ],
          }),
        ],
      }),
      chartData.length > 0
        ? _jsx('div', {
            className: 'h-64',
            children: _jsx(ResponsiveContainer, {
              width: '100%',
              height: '100%',
              children: _jsxs(PieChart, {
                children: [
                  _jsx(Pie, {
                    data: chartData,
                    cx: '50%',
                    cy: '50%',
                    innerRadius: 40,
                    outerRadius: 80,
                    paddingAngle: 2,
                    dataKey: 'value',
                    children: chartData.map((entry, index) =>
                      _jsx(Cell, { fill: entry.color }, `cell-${index}`)
                    ),
                  }),
                  _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
                ],
              }),
            }),
          })
        : _jsx('div', {
            className: 'h-64 flex items-center justify-center',
            children: _jsxs('div', {
              className: 'text-center text-gray-400',
              children: [
                _jsx(Users, { className: 'w-12 h-12 mx-auto mb-3 opacity-50' }),
                _jsx('p', { children: 'Veri bekleniyor...' }),
              ],
            }),
          }),
      chartData.length > 0 &&
        _jsx('div', {
          className: 'mt-4 space-y-2',
          children: chartData.map((item) => {
            const percentage =
              total > 0 ? ((item.value / total) * 100).toFixed(1) : '0'
            const IconComponent = GENDER_ICONS[item.key]
            return _jsxs(
              'div',
              {
                className: 'flex items-center justify-between',
                children: [
                  _jsxs('div', {
                    className: 'flex items-center gap-2',
                    children: [
                      _jsx('div', {
                        className: 'w-3 h-3 rounded-full',
                        style: { backgroundColor: item.color },
                      }),
                      _jsx(IconComponent, {
                        className: 'w-4 h-4 text-gray-400',
                      }),
                      _jsx('span', {
                        className: 'text-sm text-gray-300',
                        children: item.name,
                      }),
                    ],
                  }),
                  _jsxs('div', {
                    className: 'text-right',
                    children: [
                      _jsx('div', {
                        className: 'text-sm font-medium text-white',
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
              item.key
            )
          }),
        }),
    ],
  })
}
