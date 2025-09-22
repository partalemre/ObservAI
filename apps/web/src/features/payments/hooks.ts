import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from './api'
import type {
  OpenDrawerPayload,
  CashInOutPayload,
  CloseDrawerPayload,
} from './types'

export const DRAWER_KEY = (storeId: string) => ['cashDrawer', storeId]
export const MOVES_KEY = (storeId: string) => ['cashMovements', storeId]

export const useDrawer = (storeId: string) =>
  useQuery({
    queryKey: DRAWER_KEY(storeId),
    queryFn: () => api.getDrawer(storeId),
    staleTime: 5_000,
  })

export const useMovements = (storeId: string) =>
  useQuery({
    queryKey: MOVES_KEY(storeId),
    queryFn: () => api.getMovements(storeId),
    staleTime: 5_000,
  })

const invalidate = (qc: any, storeId: string) => {
  qc.invalidateQueries({ queryKey: DRAWER_KEY(storeId) })
  qc.invalidateQueries({ queryKey: MOVES_KEY(storeId) })
}

export const useOpenDrawer = (storeId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (p: OpenDrawerPayload) => api.openDrawer(p),
    onSuccess: () => invalidate(qc, storeId),
  })
}

export const useCashIn = (storeId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (p: CashInOutPayload) => api.cashIn(p),
    onSuccess: () => invalidate(qc, storeId),
  })
}

export const useCashOut = (storeId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (p: CashInOutPayload) => api.cashOut(p),
    onSuccess: () => invalidate(qc, storeId),
  })
}

export const useCloseDrawer = (storeId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (p: CloseDrawerPayload) => api.closeDrawer(p),
    onSuccess: () => invalidate(qc, storeId),
  })
}
