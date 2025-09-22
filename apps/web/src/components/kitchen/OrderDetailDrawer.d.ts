import React from 'react'
import type { OrderTicket, OrderStatus } from '../../features/orders/types'
interface OrderDetailDrawerProps {
  ticket: OrderTicket | null
  open: boolean
  onClose: () => void
  onStatusChange: (id: string, status: OrderStatus) => void
}
export declare const OrderDetailDrawer: React.FC<OrderDetailDrawerProps>
export {}
