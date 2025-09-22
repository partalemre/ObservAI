import { create } from 'zustand'
import {
  getToken,
  setToken as saveToken,
  removeToken,
  getUser,
  setUser as saveUser,
} from '../lib/auth'
export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  setToken: (token) => {
    saveToken(token)
    set({ token, isAuthenticated: true })
  },
  setUser: (user) => {
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
