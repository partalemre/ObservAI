import React from 'react'
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

interface BusyHoursData {
  hour: number
  visitors: number
}

interface BusyHoursChartProps {
  data?: BusyHoursData[]
  loading?: boolean
}

export const BusyHoursChart: React.FC<BusyHoursChartProps> = ({
  data,
  loading,
}) => {
  if (!data || data.length === 0) {
    return null
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          {t('dashboard.busyHours')}
        </h3>
        <div className="flex h-64 items-center justify-center">
          <div className="animate-pulse text-gray-400">
            {t('common.loading')}
          </div>
        </div>
      </div>
    )
  }

  const formatXAxisTick = (tickItem: number) => {
    return `${tickItem}:00`
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        {t('dashboard.busyHours')}
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="hour"
              tickFormatter={formatXAxisTick}
              className="text-xs"
            />
            <YAxis className="text-xs" />
            <Tooltip
              formatter={(value: number) => [value, 'Visitors']}
              labelFormatter={(value) => `${value}:00`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="visitors" fill="#10b981" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
