import api from '../../lib/api'
import type { InventoryItem, ReceivePayload, AdjustPayload } from './types'

export const fetchItems = async (storeId: string): Promise<InventoryItem[]> => {
  const { data } = await api.get('/inventory/items', { params: { storeId } })
  return data.items ?? []
}

export const postReceive = async (payload: ReceivePayload) => {
  const { data } = await api.post('/inventory/receive', payload)
  return data
}

export const postAdjust = async (payload: AdjustPayload) => {
  const { data } = await api.post('/inventory/adjust', payload)
  return data
}
