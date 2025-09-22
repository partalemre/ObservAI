import api from '../../lib/api'
import {
  CashDrawerState,
  OpenDrawerPayload,
  CashInOutPayload,
  CloseDrawerPayload,
  CashMovement,
} from './types'

export const getDrawer = (storeId: string): Promise<CashDrawerState> =>
  api.get(`/cash-drawer?storeId=${storeId}`)

export const getMovements = (
  storeId: string
): Promise<{ items: CashMovement[] }> =>
  api.get(`/cash-drawer/movements?storeId=${storeId}`)

export const openDrawer = (payload: OpenDrawerPayload) =>
  api.post('/cash-drawer/open', payload)

export const cashIn = (payload: CashInOutPayload) =>
  api.post('/cash-drawer/in', payload)

export const cashOut = (payload: CashInOutPayload) =>
  api.post('/cash-drawer/out', payload)

export const closeDrawer = (payload: CloseDrawerPayload) =>
  api.post('/cash-drawer/close', payload)
