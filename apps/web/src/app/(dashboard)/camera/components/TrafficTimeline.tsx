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

interface TimelineData {
  time: string
  entries: number
  exits: number
  occupancy: number
  timestamp: number
}

interface TrafficTimelineProps {
  data?: TimelineData[]
}

export const TrafficTimeline: React.FC<TrafficTimelineProps> = ({
  data = [],
}) => {
  const [activeView, setActiveView] = useState<'traffic' | 'occupancy'>(
    'traffic'
  )

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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-lg">
          <p className="mb-2 font-medium text-white">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-300">{entry.name}:</span>
              <span className="font-semibold text-white">{entry.value}</span>
              {entry.name === 'Doluluk' && (
                <span className="text-gray-400">kişi</span>
              )}
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card rounded-xl p-6"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-indigo-500/20 p-2">
            <Clock className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Trafik Zaman Çizelgesi
            </h3>
            <p className="text-sm text-gray-400">Son 24 saat</p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center rounded-lg bg-gray-800/50 p-1">
          <button
            onClick={() => setActiveView('traffic')}
            className={`rounded-md px-3 py-1.5 text-sm transition-all ${
              activeView === 'traffic'
                ? 'bg-indigo-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Giriş/Çıkış
          </button>
          <button
            onClick={() => setActiveView('occupancy')}
            className={`rounded-md px-3 py-1.5 text-sm transition-all ${
              activeView === 'occupancy'
                ? 'bg-indigo-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Doluluk
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-green-500/20 bg-gradient-to-r from-green-500/10 to-green-600/10 p-3">
          <div className="mb-1 flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4 text-green-400" />
            <span className="text-xs text-green-300">Toplam Giriş</span>
          </div>
          <div className="text-lg font-bold text-white">
            {stats.totalEntries}
          </div>
        </div>

        <div className="rounded-lg border border-red-500/20 bg-gradient-to-r from-red-500/10 to-red-600/10 p-3">
          <div className="mb-1 flex items-center gap-2">
            <ArrowDownRight className="h-4 w-4 text-red-400" />
            <span className="text-xs text-red-300">Toplam Çıkış</span>
          </div>
          <div className="text-lg font-bold text-white">{stats.totalExits}</div>
        </div>

        <div className="rounded-lg border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-blue-600/10 p-3">
          <div className="mb-1 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-400" />
            <span className="text-xs text-blue-300">Pik Doluluk</span>
          </div>
          <div className="text-lg font-bold text-white">
            {stats.peakOccupancy}
          </div>
        </div>

        <div className="rounded-lg border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-purple-600/10 p-3">
          <div className="mb-1 flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-400" />
            <span className="text-xs text-purple-300">Ort. Doluluk</span>
          </div>
          <div className="text-lg font-bold text-white">
            {stats.avgOccupancy}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {activeView === 'traffic' ? (
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
              <Line
                type="monotone"
                dataKey="entries"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                name="Giriş"
              />
              <Line
                type="monotone"
                dataKey="exits"
                stroke="#EF4444"
                strokeWidth={2}
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#EF4444', strokeWidth: 2 }}
                name="Çıkış"
              />
            </LineChart>
          ) : (
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="occupancy"
                stroke="#3B82F6"
                fill="url(#colorOccupancy)"
                strokeWidth={2}
                name="Doluluk"
              />
              <defs>
                <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
