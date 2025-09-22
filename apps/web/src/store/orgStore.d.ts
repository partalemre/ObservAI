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
export declare const useOrgStore: import('zustand').UseBoundStore<
  import('zustand').StoreApi<OrgState>
>
export {}
