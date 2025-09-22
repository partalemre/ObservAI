import api from '../../lib/api'
export const catalogApi = {
  getCategories: async (storeId) => {
    const response = await api.get(`/catalog/categories?storeId=${storeId}`)
    return response.data
  },
  getItems: async (storeId) => {
    const response = await api.get(`/catalog/items?storeId=${storeId}`)
    return response.data
  },
  getModifierGroups: async (storeId) => {
    const response = await api.get(`/catalog/modifiers?storeId=${storeId}`)
    return response.data
  },
}
export const ordersApi = {
  createOrder: async (order) => {
    const response = await api.post('/orders', order)
    return response.data
  },
}
