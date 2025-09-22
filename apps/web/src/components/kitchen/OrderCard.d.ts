import React from 'react'
import type { OrderTicket, OrderStatus } from '../../features/orders/types'
interface OrderCardProps {
  ticket: OrderTicket
  onStatusChange: (id: string, status: OrderStatus) => void
  density?: 'comfortable' | 'compact'
  className?: string
}
export declare const OrderCard: React.FC<OrderCardProps>
export {}
