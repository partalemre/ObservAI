import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Home } from '../app/pages/Home'

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    )

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Operate smarter with ObservAI'
    )
  })

  it('renders two CTA buttons', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    )

    expect(
      screen.getByRole('button', { name: /request a demo/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
  })

  it('renders feature grid with 6 cards', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    )

    // Check for key feature titles
    expect(screen.getByText('Smart POS')).toBeInTheDocument()
    expect(screen.getByText('Dynamic Menu')).toBeInTheDocument()
    expect(screen.getByText('Kitchen Display')).toBeInTheDocument()
    expect(screen.getByText('Inventory Alerts')).toBeInTheDocument()
    expect(screen.getByText('Staff & Tips')).toBeInTheDocument()
    expect(screen.getByText('AI Insights')).toBeInTheDocument()
  })

  it('displays "Built for modern hospitality" badge', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    )

    expect(screen.getByText('Built for modern hospitality')).toBeInTheDocument()
  })
})
