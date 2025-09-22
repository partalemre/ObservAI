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
