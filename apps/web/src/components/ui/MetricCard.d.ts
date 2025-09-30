import React, { ReactNode } from 'react'
interface MetricCardProps {
  title: string
  value: number
  change?: number
  data?: number[]
  type?: 'currency' | 'number' | 'percentage'
  icon?: ReactNode
}
declare const MetricCard: React.FC<MetricCardProps>
export default MetricCard
