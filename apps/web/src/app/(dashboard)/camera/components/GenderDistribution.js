import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from 'react/jsx-runtime'
import { useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import * as echarts from 'echarts'
import { Users, User } from 'lucide-react'
import { Skeleton } from '../../../../components/ui'
const GENDER_CONFIG = {
  male: {
    label: 'Erkek',
    color: '#3B82F6',
    icon: User,
  },
  female: {
    label: 'Kadın',
    color: '#EC4899',
    icon: User,
  },
  unknown: {
    label: 'Bilinmeyen',
    color: '#6B7280',
    icon: Users,
  },
}
export const GenderDistribution = ({ data, loading = false }) => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const chartData = useMemo(() => {
    if (!data) return []
    return Object.keys(GENDER_CONFIG)
      .map((key) => ({
        key,
        name: GENDER_CONFIG[key].label,
        value: data[key] ?? 0,
        color: GENDER_CONFIG[key].color,
      }))
      .filter((item) => item.value > 0)
  }, [data])
  const total = useMemo(
    () => chartData.reduce((sum, item) => sum + item.value, 0),
    [chartData]
  )
  useEffect(() => {
    if (!chartRef.current) return
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current)
    }
    if (chartData.length === 0) {
      chartInstance.current?.clear()
      return
    }
    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: 'rgba(148, 163, 184, 0.4)',
        borderWidth: 1,
        textStyle: {
          color: '#E2E8F0',
          fontSize: 12,
        },
        formatter: ({ name, value, percent }) => `<div style="padding:8px">
            <div style="font-weight:600;color:#3B82F6;margin-bottom:4px">${name}</div>
            <div style="color:#E2E8F0">${value} kişi</div>
            <div style="color:#94A3B8">Oran: %${percent?.toFixed(1)}</div>
          </div>`,
      },
      color: chartData.map((item) => item.color),
      series: [
        {
          name: 'Cinsiyet',
          type: 'pie',
          radius: ['55%', '80%'],
          center: ['50%', '55%'],
          minAngle: 5,
          avoidLabelOverlap: true,
          itemStyle: {
            borderColor: 'rgba(15, 23, 42, 0.95)',
            borderWidth: 2,
            shadowBlur: 12,
            shadowColor: 'rgba(15, 23, 42, 0.45)',
          },
          label: {
            show: true,
            color: '#E2E8F0',
            overflow: 'truncate',
            formatter: '{b|{b}}\n{c} kişi',
            rich: {
              b: { fontSize: 12, fontWeight: 600, lineHeight: 18 },
            },
          },
          labelLine: {
            show: true,
            smooth: true,
            lineStyle: {
              color: 'rgba(226, 232, 240, 0.4)',
            },
          },
          data: chartData.map((item) => ({
            name: item.name,
            value: item.value,
            itemStyle: {
              color: item.color,
            },
          })),
          animationDuration: 800,
          animationEasing: 'cubicOut',
        },
      ],
      graphic: total
        ? {
            type: 'group',
            left: 'center',
            top: '55%',
            children: [
              {
                type: 'text',
                left: 'center',
                top: -16,
                style: {
                  text: `${total}`,
                  fill: '#F8FAFC',
                  fontSize: 22,
                  fontWeight: 700,
                  textAlign: 'center',
                },
              },
              {
                type: 'text',
                left: 'center',
                top: 12,
                style: {
                  text: 'Toplam',
                  fill: '#94A3B8',
                  fontSize: 12,
                  fontWeight: 500,
                  textAlign: 'center',
                },
              },
            ],
          }
        : undefined,
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
    transition: { duration: 0.5, delay: 0.2 },
    className: 'glass-card h-full rounded-xl p-6',
    children: [
      _jsxs('div', {
        className: 'mb-6 flex items-center gap-3',
        children: [
          _jsx('div', {
            className: 'rounded-lg bg-blue-500/20 p-2',
            children: _jsx(Users, { className: 'h-5 w-5 text-blue-400' }),
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
      loading
        ? _jsxs('div', {
            className: 'flex h-64 flex-col justify-between',
            children: [
              _jsx(Skeleton, { className: 'h-48 w-full rounded-xl' }),
              _jsxs('div', {
                className: 'mt-4 space-y-3',
                children: [
                  _jsx(Skeleton, { className: 'h-4 w-3/4 rounded-lg' }),
                  _jsx(Skeleton, { className: 'h-4 w-1/2 rounded-lg' }),
                  _jsx(Skeleton, { className: 'h-4 w-2/3 rounded-lg' }),
                ],
              }),
            ],
          })
        : chartData.length > 0
          ? _jsxs(_Fragment, {
              children: [
                _jsx('div', {
                  className: 'h-64',
                  children: _jsx('div', {
                    ref: chartRef,
                    className: 'h-full w-full',
                  }),
                }),
                _jsx('div', {
                  className: 'mt-4 space-y-3',
                  children: chartData.map((item) => {
                    const percentage =
                      total > 0 ? ((item.value / total) * 100).toFixed(1) : '0'
                    const IconComponent = GENDER_CONFIG[item.key].icon
                    return _jsxs(
                      'div',
                      {
                        className:
                          'flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2',
                        children: [
                          _jsxs('div', {
                            className: 'flex items-center gap-3',
                            children: [
                              _jsx('div', {
                                className: 'h-3 w-3 rounded-full',
                                style: { backgroundColor: item.color },
                              }),
                              _jsx(IconComponent, {
                                className: 'h-4 w-4 text-gray-400',
                              }),
                              _jsx('span', {
                                className: 'text-sm text-gray-200',
                                children: item.name,
                              }),
                            ],
                          }),
                          _jsxs('div', {
                            className: 'text-right',
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
              className: 'flex h-64 items-center justify-center',
              children: _jsxs('div', {
                className: 'text-center text-gray-400',
                children: [
                  _jsx(Users, {
                    className: 'mx-auto mb-3 h-12 w-12 opacity-50',
                  }),
                  _jsx('p', { children: 'Veri bekleniyor...' }),
                ],
              }),
            }),
    ],
  })
}
