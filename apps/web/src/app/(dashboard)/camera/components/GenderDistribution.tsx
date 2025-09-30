import React from 'react'
import { motion } from 'framer-motion'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { Users, User } from 'lucide-react'

interface GenderData {
  male: number
  female: number
  unknown: number
}

interface GenderDistributionProps {
  data?: GenderData
}

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

export const GenderDistribution: React.FC<GenderDistributionProps> = ({
  data,
}) => {
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const percentage =
        total > 0 ? ((data.value / total) * 100).toFixed(1) : '0'
      return (
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-3 shadow-lg">
          <p className="font-medium text-white">{data.payload.name}</p>
          <p className="text-gray-300">
            {data.value} kişi ({percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card h-full rounded-xl p-6"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-blue-500/20 p-2">
          <Users className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">
            Cinsiyet Dağılımı
          </h3>
          <p className="text-sm text-gray-400">Toplam: {total} kişi</p>
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center text-gray-400">
            <Users className="mx-auto mb-3 h-12 w-12 opacity-50" />
            <p>Veri bekleniyor...</p>
          </div>
        </div>
      )}

      {/* Legend */}
      {chartData.length > 0 && (
        <div className="mt-4 space-y-2">
          {chartData.map((item) => {
            const percentage =
              total > 0 ? ((item.value / total) * 100).toFixed(1) : '0'
            const IconComponent =
              GENDER_ICONS[item.key as keyof typeof GENDER_ICONS]

            return (
              <div key={item.key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <IconComponent className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-300">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-white">
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
