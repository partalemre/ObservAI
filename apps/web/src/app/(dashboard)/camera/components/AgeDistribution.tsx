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

interface AgeData {
  '0-18': number
  '19-30': number
  '31-45': number
  '46-60': number
  '60+': number
}

interface AgeDistributionProps {
  data?: AgeData
}

const AGE_COLORS = [
  '#10B981', // 0-18: Green
  '#3B82F6', // 19-30: Blue
  '#8B5CF6', // 31-45: Purple
  '#F59E0B', // 46-60: Orange
  '#EF4444', // 60+: Red
]

export const AgeDistribution: React.FC<AgeDistributionProps> = ({ data }) => {
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const percentage =
        total > 0 ? ((data.value / total) * 100).toFixed(1) : '0'
      return (
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-3 shadow-lg">
          <p className="font-medium text-white">{data.payload.label}</p>
          <p className="text-gray-300">
            {data.value} kişi ({percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  const dominantAge = React.useMemo(() => {
    if (chartData.length === 0) return null
    return chartData.reduce((max, current) =>
      current.value > max.value ? current : max
    )
  }, [chartData])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card h-full rounded-xl p-6"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-purple-500/20 p-2">
          <Calendar className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Yaş Dağılımı</h3>
          <p className="text-sm text-gray-400">Toplam: {total} kişi</p>
        </div>
      </div>

      {/* Dominant Age Group Highlight */}
      {dominantAge && (
        <div className="mb-4 rounded-lg border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-purple-300">En yoğun grup:</span>
            <span className="text-sm font-semibold text-white">
              {dominantAge.label}
            </span>
            <span className="text-xs text-gray-400">
              ({((dominantAge.value / total) * 100).toFixed(1)}%)
            </span>
          </div>
        </div>
      )}

      {chartData.length > 0 ? (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-48 items-center justify-center">
          <div className="text-center text-gray-400">
            <Calendar className="mx-auto mb-3 h-12 w-12 opacity-50" />
            <p>Veri bekleniyor...</p>
          </div>
        </div>
      )}

      {/* Statistics */}
      {chartData.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {chartData.slice(0, 4).map((item, index) => {
            const percentage =
              total > 0 ? ((item.value / total) * 100).toFixed(0) : '0'
            const isTop = item === dominantAge

            return (
              <div
                key={item.name}
                className={`rounded-lg border p-3 ${
                  isTop
                    ? 'border-purple-500/30 bg-purple-500/10'
                    : 'border-gray-700/50 bg-gray-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-gray-300">{item.name}</span>
                  </div>
                  {isTop && <TrendingUp className="h-3 w-3 text-purple-400" />}
                </div>
                <div className="mt-1">
                  <div className="text-sm font-semibold text-white">
                    {item.value}
                  </div>
                  <div className="text-xs text-gray-400">{percentage}%</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
