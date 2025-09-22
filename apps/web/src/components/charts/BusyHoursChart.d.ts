import React from 'react'
interface BusyHoursData {
  hour: number
  visitors: number
}
interface BusyHoursChartProps {
  data?: BusyHoursData[]
  loading?: boolean
}
export declare const BusyHoursChart: React.FC<BusyHoursChartProps>
export {}
