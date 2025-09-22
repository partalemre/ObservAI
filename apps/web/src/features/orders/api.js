import api from '../../lib/api'
export const fetchFeed = async (storeId) => {
  const { data } = await api.get('/orders/feed', {
    params: { storeId, status: 'open' },
  })
  return data.tickets ?? []
}
export const updateStatus = async (id, status) => {
  const { data } = await api.patch(`/orders/${id}/status`, { status })
  return data
}
