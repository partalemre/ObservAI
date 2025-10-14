import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

export const ModernAreaChart = ({
  data = [],
  title = 'Traffic Timeline',
  height = 350,
  xAxisKey = 'time',
  yAxisKey = 'value',
  showLegend = true,
}) => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (!chartRef.current) return

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current)
    }

    // Extract data
    const xData = data.map((item) => item[xAxisKey] || item.time)
    const seriesData = data.map((item) => item[yAxisKey] || item.value)

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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#777',
        textStyle: {
          color: '#fff',
        },
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
      },
      legend: showLegend
        ? {
            data: ['Traffic'],
            textStyle: {
              color: '#fff',
            },
            top: 40,
          }
        : undefined,
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: showLegend ? 80 : 60,
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: xData,
          axisLine: {
            lineStyle: {
              color: '#8392a5',
            },
          },
          axisLabel: {
            color: '#fff',
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
      series: [
        {
          name: 'Traffic',
          type: 'line',
          stack: 'Total',
          smooth: true,
          lineStyle: {
            width: 3,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              {
                offset: 0,
                color: '#ee6666',
              },
              {
                offset: 1,
                color: '#91cc75',
              },
            ]),
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(238, 102, 102, 0.8)',
              },
              {
                offset: 1,
                color: 'rgba(145, 204, 117, 0.1)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: seriesData,
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
  }, [data, title, height, xAxisKey, yAxisKey, showLegend])

  useEffect(() => {
    return () => {
      chartInstance.current?.dispose()
    }
  }, [])

  return <div ref={chartRef} style={{ width: '100%', height: `${height}px` }} />
}
