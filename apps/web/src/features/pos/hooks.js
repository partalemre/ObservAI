import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { catalogApi, ordersApi } from './api'
export const useCategories = (storeId) => {
  return useQuery({
    queryKey: ['categories', storeId],
    queryFn: () => catalogApi.getCategories(storeId),
    enabled: !!storeId,
  })
}
export const useItems = (storeId) => {
  return useQuery({
    queryKey: ['items', storeId],
    queryFn: () => catalogApi.getItems(storeId),
    enabled: !!storeId,
  })
}
export const useModifierGroups = (storeId) => {
  return useQuery({
    queryKey: ['modifierGroups', storeId],
    queryFn: () => catalogApi.getModifierGroups(storeId),
    enabled: !!storeId,
  })
}
export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (order) => ordersApi.createOrder(order),
    onSuccess: () => {
      // Invalidate orders queries if they exist
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}
