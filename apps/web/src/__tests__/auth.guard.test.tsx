import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import { ProtectedLayout } from '../app/routes/routes'

// Mock the auth store
vi.mock('../store/authStore')

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  )
}

describe('Auth Guard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('redirects to login when token is missing', () => {
    // Mock unauthenticated state
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      token: null,
      setToken: vi.fn(),
      setUser: vi.fn(),
      logout: vi.fn(),
      initialize: vi.fn(),
    })

    const Wrapper = createWrapper()

    render(<ProtectedLayout />, { wrapper: Wrapper })

    // Should not render AppShell content when not authenticated
    expect(screen.queryByText('ObservAI')).not.toBeInTheDocument()
  })

  test('shows loading spinner when authentication is loading', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      token: null,
      setToken: vi.fn(),
      setUser: vi.fn(),
      logout: vi.fn(),
      initialize: vi.fn(),
    })

    const Wrapper = createWrapper()
    render(<ProtectedLayout />, { wrapper: Wrapper })

    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument()
  })

  test('renders AppShell when authenticated', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: {
        id: 'u1',
        email: 'demo@obs.ai',
        name: 'Demo Kullanıcı',
        roles: ['manager'],
      },
      token: 'valid-token',
      setToken: vi.fn(),
      setUser: vi.fn(),
      logout: vi.fn(),
      initialize: vi.fn(),
    })

    const Wrapper = createWrapper()
    render(<ProtectedLayout />, { wrapper: Wrapper })

    expect(screen.getByText('ObservAI')).toBeInTheDocument()
  })
})
