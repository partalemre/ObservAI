import React from 'react'
interface SalesData {
  hourly: Array<{
    time: string
    sales: number
    orders: number
  }>
  daily: Array<{
    date: string
    revenue: number
    orders: number
  }>
}
interface SalesChartProps {
  data?: SalesData
  loading?: boolean
}
export declare const SalesChart: React.FC<SalesChartProps>
export {}
