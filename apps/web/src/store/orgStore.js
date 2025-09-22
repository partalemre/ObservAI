import { create } from 'zustand'
import { queryClient } from '../lib/query'
export const useOrgStore = create((set, get) => ({
  orgs: [],
  stores: [],
  selectedOrgId: null,
  selectedStoreId: null,
  setContext: (context) => {
    const selectedStore =
      context.stores.find((s) => s.id === context.selectedStoreId) ||
      context.stores[0]
    set({
      orgs: context.orgs,
      stores: context.stores,
      selectedOrgId: selectedStore?.orgId || null,
      selectedStoreId: context.selectedStoreId || selectedStore?.id || null,
    })
  },
  setSelectedStore: (id) => {
    const store = get().stores.find((s) => s.id === id)
    if (store) {
      set({
        selectedStoreId: id,
        selectedOrgId: store.orgId,
      })
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['metrics'] })
      queryClient.invalidateQueries({ queryKey: ['menu'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
    }
  },
}))
