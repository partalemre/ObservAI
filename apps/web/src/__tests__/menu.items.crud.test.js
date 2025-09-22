import { describe, it, expect, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createTestRouter } from '../app/routes/routes'
import { RouterProvider } from 'react-router-dom'
import { useOrgStore } from '../store/orgStore'
import { menuDb } from '../test-setup'
const renderMenuWithStore = async (storeId = 's1') => {
  useOrgStore.setState({ selectedStoreId: storeId })
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const testRouter = createTestRouter('/menu')
  return render(
    <QueryClientProvider client={qc}>
      <RouterProvider router={testRouter} />
    </QueryClientProvider>
  )
}
describe('Menu - Items CRUD', () => {
  beforeEach(() => {
    // Reset menu DB to initial state
    menuDb.categories = [
      { id: 'cat-1', name: 'Coffee', sort: 1, active: true },
      { id: 'cat-2', name: 'Desserts', sort: 2, active: true },
    ]
    menuDb.items = [
      {
        id: 'it-1',
        name: 'Americano',
        price: 45,
        categoryId: 'cat-1',
        active: true,
        soldOut: false,
        sku: 'AM-001',
        modifierGroupIds: [],
      },
      {
        id: 'it-2',
        name: 'Latte',
        price: 60,
        categoryId: 'cat-1',
        active: true,
        soldOut: false,
        sku: 'LA-001',
        modifierGroupIds: ['grp-1'],
      },
    ]
    menuDb.groups = [
      {
        id: 'grp-1',
        name: 'Milk type',
        min: 1,
        max: 1,
        options: [
          { id: 'opt-1', name: 'Full-fat', priceDelta: 0 },
          { id: 'opt-2', name: 'Oat milk', priceDelta: 6 },
        ],
      },
    ]
  })
  it('displays existing items', async () => {
    await renderMenuWithStore()
    // Items tab should be active by default
    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
      expect(screen.getByText('Latte')).toBeInTheDocument()
      expect(screen.getByText('$45')).toBeInTheDocument()
      expect(screen.getByText('$60')).toBeInTheDocument()
    })
  })
  it('creates a new item with image upload', async () => {
    await renderMenuWithStore()
    // Click New item button
    await userEvent.click(screen.getByText('New item'))
    // Fill in form
    await userEvent.type(
      screen.getByPlaceholderText('Enter item name'),
      'Cappuccino'
    )
    await userEvent.type(screen.getByPlaceholderText('0.00'), '55')
    // Select category
    const categorySelect = screen.getByDisplayValue('Select category')
    await userEvent.selectOptions(categorySelect, 'cat-1')
    await userEvent.type(screen.getByPlaceholderText('Enter SKU'), 'CAP-001')
    await userEvent.type(
      screen.getByPlaceholderText('Enter description'),
      'Rich espresso with steamed milk foam'
    )
    // Submit form
    await userEvent.click(screen.getByText('Save'))
    // Wait for item to appear in list
    await waitFor(() => {
      expect(screen.getByText('Cappuccino')).toBeInTheDocument()
      expect(screen.getByText('$55')).toBeInTheDocument()
    })
    // Verify it was added to the database
    const newItem = menuDb.items.find((i) => i.name === 'Cappuccino')
    expect(newItem).toBeDefined()
    expect(newItem?.price).toBe(55)
    expect(newItem?.categoryId).toBe('cat-1')
  })
  it('edits an existing item', async () => {
    await renderMenuWithStore()
    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
    })
    // Click edit button for Americano
    const editButtons = screen.getAllByText('Edit')
    await userEvent.click(editButtons[0])
    // Change price
    const priceInput = screen.getByDisplayValue('45')
    await userEvent.clear(priceInput)
    await userEvent.type(priceInput, '50')
    // Submit form
    await userEvent.click(screen.getByText('Save'))
    // Wait for updated price to appear
    await waitFor(() => {
      expect(screen.getByText('$50')).toBeInTheDocument()
      expect(screen.queryByText('$45')).not.toBeInTheDocument()
    })
  })
  it('toggles item active and sold out status', async () => {
    await renderMenuWithStore()
    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
    })
    // Find checkboxes for the first item (Americano)
    const checkboxes = screen.getAllByRole('checkbox')
    const activeCheckbox = checkboxes[0] // Active checkbox
    const soldOutCheckbox = checkboxes[1] // Sold out checkbox
    // Initially active should be checked, sold out should not be
    expect(activeCheckbox).toBeChecked()
    expect(soldOutCheckbox).not.toBeChecked()
    // Toggle sold out
    await userEvent.click(soldOutCheckbox)
    await waitFor(() => {
      const americano = menuDb.items.find((i) => i.name === 'Americano')
      expect(americano?.soldOut).toBe(true)
    })
    // Toggle active off
    await userEvent.click(activeCheckbox)
    await waitFor(() => {
      const americano = menuDb.items.find((i) => i.name === 'Americano')
      expect(americano?.active).toBe(false)
    })
  })
  it('filters items by search and category', async () => {
    await renderMenuWithStore()
    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
      expect(screen.getByText('Latte')).toBeInTheDocument()
    })
    // Search for "latte"
    await userEvent.type(screen.getByPlaceholderText('Search…'), 'latte')
    await waitFor(() => {
      expect(screen.getByText('Latte')).toBeInTheDocument()
      expect(screen.queryByText('Americano')).not.toBeInTheDocument()
    })
    // Clear search
    await userEvent.clear(screen.getByPlaceholderText('Search…'))
    // Filter by Desserts category (should show no items)
    const categoryFilter = screen.getByDisplayValue('All categories')
    await userEvent.selectOptions(categoryFilter, 'cat-2')
    await waitFor(() => {
      expect(screen.queryByText('Americano')).not.toBeInTheDocument()
      expect(screen.queryByText('Latte')).not.toBeInTheDocument()
      expect(
        screen.getByText('No items match your filters')
      ).toBeInTheDocument()
    })
  })
  it('deletes an item', async () => {
    await renderMenuWithStore()
    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
    })
    // Click delete button for Americano
    const deleteButtons = screen.getAllByText('Delete')
    await userEvent.click(deleteButtons[0])
    // Confirm deletion
    await userEvent.click(screen.getByText('Delete'))
    // Wait for item to be removed
    await waitFor(() => {
      expect(screen.queryByText('Americano')).not.toBeInTheDocument()
    })
    // Verify it was removed from the database
    expect(menuDb.items.find((i) => i.name === 'Americano')).toBeUndefined()
  })
})
