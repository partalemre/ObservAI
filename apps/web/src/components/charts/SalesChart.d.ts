import React from 'react'
interface SalesData {
  ts: string
  revenue: number
  orders: number
}
interface SalesChartProps {
  data: SalesData[]
  loading?: boolean
}
export declare const SalesChart: React.FC<SalesChartProps>
export {}
