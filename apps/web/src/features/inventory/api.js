import api from '../../lib/api'
export const fetchItems = async (storeId) => {
  const { data } = await api.get('/inventory/items', { params: { storeId } })
  return data.items ?? []
}
export const postReceive = async (payload) => {
  const { data } = await api.post('/inventory/receive', payload)
  return data
}
export const postAdjust = async (payload) => {
  const { data } = await api.post('/inventory/adjust', payload)
  return data
}
