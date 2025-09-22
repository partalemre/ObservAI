import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { t } from '../../lib/i18n'
export const BusyHoursChart = ({ data, loading }) => {
  if (!data || data.length === 0) {
    return null
  }
  if (loading) {
    return _jsxs('div', {
      className: 'rounded-lg border border-gray-200 bg-white p-6 shadow-sm',
      children: [
        _jsx('h3', {
          className: 'mb-4 text-lg font-semibold text-gray-900',
          children: t('dashboard.busyHours'),
        }),
        _jsx('div', {
          className: 'flex h-64 items-center justify-center',
          children: _jsx('div', {
            className: 'animate-pulse text-gray-400',
            children: t('common.loading'),
          }),
        }),
      ],
    })
  }
  const formatXAxisTick = (tickItem) => {
    return `${tickItem}:00`
  }
  return _jsxs('div', {
    className: 'rounded-lg border border-gray-200 bg-white p-6 shadow-sm',
    children: [
      _jsx('h3', {
        className: 'mb-4 text-lg font-semibold text-gray-900',
        children: t('dashboard.busyHours'),
      }),
      _jsx('div', {
        className: 'h-64',
        children: _jsx(ResponsiveContainer, {
          width: '100%',
          height: '100%',
          children: _jsxs(BarChart, {
            data: data,
            children: [
              _jsx(CartesianGrid, {
                strokeDasharray: '3 3',
                className: 'opacity-30',
              }),
              _jsx(XAxis, {
                dataKey: 'hour',
                tickFormatter: formatXAxisTick,
                className: 'text-xs',
              }),
              _jsx(YAxis, { className: 'text-xs' }),
              _jsx(Tooltip, {
                formatter: (value) => [value, 'Visitors'],
                labelFormatter: (value) => `${value}:00`,
                contentStyle: {
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '12px',
                },
              }),
              _jsx(Bar, {
                dataKey: 'visitors',
                fill: '#10b981',
                radius: [2, 2, 0, 0],
              }),
            ],
          }),
        }),
      }),
    ],
  })
}
