/**
 * ECharts Dark Theme Configuration for ObservAI
 * Kibsi-inspired glass aesthetics
 */
import type { EChartsOption } from 'echarts'
export declare const echartsTheme: EChartsOption
/**
 * Get gauge chart option
 */
export declare function getGaugeOption(
  value: number,
  max?: number,
  title?: string
): EChartsOption
/**
 * Get sparkline option (mini line chart)
 */
export declare function getSparklineOption(
  data: number[],
  color?: string
): EChartsOption
/**
 * Get donut chart option
 */
export declare function getDonutOption(
  data: Array<{
    name: string
    value: number
    color?: string
  }>
): EChartsOption
/**
 * Get grouped bar chart option
 */
export declare function getGroupedBarOption(
  categories: string[],
  series: Array<{
    name: string
    data: number[]
    color?: string
  }>
): EChartsOption
/**
 * Get histogram option
 */
export declare function getHistogramOption(
  bins: Array<{
    label: string
    value: number
  }>,
  percentiles?: {
    p50?: number
    p90?: number
  }
): EChartsOption
/**
 * Get dual-axis timeline option
 */
export declare function getTimelineOption(
  timestamps: string[],
  series: Array<{
    name: string
    data: number[]
    yAxisIndex?: number
    color?: string
  }>
): EChartsOption
