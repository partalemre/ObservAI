import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CashDrawerBadge } from '../components/payments/CashDrawerBadge'
import { useOrgStore } from '../store/orgStore'
import { cashDb } from '../test-setup'

// Test wrapper with QueryClient
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('End Shift & Close Drawer', () => {
  beforeEach(() => {
    // Start with open drawer
    cashDb.byStore.s1 = {
      state: {
        status: 'OPEN',
        balance: 550,
        floatAmount: 500,
        openedAt: new Date().toISOString(),
        openedBy: 'clerk',
      },
      moves: [
        {
          id: 'm1',
          ts: new Date().toISOString(),
          type: 'SALE',
          amount: 50,
          orderId: 'ORD-1001',
        },
      ],
    }

    useOrgStore.setState({ selectedStoreId: 's1' })
  })

  it('should close drawer with counted total matching system balance', async () => {
    render(
      <TestWrapper>
        <CashDrawerBadge />
      </TestWrapper>
    )

    // Should show open badge with balance
    expect(screen.getByText('Drawer open')).toBeInTheDocument()
    expect(screen.getByText('550.00')).toBeInTheDocument()

    // Click end shift button
    fireEvent.click(screen.getByText('End shift'))

    await waitFor(() => {
      expect(screen.getByText('End shift & close')).toBeInTheDocument()
    })

    // Should show system balance
    expect(screen.getByText('System Balance:')).toBeInTheDocument()
    expect(screen.getByText('$550.00')).toBeInTheDocument()

    // Enter counted total matching system balance
    const countedInput = screen.getByLabelText('Counted total')
    fireEvent.change(countedInput, { target: { value: '550' } })

    // Should show no difference
    await waitFor(() => {
      expect(screen.queryByText('Difference:')).not.toBeInTheDocument()
    })

    // Submit
    const closeButton = screen.getByText('Close drawer')
    fireEvent.click(closeButton)

    // Should return to closed state
    await waitFor(() => {
      expect(screen.getByText('Drawer closed')).toBeInTheDocument()
      expect(screen.getByText('Open drawer')).toBeInTheDocument()
    })
  })

  it('should handle counted total with difference', async () => {
    render(
      <TestWrapper>
        <CashDrawerBadge />
      </TestWrapper>
    )

    // Click end shift button
    fireEvent.click(screen.getByText('End shift'))

    await waitFor(() => {
      expect(screen.getByText('End shift & close')).toBeInTheDocument()
    })

    // Enter counted total with difference
    const countedInput = screen.getByLabelText('Counted total')
    fireEvent.change(countedInput, { target: { value: '540' } })

    // Should show negative difference
    await waitFor(() => {
      expect(screen.getByText('Difference:')).toBeInTheDocument()
      expect(screen.getByText('-$10.00')).toBeInTheDocument()
    })

    // Submit
    const closeButton = screen.getByText('Close drawer')
    fireEvent.click(closeButton)

    // Should close and create adjustment
    await waitFor(() => {
      expect(screen.getByText('Drawer closed')).toBeInTheDocument()
    })
  })

  it('should handle counted total with positive difference', async () => {
    render(
      <TestWrapper>
        <CashDrawerBadge />
      </TestWrapper>
    )

    // Click end shift button
    fireEvent.click(screen.getByText('End shift'))

    await waitFor(() => {
      expect(screen.getByText('End shift & close')).toBeInTheDocument()
    })

    // Enter counted total with positive difference
    const countedInput = screen.getByLabelText('Counted total')
    fireEvent.change(countedInput, { target: { value: '570' } })

    // Should show positive difference
    await waitFor(() => {
      expect(screen.getByText('Difference:')).toBeInTheDocument()
      expect(screen.getByText('+$20.00')).toBeInTheDocument()
    })

    // Submit
    const closeButton = screen.getByText('Close drawer')
    fireEvent.click(closeButton)

    // Should close
    await waitFor(() => {
      expect(screen.getByText('Drawer closed')).toBeInTheDocument()
    })
  })

  it('should validate counted total input', async () => {
    render(
      <TestWrapper>
        <CashDrawerBadge />
      </TestWrapper>
    )

    // Click end shift button
    fireEvent.click(screen.getByText('End shift'))

    await waitFor(() => {
      expect(screen.getByText('End shift & close')).toBeInTheDocument()
    })

    // Try to submit without counted total
    const closeButton = screen.getByText('Close drawer')
    fireEvent.click(closeButton)

    // Should stay in dialog
    expect(screen.getByText('End shift & close')).toBeInTheDocument()
  })
})
