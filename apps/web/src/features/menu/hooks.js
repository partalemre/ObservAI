import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from './api'
export const CAT_KEY = (storeId) => ['menu', 'categories', storeId]
export const ITEM_KEY = (storeId) => ['menu', 'items', storeId]
export const GRP_KEY = (storeId) => ['menu', 'groups', storeId]
const invalidateCatalog = (qc, storeId) => {
  qc.invalidateQueries({ queryKey: ['categories', storeId] })
  qc.invalidateQueries({ queryKey: ['items', storeId] })
  qc.invalidateQueries({ queryKey: ['modifierGroups', storeId] })
}
// Categories
export const useCategories = (storeId) => {
  return useQuery({
    queryKey: CAT_KEY(storeId),
    queryFn: () => api.getCategories(storeId),
    enabled: !!storeId,
  })
}
export const useCreateCategory = (storeId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAT_KEY(storeId) })
      invalidateCatalog(queryClient, storeId)
    },
  })
}
export const usePatchCategory = (storeId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...params }) => api.patchCategory(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAT_KEY(storeId) })
      invalidateCatalog(queryClient, storeId)
    },
  })
}
export const useDeleteCategory = (storeId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAT_KEY(storeId) })
      invalidateCatalog(queryClient, storeId)
    },
  })
}
export const useReorderCategories = (storeId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.reorderCategories,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAT_KEY(storeId) })
      invalidateCatalog(queryClient, storeId)
    },
  })
}
// Items
export const useItems = (storeId) => {
  return useQuery({
    queryKey: ITEM_KEY(storeId),
    queryFn: () => api.getItems(storeId),
    enabled: !!storeId,
  })
}
export const useCreateItem = (storeId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITEM_KEY(storeId) })
      invalidateCatalog(queryClient, storeId)
    },
  })
}
export const usePatchItem = (storeId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...params }) => api.patchItem(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITEM_KEY(storeId) })
      invalidateCatalog(queryClient, storeId)
    },
  })
}
export const useDeleteItem = (storeId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITEM_KEY(storeId) })
      invalidateCatalog(queryClient, storeId)
    },
  })
}
// Groups
export const useGroups = (storeId) => {
  return useQuery({
    queryKey: GRP_KEY(storeId),
    queryFn: () => api.getGroups(storeId),
    enabled: !!storeId,
  })
}
export const useCreateGroup = (storeId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GRP_KEY(storeId) })
      invalidateCatalog(queryClient, storeId)
    },
  })
}
export const usePatchGroup = (storeId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...params }) => api.patchGroup(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GRP_KEY(storeId) })
      invalidateCatalog(queryClient, storeId)
    },
  })
}
export const useDeleteGroup = (storeId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GRP_KEY(storeId) })
      invalidateCatalog(queryClient, storeId)
    },
  })
}
// Upload
export const useUploadImage = () => {
  return useMutation({
    mutationFn: api.uploadImage,
  })
}
