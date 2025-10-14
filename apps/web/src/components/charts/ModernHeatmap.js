import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

export const ModernHeatmap = ({
  data = [],
  title = 'Spatial Heatmap',
  height = 400,
  gridWidth = 6,
  gridHeight = 4,
}) => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (!chartRef.current) return

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current)
    }

    // Convert 2D array to heatmap data format: [x, y, value]
    const heatmapData = []
    const maxValue = Math.max(...data.flat())

    for (let y = 0; y < data.length; y++) {
      for (let x = 0; x < (data[y]?.length || 0); x++) {
        heatmapData.push([x, y, data[y][x] || 0])
      }
    }

    // Generate x and y axis labels
    const xLabels = Array.from({ length: gridWidth }, (_, i) => `Zone ${i + 1}`)
    const yLabels = Array.from(
      { length: gridHeight },
      (_, i) => `Row ${String.fromCharCode(65 + i)}`
    )

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
        position: 'top',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#777',
        textStyle: {
          color: '#fff',
        },
        formatter: function (params) {
          return `${xLabels[params.data[0]]} - ${yLabels[params.data[1]]}<br/>Activity: ${params.data[2]}`
        },
      },
      grid: {
        left: '10%',
        right: '10%',
        top: 80,
        bottom: 60,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xLabels,
        splitArea: {
          show: true,
        },
        axisLabel: {
          color: '#fff',
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#ffffff20',
          },
        },
      },
      yAxis: {
        type: 'category',
        data: yLabels,
        splitArea: {
          show: true,
        },
        axisLabel: {
          color: '#fff',
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#ffffff20',
          },
        },
      },
      visualMap: {
        min: 0,
        max: maxValue || 10,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: 10,
        textStyle: {
          color: '#fff',
        },
        inRange: {
          color: [
            '#313695',
            '#4575b4',
            '#74add1',
            '#abd9e9',
            '#e0f3f8',
            '#ffffbf',
            '#fee090',
            '#fdae61',
            '#f46d43',
            '#d73027',
            '#a50026',
          ],
        },
      },
      series: [
        {
          name: 'Activity',
          type: 'heatmap',
          data: heatmapData,
          label: {
            show: true,
            color: '#fff',
            fontSize: 14,
            fontWeight: 'bold',
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
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
  }, [data, title, height, gridWidth, gridHeight])

  useEffect(() => {
    return () => {
      chartInstance.current?.dispose()
    }
  }, [])

  return <div ref={chartRef} style={{ width: '100%', height: `${height}px` }} />
}
