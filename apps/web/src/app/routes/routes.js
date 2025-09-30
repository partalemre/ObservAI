import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import {
  createBrowserRouter,
  createMemoryRouter,
  Navigate,
} from 'react-router-dom'
import { AppShell } from '../AppShell'
import { POS, Menu, Kitchen, Inventory, Alerts, Settings, Home } from '../pages'
import ModernDashboard from '../pages/ModernDashboard'
import ModernLogin from '../pages/ModernLogin'
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
const NotFound = () =>
  _jsxs('div', {
    className: 'p-6 text-slate-700',
    children: [
      _jsx('h1', {
        className: 'mb-2 text-xl font-bold',
        children: 'Page not found',
      }),
      _jsx('p', {
        className: 'mb-4',
        children: "This page doesn't exist. You can return to dashboard.",
      }),
      _jsx('a', {
        href: '/dashboard',
        className: 'text-blue-600 underline',
        children: 'Go to dashboard',
      }),
    ],
  })
export const routesConfig = [
  { path: '/login', element: _jsx(ModernLogin, {}) }, // public
  { path: '/', element: _jsx(RootRedirect, {}) }, // smart redirect
  // Redirect aliases for incorrect URLs (backward compatibility)
  {
    path: '/dashboard/pos',
    element: _jsx(Navigate, { to: '/pos', replace: true }),
  },
  {
    path: '/dashboard/menu',
    element: _jsx(Navigate, { to: '/menu', replace: true }),
  },
  {
    path: '/dashboard/kitchen',
    element: _jsx(Navigate, { to: '/kitchen', replace: true }),
  },
  {
    path: '/dashboard/inventory',
    element: _jsx(Navigate, { to: '/inventory', replace: true }),
  },
  {
    path: '/dashboard/alerts',
    element: _jsx(Navigate, { to: '/alerts', replace: true }),
  },
  {
    path: '/dashboard/settings',
    element: _jsx(Navigate, { to: '/settings', replace: true }),
  },
  // Catch-all for undefined dashboard paths
  {
    path: '/dashboard/*',
    element: _jsx(Navigate, { to: '/dashboard', replace: true }),
  },
  {
    element: _jsx(ProtectedLayout, {}), // guard + AppShell
    children: [
      { path: '/dashboard', element: _jsx(ModernDashboard, {}) },
      { path: '/pos', element: _jsx(POS, {}) },
      {
        path: '/camera',
        element: _jsx('div', { children: 'Camera Analytics' }),
      }, // Temporary placeholder
      { path: '/menu', element: _jsx(Menu, {}) },
      { path: '/kitchen', element: _jsx(Kitchen, {}) },
      { path: '/inventory', element: _jsx(Inventory, {}) },
      { path: '/alerts', element: _jsx(Alerts, {}) },
      { path: '/settings', element: _jsx(Settings, {}) },
    ],
  },
  // Global 404 fallback
  { path: '*', element: _jsx(NotFound, {}) },
]
export const router = createBrowserRouter(routesConfig)
// test ortamı için yardımcı
export const createTestRouter = (initialPath = '/') =>
  createMemoryRouter(routesConfig, { initialEntries: [initialPath] })
