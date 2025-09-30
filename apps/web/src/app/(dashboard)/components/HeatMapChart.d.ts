import React from 'react'
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
export declare const HeatMapChart: React.FC<HeatMapChartProps>
export {}
