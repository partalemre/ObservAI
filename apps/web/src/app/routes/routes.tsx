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

export const routesConfig = [
  { path: '/login', element: <Login /> }, // public
  { path: '/', element: <Home /> }, // public landing
  {
    element: <ProtectedLayout />, // guard + AppShell
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/pos', element: <POS /> },
      { path: '/menu', element: <Menu /> },
      { path: '/kitchen', element: <Kitchen /> },
      { path: '/inventory', element: <Inventory /> },
      { path: '/alerts', element: <Alerts /> },
      { path: '/settings', element: <Settings /> },
    ],
  },
]

export const router = createBrowserRouter(routesConfig)

// test ortamı için yardımcı
export const createTestRouter = (initialPath = '/') =>
  createMemoryRouter(routesConfig, { initialEntries: [initialPath] })
