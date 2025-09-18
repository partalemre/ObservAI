import { create } from 'zustand'
import {
  getToken,
  setToken as saveToken,
  removeToken,
  getUser,
  setUser as saveUser,
} from '../lib/auth'

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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  setToken: (token: string) => {
    saveToken(token)
    set({ token, isAuthenticated: true })
  },

  setUser: (user: User) => {
    saveUser(user)
    set({ user, isLoading: false })
  },

  logout: () => {
    removeToken()
    set({ user: null, token: null, isAuthenticated: false, isLoading: false })
  },

  initialize: () => {
    const token = getToken()
    const user = getUser()

    if (token && user) {
      set({ user, token, isAuthenticated: true, isLoading: false })
    } else {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false })
    }
  },
}))
