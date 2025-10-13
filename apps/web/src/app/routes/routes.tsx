import React from 'react'
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
import ModernDashboard from '../pages/ModernDashboard'
import ModernLogin from '../pages/ModernLogin'
import CameraAnalytics from '../(dashboard)/camera/page'
import { useAuthStore } from '../../store/authStore'

export const ProtectedLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div
          className="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"
          role="status"
          aria-label="Yükleniyor"
        ></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <AppShell />
}

export const RootRedirect: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div
          className="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"
          role="status"
          aria-label="Yükleniyor"
        ></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <Home />
}

const NotFound: React.FC = () => (
  <div className="p-6 text-slate-700">
    <h1 className="mb-2 text-xl font-bold">Page not found</h1>
    <p className="mb-4">
      This page doesn't exist. You can return to dashboard.
    </p>
    <a href="/dashboard" className="text-blue-600 underline">
      Go to dashboard
    </a>
  </div>
)

export const routesConfig = [
  { path: '/login', element: <ModernLogin /> }, // public
  { path: '/', element: <RootRedirect /> }, // smart redirect

  // Redirect aliases for incorrect URLs (backward compatibility)
  { path: '/dashboard/pos', element: <Navigate to="/pos" replace /> },
  { path: '/dashboard/menu', element: <Navigate to="/menu" replace /> },
  { path: '/dashboard/kitchen', element: <Navigate to="/kitchen" replace /> },
  {
    path: '/dashboard/inventory',
    element: <Navigate to="/inventory" replace />,
  },
  { path: '/dashboard/alerts', element: <Navigate to="/alerts" replace /> },
  { path: '/dashboard/settings', element: <Navigate to="/settings" replace /> },

  // Catch-all for undefined dashboard paths
  { path: '/dashboard/*', element: <Navigate to="/dashboard" replace /> },

  {
    element: <ProtectedLayout />, // guard + AppShell
    children: [
      { path: '/dashboard', element: <ModernDashboard /> },
      { path: '/pos', element: <POS /> },
      { path: '/camera', element: <CameraAnalytics /> },
      { path: '/menu', element: <Menu /> },
      { path: '/kitchen', element: <Kitchen /> },
      { path: '/inventory', element: <Inventory /> },
      { path: '/alerts', element: <Alerts /> },
      { path: '/settings', element: <Settings /> },
    ],
  },

  // Global 404 fallback
  { path: '*', element: <NotFound /> },
]

export const router = createBrowserRouter(routesConfig)

// test ortamı için yardımcı
export const createTestRouter = (initialPath = '/') =>
  createMemoryRouter(routesConfig, { initialEntries: [initialPath] })
