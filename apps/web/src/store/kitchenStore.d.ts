type Density = 'comfortable' | 'compact'
type KitchenState = {
  density: Density
  sound: boolean
  filter: {
    channel?: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY' | 'ALL'
    status?: 'ALL' | 'NEW' | 'IN_PROGRESS' | 'READY'
  }
  setDensity: (d: Density) => void
  setSound: (v: boolean) => void
  setFilter: (p: Partial<KitchenState['filter']>) => void
}
export declare const useKitchenStore: import('zustand').UseBoundStore<
  import('zustand').StoreApi<KitchenState>
>
export {}
