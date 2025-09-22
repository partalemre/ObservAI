import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppShell } from '../app/AppShell'
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  )
}
describe('AppShell', () => {
  test('render AppShell without crash', () => {
    const Wrapper = createWrapper()
    render(<AppShell />, { wrapper: Wrapper })
    expect(screen.getByText('ObservAI')).toBeInTheDocument()
  })
  test('sidebar has route links', () => {
    const Wrapper = createWrapper()
    render(<AppShell />, { wrapper: Wrapper })
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('POS')).toBeInTheDocument()
    expect(screen.getByText('Menu')).toBeInTheDocument()
    expect(screen.getByText('Kitchen')).toBeInTheDocument()
    expect(screen.getByText('Inventory')).toBeInTheDocument()
    expect(screen.getByText('Alerts')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })
})
