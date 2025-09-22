import React from 'react'
import type { OrderTicket, OrderStatus } from '../../features/orders/types'
interface OrdersGridProps {
  tickets: OrderTicket[]
  onStatusChange: (id: string, status: OrderStatus) => void
  className?: string
}
export declare const OrdersGrid: React.FC<OrdersGridProps>
export {}
