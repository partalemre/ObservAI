import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from 'react/jsx-runtime'
import { useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import * as echarts from 'echarts'
import { Calendar, TrendingUp } from 'lucide-react'
import { Skeleton } from '../../../../components/ui'
const AGE_GROUPS = [
  { key: '0-18', label: '0-18 yaş', color: ['#10B981', '#34D399'] },
  { key: '19-30', label: '19-30 yaş', color: ['#2563EB', '#3B82F6'] },
  { key: '31-45', label: '31-45 yaş', color: ['#7C3AED', '#8B5CF6'] },
  { key: '46-60', label: '46-60 yaş', color: ['#D97706', '#F59E0B'] },
  { key: '60+', label: '60+ yaş', color: ['#DC2626', '#EF4444'] },
]
export const AgeDistribution = ({ data, loading = false }) => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const chartData = useMemo(() => {
    if (!data) return []
    return AGE_GROUPS.map(({ key, label, color }) => ({
      key,
      label,
      value: data[key] ?? 0,
      color,
    })).filter((item) => item.value > 0)
  }, [data])
  const total = useMemo(
    () => chartData.reduce((sum, item) => sum + item.value, 0),
    [chartData]
  )
  const dominantAge = useMemo(() => {
    if (chartData.length === 0) return null
    return chartData.reduce((max, current) =>
      current.value > max.value ? current : max
    )
  }, [chartData])
  useEffect(() => {
    if (!chartRef.current) return
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current)
    }
    if (chartData.length === 0) {
      chartInstance.current?.clear()
      return
    }
    const categories = chartData.map((item) => item.key)
    const option = {
      backgroundColor: 'transparent',
      grid: {
        left: '3%',
        right: '3%',
        top: '10%',
        bottom: '12%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: 'rgba(148, 163, 184, 0.3)',
        borderWidth: 1,
        textStyle: {
          color: '#E2E8F0',
        },
        formatter: (params) => {
          const point = params[0]
          const item = chartData[point.dataIndex]
          const percentage =
            total > 0 ? ((item.value / total) * 100).toFixed(1) : '0'
          return `
            <div style="padding:8px">
              <div style="font-weight:600;color:#8B5CF6;margin-bottom:4px;">
                ${item.label}
              </div>
              <div style="color:#E2E8F0">Kişi: ${item.value}</div>
              <div style="color:#94A3B8">Oran: %${percentage}</div>
            </div>
          `
        },
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLine: {
          lineStyle: { color: '#475569' },
        },
        axisTick: { show: false },
        axisLabel: {
          color: '#CBD5F5',
          fontWeight: 500,
        },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: '#94A3B8',
        },
        splitLine: {
          lineStyle: { color: 'rgba(148, 163, 184, 0.12)' },
        },
      },
      series: [
        {
          type: 'bar',
          barWidth: 28,
          itemStyle: {
            borderRadius: [10, 10, 4, 4],
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 16,
              shadowColor: 'rgba(139, 92, 246, 0.35)',
            },
          },
          label: {
            show: true,
            position: 'top',
            color: '#E2E8F0',
            fontSize: 11,
            formatter: '{c}',
          },
          data: chartData.map((item) => ({
            value: item.value,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: item.color[0] },
                { offset: 1, color: item.color[1] },
              ]),
            },
          })),
          animationDuration: 900,
        },
      ],
    }
    chartInstance.current.setOption(option, true)
    const handleResize = () => chartInstance.current?.resize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [chartData, total])
  useEffect(() => {
    return () => {
      chartInstance.current?.dispose()
    }
  }, [])
  return _jsxs(motion.div, {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: 0.3 },
    className: 'glass-card h-full rounded-xl p-6',
    children: [
      _jsxs('div', {
        className: 'mb-6 flex items-center gap-3',
        children: [
          _jsx('div', {
            className: 'rounded-lg bg-purple-500/20 p-2',
            children: _jsx(Calendar, { className: 'h-5 w-5 text-purple-400' }),
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
            'mb-4 rounded-lg border border-purple-500/25 bg-gradient-to-r from-purple-500/15 to-indigo-500/10 p-3',
          children: _jsxs('div', {
            className: 'flex items-center gap-2',
            children: [
              _jsx(TrendingUp, { className: 'h-4 w-4 text-purple-300' }),
              _jsx('span', {
                className: 'text-sm text-purple-200',
                children: 'En yo\u011Fun grup:',
              }),
              _jsx('span', {
                className: 'text-sm font-semibold text-white',
                children: dominantAge.label,
              }),
              _jsxs('span', {
                className: 'text-xs text-gray-300',
                children: [
                  '(',
                  total > 0
                    ? ((dominantAge.value / total) * 100).toFixed(1)
                    : '0',
                  '%)',
                ],
              }),
            ],
          }),
        }),
      loading
        ? _jsxs('div', {
            className: 'flex h-52 flex-col justify-between',
            children: [
              _jsx(Skeleton, { className: 'h-40 w-full rounded-xl' }),
              _jsxs('div', {
                className: 'mt-4 grid grid-cols-2 gap-3',
                children: [
                  _jsx(Skeleton, { className: 'h-14 w-full rounded-lg' }),
                  _jsx(Skeleton, { className: 'h-14 w-full rounded-lg' }),
                  _jsx(Skeleton, { className: 'h-14 w-full rounded-lg' }),
                  _jsx(Skeleton, { className: 'h-14 w-full rounded-lg' }),
                ],
              }),
            ],
          })
        : chartData.length > 0
          ? _jsxs(_Fragment, {
              children: [
                _jsx('div', {
                  className: 'h-52',
                  children: _jsx('div', {
                    ref: chartRef,
                    className: 'h-full w-full',
                  }),
                }),
                _jsx('div', {
                  className: 'mt-4 grid grid-cols-2 gap-3',
                  children: chartData.slice(0, 4).map((item) => {
                    const isDominant = dominantAge?.key === item.key
                    const percentage =
                      total > 0 ? ((item.value / total) * 100).toFixed(0) : '0'
                    return _jsxs(
                      'div',
                      {
                        className: `rounded-lg border p-3 transition-colors ${
                          isDominant
                            ? 'border-purple-500/40 bg-purple-500/15'
                            : 'border-slate-700/40 bg-slate-900/40'
                        }`,
                        children: [
                          _jsxs('div', {
                            className: 'flex items-center justify-between',
                            children: [
                              _jsxs('div', {
                                className: 'flex items-center gap-2',
                                children: [
                                  _jsx('div', {
                                    className: 'h-2 w-2 rounded-full',
                                    style: { backgroundColor: item.color[1] },
                                  }),
                                  _jsx('span', {
                                    className: 'text-xs text-gray-300',
                                    children: item.label,
                                  }),
                                ],
                              }),
                              isDominant &&
                                _jsx(TrendingUp, {
                                  className: 'h-3 w-3 text-purple-300',
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
                      item.key
                    )
                  }),
                }),
              ],
            })
          : _jsx('div', {
              className: 'flex h-52 items-center justify-center',
              children: _jsxs('div', {
                className: 'text-center text-gray-400',
                children: [
                  _jsx(Calendar, {
                    className: 'mx-auto mb-3 h-12 w-12 opacity-50',
                  }),
                  _jsx('p', { children: 'Veri bekleniyor...' }),
                ],
              }),
            }),
    ],
  })
}
