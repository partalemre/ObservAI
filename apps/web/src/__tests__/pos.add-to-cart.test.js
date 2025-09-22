import { describe, it, expect, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createTestRouter } from '../app/routes/routes'
import { RouterProvider } from 'react-router-dom'
import { useOrgStore } from '../store/orgStore'
import { usePOS } from '../store/posStore'
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
describe('POS - Add to Cart', () => {
  beforeEach(() => {
    // Clear POS store
    usePOS.getState().clear()
  })
  it('displays products from catalog', async () => {
    await renderPOSWithStore()
    // Wait for products to load
    expect(await screen.findByText('Americano')).toBeInTheDocument()
    expect(screen.getByText('Latte')).toBeInTheDocument()
    expect(screen.getByText('Cheesecake')).toBeInTheDocument()
    // Check prices
    expect(screen.getByText('TRY 45.00')).toBeInTheDocument() // Americano
    expect(screen.getByText('TRY 60.00')).toBeInTheDocument() // Latte
    expect(screen.getByText('TRY 80.00')).toBeInTheDocument() // Cheesecake
  })
  it('adds simple item to cart when clicked', async () => {
    const user = userEvent.setup()
    await renderPOSWithStore()
    // Wait for products to load
    const americanoButton = await screen.findByRole('button', {
      name: /americano/i,
    })
    // Click product
    await user.click(americanoButton)
    // Check cart
    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
      expect(screen.getByText('TRY 45.00 each')).toBeInTheDocument()
    })
    // Check subtotal
    expect(screen.getByText('TRY 45.00')).toBeInTheDocument()
  })
  it('updates quantity with stepper', async () => {
    const user = userEvent.setup()
    await renderPOSWithStore()
    // Add item first
    const americanoButton = await screen.findByRole('button', {
      name: /americano/i,
    })
    await user.click(americanoButton)
    // Find quantity stepper in cart
    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
    })
    const plusButton = screen.getByRole('button', { name: /plus/i })
    await user.click(plusButton)
    // Check quantity increased
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument()
    })
    // Check total updated (45 * 2 = 90)
    expect(screen.getByText('TRY 90.00')).toBeInTheDocument()
  })
  it('removes item from cart', async () => {
    const user = userEvent.setup()
    await renderPOSWithStore()
    // Add item first
    const americanoButton = await screen.findByRole('button', {
      name: /americano/i,
    })
    await user.click(americanoButton)
    // Wait for item in cart
    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
    })
    // Find and click remove button (trash icon)
    const removeButton = screen.getByRole('button', { name: /trash/i })
    await user.click(removeButton)
    // Check item removed
    await waitFor(() => {
      expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
    })
  })
  it('clears entire cart', async () => {
    const user = userEvent.setup()
    await renderPOSWithStore()
    // Add multiple items
    const americanoButton = await screen.findByRole('button', {
      name: /americano/i,
    })
    await user.click(americanoButton)
    const cheesecakeButton = screen.getByRole('button', { name: /cheesecake/i })
    await user.click(cheesecakeButton)
    // Wait for items in cart
    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
      expect(screen.getByText('Cheesecake')).toBeInTheDocument()
    })
    // Click clear button
    const clearButton = screen.getByRole('button', { name: /clear/i })
    await user.click(clearButton)
    // Check cart cleared
    await waitFor(() => {
      expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
    })
  })
})
