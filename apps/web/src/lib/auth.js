const AUTH_TOKEN_KEY = 'auth_token'
const AUTH_USER_KEY = 'auth_user'
export const getToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}
export const setToken = (token) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}
export const removeToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
}
export const getUser = () => {
  const user = localStorage.getItem(AUTH_USER_KEY)
  return user ? JSON.parse(user) : null
}
export const setUser = (user) => {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}
export const isAuthenticated = () => {
  return !!getToken()
}
