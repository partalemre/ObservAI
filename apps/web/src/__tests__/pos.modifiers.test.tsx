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

describe('POS - Modifiers', () => {
  beforeEach(() => {
    // Clear POS store
    usePOS.getState().clear()
  })

  it('opens modifier dialog for items with modifiers', async () => {
    const user = userEvent.setup()
    await renderPOSWithStore()

    // Wait for products to load and click Latte (has modifiers)
    const latteButton = await screen.findByRole('button', { name: /latte/i })
    await user.click(latteButton)

    // Check modifier dialog opened
    await waitFor(() => {
      expect(screen.getByText('Latte')).toBeInTheDocument()
      expect(screen.getByText('Choose options')).toBeInTheDocument()
      expect(screen.getByText('Milk type')).toBeInTheDocument()
    })

    // Check modifier options
    expect(screen.getByText('Full-fat')).toBeInTheDocument()
    expect(screen.getByText('Oat milk')).toBeInTheDocument()
    expect(screen.getByText('+TRY 6.00')).toBeInTheDocument() // Oat milk price delta
  })

  it('requires minimum selections before allowing add to cart', async () => {
    const user = userEvent.setup()
    await renderPOSWithStore()

    // Click Latte to open modifier dialog
    const latteButton = await screen.findByRole('button', { name: /latte/i })
    await user.click(latteButton)

    // Wait for dialog
    await waitFor(() => {
      expect(screen.getByText('Choose options')).toBeInTheDocument()
    })

    // Check Add button is disabled (no selection yet)
    const addButton = screen.getByRole('button', { name: /add try/i })
    expect(addButton).toBeDisabled()

    // Select Full-fat milk
    const fullFatOption = screen.getByRole('button', { name: /full-fat/i })
    await user.click(fullFatOption)

    // Check Add button is now enabled
    await waitFor(() => {
      expect(addButton).not.toBeDisabled()
    })

    // Check price calculation (60 + 0 = 60)
    expect(screen.getByText(/add try 60\.00/i)).toBeInTheDocument()
  })

  it('adds item with modifiers to cart', async () => {
    const user = userEvent.setup()
    await renderPOSWithStore()

    // Click Latte to open modifier dialog
    const latteButton = await screen.findByRole('button', { name: /latte/i })
    await user.click(latteButton)

    // Wait for dialog and select Oat milk
    await waitFor(() => {
      expect(screen.getByText('Choose options')).toBeInTheDocument()
    })

    const oatMilkOption = screen.getByRole('button', { name: /oat milk/i })
    await user.click(oatMilkOption)

    // Check price updated (60 + 6 = 66)
    await waitFor(() => {
      expect(screen.getByText(/add try 66\.00/i)).toBeInTheDocument()
    })

    // Add to cart
    const addButton = screen.getByRole('button', { name: /add try 66\.00/i })
    await user.click(addButton)

    // Check item added to cart with modifiers
    await waitFor(() => {
      expect(screen.getByText('Latte')).toBeInTheDocument()
      expect(screen.getByText('+ Oat milk (+TRY 6.00)')).toBeInTheDocument()
      expect(screen.getByText('TRY 66.00 each')).toBeInTheDocument()
    })

    // Check total
    expect(screen.getByText('TRY 66.00')).toBeInTheDocument()
  })

  it('handles quantity in modifier dialog', async () => {
    const user = userEvent.setup()
    await renderPOSWithStore()

    // Click Latte to open modifier dialog
    const latteButton = await screen.findByRole('button', { name: /latte/i })
    await user.click(latteButton)

    // Wait for dialog and select modifier
    await waitFor(() => {
      expect(screen.getByText('Choose options')).toBeInTheDocument()
    })

    const fullFatOption = screen.getByRole('button', { name: /full-fat/i })
    await user.click(fullFatOption)

    // Increase quantity to 2
    const quantityPlusButton = screen.getAllByText('+')[1] // Second + button is for quantity
    await user.click(quantityPlusButton)

    // Check price updated for quantity (60 * 2 = 120)
    await waitFor(() => {
      expect(screen.getByText(/add try 120\.00/i)).toBeInTheDocument()
    })

    // Add to cart
    const addButton = screen.getByRole('button', { name: /add try 120\.00/i })
    await user.click(addButton)

    // Check cart has correct quantity and total
    await waitFor(() => {
      expect(screen.getByText('Latte')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument() // Quantity in stepper
      expect(screen.getByText('TRY 120.00')).toBeInTheDocument() // Total
    })
  })

  it('closes modifier dialog on cancel', async () => {
    const user = userEvent.setup()
    await renderPOSWithStore()

    // Click Latte to open modifier dialog
    const latteButton = await screen.findByRole('button', { name: /latte/i })
    await user.click(latteButton)

    // Wait for dialog
    await waitFor(() => {
      expect(screen.getByText('Choose options')).toBeInTheDocument()
    })

    // Click cancel
    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    // Check dialog closed
    await waitFor(() => {
      expect(screen.queryByText('Choose options')).not.toBeInTheDocument()
    })

    // Check nothing added to cart
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
  })
})
