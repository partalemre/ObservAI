/**
 * ECharts Dark Theme Configuration for ObservAI
 * Kibsi-inspired glass aesthetics
 */
import { theme } from '../../config/theme'
export const echartsTheme = {
  backgroundColor: 'transparent',
  textStyle: {
    fontFamily: theme.typography.fontFamily.sans,
    color: theme.colors.text.primary,
    fontSize: 12,
  },
  color: [
    theme.colors.accent.purple,
    theme.colors.accent.blue,
    theme.colors.accent.lime,
    theme.colors.accent.orange,
    theme.colors.accent.red,
  ],
  grid: {
    left: '3%',
    right: '4%',
    bottom: '8%',
    top: '12%',
    containLabel: true,
    borderColor: theme.colors.border.default,
  },
  tooltip: {
    backgroundColor: theme.colors.surface.glass,
    borderColor: theme.colors.border.light,
    borderWidth: 1,
    textStyle: {
      color: theme.colors.text.primary,
      fontSize: 12,
    },
    extraCssText: `
      backdrop-filter: ${theme.blur.md};
      border-radius: ${theme.layout.borderRadius.md};
      padding: 12px;
    `,
  },
  legend: {
    textStyle: {
      color: theme.colors.text.secondary,
      fontSize: 11,
    },
    itemGap: 16,
  },
  xAxis: {
    axisLine: {
      lineStyle: {
        color: theme.colors.border.default,
      },
    },
    axisTick: {
      lineStyle: {
        color: theme.colors.border.default,
      },
    },
    axisLabel: {
      color: theme.colors.text.secondary,
      fontSize: 11,
    },
    splitLine: {
      lineStyle: {
        color: theme.colors.border.default,
        opacity: 0.15,
      },
    },
  },
  yAxis: {
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: theme.colors.text.secondary,
      fontSize: 11,
    },
    splitLine: {
      lineStyle: {
        color: theme.colors.border.default,
        opacity: 0.15,
      },
    },
  },
  series: [],
}
/**
 * Get gauge chart option
 */
export function getGaugeOption(value, max = 100, title = '') {
  const percent = (value / max) * 100
  let color = theme.colors.status.safe
  if (percent > 80) color = theme.colors.status.critical
  else if (percent > 50) color = theme.colors.status.moderate
  return {
    ...echartsTheme,
    series: [
      {
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max,
        splitNumber: 5,
        progress: {
          show: true,
          width: 18,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: theme.colors.accent.purple },
                { offset: 1, color: color },
              ],
            },
          },
        },
        axisLine: {
          lineStyle: {
            width: 18,
            color: [[1, theme.colors.border.default]],
          },
        },
        axisTick: { show: false },
        splitLine: {
          length: 12,
          lineStyle: {
            width: 2,
            color: theme.colors.border.light,
          },
        },
        axisLabel: {
          distance: 25,
          color: theme.colors.text.secondary,
          fontSize: 10,
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}',
          color: theme.colors.text.primary,
          fontSize: 28,
          fontWeight: 'bold',
          offsetCenter: [0, '70%'],
        },
        title: {
          show: true,
          offsetCenter: [0, '100%'],
          fontSize: 12,
          color: theme.colors.text.secondary,
        },
        data: [{ value, name: title }],
      },
    ],
  }
}
/**
 * Get sparkline option (mini line chart)
 */
export function getSparklineOption(data, color = theme.colors.accent.blue) {
  return {
    ...echartsTheme,
    grid: {
      left: 0,
      right: 0,
      top: 2,
      bottom: 2,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      show: false,
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    series: [
      {
        type: 'line',
        data,
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color,
          width: 2,
          shadowColor: color,
          shadowBlur: 8,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: color + '40' },
              { offset: 1, color: color + '00' },
            ],
          },
        },
        animationDuration: 400,
        animationEasing: 'cubicOut',
      },
    ],
  }
}
/**
 * Get donut chart option
 */
export function getDonutOption(data) {
  return {
    ...echartsTheme,
    legend: {
      ...echartsTheme.legend,
      orient: 'vertical',
      right: '5%',
      top: 'center',
    },
    series: [
      {
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 8,
          borderColor: theme.colors.surface.darkest,
          borderWidth: 2,
          shadowBlur: 16,
          shadowColor: 'rgba(124, 77, 255, 0.25)',
        },
        label: {
          show: false,
        },
        emphasis: {
          scale: true,
          scaleSize: 5,
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            color: theme.colors.text.primary,
          },
        },
        labelLine: {
          show: false,
        },
        data: data.map((item) => ({
          ...item,
          itemStyle: item.color ? { color: item.color } : undefined,
        })),
        animationDuration: 500,
        animationEasing: 'cubicOut',
      },
    ],
  }
}
/**
 * Get grouped bar chart option
 */
export function getGroupedBarOption(categories, series) {
  return {
    ...echartsTheme,
    grid: {
      ...echartsTheme.grid,
      left: '5%',
      right: '5%',
    },
    xAxis: {
      ...echartsTheme.xAxis,
      type: 'category',
      data: categories,
    },
    yAxis: {
      ...echartsTheme.yAxis,
      type: 'value',
    },
    series: series.map((s) => ({
      name: s.name,
      type: 'bar',
      data: s.data,
      barMaxWidth: 40,
      itemStyle: {
        color: s.color || theme.colors.accent.purple,
        borderRadius: [4, 4, 0, 0],
        shadowBlur: 12,
        shadowColor: (s.color || theme.colors.accent.purple) + '40',
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 20,
        },
      },
      animationDuration: 500,
      animationEasing: 'cubicOut',
    })),
  }
}
/**
 * Get histogram option
 */
export function getHistogramOption(bins, percentiles) {
  const markLineData = []
  if (percentiles?.p50 !== undefined) {
    markLineData.push({
      xAxis: percentiles.p50,
      label: { formatter: 'P50', position: 'end' },
      lineStyle: { color: theme.colors.accent.lime, width: 2, type: 'dashed' },
    })
  }
  if (percentiles?.p90 !== undefined) {
    markLineData.push({
      xAxis: percentiles.p90,
      label: { formatter: 'P90', position: 'end' },
      lineStyle: {
        color: theme.colors.accent.orange,
        width: 2,
        type: 'dashed',
      },
    })
  }
  return {
    ...echartsTheme,
    xAxis: {
      ...echartsTheme.xAxis,
      type: 'category',
      data: bins.map((b) => b.label),
    },
    yAxis: {
      ...echartsTheme.yAxis,
      type: 'value',
    },
    series: [
      {
        type: 'bar',
        data: bins.map((b) => b.value),
        barMaxWidth: 50,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: theme.colors.accent.purple },
              { offset: 1, color: theme.colors.accent.blue },
            ],
          },
          borderRadius: [6, 6, 0, 0],
        },
        markLine:
          markLineData.length > 0
            ? { data: markLineData, silent: true }
            : undefined,
        animationDuration: 500,
        animationEasing: 'cubicOut',
      },
    ],
  }
}
/**
 * Get dual-axis timeline option
 */
export function getTimelineOption(timestamps, series) {
  return {
    ...echartsTheme,
    grid: {
      ...echartsTheme.grid,
      bottom: '12%',
    },
    xAxis: {
      ...echartsTheme.xAxis,
      type: 'category',
      data: timestamps,
      boundaryGap: false,
    },
    yAxis: [
      {
        ...echartsTheme.yAxis,
        type: 'value',
        name: series[0]?.name || '',
        nameTextStyle: {
          color: theme.colors.text.secondary,
          fontSize: 11,
        },
      },
      {
        ...echartsTheme.yAxis,
        type: 'value',
        name: series[1]?.name || '',
        nameTextStyle: {
          color: theme.colors.text.secondary,
          fontSize: 11,
        },
      },
    ],
    series: series.map((s, idx) => ({
      name: s.name,
      type: 'line',
      yAxisIndex: s.yAxisIndex ?? (idx > 0 ? 1 : 0),
      data: s.data,
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        color: s.color || theme.colors.accent.purple,
        width: 2,
        shadowBlur: 10,
        shadowColor: (s.color || theme.colors.accent.purple) + '50',
      },
      itemStyle: {
        color: s.color || theme.colors.accent.purple,
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: (s.color || theme.colors.accent.purple) + '30',
            },
            {
              offset: 1,
              color: (s.color || theme.colors.accent.purple) + '00',
            },
          ],
        },
      },
      animationDuration: 500,
      animationEasing: 'cubicOut',
    })),
  }
}
