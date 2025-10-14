import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

export const ModernStackedBarChart = ({
  data = [],
  title = 'Hourly Traffic',
  height = 350,
  series = ['In', 'Out', 'Current'],
}) => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (!chartRef.current) return

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current)
    }

    // Extract hours and values
    const hours = data.map((item) => item.hour || item.time)
    const seriesData = series.map((seriesName) => ({
      name: seriesName,
      type: 'bar',
      stack: 'total',
      emphasis: {
        focus: 'series',
      },
      data: data.map((item) => item[seriesName.toLowerCase()] || 0),
    }))

    // Color palette
    const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de']

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
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#777',
        textStyle: {
          color: '#fff',
        },
      },
      legend: {
        data: series,
        textStyle: {
          color: '#fff',
        },
        top: 40,
        itemGap: 20,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: 80,
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: hours,
          axisLine: {
            lineStyle: {
              color: '#8392a5',
            },
          },
          axisLabel: {
            color: '#fff',
            rotate: hours.length > 12 ? 45 : 0,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#8392a5',
            },
          },
          axisLabel: {
            color: '#fff',
          },
          splitLine: {
            lineStyle: {
              color: '#ffffff20',
            },
          },
        },
      ],
      color: colors,
      series: seriesData,
    }

    chartInstance.current.setOption(option, true)

    const handleResize = () => {
      chartInstance.current?.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [data, title, height, series])

  useEffect(() => {
    return () => {
      chartInstance.current?.dispose()
    }
  }, [])

  return <div ref={chartRef} style={{ width: '100%', height: `${height}px` }} />
}
