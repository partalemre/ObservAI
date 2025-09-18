import { create } from 'zustand'
import { queryClient } from '../lib/query'

export interface Organization {
  id: string
  name: string
}

export interface Store {
  id: string
  name: string
  orgId: string
}

interface OrgState {
  orgs: Organization[]
  stores: Store[]
  selectedOrgId: string | null
  selectedStoreId: string | null
  setContext: (context: {
    orgs: Organization[]
    stores: Store[]
    selectedStoreId?: string | null
  }) => void
  setSelectedStore: (id: string) => void
}

export const useOrgStore = create<OrgState>((set, get) => ({
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

  setSelectedStore: (id: string) => {
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
