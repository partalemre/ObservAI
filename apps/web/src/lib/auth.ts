const AUTH_TOKEN_KEY = 'auth_token'
const AUTH_USER_KEY = 'auth_user'

export const getToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export const setToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export const removeToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
}

export const getUser = (): any | null => {
  const user = localStorage.getItem(AUTH_USER_KEY)
  return user ? JSON.parse(user) : null
}

export const setUser = (user: any): void => {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export const isAuthenticated = (): boolean => {
  return !!getToken()
}
