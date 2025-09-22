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
describe('Inventory - Receive Stock', () => {
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
  it('opens receive dialog when Receive Stock button is clicked', async () => {
    const user = userEvent.setup()
    await renderInventoryWithStore()
    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByText('Inventory')).toBeInTheDocument()
    })
    // Click Receive Stock button
    const receiveButton = screen.getByRole('button', { name: /receive stock/i })
    await user.click(receiveButton)
    // Check that dialog opened
    expect(await screen.findByText('Receive stock')).toBeInTheDocument()
    expect(screen.getByText('Supplier')).toBeInTheDocument()
    expect(screen.getByText('Note')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /add line/i })
    ).toBeInTheDocument()
  })
  it('allows adding a line and selecting an item with quantity', async () => {
    const user = userEvent.setup()
    await renderInventoryWithStore()
    // Wait for page to load and open dialog
    await waitFor(() => {
      expect(screen.getByText('Inventory')).toBeInTheDocument()
    })
    const receiveButton = screen.getByRole('button', { name: /receive stock/i })
    await user.click(receiveButton)
    // Wait for dialog to open
    await waitFor(() => {
      expect(screen.getByText('Receive stock')).toBeInTheDocument()
    })
    // Add a line
    const addLineButton = screen.getByRole('button', { name: /add line/i })
    await user.click(addLineButton)
    // Should see the table with empty line
    expect(screen.getByText('Item')).toBeInTheDocument()
    expect(screen.getByText('Qty')).toBeInTheDocument()
    expect(screen.getByText('Unit cost')).toBeInTheDocument()
    // Select an item
    const itemSelect = screen.getByDisplayValue('Select item...')
    await user.selectOptions(itemSelect, 'it1')
    // Should show the selected item
    await waitFor(() => {
      const selectedOption = screen.getByDisplayValue('Espresso beans (BE-001)')
      expect(selectedOption).toBeInTheDocument()
    })
    // Change quantity
    const qtyInput = screen.getByDisplayValue('1')
    await user.clear(qtyInput)
    await user.type(qtyInput, '5')
    expect(screen.getByDisplayValue('5')).toBeInTheDocument()
  })
  it('submits receive and increases stock quantity', async () => {
    const user = userEvent.setup()
    await renderInventoryWithStore()
    // Wait for initial stock to be displayed
    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument() // Initial Espresso beans stock
    })
    // Open receive dialog
    const receiveButton = screen.getByRole('button', { name: /receive stock/i })
    await user.click(receiveButton)
    await waitFor(() => {
      expect(screen.getByText('Receive stock')).toBeInTheDocument()
    })
    // Add line
    const addLineButton = screen.getByRole('button', { name: /add line/i })
    await user.click(addLineButton)
    // Select Espresso beans
    const itemSelect = screen.getByDisplayValue('Select item...')
    await user.selectOptions(itemSelect, 'it1')
    // Set quantity to 5
    const qtyInput = screen.getByDisplayValue('1')
    await user.clear(qtyInput)
    await user.type(qtyInput, '5')
    // Submit the receive
    const saveButton = screen.getByRole('button', { name: /save/i })
    await user.click(saveButton)
    // Wait for success and dialog to close
    await waitFor(() => {
      expect(screen.queryByText('Receive stock')).not.toBeInTheDocument()
    })
    // Check that stock quantity increased (3 + 5 = 8)
    await waitFor(() => {
      expect(screen.getByText('8')).toBeInTheDocument()
    })
    // Verify the item is no longer showing as low stock
    expect(screen.queryByText('Low')).not.toBeInTheDocument()
  })
  it('allows setting supplier and note information', async () => {
    const user = userEvent.setup()
    await renderInventoryWithStore()
    // Open receive dialog
    await waitFor(() => {
      expect(screen.getByText('Inventory')).toBeInTheDocument()
    })
    const receiveButton = screen.getByRole('button', { name: /receive stock/i })
    await user.click(receiveButton)
    await waitFor(() => {
      expect(screen.getByText('Receive stock')).toBeInTheDocument()
    })
    // Fill supplier and note
    const supplierInput = screen.getByLabelText('Supplier')
    await user.type(supplierInput, 'Coffee Roasters Inc')
    const noteInput = screen.getByLabelText('Note')
    await user.type(noteInput, 'Weekly delivery')
    expect(screen.getByDisplayValue('Coffee Roasters Inc')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Weekly delivery')).toBeInTheDocument()
    // Add a line and submit
    const addLineButton = screen.getByRole('button', { name: /add line/i })
    await user.click(addLineButton)
    const itemSelect = screen.getByDisplayValue('Select item...')
    await user.selectOptions(itemSelect, 'it1')
    const saveButton = screen.getByRole('button', { name: /save/i })
    await user.click(saveButton)
    // Should close successfully
    await waitFor(() => {
      expect(screen.queryByText('Receive stock')).not.toBeInTheDocument()
    })
  })
  it('allows setting unit cost and calculates total', async () => {
    const user = userEvent.setup()
    await renderInventoryWithStore()
    // Open receive dialog
    await waitFor(() => {
      expect(screen.getByText('Inventory')).toBeInTheDocument()
    })
    const receiveButton = screen.getByRole('button', { name: /receive stock/i })
    await user.click(receiveButton)
    await waitFor(() => {
      expect(screen.getByText('Receive stock')).toBeInTheDocument()
    })
    // Add line
    const addLineButton = screen.getByRole('button', { name: /add line/i })
    await user.click(addLineButton)
    // Select item
    const itemSelect = screen.getByDisplayValue('Select item...')
    await user.selectOptions(itemSelect, 'it1')
    // Set quantity to 2
    const qtyInput = screen.getByDisplayValue('1')
    await user.clear(qtyInput)
    await user.type(qtyInput, '2')
    // Set unit cost to 300
    const costInput = screen.getByPlaceholderText('0.00')
    await user.type(costInput, '300')
    // Should calculate total (2 * 300 = 600)
    await waitFor(() => {
      expect(screen.getByText('600.00')).toBeInTheDocument()
    })
  })
  it('prevents submission with empty lines', async () => {
    const user = userEvent.setup()
    await renderInventoryWithStore()
    // Open receive dialog
    await waitFor(() => {
      expect(screen.getByText('Inventory')).toBeInTheDocument()
    })
    const receiveButton = screen.getByRole('button', { name: /receive stock/i })
    await user.click(receiveButton)
    await waitFor(() => {
      expect(screen.getByText('Receive stock')).toBeInTheDocument()
    })
    // Try to submit without adding any lines
    const saveButton = screen.getByRole('button', { name: /save/i })
    expect(saveButton).toBeDisabled()
  })
  it('allows removing lines', async () => {
    const user = userEvent.setup()
    await renderInventoryWithStore()
    // Open receive dialog
    await waitFor(() => {
      expect(screen.getByText('Inventory')).toBeInTheDocument()
    })
    const receiveButton = screen.getByRole('button', { name: /receive stock/i })
    await user.click(receiveButton)
    await waitFor(() => {
      expect(screen.getByText('Receive stock')).toBeInTheDocument()
    })
    // Add two lines
    const addLineButton = screen.getByRole('button', { name: /add line/i })
    await user.click(addLineButton)
    await user.click(addLineButton)
    // Should have 2 rows in the table
    const tableRows = screen.getAllByRole('row')
    expect(tableRows.length).toBe(3) // header + 2 data rows
    // Remove one line
    const removeButtons = screen.getAllByRole('button', { name: '' }) // Trash icon buttons
    const trashButton = removeButtons.find((btn) => btn.querySelector('svg')) // Find button with icon
    if (trashButton) {
      await user.click(trashButton)
    }
    // Should now have 1 row
    await waitFor(() => {
      const updatedRows = screen.getAllByRole('row')
      expect(updatedRows.length).toBe(2) // header + 1 data row
    })
  })
})
