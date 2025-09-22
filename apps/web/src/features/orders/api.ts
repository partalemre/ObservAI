import api from '../../lib/api'
import type { OrderTicket, OrderStatus } from './types'

export const fetchFeed = async (storeId: string): Promise<OrderTicket[]> => {
  const { data } = await api.get('/orders/feed', {
    params: { storeId, status: 'open' },
  })
  return data.tickets ?? []
}

export const updateStatus = async (id: string, status: OrderStatus) => {
  const { data } = await api.patch(`/orders/${id}/status`, { status })
  return data
}
