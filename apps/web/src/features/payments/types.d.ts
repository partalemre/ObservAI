export type DrawerStatus = 'OPEN' | 'CLOSED'
export interface CashDrawerState {
  status: DrawerStatus
  openedAt?: string
  openedBy?: string
  floatAmount?: number
  balance: number
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
  amount: number
  reason?: string
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
