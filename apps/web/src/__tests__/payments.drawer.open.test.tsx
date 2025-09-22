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

describe('Cash Drawer Open Flow', () => {
  beforeEach(() => {
    // Reset cash drawer state
    cashDb.byStore.s1 = {
      state: { status: 'CLOSED', balance: 0 },
      moves: [],
    }

    // Set up org store
    useOrgStore.setState({ selectedStoreId: 's1' })
  })

  it('should show CLOSED badge initially and allow opening drawer', async () => {
    render(
      <TestWrapper>
        <CashDrawerBadge />
      </TestWrapper>
    )

    // Initially shows closed badge
    expect(screen.getByText('Drawer closed')).toBeInTheDocument()
    expect(screen.getByText('Open drawer')).toBeInTheDocument()

    // Click open drawer button
    fireEvent.click(screen.getByText('Open drawer'))

    // Should show open dialog
    await waitFor(() => {
      expect(screen.getByText('Open cash drawer')).toBeInTheDocument()
    })

    // Enter float amount and submit
    const floatInput = screen.getByLabelText('Opening float')
    fireEvent.change(floatInput, { target: { value: '500' } })

    const openButton = screen.getByRole('button', { name: 'Open drawer' })
    fireEvent.click(openButton)

    // Should show open badge and balance after successful opening
    await waitFor(() => {
      expect(screen.getByText('Drawer open')).toBeInTheDocument()
      expect(screen.getByText('500.00')).toBeInTheDocument()
    })

    // Should show cash in/out and end shift buttons
    expect(screen.getByText(/Cash in.*Cash out/)).toBeInTheDocument()
    expect(screen.getByText('End shift')).toBeInTheDocument()
  })

  it('should validate float amount input', async () => {
    render(
      <TestWrapper>
        <CashDrawerBadge />
      </TestWrapper>
    )

    // Click open drawer button
    fireEvent.click(screen.getByText('Open drawer'))

    await waitFor(() => {
      expect(screen.getByText('Open cash drawer')).toBeInTheDocument()
    })

    // Try to submit without amount
    const openButton = screen.getByRole('button', { name: 'Open drawer' })
    fireEvent.click(openButton)

    // Should still be in dialog (validation prevents submission)
    expect(screen.getByText('Open cash drawer')).toBeInTheDocument()

    // Enter invalid amount
    const floatInput = screen.getByLabelText('Opening float')
    fireEvent.change(floatInput, { target: { value: '-10' } })
    fireEvent.click(openButton)

    // Should still be in dialog
    expect(screen.getByText('Open cash drawer')).toBeInTheDocument()
  })
})
