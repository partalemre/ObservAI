import api from '../../lib/api'
export const getDrawer = (storeId) => api.get(`/cash-drawer?storeId=${storeId}`)
export const getMovements = (storeId) =>
  api.get(`/cash-drawer/movements?storeId=${storeId}`)
export const openDrawer = (payload) => api.post('/cash-drawer/open', payload)
export const cashIn = (payload) => api.post('/cash-drawer/in', payload)
export const cashOut = (payload) => api.post('/cash-drawer/out', payload)
export const closeDrawer = (payload) => api.post('/cash-drawer/close', payload)
