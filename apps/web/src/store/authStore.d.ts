interface User {
  id: string
  email: string
  name: string
  roles: string[]
}
interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  setToken: (token: string) => void
  setUser: (user: User) => void
  logout: () => void
  initialize: () => void
}
export declare const useAuthStore: import('zustand').UseBoundStore<
  import('zustand').StoreApi<AuthState>
>
export {}
