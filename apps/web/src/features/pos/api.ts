import api from '../../lib/api'
import type {
  Category,
  Item,
  ModifierGroup,
  NewOrder,
  OrderResponse,
} from './types'

export const catalogApi = {
  getCategories: async (storeId: string): Promise<Category[]> => {
    const response = await api.get(`/catalog/categories?storeId=${storeId}`)
    return response.data
  },

  getItems: async (storeId: string): Promise<Item[]> => {
    const response = await api.get(`/catalog/items?storeId=${storeId}`)
    return response.data
  },

  getModifierGroups: async (storeId: string): Promise<ModifierGroup[]> => {
    const response = await api.get(`/catalog/modifiers?storeId=${storeId}`)
    return response.data
  },
}

export const ordersApi = {
  createOrder: async (order: NewOrder): Promise<OrderResponse> => {
    const response = await api.post('/orders', order)
    return response.data
  },
}
