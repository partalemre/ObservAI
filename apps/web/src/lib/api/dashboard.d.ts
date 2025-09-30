export interface DashboardMetrics {
  revenue: number
  visitors: number
  avgTicket: number
  occupancy: number
  revenueChart: number[]
  visitorsChart: number[]
  salesData: {
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
  heatmapData: Array<{
    x: number
    y: number
    intensity: number
    area: string
  }>
}
export declare const fetchDashboardMetrics: () => Promise<DashboardMetrics>
export declare const fetchTopProducts: () => Promise<
  {
    quantity: number
    revenue: number
    id: number
    name: string
  }[]
>
export declare const fetchStaffPerformance: () => Promise<
  {
    orders: number
    revenue: number
    rating: number
    id: number
    name: string
  }[]
>
export declare const fetchAlerts: () => Promise<
  {
    id: number
    type: string
    message: string
    time: string
  }[]
>
