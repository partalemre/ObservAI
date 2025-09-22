import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from './api'
import type { MenuCategory, MenuItem, ModifierGroup } from './types'

export const CAT_KEY = (storeId: string) => ['menu', 'categories', storeId]
export const ITEM_KEY = (storeId: string) => ['menu', 'items', storeId]
export const GRP_KEY = (storeId: string) => ['menu', 'groups', storeId]

const invalidateCatalog = (qc: any, storeId: string) => {
  qc.invalidateQueries({ queryKey: ['categories', storeId] })
  qc.invalidateQueries({ queryKey: ['items', storeId] })
  qc.invalidateQueries({ queryKey: ['modifierGroups', storeId] })
}

// Categories
export const useCategories = (storeId: string) => {
  return useQuery({
    queryKey: CAT_KEY(storeId),
    queryFn: () => api.getCategories(storeId),
    enabled: !!storeId,
  })
}

export const useCreateCategory = (storeId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAT_KEY(storeId) })
      invalidateCatalog(queryClient, storeId)
    },
  })
}

export const usePatchCategory = (storeId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...params }: { id: string } & Partial<MenuCategory>) =>
      api.patchCategory(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAT_KEY(storeId) })
      invalidateCatalog(queryClient, storeId)
    },
  })
}

export const useDeleteCategory = (storeId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAT_KEY(storeId) })
      invalidateCatalog(queryClient, storeId)
    },
  })
}

export const useReorderCategories = (storeId: string) => {
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
export const useItems = (storeId: string) => {
  return useQuery({
    queryKey: ITEM_KEY(storeId),
    queryFn: () => api.getItems(storeId),
    enabled: !!storeId,
  })
}

export const useCreateItem = (storeId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITEM_KEY(storeId) })
      invalidateCatalog(queryClient, storeId)
    },
  })
}

export const usePatchItem = (storeId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...params }: { id: string } & Partial<MenuItem>) =>
      api.patchItem(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITEM_KEY(storeId) })
      invalidateCatalog(queryClient, storeId)
    },
  })
}

export const useDeleteItem = (storeId: string) => {
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
export const useGroups = (storeId: string) => {
  return useQuery({
    queryKey: GRP_KEY(storeId),
    queryFn: () => api.getGroups(storeId),
    enabled: !!storeId,
  })
}

export const useCreateGroup = (storeId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GRP_KEY(storeId) })
      invalidateCatalog(queryClient, storeId)
    },
  })
}

export const usePatchGroup = (storeId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...params }: { id: string } & Partial<ModifierGroup>) =>
      api.patchGroup(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GRP_KEY(storeId) })
      invalidateCatalog(queryClient, storeId)
    },
  })
}

export const useDeleteGroup = (storeId: string) => {
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
