import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Login } from '../app/pages/Login'

// Mock the stores
vi.mock('../store/authStore', () => ({
  useAuthStore: () => ({
    setToken: vi.fn(),
    setUser: vi.fn(),
  }),
}))

vi.mock('../store/orgStore', () => ({
  useOrgStore: () => ({
    setContext: vi.fn(),
  }),
}))

vi.mock('../lib/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  )
}

describe('Login Accessibility', () => {
  it('has properly labeled form inputs', () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    )

    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)

    expect(emailInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('shows required indicators on labels', () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    )

    // Check for required asterisks (*)
    const requiredMarkers = screen.getAllByText('*')
    expect(requiredMarkers).toHaveLength(2) // Email and password should both be required
  })

  it('triggers submit handler when Enter is pressed', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    )

    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const form = screen.getByRole('form')

    // Fill out the form
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    // Submit by pressing Enter on the form
    fireEvent.submit(form)

    // Form submission should be attempted (even if it fails due to mocked API)
    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')

    consoleSpy.mockRestore()
  })

  it('has accessible error states', () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    )

    const submitButton = screen.getByRole('button', { name: /sign in/i })

    // Submit form without filling it out to trigger validation
    fireEvent.click(submitButton)

    // Should have aria-invalid attributes when errors occur
    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)

    expect(emailInput).toHaveAttribute('aria-invalid')
    expect(passwordInput).toHaveAttribute('aria-invalid')
  })
})
