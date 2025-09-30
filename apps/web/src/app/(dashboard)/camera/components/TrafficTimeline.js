import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from 'recharts'
import {
  Clock,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
export const TrafficTimeline = ({ data = [] }) => {
  const [activeView, setActiveView] = useState('traffic')
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) {
      // Sample data for demonstration
      const now = new Date()
      return Array.from({ length: 24 }, (_, i) => {
        const time = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000)
        return {
          time: time.toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          entries: Math.floor(Math.random() * 20) + 5,
          exits: Math.floor(Math.random() * 18) + 3,
          occupancy: Math.floor(Math.random() * 50) + 10,
          timestamp: time.getTime(),
        }
      })
    }
    return data
  }, [data])
  const stats = React.useMemo(() => {
    if (chartData.length === 0)
      return {
        totalEntries: 0,
        totalExits: 0,
        peakOccupancy: 0,
        avgOccupancy: 0,
      }
    const totalEntries = chartData.reduce((sum, item) => sum + item.entries, 0)
    const totalExits = chartData.reduce((sum, item) => sum + item.exits, 0)
    const peakOccupancy = Math.max(...chartData.map((item) => item.occupancy))
    const avgOccupancy = Math.round(
      chartData.reduce((sum, item) => sum + item.occupancy, 0) /
        chartData.length
    )
    return { totalEntries, totalExits, peakOccupancy, avgOccupancy }
  }, [chartData])
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return _jsxs('div', {
        className:
          'bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg',
        children: [
          _jsx('p', {
            className: 'text-white font-medium mb-2',
            children: label,
          }),
          payload.map((entry, index) =>
            _jsxs(
              'div',
              {
                className: 'flex items-center gap-2 text-sm',
                children: [
                  _jsx('div', {
                    className: 'w-3 h-3 rounded-full',
                    style: { backgroundColor: entry.color },
                  }),
                  _jsxs('span', {
                    className: 'text-gray-300',
                    children: [entry.name, ':'],
                  }),
                  _jsx('span', {
                    className: 'text-white font-semibold',
                    children: entry.value,
                  }),
                  entry.name === 'Doluluk' &&
                    _jsx('span', {
                      className: 'text-gray-400',
                      children: 'ki\u015Fi',
                    }),
                ],
              },
              index
            )
          ),
        ],
      })
    }
    return null
  }
  return _jsxs(motion.div, {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: 0.4 },
    className: 'glass-card rounded-xl p-6',
    children: [
      _jsxs('div', {
        className: 'flex items-center justify-between mb-6',
        children: [
          _jsxs('div', {
            className: 'flex items-center gap-3',
            children: [
              _jsx('div', {
                className: 'p-2 bg-indigo-500/20 rounded-lg',
                children: _jsx(Clock, { className: 'w-5 h-5 text-indigo-400' }),
              }),
              _jsxs('div', {
                children: [
                  _jsx('h3', {
                    className: 'text-lg font-semibold text-white',
                    children: 'Trafik Zaman \u00C7izelgesi',
                  }),
                  _jsx('p', {
                    className: 'text-sm text-gray-400',
                    children: 'Son 24 saat',
                  }),
                ],
              }),
            ],
          }),
          _jsxs('div', {
            className: 'flex items-center bg-gray-800/50 rounded-lg p-1',
            children: [
              _jsx('button', {
                onClick: () => setActiveView('traffic'),
                className: `px-3 py-1.5 text-sm rounded-md transition-all ${
                  activeView === 'traffic'
                    ? 'bg-indigo-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`,
                children: 'Giri\u015F/\u00C7\u0131k\u0131\u015F',
              }),
              _jsx('button', {
                onClick: () => setActiveView('occupancy'),
                className: `px-3 py-1.5 text-sm rounded-md transition-all ${
                  activeView === 'occupancy'
                    ? 'bg-indigo-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`,
                children: 'Doluluk',
              }),
            ],
          }),
        ],
      }),
      _jsxs('div', {
        className: 'grid grid-cols-2 md:grid-cols-4 gap-4 mb-6',
        children: [
          _jsxs('div', {
            className:
              'bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg p-3 border border-green-500/20',
            children: [
              _jsxs('div', {
                className: 'flex items-center gap-2 mb-1',
                children: [
                  _jsx(ArrowUpRight, { className: 'w-4 h-4 text-green-400' }),
                  _jsx('span', {
                    className: 'text-xs text-green-300',
                    children: 'Toplam Giri\u015F',
                  }),
                ],
              }),
              _jsx('div', {
                className: 'text-lg font-bold text-white',
                children: stats.totalEntries,
              }),
            ],
          }),
          _jsxs('div', {
            className:
              'bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-lg p-3 border border-red-500/20',
            children: [
              _jsxs('div', {
                className: 'flex items-center gap-2 mb-1',
                children: [
                  _jsx(ArrowDownRight, { className: 'w-4 h-4 text-red-400' }),
                  _jsx('span', {
                    className: 'text-xs text-red-300',
                    children: 'Toplam \u00C7\u0131k\u0131\u015F',
                  }),
                ],
              }),
              _jsx('div', {
                className: 'text-lg font-bold text-white',
                children: stats.totalExits,
              }),
            ],
          }),
          _jsxs('div', {
            className:
              'bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg p-3 border border-blue-500/20',
            children: [
              _jsxs('div', {
                className: 'flex items-center gap-2 mb-1',
                children: [
                  _jsx(TrendingUp, { className: 'w-4 h-4 text-blue-400' }),
                  _jsx('span', {
                    className: 'text-xs text-blue-300',
                    children: 'Pik Doluluk',
                  }),
                ],
              }),
              _jsx('div', {
                className: 'text-lg font-bold text-white',
                children: stats.peakOccupancy,
              }),
            ],
          }),
          _jsxs('div', {
            className:
              'bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-lg p-3 border border-purple-500/20',
            children: [
              _jsxs('div', {
                className: 'flex items-center gap-2 mb-1',
                children: [
                  _jsx(Users, { className: 'w-4 h-4 text-purple-400' }),
                  _jsx('span', {
                    className: 'text-xs text-purple-300',
                    children: 'Ort. Doluluk',
                  }),
                ],
              }),
              _jsx('div', {
                className: 'text-lg font-bold text-white',
                children: stats.avgOccupancy,
              }),
            ],
          }),
        ],
      }),
      _jsx('div', {
        className: 'h-80',
        children: _jsx(ResponsiveContainer, {
          width: '100%',
          height: '100%',
          children:
            activeView === 'traffic'
              ? _jsxs(LineChart, {
                  data: chartData,
                  margin: { top: 5, right: 30, left: 20, bottom: 5 },
                  children: [
                    _jsx(XAxis, {
                      dataKey: 'time',
                      axisLine: false,
                      tickLine: false,
                      tick: { fill: '#9CA3AF', fontSize: 12 },
                      interval: 'preserveStartEnd',
                    }),
                    _jsx(YAxis, {
                      axisLine: false,
                      tickLine: false,
                      tick: { fill: '#9CA3AF', fontSize: 12 },
                    }),
                    _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
                    _jsx(Legend, {
                      wrapperStyle: { paddingTop: '20px' },
                      iconType: 'circle',
                    }),
                    _jsx(Line, {
                      type: 'monotone',
                      dataKey: 'entries',
                      stroke: '#10B981',
                      strokeWidth: 2,
                      dot: { fill: '#10B981', strokeWidth: 2, r: 4 },
                      activeDot: { r: 6, stroke: '#10B981', strokeWidth: 2 },
                      name: 'Giri\u015F',
                    }),
                    _jsx(Line, {
                      type: 'monotone',
                      dataKey: 'exits',
                      stroke: '#EF4444',
                      strokeWidth: 2,
                      dot: { fill: '#EF4444', strokeWidth: 2, r: 4 },
                      activeDot: { r: 6, stroke: '#EF4444', strokeWidth: 2 },
                      name: '\u00C7\u0131k\u0131\u015F',
                    }),
                  ],
                })
              : _jsxs(AreaChart, {
                  data: chartData,
                  margin: { top: 5, right: 30, left: 20, bottom: 5 },
                  children: [
                    _jsx(XAxis, {
                      dataKey: 'time',
                      axisLine: false,
                      tickLine: false,
                      tick: { fill: '#9CA3AF', fontSize: 12 },
                      interval: 'preserveStartEnd',
                    }),
                    _jsx(YAxis, {
                      axisLine: false,
                      tickLine: false,
                      tick: { fill: '#9CA3AF', fontSize: 12 },
                    }),
                    _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
                    _jsx(Area, {
                      type: 'monotone',
                      dataKey: 'occupancy',
                      stroke: '#3B82F6',
                      fill: 'url(#colorOccupancy)',
                      strokeWidth: 2,
                      name: 'Doluluk',
                    }),
                    _jsx('defs', {
                      children: _jsxs('linearGradient', {
                        id: 'colorOccupancy',
                        x1: '0',
                        y1: '0',
                        x2: '0',
                        y2: '1',
                        children: [
                          _jsx('stop', {
                            offset: '5%',
                            stopColor: '#3B82F6',
                            stopOpacity: 0.3,
                          }),
                          _jsx('stop', {
                            offset: '95%',
                            stopColor: '#3B82F6',
                            stopOpacity: 0,
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
        }),
      }),
    ],
  })
}
