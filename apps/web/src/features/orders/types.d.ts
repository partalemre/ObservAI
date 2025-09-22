export type OrderStatus = 'NEW' | 'IN_PROGRESS' | 'READY' | 'SERVED'
export interface OrderLine {
  itemId: string
  name: string
  qty: number
  modifiers?: {
    name: string
    value: string
  }[]
  station?: 'BAR' | 'HOT' | 'COLD'
}
export interface OrderTicket {
  id: string
  number: string
  createdAt: string
  status: OrderStatus
  channel: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY'
  tableNo?: string
  priority?: boolean
  note?: string
  lines: OrderLine[]
}
