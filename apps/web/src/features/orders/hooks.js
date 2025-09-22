import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchFeed, updateStatus } from './api'
export const FEED_KEY = (storeId) => ['orders', 'feed', storeId]
export const useOrderFeed = (storeId, strategy = 'poll') => {
  // v1: polling; keep API for future SSE/WS
  return useQuery({
    queryKey: storeId ? FEED_KEY(storeId) : ['orders', 'feed', '_no_store'],
    queryFn: () => fetchFeed(storeId),
    enabled: !!storeId,
    refetchInterval: strategy === 'poll' ? 3000 : false,
    staleTime: 1000,
  })
}
export const useUpdateOrderStatus = (storeId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }) => updateStatus(id, status),
    onSuccess: () => {
      if (storeId) qc.invalidateQueries({ queryKey: FEED_KEY(storeId) })
    },
  })
}
