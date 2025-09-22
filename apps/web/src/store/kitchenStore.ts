import { create } from 'zustand'

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

export const useKitchenStore = create<KitchenState>((set) => ({
  density: 'comfortable',
  sound: true,
  filter: { channel: 'ALL', status: 'ALL' },
  setDensity: (density) => set({ density }),
  setSound: (sound) => set({ sound }),
  setFilter: (patch) => set((s) => ({ filter: { ...s.filter, ...patch } })),
}))
