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
export declare const useUIStore: import('zustand').UseBoundStore<
  import('zustand').StoreApi<UIState>
>
export {}
