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

const App: React.FC = () => {
  React.useEffect(() => {
    useAuthStore.getState().initialize()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </QueryClientProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
