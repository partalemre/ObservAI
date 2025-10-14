import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '../AppShell'
import { DashboardPage } from '../pages/DashboardPage'
import { OverlayPage } from '../pages/OverlayPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
    ],
  },
  {
    path: '/overlay',
    element: <OverlayPage />,
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
])
