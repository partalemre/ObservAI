import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import toast from 'react-hot-toast'
import { Login } from '../app/pages/Login'

const server = setupServer(
  http.post('http://localhost:3001/auth/login', () => {
    return HttpResponse.json({ token: 'test-token' })
  }),
  http.get('http://localhost:3001/me', () => {
    return HttpResponse.json({
      user: {
        id: 'u1',
        email: 'demo@obs.ai',
        name: 'Demo Kullanıcı',
        roles: ['manager'],
      },
      orgs: [{ id: 'o1', name: 'Demo Grup' }],
      stores: [
        { id: 's1', name: 'Merkez Şube', orgId: 'o1' },
        { id: 's2', name: 'Cadde Şube', orgId: 'o1' },
      ],
    })
  })
)

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

// Mock the useNavigate hook
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

describe('Login Flow', () => {
  beforeAll(() => server.listen())
  afterEach(() => {
    server.resetHandlers()
    vi.clearAllMocks()
    mockNavigate.mockClear()
    vi.mocked(toast.error).mockClear()
    // Clear localStorage mock
    Object.values(localStorage).forEach((fn) => vi.mocked(fn).mockClear())
  })
  afterAll(() => server.close())

  test('successful login flow navigates to dashboard', async () => {
    // Setup localStorage mock to store values
    const storage: Record<string, string> = {}
    vi.mocked(localStorage.setItem).mockImplementation((key, value) => {
      storage[key] = value
    })
    vi.mocked(localStorage.getItem).mockImplementation((key) => {
      return storage[key] || null
    })

    const user = userEvent.setup()
    const Wrapper = createWrapper()

    render(<Login />, { wrapper: Wrapper })

    // Fill in the form
    await user.type(screen.getByLabelText(/email/i), 'demo@obs.ai')
    await user.type(screen.getByLabelText(/password/i), 'password123')

    // Submit the form
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    // Wait for navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })

    // Verify token is stored
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'auth_token',
      'test-token'
    )

    // Verify user data is stored
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'auth_user',
      expect.stringContaining('demo@obs.ai')
    )
  })

  test('shows error toast on login failure', async () => {
    server.use(
      http.post('http://localhost:3001/auth/login', () => {
        return HttpResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      })
    )

    const user = userEvent.setup()
    const Wrapper = createWrapper()

    render(<Login />, { wrapper: Wrapper })

    await user.type(screen.getByLabelText(/email/i), 'wrong@email.com')
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Sign-in failed. Please check your credentials.'
      )
    })

    expect(mockNavigate).not.toHaveBeenCalled()
  })

  test('validates required fields', async () => {
    const user = userEvent.setup()
    const Wrapper = createWrapper()

    render(<Login />, { wrapper: Wrapper })

    // Try to submit without filling fields
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(screen.getByText(/email address is required/i)).toBeInTheDocument()
    expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
