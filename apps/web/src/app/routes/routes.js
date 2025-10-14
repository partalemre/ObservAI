import { jsx as _jsx } from 'react/jsx-runtime'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '../AppShell'
import { DashboardPage } from '../pages/DashboardPage'
import { OverlayPage } from '../pages/OverlayPage'
export const router = createBrowserRouter([
  {
    path: '/',
    element: _jsx(AppShell, {}),
    children: [
      {
        index: true,
        element: _jsx(Navigate, { to: '/dashboard', replace: true }),
      },
      {
        path: 'dashboard',
        element: _jsx(DashboardPage, {}),
      },
    ],
  },
  {
    path: '/overlay',
    element: _jsx(OverlayPage, {}),
  },
  {
    path: '*',
    element: _jsx(Navigate, { to: '/dashboard', replace: true }),
  },
])
