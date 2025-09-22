import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { t } from '../../lib/i18n'
import { formatCurrency } from '../../lib/format'
export const SalesChart = ({ data, loading }) => {
  if (loading) {
    return _jsxs('div', {
      className: 'rounded-lg border border-gray-200 bg-white p-6 shadow-sm',
      children: [
        _jsx('h3', {
          className: 'mb-4 text-lg font-semibold text-gray-900',
          children: t('dashboard.salesChart'),
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
    const date = new Date(tickItem)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }
  const formatTooltipValue = (value, name) => {
    if (name === 'revenue') {
      return [formatCurrency(value), 'Revenue']
    }
    return [value, 'Orders']
  }
  return _jsxs('div', {
    className: 'rounded-lg border border-gray-200 bg-white p-6 shadow-sm',
    children: [
      _jsx('h3', {
        className: 'mb-4 text-lg font-semibold text-gray-900',
        children: t('dashboard.salesChart'),
      }),
      _jsx('div', {
        className: 'h-64',
        children: _jsx(ResponsiveContainer, {
          width: '100%',
          height: '100%',
          children: _jsxs(LineChart, {
            data: data,
            children: [
              _jsx(CartesianGrid, {
                strokeDasharray: '3 3',
                className: 'opacity-30',
              }),
              _jsx(XAxis, {
                dataKey: 'ts',
                tickFormatter: formatXAxisTick,
                className: 'text-xs',
              }),
              _jsx(YAxis, { className: 'text-xs' }),
              _jsx(Tooltip, {
                formatter: formatTooltipValue,
                labelFormatter: (value) => `Time: ${formatXAxisTick(value)}`,
                contentStyle: {
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '12px',
                },
              }),
              _jsx(Line, {
                type: 'monotone',
                dataKey: 'revenue',
                stroke: '#2563eb',
                strokeWidth: 2,
                dot: { fill: '#2563eb', strokeWidth: 2, r: 4 },
                activeDot: { r: 6 },
              }),
            ],
          }),
        }),
      }),
    ],
  })
}
