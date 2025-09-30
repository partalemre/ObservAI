import React from 'react'
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
export declare const HeatMapVisualization: React.FC<HeatMapVisualizationProps>
export {}
