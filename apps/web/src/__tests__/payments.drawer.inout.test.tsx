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

describe('Cash In/Out Operations', () => {
  beforeEach(() => {
    // Start with open drawer
    cashDb.byStore.s1 = {
      state: {
        status: 'OPEN',
        balance: 500,
        floatAmount: 500,
        openedAt: new Date().toISOString(),
        openedBy: 'clerk',
      },
      moves: [],
    }

    useOrgStore.setState({ selectedStoreId: 's1' })
  })

  it('should handle cash in operation', async () => {
    render(
      <TestWrapper>
        <CashDrawerBadge />
      </TestWrapper>
    )

    // Should show open badge with balance
    expect(screen.getByText('Drawer open')).toBeInTheDocument()
    expect(screen.getByText('500.00')).toBeInTheDocument()

    // Click cash in/out button
    fireEvent.click(screen.getByText(/Cash in.*Cash out/))

    await waitFor(() => {
      expect(screen.getByText('Cash in')).toBeInTheDocument()
    })

    // Enter cash in details
    const amountInput = screen.getByLabelText('Amount')
    const reasonInput = screen.getByLabelText('Reason')

    fireEvent.change(amountInput, { target: { value: '100' } })
    fireEvent.change(reasonInput, {
      target: { value: 'Till count correction' },
    })

    // Submit
    const confirmButton = screen.getByText('Confirm')
    fireEvent.click(confirmButton)

    // Should update balance
    await waitFor(() => {
      expect(screen.getByText('600.00')).toBeInTheDocument()
    })
  })

  it('should handle cash out operation', async () => {
    render(
      <TestWrapper>
        <CashDrawerBadge />
      </TestWrapper>
    )

    // Click cash in/out button
    fireEvent.click(screen.getByText(/Cash in.*Cash out/))

    await waitFor(() => {
      expect(screen.getByText('Cash in')).toBeInTheDocument()
    })

    // Switch to cash out
    fireEvent.click(screen.getByText('Cash out'))

    // Enter cash out details
    const amountInput = screen.getByLabelText('Amount')
    const reasonInput = screen.getByLabelText('Reason')

    fireEvent.change(amountInput, { target: { value: '50' } })
    fireEvent.change(reasonInput, { target: { value: 'Manager withdrawal' } })

    // Submit
    const confirmButton = screen.getByText('Confirm')
    fireEvent.click(confirmButton)

    // Should update balance
    await waitFor(() => {
      expect(screen.getByText('450.00')).toBeInTheDocument()
    })
  })

  it('should validate cash in/out inputs', async () => {
    render(
      <TestWrapper>
        <CashDrawerBadge />
      </TestWrapper>
    )

    // Click cash in/out button
    fireEvent.click(screen.getByText(/Cash in.*Cash out/))

    await waitFor(() => {
      expect(screen.getByText('Cash in')).toBeInTheDocument()
    })

    // Try to submit without details
    const confirmButton = screen.getByText('Confirm')
    fireEvent.click(confirmButton)

    // Should stay in dialog due to validation
    expect(screen.getByText('Cash in')).toBeInTheDocument()

    // Try with invalid amount
    const amountInput = screen.getByLabelText('Amount')
    fireEvent.change(amountInput, { target: { value: '0' } })
    fireEvent.click(confirmButton)

    // Should still be in dialog
    expect(screen.getByText('Cash in')).toBeInTheDocument()
  })
})
