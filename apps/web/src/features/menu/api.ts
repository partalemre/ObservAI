import { api } from '../../lib/api'
import type { MenuCategory, MenuItem, ModifierGroup } from './types'

export const getCategories = async (
  storeId: string
): Promise<MenuCategory[]> => {
  const response = await api.get('/menu/categories', { params: { storeId } })
  return response.data.categories ?? []
}

export const createCategory = async (params: {
  storeId: string
  name: string
}) => {
  const response = await api.post('/menu/categories', params)
  return response.data
}

export const patchCategory = async (
  id: string,
  params: Partial<MenuCategory>
) => {
  const response = await api.patch(`/menu/categories/${id}`, params)
  return response.data
}

export const deleteCategory = async (id: string) => {
  const response = await api.delete(`/menu/categories/${id}`)
  return response.data
}

export const reorderCategories = async (params: {
  storeId: string
  order: string[]
}) => {
  const response = await api.put('/menu/categories/reorder', params)
  return response.data
}

export const getItems = async (storeId: string): Promise<MenuItem[]> => {
  const response = await api.get('/menu/items', { params: { storeId } })
  return response.data.items ?? []
}

export const createItem = async (
  params: Omit<MenuItem, 'id'> & { storeId: string }
) => {
  const response = await api.post('/menu/items', params)
  return response.data
}

export const patchItem = async (id: string, params: Partial<MenuItem>) => {
  const response = await api.patch(`/menu/items/${id}`, params)
  return response.data
}

export const deleteItem = async (id: string) => {
  const response = await api.delete(`/menu/items/${id}`)
  return response.data
}

export const getGroups = async (storeId: string): Promise<ModifierGroup[]> => {
  const response = await api.get('/menu/modifier-groups', {
    params: { storeId },
  })
  return response.data.groups ?? []
}

export const createGroup = async (params: {
  storeId: string
  name: string
  min: number
  max: number
  options: { name: string; priceDelta: number }[]
}) => {
  const response = await api.post('/menu/modifier-groups', params)
  return response.data
}

export const patchGroup = async (
  id: string,
  params: Partial<ModifierGroup>
) => {
  const response = await api.patch(`/menu/modifier-groups/${id}`, params)
  return response.data
}

export const deleteGroup = async (id: string) => {
  const response = await api.delete(`/menu/modifier-groups/${id}`)
  return response.data
}

export const uploadImage = async (base64: string): Promise<{ url: string }> => {
  const response = await api.post('/uploads', { file: base64 })
  return response.data
}
