import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

export const ModernGaugeChart = ({
  value,
  max = 100,
  title = 'Occupancy',
  unit = '%',
  height = 280,
}) => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (!chartRef.current) return

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current)
    }

    const percentage = (value / max) * 100

    // Color based on value
    const getColor = (percent) => {
      if (percent < 50) return '#91cc75' // Green
      if (percent < 75) return '#fac858' // Yellow
      if (percent < 90) return '#ee9a00' // Orange
      return '#ee6666' // Red
    }

    const color = getColor(percentage)

    const option = {
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          center: ['50%', '70%'],
          radius: '90%',
          min: 0,
          max: max,
          splitNumber: 8,
          axisLine: {
            lineStyle: {
              width: 8,
              color: [
                [0.5, '#91cc75'],
                [0.75, '#fac858'],
                [0.9, '#ee9a00'],
                [1, '#ee6666'],
              ],
            },
          },
          pointer: {
            icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
            length: '60%',
            width: 8,
            offsetCenter: [0, '-60%'],
            itemStyle: {
              color: 'auto',
            },
          },
          axisTick: {
            length: 8,
            lineStyle: {
              color: 'auto',
              width: 1,
            },
          },
          splitLine: {
            length: 12,
            lineStyle: {
              color: 'auto',
              width: 3,
            },
          },
          axisLabel: {
            color: '#fff',
            fontSize: 12,
            distance: -50,
            rotate: 'tangential',
            formatter: function (value) {
              if (value === max) {
                return max
              } else if (value === 0) {
                return '0'
              }
              return ''
            },
          },
          title: {
            offsetCenter: [0, '-15%'],
            fontSize: 16,
            color: '#fff',
            fontWeight: 600,
          },
          detail: {
            fontSize: 40,
            offsetCenter: [0, '0%'],
            valueAnimation: true,
            formatter: function (value) {
              return Math.round(value)
            },
            color: color,
            fontWeight: 'bold',
          },
          data: [
            {
              value: value,
              name: title,
            },
          ],
        },
      ],
    }

    chartInstance.current.setOption(option, true)

    const handleResize = () => {
      chartInstance.current?.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [value, max, title, unit])

  useEffect(() => {
    return () => {
      chartInstance.current?.dispose()
    }
  }, [])

  return <div ref={chartRef} style={{ width: '100%', height: `${height}px` }} />
}
