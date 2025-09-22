import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
// Mock the stores
vi.mock('../store/uiStore', () => ({
  useUIStore: () => ({
    sidebarOpen: true,
  }),
}))
// Mock react-router-dom's useLocation
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useLocation: () => ({
      pathname: '/dashboard',
    }),
  }
})
const TestWrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>
describe('Sidebar Visual Tests', () => {
  it('renders with ink background color', () => {
    render(
      <TestWrapper>
        <Sidebar />
      </TestWrapper>
    )
    const sidebar = screen.getByRole('navigation').closest('div')
    expect(sidebar).toHaveClass('bg-ink')
  })
  it('shows active gradient bar for dashboard route', () => {
    render(
      <TestWrapper>
        <Sidebar />
      </TestWrapper>
    )
    // Find the dashboard link (should be active)
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
    expect(dashboardLink).toHaveClass('bg-white/10', 'text-white')
    // Check that the gradient indicator is present in the active item
    const gradientBar = dashboardLink.querySelector(
      '.bg-gradient-to-b.from-brand.to-accent'
    )
    expect(gradientBar).toBeInTheDocument()
  })
  it('displays brand logo when sidebar is open', () => {
    render(
      <TestWrapper>
        <Sidebar />
      </TestWrapper>
    )
    // Should show the brand logo with ObservAI text
    expect(screen.getByText('ObservAI')).toBeInTheDocument()
  })
  it('renders all navigation items', () => {
    render(
      <TestWrapper>
        <Sidebar />
      </TestWrapper>
    )
    // Check that all navigation items are present
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /pos/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /menu/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /kitchen/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /inventory/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /alerts/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument()
  })
  it('uses correct brand color classes', () => {
    render(
      <TestWrapper>
        <Sidebar />
      </TestWrapper>
    )
    const sidebar = screen.getByRole('navigation').closest('div')
    // Should use ink (dark) background
    expect(sidebar).toHaveClass('bg-ink')
    // Text should be white with opacity
    expect(sidebar).toHaveClass('text-white/90')
  })
})
