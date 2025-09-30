import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import ReactECharts from 'echarts-for-react'
import { Skeleton } from '../../../../components/ui'
import { MapPin, Thermometer } from 'lucide-react'

interface HeatMapData {
  x: number
  y: number
  intensity: number
  zone: string
}

interface HeatMapVisualizationProps {
  data?: HeatMapData[]
  floorPlan?: string
  loading?: boolean
}

export const HeatMapVisualization: React.FC<HeatMapVisualizationProps> = ({
  data,
  floorPlan,
  loading = false,
}) => {
  const chartOption = useMemo(() => {
    if (!data || data.length === 0) return null

    const maxIntensity = Math.max(...data.map((item) => item.intensity))
    const heatmapData = data.map((item) => [item.x, item.y, item.intensity])

    return {
      title: {
        text: '',
        textStyle: {
          color: '#ffffff',
        },
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(26, 24, 37, 0.95)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        textStyle: {
          color: '#ffffff',
          fontSize: 12,
        },
        formatter: (params: any) => {
          const dataIndex = params.dataIndex
          const item = data[dataIndex]
          const percentage = ((item.intensity / maxIntensity) * 100).toFixed(1)
          return `
            <div style="padding: 8px;">
              <div style="font-weight: 600; margin-bottom: 4px; color: #3b82f6;">
                📍 ${item.zone}
              </div>
              <div style="color: #ffffff; margin-bottom: 2px;">
                Yoğunluk: ${item.intensity.toFixed(1)}
              </div>
              <div style="color: #f59e0b;">
                Oran: %${percentage}
              </div>
            </div>
          `
        },
      },
      grid: {
        left: '5%',
        right: '5%',
        top: '10%',
        bottom: '20%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        min: 0,
        max: 300,
        show: false,
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 300,
        show: false,
      },
      visualMap: {
        type: 'continuous',
        min: 0,
        max: maxIntensity,
        calculable: true,
        realtime: false,
        orient: 'horizontal',
        left: 'center',
        bottom: '5%',
        itemWidth: 20,
        itemHeight: 140,
        textStyle: {
          color: '#ffffff',
          fontSize: 11,
        },
        inRange: {
          color: [
            'rgba(59, 130, 246, 0.1)',
            'rgba(59, 130, 246, 0.3)',
            'rgba(59, 130, 246, 0.5)',
            'rgba(59, 130, 246, 0.7)',
            'rgba(59, 130, 246, 0.9)',
            'rgba(245, 158, 11, 0.7)',
            'rgba(239, 68, 68, 0.8)',
          ],
        },
        text: ['Yüksek', 'Düşük'],
      },
      series: [
        {
          name: 'Yoğunluk',
          type: 'heatmap',
          data: heatmapData,
          label: {
            show: true,
            position: 'inside',
            formatter: (params: any) => {
              const item = data[params.dataIndex]
              return `{icon|📍}\n{name|${item.zone}}\n{value|${item.intensity.toFixed(0)}}`
            },
            rich: {
              icon: {
                fontSize: 16,
                lineHeight: 20,
              },
              name: {
                color: '#ffffff',
                fontSize: 10,
                fontWeight: 'bold',
                lineHeight: 16,
              },
              value: {
                color: '#3b82f6',
                fontSize: 9,
                fontWeight: 'bold',
                lineHeight: 14,
              },
            },
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 20,
              shadowColor: 'rgba(59, 130, 246, 0.8)',
            },
            label: {
              fontSize: 12,
            },
          },
          progressive: 1000,
          animation: true,
          animationDuration: 2000,
          animationEasing: 'cubicInOut',
        },
      ],
      backgroundColor: 'transparent',
    }
  }, [data])

  const getIntensityLevel = (intensity: number) => {
    if (intensity > 80)
      return { level: 'Çok Yoğun', color: 'text-red-400', bg: 'bg-red-500/20' }
    if (intensity > 60)
      return {
        level: 'Yoğun',
        color: 'text-orange-400',
        bg: 'bg-orange-500/20',
      }
    if (intensity > 40)
      return { level: 'Orta', color: 'text-yellow-400', bg: 'bg-yellow-500/20' }
    if (intensity > 20)
      return { level: 'Düşük', color: 'text-blue-400', bg: 'bg-blue-500/20' }
    return {
      level: 'Çok Düşük',
      color: 'text-green-400',
      bg: 'bg-green-500/20',
    }
  }

  if (loading) {
    return (
      <div className="glass-card rounded-xl p-6">
        <div className="mb-6 flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div>
            <Skeleton className="mb-2 h-6 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    )
  }

  return (
    <motion.div
      className="glass-card rounded-xl p-6 transition-all duration-300 hover:border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20">
            <Thermometer className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Yoğunluk Haritası
            </h3>
            <p className="text-sm text-white/60">Anlık müşteri dağılımı</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">
          <MapPin className="h-3 w-3" />
          <span>{data?.length || 0} Zone</span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        {chartOption ? (
          <ReactECharts
            option={chartOption}
            style={{ height: '400px', width: '100%' }}
            opts={{ renderer: 'canvas' }}
            notMerge={true}
            lazyUpdate={true}
          />
        ) : (
          <div className="flex h-80 items-center justify-center rounded-lg bg-white/5">
            <div className="text-center">
              <MapPin className="mx-auto mb-4 h-12 w-12 text-white/30" />
              <p className="text-white/60">Yoğunluk verisi bekleniyor...</p>
            </div>
          </div>
        )}

        {/* Overlay Floor Plan */}
        {floorPlan && (
          <div className="pointer-events-none absolute inset-0 opacity-20">
            {/* In a real implementation, this would load the SVG floor plan */}
            <div className="h-full w-full rounded-lg border border-white/10 bg-gradient-to-br from-white/5 to-transparent" />
          </div>
        )}
      </div>

      {/* Zone Statistics */}
      {data && data.length > 0 && (
        <div className="mt-6 border-t border-white/10 pt-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {data
              .sort((a, b) => b.intensity - a.intensity)
              .slice(0, 6)
              .map((zone, index) => {
                const { level, color, bg } = getIntensityLevel(zone.intensity)
                return (
                  <motion.div
                    key={`${zone.zone}-${index}`}
                    className={`rounded-lg p-3 ${bg} border border-white/10`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="truncate text-xs font-medium text-white/90">
                        {zone.zone}
                      </span>
                      <span className={`text-xs ${color} font-bold`}>
                        {zone.intensity.toFixed(0)}
                      </span>
                    </div>
                    <div className={`text-xs ${color} opacity-80`}>{level}</div>
                  </motion.div>
                )
              })}
          </div>
        </div>
      )}
    </motion.div>
  )
}
