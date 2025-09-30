import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { router } from './app/routes/routes'
import { queryClient } from './lib/query'
import { useAuthStore } from './store/authStore'
import { ErrorBoundary } from './app/ErrorBoundary'
import './styles/globals.css'
// --- DEV ONLY: boot MSW so demo/owner can log in ---
if (import.meta.env.DEV) {
  const { worker } = await import('./mocks/browser')
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: { url: '/mockServiceWorker.js' },
  })
}
const App = () => {
  React.useEffect(() => {
    useAuthStore.getState().initialize()
  }, [])
  return _jsxs(QueryClientProvider, {
    client: queryClient,
    children: [
      _jsx(ErrorBoundary, {
        children: _jsx(RouterProvider, { router: router }),
      }),
      _jsx(Toaster, {
        position: 'top-right',
        toastOptions: {
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        },
      }),
    ],
  })
}
ReactDOM.createRoot(document.getElementById('root')).render(
  _jsx(React.StrictMode, { children: _jsx(App, {}) })
)
