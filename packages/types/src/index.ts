export type OrderStatus =
  | 'open'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled'

export interface OrderLineItem {
  productId: string
  qty: number
  price: number
  note?: string
}

export interface OrderDTO {
  id: string
  status: OrderStatus
  items: OrderLineItem[]
  total: number
  createdAt: string
  closedAt?: string
}

export interface MenuItemDTO {
  id: string
  name_tr: string
  name_en: string
  price: number
  category: string
  inStock: boolean
  tags?: string[]
  imageUrl?: string
}

export type AlertType =
  | 'long_queue'
  | 'crowd_surge'
  | 'low_inventory'
  | 'long_table_occupancy'

export type AlertSeverity = 'low' | 'medium' | 'high'

export interface Alert {
  type: AlertType
  severity: AlertSeverity
  message: string
  timestamp: string
  metadata: Record<string, unknown>
}

export interface CameraMetricsDTO {
  ts: string
  peopleIn: number
  peopleOut: number
  current: number
  ageBuckets: Record<string, number>
  gender: {
    male: number
    female: number
    unknown: number
  }
  queue?: {
    current: number
    averageWaitSeconds: number
    longestWaitSeconds: number
  }
  tables?: Array<{
    id: string
    name?: string
    currentOccupants: number
    avgStaySeconds: number
    longestStaySeconds: number
  }>
  heatmap?: number[][]
  alerts?: Alert[]
  deviceId?: string
  location?: string
}

export type ApiSuccessResponse<T> = {
  success: true
  data: T
}

export type ApiErrorResponse = {
  success: false
  error: string
  code?: string
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse
