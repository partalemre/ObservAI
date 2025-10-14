import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

export const ModernDonutChart = ({
  data,
  title = 'Distribution',
  height = 300,
}) => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Initialize chart
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current)
    }

    // Prepare data
    const chartData = Object.entries(data || {}).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }))

    // Modern color palette
    const colors = [
      '#5470c6',
      '#91cc75',
      '#fac858',
      '#ee6666',
      '#73c0de',
      '#3ba272',
      '#fc8452',
      '#9a60b4',
    ]

    const option = {
      title: {
        text: title,
        left: 'center',
        top: 10,
        textStyle: {
          color: '#fff',
          fontSize: 16,
          fontWeight: 600,
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#777',
        textStyle: {
          color: '#fff',
        },
      },
      legend: {
        orient: 'horizontal',
        bottom: 10,
        textStyle: {
          color: '#fff',
        },
        itemGap: 15,
      },
      color: colors,
      series: [
        {
          name: title,
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 8,
            borderColor: 'rgba(0, 0, 0, 0.5)',
            borderWidth: 2,
          },
          label: {
            show: true,
            position: 'outside',
            formatter: '{b}\n{d}%',
            color: '#fff',
            fontSize: 12,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          labelLine: {
            show: true,
            lineStyle: {
              color: '#fff',
            },
          },
          data: chartData,
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return idx * 100
          },
        },
      ],
    }

    chartInstance.current.setOption(option, true)

    // Handle resize
    const handleResize = () => {
      chartInstance.current?.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [data, title])

  // Cleanup
  useEffect(() => {
    return () => {
      chartInstance.current?.dispose()
    }
  }, [])

  return <div ref={chartRef} style={{ width: '100%', height: `${height}px` }} />
}
