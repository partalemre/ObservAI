import { describe, it, expect, beforeEach, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createTestRouter } from '../app/routes/routes'
import { RouterProvider } from 'react-router-dom'
import { useOrgStore } from '../store/orgStore'
import { usePOS } from '../store/posStore'
// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))
const renderPOSWithStore = async (storeId = 's1') => {
  // Set selected store
  useOrgStore.setState({ selectedStoreId: storeId })
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const testRouter = createTestRouter('/pos')
  return render(
    <QueryClientProvider client={qc}>
      <RouterProvider router={testRouter} />
    </QueryClientProvider>
  )
}
describe('POS - Checkout', () => {
  beforeEach(() => {
    // Clear POS store
    usePOS.getState().clear()
    // Clear mock calls
    vi.clearAllMocks()
  })
  it('opens checkout dialog when cart has items', async () => {
    const user = userEvent.setup()
    await renderPOSWithStore()
    // Add item to cart first
    const americanoButton = await screen.findByRole('button', {
      name: /americano/i,
    })
    await user.click(americanoButton)
    // Wait for item in cart
    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
    })
    // Click checkout button
    const checkoutButton = screen.getByRole('button', { name: /checkout/i })
    await user.click(checkoutButton)
    // Check checkout dialog opened
    await waitFor(() => {
      expect(screen.getByText('Checkout')).toBeInTheDocument()
      expect(screen.getByText('TRY 45.00')).toBeInTheDocument() // Total
    })
  })
  it('completes cash payment with correct change', async () => {
    const user = userEvent.setup()
    await renderPOSWithStore()
    // Add item to cart
    const americanoButton = await screen.findByRole('button', {
      name: /americano/i,
    })
    await user.click(americanoButton)
    // Open checkout
    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
    })
    const checkoutButton = screen.getByRole('button', { name: /checkout/i })
    await user.click(checkoutButton)
    // Wait for checkout dialog
    await waitFor(() => {
      expect(screen.getByText('Checkout')).toBeInTheDocument()
    })
    // Cash is selected by default, enter cash given
    const cashInput = screen.getByLabelText(/cash given/i)
    await user.type(cashInput, '50')
    // Check change calculated
    await waitFor(() => {
      expect(screen.getByText('TRY 5.00')).toBeInTheDocument() // Change: 50 - 45 = 5
    })
    // Complete sale
    const completeButton = screen.getByRole('button', {
      name: /complete sale/i,
    })
    await user.click(completeButton)
    // Check order submitted and cart cleared
    await waitFor(() => {
      expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
    })
    // Check success toast was called
    const { toast } = require('react-hot-toast')
    expect(toast.success).toHaveBeenCalledWith('Order completed #ORD-1001')
  })
  it('handles card payment', async () => {
    const user = userEvent.setup()
    await renderPOSWithStore()
    // Add item to cart
    const americanoButton = await screen.findByRole('button', {
      name: /americano/i,
    })
    await user.click(americanoButton)
    // Open checkout
    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
    })
    const checkoutButton = screen.getByRole('button', { name: /checkout/i })
    await user.click(checkoutButton)
    // Wait for checkout dialog
    await waitFor(() => {
      expect(screen.getByText('Checkout')).toBeInTheDocument()
    })
    // Select card payment
    const cardButton = screen.getByRole('button', { name: /card/i })
    await user.click(cardButton)
    // Check cash input is hidden
    expect(screen.queryByLabelText(/cash given/i)).not.toBeInTheDocument()
    // Complete sale (should be enabled immediately for card)
    const completeButton = screen.getByRole('button', {
      name: /complete sale/i,
    })
    expect(completeButton).not.toBeDisabled()
    await user.click(completeButton)
    // Check order submitted and cart cleared
    await waitFor(() => {
      expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
    })
  })
  it('uses quick cash buttons', async () => {
    const user = userEvent.setup()
    await renderPOSWithStore()
    // Add item to cart
    const americanoButton = await screen.findByRole('button', {
      name: /americano/i,
    })
    await user.click(americanoButton)
    // Open checkout
    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
    })
    const checkoutButton = screen.getByRole('button', { name: /checkout/i })
    await user.click(checkoutButton)
    // Wait for checkout dialog
    await waitFor(() => {
      expect(screen.getByText('Checkout')).toBeInTheDocument()
    })
    // Click 50 TRY quick button
    const fiftyButton = screen.getByRole('button', { name: /50 try/i })
    await user.click(fiftyButton)
    // Check cash input filled
    const cashInput = screen.getByLabelText(/cash given/i)
    expect(cashInput).toHaveValue('50')
    // Check change shown
    await waitFor(() => {
      expect(screen.getByText('TRY 5.00')).toBeInTheDocument() // Change
    })
  })
  it('prevents checkout with insufficient cash', async () => {
    const user = userEvent.setup()
    await renderPOSWithStore()
    // Add item to cart
    const americanoButton = await screen.findByRole('button', {
      name: /americano/i,
    })
    await user.click(americanoButton)
    // Open checkout
    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
    })
    const checkoutButton = screen.getByRole('button', { name: /checkout/i })
    await user.click(checkoutButton)
    // Wait for checkout dialog
    await waitFor(() => {
      expect(screen.getByText('Checkout')).toBeInTheDocument()
    })
    // Enter insufficient cash
    const cashInput = screen.getByLabelText(/cash given/i)
    await user.type(cashInput, '40') // Less than 45
    // Check complete button is disabled
    const completeButton = screen.getByRole('button', {
      name: /complete sale/i,
    })
    expect(completeButton).toBeDisabled()
  })
  it('closes checkout dialog on cancel', async () => {
    const user = userEvent.setup()
    await renderPOSWithStore()
    // Add item to cart
    const americanoButton = await screen.findByRole('button', {
      name: /americano/i,
    })
    await user.click(americanoButton)
    // Open checkout
    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
    })
    const checkoutButton = screen.getByRole('button', { name: /checkout/i })
    await user.click(checkoutButton)
    // Wait for checkout dialog
    await waitFor(() => {
      expect(screen.getByText('Checkout')).toBeInTheDocument()
    })
    // Click cancel
    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)
    // Check dialog closed and cart still has items
    await waitFor(() => {
      expect(screen.queryByText('Checkout')).not.toBeInTheDocument()
    })
    expect(screen.getByText('Americano')).toBeInTheDocument()
  })
})
