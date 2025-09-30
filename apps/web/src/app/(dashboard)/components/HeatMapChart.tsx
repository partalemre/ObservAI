import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import ReactECharts from 'echarts-for-react'
import { Skeleton } from '../../../components/ui'

interface HeatMapData {
  x: number
  y: number
  intensity: number
  area: string
}

interface HeatMapChartProps {
  data?: HeatMapData[]
  loading?: boolean
}

export const HeatMapChart: React.FC<HeatMapChartProps> = ({
  data,
  loading,
}) => {
  const chartOption = useMemo(() => {
    if (!data) return null

    // Convert data to ECharts format
    const heatmapData = data.map((item) => [item.x, item.y, item.intensity])
    const maxIntensity = Math.max(...data.map((item) => item.intensity))

    return {
      title: {
        text: '',
        left: 'center',
        textStyle: {
          color: '#ffffff',
          fontSize: 16,
        },
      },
      tooltip: {
        position: 'top',
        backgroundColor: 'rgba(26, 24, 37, 0.95)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        textStyle: {
          color: '#ffffff',
        },
        formatter: (params: any) => {
          const dataIndex = params.dataIndex
          const item = data[dataIndex]
          return `
            <div style="padding: 8px;">
              <div style="font-weight: 600; margin-bottom: 4px;">${item.area}</div>
              <div style="color: #3b82f6;">Yoğunluk: ${item.intensity.toFixed(1)}%</div>
            </div>
          `
        },
      },
      grid: {
        height: '70%',
        top: '10%',
        left: '10%',
        right: '10%',
        bottom: '15%',
      },
      xAxis: {
        type: 'value',
        show: false,
        min: 0,
        max: 300,
      },
      yAxis: {
        type: 'value',
        show: false,
        min: 0,
        max: 250,
      },
      visualMap: {
        min: 0,
        max: maxIntensity,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '5%',
        textStyle: {
          color: '#ffffff',
        },
        inRange: {
          color: [
            'rgba(59, 130, 246, 0.1)',
            'rgba(59, 130, 246, 0.3)',
            'rgba(59, 130, 246, 0.6)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(59, 130, 246, 1)',
          ],
        },
      },
      series: [
        {
          name: 'Müşteri Yoğunluğu',
          type: 'heatmap',
          data: heatmapData,
          label: {
            show: true,
            formatter: (params: any) => {
              const item = data[params.dataIndex]
              return item.area
            },
            color: '#ffffff',
            fontSize: 10,
            fontWeight: 'bold',
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(59, 130, 246, 0.8)',
            },
          },
          animation: true,
          animationDuration: 2000,
          animationEasing: 'cubicOut',
        },
        // Add scatter points for better visibility
        {
          name: 'Alanlar',
          type: 'scatter',
          data: data.map((item) => [item.x, item.y, item.intensity]),
          symbolSize: (value: number[]) =>
            Math.max(15, (value[2] / maxIntensity) * 30),
          itemStyle: {
            color: 'transparent',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            borderWidth: 1,
          },
          emphasis: {
            scale: 1.2,
            itemStyle: {
              borderColor: '#3b82f6',
              borderWidth: 2,
            },
          },
        },
      ],
    }
  }, [data])

  if (loading) {
    return (
      <div className="glass-card rounded-xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <motion.div
      className="glass-card rounded-xl p-6 transition-all duration-300 hover:border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Müşteri Yoğunluk Haritası
        </h3>
        <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/60">
          Anlık
        </span>
      </div>

      {chartOption ? (
        <ReactECharts
          option={chartOption}
          style={{ height: '300px', width: '100%' }}
          opts={{ renderer: 'svg' }}
          notMerge={true}
          lazyUpdate={true}
        />
      ) : (
        <div className="flex h-64 items-center justify-center text-white/60">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
              <span className="text-2xl">📍</span>
            </div>
            <p>Yoğunluk verisi yükleniyor...</p>
          </div>
        </div>
      )}
    </motion.div>
  )
}
