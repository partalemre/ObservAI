import { create } from 'zustand'
export const useKitchenStore = create((set) => ({
  density: 'comfortable',
  sound: true,
  filter: { channel: 'ALL', status: 'ALL' },
  setDensity: (density) => set({ density }),
  setSound: (sound) => set({ sound }),
  setFilter: (patch) => set((s) => ({ filter: { ...s.filter, ...patch } })),
}))
