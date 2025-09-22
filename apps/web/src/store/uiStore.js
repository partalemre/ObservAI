import { create } from 'zustand'
export const useUIStore = create((set) => ({
  sidebarOpen: true,
  darkMode: false,
  currentPage: 'dashboard',
  loading: false,
  setSidebarOpen: (open) => {
    set({ sidebarOpen: open })
  },
  setDarkMode: (dark) => {
    set({ darkMode: dark })
  },
  setCurrentPage: (page) => {
    set({ currentPage: page })
  },
  setLoading: (loading) => {
    set({ loading })
  },
}))
