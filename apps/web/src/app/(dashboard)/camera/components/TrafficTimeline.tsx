import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import * as echarts from 'echarts'
import {
  Clock,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { Skeleton } from '../../../../components/ui'

interface TimelineData {
  time: string
  entries: number
  exits: number
  occupancy: number
  timestamp: number
}

interface TrafficTimelineProps {
  data?: TimelineData[]
  loading?: boolean
}

const buildFallbackData = (): TimelineData[] => {
  const now = new Date()
  return Array.from({ length: 24 }, (_, i) => {
    const time = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000)
    return {
      time: time.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      entries: Math.floor(Math.random() * 20) + 6,
      exits: Math.floor(Math.random() * 16) + 4,
      occupancy: Math.floor(Math.random() * 50) + 15,
      timestamp: time.getTime(),
    }
  })
}

export const TrafficTimeline: React.FC<TrafficTimelineProps> = ({
  data,
  loading = false,
}) => {
  const [activeView, setActiveView] = useState<'traffic' | 'occupancy'>(
    'traffic'
  )
  const chartRef = useRef<HTMLDivElement | null>(null)
  const chartInstance = useRef<echarts.EChartsType | null>(null)

  const chartData = useMemo<TimelineData[]>(() => {
    if (!data || data.length === 0) {
      return buildFallbackData()
    }
    return data
  }, [data])

  const stats = useMemo(() => {
    if (chartData.length === 0) {
      return {
        totalEntries: 0,
        totalExits: 0,
        peakOccupancy: 0,
        avgOccupancy: 0,
      }
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

  useEffect(() => {
    if (!chartRef.current) return

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current)
    }

    if (chartData.length === 0) {
      chartInstance.current?.clear()
      return
    }

    const categories = chartData.map((item) => item.time)

    const baseOption: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      grid: {
        left: '3%',
        right: '3%',
        top: '12%',
        bottom: '18%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: activeView === 'traffic',
        data: categories,
        axisLine: {
          lineStyle: { color: '#475569' },
        },
        axisLabel: {
          color: '#CBD5F5',
          fontSize: 11,
        },
        axisTick: { show: false },
        minInterval: 1,
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#94A3B8' },
        splitLine: {
          lineStyle: { color: 'rgba(148, 163, 184, 0.12)' },
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#6366F1',
          },
        },
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: 'rgba(99, 102, 241, 0.35)',
        borderWidth: 1,
        textStyle: {
          color: '#E2E8F0',
          fontSize: 12,
        },
      },
      dataZoom: [
        {
          type: 'inside',
          throttle: 30,
          minValueSpan: 6,
        },
        {
          type: 'slider',
          height: 18,
          bottom: 6,
          backgroundColor: 'rgba(30, 41, 59, 0.6)',
          borderColor: 'rgba(99, 102, 241, 0.35)',
          textStyle: { color: '#94A3B8' },
          handleStyle: {
            color: '#6366F1',
          },
        },
      ],
    }

    let option: echarts.EChartsOption

    if (activeView === 'traffic') {
      option = {
        ...baseOption,
        color: ['#22C55E', '#EF4444'],
        legend: {
          data: ['Giriş', 'Çıkış'],
          top: 10,
          right: 20,
          textStyle: { color: '#E2E8F0', fontSize: 12 },
          icon: 'circle',
        },
        series: [
          {
            name: 'Giriş',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: { width: 3 },
            areaStyle: {
              opacity: 0.18,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(34, 197, 94, 0.55)' },
                { offset: 1, color: 'rgba(34, 197, 94, 0.05)' },
              ]),
            },
            emphasis: {
              focus: 'series',
              lineStyle: { width: 4 },
            },
            data: chartData.map((item) => item.entries),
          },
          {
            name: 'Çıkış',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: { width: 3 },
            areaStyle: {
              opacity: 0.16,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(239, 68, 68, 0.55)' },
                { offset: 1, color: 'rgba(239, 68, 68, 0.05)' },
              ]),
            },
            emphasis: {
              focus: 'series',
              lineStyle: { width: 4 },
            },
            data: chartData.map((item) => item.exits),
          },
        ],
      }
    } else {
      option = {
        ...baseOption,
        color: ['#8B5CF6'],
        legend: { show: false },
        tooltip: {
          ...baseOption.tooltip,
          formatter: (params: any) => {
            const point = params[0]
            const item = chartData[point.dataIndex]
            return `
              <div style="padding:8px">
                <div style="font-weight:600;color:#C4B5FD;margin-bottom:4px;">
                  ${item.time}
                </div>
                <div style="color:#E2E8F0">Doluluk: ${item.occupancy} kişi</div>
              </div>
            `
          },
        },
        series: [
          {
            name: 'Doluluk',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: { width: 3 },
            areaStyle: {
              opacity: 0.2,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(139, 92, 246, 0.6)' },
                { offset: 1, color: 'rgba(139, 92, 246, 0.05)' },
              ]),
            },
            emphasis: {
              focus: 'series',
              lineStyle: { width: 4 },
            },
            data: chartData.map((item) => item.occupancy),
          },
        ],
      }
    }

    chartInstance.current.setOption(option, true)

    const handleResize = () => chartInstance.current?.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [activeView, chartData])

  useEffect(() => {
    return () => {
      chartInstance.current?.dispose()
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card rounded-xl p-6"
    >
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
        <div className="flex items-center rounded-lg bg-slate-900/60 p-1">
          <button
            onClick={() => setActiveView('traffic')}
            className={`rounded-md px-3 py-1.5 text-sm transition-all ${
              activeView === 'traffic'
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Giriş/Çıkış
          </button>
          <button
            onClick={() => setActiveView('occupancy')}
            className={`rounded-md px-3 py-1.5 text-sm transition-all ${
              activeView === 'occupancy'
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Doluluk
          </button>
        </div>
      </div>

      {loading ? (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
          <Skeleton className="h-72 w-full rounded-xl" />
        </>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-green-500/25 bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-3">
              <div className="mb-1 flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 text-emerald-300" />
                <span className="text-xs text-emerald-200">Toplam Giriş</span>
              </div>
              <div className="text-lg font-bold text-white">
                {stats.totalEntries}
              </div>
            </div>
            <div className="rounded-lg border border-red-500/25 bg-gradient-to-r from-red-500/10 to-rose-500/10 p-3">
              <div className="mb-1 flex items-center gap-2">
                <ArrowDownRight className="h-4 w-4 text-rose-300" />
                <span className="text-xs text-rose-200">Toplam Çıkış</span>
              </div>
              <div className="text-lg font-bold text-white">
                {stats.totalExits}
              </div>
            </div>
            <div className="rounded-lg border border-blue-500/25 bg-gradient-to-r from-blue-500/10 to-sky-500/10 p-3">
              <div className="mb-1 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-sky-300" />
                <span className="text-xs text-sky-200">Pik Doluluk</span>
              </div>
              <div className="text-lg font-bold text-white">
                {stats.peakOccupancy}
              </div>
            </div>
            <div className="rounded-lg border border-purple-500/25 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-3">
              <div className="mb-1 flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-300" />
                <span className="text-xs text-indigo-200">Ort. Doluluk</span>
              </div>
              <div className="text-lg font-bold text-white">
                {stats.avgOccupancy}
              </div>
            </div>
          </div>

          <div className="h-80">
            <div ref={chartRef} className="h-full w-full" />
          </div>
        </>
      )}
    </motion.div>
  )
}
