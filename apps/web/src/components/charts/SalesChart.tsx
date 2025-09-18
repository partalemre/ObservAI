import React from 'react'
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

interface SalesData {
  ts: string
  revenue: number
  orders: number
}

interface SalesChartProps {
  data: SalesData[]
  loading?: boolean
}

export const SalesChart: React.FC<SalesChartProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          {t('dashboard.salesChart')}
        </h3>
        <div className="flex h-64 items-center justify-center">
          <div className="animate-pulse text-gray-400">
            {t('common.loading')}
          </div>
        </div>
      </div>
    )
  }

  const formatXAxisTick = (tickItem: string) => {
    const date = new Date(tickItem)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  const formatTooltipValue = (value: number, name: string) => {
    if (name === 'revenue') {
      return [formatCurrency(value), 'Revenue']
    }
    return [value, 'Orders']
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        {t('dashboard.salesChart')}
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="ts"
              tickFormatter={formatXAxisTick}
              className="text-xs"
            />
            <YAxis className="text-xs" />
            <Tooltip
              formatter={formatTooltipValue}
              labelFormatter={(value) => `Time: ${formatXAxisTick(value)}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '12px',
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
