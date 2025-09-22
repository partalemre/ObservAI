import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from './api'
export const DRAWER_KEY = (storeId) => ['cashDrawer', storeId]
export const MOVES_KEY = (storeId) => ['cashMovements', storeId]
export const useDrawer = (storeId) =>
  useQuery({
    queryKey: DRAWER_KEY(storeId),
    queryFn: () => api.getDrawer(storeId),
    staleTime: 5_000,
  })
export const useMovements = (storeId) =>
  useQuery({
    queryKey: MOVES_KEY(storeId),
    queryFn: () => api.getMovements(storeId),
    staleTime: 5_000,
  })
const invalidate = (qc, storeId) => {
  qc.invalidateQueries({ queryKey: DRAWER_KEY(storeId) })
  qc.invalidateQueries({ queryKey: MOVES_KEY(storeId) })
}
export const useOpenDrawer = (storeId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (p) => api.openDrawer(p),
    onSuccess: () => invalidate(qc, storeId),
  })
}
export const useCashIn = (storeId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (p) => api.cashIn(p),
    onSuccess: () => invalidate(qc, storeId),
  })
}
export const useCashOut = (storeId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (p) => api.cashOut(p),
    onSuccess: () => invalidate(qc, storeId),
  })
}
export const useCloseDrawer = (storeId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (p) => api.closeDrawer(p),
    onSuccess: () => invalidate(qc, storeId),
  })
}
