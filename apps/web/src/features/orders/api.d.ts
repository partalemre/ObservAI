import type { OrderTicket, OrderStatus } from './types'
export declare const fetchFeed: (storeId: string) => Promise<OrderTicket[]>
export declare const updateStatus: (
  id: string,
  status: OrderStatus
) => Promise<any>
