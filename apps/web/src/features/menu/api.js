import api from '../../lib/api'
export const getCategories = async (storeId) => {
  const response = await api.get('/menu/categories', { params: { storeId } })
  return response.data.categories ?? []
}
export const createCategory = async (params) => {
  const response = await api.post('/menu/categories', params)
  return response.data
}
export const patchCategory = async (id, params) => {
  const response = await api.patch(`/menu/categories/${id}`, params)
  return response.data
}
export const deleteCategory = async (id) => {
  const response = await api.delete(`/menu/categories/${id}`)
  return response.data
}
export const reorderCategories = async (params) => {
  const response = await api.put('/menu/categories/reorder', params)
  return response.data
}
export const getItems = async (storeId) => {
  const response = await api.get('/menu/items', { params: { storeId } })
  return response.data.items ?? []
}
export const createItem = async (params) => {
  const response = await api.post('/menu/items', params)
  return response.data
}
export const patchItem = async (id, params) => {
  const response = await api.patch(`/menu/items/${id}`, params)
  return response.data
}
export const deleteItem = async (id) => {
  const response = await api.delete(`/menu/items/${id}`)
  return response.data
}
export const getGroups = async (storeId) => {
  const response = await api.get('/menu/modifier-groups', {
    params: { storeId },
  })
  return response.data.groups ?? []
}
export const createGroup = async (params) => {
  const response = await api.post('/menu/modifier-groups', params)
  return response.data
}
export const patchGroup = async (id, params) => {
  const response = await api.patch(`/menu/modifier-groups/${id}`, params)
  return response.data
}
export const deleteGroup = async (id) => {
  const response = await api.delete(`/menu/modifier-groups/${id}`)
  return response.data
}
export const uploadImage = async (base64) => {
  const response = await api.post('/uploads', { file: base64 })
  return response.data
}
