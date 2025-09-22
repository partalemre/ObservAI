import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { catalogApi, ordersApi } from './api'
import type { NewOrder } from './types'

export const useCategories = (storeId: string) => {
  return useQuery({
    queryKey: ['categories', storeId],
    queryFn: () => catalogApi.getCategories(storeId),
    enabled: !!storeId,
  })
}

export const useItems = (storeId: string) => {
  return useQuery({
    queryKey: ['items', storeId],
    queryFn: () => catalogApi.getItems(storeId),
    enabled: !!storeId,
  })
}

export const useModifierGroups = (storeId: string) => {
  return useQuery({
    queryKey: ['modifierGroups', storeId],
    queryFn: () => catalogApi.getModifierGroups(storeId),
    enabled: !!storeId,
  })
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (order: NewOrder) => ordersApi.createOrder(order),
    onSuccess: () => {
      // Invalidate orders queries if they exist
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}
