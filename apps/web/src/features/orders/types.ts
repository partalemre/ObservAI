// Order status lifecycle
export type OrderStatus = 'NEW' | 'IN_PROGRESS' | 'READY' | 'SERVED'

// A line in an order
export interface OrderLine {
  itemId: string
  name: string
  qty: number
  modifiers?: { name: string; value: string }[]
  station?: 'BAR' | 'HOT' | 'COLD'
}

// Ticket
export interface OrderTicket {
  id: string
  number: string // human visible (e.g. #1043)
  createdAt: string // ISO
  status: OrderStatus
  channel: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY'
  tableNo?: string
  priority?: boolean
  note?: string
  lines: OrderLine[]
}
