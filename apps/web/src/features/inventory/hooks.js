import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchItems, postReceive, postAdjust } from './api'
export const ITEMS_KEY = (storeId) => ['inventory', 'items', storeId]
export const useInventoryItems = (storeId) =>
  useQuery({
    queryKey: storeId
      ? ITEMS_KEY(storeId)
      : ['inventory', 'items', '_no_store'],
    queryFn: () => fetchItems(storeId),
    enabled: !!storeId,
    staleTime: 60_000,
  })
export const useReceive = (storeId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: postReceive,
    onSuccess: () => {
      if (storeId) qc.invalidateQueries({ queryKey: ITEMS_KEY(storeId) })
    },
  })
}
export const useAdjust = (storeId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: postAdjust,
    onSuccess: () => {
      if (storeId) qc.invalidateQueries({ queryKey: ITEMS_KEY(storeId) })
    },
  })
}
