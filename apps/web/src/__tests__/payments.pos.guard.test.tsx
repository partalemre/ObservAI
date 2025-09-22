import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CheckoutDialog } from '../components/pos/CheckoutDialog'
import { usePOS } from '../store/posStore'
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

describe('POS Cash Payment Guards', () => {
  beforeEach(() => {
    // Set up stores
    useOrgStore.setState({ selectedStoreId: 's1' })

    // Add some items to POS cart
    usePOS.setState({
      lines: [
        {
          id: '1',
          itemId: 'i1',
          name: 'Americano',
          qty: 1,
          unitPrice: 45,
          modifiers: [],
        },
      ],
      discount: null,
      note: '',
    })
  })

  it('should disable cash payment when drawer is closed', async () => {
    // Set drawer to closed
    cashDb.byStore.s1 = {
      state: { status: 'CLOSED', balance: 0 },
      moves: [],
    }

    render(
      <TestWrapper>
        <CheckoutDialog open={true} onClose={() => {}} />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Checkout')).toBeInTheDocument()
    })

    // Cash button should be disabled
    const cashButton = screen.getByText(/Cash.*\(drawer closed\)/)
    expect(cashButton).toBeInTheDocument()
    expect(cashButton.closest('button')).toBeDisabled()

    // Card button should still be enabled
    const cardButton = screen.getByText('Card')
    expect(cardButton.closest('button')).not.toBeDisabled()

    // Clicking cash button should show error toast (tested through MSW response)
    fireEvent.click(cashButton)
    // Note: Toast testing would require additional setup
  })

  it('should allow cash payment when drawer is open', async () => {
    // Set drawer to open
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

    render(
      <TestWrapper>
        <CheckoutDialog open={true} onClose={() => {}} />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Checkout')).toBeInTheDocument()
    })

    // Cash button should be enabled and not show drawer closed message
    const cashButton = screen.getByText('Cash')
    expect(cashButton.closest('button')).not.toBeDisabled()
    expect(screen.queryByText(/drawer closed/)).not.toBeInTheDocument()

    // Should be able to select cash method
    fireEvent.click(cashButton)

    // Should show cash input fields
    await waitFor(() => {
      expect(screen.getByLabelText('Cash given')).toBeInTheDocument()
    })

    // Enter cash amount and complete payment
    const cashInput = screen.getByLabelText('Cash given')
    fireEvent.change(cashInput, { target: { value: '50' } })

    // Submit button should become enabled
    await waitFor(() => {
      const submitButton = screen.getByText('Complete sale')
      expect(submitButton).not.toBeDisabled()
    })
  })

  it('should record cash sale movement when payment completes', async () => {
    // Set drawer to open
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

    const mockOnClose = vi.fn()

    render(
      <TestWrapper>
        <CheckoutDialog open={true} onClose={mockOnClose} />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Checkout')).toBeInTheDocument()
    })

    // Select cash and enter amount
    const cashButton = screen.getByText('Cash')
    fireEvent.click(cashButton)

    const cashInput = screen.getByLabelText('Cash given')
    fireEvent.change(cashInput, { target: { value: '50' } })

    // Complete the sale
    const submitButton = screen.getByText('Complete sale')
    fireEvent.click(submitButton)

    // Should complete and close dialog
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled()
    })

    // Check that cash movement was recorded (via MSW handler)
    const drawerState = cashDb.byStore.s1
    expect(drawerState.state.balance).toBe(545) // 500 + 45 (item price)
    expect(drawerState.moves).toHaveLength(1)
    expect(drawerState.moves[0].type).toBe('SALE')
    expect(drawerState.moves[0].amount).toBe(45)
  })

  it('should not record movement for card payments', async () => {
    // Set drawer to open
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

    const mockOnClose = vi.fn()

    render(
      <TestWrapper>
        <CheckoutDialog open={true} onClose={mockOnClose} />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Checkout')).toBeInTheDocument()
    })

    // Select card payment
    const cardButton = screen.getByText('Card')
    fireEvent.click(cardButton)

    // Complete the sale
    const submitButton = screen.getByText('Complete sale')
    fireEvent.click(submitButton)

    // Should complete and close dialog
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled()
    })

    // Check that no cash movement was recorded
    const drawerState = cashDb.byStore.s1
    expect(drawerState.state.balance).toBe(500) // Unchanged
    expect(drawerState.moves).toHaveLength(0)
  })
})
