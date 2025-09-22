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

describe('POS - Persistence', () => {
  beforeEach(() => {
    // Clear POS store and localStorage
    usePOS.getState().clear()
    localStorage.clear()
  })

  it('persists cart items in localStorage', async () => {
    const user = userEvent.setup()

    // First render - add item
    const { unmount } = await renderPOSWithStore()

    const americanoButton = await screen.findByRole('button', {
      name: /americano/i,
    })
    await user.click(americanoButton)

    // Verify item added
    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
      expect(screen.getByText('TRY 45.00 each')).toBeInTheDocument()
    })

    // Unmount component
    unmount()

    // Second render - check persistence
    await renderPOSWithStore()

    // Item should still be in cart
    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
      expect(screen.getByText('TRY 45.00 each')).toBeInTheDocument()
      expect(screen.getByText('TRY 45.00')).toBeInTheDocument() // Total
    })
  })

  it('persists multiple items with different quantities', async () => {
    const user = userEvent.setup()

    // First render - add multiple items
    const { unmount } = await renderPOSWithStore()

    // Add Americano twice
    const americanoButton = await screen.findByRole('button', {
      name: /americano/i,
    })
    await user.click(americanoButton)

    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
    })

    // Increase quantity
    const plusButton = screen.getByRole('button', { name: /plus/i })
    await user.click(plusButton)

    // Add Cheesecake
    const cheesecakeButton = screen.getByRole('button', { name: /cheesecake/i })
    await user.click(cheesecakeButton)

    // Verify cart state
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument() // Americano quantity
      expect(screen.getByText('Cheesecake')).toBeInTheDocument()
      expect(screen.getByText('TRY 170.00')).toBeInTheDocument() // Total: (45*2) + 80
    })

    // Unmount
    unmount()

    // Second render - check persistence
    await renderPOSWithStore()

    // Both items should be restored
    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
      expect(screen.getByText('Cheesecake')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument() // Americano quantity
      expect(screen.getByText('TRY 170.00')).toBeInTheDocument() // Total
    })
  })

  it('persists items with modifiers', async () => {
    const user = userEvent.setup()

    // First render - add item with modifiers
    const { unmount } = await renderPOSWithStore()

    // Click Latte (has modifiers)
    const latteButton = await screen.findByRole('button', { name: /latte/i })
    await user.click(latteButton)

    // Select modifier and add to cart
    await waitFor(() => {
      expect(screen.getByText('Choose options')).toBeInTheDocument()
    })

    const oatMilkOption = screen.getByRole('button', { name: /oat milk/i })
    await user.click(oatMilkOption)

    const addButton = await screen.findByRole('button', {
      name: /add try 66\.00/i,
    })
    await user.click(addButton)

    // Verify item with modifier added
    await waitFor(() => {
      expect(screen.getByText('Latte')).toBeInTheDocument()
      expect(screen.getByText('+ Oat milk (+TRY 6.00)')).toBeInTheDocument()
      expect(screen.getByText('TRY 66.00')).toBeInTheDocument()
    })

    // Unmount
    unmount()

    // Second render - check persistence
    await renderPOSWithStore()

    // Item with modifiers should be restored
    await waitFor(() => {
      expect(screen.getByText('Latte')).toBeInTheDocument()
      expect(screen.getByText('+ Oat milk (+TRY 6.00)')).toBeInTheDocument()
      expect(screen.getByText('TRY 66.00 each')).toBeInTheDocument()
      expect(screen.getByText('TRY 66.00')).toBeInTheDocument() // Total
    })
  })

  it('clears persistence when cart is manually cleared', async () => {
    const user = userEvent.setup()

    // Add item
    const { unmount } = await renderPOSWithStore()

    const americanoButton = await screen.findByRole('button', {
      name: /americano/i,
    })
    await user.click(americanoButton)

    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
    })

    // Clear cart
    const clearButton = screen.getByRole('button', { name: /clear/i })
    await user.click(clearButton)

    await waitFor(() => {
      expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
    })

    // Unmount and remount
    unmount()
    await renderPOSWithStore()

    // Cart should remain empty
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
  })

  it('handles localStorage corruption gracefully', async () => {
    // Corrupt localStorage data
    localStorage.setItem('observai-pos', 'invalid-json')

    // Should render without crashing
    await renderPOSWithStore()

    // Should show empty cart
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
  })
})
