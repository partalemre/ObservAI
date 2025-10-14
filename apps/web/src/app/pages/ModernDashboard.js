import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingBag,
  Clock,
  BarChart3,
  Activity,
  RefreshCw,
} from 'lucide-react'
import ReactECharts from 'echarts-for-react'
// Mock data generator
const generateMockData = () => ({
  metrics: {
    adns: {
      value: 3974,
      change: -154,
      changePercent: -3.74,
      label: 'Average Daily Sales',
    },
    cogs: {
      value: 0,
      change: 0,
      changePercent: 0,
      label: 'Cost of Goods Sold',
    },
    laborRatio: {
      value: 0.303,
      change: 8.4,
      changePercent: 2.84,
      label: 'Labor Ratio Over Revenue',
    },
    traffic: {
      value: 533,
      change: -9,
      changePercent: -1.66,
      label: 'Daily Traffic',
    },
    aov: {
      value: 7.46,
      change: 0,
      changePercent: 0,
      label: 'Average Order Value',
    },
  },
  bestSellers: [
    { rank: 1, item: 'Iced Caramel Macchiato', mixPercent: 5.2 },
    { rank: 2, item: 'Iced Custom Energy', mixPercent: 4.55 },
    { rank: 3, item: 'Iced Americano', mixPercent: 4.47 },
    { rank: 4, item: 'Iced Caramel Macchiato', mixPercent: 4.15 },
  ],
  trending: [
    { rank: 1, item: 'Iced Caramel Macchiato', uplift: 44.0, mixPercent: 4.15 },
    { rank: 2, item: 'Cold Brew', uplift: 72.0, mixPercent: 2.39 },
    { rank: 3, item: 'Iced Snow Peak', uplift: 50.0, mixPercent: 2.27 },
    { rank: 4, item: 'Iced Latte', uplift: 56.0, mixPercent: 1.78 },
  ],
  categoryMix: [
    { name: 'Coffee', value: 45, color: '#4F46E5' },
    { name: 'Energy', value: 25, color: '#059669' },
    { name: 'Misc', value: 8, color: '#DC2626' },
    { name: 'Tea', value: 7, color: '#D97706' },
    { name: 'Smoothie', value: 6, color: '#7C3AED' },
    { name: 'Shake', value: 5, color: '#DB2777' },
    { name: 'Milk', value: 4, color: '#2563EB' },
  ],
  hourlyData: Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    sales:
      Math.floor(Math.random() * 500) + 100 + (i >= 7 && i <= 19 ? 200 : 0),
    orders: Math.floor(Math.random() * 50) + 10 + (i >= 7 && i <= 19 ? 20 : 0),
  })),
})
const ModernDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today')
  const [selectedStore, setSelectedStore] = useState('vista')
  const {
    data: dashboardData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['modern-dashboard', selectedPeriod, selectedStore],
    queryFn: () => Promise.resolve(generateMockData()),
    refetchInterval: 30000,
  })
  const data = dashboardData || generateMockData()
  // Chart configurations
  const pieChartOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#374151',
      textStyle: { color: '#fff' },
    },
    legend: {
      orient: 'vertical',
      right: '10%',
      top: 'center',
      textStyle: { color: '#9CA3AF' },
    },
    series: [
      {
        name: 'Category Mix',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#1F2937',
          borderWidth: 2,
        },
        label: { show: false },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            color: '#fff',
          },
        },
        data: data.categoryMix,
      },
    ],
  }
  const barChartOption = {
    backgroundColor: 'transparent',
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#374151',
      textStyle: { color: '#fff' },
    },
    xAxis: {
      type: 'category',
      data: data.hourlyData.map((d) => `${d.hour}:00`),
      axisLine: { lineStyle: { color: '#374151' } },
      axisLabel: { color: '#9CA3AF', fontSize: 10 },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#374151', type: 'dashed' } },
      axisLabel: { color: '#9CA3AF' },
    },
    series: [
      {
        data: data.hourlyData.map((d) => d.sales),
        type: 'bar',
        barWidth: '60%',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#4F46E5' },
              { offset: 1, color: '#7C3AED' },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(79, 70, 229, 0.5)',
          },
        },
      },
    ],
  }
  if (isLoading) {
    return _jsx('div', {
      className: 'flex min-h-screen items-center justify-center bg-gray-50',
      children: _jsx('div', {
        className:
          'h-32 w-32 animate-spin rounded-full border-b-2 border-indigo-600',
      }),
    })
  }
  return _jsxs('div', {
    className: 'min-h-screen bg-gray-50',
    children: [
      _jsx('div', {
        className: 'border-b bg-white shadow-sm',
        children: _jsx('div', {
          className: 'px-6 py-4',
          children: _jsxs('div', {
            className: 'flex items-center justify-between',
            children: [
              _jsxs('div', {
                children: [
                  _jsx('h1', {
                    className: 'text-2xl font-bold text-gray-900',
                    children: 'Dashboard',
                  }),
                  _jsx('p', {
                    className: 'text-sm text-gray-600',
                    children: 'Real-time business analytics',
                  }),
                ],
              }),
              _jsxs('div', {
                className: 'flex items-center gap-4',
                children: [
                  _jsxs('select', {
                    value: selectedStore,
                    onChange: (e) => setSelectedStore(e.target.value),
                    className:
                      'rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none',
                    children: [
                      _jsx('option', { value: 'vista', children: 'Vista' }),
                      _jsx('option', {
                        value: 'downtown',
                        children: 'Downtown',
                      }),
                      _jsx('option', {
                        value: 'mall',
                        children: 'Mall Location',
                      }),
                    ],
                  }),
                  _jsx('div', {
                    className: 'flex rounded-lg bg-gray-100 p-1',
                    children: ['Today', 'Last 7 days', 'Last 30 days'].map(
                      (period) =>
                        _jsx(
                          'button',
                          {
                            onClick: () =>
                              setSelectedPeriod(
                                period.toLowerCase().replace(' ', '_')
                              ),
                            className: `rounded-md px-4 py-2 text-sm transition-colors ${
                              selectedPeriod ===
                              period.toLowerCase().replace(' ', '_')
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`,
                            children: period,
                          },
                          period
                        )
                    ),
                  }),
                  _jsx('button', {
                    onClick: () => refetch(),
                    className:
                      'p-2 text-gray-400 transition-colors hover:text-gray-600',
                    children: _jsx(RefreshCw, { className: 'h-5 w-5' }),
                  }),
                ],
              }),
            ],
          }),
        }),
      }),
      _jsxs('div', {
        className: 'space-y-6 p-6',
        children: [
          _jsx('div', {
            className: 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3',
            children: Object.entries(data.metrics).map(([key, metric]) =>
              _jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  className:
                    'rounded-xl border border-gray-200 bg-white p-6 shadow-sm',
                  children: [
                    _jsx('div', {
                      className: 'mb-4 flex items-center justify-between',
                      children: _jsxs('div', {
                        className: 'flex items-center gap-3',
                        children: [
                          _jsxs('div', {
                            className: `rounded-lg p-2 ${
                              key === 'adns'
                                ? 'bg-red-100 text-red-600'
                                : key === 'cogs'
                                  ? 'bg-red-100 text-red-600'
                                  : key === 'laborRatio'
                                    ? 'bg-green-100 text-green-600'
                                    : key === 'traffic'
                                      ? 'bg-blue-100 text-blue-600'
                                      : 'bg-green-100 text-green-600'
                            }`,
                            children: [
                              key === 'adns' &&
                                _jsx(DollarSign, { className: 'h-5 w-5' }),
                              key === 'cogs' &&
                                _jsx(BarChart3, { className: 'h-5 w-5' }),
                              key === 'laborRatio' &&
                                _jsx(Users, { className: 'h-5 w-5' }),
                              key === 'traffic' &&
                                _jsx(Activity, { className: 'h-5 w-5' }),
                              key === 'aov' &&
                                _jsx(ShoppingBag, { className: 'h-5 w-5' }),
                            ],
                          }),
                          _jsx('div', {
                            children: _jsx('p', {
                              className: 'text-sm text-gray-600',
                              children: metric.label,
                            }),
                          }),
                        ],
                      }),
                    }),
                    _jsxs('div', {
                      className: 'space-y-2',
                      children: [
                        _jsxs('div', {
                          className: 'text-3xl font-bold text-gray-900',
                          children: [
                            key === 'adns' || key === 'aov' ? '$' : '',
                            key === 'laborRatio'
                              ? `${(metric.value * 100).toFixed(2)}%`
                              : typeof metric.value === 'number'
                                ? metric.value.toLocaleString()
                                : metric.value,
                          ],
                        }),
                        _jsxs('div', {
                          className: 'flex items-center gap-2',
                          children: [
                            _jsxs('div', {
                              className: 'flex items-center gap-1',
                              children: [
                                _jsx('span', {
                                  className: 'text-sm text-gray-500',
                                  children: 'MTD',
                                }),
                                _jsxs('span', {
                                  className: `text-sm ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`,
                                  children: [
                                    metric.change >= 0 ? '+' : '',
                                    metric.change,
                                  ],
                                }),
                                metric.change !== 0 &&
                                  (metric.change >= 0
                                    ? _jsx(TrendingUp, {
                                        className: 'h-4 w-4 text-green-600',
                                      })
                                    : _jsx(TrendingDown, {
                                        className: 'h-4 w-4 text-red-600',
                                      })),
                              ],
                            }),
                            _jsxs('div', {
                              className: 'flex items-center gap-1',
                              children: [
                                _jsx('span', {
                                  className: 'text-sm text-gray-500',
                                  children: 'YTD',
                                }),
                                _jsxs('span', {
                                  className: `text-sm ${metric.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`,
                                  children: [
                                    metric.changePercent >= 0 ? '+' : '',
                                    metric.changePercent,
                                    '%',
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                },
                key
              )
            ),
          }),
          _jsxs('div', {
            className: 'grid grid-cols-1 gap-6 lg:grid-cols-2',
            children: [
              _jsxs(motion.div, {
                initial: { opacity: 0, x: -20 },
                animate: { opacity: 1, x: 0 },
                className:
                  'rounded-xl border border-gray-200 bg-white p-6 shadow-sm',
                children: [
                  _jsx('h3', {
                    className: 'mb-4 text-lg font-semibold text-gray-900',
                    children: 'Sales (Hourly)',
                  }),
                  _jsx('div', {
                    className: 'h-64',
                    children: _jsx(ReactECharts, {
                      option: barChartOption,
                      style: { height: '100%' },
                    }),
                  }),
                ],
              }),
              _jsxs(motion.div, {
                initial: { opacity: 0, x: 20 },
                animate: { opacity: 1, x: 0 },
                className:
                  'rounded-xl border border-gray-200 bg-white p-6 shadow-sm',
                children: [
                  _jsx('h3', {
                    className: 'mb-4 text-lg font-semibold text-gray-900',
                    children: 'Category Count Mix',
                  }),
                  _jsx('div', {
                    className: 'h-64',
                    children: _jsx(ReactECharts, {
                      option: pieChartOption,
                      style: { height: '100%' },
                    }),
                  }),
                ],
              }),
            ],
          }),
          _jsxs('div', {
            className: 'grid grid-cols-1 gap-6 lg:grid-cols-3',
            children: [
              _jsxs(motion.div, {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 0.1 },
                className:
                  'rounded-xl border border-gray-200 bg-white p-6 shadow-sm',
                children: [
                  _jsx('h3', {
                    className: 'mb-4 text-lg font-semibold text-gray-900',
                    children: 'Best Sellers',
                  }),
                  _jsxs('div', {
                    className: 'space-y-4',
                    children: [
                      _jsxs('div', {
                        className:
                          'grid grid-cols-3 border-b pb-2 text-sm font-medium text-gray-500',
                        children: [
                          _jsx('span', { children: 'Rank' }),
                          _jsx('span', { children: 'Item' }),
                          _jsx('span', { children: 'Mix %' }),
                        ],
                      }),
                      data.bestSellers.map((item) =>
                        _jsxs(
                          'div',
                          {
                            className: 'grid grid-cols-3 items-center text-sm',
                            children: [
                              _jsx('div', {
                                className: 'flex items-center',
                                children: _jsx('span', {
                                  className: `flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                                    item.rank === 1
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : item.rank === 2
                                        ? 'bg-gray-100 text-gray-800'
                                        : item.rank === 3
                                          ? 'bg-orange-100 text-orange-800'
                                          : 'bg-gray-50 text-gray-600'
                                  }`,
                                  children: item.rank,
                                }),
                              }),
                              _jsx('span', {
                                className: 'truncate text-gray-900',
                                children: item.item,
                              }),
                              _jsxs('span', {
                                className: 'text-gray-600',
                                children: [item.mixPercent, '%'],
                              }),
                            ],
                          },
                          item.rank
                        )
                      ),
                    ],
                  }),
                ],
              }),
              _jsxs(motion.div, {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 0.2 },
                className:
                  'rounded-xl border border-gray-200 bg-white p-6 shadow-sm',
                children: [
                  _jsx('h3', {
                    className: 'mb-4 text-lg font-semibold text-gray-900',
                    children: "What's Trending?",
                  }),
                  _jsxs('div', {
                    className: 'space-y-4',
                    children: [
                      _jsxs('div', {
                        className:
                          'grid grid-cols-4 border-b pb-2 text-sm font-medium text-gray-500',
                        children: [
                          _jsx('span', { children: 'Rank' }),
                          _jsx('span', { children: 'Item' }),
                          _jsx('span', { children: 'Uplift' }),
                          _jsx('span', { children: 'Mix %' }),
                        ],
                      }),
                      data.trending.map((item) =>
                        _jsxs(
                          'div',
                          {
                            className: 'grid grid-cols-4 items-center text-sm',
                            children: [
                              _jsx('div', {
                                className: 'flex items-center',
                                children: _jsx('span', {
                                  className: `flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                                    item.rank === 1
                                      ? 'bg-green-100 text-green-800'
                                      : item.rank === 2
                                        ? 'bg-green-100 text-green-800'
                                        : item.rank === 3
                                          ? 'bg-green-100 text-green-800'
                                          : 'bg-gray-50 text-gray-600'
                                  }`,
                                  children: item.rank,
                                }),
                              }),
                              _jsx('span', {
                                className: 'truncate text-xs text-gray-900',
                                children: item.item,
                              }),
                              _jsx('span', {
                                className: 'text-gray-600',
                                children: item.uplift.toFixed(2),
                              }),
                              _jsxs('span', {
                                className: 'text-gray-600',
                                children: [item.mixPercent, '%'],
                              }),
                            ],
                          },
                          item.rank
                        )
                      ),
                    ],
                  }),
                ],
              }),
              _jsxs(motion.div, {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 0.3 },
                className:
                  'rounded-xl border border-gray-200 bg-white p-6 shadow-sm',
                children: [
                  _jsx('h3', {
                    className: 'mb-4 text-lg font-semibold text-gray-900',
                    children: 'Performance Summary',
                  }),
                  _jsxs('div', {
                    className: 'space-y-4',
                    children: [
                      _jsxs('div', {
                        className:
                          'flex items-center justify-between rounded-lg bg-green-50 p-3',
                        children: [
                          _jsxs('div', {
                            className: 'flex items-center gap-2',
                            children: [
                              _jsx(TrendingUp, {
                                className: 'h-4 w-4 text-green-600',
                              }),
                              _jsx('span', {
                                className: 'text-sm text-green-800',
                                children: 'Revenue Growth',
                              }),
                            ],
                          }),
                          _jsx('span', {
                            className: 'text-sm font-semibold text-green-800',
                            children: '+12.5%',
                          }),
                        ],
                      }),
                      _jsxs('div', {
                        className:
                          'flex items-center justify-between rounded-lg bg-blue-50 p-3',
                        children: [
                          _jsxs('div', {
                            className: 'flex items-center gap-2',
                            children: [
                              _jsx(Users, {
                                className: 'h-4 w-4 text-blue-600',
                              }),
                              _jsx('span', {
                                className: 'text-sm text-blue-800',
                                children: 'Customer Satisfaction',
                              }),
                            ],
                          }),
                          _jsx('span', {
                            className: 'text-sm font-semibold text-blue-800',
                            children: '4.8/5',
                          }),
                        ],
                      }),
                      _jsxs('div', {
                        className:
                          'flex items-center justify-between rounded-lg bg-purple-50 p-3',
                        children: [
                          _jsxs('div', {
                            className: 'flex items-center gap-2',
                            children: [
                              _jsx(Clock, {
                                className: 'h-4 w-4 text-purple-600',
                              }),
                              _jsx('span', {
                                className: 'text-sm text-purple-800',
                                children: 'Avg. Order Time',
                              }),
                            ],
                          }),
                          _jsx('span', {
                            className: 'text-sm font-semibold text-purple-800',
                            children: '3.2 min',
                          }),
                        ],
                      }),
                      _jsxs('div', {
                        className:
                          'flex items-center justify-between rounded-lg bg-orange-50 p-3',
                        children: [
                          _jsxs('div', {
                            className: 'flex items-center gap-2',
                            children: [
                              _jsx(Activity, {
                                className: 'h-4 w-4 text-orange-600',
                              }),
                              _jsx('span', {
                                className: 'text-sm text-orange-800',
                                children: 'Peak Hours',
                              }),
                            ],
                          }),
                          _jsx('span', {
                            className: 'text-sm font-semibold text-orange-800',
                            children: '11AM-2PM',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })
}
export default ModernDashboard
