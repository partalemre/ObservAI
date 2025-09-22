import { jsx as _jsx } from 'react/jsx-runtime'
import {
  createBrowserRouter,
  createMemoryRouter,
  Navigate,
} from 'react-router-dom'
import { AppShell } from '../AppShell'
import {
  Dashboard,
  POS,
  Menu,
  Kitchen,
  Inventory,
  Alerts,
  Settings,
  Login,
  Home,
} from '../pages'
import { useAuthStore } from '../../store/authStore'
export const ProtectedLayout = () => {
  const { isAuthenticated, isLoading } = useAuthStore()
  if (isLoading) {
    return _jsx('div', {
      className: 'flex min-h-screen items-center justify-center bg-gray-50',
      children: _jsx('div', {
        className:
          'h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600',
        role: 'status',
        'aria-label': 'Y\u00FCkleniyor',
      }),
    })
  }
  if (!isAuthenticated) {
    return _jsx(Navigate, { to: '/login', replace: true })
  }
  return _jsx(AppShell, {})
}
export const RootRedirect = () => {
  const { isAuthenticated, isLoading } = useAuthStore()
  if (isLoading) {
    return _jsx('div', {
      className: 'flex min-h-screen items-center justify-center bg-gray-50',
      children: _jsx('div', {
        className:
          'h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600',
        role: 'status',
        'aria-label': 'Y\u00FCkleniyor',
      }),
    })
  }
  if (isAuthenticated) {
    return _jsx(Navigate, { to: '/dashboard', replace: true })
  }
  return _jsx(Home, {})
}
export const routesConfig = [
  { path: '/login', element: _jsx(Login, {}) }, // public
  { path: '/', element: _jsx(RootRedirect, {}) }, // smart redirect
  {
    element: _jsx(ProtectedLayout, {}), // guard + AppShell
    children: [
      { path: '/dashboard', element: _jsx(Dashboard, {}) },
      { path: '/pos', element: _jsx(POS, {}) },
      { path: '/menu', element: _jsx(Menu, {}) },
      { path: '/kitchen', element: _jsx(Kitchen, {}) },
      { path: '/inventory', element: _jsx(Inventory, {}) },
      { path: '/alerts', element: _jsx(Alerts, {}) },
      { path: '/settings', element: _jsx(Settings, {}) },
    ],
  },
]
export const router = createBrowserRouter(routesConfig)
// test ortamı için yardımcı
export const createTestRouter = (initialPath = '/') =>
  createMemoryRouter(routesConfig, { initialEntries: [initialPath] })
