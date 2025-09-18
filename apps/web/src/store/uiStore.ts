import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  darkMode: boolean
  currentPage: string
  loading: boolean
  setSidebarOpen: (open: boolean) => void
  setDarkMode: (dark: boolean) => void
  setCurrentPage: (page: string) => void
  setLoading: (loading: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  darkMode: false,
  currentPage: 'dashboard',
  loading: false,

  setSidebarOpen: (open: boolean) => {
    set({ sidebarOpen: open })
  },

  setDarkMode: (dark: boolean) => {
    set({ darkMode: dark })
  },

  setCurrentPage: (page: string) => {
    set({ currentPage: page })
  },

  setLoading: (loading: boolean) => {
    set({ loading })
  },
}))
