export type DrawerStatus = 'OPEN' | 'CLOSED'

export interface CashDrawerState {
  status: DrawerStatus
  openedAt?: string
  openedBy?: string
  floatAmount?: number // açılış zarfı
  balance: number // sistemce izlenen anlık nakit
}

export type CashMovementType =
  | 'SALE'
  | 'CASH_IN'
  | 'CASH_OUT'
  | 'ADJUSTMENT'
  | 'CARD'

export interface CashMovement {
  id: string
  ts: string
  type: CashMovementType
  amount: number // SALE ve CASH_IN => +
  reason?: string // CASH_OUT/ADJUSTMENT notu
  by?: string
  orderId?: string
}

export interface OpenDrawerPayload {
  storeId: string
  floatAmount: number
}

export interface CashInOutPayload {
  storeId: string
  amount: number
  reason: string
}

export interface CloseDrawerPayload {
  storeId: string
  countedBy: string
  countedTotal: number
}
