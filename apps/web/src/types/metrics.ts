import { ReactNode } from 'react'

export interface MetricCardProps {
  title: string
  value: number
  change?: number
  data?: number[]
  type?: 'currency' | 'number' | 'percentage'
  icon?: ReactNode
  className?: string
}

export interface MetricData {
  id: string
  title: string
  value: number
  change?: number
  trend?: number[]
  type?: 'currency' | 'number' | 'percentage'
  period?: string
  target?: number
}

export interface DashboardMetrics {
  revenue: MetricData
  orders: MetricData
  customers: MetricData
  conversionRate: MetricData
  averageOrderValue: MetricData
  growth: MetricData
}

export type MetricType = 'currency' | 'number' | 'percentage'

export interface ChartDataPoint {
  value: number
  timestamp?: string | Date
  label?: string
}

export interface TrendData {
  current: number
  previous: number
  change: number
  changePercentage: number
  trend: 'up' | 'down' | 'stable'
}
