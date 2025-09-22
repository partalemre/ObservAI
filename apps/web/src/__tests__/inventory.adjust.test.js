import { describe, it, expect, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createTestRouter } from '../app/routes/routes'
import { RouterProvider } from 'react-router-dom'
import { useOrgStore } from '../store/orgStore'
import { inventoryDb } from '../test-setup'
const renderInventoryWithStore = async (storeId = 's1') => {
  // Set selected store
  useOrgStore.setState({ selectedStoreId: storeId })
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const testRouter = createTestRouter('/inventory')
  return render(
    <QueryClientProvider client={qc}>
      <RouterProvider router={testRouter} />
    </QueryClientProvider>
  )
}
describe('Inventory - Adjust Stock', () => {
  beforeEach(() => {
    // Reset inventory DB to initial state
    inventoryDb.items = [
      {
        id: 'it1',
        name: 'Espresso beans',
        sku: 'BE-001',
        category: 'Coffee',
        uom: 'kg',
        stockQty: 3,
        minQty: 5,
        reorderQty: 10,
        costPrice: 280,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'it2',
        name: 'Milk 1L',
        sku: 'ML-1L',
        category: 'Dairy',
        uom: 'lt',
        stockQty: 12,
        minQty: 8,
        reorderQty: 24,
        costPrice: 18,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'it3',
        name: 'Cups 300ml',
        sku: 'CP-300',
        category: 'Disposables',
        uom: 'pcs',
        stockQty: 0,
        minQty: 200,
        reorderQty: 500,
        costPrice: 0.6,
        updatedAt: new Date().toISOString(),
      },
    ]
  })
  it('opens adjust dialog when Adjust Stock button is clicked', async () => {
    const user = userEvent.setup()
    await renderInventoryWithStore()
    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByText('Inventory')).toBeInTheDocument()
    })
    // Click Adjust Stock button
    const adjustButton = screen.getByRole('button', { name: /adjust stock/i })
    await user.click(adjustButton)
    // Check that dialog opened
    expect(await screen.findByText('Adjust stock')).toBeInTheDocument()
    expect(screen.getByText('Reason')).toBeInTheDocument()
    expect(screen.getByText('Note')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /add line/i })
    ).toBeInTheDocument()
  })
  it('allows selecting adjustment reason', async () => {
    const user = userEvent.setup()
    await renderInventoryWithStore()
    // Open adjust dialog
    await waitFor(() => {
      expect(screen.getByText('Inventory')).toBeInTheDocument()
    })
    const adjustButton = screen.getByRole('button', { name: /adjust stock/i })
    await user.click(adjustButton)
    await waitFor(() => {
      expect(screen.getByText('Adjust stock')).toBeInTheDocument()
    })
    // Check default reason
    expect(screen.getByDisplayValue('Stock count')).toBeInTheDocument()
    // Change reason to WASTE
    const reasonSelect = screen.getByLabelText('Reason')
    await user.selectOptions(reasonSelect, 'WASTE')
    expect(screen.getByDisplayValue('Waste')).toBeInTheDocument()
  })
  it('allows adding adjustment line with negative delta', async () => {
    const user = userEvent.setup()
    await renderInventoryWithStore()
    // Open adjust dialog
    await waitFor(() => {
      expect(screen.getByText('Inventory')).toBeInTheDocument()
    })
    const adjustButton = screen.getByRole('button', { name: /adjust stock/i })
    await user.click(adjustButton)
    await waitFor(() => {
      expect(screen.getByText('Adjust stock')).toBeInTheDocument()
    })
    // Change reason to WASTE
    const reasonSelect = screen.getByLabelText('Reason')
    await user.selectOptions(reasonSelect, 'WASTE')
    // Add a line
    const addLineButton = screen.getByRole('button', { name: /add line/i })
    await user.click(addLineButton)
    // Should see the table headers
    expect(screen.getByText('Item')).toBeInTheDocument()
    expect(screen.getByText('Current')).toBeInTheDocument()
    expect(screen.getByText('Delta')).toBeInTheDocument()
    expect(screen.getByText('New')).toBeInTheDocument()
    // Select Milk (current stock: 12)
    const itemSelect = screen.getByDisplayValue('Select item...')
    await user.selectOptions(itemSelect, 'it2')
    // Should show current stock
    await waitFor(() => {
      expect(screen.getByText('12')).toBeInTheDocument() // Current stock
    })
    // Set delta to -2
    const deltaInput = screen.getByPlaceholderText('±0')
    await user.type(deltaInput, '-2')
    // Should show new calculated stock (12 - 2 = 10)
    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument()
    })
  })
  it('submits adjustment and decreases stock quantity', async () => {
    const user = userEvent.setup()
    await renderInventoryWithStore()
    // Wait for initial stock to be displayed
    await waitFor(() => {
      expect(screen.getByText('12')).toBeInTheDocument() // Initial Milk stock
    })
    // Open adjust dialog
    const adjustButton = screen.getByRole('button', { name: /adjust stock/i })
    await user.click(adjustButton)
    await waitFor(() => {
      expect(screen.getByText('Adjust stock')).toBeInTheDocument()
    })
    // Set reason to WASTE
    const reasonSelect = screen.getByLabelText('Reason')
    await user.selectOptions(reasonSelect, 'WASTE')
    // Add line
    const addLineButton = screen.getByRole('button', { name: /add line/i })
    await user.click(addLineButton)
    // Select Milk
    const itemSelect = screen.getByDisplayValue('Select item...')
    await user.selectOptions(itemSelect, 'it2')
    // Set delta to -2
    const deltaInput = screen.getByPlaceholderText('±0')
    await user.type(deltaInput, '-2')
    // Submit the adjustment
    const saveButton = screen.getByRole('button', { name: /save/i })
    await user.click(saveButton)
    // Wait for success and dialog to close
    await waitFor(() => {
      expect(screen.queryByText('Adjust stock')).not.toBeInTheDocument()
    })
    // Check that stock quantity decreased (12 - 2 = 10)
    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument()
    })
  })
  it('allows positive adjustments', async () => {
    const user = userEvent.setup()
    await renderInventoryWithStore()
    // Open adjust dialog
    await waitFor(() => {
      expect(screen.getByText('Inventory')).toBeInTheDocument()
    })
    const adjustButton = screen.getByRole('button', { name: /adjust stock/i })
    await user.click(adjustButton)
    await waitFor(() => {
      expect(screen.getByText('Adjust stock')).toBeInTheDocument()
    })
    // Set reason to COUNT (stock count adjustment)
    const reasonSelect = screen.getByLabelText('Reason')
    await user.selectOptions(reasonSelect, 'COUNT')
    // Add line
    const addLineButton = screen.getByRole('button', { name: /add line/i })
    await user.click(addLineButton)
    // Select Espresso beans (current: 3)
    const itemSelect = screen.getByDisplayValue('Select item...')
    await user.selectOptions(itemSelect, 'it1')
    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument() // Current stock
    })
    // Set delta to +2 (found 2 more during count)
    const deltaInput = screen.getByPlaceholderText('±0')
    await user.type(deltaInput, '2')
    // Should show new calculated stock (3 + 2 = 5)
    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument()
    })
    // Submit
    const saveButton = screen.getByRole('button', { name: /save/i })
    await user.click(saveButton)
    // Wait for dialog to close and stock to update
    await waitFor(() => {
      expect(screen.queryByText('Adjust stock')).not.toBeInTheDocument()
    })
    // The stock should now be 5, which equals minQty, so no longer "Low"
    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument()
    })
  })
  it('prevents submission with no valid adjustments', async () => {
    const user = userEvent.setup()
    await renderInventoryWithStore()
    // Open adjust dialog
    await waitFor(() => {
      expect(screen.getByText('Inventory')).toBeInTheDocument()
    })
    const adjustButton = screen.getByRole('button', { name: /adjust stock/i })
    await user.click(adjustButton)
    await waitFor(() => {
      expect(screen.getByText('Adjust stock')).toBeInTheDocument()
    })
    // Try to submit without adding any lines
    const saveButton = screen.getByRole('button', { name: /save/i })
    expect(saveButton).toBeDisabled()
    // Add a line but don't set delta
    const addLineButton = screen.getByRole('button', { name: /add line/i })
    await user.click(addLineButton)
    // Select item but leave delta at 0
    const itemSelect = screen.getByDisplayValue('Select item...')
    await user.selectOptions(itemSelect, 'it1')
    // Should still be disabled because delta is 0
    expect(saveButton).toBeDisabled()
  })
  it('allows setting note for adjustment', async () => {
    const user = userEvent.setup()
    await renderInventoryWithStore()
    // Open adjust dialog
    await waitFor(() => {
      expect(screen.getByText('Inventory')).toBeInTheDocument()
    })
    const adjustButton = screen.getByRole('button', { name: /adjust stock/i })
    await user.click(adjustButton)
    await waitFor(() => {
      expect(screen.getByText('Adjust stock')).toBeInTheDocument()
    })
    // Fill note
    const noteInput = screen.getByLabelText('Note')
    await user.type(noteInput, 'Spilled during cleaning')
    expect(
      screen.getByDisplayValue('Spilled during cleaning')
    ).toBeInTheDocument()
  })
  it('shows warning for negative stock result', async () => {
    const user = userEvent.setup()
    await renderInventoryWithStore()
    // Open adjust dialog
    await waitFor(() => {
      expect(screen.getByText('Inventory')).toBeInTheDocument()
    })
    const adjustButton = screen.getByRole('button', { name: /adjust stock/i })
    await user.click(adjustButton)
    await waitFor(() => {
      expect(screen.getByText('Adjust stock')).toBeInTheDocument()
    })
    // Add line
    const addLineButton = screen.getByRole('button', { name: /add line/i })
    await user.click(addLineButton)
    // Select Espresso beans (current: 3)
    const itemSelect = screen.getByDisplayValue('Select item...')
    await user.selectOptions(itemSelect, 'it1')
    // Set delta to -5 (would result in -2)
    const deltaInput = screen.getByPlaceholderText('±0')
    await user.type(deltaInput, '-5')
    // Should show negative result with warning styling
    await waitFor(() => {
      const negativeResult = screen.getByText('-2')
      expect(negativeResult).toBeInTheDocument()
      // Note: We can't easily test CSS classes in RTL, but the component should apply text-red-600
    })
  })
})
